import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PrepUAG - Ing. Mecatrónica",
    short_name: "PrepUAG",
    description: "Estudia para el examen de admisión de Ing. Mecatrónica en la UAG. Funciona sin internet.",
    start_url: "/",
    display: "standalone",
    background_color: "#eff6ff",
    theme_color: "#1d4ed8",
    orientation: "portrait-primary",
    lang: "es-MX",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/icons/screenshot.png",
        sizes: "1170x2532",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
