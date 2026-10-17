import type { NextConfig } from "next";

/* Racine explicite du projet : un bun.lock parent (Documents/Projet) faisait
   choisir le mauvais dossier à Turbopack et au file tracing. */
const projectRoot = typeof __dirname === "string" ? __dirname : process.cwd();

/* En-têtes de sécurité (bonnes pratiques Lighthouse / OWASP).
   Vercel ajoute déjà HSTS ; le doublon est sans effet. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
