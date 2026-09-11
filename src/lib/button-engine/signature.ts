const SPECTACLES = [
  "Tornado of Receipts", "Meteor Shower", "Lightning Audit", "Paperwork Blizzard", "Button Rain", "Tiny UFO Parade", "Galaxy Spill", "Matrix Drizzle", "VHS Possession", "RGB Argument", "Pixel Confetti", "Fog Machine", "Bubble Flood", "Leaf Tornado", "Sandstorm", "Firework Apology", "Nuclear Disclaimer", "Fake Update", "Giant Cursor", "Emoji Migration", "Gravity Reversal", "Museum Blackout", "Floating Furniture", "Upside-Down Minute", "Potato Scanner", "Treasure Chest", "Stage Curtain", "Fake Virus Scan", "Earthquake Bulletin", "Dramatic Zoom", "Starfield Leak", "Fish Crossing", "Cat Crossing", "Button Duplication", "Cursor Inspection", "Laser Grid", "Time Ripple", "Neon Weather", "Moon Gravity", "Disco Emergency", "Soup Vortex", "Cloud Backup", "Museum Melt", "Receipt Volcano", "Sock Portal", "Ceiling Door", "Confetti Tax", "Marble Avalanche", "Laser Pigeons", "Bubble Orchestra", "Cinematic Wind", "Quantum Puddle", "Museum Eclipse", "Banana Radar", "Spooky Spreadsheet", "Tiny Parade", "Historic Lag", "Emergency Glitter", "Polite Singularity", "Extremely Local Aurora", "Cosmic Stapler", "Carpet Earthquake", "Sensible Lightning", "Unlicensed Rainbow", "Duck Forecast", "Invisible Trombone", "Administrative Volcano", "Ceremonial Loading Wheel", "Mysterious Smudge", "Museum Wi-Fi Ghost",
];

function hash(text: string) {
  return [...text].reduce((value, char) => ((value * 31 + char.charCodeAt(0)) >>> 0), 7);
}

export function animationSignature(id: string) {
  const value = hash(id);
  return {
    name: SPECTACLES[value % SPECTACLES.length],
    variant: value % 12,
    hue: value % 360,
    seed: value,
  };
}
