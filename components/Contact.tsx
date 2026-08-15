"use client";

import { useEffect, useState } from "react";
import type { BarberSettings } from "@/types/settings";

export default function Contact() {
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

  return (
    <section id="contato" className="bg-black py-20 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-10 text-4xl font-bold">
          Contato
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-bold text-yellow-500">
              📞 WhatsApp
            </h3>

            <p>
              {settings?.whatsapp || "Não informado"}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-bold text-yellow-500">
              📍 Endereço
            </h3>

            <p>
              {settings?.address || "Não informado"}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-bold text-yellow-500">
              🕒 Funcionamento
            </h3>

            <p>
              {settings?.openingHours || "Não informado"}
            </p>
          </div>
        </div>

        {settings?.instagram && (
          <p className="mt-8 text-zinc-400">
            Instagram: {settings.instagram}
          </p>
        )}
      </div>
    </section>
  );
}