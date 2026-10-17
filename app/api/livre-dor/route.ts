import { NextResponse } from "next/server";
import {
  autoriser,
  COULEURS,
  enProduction,
  enregistrer,
  LIMITES,
  moderationDisponible,
  nouvelId,
  publies,
  signer,
  stockageDisponible,
  type Couleur,
  type PostIt,
} from "@/lib/livre-dor";
import { siteUrl } from "@/lib/site";

/* ───────────────────────────────────────────────────────────────────────
   GET  : les post-its publiés (ceux que Matthieu a validés)
   POST : un nouveau post-it, mis en attente de modération ; Matthieu
          reçoit un email pour le publier ou le refuser.
   ─────────────────────────────────────────────────────────────────────── */

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function GET() {
  if (!stockageDisponible()) return NextResponse.json({ postits: [], ouvert: false });
  try {
    return NextResponse.json(
      { postits: await publies(), ouvert: true },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } },
    );
  } catch (err) {
    console.error("Livre d'or (lecture) :", err);
    return NextResponse.json({ postits: [], ouvert: true });
  }
}

export async function POST(req: Request) {
  if (!stockageDisponible() || !moderationDisponible()) {
    return NextResponse.json({ error: "Le livre d'or ouvre très bientôt." }, { status: 503 });
  }

  let data: { pseudo?: unknown; message?: unknown; couleur?: unknown; website?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Pot de miel rempli → robot : on fait comme si tout allait bien
  if (typeof data.website === "string" && data.website.trim() !== "") return NextResponse.json({ ok: true });

  const texte = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "");
  const pseudo = texte(data.pseudo);
  const message = texte(data.message);
  const couleur: Couleur = COULEURS.includes(data.couleur as Couleur) ? (data.couleur as Couleur) : "jaune";

  if (!pseudo || message.length < 3) {
    return NextResponse.json({ error: "Un pseudo et un petit mot, s'il vous plaît." }, { status: 400 });
  }
  if (pseudo.length > LIMITES.pseudo || message.length > LIMITES.message) {
    return NextResponse.json({ error: "Un post-it, c'est petit : raccourcissez un peu." }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue";
  try {
    if (!(await autoriser(ip))) {
      return NextResponse.json({ error: "Trois post-its par heure, c'est le maximum. Revenez plus tard !" }, { status: 429 });
    }

    const postit: PostIt = { id: nouvelId(), pseudo, message, couleur, date: new Date().toISOString(), statut: "attente" };
    await enregistrer(postit);
    await prevenirMatthieu(postit);
    return NextResponse.json({ ok: true, attente: true });
  } catch (err) {
    console.error("Livre d'or (écriture) :", err);
    return NextResponse.json({ error: "Le post-it s'est décollé. Réessayez plus tard." }, { status: 500 });
  }
}

/** Email de modération : deux liens signés, publier ou refuser */
async function prevenirMatthieu(p: PostIt) {
  const lien = (action: "publier" | "refuser") =>
    `${siteUrl}/api/livre-dor/moderer?id=${p.id}&action=${action}&jeton=${signer(p.id, action)}`;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) {
    // En développement, les liens s'affichent dans le terminal
    if (!enProduction) console.log(`\n[livre d'or] ${p.pseudo} : « ${p.message} »\n  publier : ${lien("publier")}\n  refuser : ${lien("refuser")}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [to],
      subject: `[Livre d'or] Un post-it de ${p.pseudo}`,
      html: `
        <h2>Un nouveau post-it attend sur le frigo</h2>
        <p><strong>${echapper(p.pseudo)}</strong> a écrit :</p>
        <blockquote style="background:#fff3b8;padding:12px 16px;border-radius:6px">${echapper(p.message)}</blockquote>
        <p><a href="${lien("publier")}">Publier ce post-it</a> &nbsp;·&nbsp; <a href="${lien("refuser")}">Le refuser</a></p>
        <p style="color:#6a4b36;font-size:13px">Chaque lien ouvre une page de confirmation : rien n'est publié sans un clic de votre part.</p>
      `,
    }),
  });
  if (!res.ok) console.error("Livre d'or (email) :", res.status, await res.text());
}
