import { FileText, History, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { BrandMark } from "./BrandMark";

const navItems = [
  { to: "/", label: "Nova consulta", icon: FileText },
  { to: "/historico", label: "Historico", icon: History },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-hero-grid bg-[size:auto,36px_36px,36px_36px]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="panel sticky top-4 z-20 mb-8 flex flex-col gap-6 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <BrandMark />

          <nav className="flex flex-wrap items-center gap-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-slate-950 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_340px]">
          <main>
            <Outlet />
          </main>

          <aside className="panel h-fit px-5 py-5 sm:px-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-800">
              <Sparkles className="h-4 w-4" />
              Fluxo assistido
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slatewarm-950">
              Base pronta para evoluir
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              O frontend ja nasce com router, React Query, axios centralizado,
              toasts, tipagem da API e layout responsivo para a experiencia da
              Alexia.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-950 px-4 py-4 text-slate-50">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Rota inicial
                </p>
                <p className="mt-2 text-lg font-semibold">/</p>
                <p className="mt-1 text-sm text-slate-300">
                  Nova consulta juridica com envio para API.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Rota secundaria
                </p>
                <p className="mt-2 text-lg font-semibold text-slatewarm-950">
                  /historico
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Lista de consultas para a camada de historico.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
