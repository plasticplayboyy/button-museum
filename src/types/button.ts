export type ButtonRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "EPIC"
  | "LEGENDARY"
  | "MYTHICAL"
  | "SECRET";

export type MuseumWing =
  | "temptation"
  | "unstable"
  | "forbidden"
  | "celebration";

export type ButtonBehavior =
  | "NORMAL"
  | "SHAKE"
  | "CONFETTI"
  | "ALERT"
  | "RANDOM"
  | "DISAPPEAR"
  | "COUNTER"
  | "EXPLOSION"
  | "TELEPORT"
  | "INSULT"
  | "GLITCH"
  | "RAINBOW"
  | "GHOST"
  | "ECHO"
  | "TIME"
  | "JUKEBOX"
  | "SHRINK"
  | "GROW"
  | "INVERT"
  | "WHISPER"
  | "PORTAL"
  | "CURSE"
  | "BUBBLE"
  | "MIRROR";

export type MuseumButtonData = {
  id: string;
  name: string;
  description: string;
  rarity: ButtonRarity;
  behavior: ButtonBehavior;
  wing?: MuseumWing;
  year?: string;
};

export type BehaviorResult = {
  message: string;
  effect: ButtonBehavior;
};

export type MuseumAchievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};
