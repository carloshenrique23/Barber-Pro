"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: string;
};

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    try {
      setLoading(true);

      const response = await fetch("/api/appointments/admin");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao buscar agendamentos.");
        return;
      }

      setAppointments(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function alterarStatus(id: number, status: string) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao atualizar status.");
        return;
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: data.status,
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar status.");
    }
  }

  function abrirWhatsapp(phone: string, name: string) {
    let numero = phone.replace(/\D/g, "");

    if (!numero.startsWith("55")) {
      numero = `55${numero}`;
    }

    const mensagem = encodeURIComponent(
      `Olá ${name}, tudo bem? Estou entrando em contato sobre seu agendamento na barbearia.`
    );

    window.open(
      `https://wa.me/${numero}?text=${mensagem}`,
      "_blank"
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }

  const hoje = new Date().toISOString().split("T")[0];

  const amanhaDate = new Date();
  amanhaDate.setDate(amanhaDate.getDate() + 1);

  const amanha = amanhaDate.toISOString().split("T")[0];

  const appointmentsHoje = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.date.split("T")[0] === hoje
    );
  }, [appointments, hoje]);

  const proximos = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        appointment.date.split("T")[0] > hoje &&
        appointment.status !== "CANCELADO"
    );
  }, [appointments, hoje]);

  const faturamentoHoje = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.date.split("T")[0] === hoje &&
          appointment.status === "CONFIRMADO"
      )
      .reduce(
        (total, appointment) =>
          total + Number(appointment.price || 0),
        0
      );
  }, [appointments, hoje]);

  const mesAtual = hoje.slice(0, 7);

  const faturamentoMes = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.date.split("T")[0].slice(0, 7) ===
            mesAtual &&
          appointment.status === "CONFIRMADO"
      )
      .reduce(
        (total, appointment) =>
          total + Number(appointment.price || 0),
        0
      );
  }, [appointments, mesAtual]);

  const appointmentsFiltrados = useMemo(() => {
    return appointments.filter((appointment) => {
      const mesmaData =
        !selectedDate ||
        appointment.date.split("T")[0] === selectedDate;

      const mesmoStatus =
        !selectedStatus ||
        appointment.status === selectedStatus;

      return mesmaData && mesmoStatus;
    });
  }, [appointments, selectedDate, selectedStatus]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-zinc-400">
          Carregando agendamentos...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Cabeçalho */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Barber Pro
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Controle os agendamentos e o faturamento da barbearia.
        </p>
      </div>

      {/* Cards */}
      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Agendamentos hoje
          </p>

          <p className="mt-2 text-4xl font-bold text-yellow-500">
            {appointmentsHoje.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Próximos agendamentos
          </p>

          <p className="mt-2 text-4xl font-bold text-yellow-500">
            {proximos.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Total de agendamentos
          </p>

          <p className="mt-2 text-4xl font-bold text-yellow-500">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Faturamento hoje
          </p>

          <p className="mt-2 text-3xl font-bold text-green-500">
            {faturamentoHoje.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Faturamento do mês
          </p>

          <p className="mt-2 text-3xl font-bold text-green-500">
            {faturamentoMes.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      {/* Filtro por data */}
      <div className="mb-4">
        <p className="mb-2 text-sm text-zinc-500">
          Filtrar por data
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedDate("")}
            className={`rounded-lg px-4 py-2 transition ${
              selectedDate === ""
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setSelectedDate(hoje)}
            className={`rounded-lg px-4 py-2 transition ${
              selectedDate === hoje
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Hoje
          </button>

          <button
            onClick={() => setSelectedDate(amanha)}
            className={`rounded-lg px-4 py-2 transition ${
              selectedDate === amanha
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Amanhã
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
          />
        </div>
      </div>

      {/* Filtro por status */}
      <div className="mb-8">
        <p className="mb-2 text-sm text-zinc-500">
          Filtrar por status
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedStatus("")}
            className={`rounded-lg px-4 py-2 transition ${
              selectedStatus === ""
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Todos os status
          </button>

          <button
            onClick={() => setSelectedStatus("PENDENTE")}
            className={`rounded-lg px-4 py-2 transition ${
              selectedStatus === "PENDENTE"
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Pendentes
          </button>

          <button
            onClick={() => setSelectedStatus("CONFIRMADO")}
            className={`rounded-lg px-4 py-2 transition ${
              selectedStatus === "CONFIRMADO"
                ? "bg-green-500 font-semibold text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Confirmados
          </button>

          <button
            onClick={() => setSelectedStatus("CANCELADO")}
            className={`rounded-lg px-4 py-2 transition ${
              selectedStatus === "CANCELADO"
                ? "bg-red-500 font-semibold text-white"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            Cancelados
          </button>
        </div>
      </div>

      {/* Agenda */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Agenda
        </h2>

        <p className="text-sm text-zinc-500">
          {appointmentsFiltrados.length} resultado(s)
        </p>
      </div>

      {appointmentsFiltrados.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">
            Nenhum agendamento encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointmentsFiltrados.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="grid gap-5 lg:grid-cols-7">
                {/* Cliente */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Cliente
                  </p>

                  <p className="font-bold">
                    {appointment.name}
                  </p>
                </div>

                {/* Serviço */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Serviço
                  </p>

                  <p>
                    {appointment.service}
                  </p>
                </div>

                {/* Data */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Data
                  </p>

                  <p>
                    {formatDate(appointment.date)}
                  </p>
                </div>

                {/* Horário */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Horário
                  </p>

                  <p className="font-bold text-yellow-500">
                    {appointment.time}
                  </p>
                </div>

                {/* Valor */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Valor
                  </p>

                  <p className="font-bold text-green-500">
                    {Number(
                      appointment.price || 0
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-zinc-500">
                    Status
                  </p>

                  <p
                    className={`font-bold ${
                      appointment.status === "CONFIRMADO"
                        ? "text-green-500"
                        : appointment.status === "CANCELADO"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {appointment.status}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-2">
                  {appointment.status !== "CONFIRMADO" &&
                    appointment.status !== "CANCELADO" && (
                      <button
                        onClick={() =>
                          alterarStatus(
                            appointment.id,
                            "CONFIRMADO"
                          )
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 font-semibold transition hover:bg-blue-500"
                      >
                        Confirmar
                      </button>
                    )}

                  {appointment.status !== "CANCELADO" && (
                    <button
                      onClick={() =>
                        alterarStatus(
                          appointment.id,
                          "CANCELADO"
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 font-semibold transition hover:bg-red-500"
                    >
                      Cancelar
                    </button>
                  )}

                  <button
                    onClick={() =>
                      abrirWhatsapp(
                        appointment.phone,
                        appointment.name
                      )
                    }
                    className="rounded-lg bg-green-600 px-3 py-2 font-semibold transition hover:bg-green-500"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
