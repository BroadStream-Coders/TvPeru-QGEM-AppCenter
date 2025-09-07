import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Que Gane El Mejor - App Center",
  description: "Sistema centralizado para el programa 'Que Gane El Mejor' de TV Perú. Gestión unificada de juegos y herramientas en tiempo real.",
  keywords: "TV Perú, Que Gane El Mejor, App Center, juegos educativos, sistema centralizado",
  authors: [{ name: "Esteban Abanto Garcia" }],
  creator: "Esteban Abanto Garcia",
  publisher: "Esteban Abanto Garcia"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}