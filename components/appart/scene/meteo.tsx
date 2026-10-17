import { memo } from "react";
import { placer, type Boite } from "./Calque";

/* ───────────────────────────────────────────────────────────────────────
   La météo de Villejuif, derrière les fenêtres (salon et gymnase).
   Placée sous le mur : elle passe derrière les montants, les rideaux et
   les plantes. Pluie et neige = des tuiles SVG qui défilent en transform
   (carte graphique). Le CSS n'affiche que la météo du moment (data-meteo).
   ─────────────────────────────────────────────────────────────────────── */

const tuile = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const PLUIE_PRES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90"><g stroke="#e3ebff" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round"><line x1="12" y1="4" x2="8" y2="24"/><line x1="44" y1="30" x2="40" y2="50"/><line x1="27" y1="60" x2="23" y2="80"/><line x1="55" y1="70" x2="51" y2="88"/></g></svg>`,
);
const PLUIE_LOIN = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="60"><g stroke="#cfdaf5" stroke-opacity=".45" stroke-width="1" stroke-linecap="round"><line x1="6" y1="2" x2="4" y2="14"/><line x1="26" y1="22" x2="24" y2="34"/><line x1="16" y1="42" x2="14" y2="54"/><line x1="36" y1="8" x2="34" y2="20"/></g></svg>`,
);
const GOUTTES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><g fill="#f4f8ff" fill-opacity=".38"><circle cx="14" cy="18" r="2.6"/><circle cx="70" cy="9" r="1.8"/><circle cx="96" cy="40" r="3"/><circle cx="40" cy="58" r="2"/><circle cx="82" cy="88" r="2.4"/><circle cx="20" cy="96" r="1.6"/><circle cx="58" cy="110" r="2.8"/></g><g fill="#ffffff" fill-opacity=".7"><circle cx="13" cy="17" r=".9"/><circle cx="95" cy="39" r="1"/><circle cx="57" cy="109" r="1"/></g><path d="M96 43 q1 9 -1 16" stroke="#f4f8ff" stroke-opacity=".3" stroke-width="1.6" fill="none"/></svg>`,
);
const NEIGE_PRES = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><g fill="#ffffff" fill-opacity=".85"><circle cx="14" cy="10" r="2.6"/><circle cx="70" cy="34" r="2"/><circle cx="104" cy="70" r="2.8"/><circle cx="40" cy="80" r="2.2"/><circle cx="86" cy="112" r="1.8"/></g></svg>`,
);
const NEIGE_LOIN = tuile(
  `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><g fill="#f2f5ff" fill-opacity=".6"><circle cx="10" cy="14" r="1.3"/><circle cx="50" cy="30" r="1.1"/><circle cx="30" cy="62" r="1.4"/><circle cx="70" cy="70" r="1"/></g></svg>`,
);

export const MeteoFenetre = memo(function MeteoFenetre({ boite, gouttes = false }: { boite: Boite; gouttes?: boolean }) {
  const ici = placer(boite);
  return (
    <>
      {/* nuages bas : le ciel se voile */}
      <div className="calque meteo meteo-gris" style={ici} aria-hidden />
      <div className="calque meteo meteo-pluie" style={ici} aria-hidden>
        <div className="rideau rideau-pluie-loin" style={{ backgroundImage: PLUIE_LOIN }} />
        <div className="rideau rideau-pluie" style={{ backgroundImage: PLUIE_PRES }} />
        {gouttes && <div className="remplir gouttes" style={{ backgroundImage: GOUTTES }} />}
      </div>
      <div className="calque meteo meteo-neige" style={ici} aria-hidden>
        <div className="rideau rideau-neige-loin" style={{ backgroundImage: NEIGE_LOIN }} />
        <div className="rideau rideau-neige" style={{ backgroundImage: NEIGE_PRES }} />
      </div>
      <div className="calque meteo meteo-eclair" style={ici} aria-hidden />
    </>
  );
});
