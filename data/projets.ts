/* ───────────────────────────────────────────────────────────────────────
   Réalisations — elles passent à la télé du salon, une chaîne par projet.
   Captures dans public/projects/ (1600 × ~765, WebP).
   ─────────────────────────────────────────────────────────────────────── */

export interface Projet {
  slug: string;
  title: string;
  /** Type de client, affiché en sur-titre */
  client: string;
  description: string;
  /** Ce que le site apporte au client */
  highlights: string[];
  image: string;
  /** Adresse affichée sur l'écran */
  displayUrl: string;
  url: string;
  tags: string[];
  /** À confirmer : les dépôts datent de 2026 (voir TASKS.md) */
  year: string;
}

export const projets: Projet[] = [
  {
    slug: "alexis-saucede",
    title: "Alexis Saucede",
    client: "Coach sportif · Saint-Mandé",
    description:
      "Un coach sportif qui avait besoin d'une vitrine pro et crédible pour transformer ses visiteurs en clients de coaching.",
    highlights: [
      "Présentation claire des offres de coaching",
      "Avis Google intégrés pour rassurer les prospects",
      "Formulaire de contact direct pour générer des demandes",
    ],
    image: "/projects/alexissaucede.webp",
    displayUrl: "alexissaucede.com",
    url: "https://www.alexissaucede.com",
    tags: ["Site vitrine", "Optimisé conversion", "Responsive"],
    year: "2025",
  },
  {
    slug: "django-barber",
    title: "Django Barber",
    client: "Barbier · Villejuif",
    description:
      "Un salon de barbier qui voulait être visible en ligne et faciliter la prise de contact de ses clients.",
    highlights: [
      "Identité visuelle forte alignée sur la marque",
      "Galerie de réalisations pour montrer le savoir-faire",
      "Accès rapide à la prise de rendez-vous",
    ],
    image: "/projects/django-barber.webp",
    displayUrl: "django-barber.vercel.app",
    url: "https://django-barber.vercel.app",
    tags: ["Site vitrine", "Identité de marque", "Responsive"],
    year: "2025",
  },
];
