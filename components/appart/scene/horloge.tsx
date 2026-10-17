import { memo, useRef, useState, useSyncExternalStore } from "react";
import { jouerCarillon } from "../son";
import { Calque, placer, Vue, type Boite } from "./Calque";

/* ───────────────────────────────────────────────────────────────────────
   L'horloge murale du salon, à l'heure de Paris. Les aiguilles tournent en
   CSS (transform seul) : on les cale une fois sur l'heure au chargement,
   puis la carte graphique s'en charge, sans aucun re-rendu.
   Un clic : le carillon sonne et l'horloge dit l'heure (un secret).
   ─────────────────────────────────────────────────────────────────────── */

const C = { x: 1480, y: 300 };
const R = 40;
const B_HORLOGE: Boite = { x: C.x - R - 6, y: C.y - R - 6, w: 2 * R + 12, h: 2 * R + 12 };

/** Secondes écoulées depuis minuit, à Paris (?heure=… avance l'heure, pour essayer) */
function secondesAParis() {
  const morceaux = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const val = (t: string) => Number(morceaux.find((m) => m.type === t)?.value);
  const forcee = Number(new URLSearchParams(window.location.search).get("heure"));
  const heure = new URLSearchParams(window.location.search).has("heure") && forcee >= 0 && forcee < 24 ? forcee : val("hour");
  return heure * 3600 + val("minute") * 60 + val("second");
}

/** Lu une seule fois : ensuite, les animations CSS gardent l'heure */
let depart: number | null = null;
const lireDepart = () => (depart ??= secondesAParis());
const rienAEcouter = () => () => {};

export const Horloge = memo(function Horloge({ trouver }: { trouver: () => void }) {
  const s = useSyncExternalStore(rienAEcouter, lireDepart, () => null);
  const [bulle, setBulle] = useState<{ texte: string; n: number } | null>(null);
  const minuterie = useRef(0);

  const sonner = () => {
    jouerCarillon();
    const secondes = secondesAParis();
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    setBulle((b) => ({ texte: `il est ${h} h ${String(m).padStart(2, "0")}`, n: (b?.n ?? 0) + 1 }));
    window.clearTimeout(minuterie.current);
    minuterie.current = window.setTimeout(() => setBulle(null), 3800);
    trouver();
  };

  return (
    <>
      <button type="button" className="objet" style={placer(B_HORLOGE)} aria-label="L'horloge du salon : quelle heure est-il ?" onClick={sonner}>
        <Vue boite={B_HORLOGE}>
          <circle cx={C.x + 2} cy={C.y + 4} r={R + 3} fill="#2c180c" opacity="0.18" />
          <circle cx={C.x} cy={C.y} r={R + 3} fill="#8a5530" />
          <circle cx={C.x} cy={C.y} r={R} fill="#f6efe4" />
          <circle cx={C.x} cy={C.y} r={R - 2} fill="none" stroke="#dcc9ae" strokeWidth="1" />
          {/* les douze repères, plus marqués à 12, 3, 6 et 9 */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const long = i % 3 === 0 ? 7 : 4;
            return (
              <path
                key={i}
                d={`M${C.x + Math.sin(a) * (R - 5)} ${C.y - Math.cos(a) * (R - 5)} L${C.x + Math.sin(a) * (R - 5 - long)} ${C.y - Math.cos(a) * (R - 5 - long)}`}
                stroke="#3a281d"
                strokeWidth={i % 3 === 0 ? 2.2 : 1.2}
                strokeLinecap="round"
              />
            );
          })}
          <text x={C.x} y={C.y + 17} textAnchor="middle" className="font-main" fontSize="8" fill="#8a5530">
            Villejuif
          </text>
        </Vue>
      </button>

      {/* les aiguilles : calées sur l'heure de Paris dès le premier rendu dans le navigateur */}
      {s !== null && (
        <>
          <Calque boite={B_HORLOGE} className="aiguille aiguille-heures" style={{ animationDelay: `-${s % 43200}s` }}>
            <path d={`M${C.x} ${C.y + 5} L${C.x} ${C.y - 21}`} stroke="#3a281d" strokeWidth="3.4" strokeLinecap="round" />
          </Calque>
          <Calque boite={B_HORLOGE} className="aiguille aiguille-minutes" style={{ animationDelay: `-${s % 3600}s` }}>
            <path d={`M${C.x} ${C.y + 6} L${C.x} ${C.y - 31}`} stroke="#3a281d" strokeWidth="2.2" strokeLinecap="round" />
          </Calque>
          <Calque boite={B_HORLOGE} className="aiguille aiguille-secondes" style={{ animationDelay: `-${s % 60}s` }}>
            <path d={`M${C.x} ${C.y + 9} L${C.x} ${C.y - 33}`} stroke="#c2562f" strokeWidth="1" strokeLinecap="round" />
          </Calque>
        </>
      )}
      <Calque boite={B_HORLOGE}>
        <circle cx={C.x} cy={C.y} r="3" fill="#c2562f" />
      </Calque>

      {/* la bulle : l'horloge dit l'heure */}
      {bulle && (
        <Calque key={bulle.n} boite={{ x: 1360, y: 236, w: 120, h: 40 }} className="bulle-horloge">
          <path d="M1366 240 H1462 Q1468 240 1468 246 V264 Q1468 270 1462 270 H1452 L1446 278 L1442 270 H1366 Q1360 270 1360 264 V246 Q1360 240 1366 240 Z" fill="#fbf7f0" stroke="#d6c4a8" />
          <text x="1414" y="260" textAnchor="middle" className="font-main" fontSize="14" fill="#3a281d">
            {bulle.texte}
          </text>
        </Calque>
      )}
    </>
  );
});
