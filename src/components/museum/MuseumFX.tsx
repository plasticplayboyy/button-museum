"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { runButtonBehavior } from "@/lib/button-engine/engine";
import { getInteraction, InteractionScene } from "@/lib/button-engine/interactions";
import { animationSignature } from "@/lib/button-engine/signature";
import { ButtonBehavior, MuseumAchievement, MuseumButtonData } from "@/types/button";

type Particle = {
  id: number;
  left: number;
  delay: number;
  color: string;
  kind: "confetti" | "bubble";
  rotate: number;
};

type MuseumFXValue = {
  toast: string | null;
  whisper: string | null;
  log: string[];
  uniquePresses: number;
  totalPresses: number;
  shake: boolean;
  invert: boolean;
  mirror: boolean;
  glitch: boolean;
  rainbow: boolean;
  ghost: boolean;
  curse: boolean;
  timeWarp: boolean;
  portal: boolean;
  flash: "boom" | "rainbow" | null;
  particles: Particle[];
  vanished: Set<string>;
  teleports: Record<string, { x: number; y: number }>;
  scales: Record<string, number>;
  counters: Record<string, number>;
  buttonPresses: Record<string, number>;
  museumBucks: number;
  museumDebt: number;
  visitors: number;
  chaosLevel: number;
  curatorMood: string;
  achievements: MuseumAchievement[];
  secretKnocks: number;
  screenPulse: boolean;
  reactionId: number;
  reactionStamp: string;
  scene: InteractionScene | null;
  echoPending: boolean;
  press: (exhibit: MuseumButtonData) => void;
  knockOnDesk: () => void;
  dismissScene: () => void;
  musicOn: boolean;
  toggleMusic: () => void;
  spectacle: { name: string; variant: number; hue: number; id: number } | null;
};

const MuseumFXContext = createContext<MuseumFXValue | null>(null);

export function useMuseumFX() {
  const value = useContext(MuseumFXContext);
  if (!value) {
    throw new Error("useMuseumFX must be used inside MuseumFXProvider");
  }
  return value;
}

function playBeep(freq: number, duration: number, type: OscillatorType = "square") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch {
    // Audio is optional flavor.
  }
}

function playJingle() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((note, index) => {
    window.setTimeout(() => playBeep(note, 0.18, "triangle"), index * 140);
  });
}

