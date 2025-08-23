# User Story: Real-time Todo Deletion

**Story ID:** US-TODO-004  
**Epic:** YT-TODO-MVP-001  
**Priority:** P0 (Must Have)  
**Story Points:** 2 points  
**Status:** Ready for Development  
**Business Analyst:** AI Business Analyst Agent  
**Assigned to:** Developer Agent  

---

## User Story

**Başlık:** Kullanıcı olarak artık ihtiyacım olmayan todo'ları silip tüm cihazlarımdan kaldırmak istiyorum

**Açıklama:**  
Bir kullanıcı olarak, gereksiz veya yanlış eklediğim görevleri temizleyebilmek için todo'ları kalıcı olarak silebilmek ve bu değişikliğin tüm cihazlarımda anlık senkronize olmasını istiyorum.

---

## Acceptance Criteria

### AC1: Delete Button Interface
- **GIVEN:** Kullanıcı todo listesini görüyor
- **WHEN:** Her todo item'ının yanında "X" butonu görür
- **THEN:** Buton görsel olarak belirgin ve tıklanabilir
- **AND:** Hover effect ile user feedback var
- **AND:** Mobile'da touch-friendly sizing (minimum 44px)
- **AND:** Icon accessibility labels mevcut

### AC2: Todo Deletion via Click
- **GIVEN:** Kullanıcı bir todo'yu silmek istiyor
- **WHEN:** "X" butonuna tıklar
- **THEN:** Todo anında UI'dan kaldırılır (optimistic)
- **AND:** Supabase database'den DELETE edilir
- **AND:** Loading indicator kısa süre gösterilir
- **AND:** Smooth fade-out animation ile kaldırılır

### AC3: No Confirmation Dialog
- **GIVEN:** Todo deletion basit tutulmalı (MVP requirement)
- **WHEN:** User "X" butonuna tıklar
- **THEN:** Confirmation dialog gösterilmez
- **AND:** Direct deletion gerçekleşir
- **AND:** Undo functionality yok (simple UX)
- **AND:** Single click ile complete işlem

### AC4: Database Permanent Deletion
- **GIVEN:** Todo silinmek için işaretlenmiş
- **WHEN:** Supabase DELETE operation çalışır
- **THEN:** Record database'den completely kaldırılır
- **AND:** user_id authentication ile kontrol edilir
- **AND:** RLS policies DELETE permission kontrol eder
- **AND:** Related data cascade deletion yok (tek tablo)

### AC5: Real-time Synchronization
- **GIVEN:** Kullanıcı birden fazla tarayıcı tabında açık
- **WHEN:** Bir tabda todo siler
- **THEN:** Diğer tüm tablarda anında kaldırılır
- **AND:** DELETE event subscription aktif çalışır
- **AND:** Visual removal tüm tablarda sync olur
- **AND:** List order consistency korunur

### AC6: Optimistic UI Updates
- **GIVEN:** Kullanıcı "X" butonuna tıklamış
- **WHEN:** Network yavaş veya gecikme var
- **THEN:** Todo anında UI'dan kaldırılır (optimistic)
- **AND:** Database confirm edince permanent olur
- **AND:** Network hatası durumunda geri getirilebilir
- **AND:** Loading state subtle indicator

### AC7: Error Handling & Recovery
- **GIVEN:** Delete işlemi başarısız olur
- **WHEN:** Network hatası, permission error, or server error
- **THEN:** Optimistic removal geri alınır (rollback)
- **AND:** Todo original position'ında geri görünür
- **AND:** User-friendly error message gösterilir
- **AND:** "Retry delete" seçeneği sunulur

### AC8: List State Management
- **GIVEN:** Todo deleted durumda
- **WHEN:** List re-render edilir
- **THEN:** Indexes ve order korunur
- **AND:** Adjacent todos position shift doğru
- **AND:** Empty list state handle edilir
- **AND:** Animation glitches yok

---

## Implementation Tasks

### Task 4.1: Delete Button Component (2 hours)
- [ ] X icon button implementation
- [ ] Click event handlers
- [ ] Hover/active states styling
- [ ] Mobile touch target sizing
- [ ] Accessibility attributes (aria-label)

### Task 4.2: Delete Animation & UX (3 hours)
- [ ] Fade-out animation CSS
- [ ] Loading indicator during delete
- [ ] Smooth list item removal
- [ ] No-confirmation direct delete
- [ ] Visual feedback improvements

### Task 4.3: Database Delete Logic (3 hours)
- [ ] deleteTodo function implementation
- [ ] Supabase DELETE operation
- [ ] Error handling wrapper
- [ ] RLS policy compliance check
- [ ] TypeScript type safety

### Task 4.4: Real-time Delete Handling (4 hours)
- [ ] Supabase DELETE event subscription
- [ ] useRealtime hook enhancement
- [ ] DELETE event filtering (user-specific)
- [ ] State removal logic
- [ ] Multi-tab sync testing

