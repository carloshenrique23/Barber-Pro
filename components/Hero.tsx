import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-6">

      <div className="text-center">

        <h1 className="text-6xl font-extrabold text-white">
          Seu estilo começa
        </h1>

        <h2 className="mt-3 text-6xl font-extrabold text-yellow-500">
          aqui.
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-xl text-zinc-400">
          Agende seu horário online de forma rápida, simples e sem filas.
        </p>

        <Link
          href="/agendamento"
          className="mt-10 inline-block rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-black transition hover:scale-105"
        >
          Agendar Agora
        </Link>

      </div>

    </section>
  );
}