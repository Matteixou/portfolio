import { useSyncExternalStore } from "react";
import type { PostItPublic } from "@/lib/livre-dor";

/* Les post-its publiés du livre d'or, chargés une fois pour toute la page
   (le frigo du studio et le panneau les partagent). */

export interface EtatLivreDor {
  postits: PostItPublic[];
  /** false si le livre d'or n'est pas encore configuré en production */
  ouvert: boolean;
}

const VIDE: EtatLivreDor = { postits: [], ouvert: true };
let etat = VIDE;
let charge = false;
const abonnes = new Set<() => void>();

export async function chargerLivreDor() {
  try {
    const res = await fetch("/api/livre-dor");
    const json = (await res.json()) as Partial<EtatLivreDor>;
    etat = { postits: json.postits ?? [], ouvert: json.ouvert !== false };
  } catch {
    // hors ligne : le frigo reste tel quel
  }
  charge = true;
  abonnes.forEach((f) => f());
}

function abonner(prevenir: () => void) {
  abonnes.add(prevenir);
  if (!charge) void chargerLivreDor();
  return () => {
    abonnes.delete(prevenir);
  };
}

export function useLivreDor() {
  return useSyncExternalStore(
    abonner,
    () => etat,
    () => VIDE,
  );
}
