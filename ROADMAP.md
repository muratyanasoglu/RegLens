## RegLens Özellik Önceliklendirmesi

Aşağıdaki sıralama, **harici tool / API entegrasyonu gerektirmeyen** ve mevcut mimariyle (Next.js + Prisma + mevcut AI katmanı) uygulanabilecek özellikleri, **en çok odaklanılması gerekenden en az odaklanması gerekene** doğru listeler.

---

### 1. Gelişmiş önceliklendirme skoru (Priority Score 2.0)

- **Neden önemli?** Doğrudan günlük iş akışını etkiler; hangi görevin önce yapılacağını akıllıca belirlemek hem risk azaltır hem de kullanıcıya “akıllı platform” hissi verir.  
- **Ne içerir?** Risk seviyesi + regülatör önemi + SLA + müşteri etkisi + audit yakınlığı gibi sinyallerden birleşik skor, dashboard’da ve görev listelerinde görünür.

---

### 2. Kişisel çalışma alanı (My Work) + gelişmiş filtreler

- **Neden önemli?** Kullanıcı her login olduğunda “bugün beni ne bekliyor?” sorusuna tek ekranda cevap verir; adoption ve memnuniyeti artırır.  
- **Ne içerir?** “Today / This Week / Overdue” panosu, kullanıcıya özel görev/kayıt filtresi, küçük özet metrikler.

---

### 3. Kanban / timeline görünümleri (Tasks & Evidence)

- **Neden önemli?** Aynı veriyi farklı kullanıcı tiplerine farklı görünümlerle sunmak (liste, kanban, timeline) ürünü daha esnek ve “enterprise-grade” hissettirir.  
- **Ne içerir?** Görevler için durum bazlı kanban, denetim periyotları için timeline, basit sürükle-bırak durum değişimi.

---

### 4. Otomasyon fırsatı önerileri (Automation Suggestions)

- **Neden önemli?** Kullanıcıya “platform benimle birlikte düşünüyor” hissi verir; küçük ama çarpıcı bir AI değeri.  
- **Ne içerir?** LLM ile görev/kanıt akışlarını tarayıp “şu üç adım otomatikleştirilebilir”, “şu görev tipine default şablon tanımla” gibi öneri kartları.

---

### 5. Regulator / konu ısı haritası (Regulation Heatmap & Topic Clusters)

- **Neden önemli?** Yönetim/üst düzey kullanıcılar için “nereden ne kadar baskı geliyor?” sorusuna görsel cevap verir; demo’da çok güçlü durur.  
- **Ne içerir?** Kuruma göre (FCA, SEC vb.) ve konuya göre (AML, siber, gizlilik) güncelleme yoğunluğu ve risk dağılımı; güncellemelerin konu bazlı kümelenmesi.

---

### 6. Çapraz çerçeve etki analizi (Cross-Framework Impact)

- **Neden önemli?** Aynı değişikliğin SOC 2, ISO 27001, GDPR vb. üzerindeki etkisini tek ekranda özetleyerek danışman / uyum ekiplerine ciddi zaman kazandırır.  
- **Ne içerir?** Bir güncelleme seçildiğinde, ilgili tüm framework ve kontrollerin listesi; LLM ile otomatik üretilmiş kısa “etki özeti”.

---

### 7. Inline yorumlar ve mention’lar (Collaboration 1.0)

- **Neden önemli?** E-posta trafiğini azaltır; görev/kanıt kartlarının üzerinde doğrudan iletişim kurmayı sağlar.  
- **Ne içerir?** Görev / Evidence kartı içinde yorum akışı, `@kullanıcı` mention, basit bildirim entegrasyonu (mevcut notification sistemini kullanarak).

---

### 8. Read-only denetçi modu (Auditor View)

- **Neden önemli?** Denetim dönemlerinde dış denetçiye kontrollü, sadece-okunur erişim vermek ürünü gerçek hayat senaryolarına daha uygun hale getirir.  
- **Ne içerir?** Özel rol tipi; belirli audit pack ve ilişkili görev/kanıtlara salt-okunur erişim; export butonları görünür, düzenleme butonları gizli.

---

### 9. Webhook tetikleyicileri (Event Hooks) – temel seviye

- **Neden önemli?** Harici entegrasyon yapmasak bile, “ileri seviye kullanıcılar için entegrasyon yüzeyi” oluşturur; future-proof tasarım.  
- **Ne içerir?** Basit bir ayar ekranı ile `task.created`, `evidence.approved`, `auditPack.finalized` gibi event’ler için URL tanımlama; HTTP POST ile payload gönderme.

---

### 10. Config-as-code ön izlemesi (Lightweight)

- **Neden önemli?** Büyük kurumsal müşteriler için uzun vadede gerekecek; ilk etapta sadece framework/control tanımlarını JSON/YAML içe/dışa aktarmak bile değerli.  
- **Ne içerir?** Framework ve kontrol setlerini dışa aktarma / içe alma; ileride CI/CD ile entegre edilebilecek hafif bir temel.

