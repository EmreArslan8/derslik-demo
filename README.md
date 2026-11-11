# Derslik — demo / MVP

Öğrenciler için yapay zekâ araçlarıyla (Gemini, ChatGPT, Claude) uyumlu ders çalışma platformu. Tüm veriler örnektir; derleme adımı yoktur.

## Çalıştırma

```bash
python3 -m http.server 8000   # ardından http://localhost:8000
```

## Akış

Link ilk açıldığında hazır bir demo hesabıyla **doğrudan panel** gelir. Tanıtım ve kayıt akışı isteğe bağlıdır: hesap menüsündeki "Tanıtım sayfası" ya da "Çıkış yap" ile açılır.

1. **Tanıtım** (`#/hosgeldin`) — özellikler, nasıl çalışır, yorumlar, fiyatlandırma, SSS. "Demoyu gez" hazır bir hesapla doğrudan panele girer.
2. **Giriş / kayıt** (`#/giris`) — form doğrulama, Google ile devam (demo), KVKK onayı.
3. **İlk kurulum** (`#/baslangic`) — sınıf, alan, hedef, zorlanılan dersler + günlük süre, yapay zekâ tercihi; sonunda kişiye özel ilk haftalık plan oluşturulur.
4. Çıkış yaptıktan sonra uygulama sayfaları tanıtıma yönlenir ve otomatik giriş tekrar yapılmaz; çıkış, tarayıcıdaki demo verisini temizler.

## Ekranlar

| Ekran | İçerik |
|---|---|
| **Ödevler** | Bekleyen / teslim edilen / notlanan sekmeleri, kalan süre, ödev detayı, dosya yükleme, otomatik kaydedilen taslak, ölçütlere göre yapay zekâ ön kontrolü, teslim ve geri alma, öğretmen geri bildirimi |
| **Profil** | Seviye/XP, seri, 6 aylık çalışma takvimi, sınıf sıralaması, başarımlar, son etkinlikler |
| **Ayarlar** | Hesap, çalışma hedefi, yapay zekâ sağlayıcısı + anlatım tarzı + proxy adresi ve bağlantı testi, bildirimler, tema, veri indirme / sıfırlama / hesap silme |
| **Panel** | Kaldığın video, pomodoro odak sayacı, haftalık çalışma grafiği, bugünün planı, günün sorusu, tekrar bekleyen kartlar, zayıf konular, canlı çalışma odaları |
| **Dersler** | Kapak görselli ders kartları, filtre, video şeridi |
| **Ders detayı** | Konu listesinden konu değiştirme, "Konuyu tamamladım" ile ilerleme, video oynatıcı (bölümler, eşzamanlı döküm, altyazı, hız), yapay zekâ video özeti, ders notu (metin seç → asistana sor), konu asistanı |
| **Asistan** | Açıkla / Sorularla / Özetle modları, görsel ekleme, sohbet geçmişi, kopyala · yeniden üret · karta dönüştür, takip önerileri |
| **Soru Çöz** | Fotoğraf yükle / sürükle-bırak (mobilde kamera), tarama animasyonu, önce tahmin et, adım adım çözüm, tuzak şık uyarısı |
| **Kartlar** | Aralıklı tekrar (basit SM-2), 3B çevirme, klavye kısayolları, yapay zekâ ile kart ekleme; ilerleme tarayıcıda saklanır |
| **Quiz** | Ders / odak / zorluk / süre ayarı, soru başına sayaç, açıklamalar, sonuç ekranı |
| **Plan** | Haftalık takvim, tamamlama işaretleme, ders dağılımı, yapay zekâ ile yeniden planlama |
| **Analiz** | TYT/AYT net gelişimi (hover ipucu + tablo görünümü), ders bazında son deneme, konu hâkimiyeti ısı haritası, yorum |
| **Çalışma odaları** | Canlı odalar, ortak pomodoro, katılımcılar, oda sohbeti |

Genel: ⌘K / Ctrl+K komut paleti, açık/koyu tema, bildirimler, hesap menüsü, 404 sayfası, mobilde alt sekme çubuğu ve menü. İlerleme (plan, kartlar, teslimler, tamamlanan konular, ayarlar) tarayıcıda `localStorage` ile saklanır.

## Yapay zekâ katmanı

`js/ai.js` sağlayıcıdan bağımsızdır; arayüz yalnızca `AI.chat`, `AI.solve`, `AI.generateQuiz`, `AI.generateCards`, `AI.generatePlan` çağırır.

- `proxyUrl` boşken **demo yanıtları** gösterilir.
- Gerçek modele bağlamak için API anahtarlarını tutan küçük bir sunucu uç noktası yazıp `AI.config.proxyUrl` alanına verin. Uç nokta `{ provider, body }` alır, `body`'yi ilgili API'ye (Gemini `generateContent`, OpenAI `chat/completions`, Anthropic `messages`) iletir ve `{ text }` döndürür. İstek gövdeleri `adapters` içinde hazırdır.
- Anahtarları tarayıcı koduna koymayın.

## Dosyalar

```
index.html          kabuk (menü, üst çubuk, palet, bildirimler)
css/styles.css      tokenlar, tema, ortak bileşenler
css/views.css       ekranlara özel stiller
js/data.js          örnek veri
js/ai.js            sağlayıcı katmanı + demo yanıtları
js/core.js          yönlendirme, tema, komut paleti, odak sayacı, yardımcılar
js/views/*.js       ekranlar
img/                görseller
```

## Görseller

Fotoğraflar [Unsplash](https://unsplash.com) lisansıyla kullanılmıştır (ders kapakları, video küçük resimleri, oda görselleri, profil fotoğrafları). Gerçek üründe kendi görsellerinizle değiştirin.
