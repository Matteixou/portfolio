import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { krylos } from "@/data/krylos";
import { LogoKrylos } from "../LogoKrylos";

/* L'affiche du salon : Krylos, l'agence co-fondée par Matthieu.
   Tous les textes viennent de data/krylos.ts (repris de krylos.fr). */

function Krylos() {
  return (
    <div>
      <div className="flex items-center gap-5">
        <LogoKrylos className="size-20 shrink-0" />
        <p className="font-serif text-2xl leading-snug text-brique italic">{krylos.tagline}</p>
      </div>
      <p className="mt-4 leading-relaxed text-espresso">{krylos.pitch}</p>
      <p className="mt-3 leading-relaxed text-moka">{krylos.description}</p>

      <div className="mt-6 rounded-2xl bg-olive p-5 text-creme">
        <p className="font-main text-xl leading-none">mon rôle</p>
        <p className="mt-2 font-semibold">{krylos.role}</p>
        <p className="mt-1 text-sm leading-relaxed opacity-95">{krylos.myRole}</p>
      </div>

      <h3 className="mt-8 font-serif text-xl text-espresso">Ce que fait l&apos;agence</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {krylos.services.map((s) => (
          <li key={s} className="puce">
            {s}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 font-serif text-xl text-espresso">Les engagements</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {krylos.engagements.map((e) => (
          <li key={e.title} className="rounded-2xl border border-sable bg-lin/70 p-4">
            <p className="font-semibold text-espresso">{e.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-moka">{e.desc}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-moka">
        {krylos.location} · {krylos.zone}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={krylos.url} target="_blank" rel="noopener noreferrer" className="bouton">
          Visiter {krylos.displayUrl}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <a href={krylos.links.contact} target="_blank" rel="noopener noreferrer" className="bouton-second">
          Un projet ? Contacter l&apos;agence
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <p className="mt-3 text-sm text-moka">
        <a href={`mailto:${krylos.email}`} className="lien">
          {krylos.email}
        </a>{" "}
        · {krylos.responseTime}
      </p>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Krylos);
