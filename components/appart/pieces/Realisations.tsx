import { memo } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { krylos } from "@/data/krylos";
import { projets } from "@/data/projets";

/* La télé du salon : une chaîne par réalisation. La télécommande change
   de chaîne, l'écran dans la pièce suit. */

function Realisations({ chaine, zapper }: { chaine: number; zapper: (sens: 1 | -1) => void }) {
  return (
    <div>
      <p className="text-moka">Ce qui passe à la télé ce soir : des sites livrés, en ligne, utilisés par de vrais clients.</p>

      {/* télécommande */}
      <div className="mt-5 flex items-center gap-2 rounded-[20px] bg-espresso p-2 text-creme shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]">
        <button
          type="button"
          onClick={() => zapper(-1)}
          aria-label="Chaîne précédente"
          className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <p className="flex-1 text-center font-mono text-sm" aria-live="polite">
          <span className="text-miel">CH {String(chaine + 1).padStart(2, "0")}</span>
          <span className="mx-2 opacity-50">/</span>
          {projets[chaine].title}
        </p>
        <button
          type="button"
          onClick={() => zapper(1)}
          aria-label="Chaîne suivante"
          className="grid size-11 place-items-center rounded-full bg-brique transition hover:bg-brique-fonce active:scale-95"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {projets.map((p, i) => (
        <article key={p.slug} hidden={i !== chaine} className="entree mt-7">
          {/* Sur mobile la télé est petite : on montre aussi la capture */}
          <div className="relative mb-6 aspect-[1600/765] overflow-hidden rounded-xl border-[6px] border-espresso shadow-lg min-[900px]:hidden">
            <Image src={p.image} alt={`Capture du site ${p.title}`} fill sizes="(max-width: 900px) 90vw, 1px" className="object-cover object-top" />
          </div>
          <p className="text-sm font-semibold text-cognac">
            {p.client} · {p.year}
          </p>
          <h3 className="mt-1 font-serif text-3xl font-medium text-espresso">{p.title}</h3>
          <p className="mt-3 leading-relaxed text-moka">{p.description}</p>
          <ul className="mt-5 space-y-2.5">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-espresso">
                <span aria-hidden className="mt-2 size-2 shrink-0 rotate-45 rounded-[2px] bg-terracotta" />
                {h}
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Type de projet">
            {p.tags.map((t) => (
              <li key={t} className="puce">
                {t}
              </li>
            ))}
          </ul>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="bouton mt-7">
            Voir {p.displayUrl}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </article>
      ))}

      <p className="mt-9 border-t border-sable pt-5 text-sm text-moka">
        Toutes les réalisations de l&apos;agence sont sur{" "}
        <a href={krylos.links.realisations} target="_blank" rel="noopener noreferrer" className="lien">
          krylos.fr/realisations
        </a>
        .
      </p>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Realisations);
