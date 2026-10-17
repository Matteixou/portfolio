import { memo } from "react";
import Image from "next/image";
import { GraduationCap, MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import { krylos } from "@/data/krylos";
import { liens, moi } from "@/data/moi";
import { IconeGitHub, IconeInstagram, IconeLinkedIn } from "../Icones";

/* Le portrait au mur : qui habite ici. */

const ICONES = { GitHub: IconeGitHub, LinkedIn: IconeLinkedIn, Instagram: IconeInstagram } as const;

function APropos() {
  const reseaux = liens.filter((l) => l.name !== "Email");
  return (
    <div>
      {/* la photo, façon tirage scotché */}
      <figure className="relative mx-auto mb-7 w-[min(240px,70%)] rotate-[2deg] bg-[#fbf7f0] p-2.5 pb-9 shadow-[0_18px_34px_-18px_rgb(43_34_29/0.7)]">
        <span aria-hidden className="absolute -top-3 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-[#f3e2bf]/85" />
        <div className="relative aspect-[720/1029] overflow-hidden">
          <Image src="/images/moi.webp" alt={`${moi.name}, selfie dans un miroir, casque sur les oreilles`} fill sizes="240px" className="object-cover" />
        </div>
        <figcaption className="absolute inset-x-0 bottom-1.5 text-center font-main text-xl text-moka">c&apos;est moi !</figcaption>
      </figure>

      <p className="text-lg leading-relaxed text-espresso">
        Moi, c&apos;est {moi.firstName}. J&apos;ai co-fondé{" "}
        <a href={krylos.url} target="_blank" rel="noopener noreferrer" className="lien">
          Krylos
        </a>
        , une agence web installée à Villejuif, avec mon associé.
      </p>
      <p className="mt-4 leading-relaxed text-moka">
        J&apos;y suis en charge de la conception et de la communication : {krylos.myRole.charAt(0).toLowerCase()}
        {krylos.myRole.slice(1)}
      </p>
      <p className="mt-4 leading-relaxed text-moka">
        En parallèle, je poursuis mes études en développement web à l&apos;{moi.school}.
      </p>
      <p className="mt-4 leading-relaxed text-moka">
        Ce portfolio, je l&apos;ai voulu comme un appartement : on y entre, on regarde autour de soi, on prend son temps.
      </p>

      <ul className="mt-7 space-y-3">
        <li className="flex items-center gap-3 text-espresso">
          <span className="grid size-10 place-items-center rounded-full bg-olive text-creme">
            <Briefcase className="size-4" aria-hidden />
          </span>
          {moi.title}
        </li>
        <li className="flex items-center gap-3 text-espresso">
          <span className="grid size-10 place-items-center rounded-full bg-brique text-creme">
            <GraduationCap className="size-4" aria-hidden />
          </span>
          Étudiant en développement web · {moi.school}
        </li>
        <li className="flex items-center gap-3 text-espresso">
          <span className="grid size-10 place-items-center rounded-full bg-espresso text-creme">
            <MapPin className="size-4" aria-hidden />
          </span>
          {moi.location}
        </li>
      </ul>

      <h3 className="mt-9 font-main text-2xl text-brique">me retrouver ailleurs</h3>
      <ul className="mt-3 grid gap-2.5">
        {reseaux.map((l) => {
          const Icone = ICONES[l.name as keyof typeof ICONES];
          return (
            <li key={l.name}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-sable bg-lin/60 p-3.5 transition hover:-translate-y-0.5 hover:bg-lin"
              >
                <span className="grid size-10 place-items-center rounded-full bg-espresso text-creme">
                  <Icone className="size-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-espresso">{l.name}</span>
                  <span className="block truncate text-sm text-moka">{l.handle}</span>
                </span>
                <ArrowUpRight className="ml-auto size-4 text-moka transition group-hover:text-brique" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(APropos);
