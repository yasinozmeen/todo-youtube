---
name: release-validate
description: Release readiness validation ve go/no-go decision
agent_access: qa
---

# Release Validation Komutu

Bu komut QA Agent tarafından release readiness assessment yapmak için kullanılır.

## Kullanım
```
/release-validate [release-scope] [quality-criteria] [risk-tolerance]
```

## Örnek Kullanım
```
/release-validate "mvp-v1.0" "production-ready" "low-risk"
```

## Validation Areas
1. **Functional Testing**: All features working
2. **Performance**: Meets benchmarks
3. **Security**: No vulnerabilities  
4. **Accessibility**: WCAG compliance
5. **Browser Testing**: Cross-browser compatibility
6. **Mobile Testing**: Responsive design verified

## Release Decision Matrix
```markdown
# Release Validation Report

## Overall Assessment
**Release Recommendation**: ✅ GO / ⚠️ CONDITIONAL GO / ❌ NO GO

## Quality Metrics
| Criteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Bug Count | <5 high | 2 high | ✅ |
| Test Coverage | >80% | 87% | ✅ |
| Performance | <2s load | 1.3s | ✅ |
| Security | No critical | Clean | ✅ |

## Risk Assessment
**High Risks**: [Critical blockers]
**Medium Risks**: [Manageable issues]
**Mitigations**: [Risk reduction plans]

## Go/No-Go Decision
**Recommendation**: GO
**Conditions**: [Any conditions for release]
```