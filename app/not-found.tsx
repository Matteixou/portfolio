import Link from "next/link";

/* Une pièce qui n'existe pas. */

export default function PageIntrouvable() {
  return (
    <main className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_35%,#6a4b36_0%,#1c140f_70%)] px-4">
      <div className="papier max-w-md -rotate-1 rounded-[24px] p-8 text-center">
        <p className="font-main text-2xl text-brique">toc toc…</p>
        <h1 className="mt-2 font-serif text-4xl font-medium text-espresso">Cette pièce n&apos;existe pas</h1>
        <p className="mt-3 text-moka">L&apos;appartement est petit : tout se passe dans le salon.</p>
        <Link href="/" className="bouton mt-6">
          Retourner au salon
        </Link>
      </div>
    </main>
  );
}
