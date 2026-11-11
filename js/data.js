/* Mock veri — gerçek bir backend bağlandığında bu dosya API çağrılarıyla değiştirilir. */
window.DB = {
  student: {
    name: "Elif",
    fullName: "Elif Kaya",
    grade: "11. sınıf",
    track: "Sayısal",
    avatar: "elif",
    school: "Kadıköy Anadolu Lisesi",
    streak: 12,
    xp: 4280,
    level: 14,
    rank: 37,
    goalMinutes: 90,
    week: [
      { d: "Pzt", m: 74 },
      { d: "Sal", m: 102 },
      { d: "Çar", m: 48 },
      { d: "Per", m: 95 },
      { d: "Cum", m: 61 },
      { d: "Cmt", m: 128 },
      { d: "Paz", m: 37 },
    ],
  },

  people: {
    elif: { name: "Elif Kaya", av: "elif" },
    murat: { name: "Murat Demir", av: "murat", role: "Matematik öğretmeni" },
    selin: { name: "Selin Aydın", av: "selin", role: "Fizik öğretmeni" },
    can: { name: "Can Yıldız", av: "can", role: "Kimya öğretmeni" },
    deniz: { name: "Deniz Koç", av: "deniz", role: "Biyoloji öğretmeni" },
    ayse: { name: "Ayşe Polat", av: "ayse", role: "Edebiyat öğretmeni" },
    oguz: { name: "Oğuz Şahin", av: "oguz", role: "Tarih öğretmeni" },
    ege: { name: "Ege Yılmaz", av: "ege" },
    zeynep: { name: "Zeynep Arı", av: "zeynep" },
    mert: { name: "Mert Öz", initials: "MÖ" },
    ada: { name: "Ada Tekin", initials: "AT" },
    kaan: { name: "Kaan Er", initials: "KE" },
    nil: { name: "Nil Su", initials: "NS" },
  },

  courses: [
    {
      id: "matematik", name: "Matematik", code: "MAT-11", hue: "#178A6A", hueDark: "#2A9F7D",
      progress: 0.64, teacher: "murat", cover: "c-matematik",
      blurb: "Limit, türev ve integral. AYT matematiğin en çok soru çıkan üç ünitesi.",
      topics: [
        { id: "limit", name: "Limit ve süreklilik", done: true, mins: 40 },
        { id: "turev", name: "Türev: tanım ve kurallar", done: false, mins: 55, current: true },
        { id: "turev-uyg", name: "Türevin uygulamaları", done: false, mins: 60 },
        { id: "integral", name: "Belirsiz integral", done: false, mins: 50 },
      ],
    },
    {
      id: "fizik", name: "Fizik", code: "FİZ-11", hue: "#3B6FD4", hueDark: "#5A86E6",
      progress: 0.42, teacher: "selin", cover: "c-fizik",
      blurb: "Elektrik ve manyetizma: Coulomb'dan sığaçlara kadar.",
      topics: [
        { id: "vektor", name: "Vektörler", done: true, mins: 30 },
        { id: "elektrik", name: "Elektriksel kuvvet ve alan", done: false, mins: 45, current: true },
        { id: "potansiyel", name: "Elektriksel potansiyel", done: false, mins: 45 },
        { id: "kondansator", name: "Sığaçlar", done: false, mins: 35 },
      ],
    },
    {
      id: "kimya", name: "Kimya", code: "KİM-11", hue: "#D9822B", hueDark: "#CF7A25",
      progress: 0.55, teacher: "can", cover: "c-kimya",
      blurb: "Gazlar, çözeltiler ve tepkime hızları. Hesap ağırlıklı ünite.",
      topics: [
        { id: "mol", name: "Mol kavramı", done: true, mins: 35 },
        { id: "gazlar", name: "Gazlar", done: true, mins: 50 },
        { id: "cozeltiler", name: "Sıvı çözeltiler", done: false, mins: 45, current: true },
        { id: "hiz", name: "Tepkime hızları", done: false, mins: 40 },
      ],
    },
    {
      id: "biyoloji", name: "Biyoloji", code: "BİY-11", hue: "#B0407A", hueDark: "#C25590",
      progress: 0.31, teacher: "deniz", cover: "c-biyoloji",
      blurb: "İnsan fizyolojisi: sinir, endokrin ve dolaşım sistemleri.",
      topics: [
        { id: "sinir", name: "Sinir sistemi", done: true, mins: 50 },
        { id: "endokrin", name: "Endokrin sistem", done: false, mins: 40, current: true },
        { id: "dolasim", name: "Dolaşım sistemi", done: false, mins: 45 },
      ],
    },
    {
      id: "edebiyat", name: "Türk Dili ve Edebiyatı", short: "Edebiyat", code: "TDE-11", hue: "#8A5A3B", hueDark: "#B07D58",
      progress: 0.48, teacher: "ayse", cover: "c-edebiyat",
      blurb: "Tanzimat'tan Millî Edebiyat'a: dönemler, yazarlar, eserler.",
      topics: [
        { id: "tanzimat", name: "Tanzimat edebiyatı", done: true, mins: 40 },
        { id: "servet", name: "Servet-i Fünun", done: false, mins: 40, current: true },
        { id: "milli", name: "Millî edebiyat", done: false, mins: 45 },
      ],
    },
    {
      id: "tarih", name: "Tarih", code: "TAR-11", hue: "#5A4E9A", hueDark: "#8679C4",
      progress: 0.22, teacher: "oguz", cover: "c-tarih",
      blurb: "Değişen dünya dengeleri ve sanayi devrimiyle gelen yeni düzen.",
      topics: [
        { id: "degisim", name: "Değişen dünya dengeleri", done: true, mins: 35 },
        { id: "sanayi", name: "Sanayi devrimi", done: false, mins: 40, current: true },
        { id: "ulus", name: "Uluslararası ilişkiler", done: false, mins: 40 },
      ],
    },
  ],

  videos: [
    {
      id: "v-turev", course: "matematik", topic: "turev", title: "Türev: teğetin eğiminden kurallara", dur: "18:42", secs: 1122, img: "v-turev", watched: 0.58,
      chapters: [
        { t: 0, s: "Ortalama değişim hızı" },
        { t: 214, s: "Limit ile türev tanımı" },
        { t: 486, s: "Kuvvet, çarpım, bölüm kuralları" },
        { t: 702, s: "Zincir kuralı" },
        { t: 980, s: "Sınavda sık yapılan hatalar" },
      ],
      summary: [
        "Türev, teğet doğrusunun eğimi ve anlık değişim hızıdır.",
        "f′(a) = lim h→0 [f(a+h) − f(a)] / h tanımı her kuralın kaynağıdır.",
        "Zincir kuralında içteki fonksiyonun türevini çarpmak unutulmamalı.",
        "Türevlenebilen fonksiyon süreklidir; tersi doğru değildir (|x| örneği).",
      ],
      transcript: [
        { t: 640, s: "Şimdi çarpım kuralına bir örnekle bakalım: x² · sin x." },
        { t: 672, s: "Birincinin türevi çarpı ikinci, artı birinci çarpı ikincinin türevi." },
        { t: 702, s: "Gelelim zincir kuralına. Bu, sınavda en çok hata yapılan yer." },
        { t: 731, s: "(3x − 1)⁴ ifadesinde dış fonksiyon dördüncü kuvvet, iç fonksiyon 3x − 1." },
        { t: 768, s: "Dıştakinin türevini alıyoruz, içi olduğu gibi bırakıyoruz: 4(3x − 1)³." },
        { t: 801, s: "Ve en önemli adım: içtekinin türevi olan 3 ile çarpıyoruz." },
      ],
    },
    { id: "v-elektrik", course: "fizik", topic: "elektrik", title: "Coulomb yasası ve alan çizgileri", dur: "14:05", secs: 845, img: "v-uzay", watched: 0.2 },
    { id: "v-cozelti", course: "kimya", topic: "cozeltiler", title: "Molarite: üç adımda çözelti hesabı", dur: "11:30", secs: 690, img: "v-lab", watched: 0 },
    { id: "v-sinir", course: "biyoloji", topic: "endokrin", title: "Hormonlar ve geri bildirim döngüleri", dur: "16:12", secs: 972, img: "v-beyin", watched: 0 },
    { id: "v-sanayi", course: "tarih", topic: "sanayi", title: "Sanayi devrimi: buhar, kömür ve şehir", dur: "12:48", secs: 768, img: "v-arsiv", watched: 0 },
    { id: "v-alan", course: "fizik", topic: "potansiyel", title: "Potansiyel enerji ve iş", dur: "13:20", secs: 800, img: "v-nebula", watched: 0 },
  ],

  notes: {
    turev: {
      lead: "Bir fonksiyonun bir noktadaki türevi, o noktadaki anlık değişim hızıdır; grafikte teğet doğrusunun eğimine karşılık gelir.",
      blocks: [
        { h: "Tanım", f: "f′(a) = lim h→0 [ f(a+h) − f(a) ] / h", p: "Limit varsa fonksiyon a noktasında türevlenebilirdir. Türevlenebilen her fonksiyon o noktada süreklidir; tersi her zaman doğru değildir (örnek: |x|, x = 0)." },
        { h: "Temel kurallar", list: ["(c)′ = 0", "(xⁿ)′ = n·xⁿ⁻¹", "(f ± g)′ = f′ ± g′", "(f·g)′ = f′g + fg′", "(f / g)′ = (f′g − fg′) / g²"] },
        { h: "Zincir kuralı", f: "(f ∘ g)′(x) = f′(g(x)) · g′(x)", p: "İç içe fonksiyonlarda önce dıştakinin türevi alınır, içteki aynen yazılır, sonra içtekinin türeviyle çarpılır." },
      ],
    },
    elektrik: {
      lead: "Yüklü cisimler birbirine uzaklığın karesiyle ters orantılı bir kuvvet uygular.",
      blocks: [
        { h: "Coulomb yasası", f: "F = k · q₁q₂ / d²", p: "k ≈ 9·10⁹ N·m²/C². Aynı işaretli yükler iter, zıt işaretliler çeker." },
        { h: "Elektrik alan", f: "E = F / q = k · Q / d²", p: "Alan çizgileri pozitif yükten çıkar, negatif yüke girer. Çizgilerin sık olduğu yerde alan şiddetlidir." },
      ],
    },
    cozeltiler: {
      lead: "Çözelti derişimi, belirli miktar çözeltide ne kadar madde çözündüğünü anlatır.",
      blocks: [
        { h: "Molarite", f: "M = n / V(L)", p: "Hacim, çözücünün değil çözeltinin hacmidir." },
        { h: "Seyreltme", f: "M₁ · V₁ = M₂ · V₂", p: "Su eklemek mol sayısını değiştirmez, yalnızca hacmi artırır." },
      ],
    },
  },

  weak: [
    { course: "matematik", topic: "Zincir kuralı", score: 0.48 },
    { course: "fizik", topic: "Elektrik alan çizgileri", score: 0.55 },
    { course: "kimya", topic: "Derişim birimleri", score: 0.61 },
  ],

  dailyQuestion: {
    course: "matematik",
    q: "f(x) = (3x − 1)⁴ ise f′(1) kaçtır?",
    options: ["32", "48", "96", "128"],
    answer: 2,
    why: "Zincir kuralı: f′(x) = 4(3x − 1)³ · 3 = 12(3x − 1)³. x = 1 için 12 · 2³ = 96.",
  },

  bank: {
    matematik: [
      { q: "f(x) = x³ − 2x ise f′(2) kaçtır?", o: ["8", "10", "12", "14"], a: 1, why: "f′(x) = 3x² − 2 → 3·4 − 2 = 10." },
      { q: "f(x) = sin(2x) için f′(0) kaçtır?", o: ["0", "1", "2", "−2"], a: 2, why: "f′(x) = 2cos(2x) → 2·cos0 = 2." },
      { q: "f(x) = √x fonksiyonunun x = 4'teki türevi kaçtır?", o: ["1/2", "1/4", "2", "1/8"], a: 1, why: "f′(x) = 1/(2√x) → 1/(2·2) = 1/4." },
      { q: "f(x) = x² · eˣ ise f′(0) kaçtır?", o: ["0", "1", "2", "e"], a: 0, why: "Çarpım kuralı: 2x·eˣ + x²·eˣ; x = 0 için 0." },
      { q: "y = (x² + 1)³ ise dy/dx, x = 1 için kaçtır?", o: ["12", "24", "36", "48"], a: 1, why: "3(x²+1)²·2x → 3·4·2 = 24." },
      { q: "f(x) = ln(x²) için f′(e) kaçtır?", o: ["1/e", "2/e", "2e", "e²"], a: 1, why: "ln(x²) = 2ln x → f′ = 2/x → 2/e." },
    ],
    fizik: [
      { q: "Yükler sabitken aradaki uzaklık 2 katına çıkarsa Coulomb kuvveti nasıl değişir?", o: ["2 katına çıkar", "Yarıya iner", "4'te 1'ine iner", "Değişmez"], a: 2, why: "F ∝ 1/d²; d → 2d iken F → F/4." },
      { q: "Elektrik alanın SI birimi aşağıdakilerden hangisidir?", o: ["N/C", "C/N", "J/C", "N·m"], a: 0, why: "E = F/q olduğundan birimi N/C'dir (V/m ile eşdeğer)." },
      { q: "Pozitif bir noktasal yükün alan çizgileri için hangisi doğrudur?", o: ["Yüke doğru yönelir", "Yükten dışarı doğru yönelir", "Yükün etrafında döner", "Alan oluşmaz"], a: 1, why: "Alan çizgileri pozitif yükten çıkar." },
      { q: "q yüklü cisim E şiddetli alanda F kuvvetini hissediyor. Yük 3q olursa kuvvet?", o: ["F/3", "F", "3F", "9F"], a: 2, why: "F = qE; yük 3 katına çıkınca kuvvet de 3 katına çıkar." },
    ],
    kimya: [
      { q: "0,5 mol NaOH 250 mL çözeltide çözülürse derişim kaç M olur?", o: ["0,5", "1", "2", "4"], a: 2, why: "M = n / V = 0,5 / 0,25 = 2 M." },
      { q: "Hangisi koligatif bir özellik değildir?", o: ["Donma noktası alçalması", "Kaynama noktası yükselmesi", "Ozmotik basınç", "Renk"], a: 3, why: "Koligatif özellikler tanecik sayısına bağlıdır; renk değildir." },
      { q: "Kütlece %20'lik 200 g şekerli suda kaç g şeker vardır?", o: ["20", "40", "80", "160"], a: 1, why: "200 · 0,20 = 40 g." },
      { q: "2 M 100 mL çözeltiye 300 mL su eklenirse yeni derişim?", o: ["0,25 M", "0,5 M", "1 M", "1,5 M"], a: 1, why: "M₁V₁ = M₂V₂ → 2·100 = M₂·400 → 0,5 M." },
    ],
  },

  decks: [
    {
      id: "turev", course: "matematik", name: "Türev kuralları",
      cards: [
        { f: "(xⁿ)′ = ?", b: "n · xⁿ⁻¹" },
        { f: "(f · g)′ = ?", b: "f′g + fg′" },
        { f: "(f / g)′ = ?", b: "(f′g − fg′) / g²" },
        { f: "Zincir kuralı", b: "(f ∘ g)′(x) = f′(g(x)) · g′(x)" },
        { f: "(sin x)′ = ?", b: "cos x" },
        { f: "(eˣ)′ = ?", b: "eˣ" },
        { f: "(ln x)′ = ?", b: "1 / x" },
        { f: "Türevlenebilir ⇒ ?", b: "Süreklidir (tersi her zaman doğru değil)" },
      ],
    },
    {
      id: "elektrik", course: "fizik", name: "Elektrostatik",
      cards: [
        { f: "Coulomb yasası", b: "F = k · q₁q₂ / d²" },
        { f: "k sabiti", b: "≈ 9 · 10⁹ N·m²/C²" },
        { f: "Elektrik alan formülü", b: "E = k · Q / d²" },
        { f: "Alan çizgileri nereden çıkar?", b: "Pozitif yükten çıkar, negatif yüke girer" },
        { f: "Elektrik alanın birimi", b: "N/C (= V/m)" },
      ],
    },
    {
      id: "cozelti", course: "kimya", name: "Çözeltiler",
      cards: [
        { f: "Molarite", b: "M = n / V (L)" },
        { f: "Seyreltme bağıntısı", b: "M₁V₁ = M₂V₂" },
        { f: "Koligatif özellikler neye bağlıdır?", b: "Çözünen tanecik sayısına" },
        { f: "Kütlece yüzde", b: "(çözünen kütlesi / çözelti kütlesi) · 100" },
      ],
    },
    {
      id: "servet", course: "edebiyat", name: "Servet-i Fünun",
      cards: [
        { f: "Topluluğun yayın organı", b: "Servet-i Fünun dergisi" },
        { f: "Mai ve Siyah'ın yazarı", b: "Halit Ziya Uşaklıgil" },
        { f: "Sanat anlayışı", b: "Sanat için sanat" },
        { f: "Şiirde öncü isim", b: "Tevfik Fikret" },
      ],
    },
  ],

  /* Deneme sınavı sonuçları (net) */
  exams: [
    { id: "d1", name: "Deneme 1", date: "14 Eyl", tyt: { tr: 27.5, sos: 11.25, mat: 22.5, fen: 9.5 }, ayt: { mat: 17.5, fiz: 5.25, kim: 6.5, biy: 7.25 } },
    { id: "d2", name: "Deneme 2", date: "28 Eyl", tyt: { tr: 29, sos: 12.5, mat: 24.75, fen: 10.25 }, ayt: { mat: 19.25, fiz: 5.75, kim: 7, biy: 7 } },
    { id: "d3", name: "Deneme 3", date: "12 Eki", tyt: { tr: 28.25, sos: 13, mat: 23.5, fen: 11.5 }, ayt: { mat: 18.5, fiz: 6.5, kim: 7.75, biy: 8.25 } },
    { id: "d4", name: "Deneme 4", date: "19 Eki", tyt: { tr: 30.5, sos: 13.75, mat: 26.25, fen: 12 }, ayt: { mat: 21.75, fiz: 6.25, kim: 8.5, biy: 8.5 } },
    { id: "d5", name: "Deneme 5", date: "26 Eki", tyt: { tr: 31.25, sos: 14.5, mat: 28.5, fen: 13.25 }, ayt: { mat: 23.25, fiz: 7.5, kim: 8.25, biy: 9 } },
    { id: "d6", name: "Deneme 6", date: "9 Kas", tyt: { tr: 32.75, sos: 14.25, mat: 30, fen: 14.5 }, ayt: { mat: 25.5, fiz: 8.25, kim: 9.5, biy: 9.75 } },
  ],
  examMax: { tyt: { tr: 40, sos: 20, mat: 40, fen: 20 }, ayt: { mat: 40, fiz: 14, kim: 13, biy: 13 } },
  examLabels: { tr: "Türkçe", sos: "Sosyal", mat: "Matematik", fen: "Fen", fiz: "Fizik", kim: "Kimya", biy: "Biyoloji" },

  /* Konu hâkimiyeti (0–1), son 6 hafta */
  mastery: {
    weeks: ["H1", "H2", "H3", "H4", "H5", "H6"],
    rows: [
      { topic: "Limit", course: "matematik", v: [0.42, 0.55, 0.61, 0.7, 0.78, 0.84] },
      { topic: "Türev kuralları", course: "matematik", v: [0.2, 0.31, 0.45, 0.52, 0.6, 0.66] },
      { topic: "Zincir kuralı", course: "matematik", v: [0.1, 0.18, 0.25, 0.33, 0.41, 0.48] },
      { topic: "Coulomb yasası", course: "fizik", v: [0.35, 0.4, 0.52, 0.58, 0.63, 0.71] },
      { topic: "Elektrik alan", course: "fizik", v: [0.15, 0.22, 0.3, 0.41, 0.5, 0.55] },
      { topic: "Gazlar", course: "kimya", v: [0.6, 0.66, 0.72, 0.75, 0.81, 0.86] },
      { topic: "Derişim", course: "kimya", v: [0.3, 0.38, 0.44, 0.5, 0.57, 0.61] },
      { topic: "Sinir sistemi", course: "biyoloji", v: [0.48, 0.5, 0.58, 0.63, 0.66, 0.7] },
    ],
  },

  /* Haftalık plan (varsayılan) — gün indeksi 0 = Pazartesi */
  plan: [
    { day: 0, start: "16:30", mins: 50, course: "matematik", title: "Türev kuralları — video + not", done: true },
    { day: 0, start: "17:40", mins: 30, course: "kimya", title: "Molarite soru çözümü", done: true },
    { day: 1, start: "16:30", mins: 45, course: "fizik", title: "Coulomb yasası — 20 soru", done: true },
    { day: 1, start: "17:30", mins: 25, course: "edebiyat", title: "Servet-i Fünun kartları", done: true },
    { day: 2, start: "16:30", mins: 50, course: "matematik", title: "Zincir kuralı — tekrar", done: false },
    { day: 2, start: "17:40", mins: 40, course: "biyoloji", title: "Endokrin sistem — not çıkarma", done: false },
    { day: 3, start: "16:30", mins: 30, course: "matematik", title: "Türev quiz (10 soru)", done: false },
    { day: 3, start: "17:10", mins: 45, course: "fizik", title: "Elektrik alan çizgileri", done: false },
    { day: 4, start: "16:30", mins: 40, course: "kimya", title: "Seyreltme problemleri", done: false },
    { day: 4, start: "17:30", mins: 30, course: "tarih", title: "Sanayi devrimi — video", done: false },
    { day: 5, start: "10:00", mins: 120, course: "matematik", title: "TYT deneme sınavı", done: false, exam: true },
    { day: 5, start: "14:00", mins: 45, course: "matematik", title: "Deneme yanlış analizi", done: false },
    { day: 6, start: "11:00", mins: 40, course: "edebiyat", title: "Millî edebiyat okuma", done: false },
  ],

  rooms: [
    { id: "kutuphane", name: "Sessiz kütüphane", img: "r-kutuphane", mode: "Pomodoro 50 / 10", topic: "Serbest", people: ["ege", "zeynep", "mert", "ada", "kaan"], live: 86 },
    { id: "ayt-mat", name: "AYT matematik maratonu", img: "r-odak", mode: "Pomodoro 25 / 5", topic: "Türev · İntegral", people: ["zeynep", "kaan", "nil"], live: 41 },
    { id: "kafe", name: "Grup çalışması", img: "r-kafe", mode: "Serbest", topic: "Soru paylaşımlı", people: ["ege", "ada", "mert", "nil"], live: 23 },
    { id: "gece", name: "Gece kuşları", img: "r-yuvarlak", mode: "Pomodoro 50 / 10", topic: "Serbest", people: ["kaan", "zeynep"], live: 54 },
    { id: "fen", name: "Fen bilimleri odası", img: "r-raf", mode: "Pomodoro 25 / 5", topic: "Fizik · Kimya · Biyoloji", people: ["ada", "ege", "nil"], live: 37 },
    { id: "sabah", name: "Sabah 07:00 kulübü", img: "r-masa", mode: "Pomodoro 50 / 10", topic: "Serbest", people: ["mert", "zeynep", "ege"], live: 12 },
  ],

  /* Soru çöz — örnek fotoğraflar */
  solveSamples: [
    {
      id: "s1", course: "matematik", topic: "Türev · Zincir kuralı",
      text: "f(x) = (x² + 3x)⁴ fonksiyonu veriliyor.\nBuna göre f′(1) değeri kaçtır?",
      options: ["256", "320", "1280", "5120"], answer: 2,
      steps: [
        { h: "Dış ve iç fonksiyonu ayır", p: "Dış: u⁴, iç: u = x² + 3x" },
        { h: "Dıştakinin türevini al", p: "(u⁴)′ = 4u³ → 4(x² + 3x)³" },
        { h: "İçtekinin türeviyle çarp", p: "(x² + 3x)′ = 2x + 3 → f′(x) = 4(x² + 3x)³ · (2x + 3)" },
        { h: "x = 1 yerine koy", p: "4 · 4³ · 5 = 4 · 64 · 5 = 1280" },
      ],
      final: "f′(1) = 1280 → C şıkkı",
      trap: "256 şıkkı, içtekinin türevi (2x + 3) çarpılmadığında bulunan sonuçtur.",
    },
    {
      id: "s2", course: "fizik", topic: "Elektrostatik · Coulomb",
      text: "Aralarında d uzaklığı bulunan q ve 2q yükleri\nbirbirine F büyüklüğünde kuvvet uyguluyor.\nUzaklık 3d yapılırsa kuvvet kaç F olur?",
      options: ["F/9", "F/3", "3F", "9F"], answer: 0,
      steps: [
        { h: "Formülü yaz", p: "F = k · q₁q₂ / d²" },
        { h: "Değişeni belirle", p: "Yükler aynı, yalnızca uzaklık değişiyor: d → 3d" },
        { h: "Oranı kur", p: "F′ / F = d² / (3d)² = 1/9" },
      ],
      final: "F′ = F / 9 → A şıkkı",
    },
    {
      id: "s3", course: "kimya", topic: "Çözeltiler · Molarite",
      text: "0,4 mol NaCl ile hazırlanan 200 mL sulu\nçözeltiye 600 mL su ekleniyor.\nSon çözeltinin derişimi kaç M'dir?",
      options: ["0,25", "0,5", "1", "2"], answer: 1,
      steps: [
        { h: "İlk derişimi bul", p: "M₁ = 0,4 / 0,2 = 2 M" },
        { h: "Son hacmi bul", p: "V₂ = 200 + 600 = 800 mL" },
        { h: "Seyreltme bağıntısı", p: "2 · 200 = M₂ · 800 → M₂ = 0,5 M" },
      ],
      final: "0,5 M → B şıkkı",
    },
  ],

  history: [
    { id: "h1", title: "Zincir kuralı örnekleri", when: "Bugün" },
    { id: "h2", title: "Coulomb'da uzaklık neden kareli?", when: "Dün" },
    { id: "h3", title: "Servet-i Fünun özet", when: "Pzt" },
    { id: "h4", title: "Seyreltme problemi", when: "Geçen hafta" },
  ],

  notifications: [
    { who: "murat", text: "Türev ödevini yükledi: 12 soru, teslim Perşembe.", when: "12 dk", unread: true },
    { who: "zeynep", text: "seni “AYT matematik maratonu” odasına davet etti.", when: "1 sa", unread: true },
    { who: null, text: "13 kartın tekrar zamanı geldi.", when: "3 sa", unread: false },
    { who: "selin", text: "Deneme 6 sonuçların açıklandı.", when: "Dün", unread: false },
  ],

  assignments: [
    {
      id: "a1", course: "matematik", teacher: "murat", title: "Türev kuralları — 12 soruluk ödev", due: "2026-11-13T23:59", status: "bekliyor",
      desc: "Ders kitabı s. 84–86'daki 12 soruyu çöz. Her sorunun çözüm adımlarını göster; yalnızca cevap yazılan sorular yarım puan alır.",
      files: ["turev-odev.pdf"], points: 100,
      rubric: ["Doğru kural seçimi", "Adımların gösterilmesi", "Sonucun sadeleştirilmesi"],
    },
    {
      id: "a2", course: "fizik", teacher: "selin", title: "Sığaçlar — kavram haritası", due: "2026-11-12T17:00", status: "bekliyor",
      desc: "Sığa, yük, potansiyel farkı ve enerji kavramlarını bir kavram haritasında ilişkilendir. El çizimi fotoğrafı yeterli.",
      files: [], points: 50, rubric: ["Kavramların doğru bağlanması", "Formüllerin yer alması"],
    },
    {
      id: "a3", course: "edebiyat", teacher: "ayse", title: "Servet-i Fünun okuma notu", due: "2026-11-14T23:59", status: "bekliyor",
      desc: "Mai ve Siyah'tan seçtiğin bir bölüm üzerine 250–300 kelimelik okuma notu yaz. Dönemin sanat anlayışıyla ilişkilendir.",
      files: [], points: 100, rubric: ["Dönem özellikleriyle ilişki", "Yazım ve anlatım", "Özgün yorum"],
    },
    {
      id: "a4", course: "kimya", teacher: "can", title: "Molarite çalışma kâğıdı", due: "2026-11-07T23:59", status: "notlandı", grade: 88, submitted: "6 Kas",
      desc: "Çalışma kâğıdındaki 15 soruyu çöz.", files: ["molarite.pdf"], points: 100, rubric: [],
      feedback: "Seyreltme sorularında hacim birimini doğru çevirmişsin. 11. soruda kütlece yüzdeyi molariteyle karıştırmışsın; tekrar et.",
    },
    {
      id: "a5", course: "biyoloji", teacher: "deniz", title: "Sinir sistemi şeması", due: "2026-11-05T23:59", status: "teslim edildi", submitted: "4 Kas",
      desc: "Merkezi ve çevresel sinir sistemini gösteren bir şema hazırla.", files: [], points: 50, rubric: [],
    },
  ],

  achievements: [
    { id: "seri7", name: "Bir hafta", desc: "7 gün üst üste çalış", got: true, icon: "flame" },
    { id: "kart100", name: "Kart ustası", desc: "100 kart tekrar et", got: true, icon: "cards" },
    { id: "quiz10", name: "Quiz serisi", desc: "10 quiz'i %75 üzeri bitir", got: true, icon: "quiz" },
    { id: "gece", name: "Gece kuşu", desc: "22:00 sonrası 5 odak oturumu", got: false, p: 0.6, icon: "moon" },
    { id: "seri30", name: "Bir ay", desc: "30 gün üst üste çalış", got: false, p: 0.4, icon: "flame" },
    { id: "net100", name: "Üç haneli", desc: "TYT'de 100 net yap", got: false, p: 0.91, icon: "chart" },
  ],

  leaderboard: [
    { who: "zeynep", xp: 5120, school: "Kadıköy AL" },
    { who: "ege", xp: 4890, school: "Kadıköy AL" },
    { who: "elif", xp: 4280, school: "Kadıköy AL", me: true },
    { who: "kaan", xp: 4105, school: "Kadıköy AL" },
    { who: "ada", xp: 3770, school: "Kadıköy AL" },
    { who: "mert", xp: 3410, school: "Kadıköy AL" },
  ],

  targets: ["Boğaziçi · Bilgisayar Müh.", "ODTÜ · Elektrik-Elektronik Müh.", "İTÜ · Endüstri Müh.", "Hacettepe · Tıp", "Koç · Moleküler Biyoloji", "Henüz karar vermedim"],

  providers: [
    { id: "mock", name: "Demo (çevrimdışı)", note: "Yerel örnek yanıtlar" },
    { id: "gemini", name: "Gemini", note: "Google AI Studio anahtarı gerekir" },
    { id: "openai", name: "ChatGPT", note: "OpenAI API anahtarı gerekir" },
    { id: "claude", name: "Claude", note: "Anthropic API anahtarı gerekir" },
  ],
};
