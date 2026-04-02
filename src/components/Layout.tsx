import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, LogOut, Scale } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/app", label: "Nova Consulta", end: true },
  { to: "/app/historico", label: "Histórico", end: false },
];

export function Layout() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const initials = useMemo(
    () => (user?.email?.charAt(0).toUpperCase() ?? "A"),
    [user?.email],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

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
                end={item.end}
                className={({ isActive }) =>
                  [
                    "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 cursor-pointer motion-reduce:transition-none",
                    isActive
                      ? "bg-primary-700 text-white shadow-soft"
                      : "bg-transparent text-text-muted hover:bg-surface hover:text-text",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex min-h-11 items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2 text-left transition duration-200 hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 motion-reduce:transition-none"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? user.email ?? "Usuário"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">
                  {initials}
                </span>
              )}
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-text">
                  {user?.displayName ?? "Conta Alexia"}
                </span>
                <span className="block truncate text-xs text-text-muted">
                  {user?.email}
                </span>
              </span>
              <ChevronDown
                className={[
                  "h-4 w-4 text-text-muted transition duration-200 motion-reduce:transition-none",
                  menuOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-border bg-surface p-3 shadow-elevated">
                <div className="rounded-2xl bg-surface-soft p-4">
                  <p className="text-sm font-semibold text-text">
                    {user?.displayName ?? "Conta Alexia"}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-danger-fg/10 bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-fg transition duration-200 hover:bg-danger-bg/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 motion-reduce:transition-none"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            ) : null}
          </div>
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
