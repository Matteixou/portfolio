import { memo } from "react";
import { phraseDuLive, stream, type EtatStream } from "@/data/stream";
import { Calque, Halo, placer, Vue, type Boite } from "./Calque";
import { alea } from "./Defs";
import { B_CHAT, B_ECRAN, B_NEON, B_ONAIR, B_PANNEAU, TexteNeon } from "./objets-studio";

/* ───────────────────────────────────────────────────────────────────────
   Le studio : tout ce qui éclaire ou qui bouge (au-dessus du voile de nuit).
   Même règle que le salon : petits calques, transform et opacity seulement.
   ─────────────────────────────────────────────────────────────────────── */

const VENTILOS = [612, 672, 732];

function Ventilo({ cy }: { cy: number }) {
  const boite: Boite = { x: 1286, y: cy - 26, w: 52, h: 52 };
  return (
    <>
      <Calque boite={boite}>
        <circle cx="1312" cy={cy} r="23" fill="#120f16" />
        <circle cx="1312" cy={cy} r="22" fill="none" stroke="#b07cff" strokeWidth="3" />
        <circle cx="1312" cy={cy} r="19" fill="none" stroke="#ff7ab8" strokeWidth="1.5" opacity="0.7" />
      </Calque>
      <Calque boite={boite} className="anim-ventilo">
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            transform={`rotate(${a} 1312 ${cy})`}
            d={`M1312 ${cy} C1316 ${cy - 6} 1322 ${cy - 14} 1316 ${cy - 18} C1310 ${cy - 16} 1308 ${cy - 6} 1312 ${cy} Z`}
            fill="#3a2f4a"
          />
        ))}
        <circle cx="1312" cy={cy} r="4" fill="#d9c2ff" />
      </Calque>
    </>
  );
}

export const LumieresStudio = memo(function LumieresStudio() {
  return (
    <>
      {/* ruban LED sous le plafond, et la lueur derrière les écrans */}
      <div className="led-ruban" style={placer({ x: 0, y: 60, w: 1600, h: 240 })} aria-hidden />
      <Calque boite={{ x: 24, y: 58, w: 1576, h: 8 }}>
        <rect x="24" y="60" width="1576" height="3" fill="#e2d0ff" />
      </Calque>
      <Halo cx={830} cy={470} r={400} className="led" />
      <Halo cx={800} cy={540} r={280} className="ecran" />

      {/* l'enseigne néon */}
      <Halo cx={800} cy={236} r={280} className="neon si-neon" />
      <Calque boite={B_NEON} className="allume si-neon anim-neon">
        <TexteNeon trait="#ff6fb1" coeur="#fff0f7" />
      </Calque>

      {/* la lampe de studio */}
      <Halo cx={490} cy={384} r={320} className="froid si-studio" />
      <Calque boite={B_PANNEAU} className="allume si-studio">
        <g transform="rotate(14 486 380)">
          <rect x="446" y="340" width="80" height="80" rx="4" fill="#fffaf0" />
          <rect x="452" y="346" width="68" height="68" rx="3" fill="#fffdf8" />
        </g>
      </Calque>

      {/* « ON AIR » : seulement pendant le créneau du live */}
      <Halo cx={1088} cy={320} r={100} className="rouge si-live" />
      <Calque boite={B_ONAIR} className="allume si-live">
        <rect x="1048" y="308" width="80" height="24" rx="3" fill="#e5352b" />
        <text x="1088" y="325" textAnchor="middle" className="font-sans" fontSize="13" fontWeight="800" letterSpacing="2" fill="#fff3ec">
          ON AIR
        </text>
      </Calque>

      {/* le PC et ses ventilateurs */}
      <Halo cx={1312} cy={672} r={130} className="led" />
      {VENTILOS.map((cy) => (
        <Ventilo key={cy} cy={cy} />
      ))}
    </>
  );
});

/* ═══ Les écrans : le stream et son chat ═════════════════════════════ */

