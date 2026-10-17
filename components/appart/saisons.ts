import { useSyncExternalStore } from "react";

/* ───────────────────────────────────────────────────────────────────────
   L'appartement suit le calendrier (date de Paris). Tout est prêt à
   l'avance : chaque décor s'active tout seul à sa période.

   Une saison de fond, toute l'année :
   - hiver (21 déc. → 19 mars) : givre aux vitres, bonnet pour le chat
   - printemps (20 mars → 20 juin) : pétales dehors, fleurs au balcon
   - été (21 juin → 21 sept.) : lunettes de soleil, lucioles la nuit
   - automne (22 sept. → 20 déc.) : feuilles mortes dehors

   Et par-dessus, les temps forts de l'année :
   - Nouvel An (31 déc. → 2 janv.) : Noël + feux d'artifice
   - galette des rois (3 → 15 janv.) : galette sur la table, couronne
   - Saint-Valentin (10 → 14 févr.) : ballons cœurs, roses, guirlande rose
   - Pâques (du dimanche des Rameaux au lundi de Pâques) : chasse aux œufs
   - 1er mai (30 avr. → 1er mai) : brin de muguet
   - Fête de la musique (21 juin) : notes dans la rue, casque pour le chat
   - 14 juillet (13 → 14 juil.) : fanions et feux bleu-blanc-rouge
   - rentrée (1er → 7 sept.) : cartable, cahiers, lunettes d'étude
   - Halloween (20 oct. → 2 nov.) : citrouilles, chauves-souris, sorcière
   - Noël (1er → 30 déc.) : sapin, cadeaux, neige sur les vitres

   Pour essayer : ?saison=paques (ou n'importe quel nom ci-dessous).
   ─────────────────────────────────────────────────────────────────────── */

export const SAISONS = ["hiver", "printemps", "ete", "automne"] as const;
export type Saison = (typeof SAISONS)[number];

export const EVENEMENTS = [
  "nouvel-an",
  "galette",
  "saint-valentin",
  "paques",
  "muguet",
  "fete-musique",
  "14-juillet",
  "rentree",
  "halloween",
  "noel",
] as const;
export type Evenement = (typeof EVENEMENTS)[number];

/** Ce que chaque période pose dans l'appartement */
export interface DecorSaison {
  /** ce que porte le chat */
  chapeau:
    | "sorciere"
    | "pere-noel"
    | "bonnet"
    | "lunettes"
    | "couronne"
    | "lunettes-coeur"
    | "oreilles-lapin"
    | "casque"
    | "beret"
    | "lunettes-rondes"
    | null;
  /** couleurs des ampoules de la guirlande (tringle du salon, étagère du studio) */
  guirlande: string[] | null;
  /** couleurs des fanions (tringle du salon, étagère du studio) */
  fanions: string[] | null;
  /** citrouilles au pied de la fenêtre et sur le frigo, toile d'araignée */
  citrouilles: boolean;
  /** le sapin remplace le ficus (image du décor dédiée) */
  sapin: boolean;
  /** neige en bombe sur les vitres, ou simple givre */
  vitres: "neige" | "givre" | null;
  /** ce qui passe dehors, derrière la vitre */
  dehors: "feuilles" | "petales" | "notes" | null;
  /** posé sur le balcon */
  balcon: "citrouille" | "fleurs" | "drapeau" | null;
  /** la nuit, dans le ciel */
  ciel: "chauves-souris" | "feux" | "feux-tricolores" | "lucioles" | null;
  /** posé sur la table basse */
  table: "galette" | "roses" | "lapin" | "muguet" | "cahiers" | null;
  /** posé par terre, à côté du guéridon */
  sol: "chasse-aux-oeufs" | "ballons" | "cartable" | null;
}

const RIEN: DecorSaison = {
  chapeau: null,
  guirlande: null,
  fanions: null,
  citrouilles: false,
  sapin: false,
  vitres: null,
  dehors: null,
  balcon: null,
  ciel: null,
  table: null,
  sol: null,
};

const ORANGE = ["#ff8a2b", "#ffb347", "#ff6f1a", "#ffc46b"];
const NOEL = ["#ff5a4a", "#ffd36b", "#7fd87a", "#fff1d6", "#6fb8ff"];
const ROSE = ["#ff6f9f", "#ff3d5a", "#ffb3c7", "#ff8fb1"];
const TRICOLORE = ["#2a4da8", "#f6efe4", "#d6302c"];

const FOND: Record<Saison, Partial<DecorSaison>> = {
  hiver: { chapeau: "bonnet", vitres: "givre" },
  printemps: { dehors: "petales", balcon: "fleurs" },
  ete: { chapeau: "lunettes", balcon: "fleurs", ciel: "lucioles" },
  automne: { dehors: "feuilles" },
};

