import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api/axios";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  arrowl:  "M19 12H5 M12 19l-7-7 7-7",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  external:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  layers:  "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  settings:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  download:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  eye:     ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  eyeoff:  "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22",
  plus:    "M12 5v14 M5 12h14",
  check:   "M20 6L9 17l-5-5",
  x:       "M18 6L6 18 M6 6l12 12",
  edit:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  server:  "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  trash:   "M3 6h18 M19 6l-1 14H6L5 6 M9 6V4h6v2",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  :root {
    --bg:#080c18; --surface:#0f1623; --surface2:#161e2e; --surface3:#1c2640;
    --border:#1c2640; --border2:#243352; --text:#dce8ff; --muted:#5a6a8a;
    --accent:#3b82f6; --accent2:#60a5fa; --green:#22c55e; --red:#ef4444;
    --yellow:#f59e0b; --cyan:#06b6d4;
    --mono:'Space Mono',monospace; --sans:'DM Sans',sans-serif;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--sans);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}

  .page{min-height:100vh}
  .topnav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:rgba(8,12,24,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
  .logo{display:flex;align-items:center;gap:9px;cursor:pointer}
  .logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:7px;display:flex;align-items:center;justify-content:center}
  .logo-text{font-family:var(--mono);font-size:12px;font-weight:700}
  .nav-right{display:flex;align-items:center;gap:9px}
  .icon-btn{width:32px;height:32px;border-radius:7px;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .2s}
  .icon-btn:hover{color:var(--text);border-color:var(--border2)}
  .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:var(--mono)}
  .sys-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.18);font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--green)}
  .sys-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

  .body{padding:28px;max-width:1100px;margin:0 auto}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--sans);transition:all .18s;white-space:nowrap}
  .btn-primary{background:var(--accent);color:#fff}
  .btn-primary:hover{background:#2563eb}
  .btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
  .btn-ghost:hover{background:var(--surface3)}
  .btn-danger{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.22)}
  .btn-sm{padding:6px 12px;font-size:12px}

  .app-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:26px;flex-wrap:wrap;gap:16px}
  .app-info{display:flex;align-items:center;gap:16px}
  .app-big-icon{border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .app-title{font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .app-meta{font-size:12px;color:var(--muted);margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .code-tag{background:var(--surface2);border:1px solid var(--border2);border-radius:4px;padding:1px 7px;font-family:var(--mono);font-size:11px;color:var(--accent2)}
  .hdr-acts{display:flex;gap:10px;flex-wrap:wrap}

  .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
  .badge::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
  .b-running {background:rgba(34,197,94,.1); color:var(--green)}
  .b-building{background:rgba(245,158,11,.1);color:var(--yellow)}
  .b-failed  {background:rgba(239,68,68,.1); color:var(--red)}
  .b-stopped {background:rgba(90,106,138,.1);color:var(--muted)}

  .tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:24px}
  .tab{padding:9px 18px;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .18s;display:flex;align-items:center;gap:6px}
  .tab.active{color:var(--accent2);border-bottom-color:var(--accent)}
  .tab:hover:not(.active){color:var(--text)}

  .grid{display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start}

  .terminal{background:#05080f;border:1px solid #131d2e;border-radius:12px;overflow:hidden;font-family:var(--mono);font-size:11.5px}
  .term-hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid #131d2e;background:#07090f}
  .term-dots{display:flex;gap:6px}
  .term-dot{width:11px;height:11px;border-radius:50%}
  .term-title{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .term-right{display:flex;align-items:center;gap:8px}
  .term-body{padding:14px;height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:3px}
  .log-row{display:flex;gap:10px;line-height:1.6}
  .lt{color:#253d55;flex-shrink:0;min-width:65px}
  .li{color:var(--accent2);font-weight:700;flex-shrink:0;min-width:60px}
  .ls{color:var(--green);  font-weight:700;flex-shrink:0;min-width:60px}
  .ly{color:var(--cyan);   font-weight:700;flex-shrink:0;min-width:60px}
  .lw{color:var(--yellow); font-weight:700;flex-shrink:0;min-width:60px}
  .le{color:var(--red);    font-weight:700;flex-shrink:0;min-width:60px}
  .lx{color:#6a8aaa;word-break:break-all}
  .log-cursor{display:inline-block;width:7px;height:13px;background:var(--accent2);animation:blink 1s step-end infinite;vertical-align:-2px}
  @keyframes blink{50%{opacity:0}}
  .live-dot{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:var(--green);letter-spacing:.1em}
  .live-dot::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);animation:lpulse 1.2s ease-in-out infinite}
  @keyframes lpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}

  .sec-title{font-size:15px;font-weight:700;margin:22px 0 12px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .dep-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--border)}
  .dep-row:last-child{border-bottom:none}
  .dep-ico{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .di-green{background:rgba(34,197,94,.12);color:var(--green)}
  .di-gray {background:rgba(90,106,138,.1); color:var(--muted)}
  .dep-name{font-size:13px;font-weight:600}
  .dep-hash{font-size:11px;color:var(--muted);font-family:var(--mono)}
  .active-tag{margin-left:auto;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(34,197,94,.1);color:var(--green);white-space:nowrap}
  .rollback{margin-left:auto;font-size:11px;font-weight:700;color:var(--accent2);cursor:pointer;padding:4px 10px;border-radius:6px;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.07);transition:all .18s;white-space:nowrap}
  .rollback:hover{background:rgba(59,130,246,.18)}

  .right-col{display:flex;flex-direction:column;gap:16px}
  .panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}
  .panel-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .panel-title{font-size:14px;font-weight:700}
  .env-row{margin-bottom:12px}
  .env-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
  .env-wrap{display:flex;align-items:center;gap:6px}
  .env-input{flex:1;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--text);font-family:var(--sans);outline:none;min-width:0}
  .env-ibtn{width:30px;height:30px;border-radius:6px;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:color .2s;flex-shrink:0}
  .env-ibtn:hover{color:var(--text)}
  .save-btn{width:100%;padding:9px;border-radius:8px;background:var(--surface3);border:1px solid var(--border2);color:var(--text);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--sans);transition:all .2s;margin-top:14px}
  .save-btn:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
  .save-btn:disabled{opacity:.5;cursor:not-allowed}

  .res-lbl-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
  .res-bar{height:5px;background:var(--surface3);border-radius:4px;overflow:hidden;margin-bottom:14px}
  .res-fill{height:100%;border-radius:4px}
  .res-note{font-size:10px;color:var(--muted);font-style:italic;margin-top:2px}

  .form-row{margin-bottom:14px}
  .form-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:block}
  .form-input{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text);font-family:var(--sans);outline:none;transition:border-color .2s}
  .form-input:focus{border-color:var(--accent)}

  .skeleton{background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

  .mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);padding:8px 0 16px;z-index:100}
  .mob-items{display:flex;justify-content:space-around}
  .mob-item{display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--muted);cursor:pointer;font-size:10px;font-weight:600;padding:6px 14px;transition:color .18s}
  .mob-item.active{color:var(--accent2)}

  .fade-in{animation:fadeIn .3s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  @media(max-width:900px){
    .grid{grid-template-columns:1fr}
    .mob-nav{display:block}
    .body{padding:16px 16px 80px}
  }
  @media(max-width:600px){.app-hdr{flex-direction:column}.app-title{font-size:18px}}
`;

const BADGE_CLS = { running:"b-running", building:"b-building", failed:"b-failed", stopped:"b-stopped" };

export default function AppDetailPage({ app, onBack }) {
  const [tab, setTab]           = useState("logs");
  const [show, setShow]         = useState({});
  const [logs, setLogs]         = useState([]);
  const [deploys, setDeploys]   = useState([]);
  const [envVars, setEnvVars]   = useState([]);
  const [envLoading, setEnvLoading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [redeploying, setRedeploying] = useState(false);
  const [settings, setSettings] = useState({ name: app?.name || "", branch:"main", root_dir:"/" });
  const [mobTab, setMobTab]     = useState("logs");
  const logRef = useRef(null);
  const socketRef = useRef(null);

  // ── Auto-scroll logs ──────────────────────────────────────────
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  // ── Connect socket.io for live build logs ────────────────────
  useEffect(() => {
    if (!app?.id) return;

    socketRef.current = io("http://psnlprojects.fun", {
      auth: { token: localStorage.getItem("token") },
    });

    // Subscribe to this app's build room
    socketRef.current.emit("subscribe", app.id);

    // Receive live log lines from backend worker
    socketRef.current.on("build-log", (line) => {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: line, type: detectType(line) }]);
    });

    socketRef.current.on("build-complete", () => {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: "✓ Build complete!", type: "success" }]);
    });

    socketRef.current.on("build-error", (msg) => {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: msg, type: "error" }]);
    });

    return () => {
      socketRef.current?.emit("unsubscribe", app.id);
      socketRef.current?.disconnect();
    };
  }, [app?.id]);

  // ── Fetch deployments when tab changes ───────────────────────
  useEffect(() => {
    if (tab === "deployments") fetchDeployments();
    if (tab === "logs")        fetchLogs();
  }, [tab]);

  // ── Fetch env vars ───────────────────────────────────────────
  useEffect(() => {
    if (app?.id) fetchEnvVars();
  }, [app?.id]);

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/api/apps/${app.id}/deployments`);
      // Get logs from the latest deployment
      if (res.data.length > 0) {
        const latest = res.data[0];
        const rawLogs = (latest.logs || "").split("\n").filter(Boolean);
        setLogs(rawLogs.map(line => ({
          time: "", text: line, type: detectType(line)
        })));
      }
    } catch (_) {}
  };

  const fetchDeployments = async () => {
    try {
      const res = await api.get(`/api/apps/${app.id}/deployments`);
      setDeploys(res.data);
    } catch (_) {}
  };

  const fetchEnvVars = async () => {
    try {
      const res = await api.get(`/api/apps/${app.id}/env`);
      setEnvVars(res.data); // [{key, value}]
    } catch (_) {}
  };

  const saveEnvVars = async () => {
    try {
      setSaving(true);
      await api.post(`/api/apps/${app.id}/env`, { env: envVars });
    } catch (_) {} finally { setSaving(false); }
  };

  const redeploy = async () => {
    try {
      setRedeploying(true);
      setTab("logs");
      setLogs([{ time: new Date().toLocaleTimeString(), text: "Triggering redeploy...", type: "info" }]);
      await api.post(`/api/apps/${app.id}/redeploy`);
    } catch (_) {} finally { setRedeploying(false); }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await api.put(`/api/apps/${app.id}`, settings);
    } catch (_) {} finally { setSaving(false); }
  };

  const deleteApp = async () => {
    if (!window.confirm(`Delete ${app.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/apps/${app.id}`);
      onBack && onBack();
    } catch (_) {}
  };

  const downloadLogs = () => {
    const text = logs.map(l => `${l.time} ${l.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `${app?.name}-build.log`; a.click();
  };

  const detectType = (line) => {
    const l = line.toLowerCase();
    if (l.includes("error") || l.includes("failed")) return "error";
    if (l.includes("success") || l.includes("complete") || l.includes("✓")) return "success";
    if (l.includes("warn"))   return "warn";
    if (l.includes("info") || l.startsWith(">") || l.includes("npm")) return "info";
    return "plain";
  };

  const badge = BADGE_CLS[app?.status] || "b-stopped";

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="logo" onClick={onBack}>
            <div className="logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div>
            <span className="logo-text">CloudDeployLite</span>
          </div>
          <div className="nav-right">
            <div className="sys-badge">SYSTEM NORMAL</div>
            <div className="icon-btn"><Icon d={I.bell} size={14}/></div>
            <div className="avatar">ME</div>
          </div>
        </nav>

        <div className="body fade-in">

          <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>
            <Icon d={I.arrowl} size={13}/>Back to Dashboard
          </button>

          {/* APP HEADER */}
          <div className="app-hdr">
            <div className="app-info">
              <div className="app-big-icon" style={{width:60,height:60,background:"#3b82f618"}}>
                <Icon d={I.server} size={26} color="#3b82f6"/>
              </div>
              <div>
                <div className="app-title">
                  {app?.name}
                  <span className={`badge ${badge}`}>{app?.status}</span>
                </div>
                <div className="app-meta">
                  <Icon d={I.refresh} size={12}/>
                  Last deployed&nbsp;
                  {app?.created_at ? new Date(app.created_at).toLocaleString() : "—"}
                  &nbsp;from <span className="code-tag">main</span>
                </div>
              </div>
            </div>
            <div className="hdr-acts">
              <button className="btn btn-ghost"
                onClick={() => window.open(`https://${app?.subdomain}.clouddeploylite.io`)}>
                <Icon d={I.external} size={14}/>Visit Site
              </button>
              <button className="btn btn-primary" onClick={redeploy} disabled={redeploying}>
                <Icon d={I.refresh} size={14}/>{redeploying ? "Redeploying..." : "Redeploy"}
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {[["logs","Logs",I.activity],["deployments","Deployments",I.layers],["settings","Settings",I.settings]].map(([id,lb,ic])=>(
              <div key={id} className={`tab ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
                <Icon d={ic} size={13}/>{lb}
              </div>
            ))}
          </div>

          {/* ── LOGS TAB ── */}
          {tab === "logs" && (
            <div className="grid">
              <div>
                {/* TERMINAL */}
                <div className="terminal">
                  <div className="term-hdr">
                    <div className="term-dots">
                      {["#f87171","#fbbf24","#4ade80"].map((c,i)=>(
                        <div key={i} className="term-dot" style={{background:c}}/>
                      ))}
                    </div>
                    <span className="term-title">BUILD LOG — LIVE</span>
                    <div className="term-right">
                      {app?.status === "building" && <span className="live-dot">LIVE</span>}
                      <div className="icon-btn" style={{width:26,height:26}} onClick={downloadLogs}>
                        <Icon d={I.download} size={12}/>
                      </div>
                    </div>
                  </div>
                  <div className="term-body" ref={logRef}>
                    {logs.length === 0 ? (
                      <div style={{color:"var(--muted)",fontSize:11,marginTop:8}}>
                        No logs yet. Trigger a deployment to see live output.
                      </div>
                    ) : logs.map((l, i) => (
                      <div className="log-row" key={i}>
                        {l.time && <span className="lt">{l.time}</span>}
                        {l.type==="info"    && <span className="li">INFO   </span>}
                        {l.type==="success" && <span className="ls">SUCCESS</span>}
                        {l.type==="warn"    && <span className="lw">WARN   </span>}
                        {l.type==="error"   && <span className="le">ERROR  </span>}
                        <span className="lx">{l.text}</span>
                      </div>
                    ))}
                    {app?.status === "building" && (
                      <div className="log-row">
                        <span className="log-cursor"/>
                      </div>
                    )}
                  </div>
                </div>

                {/* RECENT DEPLOYS */}
                <div className="sec-title">Recent Deployments</div>
                <div className="card">
                  {deploys.slice(0,3).length === 0 ? (
                    <div style={{padding:20,textAlign:"center",color:"var(--muted)",fontSize:13}}>No deployments yet.</div>
                  ) : deploys.slice(0,3).map((d, idx) => (
                    <div className="dep-row" key={d.id}>
                      <div className={`dep-ico ${idx===0?"di-green":"di-gray"}`}>
                        <Icon d={idx===0 ? I.check : I.refresh} size={13}/>
                      </div>
                      <div>
                        <div className="dep-name">Production</div>
                        <div className="dep-hash">
                          {d.status} • {new Date(d.created_at).toLocaleString()}
                        </div>
                      </div>
                      {idx === 0
                        ? <span className="active-tag">ACTIVE</span>
                        : <div className="rollback">Rollback</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="right-col">

                {/* ENV VARS */}
                <div className="panel">
                  <div className="panel-hdr">
                    <div className="panel-title">Environment Variables</div>
                    <div className="icon-btn"
                      onClick={() => setEnvVars(v => [...v, {key:"", value:""}])}>
                      <Icon d={I.plus} size={14}/>
                    </div>
                  </div>

                  {envVars.length === 0 && (
                    <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>
                      No environment variables set.
                    </div>
                  )}

                  {envVars.map((ev, i) => (
                    <div className="env-row" key={i}>
                      <div className="env-lbl">
                        <input
                          style={{background:"transparent",border:"none",outline:"none",color:"var(--muted)",fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",width:"100%",fontFamily:"var(--mono)"}}
                          value={ev.key}
                          onChange={e => setEnvVars(v => v.map((x,j)=>j===i?{...x,key:e.target.value}:x))}
                          placeholder="KEY"
                        />
                      </div>
                      <div className="env-wrap">
                        <input
                          className="env-input"
                          type={show[i] ? "text" : "password"}
                          value={ev.value}
                          onChange={e => setEnvVars(v => v.map((x,j)=>j===i?{...x,value:e.target.value}:x))}
                          placeholder="value"
                        />
                        <div className="env-ibtn" onClick={()=>setShow(s=>({...s,[i]:!s[i]}))}>
                          <Icon d={show[i]?I.eyeoff:I.eye} size={13}/>
                        </div>
                        <div className="env-ibtn"
                          style={{borderColor:"rgba(239,68,68,.3)",color:"var(--red)"}}
                          onClick={() => setEnvVars(v => v.filter((_,j)=>j!==i))}>
                          <Icon d={I.trash} size={12}/>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="save-btn" onClick={saveEnvVars} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* RESOURCE USAGE */}
                <div className="panel">
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:18}}>
                    Resource Usage
                  </div>
                  {[
                    {lbl:"Memory (RAM)", val:"128MB / 512MB", pct:25, col:"#3b82f6"},
                    {lbl:"CPU Load",     val:"4.2%",           pct:4,  col:"#f59e0b"},
                  ].map(r => (
                    <div key={r.lbl}>
                      <div className="res-lbl-row">
                        <span>{r.lbl}</span>
                        <span style={{fontWeight:700,color:r.col}}>{r.val}</span>
                      </div>
                      <div className="res-bar"><div className="res-fill" style={{width:r.pct+"%",background:r.col}}/></div>
                    </div>
                  ))}
                  <div className="res-note">Auto-scaling enabled based on current traffic.</div>
                </div>
              </div>
            </div>
          )}

          {/* ── DEPLOYMENTS TAB ── */}
          {tab === "deployments" && (
            <div className="card fade-in">
              {deploys.length === 0 ? (
                <div style={{padding:32,textAlign:"center",color:"var(--muted)",fontSize:13}}>
                  No deployments found.
                </div>
              ) : deploys.map((d, idx) => (
                <div className="dep-row" key={d.id}>
                  <div className={`dep-ico ${idx===0?"di-green":"di-gray"}`}>
                    <Icon d={idx===0?I.check:I.refresh} size={13}/>
                  </div>
                  <div>
                    <div className="dep-name">
                      {d.status.charAt(0).toUpperCase()+d.status.slice(1)}
                    </div>
                    <div className="dep-hash">
                      id: {d.id} • {new Date(d.created_at).toLocaleString()}
                    </div>
                  </div>
                  {idx === 0
                    ? <span className="active-tag">ACTIVE</span>
                    : <div className="rollback">Rollback</div>
                  }
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div className="fade-in" style={{maxWidth:520}}>
              {[
                ["App Name",       "name",     "text"],
                ["Branch",         "branch",   "text"],
                ["Root Directory", "root_dir", "text"],
              ].map(([lbl,key,type])=>(
                <div className="form-row" key={key}>
                  <label className="form-lbl">{lbl}</label>
                  <input
                    className="form-input" type={type}
                    value={settings[key] || ""}
                    onChange={e => setSettings(s=>({...s,[key]:e.target.value}))}
                  />
                </div>
              ))}

              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                <button className="btn btn-danger" onClick={deleteApp}>
                  <Icon d={I.trash} size={13}/>Delete App
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          <div className="mob-items">
            {[["logs","Logs",I.activity],["deployments","Deploys",I.layers],["settings","Settings",I.settings],["back","Back",I.arrowl]].map(([id,lb,ic])=>(
              <div key={id} className={`mob-item ${mobTab===id?"active":""}`}
                onClick={()=>{ if(id==="back"){ onBack&&onBack(); }else{ setMobTab(id); setTab(id); } }}>
                <Icon d={ic} size={20}/>{lb}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}