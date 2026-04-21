"use client";

import { motion, useScroll, useTransform, AnimatePresence, Transition } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import sc1 from "@/assets/sc1.jpg";
import sc2 from "@/assets/sc2.jpg";
import sc3 from "@/assets/sc3.jpg";
import person from "@/assets/person1.png";
import Image, { StaticImageData } from "next/image";


// ─── Floating Bubble (Optimized) ─────────────────────────────────────────────
const FloatingBubble = React.memo(
  ({ src, size, style, delay, emoji }: { src?: string; size: number; style?: React.CSSProperties; delay: number; emoji?: string }) => {
    const transition :Transition = useMemo(
      () => ({
        opacity: { delay, duration: 0.6 },
        scale: {
          delay,
          duration: 0.6,
          type: "spring",
          stiffness: 160,
        },
        y: {
          delay: delay + 0.6,
          duration: 4 + delay * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }),
      [delay]
    );

    return (
      <motion.div
        className="absolute rounded-full overflow-hidden border border-white/40 shadow-md will-change-transform"
        style={{ width: size, height: size, ...style }}
        initial={{ opacity: 0, scale: 0.4, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
        transition={transition}
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
  }
);
FloatingBubble.displayName = "FloatingBubble";

// ─── Wavy Lines (Optimized) ──────────────────────────────────────────────────
const WavyLines = React.memo(() => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 800 500"
    preserveAspectRatio="none"
    fill="none"
  >
    {[0, 1, 2].map((i) => (
      <motion.path
        key={i}
        d={`M${300 + i * 20} ${180 + i * 30}
            Q480 ${260 + i * 10}
            620 ${200 + i * 25}
            T820 ${230 + i * 15}`}
        stroke="#4a7c59"
        strokeWidth="1.5"
        strokeOpacity={0.25 - i * 0.06}
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          delay: 1 + i * 0.3,
          duration: 1.5,
          ease: "easeOut",
        }}
      />
    ))}
  </svg>
));
WavyLines.displayName = "WavyLines";

// ─── Featured Card ───────────────────────────────────────────────────────────
const FeaturedCard = React.memo(
  ({ title, artist, duration, delay ,coverPage}: { title: string; artist: string; duration: number; delay: number ,coverPage: StaticImageData }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <motion.div
        className="relative rounded-2xl border overflow-hidden cursor-pointer flex-1 border-gray-200 shadow-md hover:-translate-y-2 transition-transform duration-300"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <div className="h-32 w-full relative">
          <Image
            src={coverPage}
            alt=""
            fill
            className="object-cover"
            sizes="300px"
          />


          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {duration} min
          </div>

          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                  ▶
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-3 pb-1 px-2">
          <p className="font-semibold text-[#1b3a2d] text-sm">{title}</p>
          <p className="text-xs text-gray-400">{artist}</p>
        </div>
      </motion.div>
    );
  }
);
FeaturedCard.displayName = "FeaturedCard";

// ─── Popular Row ─────────────────────────────────────────────────────────────
const PopularRow = React.memo(
  ({ rank, title, plays, delay }: { rank: number; title: string; plays: string; delay: number }) => (
    <motion.div
      className="flex items-center gap-4 py-3 border-b border-gray-100"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="w-8 h-8 rounded-full border flex items-center justify-center text-xs">
        {rank}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-400">{plays} played</p>
      </div>
    </motion.div>
  )
);
PopularRow.displayName = "PopularRow";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SoundtrackPage() {
  const [email, setEmail] = useState("johnDoe@email.com");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  
  const featuredTracks = [
    {
      title: "Moment of silence",
      artist: "Samantha William",
      coverPage: sc1,
      duration: 9,
      gradient: "linear-gradient(135deg,#1a3a2e 0%,#3a6b4a 50%,#a8c5a0 100%)",
    },
    {
      title: "The sound of nature",
      artist: "Thomas Wise",
      coverPage: sc2,
      duration: 8,
      gradient: "linear-gradient(135deg,#1c3b2e 0%,#2d6a4f 40%,#52b788 100%)",
    },
    {
      title: "Fantastic Wave",
      artist: "Karen Smith",
      coverPage: sc3,
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
              className="mt-8 flex items-center rounded-full overflow-hidden shadow-lg bg-white max-w-115"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            >
              <div className="flex-1 px-6 py-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                  Your email address
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              className="absolute inset-0 flex items-end justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="absolute -bottom-22 select-none">
               <Image src={person} alt="" className="w-100"/>
              </div>
            </motion.div>

            <div className="z-50">
              <FloatingBubble
              size={72}
              src={sc2.src}
              style={{ top: "8%", left: "20%" }}
              delay={0.9}
            />
            <FloatingBubble
              size={68}
              src={sc3.src}
              style={{ top: "42%", left: "4%" }}
              delay={1.1}
            />
            <FloatingBubble
              size={80}
              src={sc2.src}
              style={{ top: "14%", right: "6%" }}
              delay={1.0}
            />
            <FloatingBubble
              size={60}
              src={sc3.src}
              style={{ bottom: "18%", right: "0%" }}
              delay={1.3}
            />
            </div>

           
            {[1, 2, 3].map((i) => (
              //  Sound wave rings behind the person silhouette
              <motion.div
                key={i}
                className="absolute rounded-full border border-[#2d6a4f]/70 z-10"
                style={{
                  width: 60 + i * 50,
                  height: 60 + i * 50,
                  top: "30%",
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
