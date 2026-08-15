"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("ERRO SUPABASE:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/admin");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111] p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-zinc-900 p-8 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-yellow-500">
          Login do Barbeiro
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-yellow-500 p-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}