-- Migration: Create todos table with real-time support
-- Description: Creates todos table with proper RLS policies and real-time features
-- Story: US-TODO-002 - Real-time Todo Creation

-- Create todos table
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 500),
  description text,
  completed boolean DEFAULT false NOT NULL,
  category_id uuid NULL, -- For future category feature
  due_date timestamp with time zone NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX idx_todos_completed ON todos(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own todos
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- Enable real-time subscriptions
ALTER TABLE todos REPLICA IDENTITY FULL;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to authenticated users
GRANT ALL ON TABLE todos TO authenticated;
GRANT USAGE ON SEQUENCE todos_id_seq TO authenticated;

-- Comments for documentation
COMMENT ON TABLE todos IS 'User todos with real-time synchronization support';
COMMENT ON COLUMN todos.id IS 'Primary key, auto-generated UUID';
COMMENT ON COLUMN todos.user_id IS 'Reference to auth.users, with CASCADE DELETE';
COMMENT ON COLUMN todos.title IS 'Todo text content, 1-500 characters';
COMMENT ON COLUMN todos.completed IS 'Completion status, defaults to false';
COMMENT ON COLUMN todos.category_id IS 'Future feature: todo categories';
COMMENT ON COLUMN todos.due_date IS 'Future feature: due date scheduling';
COMMENT ON COLUMN todos.created_at IS 'Timestamp of todo creation (UTC)';
COMMENT ON COLUMN todos.updated_at IS 'Timestamp of last update (UTC), auto-updated';