import { useSyncExternalStore } from "react";
import { jouerSecret } from "./son";

/* ───────────────────────────────────────────────────────────────────────
   Les secrets de l'appartement : huit petites surprises à dénicher.
   La progression est gardée dans le navigateur du visiteur (localStorage),
   le compteur et les indices sont sous l'interrupteur.
   ─────────────────────────────────────────────────────────────────────── */

export const SECRETS = [
  { id: "lune", nom: "L'étoile filante", indice: "La nuit, levez les yeux vers la lune." },
  { id: "tour-eiffel", nom: "Paris scintille", indice: "La nuit, la tour Eiffel aime qu'on la remarque." },
  { id: "chat", nom: "Le chat a l'œil", indice: "Approchez-vous doucement du chat qui dort." },
  { id: "horloge", nom: "Le carillon", indice: "Quelle heure est-il, au juste ?" },
  { id: "disco", nom: "Mode disco", indice: "Un vieux code de jeu vidéo… ou un interrupteur qu'on maltraite." },
  { id: "smash", nom: "Le roi du smash", indice: "Au gymnase, faites smasher le joueur cinq fois." },
  { id: "gamme", nom: "Do, ré, mi, fa, sol", indice: "Au studio, le clavier connaît une gamme." },
  { id: "neon", nom: "Le néon détraqué", indice: "Au studio, l'enseigne n'aime pas qu'on joue avec." },
] as const;

export type IdSecret = (typeof SECRETS)[number]["id"];

export interface EtatSecrets {
  trouves: IdSecret[];
  /** le dernier secret trouvé (n change à chaque fois : relance l'annonce) */
  dernier: { id: IdSecret; n: number } | null;
}

const CLE = "appart:secrets";
const VIDE: EtatSecrets = { trouves: [], dernier: null };
let etat: EtatSecrets | null = null;
const abonnes = new Set<() => void>();

function lire(): EtatSecrets {
  if (!etat) {
    let trouves: IdSecret[] = [];
    try {
      const brut = JSON.parse(localStorage.getItem(CLE) ?? "[]") as unknown;
      if (Array.isArray(brut)) trouves = SECRETS.map((s) => s.id).filter((id) => brut.includes(id));
    } catch {
      // stockage indisponible (navigation privée…) : on repart de zéro
    }
    etat = { trouves, dernier: null };
  }
  return etat;
}

function enregistrer(trouves: IdSecret[]) {
  try {
    localStorage.setItem(CLE, JSON.stringify(trouves));
  } catch {
    // tant pis : la progression ne survivra pas au rechargement
  }
}

/** Un secret vient d'être déniché (sans effet s'il l'était déjà) */
export function trouverSecret(id: IdSecret) {
  const actuel = lire();
  if (actuel.trouves.includes(id)) return;
  const trouves = SECRETS.map((s) => s.id).filter((s) => s === id || actuel.trouves.includes(s));
  etat = { trouves, dernier: { id, n: (actuel.dernier?.n ?? 0) + 1 } };
  enregistrer(trouves);
  jouerSecret();
  abonnes.forEach((f) => f());
}

export function oublierSecrets() {
  etat = { trouves: [], dernier: null };
  enregistrer([]);
  abonnes.forEach((f) => f());
}

function abonner(prevenir: () => void) {
  abonnes.add(prevenir);
  return () => {
    abonnes.delete(prevenir);
  };
}

export function useSecrets() {
  return useSyncExternalStore(abonner, lire, () => VIDE);
}
