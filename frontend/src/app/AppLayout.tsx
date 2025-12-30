import { NavLink, Outlet } from "react-router-dom";

const navBase =
  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition " +
  "app-border app-muted hover:app-text hover:bg-[var(--app-surface-2)]";

const navActive =
  "bg-[var(--app-primary)] text-white border-transparent shadow-sm";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? `${navBase} ${navActive}` : navBase)}
      end={to === "/"}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--app-surface-2)] text-[var(--app-text)]">
        {/* icon placeholder */}
        •
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen app-bg app-text">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="border-r app-border bg-[var(--app-surface)]">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-[var(--app-primary)]" />
              <div>
                <div className="font-semibold leading-tight">Bark</div>
                <div className="text-xs app-muted">MVP</div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              <Item to="/" label="Dashboard" />
              <Item to="/events" label="Eventos" />
              <Item to="/rules" label="Reglas" />
              <Item to="/integration" label="Integración" />
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-col">
          {/* Topbar */}
          {/*<header className="sticky top-0 z-10 border-b app-border bg-[var(--app-bg)]/80 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="min-w-0">
                <div className="text-sm app-muted">title</div>
                <div className="truncate text-lg font-semibold">title</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <input
                    className="w-72 rounded-2xl border px-4 py-2 text-sm outline-none app-border bg-[var(--app-surface)] focus:ring-2 focus:ring-[var(--app-ring)]"
                    placeholder="Buscar…"
                  />
                </div>
                <button className="rounded-2xl border px-3 py-2 text-sm app-border bg-[var(--app-surface)] hover:bg-[var(--app-surface-2)]">
                  ⚙
                </button>
              </div>
            </div>
          </header>*/}

          {/* Content */}
          <main className="p-6">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

