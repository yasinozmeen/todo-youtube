# Claude Code ile Todo App Geliştirme - Agent Workflow Örneği

Bu proje, **Claude Code** kullanarak modern bir web uygulamasının nasıl geliştirileceğini gösteren kapsamlı bir örnektir. Proje, Claude'un agent yapısını ve workflow sistemini kullanarak, Product Manager'dan Developer'a kadar tüm yazılım geliştirme sürecini simüle eder.

## 🤖 Claude Code Agent Workflow

Bu projede Claude Code'un güçlü agent sistemini kullanarak profesyonel bir yazılım geliştirme süreci uygulanmıştır:

### Agent Hiyerarşisi ve Görevleri

```
Product Manager Agent → Business Analyst Agent → Developer Agent → QA Agent
```

1. **Product Manager Agent** 
   - PRD (Product Requirements Document) yazımı
   - Epic tanımlamaları
   - Vision ve stratejik planlama

2. **Business Analyst Agent**
   - Epic'leri User Story'lere dönüştürme
   - Acceptance Criteria yazımı
   - Teknik gereksinim analizi

3. **Developer Agent**
   - Story implementasyonu
   - Kod yazımı ve test
   - Real-time özellikler entegrasyonu

4. **QA Agent**
   - Kod review
   - Test senaryoları
   - Quality assurance

### CLAUDE.md - Proje Yönergeleri

Projedeki **CLAUDE.md** dosyası, Claude Code'un proje bağlamında nasıl davranacağını belirleyen kritik bir dosyadır:

- **Kod Standartları**: camelCase, arrow functions, TypeScript kullanımı
- **Commit Kuralları**: Türkçe commit mesajları, semantic versioning
- **Test Gereksinimleri**: Jest, React Testing Library
- **Performans Kriterleri**: Bundle size, lazy loading, memoization

## 🚀 Geliştirilen Özellikler

### Epic: Todo App MVP
5 User Story başarıyla tamamlandı:

1. **US-TODO-001**: Authentication System ✅
2. **US-TODO-002**: Real-time Todo Creation ✅  
3. **US-TODO-003**: Todo Completion System ✅
4. **US-TODO-004**: Real-time Todo Deletion ✅
5. **US-TODO-005**: Production UI/UX ✅

### Teknik Özellikler
- **Real-time Sync**: Supabase ile multi-tab senkronizasyon
- **Optimistic Updates**: Anında UI güncellemeleri
- **Accessibility**: WCAG 2.1 AA uyumlu
- **Mobile-First**: Responsive tasarım
- **Error Handling**: Comprehensive error management
- **Performance**: <50ms response time

## 📁 Proje Yapısı

```
├── CLAUDE.md              # Claude Code proje yönergeleri
├── docs/
│   ├── agent-workflow.md  # Agent workflow dokümantasyonu
│   ├── prd-todo-app.md    # Product Requirements Document
│   └── epics-todo-app.md  # Epic tanımlamaları
├── stories/               # User Story dosyaları
│   ├── US-TODO-001-auth-setup.md
│   ├── US-TODO-002-todo-creation.md
│   ├── US-TODO-003-todo-completion.md
│   ├── US-TODO-004-todo-deletion.md
│   └── US-TODO-005-production-ui-ux.md
└── src/                   # Kaynak kodlar
```

## 🔧 Kurulum

### Gereksinimler
- Node.js 18+
- Supabase hesabı
- Claude Code (VS Code veya Cursor)

### Adımlar

1. **Bağımlılıkları yükle**
   ```bash
   npm install
   ```

2. **Environment değişkenleri**
   ```bash
   cp .env.local.example .env.local
   # .env.local dosyasını Supabase bilgilerinizle güncelleyin
   ```

3. **Supabase kurulumu**
   ```sql
   -- migrations/002_create_todos_table.sql dosyasını çalıştırın
   ```

4. **Geliştirme sunucusu**
   ```bash
   npm run dev
   ```

## 🎯 Claude Code Kullanım İpuçları

### Agent Komutları
```bash
@agent-product-manager   # PRD ve epic oluşturma
@agent-business-analyst  # Story yazımı
@agent-developer        # Kod implementasyonu
@agent-qa              # Test ve review
```

### Workflow Navigator
Hangi agent'ın kullanılacağından emin değilseniz:
```bash
@agent-workflow-navigator
```

### Best Practices
1. **CLAUDE.md dosyası oluşturun**: Proje standartlarınızı belirleyin
2. **Story-based development**: User story'ler üzerinden ilerleyin
3. **Agent chain kullanın**: PM → BA → Dev → QA workflow'u
4. **Test coverage**: Her story için test yazın
5. **Documentation**: Story dosyalarını güncel tutun

## 📊 Proje Metrikleri

- **Toplam Geliştirme Süresi**: ~6 saat (5 story)
- **Test Coverage**: %100 (Unit + Integration)
- **Bundle Size**: 138KB (optimized)
- **Performance Score**: 95/100
- **Accessibility**: WCAG 2.1 AA compliant

## 📺 Video Serisi

Bu projenin geliştirilme süreci YouTube'da canlı olarak kaydedilmiştir:

🎥 **[Claude Code ile Todo App Geliştirme - Video Playlist](https://www.youtube.com/playlist?list=PL3XNOLankzVctYKz5etdy2zf79J60LR7c)**

Videolarda görecekleriniz:
- Claude Code agent sisteminin gerçek zamanlı kullanımı
- Product Manager → Business Analyst → Developer → QA workflow'u
- Story-based development süreci

## 🔗 Kaynaklar

- [Claude Code Dokümantasyonu](https://docs.anthropic.com/claude-code)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Next.js 14](https://nextjs.org)

## 📝 Lisans

MIT

---

**Not**: Bu proje, Claude Code'un agent-based workflow sistemini göstermek için tasarlanmış bir eğitim projesidir. Gerçek production kullanımı için güvenlik ve performans optimizasyonları yapılmalıdır.