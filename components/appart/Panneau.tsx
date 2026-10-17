"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import type { LieuId } from "./lieux";

/* ───────────────────────────────────────────────────────────────────────
   Un panneau en papier qui glisse depuis la droite (ou d'en bas sur
   mobile) quand on ouvre un coin de l'appartement.
   Fermé, il reste dans la page (pour le référencement) mais invisible.
   ─────────────────────────────────────────────────────────────────────── */

interface Props {
  id: LieuId;
  ouvert: boolean;
  surtitre: string;
  titre: ReactNode;
  onFermer: () => void;
  children: ReactNode;
}

export default function Panneau({ id, ouvert, surtitre, titre, onFermer, children }: Props) {
  const titreRef = useRef<HTMLHeadingElement>(null);
  const corpsRef = useRef<HTMLDivElement>(null);

  // À l'ouverture : on remonte en haut et on place le focus sur le titre
  useEffect(() => {
    if (!ouvert) return;
    corpsRef.current?.scrollTo({ top: 0 });
    const t = window.setTimeout(() => titreRef.current?.focus({ preventScroll: true }), 320);
    return () => window.clearTimeout(t);
  }, [ouvert]);

  return (
    <section
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-titre`}
      data-ouvert={ouvert}
      className="panneau papier"
    >
      {/* morceau de scotch */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-sm bg-[#f3e2bf]/80 shadow-sm min-[900px]:left-10 min-[900px]:translate-x-0"
      />
      <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 min-[900px]:px-8 min-[900px]:pt-8">
        <div className="min-w-0">
          <p className="font-main text-[1.35rem] leading-none text-brique">{surtitre}</p>
          <h2
            id={`${id}-titre`}
            ref={titreRef}
            tabIndex={-1}
            className="mt-2 font-serif text-[2rem] leading-[1.05] font-medium tracking-tight text-espresso outline-none min-[900px]:text-[2.5rem]"
          >
            {titre}
          </h2>
        </div>
        <a
          href="#"
          role="button"
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            onFermer();
          }}
          aria-label="Fermer et revenir au salon"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-moka/30 text-espresso transition hover:rotate-90 hover:bg-lin"
        >
          <X className="size-5" aria-hidden />
        </a>
      </header>
      <div ref={corpsRef} className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10 min-[900px]:px-8">
        {children}
      </div>
    </section>
  );
}
