import type { Metadata } from "next";
import StudioCalibration from "./StudioCalibration";

export const metadata: Metadata = {
  title: "Studio flacon",
  robots: { index: false, follow: false },
};

/**
 * Page interne de calibration et de rendu du flacon 3D (non indexée).
 * Paramètres : ?rotY=0&elev=4&fond=transparent|noyer&qualite=haute|export
 * Utilisée par scripts/flacon-*.mjs (Playwright).
 */
export default function Page() {
  return <StudioCalibration />;
}
