"use client";

import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  price: number;
  active: boolean;
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarServicos() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const ativos = data.filter(
          (service: Service) => service.active
        );

        setServices(ativos);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarServicos();
  }, []);

  return (
    <section
      id="servicos"
      className="bg-[#111] py-20 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Barber Pro
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Nossos Serviços
          </h2>

          <p className="mt-3 text-zinc-400">
            Escolha o serviço ideal e agende seu horário.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-zinc-400">
            Carregando serviços...
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-zinc-400">
            Nenhum serviço disponível no momento.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-yellow-500/50"
              >
                <div className="mb-4 text-4xl">
                  ✂️
                </div>

                <h3 className="text-xl font-bold">
                  {service.name}
                </h3>

                <p className="mt-4 text-2xl font-bold text-yellow-500">
                  {service.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}