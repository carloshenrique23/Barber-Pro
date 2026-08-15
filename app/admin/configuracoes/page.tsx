"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConfiguracoesPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    address: "",
    instagram: "",
    openingHours: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function iniciar() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      await buscarConfiguracoes();
    }

    iniciar();
  }, [router]);

  async function buscarConfiguracoes() {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (response.ok) {
        setForm({
          name: data.name || "",
          whatsapp: data.whatsapp || "",
          address: data.address || "",
          instagram: data.instagram || "",
          openingHours: data.openingHours || "",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao salvar.");
      return;
    }

    alert("Configurações salvas com sucesso!");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111] text-white">
        Carregando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111] p-6 text-white">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => router.push("/admin")}
          className="mb-6 text-yellow-500 hover:underline"
        >
          ← Voltar para o Dashboard
        </button>

        <h1 className="mb-2 text-4xl font-bold">
          Configurações
        </h1>

        <p className="mb-8 text-zinc-400">
          Altere as informações da barbearia.
        </p>

        <form
          onSubmit={salvar}
          className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome da barbearia"
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp"
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Endereço"
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram"
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <input
            name="openingHours"
            value={form.openingHours}
            onChange={handleChange}
            placeholder="Horário de funcionamento"
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-500 p-3 font-bold text-black hover:bg-yellow-400"
          >
            Salvar Configurações
          </button>
        </form>
      </div>
    </main>
  );
}