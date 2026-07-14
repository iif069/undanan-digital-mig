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
  Phone,
  Play,
  Volume2,
  VolumeX,
  Gift,
  Users,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────


// 1. Pecah path URL menjadi array (contoh: "/Fufu-Fafa/Andi" menjadi ["Fufu-Fafa", "Andi"])
const paths = window.location.pathname.split("/").filter(Boolean);

// 2. Ambil nama klien (calon pengantin) dari segmen pertama URL
// Jika kosong, otomatis fallback ke data default pertama di database kamu (misal: "Fufu-Fafa")
const clientKey = paths[0] || "Fufu-Fafa";
const CURRENT_CLIENT = CLIENT_DATABASE[clientKey] || CLIENT_DATABASE["Fufu-Fafa"];

// 3. Ambil nama tamu undangan dari segmen kedua (ujung URL)
// Kita tambahkan decodeURIComponent agar karakter seperti %20 otomatis jadi spasi kembali
// Kita replace juga tanda strip (-) atau underscore (_) menjadi spasi biasa agar nama tamu terlihat rapi
const rawGuestName = paths[1] || new URLSearchParams(window.location.search).get('to') || 'Tamu Undangan';
const namaTamu = decodeURIComponent(rawGuestName).replace(/[-_]/g, ' ');

