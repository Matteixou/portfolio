import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Briefcase, GraduationCap, Guitar, Mail, MapPin, Radio, Volleyball } from "lucide-react";
import { IconeGitHub, IconeLinkedIn } from "@/components/appart/Icones";
import { krylos } from "@/data/krylos";
import { liens, moi } from "@/data/moi";
import { musique } from "@/data/musique";
import { projets } from "@/data/projets";
import { stream } from "@/data/stream";
import { technos } from "@/data/technos";
import { volley } from "@/data/volley";
import Imprimer from "./Imprimer";

/* ───────────────────────────────────────────────────────────────────────
   La visite express : tout le portfolio sur une fiche, à lire en 30 s.
   Pour les recruteurs et les clients pressés, et pour les moteurs de
   recherche. S'imprime proprement (et s'enregistre en PDF : un CV).
   Tout vient de data/ : rien n'est écrit ici en double.
   ─────────────────────────────────────────────────────────────────────── */

const titre = `${moi.name} en bref`;
const description = `Le résumé en 30 secondes : ${moi.title.toLowerCase()}, agence web à Villejuif, et étudiant en développement web à l'${moi.school}.`;

export const metadata: Metadata = {
  title: titre,
  description,
  alternates: { canonical: "/en-bref" },
  openGraph: { url: "/en-bref", title: titre, description },
  twitter: { title: titre, description },
};

