# Architecture

## Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Works perfectly with Vercel; hot reload out of the box |
| Styling | Tailwind CSS | Fast to write, easy to tweak |
| 2D games | Phaser 3 | Best-in-class 2D browser game engine |
| 3D games | Babylon.js | Powerful 3D engine with great TypeScript support |
| Hosting | Vercel | Auto-deploys from GitHub; free tier is plenty |
| Large assets | Cloudflare R2 | S3-compatible object storage; free egress |
| Package manager | pnpm | Fast, disk-efficient |

---

## How the home page works

`app/games-list.ts` is the single source of truth. It exports a `games` array. The home page (`app/page.tsx`) reads this array and renders a card for each game. Adding a game to this file is all that's needed to make it appear on the site.

---

## How a game page works

Each game lives at `/games/<slug>`. The Next.js route (`app/games/<slug>/page.tsx`) is a thin shell that dynamically imports the actual game component with SSR disabled:

```tsx
// app/games/my-game/page.tsx
"use client";
import dynamic from "next/dynamic";

const MyGame = dynamic(() => import("@/games/my-game/Game"), { ssr: false });

export default function Page() {
  return <MyGame />;
}
```

The actual game component lives in `games/<slug>/Game.tsx`. It mounts the Phaser or Babylon canvas into a `<div>` ref on mount and cleans it up on unmount.

---

## Phaser game structure

```
games/my-game/
  Game.tsx        ← React component, mounts/destroys Phaser.Game
  scenes/
    MainScene.ts  ← Main game scene
    UIScene.ts    ← Optional HUD overlay scene
  assets/         ← Small assets only (sprites < ~500KB)
```

See `docs/phaser-template.md` for a copy-paste starting point.

---

## Babylon game structure

```
games/my-game/
  Game.tsx        ← React component, mounts/disposes Engine+Scene
  scenes/
    MainScene.ts  ← Scene setup (meshes, lights, camera)
  assets/         ← Tiny assets only; large assets go to R2
```

Large assets (GLB models, HDR environment maps) are stored in Cloudflare R2. Reference them via the `NEXT_PUBLIC_R2_URL` environment variable:

```ts
const modelUrl = `${process.env.NEXT_PUBLIC_R2_URL}/my-model.glb`;
```

See `docs/babylon-template.md` for a copy-paste starting point.

---

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_R2_URL` | Vercel + `.env.local` | Base URL for R2 asset bucket |

Add to `.env.local` for local dev (this file is gitignored):
```
NEXT_PUBLIC_R2_URL=https://your-bucket.r2.dev
```

---

## Adding a new game: checklist

- [ ] Create `games/<slug>/Game.tsx`
- [ ] Create `app/games/<slug>/page.tsx` (thin shell, `ssr: false`)
- [ ] Add entry to `app/games-list.ts`
- [ ] Install any needed packages: `pnpm add phaser` or `pnpm add @babylonjs/core @babylonjs/loaders`
- [ ] Test locally with `pnpm dev`
- [ ] Push to `main` → Vercel auto-deploys