const hasard = alea(77);
const COULEURS_PSEUDOS = ["#ff7ab8", "#9fd0ff", "#f7c987", "#b6e3a0", "#c9a8ff", "#ffb08a"];
const LIGNES_CHAT = Array.from({ length: 14 }, (_, i) => ({
  y: B_CHAT.y + 10 + i * 12,
  pseudo: 14 + hasard() * 18,
  message: 20 + hasard() * 60,
  couleur: COULEURS_PSEUDOS[Math.floor(hasard() * COULEURS_PSEUDOS.length)],
  coeur: hasard() > 0.75,
}));

function LignesChat({ decalage }: { decalage: number }) {
  return (
    <>
      {LIGNES_CHAT.map((l, i) => (
        <g key={i} transform={`translate(0 ${decalage})`}>
          <circle cx={B_CHAT.x + 9} cy={l.y} r="3" fill={l.couleur} opacity="0.85" />
          <rect x={B_CHAT.x + 15} y={l.y - 2.5} width={l.pseudo} height="5" rx="2.5" fill={l.couleur} />
          <rect
            x={B_CHAT.x + 18 + l.pseudo}
            y={l.y - 2.5}
            width={Math.min(l.message, B_CHAT.w - 26 - l.pseudo)}
            height="5"
            rx="2.5"
            fill="#c9c2d6"
            opacity="0.5"
          />
          {l.coeur && <path d={`M${B_CHAT.x + 106} ${l.y + 3} l-3.5 -3.5 a2 2 0 0 1 3.5 -2.5 a2 2 0 0 1 3.5 2.5 Z`} fill="#ff6f9f" />}
        </g>
      ))}
    </>
  );
}

const raccourcir = (texte: string, n: number) => (texte.length > n ? `${texte.slice(0, n - 1)}…` : texte);

const B_CHAT_DOUBLE: Boite = { x: B_CHAT.x, y: B_CHAT.y, w: B_CHAT.w, h: B_CHAT.h * 2 };

