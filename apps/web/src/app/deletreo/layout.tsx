import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deletreo",
};

export default function DeletreoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
