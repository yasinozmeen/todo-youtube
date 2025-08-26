---
name: epic-to-stories
description: Epic'i INVEST prensiplerine uygun user story'lere böler
agent_access: business-analyst
---

# Epic to Stories Dönüşüm Komutu

Bu komut Business Analyst Agent tarafından epic'leri implement edilebilir user story'lere dönüştürmek için kullanılır.

## Kullanım
```
/epic-to-stories [epic-file] [story-size] [sprint-capacity]
```

## Örnek Kullanım
```
/epic-to-stories "epics/user-management.md" "medium" "40-points"
```

## İşlev
1. **Epic Analysis**: Epic'i detaylı analiz eder
2. **User Journey Mapping**: User flow'ları belirler
3. **Story Extraction**: INVEST prensiplerine uygun story'ler çıkarır
4. **Acceptance Criteria**: Her story için detaylı kriterler yazar
5. **Story Estimation**: Story point tahminleri yapar

## Story Template
```markdown
# User Story: [Story Title]

## Story Details
**Epic**: [Parent Epic]
**ID**: US-[EPIC]-[NUMBER]
**Title**: Kullanıcı olarak [hedef] istiyorum
**Priority**: High/Medium/Low

## Description
Bir [user-role] olarak, [business-value] için [feature] yapmak istiyorum.

## Acceptance Criteria
- **GIVEN**: [Pre-condition]
- **WHEN**: [Action/Trigger]  
- **THEN**: [Expected Result]
- **AND**: [Additional conditions]

### Detailed Scenarios

#### Happy Path
- ✅ [Normal use case scenario]
- ✅ [Successful completion path]

#### Edge Cases
- ⚠️ [Edge case 1]
- ⚠️ [Edge case 2]

#### Error Handling  
- ❌ [Error scenario 1]
- ❌ [Error scenario 2]

## INVEST Validation
- ✅ **Independent**: Can be developed standalone
- ✅ **Negotiable**: Implementation details flexible
- ✅ **Valuable**: Provides clear user value
- ✅ **Estimable**: Complexity is clear
- ✅ **Small**: Fits in one sprint
- ✅ **Testable**: Acceptance criteria are testable

## Technical Notes
**Complexity Factors**:
- [Technical consideration 1]
- [Technical consideration 2]

**Integration Points**:
- [System integration 1]
- [System integration 2]

## Estimation
**Story Points**: [1-8]
**Justification**: [Why this estimate]
**Confidence**: High/Medium/Low

## Definition of Ready
- [ ] Acceptance criteria defined
- [ ] Business value clear
- [ ] Dependencies identified
- [ ] Testable requirements
- [ ] UI/UX mockups (if needed)

## Definition of Done
- [ ] Code implemented
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passed
- [ ] Code reviewed & approved
- [ ] Acceptance criteria verified
- [ ] Documentation updated
```

## Story Breakdown Examples

### Epic: "Todo Management System"

#### Story 1: Todo Ekleme
```markdown
**Title**: Kullanıcı olarak yeni todo eklemek istiyorum

**Description**: 
Bir todo app kullanıcısı olarak, görevlerimi takip edebilmek için yeni todo eklemek istiyorum.

**Acceptance Criteria**:
- GIVEN: Ana sayfada todo ekleme formu var
- WHEN: Todo title girip "Ekle" butonuna tıkladığımda
- THEN: Yeni todo listede görünür
- AND: Form temizlenir ve yeni todo eklemeye hazır hale gelir
- AND: Success mesajı gösterilir

**Edge Cases**:
- Boş title ile todo ekleme denemesi → Error message
- 500 karakter üzeri title → Validation error
- Duplicate todo title → Warning message

**Story Points**: 3
```

#### Story 2: Todo Tamamlama
```markdown
**Title**: Kullanıcı olarak todo'yu tamamlanmış olarak işaretlemek istiyorum

**Description**:
Bir todo app kullanıcısı olarak, görevimi bitirdiğimde progress'imi görebilmek için todo'yu completed olarak işaretlemek istiyorum.

**Acceptance Criteria**:
- GIVEN: Todo listesinde active todo'lar var
- WHEN: Todo'nun yanındaki checkbox'ı işaretlediğimde
- THEN: Todo completed state'e geçer
- AND: Görsel olarak tamamlanmış todo style'ı uygulanır
- AND: Completed todo'lar listede aşağıda gösterilir

**Story Points**: 2
```

## Otomatik Validations
- INVEST criteria compliance check
- Story size appropriateness
- Acceptance criteria completeness
- Dependencies identification
- Estimation consistency

## Çıktı
1. **Story List**: Prioritized ve estimated story'ler
2. **Sprint Breakdown**: Story'lerin sprint'lere dağılımı
3. **Dependency Map**: Story dependencies
4. **Estimation Summary**: Total effort ve timeline

## Sonraki Adım
Story'ler Developer Agent'a `/story-implement` komutu için hazır hale gelir.