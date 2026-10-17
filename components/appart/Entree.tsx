"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { moi } from "@/data/moi";
import { usePeriode } from "./saisons";
import { placer, type Boite } from "./scene/Calque";
import { jouerSonnette } from "./son";
import { estLaNuit, useHeureParis } from "./useAmbiance";

/* ───────────────────────────────────────────────────────────────────────
   L'arrivée : on remonte le couloir jusqu'à la porte de l'appartement
   (quelques pas, la vue balance un peu puis se pose). Applique allumée,
   paillasson, plaque au nom de Matthieu, post-it « entrez, c'est
   ouvert ! ». La poignée tourne, la porte s'ouvre sur le vrai salon
   (visible par l'embrasure), puis on entre : le palier s'efface et le
   salon apparaît.
   - un clic ou une touche : on sonne, et la porte s'ouvre tout de suite ;
   - sinon elle s'ouvre seule, une fois devant elle et la page chargée ;
   - une seule fois par visite, jamais pour un lien direct (#contact…), ni
     sans JavaScript, ni si le visiteur préfère moins d'animations (le
     script du <head> pose alors « sans-entree » avant le premier affichage).
   Tout bouge en transform / opacity ; la scène, repère 1600 × 1000. Le
   palier est dessiné plus large (de -400 à 2000, de -260 à 1260) : au
   début de l'approche, on le voit de plus loin.
   ─────────────────────────────────────────────────────────────────────── */

type Phase = "porte" | "ouverture" | "fini";

const CLE = "appart:entree";
const B_PORTE: Boite = { x: 700, y: 250, w: 200, h: 510 };
const B_POIGNEE: Boite = { x: 838, y: 500, w: 54, h: 40 };
const B_APPLIQUE: Boite = { x: 430, y: 220, w: 260, h: 260 };

const rien = () => () => {};
const doitEntrer = () => !document.documentElement.classList.contains("sans-entree");

/** Une boîte, en % de sa boîte parente */
function dans(enfant: Boite, parent: Boite) {
  return {
    left: `${((enfant.x - parent.x) / parent.w) * 100}%`,
    top: `${((enfant.y - parent.y) / parent.h) * 100}%`,
    width: `${(enfant.w / parent.w) * 100}%`,
    height: `${(enfant.h / parent.h) * 100}%`,
  };
}

