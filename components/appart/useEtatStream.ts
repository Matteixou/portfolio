import { useMemo, useSyncExternalStore } from "react";
import { creneauDuStream, type Creneau, type EtatStream } from "@/data/stream";
import type { StatutTwitch } from "@/lib/twitch";

/* ───────────────────────────────────────────────────────────────────────
   L'état du stream, d'après deux sources :
   - le créneau (data/stream.ts), recalculé chaque minute ;
   - le vrai statut Twitch (/api/twitch), relu chaque minute tant que
     l'onglet est visible. S'il n'est pas configuré, le créneau fait foi.
   Rendu neutre côté serveur. Pour essayer : ?live=Valorant (en direct sur
   ce jeu) ou ?live=0 (hors ligne).
   ─────────────────────────────────────────────────────────────────────── */

const SERVEUR: Creneau = { enCreneau: false, prochain: "ce week-end" };
let dernier: Creneau = SERVEUR;
let cle = "";

function lireCreneau() {
  const e = creneauDuStream();
  const k = `${e.enCreneau}|${e.prochain}`;
  if (k !== cle) {
    cle = k;
    dernier = e;
  }
  return dernier;
}

function abonnerMinute(prevenir: () => void) {
  const id = window.setInterval(prevenir, 60_000);
  return () => window.clearInterval(id);
}

/* ─── Le statut Twitch ─── */

let statut: StatutTwitch | null = null;
const abonnes = new Set<() => void>();
let minuterie = 0;

async function chargerTwitch() {
  const force = new URLSearchParams(window.location.search).get("live");
  if (force !== null) {
    statut = force === "0" ? { source: "twitch", enDirect: false } : { source: "twitch", enDirect: true, jeu: force || undefined, spectateurs: 12 };
  } else {
    if (document.hidden) return;
    try {
      const res = await fetch("/api/twitch");
      if (!res.ok) return;
      const nouveau = (await res.json()) as StatutTwitch;
      // rien de neuf (le cas le plus fréquent) : on ne redessine pas le studio
      if (JSON.stringify(nouveau) === JSON.stringify(statut)) return;
      statut = nouveau;
    } catch {
      // hors ligne : on garde le dernier statut connu
    }
  }
  abonnes.forEach((f) => f());
}

function abonnerTwitch(prevenir: () => void) {
  abonnes.add(prevenir);
  if (abonnes.size === 1) {
    void chargerTwitch();
    minuterie = window.setInterval(() => void chargerTwitch(), 60_000);
  }
  return () => {
    abonnes.delete(prevenir);
    if (abonnes.size === 0) window.clearInterval(minuterie);
  };
}

export function useEtatStream(): EtatStream {
  const creneau = useSyncExternalStore(abonnerMinute, lireCreneau, () => SERVEUR);
  const twitch = useSyncExternalStore(
    abonnerTwitch,
    () => statut,
    () => null,
  );
  return useMemo(() => {
    const reel = twitch?.source === "twitch";
    return {
      ...creneau,
      reel,
      enDirect: reel ? twitch.enDirect : creneau.enCreneau,
      jeu: reel ? twitch.jeu : undefined,
      titre: reel ? twitch.titre : undefined,
      spectateurs: reel ? twitch.spectateurs : undefined,
    };
  }, [creneau, twitch]);
}