export const EcransStudio = memo(function EcransStudio({ etat }: { etat: EtatStream }) {
  const { x, y, w, h } = B_ECRAN;
  return (
    <>
      <Halo cx={800} cy={493} r={230} className="ecran" />
      <Calque boite={B_ECRAN} className="anim-ecran">
        <defs>
          <linearGradient id="g-ecran-stream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d1533" />
            <stop offset="1" stopColor="#2b1d44" />
          </linearGradient>
          <radialGradient id="g-jeu" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0" stopColor="#ff8a6b" />
            <stop offset="0.45" stopColor="#7a3fb0" />
            <stop offset="1" stopColor="#1b1430" />
          </radialGradient>
        </defs>
        <rect x={x} y={y} width={w} height={h} rx="3" fill="url(#g-ecran-stream)" />
        {/* barre du logiciel de stream */}
        <rect x={x} y={y} width={w} height="14" rx="3" fill="#120e1a" />
        <circle cx={x + 9} cy={y + 7} r="2.5" fill="#ff5f57" />
        <circle cx={x + 17} cy={y + 7} r="2.5" fill="#febc2e" />
        <circle cx={x + 25} cy={y + 7} r="2.5" fill="#28c840" />
        <text x={x + w / 2} y={y + 10} textAnchor="middle" className="font-mono" fontSize="7" fill="#b9aed0">
          {`studio — ${stream.pseudo}`}
        </text>
        {/* l'image du stream */}
        <rect x={x + 10} y={y + 22} width="270" height="152" rx="3" fill="url(#g-jeu)" />
        <g stroke="#fff" strokeWidth="1.6" opacity="0.85">
          <path d={`M${x + 145} ${y + 90} h-8 M${x + 145} ${y + 90} h8 M${x + 145} ${y + 90} v-8 M${x + 145} ${y + 90} v8`} />
        </g>
        <path d={`M${x + 10} ${y + 160} L${x + 70} ${y + 128} L${x + 110} ${y + 150} L${x + 170} ${y + 118} L${x + 280} ${y + 160} V${y + 174} H${x + 10} Z`} fill="#1b1430" opacity="0.8" />
        {/* la webcam, en incrustation */}
        <rect x={x + 214} y={y + 118} width="60" height="50" rx="3" fill="#2a2036" stroke="#c9a8ff" strokeWidth="1.2" />
        <circle cx={x + 244} cy={y + 138} r="9" fill="#e9b48c" />
        <path d={`M${x + 234} ${y + 134} C${x + 234} ${y + 122} ${x + 254} ${y + 122} ${x + 254} ${y + 134}`} fill="#2b1d16" />
        <path d={`M${x + 232} ${y + 140} C${x + 230} ${y + 124} ${x + 258} ${y + 124} ${x + 256} ${y + 140}`} fill="none" stroke="#1b181d" strokeWidth="3" />
        <path d={`M${x + 226} ${y + 168} C${x + 228} ${y + 152} ${x + 260} ${y + 152} ${x + 262} ${y + 168} Z`} fill="#1b181d" />
        {/* statut du live */}
        {etat.enDirect ? (
          <g>
            <rect x={x + 16} y={y + 28} width="62" height="14" rx="3" fill="#e5352b" />
            <circle cx={x + 24} cy={y + 35} r="2.6" fill="#fff" className="anim-direct" />
            <text x={x + 30} y={y + 38.5} className="font-sans" fontSize="8" fontWeight="800" fill="#fff">
              EN DIRECT
            </text>
          </g>
        ) : (
          <g>
            <rect x={x + 16} y={y + 28} width="68" height="14" rx="3" fill="#3a3346" />
            <text x={x + 24} y={y + 38.5} className="font-sans" fontSize="8" fontWeight="800" fill="#d9d2e6">
              HORS LIGNE
            </text>
          </g>
        )}
        {/* colonne de droite : le programme */}
        <text x={x + 292} y={y + 34} className="font-main" fontSize="16" fill="#ffd1e6">
          {stream.pseudo}
        </text>
        <g className="font-sans" fontSize="7.5" fill="#cfc4e3">
          {stream.contenus.slice(0, 4).map((c, i) => (
            <text key={c} x={x + 292} y={y + 54 + i * 12}>
              {`· ${c}`}
            </text>
          ))}
        </g>
        {/* en live : le jeu du moment (statut Twitch réel) ; sinon, les horaires */}
        <text x={x + 292} y={y + 120} className="font-sans" fontSize="7.5" fontWeight="700" fill="#f7c987">
          {etat.reel && etat.enDirect ? "EN CE MOMENT" : "LE WEEK-END"}
        </text>
        <text x={x + 292} y={y + 131} className="font-sans" fontSize="7.5" fill="#f7c987">
          {etat.reel && etat.enDirect ? raccourcir(etat.jeu ?? "En direct", 17) : "21 h – minuit"}
        </text>
        {/* bandeau du bas */}
        <rect x={x} y={y + h - 26} width={w} height="26" fill="#120e1a" />
        <text x={x + 12} y={y + h - 10} className="font-sans" fontSize="9" fill="#efe8fa">
          {phraseDuLive(etat)}
        </text>
        <text x={x + w - 12} y={y + h - 10} textAnchor="end" className="font-mono" fontSize="8" fill="#c9a8ff">
          {stream.displayUrl}
        </text>
        <rect x={x} y={y} width={w} height={h} rx="3" fill="url(#p-lignes-tv)" opacity="0.18" />
      </Calque>

      {/* le chat, qui défile doucement */}
      <div className="calque ecran-chat" style={placer(B_CHAT)} aria-hidden>
        <div className="chat-defile">
          <Vue boite={B_CHAT_DOUBLE}>
            <rect x={B_CHAT.x} y={B_CHAT.y} width={B_CHAT.w} height={B_CHAT.h * 2} fill="#141019" />
            <LignesChat decalage={0} />
            <LignesChat decalage={B_CHAT.h} />
          </Vue>
        </div>
      </div>
    </>
  );
});
