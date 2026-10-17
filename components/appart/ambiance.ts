import type { PieceId } from "./lieux";
import { contexteAudio } from "./son";

/* ───────────────────────────────────────────────────────────────────────
   L'ambiance sonore de l'appartement, synthétisée (aucun fichier son) :
   - la pluie quand il pleut à Villejuif, et le tonnerre pendant l'orage
   - la rumeur de la ville, plus présente la nuit, et des voitures qui passent
   - le crépitement des bougies, dans le salon quand elles sont allumées
   - quelques oiseaux par beau temps, en fin de journée
   Le son suit la pièce à l'écran : la pluie s'entend moins dans le studio,
   qui n'a pas de fenêtre. Il baisse quand la platine joue, et se coupe
   quand l'onglet est caché. Désactivée par défaut (bouton près de
   l'interrupteur).
   ─────────────────────────────────────────────────────────────────────── */

export interface ReglagesAmbiance {
  /** 0 : pas de pluie, 1 : pluie, 2 : orage */
  pluie: 0 | 1 | 2;
  nuit: boolean;
  bougies: boolean;
  piece: PieceId;
  /** la platine ou le mode disco jouent : l'ambiance se fait discrète */
  musique: boolean;
  oiseaux: boolean;
}

interface Noeuds {
  ctx: AudioContext;
  maitre: GainNode;
  pluie: GainNode;
  ville: GainNode;
  sources: AudioBufferSourceNode[];
  bruitRose: AudioBuffer;
  bruitBrun: AudioBuffer;
}

let noeuds: Noeuds | null = null;
let reglages: ReglagesAmbiance = { pluie: 0, nuit: false, bougies: true, piece: "salon", musique: false, oiseaux: true };
let minuteries: number[] = [];

/* ─── Les bruits de base ─── */

function bruit(ctx: AudioContext, secondes: number, couleur: "rose" | "brun") {
  const n = Math.floor(ctx.sampleRate * secondes);
  const tampon = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = tampon.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    dernier = 0;
  for (let i = 0; i < n; i++) {
    const blanc = Math.random() * 2 - 1;
    if (couleur === "rose") {
      b0 = 0.99765 * b0 + blanc * 0.099046;
      b1 = 0.963 * b1 + blanc * 0.2965164;
      b2 = 0.57 * b2 + blanc * 1.0526913;
      d[i] = (b0 + b1 + b2 + blanc * 0.1848) * 0.18;
    } else {
      dernier = (dernier + 0.02 * blanc) / 1.02;
      d[i] = dernier * 3.5;
    }
  }
  return tampon;
}

function boucle(ctx: AudioContext, tampon: AudioBuffer, vers: AudioNode) {
  const src = ctx.createBufferSource();
  src.buffer = tampon;
  src.loop = true;
  src.connect(vers);
  src.start();
  return src;
}

const hasard = (min: number, max: number) => min + Math.random() * (max - min);

/** Relance `faire` après un délai aléatoire, tant que l'ambiance tourne */
function repeter(faire: () => void, min: number, max: number) {
  const suivant = () => {
    const id = window.setTimeout(() => {
      if (!noeuds) return;
      if (!document.hidden) faire();
      suivant();
    }, hasard(min, max));
    minuteries.push(id);
  };
  suivant();
}

/* ─── Les événements ponctuels ─── */

function tonnerre() {
  if (!noeuds || reglages.pluie !== 2) return;
  const { ctx, maitre, bruitBrun } = noeuds;
  const t = ctx.currentTime + 0.05;
  const src = ctx.createBufferSource();
  src.buffer = bruitBrun;
  const filtre = ctx.createBiquadFilter();
  filtre.type = "lowpass";
  filtre.frequency.value = 160;
  const env = ctx.createGain();
  const fort = reglages.piece === "studio" ? 0.35 : 0.9;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(fort, t + 0.25);
  env.gain.exponentialRampToValueAtTime(fort * 0.4, t + 1.1);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
  src.connect(filtre).connect(env).connect(maitre);
  src.start(t, hasard(0, 2));
  src.stop(t + 4.4);
}

function voiture() {
  if (!noeuds) return;
  const { ctx, maitre, bruitRose } = noeuds;
  const t = ctx.currentTime + 0.05;
  const duree = hasard(2.6, 4);
  const src = ctx.createBufferSource();
  src.buffer = bruitRose;
  const filtre = ctx.createBiquadFilter();
  filtre.type = "bandpass";
  filtre.Q.value = 0.7;
  filtre.frequency.setValueAtTime(260, t);
  filtre.frequency.linearRampToValueAtTime(900, t + duree / 2);
  filtre.frequency.linearRampToValueAtTime(240, t + duree);
  const env = ctx.createGain();
  const volume = (reglages.nuit ? 0.22 : 0.14) * (reglages.piece === "studio" ? 0.35 : 1);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(volume, t + duree / 2);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  const pan = ctx.createStereoPanner();
  const sens = Math.random() < 0.5 ? -1 : 1;
  pan.pan.setValueAtTime(-0.8 * sens, t);
  pan.pan.linearRampToValueAtTime(0.8 * sens, t + duree);
  src.connect(filtre).connect(env).connect(pan).connect(maitre);
  src.start(t, hasard(0, 3));
  src.stop(t + duree + 0.1);
}