export default function Entree() {
  const montre = useSyncExternalStore(rien, doitEntrer, () => true);
  const [phase, setPhase] = useState<Phase>("porte");
  const lance = useRef(false);
  const racine = useRef<HTMLDivElement>(null);
  const evenement = usePeriode()?.evenement;
  const nuit = estLaNuit(useHeureParis());

  const entrer = useCallback((sonner: boolean) => {
    if (lance.current) return;
    lance.current = true;
    racine.current?.setAttribute("data-marche", "");
    if (sonner) jouerSonnette();
    try {
      sessionStorage.setItem(CLE, "1");
    } catch {
      // stockage indisponible : l'entrée se rejouera, ce n'est pas grave
    }
    // l'ouverture puis l'entrée s'enchaînent en CSS (délais) : aucun code ne
    // tourne pendant le mouvement ; on retire le palier une fois effacé
    setPhase("ouverture");
    window.setTimeout(() => setPhase("fini"), 2350);
  }, []);

  // On remonte le couloir dès que la page a pris vie : lancée au premier
  // affichage, la marche s'écoulerait pendant le chargement, où le navigateur
  // ne dessine presque rien (on la verrait commencer aux trois quarts).
  // La porte s'ouvre seule une fois arrivé devant (fin de l'animation
  // « approche ») et la page chargée, après un court temps d'arrêt.
  useEffect(() => {
    const el = racine.current;
    if (!montre || !el) return;
    el.setAttribute("data-marche", "");
    let arrive = false;
    let charge = document.readyState === "complete";
    let minuterie = 0;
    const tenter = () => {
      if (arrive && charge && !minuterie) minuterie = window.setTimeout(() => entrer(false), 350);
    };
    const surArrivee = (e: AnimationEvent) => {
      if (e.animationName !== "approche") return;
      arrive = true;
      tenter();
    };
    const surCharge = () => {
      charge = true;
      tenter();
    };
    el.addEventListener("animationend", surArrivee);
    if (!charge) window.addEventListener("load", surCharge, { once: true });
    const secours = window.setTimeout(() => entrer(false), 4500);
    const touche = (e: KeyboardEvent) => {
      if (e.key !== "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey) entrer(true);
    };
    window.addEventListener("keydown", touche);
    return () => {
      el.removeEventListener("animationend", surArrivee);
      window.removeEventListener("load", surCharge);
      window.removeEventListener("keydown", touche);
      window.clearTimeout(minuterie);
      window.clearTimeout(secours);
    };
  }, [montre, entrer]);

  if (!montre || phase === "fini") return null;

  return (
    <div ref={racine} className="entree-appart" data-phase={phase} data-nuit={nuit} aria-hidden onClick={() => entrer(true)}>
      <div className="entree-scene">
        {/* le palier : mur, plinthe, parquet, chambranle — la baie de la porte est percée */}
        <svg className="entree-calque" viewBox="0 0 1600 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="e-mur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e4d3b8" />
              <stop offset="0.7" stopColor="#efe3cf" />
              <stop offset="1" stopColor="#e6d5bb" />
            </linearGradient>
            <pattern id="e-papier" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M23 6 C27 14 27 18 23 22 C19 18 19 14 23 6 Z" fill="#d9c4a5" opacity="0.45" />
            </pattern>
            <linearGradient id="e-sol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7a4a2a" />
              <stop offset="1" stopColor="#4f2e18" />
            </linearGradient>
            <radialGradient id="e-ombre-haut" cx="0.5" cy="0" r="0.9">
              <stop offset="0" stopColor="#3a281d" stopOpacity="0" />
              <stop offset="1" stopColor="#3a281d" stopOpacity="0.28" />
            </radialGradient>
          </defs>
          <path fillRule="evenodd" d="M-400 -260 H2000 V1260 H-400 Z M700 250 H900 V760 H700 Z" fill="url(#e-mur)" />
          <path fillRule="evenodd" d="M-400 -260 H2000 V744 H-400 Z M700 250 H900 V760 H700 Z" fill="url(#e-papier)" />
          {/* parquet et plinthe */}
          <path fillRule="evenodd" d="M-400 760 H2000 V1260 H-400 Z" fill="url(#e-sol)" />
          <g stroke="#3e2213" strokeWidth="1.4" opacity="0.45">
            {Array.from({ length: 11 }, (_, i) => (
              <path key={i} d={`M-400 ${790 + i * 30 + i * i * 2} H2000`} />
            ))}
          </g>
          <rect x="-400" y="742" width="1100" height="18" fill="#f3e8d6" />
          <rect x="900" y="742" width="1100" height="18" fill="#f3e8d6" />
          <rect x="-400" y="758" width="1100" height="3" fill="#b99a74" opacity="0.6" />
          <rect x="900" y="758" width="1100" height="3" fill="#b99a74" opacity="0.6" />
          {/* le tapis du couloir, qui mène à la porte */}
          <path d="M478 1260 H1122 L962 830 H638 Z" fill="#8e3b26" />
          <path d="M520 1260 H1080 L946 846 H654 Z" fill="none" stroke="#d9a35a" strokeWidth="4" opacity="0.7" />
          <path d="M548 1260 H1052 L936 858 H664 Z" fill="none" stroke="#5f2617" strokeWidth="2" opacity="0.6" />
          {/* un cadre au mur, à gauche */}
          <g>
            <rect x="196" y="318" width="150" height="190" rx="3" fill="#6b4226" />
            <rect x="208" y="330" width="126" height="166" fill="#f3e8d6" />
            <path d="M216 470 L252 412 L278 448 L298 424 L326 470 Z" fill="#c2562f" opacity="0.75" />
            <circle cx="300" cy="372" r="14" fill="#e6b85c" />
          </g>
          {/* le chambranle */}
          <path fillRule="evenodd" d="M676 228 H924 V762 H676 Z M700 250 H900 V762 H700 Z" fill="#f3e8d6" />
          <path d="M676 228 H924 V236 H676 Z" fill="#fffaf0" opacity="0.7" />
          <path d="M916 236 V762 H924 V228 Z" fill="#cdb089" opacity="0.6" />
          {/* l'ébrasement : l'épaisseur du mur, visible quand la porte est ouverte */}
          <path d="M700 250 L712 262 V760 H700 Z" fill="#3a281d" opacity="0.35" />
          <path d="M900 250 L888 262 V760 H900 Z" fill="#3a281d" opacity="0.2" />
          <path d="M700 250 H900 L888 262 H712 Z" fill="#3a281d" opacity="0.3" />
          {/* le paillasson */}
          <path d="M690 772 H910 L932 822 H668 Z" fill="#c89a5a" />
          <path d="M690 772 H910 L932 822 H668 Z" fill="none" stroke="#9c6f3a" strokeWidth="3" />
          <text x="800" y="806" textAnchor="middle" className="font-main" fontSize="30" fill="#6b4226">
            bienvenue
          </text>
          {/* une plante, à droite de la porte */}
          <g>
            <ellipse cx="1010" cy="760" rx="44" ry="6" fill="#2c180c" opacity="0.3" />
            <path d="M974 690 H1046 L1038 758 H982 Z" fill="#c2562f" />
            <rect x="970" y="684" width="80" height="10" rx="3" fill="#d9683c" />
            <g fill="#4f7a3c">
              <path d="M1010 686 C990 640 960 620 940 624 C958 640 980 662 1004 688 Z" />
              <path d="M1012 686 C1020 630 1046 600 1070 598 C1056 624 1036 656 1016 688 Z" />
              <path d="M1008 686 C1004 640 1010 590 1022 566 C1030 600 1024 650 1014 688 Z" fill="#5a9a48" />
              <path d="M1006 688 C980 668 958 666 944 676 C966 680 988 684 1004 690 Z" fill="#5a9a48" />
            </g>
          </g>
          {/* l'applique murale : bras en laiton, abat-jour */}
          <g>
            <path d="M560 380 V352 H574" fill="none" stroke="#b8893f" strokeWidth="5" strokeLinecap="round" />
            <rect x="552" y="372" width="16" height="22" rx="4" fill="#b8893f" />
            <path d="M540 300 H606 L620 352 H526 Z" fill="#f3e2bf" />
            <path d="M540 300 H606 L620 352 H526 Z" fill="none" stroke="#d6bf94" strokeWidth="2" />
          </g>
          {/* à Halloween, une citrouille attend sur le palier */}
          {evenement === "halloween" && (
            <g>
              <ellipse cx="612" cy="764" rx="34" ry="5" fill="#2c180c" opacity="0.3" />
              <ellipse cx="598" cy="742" rx="20" ry="22" fill="#d0601b" />
              <ellipse cx="626" cy="742" rx="20" ry="22" fill="#b9521a" />
              <ellipse cx="612" cy="742" rx="17" ry="23" fill="#e8762a" />
              <path d="M612 720 q-1 -8 6 -12" fill="none" stroke="#5b6b2e" strokeWidth="4" strokeLinecap="round" />
              <path d="M600 736 l6 -8 l6 8 Z M612 736 l6 -8 l6 8 Z M598 750 Q612 762 626 750 Z" fill="#4a2410" />
            </g>
          )}
          <rect x="-400" y="-260" width="2400" height="1520" fill="url(#e-ombre-haut)" />
          <rect className="entree-nuit" x="-400" y="-260" width="2400" height="1520" fill="#1b2150" />
        </svg>

        {/* la lumière de l'applique, et celle du salon qui se répand sur le palier */}
        <span className="entree-halo" style={placer(B_APPLIQUE)} />
        <svg className="entree-calque entree-lumiere" viewBox="0 0 1600 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="e-lumiere" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd59a" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M700 760 H900 L1080 1000 H520 Z" fill="url(#e-lumiere)" />
        </svg>

        {/* la porte : elle pivote vers l'intérieur, sur ses gonds à gauche */}
        <div className="entree-porte" style={placer(B_PORTE)}>
          <svg className="entree-calque" viewBox={`${B_PORTE.x} ${B_PORTE.y} ${B_PORTE.w} ${B_PORTE.h}`} preserveAspectRatio="none">
            <rect x="700" y="250" width="200" height="510" fill="#59623a" />
            <rect x="700" y="250" width="200" height="510" fill="url(#e-ombre-haut)" opacity="0.5" />
            {/* les moulures */}
            <g fill="none" strokeWidth="3">
              <rect x="722" y="276" width="156" height="200" rx="3" stroke="#4a5230" />
              <rect x="722" y="500" width="156" height="236" rx="3" stroke="#4a5230" />
              <rect x="725" y="279" width="150" height="194" rx="2" stroke="#7c8752" opacity="0.6" />
              <rect x="725" y="503" width="150" height="230" rx="2" stroke="#7c8752" opacity="0.6" />
            </g>
            <rect x="896" y="250" width="4" height="510" fill="#3f4729" />
            {/* la plaque en laiton et le judas */}
            <rect x="752" y="300" width="96" height="28" rx="3" fill="#c9a24e" />
            <rect x="755" y="303" width="90" height="22" rx="2" fill="none" stroke="#e6c77a" strokeWidth="1" />
            <text x="800" y="319" textAnchor="middle" className="font-serif" fontSize="11" fontWeight="600" letterSpacing="1.5" fill="#4a3412">
              {`M. ${moi.name.replace(moi.firstName, "").trim()}`.toUpperCase()}
            </text>
            <circle cx="800" cy="358" r="7" fill="#c9a24e" />
            <circle cx="800" cy="358" r="3.5" fill="#2a2420" />
            {/* à Noël et au Nouvel An, une couronne */}
            {(evenement === "noel" || evenement === "nouvel-an") && (
              <g>
                <circle cx="800" cy="430" r="34" fill="none" stroke="#2f5a3a" strokeWidth="16" />
                <circle cx="800" cy="430" r="34" fill="none" stroke="#5c8c58" strokeWidth="4" strokeDasharray="6 9" />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <circle key={a} cx={800 + Math.cos((a * Math.PI) / 180) * 34} cy={430 + Math.sin((a * Math.PI) / 180) * 34} r="4" fill="#c8302a" />
                ))}
                <path d="M800 462 l-16 14 l6 -16 Z M800 462 l16 14 l-6 -16 Z" fill="#c8302a" />
                <circle cx="800" cy="463" r="5" fill="#a3291f" />
              </g>
            )}
            {/* le post-it */}
            <g transform="rotate(-5 764 590)">
              <rect x="726" y="556" width="78" height="68" fill="#fff3a8" />
              <rect x="726" y="556" width="78" height="10" fill="#f2e08a" />
              <text x="765" y="586" textAnchor="middle" className="font-main" fontSize="15" fill="#3a281d">
                entrez,
              </text>
              <text x="765" y="604" textAnchor="middle" className="font-main" fontSize="15" fill="#3a281d">
                c&apos;est ouvert !
              </text>
            </g>
            {/* la serrure */}
            <rect x="868" y="534" width="14" height="34" rx="4" fill="#c9a24e" />
            <rect x="873" y="552" width="4" height="9" rx="1" fill="#2a2420" />
            {/* la nuit, la porte est dans la pénombre du palier, comme le mur */}
            <rect className="entree-nuit" x="700" y="250" width="200" height="510" fill="#1b2150" />
          </svg>
          {/* la poignée : elle s'abaisse avant que la porte s'ouvre */}
          <span className="entree-poignee" style={dans(B_POIGNEE, B_PORTE)}>
            <svg className="entree-calque" viewBox={`${B_POIGNEE.x} ${B_POIGNEE.y} ${B_POIGNEE.w} ${B_POIGNEE.h}`}>
              <circle cx="875" cy="520" r="9" fill="#c9a24e" />
              <rect x="842" y="515" width="36" height="10" rx="5" fill="#d9b25e" />
              <rect x="844" y="516" width="30" height="3" rx="1.5" fill="#f2d68e" opacity="0.8" />
            </svg>
          </span>
          {/* la porte s'assombrit en pivotant (elle tourne le dos à la lampe) */}
          <span className="entree-ombre-porte" />
        </div>
      </div>
      <p className="entree-aide">
        <span className="font-main text-2xl">toc toc…</span> touchez la porte pour entrer
      </p>
    </div>
  );
}
