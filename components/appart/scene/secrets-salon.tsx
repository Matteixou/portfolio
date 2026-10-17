import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { jouerEtoile } from "../son";
import { Calque, placer, Vue, type Boite } from "./Calque";
import salon from "./salon.json";

/* ───────────────────────────────────────────────────────────────────────
   Les secrets du salon (le compteur : components/appart/secrets.ts)
   - la nuit, la lune : une étoile filante traverse le ciel
   - la nuit, la tour Eiffel : elle scintille comme à chaque heure pile
   - le chat : il se réveille quand on s'approche et suit la souris des yeux
   Les boutons sont invisibles : on les trouve en promenant la souris.
   ─────────────────────────────────────────────────────────────────────── */

/** Ce qui se passe dans le ciel est caché derrière les montants et les plantes */
const masque = { ["--masque" as string]: `url(${salon["masque-vitre"]})` } as CSSProperties;

const B_LUNE: Boite = { x: 482, y: 150, w: 52, h: 52 };
const B_TOUR: Boite = { x: 498, y: 380, w: 44, h: 130 };
const B_FILANTE: Boite = { x: 548, y: 112, w: 70, h: 34 };

/* les étincelles du grand scintillement, dans la silhouette de la tour */
const ETINCELLES = Array.from({ length: 42 }, (_, i) => {
  const t = ((i * 37) % 42) / 42;
  const ecart = 1 + t * t * 13;
  return { x: 520 + (((i * 53) % 21) / 10 - 1) * ecart, y: 392 + t * 118, g: i % 3 };
});

export const SecretsDuCiel = memo(function SecretsDuCiel({
  trouverLune,
  trouverTour,
}: {
  trouverLune: () => void;
  trouverTour: () => void;
}) {
  const [filante, setFilante] = useState(0);
  const [scintille, setScintille] = useState(0);
  const minuterie = useRef(0);

  return (
    <>
      <button
        type="button"
        className="objet sans-lueur"
        style={placer(B_LUNE)}
        aria-label="Regarder la lune"
        onClick={() => {
          setFilante((n) => n + 1);
          jouerEtoile();
          trouverLune();
        }}
      >
        <Vue boite={B_LUNE}>
          <circle cx="508" cy="176" r="24" fill="transparent" />
        </Vue>
      </button>
      <button
        type="button"
        className="objet sans-lueur"
        style={placer(B_TOUR)}
        aria-label="Regarder la tour Eiffel"
        onClick={() => {
          setScintille((n) => n + 1);
          window.clearTimeout(minuterie.current);
          minuterie.current = window.setTimeout(() => setScintille(0), 6000);
          trouverTour();
        }}
      >
        <Vue boite={B_TOUR}>
          <path d="M520 380 L540 510 H500 Z" fill="transparent" />
        </Vue>
      </button>

      <div className="fenetre-vue masque-vitre" style={masque} aria-hidden>
        {filante > 0 && (
          <Calque key={filante} boite={B_FILANTE} className="anim-filante">
            <defs>
              <linearGradient id="g-filante" x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0" stopColor="#fff8e6" stopOpacity="0" />
                <stop offset="1" stopColor="#fff8e6" />
              </linearGradient>
            </defs>
            <path d="M550 114 L614 142" stroke="url(#g-filante)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="614" cy="142" r="2.2" fill="#fffdf4" />
          </Calque>
        )}
        {scintille > 0 &&
          [0, 1, 2].map((g) => (
            <Calque key={`${scintille}-${g}`} boite={B_TOUR} className="anim-scintillement" style={{ animationDelay: `${-g * 0.12}s` }}>
              {ETINCELLES.filter((e) => e.g === g).map((e, i) => (
                <circle key={i} cx={e.x} cy={e.y} r="1.5" fill="#fffef6" />
              ))}
            </Calque>
          ))}
      </div>
    </>
  );
});

/* ═══ Le chat qui ouvre un œil… puis les deux ═══════════════════════ */

const B_YEUX: Boite = { x: 234, y: 896, w: 40, h: 20 };
const YEUX = [
  { x: 245, y: 906 },
  { x: 263, y: 905 },
];

