import { useState } from "react";
import LandingPage    from "./pages/LandingPage";
import DashboardPage  from "./pages/DashboardPage";
import AppDetailPage  from "./pages/AppDetailPage";
import DeployPage     from "./pages/DeployPage";

export default function App() {
  const [page, setPage]       = useState("landing");
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => setPage("dashboard")}
        />
      )}

      {page === "dashboard" && (
        <DashboardPage
          onSelectApp={(app) => {
            setSelectedApp(app);
            setPage("detail");
          }}
          onNavigate={(id) => {
            if (id === "deploy") setPage("deploy");
          }}
        />
      )}

      {page === "detail" && (
        <AppDetailPage
          app={selectedApp}
          onBack={() => setPage("dashboard")}
        />
      )}

      {page === "deploy" && (
        <DeployPage
          onBack={() => setPage("dashboard")}
          onDeployed={() => setPage("dashboard")}
        />
      )}
    </>
  );
}