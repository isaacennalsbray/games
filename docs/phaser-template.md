# Phaser Game Template

Copy these files to `games/<slug>/` to start a new 2D game.

## Install

```bash
pnpm add phaser
```

## `games/<slug>/Game.tsx`

```tsx
"use client";
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";

export default function Game() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      backgroundColor: "#1a1a2e",
      scene: [MainScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-950">
      <div ref={containerRef} />
    </div>
  );
}
```

## `games/<slug>/scenes/MainScene.ts`

```ts
import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    // Load assets here, e.g.:
    // this.load.image("player", "/assets/player.png");
  }

  create() {
    this.add.text(400, 300, "Hello, World!", {
      fontSize: "32px",
      color: "#ffffff",
    }).setOrigin(0.5);
  }

  update() {
    // Game loop — runs every frame
  }
}
```

## `app/games/<slug>/page.tsx`

```tsx
"use client";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/games/<slug>/Game"), { ssr: false });

export default function Page() {
  return <Game />;
}
```

## `app/games-list.ts` entry

```ts
{
  slug: "<slug>",
  title: "My Game",
  description: "One sentence about this game.",
  engine: "phaser",
  emoji: "🎮",
  color: "from-blue-900 to-cyan-900",
},
```