const GROOM = CURRENT_CLIENT.groom;
const BRIDE = CURRENT_CLIENT.bride;
const AKAD = CURRENT_CLIENT.akad;
const RESEPSI = CURRENT_CLIENT.resepsi;
const TARGET_DATE = new Date(CURRENT_CLIENT.targetDate);
const MAPS_URL = CURRENT_CLIENT.mapsUrl;
const LOVE_STORY: any[] = CURRENT_CLIENT.loveStory || [];
const ACCOUNTS: any[] = CURRENT_CLIENT.accounts || [];

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
      <span className="text-[10px] uppercase tracking-widest text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block bg-[#E50914] text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-sm font-semibold mb-4"
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
      {/* Subtle vignette lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Netflix-style title */}
        <p
          className="text-[#E50914] text-sm tracking-[0.5em] uppercase mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          THE
        </p>
        <h1
          className="text-[#E50914] leading-none mb-3"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3.5rem, 12vw, 7rem)",
            letterSpacing: "0.02em",
            textShadow: "0 0 60px rgba(229,9,20,0.4)",
          }}
        >
          WEDDING
        </h1>
        <p
          className="text-white text-lg mb-10"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          of {GROOM.nick} &amp; {BRIDE.nick}
        </p>

        {/* Avatar placeholders */}
        <div className="flex gap-5 mb-10">
          {/* Groom */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90">
                <circle cx="28" cy="30" r="6" fill="white" />
                <circle cx="52" cy="30" r="6" fill="white" />
                <path d="M20 55 Q40 68 60 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white/70 text-xs tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {GROOM.nick}
            </p>
          </div>
          {/* Bride */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl bg-gradient-to-br from-pink-600 to-rose-700 flex items-center justify-center shadow-2xl">
              <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-90">
                <circle cx="28" cy="30" r="6" fill="white" />
                <circle cx="52" cy="30" r="6" fill="white" />
                <path d="M20 55 Q40 68 60 55" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white/70 text-xs tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {BRIDE.nick}
            </p>
          </div>
        </div>

        {/* Guest name */}
        <p className="text-white/60 text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Kepada Yth: Bpk/Ibu/Saudara/i
        </p>
        <p
          className="text-[#E50914] text-2xl font-semibold mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {namaTamu}
        </p>
        <p className="text-white/40 text-xs mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          *) Mohon maaf apabila ada kesalahan penulisan nama/gelar
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="flex items-center gap-3 bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold px-8 py-4 rounded-md text-base shadow-lg shadow-red-900/40 transition-colors duration-200"
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
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background gradient (Netflix-style dark cinematic) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-neutral-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,_rgba(229,9,20,0.12)_0%,_transparent_70%)]" />
        {/* Decorative film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#E50914]/10 pointer-events-none" />

      {/* Center monogram */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] text-center">
        <div className="flex flex-col items-center">
          <span
            className="text-white/10 leading-none select-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(6rem, 25vw, 18rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {CURRENT_CLIENT.groom.nick[0]}&amp;{CURRENT_CLIENT.bride.nick[0]}
          </span>
        </div>
      </div>

      {/* Bottom overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 pb-16 text-center flex flex-col items-center">
        <span
          className="bg-[#E50914] text-white text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-sm font-semibold mb-5 inline-block"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Coming Soon
        </span>

        <p
          className="text-[#E50914] text-sm tracking-[0.5em] uppercase mb-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          THE
        </p>
        <h1
          className="text-white leading-none mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 14vw, 8rem)",
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
        <p className="text-white/60 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {AKAD.date}
        </p>

        <div className="mt-8">
          <ChevronDown size={24} className="text-white/30 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ─── Couple Photo Placeholder ─────────────────────────────────────────────────
// Ganti src di bawah dengan URL/import foto asli mempelai
const GROOM_PHOTO = CURRENT_CLIENT.photos.groom;
const BRIDE_PHOTO = CURRENT_CLIENT.photos.bride;
// ─── Couple Section ───────────────────────────────────────────────────────────
function CoupleSection() {
  return (
    <section className="py-20 px-6 bg-[#141414]">
      <div className="max-w-2xl mx-auto text-center">
        <SectionTag>Mempelai</SectionTag>

        {/* Bismillah — responsive, tidak overflow di hp */}
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

        <p className="text-white/50 text-sm mb-12 max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Bapak/Ibu/Saudara/i pada pernikahan kami.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Groom */}
          <div className="flex flex-col items-center">
            {/* Foto mempelai pria — ganti src GROOM_PHOTO dengan foto asli */}
            <div className="w-40 h-52 md:w-44 md:h-56 rounded-2xl overflow-hidden mb-4 border-2 border-[#E50914]/30 shadow-2xl shadow-black/60">
              <img
                src={GROOM_PHOTO}
                alt={`Foto ${GROOM.nick}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p
              className="text-[#E50914] text-2xl mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              {GROOM.nick}
            </p>
            <p className="text-white font-semibold text-base mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {GROOM.name}
            </p>
            <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Putra dari<br />
              <span className="text-white/70">{GROOM.father}</span><br />
              <span className="text-white/70">&amp; {GROOM.mother}</span>
            </p>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            <Heart size={28} className="text-[#E50914]" fill="#E50914" />
            <div className="w-px h-10 bg-white/10 hidden md:block" />
          </div>

          {/* Bride */}
          <div className="flex flex-col items-center">
            {/* Foto mempelai wanita — ganti src BRIDE_PHOTO dengan foto asli */}
            <div className="w-40 h-52 md:w-44 md:h-56 rounded-2xl overflow-hidden mb-4 border-2 border-[#E50914]/30 shadow-2xl shadow-black/60">
              <img
                src={BRIDE_PHOTO}
                alt={`Foto ${BRIDE.nick}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p
              className="text-[#E50914] text-2xl mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              {BRIDE.nick}
            </p>
            <p className="text-white font-semibold text-base mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {BRIDE.name}
            </p>
            <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                <Calendar size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {AKAD.date}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {AKAD.time}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                <Calendar size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.date}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.time}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-white/40 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {RESEPSI.venue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map button */}
        <motion.a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 mt-8 border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors duration-200"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}
        >
          <MapPin size={16} />
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
                  size={16}
                  className={ep.special ? "text-[#E50914]" : "text-white/30 group-hover:text-white/60"}
                  fill={ep.special ? "#E50914" : "transparent"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs font-semibold ${ep.special ? "text-[#E50914]" : "text-white/30"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {ep.ep}
                  </span>
                  <span className="text-white/20 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {ep.year}
                  </span>
                </div>
                <p
                  className={`font-semibold text-sm mb-1 ${ep.special ? "text-white" : "text-white/80"}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {ep.label}
                </p>
                <p className="text-white/40 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
        <p className="text-white/50 text-sm mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
            <p className="text-white/50 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 text-left space-y-5">
            <div>
              <label
                className="block text-white/60 text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Nama Lengkap
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#E50914]/50 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            <div>
              <label
                className="block text-white/60 text-xs uppercase tracking-widest mb-2"
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
                    className={`py-3 rounded-lg text-sm font-semibold border transition-all duration-200 ${
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
              className="w-full bg-[#E50914] hover:bg-[#f6121d] text-white font-semibold py-4 rounded-lg text-sm tracking-widest transition-colors duration-200 disabled:opacity-40"
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
        <p className="text-white/50 text-sm mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                  className="text-[#E50914] font-bold text-sm mb-1"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
                >
                  {item.bank}
                </p>
                <p className="text-white font-semibold text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.no}
                </p>
                <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  a.n. {item.name}
                </p>
              </div>
              <button
                onClick={() => copy(item.no.replace(/-/g, ""), item.bank)}
                className="text-xs border border-white/20 text-white/50 hover:border-[#E50914] hover:text-[#E50914] px-3 py-2 rounded-lg transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {copied === item.bank ? "✓ Copied" : "Salin"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
const GALLERY_PHOTOS: any[] = CURRENT_CLIENT.gallery;

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
              GALERI FOTO
            </h2>
          </div>
          {/* Scroll arrows — desktop */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-white/20 text-white/50 hover:border-white/50 hover:text-white flex items-center justify-center transition-all"
            >
              ‹
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-white/20 text-white/50 hover:border-white/50 hover:text-white flex items-center justify-center transition-all"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Netflix-style horizontal scroll row */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-4 px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {GALLERY_PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04, zIndex: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(i)}
            className="relative shrink-0 cursor-pointer rounded-xl overflow-hidden group"
            style={{ width: "clamp(180px, 40vw, 260px)", aspectRatio: "3/4" }}
          >
            <img
              src={photo.url}
              alt={photo.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p
                className="text-white text-sm font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {photo.label}
              </p>
            </div>
            {/* Netflix-style red bottom bar on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_PHOTOS[lightbox].url.replace("w=600", "w=1080")}
                alt={GALLERY_PHOTOS[lightbox].label}
                className="w-full rounded-xl shadow-2xl object-cover"
                style={{ maxHeight: "80vh" }}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {/* Prev */}
                {lightbox > 0 && (
                  <button
                    onClick={() => setLightbox(lightbox - 1)}
                    className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E50914] transition-colors"
                  >‹</button>
                )}
                {/* Next */}
                {lightbox < GALLERY_PHOTOS.length - 1 && (
                  <button
                    onClick={() => setLightbox(lightbox + 1)}
                    className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E50914] transition-colors"
                  >›</button>
                )}
                {/* Close */}
                <button
                  onClick={() => setLightbox(null)}
                  className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E50914] transition-colors text-lg"
                >×</button>
              </div>
              <p
                className="text-center text-white/60 text-sm mt-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {GALLERY_PHOTOS[lightbox].label} · {lightbox + 1} / {GALLERY_PHOTOS.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Closing Section ──────────────────────────────────────────────────────────
function ClosingSection() {
  return (
    <section className="py-20 px-6 bg-[#141414] text-center">
      <div className="max-w-lg mx-auto">
        <p
          className="text-[#E50914] text-sm tracking-[0.5em] uppercase mb-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          THE
        </p>
        <h2
          className="text-white leading-none mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 10vw, 5rem)",
            letterSpacing: "0.04em",
          }}
        >
          WEDDING
        </h2>
        <p
          className="text-white/70 text-xl mb-6"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          {GROOM.nick} &amp; {BRIDE.nick}
        </p>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
        </p>
        <p className="text-white/25 text-xs mt-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          — QS. Ar-Rum: 21
        </p>

        <Divider />

        <p className="text-white/40 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <p
          className="text-white font-semibold mt-6 text-lg"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          Kami yang berbahagia,
        </p>
        <p
          className="text-[#E50914] text-2xl mt-1"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          {GROOM.nick} &amp; {BRIDE.nick}
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-8 px-6 text-center">
      <div className="flex justify-center mb-4">
        <NetflixLogo />
      </div>
      <p className="text-white/20 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        © 2026{" "}
        <span className="text-white/40 font-semibold">MIG Digital Printing - Rajadesa</span>
      </p>
      <p className="text-white/10 text-[10px] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Digital Wedding Invitation · All Rights Reserved
      </p>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
// Ganti URL di bawah dengan file musik pilihan Anda (letakkan di folder public/ atau gunakan URL eksternal)
const MUSIC_URL = CURRENT_CLIENT.musicUrl;
export default function App() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setOpened(true);
    // Putar musik saat undangan dibuka (dipicu user gesture agar browser mengizinkan)
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="min-h-screen bg-[#141414]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Audio player — loop background music */}
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {/* Floating mute button — hanya muncul setelah undangan dibuka */}
      <AnimatePresence>
        {opened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1, duration: 0.3 }}
            onClick={toggleMute}
            title={muted ? "Aktifkan musik" : "Matikan musik"}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center hover:border-[#E50914]/60 hover:bg-black/90 transition-all duration-200 shadow-lg"
          >
            {muted
              ? <VolumeX size={18} className="text-white/50" />
              : <Volume2 size={18} className="text-[#E50914]" />
            }
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="opening"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <OpeningScreen onOpen={handleOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HeroSection />
            <CoupleSection />
            <CountdownSection />
            <EventSection />
            <LoveStorySection />
            <GallerySection />
            <RSVPSection />
            <GiftSection />
            <ClosingSection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
