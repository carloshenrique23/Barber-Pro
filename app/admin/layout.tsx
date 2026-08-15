"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function verificarLogin() {
      if (isLoginPage) {
        setCheckingAuth(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    }

    verificarLogin();
  }, [isLoginPage, router]);

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111] text-white">
        Verificando acesso...
      </main>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#111] text-white md:flex">
      <aside className="border-b border-zinc-800 bg-zinc-950 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <h1 className="mb-8 text-2xl font-bold text-yellow-500">
          💈 Barber Pro
        </h1>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/admin")}
            className={`rounded-lg px-4 py-3 text-left transition ${
              pathname === "/admin"
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/clientes")}
             className={`rounded-lg px-4 py-3 text-left transition ${
               pathname === "/admin/clientes"
                  ? "bg-yellow-500 font-semibold text-black"
                  : "bg-zinc-900 hover:bg-zinc-800"
            }`}
>
             Clientes
          </button>
          <button
             onClick={() => router.push("/admin/horarios")}
             className={`rounded-lg px-4 py-3 text-left transition ${
               pathname === "/admin/horarios"
                  ? "bg-yellow-500 font-semibold text-black"
                  : "bg-zinc-900 hover:bg-zinc-800"
            }`}
>
             Horários
          </button>

          <button
            onClick={() => router.push("/admin/servicos")}
            className={`rounded-lg px-4 py-3 text-left transition ${
              pathname === "/admin/servicos"
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Serviços
          </button>

          <button
            onClick={() => router.push("/admin/configuracoes")}
            className={`rounded-lg px-4 py-3 text-left transition ${
              pathname === "/admin/configuracoes"
                ? "bg-yellow-500 font-semibold text-black"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Configurações
          </button>

          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-zinc-900 px-4 py-3 text-left transition hover:bg-zinc-800"
          >
            Ver site
          </button>

          <button
            onClick={sair}
            className="mt-4 rounded-lg bg-red-600 px-4 py-3 text-left font-semibold transition hover:bg-red-500"
          >
            
            Sair
          </button>
        </nav>
      </aside>

      <section className="flex-1 p-6">
        {children}
      </section>
    </div>
  );
}