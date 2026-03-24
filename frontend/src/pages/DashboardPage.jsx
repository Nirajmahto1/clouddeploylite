import { useState, useEffect } from "react";
import api from "../api/axios";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  grid:    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  rocket:  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  settings:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  docs:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  chart:   "M18 20V10 M12 20V4 M6 20v-6",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  plus:    "M12 5v14 M5 12h14",
  search:  "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  link:    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  external:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  server:  "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers:  "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  check:   "M20 6L9 17l-5-5",
  dots:    "M12 5h.01 M12 12h.01 M12 19h.01",
  logout:  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
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

  .wrap{display:flex;min-height:100vh}

  .sidebar{width:220px;flex-shrink:0;border-right:1px solid var(--border);padding:16px 10px;display:flex;flex-direction:column;gap:3px;position:sticky;top:0;height:100vh;overflow-y:auto}
  .s-logo{display:flex;align-items:center;gap:10px;padding:8px 12px 18px}
  .s-logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:7px;display:flex;align-items:center;justify-content:center}
  .s-logo-text{font-family:var(--mono);font-size:12px;font-weight:700}
  .s-sub{font-size:11px;color:var(--muted)}
  .s-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer;transition:all .18s}
  .s-item:hover{background:var(--surface2);color:var(--text)}
  .s-item.active{background:rgba(59,130,246,.13);color:var(--accent2)}
  .s-div{height:1px;background:var(--border);margin:10px 2px}
  .s-usage{margin-top:auto;padding:14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px}
  .usage-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--muted);text-transform:uppercase;margin-bottom:6px}
  .usage-bar{height:4px;background:var(--surface3);border-radius:4px;overflow:hidden;margin:8px 0 4px}
  .usage-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--cyan));border-radius:4px}
  .upgrade-btn{width:100%;padding:8px;border-radius:7px;background:var(--accent);border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;margin-top:10px;font-family:var(--sans);transition:background .2s}
  .upgrade-btn:hover{background:#2563eb}

  .right{flex:1;display:flex;flex-direction:column;min-width:0}
  .topnav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:rgba(8,12,24,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
  .search-wrap{position:relative}
  .search-wrap input{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 12px 7px 34px;font-size:13px;color:var(--text);font-family:var(--sans);width:240px;outline:none;transition:border-color .2s}
  .search-wrap input:focus{border-color:var(--accent)}
  .search-wrap input::placeholder{color:var(--muted)}
  .search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
  .nav-right{display:flex;align-items:center;gap:10px}
  .icon-btn{width:34px;height:34px;border-radius:8px;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .2s}
  .icon-btn:hover{color:var(--text);border-color:var(--border2)}
  .avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:var(--mono)}
  .sys-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.18);font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--green)}
  .sys-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

  .main{flex:1;padding:28px;overflow-y:auto}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--sans);transition:all .18s;white-space:nowrap}
  .btn-primary{background:var(--accent);color:#fff}
  .btn-primary:hover{background:#2563eb}
  .btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
  .btn-ghost:hover{background:var(--surface3)}

  .page-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:26px;flex-wrap:wrap;gap:14px}
  .page-title{font-size:24px;font-weight:700}
  .page-sub{font-size:13px;color:var(--muted);margin-top:3px}

  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px}
  .stat{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px}
  .stat-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
  .stat-val{font-size:32px;font-weight:700;line-height:1}
  .stat-delta{display:inline-flex;align-items:center;margin-top:8px;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px}
  .delta-up{background:rgba(34,197,94,.1);color:var(--green)}
  .delta-dn{background:rgba(239,68,68,.1);color:var(--red)}

  .card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .tbl-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{padding:10px 16px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--border);white-space:nowrap}
  td{padding:14px 16px;border-bottom:1px solid var(--border);vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(255,255,255,.015);cursor:pointer}
  .app-cell{display:flex;align-items:center;gap:10px}
  .app-ico{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .app-name{font-weight:600}
  .sub-link{color:var(--accent2);font-size:12px;display:flex;align-items:center;gap:4px}

  .badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
  .badge::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
  .b-running {background:rgba(34,197,94,.1); color:var(--green)}
  .b-building{background:rgba(245,158,11,.1);color:var(--yellow)}
  .b-failed  {background:rgba(239,68,68,.1); color:var(--red)}
  .b-idle    {background:rgba(90,106,138,.1);color:var(--muted)}

  .tbl-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--border)}

  .sec-title{font-size:16px;font-weight:700;margin:26px 0 14px}
  .activity{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden}
  .act-item{display:flex;align-items:flex-start;gap:12px;padding:16px;border-bottom:1px solid var(--border)}
  .act-item:last-child{border-bottom:none}
  .act-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .ad-blue {background:rgba(59,130,246,.14);color:var(--accent)}
  .ad-green{background:rgba(34,197,94,.12); color:var(--green)}
  .ad-red  {background:rgba(239,68,68,.12); color:var(--red)}
  .act-title{font-size:13px;font-weight:600;margin-bottom:2px}
  .act-sub  {font-size:11px;color:var(--muted)}
  .act-time {font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-top:4px}

  .skeleton{background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .err-box{padding:20px;text-align:center;color:var(--red);font-size:13px}

  .mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);padding:8px 0 16px;z-index:100}
  .mob-items{display:flex;justify-content:space-around}
  .mob-item{display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--muted);cursor:pointer;font-size:10px;font-weight:600;padding:6px 14px;transition:color .18s}
  .mob-item.active{color:var(--accent2)}

  .fade-in{animation:fadeIn .3s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  @media(max-width:900px){
    .sidebar{display:none}
    .mob-nav{display:block}
    .main{padding:16px 16px 80px}
    .stats{grid-template-columns:repeat(2,1fr)}
    th:nth-child(4),td:nth-child(4),th:nth-child(5),td:nth-child(5){display:none}
  }
  @media(max-width:600px){
    .stats{grid-template-columns:1fr}
    .search-wrap input{width:160px}
  }
`;

const ICON_COLORS = ["#3b82f6","#8b5cf6","#06b6d4","#ef4444","#22c55e","#f59e0b"];
const APP_ICONS   = ["server","activity","zap","layers","cloud"];
const BADGE_CLS   = { running:"b-running", building:"b-building", failed:"b-failed", stopped:"b-idle" };

const NAV = [
  {id:"dashboard",icon:"grid",   lbl:"Dashboard"},
  {id:"deploy",   icon:"rocket", lbl:"Deploy New App"},
  {id:"analytics",icon:"chart",  lbl:"Analytics"},
  {id:"settings", icon:"settings",lbl:"Settings"},
  {id:"docs",     icon:"docs",   lbl:"Docs"},
];
const MOB = [
  {id:"dashboard",icon:"grid",   lbl:"Apps"},
  {id:"deploy",   icon:"cloud",  lbl:"Deploy"},
  {id:"logs",     icon:"activity",lbl:"Logs"},
  {id:"settings", icon:"settings",lbl:"Settings"},
];

export default function DashboardPage({ user, onLogout, onSelectApp, onNavigate }) {
  const [active, setActive]     = useState("dashboard");
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const PER_PAGE = 5;

  // ── Fetch apps from backend ──────────────────────────────────
  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/apps");
      setApps(
  Array.isArray(res.data.apps)
    ? res.data.apps                // multiple apps
    : res.data.app
    ? [res.data.app]              // single app
    : []                          // fallback
);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load apps.");
    } finally {
      setLoading(false);
    }
  };
console.log(apps);
  const navigate = (id) => {
    setActive(id);
    onNavigate && onNavigate(id);
  };

  // Filter + paginate
  const filtered = apps.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.subdomain?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible    = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  // Stats
  const running  = apps.filter(a => a.status === "running").length;
  const failed   = apps.filter(a => a.status === "failed").length;

  const initials = user?.username ? user.username.slice(0,2).toUpperCase() : "??";

  return (
    <>
      <style>{css}</style>
      <div className="wrap">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="s-logo">
            <div className="s-logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div>
            <div>
              <div className="s-logo-text">CloudDeployLite</div>
              <div className="s-sub">Developer Console</div>
            </div>
          </div>
          {NAV.map(n => (
            <div key={n.id} className={`s-item ${active===n.id?"active":""}`} onClick={()=>navigate(n.id)}>
              <Icon d={I[n.icon]} size={15}/>{n.lbl}
            </div>
          ))}
          <div className="s-div"/>
          <div className="s-item" onClick={onLogout} style={{color:"var(--red)"}}>
            <Icon d={I.logout} size={15}/>Logout
          </div>
          <div className="s-usage">
            <div className="usage-lbl">Usage</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>
              {apps.length} Apps Deployed
            </div>
            <div className="usage-bar">
              <div className="usage-fill" style={{width: Math.min((apps.length/10)*100,100)+"%" }}/>
            </div>
            <button className="upgrade-btn">Upgrade Plan</button>
          </div>
        </aside>

        <div className="right">
          {/* TOP NAV */}
          <div className="topnav">
            <div className="search-wrap">
              <span className="search-ico"><Icon d={I.search} size={14}/></span>
              <input
                placeholder="Search apps, deployments..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="nav-right">
              <div className="sys-badge">SYSTEM NORMAL</div>
              <div className="icon-btn" onClick={fetchApps}><Icon d={I.refresh} size={14}/></div>
              <div className="icon-btn"><Icon d={I.bell} size={15}/></div>
              <div className="avatar">{initials}</div>
            </div>
          </div>

          {/* MAIN */}
          <div className="main fade-in">
            <div className="page-hdr">
              <div>
                <div className="page-title">Projects</div>
                <div className="page-sub">Manage and monitor your cloud infrastructure in real-time.</div>
              </div>
              <button className="btn btn-primary" onClick={()=>navigate("deploy")}>
                <Icon d={I.plus} size={14}/>Deploy New App
              </button>
            </div>

            {/* STATS */}
            <div className="stats">
              <div className="stat">
                <div className="stat-lbl">Total Apps</div>
                <div className="stat-val">{loading ? <span className="skeleton" style={{display:"inline-block",width:40,height:32}}/> : apps.length}</div>
                
              </div>
              <div className="stat">
                <div className="stat-lbl">Running Instances</div>
                <div className="stat-val">{loading ? <span className="skeleton" style={{display:"inline-block",width:40,height:32}}/> : running}</div>
                <div className="stat-delta delta-up">Active</div>
              </div>
              <div className="stat">
                <div className="stat-lbl">Build Failures</div>
                <div className="stat-val">{loading ? <span className="skeleton" style={{display:"inline-block",width:40,height:32}}/> : failed}</div>
                <div className={`stat-delta ${failed>0?"delta-dn":"delta-up"}`}>{failed>0?"Check logs":"All good"}</div>
              </div>
            </div>

            {/* APPS TABLE */}
            <div className="card">
              {error && <div className="err-box">{error} <button className="btn btn-ghost" style={{marginLeft:10,padding:"4px 10px",fontSize:12}} onClick={fetchApps}>Retry</button></div>}

              {loading ? (
                <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
                  {[1,2,3].map(i => (
                    <div key={i} className="skeleton" style={{height:42,borderRadius:8}}/>
                  ))}
                </div>
              ) : !error && (
                <div className="tbl-wrap">
                  <table>
                    <thead><tr>
                      <th>App Name</th>
                      <th>Subdomain URL</th>
                      <th>Status</th>
                      <th>Runtime</th>
                      <th>Last Deployed</th>
                      <th></th>
                    </tr></thead>
                    <tbody>
                      {visible.length === 0 ? (
                        <tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)",padding:32}}>
                          {search ? "No apps match your search." : "No apps yet. Deploy your first one!"}
                        </td></tr>
                      ) : visible.map((app, idx) => {
                        const color = ICON_COLORS[idx % ICON_COLORS.length];
                        const icon  = APP_ICONS[idx  % APP_ICONS.length];
                        const badge = BADGE_CLS[app.status] || "b-idle";
                        return (
                          <tr key={app.id} onClick={() => onSelectApp && onSelectApp(app)}>
                            <td>
                              <div className="app-cell">
                                <div className="app-ico" style={{background:color+"1e"}}>
                                  <Icon d={I[icon]} size={15} color={color}/>
                                </div>
                                <span className="app-name">{app.name}</span>
                              </div>
                            </td>
                            <td>
                              <div className="sub-link">
                                <Icon d={I.link} size={11}/>
                                {app.subdomain}.clouddeploylite.io
                                <Icon d={I.external} size={11}/>
                              </div>
                            </td>
                            <td><span className={`badge ${badge}`}>{app.status}</span></td>
                            <td style={{fontSize:12,color:"var(--muted)"}}>{app.runtime || "—"}</td>
                            <td style={{fontSize:12,color:"var(--muted)"}}>
                              {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                            </td>
                            <td>
                              <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)"}}>
                                <Icon d={I.dots} size={16}/>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && !error && filtered.length > PER_PAGE && (
                <div className="tbl-footer">
                  <span style={{fontSize:12,color:"var(--muted)"}}>
                    Showing {Math.min(visible.length, filtered.length)} of {filtered.length} apps
                  </span>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}}
                      disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button>
                    <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}}
                      disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
                  </div>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITY — pulled from apps' deployments */}
            <div className="sec-title">Recent Activity</div>
            <div className="activity">
              {apps.slice(0,3).map((app, i) => (
                <div className="act-item" key={app.id}>
                  <div className={`act-dot ${i===0?"ad-blue":i===1?"ad-green":"ad-red"}`}>
                    <Icon d={I[i===0?"rocket":i===1?"check":"zap"]} size={14}/>
                  </div>
                  <div>
                    <div className="act-title">
                      {app.status==="running" ? `${app.name} is live` :
                       app.status==="building"? `${app.name} is building...` :
                       app.status==="failed"  ? `${app.name} build failed` :
                       `${app.name} deployed`}
                    </div>
                    <div className="act-sub">{app.subdomain}.clouddeploylite.io</div>
                    <div className="act-time">{app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}</div>
                  </div>
                </div>
              ))}
              {apps.length === 0 && !loading && (
                <div style={{padding:24,textAlign:"center",color:"var(--muted)",fontSize:13}}>
                  No activity yet. Deploy your first app!
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MOBILE NAV */}
        <nav className="mob-nav">
          <div className="mob-items">
            {MOB.map(m => (
              <div key={m.id} className={`mob-item ${active===m.id?"active":""}`} onClick={()=>navigate(m.id)}>
                <Icon d={I[m.icon]} size={20}/>{m.lbl}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}