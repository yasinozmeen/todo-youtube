---
name: test-suite-generate
description: Kapsamlı test suite oluşturur (unit, integration, e2e)
agent_access: developer
---

# Test Suite Generation Komutu

Bu komut Developer Agent tarafından comprehensive test suite oluşturmak için kullanılır.

## Kullanım
```
/test-suite-generate [component-path] [test-types] [coverage-target]
```

## Örnek Kullanım
```
/test-suite-generate "src/components/TodoForm" "unit,integration" "90%"
```

## Test Types
- **Unit Tests**: Component logic testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: User journey testing
- **Performance Tests**: Load and stress testing
- **Accessibility Tests**: A11y compliance testing

## Generated Tests
- Jest unit tests
- React Testing Library integration tests
- Cypress E2E tests
- Performance benchmarks
- Accessibility audits