"use client";

import { ArrowLeft, ArrowRight, Check, Guitar, Sparkles, Timer, Volume2, VolumeX, Hand, StickyNote, Mail, MonitorPlay, Moon, Smile, Sun, Tv, Volleyball, Wrench, X, Image as Affiche } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useRef, useState, type MouseEvent } from "react";
import { krylos } from "@/data/krylos";
import { LIBELLES, type Meteo } from "@/lib/meteo";
import { moi } from "@/data/moi";
import { LIEUX, lieux, PIECES, type LieuId, type PieceId } from "./lieux";
import { oublierSecrets, SECRETS, useSecrets } from "./secrets";

/* ───────────────────────────────────────────────────────────────────────
   Ce qui flotte au-dessus de la scène : le mot d'accueil, l'interrupteur
   jour / nuit et le plan de l'appartement (la navigation).
   ─────────────────────────────────────────────────────────────────────── */

export function Accueil({ cache, plie, setPlie }: { cache: boolean; plie: boolean; setPlie: (p: boolean) => void }) {
  return (
    <div
      className="hud pointer-events-none fixed top-3 left-3 z-10 w-[min(350px,calc(100vw-5.5rem))] min-[900px]:top-5 min-[900px]:left-5"
      data-cache={cache}
    >
      <div
        className="papier pointer-events-auto relative -rotate-[1.2deg] rounded-[20px] p-4 min-[900px]:p-6"
        hidden={plie}
      >
        <span aria-hidden className="absolute -top-2.5 left-8 h-5 w-20 rotate-[-4deg] rounded-sm bg-[#f3e2bf]/85 shadow-sm" />
        <button
          type="button"
          onClick={() => setPlie(true)}
          aria-label="Replier le mot d'accueil"
          className="absolute top-2 right-2 grid size-9 place-items-center rounded-full text-moka transition hover:bg-lin min-[900px]:hidden"
        >
          <X className="size-4" aria-hidden />
        </button>
        <p className="font-main text-xl leading-none text-brique min-[900px]:text-2xl">Bienvenue chez</p>
        <h1 className="mt-1 font-serif text-[1.75rem] leading-[1.05] font-medium tracking-tight text-espresso min-[900px]:text-[2.4rem]">
          {moi.name}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-moka min-[900px]:mt-3 min-[900px]:text-[0.95rem]">
          Co-fondateur de{" "}
          <a href={krylos.url} target="_blank" rel="noopener noreferrer" className="lien">
            Krylos
          </a>
          , agence web à Villejuif, et étudiant en développement web.
        </p>
        <p className="mt-2 flex items-center gap-2 font-main text-lg leading-tight text-olive min-[900px]:mt-3 min-[900px]:text-xl">
          <Hand className="size-4 shrink-0 -rotate-12" aria-hidden />
          Faites comme chez vous : touchez les objets.
        </p>
        {/* pour les visiteurs pressés : tout le portfolio sur une fiche */}
        <Link
          href="/en-bref"
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-creme transition hover:bg-moka min-[900px]:mt-4"
        >
          <Timer className="size-4" aria-hidden />
          Pressé ? Le résumé en 30 s
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      {plie && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlie(false)}
            className="papier pointer-events-auto rounded-full px-4 py-2 font-serif text-base text-espresso"
          >
            {moi.name}
          </button>
          <Link
            href="/en-bref"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-espresso px-3.5 py-2 text-sm font-semibold text-creme"
          >
            <Timer className="size-4" aria-hidden />
            En bref
          </Link>
        </div>
      )}
    </div>
  );
}

