import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CLIENT_DATABASE } from "../config";
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  ChevronDown,
  Mail,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const paths = window.location.pathname.split("/").filter(Boolean);
const clientKey = paths[0] || "Fufu-Fafa";
const CURRENT_CLIENT = CLIENT_DATABASE[clientKey] || CLIENT_DATABASE["Fufu-Fafa"];

const rawGuestName = paths[1] || new URLSearchParams(window.location.search).get('to') || 'Tamu Undangan';
const namaTamu = decodeURIComponent(rawGuestName).replace(/[-_]/g, ' ');

const GROOM = CURRENT_CLIENT.groom;
const BRIDE = CURRENT_CLIENT.bride;
const AKAD = CURRENT_CLIENT.akad;
const RESEPSI = CURRENT_CLIENT.resepsi;
const TARGET_DATE = new Date(CURRENT_CLIENT.targetDate);
const GROOM_PHOTO = CURRENT_CLIENT.photos.groom;
const BRIDE_PHOTO = CURRENT_CLIENT.photos.bride;
const GALLERY_PHOTOS: any[] = CURRENT_CLIENT.gallery || [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  });
  return time;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function NetflixLogo() {
  return (
    <svg viewBox="0 0 111 30" className="h-6 fill-[#E50914]" aria-label="Netflix">
      <path d="M105.06 0l-7.03 19.73L91 0H83.7l10.5 28.97L84.2 56h7.28l7.78-21.77L107.04 56h7.3L100.1 26.47 110.36 0zM74.6 0v56h6.87V0zm-9.73 0L52.63 37.5V0H45.7v56h6.36L64.33 18.5V56h6.94V0zM30.35 0v50.53H18.76V0H11.9v50.53H.28V56H37.2V0zM0 0" />
    </svg>
  );
}

function FlipCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg shadow-black/50">
        <span
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[13px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block bg-[#E50914] text-white text-[13px] uppercase tracking-[0.2em] px-3 py-1 rounded-sm font-semibold mb-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-8 w-full max-w-xs mx-auto">
      <div className="flex-1 h-px bg-white/10" />
      <Heart size={12} className="text-[#E50914]" fill="#E50914" />
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// ─── Opening Screen ───────────────────────────────────────────────────────────
function OpeningScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black_100%)] pointer-events-none" />

      {/* Cari baris 108 di App.tsx, lalu ganti motion.div nya dengan racikan ini: */}
<motion.div
  initial={{ opacity: 0, y: 40 }} // Diturunkan ke 15px agar HP tidak perlu repaint area terlalu luas
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 1, 
    ease: [0.16, 1, 0.3, 1], // Menggunakan kurva "Ultra-Smooth" cubic-bezier ala Apple
    delay: 0.15 // Memberikan "nafas" 150ms agar browser selesai loading font & kartu sebelum animasi jalan
  }}
  className="relative z-10 flex flex-col items-center transform-gpu"
  style={{ willChange: "transform, opacity" }} // Memaksa HP menggunakan GPU (Hardware Acceleration)
