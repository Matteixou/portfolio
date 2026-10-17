import { ImageResponse } from "next/og";

/* Icône d'écran d'accueil : la lampe champignon, en grand. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #6a4b36 0%, #3a281d 70%)",
        }}
      >
        <div style={{ width: 110, height: 58, borderRadius: "55px 55px 8px 8px", background: "#f7c987" }} />
        <div style={{ width: 18, height: 44, background: "#f6efe4" }} />
        <div style={{ width: 64, height: 12, borderRadius: 6, background: "#f6efe4" }} />
      </div>
    ),
    { ...size },
  );
}
