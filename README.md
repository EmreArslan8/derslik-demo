# Derslik — demo / MVP

Öğrenciler için yapay zekâ araçlarıyla (Gemini, ChatGPT, Claude) uyumlu çalışan ders çalışma alanı. Tüm veriler örnektir (`js/data.js`); derleme adımı yoktur.

## Çalıştırma

```bash
python3 -m http.server 8000   # ardından http://localhost:8000
```

`index.html` doğrudan tarayıcıda da açılabilir.

## Ekranlar

| Ekran | İçerik |
|---|---|
| **Panel** | Kaldığın konu, haftalık çalışma grafiği + hedef çizgisi, günün sorusu, tekrar edilmesi gereken zayıf konular, yaklaşan işler, ders ilerlemeleri |
| **Dersler** | Ders kartları (stok görsel yerine ince çizgi SVG çizimler), filtre |
| **Ders detayı** | Konu listesi, ders notu (formüller, kurallar), yanında bağlama duyarlı konu asistanı; nottan metin seçip "Asistana sor" |
| **Asistan** | Açıkla / Sorularla (sokratik) / Özetle modları, ders bağlamı, model seçimi |
| **Quiz** | Ders + zorluk + soru sayısı → soru üretimi, her sorudan sonra açıklama, sonuç ekranı ve yanlışları asistanla çalışma |

Masaüstünde sol menü, mobilde alt sekme çubuğu kullanılır.

## Yapay zekâ katmanı

`js/ai.js` sağlayıcıdan bağımsızdır. Arayüz yalnızca `AI.chat()` ve `AI.generateQuiz()` çağırır.

- `proxyUrl` boşken **demo yanıtları** gösterilir (türev, zincir kuralı, Coulomb, molarite için örnek anlatımlar).
- Gerçek modele bağlamak için API anahtarlarını tutan küçük bir sunucu uç noktası yazıp `AI.config.proxyUrl` alanına verin. Uç nokta `{ provider, body }` alır, `body`'yi ilgili API'ye (Gemini `generateContent`, OpenAI `chat/completions`, Anthropic `messages`) iletir ve `{ text }` döndürür. İstek gövdeleri `adapters` içinde hazırdır.
- Anahtarları tarayıcı koduna koymayın.

## Dosyalar

```
index.html      iskelet + menü
css/styles.css  tasarım (cam kartlar, ince çizgiler, duyarlı yerleşim)
js/data.js      örnek öğrenci, ders, not, soru verisi
js/ai.js        sağlayıcı katmanı + demo yanıtları
js/app.js       yönlendirme ve ekranlar
```
