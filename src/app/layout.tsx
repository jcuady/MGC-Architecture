import type { Metadata, Viewport } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2f2" },
    { media: "(prefers-color-scheme: dark)", color: "#2f2a28" },
  ],
};

export const metadata: Metadata = {
  // Update to the custom domain once one is connected.
  metadataBase: new URL("https://mgcarchitectureph.vercel.app"),
  title: "MGC Architecture — Design with Purpose. Build for Life.",
  description:
    "Portfolio of MGC Architecture — architectural and interior design works by Mariane Gayle Caballero. Every space designed with purpose and built for life. Manila, Philippines.",
  keywords: [
    "architecture",
    "interior design",
    "architectural designer",
    "Philippines",
    "residential design",
    "renovation",
    "3D visualization",
  ],
  openGraph: {
    title: "MGC Architecture — Design with Purpose. Build for Life.",
    description:
      "Selected architectural and interior design works, from concept to completion.",
    images: ["/portfolio/c-house/c-house-01-exterior-view-1.png"],
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
