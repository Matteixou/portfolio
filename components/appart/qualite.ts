/* ───────────────────────────────────────────────────────────────────────
   Qualité adaptative. Si l'appareil peine (des images sautent pendant
   qu'on bouge), l'appartement passe en « léger » : sans parallaxe, sans
   lueur floue au survol (un léger soulèvement à la place), sans les petites
   animations d'ambiance (poussière, oiseaux, nuages, feuilles, lueurs).
   Les appareils qui suivent gardent tout.

   D'emblée si l'appareil est modeste : décidé avant le premier affichage
   par le script du <head> (app/layout.tsx : mini-test de vitesse de 6 ms
   sur tous les navigateurs, mémoire déclarée, économie de données).
   Sinon, mesuré : pendant les premiers gestes (souris, défilement,
   ouverture d'un coin), on compte les images ratées sur ~1 s, au plus six
   fois. Trois mesures franchement mauvaises → léger, pour toute la session
   (pas au-delà : une première visite paie aussi la mise en route de la
   carte graphique, qui ne se reproduit pas). Rien n'est mesuré pendant
   l'arrivée ni dans les 3 s qui suivent le chargement.
   Pour essayer : ?leger=1 (forcé) ou ?leger=0 (jamais).
   Le mode est posé sur <html data-leger="true">, lu par le CSS et par la
   parallaxe (Appart.tsx).
   ─────────────────────────────────────────────────────────────────────── */

const CLE = "appart:leger";
const MESURES_MAX = 6;
const MAUVAISES_POUR_ALLEGER = 3;
// part d'images ratées au-delà de laquelle une mesure est « mauvaise »
const SEUIL = 0.3;

export function estLeger() {
  return document.documentElement.dataset.leger === "true";
}

function alleger(retenir: boolean) {
  document.documentElement.dataset.leger = "true";
  if (retenir) {
    try {
      sessionStorage.setItem(CLE, "1");
    } catch {
      // stockage indisponible : on remesurera à la prochaine page
    }
  }
  window.dispatchEvent(new Event("appart:leger"));
}

/** L'appareil se déclare modeste (Chrome, Edge, Android) : peu de mémoire,
    ou le visiteur a demandé d'économiser les données */
function appareilModeste() {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.deviceMemory !== undefined && n.deviceMemory <= 2) || n.connection?.saveData === true;
}

/** Lance la surveillance ; renvoie de quoi l'arrêter */
export function surveillerFluidite(): () => void {
  const force = new URLSearchParams(window.location.search).get("leger");
  // déjà décidé par le script du <head> (mini-test de vitesse, mémoire)
  if (estLeger()) return () => {};
  if (force === "1" || (force !== "0" && appareilModeste())) {
    alleger(false);
    return () => {};
  }
  if (force === "0") return () => {};
  try {
    if (sessionStorage.getItem(CLE)) {
      alleger(false);
      return () => {};
    }
  } catch {
    // stockage indisponible : on mesure
  }

  let mesures = 0;
  let mauvaises = 0;
  let enCours = false;
  let image = 0;
  let pret = false;
  const demarrage = window.setTimeout(() => (pret = true), 3000);

  const mesurer = () => {
    if (!pret || enCours || mesures >= MESURES_MAX || document.hidden) return;
    // l'arrivée sur le palier n'est pas un geste : on attend qu'elle soit finie
    if (document.querySelector(".entree-appart")) return;
    enCours = true;
    const ecarts: number[] = [];
    let avant = 0;
    let debut = 0;
    const pas = (t: number) => {
      if (avant) ecarts.push(t - avant);
      else debut = t;
      avant = t;
      if (t - debut < 1000) {
        image = requestAnimationFrame(pas);
        return;
      }
      enCours = false;
      mesures++;
      if (ecarts.length < 20) return;
      // la cadence de l'écran : les écarts les plus courts (60, 120 Hz…)
      const tries = [...ecarts].sort((a, b) => a - b);
      const cadence = Math.max(4, tries[Math.floor(tries.length * 0.2)]);
      const ratees = ecarts.reduce((n, d) => n + Math.max(0, Math.round(d / cadence) - 1), 0);
      if (ratees / (ecarts.length + ratees) > SEUIL) mauvaises++;
      if (mauvaises >= MAUVAISES_POUR_ALLEGER) {
        arreter();
        alleger(true);
      } else if (mesures >= MESURES_MAX) arreter();
    };
    image = requestAnimationFrame(pas);
  };

  const options = { passive: true, capture: true } as const;
  window.addEventListener("pointermove", mesurer, options);
  window.addEventListener("scroll", mesurer, options);
  window.addEventListener("hashchange", mesurer);
  function arreter() {
    window.clearTimeout(demarrage);
    cancelAnimationFrame(image);
    window.removeEventListener("pointermove", mesurer, options);
    window.removeEventListener("scroll", mesurer, options);
    window.removeEventListener("hashchange", mesurer);
  }
  return arreter;
}
