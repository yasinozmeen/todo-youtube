---
name: generate-epics
description: PRD'den epic'leri otomatik çıkarır ve önceliklendirir
agent_access: product-manager
---

# Epic Oluşturma Komutu

Bu komut Product Manager Agent tarafından mevcut PRD belgesinden epic'leri çıkarmak ve iş değerine göre önceliklendirmek için kullanılır.

## Kullanım
```
/generate-epics [prd-file-path] [sprint-duration] [team-capacity]
```

## Örnek Kullanım
```
/generate-epics "docs/prd-todo-app.md" "2-weeks" "4-developers"
```

## İşlev
1. **PRD Analizi**: PRD belgesini parse eder
2. **Epic Extraction**: Özellikleri epic'lere böler
3. **Value Assessment**: Her epic için business value hesaplar
4. **Prioritization**: MoSCoW metoduyla önceliklendirir
5. **Timeline Planning**: Sprint capacity'sine göre dağıtır

## Epic Template
```markdown
# Epic: [Epic Name]

## Business Value
**Score**: [1-100]
**Justification**: [Why this epic matters]

## Scope
**Goal**: [What we want to achieve]
**Success Criteria**: [How we measure success]

## Features Included
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Acceptance Criteria (High Level)
- [ ] [Major requirement 1]
- [ ] [Major requirement 2]
- [ ] [Major requirement 3]

## Constraints
**Technical**: [Technical limitations]
**Business**: [Business constraints]
**Timeline**: [Time constraints]

## Dependencies
**Depends On**: [Other epics needed first]
**Blocks**: [Epics waiting for this]

## Estimation
**Complexity**: High/Medium/Low
**Effort**: [Story points estimate]
**Timeline**: [Expected duration]
```

## Çıktı
1. **Epic List**: Prioritized epic listesi
2. **Roadmap Draft**: High-level timeline
3. **Dependencies Map**: Epic dependencies
4. **Release Plan**: Multi-sprint breakdown

## Sonraki Adım
Epic'ler Business Analyst Agent'a `/epic-to-stories` komutu için hazır hale gelir.