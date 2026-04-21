"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

// ─── Floating Album Bubble ───────────────────────────────────────────────────
const FloatingBubble = ({ src, size, style, delay, emoji }) => (
  <motion.div
    className="absolute rounded-full overflow-hidden border-2 border-white/60 shadow-xl backdrop-blur-sm"
    style={{ width: size, height: size, ...style }}
    initial={{ opacity: 0, scale: 0.4, y: 30 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: [0, -12, 0],
    }}
    transition={{
      opacity: { delay, duration: 0.6 },
      scale: { delay, duration: 0.6, type: "spring", stiffness: 160 },
      y: {
        delay: delay + 0.6,
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
  >
    <div
      className="w-full h-full flex items-center justify-center text-2xl"
      style={{
        background: src
          ? `url(${src}) center/cover`
          : "linear-gradient(135deg,#2d6a4f,#52b788)",
      }}
    >
      {!src && emoji}
    </div>
  </motion.div>
);

// ─── Wavy SVG Lines ───────────────────────────────────────────────────────────
const WavyLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 800 500"
    preserveAspectRatio="none"
    fill="none"
  >
    {[0, 1, 2].map((i) => (
      <motion.path
        key={i}
        d={`M${300 + i * 20} ${180 + i * 30} Q${480} ${260 + i * 10} ${620} ${200 + i * 25} T${820} ${230 + i * 15}`}
        stroke="#4a7c59"
        strokeWidth="1.5"
        strokeOpacity={0.25 - i * 0.06}
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1 + i * 0.3, duration: 1.8, ease: "easeOut" }}
      />
    ))}
  </svg>
);

