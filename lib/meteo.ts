/* ───────────────────────────────────────────────────────────────────────
   La météo de Villejuif, telle qu'on la voit par les fenêtres.
   Source : Open-Meteo (gratuit, sans clé), codes météo WMO.
   ─────────────────────────────────────────────────────────────────────── */

export const VILLEJUIF = { latitude: 48.7922, longitude: 2.3634 };

export const TEMPS = ["clair", "nuageux", "pluie", "neige", "orage"] as const;
export type Temps = (typeof TEMPS)[number];

export interface Meteo {
  temps: Temps;
  /** °C, arrondi */
  temperature: number | null;
}

/** Code météo WMO → ce qu'on dessine à la fenêtre */
export function classerCode(code: number): Temps {
  if (code >= 95) return "orage";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "neige";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "pluie";
  if (code >= 2) return "nuageux";
  return "clair";
}

export const LIBELLES: Record<Temps, string> = {
  clair: "ciel dégagé",
  nuageux: "nuageux",
  pluie: "il pleut",
  neige: "il neige",
  orage: "orage",
};

export function estTemps(v: string | null): v is Temps {
  return v !== null && (TEMPS as readonly string[]).includes(v);
}
