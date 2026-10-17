import { memo } from "react";
import { Guitar, Pause, Piano, Play } from "lucide-react";
import { disques, musique } from "@/data/musique";

/* Le coin musique du studio : la guitare, le clavier, et ce que Matthieu
   écoute (data/musique.ts). Les boutons jouent un vrai son, synthétisé ;
   les disques passent sur la platine du salon (lecteur Spotify). */

function Musique({
  gratter,
  arpege,
  enCours,
  joue,
  ecouter,
}: {
  gratter: () => void;
  arpege: () => void;
  /** le disque sur la platine (-1 : aucun) */
  enCours: number;
  joue: boolean;
  ecouter: (disque: number) => void;
}) {
  return (
    <div>
      <p className="text-lg leading-relaxed text-espresso">
        J&apos;ai joué du piano et de la guitare pendant {musique.annees} ans, au conservatoire, à {musique.ecole}. Et
        j&apos;aime toujours autant la musique.
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {[
          { nom: "Piano", Icone: Piano },
          { nom: "Guitare", Icone: Guitar },
        ].map(({ nom, Icone }) => (
          <li key={nom} className="rounded-2xl border border-sable bg-lin/70 p-4">
            <Icone className="size-6 text-brique" aria-hidden />
            <p className="mt-2 font-semibold text-espresso">{nom}</p>
            <p className="text-sm text-moka">{musique.annees} ans de conservatoire</p>
          </li>
        ))}
      </ul>

      {/* jouer pour de vrai : le son est synthétisé dans le navigateur */}
      <div className="mt-6 rounded-2xl bg-espresso p-5 text-creme">
        <p className="font-main text-xl leading-none text-miel">à vous de jouer</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={gratter} className="bouton">
            <Guitar className="size-4" aria-hidden /> Gratter un accord
          </button>
          <button type="button" onClick={arpege} className="bouton violet">
            <Piano className="size-4" aria-hidden /> Jouer un arpège
          </button>
        </div>
        <p className="mt-3 text-xs opacity-90">Pas d&apos;enregistrement : la corde et les notes sont calculées en direct.</p>
      </div>

      <h3 className="mt-8 font-serif text-xl text-espresso">Ce que j&apos;écoute</h3>
      <p className="mt-1 text-sm text-moka">Ils tournent sur la platine du salon : choisissez un disque.</p>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {disques.map((d, i) => {
          const surLaPlatine = enCours === i;
          const tourne = surLaPlatine && joue;
          return (
            <li key={d.uri}>
              <button
                type="button"
                onClick={() => ecouter(i)}
                aria-pressed={tourne}
                className="flex w-full items-center gap-3 rounded-2xl border border-sable bg-lin/70 p-3 text-left transition hover:border-cognac aria-pressed:border-espresso"
              >
                {/* un petit vinyle, avec l'étiquette de l'artiste */}
                <span className={`relative grid size-12 shrink-0 place-items-center rounded-full bg-[#171515] ${tourne ? "anim-tourne" : ""}`} aria-hidden>
                  <span className="absolute inset-1.5 rounded-full border border-white/10" />
                  <span className="absolute inset-3 rounded-full border border-white/10" />
                  <span className="relative size-4 rounded-full" style={{ background: d.etiquette }} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-espresso">{d.nom}</span>
                  <span className="flex items-center gap-1 text-xs text-moka">
                    {tourne ? <Pause className="size-3 shrink-0" aria-hidden /> : <Play className="size-3 shrink-0" aria-hidden />}
                    <span className="truncate">
                      {tourne ? "Sur la platine" : surLaPlatine ? "En pause" : (d.titre ?? "Écouter")}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-moka">
        Via Spotify : sans compte connecté sur ce navigateur, ce sont des extraits de 30 secondes.
      </p>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Musique);
