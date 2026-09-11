"use client";

import MuseumButton from "@/components/buttons/MuseumButton";
import { useMuseumFX } from "@/components/museum/MuseumFX";
import { ButtonRarity, MuseumButtonData } from "@/types/button";

const RARITY_STYLE: Record<ButtonRarity, string> = {
  COMMON: "bg-stone-700 text-stone-200",
  UNCOMMON: "bg-emerald-800 text-emerald-100",
  RARE: "bg-sky-800 text-sky-100",
  EPIC: "bg-violet-800 text-violet-100",
  LEGENDARY: "bg-amber-700 text-amber-50",
  MYTHICAL: "bg-rose-800 text-rose-100",
  SECRET: "bg-white text-black",
};

export default function ExhibitCard({ exhibit }: { exhibit: MuseumButtonData }) {
  const { buttonPresses } = useMuseumFX();
  const presses = buttonPresses[exhibit.id] ?? 0;
  return (
    <article className="exhibit-card group relative flex min-h-[300px] flex-col items-center overflow-visible rounded-[1.75rem] border border-amber-200/15 bg-gradient-to-b from-stone-900/80 to-stone-950/90 p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-16 bg-gradient-to-b from-amber-100/10 to-transparent" />
      <p className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.35em] text-amber-200/60">
        Acc. {exhibit.year ?? exhibit.id}
      </p>
      <div className="mt-6 flex flex-1 items-center justify-center">
        <MuseumButton exhibit={exhibit} />
      </div>
      <h3 className="mt-6 text-center font-[family-name:var(--font-cinzel)] text-lg text-amber-50">
        {exhibit.name}
      </h3>
      <p className="mt-2 text-center text-sm leading-relaxed text-stone-400">
        {exhibit.description}
      </p>
      {presses > 0 && (
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-amber-200/60">
          Plaque amended after {presses} {presses === 1 ? "incident" : "incidents"}: {presses >= 5 ? "visitor is now considered family" : "exhibit is watching"}
        </p>
      )}
      <span
        className={`mt-5 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] ${RARITY_STYLE[exhibit.rarity]}`}
      >
        {exhibit.rarity}
      </span>
    </article>
  );
}
