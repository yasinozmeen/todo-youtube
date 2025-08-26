---
name: stakeholder-report
description: Stakeholder'lar için progress ve status raporu oluşturur
agent_access: product-manager
---

# Stakeholder Rapor Komutu

Bu komut Product Manager Agent tarafından stakeholder'lar için comprehensive progress ve status raporu oluşturmak üzere kullanılır.

## Kullanım
```
/stakeholder-report [report-type] [time-period] [audience]
```

## Örnek Kullanım
```
/stakeholder-report "weekly" "sprint-3" "executives"
/stakeholder-report "milestone" "mvp-completion" "investors"
```

## Rapor Tipleri

### 1. Weekly Status Report
```markdown
# Todo App - Weekly Progress Report
**Week**: [Date Range]
**Sprint**: [Sprint Number]

## 📊 Key Metrics
- **Sprint Progress**: 67% completed
- **Story Points**: 24/36 completed
- **Velocity**: On track (average: 32 points/sprint)
- **Quality Score**: 94% (QA approval rate)

## ✅ Completed This Week
- ✅ User authentication system
- ✅ Basic todo CRUD operations  
- ✅ Category management UI
- ✅ Mobile responsive layout

## 🚧 In Progress
- 🔄 Search functionality (80% complete)
- 🔄 Performance optimization (30% complete)
- 🔄 Accessibility improvements (50% complete)

## 📅 Coming Next Week
- 📋 Advanced filtering features
- 📋 Data export functionality
- 📋 User preferences system

## 🚨 Risks & Blockers
- ⚠️ **Medium Risk**: Third-party API integration delays
  - Impact: 2-day delay potential
  - Mitigation: Alternative solution researched
- ⚠️ **Low Risk**: Team member vacation
  - Impact: Reduced capacity (20%)
  - Mitigation: Tasks redistributed

## 📈 Business Impact
- **User Feedback**: Positive (4.2/5 rating in alpha)
- **Market Opportunity**: On track for Q1 launch
- **Competitive Position**: Feature parity achieved
```

### 2. Milestone Report
```markdown
# Todo App - MVP Milestone Report
**Milestone**: MVP Completion
**Date**: [Completion Date]
**Status**: ✅ COMPLETED

## 🎯 Milestone Goals vs Achievements

### ✅ ACHIEVED
- **Core Functionality**: 100% complete
  - Todo CRUD operations
  - User authentication
  - Category management
  - Basic search & filter
  
- **Quality Metrics**: Exceeded targets
  - Test Coverage: 87% (target: 80%)
  - Performance: Page load < 1.5s (target: 2s)
  - Accessibility: WCAG 2.1 AA compliant

- **Business Metrics**: Strong results
  - Alpha user satisfaction: 4.2/5
  - Core user journey completion: 94%
  - Bug rate: 0.8 bugs/story (target: 1.0)

### 📊 ROI Analysis
- **Development Cost**: $45K (budget: $50K)
- **Timeline**: 8 weeks (planned: 10 weeks)
- **Quality Score**: 94% (target: 90%)
- **Technical Debt**: Low (manageable backlog)

## 🚀 Next Phase: Enhancement
**Timeline**: 6 weeks
**Budget**: $30K
**Key Features**: Advanced search, collaboration, analytics
```

### 3. Executive Dashboard
```markdown
# Todo App - Executive Summary
**Reporting Period**: [Month/Quarter]

## 🎯 Strategic Goals Progress
| Goal | Target | Current | Status |
|------|---------|---------|---------|
| MVP Completion | Q1 2025 | On Track | 🟢 |
| User Acquisition | 1K users | 750 users | 🟡 |
| Revenue Target | $10K MRR | $7.5K MRR | 🟡 |
| Market Share | 5% | 3.2% | 🟡 |

## 💰 Financial Overview
- **Development Budget**: $75K allocated, $45K spent (60%)
- **Revenue**: $7.5K MRR (growing 15% monthly)
- **CAC**: $12 per user (target: $15)
- **LTV**: $180 per user (target: $150)

## 🏆 Key Achievements
1. **Technical Excellence**: 94% quality score
2. **User Satisfaction**: 4.2/5 star rating
3. **Market Validation**: 750 active beta users
4. **Team Performance**: 20% ahead of schedule

## ⚡ Strategic Recommendations
1. **Accelerate Go-to-Market**: Ready for early launch
2. **Increase Marketing Budget**: Strong product-market fit
3. **Team Expansion**: Consider adding 1-2 developers
4. **Partnership Opportunities**: Integrate with productivity tools
```

## Otomatik Metrik Toplama
- Sprint velocity tracking
- Quality metrics aggregation  
- User feedback synthesis
- Financial metric updates
- Risk assessment updates

## Dağıtım Kanalları
- Email reports (automated)
- Dashboard updates (real-time)
- Presentation slides (generated)
- PDF export (formatted)

## Sonraki Adımlar
Rapor onaylandıktan sonra stakeholder feedback'e göre roadmap adjustments yapılabilir.