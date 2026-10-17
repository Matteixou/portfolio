import { classerCode, VILLEJUIF, type Meteo } from "@/lib/meteo";

/* ───────────────────────────────────────────────────────────────────────
   La météo actuelle à Villejuif, mise en cache 10 minutes : un seul appel
   à Open-Meteo par tranche de 10 minutes, quel que soit le nombre de
   visiteurs. En cas d'échec, on répond « ciel dégagé » sans casser la page.
   ─────────────────────────────────────────────────────────────────────── */

export const dynamic = "force-static";
export const revalidate = 600;

const SOURCE =
  `https://api.open-meteo.com/v1/forecast?latitude=${VILLEJUIF.latitude}&longitude=${VILLEJUIF.longitude}` +
  "&current=temperature_2m,weather_code&timezone=Europe%2FParis";

export async function GET() {
  let meteo: Meteo = { temps: "clair", temperature: null };
  try {
    const res = await fetch(SOURCE, { next: { revalidate } });
    if (res.ok) {
      const donnees = (await res.json()) as { current?: { temperature_2m?: number; weather_code?: number } };
      const actuel = donnees.current;
      if (actuel && typeof actuel.weather_code === "number") {
        meteo = {
          temps: classerCode(actuel.weather_code),
          temperature: typeof actuel.temperature_2m === "number" ? Math.round(actuel.temperature_2m) : null,
        };
      }
    }
  } catch (err) {
    console.error("Météo indisponible :", err);
  }
  return Response.json(meteo);
}
