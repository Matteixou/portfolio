import { memo, type MouseEvent } from "react";
import { volley } from "@/data/volley";
import { lieux } from "../lieux";
import { Calque, placer, Vue, type Boite } from "./Calque";
import { Ballon, CLUB } from "./decor-gymnase";
import type { ActionsScene } from "./types";

/* ───────────────────────────────────────────────────────────────────────
   Le gymnase : les objets qu'on touche.
   - le filet (ouvre le panneau « Le volley »)
   - le petit joueur et son ballon : un clic, il saute et smashe,
     un point de plus pour l'Efrei au tableau
   - le tableau des scores, la banderole du club, celle des supporters
   Toutes les animations sont en transform (carte graphique).
   ─────────────────────────────────────────────────────────────────────── */

const B_FILET: Boite = { x: 300, y: 440, w: 1000, h: 384 };

export const Filet = memo(function Filet({ ouvrir, survoler }: Pick<ActionsScene, "ouvrir" | "survoler">) {
  const lieu = lieux.volley;
  return (
    <a
      href="#volley"
      className="objet"
      data-lieu="volley"
      style={placer(B_FILET)}
      aria-label={`${lieu.objet} : ${lieu.titre}`}
      aria-haspopup="dialog"
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        ouvrir("volley");
      }}
      onPointerEnter={() => survoler("volley")}
      onPointerLeave={() => survoler(null)}
      onFocus={() => survoler("volley")}
      onBlur={() => survoler(null)}
    >
      <Vue boite={B_FILET}>
        {/* poteaux et leurs protections aux couleurs du club */}
        {[320, 1280].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="814" rx="26" ry="6" fill="#2c180c" opacity="0.3" />
            <rect x={x - 6} y="478" width="12" height="336" rx="3" fill="#3a3330" />
            <rect x={x - 12} y="600" width="24" height="196" rx="8" fill={CLUB.marine} />
            <rect x={x - 12} y="640" width="24" height="12" fill={CLUB.ciel} />
            <rect x={x - 12} y="600" width="24" height="10" rx="4" fill={CLUB.ciel} />
          </g>
        ))}
        <path d="M326 504 H343 M1257 504 H1274 M326 596 H343 M1257 596 H1274" stroke="#2a2420" strokeWidth="2.5" />
        <rect x="343" y="508" width="914" height="88" fill="url(#p-filet)" />
        <rect x="343" y="500" width="914" height="9" fill={CLUB.blanc} />
        <rect x="343" y="595" width="914" height="5" fill={CLUB.blanc} />
        <rect x="343" y="500" width="6" height="100" fill={CLUB.blanc} />
        <rect x="1251" y="500" width="6" height="100" fill={CLUB.blanc} />
        {[356, 1244].map((x) => (
          <g key={x}>
            <path d={`M${x} 452 V600`} stroke="#c8302a" strokeWidth="4" strokeDasharray="9 9" />
            <path d={`M${x} 461 V600`} stroke={CLUB.blanc} strokeWidth="4" strokeDasharray="9 9" />
          </g>
        ))}
      </Vue>
    </a>
  );
});

/* ─── Le petit joueur (Matthieu, de dos, maillot du club) ──────────── */

const B_JOUEUR: Boite = { x: 400, y: 560, w: 140, h: 300 };
const B_OMBRE: Boite = { x: 430, y: 840, w: 80, h: 16 };
/** l'épaule du bras qui frappe, en % de la boîte du joueur */
const EPAULE = "70% 36%";
const PEAU = "#d9a07a";

