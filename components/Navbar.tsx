"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BarberSettings } from "@/types/settings";

export default function Navbar() {
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
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-5">
        <h1 className="text-2xl font-bold text-yellow-500">
          💈 {settings?.name || "Barber Pro"}
        </h1>

        <nav className="flex items-center gap-4">
          <a
            href="#servicos"
            className="hidden transition hover:text-yellow-500 md:block"
          >
            Serviços
          </a>

          <a
            href="#contato"
            className="hidden transition hover:text-yellow-500 md:block"
          >
            Contato
          </a>

          <Link
            href="/agendamento"
            className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black transition hover:bg-yellow-400"
          >
            Agendar
          </Link>
        </nav>
      </div>
    </header>
  );
}