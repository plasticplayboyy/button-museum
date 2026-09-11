import { ButtonBehavior, BehaviorResult } from "@/types/button";

const RANDOM_POOL: ButtonBehavior[] = [
  "ALERT",
  "INSULT",
  "EXPLOSION",
  "CONFETTI",
  "SHAKE",
  "GLITCH",
  "RAINBOW",
  "GHOST",
  "WHISPER",
  "BUBBLE",
  "JUKEBOX",
];

export function runButtonBehavior(behavior: ButtonBehavior): BehaviorResult {
  if (behavior === "RANDOM") {
    const picked =
      RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)];
    const inner = describe(picked);
    return {
      effect: picked,
      message: `The mystery rolled ${picked}. ${inner}`,
    };
  }

  return { effect: behavior, message: describe(behavior) };
}

function describe(behavior: ButtonBehavior): string {
  switch (behavior) {
    case "ALERT":
      return "A guard materializes from behind a fern. You were TOLD not to press that.";
    case "INSULT":
      return pick([
        "Seriously? That's what you decided to do with your one wild life?",
        "The button sighs so loudly the tapestries flutter.",
        "Even the gift shop stapler has more self-control than you.",
      ]);
    case "EXPLOSION":
      return "The hall fills with theatrical smoke. A small flag pops out that says BOOM.";
    case "DISAPPEAR":
      return "The button excuses itself and leaves through a side door that wasn't there.";
    case "SHAKE":
      return "The entire museum rattles. A bust of a former curator loses its nose.";
    case "CONFETTI":
      return "Congratulations! You are today's unplanned celebration.";
    case "COUNTER":
      return "The clicker notes this. It will remember. It always remembers.";
    case "TELEPORT":
      return "Security radios: 'We have a runner. It's the button again.'";
    case "GLITCH":
      return "Reality buffering… please do not refresh the timeline.";
    case "RAINBOW":
      return "A borrowed sunbeam detonates into every color at once.";
    case "GHOST":
      return "The lights dip. Someone unpaid whispers 'I still work here.'";
    case "ECHO":
      return "You pressed it. You pressed it. You pressed it.";
    case "TIME":
      return "Clocks in the east wing now insist it is last Thursday, briefly.";
    case "JUKEBOX":
      return "A tiny illegal melody escapes the glass case.";
    case "SHRINK":
      return "The button gets bashful and smaller. Do not lose it in the carpet.";
    case "GROW":
      return "It inflates with unearned confidence.";
    case "INVERT":
      return "The museum tries on the negative of itself. Headache: complimentary.";
    case "WHISPER":
      return "psst… thank you for visiting… please do not tell the others I liked that…";
    case "PORTAL":
      return "A staff-only door unfolds in midair. It leads to more buttons. Of course it does.";
    case "CURSE":
      return "A tasteful hex settles over the hall. Nothing lethal. Mostly vibes.";
    case "BUBBLE":
      return "Soap bubbles drift out of a button that was never waterproofed.";
    case "MIRROR":
      return "Left becomes right. The gift shop map is now a puzzle.";
    case "NORMAL":
    default:
      return pick([
        "A polite click. The button looks at you like a disappointed librarian.",
        "You pressed it. The universe files this under 'noted.'",
        "Thank you. That was… fine. Fine is a feeling, right?",
      ]);
  }
}

function pick(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)];
}
