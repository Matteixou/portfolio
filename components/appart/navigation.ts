/* ───────────────────────────────────────────────────────────────────────
   La pièce ouverte vit dans l'adresse (#realisations, #contact…) :
   on peut partager le lien, et le bouton « retour » referme le panneau.
   Petit store branché sur useSyncExternalStore.
   ─────────────────────────────────────────────────────────────────────── */

import { estLieu, type LieuId } from "./lieux";

const abonnes = new Set<() => void>();

function prevenir() {
  abonnes.forEach((f) => f());
}

export function sAbonner(f: () => void) {
  abonnes.add(f);
  window.addEventListener("popstate", f);
  window.addEventListener("hashchange", f);
  return () => {
    abonnes.delete(f);
    window.removeEventListener("popstate", f);
    window.removeEventListener("hashchange", f);
  };
}

export function lireLieu(): LieuId | null {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return estLieu(h) ? h : null;
}

export function lireLieuServeur(): LieuId | null {
  return null;
}

export function ouvrir(id: LieuId) {
  if (lireLieu() === id) return;
  // Déjà dans une pièce : on change de pièce sans empiler l'historique
  if (lireLieu() && window.history.state?.appart) {
    window.history.replaceState({ appart: true }, "", `#${id}`);
  } else {
    window.history.pushState({ appart: true }, "", `#${id}`);
  }
  prevenir();
}

export function fermer() {
  if (!lireLieu()) return;
  if (window.history.state?.appart) {
    window.history.back();
  } else {
    // Arrivé directement sur un lien partagé : on nettoie l'adresse
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    prevenir();
  }
}
