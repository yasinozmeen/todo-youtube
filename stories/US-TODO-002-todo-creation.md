# User Story: Real-time Todo Creation

**Story ID:** US-TODO-002  
**Epic:** YT-TODO-MVP-001  
**Priority:** P0 (Must Have)  
**Story Points:** 3 points  
**Status:** Ready for Development  
**Business Analyst:** AI Business Analyst Agent  
**Assigned to:** Developer Agent  

---

## User Story

**Başlık:** Kullanıcı olarak yeni todo ekleyerek tüm cihazlarımda senkronize görmek istiyorum

**Açıklama:**  
Giriş yapmış bir kullanıcı olarak, tüm cihazlarımda anlık senkronizasyon ile todo'larımı takip edebilmek için yeni görevler ekleyebilmek istiyorum.

---

## Acceptance Criteria

### AC1: Todo Input Interface
- **GIVEN:** Kullanıcı giriş yapmış ve ana sayfada
- **WHEN:** "Add new task" input alanını görür
- **THEN:** Placeholder text "Add new task" görünür
- **AND:** Input alan aktif ve focus edilebilir
- **AND:** "+" butonu input yanında görünür

### AC2: Todo Creation via Button
- **GIVEN:** Kullanıcı input alanına görev metni girmiş
- **WHEN:** "+" butonuna tıklar
- **THEN:** Todo Supabase database'e kaydedilir
- **AND:** Input alanı temizlenir
- **AND:** Yeni todo anında liste başına eklenir
- **AND:** Loading spinner "+" butonunda gösterilir

### AC3: Todo Creation via Enter Key
- **GIVEN:** Kullanıcı input alanına görev metni girmiş
- **WHEN:** Enter tuşuna basar
- **THEN:** Todo Supabase database'e kaydedilir
- **AND:** Input alanı temizlenir
- **AND:** Yeni todo anında liste başına eklenir

### AC4: Input Validation
- **GIVEN:** Kullanıcı todo eklemeye çalışıyor
- **WHEN:** Boş string veya sadece whitespace girer
- **THEN:** Todo eklenmez
- **AND:** Input validasyon hatası gösterilir
- **AND:** "Please enter a task" mesajı görüntülenir
- **AND:** Input focus edilir

### AC5: Real-time Synchronization
- **GIVEN:** Kullanıcı birden fazla tarayıcı tabında açık
- **WHEN:** Bir tabda yeni todo ekler
- **THEN:** Diğer tüm tablarda anında görünür
- **AND:** Database subscription aktif çalışır
- **AND:** Sıralama tutarlı kalır (newest first)

### AC6: Optimistic UI Updates
- **GIVEN:** Kullanıcı todo eklemiş
- **WHEN:** Network yavaş veya gecikme var
- **THEN:** Todo anında UI'da görünür (optimistic)
- **AND:** Database confirm edince permanent olur
- **AND:** Network hatası durumunda rollback yapılır

