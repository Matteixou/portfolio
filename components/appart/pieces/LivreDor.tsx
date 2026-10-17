"use client";

import { LoaderCircle, StickyNote } from "lucide-react";
import { memo, useState, type FormEvent } from "react";
import { COULEURS, LIMITES, type Couleur, type PostItPublic } from "@/lib/livre-dor";
import { TEINTES_POSTIT } from "../scene/objets-studio";

/* ───────────────────────────────────────────────────────────────────────
   Le livre d'or, sur le frigo du studio : on y colle un post-it.
   Chaque post-it est relu par Matthieu avant d'apparaître.
   ─────────────────────────────────────────────────────────────────────── */

type Etat = "repos" | "envoi" | "envoye" | "erreur";

const champ =
  "w-full rounded-xl border border-moka/30 bg-creme px-3 py-2.5 text-espresso outline-none transition placeholder:text-moka placeholder:italic focus:border-brique";

const dateCourte = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function LivreDor({ postits, ouvert }: { postits: PostItPublic[]; ouvert: boolean }) {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [couleur, setCouleur] = useState<Couleur>("jaune");

  async function coller(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulaire = e.currentTarget;
    const donnees = Object.fromEntries(new FormData(formulaire));
    setEtat("envoi");
    setErreur("");
    try {
      const res = await fetch("/api/livre-dor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...donnees, couleur }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Le post-it s'est décollé.");
      formulaire.reset();
      setMessage("");
      setEtat("envoye");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
      setEtat("erreur");
    }
  }

  return (
    <div>
      <p className="leading-relaxed text-moka">
        Un petit mot, un bonjour, un conseil ? Collez un post-it sur le frigo du studio. Je relis chaque post-it avant
        de l&apos;afficher.
      </p>

      {!ouvert ? (
        <p className="mt-6 rounded-2xl border border-dashed border-cognac/50 p-5 text-espresso">Le livre d&apos;or ouvre très bientôt.</p>
      ) : etat === "envoye" ? (
        <div className="entree mt-6 rotate-[-1deg] rounded-sm p-6 text-espresso shadow-lg" style={{ background: TEINTES_POSTIT[couleur] }} role="status">
          <p className="font-main text-3xl leading-none">merci !</p>
          <p className="mt-2 text-sm">Votre post-it sera collé sur le frigo dès que je l&apos;aurai lu.</p>
          <button type="button" onClick={() => setEtat("repos")} className="mt-3 min-h-11 text-sm underline underline-offset-4">
            En écrire un autre
          </button>
        </div>
      ) : (
        <form onSubmit={coller} aria-describedby={erreur ? "livre-erreur" : undefined} className="mt-6 space-y-4">
          <div>
            <label htmlFor="livre-pseudo" className="mb-1 block text-sm font-semibold text-espresso">
              Votre pseudo
            </label>
            <input id="livre-pseudo" name="pseudo" required maxLength={LIMITES.pseudo} autoComplete="nickname" placeholder="Votre prénom ou pseudo" className={champ} />
          </div>
          <div>
            <label htmlFor="livre-message" className="mb-1 block text-sm font-semibold text-espresso">
              Votre mot
            </label>
            <textarea
              id="livre-message"
              name="message"
              required
              minLength={3}
              maxLength={LIMITES.message}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Super appart, j'ai adoré le chat !"
              className={`${champ} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-moka" aria-live="polite">
              {message.length} / {LIMITES.message}
            </p>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-espresso">La couleur du post-it</legend>
            <div className="flex gap-3">
              {COULEURS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="radio" name="couleur-choix" value={c} checked={couleur === c} onChange={() => setCouleur(c)} className="peer sr-only" />
                  <span
                    className="block size-10 rotate-[-4deg] rounded-sm shadow ring-offset-2 ring-offset-creme transition peer-checked:rotate-0 peer-checked:ring-2 peer-checked:ring-brique peer-focus-visible:ring-2 peer-focus-visible:ring-brique"
                    style={{ background: TEINTES_POSTIT[c] }}
                  />
                  <span className="sr-only">{c}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {/* Pot de miel anti-robots : invisible pour les humains */}
          <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
            <label htmlFor="livre-site">Site web</label>
            <input id="livre-site" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {etat === "erreur" && (
            <p id="livre-erreur" role="alert" className="rounded-xl bg-brique px-4 py-3 text-sm text-creme">
              {erreur}
            </p>
          )}
          <button type="submit" disabled={etat === "envoi"} className="bouton w-full disabled:opacity-70">
            {etat === "envoi" ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <StickyNote className="size-4" aria-hidden />}
            {etat === "envoi" ? "On colle…" : "Coller mon post-it"}
          </button>
          <p className="text-xs leading-relaxed text-moka">
            Seuls votre pseudo, votre mot et la date sont gardés. Le post-it n&apos;apparaît qu&apos;après relecture.
          </p>
        </form>
      )}

      <h3 className="mt-9 font-serif text-xl text-espresso">Sur le frigo</h3>
      {postits.length === 0 ? (
        <p className="mt-3 text-sm text-moka">Aucun post-it pour l&apos;instant : soyez le premier !</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4">
          {postits.map((p, i) => (
            <li
              key={p.id}
              className="rounded-sm p-3.5 text-espresso shadow-[0_10px_18px_-12px_rgb(43_34_29/0.7)]"
              style={{ background: TEINTES_POSTIT[p.couleur], rotate: `${[-2, 1.5, -1, 2.5][i % 4]}deg` }}
            >
              <p className="text-sm leading-snug break-words">{p.message}</p>
              <p className="mt-2 font-main text-lg leading-none">— {p.pseudo}</p>
              <p className="mt-1 text-[11px] text-moka">{dateCourte(p.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(LivreDor);
