---
name: code-scaffold
description: Story için boilerplate kod ve component skeleton oluşturur
agent_access: developer
---

# Code Scaffolding Komutu

Bu komut Developer Agent tarafından user story için boilerplate kod ve temel yapı oluşturmak için kullanılır.

## Kullanım
```
/code-scaffold [story-file] [component-type] [patterns]
```

## Örnek Kullanım
```
/code-scaffold "stories/US-TODO-001.md" "form-component" "hooks,validation"
```

## Scaffold Outputs
- React component skeleton
- TypeScript interfaces
- Hook boilerplate
- Test file templates
- Story file structure
- CSS module template

## Generated Structure
```
src/components/TodoForm/
├── TodoForm.tsx
├── TodoForm.module.css
├── TodoForm.test.tsx
├── TodoForm.stories.tsx
├── index.ts
└── types.ts
```