// ─── Featured Card ────────────────────────────────────────────────────────────
const FeaturedCard = ({ title, artist, duration, gradient, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer flex-1 min-w-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        className="h-44 w-full relative"
        style={{ background: gradient }}
      >
        <motion.div
          className="absolute inset-0 bg-black/20"
          animate={{ opacity: hovered ? 0.5 : 0.15 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {duration} min
        </motion.div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#2d6a4f">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="pt-3 pb-1">
        <p className="font-semibold text-[#1b3a2d] text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{artist}</p>
      </div>
    </motion.div>
  );
};

// ─── Weekly Popular Row ───────────────────────────────────────────────────────
const PopularRow = ({ rank, title, plays, delay }) => (
  <motion.div
    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 group cursor-pointer"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ x: 4 }}
  >
    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-medium flex-shrink-0 group-hover:border-[#2d6a4f] group-hover:text-[#2d6a4f] transition-colors duration-200">
      {rank}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-[#1b3a2d]">{title}</p>
      <p className="text-xs text-gray-400">{plays} played</p>
    </div>
    <motion.div
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      whileHover={{ scale: 1.2 }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#2d6a4f">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </motion.div>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SoundtrackPage() {
  const [email, setEmail] = useState("samantha@email.com");
  const [focused, setFocused] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const featuredTracks = [
    {
      title: "Moment of silence",
      artist: "Samantha William",
      duration: 9,
      gradient: "linear-gradient(135deg,#1a3a2e 0%,#3a6b4a 50%,#a8c5a0 100%)",
    },
    {
      title: "The sound of nature",
      artist: "Thomas Wise",
      duration: 8,
      gradient: "linear-gradient(135deg,#1c3b2e 0%,#2d6a4f 40%,#52b788 100%)",
    },
    {
      title: "Fantastic Wave",
      artist: "Karen Smith",
      duration: 7,
      gradient: "linear-gradient(135deg,#2c4a1e 0%,#5a8a3a 50%,#c6a84b 100%)",
    },
  ];

  const popularTracks = [
    { rank: 1, title: "Harmony in our life", plays: "1,985,098" },
    { rank: 2, title: "Moment of silence", plays: "1,229,385" },
    { rank: 3, title: "The sound of nature", plays: "827,921" },
  ];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#f0f4f0", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── Hero Card ─────────────────────────────────────────────────────── */}
      <motion.div
        ref={heroRef}
        className="mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#dde8de 0%,#c8d9ca 60%,#b8cebb 100%)",
          borderRadius: 24,
          maxWidth: 1140,
          margin: "24px auto 0",
          y: heroY,
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <WavyLines />

        {/* ── Nav ──────────────────────────────────────────────────────────── */}
        <motion.nav
          className="relative z-20 flex items-center justify-between px-10 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1b3a2d] flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="font-bold text-[#1b3a2d] tracking-wider text-sm uppercase">
              Soundtrack
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#2d4a38]">
            {["How it works", "Library", "Pricing"].map((item, i) => (
              <motion.a
                key={item}
                href="#"
                className="hover:text-[#1b3a2d] transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1b3a2d] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
          <motion.button
            className="px-5 py-2 rounded-full bg-white text-[#1b3a2d] text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Login
          </motion.button>
        </motion.nav>

        {/* ── Hero Body ────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center px-10 pb-16 pt-4" style={{ minHeight: 420 }}>
          {/* Left: Text + CTA */}
          <div className="flex-1 max-w-lg">
            <motion.h1
              className="text-5xl font-black leading-tight text-[#1b3a2d]"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7, type: "spring", stiffness: 100 }}
              style={{ fontFamily: "'DM Serif Display', 'Georgia', serif", letterSpacing: "-0.02em" }}
            >
              Melodies<br />
              that help you<br />
              stay focus
            </motion.h1>

            <motion.p
              className="mt-5 text-[#4a6a52] text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore
            </motion.p>

            {/* Email CTA */}
            <motion.div
              className="mt-8 flex items-center rounded-full overflow-hidden shadow-lg"
              style={{ background: "rgba(255,255,255,0.92)", maxWidth: 460 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              animate-border={focused ? "focused" : "idle"}
            >
              <div className="flex-1 px-6 py-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  Your email address
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full bg-transparent text-[#1b3a2d] font-semibold text-sm outline-none mt-0.5"
                  placeholder="your@email.com"
                />
              </div>
              <motion.button
                className="m-1.5 px-7 py-4 rounded-full text-white text-sm font-semibold whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#2d6a4f,#1b3a2d)" }}
                whileHover={{ scale: 1.04, background: "linear-gradient(135deg,#3a7a5f,#2d4a38)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
            </motion.div>

            {/* Dotted decoration */}
            <motion.div
              className="mt-6 ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <svg width="80" height="60" viewBox="0 0 80 60">
                {Array.from({ length: 6 }).map((_, row) =>
                  Array.from({ length: 9 }).map((_, col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={col * 9 + 4}
                      cy={row * 10 + 4}
                      r="1.5"
                      fill="#4a7c59"
                      opacity={0.35}
                    />
                  ))
                )}
              </svg>
            </motion.div>
          </div>

          {/* Right: Floating Bubbles over hero image placeholder */}
          <div className="relative flex-1 h-96 flex items-center justify-center">
            {/* Person silhouette placeholder */}
            <motion.div
              className="absolute inset-0 flex items-end justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div
                className="w-80 h-80 rounded-2xl"
                style={{
                  background: "linear-gradient(180deg,#b8cebb 0%,#8aad8e 100%)",
                  clipPath: "ellipse(55% 80% at 50% 80%)",
                  opacity: 0.5,
                }}
              />
              {/* Headphones icon */}
              <div className="absolute bottom-16 text-8xl select-none" style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }}>
                🎧
              </div>
            </motion.div>

            <FloatingBubble
              size={72}
              emoji="🌾"
              style={{ top: "8%", left: "18%" }}
              delay={0.9}
            />
            <FloatingBubble
              size={68}
              emoji="⚡"
              style={{ top: "42%", left: "4%" }}
              delay={1.1}
            />
            <FloatingBubble
              size={80}
              emoji="🏔️"
              style={{ top: "14%", right: "6%" }}
              delay={1.0}
            />
            <FloatingBubble
              size={60}
              emoji="🌲"
              style={{ bottom: "18%", right: "20%" }}
              delay={1.3}
            />

            {/* Sound wave rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-[#2d6a4f]/20"
                style={{
                  width: 60 + i * 50,
                  height: 60 + i * 50,
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Section ─────────────────────────────────────────────────── */}
      <div
        className="mx-auto px-10 py-10 flex gap-12"
        style={{ maxWidth: 1140 }}
      >
        {/* Featured Melody */}
        <div className="flex-1">
          <motion.h2
            className="text-xl font-bold text-[#1b3a2d] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Featured Melody
          </motion.h2>
          <div className="flex gap-5">
            {featuredTracks.map((track, i) => (
              <FeaturedCard key={track.title} {...track} delay={0.4 + i * 0.15} />
            ))}
          </div>
        </div>

        {/* Weekly Popular */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.h2
            className="text-xl font-bold text-[#1b3a2d] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Weekly Popular
          </motion.h2>
          {popularTracks.map((track, i) => (
            <PopularRow key={track.rank} {...track} delay={0.5 + i * 0.12} />
          ))}
        </div>
      </div>
    </div>
  );
}
