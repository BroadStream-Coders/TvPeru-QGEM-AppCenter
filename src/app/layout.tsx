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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white`}>
        <AppHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <AppFooter />

        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
      </body>
    </html>
  );
}