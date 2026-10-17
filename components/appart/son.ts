/* ───────────────────────────────────────────────────────────────────────
   Un peu de musique, synthétisée dans le navigateur (aucun fichier son).
   - la guitare : algorithme de Karplus-Strong, une corde pincée = un bruit
     bref qui boucle dans une ligne à retard et s'adoucit à chaque passage
   - le clavier : une petite onde triangle qui s'éteint doucement
   - la platine : une boucle lo-fi (accords, basse, rythmique, craquements)
   Ne joue qu'après une action du visiteur (les navigateurs l'exigent).
   ─────────────────────────────────────────────────────────────────────── */

let contexte: AudioContext | null = null;

function audio() {
  contexte ??= new AudioContext();
  if (contexte.state === "suspended") void contexte.resume();
  return contexte;
}

/** À appeler pendant un clic : le son pourra ensuite démarrer plus tard
    (la boucle lo-fi, si Spotify ne répond pas) */
export function preparerSon() {
  audio();
}

/** Le contexte audio partagé (l'ambiance sonore s'y branche aussi) */
export function contexteAudio() {
  return audio();
}

function sortie(ctx: AudioContext, volume: number, coupure = 3200) {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  const filtre = ctx.createBiquadFilter();
  filtre.type = "lowpass";
  filtre.frequency.value = coupure;
  gain.connect(filtre).connect(ctx.destination);
  return gain;
}

/* ═══ La guitare ════════════════════════════════════════════════════ */

/** Une corde pincée (Karplus-Strong) */
function corde(ctx: AudioContext, frequence: number, debut: number, vers: AudioNode) {
  const taux = ctx.sampleRate;
  const longueur = Math.floor(taux * 2.6);
  const tampon = ctx.createBuffer(1, longueur, taux);
  const donnees = tampon.getChannelData(0);
  const periode = Math.max(2, Math.round(taux / frequence));
  const boucle = new Float32Array(periode);
  for (let i = 0; i < periode; i++) boucle[i] = Math.random() * 2 - 1;
  let j = 0;
  for (let i = 0; i < longueur; i++) {
    const a = boucle[j];
    const b = boucle[(j + 1) % periode];
    boucle[j] = 0.4985 * (a + b);
    donnees[i] = a;
    j = (j + 1) % periode;
  }
  const source = ctx.createBufferSource();
  source.buffer = tampon;
  source.connect(vers);
  source.start(debut);
}

const SOL_MAJEUR = [98, 123.47, 146.83, 196, 246.94, 392];

/** Un accord de sol majeur, gratté vers le bas (1) ou vers le haut (-1) */
export function gratterAccord(sens: 1 | -1 = 1, vitesse = 0.032) {
  const ctx = audio();
  const vers = sortie(ctx, 0.22);
  const t = ctx.currentTime + 0.02;
  const cordes = sens === 1 ? SOL_MAJEUR : [...SOL_MAJEUR].reverse();
  cordes.forEach((f, i) => corde(ctx, f, t + i * vitesse, vers));
}

/* ═══ Le clavier ════════════════════════════════════════════════════ */

function notePiano(ctx: AudioContext, frequence: number, debut: number, vers: AudioNode, duree = 1.1) {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = frequence;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, debut);
  env.gain.linearRampToValueAtTime(0.9, debut + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, debut + duree);
  osc.connect(env).connect(vers);
  osc.start(debut);
  osc.stop(debut + duree + 0.1);
}

/** Les touches blanches du clavier : gamme de do majeur à partir du do 3 */
const GAMME = [0, 2, 4, 5, 7, 9, 11];
export function frequenceTouche(index: number) {
  const octave = Math.floor(index / 7);
  const demiTons = GAMME[index % 7] + 12 * octave;
  return 130.81 * Math.pow(2, demiTons / 12);
}

/** Une touche du clavier */
export function jouerTouche(index: number) {
  const ctx = audio();
  notePiano(ctx, frequenceTouche(index), ctx.currentTime + 0.01, sortie(ctx, 0.22));
}

/** Un arpège de do majeur */
export function jouerArpege() {
  const ctx = audio();
  const vers = sortie(ctx, 0.2);
  const t = ctx.currentTime + 0.03;
  [261.63, 329.63, 392, 523.25, 392, 523.25].forEach((f, i) => notePiano(ctx, f, t + i * 0.16, vers));
}

/* ═══ Les secrets de l'appart ════════════════════════════════════════ */

/** Une cloche : quelques partiels inharmoniques qui s'éteignent lentement */
function cloche(ctx: AudioContext, frequence: number, debut: number, vers: AudioNode, duree = 2.4) {
  [
    [1, 1],
    [2.76, 0.4],
    [5.4, 0.18],
  ].forEach(([rapport, volume]) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequence * rapport;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, debut);
    env.gain.linearRampToValueAtTime(volume, debut + 0.008);
    env.gain.exponentialRampToValueAtTime(0.001, debut + duree / rapport);
    osc.connect(env).connect(vers);
    osc.start(debut);
    osc.stop(debut + duree + 0.1);
  });
}

