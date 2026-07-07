"use client";

import { useState, useEffect } from "react";

export function InstallInstructions() {
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop" | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) setPlatform("android");
    else if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else setPlatform("desktop");

    // Show after 2 seconds
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show || !platform) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm ring-1 ring-green-200">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📲</span>
        <div className="flex-1">
          <h3 className="font-bold text-green-800">¡Instala PrepUAG como app!</h3>
          <p className="text-sm text-green-700">
            {platform === "android" && (
              <>Toca los <strong>3 puntitos ⋮</strong> de Chrome arriba a la derecha → <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong></>
            )}
            {platform === "ios" && (
              <>En Safari, toca el botón <strong>Compartir ↑</strong> abajo → <strong>"Agregar a la pantalla de inicio"</strong></>
            )}
            {platform === "desktop" && (
              <>Haz clic en el ícono <strong>⊕ Instalar</strong> que aparece en la barra de direcciones de Chrome/Edge</>
            )}
          </p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-green-500 hover:text-green-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
