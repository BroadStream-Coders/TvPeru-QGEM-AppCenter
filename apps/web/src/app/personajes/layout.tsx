import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personajes",
};

export default function PersonajesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