const linkedin = liens.find((l) => l.name === "LinkedIn")!;
const github = liens.find((l) => l.name === "GitHub")!;

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="fiche-bloc mt-9">
      <h2 className="font-main text-2xl leading-none text-brique">{titre}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function EnBref() {
  return (
    <div className="fiche-defile fixed inset-0 overflow-y-auto bg-lin">
      {/* la barre du haut : retour à l'appart, et la fiche en PDF */}
      <nav className="fiche-barre mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 pt-4 min-[700px]:px-6 min-[700px]:pt-6">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-semibold text-espresso transition hover:text-brique">
          <ArrowLeft className="size-4" aria-hidden />
          <span className="min-[480px]:hidden">L&apos;appartement</span>
          <span className="hidden min-[480px]:inline">Visiter l&apos;appartement</span>
        </Link>
        <Imprimer />
      </nav>

      <main className="fiche papier mx-auto my-5 max-w-3xl rounded-[26px] px-5 py-8 min-[700px]:my-8 min-[700px]:px-12 min-[700px]:py-12">
        {/* qui je suis */}
        <header className="flex flex-col gap-6 min-[560px]:flex-row min-[560px]:items-center">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-creme shadow-[0_10px_24px_-12px_rgb(43_34_29/0.6)] min-[700px]:size-32">
            <Image src="/images/moi.webp" alt={`${moi.name}, selfie`} fill sizes="128px" className="object-cover object-top" priority />
          </div>
          <div className="min-w-0">
            <p className="font-main text-xl leading-none text-brique">le résumé en 30 s</p>
            <h1 className="mt-1 font-serif text-[2.1rem] leading-[1.05] font-medium tracking-tight text-espresso min-[700px]:text-[2.6rem]">
              {moi.name}
            </h1>
            <p className="mt-2 text-lg leading-snug text-espresso">
              {moi.title} · Étudiant en développement web
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-moka">
              <li className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden /> {krylos.location}
              </li>
              <li className="flex items-center gap-1.5">
                <GraduationCap className="size-4" aria-hidden /> {moi.school}
              </li>
            </ul>
          </div>
        </header>

        {/* les contacts, tout de suite */}
        <ul className="mt-7 flex flex-wrap gap-2.5">
          <li>
            <a href={`mailto:${moi.email}`} className="bouton">
              <Mail className="size-4" aria-hidden /> {moi.email}
            </a>
          </li>
          <li>
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className="bouton-second">
              <IconeLinkedIn className="size-4" /> LinkedIn
            </a>
          </li>
          <li>
            <a href={github.url} target="_blank" rel="noopener noreferrer" className="bouton-second">
              <IconeGitHub className="size-4" /> {github.handle}
            </a>
          </li>
          <li>
            <a href={krylos.url} target="_blank" rel="noopener noreferrer" className="bouton-second">
              <Briefcase className="size-4" aria-hidden /> {krylos.displayUrl}
            </a>
          </li>
        </ul>

        <Section titre="en 30 secondes">
          <ul className="space-y-2.5 text-[1.05rem] leading-relaxed text-espresso">
            <li className="fiche-point">
              J&apos;ai co-fondé <strong className="font-semibold">{krylos.name}</strong>, une agence web à Villejuif.{" "}
              {krylos.description}
            </li>
            <li className="fiche-point">
              J&apos;y suis en charge de la conception et de la communication : {krylos.myRole.charAt(0).toLowerCase()}
              {krylos.myRole.slice(1)}
            </li>
            <li className="fiche-point">Je poursuis mes études en développement web à l&apos;{moi.school}.</li>
            <li className="fiche-point">
              À côté : président d&apos;{volley.club}, {musique.annees} ans de conservatoire (piano et guitare), et du
              stream le week-end sur {stream.plateforme}.
            </li>
          </ul>
        </Section>

        <Section titre="mes réalisations">
          <ul className="grid gap-3 min-[640px]:grid-cols-2">
            {projets.map((p) => (
              <li key={p.slug} className="fiche-carte rounded-2xl border border-sable bg-creme/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-moka uppercase">{p.client}</p>
                <h3 className="mt-1 font-serif text-xl text-espresso">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-moka">{p.description}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="lien mt-2 inline-flex items-center gap-1 text-sm">
                  {p.displayUrl}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section titre="mes outils">
          <ul className="flex flex-wrap gap-2">
            {technos.map((t) => (
              <li key={t.name} className="puce">
                <span className="font-semibold text-espresso">{t.name}</span>
                <span className="ml-1.5">{t.note}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section titre="krylos, l'agence">
          <div className="flex items-center gap-4">
            <Image src="/images/krylos/logo.webp" alt="Logo de Krylos" width={48} height={48} className="shrink-0" />
            <p className="font-serif text-xl text-espresso">{krylos.tagline}</p>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {krylos.services.map((s) => (
              <li key={s} className="puce">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-moka">
            {krylos.responseTime} ·{" "}
            <a href={krylos.url} target="_blank" rel="noopener noreferrer" className="lien">
              {krylos.displayUrl}
            </a>
          </p>
        </Section>

        <Section titre="en dehors du code">
          <ul className="grid gap-3 min-[640px]:grid-cols-3">
            <li className="fiche-carte rounded-2xl border border-sable bg-creme/70 p-4">
              <Volleyball className="size-5 text-brique" aria-hidden />
              <p className="mt-2 font-semibold text-espresso">{volley.faits[0].titre}</p>
              <p className="text-sm text-moka">{volley.faits[1].titre}</p>
            </li>
            <li className="fiche-carte rounded-2xl border border-sable bg-creme/70 p-4">
              <Guitar className="size-5 text-brique" aria-hidden />
              <p className="mt-2 font-semibold text-espresso">{musique.annees} ans de conservatoire</p>
              <p className="text-sm text-moka">Piano et guitare, à {musique.ecole}</p>
            </li>
            <li className="fiche-carte rounded-2xl border border-sable bg-creme/70 p-4">
              <Radio className="size-5 text-brique" aria-hidden />
              <p className="mt-2 font-semibold text-espresso">En live sur {stream.plateforme}</p>
              <p className="text-sm text-moka">{stream.horaires}</p>
            </li>
          </ul>
        </Section>

        <footer className="fiche-bloc fiche-appel mt-10 rounded-2xl bg-espresso p-6 text-creme">
          <p className="font-serif text-2xl">Une question, un projet ?</p>
          <p className="mt-1 text-sm opacity-90">Écrivez-moi directement, ou laissez une lettre dans l&apos;appartement.</p>
          <div className="fiche-barre mt-4 flex flex-wrap gap-3">
            <a href={`mailto:${moi.email}`} className="bouton">
              <Mail className="size-4" aria-hidden /> M&apos;écrire
            </a>
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-creme/40 px-5 font-semibold transition hover:bg-creme/10">
              Visiter l&apos;appartement
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          {/* sur papier, les liens deviennent des adresses lisibles */}
          <p className="fiche-imprime mt-3 text-sm">
            {moi.email} · {linkedin.url.replace("https://www.", "")} · {github.url.replace("https://", "")}
          </p>
        </footer>
      </main>
    </div>
  );
}