export const YeuxChat = memo(function YeuxChat({
  caresses,
  lunettesNoires,
  reveiller,
}: {
  caresses: number;
  /** le chat porte des lunettes de soleil : on ne voit pas ses yeux */
  lunettesNoires: boolean;
  reveiller: () => void;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const pupilles = useRef<(SVGGElement | null)[]>([]);
  const reveil = useRef<(duree: number) => void>(() => {});

  useEffect(() => {
    const el = boite.current;
    const appart = el?.closest<HTMLElement>(".appartement");
    const piece = el?.closest<HTMLElement>(".piece");
    if (!el || !appart || !piece) return;
    let dodo = 0;
    let attente = 0;
    let derniere = -Infinity;
    let regard = { x: 0, y: 0 };

    const viser = (x: number, y: number) => {
      pupilles.current.forEach((p) => p?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`));
    };
    // réveillé pour `duree` ms ; le premier réveil compte comme un secret trouvé
    reveil.current = (duree: number) => {
      if (appart.dataset.chat !== "eveille") {
        appart.dataset.chat = "eveille";
        reveiller();
      }
      window.clearTimeout(dodo);
      dodo = window.setTimeout(() => {
        appart.dataset.chat = "";
        viser(0, 0);
      }, duree);
    };

    // à la souris : il se réveille quand on approche, et suit le pointeur des yeux
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    // la position du chat est gardée en mémoire (relue au plus toutes les
    // 0,8 s) : la relire à chaque mouvement forcerait un calcul de mise en page
    let r: DOMRect | null = null;
    let lu = 0;
    const oublier = () => (r = null);
    const plateau = el.closest(".plateau");
    plateau?.addEventListener("scroll", oublier, { passive: true });
    window.addEventListener("resize", oublier);
    const surBouge = (e: PointerEvent) => {
      if (piece.dataset.visible !== "true" || appart.dataset.cadre === "true") return;
      if (!r || e.timeStamp - lu > 800) {
        r = el.getBoundingClientRect();
        lu = e.timeStamp;
      }
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d > r.width * 4.5) return;
      reveil.current(2600);
      const k = Math.min(1, d / (r.width * 2)) / (d || 1);
      regard = { x: dx * k * 2.4, y: dy * k * 1.3 };
      // des pupilles de quelques pixels : 25 fois par seconde suffisent (à
      // chaque image, le navigateur referait toute une image pour elles)
      if (!attente)
        attente = window.setTimeout(() => {
          attente = 0;
          derniere = performance.now();
          viser(regard.x, regard.y);
        }, Math.max(0, 40 - (performance.now() - derniere)));
    };
    window.addEventListener("pointermove", surBouge, { passive: true });
    return () => {
      window.removeEventListener("pointermove", surBouge);
      plateau?.removeEventListener("scroll", oublier);
      window.removeEventListener("resize", oublier);
      window.clearTimeout(dodo);
      window.clearTimeout(attente);
    };
  }, [reveiller, lunettesNoires]);

  // au doigt : trois caresses le réveillent (il regarde droit devant)
  useEffect(() => {
    if (caresses > 0 && caresses % 3 === 0) reveil.current(3200);
  }, [caresses]);

  if (lunettesNoires) return <div ref={boite} className="calque" style={placer(B_YEUX)} aria-hidden />;
  return (
    <div ref={boite} className="calque yeux-chat" style={placer(B_YEUX)} aria-hidden>
      <Vue boite={B_YEUX}>
        {YEUX.map((o, i) => (
          <g key={i}>
            <ellipse cx={o.x} cy={o.y + 0.5} rx="6" ry="5.2" fill="#e09650" />
            <ellipse cx={o.x} cy={o.y + 1} rx="4.6" ry="4" fill="#d8e27a" />
            <g
              ref={(g) => {
                pupilles.current[i] = g;
              }}
            >
              <ellipse cx={o.x} cy={o.y + 1} rx="1.5" ry="3.2" fill="#1c1a1f" />
              <circle cx={o.x - 1} cy={o.y - 0.6} r="0.8" fill="#fff" />
            </g>
          </g>
        ))}
      </Vue>
    </div>
  );
});
