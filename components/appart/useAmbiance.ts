import { useSyncExternalStore } from "react";
import { estTemps, type Meteo } from "@/lib/meteo";

/* ───────────────────────────────────────────────────────────────────────
   L'ambiance réelle de Villejuif : l'heure de Paris (la nuit tombe à 20 h)
   et la météo (pluie, neige, orage à la fenêtre).
   Rendu neutre côté serveur (soir, ciel dégagé), puis mis à jour dans le
   navigateur. Pour essayer : ?heure=22 ou ?meteo=pluie|neige|orage|nuageux.
   ─────────────────────────────────────────────────────────────────────── */

function parametre(nom: string) {
  return new URLSearchParams(window.location.search).get(nom);
}

/* ─── L'heure à Paris (rafraîchie chaque minute) ─── */

function heureParis() {
  const forcee = Number(parametre("heure"));
  if (parametre("heure") !== null && forcee >= 0 && forcee < 24) return forcee;
  const h = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" }).format(new Date());
  return Number(h);
}

function abonnerMinute(prevenir: () => void) {
  const id = window.setInterval(prevenir, 60_000);
  return () => window.clearInterval(id);
}

/** Heure de Paris (0-23) ; 18 h côté serveur */
export function useHeureParis() {
  return useSyncExternalStore(abonnerMinute, heureParis, () => 18);
}

/** La nuit tombe à 20 h et se lève à 7 h */
export function estLaNuit(heure: number) {
  return heure >= 20 || heure < 7;
}

/* ─── La météo de Villejuif (rafraîchie toutes les 15 minutes) ─── */

let meteo: Meteo | null = null;
const abonnes = new Set<() => void>();
let minuterie = 0;

async function chargerMeteo() {
  const forcee = parametre("meteo");
  if (estTemps(forcee)) {
    meteo = { temps: forcee, temperature: meteo?.temperature ?? null };
  } else {
    try {
      const res = await fetch("/api/meteo");
      if (res.ok) meteo = (await res.json()) as Meteo;
    } catch {
      // hors ligne : on garde le ciel tel quel
    }
  }
  abonnes.forEach((f) => f());
}

function abonnerMeteo(prevenir: () => void) {
  abonnes.add(prevenir);
  if (abonnes.size === 1) {
    void chargerMeteo();
    minuterie = window.setInterval(() => void chargerMeteo(), 15 * 60_000);
  }
  return () => {
    abonnes.delete(prevenir);
    if (abonnes.size === 0) window.clearInterval(minuterie);
  };
}

/** Météo actuelle à Villejuif, ou null tant qu'elle n'est pas arrivée */
export function useMeteo() {
  return useSyncExternalStore(
    abonnerMeteo,
    () => meteo,
    () => null,
  );
}
