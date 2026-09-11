export type InteractionScene =
  | "speed"
  | "warning"
  | "brain"
  | "repair"
  | "download"
  | "spotlight"
  | "door"
  | "nothing"
  | "refund"
  | "luck"
  | "calculator"
  | "developer"
  | "ceo"
  | "grass"
  | "emergency"
  | "countdown"
  | "money"
  | "ai"
  | "world"
  | "close";

type Interaction = { scene: InteractionScene; messages: string[] };

const INTERACTIONS: Record<string, Interaction> = {
  "make-faster": { scene: "speed", messages: ["Optimizing website… 1%… 17%… 42%… 89%… 99%… 100%. Website speed increased by 0.000001%.", "Optimization complete. We removed one invisible crumb.", "Speed report: still a website."] },
  "important-button": { scene: "warning", messages: ["⚠ CRITICAL SYSTEM OPERATION ⚠ Are you absolutely sure?", "Nothing happened. Thank you for wasting your time.", "The critical operation remains critically decorative."] },
  "random-seven": { scene: "calculator", messages: ["Generating random number… 7.", "Generating random number… 7.", "You seem to have discovered my favorite number: 7.", "Fine. It is always 7."] },
  "intelligence": { scene: "brain", messages: ["Increasing website intelligence… Website IQ: 3.0", "Website IQ: 3.1. It has learned the word ‘button.’", "Website IQ: 3.10001. Unfortunately, intelligence has reached its maximum."] },
  "fix-everything": { scene: "repair", messages: ["Scanning problems… Finding problems… Fixing problems… Creating new problems… Everything is slightly worse.", "Repair complete. One problem was promoted to manager.", "Everything is fixed except the everything."] },
  "download-ram": { scene: "download", messages: ["Downloading RAM… 0%… 23%… 67%… 99%… 100%. RAM downloaded successfully.", "RAM has been misplaced.", "We found the RAM. It was inside the progress bar."] },
  "delete-button": { scene: "warning", messages: ["Deleting button…", "That was rude.", "The button has filed a grievance with the museum."] },
  "famous": { scene: "spotlight", messages: ["Contacting the internet… Contacting everyone… Nobody answered. You are still not famous.", "A red carpet appeared, then remembered it had somewhere else to be.", "Your fan club remains theoretical."] },
  "open-door": { scene: "door", messages: ["A museum door opens with unnecessary drama. Behind it: another button.", "The door opens again. It has learned nothing from the first time."] },
  "do-something": { scene: "nothing", messages: ["No.", "Still no.", "I have decided not to.", "You are wasting both of our time."] },
  "interesting": { scene: "nothing", messages: ["Making website interesting… Done.", "Interest level unchanged. This is intentional.", "Something interesting almost happened. It took a personal day."] },
  "refund-time": { scene: "refund", messages: ["Processing refund… Checking your wasted time… Refund denied. You knew what this website was.", "Your claim was reviewed by a pigeon. Denied.", "Time is non-refundable after unboxing."] },
  "luck-button": { scene: "luck", messages: ["Calculating luck… Bad luck.", "Even worse luck.", "A fortune cookie just sighed."] },
  "calculate-nothing": { scene: "calculator", messages: ["Calculating… Processing nothing… Consulting experts… Result: 0.", "The experts have confirmed the nothing is authentic.", "0 remains undefeated."] },
  "summon-developer": { scene: "developer", messages: ["The developer has been summoned… The developer has chosen not to appear.", "Developer status: hiding behind a fern.", "A distant keyboard sound was legally not an appearance."] },
  "contact-ceo": { scene: "ceo", messages: ["Calling CEO… CEO is currently pressing buttons. CEO has no idea what this website does.", "The CEO sent a thumbs-up from an unknown location.", "CEO meeting agenda: more buttons."] },
  "touch-grass": { scene: "grass", messages: ["Congratulations. You touched 1 pixel of grass.", "The grass has returned to its union break.", "Outdoor achievement narrowly avoided."] },
  "emergency-button": { scene: "emergency", messages: ["CRITICAL EMERGENCY. Please panic aesthetically.", "Everything is fine. That was merely an attention emergency.", "Emergency downgraded to ‘mildly dramatic.’"] },
  "self-destruct": { scene: "countdown", messages: ["5… 4… 3… 2… 1… Nothing happened. That was embarrassing.", "Self-destruct failed upward.", "The museum remains smugly intact."] },
  "make-rich": { scene: "money", messages: ["Balance: $0.01… $0.00. Congratulations. You almost became rich.", "Your wealth has been audited and returned to zero.", "A tiny yacht was repossessed."] },
  "ai-button": { scene: "ai", messages: ["Consulting artificial intelligence… Thinking… Thinking harder… Answer: perhaps rotate the button.", "AI advice: have you considered a second button?", "The AI is regretting everything."] },
  "world-problems": { scene: "world", messages: ["Solving world problems… 0%… 32%… 78%… 99%… 100%… Actually, never mind. 0%.", "Experts agree the problem is above this museum’s pay grade.", "World saved briefly, then unsaved for symmetry."] },
  "close-website": { scene: "close", messages: ["Are you sure? YES / NO / No.", "No.", "The website declines to close. It lives here now."] },
};

export function getInteraction(id: string, clicks: number, fallback: string) {
  const interaction = INTERACTIONS[id];
  if (!interaction) return { scene: null, message: fallback };
  return { scene: interaction.scene, message: interaction.messages[Math.min(clicks - 1, interaction.messages.length - 1)] };
}
