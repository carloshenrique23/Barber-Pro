"use client";

import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  price: number;
  active: boolean;
};

type BlockedSlot = {
  id: number;
  date: string;
  time: string | null;
  reason: string | null;
};

const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export default function Agendamento() {
  const today = new Date().toISOString().split("T")[0];

  const [services, setServices] = useState<Service[]>([]);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [bloqueios, setBloqueios] = useState<BlockedSlot[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    async function buscarServicos() {
      try {
        setLoadingServices(true);

        const response = await fetch("/api/services");
        const data = await response.json();

        if (!response.ok) {
          console.error("Erro ao buscar serviços:", data);
          return;
        }

        const ativos = data.filter(
          (service: Service) => service.active
        );

        setServices(ativos);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoadingServices(false);
      }
    }

    buscarServicos();
  }, []);

  useEffect(() => {
    async function buscarBloqueios() {
      try {
        const response = await fetch("/api/blocked-slots");
        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setBloqueios(data);
      } catch (error) {
        console.error("Erro ao buscar bloqueios:", error);
      }
    }

    buscarBloqueios();
  }, []);

  useEffect(() => {
    async function buscarHorarios() {
      if (!form.date) {
        setHorariosOcupados([]);
        return;
      }

      try {
        setLoadingHorarios(true);

        const response = await fetch(
          `/api/appointments?date=${form.date}`
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const ocupados = data.map(
          (appointment: { time: string }) => appointment.time
        );

        setHorariosOcupados(ocupados);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setLoadingHorarios(false);
      }
    }

    buscarHorarios();
  }, [form.date]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  }

  function dataDoBloqueio(date: string) {
    return new Date(date).toISOString().split("T")[0];
  }

  const bloqueiosDaData = bloqueios.filter(
    (block) =>
      form.date &&
      dataDoBloqueio(block.date) === form.date
  );

  const diaInteiroBloqueado = bloqueiosDaData.some(
    (block) => !block.time
  );

  const horariosBloqueados = bloqueiosDaData
    .filter((block) => block.time)
    .map((block) => block.time as string);

  const motivoDiaBloqueado = bloqueiosDaData.find(
    (block) => !block.time
  )?.reason;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.service) {
      alert("Escolha um serviço.");
      return;
    }

    if (diaInteiroBloqueado) {
      alert("Esta data não está disponível para agendamentos.");
      return;
    }

    if (!form.time) {
      alert("Escolha um horário.");
      return;
    }

    if (horariosBloqueados.includes(form.time)) {
      alert("Este horário está bloqueado.");
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao realizar agendamento.");
        return;
      }

      alert("Agendamento realizado com sucesso!");

      setForm({
        name: "",
        phone: "",
        service: "",
        date: "",
        time: "",
      });

      setHorariosOcupados([]);
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar ao sistema.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111] p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 rounded-2xl bg-zinc-900 p-5 sm:p-8"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
            Barber Pro
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Agendar Horário
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Escolha o serviço, a data e o melhor horário.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Nome
          </label>

          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            WhatsApp
          </label>

          <input
            type="tel"
            name="phone"
            placeholder="(99) 99999-9999"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        {/* Serviços */}
        <div>
          <p className="mb-3 font-semibold text-white">
            Escolha um serviço
          </p>

          {loadingServices ? (
            <div className="rounded-lg bg-zinc-800 p-4 text-center">
              <p className="text-zinc-400">
                Carregando serviços...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="text-red-400">
                Nenhum serviço disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {services.map((service) => {
                const selecionado =
                  form.service === service.name;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        service: service.name,
                      }))
                    }
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                      selecionado
                        ? "border-yellow-500 bg-yellow-500 text-black"
                        : "border-zinc-700 bg-zinc-800 text-white hover:border-yellow-500"
                    }`}
                  >
                    <span className="font-semibold">
                      {service.name}
                    </span>

                    <span className="font-bold">
                      {service.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Data
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            min={today}
            className="w-full rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        {/* Dia bloqueado */}
        {form.date && diaInteiroBloqueado && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-bold text-red-500">
              Data indisponível
            </p>

            <p className="mt-1 text-sm text-zinc-300">
              Não há atendimento nesta data.
            </p>

            {motivoDiaBloqueado && (
              <p className="mt-1 text-sm text-zinc-400">
                Motivo: {motivoDiaBloqueado}
              </p>
            )}
          </div>
        )}

        {/* Horários */}
        {form.date && !diaInteiroBloqueado && (
          <div>
            <p className="mb-3 font-semibold text-white">
              Escolha um horário
            </p>

            {loadingHorarios ? (
              <p className="text-sm text-zinc-400">
                Carregando horários...
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {horarios.map((horario) => {
                  const ocupado =
                    horariosOcupados.includes(horario);

                  const bloqueado =
                    horariosBloqueados.includes(horario);

                  const indisponivel =
                    ocupado || bloqueado;

                  const selecionado =
                    form.time === horario;

                  return (
                    <button
                      key={horario}
                      type="button"
                      disabled={indisponivel}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          time: horario,
                        }))
                      }
                      className={`rounded-lg p-3 text-sm font-semibold transition sm:text-base ${
                        indisponivel
                          ? "cursor-not-allowed bg-zinc-700 text-zinc-500"
                          : selecionado
                          ? "bg-yellow-500 text-black"
                          : "bg-zinc-800 text-white hover:bg-yellow-500 hover:text-black"
                      }`}
                    >
                      {horario}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <span className="text-zinc-400">
                🟡 Selecionado
              </span>

              <span className="text-zinc-400">
                ⚫ Indisponível
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={
            diaInteiroBloqueado ||
            loadingServices ||
            services.length === 0
          }
          className="w-full rounded-lg bg-yellow-500 p-4 text-lg font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
        >
          {diaInteiroBloqueado
            ? "Data indisponível"
            : "Confirmar Agendamento"}
        </button>
      </form>
    </main>
  );
}