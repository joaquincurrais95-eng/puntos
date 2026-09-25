//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

// App.tsx
import { useEffect, useState } from "react";

// Importá tus páginas reales (ajustá rutas/nombres a tu proyecto)
// Si todavía no tenés router, arrancamos con una page fija.
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import RulesPage from "./pages/RulesPage";
import IntegrationPage from "./pages/IntegrationPage";

type Tab = "dashboard" | "events" | "rules" | "integration";

export default function App() {
  const [tab, setTab] = useState<Tab>("events");

  // Tema por defecto (neutral). Para probar el “brand”:
  // document.documentElement.dataset.theme = "brand"
  useEffect(() => {
    document.documentElement.dataset.theme = "neutral";
  }, []);

  return (
    <div className="min-h-screen app-bg app-text">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold tracking-tight">MVP Puntos</div>
            <div className="app-muted text-sm">Loyalty / Events</div>
          </div>

          <nav className="flex gap-2">
            <NavButton active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
              Dashboard
            </NavButton>
            <NavButton active={tab === "events"} onClick={() => setTab("events")}>
              Events
            </NavButton>
            <NavButton active={tab === "rules"} onClick={() => setTab("rules")}>
              Rules
            </NavButton>
            <NavButton active={tab === "integration"} onClick={() => setTab("integration")}>
              Integration
            </NavButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-10">
        <div className="app-surface app-border app-shadow rounded-2xl border p-6">
          {tab === "dashboard" && <DashboardPage />}
          {tab === "events" && <EventsPage />}
          {tab === "rules" && <RulesPage />}
          {tab === "integration" && <IntegrationPage />}
        </div>
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-2 text-sm transition",
        "border app-border",
        active
          ? "bg-[var(--app-primary)] text-white"
          : "app-surface hover:bg-[var(--app-surface-2)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

