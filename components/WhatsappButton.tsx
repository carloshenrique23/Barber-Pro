"use client";

import { useEffect, useState } from "react";
import type { BarberSettings } from "@/types/settings";

export default function WhatsappButton() {
  const [settings, setSettings] = useState<BarberSettings | null>(null);

  useEffect(() => {
    async function carregarConfiguracoes() {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (response.ok) {
        setSettings(data);
      }
    }

    carregarConfiguracoes();
  }, []);

  if (!settings?.whatsapp) {
    return null;
  }

  let numero = settings.whatsapp.replace(/\D/g, "");

  if (!numero.startsWith("55")) {
    numero = `55${numero}`;
  }

  const mensagem = encodeURIComponent(
    `Olá! Gostaria de informações sobre a ${settings.name}.`
  );

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl shadow-lg transition hover:scale-110"
      aria-label="Abrir WhatsApp"
    >
      💬
    </a>
  );
}