import type { Metadata } from "next";
import { Diagnostic } from "@/components/diagnostic/Diagnostic";

export const metadata: Metadata = {
  title: "Diagnostic olfactif",
  description: "Huit questions pour découvrir la famille olfactive qui vous ressemble, puis réserver votre atelier avec ce profil.",
};

export default function PageDiagnostic() {
  return <Diagnostic />;
}
