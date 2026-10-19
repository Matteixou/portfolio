/* ───────────────────────────────────────────────────────────────────────
   Le studio : les streams de Matthieu sur Twitch.
   - chaîne et contenus : repris de l'ancien portfolio (à confirmer)
   - horaires : donnés par Matthieu le 15/10/2026, « tous les week-ends,
     de 21 h à minuit » (compris ici comme samedi et dimanche, heure de Paris)
   - le live réel vient de l'API Twitch (lib/twitch.ts) quand elle est
     configurée ; sinon le site se fie à ces horaires
   ─────────────────────────────────────────────────────────────────────── */

export const stream = {
  plateforme: "Twitch",
  pseudo: "mathsuo",
  url: "https://www.twitch.tv/mathsuo",
  displayUrl: "twitch.tv/mathsuo",
  horaires: "Le week-end, de 21 h à minuit",
  /** 0 = dimanche … 6 = samedi */
  jours: [6, 0],
  debut: 21,
  fin: 24,
  fuseau: "Europe/Paris",
  contenus: ["Valorant", "Fortnite", "Apex Legends", "Dev en live", "Et un peu de tout"],
};

const NOMS_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** Jour (0-6), heure et minute actuels à Paris */
function maintenantAParis(date: Date) {
  const morceaux = new Intl.DateTimeFormat("en-GB", {
    timeZone: stream.fuseau,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const val = (t: string) => morceaux.find((m) => m.type === t)?.value ?? "";
  const jour = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(val("weekday"));
  return { jour, heure: Number(val("hour")), minute: Number(val("minute")) };
}

export interface Creneau {
  /** On est dans le créneau du stream */
  enCreneau: boolean;
  /** « samedi à 21 h », « ce soir à 21 h »… */
  prochain: string;
}

export interface EtatStream extends Creneau {
  /** En live en ce moment : statut réel de Twitch, ou à défaut le créneau */
  enDirect: boolean;
  /** true si le statut vient vraiment de Twitch (clés configurées) */
  reel: boolean;
  jeu?: string;
  titre?: string;
  spectateurs?: number;
}

/** Dit si c'est l'heure du live, sinon quand est le prochain créneau */
export function creneauDuStream(date = new Date()): Creneau {
  const { jour, heure } = maintenantAParis(date);
  if (stream.jours.includes(jour) && heure >= stream.debut && heure < stream.fin) {
    return { enCreneau: true, prochain: "en ce moment" };
  }
  for (let dans = 0; dans < 8; dans++) {
    const j = (jour + dans) % 7;
    if (!stream.jours.includes(j)) continue;
    if (dans === 0 && heure >= stream.debut) continue;
    const quand = dans === 0 ? "ce soir" : dans === 1 ? "demain" : NOMS_JOURS[j];
    return { enCreneau: false, prochain: `${quand} à ${stream.debut} h` };
  }
  return { enCreneau: false, prochain: "ce week-end" };
}

/** Le prochain créneau : son jour (0-6) et les minutes avant son début ;
    null pendant le créneau */
export function avantLeLive(date = new Date()): { jour: number; minutes: number } | null {
  const { jour, heure, minute } = maintenantAParis(date);
  if (stream.jours.includes(jour) && heure >= stream.debut && heure < stream.fin) return null;
  for (let dans = 0; dans < 8; dans++) {
    const j = (jour + dans) % 7;
    if (!stream.jours.includes(j)) continue;
    if (dans === 0 && heure >= stream.debut) continue;
    return { jour: j, minutes: dans * 1440 + stream.debut * 60 - (heure * 60 + minute) };
  }
  return null;
}

/** « 2 j 5 h », « 3 h 20 », « 12 min » */
export function dureeLisible(minutes: number) {
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)} j ${Math.floor((minutes % 1440) / 60)} h`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
  return `${Math.max(1, minutes)} min`;
}

/** Le jour (0-6) à Paris */
export const jourAParis = (date = new Date()) => maintenantAParis(date).jour;

/** « Samedi », « Dimanche »… */
export const nomDuJour = (j: number) => NOMS_JOURS[j].charAt(0).toUpperCase() + NOMS_JOURS[j].slice(1);

/** « 21 h – minuit » */
export const plageDuLive = `${stream.debut} h – ${stream.fin === 24 ? "minuit" : `${stream.fin} h`}`;

/** La phrase du bandeau des écrans : en direct, bientôt, ou le prochain créneau */
export function phraseDuLive(e: EtatStream) {
  if (e.reel && e.enDirect) {
    const jeu = e.jeu && e.jeu.length > 22 ? `${e.jeu.slice(0, 21)}…` : e.jeu;
    return jeu ? `En direct sur ${jeu} : venez dire bonjour !` : "En direct : venez dire bonjour !";
  }
  if (e.enCreneau) return e.reel ? "C'est l'heure du live : il démarre bientôt" : "C'est l'heure du live : venez dire bonjour !";
  return `Prochain live : ${e.prochain}`;
}
