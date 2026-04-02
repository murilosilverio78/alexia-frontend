import { Scale } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Nova Consulta" },
  { to: "/historico", label: "Histórico" },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-app-shell">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <NavLink
            to="/"
            className="group inline-flex min-h-11 items-center gap-3 rounded-2xl pr-3 text-text transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 cursor-pointer"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-soft transition-colors duration-200 group-hover:bg-primary-600 motion-reduce:transition-none">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-2xl font-semibold leading-none tracking-tight">
                Alexia
              </span>
              <span className="mt-1 block text-sm text-text-muted">
                Assessoria Jurídica com IA
              </span>
            </span>
          </NavLink>

          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-2 rounded-full border border-border/80 bg-surface-soft/90 p-1"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 cursor-pointer motion-reduce:transition-none",
                    isActive
                      ? "bg-primary-700 text-white shadow-soft"
                      : "text-text-muted hover:bg-surface hover:text-text",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="pt-24 sm:pt-28">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Outlet />
        </main>

        <footer className="mx-auto max-w-4xl px-4 pb-8 pt-2 text-sm leading-6 text-text-muted">
          Alexia © 2025 · As respostas têm caráter informativo e não substituem
          assessoria jurídica profissional.
        </footer>
      </div>
    </div>
  );
}
