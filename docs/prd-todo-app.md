# Product Requirements Document (PRD)
# YouTube Todo App - Basit Versiyon

**Versiyon:** 2.0  
**Tarih:** 2025-08-20  
**Product Manager:** AI Product Manager Agent  
**Proje Hedefi:** YouTube tutorial için minimal MVP todo app

---

## 1. Proje Özeti

### 1.1 YouTube Tutorial Hedefi
Bu proje **YouTube videosu için eğitim amaçlı** geliştirilecek modern todo uygulamasıdır. Amacımız izleyicilere:
- React + TypeScript temellerini öğretmek
- Supabase ile modern backend entegrasyonu
- Real-time authentication ve database işlemleri
- Production-ready development workflow

### 1.2 Referans Tasarım
Uygulama tasarımı `/todoAppExampleDesing.png` dosyasındaki minimal tasarımı takip edecek:
- "Your To Do" başlığı
- "Add new task" input alanı + "+" butonu
- Task listesi (checkbox + text + X silme butonu)
- Çok temiz, minimal arayüz

### 1.3 Video Süresi Kısıtı
- **Video hedefi:** 30-45 dakika
- **Development süresi:** 1-2 hafta max
- **Complexity:** Beginner-friendly

---

## 2. Minimal MVP Özellikler

### 2.1 Auth Sistemi (Supabase)
- **Login:** Email + password via Supabase Auth
- **Register:** Email + password + name via Supabase Auth
- **Logout:** Supabase session management
- **Storage:** Supabase Auth otomatik session yönetimi
- **Security:** Built-in email verification (optional)
- **Real-time:** User state changes instantly sync

### 2.2 Todo Yönetimi (Supabase Database)
- **Add:** Input alanından todo ekleme → Supabase Database
- **Complete:** Checkbox ile işaretleme → Real-time update
- **Delete:** X butonu ile silme → Instant database sync
- **Persist:** Supabase PostgreSQL database
- **Real-time:** Changes sync across all devices instantly
- **Offline:** Basic offline support with sync when online

### 2.3 UI (Minimal)
- **Responsive:** Mobil + desktop
- **Clean:** Tasarım referansına uygun
- **Simple:** Karmaşık animasyon yok

---

## 3. Teknik Gereksinimler

### 3.1 Tech Stack (Modern & Production-Ready)

#### Backend (Supabase)
- **Supabase Auth** - Authentication & user management
- **Supabase Database** - PostgreSQL database
- **Supabase Real-time** - Live data synchronization
- **Row Level Security** - Database güvenliği

#### Frontend Options (Seç Birini)
**Option 1: Vite + React (Recommended)**
- Vite + React 18 + TypeScript
- En hızlı development experience
- Modern build tool

**Option 2: Next.js**
- Next.js 14 + TypeScript
- Full-stack capabilities
- SEO-friendly

**Option 3: Create React App**
- CRA + TypeScript
- Beginner-friendly setup
- Zero configuration

#### Styling & UI
- **Tailwind CSS** - Utility-first CSS
- **Lucide Icons** - Modern icon library
- **Radix UI** (optional) - Accessible components

### 3.2 Proje Yapısı (Supabase Entegreli)
```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthForm.tsx        # Login & Register combined
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── Todo/
│   │   ├── TodoForm.tsx        # Add todo form
│   │   ├── TodoList.tsx        # Todo list display
│   │   └── TodoItem.tsx        # Individual todo item
│   └── Layout/
│       ├── Header.tsx          # App header with logout
│       └── Layout.tsx          # Main layout wrapper
├── hooks/
│   ├── useAuth.ts              # Supabase auth hooks
│   ├── useTodos.ts             # Supabase data hooks
│   └── useRealtime.ts          # Real-time subscriptions
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   └── database.types.ts       # Generated types
├── types/
│   └── index.ts                # App-specific types
└── App.tsx                     # Main app component
```

### 3.3 Supabase Setup Requirements
```sql
-- todos table
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can only see their own todos" 
ON todos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
ON todos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON todos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON todos FOR DELETE 
USING (auth.uid() = user_id);
```

---

## 4. Tek Epic: "YouTube Todo MVP"

Bu projede karmaşıklığı önlemek için **sadece 1 epic** var:

