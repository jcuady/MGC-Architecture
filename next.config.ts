import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Include 3× phone widths (e.g. 430×3 ≈ 1290) so full-bleed heroes stay HD.
    deviceSizes: [640, 750, 828, 1080, 1170, 1280, 1440, 1920, 2048, 2560],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nbdfkhzjmkppoohhjelg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
