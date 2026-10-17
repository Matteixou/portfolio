/* ───────────────────────────────────────────────────────────────────────
   Qui habite ici — coordonnées et liens publics de Matthieu.
   ─────────────────────────────────────────────────────────────────────── */

export const moi = {
  name: "Matthieu Feracho",
  firstName: "Matthieu",
  title: "Co-fondateur de Krylos",
  location: "Île-de-France",
  school: "Efrei Paris Panthéon-Assas",
  email: "matthieu94f@gmail.com",
};

export interface Lien {
  name: "GitHub" | "LinkedIn" | "Instagram" | "Email";
  url: string;
  handle: string;
}

export const liens: Lien[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/matthieuferacho/", handle: "Matthieu Feracho" },
  { name: "GitHub", url: "https://github.com/Matteixou", handle: "@Matteixou" },
  { name: "Instagram", url: "https://www.instagram.com/matthieu.frch/", handle: "@matthieu.frch" },
  { name: "Email", url: `mailto:${moi.email}`, handle: moi.email },
];
