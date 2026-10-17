import { memo } from "react";
import { ArrowUpRight, CalendarClock, Radio } from "lucide-react";
import { stream, type EtatStream } from "@/data/stream";

/* Les écrans du studio : les streams de Matthieu sur Twitch.
   Horaires et contenus : data/stream.ts ; statut réel : lib/twitch.ts. */

function titreDuStatut(e: EtatStream) {
  if (e.reel && e.enDirect) return e.jeu ? `En direct sur ${e.jeu} !` : "En direct en ce moment !";
  if (e.enCreneau) return "C'est l'heure du stream !";
  return `Prochain live : ${e.prochain}`;
}

function detailDuStatut(e: EtatStream) {
  if (e.reel && e.enDirect) {
    const n = e.spectateurs ?? 0;
    return n > 0 ? `${n} spectateur${n > 1 ? "s" : ""} en ce moment` : "Le live vient de commencer.";
  }
  if (e.enCreneau) return e.reel ? "Le live démarre d'une minute à l'autre." : "Le créneau du week-end est en cours.";
  return "Heure de Paris, comme toujours.";
}

function Stream({ etat }: { etat: EtatStream }) {
  return (
    <div>
      <p className="text-lg leading-relaxed text-espresso">
        Tous les week-ends, de 21 h à minuit, je lance le live sur {stream.plateforme}. Le studio est juste à côté du
        salon : installez-vous.
      </p>

      {/* le live, et où on en est */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-espresso text-creme">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${etat.enDirect ? "bg-[#c8302a]" : "bg-white/10"}`}>
            <Radio className="size-5" aria-hidden />
          </span>
          <p aria-live="polite" className="min-w-0">
            <span className="block font-semibold">{titreDuStatut(etat)}</span>
            <span className="block text-sm opacity-90">{detailDuStatut(etat)}</span>
          </p>
        </div>
        {etat.reel && etat.enDirect && etat.titre && (
          <p className="border-b border-white/10 px-5 py-3 text-sm italic opacity-90">« {etat.titre} »</p>
        )}
        <div className="flex items-center gap-3 px-5 py-4">
          <CalendarClock className="size-5 shrink-0 text-miel" aria-hidden />
          <p>
            <span className="block font-semibold">{stream.horaires}</span>
            <span className="block text-sm opacity-90">Samedi et dimanche soir</span>
          </p>
        </div>
      </div>

      <h3 className="mt-8 font-serif text-xl text-espresso">Au programme</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {stream.contenus.map((c) => (
          <li key={c} className="puce">
            {c}
          </li>
        ))}
      </ul>

      <a
        href={stream.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bouton violet mt-8"
      >
        {etat.enDirect ? "Regarder le live" : "Rejoindre la chaîne"} sur {stream.plateforme}
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
      <p className="mt-3 text-sm text-moka">
        La chaîne :{" "}
        <a href={stream.url} target="_blank" rel="noopener noreferrer" className="lien">
          {stream.displayUrl}
        </a>
      </p>

      <div className="mt-9 rounded-2xl border border-dashed border-cognac/50 p-5">
        <p className="font-main text-xl leading-none text-brique">dans le studio</p>
        <p className="mt-2 text-sm leading-relaxed text-espresso">
          Allumez ou éteignez l&apos;enseigne et la lampe. Le voyant « ON AIR » au-dessus des écrans s&apos;allume quand
          le live est lancé.
        </p>
      </div>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Stream);
