# Babylon.js Game Template

Copy these files to `games/<slug>/` to start a new 3D game.

## Install

```bash
pnpm add @babylonjs/core @babylonjs/loaders
```

## `games/<slug>/Game.tsx`

```tsx
"use client";
import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import { setupScene } from "./scenes/MainScene";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    setupScene(scene);

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen block"
      style={{ touchAction: "none" }}
    />
  );
}
```

## `games/<slug>/scenes/MainScene.ts`

```ts
import {
  Scene,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
} from "@babylonjs/core";

export function setupScene(scene: Scene) {
  // Camera
  const camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 3, 10, Vector3.Zero(), scene);
  camera.attachControl(scene.getEngine().getRenderingCanvas()!, true);

  // Light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // A simple box to start with
  MeshBuilder.CreateBox("box", { size: 1 }, scene);

  // To load a GLB from R2:
  // import "@babylonjs/loaders/glTF";
  // SceneLoader.ImportMeshAsync("", process.env.NEXT_PUBLIC_R2_URL + "/", "model.glb", scene);
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
  title: "My 3D Game",
  description: "One sentence about this game.",
  engine: "babylon",
  emoji: "🌍",
  color: "from-emerald-900 to-teal-900",
},
```

## Large assets (GLB, HDR, textures)

Don't put large files in `public/`. Upload them to Cloudflare R2 and use:

```ts
const url = `${process.env.NEXT_PUBLIC_R2_URL}/my-asset.glb`;
```

Run `pnpm sync-assets` to upload/sync the `r2-assets/` folder to R2 (see `scripts/sync-r2.ts`).
