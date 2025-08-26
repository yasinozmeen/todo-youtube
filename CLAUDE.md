# Todo Projesi - Claude Yönergeleri

## Kod Standartları

### JavaScript/TypeScript
- Değişken isimlendirme: camelCase kullan (örn: `videoTitle`, `userComment`)
- Fonksiyon isimlendirme: camelCase, fiil ile başla (örn: `fetchVideoData`, `updateUserProfile`)
- Const isimlendirme: UPPER_SNAKE_CASE (örn: `API_BASE_URL`, `MAX_VIDEO_LENGTH`)
- Arrow function'ları tercih et
- Async/await kullan, promise chain'lerden kaçın
- Single quotes (') kullan, double quotes yerine
- Semicolon kullan
- 2 space indentation

### React/Next.js
- Functional component'leri tercih et
- Hook'ları component'in üst kısmında grupla
- Props için TypeScript interface'leri tanımla
- Component isimlendirme: PascalCase (örn: `VideoCard`, `UserProfile`)
- Dosya isimlendirme: PascalCase component'ler için, camelCase utility'ler için

### CSS/Styling
- Tailwind CSS kullan
- Responsive tasarım öncelikli yaklaşım (mobile-first)
- Component-based styling
- Consistent spacing (4, 8, 16, 24, 32px)

### Proje Yapısı
```
src/
├── components/         # Yeniden kullanılabilir UI component'leri
├── pages/             # Next.js sayfaları
├── hooks/             # Custom React hook'ları
├── utils/             # Yardımcı fonksiyonlar
├── types/             # TypeScript tip tanımları
├── styles/            # Global CSS dosyaları
└── constants/         # Sabitler ve yapılandırma
```

### Commit Kuralları
- Türkçe commit mesajları
- Format: `type: kısa açıklama`
- Types: feat, fix, docs, style, refactor, test, chore
- Örnek: `feat: video yükleme özelliği eklendi`

### Test Kuralları
- Jest ve React Testing Library kullan
- Unit test'ler component'ler için zorunlu
- Test dosyası isimlendirme: `Component.test.tsx`

### Performans
- Image optimization için Next.js Image component'i kullan
- Lazy loading uygula
- Bundle size'ı düşük tut
- Memoization kullan (React.memo, useMemo, useCallback)

### Güvenlik
- API key'leri environment variable'larda sakla
- Input validation uygula
- XSS koruması için sanitization kullan

## Geliştirme Komutları
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run test` - Test'leri çalıştır
- `npm run lint` - Linting kontrolü
- `npm run type-check` - TypeScript kontrolü

## Test Kullanıcıları
- Test kullanıcıları için kendi Supabase projenizde hesap oluşturun
- Production'da gerçek kullanıcı bilgilerini paylaşmayın

## -
- Storyleri güncel tut, Storylerde tasklari ilerlettikçe gerekli story güncellemelerini yap.
