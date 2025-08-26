---
name: roadmap-plan
description: Epic'lerden detaylı roadmap ve timeline oluşturur
agent_access: product-manager
---

# Roadmap Planlama Komutu

Bu komut Product Manager Agent tarafından epic'lerden comprehensive roadmap ve timeline oluşturmak için kullanılır.

## Kullanım
```
/roadmap-plan [epic-list] [team-size] [timeline] [release-strategy]
```

## Örnek Kullanım
```
/roadmap-plan "epics/*.md" "4-devs" "3-months" "agile-sprints"
```

## İşlev
1. **Epic Analysis**: Epic'leri effort ve dependency açısından analiz eder
2. **Capacity Planning**: Team capacity ve velocity hesabı yapar
3. **Timeline Creation**: Realistic timeline oluşturur
4. **Milestone Definition**: Major milestones belirler
5. **Risk Assessment**: Timeline risk'lerini değerlendirir

## Roadmap Formatı
```mermaid
gantt
    title Todo App Development Roadmap
    dateFormat  YYYY-MM-DD
    section MVP Phase
    Epic 1: User Management    :active, e1, 2025-01-01, 2025-01-14
    Epic 2: Core Todo Features :e2, after e1, 14d
    Epic 3: Basic UI/UX        :e3, after e2, 10d
    
    section Enhancement Phase  
    Epic 4: Advanced Features  :e4, after e3, 21d
    Epic 5: Performance        :e5, after e4, 7d
    
    section Launch Phase
    Epic 6: Testing & QA       :e6, after e5, 14d
    Release v1.0               :milestone, after e6, 0d
```

## Çıktı Detayları

### 1. Executive Roadmap
```markdown
# Todo App Roadmap 2025

## Q1 2025: MVP Development
**Timeline**: Jan 1 - Mar 31
**Goal**: Core functionality delivery
**Milestones**:
- [ ] MVP Feature Complete (Feb 28)
- [ ] Alpha Testing (Mar 15)
- [ ] Beta Release (Mar 31)

## Q2 2025: Enhancement
**Timeline**: Apr 1 - Jun 30
**Goal**: Advanced features ve optimization
**Milestones**:
- [ ] Performance Optimization (Apr 30)
- [ ] Advanced Features (May 31)
- [ ] Production Release (Jun 30)
```

### 2. Sprint Breakdown
```markdown
## Sprint Planning Breakdown

### Sprint 1 (Weeks 1-2)
**Epic**: User Management
**Stories**: 8 stories, 32 story points
**Deliverable**: Authentication system

### Sprint 2 (Weeks 3-4)  
**Epic**: Core Todo Features
**Stories**: 12 stories, 48 story points
**Deliverable**: Basic CRUD operations

### Sprint 3 (Weeks 5-6)
**Epic**: UI/UX Implementation
**Stories**: 10 stories, 40 story points  
**Deliverable**: Responsive interface
```

### 3. Risk Assessment
```markdown
## Timeline Risks & Mitigations

### High Risk
- **Third-party integrations delay** 
  - Mitigation: Start integration research early
- **Performance bottlenecks**
  - Mitigation: Continuous performance testing

### Medium Risk  
- **Scope creep from stakeholders**
  - Mitigation: Strict change control process
- **Team member unavailability**
  - Mitigation: Cross-training ve documentation
```

## Dependencies Tracking
- Epic dependencies visualization
- Critical path identification
- Resource allocation planning
- Buffer time calculations

## Sonraki Adımlar
Roadmap onaylandıktan sonra ilk epic `/epic-to-stories` ile Business Analyst'e geçer.