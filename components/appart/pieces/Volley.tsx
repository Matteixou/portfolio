import { memo } from "react";
import Image from "next/image";
import { ArrowUpRight, Trophy, Users } from "lucide-react";
import { volley } from "@/data/volley";
import { IconeInstagram } from "../Icones";

/* Le gymnase, à gauche du salon : le volley de Matthieu (data/volley.ts). */

const ICONES = [Users, Trophy];

function Volley() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-[#1f2a5c] p-4 text-creme">
        <Image src={volley.logo} alt={`Logo ${volley.club}`} width={72} height={72} className="size-[72px] shrink-0" />
        <p>
          <span className="block font-serif text-2xl leading-tight">{volley.club}</span>
          <span className="block text-sm opacity-90">L&apos;asso de volley de l&apos;{volley.ecole}</span>
        </p>
      </div>
      <p className="text-lg leading-relaxed text-espresso">
        Quand je ne suis pas derrière un écran, je suis sur un terrain : je joue au volley en compétition universitaire,
        et je préside {volley.club}, l&apos;association de volley de l&apos;{volley.ecole}.
      </p>

      <ul className="mt-6 grid gap-3">
        {volley.faits.map((f, i) => {
          const Icone = ICONES[i % ICONES.length];
          return (
            <li key={f.titre} className="flex items-center gap-4 rounded-2xl border border-sable bg-lin/70 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-terracotta/15 text-brique">
                <Icone className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-espresso">{f.titre}</span>
                <span className="block text-sm text-moka">{f.desc}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <a
        href={volley.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 flex items-center gap-4 rounded-2xl bg-espresso p-4 text-creme transition hover:-translate-y-0.5"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10">
          <IconeInstagram className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">Suivre l&apos;asso sur Instagram</span>
          <span className="block text-sm opacity-90">{volley.handle}</span>
        </span>
        <ArrowUpRight className="ml-auto size-5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </a>

      <div className="mt-9 rounded-2xl border border-dashed border-cognac/50 p-5">
        <p className="font-main text-xl leading-none text-brique">sur le terrain</p>
        <p className="mt-2 text-sm leading-relaxed text-espresso">
          Le joueur saute et smashe tout seul, et vous pouvez aussi cliquer sur lui (ou sur le ballon) : chaque smash, c&apos;est un point de plus pour l&apos;Efrei au tableau. La nuit, les projecteurs s&apos;allument comme un soir de match.
        </p>
      </div>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Volley);