### Task 4.5: Optimistic Deletion (4 hours)
- [ ] Local state removal logic
- [ ] Optimistic delete implementation
- [ ] Rollback mechanism for errors
- [ ] Original todo state preservation
- [ ] Error recovery strategy

### Task 4.6: Edge Cases & Testing (2 hours)
- [ ] Rapid deletion handling
- [ ] Empty list state management
- [ ] Network failure scenarios
- [ ] Permission error scenarios
- [ ] Multi-device sync testing

---

## Technical Specifications

### Required Files to Create/Modify
```
src/
├── components/
│   └── Todo/
│       ├── TodoItem.tsx            # Add delete button
│       ├── TodoList.tsx            # Handle delete events
│       └── DeleteButton.tsx        # Dedicated delete component
├── hooks/
│   └── useTodos.ts                 # Add delete functionality
├── lib/
│   └── todoService.ts              # Delete todo function
└── styles/
    └── animations.css              # Delete animations
```

### Delete Button Styling
```css
.delete-button {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: #6b7280; /* gray-500 */
}

.delete-button:hover {
  background-color: #fef2f2; /* red-50 */
  color: #ef4444; /* red-500 */
  transform: scale(1.1);
}

.todo-item-exit {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease-out;
}
```

### Database Delete Function
```typescript
const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
```

### Real-time Delete Subscription
```typescript
const subscribeToDeletes = (userId: string, callback: (id: string) => void) => {
  return supabase
    .channel('todos-delete')
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'todos',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      callback(payload.old.id);
    })
    .subscribe();
};
```

---

## Dependencies & Risks

### Dependencies
- **Upstream:** US-TODO-002 (Todo Creation) - MUST be completed first
- **Parallel:** US-TODO-003 (Todo Completion) can be developed simultaneously

### Technical Risks
- **Low Risk:** Optimistic deletion rollback complexity
- **Low Risk:** Animation timing with real-time updates
- **Low Risk:** Empty list state edge case

### Mitigation
- Test optimistic updates thoroughly
- Use CSS transitions for smooth UX
- Handle empty list gracefully
- Test with network throttling

---

## User Experience Flow

### Happy Path
1. User sees todo with "X" button
2. User clicks "X" button
3. Todo fades out with animation
4. Todo removed from database
5. List adjusts smooth layout
6. Other tabs sync removal

### Error Path
1. Network error during delete
2. Optimistic removal paused
3. Todo reappears with error message
4. "Retry" option available
5. User can try again

### Empty List State
1. User deletes last todo
2. Empty state message appears
3. "Add new task" input remains accessible
4. Clean, minimal interface maintained

---

## Accessibility Requirements

### WCAG 2.1 Compliance
- [ ] Delete button keyboard accessible (Tab + Enter)
- [ ] Screen reader support (aria-label="Delete todo")
- [ ] Focus management after deletion
- [ ] Sufficient color contrast on hover states
- [ ] Touch targets minimum 44px (mobile)

### Keyboard Navigation
- [ ] Tab order: checkbox -> delete button -> next todo
- [ ] Enter/Space key ile delete
- [ ] Focus management post-deletion

---

## Definition of Done

### Functional Checklist
- [ ] User todo'yu tek tıkla silebiliyor
- [ ] No confirmation dialog (simple UX)
- [ ] Smooth deletion animation
- [ ] Real-time sync birden fazla tabda çalışıyor
- [ ] Optimistic updates implemented
- [ ] Error handling ve rollback working
- [ ] Empty list state handled

### Technical Checklist
- [ ] TypeScript strict mode compliance
- [ ] Mobile responsive (touch targets)
- [ ] Performance optimized (<100ms delete)
- [ ] CSS animations smooth
- [ ] Memory leaks checked (subscriptions)
- [ ] RLS policies enforced

### Quality Assurance
- [ ] Multi-browser testing
- [ ] Multiple tabs sync testing
- [ ] Rapid deletion scenarios
- [ ] Network failure testing
- [ ] Empty list scenarios
- [ ] Mobile device testing
- [ ] Accessibility testing

---

## Story Handoff Notes

### For Developer Agent
- No confirmation dialog requirement critical (simple UX)
- Optimistic deletion için smooth rollback önemli
- Fade-out animation user experience artırır
- Mobile touch targets yeterince büyük olmalı
- Empty list state gracefully handle et

### Business Value
- Users can manage todos efficiently across devices
- Clean, uncluttered interface with easy removal
- Real-time sync maintains data consistency
- Simple UX without confirmation friction

### Next Story
Bu story tamamlandıktan sonra **US-TODO-005: Production-Ready UI & UX** başlayabilir.

---

**Last Updated:** 2025-08-23  
**Estimated Completion:** 1.5 days  
**Complexity:** Low-Medium  
**INVEST Score:** ✅ Validated