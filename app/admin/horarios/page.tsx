"use client";

import { useEffect, useState } from "react";

type BlockedSlot = {
  id: number;
  date: string;
  time: string | null;
  reason: string | null;
};

export default function HorariosPage() {
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    buscarBloqueios();
  }, []);

  async function buscarBloqueios() {
    try {
      const response = await fetch("/api/blocked-slots");
      const data = await response.json();

      if (response.ok) {
        setBlocks(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function criarBloqueio(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("/api/blocked-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        time,
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao bloquear horário.");
      return;
    }

    alert("Bloqueio criado!");

    setDate("");
    setTime("");
    setReason("");

    await buscarBloqueios();
  }

  async function removerBloqueio(id: number) {
    const confirmar = confirm(
      "Deseja realmente remover este bloqueio?"
    );

    if (!confirmar) return;

    const response = await fetch(
      `/api/blocked-slots/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erro ao remover bloqueio.");
      return;
    }

    setBlocks((prev) =>
      prev.filter((block) => block.id !== id)
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-zinc-400">
          Carregando bloqueios...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Barber Pro
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Bloqueio de horários
        </h1>

        <p className="mt-2 text-zinc-400">
          Bloqueie folgas, almoço ou horários indisponíveis.
        </p>
      </div>

      <form
        onSubmit={criarBloqueio}
        className="mb-10 grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Data
          </label>

          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Horário
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3"
          />

          <p className="mt-1 text-xs text-zinc-500">
            Deixe vazio para bloquear o dia inteiro.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">
            Motivo
          </label>

          <input
            type="text"
            placeholder="Ex.: Almoço, folga, compromisso..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 p-3"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-yellow-500 p-3 font-bold text-black hover:bg-yellow-400 md:col-span-2"
        >
          Bloquear
        </button>
      </form>

      <h2 className="mb-4 text-2xl font-bold">
        Bloqueios cadastrados
      </h2>

      {blocks.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">
            Nenhum bloqueio cadastrado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-bold">
                  {formatDate(block.date)}
                </p>

                <p className="text-yellow-500">
                  {block.time || "Dia inteiro"}
                </p>

                {block.reason && (
                  <p className="mt-1 text-sm text-zinc-400">
                    {block.reason}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  removerBloqueio(block.id)
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 