"use client";

import { Printer } from "lucide-react";

/** Enregistrer la fiche en PDF (ou l'imprimer), avec la boîte d'impression du navigateur */
export default function Imprimer() {
  return (
    <button type="button" onClick={() => window.print()} className="bouton">
      <Printer className="size-4" aria-hidden />
      <span className="min-[480px]:hidden">PDF</span>
      <span className="hidden min-[480px]:inline">Enregistrer en PDF</span>
    </button>
  );
}
