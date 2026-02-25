# Isaac's Games — Claude Instructions

This repo hosts web-based games at **isaaceb.org**, built with Next.js and deployed on Vercel.

## Quick start: adding a new game

1. **Create the game folder:** `games/<slug>/` (e.g. `games/space-shooter/`)
2. **Write the game page:** `app/games/<slug>/page.tsx` (always `"use client"` + dynamic import, see templates below)
3. **Register it:** add an entry to `app/games-list.ts`
4. **Run `pnpm dev`** — it hot-reloads instantly in the browser

That's it. No config changes needed.

---

## Repo layout

```
app/
  page.tsx            ← Home page (auto-lists all games from games-list.ts)
  games-list.ts       ← THE REGISTRY — add new games here
  games/
    <slug>/
      page.tsx        ← Next.js route for each game (thin shell, loads game component)
  layout.tsx
  globals.css

games/
  <slug>/
    Game.tsx          ← The actual game component ("use client")
    *.ts / *.tsx      ← Game logic, scenes, etc.

docs/
  architecture.md     ← Full architecture reference
  phaser-template.md  ← Copy-paste template for 2D Phaser games
  babylon-template.md ← Copy-paste template for 3D Babylon games

public/               ← Small static assets (icons, small images)
CLAUDE.md             ← This file
```

---

## Rules to always follow

- **Every game page must be `"use client"`** and load the game with `dynamic(() => import(...), { ssr: false })`. Phaser and Babylon use `window`/`document` and will crash if SSR'd.
- **2D games → Phaser 3** (`pnpm add phaser`)
- **3D games → Babylon.js** (`pnpm add @babylonjs/core @babylonjs/loaders`)
- **Large 3D assets (GLB, HDR, etc.) → Cloudflare R2**, not the `public/` folder. Store the R2 base URL in an environment variable `NEXT_PUBLIC_R2_URL`.
- Keep each game self-contained in its own folder. Don't share game logic across games.
- The home page updates automatically — just add to `games-list.ts`.

---

## Dev workflow (for Isaac)

```bash
pnpm install     # first time only
pnpm dev         # starts the dev server at http://localhost:3000
```

Open the browser. Every time Claude saves a file, the page refreshes automatically. Just describe what you want changed and Claude will edit the files — you'll see the result in seconds.

---

## Deploying to isaaceb.org

The site auto-deploys on Vercel whenever code is pushed to `main`. No manual steps needed.

If you need to set environment variables (e.g. `NEXT_PUBLIC_R2_URL`), add them in the Vercel dashboard under Project → Settings → Environment Variables.

## R2 asset sync

Put large 3D assets (GLB, HDR, textures) in the `r2-assets/` folder, then run:

```bash
pnpm sync-assets
```

This uploads everything in `r2-assets/` to the Cloudflare R2 bucket. The bucket must be set up once — see `docs/architecture.md` for the env vars needed.
