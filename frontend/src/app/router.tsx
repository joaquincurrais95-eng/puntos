import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import DashboardPage from "../pages/DashboardPage";
import RulesPage from "../pages/RulesPage";
import EventsPage from "../pages/EventsPage";
import IntegrationPage from "../pages/IntegrationPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "/events", element: <EventsPage /> },
      { path: "/integration", element: <IntegrationPage /> },
    ],
  },
]);