/** Ce que chaque temps fort ajoute (ou retire, avec null) à la saison de fond */
const TEMPS_FORTS: Record<Evenement, Partial<DecorSaison>> = {
  noel: { chapeau: "pere-noel", guirlande: NOEL, sapin: true, vitres: "neige", dehors: null },
  "nouvel-an": { chapeau: "pere-noel", guirlande: NOEL, sapin: true, vitres: "neige", ciel: "feux" },
  galette: { chapeau: "couronne", table: "galette" },
  "saint-valentin": { chapeau: "lunettes-coeur", guirlande: ROSE, table: "roses", sol: "ballons" },
  paques: { chapeau: "oreilles-lapin", table: "lapin", sol: "chasse-aux-oeufs" },
  muguet: { table: "muguet" },
  "fete-musique": { chapeau: "casque", dehors: "notes" },
  "14-juillet": { chapeau: "beret", fanions: TRICOLORE, balcon: "drapeau", ciel: "feux-tricolores" },
  rentree: { chapeau: "lunettes-rondes", table: "cahiers", sol: "cartable" },
  halloween: { chapeau: "sorciere", guirlande: ORANGE, citrouilles: true, dehors: "feuilles", balcon: "citrouille", ciel: "chauves-souris" },
};

/** Pour ?saison=… : la saison de fond qui va avec chaque temps fort */
const FOND_DU_TEMPS_FORT: Record<Evenement, Saison> = {
  noel: "automne",
  "nouvel-an": "hiver",
  galette: "hiver",
  "saint-valentin": "hiver",
  paques: "printemps",
  muguet: "printemps",
  "fete-musique": "ete",
  "14-juillet": "ete",
  rentree: "ete",
  halloween: "automne",
};

/* ─── Le calendrier ─── */

/** Le jour à Paris : année, et nombre MMJJ (le 31 octobre → 1031) */
function jourAParis(date: Date) {
  const morceaux = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(date);
  const val = (t: string) => Number(morceaux.find((m) => m.type === t)?.value);
  return { annee: val("year"), jour: val("month") * 100 + val("day") };
}

/** Le dimanche de Pâques (calendrier grégorien, algorithme de Meeus) en MMJJ */
export function dimancheDePaques(annee: number) {
  const a = annee % 19;
  const b = Math.floor(annee / 100);
  const c = annee % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  const jour = ((h + l - 7 * m + 114) % 31) + 1;
  return mois * 100 + jour;
}

/** MMJJ décalé de n jours (dans la même année) */
function decaler(mmjj: number, annee: number, n: number) {
  const d = new Date(Date.UTC(annee, Math.floor(mmjj / 100) - 1, mmjj % 100 + n));
  return (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

export function saisonDu(date = new Date()): Saison {
  const { jour: j } = jourAParis(date);
  if (j >= 1221 || j <= 319) return "hiver";
  if (j <= 620) return "printemps";
  if (j <= 921) return "ete";
  return "automne";
}

export function evenementDu(date = new Date()): Evenement | null {
  const { annee, jour: j } = jourAParis(date);
  const paques = dimancheDePaques(annee);
  if (j >= 1231 || j <= 102) return "nouvel-an";
  if (j >= 103 && j <= 115) return "galette";
  if (j >= 210 && j <= 214) return "saint-valentin";
  if (j >= decaler(paques, annee, -7) && j <= decaler(paques, annee, 1)) return "paques";
  if (j >= 430 && j <= 501) return "muguet";
  if (j === 621) return "fete-musique";
  if (j >= 713 && j <= 714) return "14-juillet";
  if (j >= 901 && j <= 907) return "rentree";
  if (j >= 1020 && j <= 1102) return "halloween";
  if (j >= 1201 && j <= 1230) return "noel";
  return null;
}

/* ─── Le décor du moment ─── */

const memoire = new Map<string, DecorSaison>();

/** La saison de fond, plus le temps fort s'il y en a un (le temps fort l'emporte) */
export function decorDe(saison: Saison, evenement: Evenement | null): DecorSaison {
  const cle = `${saison}|${evenement ?? ""}`;
  let decor = memoire.get(cle);
  if (!decor) {
    decor = { ...RIEN, ...FOND[saison], ...(evenement ? TEMPS_FORTS[evenement] : {}) };
    memoire.set(cle, decor);
  }
  return decor;
}

/** « automne » ou « automne|halloween » : une chaîne, pour que React compare simplement */
function lire() {
  const forcee = new URLSearchParams(window.location.search).get("saison") ?? "";
  if ((SAISONS as readonly string[]).includes(forcee)) return forcee;
  if ((EVENEMENTS as readonly string[]).includes(forcee)) return `${FOND_DU_TEMPS_FORT[forcee as Evenement]}|${forcee}`;
  const evenement = evenementDu();
  return evenement ? `${saisonDu()}|${evenement}` : saisonDu();
}

function abonnerHeure(prevenir: () => void) {
  const id = window.setInterval(prevenir, 3_600_000);
  return () => window.clearInterval(id);
}

export interface Periode {
  saison: Saison;
  evenement: Evenement | null;
  decor: DecorSaison;
}

/** La période du jour ; null côté serveur (la page est générée à l'avance) */
export function usePeriode(): Periode | null {
  const cle = useSyncExternalStore(abonnerHeure, lire, () => null);
  if (!cle) return null;
  const [saison, evenement] = cle.split("|") as [Saison, Evenement | undefined];
  return { saison, evenement: evenement ?? null, decor: decorDe(saison, evenement ?? null) };
}
