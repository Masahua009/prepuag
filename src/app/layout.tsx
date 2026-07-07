import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";
import { PWAProvider } from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "PrepUAG | Ing. Mecatrónica",
  description: "Estudia para el examen de admisión de Ing. Mecatrónica en la UAG. Funciona sin internet como app nativa.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrepUAG",
  },
  applicationName: "PrepUAG",
  keywords: ["UAG", "examen admisión", "mecatrónica", "estudio", "PWA", "offline"],
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const navLinks = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/areas", label: "Áreas", icon: "📋" },
  { href: "/formulas", label: "Fórmulas", icon: "🧠" },
  { href: "/examen", label: "Simulacro", icon: "🎯" },
  { href: "/estadisticas", label: "Estadísticas", icon: "📊" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-slate-900 antialiased">
        <PWAProvider>
        <header className="sticky top-0 z-50 border-b border-white/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-blue-700 no-underline">
              <span className="text-2xl">🎓</span>
              <span>Prep<span className="text-blue-500">UAG</span></span>
            </Link>
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
          PrepUAG — Herramienta gratuita de estudio para el examen de admisión UAG
        </footer>
        </PWAProvider>
      </body>
    </html>
  );
}
