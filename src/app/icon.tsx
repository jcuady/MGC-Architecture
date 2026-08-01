import { ImageResponse } from "next/og";

/** Circular chestnut mark — SERP-visible like competitor favicons. */
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
          alignItems: "center",
          justifyContent: "center",
          background: "#753627",
          borderRadius: "50%",
          color: "#F3F2F2",
          fontSize: 13,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        mgc
      </div>
    ),
    { ...size },
  );
}
