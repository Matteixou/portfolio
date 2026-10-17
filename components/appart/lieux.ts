/* ───────────────────────────────────────────────────────────────────────
   Les coins de l'appartement qu'on peut visiter.
   Coordonnées dans le repère de leur pièce (viewBox 1600 × 1000) :
   - repere : où s'accroche l'étiquette manuscrite au survol
   - indice : la petite lueur qui signale l'objet à la première visite
   - cadrage : la zone que la « caméra » vient cadrer à l'ouverture
   ─────────────────────────────────────────────────────────────────────── */

/* Dans l'ordre du plan : de la pièce de gauche à celle de droite */
export const LIEUX = ["volley", "realisations", "krylos", "atelier", "a-propos", "contact", "stream", "musique"] as const;

/** De gauche à droite. On arrive dans le salon. */
export const PIECES = ["gymnase", "salon", "studio"] as const;
export type PieceId = (typeof PIECES)[number];
export type LieuId = (typeof LIEUX)[number];

export interface Lieu {
  /** La pièce où se trouve l'objet */
  piece: PieceId;
  /** Nom de l'objet dans la pièce */
  objet: string;
  /** Ce qu'on y trouve (plan, titres) */
  titre: string;
  /** Mot manuscrit au survol */
  etiquette: string;
  repere: { x: number; y: number };
  indice: { x: number; y: number };
  cadrage: { x: number; y: number; w: number; h: number };
}

export const lieux: Record<LieuId, Lieu> = {
  volley: {
    piece: "gymnase",
    objet: "Le filet du gymnase",
    titre: "Le volley",
    etiquette: "mon autre terrain",
    repere: { x: 800, y: 470 },
    indice: { x: 1250, y: 470 },
    cadrage: { x: 560, y: 600, w: 640, h: 440 },
  },
  realisations: {
    piece: "salon",
    objet: "La télé",
    titre: "Réalisations",
    etiquette: "mes réalisations",
    repere: { x: 1392, y: 392 },
    indice: { x: 1532, y: 400 },
    cadrage: { x: 1392, y: 478, w: 360, h: 230 },
  },
  krylos: {
    piece: "salon",
    objet: "L'affiche",
    titre: "Krylos",
    etiquette: "Krylos, mon agence",
    repere: { x: 1284, y: 88 },
    indice: { x: 1366, y: 98 },
    cadrage: { x: 1284, y: 218, w: 230, h: 290 },
  },
  atelier: {
    piece: "salon",
    objet: "Le mur de cadres",
    titre: "L'atelier",
    etiquette: "mes outils",
    repere: { x: 1066, y: 290 },
    indice: { x: 1168, y: 122 },
    cadrage: { x: 1072, y: 256, w: 270, h: 320 },
  },
  "a-propos": {
    piece: "salon",
    objet: "Le portrait",
    titre: "À propos",
    etiquette: "c'est moi !",
    repere: { x: 1020, y: 108 },
    indice: { x: 1074, y: 116 },
    cadrage: { x: 1020, y: 190, w: 190, h: 240 },
  },
  contact: {
    piece: "salon",
    objet: "La lettre",
    titre: "Contact",
    etiquette: "écrivez-moi",
    repere: { x: 1100, y: 700 },
    indice: { x: 1136, y: 712 },
    cadrage: { x: 1110, y: 752, w: 330, h: 170 },
  },
  stream: {
    piece: "studio",
    objet: "Les écrans du studio",
    titre: "Le stream",
    etiquette: "en live le week-end !",
    repere: { x: 800, y: 362 },
    indice: { x: 1004, y: 384 },
    cadrage: { x: 880, y: 470, w: 620, h: 300 },
  },
  musique: {
    piece: "studio",
    objet: "La guitare et le clavier",
    titre: "La musique",
    etiquette: "8 ans de conservatoire",
    repere: { x: 230, y: 506 },
    indice: { x: 392, y: 530 },
    cadrage: { x: 240, y: 660, w: 440, h: 320 },
  },
};

export function estLieu(valeur: string): valeur is LieuId {
  return (LIEUX as readonly string[]).includes(valeur);
}
