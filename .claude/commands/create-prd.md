---
name: create-prd
description: Todo app projesi için kapsamlı PRD (Product Requirements Document) oluşturur
agent_access: product-manager
---

# PRD Oluşturma Komutu

Bu komut Product Manager Agent tarafından todo uygulaması için detaylı PRD belgesi oluşturmak üzere kullanılır.

## Kullanım
```
/create-prd [proje-adı] [target-audience] [business-goals]
```

## Örnek Kullanım
```
/create-prd "Smart Todo App" "busy-professionals" "productivity,organization"
```

## İşlev
1. **Proje Analizi**: Verilen parametreleri analiz eder
2. **Market Araştırması**: Hedef kitle ve rekabet analizi yapar
3. **Feature Priortization**: Business value'ya göre önceliklendirir
4. **PRD Template**: Structured PRD belgesi oluşturur

## Çıktı Formatı
```markdown
# PRD: [Proje Adı]

## 1. Proje Özeti
- **Vision**: [Product vision]
- **Mission**: [Product mission] 
- **Success Metrics**: [KPIs]

## 2. Hedef Kitle
- **Primary Users**: [Ana kullanıcı segmenti]
- **User Personas**: [Detaylı persona profilleri]
- **Use Cases**: [Ana kullanım senaryoları]

## 3. MVP Özellikleri
- **Core Features**: [Temel özellikler]
- **Must-Have**: [Kritik özellikler]
- **Nice-to-Have**: [Gelecek sürüm özellikler]

## 4. Technical Constraints
- **Platform**: [Web/Mobile/Desktop]
- **Performance**: [Performance gereksinimleri]
- **Security**: [Güvenlik gereksinimleri]

## 5. Business Requirements
- **Revenue Model**: [Gelir modeli]
- **Go-to-Market**: [Pazarlama stratejisi]
- **Timeline**: [Proje timeline'ı]
```

## Sonraki Adımlar
PRD tamamlandıktan sonra `/generate-epics` komutu otomatik olarak çalıştırılır.