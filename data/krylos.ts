/* ───────────────────────────────────────────────────────────────────────
   Krylos — l'agence web co-fondée par Matthieu.

   Textes repris de https://krylos.fr (consulté le 15/10/2026), sans ajout.
   Si le site de l'agence change, c'est ici qu'on met à jour : l'affiche
   Krylos, le contact, le SEO et l'image OpenGraph lisent ce fichier.
   Ne pas nommer l'associé sur le portfolio.
   ─────────────────────────────────────────────────────────────────────── */

export interface Engagement {
  title: string;
  desc: string;
}

export const krylos = {
  name: "Krylos",
  kind: "Agence web & solutions digitales",
  url: "https://krylos.fr",
  displayUrl: "krylos.fr",
  email: "contact@krylos.fr",
  tagline: "Digitalisez votre activité, sans complexité.",
  pitch:
    "Krylos est une agence web installée à Villejuif, fondée par deux développeurs : mon associé et moi.",
  description:
    "Nous créons des sites, des applications et des automatisations sur mesure, qui traduisent les besoins métier de nos clients en outils simples, rapides et faits pour durer.",
  role: "Co-fondateur · Conception & communication",
  myRole:
    "Je conçois chaque projet aux côtés des clients et je les tiens informés à chaque étape, sans intermédiaire.",
  location: "Villejuif, Île-de-France",
  zone: "Déplacements en Île-de-France, projets partout en France à distance",
  responseTime: "Réponse sous 48 h ouvrées",
  services: [
    "Sites vitrines",
    "Applications métier",
    "E-commerce",
    "Automatisations",
    "Intelligence artificielle",
    "SEO local",
    "Performance",
    "Maintenance",
  ],
  engagements: [
    {
      title: "Un devis ferme",
      desc: "Détaillé ligne par ligne, avec des délais tenus et un accès permanent à l'avancement.",
    },
    {
      title: "100 % du code cédé",
      desc: "Le code source et les accès appartiennent au client.",
    },
    {
      title: "Bugs pris en charge",
      desc: "Des technologies éprouvées, choisies pour durer.",
    },
    {
      title: "Deux interlocuteurs directs",
      desc: "Les deux fondateurs suivent chaque projet, sans intermédiaire.",
    },
  ] satisfies Engagement[],
  links: {
    services: "https://krylos.fr/services",
    realisations: "https://krylos.fr/realisations",
    contact: "https://krylos.fr/contact",
  },
};
