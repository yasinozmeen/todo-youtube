---
name: test-cases-generate
description: Story'den comprehensive test case suite oluşturur
agent_access: qa
---

# Test Cases Generation Komutu

Bu komut QA Agent tarafından user story'den detailed test cases oluşturmak için kullanılır.

## Kullanım
```
/test-cases-generate [story-file] [test-types] [coverage-level]
```

## Örnek Kullanım
```
/test-cases-generate "stories/US-TODO-001.md" "functional,edge,error" "comprehensive"
```

## Test Case Types
- **Functional Tests**: Happy path scenarios
- **Edge Cases**: Boundary conditions
- **Error Handling**: Negative scenarios  
- **Integration Tests**: System interactions
- **Performance Tests**: Load/stress testing
- **Accessibility Tests**: A11y compliance
- **Security Tests**: Vulnerability testing

## Generated Test Suite
```markdown
# Test Cases: [Story Title]

## TC-001: Happy Path Test
**Objective**: Verify basic todo creation works
**Steps**:
1. Open todo form
2. Enter valid todo title
3. Click submit
**Expected**: Todo appears in list

## TC-002: Edge Case Test  
**Objective**: Test empty title submission
**Steps**:
1. Open todo form
2. Leave title empty  
3. Click submit
**Expected**: Validation error shown
```