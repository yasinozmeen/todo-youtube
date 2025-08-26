---
name: story-refine
description: Existing story'leri geliştir ve detaylandır
agent_access: business-analyst
---

# Story Refinement Komutu

Bu komut Business Analyst Agent tarafından mevcut user story'leri geliştirmek ve detaylandırmak için kullanılır.

## Kullanım
```
/story-refine [story-file] [feedback-source] [refinement-focus]
```

## Örnek Kullanım
```
/story-refine "stories/US-TODO-001.md" "developer-feedback" "acceptance-criteria"
/story-refine "stories/US-TODO-005.md" "qa-review" "edge-cases"
```

## Refinement Fokus Alanları

### 1. Acceptance Criteria Geliştirme
- Eksik senaryoları ekleme
- Edge case'leri detaylandırma
- Given-When-Then formatını iyileştirme
- Testable criteria oluşturma

### 2. Story Splitting
- Çok büyük story'leri böl
- Independent story'ler oluştur
- Value delivery optimize et
- Sprint capacity'ye uygun boyut

### 3. Clarity Improvement
- Business value netleştir
- User context güçlendir
- Technical ambiguity gider
- Communication açıklığı artır

## Refinement Process

### Input Analysis
```markdown
## Refinement Request Analysis

**Original Story**: [Story Title]
**Feedback Source**: [Developer/QA/PM/User]
**Issues Identified**:
- [ ] Unclear acceptance criteria
- [ ] Missing edge cases
- [ ] Too large/small scope
- [ ] Ambiguous requirements
- [ ] Missing dependencies

**Refinement Goals**:
- [Goal 1: Clarify X]
- [Goal 2: Add Y scenarios]
- [Goal 3: Split into Z stories]
```

### Refinement Output
```markdown
# Refined User Story: [Updated Title]

## Changes Made
**Version**: 2.1
**Date**: [Refinement Date]
**Refined By**: Business Analyst Agent

### Change Summary
- ✅ **Added**: [New acceptance criteria/scenarios]
- 🔄 **Modified**: [Changed requirements]
- ❌ **Removed**: [Removed ambiguous parts]
- 📋 **Split**: [If story was split into multiple]

## Updated Story Details

### Enhanced Acceptance Criteria
- **GIVEN**: [More specific pre-condition]
- **WHEN**: [Clearer action/trigger]
- **THEN**: [More measurable result]
- **AND**: [Additional specific conditions]

### New Edge Cases Covered
- ⚠️ **Network Issues**: [Offline/poor connection handling]
- ⚠️ **Data Validation**: [Input validation scenarios]  
- ⚠️ **Concurrency**: [Multiple user scenarios]
- ⚠️ **Performance**: [Large dataset handling]

### Error Scenarios
- ❌ **Validation Errors**: [Form validation failures]
- ❌ **System Errors**: [API/database failures]
- ❌ **User Errors**: [Incorrect user actions]
- ❌ **Security**: [Unauthorized access attempts]

### UI/UX Specifications
- **Loading States**: [How to handle async operations]
- **Empty States**: [What to show when no data]
- **Success States**: [Confirmation messages/animations]
- **Error States**: [Error message display]

## Updated Estimation
**Previous Points**: [Old estimate]
**New Points**: [New estimate]
**Change Reason**: [Why estimate changed]

## Dependencies Update
**New Dependencies**: [Any new dependencies identified]
**Removed Dependencies**: [Dependencies no longer needed]

## Testing Strategy
**Unit Tests**: [Specific test scenarios]
**Integration Tests**: [Integration test requirements]
**Acceptance Tests**: [User acceptance test scenarios]
```

## Common Refinement Patterns

### Pattern 1: Story Splitting
```markdown
**Original Large Story**: "Kullanıcı olarak todo yönetimi yapmak istiyorum"

**Split Into**:
1. **US-TODO-001**: Todo ekleme
2. **US-TODO-002**: Todo düzenleme  
3. **US-TODO-003**: Todo silme
4. **US-TODO-004**: Todo tamamlama
5. **US-TODO-005**: Todo listeleme
```

### Pattern 2: Clarity Enhancement
```markdown
**Before**: "Kullanıcı olarak arama yapmak istiyorum"

**After**: "Kullanıcı olarak todo'larımı title ve description'da arayarak hızlıca bulabilmek istiyorum"

**Enhanced Acceptance Criteria**:
- GIVEN: En az 5 todo'um var ve search box görünür
- WHEN: Search box'a "meeting" yazıp Enter'a bastığımda
- THEN: Title veya description'da "meeting" geçen tüm todo'lar filtrelenir
- AND: Arama sonuç sayısı gösterilir ("3 sonuç bulundu")
- AND: Search term highlight edilir
- AND: Arama geçmişi kaydedilir
```

### Pattern 3: Edge Case Addition
```markdown
**Original**: Basic todo ekleme functionality

**Enhanced Edge Cases**:
- ⚠️ **Duplicate Prevention**: Aynı title'da todo varsa warning
- ⚠️ **Character Limits**: Title 200, description 1000 karakter max
- ⚠️ **Special Characters**: Emoji ve special character desteği
- ⚠️ **Bulk Operations**: Multiple todo selection ve operations
- ⚠️ **Undo Functionality**: Son işlemi geri alma
```

## Quality Checks

### Refinement Quality Criteria
- [ ] **Clarity**: Requirements açık ve anlaşılır
- [ ] **Completeness**: Tüm scenarios covered
- [ ] **Testability**: Her criteria test edilebilir  
- [ ] **Independence**: Story bağımsız implement edilebilir
- [ ] **Value**: Business value net tanımlı
- [ ] **Effort**: Reasonable estimate

### INVEST Re-validation
- ✅ **Independent**: Still independently implementable
- ✅ **Negotiable**: Implementation details still flexible
- ✅ **Valuable**: Value proposition strengthened  
- ✅ **Estimable**: Complexity more clear
- ✅ **Small**: Right size for sprint
- ✅ **Testable**: Enhanced testability

## Stakeholder Approval
```markdown
## Refinement Approval

**Business Analyst**: ✅ Story requirements complete
**Product Manager**: ✅ Business value maintained  
**Developer**: ✅ Technical feasibility confirmed
**QA**: ✅ Testability validated

**Approval Date**: [Date]
**Ready for Development**: ✅
```

## Sonraki Adımlar
Refined story Developer Agent'a implementation için geçer.