function Corps() {
  return (
    <>
      {/* chaussures, chaussettes, jambes, genouillères */}
      <rect x="448" y="836" width="20" height="12" rx="4" fill="#1b181d" />
      <rect x="474" y="836" width="20" height="12" rx="4" fill="#1b181d" />
      <rect x="448" y="845" width="20" height="3" fill={CLUB.ciel} />
      <rect x="474" y="845" width="20" height="3" fill={CLUB.ciel} />
      <rect x="452" y="760" width="13" height="78" rx="5" fill={PEAU} />
      <rect x="478" y="760" width="13" height="78" rx="5" fill={PEAU} />
      <rect x="451" y="818" width="15" height="19" rx="3" fill={CLUB.blanc} />
      <rect x="477" y="818" width="15" height="19" rx="3" fill={CLUB.blanc} />
      <rect x="450" y="788" width="17" height="15" rx="5" fill={CLUB.nuit} />
      <rect x="476" y="788" width="17" height="15" rx="5" fill={CLUB.nuit} />
      {/* short */}
      <path d="M441 726 H499 L497 770 H474 L471 752 L468 770 H445 Z" fill={CLUB.nuit} />
      {/* bras gauche, détendu */}
      <path d="M440 668 C430 690 426 712 428 742" fill="none" stroke={PEAU} strokeWidth="11" strokeLinecap="round" />
      <path d="M441 664 C434 674 431 684 430 692" fill="none" stroke={CLUB.ciel} strokeWidth="14" strokeLinecap="round" />
      {/* maillot : marine, côtés bleu ciel, n° 1 et le prénom dans le dos */}
      <path d="M440 662 C440 652 450 648 470 648 C490 648 500 652 500 662 L504 734 H436 Z" fill={CLUB.marine} />
      <path d="M440 662 L436 734 H446 L448 664 Z M500 662 L504 734 H494 L492 664 Z" fill={CLUB.ciel} />
      <text x="470" y="678" textAnchor="middle" className="font-sans" fontSize="7" fontWeight="800" letterSpacing="1" fill={CLUB.glacier}>
        MATTHIEU
      </text>
      <text x="470" y="716" textAnchor="middle" className="font-sans" fontSize="34" fontWeight="800" fill={CLUB.ciel}>
        1
      </text>
      {/* cou, oreilles, cheveux bouclés */}
      <rect x="463" y="638" width="14" height="14" rx="4" fill={PEAU} />
      <circle cx="451" cy="628" r="4.5" fill={PEAU} />
      <circle cx="489" cy="628" r="4.5" fill={PEAU} />
      <circle cx="470" cy="624" r="20" fill="#2b1d16" />
      <g fill="#2b1d16">
        {[
          [452, 612],
          [462, 604],
          [474, 603],
          [486, 610],
          [491, 620],
          [449, 622],
          [466, 640],
          [478, 638],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="7" />
        ))}
      </g>
      <path d="M458 610 q4 -4 8 0 M474 612 q4 -4 8 0" fill="none" stroke="#4a3426" strokeWidth="1.6" />
    </>
  );
}

function BrasFrappeur() {
  return (
    <>
      <path d="M498 668 C504 690 504 720 502 752" fill="none" stroke={PEAU} strokeWidth="11" strokeLinecap="round" />
      <path d="M499 664 C504 674 505 684 505 692" fill="none" stroke={CLUB.ciel} strokeWidth="14" strokeLinecap="round" />
      <circle cx="502" cy="757" r="7" fill={PEAU} />
    </>
  );
}

export const Joueur = memo(function Joueur({ coup, enJeu, smasher }: { coup: number; enJeu: boolean; smasher: () => void }) {
  return (
    <button type="button" className="objet" style={placer(B_JOUEUR)} aria-label="Faire smasher le joueur" aria-disabled={enJeu} onClick={smasher}>
      <span
        key={`o${coup}`}
        className={`morceau ${enJeu ? "anim-ombre-saut" : ""}`}
        style={{
          left: `${((B_OMBRE.x - B_JOUEUR.x) / B_JOUEUR.w) * 100}%`,
          top: `${((B_OMBRE.y - B_JOUEUR.y) / B_JOUEUR.h) * 100}%`,
          width: `${(B_OMBRE.w / B_JOUEUR.w) * 100}%`,
          height: `${(B_OMBRE.h / B_JOUEUR.h) * 100}%`,
        }}
        aria-hidden
      >
        <Vue boite={B_OMBRE}>
          <ellipse cx="470" cy="848" rx="34" ry="6" fill="#0b0f24" opacity="0.35" />
        </Vue>
      </span>
      <span key={`s${coup}`} className={`morceau ${enJeu ? "anim-saut" : "anim-pret"}`} style={{ inset: 0, transformOrigin: "50% 100%" }} aria-hidden>
        <Vue boite={B_JOUEUR}>
          <Corps />
        </Vue>
        <span className={`morceau ${enJeu ? "anim-frappe" : ""}`} style={{ inset: 0, transformOrigin: EPAULE }}>
          <Vue boite={B_JOUEUR}>
            <BrasFrappeur />
          </Vue>
        </span>
      </span>
    </button>
  );
});

/* ─── Le ballon, en l'air au-dessus du joueur (passe derrière le filet) ── */

const B_BALLON: Boite = { x: 472, y: 432, w: 56, h: 56 };

