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

type Client = {
  name: string;
  phone: string;
  totalAppointments: number;
  confirmedAppointments: number;
  totalSpent: number;
  lastAppointment: string;
};

export default function ClientesPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    try {
      const response = await fetch("/api/appointments/admin");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao buscar clientes.");
        return;
      }

      setAppointments(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  const clients = useMemo(() => {
    const map = new Map<string, Client>();

    appointments.forEach((appointment) => {
      const phone = appointment.phone.replace(/\D/g, "");

      const key = phone || appointment.name.toLowerCase();

      const existing = map.get(key);

      const confirmed =
        appointment.status === "CONFIRMADO";

      const currentDate = appointment.date;

      if (!existing) {
        map.set(key, {
          name: appointment.name,
          phone: appointment.phone,
          totalAppointments: 1,
          confirmedAppointments: confirmed ? 1 : 0,
          totalSpent: confirmed
            ? Number(appointment.price || 0)
            : 0,
          lastAppointment: currentDate,
        });

        return;
      }

      existing.totalAppointments += 1;

      if (confirmed) {
        existing.confirmedAppointments += 1;
        existing.totalSpent += Number(
          appointment.price || 0
        );
      }

      if (
        new Date(currentDate).getTime() >
        new Date(existing.lastAppointment).getTime()
      ) {
        existing.lastAppointment = currentDate;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        b.totalAppointments - a.totalAppointments
    );
  }, [appointments]);

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.phone.includes(term)
    );
  }, [clients, search]);

  function abrirWhatsapp(phone: string, name: string) {
    let numero = phone.replace(/\D/g, "");

    if (!numero.startsWith("55")) {
      numero = `55${numero}`;
    }

    const mensagem = encodeURIComponent(
      `Olá ${name}, tudo bem? Estamos entrando em contato pela barbearia.`
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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-zinc-400">
          Carregando clientes...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Barber Pro
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Clientes
        </h1>

        <p className="mt-2 text-zinc-400">
          Veja o histórico dos clientes da barbearia.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Total de clientes
          </p>

          <p className="mt-2 text-4xl font-bold text-yellow-500">
            {clients.length}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Atendimentos confirmados
          </p>

          <p className="mt-2 text-4xl font-bold text-green-500">
            {clients.reduce(
              (total, client) =>
                total + client.confirmedAppointments,
              0
            )}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">
            Total recebido
          </p>

          <p className="mt-2 text-3xl font-bold text-green-500">
            {clients
              .reduce(
                (total, client) =>
                  total + client.totalSpent,
                0
              )
              .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou WhatsApp..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md rounded-lg bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
      />

      {filteredClients.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">
            Nenhum cliente encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div
              key={`${client.phone}-${client.name}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="grid gap-5 lg:grid-cols-6">
                <div>
                  <p className="text-sm text-zinc-500">
                    Cliente
                  </p>

                  <p className="font-bold">
                    {client.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    WhatsApp
                  </p>

                  <p>{client.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Agendamentos
                  </p>

                  <p className="font-bold">
                    {client.totalAppointments}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Confirmados
                  </p>

                  <p className="font-bold text-green-500">
                    {client.confirmedAppointments}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Total gasto
                  </p>

                  <p className="font-bold text-green-500">
                    {client.totalSpent.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Último:{" "}
                    {formatDate(
                      client.lastAppointment
                    )}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() =>
                      abrirWhatsapp(
                        client.phone,
                        client.name
                      )
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 font-semibold transition hover:bg-green-500"
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