import { useState, useEffect } from "react";
import LandingPage   from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import AppDetailPage from "./pages/AppDetailPage";
import DeployPage    from "./pages/DeployPage";

export default function App() {
  const [page, setPage]               = useState("landing");
  const [user, setUser]               = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── On mount: check for ?token in URL (after GitHub redirect)
  //             OR check existing token in localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");

    if (error) {
      alert("GitHub login failed. Please try again.");
      window.history.replaceState({}, "", "/");
      setLoading(false);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/");
      const payload = parseJWT(token);
      if (payload) { setUser(payload); setPage("dashboard"); }
      setLoading(false);
      return;
    }

    // Already logged in?
    const saved = localStorage.getItem("token");
    if (saved) {
      const payload = parseJWT(saved);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser(payload);
        setPage("dashboard");
      } else {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("landing");
  };

  const goTo = (p) => setPage(p);

  if (loading) return (
    <div style={{
      minHeight:"100vh", background:"#080c18",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"monospace", color:"#3b82f6", fontSize:14,
    }}>
      Loading...
    </div>
  );

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => {
            window.location.href = "http://api.psnlprojects.fun/auth/github";
          }}
        />
      )}

      {page === "dashboard" && (
        <DashboardPage
          user={user}
          onLogout={handleLogout}
          onSelectApp={(app) => { setSelectedApp(app); goTo("detail"); }}
          onNavigate={(id) => { if (id === "deploy") goTo("deploy"); }}
        />
      )}

      {page === "detail" && selectedApp && (
        <AppDetailPage
          app={selectedApp}
          onBack={() => goTo("dashboard")}
        />
      )}

      {page === "deploy" && (
        <DeployPage
          onBack={() => goTo("dashboard")}
          onDeployed={() => goTo("dashboard")}
        />
      )}
    </>
  );
}

// Decode JWT payload without library
function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}