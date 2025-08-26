---
name: code-review-full
description: Comprehensive code review with detailed analysis and recommendations
agent_access: qa
---

# Full Code Review Komutu

Bu komut QA Agent tarafından comprehensive code review yapmak için kullanılır.

## Kullanım
```
/code-review-full [code-files] [story-context] [review-focus]
```

## Örnek Kullanım
```
/code-review-full "src/components/TodoForm/" "US-TODO-001" "security,performance"
```

## Review Areas
1. **Code Quality**: Clean code, SOLID principles
2. **Security**: XSS, input validation, data exposure  
3. **Performance**: Bundle size, re-renders, memory leaks
4. **Accessibility**: ARIA, keyboard nav, screen reader
5. **Testing**: Coverage, edge cases, integration
6. **TypeScript**: Type safety, interface design

## Review Output
```markdown
# Code Review Report: [Component Name]

## Overall Assessment
**Grade**: A/B/C/D/F
**Approval Status**: ✅ Approved / ⚠️ Conditional / ❌ Rejected

## Detailed Analysis
### ✅ Strengths
- [Good practices found]

### ⚠️ Issues Found  
- **Security**: [Security concerns]
- **Performance**: [Performance issues]
- **Quality**: [Code quality issues]

### 📋 Action Items
- [ ] Fix critical security issue
- [ ] Optimize performance bottleneck
- [ ] Add missing tests

## Recommendation
[Approve/Request Changes/Reject with justification]
```

## Quality Gates
- Security scan passed
- Performance benchmarks met
- Test coverage >80%
- Accessibility compliant
- TypeScript strict mode