### Epic: YouTube Todo MVP
**Amaç:** Video tutorial için functional todo app
**Süre:** 1-2 hafta
**Story sayısı:** Maksimum 5 story

---

## 5. User Stories (Supabase-optimized)

### Story 1: Supabase Authentication Setup
```
As a user,
I want to register and login securely
So that I can access my personal todos with enterprise-grade security

Acceptance Criteria:
- Supabase Auth configuration
- Register form (email, password) - auto profile creation
- Login form (email, password)
- Automatic session management
- Auth state persistence across browser sessions
- Email verification (optional for MVP)
- Error handling for auth failures
```

### Story 2: Real-time Todo Creation
```
As a logged-in user,
I want to add new todos that sync instantly
So that I can track my tasks across all devices

Acceptance Criteria:
- Input field for todo text
- "+" button to add
- Empty input validation
- Todo saves to Supabase database
- Real-time sync across all user sessions
- Optimistic UI updates
- Error handling for network issues
```

### Story 3: Real-time Todo Completion
```
As a user,
I want to mark todos as completed with real-time sync
So that I can track my progress across all devices

Acceptance Criteria:
- Checkbox for each todo
- Completed todos get strikethrough style
- State updates in Supabase database
- Real-time sync to other devices/tabs
- Optimistic UI updates
- Visual feedback for completion state
```

### Story 4: Real-time Todo Deletion
```
As a user,
I want to delete todos with instant sync
So that I can remove unwanted tasks across all devices

Acceptance Criteria:
- "X" button for each todo
- Todo removed from Supabase database
- Real-time removal from all user sessions
- Optimistic UI removal
- No confirmation needed (keep it simple)
- Error handling with rollback if needed
```

### Story 5: Production-Ready UI & UX
```
As a user,
I want a polished app that works perfectly on all devices
So that I can use it professionally anywhere

Acceptance Criteria:
- Works on mobile (375px+)
- Works on desktop (1024px+)
- Follows reference design
- Loading states for all Supabase operations
- Error states with user-friendly messages
- Logout button in header with session cleanup
- Loading spinners during auth operations
- Offline indicator when network is down
```

---

## 6. Technical Specifications

### 6.1 Supabase Data Models
```typescript
// Supabase Auth User (built-in)
interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

// Database Types (generated by Supabase CLI)
interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          text: string;
          completed?: boolean;
        };
        Update: {
          text?: string;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}

// App-level types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

### 6.2 Supabase Configuration
```typescript
// Environment variables
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

// Client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

---

## 7. Updated Timeline (Supabase-optimized)

### Week 1: Setup & Core Development
- **Day 1:** 
  - Supabase project setup + database schema
  - Frontend project initialization (Vite/Next.js choice)
  - Environment configuration
- **Day 2:** 
  - Supabase Auth integration
  - AuthForm component + auth hooks
- **Day 3-4:** 
  - Todo CRUD with Supabase integration
  - Real-time subscriptions setup
  - Error handling & loading states
- **Day 5:** 
  - Responsive styling + UI polish
  - Bug fixes & edge cases

### Week 2: Production Polish
- **Day 1:** 
  - Performance optimization
  - Offline handling
  - Security review (RLS policies)
- **Day 2:** 
  - Code cleanup + TypeScript strict mode
  - Documentation + README
- **Day 3:** 
  - Video recording preparation
  - Demo environment setup
- **Day 4-5:** 
  - Buffer time + deployment
  - YouTube video editing

---

## 8. Scope Limitations

### ✅ Dahil Olan (Supabase MVP)
- Supabase Auth (register/login/logout)
- Real-time todo CRUD operations
- PostgreSQL database with RLS
- Real-time data synchronization
- Responsive design
- Error handling & loading states
- Basic offline support
- Production-ready security

### ❌ Dahil Olmayan (Future Features)
- Categories/tags/projects
- Advanced search/filter
- Due dates & reminders
- Complex animations/transitions
- Team collaboration
- Password reset flow
- Email verification (optional in MVP)
- Dark/light theme toggle
- Bulk operations
- File attachments
- Todo sharing
- Analytics/reports

---

## 9. Updated YouTube Video İçeriği (Supabase Focus)

