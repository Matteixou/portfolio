/* ───────────────────────────────────────────────────────────────────────
   L'atelier — les technologies, accrochées au mur comme des cadres.
   Liste reprise de la version précédente du site.
   ─────────────────────────────────────────────────────────────────────── */

export interface Techno {
  name: string;
  note: string;
  /** Petit motif dessiné dans le cadre */
  glyph: "chevrons" | "orbite" | "accolades" | "triangle" | "vagues" | "hexagone" | "elephant" | "serpent" | "branches" | "baleine" | "prisme";
}

export const technos: Techno[] = [
  { name: "Next.js", note: "Le framework de ce site", glyph: "triangle" },
  { name: "React", note: "Interfaces", glyph: "orbite" },
  { name: "TypeScript", note: "JavaScript typé", glyph: "accolades" },
  { name: "Tailwind CSS", note: "Styles", glyph: "vagues" },
  { name: "Node.js", note: "Serveur", glyph: "hexagone" },
  { name: "PostgreSQL", note: "Base de données", glyph: "elephant" },
  { name: "Prisma", note: "ORM", glyph: "prisme" },
  { name: "Python", note: "Scripts et données", glyph: "serpent" },
  { name: "Git", note: "Versionnage", glyph: "branches" },
  { name: "Docker", note: "Conteneurs", glyph: "baleine" },
];
