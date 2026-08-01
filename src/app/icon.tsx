import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Dynamic fallback icon — chestnut square + brand monogram. */
export default async function Icon() {
  const mono = await readFile(
    join(process.cwd(), "public/brand/monogram-white-transparent.png"),
  );
  const src = `data:image/png;base64,${mono.toString("base64")}`;

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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={23} height={23} style={{ objectFit: "contain" }} alt="" />
      </div>
    ),
    { ...size },
  );
}
