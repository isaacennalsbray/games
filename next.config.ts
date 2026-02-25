import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phaser and Babylon.js use browser globals — don't SSR game pages.
  // Each game page uses "use client" + dynamic import with ssr:false.
  // Turbopack (default in Next 16) handles this automatically at the
  // component level — no extra config needed here.
  turbopack: {},
};

export default nextConfig;
