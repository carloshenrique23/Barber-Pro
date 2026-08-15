"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Service = {
  id: number;
  name: string;
  price: number;
  active: boolean;
};

export default function ServicosPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
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

      await buscarServicos();
    }

    iniciar();
  }, [router]);

  async function buscarServicos() {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      if (response.ok) {
        setServices(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function cadastrarServico(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao cadastrar.");
      return;
    }

    setName("");
    setPrice("");

    await buscarServicos();
  }

  async function excluirServico(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este serviço?"
    );

    if (!confirmar) return;

    const response = await fetch(`/api/services/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao excluir.");
      return;
    }

    setServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  }

  async function alterarStatus(service: Service) {
    const response = await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: service.name,
        price: service.price,
        active: !service.active,
      }),
    });

    if (!response.ok) {
      alert("Erro ao alterar serviço.");
      return;
    }

    await buscarServicos();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111] text-white">
        Carregando serviços...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111] p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="mb-4 text-yellow-500 hover:underline"
          >
            ← Voltar para o Dashboard
          </button>

          <h1 className="text-4xl font-bold">
            Serviços e Preços
          </h1>

          <p className="mt-2 text-zinc-400">
            Cadastre e gerencie os serviços da barbearia.
          </p>
        </div>

        <form
          onSubmit={cadastrarServico}
          className="mb-10 grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-3"
        >
          <input
            type="text"
            placeholder="Nome do serviço"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg bg-zinc-800 p-3"
            required
          />

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg bg-zinc-800 p-3"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-yellow-500 p-3 font-bold text-black hover:bg-yellow-400"
          >
            Adicionar Serviço
          </button>
        </form>

        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="rounded-xl bg-zinc-900 p-8 text-center text-zinc-400">
              Nenhum serviço cadastrado.
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold">
                    {service.name}
                  </h2>

                  <p className="mt-1 text-2xl font-bold text-yellow-500">
                    {service.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>

                  <p
                    className={
                      service.active
                        ? "mt-2 text-green-500"
                        : "mt-2 text-red-500"
                    }
                  >
                    {service.active ? "Ativo" : "Inativo"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alterarStatus(service)}
                    className="rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
                  >
                    {service.active ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    onClick={() => excluirServico(service.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}