function crepitement() {
  if (!noeuds || !reglages.bougies || reglages.piece !== "salon") return;
  const { ctx, maitre, bruitRose } = noeuds;
  const n = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const t = ctx.currentTime + 0.02 + i * hasard(0.03, 0.12);
    const src = ctx.createBufferSource();
    src.buffer = bruitRose;
    const filtre = ctx.createBiquadFilter();
    filtre.type = "highpass";
    filtre.frequency.value = 1800;
    const env = ctx.createGain();
    env.gain.setValueAtTime(hasard(0.04, 0.12), t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
    src.connect(filtre).connect(env).connect(maitre);
    src.start(t, hasard(0, 3));
    src.stop(t + 0.02);
  }
}

function oiseau() {
  if (!noeuds || !reglages.oiseaux || reglages.nuit || reglages.pluie || reglages.piece === "studio") return;
  const { ctx, maitre } = noeuds;
  const pan = ctx.createStereoPanner();
  pan.pan.value = hasard(-0.7, 0.7);
  pan.connect(maitre);
  const notes = 2 + Math.floor(Math.random() * 4);
  const base = hasard(2600, 3400);
  for (let i = 0; i < notes; i++) {
    const t = ctx.currentTime + 0.05 + i * hasard(0.11, 0.16);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base * hasard(1.15, 1.4), t + 0.06);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.035, t + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(env).connect(pan);
    osc.start(t);
    osc.stop(t + 0.09);
  }
}

/* ─── Les nappes continues : pluie et rumeur de la ville ─── */

function appliquer() {
  if (!noeuds) return;
  const { ctx, maitre, pluie, ville } = noeuds;
  const t = ctx.currentTime;
  const studio = reglages.piece === "studio";
  const volPluie = reglages.pluie === 0 ? 0 : (reglages.pluie === 2 ? 0.34 : 0.24) * (studio ? 0.3 : 1);
  const volVille = (reglages.nuit ? 0.16 : 0.08) * (studio ? 0.5 : 1);
  pluie.gain.setTargetAtTime(volPluie, t, 0.8);
  ville.gain.setTargetAtTime(volVille, t, 0.8);
  maitre.gain.setTargetAtTime(document.hidden ? 0 : reglages.musique ? 0.3 : 1, t, 0.5);
}

function surVisibilite() {
  appliquer();
}

export function reglerAmbiance(r: ReglagesAmbiance) {
  reglages = r;
  appliquer();
}

/** À appeler pendant un clic (le navigateur n'autorise le son qu'après un geste) */
export function demarrerAmbiance(r: ReglagesAmbiance) {
  reglages = r;
  if (noeuds) return appliquer();
  const ctx = contexteAudio();
  const maitre = ctx.createGain();
  maitre.gain.value = 0;
  maitre.connect(ctx.destination);

  const bruitRose = bruit(ctx, 4, "rose");
  const bruitBrun = bruit(ctx, 5, "brun");

  // la pluie : un bruit rose, sans graves ni sifflement
  const pluie = ctx.createGain();
  pluie.gain.value = 0;
  const passeHaut = ctx.createBiquadFilter();
  passeHaut.type = "highpass";
  passeHaut.frequency.value = 450;
  const passeBas = ctx.createBiquadFilter();
  passeBas.type = "lowpass";
  passeBas.frequency.value = 5200;
  passeHaut.connect(passeBas).connect(pluie).connect(maitre);

  // la ville : un grondement sourd et lointain
  const ville = ctx.createGain();
  ville.gain.value = 0;
  const sourd = ctx.createBiquadFilter();
  sourd.type = "lowpass";
  sourd.frequency.value = 320;
  sourd.connect(ville).connect(maitre);

  noeuds = {
    ctx,
    maitre,
    pluie,
    ville,
    bruitRose,
    bruitBrun,
    sources: [boucle(ctx, bruitRose, passeHaut), boucle(ctx, bruitBrun, sourd)],
  };

  repeter(tonnerre, 9000, 22000);
  repeter(voiture, 5000, 14000);
  repeter(crepitement, 350, 1500);
  repeter(oiseau, 2500, 8000);
  document.addEventListener("visibilitychange", surVisibilite);
  appliquer();
}

export function arreterAmbiance() {
  if (!noeuds) return;
  const { ctx, maitre, sources } = noeuds;
  noeuds = null;
  minuteries.forEach((id) => window.clearTimeout(id));
  minuteries = [];
  document.removeEventListener("visibilitychange", surVisibilite);
  maitre.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
  window.setTimeout(() => {
    sources.forEach((s) => s.stop());
    maitre.disconnect();
  }, 900);
}