### Video Bölümleri (Total: 45-50 dk)
1. **Intro & Demo (3 dk):** 
   - Final uygulamanın tanıtımı
   - Real-time sync demo (multiple browsers)
   - Teknoloji stack overview

2. **Supabase Setup (8 dk):** 
   - Supabase project oluşturma
   - Database schema & RLS policies
   - Environment variables setup

3. **Frontend Setup (7 dk):** 
   - Vite + React + TypeScript kurulumu
   - Supabase client configuration
   - Project structure explanation

4. **Authentication (12 dk):** 
   - Supabase Auth integration
   - AuthForm component development
   - Session management & protected routes

5. **Real-time Todo CRUD (12 dk):** 
   - Database operations with Supabase
   - Real-time subscriptions
   - Optimistic UI updates

6. **Styling & UX (5 dk):** 
   - Tailwind CSS implementation
   - Loading states & error handling
   - Mobile responsiveness

7. **Deploy & Wrap-up (3 dk):** 
   - Vercel deployment
   - Production tips
   - Next steps & learning resources

---

## 10. Updated Success Criteria (Supabase MVP)

### Functional Requirements
- [ ] User can register/login/logout via Supabase Auth
- [ ] User can add todos (saves to Supabase DB)
- [ ] User can mark todos complete (real-time sync)
- [ ] User can delete todos (instant sync)
- [ ] Data persists across devices/sessions
- [ ] Real-time updates across multiple browser tabs
- [ ] Basic offline support with sync when online

### Technical Requirements
- [ ] TypeScript strict mode with zero errors
- [ ] Responsive on mobile (375px+) and desktop (1024px+)
- [ ] Clean, production-ready code
- [ ] Follows reference design exactly
- [ ] Supabase RLS policies properly configured
- [ ] Environment variables secured
- [ ] Error boundaries & loading states
- [ ] Performance optimized (< 2s load time)

### Educational Goals
- [ ] Code is beginner-friendly and well-commented
- [ ] Shows modern React patterns (hooks, context)
- [ ] Demonstrates real-world Supabase integration
- [ ] Includes production-ready patterns
- [ ] Complete development in 1-2 weeks
- [ ] YouTube tutorial teaches valuable skills

### Business Value
- [ ] Showcases modern full-stack development
- [ ] Demonstrates real-time capabilities
- [ ] Production-ready architecture
- [ ] Scalable foundation for future features
- [ ] Educational content with high engagement potential

---

## 11. Frontend Paket Önerileri & Kurulum

### Tavsiye Edilen: Vite + React + TypeScript
```bash
# Hızlı başlangıç
npm create vite@latest todo-supabase -- --template react-ts
cd todo-supabase
npm install

# Supabase client
npm install @supabase/supabase-js

# Styling & Icons
npm install tailwindcss @tailwindcss/forms lucide-react

# Dev dependencies
npm install -D @types/node
```

### Alternatif 1: Next.js 14
```bash
# Next.js with TypeScript
npx create-next-app@latest todo-supabase --typescript --tailwind --app
cd todo-supabase
npm install @supabase/supabase-js lucide-react
```

### Alternatif 2: Create React App
```bash
# CRA with TypeScript template
npx create-react-app todo-supabase --template typescript
cd todo-supabase
npm install @supabase/supabase-js tailwindcss lucide-react
```

### Paket Seçim Kriterleri

**Vite + React (Recommended) ⭐**
- ✅ En hızlı development experience
- ✅ Modern build tool
- ✅ YouTube tutorial için mükemmel
- ✅ Hot reload super fast
- ✅ TypeScript built-in support

**Next.js 14**
- ✅ Full-stack capabilities 
- ✅ Server components
- ✅ SEO-friendly
- ❌ Tutorial için fazla kompleks olabilir

**Create React App**
- ✅ Beginner-friendly
- ✅ Zero configuration
- ❌ Slower build times
- ❌ Less modern tooling

### Hızlı Başlangıç Template
Proje için hazır template oluşturulabilir:
```
todo-supabase-starter/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── .env.example
├── supabase/
│   └── schema.sql
└── README.md
```

---

**Document Status:** ✅ Ready for Development  
**Next Step:** Epic'i Business Analyst Agent'a iletmek  
**Recommended Stack:** Vite + React + TypeScript + Supabase