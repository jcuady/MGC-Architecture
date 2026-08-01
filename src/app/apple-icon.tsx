import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        <img
          src={src}
          width={130}
          height={130}
          style={{ objectFit: "contain" }}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
