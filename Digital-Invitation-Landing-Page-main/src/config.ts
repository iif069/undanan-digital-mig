// src/app/config.ts

export const CLIENT_DATABASE: Record<string, any> = {
  "Fufu-Fafa": {
    // 1. Data Teks Utama
    groom: {
      name: "Aku Pria Oslo",
      nick: "Fufu",
      father: "Bpk. Jack owi",
      mother: "Ibu Fulanah"
    },
    bride: {
      name: "Anteq Anteq Asheng",
      nick: "Fafa",
      father: "Bpk. Wowo",
      mother: "Ibu Fulanah"
    },
    akad: {
      date: "Sabtu, 20 Juli 2026",
      time: "08.00 - 10.00 WIB",
      venue: "Masjid Istiqlal"
    },
    resepsi: {
      date: "Sabtu, 20 Juli 2026",
      time: "11.00 - 14.00 WIB",
      venue: "Kediaman mempelai wanita"
    },
    targetDate: "2026-07-20T08:00:00",

    // 2. Data Foto Profil (Dari gambar pertama kamu)
    photos: {
      groom: "https://images.unsplash.com/photo-1782737011810-c4dd96670db5?q=80&w=707&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bride: "https://images.unsplash.com/photo-1782737011810-c4dd96670db5?q=80&w=707&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },

    // 3. Data Galeri Foto (Dari gambar kedua kamu)
    gallery: [
      { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", label: "Foto Bersama" },
      { url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80", label: "Momen Spesial" },
      { url: "https://images.unsplash.com/photo-1521033719794-41049d18b8d4?w=600&q=80", label: "Siluet Senja" },
      { url: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&q=80", label: "Kebahagiaan" },
      { url: "https://images.unsplash.com/photo-1779021713683-3f4800e6a8ef?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Cinta Abadi" },
      { url: "https://images.unsplash.com/photo-1782737011810-c4dd96670db5?q=80&w=707&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Bersama Selamanya" }
    ],

mapsUrl: "https://maps.app.goo.gl/MHnGJueZbPg4HbrW8", // Masukkan link EMBED/IFRAME dari Google Maps nanti
loveStory: [
  { ep: "01", label: "Pertemuan Pertama", year: "2019", desc: "Takdir mempertemukan dua hati di tempat yang tak terduga." },
  { ep: "02", label: "Mengenal Lebih Dekat", year: "2020", desc: "Dari teman biasa, tumbuh rasa yang tak bisa disangkal." },
  { ep: "03", label: "Jatuh Cinta", year: "2021", desc: "Cinta itu tiba diam-diam, namun meninggalkan jejak selamanya." },
  { ep: "04", label: "Melamar", year: "2023", desc: "Sebuah pertanyaan sederhana yang mengubah segalanya." },
  { ep: "05", label: "The Wedding", year: "2026", desc: "Babak baru kehidupan yang paling indah dimulai hari ini.", special: true }
],
accounts: [
  { bank: "BRI", no: "1234-5678-9012-3456", name: "Ahmad Rizky" },
  { bank: "BCA", no: "0987-6543-2109", name: "Dewi Rahayu" }
],

    // 4. Data Musik Latar (Dari gambar ketiga kamu)
    musicUrl: "/image/fufu-fafa/musik.mp3"
  },
  
};

