"use client";

import { motion } from "framer-motion";
import { useMuseumFX } from "@/components/museum/MuseumFX";
import { ButtonBehavior, ButtonRarity, MuseumButtonData } from "@/types/button";

const LOOK: Record<
  ButtonBehavior,
  { className: string; shape: string }
> = {
  ALERT: {
    className:
      "bg-rose-500 text-white shadow-[0_8px_0_#9f1239] hover:bg-rose-400",
    shape: "rounded-2xl",
  },
  INSULT: {
    className:
      "bg-orange-500 text-black shadow-[0_8px_0_#c2410c] hover:bg-orange-400",
    shape: "rounded-md rotate-[-2deg]",
  },
  NORMAL: {
    className:
      "bg-amber-200 text-stone-900 shadow-[0_8px_0_#b45309] hover:bg-amber-100",
    shape: "rounded-full",
  },
  WHISPER: {
    className:
      "bg-slate-200/80 text-slate-700 shadow-[0_6px_0_#64748b] hover:bg-white",
    shape: "rounded-full text-sm tracking-[0.3em]",
  },
  BUBBLE: {
    className:
      "bg-sky-300/80 text-sky-950 shadow-[0_8px_0_#0369a1] hover:bg-sky-200",
    shape: "rounded-full",
  },
  RANDOM: {
    className:
      "bg-[conic-gradient(from_120deg,#f472b6,#38bdf8,#facc15,#a78bfa,#f472b6)] text-black shadow-[0_8px_0_#581c87]",
    shape: "rounded-2xl",
  },
  DISAPPEAR: {
    className:
      "border border-dashed border-violet-300 bg-violet-950/40 text-violet-100 shadow-[0_8px_0_#4c1d95]",
    shape: "rounded-3xl",
  },
  TELEPORT: {
    className:
      "bg-cyan-400 text-cyan-950 shadow-[0_8px_0_#0e7490] hover:bg-cyan-300",
    shape: "rounded-xl skew-x-[-8deg]",
  },
  GLITCH: {
    className:
      "bg-black text-lime-300 shadow-[6px_6px_0_#d946ef] font-mono",
    shape: "rounded-none",
  },
  SHRINK: {
    className:
      "bg-lime-300 text-lime-950 shadow-[0_6px_0_#3f6212]",
    shape: "rounded-full px-5 py-3 text-sm",
  },
  GROW: {
    className:
      "bg-fuchsia-500 text-white shadow-[0_10px_0_#86198f] hover:bg-fuchsia-400",
    shape: "rounded-2xl",
  },
  ECHO: {
    className:
      "bg-indigo-500 text-white shadow-[0_0_0_4px_#c7d2fe,0_8px_0_#312e81]",
    shape: "rounded-full",
  },
  MIRROR: {
    className:
      "bg-gradient-to-br from-zinc-100 to-zinc-400 text-zinc-900 shadow-[0_8px_0_#3f3f46]",
    shape: "rounded-2xl",
  },
  EXPLOSION: {
    className:
      "bg-red-600 text-yellow-200 shadow-[0_8px_0_#7f1d1d] ring-4 ring-yellow-400/50",
    shape: "rounded-full",
  },
  CURSE: {
    className:
      "bg-emerald-950 text-emerald-200 shadow-[0_8px_0_#022c22] ring-1 ring-emerald-400/40",
    shape: "rounded-[2rem]",
  },
  PORTAL: {
    className:
      "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-300 text-white shadow-[0_8px_0_#6b21a8]",
    shape: "rounded-full",
  },
  TIME: {
    className:
      "bg-stone-800 text-amber-200 shadow-[0_8px_0_#1c1917] font-serif",
    shape: "rounded-full",
  },
  INVERT: {
    className:
      "bg-white text-black shadow-[0_8px_0_#111] border-2 border-black",
    shape: "rounded-none",
  },
  GHOST: {
    className:
      "bg-slate-100/20 text-slate-100 shadow-[0_8px_0_#334155] backdrop-blur",
    shape: "rounded-[40%]",
  },
  CONFETTI: {
    className:
      "bg-pink-400 text-white shadow-[0_8px_0_#9d174d] hover:bg-pink-300",
    shape: "rounded-2xl",
  },
  RAINBOW: {
    className:
      "bg-gradient-to-r from-red-400 via-yellow-300 to-blue-500 text-slate-900 shadow-[0_8px_0_#1e3a8a]",
    shape: "rounded-2xl",
  },
  JUKEBOX: {
    className:
      "bg-gradient-to-b from-rose-500 to-amber-500 text-white shadow-[0_8px_0_#9a3412]",
    shape: "rounded-t-[2rem] rounded-b-md",
  },
  COUNTER: {
    className:
      "bg-zinc-200 text-zinc-900 shadow-[0_8px_0_#52525b] font-mono",
    shape: "rounded-lg",
  },
  SHAKE: {
    className:
      "bg-amber-700 text-amber-50 shadow-[0_8px_0_#78350f]",
    shape: "rounded-md",
  },
};

const RARITY_GLOW: Record<ButtonRarity, string> = {
  COMMON: "",
  UNCOMMON: "shadow-[0_0_24px_rgba(52,211,153,0.25)]",
  RARE: "shadow-[0_0_28px_rgba(56,189,248,0.35)]",
  EPIC: "shadow-[0_0_32px_rgba(192,132,252,0.4)]",
  LEGENDARY: "shadow-[0_0_36px_rgba(251,191,36,0.45)]",
  MYTHICAL: "shadow-[0_0_40px_rgba(244,63,94,0.5)]",
  SECRET: "shadow-[0_0_48px_rgba(255,255,255,0.35)]",
};

export default function MuseumButton({ exhibit }: { exhibit: MuseumButtonData }) {
  const { press, vanished, teleports, scales, counters, buttonPresses, echoPending } = useMuseumFX();
  const look = LOOK[exhibit.behavior];
  const gone = vanished.has(exhibit.id);
  const offset = teleports[exhibit.id];
  const scale = scales[exhibit.id] ?? 1;
  const count = counters[exhibit.id] ?? 0;
  const personalPresses = buttonPresses[exhibit.id] ?? 0;
  const label = personalPresses >= 8 ? "WE NEED TO TALK" : personalPresses >= 4 ? `AGAIN? (${personalPresses})` : personalPresses >= 2 ? `STILL ${exhibit.name}` : exhibit.name;

  if (gone) {
    return (
      <div className="flex h-20 items-center justify-center text-xs italic text-violet-300/70">
        [exhibit stepped out]
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06, rotate: exhibit.behavior === "INSULT" ? -4 : 0 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        x: offset?.x ?? 0,
        y: offset?.y ?? 0,
        scale: echoPending && exhibit.behavior === "ECHO" ? [1, 1.08, 1] : scale,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={() => press(exhibit)}
      className={`relative max-w-[15.5rem] px-5 py-4 text-center text-[15px] font-black uppercase leading-tight tracking-wide transition active:shadow-none ${look.shape} ${look.className} ${RARITY_GLOW[exhibit.rarity]}`}
    >
      {exhibit.behavior === "COUNTER" ? `${label} · ${count}` : label}
      {exhibit.behavior === "TIME" && (
        <span className="absolute -right-2 -top-2 rounded-full bg-amber-300 px-2 py-0.5 text-[10px] text-black">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </motion.button>
  );
}
