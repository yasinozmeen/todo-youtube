---
name: bug-report-create
description: Structured ve detaylı bug report oluşturur
agent_access: qa
---

# Bug Report Creation Komutu

Bu komut QA Agent tarafından structured bug reports oluşturmak için kullanılır.

## Kullanım
```
/bug-report-create [issue-details] [environment] [severity]
```

## Örnek Kullanım
```
/bug-report-create "todo-deletion-fails" "chrome-mac" "high"
```

## Bug Report Template
```markdown
# 🐛 Bug Report: BUG-2025-XXX

## 📋 Summary
**Title**: [Short descriptive title]
**Severity**: Critical/High/Medium/Low
**Priority**: P1/P2/P3/P4

## 🔄 Reproduction Steps
1. [Step 1]
2. [Step 2]  
3. [Step 3]

## 🎯 Expected vs Actual
**Expected**: [What should happen]
**Actual**: [What actually happens]

## 🖥️ Environment
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Version: [App version]

## 📸 Evidence
- Screenshots
- Console errors
- Network logs

## 📊 Impact Analysis
**Affected Users**: [Percentage/number]
**Business Impact**: [Revenue/UX impact]
```

## Auto-Generated Content
- Environment detection
- Console error extraction  
- Screenshot capture
- Impact assessment
- Severity recommendation