export function Interrupteur({
  nuit,
  meteo,
  onBasculer,
  className = "",
}: {
  nuit: boolean;
  meteo: Meteo | null;
  onBasculer: () => void;
  className?: string;
}) {
  return (
    <div className={`pointer-events-auto ${className}`}>
      <button
        type="button"
        onClick={onBasculer}
        aria-pressed={nuit}
        aria-label={nuit ? "Revenir au coucher du soleil" : "Faire tomber la nuit"}
        className="papier group flex items-center gap-3 rounded-2xl p-2 pr-2 min-[900px]:pr-4"
      >
        {/* la plaque de l'interrupteur */}
        <span className="relative grid h-14 w-10 place-items-center rounded-lg border border-sable bg-[#f9f4ec] shadow-inner">
          <span className="relative h-9 w-4 rounded-full bg-[#e9dcc7] shadow-[inset_0_1px_3px_rgb(0_0_0/0.25)]">
            <span
              className="interrupteur-levier absolute left-0.5 size-3 rounded-full bg-espresso shadow"
              style={{ transform: nuit ? "translateY(22px)" : "translateY(2px)" }}
            />
          </span>
          <span aria-hidden className="absolute top-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sable" />
          <span aria-hidden className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-sable" />
        </span>
        <span className="hidden text-left min-[900px]:block">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-espresso">
            {nuit ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
            {nuit ? "La nuit" : "Le soir"}
          </span>
          <span className="block font-main text-lg leading-none text-cognac">
            {nuit ? "rallumer le soleil" : "faire tomber la nuit"}
          </span>
          {meteo && (
            <span className="mt-1 block text-xs text-moka">
              Villejuif{meteo.temperature !== null ? ` · ${meteo.temperature}°` : ""} · {LIBELLES[meteo.temps]}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}

const ICONES: Record<LieuId, typeof Tv> = {
  realisations: Tv,
  krylos: Affiche,
  atelier: Wrench,
  "a-propos": Smile,
  contact: Mail,
  stream: MonitorPlay,
  volley: Volleyball,
  musique: Guitar,
  "livre-dor": StickyNote,
};

/** Libellés courts du plan, pour que tout tienne sur un téléphone */
const COURT: Record<LieuId, string> = {
  realisations: "Projets",
  krylos: "Krylos",
  atelier: "Atelier",
  "a-propos": "Moi",
  contact: "Contact",
  stream: "Stream",
  volley: "Volley",
  musique: "Musique",
  "livre-dor": "Post-it",
};

export const Plan = memo(function Plan({
  cache,
  live,
  onOuvrir,
  onSurvoler,
}: {
  cache: boolean;
  /** Matthieu est vraiment en live sur Twitch */
  live: boolean;
  onOuvrir: (id: LieuId) => void;
  onSurvoler: (id: LieuId | null) => void;
}) {
  return (
    <nav
      aria-label="Plan de l'appartement"
      className="hud pointer-events-none fixed inset-x-0 bottom-3 z-10 flex justify-center px-3 min-[900px]:bottom-5"
      data-cache={cache}
    >
      <ul className="papier pointer-events-auto flex w-full max-w-max justify-between gap-0.5 overflow-x-auto rounded-[22px] p-1.5 [scrollbar-width:none] min-[1280px]:gap-1 min-[1280px]:rounded-full">
        {LIEUX.map((id) => {
          const Icone = ICONES[id];
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-haspopup="dialog"
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  onOuvrir(id);
                }}
                onPointerEnter={() => onSurvoler(id)}
                onPointerLeave={() => onSurvoler(null)}
                onFocus={() => onSurvoler(id)}
                onBlur={() => onSurvoler(null)}
                className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-0.5 py-1.5 min-[900px]:px-2 text-espresso transition hover:bg-lin min-[1280px]:flex-row min-[1280px]:gap-2 min-[1280px]:rounded-full min-[1280px]:px-4"
              >
                <span className="relative">
                  <Icone className="size-[18px] shrink-0 text-brique" aria-hidden />
                  {live && id === "stream" && (
                    <span className="anim-direct absolute -top-1 -right-1.5 size-2.5 rounded-full bg-[#e5352b] ring-2 ring-creme" aria-hidden />
                  )}
                </span>
                <span className="text-[10px] leading-tight font-semibold whitespace-nowrap min-[900px]:text-xs min-[1280px]:hidden">{COURT[id]}</span>
                <span className="hidden text-sm leading-tight font-semibold whitespace-nowrap min-[1280px]:inline">{lieux[id].titre}</span>
                {live && id === "stream" && <span className="sr-only"> (en direct)</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

/* Quand Matthieu est vraiment en live sur Twitch : une pastille sous
   l'interrupteur, qui ouvre le panneau du stream. */
export function EnDirect({ live, jeu, onOuvrir }: { live: boolean; jeu?: string; onOuvrir: () => void }) {
  if (!live) return null;
  return (
    <div className="pointer-events-auto">
      <button
        type="button"
        onClick={onOuvrir}
        aria-label={`En live sur Twitch${jeu ? ` : ${jeu}` : ""}. Ouvrir le stream`}
        className="papier entree flex items-center gap-2 rounded-full py-1.5 pr-2.5 pl-2 text-sm font-semibold text-espresso min-[900px]:max-w-xs min-[900px]:pr-3.5 min-[900px]:pl-2.5"
      >
        <span className="anim-direct size-2.5 shrink-0 rounded-full bg-[#e5352b]" aria-hidden />
        {/* sur mobile, juste « Live » : le mot d'accueil occupe la largeur */}
        <span className="min-[900px]:hidden">Live</span>
        <span className="hidden truncate min-[900px]:inline">En live{jeu ? ` · ${jeu}` : " sur Twitch"}</span>
      </button>
    </div>
  );
}

/* Le passage vers la pièce voisine : une flèche sur le bord de l'écran.
   Sur ordinateur, en bas (libellé à partir de 1500 px) ; sur mobile, une
   pastille au milieu du bord. */
const NOMS: Record<PieceId, { nom: string; mot: string }> = {
  gymnase: { nom: "Le gymnase", mot: "un match de volley ?" },
  salon: { nom: "Le salon", mot: "retour au calme" },
  studio: { nom: "Le studio", mot: "le stream, c'est par là" },
};

export const Passage = memo(function Passage({
  piece,
  sens,
  onAller,
  cache,
}: {
  piece: PieceId;
  sens: "gauche" | "droite";
  onAller: (p: PieceId) => void;
  cache: boolean;
}) {
  const voisine = PIECES[PIECES.indexOf(piece) + (sens === "droite" ? 1 : -1)];
  if (!voisine) return null;
  const { nom, mot } = NOMS[voisine];
  const droite = sens === "droite";
  return (
    <button
      type="button"
      onClick={() => onAller(voisine)}
      data-cache={cache}
      className={`hud papier group fixed top-1/2 z-10 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center gap-2 rounded-full p-2.5 text-espresso transition hover:bg-lin min-[900px]:top-auto min-[900px]:bottom-5 min-[900px]:translate-y-0 min-[1500px]:py-2 ${
        droite ? "right-2 min-[900px]:right-5 min-[1500px]:pr-3 min-[1500px]:pl-4" : "left-2 min-[900px]:left-5 min-[1500px]:pr-4 min-[1500px]:pl-3"
      }`}
      aria-label={droite ? `Aller à droite : ${nom.toLowerCase()}` : `Aller à gauche : ${nom.toLowerCase()}`}
    >
      {!droite && <ArrowLeft className="size-5 text-brique transition group-hover:-translate-x-0.5" aria-hidden />}
      <span className="hidden text-left min-[1500px]:block">
        <span className="block text-sm font-semibold">{nom}</span>
        <span className="block font-main text-lg leading-none text-cognac">{mot}</span>
      </span>
      {droite && <ArrowRight className="size-5 text-brique transition group-hover:translate-x-0.5" aria-hidden />}
    </button>
  );
});

/* ─── L'ambiance sonore : un bouton, à côté de l'interrupteur ─── */

export function BoutonSon({ actif, onBasculer, className = "" }: { actif: boolean; onBasculer: () => void; className?: string }) {
  const titre = actif ? "Couper l'ambiance sonore" : "Écouter l'ambiance de l'appart";
  return (
    <button
      type="button"
      onClick={onBasculer}
      aria-pressed={actif}
      aria-label={titre}
      title={titre}
      className={`papier pointer-events-auto grid size-11 place-items-center rounded-full text-espresso transition hover:bg-lin ${className}`}
    >
      {actif ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5 text-moka" aria-hidden />}
    </button>
  );
}

/* ─── Les secrets : le compteur, et la liste des indices ─── */

export function CompteurSecrets() {
  const { trouves } = useSecrets();
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);
  const n = trouves.length;

  // un clic ailleurs ou Échap referment la liste
  useEffect(() => {
    if (!ouvert) return;
    const ailleurs = (e: PointerEvent) => {
      if (!zone.current?.contains(e.target as Node)) setOuvert(false);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("pointerdown", ailleurs);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("pointerdown", ailleurs);
      document.removeEventListener("keydown", echap);
    };
  }, [ouvert]);

  return (
    <div ref={zone} className="pointer-events-auto relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls="liste-secrets"
        aria-label={`Secrets trouvés : ${n} sur ${SECRETS.length}`}
        className="papier flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-espresso"
      >
        <Sparkles className="size-4 text-brique" aria-hidden />
        <span className="min-[900px]:hidden">
          {n}/{SECRETS.length}
        </span>
        <span className="hidden min-[900px]:inline">
          {n} secret{n > 1 ? "s" : ""} sur {SECRETS.length}
        </span>
      </button>
      {ouvert && (
        <div id="liste-secrets" className="papier entree absolute top-full right-0 mt-2 w-[min(310px,calc(100vw-1.5rem))] rounded-2xl p-4 text-left">
          <p className="font-main text-xl leading-none text-brique">les secrets de l&apos;appart</p>
          <p className="mt-1 text-sm text-espresso">
            {n === SECRETS.length ? "Tous trouvés : vous connaissez l'appart mieux que moi !" : `${n} sur ${SECRETS.length} trouvés. Un indice pour les autres :`}
          </p>
          <ul className="mt-3 space-y-2">
            {SECRETS.map((s) =>
              trouves.includes(s.id) ? (
                <li key={s.id} className="flex items-start gap-2 text-sm font-semibold text-espresso">
                  <Check className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden />
                  {s.nom}
                </li>
              ) : (
                <li key={s.id} className="flex items-start gap-2 text-sm text-moka">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-moka/40 text-[10px] font-bold" aria-hidden>
                    ?
                  </span>
                  <span className="italic">{s.indice}</span>
                </li>
              ),
            )}
          </ul>
          {n > 0 && (
            <button type="button" onClick={oublierSecrets} className="mt-3 min-h-8 text-xs text-moka underline underline-offset-4">
              Tout recommencer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** L'annonce d'un secret trouvé (et sa version pour les lecteurs d'écran) */
export function AnnonceSecret() {
  const { trouves, dernier } = useSecrets();
  const secret = dernier && SECRETS.find((s) => s.id === dernier.id);
  const tous = trouves.length === SECRETS.length;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[6.4rem] z-[35] flex justify-center px-3 min-[900px]:top-5 min-[900px]:bottom-auto"
      role="status"
    >
      {secret && dernier && (
        <p key={dernier.n} className="annonce-secret papier flex items-center gap-2 rounded-full px-4 py-2 text-sm text-espresso">
          <Sparkles className="size-4 shrink-0 text-brique" aria-hidden />
          {tous ? (
            <span>
              <strong className="font-semibold">Bravo !</strong> Les {SECRETS.length} secrets sont trouvés.
            </span>
          ) : (
            <span>
              Secret trouvé : <strong className="font-semibold">{secret.nom}</strong> · {trouves.length}/{SECRETS.length}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