>
        <p
          className="text-[#E50914] text-xl tracking-[0.5em] uppercase mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          THE
        </p>
        <h1
          className="text-[#E50914] leading-none mb-3"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(4.9rem, 14vw, 8rem)",
            letterSpacing: "0.02em",
            textShadow: "0 0 60px rgba(229,9,20,0.4)",
          }}
        >
          WEDDING
        </h1>
        <p
          className="text-white text-xl mb-10"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          of {GROOM.nick} &amp; {BRIDE.nick}
        </p>

        <div className="flex gap-5 mb-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90">
                <circle cx="28" cy="30" r="6" fill="white" />
                <circle cx="52" cy="30" r="6" fill="white" />
                <path d="M20 55 Q40 68 60 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white/70 text-[15px] tracking-wide mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {GROOM.nick}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-pink-600 to-rose-700 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90">
                <circle cx="28" cy="30" r="6" fill="white" />
                <circle cx="52" cy="30" r="6" fill="white" />
                <path d="M20 55 Q40 68 60 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white/70 text-[15px] tracking-wide mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {BRIDE.nick}
            </p>
          </div>
        </div>

        <p className="text-white/60 text-base mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Kepada Yth: Bpk/Ibu/Saudara/i
        </p>
        <p
          className="text-[#E50914] text-2xl font-semibold my-2"
          style={{ fontFamily: "'Poppins', sans serif" }}
        >
          {namaTamu}
        </p>
        <p className="text-white/40 text-[12px] mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          *) Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="flex items-center gap-3 bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold px-5 py-2.5 rounded-md text-base shadow-lg shadow-red-900/40 transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}
        >
          <Mail size={18} />
          BUKA UNDANGAN
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <motion.section 
  initial={{ y: 80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
  className="relative min-h-screen flex flex-col justify-end overflow-hidden"
>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-neutral-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,_rgba(229,9,20,0.12)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#E50914]/10 pointer-events-none" />

      <div className="absolute top-[65%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="flex flex-col items-center">
          <span
            className="text-white/10 leading-none select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(9rem, 25vw, 18rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {CURRENT_CLIENT.groom.nick[0]}&amp;{CURRENT_CLIENT.bride.nick[0]}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent pointer-events-none" />

      <div className="absolute inset-0 z-10 px-6 pb-16 text-center flex flex-col justify-center items-center">
        <div className="text-white text-center mb-20 px-4 max-w-xl mx-auto">
    <p className="text-base md:text-base font-regular mb-2">
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..."
    </p>
    <p className="text-base font-bold tracking-widest">
      (QS. AR-RUM: 21)
    </p>
  </div>
        <span
          className="mt-6 md:mt-16 bg-[#E50914] text-white text-[13px] uppercase tracking-[0.3em] px-3 py-1 rounded-sm font-semibold mb-5 inline-block"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Coming Soon
        </span>

        <p
          className="text-[#E50914] text-base tracking-[0.5em] uppercase mb-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          THE
        </p>
        <h1
          className="text-white leading-none mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(5rem, 14vw, 8rem)",
            letterSpacing: "0.04em",
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
          }}
        >
          WEDDING
        </h1>
        <p
          className="text-white text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {GROOM.nick} &amp; {BRIDE.nick}
        </p>
        <p className="text-white/60 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {AKAD.date}
        </p>

        <div className="mt-8">
          <ChevronDown size={24} className="text-white/30 animate-bounce" />
        </div>
      </div>
    </motion.section>
  );
}

// ─── Couple Section ───────────────────────────────────────────────────────────
function CoupleSection() {
  return (
    <section className="py-20 px-6 bg-[#141414]">
      <div className="max-w-2xl mx-auto text-center">
        <SectionTag>Mempelai</SectionTag>

        <h2
          className="text-white w-full text-center mb-2 leading-snug"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 4.5vw, 2.25rem)",
          }}
        >
          Bismillahirrahmanirrahim
        </h2>

        <p className="text-white/50 text-[15px] md:text-base mb-12 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Bapak/Ibu/Saudara/i pada pernikahan kami.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Groom */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-52 md:w-44 md:h-56 rounded-2xl overflow-hidden mb-4 border-2 border-[#E50914]/30 shadow-2xl shadow-black/60">
              <img
                src={GROOM_PHOTO}
                alt={`Foto ${GROOM.nick}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p
              className="text-[#E50914] text-3xl mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              {GROOM.nick}
            </p>
            <p className="text-white font-semibold text-lg mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {GROOM.name}
            </p>
            <p className="text-white/50 text-[15px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Putra dari<br />
              <span className="text-white/70">{GROOM.father}</span><br />
              <span className="text-white/70">&amp; {GROOM.mother}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <Heart size={28} className="text-[#E50914]" fill="#E50914" />
            <div className="w-px h-10 bg-white/10 hidden md:block" />
          </div>

          {/* Bride */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-52 md:w-44 md:h-56 rounded-2xl overflow-hidden mb-4 border-2 border-[#E50914]/30 shadow-2xl shadow-black/60">
              <img
                src={BRIDE_PHOTO}
                alt={`Foto ${BRIDE.nick}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p
              className="text-[#E50914] text-3xl mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              {BRIDE.nick}
            </p>
            <p className="text-white font-semibold text-lg mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {BRIDE.name}
            </p>
            <p className="text-white/50 text-[15px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Putri dari<br />
              <span className="text-white/70">{BRIDE.father}</span><br />
              <span className="text-white/70">&amp; {BRIDE.mother}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Countdown Section ────────────────────────────────────────────────────────
function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);
  return (
    <section className="py-20 px-6 bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,_rgba(229,9,20,0.06)_0%,_transparent_70%)] pointer-events-none" />
      <div className="max-w-xl mx-auto text-center relative z-10">
        <SectionTag>Menuju Hari Bahagia</SectionTag>
        <h2
          className="text-white text-3xl md:text-4xl mb-10"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
        >
          HITUNG MUNDUR
        </h2>
        <div className="flex justify-center gap-4 md:gap-6">
          <FlipCard value={days} label="Hari" />
          <FlipCard value={hours} label="Jam" />
          <FlipCard value={minutes} label="Menit" />
          <FlipCard value={seconds} label="Detik" />
        </div>
      </div>
    </section>
  );
}

