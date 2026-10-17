import { ImageResponse } from "next/og";

/* Favicon : une petite lampe champignon allumée sur fond espresso. */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          background: "#3a281d",
          borderRadius: 8,
        }}
      >
        <div style={{ width: 22, height: 12, borderRadius: "11px 11px 2px 2px", background: "#f7c987" }} />
        <div style={{ width: 4, height: 9, background: "#f6efe4" }} />
        <div style={{ width: 12, height: 3, borderRadius: 2, background: "#f6efe4" }} />
      </div>
    ),
    { ...size },
  );
}