export const BallonJeu = memo(function BallonJeu({
  coup,
  enJeu,
  smasher,
  marquer,
}: {
  coup: number;
  enJeu: boolean;
  smasher: () => void;
  marquer: () => void;
}) {
  return (
    <div className="objet" style={placer(B_BALLON)} onClick={smasher} aria-hidden>
      <span
        key={coup}
        className={`morceau ${enJeu ? "anim-smash" : "anim-flotte"}`}
        style={{ inset: 0 }}
        onAnimationEnd={(e) => {
          if (enJeu && e.animationName === "smash") marquer();
        }}
      >
        <Vue boite={B_BALLON}>
          <Ballon cx={500} cy={460} r={24} />
        </Vue>
      </span>
    </div>
  );
});

/* ─── Le tableau des scores ─────────────────────────────────────────── */

export const TableauScores = memo(function TableauScores({ score }: { score: number }) {
  const boite: Boite = { x: 1166, y: 358, w: 288, h: 104 };
  const set = score >= volley.pointsDuSet;
  return (
    <Calque boite={boite}>
      <rect x="1176" y="368" width="276" height="92" rx="6" fill="#140c08" opacity="0.3" />
      <rect x="1170" y="362" width="276" height="92" rx="6" fill="#16141c" />
      <rect x="1178" y="370" width="260" height="76" rx="3" fill="#0b0f24" />
      <g className="font-sans" fontWeight="800" fontSize="11" letterSpacing="1.5" fill="#cfd8e6" textAnchor="middle">
        <text x="1236" y="388">
          {volley.equipe}
        </text>
        <text x="1380" y="388">
          {volley.adversaire}
        </text>
        <text x="1308" y="388" fill={CLUB.ciel}>
          {set ? "SET !" : "SET 1"}
        </text>
      </g>
      <g className="font-mono" fontWeight="700" fontSize="34" textAnchor="middle">
        <text x="1236" y="432" fill={CLUB.ciel}>
          {String(Math.min(score, volley.pointsDuSet)).padStart(2, "0")}
        </text>
        <text x="1380" y="432" fill="#ff8a3d" opacity="0.85">
          00
        </text>
        <text x="1308" y="428" fill="#5c5566" fontSize="22">
          :
        </text>
      </g>
    </Calque>
  );
});

/* ─── La banderole du club, avec son logo ───────────────────────────── */

export const Banderole = memo(function Banderole() {
  const boite: Boite = { x: 556, y: 352, w: 490, h: 116 };
  return (
    <Calque boite={boite}>
      <path d="M570 368 H1040 L1030 452 Q805 464 580 452 Z" fill="#140c08" opacity="0.22" transform="translate(5 6)" />
      <path d="M566 362 H1036 L1028 446 Q801 458 574 446 Z" fill={CLUB.marine} />
      <path d="M566 362 H1036 V371 H566 Z" fill={CLUB.ciel} />
      <path d="M574 440 Q801 452 1028 440" fill="none" stroke={CLUB.ciel} strokeWidth="3" />
      {[580, 801, 1022].map((x) => (
        <circle key={x} cx={x} cy="367" r="3.5" fill={CLUB.blanc} />
      ))}
      <image href={volley.logo} x="584" y="358" width="94" height="94" preserveAspectRatio="xMidYMid meet" />
      <text x="850" y="411" textAnchor="middle" className="font-serif" fontSize="34" fontWeight="700" letterSpacing="4" fill={CLUB.blanc}>
        {volley.club.toUpperCase()}
      </text>
      <text x="850" y="436" textAnchor="middle" className="font-main" fontSize="19" fill={CLUB.ciel}>
        {volley.handle}
      </text>
    </Calque>
  );
});

/* ─── La banderole peinte des supporters, sur les gradins ──────────── */

export const BanderoleSupporters = memo(function BanderoleSupporters() {
  const boite: Boite = { x: 34, y: 684, w: 306, h: 66 };
  return (
    <Calque boite={boite}>
      <g transform="rotate(-2 187 717)">
        <path d="M40 692 H334 L330 744 Q187 750 44 744 Z" fill={CLUB.blanc} />
        <path d="M40 692 H334" stroke={CLUB.ciel} strokeWidth="4" />
        <text x="187" y="731" textAnchor="middle" className="font-main" fontSize="34" fontWeight="700" fill={CLUB.marine}>
          Allez l&apos;Efrei !
        </text>
        <path d="M70 738 q30 6 60 0 M244 738 q30 6 60 0" fill="none" stroke={CLUB.ciel} strokeWidth="3" strokeLinecap="round" />
      </g>
    </Calque>
  );
});
