import { useState, useEffect } from "react";
import LandingPage    from "./pages/LandingPage";
import DashboardPage  from "./pages/DashboardPage";
import AppDetailPage  from "./pages/AppDetailPage";
import DeployPage     from "./pages/DeployPage";
import AnalyticsPage  from "./pages/AnalyticsPage";

export default function App() {
  const [page, setPage]               = useState("landing");
  const [user, setUser]               = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading]         = useState(true);

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
    const saved = localStorage.getItem("token");
    if (saved) {
      const payload = parseJWT(saved);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser(payload); setPage("dashboard");
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); setPage("landing");
  };

  const handleNavigate = (id) => {
    if (["deploy","analytics","dashboard","detail"].includes(id)) setPage(id);
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#07090f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",color:"#3b82f6",fontSize:13,letterSpacing:".1em"}}>
      LOADING...
    </div>
  );

  return (
    <>
      {page === "landing"   && <LandingPage onLogin={() => { window.location.href = "http://api.psnlprojects.fun/auth/github"; }}/>}
      {page === "dashboard" && <DashboardPage user={user} onLogout={handleLogout} onSelectApp={(app) => { setSelectedApp(app); setPage("detail"); }} onNavigate={handleNavigate}/>}
      {page === "detail"    && selectedApp && <AppDetailPage app={selectedApp} onBack={() => setPage("dashboard")}/>}
      {page === "deploy"    && <DeployPage onBack={() => setPage("dashboard")} onDeployed={(app) => { if(app){setSelectedApp(app);setPage("detail");}else setPage("dashboard"); }}/>}
      {page === "analytics" && <AnalyticsPage user={user} onNavigate={handleNavigate} onLogout={handleLogout}/>}
    </>
  );
}

function parseJWT(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}