/** Le carillon de l'horloge (début du carillon de Westminster) */
export function jouerCarillon() {
  const ctx = audio();
  const vers = sortie(ctx, 0.16, 5000);
  const t = ctx.currentTime + 0.03;
  [659.25, 523.25, 587.33, 392].forEach((f, i) => cloche(ctx, f, t + i * 0.55, vers));
}

/** La sonnette de la porte d'entrée : « ding… dong » */
export function jouerSonnette() {
  const ctx = audio();
  const vers = sortie(ctx, 0.2, 5000);
  const t = ctx.currentTime + 0.02;
  cloche(ctx, 659.25, t, vers, 1.6);
  cloche(ctx, 523.25, t + 0.42, vers, 2.2);
}

/** Petit tintement : un secret vient d'être trouvé */
export function jouerSecret() {
  // pas de son si le visiteur n'a encore rien touché (le navigateur le refuserait)
  if (contexte?.state !== "running") return;
  const ctx = contexte;
  const vers = sortie(ctx, 0.12, 7000);
  const t = ctx.currentTime + 0.02;
  [1318.5, 1975.5].forEach((f, i) => cloche(ctx, f, t + i * 0.09, vers, 1.2));
}

/** La petite fanfare de la gamme do-ré-mi-fa-sol */
export function jouerFanfare() {
  const ctx = audio();
  const vers = sortie(ctx, 0.2);
  const t = ctx.currentTime + 0.03;
  [
    [392, 0],
    [392, 0.14],
    [392, 0.28],
    [523.25, 0.42],
  ].forEach(([f, d]) => notePiano(ctx, f, t + d, vers, d === 0.42 ? 1.6 : 0.3));
  [261.63, 329.63, 392].forEach((f) => notePiano(ctx, f, t + 0.42, vers, 1.6));
}

/** Le groove du mode disco (120 bpm), pendant `duree` secondes */
export function jouerDisco(duree = 12) {
  const ctx = audio();
  const maitre = ctx.createGain();
  const t0 = ctx.currentTime + 0.05;
  maitre.gain.setValueAtTime(0.0001, t0);
  maitre.gain.exponentialRampToValueAtTime(0.5, t0 + 0.4);
  maitre.gain.setValueAtTime(0.5, t0 + duree - 1.2);
  maitre.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  maitre.connect(ctx.destination);
  const souffle = bruitBlanc(ctx, 0.3);
  const temps = 0.5;
  // basse en octaves sur la mineur, ré mineur, mi mineur, la mineur
  const basses = [55, 73.42, 82.41, 55];
  for (let b = 0; b * temps < duree - 0.5; b++) {
    const t = t0 + b * temps;
    // grosse caisse sur chaque temps
    const kick = ctx.createOscillator();
    kick.frequency.setValueAtTime(140, t);
    kick.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const ek = ctx.createGain();
    ek.gain.setValueAtTime(0.9, t);
    ek.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    kick.connect(ek).connect(maitre);
    kick.start(t);
    kick.stop(t + 0.2);
    // charleston ouvert à contretemps, claquement sur 2 et 4
    const hat = ctx.createBufferSource();
    hat.buffer = souffle;
    const fh = ctx.createBiquadFilter();
    fh.type = "highpass";
    fh.frequency.value = b % 2 ? 2200 : 7000;
    const eh = ctx.createGain();
    const th = b % 2 ? t : t + temps / 2;
    eh.gain.setValueAtTime(b % 2 ? 0.28 : 0.16, th);
    eh.gain.exponentialRampToValueAtTime(0.001, th + (b % 2 ? 0.12 : 0.16));
    hat.connect(fh).connect(eh).connect(maitre);
    hat.start(th);
    hat.stop(th + 0.2);
    // la basse : deux croches par temps, l'octave du dessus en second
    const f = basses[Math.floor(b / 4) % basses.length];
    [0, 1].forEach((k) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f * (k ? 2 : 1);
      const filtre = ctx.createBiquadFilter();
      filtre.type = "lowpass";
      filtre.frequency.value = 700;
      const eb = ctx.createGain();
      const tb = t + k * (temps / 2);
      eb.gain.setValueAtTime(0.0001, tb);
      eb.gain.linearRampToValueAtTime(0.22, tb + 0.01);
      eb.gain.exponentialRampToValueAtTime(0.001, tb + temps / 2 - 0.02);
      osc.connect(filtre).connect(eb).connect(maitre);
      osc.start(tb);
      osc.stop(tb + temps / 2);
    });
  }
}

/** L'étoile filante : un glissando aigu, tout doux */
export function jouerEtoile() {
  const ctx = audio();
  const t = ctx.currentTime + 0.02;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2600, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.9);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.06, t + 0.05);
  env.gain.exponentialRampToValueAtTime(0.001, t + 1);
  osc.connect(env).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 1.05);
}

/* ═══ La platine : une boucle lo-fi ══════════════════════════════════ */

const ACCORDS_LOFI = [
  [174.61, 220, 261.63, 329.63], // fa maj7
  [164.81, 196, 246.94, 293.66], // mi m7
  [146.83, 174.61, 220, 261.63], // ré m7
  [130.81, 164.81, 196, 246.94], // do maj7
];
const TEMPS_LOFI = 0.75; // 80 battements par minute