export function MuseumFXProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [uniqueIds, setUniqueIds] = useState<string[]>([]);
  const [totalPresses, setTotalPresses] = useState(0);
  const [shake, setShake] = useState(false);
  const [invert, setInvert] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [rainbow, setRainbow] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [curse, setCurse] = useState(false);
  const [timeWarp, setTimeWarp] = useState(false);
  const [portal, setPortal] = useState(false);
  const [flash, setFlash] = useState<"boom" | "rainbow" | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [vanished, setVanished] = useState<Set<string>>(new Set());
  const [teleports, setTeleports] = useState<Record<string, { x: number; y: number }>>({});
  const [scales, setScales] = useState<Record<string, number>>({});
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [buttonPresses, setButtonPresses] = useState<Record<string, number>>({});
  const [museumBucks, setMuseumBucks] = useState(17);
  const [museumDebt, setMuseumDebt] = useState(0);
  const [visitors, setVisitors] = useState(1_842_003);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [curatorMood, setCuratorMood] = useState("professionally concerned");
  const [secretKnocks, setSecretKnocks] = useState(0);
  const [screenPulse, setScreenPulse] = useState(false);
  const [reactionId, setReactionId] = useState(0);
  const [reactionStamp, setReactionStamp] = useState("MUSEUM APPROVED");
  const [scene, setScene] = useState<InteractionScene | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [spectacle, setSpectacle] = useState<{ name: string; variant: number; hue: number; id: number } | null>(null);
  const [echoPending, setEchoPending] = useState(false);
  const lastExhibit = useRef<MuseumButtonData | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      progress = event.key === sequence[progress] ? progress + 1 : event.key === sequence[0] ? 1 : 0;
      if (progress === sequence.length) {
        setSecretKnocks(5);
        setToast("THE ARCHIVIST NOTICED YOUR ANCIENT CHEAT CODE.");
        setLog((current) => ["A prohibited keyboard ritual opened a tiny drawer.", ...current].slice(0, 8));
        progress = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("button-museum-progress-v2");
    if (saved) try {
      const progress = JSON.parse(saved) as { totalPresses?: number; buttonPresses?: Record<string, number>; museumBucks?: number; museumDebt?: number; uniqueIds?: string[]; chaosLevel?: number; secretKnocks?: number };
      setTotalPresses(progress.totalPresses ?? 0);
      setButtonPresses(progress.buttonPresses ?? {});
      setMuseumBucks(progress.museumBucks ?? 17);
      setMuseumDebt(progress.museumDebt ?? 0);
      setUniqueIds(progress.uniqueIds ?? []);
      setChaosLevel(progress.chaosLevel ?? 0);
      setSecretKnocks(progress.secretKnocks ?? 0);
    } catch { /* The museum respectfully ignores corrupted memories. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("button-museum-progress-v2", JSON.stringify({ totalPresses, buttonPresses, museumBucks, museumDebt, uniqueIds, chaosLevel, secretKnocks }));
  }, [buttonPresses, chaosLevel, hydrated, museumBucks, museumDebt, secretKnocks, totalPresses, uniqueIds]);

  useEffect(() => {
    if (!musicOn) return;
    const interval = window.setInterval(() => playMuseumRadio(), 4400);
    playMuseumRadio();
    return () => window.clearInterval(interval);
  }, [musicOn]);

  const pulse = useCallback((setter: (value: boolean) => void, ms: number) => {
    setter(true);
    const id = window.setTimeout(() => setter(false), ms);
    timers.current.push(id);
  }, []);

  const spawnParticles = useCallback((kind: "confetti" | "bubble", count: number) => {
    const colors = ["#f43f5e", "#fbbf24", "#34d399", "#38bdf8", "#c084fc", "#fb7185"];
    const next: Particle[] = Array.from({ length: count }, (_, index) => ({
      id: Date.now() + index,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: colors[index % colors.length],
      kind,
      rotate: Math.random() * 360,
    }));
    setParticles((current) => [...current, ...next].slice(-80));
    const id = window.setTimeout(() => {
      setParticles((current) => current.filter((p) => !next.includes(p)));
    }, 2800);
    timers.current.push(id);
  }, []);

  const applyEffect = useCallback(
    (exhibit: MuseumButtonData, effect: ButtonBehavior, message: string, sceneName: InteractionScene | null) => {
      const nextPress = (buttonPresses[exhibit.id] ?? 0) + 1;
      const repeatRemark =
        nextPress === 2
          ? " It recognizes you. This is not necessarily good."
          : nextPress === 5
            ? " Five presses. The button has drafted a short biography of you."
            : nextPress >= 9 && nextPress % 3 === 0
              ? " The button would like some space, but respects your commitment."
              : "";
      const fullMessage = `${message}${repeatRemark}`;
      setToast(fullMessage);
      setWhisper(effect === "WHISPER" ? message : null);
      setLog((current) => [`${exhibit.name}: ${fullMessage}`, ...current].slice(0, 8));
      setUniqueIds((current) =>
        current.includes(exhibit.id) ? current : [...current, exhibit.id],
      );
      setTotalPresses((count) => count + 1);
      setButtonPresses((current) => ({ ...current, [exhibit.id]: (current[exhibit.id] ?? 0) + 1 }));
      const payout = 1 + Math.floor(Math.random() * 13);
      setMuseumBucks((current) => current + payout);
      setMuseumDebt((current) => current + (effect === "EXPLOSION" || effect === "CURSE" ? 7 : Math.random() > 0.78 ? 1 : 0));
      setVisitors((current) => current + 11 + Math.floor(Math.random() * 900));
      setChaosLevel((current) => Math.min(100, current + (effect === "NORMAL" ? 1 : 3 + Math.floor(Math.random() * 8))));
      setCuratorMood(pickCuratorMood(effect));
      setReactionId((current) => current + 1);
      setReactionStamp(pickReactionStamp(effect));
      const signature = animationSignature(exhibit.id);
      setSpectacle({ ...signature, id: Date.now() });
      timers.current.push(window.setTimeout(() => setSpectacle(null), 1650));
      if (musicOn) playMotif(signature.seed);
      pulse(setScreenPulse, 720);
      spawnParticles("confetti", 9);
      if (sceneName) {
        setScene(sceneName);
        timers.current.push(window.setTimeout(() => setScene(null), 2400));
      }
      if (Math.random() < 0.1) {
        const anomalies = [
          "ANOMALY: a button has requested a lunch break.",
          "Museum weather alert: light chance of falling buttons.",
          "Security detected a potato with excellent posture.",
          "A random exhibit is pretending to update itself.",
          "Cursor inspection complete. It passed, barely.",
        ];
        const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        timers.current.push(window.setTimeout(() => {
          setToast(anomaly);
          setLog((current) => [anomaly, ...current].slice(0, 8));
          pulse(setGlitch, 650);
        }, 850));
      }

      switch (effect) {
        case "SHAKE":
          pulse(setShake, 900);
          playBeep(90, 0.4, "sawtooth");
          break;
        case "CONFETTI":
          spawnParticles("confetti", 36);
          playJingle();
          break;
        case "BUBBLE":
          spawnParticles("bubble", 18);
          playBeep(880, 0.2, "sine");
          break;
        case "EXPLOSION":
          setFlash("boom");
          pulse(setShake, 700);
          playBeep(70, 0.6, "sawtooth");
          timers.current.push(window.setTimeout(() => setFlash(null), 700));
          break;
        case "DISAPPEAR":
          setVanished((current) => new Set(current).add(exhibit.id));
          if (exhibit.id === "delete-button") {
            timers.current.push(window.setTimeout(() => {
              setVanished((current) => {
                const next = new Set(current);
                next.delete(exhibit.id);
                return next;
              });
              setToast("Did you really think that would work?");
            }, 2600));
          }
          break;
        case "TELEPORT":
          setTeleports((current) => ({
            ...current,
            [exhibit.id]: {
              x: (Math.random() - 0.5) * 140,
              y: (Math.random() - 0.5) * 90,
            },
          }));
          break;
        case "COUNTER":
          setCounters((current) => ({
            ...current,
            [exhibit.id]: (current[exhibit.id] ?? 0) + 1,
          }));
          playBeep(440, 0.08);
          break;
        case "GLITCH":
          pulse(setGlitch, 1200);
          playBeep(1400, 0.05);
          playBeep(200, 0.2, "square");
          break;
        case "RAINBOW":
          setFlash("rainbow");
          pulse(setRainbow, 2200);
          timers.current.push(window.setTimeout(() => setFlash(null), 500));
          break;
        case "GHOST":
          pulse(setGhost, 2200);
          playBeep(220, 0.8, "sine");
          break;
        case "ECHO":
          setEchoPending(true);
          timers.current.push(
            window.setTimeout(() => {
              setEchoPending(false);
              setToast(`${message} (encore)`);
            }, 700),
          );
          break;
        case "TIME":
          pulse(setTimeWarp, 2000);
          break;
        case "JUKEBOX":
          playJingle();
          break;
        case "SHRINK":
          setScales((current) => ({
            ...current,
            [exhibit.id]: Math.max(0.45, (current[exhibit.id] ?? 1) * 0.82),
          }));
          break;
        case "GROW":
          setScales((current) => ({
            ...current,
            [exhibit.id]: Math.min(1.7, (current[exhibit.id] ?? 1) * 1.18),
          }));
          break;
        case "INVERT":
          pulse(setInvert, 1800);
          break;
        case "WHISPER":
          playBeep(980, 0.12, "sine");
          break;
        case "PORTAL":
          pulse(setPortal, 1600);
          playBeep(160, 0.5, "triangle");
          break;
        case "CURSE":
          pulse(setCurse, 2400);
          playBeep(55, 0.7, "sawtooth");
          break;
        case "MIRROR":
          pulse(setMirror, 2000);
          break;
        case "ALERT":
          playBeep(620, 0.25);
          break;
        default:
          playBeep(330, 0.1, "triangle");
      }
    },
    [buttonPresses, pulse, spawnParticles],
  );

  const press = useCallback(
    (exhibit: MuseumButtonData) => {
      lastExhibit.current = exhibit;
      const result = runButtonBehavior(exhibit.behavior);
      const nextPress = (buttonPresses[exhibit.id] ?? 0) + 1;
      const interaction = getInteraction(exhibit.id, nextPress, result.message);
      applyEffect(exhibit, result.effect, interaction.message, interaction.scene);
    },
    [applyEffect, buttonPresses],
  );

  const knockOnDesk = useCallback(() => {
    setSecretKnocks((current) => current + 1);
    const next = secretKnocks + 1;
    setToast(next >= 5 ? "A drawer opens. Inside: one perfectly ordinary, deeply suspicious paperclip." : `Desk knock logged (${next}/5). Please stop training the furniture.`);
    if (next >= 5) {
      setMuseumBucks((current) => current + 50);
      setLog((current) => ["The curator's desk yielded a paperclip and a bribe.", ...current].slice(0, 8));
    }
  }, [secretKnocks]);

  const dismissScene = useCallback(() => setScene(null), []);
  const toggleMusic = useCallback(() => setMusicOn((current) => !current), []);

  const achievements = useMemo<MuseumAchievement[]>(() => {
    const repeatOffender = Object.values(buttonPresses).some((count) => count >= 5);
    return [
      { id: "first", title: "Touched History", description: "Press one exhibit despite the signage.", unlocked: totalPresses >= 1 },
      { id: "tour", title: "Unsupervised Tour", description: "Disturb seven different exhibits.", unlocked: uniqueIds.length >= 7 },
      { id: "repeat", title: "Button Relationship", description: "Press one exhibit five times.", unlocked: repeatOffender },
      { id: "economy", title: "Fiscal Archaeologist", description: "Accumulate 100 Museum Bucks.", unlocked: museumBucks >= 100 },
      { id: "incident", title: "Incident Report", description: "Reach 50% certified chaos.", unlocked: chaosLevel >= 50 },
      { id: "drawer", title: "Desk Archaeology", description: "Convince the desk to cooperate.", unlocked: secretKnocks >= 5 },
    ];
  }, [buttonPresses, chaosLevel, museumBucks, secretKnocks, totalPresses, uniqueIds.length]);

  const value = useMemo<MuseumFXValue>(
    () => ({
      toast,
      whisper,
      log,
      uniquePresses: uniqueIds.length,
      totalPresses,
      shake,
      invert,
      mirror,
      glitch,
      rainbow,
      ghost,
      curse,
      timeWarp,
      portal,
      flash,
      particles,
      vanished,
      teleports,
      scales,
      counters,
      buttonPresses,
      museumBucks,
      museumDebt,
      visitors,
      chaosLevel,
      curatorMood,
      achievements,
      secretKnocks,
      screenPulse,
      reactionId,
      reactionStamp,
      scene,
      echoPending,
      press,
      knockOnDesk,
      dismissScene,
      musicOn,
      toggleMusic,
      spectacle,
    }),
    [
      toast,
      whisper,
      log,
      uniqueIds.length,
      totalPresses,
      shake,
      invert,
      mirror,
      glitch,
      rainbow,
      ghost,
      curse,
      timeWarp,
      portal,
      flash,
      particles,
      vanished,
      teleports,
      scales,
      counters,
      buttonPresses,
      museumBucks,
      museumDebt,
      visitors,
      chaosLevel,
      curatorMood,
      achievements,
      secretKnocks,
      screenPulse,
      reactionId,
      reactionStamp,
      scene,
      echoPending,
      press,
      knockOnDesk,
      dismissScene,
      musicOn,
      toggleMusic,
      spectacle,
    ],
  );

  return (
    <MuseumFXContext.Provider value={value}>{children}</MuseumFXContext.Provider>
  );
}

function pickCuratorMood(effect: ButtonBehavior) {
  if (effect === "EXPLOSION" || effect === "CURSE") return "preparing a strongly worded plaque";
  if (effect === "CONFETTI" || effect === "RAINBOW") return "begrudgingly delighted";
  return ["professionally concerned", "counting to ten in Latin", "reconsidering public access", "pretending this is interactive art"][Math.floor(Math.random() * 4)];
}

function pickReactionStamp(effect: ButtonBehavior) {
  const stamps = [
    "2× MUSEUM VALUE",
    "VERY IMPORTANT CLICK",
    "CERTIFIED BUTTON MOMENT",
    "THE WALLS NOTICED",
    "+1 QUESTIONABLE DECISION",
    "INTERACTION ACHIEVED",
  ];
  if (effect === "EXPLOSION") return "BOOM, BUT CULTURALLY";
  if (effect === "CURSE") return "HEX RECEIPT PRINTED";
  if (effect === "CONFETTI") return "PARTY PERMIT DENIED";
  return stamps[Math.floor(Math.random() * stamps.length)];
}

function playMotif(seed: number) {
  const scales = [[262, 330, 392, 523], [220, 277, 330, 440], [294, 370, 440, 587], [196, 247, 294, 392]];
  const notes = scales[seed % scales.length];
  notes.forEach((note, index) => window.setTimeout(() => playBeep(note * (seed % 3 === 0 ? 0.5 : 1), 0.16, index % 2 ? "triangle" : "sine"), index * 105));
}

function playMuseumRadio() {
  const notes = [262, 330, 392, 330, 294];
  notes.forEach((note, index) => window.setTimeout(() => playBeep(note, 0.2, "triangle"), index * 180));
}
