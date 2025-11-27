import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950 -z-10" />

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[100px]" />

          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative min-h-screen flex flex-col text-white">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}