function bruitBlanc(ctx: AudioContext, duree: number, craquements = false) {
  const n = Math.floor(ctx.sampleRate * duree);
  const tampon = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = tampon.getChannelData(0);
  for (let i = 0; i < n; i++) {
    d[i] = craquements ? (Math.random() < 0.0009 ? Math.random() * 2 - 1 : (Math.random() * 2 - 1) * 0.04) : Math.random() * 2 - 1;
  }
  return tampon;
}

let lofi: { arreter: () => void } | null = null;

function lancerLofi() {
  const ctx = audio();
  const maitre = ctx.createGain();
  maitre.gain.setValueAtTime(0, ctx.currentTime);
  maitre.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
  const chaleur = ctx.createBiquadFilter();
  chaleur.type = "lowpass";
  chaleur.frequency.value = 1600;
  maitre.connect(chaleur).connect(ctx.destination);

  // les craquements du vinyle, en boucle
  const vinyle = ctx.createBufferSource();
  vinyle.buffer = bruitBlanc(ctx, 3, true);
  vinyle.loop = true;
  const gainVinyle = ctx.createGain();
  gainVinyle.gain.value = 0.18;
  vinyle.connect(gainVinyle).connect(maitre);
  vinyle.start();

  const souffle = bruitBlanc(ctx, 0.2);

  const accord = (notes: number[], t: number) => {
    notes.forEach((f, k) => {
      const osc = ctx.createOscillator();
      osc.type = k % 2 ? "triangle" : "sine";
      osc.frequency.value = f;
      osc.detune.value = (k - 1.5) * 4;
      const env = ctx.createGain();
      const debut = t + k * 0.035;
      env.gain.setValueAtTime(0, debut);
      env.gain.linearRampToValueAtTime(0.05, debut + 0.08);
      env.gain.exponentialRampToValueAtTime(0.004, debut + TEMPS_LOFI * 4);
      osc.connect(env).connect(maitre);
      osc.start(debut);
      osc.stop(debut + TEMPS_LOFI * 4 + 0.1);
    });
    // la basse
    const basse = ctx.createOscillator();
    basse.type = "sine";
    basse.frequency.value = notes[0] / 2;
    const envBasse = ctx.createGain();
    envBasse.gain.setValueAtTime(0.16, t);
    envBasse.gain.exponentialRampToValueAtTime(0.004, t + TEMPS_LOFI * 3.6);
    basse.connect(envBasse).connect(maitre);
    basse.start(t);
    basse.stop(t + TEMPS_LOFI * 4);
  };

  const grosseCaisse = (t: number) => {
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.35, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(env).connect(maitre);
    osc.start(t);
    osc.stop(t + 0.32);
  };

  const frappe = (t: number, volume: number, aigu: number) => {
    const src = ctx.createBufferSource();
    src.buffer = souffle;
    const filtre = ctx.createBiquadFilter();
    filtre.type = "highpass";
    filtre.frequency.value = aigu;
    const env = ctx.createGain();
    env.gain.setValueAtTime(volume, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    src.connect(filtre).connect(env).connect(maitre);
    src.start(t);
    src.stop(t + 0.1);
  };

  let prochain = ctx.currentTime + 0.15;
  let mesure = 0;
  const planifier = () => {
    while (prochain < ctx.currentTime + 1.5) {
      accord(ACCORDS_LOFI[mesure % ACCORDS_LOFI.length], prochain);
      // grosse caisse sur le 1 et le « et » du 3, caisse claire feutrée sur 2 et 4, charleston léger
      grosseCaisse(prochain);
      grosseCaisse(prochain + 2.5 * TEMPS_LOFI);
      if (mesure % 2) grosseCaisse(prochain + 2 * TEMPS_LOFI);
      for (let temps = 0; temps < 4; temps++) {
        const t = prochain + temps * TEMPS_LOFI;
        if (temps === 1 || temps === 3) frappe(t, 0.12, 1800);
        frappe(t + TEMPS_LOFI / 2, 0.035, 7000);
      }
      prochain += TEMPS_LOFI * 4;
      mesure++;
    }
  };
  planifier();
  const minuterie = window.setInterval(planifier, 500);

  return {
    arreter() {
      window.clearInterval(minuterie);
      const t = ctx.currentTime;
      maitre.gain.cancelScheduledValues(t);
      maitre.gain.setValueAtTime(maitre.gain.value, t);
      maitre.gain.linearRampToValueAtTime(0, t + 0.6);
      window.setTimeout(() => {
        vinyle.stop();
        maitre.disconnect();
      }, 700);
    },
  };
}

/** Lance ou arrête la boucle lo-fi de la platine ; renvoie si elle joue */
export function basculerLofi() {
  if (lofi) {
    lofi.arreter();
    lofi = null;
    return false;
  }
  lofi = lancerLofi();
  return true;
}

export function arreterLofi() {
  lofi?.arreter();
  lofi = null;
}
