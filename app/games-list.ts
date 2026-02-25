// Add a new game here and it will automatically appear on the home page.
// slug     - the URL path, e.g. "space-shooter" → isaaceb.org/games/space-shooter
// title    - display name
// description - one sentence shown on the card
// engine   - "phaser" for 2D, "babylon" for 3D
// emoji    - a fun emoji for the card
// color    - tailwind gradient classes for the card background

export type GameEntry = {
  slug: string;
  title: string;
  description: string;
  engine: "phaser" | "babylon";
  emoji: string;
  color: string;
};

export const games: GameEntry[] = [
  // Example (uncomment when the game exists):
  // {
  //   slug: "space-shooter",
  //   title: "Space Shooter",
  //   description: "Blast aliens in outer space!",
  //   engine: "phaser",
  //   emoji: "🚀",
  //   color: "from-indigo-900 to-purple-900",
  // },
];
