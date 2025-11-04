// ✅ Tek Dosya Sunucu: Blurry Guess Game
// Express.js ile çalışır, Farcaster MiniApp için uygundur.
// Telifsiz ve AI-tabanlı örnek veri içerir.

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 🎬 Örnek Veri (Sinema Kategorisi)
const dataset = [
  {
    id: 1,
    category: "Sinema",
    name: "AI Actor 1",
    image_prompt:
      "portrait of a charismatic movie actor, cinematic lighting, ultra-realistic digital art, 8k resolution",
    hints: [
      "Dram türünde birçok filmde rol almıştır.",
      "Oscar ödülüne aday gösterilmiştir.",
      "Yüz ifadesiyle izleyiciyi etkilemesiyle bilinir.",
    ],
  },
  {
    id: 2,
    category: "Sinema",
    name: "AI Actress 2",
    image_prompt:
      "portrait of a glamorous actress in a red dress, studio lighting, cinematic background, detailed digital art",
    hints: [
      "Romantik komedilerde sıkça rol almıştır.",
      "Moda ikonları arasında gösterilmektedir.",
      "Kırmızı halıda tarzıyla dikkat çeker.",
    ],
  },
  {
    id: 3,
    category: "Sinema",
    name: "AI Director 3",
    image_prompt:
      "portrait of a thoughtful film director holding a camera, moody lighting, cinematic realism, 4k",
    hints: [
      "Aksiyon ve bilim kurgu filmleriyle tanınır.",
      "Kameranın arkasında büyü yaratır.",
      "Sinemada yenilikçi çekim teknikleri kullanır.",
    ],
  },
  {
    id: 4,
    category: "Sinema",
    name: "AI Actor 4",
    image_prompt:
      "portrait of a middle-aged actor wearing a tuxedo, golden hour lighting, cinematic lens flare, 8k",
    hints: [
      "Birçok uluslararası festivalde ödül almıştır.",
      "Karakter rolleriyle tanınır.",
      "Sahne tecrübesi de bulunmaktadır.",
    ],
  },
  {
    id: 5,
    category: "Sinema",
    name: "AI Actress 5",
    image_prompt:
      "portrait of an elegant actress on movie set, soft lighting, bokeh background, ultra detailed digital painting",
    hints: [
      "Genellikle tarihi filmlerde oynamaktadır.",
      "Sesi ve diksiyonu ile beğeni toplar.",
      "Bir tiyatro geçmişi vardır.",
    ],
  },
  {
    id: 6,
    category: "Sinema",
    name: "AI Cinematographer 6",
    image_prompt:
      "portrait of a cinematographer with film camera, dramatic studio lighting, cinematic realism, detailed face",
    hints: [
      "Birçok ünlü yönetmenle çalışmıştır.",
      "Renk paletleriyle fark yaratır.",
      "Sinematografi ödülleri kazanmıştır.",
    ],
  },
  {
    id: 7,
    category: "Sinema",
    name: "AI Actor 7",
    image_prompt:
      "portrait of a smiling young actor, studio photo, cinematic tones, ultra-realistic 8k",
    hints: [
      "Genç yaşına rağmen başrol oynamıştır.",
      "Komedi filmleriyle öne çıkar.",
      "Sosyal medyada büyük bir takipçi kitlesine sahiptir.",
    ],
  },
  {
    id: 8,
    category: "Sinema",
    name: "AI Actress 8",
    image_prompt:
      "portrait of a young actress with curly hair, soft studio lighting, realistic portrait photography",
    hints: [
      "Bağımsız filmlerde rol almaktadır.",
      "Yönetmenliğe adım atmayı planlamaktadır.",
      "Performanslarıyla eleştirmenlerden tam not alır.",
    ],
  },
  {
    id: 9,
    category: "Sinema",
    name: "AI Actor 9",
    image_prompt:
      "portrait of a rugged action movie star, strong jawline, cinematic lighting, intense expression, 8k",
    hints: [
      "Aksiyon sahnelerinde dublör kullanmaz.",
      "Kendi dövüş sahnelerini çeker.",
      "Bir dövüş sanatında ustadır.",
    ],
  },
  {
    id: 10,
    category: "Sinema",
    name: "AI Actress 10",
    image_prompt:
      "portrait of a classic movie star in 1950s style, monochrome lighting, elegant, cinematic realism",
    hints: [
      "Klasik filmleriyle efsaneleşmiştir.",
      "Sinema tarihinin unutulmaz isimlerinden biridir.",
      "Nostaljik tarzıyla tanınır.",
    ],
  },
];

// 🎯 API Uç Noktaları
app.get("/", (req, res) => {
  res.send("Blurry Guess Game backend aktif ✅");
});

// Rastgele karakter
app.get("/guess", (req, res) => {
  const random = dataset[Math.floor(Math.random() * dataset.length)];
  res.json(random);
});

// 🚀 Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