// ─── Event Section ────────────────────────────────────────────────────────────
function EventSection() {
  return (
    <section className="py-20 px-6 bg-[#141414]">
      <div className="max-w-2xl mx-auto text-center">
        <SectionTag>Rangkaian Acara</SectionTag>
        <h2
          className="text-white text-3xl md:text-4xl mb-12"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
        >
          DETAIL ACARA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Akad */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 text-left hover:border-[#E50914]/30 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-[#E50914] rounded-full" />
              <h3
                className="text-[#E50914] text-xl font-bold"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
              >
                AKAD NIKAH
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {AKAD.date}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {AKAD.time}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {AKAD.venue}
                </p>
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 text-left hover:border-[#E50914]/30 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-[#E50914] rounded-full" />
              <h3
                className="text-[#E50914] text-xl font-bold"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
              >
                RESEPSI
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.date}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.time}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.venue}
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 mt-8 border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-6 py-3 rounded-md text-[15px] font-semibold transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}
        >
          <MapPin size={18} />
          LIHAT LOKASI DI MAPS
        </motion.a>
      </div>
    </section>
  );
}

// ─── Love Story Section ───────────────────────────────────────────────────────
function LoveStorySection() {
  const episodes = [
    { ep: "S01 E01", label: "Pertemuan Pertama", year: "2019", desc: "Takdir mempertemukan dua hati di tempat yang tak terduga." },
    { ep: "S01 E02", label: "Mengenal Lebih Dekat", year: "2020", desc: "Dari teman biasa, tumbuh rasa yang tak bisa disangkal." },
    { ep: "S01 E03", label: "Jatuh Cinta", year: "2021", desc: "Cinta itu tiba diam-diam, namun meninggalkan jejak selamanya." },
    { ep: "S01 E04", label: "Melamar", year: "2023", desc: "Sebuah pertanyaan sederhana yang mengubah segalanya." },
    { ep: "S01 E05", label: "The Wedding", year: "2025", desc: "Babak baru kehidupan yang paling indah dimulai hari ini.", special: true },
  ];

  return (
    <section className="py-20 px-6 bg-[#0d0d0d]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag>Our Story</SectionTag>
          <h2
            className="text-white text-3xl md:text-4xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
          >
            LOVE STORY
          </h2>
        </div>

        <div className="space-y-4">
          {episodes.map((ep) => (
            <div
              key={ep.ep}
              className={`group flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 cursor-default ${
                ep.special
                  ? "border-[#E50914]/40 bg-[#E50914]/5 hover:bg-[#E50914]/10"
                  : "border-white/5 bg-[#1a1a1a] hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <div className="shrink-0 mt-1">
                <Play
                  size={18}
                  className={ep.special ? "text-[#E50914]" : "text-white/30 group-hover:text-white/60"}
                  fill={ep.special ? "#E50914" : "transparent"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-[13px] md:text-sm font-semibold ${ep.special ? "text-[#E50914]" : "text-white/30"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {ep.ep}
                  </span>
                  <span className="text-white/20 text-[13px] md:text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {ep.year}
                  </span>
                </div>
                <p
                  className={`font-semibold text-base mb-1 ${ep.special ? "text-white" : "text-white/80"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {ep.label}
                </p>
                <p className="text-white/50 text-[15px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {ep.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-[#0d0d0d] relative overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionTag>Our Gallery</SectionTag>
            <h2
              className="text-white text-3xl md:text-4xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
            >
              MOMENTS
            </h2>
          </div>
          
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll("left")} className="p-3 bg-[#1a1a1a] border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
              <ChevronDown size={20} className="rotate-90" />
            </button>
            <button onClick={() => scroll("right")} className="p-3 bg-[#1a1a1a] border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all">
              <ChevronDown size={20} className="-rotate-90" />
            </button>
          </div>
        </div>

        <div
          ref={rowRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {GALLERY_PHOTOS?.map((photo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="shrink-0 w-[260px] h-[160px] md:w-[320px] md:h-[200px] snap-center cursor-pointer relative group rounded-md overflow-hidden border border-white/5 shadow-xl"
              onClick={() => setLightbox(idx)}
            >
              {/* PERUBAHAN DI SINI: menggunakan photo.url */}
              <img
                src={photo.url}
                alt={photo.label || `Gallery ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#E50914] bg-black/50 flex items-center justify-center pl-1">
                  <Play size={20} className="text-[#E50914]" fill="#E50914" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10"
              onClick={() => setLightbox(null)}
            >
              {/* PERUBAHAN DI SINI: menggunakan .url */}
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={GALLERY_PHOTOS[lightbox].url}
                alt={`Enlarged ${lightbox + 1}`}
                className="max-w-full max-h-full rounded-md shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Gift Section ─────────────────────────────────────────────────────────────
function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20 px-6 bg-[#0d0d0d]">
      <div className="max-w-lg mx-auto text-center">
        <SectionTag>Wedding Gift</SectionTag>
        <h2
          className="text-white text-3xl md:text-4xl mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
        >
          AMPLOP DIGITAL
        </h2>
        <p className="text-white/50 text-[15px] mb-10 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Doa restu Anda adalah hadiah terbaik. Namun jika ingin memberikan tanda kasih:
        </p>

        <div className="space-y-4">
          {[
            { bank: "BRI", no: "1234-5678-9012-3456", name: "Ahmad Rizky" },
            { bank: "BCA", no: "0987-6543-2109", name: "Dewi Rahayu" },
          ].map((item) => (
            <div
              key={item.bank}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 text-left flex items-center justify-between group hover:border-white/20 transition-colors"
            >
              <div>
                <p
                  className="text-[#E50914] font-bold text-[15px] mb-1"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
                >
                  {item.bank}
                </p>
                <p className="text-white font-semibold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.no}
                </p>
                <p className="text-white/40 text-[13px] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  a.n. {item.name}
                </p>
              </div>
              <button
                onClick={() => copy(item.no.replace(/-/g, ""), item.bank)}
                className="text-[13px] border border-white/20 text-white/50 hover:border-[#E50914] hover:text-[#E50914] px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {copied === item.bank ? "✓ COPIED" : "SALIN"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RSVP Section ─────────────────────────────────────────────────────────────
function RSVPSection() {
  const [name, setName] = useState("");
  const [attend, setAttend] = useState<"hadir" | "tidak" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && attend) setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 bg-[#141414] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,_rgba(229,9,20,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="max-w-lg mx-auto text-center relative z-10">
        <SectionTag>Konfirmasi Kehadiran</SectionTag>
        <h2
          className="text-white text-3xl md:text-4xl mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
        >
          RSVP
        </h2>
        <p className="text-white/50 text-[15px] mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Kehadiran Anda adalah kebahagiaan terbesar bagi kami
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-[#E50914]/30 rounded-xl p-10"
          >
            <Heart size={40} className="text-[#E50914] mx-auto mb-4" fill="#E50914" />
            <p
              className="text-white text-xl font-semibold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              Terima Kasih!
            </p>
            <p className="text-white/50 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 text-left space-y-5">
            <div>
              <label
                className="block text-white/60 text-[13px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Nama Lengkap
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 text-base focus:outline-none focus:border-[#E50914]/50 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            <div>
              <label
                className="block text-white/60 text-[13px] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["hadir", "tidak"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAttend(opt)}
                    className={`py-3 rounded-lg text-[15px] font-semibold border transition-all duration-200 ${
                      attend === opt
                        ? "bg-[#E50914] border-[#E50914] text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/25"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {opt === "hadir" ? "✓ Hadir" : "✗ Tidak Hadir"}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold py-4 rounded-lg text-base tracking-widest transition-colors duration-200 disabled:opacity-40"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              disabled={!name || !attend}
            >
              KIRIM KONFIRMASI
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer Section ───────────────────────────────────────────────────────────
function FooterSection() {
  return (
    <footer className="py-12 px-6 bg-black text-center border-t border-white/5 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-white/40 text-[15px] mt-6 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
        </p>
        <div className="mt-8 mb-12">
          <p className="text-white/30 text-[13px] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Kami yang berbahagia,
          </p>
          <p
            className="text-white text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
          >
            {GROOM.nick} & {BRIDE.nick}
          </p>
        </div>

        {/* Credit MIG Digital Printing */}
        <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-xs mx-auto">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Copyright 2026
          </p>
          <p className="text-white/50 text-[13px] font-semibold tracking-wider mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            MIG DIGITAL PRINTING
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function WeddingInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // FUNGSI BARU: Memutar musik secara otomatis tepat setelah halaman utama berhasil termuat
  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.log("Autoplay diblokir oleh browser, membutuhkan interaksi user", err);
        });
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true); // Cukup ubah state menjadi true, pemutaran musik akan diambil alih oleh useEffect di atas
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!isOpen) {
    return <OpeningScreen onOpen={handleOpen} />;
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white antialiased selection:bg-[#E50914] selection:text-white">
      <audio ref={audioRef} src={CURRENT_CLIENT.musicUrl || "/bgm.mp3"} loop />
      
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-3 rounded-full text-white/80 hover:text-[#E50914] hover:bg-white/10 transition-all shadow-xl shadow-black/50"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>

      <HeroSection />
      <Divider />
      <CoupleSection />
      <CountdownSection />
      <EventSection />
      <LoveStorySection />
      <GallerySection />
      <GiftSection />
      <RSVPSection />
      <FooterSection />
    </div>
  );
}
