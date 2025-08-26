---
name: performance-audit
description: Performance ve accessibility comprehensive audit
agent_access: qa
---

# Performance & Accessibility Audit Komutu

Bu komut QA Agent tarafından performance ve accessibility audit yapmak için kullanılır.

## Kullanım
```
/performance-audit [app-url] [audit-scope] [benchmark-targets]
```

## Örnek Kullanım
```
/performance-audit "http://localhost:3000" "full-app" "lighthouse-90"
```

## Audit Categories
1. **Performance**: Load time, bundle size, runtime performance
2. **Accessibility**: WCAG 2.1 compliance, screen reader support
3. **SEO**: Search engine optimization
4. **Best Practices**: Security, modern web standards  
5. **PWA**: Progressive web app features

## Audit Report
```markdown
# Performance & Accessibility Audit Report

## Lighthouse Scores
- **Performance**: 94/100 ✅
- **Accessibility**: 87/100 ⚠️
- **Best Practices**: 92/100 ✅  
- **SEO**: 90/100 ✅

## Performance Metrics
- **First Contentful Paint**: 1.2s
- **Largest Contentful Paint**: 2.1s  
- **Cumulative Layout Shift**: 0.05
- **Total Bundle Size**: 420KB

## Accessibility Issues
- [ ] Missing alt text on images
- [ ] Low color contrast in buttons
- [ ] Missing ARIA labels

## Recommendations
1. **Performance**: Optimize images, code splitting
2. **Accessibility**: Fix contrast issues, add ARIA
3. **Best Practices**: Update dependencies
```

## Automated Testing
- Lighthouse CI integration
- Performance regression detection
- Accessibility compliance monitoring
- Bundle size tracking