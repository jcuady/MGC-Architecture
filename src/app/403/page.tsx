import type { Metadata } from "next";
import Forbidden from "../forbidden";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

/** Explicit /403 route for support links and monitoring. */
export default function ForbiddenPage() {
  return <Forbidden />;
}
