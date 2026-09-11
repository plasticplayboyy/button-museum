import { starterButtons } from "@/data/buttons/starter-buttons";
import { supabase } from "@/lib/supabase";
import {
  ButtonBehavior,
  ButtonRarity,
  MuseumButtonData,
  MuseumWing,
} from "@/types/button";

const BEHAVIORS = new Set<ButtonBehavior>([
  "NORMAL",
  "SHAKE",
  "CONFETTI",
  "ALERT",
  "RANDOM",
  "DISAPPEAR",
  "COUNTER",
  "EXPLOSION",
  "TELEPORT",
  "INSULT",
  "GLITCH",
  "RAINBOW",
  "GHOST",
  "ECHO",
  "TIME",
  "JUKEBOX",
  "SHRINK",
  "GROW",
  "INVERT",
  "WHISPER",
  "PORTAL",
  "CURSE",
  "BUBBLE",
  "MIRROR",
]);

const RARITIES = new Set<ButtonRarity>([
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
  "MYTHICAL",
  "SECRET",
]);

export function inferWing(behavior: ButtonBehavior): MuseumWing {
  switch (behavior) {
    case "ALERT":
    case "INSULT":
    case "NORMAL":
    case "WHISPER":
    case "BUBBLE":
      return "temptation";
    case "RANDOM":
    case "DISAPPEAR":
    case "TELEPORT":
    case "GLITCH":
    case "SHRINK":
    case "GROW":
    case "ECHO":
    case "MIRROR":
      return "unstable";
    case "EXPLOSION":
    case "CURSE":
    case "PORTAL":
    case "TIME":
    case "INVERT":
    case "GHOST":
      return "forbidden";
    default:
      return "celebration";
  }
}

function normalize(row: Record<string, unknown>, index: number): MuseumButtonData {
  const behavior = BEHAVIORS.has(row.behavior as ButtonBehavior)
    ? (row.behavior as ButtonBehavior)
    : "NORMAL";
  const rarity = RARITIES.has(row.rarity as ButtonRarity)
    ? (row.rarity as ButtonRarity)
    : "COMMON";

  return {
    id: String(row.id ?? `db-${index}`),
    name: String(row.name ?? "UNNAMED"),
    description: String(row.description ?? "A button of mysterious provenance."),
    rarity,
    behavior,
    wing: inferWing(behavior),
    year: typeof row.year === "string" ? row.year : undefined,
  };
}

export async function loadExhibits(): Promise<{
  exhibits: MuseumButtonData[];
  dbError?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("buttons")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return { exhibits: starterButtons, dbError: error.message };
    }

    const localByName = new Map(
      starterButtons.map((button) => [button.name.toLowerCase(), button]),
    );
    const fromDb = (data ?? []).map((row, index) => {
      const exhibit = normalize(row as Record<string, unknown>, index);
      const local = localByName.get(exhibit.name.toLowerCase());
      if (!local) return exhibit;
      return {
        ...exhibit,
        description: local.description,
        wing: local.wing,
        year: local.year,
        rarity: local.rarity,
        behavior: local.behavior,
      };
    });
    const seen = new Set(fromDb.map((button) => button.name.toLowerCase()));
    const extras = starterButtons.filter(
      (button) => !seen.has(button.name.toLowerCase()),
    );

    return { exhibits: [...fromDb, ...extras] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown catalog error";
    return { exhibits: starterButtons, dbError: message };
  }
}

export const WING_META: Record<
  MuseumWing,
  { title: string; kicker: string; blurb: string }
> = {
  temptation: {
    title: "Hall of Temptation",
    kicker: "Wing I",
    blurb: "Buttons that exist to be pressed, and the ones that beg you not to.",
  },
  unstable: {
    title: "The Unstable Collection",
    kicker: "Wing II",
    blurb: "Exhibits that wander, glitch, shrink, or file a complaint with physics.",
  },
  forbidden: {
    title: "Forbidden Annex",
    kicker: "Wing III — staff only-ish",
    blurb: "Do not. Unless you do. Then please initial the incident log.",
  },
  celebration: {
    title: "Festival Conservatory",
    kicker: "Wing IV",
    blurb: "Joy, noise, and one seismic demonstration the architects hate.",
  },
};