### AC7: Database Integration
- **GIVEN:** Yeni todo ekleniyor
- **WHEN:** Supabase'e kaydetme işlemi başlar
- **THEN:** user_id otomatik set edilir (auth'dan)
- **AND:** created_at timestamp otomatik set edilir
- **AND:** completed status default false olur
- **AND:** id otomatik generate edilir (UUID)

### AC8: Error Handling
- **GIVEN:** Todo ekleme işlemi başarısız olur
- **WHEN:** Network hatası veya server error
- **THEN:** User-friendly hata mesajı gösterilir
- **AND:** Optimistic update geri alınır
- **AND:** "Retry" seçeneği sunulur
- **AND:** Input value korunur (user experience)

---

## Implementation Tasks

### Task 2.1: Database Schema & Types (2 hours)
- [ ] Supabase todos tablosu oluştur
- [ ] Row Level Security policies ayarla
- [ ] TypeScript types generate et
- [ ] Database helper functions

### Task 2.2: TodoForm Component (4 hours)
- [ ] Input field component
- [ ] Add button with "+" icon
- [ ] Enter key handling
- [ ] Form validation logic
- [ ] Loading states
- [ ] Error display

### Task 2.3: Supabase Integration (4 hours)
- [ ] useTodos hook oluştur
- [ ] addTodo function implementation
- [ ] Supabase insert operations
- [ ] Error handling wrapper
- [ ] TypeScript type safety

### Task 2.4: Real-time Subscriptions (6 hours)
- [ ] Supabase real-time subscription setup
- [ ] useRealtime hook implementation
- [ ] INSERT events handling
- [ ] State synchronization logic
- [ ] Multi-tab sync testing

### Task 2.5: Optimistic Updates (4 hours)
- [ ] Optimistic UI implementation
- [ ] Local state management
- [ ] Network failure rollback
- [ ] Conflict resolution strategy
- [ ] User feedback mechanisms

### Task 2.6: UI/UX Polish (4 hours)
- [ ] Input field styling (matches design)
- [ ] Button hover/active states
- [ ] Loading animations
- [ ] Error message styling
- [ ] Mobile responsive design

---

## Technical Specifications

### Required Files to Create/Modify
```
src/
├── components/
│   └── Todo/
│       ├── TodoForm.tsx            # Add todo form
│       └── TodoList.tsx            # Todo list display
├── hooks/
│   ├── useTodos.ts                 # Todo CRUD operations
│   └── useRealtime.ts              # Real-time subscriptions
├── lib/
│   └── todoService.ts              # Supabase todo operations
└── types/
    └── todo.ts                     # Todo type definitions
```

### Database Schema
```sql
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable real-time
ALTER TABLE todos REPLICA IDENTITY FULL;
```

### TypeScript Types
```typescript
interface Todo {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TodoInsert {
  text: string;
  user_id: string;
}
```

---

## Dependencies & Risks

### Dependencies
- **Upstream:** US-TODO-001 (Auth Setup) - MUST be completed first
- **Downstream:** US-TODO-003, US-TODO-004 depend on this foundation

### Technical Risks
- **Medium Risk:** Real-time subscription configuration complexity
- **Low Risk:** Optimistic updates conflict handling
- **Low Risk:** Network latency edge cases

### Mitigation
- Use Supabase real-time quickstart guide
- Implement robust error boundaries
- Test with network throttling
- Fallback to basic CRUD if real-time fails

---

## User Experience Flow

### Happy Path
1. User görür "Add new task" input
2. User task text girer
3. User "+" tıklar veya Enter basar
4. Todo anında UI'da görünür (optimistic)
5. Database'e kaydedilir
6. Diğer tarayıcılarda real-time update

### Error Path
1. Network hatası durumu
2. Optimistic update geri alınır
3. Error message gösterilir
4. Retry seçeneği sunulur
5. User input korunur

---

## Definition of Done

### Functional Checklist
- [ ] User yeni todo ekleyebilir (button + Enter)
- [ ] Empty input validation çalışıyor
- [ ] Todo database'e kaydediliyor
- [ ] Real-time sync birden fazla tabda çalışıyor
- [ ] Optimistic updates implemented
- [ ] Error handling tüm scenarios

### Technical Checklist
- [ ] TypeScript strict mode compliance
- [ ] Mobile responsive (375px+)
- [ ] Performance optimized (<100ms add)
- [ ] No memory leaks (subscription cleanup)
- [ ] Loading states user-friendly
- [ ] Error boundaries active

### Quality Assurance
- [ ] Multi-browser testing
- [ ] Multiple tabs sync testing
- [ ] Network failure scenarios
- [ ] Mobile device testing
- [ ] Input validation edge cases
- [ ] Performance with many todos

---

## Story Handoff Notes

### For Developer Agent
- Database RLS policies critical için user isolation
- Real-time subscriptions memory leak'e dikkat et
- Optimistic updates user experience için önemli
- Mobile touch targets 44px minimum
- Error messages actionable olsun

### Business Value
- Users can instantly create and see todos across devices
- Real-time collaboration foundation
- Professional UX with optimistic updates
- Scalable architecture for future features

### Next Story
Bu story tamamlandıktan sonra **US-TODO-003: Real-time Todo Completion** başlayabilir.

---

**Last Updated:** 2025-08-23  
**Estimated Completion:** 2 days  
**Complexity:** Medium  
**INVEST Score:** ✅ Validated