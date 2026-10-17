import { memo, useCallback, useEffect, useRef, useState } from "react";
import { volley } from "@/data/volley";
import { Calque, Halo, ImageSalon, PLEIN, placer } from "./Calque";
import { CLUB, FENETRES_GYM, PROJECTEURS } from "./decor-gymnase";
import { MeteoFenetre } from "./meteo";
import { BallonJeu, Banderole, BanderoleSupporters, Filet, Joueur, TableauScores } from "./objets-gymnase";
import { BOITES } from "./statiques";
import type { ActionsScene } from "./types";

/* ───────────────────────────────────────────────────────────────────────
   Le gymnase, à gauche du salon, aux couleurs d'Efrei Volley.
   Empilement : ciel → décor fixe (image) → banderoles → ballon → filet
   → joueur → voile de nuit → lumières (suspensions, projecteurs).
   Le ballon passe derrière le filet, le joueur est devant.
   ─────────────────────────────────────────────────────────────────────── */

const LumieresGymnase = memo(function LumieresGymnase() {
  return (
    <>
      {/* fin de journée : la lumière tombe des hautes fenêtres */}
      <Calque boite={PLEIN} className="jour-seul rayon">
        {FENETRES_GYM.map((f) => (
          <path
            key={f.x}
            d={`M${f.x} ${f.y + f.h} H${f.x + f.w} L${f.x + f.w + 260} 1000 H${f.x + 160} Z`}
            fill="#ffd9a8"
            opacity="0.09"
          />
        ))}
      </Calque>

      {/* les suspensions */}
      {[535, 1065].map((x) => (
        <div key={x}>
          <Halo cx={x} cy={170} r={300} className="ambre" />
          <Calque boite={{ x: x - 36, y: 132, w: 72, h: 16 }}>
            <ellipse cx={x} cy="140" rx="32" ry="5" fill="#fff1cf" />
          </Calque>
        </div>
      ))}

      {/* soir de match : les projecteurs balaient le terrain */}
      <div className="nuit-seule" aria-hidden>
        {PROJECTEURS.map((p, i) => (
          <div key={p.x}>
            <Calque
              boite={{ x: p.x - 300, y: 120, w: 600, h: 800 }}
              className="anim-balayage"
              style={{ ["--angle" as string]: `${-p.angle}deg`, transformOrigin: "50% 2.25%", animationDelay: `${-i * 2.3}s` }}
            >
              <path d={`M${p.x - 14} 138 L${p.x + 14} 138 L${p.x + 160} 900 L${p.x - 160} 900 Z`} fill="url(#g-faisceau)" />
              <ellipse cx={p.x} cy="900" rx="175" ry="28" fill="#dcefff" opacity="0.22" />
            </Calque>
            <Halo cx={p.x} cy={136} r={46} className="froid" />
          </div>
        ))}
      </div>
    </>
  );
});

/* Secret : cinq smashs au clic, et les confettis du club tombent sur le terrain */
const CONFETTIS = Array.from({ length: 34 }, (_, i) => ({
  x: 8 + ((i * 37) % 84),
  d: ((i * 13) % 10) / 10,
  c: [CLUB.ciel, CLUB.marine, CLUB.blanc, "#f2c25a"][i % 4],
  r: (i * 47) % 180,
}));

function Confettis() {
  return (
    <div className="calque" style={placer({ x: 260, y: 120, w: 1080, h: 640 })} aria-hidden>
      {CONFETTIS.map((c, i) => (
        <span
          key={i}
          className="confetti"
          style={{ left: `${c.x}%`, background: c.c, animationDelay: `${c.d}s`, rotate: `${c.r}deg` }}
        />
      ))}
    </div>
  );
}

export default memo(function Gymnase({ actions }: { actions: ActionsScene }) {
  const [score, setScore] = useState(0);
  const [coup, setCoup] = useState(0);
  const [enJeu, setEnJeu] = useState(false);

  const enJeuRef = useRef(false);

  // un smash à la fois
  const smasher = useCallback(() => {
    if (enJeuRef.current) return;
    enJeuRef.current = true;
    setEnJeu(true);
    setCoup((c) => c + 1);
  }, []);

  // le ballon touche le sol : un point pour l'Efrei, le joueur se remet en place
  const marquer = useCallback(() => {
    setScore((s) => (s >= volley.pointsDuSet ? 1 : s + 1));
    enJeuRef.current = false;
    setEnJeu(false);
  }, []);

  // au clic : on compte les smashs du visiteur (le cinquième déclenche un secret)
  const clics = useRef(0);
  const [fete, setFete] = useState(0);
  const { trouverSecret } = actions;
  const smasherAuClic = useCallback(() => {
    if (enJeuRef.current) return;
    smasher();
    clics.current += 1;
    if (clics.current === 5) {
      trouverSecret("smash");
      setFete(Date.now());
      window.setTimeout(() => setFete(0), 3600);
    }
  }, [smasher, trouverSecret]);

  // le joueur smashe tout seul quand le gymnase est à l'écran (pas en mouvement réduit)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const piece = document.querySelector<HTMLElement>(".piece.gymnase");
      if (!document.hidden && piece?.dataset.visible === "true") smasher();
    }, 5200);
    return () => window.clearInterval(id);
  }, [smasher]);

  return (
    <>
      <ImageSalon nom="gymnase-ciel-jour" boite={BOITES.cielGym} />
      <ImageSalon nom="gymnase-ciel-nuit" boite={BOITES.cielGym} className="nuit-seule" />
      <MeteoFenetre boite={BOITES.cielGym} />
      <ImageSalon nom="gymnase-fond" boite={PLEIN} />
      <Banderole />
      <BanderoleSupporters />
      <TableauScores score={score} />
      <BallonJeu coup={coup} enJeu={enJeu} smasher={smasherAuClic} marquer={marquer} />
      <Filet ouvrir={actions.ouvrir} survoler={actions.survoler} />
      <Joueur coup={coup} enJeu={enJeu} smasher={smasherAuClic} />
      {fete > 0 && <Confettis key={fete} />}

      <div className="voile" aria-hidden />
      <LumieresGymnase />
      <div className="vignette" aria-hidden />
    </>
  );
});
