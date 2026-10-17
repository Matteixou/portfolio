import { ImageResponse } from "next/og";
import { krylos } from "@/data/krylos";
import { moi } from "@/data/moi";

/* Image de partage (1200 × 630) : la fenêtre au coucher du soleil et un mot
   d'accueil sur papier crème, comme en arrivant sur le site. */

export const alt = "Bienvenue chez Matthieu Feracho, co-fondateur de Krylos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#e8d4b6", padding: 56, gap: 48 }}>
        {/* la fenêtre */}
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            border: "14px solid #24201d",
            background: "linear-gradient(180deg, #6c6aa2 0%, #ad8cb8 30%, #ec9f8e 58%, #f7ae6a 80%, #fbd38f 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 220,
              top: 300,
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#fff1c9",
              boxShadow: "0 0 80px 40px rgba(255, 210, 140, 0.7)",
            }}
          />
          <div style={{ height: 120, display: "flex", background: "#9a6460" }} />
          <div style={{ position: "absolute", left: 189, top: 0, width: 12, height: "100%", background: "#24201d" }} />
          <div style={{ position: "absolute", left: 0, top: 150, width: "100%", height: 12, background: "#24201d" }} />
        </div>

        {/* le mot d'accueil */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#f6efe4",
            borderRadius: 28,
            padding: "48px 52px",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 30px 60px -30px rgba(28, 20, 15, 0.6)",
          }}
        >
          <div style={{ fontSize: 34, color: "#a3431f", display: "flex" }}>Bienvenue chez</div>
          <div style={{ fontSize: 76, color: "#3a281d", lineHeight: 1.05, marginTop: 8, display: "flex" }}>{moi.name}</div>
          <div style={{ fontSize: 30, color: "#6a4b36", marginTop: 24, lineHeight: 1.4, display: "flex" }}>
            {`Co-fondateur de ${krylos.name}, agence web à Villejuif.`}
          </div>
          <div style={{ fontSize: 26, color: "#59623a", marginTop: 28, display: "flex" }}>
            Un portfolio qui se visite comme un appartement.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
