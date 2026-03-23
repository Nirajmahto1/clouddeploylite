import { useState, useRef, useEffect } from "react";

// ─── Icon primitive ───────────────────────────────────────────────────────
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
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  cpu:     "M9 2H15 M9 22h6 M2 9v6 M22 9v6 M6 12H4 M20 12h-2 M12 6V4 M12 20v-2 M6 6h12v12H6z",
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

  /* WRAPPER */
  .detail-page { min-height:100vh; background:var(--bg); }

  /* TOP NAV */
  .topnav { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:56px; background:rgba(8,12,24,.92); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
  .logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
  .logo-icon { width:30px; height:30px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius:7px; display:flex; align-items:center; justify-content:center; }
  .logo-text { font-family:var(--mono); font-size:12px; font-weight:700; }
  .nav-right { display:flex; align-items:center; gap:9px; }
  .icon-btn { width:32px; height:32px; border-radius:7px; border:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .2s; }
  .icon-btn:hover { color:var(--text); border-color:var(--border2); }
  .avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; font-family:var(--mono); }
  .sys-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.18); font-size:11px; font-weight:700; letter-spacing:.06em; color:var(--green); }
  .sys-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }

  /* BODY */
  .body { padding:28px; max-width:1100px; margin:0 auto; }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:var(--sans); transition:all .18s; white-space:nowrap; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#2563eb; }
  .btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border2); }
  .btn-ghost:hover { background:var(--surface3); }
  .btn-danger { background:rgba(239,68,68,.1); color:var(--red); border:1px solid rgba(239,68,68,.22); }
  .btn-sm { padding:6px 12px; font-size:12px; }

  /* APP HEADER */
  .app-hdr { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:26px; flex-wrap:wrap; gap:16px; }
  .app-info { display:flex; align-items:center; gap:16px; }
  .app-big-icon { width:60px; height:60px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .app-title { font-size:22px; font-weight:700; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .app-meta { font-size:12px; color:var(--muted); margin-top:5px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .code-tag { background:var(--surface2); border:1px solid var(--border2); border-radius:4px; padding:1px 7px; font-family:var(--mono); font-size:11px; color:var(--accent2); }
  .hdr-actions { display:flex; gap:10px; flex-wrap:wrap; }

  /* STATUS BADGE */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
  .badge::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .b-running { background:rgba(34,197,94,.1); color:var(--green); }
  .b-building{ background:rgba(245,158,11,.1);color:var(--yellow); }
  .b-failed  { background:rgba(239,68,68,.1); color:var(--red); }

  /* TABS */
  .tabs { display:flex; gap:2px; border-bottom:1px solid var(--border); margin-bottom:24px; }
  .tab { padding:9px 18px; font-size:13px; font-weight:500; color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .18s; display:flex; align-items:center; gap:6px; }
  .tab.active { color:var(--accent2); border-bottom-color:var(--accent); }
  .tab:hover:not(.active) { color:var(--text); }

  /* 2-COLUMN GRID */
  .detail-grid { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:start; }

  /* TERMINAL */
  .terminal { background:#05080f; border:1px solid #131d2e; border-radius:12px; overflow:hidden; font-family:var(--mono); font-size:11.5px; }
  .term-hdr { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; border-bottom:1px solid #131d2e; background:#07090f; }
  .term-dots { display:flex; gap:6px; }
  .term-dot  { width:11px; height:11px; border-radius:50%; }
  .term-title{ font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
  .term-right{ display:flex; align-items:center; gap:8px; }
  .term-body { padding:14px; height:290px; overflow-y:auto; display:flex; flex-direction:column; gap:3px; }
  .log-row   { display:flex; gap:10px; line-height:1.6; }
  .lt { color:#253d55; flex-shrink:0; min-width:60px; }
  .li { color:var(--accent2); font-weight:700; flex-shrink:0; min-width:58px; }
  .ls { color:var(--green);   font-weight:700; flex-shrink:0; min-width:58px; }
  .ly { color:var(--cyan);    font-weight:700; flex-shrink:0; min-width:58px; }
  .lw { color:var(--yellow);  font-weight:700; flex-shrink:0; min-width:58px; }
  .lp { flex-shrink:0; min-width:58px; }
  .lx { color:#6a8aaa; }
  .log-cursor { display:inline-block; width:7px; height:13px; background:var(--accent2); animation:blink 1s step-end infinite; vertical-align:-2px; }
  @keyframes blink { 50%{opacity:0} }
  .live-dot { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; color:var(--green); letter-spacing:.1em; }
  .live-dot::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--green); animation:lpulse 1.2s ease-in-out infinite; }
  @keyframes lpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  /* RECENT DEPLOYS */
  .section-title { font-size:15px; font-weight:700; margin:22px 0 12px; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .dep-row { display:flex; align-items:center; gap:12px; padding:13px 16px; border-bottom:1px solid var(--border); }
  .dep-row:last-child { border-bottom:none; }
  .dep-ico { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .di-green{ background:rgba(34,197,94,.12); color:var(--green); }
  .di-gray { background:rgba(90,106,138,.1); color:var(--muted); }
  .dep-name{ font-size:13px; font-weight:600; }
  .dep-hash{ font-size:11px; color:var(--muted); font-family:var(--mono); }
  .active-tag { margin-left:auto; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; background:rgba(34,197,94,.1); color:var(--green); white-space:nowrap; }
  .rollback { margin-left:auto; font-size:11px; font-weight:700; color:var(--accent2); cursor:pointer; padding:4px 10px; border-radius:6px; border:1px solid rgba(59,130,246,.25); background:rgba(59,130,246,.07); transition:all .18s; white-space:nowrap; }
  .rollback:hover { background:rgba(59,130,246,.18); }

  /* RIGHT COL */
  .right-col { display:flex; flex-direction:column; gap:16px; }

  /* ENV VARS */
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }
  .panel-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .panel-title { font-size:14px; font-weight:700; }
  .env-row { margin-bottom:12px; }
  .env-lbl { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
  .env-wrap { display:flex; align-items:center; gap:6px; }
  .env-input { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:8px; padding:8px 12px; font-size:12px; color:var(--text); font-family:var(--sans); outline:none; min-width:0; }
  .env-ibtn { width:30px; height:30px; border-radius:6px; background:var(--surface2); border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:color .2s; flex-shrink:0; }
  .env-ibtn:hover { color:var(--text); }
  .save-btn { width:100%; padding:9px; border-radius:8px; background:var(--surface3); border:1px solid var(--border2); color:var(--text); font-size:13px; font-weight:700; cursor:pointer; font-family:var(--sans); transition:all .2s; margin-top:14px; }
  .save-btn:hover { background:var(--accent); color:#fff; border-color:var(--accent); }

  /* RESOURCE */
  .res-lbl-row { display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; }
  .res-bar { height:5px; background:var(--surface3); border-radius:4px; overflow:hidden; margin-bottom:14px; }
  .res-fill { height:100%; border-radius:4px; }
  .res-note { font-size:10px; color:var(--muted); font-style:italic; margin-top:2px; }

  /* SETTINGS TAB */
  .form-row { margin-bottom:14px; }
  .form-lbl { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; display:block; }
  .form-input { width:100%; background:var(--surface2); border:1px solid var(--border2); border-radius:8px; padding:10px 14px; font-size:13px; color:var(--text); font-family:var(--sans); outline:none; transition:border-color .2s; }
  .form-input:focus { border-color:var(--accent); }

  /* MOBILE */
  .mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:8px 0 16px; z-index:100; }
  .mob-nav-items { display:flex; justify-content:space-around; }
  .mob-item { display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--muted); cursor:pointer; font-size:10px; font-weight:600; padding:6px 14px; transition:color .18s; }
  .mob-item.active { color:var(--accent2); }

  .fade-in { animation:fi .3s ease; }
  @keyframes fi { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  @media (max-width: 900px) {
    .detail-grid { grid-template-columns:1fr; }
    .mob-nav { display:block; }
    .body { padding:16px 16px 80px; }
  }
  @media (max-width: 600px) {
    .app-hdr { flex-direction:column; }
    .app-title { font-size:18px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────
const LOGS = [
  { time:"12:01:04", type:"info",    text:"Initializing build process..." },
  { time:"12:01:05", type:"info",    text:"Detected Node.js environment" },
  { time:"12:01:06", type:"info",    text:"Installing dependencies via npm install..." },
  { time:"12:01:10", type:"plain",   text:"> added 452 packages in 4s" },
  { time:"12:01:45", type:"info",    text:"Compiling assets using Tailwind CSS..." },
  { time:"12:02:02", type:"plain",   text:"> [tailwindcss] building..." },
  { time:"12:02:08", type:"plain",   text:"> [tailwindcss] complete. size: 45.2kb" },
  { time:"12:02:10", type:"success", text:"Build successful." },
  { time:"12:02:12", type:"system",  text:"Deploying to global edge network..." },
  { time:"12:02:14", type:"system",  text:"Propagation started [1/4 regions]" },
];

const DEPLOYS = [
  { id:1, name:"Production", hash:"d5f8a2c", when:"2 hours ago",  active:true  },
  { id:2, name:"Production", hash:"a7e1c94", when:"Yesterday",    active:false },
  { id:3, name:"Production", hash:"f3b2d11", when:"2 days ago",   active:false },
  { id:4, name:"Production", hash:"c9d3e45", when:"3 days ago",   active:false },
  { id:5, name:"Production", hash:"b1a2f78", when:"5 days ago",   active:false },
];

const ENVS = [
  { lbl:"DATABASE URL", val:"postgresql://user:****@db.host:543...", k:"db" },
  { lbl:"NODE ENV",     val:"production",                            k:"ne" },
  { lbl:"API KEY",      val:"sk_live_**********************",        k:"ak" },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function AppDetailPage({ app, onBack }) {
  // Default app if none provided (for standalone preview)
  const data = app || {
    name:"Auth-Service", status:"running", color:"#3b82f6", icon:"server",
  };

  const [tab, setTab] = useState("logs");
  const [show, setShow] = useState({});
  const logRef = useRef(null);
  const [mobActive, setMobActive] = useState("logs");

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [tab]);

  const BADGE_MAP = { running:"b-running", building:"b-building", failed:"b-failed" };

  return (
    <>
      <style>{css}</style>
      <div className="detail-page">

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="logo" onClick={onBack}>
            <div className="logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div>
            <span className="logo-text">CloudDeployLite</span>
          </div>
          <div className="nav-right">
            <div className="sys-badge">SYSTEM NORMAL</div>
            <div className="icon-btn"><Icon d={I.bell} size={14}/></div>
            <div className="avatar">IJ</div>
          </div>
        </nav>

        <div className="body fade-in">

          {/* BACK */}
          <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>
            <Icon d={I.arrowl} size={13}/>Back to Dashboard
          </button>

          {/* APP HEADER */}
          <div className="app-hdr">
            <div className="app-info">
              <div className="app-big-icon" style={{background:data.color+"1e",width:60,height:60}}>
                <Icon d={I[data.icon]||I.server} size={26} color={data.color}/>
              </div>
              <div>
                <div className="app-title">
                  {data.name}
                  <span className={`badge ${BADGE_MAP[data.status]||"b-running"}`}>
                    {data.status[0].toUpperCase()+data.status.slice(1)}
                  </span>
                </div>
                <div className="app-meta">
                  <Icon d={I.refresh} size={12}/>
                  Last deployed 2m ago from
                  <span className="code-tag">main</span> branch
                </div>
              </div>
            </div>
            <div className="hdr-actions">
              <button className="btn btn-ghost"><Icon d={I.external} size={14}/>Visit Site</button>
              <button className="btn btn-primary"><Icon d={I.refresh} size={14}/>Redeploy</button>
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
            <div className="detail-grid">
              {/* LEFT */}
              <div>
                <div className="terminal">
                  <div className="term-hdr">
                    <div className="term-dots">
                      {["#f87171","#fbbf24","#4ade80"].map((c,i)=>(
                        <div key={i} className="term-dot" style={{background:c}}/>
                      ))}
                    </div>
                    <span className="term-title">BUILD LOG — LIVE</span>
                    <div className="term-right">
                      <span className="live-dot">LIVE</span>
                      <div className="icon-btn" style={{width:26,height:26}}>
                        <Icon d={I.download} size={12}/>
                      </div>
                    </div>
                  </div>
                  <div className="term-body" ref={logRef}>
                    {LOGS.map((l, i) => (
                      <div className="log-row" key={i}>
                        <span className="lt">{l.time}</span>
                        {l.type==="info"    && <span className="li">INFO   </span>}
                        {l.type==="success" && <span className="ls">SUCCESS</span>}
                        {l.type==="system"  && <span className="ly">SYSTEM </span>}
                        {l.type==="warn"    && <span className="lw">WARN   </span>}
                        {l.type==="plain"   && <span className="lp"/>}
                        <span className="lx">{l.text}</span>
                      </div>
                    ))}
                    <div className="log-row">
                      <span className="lt">12:02:15</span>
                      <span className="log-cursor"/>
                    </div>
                  </div>
                </div>

                <div className="section-title">Recent Deployments</div>
                <div className="card">
                  {DEPLOYS.slice(0,3).map(d => (
                    <div className="dep-row" key={d.id}>
                      <div className={`dep-ico ${d.active?"di-green":"di-gray"}`}>
                        <Icon d={d.active?I.check:I.refresh} size={13}/>
                      </div>
                      <div>
                        <div className="dep-name">{d.name}</div>
                        <div className="dep-hash">hash: {d.hash} • {d.when}</div>
                      </div>
                      {d.active
                        ? <span className="active-tag">ACTIVE</span>
                        : <div className="rollback">Rollback</div>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT */}
              <div className="right-col">
                {/* ENV VARS */}
                <div className="panel">
                  <div className="panel-hdr">
                    <div className="panel-title">Environment Variables</div>
                    <div className="icon-btn"><Icon d={I.plus} size={14}/></div>
                  </div>
                  {ENVS.map(ev => (
                    <div className="env-row" key={ev.k}>
                      <div className="env-lbl">{ev.lbl}</div>
                      <div className="env-wrap">
                        <input
                          className="env-input"
                          type={show[ev.k] ? "text" : "password"}
                          defaultValue={ev.val}
                        />
                        <div className="env-ibtn" onClick={()=>setShow(s=>({...s,[ev.k]:!s[ev.k]}))}>
                          <Icon d={show[ev.k]?I.eyeoff:I.eye} size={13}/>
                        </div>
                        {ev.k==="ne" && (
                          <div className="env-ibtn"><Icon d={I.edit} size={12}/></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="save-btn">Save Changes</button>
                </div>

                {/* RESOURCE USAGE */}
                <div className="panel">
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:18}}>
                    Resource Usage
                  </div>
                  {[
                    { lbl:"Memory (RAM)", val:"128MB / 512MB", pct:25, col:"#3b82f6" },
                    { lbl:"CPU Load",     val:"4.2%",           pct:4,  col:"#f59e0b" },
                  ].map(r => (
                    <div key={r.lbl}>
                      <div className="res-lbl-row">
                        <span>{r.lbl}</span>
                        <span style={{fontWeight:700,color:r.col}}>{r.val}</span>
                      </div>
                      <div className="res-bar">
                        <div className="res-fill" style={{width:r.pct+"%",background:r.col}}/>
                      </div>
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
              {DEPLOYS.map(d => (
                <div className="dep-row" key={d.id}>
                  <div className={`dep-ico ${d.active?"di-green":"di-gray"}`}>
                    <Icon d={d.active?I.check:I.refresh} size={13}/>
                  </div>
                  <div>
                    <div className="dep-name">{d.name}</div>
                    <div className="dep-hash">hash: {d.hash} • {d.when}</div>
                  </div>
                  {d.active
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
                ["App Name",     data.name],
                ["Region",       "us-east-1"],
                ["Branch",       "main"],
                ["Root Directory","/"],
                ["Build Command","npm run build"],
                ["Start Command","node dist/index.js"],
              ].map(([l, v]) => (
                <div className="form-row" key={l}>
                  <label className="form-lbl">{l}</label>
                  <input className="form-input" defaultValue={v}/>
                </div>
              ))}
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button className="btn btn-primary">Save Settings</button>
                <button className="btn btn-danger">
                  <Icon d={I.x} size={13}/>Delete App
                </button>
              </div>
            </div>
          )}

        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          <div className="mob-nav-items">
            {[["logs","Logs",I.activity],["deployments","Deployments",I.layers],["settings","Settings",I.settings],["back","Back",I.arrowl]].map(([id,lb,ic])=>(
              <div key={id} className={`mob-item ${mobActive===id?"active":""}`}
                onClick={()=>{ if(id==="back"){ onBack&&onBack(); }else{ setMobActive(id); setTab(id); } }}>
                <Icon d={ic} size={20}/>{lb}
              </div>
            ))}
          </div>
        </nav>

      </div>
    </>
  );
}