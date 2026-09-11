"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import ExhibitCard from "@/components/museum/ExhibitCard";
import { MuseumFXProvider, useMuseumFX } from "@/components/museum/MuseumFX";
import { secretButton } from "@/data/buttons/starter-buttons";
import { WING_META } from "@/lib/buttons/catalog";
import { MuseumButtonData, MuseumWing } from "@/types/button";
import { InteractionScene } from "@/lib/button-engine/interactions";

const WING_ORDER: MuseumWing[] = [
  "temptation",
  "unstable",
  "forbidden",
  "celebration",
];

export default function MuseumHall({
  exhibits,
  dbError,
}: {
  exhibits: MuseumButtonData[];
  dbError?: string;
}) {
  return (
    <MuseumFXProvider>
      <HallInner exhibits={exhibits} dbError={dbError} />
    </MuseumFXProvider>
  );
}

function HallInner({
  exhibits,
  dbError,
}: {
  exhibits: MuseumButtonData[];
  dbError?: string;
}) {
  const fx = useMuseumFX();
  const revealSecret = fx.uniquePresses >= 7 || fx.secretKnocks >= 5;
  const collection = revealSecret
    ? exhibits.some((item) => item.id === secretButton.id)
      ? exhibits
      : [...exhibits, secretButton]
    : exhibits;

  const grouped = WING_ORDER.map((wing) => ({
    wing,
    items: collection.filter((item) => (item.wing ?? "temptation") === wing),
  })).filter((group) => group.items.length > 0);

  const hallClass = [
    "museum-hall relative min-h-screen overflow-x-hidden text-amber-50",
    fx.shake && "museum-shake",
    fx.invert && "museum-invert",
    fx.mirror && "museum-mirror",
    fx.glitch && "museum-glitch",
    fx.rainbow && "museum-rainbow",
    fx.ghost && "museum-ghost",
    fx.curse && "museum-curse",
    fx.timeWarp && "museum-time",
    fx.portal && "museum-portal",
    fx.screenPulse && "museum-screen-pulse",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={hallClass}>
      <div className="museum-atmosphere" />
      <div className="museum-vignette" />

      {fx.flash === "boom" && <div className="museum-flash boom" />}
      {fx.flash === "rainbow" && <div className="museum-flash rainbow" />}
      {fx.portal && <div className="museum-vortex" />}
      {fx.scene && <SceneOverlay scene={fx.scene} onClose={fx.dismissScene} />}
      {fx.spectacle && <div key={fx.spectacle.id} className={`museum-spectacle spectacle-${fx.spectacle.variant}`} style={{ "--spectacle-hue": fx.spectacle.hue } as CSSProperties}><span>✦</span><b>{fx.spectacle.name}</b><i>an exhibit-specific visual event</i></div>}

      {fx.particles.map((particle) => (
        <span
          key={particle.id}
          className={particle.kind === "bubble" ? "soap-bubble" : "confetti-bit"}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            background: particle.kind === "bubble" ? "transparent" : particle.color,
            borderColor: particle.color,
            transform: `rotate(${particle.rotate}deg)`,
          }}
        />
      ))}

      <header className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-16 text-center">
        <p className="font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.5em] text-amber-200/70">
          Est. whenever · admission: one bad decision
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-5xl font-semibold sm:text-7xl">
          Button Museum
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-stone-300">
          A dim hall of things you were asked not to press, plus a few that will
          thank you, hex you, or relocate themselves to the ceiling.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.25em] text-amber-100/80">
          <span className="rounded-full border border-amber-200/20 px-4 py-2">
            {collection.length} exhibits
          </span>
          <span className="rounded-full border border-amber-200/20 px-4 py-2">
            {fx.totalPresses} presses tonight
          </span>
          <span className="rounded-full border border-amber-200/20 px-4 py-2">
            {fx.uniquePresses} disturbed
          </span>
          <span className="rounded-full border border-amber-200/20 px-4 py-2 text-emerald-200">
            {fx.museumBucks} museum bucks
          </span>
        </div>
        <p className="mt-4 text-xs text-stone-400">
          Live attendance: {fx.visitors.toLocaleString()} · This number is independently unverifiable.
        </p>
        <button type="button" onClick={fx.toggleMusic} className={`mt-4 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition ${fx.musicOn ? "border-pink-300/60 bg-pink-400/15 text-pink-100" : "border-amber-200/20 text-stone-400 hover:text-amber-100"}`}>{fx.musicOn ? "♫ Museum radio: on" : "♫ Start museum radio"}</button>
        {dbError && (
          <p className="mt-4 text-xs text-amber-400/80">
            Vault sync skipped — showing the house collection. ({dbError})
          </p>
        )}
      </header>

      <div className="relative z-10 mx-auto max-w-6xl space-y-20 px-6 pb-28">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="museum-ledger rounded-3xl border border-amber-200/15 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/60">Museum economic dashboard</p>
                <h2 className="mt-1 font-[family-name:var(--font-cinzel)] text-xl">The Button-Based Economy™</h2>
              </div>
              <span className="rounded-full bg-rose-400/10 px-3 py-1 text-[10px] uppercase tracking-wider text-rose-200">audited by nobody</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
              <div><strong className="block text-lg text-emerald-200">{fx.museumBucks}</strong>unspendable bucks</div>
              <div><strong className="block text-lg text-rose-200">-{fx.museumDebt}</strong>emotional debt</div>
              <div><strong className="block text-lg text-amber-100">{fx.chaosLevel}%</strong>regulated chaos</div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-950"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500 transition-all duration-500" style={{ width: `${fx.chaosLevel}%` }} /></div>
            <p className="mt-3 text-xs text-stone-400">Current curator mood: <span className="text-amber-100">{fx.curatorMood}</span>. Treasury advice: press things to improve the numbers. Do not ask how.</p>
          </div>
          <div className="museum-ledger rounded-3xl border border-amber-200/15 p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/60">Achievement cabinet</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {fx.achievements.map((achievement) => <div key={achievement.id} className={`rounded-xl border p-2 text-[10px] ${achievement.unlocked ? "border-amber-300/40 bg-amber-300/10 text-amber-100" : "border-white/5 bg-black/20 text-stone-500"}`} title={achievement.description}><span className="mr-1">{achievement.unlocked ? "✦" : "○"}</span>{achievement.title}</div>)}
            </div>
            <button type="button" onClick={fx.knockOnDesk} className="mt-4 text-xs text-stone-400 underline decoration-dotted underline-offset-4 hover:text-amber-100">Knock on the curator&apos;s desk ({Math.min(fx.secretKnocks, 5)}/5)</button>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Completely meaningful museum telemetry">
          {[
            ["Website IQ", `${(3 + fx.totalPresses / 10000).toFixed(5)}`],
            ["Temperature", "14.7 potatoes"],
            ["CPU Usage", "133%"],
            ["Server", "probably fine"],
            ["Productivity", `-${47 + fx.totalPresses} min`],
            ["Button happiness", fx.chaosLevel > 55 ? "concerning" : "suspiciously high"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3 text-center">
              <p className="text-[9px] uppercase tracking-[0.18em] text-stone-500">{label}</p>
              <p className="mt-1 text-xs text-amber-100">{value}</p>
            </div>
          ))}
        </section>
        {grouped.map((group) => (
          <section key={group.wing}>
            <div className="mb-8 flex flex-col gap-2 border-b border-amber-200/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-amber-200/50">
                  {WING_META[group.wing].kicker}
                </p>
                <h2 className="font-[family-name:var(--font-cinzel)] text-3xl">
                  {WING_META[group.wing].title}
                </h2>
              </div>
              <p className="max-w-md text-sm text-stone-400">
                {WING_META[group.wing].blurb}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((exhibit, index) => (
                <motion.div
                  key={exhibit.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <ExhibitCard exhibit={exhibit} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {!revealSecret && (
          <p className="text-center text-xs tracking-[0.3em] text-stone-500 uppercase">
            Press seven different exhibits to unseal the curator&apos;s office
          </p>
        )}
      </div>

      {fx.toast && (
        <div key={fx.reactionId} className="museum-big-popup pointer-events-none fixed left-1/2 top-1/2 z-40 w-[min(92vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border-2 border-amber-200/45 bg-stone-950/95 px-7 py-8 text-center shadow-[0_0_90px_rgba(251,191,36,0.28)] backdrop-blur sm:px-12 sm:py-10">
          <p className="museum-stamp text-xs font-black uppercase tracking-[0.35em] text-pink-300 sm:text-sm">{fx.reactionStamp}</p>
          <p className="mt-4 font-[family-name:var(--font-cinzel)] text-2xl leading-tight text-amber-50 sm:text-4xl">
            {fx.whisper ?? fx.toast}
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-stone-400">Please remain calm. This is exactly what the exhibit wanted.</p>
        </div>
      )}

      {fx.log.length > 0 && (
        <aside className="fixed bottom-6 right-6 z-30 hidden w-64 rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-stone-300 backdrop-blur lg:block">
          <p className="mb-2 font-[family-name:var(--font-cinzel)] tracking-[0.2em] text-amber-200/70 uppercase">
            Incident log
          </p>
          <ul className="space-y-2">
            {fx.log.slice(0, 5).map((entry, index) => (
              <li key={`${entry}-${index}`} className="leading-snug text-stone-400">
                {entry}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}

function SceneOverlay({ scene, onClose }: { scene: InteractionScene; onClose: () => void }) {
  const art: Record<InteractionScene, { icon: string; title: string; detail: string }> = {
    speed: { icon: "⚡", title: "OPTIMIZING… 103%", detail: "Please do not unplug the imaginary server." },
    warning: { icon: "⚠", title: "CRITICAL BUTTON BUSINESS", detail: "This is much more dramatic than necessary." },
    brain: { icon: "🧠", title: "BRAIN EXPANSION", detail: "One thought is being carefully inflated." },
    repair: { icon: "🔧", title: "REPAIR TORNADO", detail: "Turning screws until the situation changes." },
    download: { icon: "💾", title: "DOWNLOADING RAM", detail: "0%  ·  23%  ·  67%  ·  99%  ·  100%" },
    spotlight: { icon: "★", title: "FAME DETECTED", detail: "Please wave to the three imaginary cameras." },
    door: { icon: "🚪", title: "A VERY SERIOUS DOOR", detail: "It goes nowhere with breathtaking confidence." },
    nothing: { icon: "…", title: "NOTHING IN PROGRESS", detail: "The nothing is proceeding exactly as planned." },
    refund: { icon: "🧾", title: "TIME REFUND DEPARTMENT", detail: "Your ticket has been ceremonially shredded." },
    luck: { icon: "🍀", title: "LUCK WEATHER REPORT", detail: "Heavy disappointment with a chance of worse." },
    calculator: { icon: "7", title: "SCIENTIFIC NOTHING", detail: "The calculator has reached a strongly held conclusion." },
    developer: { icon: "👻", title: "DEVELOPER SUMMONING", detail: "The developer is typing… elsewhere." },
    ceo: { icon: "☎", title: "CEO HOTLINE", detail: "Your call is important to a button." },
    grass: { icon: "🌱", title: "GRASS DEPLOYED", detail: "Outdoor simulation will self-destruct shortly." },
    emergency: { icon: "🚨", title: "CRITICAL EMERGENCY", detail: "Remain calm. Panic is available in the gift shop." },
    countdown: { icon: "💥", title: "5 · 4 · 3 · 2 · 1", detail: "Please admire the complete lack of consequences." },
    money: { icon: "💸", title: "WEALTH EVENT", detail: "$0.01 has entered and immediately left the building." },
    ai: { icon: "◉", title: "ARTIFICIAL INTELLIGENCE", detail: "It has generated one unhelpful thought." },
    world: { icon: "🌍", title: "SOLVING EVERYTHING", detail: "0% · 32% · 78% · 99% · 100% · never mind." },
    close: { icon: "✕", title: "CLOSE WEBSITE?", detail: "NO. The museum has politely refused." },
  };
  const item = art[scene];
  return (
    <div className={`museum-scene scene-${scene}`}>
      <div className="museum-scene-art"><span>{item.icon}</span><b>{item.title}</b><small>{item.detail}</small>{scene === "door" && <button type="button" onClick={onClose}>CLOSE DOOR</button>}</div>
    </div>
  );
}
