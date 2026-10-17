"use client";

import { ChevronDown, Disc3, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { disques } from "@/data/musique";
import { chargerSpotify, type ControleurSpotify } from "./spotify";

/* ───────────────────────────────────────────────────────────────────────
   Le petit lecteur qui apparaît quand la platine du salon joue.
   - Spotify : les artistes de data/musique.ts, un disque à la fois ; la
     platine fait play / pause et le vinyle tourne quand la musique joue
   - si Spotify ne se charge pas (hors ligne, bloqueur) : la boucle lo-fi
     synthétisée prend le relais
   Il reste affiché d'une pièce à l'autre : la musique continue. On peut
   le replier sans couper le son.
   ─────────────────────────────────────────────────────────────────────── */

export type Ecoute = "off" | "lofi" | "spotify";

export default function Lecteur({
  ecoute,
  disque,
  joue,
  bascule,
  onLecture,
  onChoisir,
  onEchec,
  onFermer,
}: {
  ecoute: Ecoute;
  /** le disque choisi (index dans `disques`) */
  disque: number;
  joue: boolean;
  /** incrémenté à chaque clic sur la platine : lecture / pause */
  bascule: number;
  onLecture: (joue: boolean) => void;
  onChoisir: (disque: number) => void;
  onEchec: () => void;
  onFermer: () => void;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const controleur = useRef<ControleurSpotify | null>(null);
  const disqueCharge = useRef(disque);
  const aLancer = useRef(false);
  const [replie, setReplie] = useState(false);

  // Changer de disque : le lecteur charge l'artiste puis le lance
  // (déclaré avant la création du lecteur, qui lit le disque à jour)
  useEffect(() => {
    if (disqueCharge.current === disque) return;
    disqueCharge.current = disque;
    const c = controleur.current;
    if (!c) return;
    aLancer.current = true;
    c.loadUri(disques[disque].uri);
  }, [disque]);

  // Le lecteur Spotify n'est chargé qu'au premier lancement de la platine
  useEffect(() => {
    if (ecoute !== "spotify") return;
    const hote = cadre.current;
    if (!hote) return;
    let annule = false;
    const cible = document.createElement("div");
    hote.appendChild(cible);
    aLancer.current = true;
    chargerSpotify()
      .then((api) => {
        if (annule) return;
        api.createController(cible, { uri: disques[disqueCharge.current].uri, width: "100%", height: 80 }, (c) => {
          if (annule) return c.destroy();
          controleur.current = c;
          c.addListener("ready", () => {
            if (!aLancer.current) return;
            aLancer.current = false;
            c.play();
          });
          c.addListener("playback_update", (e) => onLecture(!e.data.isPaused));
        });
      })
      .catch(() => {
        if (!annule) onEchec();
      });
    return () => {
      annule = true;
      controleur.current?.destroy();
      controleur.current = null;
      hote.replaceChildren();
    };
  }, [ecoute, onLecture, onEchec]);

  // Un clic sur la platine met en pause ou relance
  useEffect(() => {
    if (bascule > 0) controleur.current?.togglePlay();
  }, [bascule]);

  if (ecoute === "off") return null;

  return (
    <div
      className="papier fixed inset-x-3 bottom-[5.6rem] z-[25] rounded-2xl p-3 min-[900px]:inset-x-auto min-[900px]:bottom-24 min-[900px]:left-5 min-[900px]:w-[340px]"
      role="region"
      aria-label="La platine du salon"
    >
      <div className="flex items-center gap-3">
        <Disc3
          className={`size-5 shrink-0 text-brique [animation-duration:2.4s] ${joue ? "animate-spin" : ""}`}
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-sm leading-tight text-espresso" aria-live="polite">
          {ecoute === "spotify" ? (
            <>
              <span className="block text-xs text-moka">Sur la platine du salon</span>
              <span className="block truncate font-semibold">
                {disques[disque].nom}
                {disques[disque].titre && <span className="font-normal"> · {disques[disque].titre}</span>}
              </span>
            </>
          ) : (
            <>
              <span className="block font-semibold">Une boucle lo-fi, composée en direct</span>
              <span className="block text-xs text-moka">Spotify ne répond pas : place à la musique maison.</span>
            </>
          )}
        </p>
        {ecoute === "spotify" && (
          <button
            type="button"
            onClick={() => setReplie((r) => !r)}
            aria-expanded={!replie}
            aria-label={replie ? "Déplier le lecteur" : "Replier le lecteur"}
            className="grid size-9 shrink-0 place-items-center rounded-full text-moka transition hover:bg-lin"
          >
            <ChevronDown className={`size-4 transition-transform ${replie ? "rotate-180" : ""}`} aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={onFermer}
          aria-label="Arrêter la musique"
          className="grid size-9 shrink-0 place-items-center rounded-full text-moka transition hover:bg-lin"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      {/* replié, le lecteur reste en place (hauteur nulle) : la musique continue */}
      {ecoute === "spotify" && (
        <div className={replie ? "h-0 overflow-hidden" : ""} inert={replie}>
          <div role="group" aria-label="Choisir un disque" className="mt-3 grid grid-cols-2 gap-1.5">
            {disques.map((d, i) => (
              <button
                key={d.uri}
                type="button"
                aria-pressed={i === disque}
                onClick={() => onChoisir(i)}
                className="flex min-h-7 items-center gap-1.5 rounded-full border border-moka/30 px-2.5 text-xs font-semibold text-espresso transition hover:bg-lin aria-pressed:border-espresso aria-pressed:bg-espresso aria-pressed:text-creme"
              >
                <span className="size-2.5 rounded-full ring-2 ring-[#171515]" style={{ background: d.etiquette }} aria-hidden />
                {d.nom}
              </button>
            ))}
          </div>
          <div ref={cadre} className="mt-2.5 min-h-20 overflow-hidden rounded-xl bg-lin" />
          <p className="mt-1.5 text-[11px] leading-snug text-moka">Sans compte Spotify connecté : extraits de 30 secondes.</p>
        </div>
      )}
    </div>
  );
}
