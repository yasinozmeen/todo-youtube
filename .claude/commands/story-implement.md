---
name: story-implement
description: User story'yi tam implementation ile hayata geçirir
agent_access: developer
---

# Story Implementation Komutu

Bu komut Developer Agent tarafından user story'yi complete implementation ile develop etmek için kullanılır.

## Kullanım
```
/story-implement [story-file] [tech-stack] [testing-level]
```

## Örnek Kullanım
```
/story-implement "stories/US-TODO-001.md" "react-typescript" "comprehensive"
```

## Implementation Process
1. **Story Analysis**: Acceptance criteria'yı analiz eder
2. **Architecture Design**: Component structure tasarlar
3. **Code Generation**: Production-ready kod yazar
4. **Test Creation**: Unit ve integration testleri yazar
5. **Documentation**: Code documentation oluşturur

## Çıktı Deliverables
- Complete component implementation
- TypeScript interfaces
- Unit tests (>80% coverage)
- Integration tests
- Documentation
- Performance benchmarks

## Quality Standards
- SOLID principles
- Clean code practices
- TypeScript strict mode
- Responsive design
- Accessibility compliance