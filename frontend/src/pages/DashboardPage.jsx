import { useState } from "react";

// ─── Icon primitive ───────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  grid:    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  rocket:  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
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
  x:       "M18 6L6 18 M6 6l12 12",
  dots:    "M12 5h.01 M12 12h.01 M12 19h.01",
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

// ─── Styles ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:      #080c18;
    --surface: #0f1623;
    --surface2:#161e2e;
    --surface3:#1c2640;
    --border:  #1c2640;
    --border2: #243352;
    --text:    #dce8ff;
    --muted:   #5a6a8a;
    --accent:  #3b82f6;
    --accent2: #60a5fa;
    --green:   #22c55e;
    --red:     #ef4444;
    --yellow:  #f59e0b;
    --cyan:    #06b6d4;
    --mono:    'Space Mono', monospace;
    --sans:    'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:var(--sans); background:var(--bg); color:var(--text); -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  .page-wrap { display:flex; min-height:100vh; }

  /* ── SIDEBAR ── */
  .sidebar { width:220px; flex-shrink:0; border-right:1px solid var(--border); padding:16px 10px; display:flex; flex-direction:column; gap:3px; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .sidebar-logo { display:flex; align-items:center; gap:10px; padding:10px 12px 18px; }
  .sidebar-logo-icon { width:30px; height:30px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius:7px; display:flex; align-items:center; justify-content:center; }
  .sidebar-logo-text { font-family:var(--mono); font-size:12px; font-weight:700; }
  .sidebar-label { font-size:11px; color:var(--text); font-weight:600; padding:2px 12px 8px; }
  .sidebar-sub { font-size:11px; color:var(--muted); }
  .s-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; font-size:13px; font-weight:500; color:var(--muted); cursor:pointer; transition:all .18s; }
  .s-item:hover { background:var(--surface2); color:var(--text); }
  .s-item.active { background:rgba(59,130,246,.13); color:var(--accent2); }
  .s-divider { height:1px; background:var(--border); margin:10px 2px; }
  .s-usage { margin-top:auto; padding:14px; background:var(--surface2); border:1px solid var(--border); border-radius:10px; }
  .usage-lbl { font-size:10px; font-weight:700; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:6px; }
  .usage-bar { height:4px; background:var(--surface3); border-radius:4px; overflow:hidden; margin:8px 0 4px; }
  .usage-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--cyan)); border-radius:4px; }
  .usage-text { font-size:11px; color:var(--muted); }
  .upgrade-btn { width:100%; padding:8px; border-radius:7px; background:var(--accent); border:none; color:#fff; font-size:12px; font-weight:700; cursor:pointer; margin-top:10px; font-family:var(--sans); transition:background .2s; }
  .upgrade-btn:hover { background:#2563eb; }

  /* ── NAV BAR (top) ── */
  .topnav { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:56px; background:rgba(8,12,24,.9); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
  .topnav-search { position:relative; }
  .topnav-search input { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:7px 12px 7px 34px; font-size:13px; color:var(--text); font-family:var(--sans); width:260px; outline:none; transition:border-color .2s; }
  .topnav-search input:focus { border-color:var(--accent); }
  .topnav-search input::placeholder { color:var(--muted); }
  .search-ico { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
  .topnav-right { display:flex; align-items:center; gap:10px; }
  .icon-btn { width:34px; height:34px; border-radius:8px; border:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .2s; }
  .icon-btn:hover { color:var(--text); border-color:var(--border2); }
  .avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; cursor:pointer; font-family:var(--mono); }
  .sys-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.18); font-size:11px; font-weight:700; letter-spacing:.06em; color:var(--green); }
  .sys-badge::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  /* ── MAIN ── */
  .main { flex:1; overflow-y:auto; }
  .main-inner { padding:28px; max-width:1000px; }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:var(--sans); transition:all .18s; white-space:nowrap; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#2563eb; }
  .btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border2); }
  .btn-ghost:hover { background:var(--surface3); }

  /* PAGE HEADER */
  .page-hdr { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:26px; flex-wrap:wrap; gap:14px; }
  .page-title { font-size:24px; font-weight:700; }
  .page-sub { font-size:13px; color:var(--muted); margin-top:3px; }
  .hdr-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

  /* STATS */
  .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:26px; }
  .stat { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }
  .stat-lbl { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
  .stat-val { font-size:32px; font-weight:700; line-height:1; }
  .stat-delta { display:inline-flex; align-items:center; margin-top:8px; font-size:11px; font-weight:700; padding:2px 8px; border-radius:20px; }
  .delta-up { background:rgba(34,197,94,.1); color:var(--green); }
  .delta-dn { background:rgba(239,68,68,.1); color:var(--red); }

  /* TABLE */
  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .tbl-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th { padding:10px 16px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); border-bottom:1px solid var(--border); white-space:nowrap; }
  td { padding:14px 16px; border-bottom:1px solid var(--border); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(255,255,255,.015); cursor:pointer; }
  .app-cell { display:flex; align-items:center; gap:10px; }
  .app-ico { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .app-name { font-weight:600; }
  .sub-link { color:var(--accent2); font-size:12px; display:flex; align-items:center; gap:4px; }

  /* BADGES */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
  .badge::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .b-running  { background:rgba(34,197,94,.1);  color:var(--green); }
  .b-building { background:rgba(245,158,11,.1); color:var(--yellow); }
  .b-failed   { background:rgba(239,68,68,.1);  color:var(--red); }
  .b-idle     { background:rgba(90,106,138,.1); color:var(--muted); }

  /* PAGINATION */
  .tbl-footer { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-top:1px solid var(--border); }
  .tbl-info { font-size:12px; color:var(--muted); }

  /* ACTIVITY */
  .section-title { font-size:16px; font-weight:700; margin:28px 0 14px; }
  .activity { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .act-item { display:flex; align-items:flex-start; gap:12px; padding:16px; border-bottom:1px solid var(--border); }
  .act-item:last-child { border-bottom:none; }
  .act-dot { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ad-blue  { background:rgba(59,130,246,.14); color:var(--accent); }
  .ad-green { background:rgba(34,197,94,.12);  color:var(--green); }
  .ad-red   { background:rgba(239,68,68,.12);  color:var(--red); }
  .act-title { font-size:13px; font-weight:600; margin-bottom:2px; }
  .act-sub   { font-size:11px; color:var(--muted); }
  .act-time  { font-size:10px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--muted); margin-top:4px; }

  /* MOBILE BOTTOM NAV */
  .mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:8px 0 16px; z-index:100; }
  .mob-nav-items { display:flex; justify-content:space-around; }
  .mob-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px 14px; color:var(--muted); cursor:pointer; font-size:10px; font-weight:600; letter-spacing:.04em; transition:color .18s; }
  .mob-item.active { color:var(--accent2); }

  .fade-in { animation:fadeIn .3s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  @media (max-width: 900px) {
    .sidebar { display:none; }
    .mob-nav { display:block; }
    .main-inner { padding:16px 16px 80px; }
    .stats { grid-template-columns:repeat(2,1fr); }
    th:nth-child(4), td:nth-child(4),
    th:nth-child(5), td:nth-child(5) { display:none; }
  }
  @media (max-width: 600px) {
    .stats { grid-template-columns:1fr; }
    .hdr-right { flex-direction:column; align-items:flex-start; }
    .topnav-search input { width:160px; }
  }
`;

// ─── Static data ─────────────────────────────────────────────────────────
const APPS = [
  { id:1, name:"Auth-Service",      sub:"auth.deploylite.app",      status:"running",  rt:"Node.js 18.x", ago:"2 mins ago",  col:"#3b82f6", icon:"server" },
  { id:2, name:"Data-Worker",       sub:"worker-01.deploylite.app", status:"building", rt:"Python 3.11",  ago:"10 mins ago", col:"#8b5cf6", icon:"activity" },
  { id:3, name:"Frontend-Main",     sub:"main.deploylite.app",      status:"running",  rt:"Next.js",      ago:"1 hour ago",  col:"#06b6d4", icon:"server" },
  { id:4, name:"Legacy-API",        sub:"api-v1.deploylite.app",    status:"failed",   rt:"Python 2.7",   ago:"Yesterday",   col:"#ef4444", icon:"zap" },
  { id:5, name:"Inventory-DB-Hook", sub:"hooks.deploylite.app",     status:"running",  rt:"Go 1.21",      ago:"3 days ago",  col:"#22c55e", icon:"layers" },
];

const ACTIVITY = [
  { icon:"rocket", bg:"ad-blue",  title:"Deployment started: Data-Worker",  sub:"Triggered via GitHub Action by @alex_dev",  time:"10 MINS AGO" },
  { icon:"check",  bg:"ad-green", title:"Auth-Service successfully scaled",   sub:"New instance healthy at cluster-us-east-1", time:"2 HOURS AGO" },
  { icon:"x",      bg:"ad-red",   title:"Legacy-API build failed",            sub:"Exit code 1 — missing dependency",          time:"YESTERDAY"   },
];

const BADGE = { running:"b-running", building:"b-building", failed:"b-failed", idle:"b-idle" };

const NAV_ITEMS = [
  { id:"dashboard", icon:"grid",     lbl:"Dashboard" },
  { id:"deploy",    icon:"rocket",   lbl:"Deploy New App" },
  { id:"analytics", icon:"chart",    lbl:"Analytics" },
  { id:"settings",  icon:"settings", lbl:"Settings" },
  { id:"docs",      icon:"docs",     lbl:"Docs" },
];
const MOB_ITEMS = [
  { id:"dashboard", icon:"grid",    lbl:"Apps" },
  { id:"deploy",    icon:"cloud",   lbl:"Deploy" },
  { id:"logs",      icon:"activity",lbl:"Logs" },
  { id:"settings",  icon:"settings",lbl:"Settings" },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function DashboardPage({ onSelectApp, onNavigate }) {
  const [active, setActive] = useState("dashboard");

  const navigate = (id) => { setActive(id); onNavigate && onNavigate(id); };

  return (
    <>
      <style>{css}</style>
      <div className="page-wrap">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div>
            <div>
              <div className="sidebar-logo-text">CloudDeployLite</div>
              <div className="sidebar-sub">Developer Console</div>
            </div>
          </div>

          {NAV_ITEMS.map(n => (
            <div key={n.id} className={`s-item ${active===n.id?"active":""}`} onClick={()=>navigate(n.id)}>
              <Icon d={I[n.icon]} size={15}/>{n.lbl}
            </div>
          ))}

          <div className="s-divider"/>
          <div className="s-usage">
            <div className="usage-lbl">Usage</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>7 of 10 Apps Deployed</div>
            <div className="usage-bar"><div className="usage-fill" style={{width:"70%"}}/></div>
            <button className="upgrade-btn">Upgrade Plan</button>
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

          {/* TOP NAV */}
          <div className="topnav">
            <div className="topnav-search">
              <span className="search-ico"><Icon d={I.search} size={14}/></span>
              <input placeholder="Search apps, deployments..."/>
            </div>
            <div className="topnav-right">
              <div className="sys-badge">SYSTEM NORMAL</div>
              <div className="icon-btn"><Icon d={I.bell} size={15}/></div>
              <div className="icon-btn"><Icon d={I.user} size={15}/></div>
              <div className="avatar">IJ</div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="main">
            <div className="main-inner fade-in">

              <div className="page-hdr">
                <div>
                  <div className="page-title">Projects</div>
                  <div className="page-sub">Manage and monitor your cloud infrastructure in real-time.</div>
                </div>
                <div className="hdr-right">
                  <button className="btn btn-primary" onClick={()=>navigate("deploy")}>
                    <Icon d={I.plus} size={14}/>Deploy New App
                  </button>
                </div>
              </div>

              {/* STATS */}
              <div className="stats">
                {[["Total Apps","12","+20%","up"],["Running Instances","11","+10%","up"],["Build Failures","1","-50%","dn"]].map(([l,v,d,dir])=>(
                  <div className="stat" key={l}>
                    <div className="stat-lbl">{l}</div>
                    <div className="stat-val">{v}</div>
                    <div className={`stat-delta delta-${dir}`}>{d}</div>
                  </div>
                ))}
              </div>

              {/* APPS TABLE */}
              <div className="card">
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
                      {APPS.map(app => (
                        <tr key={app.id} onClick={() => onSelectApp && onSelectApp(app)}>
                          <td>
                            <div className="app-cell">
                              <div className="app-ico" style={{background:app.col+"1e"}}>
                                <Icon d={I[app.icon]||I.server} size={15} color={app.col}/>
                              </div>
                              <span className="app-name">{app.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="sub-link">
                              <Icon d={I.link} size={11}/>{app.sub}
                              <Icon d={I.external} size={11}/>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${BADGE[app.status]||"b-idle"}`}>
                              {app.status[0].toUpperCase()+app.status.slice(1)}
                            </span>
                          </td>
                          <td style={{fontSize:12,color:"var(--muted)"}}>{app.rt}</td>
                          <td style={{fontSize:12,color:"var(--muted)"}}>{app.ago}</td>
                          <td>
                            <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)"}}>
                              <Icon d={I.dots} size={16}/>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="tbl-footer">
                  <span className="tbl-info">Showing 5 of 12 applications</span>
                  <div style={{display:"flex",gap:6}}>
                    <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}}>Previous</button>
                    <button className="btn btn-ghost" style={{padding:"5px 12px",fontSize:12}}>Next</button>
                  </div>
                </div>
              </div>

              {/* ACTIVITY */}
              <div className="section-title">System Activity</div>
              <div className="activity">
                {ACTIVITY.map((a,i) => (
                  <div className="act-item" key={i}>
                    <div className={`act-dot ${a.bg}`}><Icon d={I[a.icon]} size={14}/></div>
                    <div>
                      <div className="act-title">{a.title}</div>
                      <div className="act-sub">{a.sub}</div>
                      <div className="act-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          <div className="mob-nav-items">
            {MOB_ITEMS.map(m => (
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