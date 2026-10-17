import { NextResponse } from "next/server";

/* ───────────────────────────────────────────────────────────────────────
   Formulaire « lettre » → email via Resend.

   Variables (.env.local, voir .env.example) :
     RESEND_API_KEY   clé API Resend
     CONTACT_TO       adresse qui reçoit les messages
     CONTACT_FROM     expéditeur vérifié (défaut : onboarding@resend.dev)

   Sans clé, l'endpoint répond une erreur claire (502) au lieu de faire
   semblant d'avoir envoyé.
   ─────────────────────────────────────────────────────────────────────── */

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/* Limites raisonnables : un robot ne peut pas gonfler le quota ni l'email */
const MAX = { name: 100, email: 200, subject: 150, message: 5000 } as const;

export async function POST(req: Request) {
  let data: { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; website?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Pot de miel rempli → robot. On répond « ok » sans rien envoyer.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const texte = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = texte(data.name);
  const email = texte(data.email);
  const subject = texte(data.subject);
  const message = texte(data.message);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
  }
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    subject.length > MAX.subject ||
    message.length > MAX.message
  ) {
    return NextResponse.json({ error: "Message trop long. Merci de le raccourcir." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json({ error: "Le service d'envoi n'est pas encore configuré." }, { status: 502 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${subject} — ${name}`,
        html: `
          <h2>Une lettre est arrivée par le portfolio</h2>
          <p><strong>De :</strong> ${echapper(name)} (${echapper(email)})</p>
          <p><strong>Sujet :</strong> ${echapper(subject)}</p>
          <p>${echapper(message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      console.error("Erreur Resend :", res.status, await res.text());
      return NextResponse.json(
        { error: "L'envoi a échoué. Réessayez ou écrivez-moi directement par email." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur /api/contact :", err);
    return NextResponse.json({ error: "Erreur serveur. Réessayez plus tard." }, { status: 500 });
  }
}
