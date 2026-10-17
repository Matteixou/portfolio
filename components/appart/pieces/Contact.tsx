"use client";

import { ArrowUpRight, LoaderCircle, Send } from "lucide-react";
import { memo, useState, type FormEvent } from "react";
import { krylos } from "@/data/krylos";
import { moi } from "@/data/moi";

/* La lettre posée sur la table basse : un vrai formulaire (envoyé par
   Resend via /api/contact) écrit sur du papier ligné. */

type Etat = "repos" | "envoi" | "envoye" | "erreur";

const champ =
  "w-full border-0 border-b-2 border-moka/30 bg-transparent px-1 py-2 text-espresso outline-none transition placeholder:text-moka placeholder:italic focus:border-brique";
const etiquette = "font-main text-xl leading-none text-cognac";

function Contact() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulaire = e.currentTarget;
    const donnees = Object.fromEntries(new FormData(formulaire));
    setEtat("envoi");
    setErreur("");
    try {
      // sans réseau, fetch échoue avec un message technique en anglais
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees),
      }).catch(() => {
        throw new Error("La lettre n'a pas pu partir : vérifiez votre connexion, ou écrivez-moi directement par email.");
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "L'envoi a échoué.");
      formulaire.reset();
      setEtat("envoye");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue. Réessayez.");
      setEtat("erreur");
    }
  }

  return (
    <div>
      <p className="leading-relaxed text-moka">
        Une question, une idée, envie d&apos;échanger ? Laissez-moi un mot, je vous réponds. Vous pouvez aussi
        m&apos;écrire directement à{" "}
        <a href={`mailto:${moi.email}`} className="lien">
          {moi.email}
        </a>
        .
      </p>

      {etat === "envoye" ? (
        <div className="entree mt-6 rounded-2xl bg-olive p-6 text-center text-creme" role="status">
          <p className="font-main text-3xl">lettre envoyée !</p>
          <p className="mt-2 text-sm">Merci pour votre message. Je reviens vers vous très vite.</p>
          <button type="button" onClick={() => setEtat("repos")} className="mt-4 min-h-11 px-3 text-sm underline underline-offset-4">
            Écrire une autre lettre
          </button>
        </div>
      ) : (
        <form
          onSubmit={envoyer}
          aria-describedby={erreur ? "contact-erreur" : undefined}
          className="papier-ligne mt-6 space-y-5 rounded-2xl border border-sable bg-[#fbf7f0] p-5 shadow-[0_10px_30px_-18px_rgb(58_40_29/0.5)]"
        >
          <p className="font-main text-2xl text-espresso">Cher Matthieu,</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-nom" className={etiquette}>
                de la part de
              </label>
              <input id="contact-nom" name="name" required maxLength={100} autoComplete="name" placeholder="Votre nom" className={champ} />
            </div>
            <div>
              <label htmlFor="contact-email" className={etiquette}>
                pour me répondre
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                placeholder="vous@exemple.fr"
                className={champ}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-sujet" className={etiquette}>
              au sujet de
            </label>
            <input id="contact-sujet" name="subject" required maxLength={150} placeholder="Votre sujet" className={champ} />
          </div>
          <div>
            <label htmlFor="contact-message" className={etiquette}>
              votre message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={5}
              placeholder="Bonjour Matthieu…"
              className={`${champ} resize-y leading-8`}
            />
          </div>
          {/* Pot de miel anti-robots : invisible pour les humains */}
          <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
            <label htmlFor="contact-site">Site web</label>
            <input id="contact-site" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          {etat === "erreur" && (
            <p id="contact-erreur" role="alert" className="rounded-xl bg-brique px-4 py-3 text-sm text-creme">
              {erreur}
            </p>
          )}
          <button type="submit" disabled={etat === "envoi"} className="bouton w-full disabled:opacity-70">
            {etat === "envoi" ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden /> Envoi en cours…
              </>
            ) : (
              <>
                Envoyer la lettre <Send className="size-4" aria-hidden />
              </>
            )}
          </button>
        </form>
      )}

      <a
        href={krylos.links.contact}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 flex items-start gap-4 rounded-2xl bg-espresso p-5 text-creme transition hover:-translate-y-0.5"
      >
        <span className="min-w-0">
          <span className="block font-serif text-xl">Un projet web pour votre activité ?</span>
          <span className="mt-1 block text-sm opacity-90">
            Passez par Krylos : devis ferme, {krylos.responseTime.toLowerCase()}.
          </span>
        </span>
        <ArrowUpRight className="ml-auto size-5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </a>
    </div>
  );
}

/* Mémorisé : le panneau ne se redessine pas quand la pièce change */
export default memo(Contact);
