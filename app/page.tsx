import Link from "next/link";
import { games } from "./games-list";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 100%)" }}>

      {/* Header */}
      <div className="text-center mb-16">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
          style={{ fontFamily: "'Press Start 2P', monospace", color: "#a78bfa", lineHeight: 1.4 }}
        >
          Isaac&apos;s Games
        </h1>
        <p className="text-indigo-300 text-lg">Pick a game and start playing!</p>
      </div>

      {/* Game grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className={`
                group relative rounded-2xl p-6 flex flex-col gap-3
                bg-gradient-to-br ${game.color}
                border border-white/10 hover:border-white/30
                transition-all duration-200 hover:scale-105 hover:shadow-2xl
                cursor-pointer
              `}
            >
              <span className="text-5xl">{game.emoji}</span>
              <h2 className="text-white text-xl font-bold">{game.title}</h2>
              <p className="text-white/70 text-sm flex-1">{game.description}</p>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                {game.engine === "phaser" ? "2D · Phaser" : "3D · Babylon"}
              </span>
              <span
                className="absolute top-4 right-4 text-white/0 group-hover:text-white/60 text-2xl transition-all duration-200"
                aria-hidden
              >
                ▶
              </span>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center gap-6 mt-8 text-center">
          <div className="text-8xl animate-bounce">🎮</div>
          <p className="text-indigo-300 text-xl font-semibold">Games coming soon!</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 text-indigo-600 text-xs text-center">
        isaaceb.org
      </footer>
    </main>
  );
}
