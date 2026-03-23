import { useState } from "react";

// ─── Icon primitive ───────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  rocket:  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  search:  "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  settings:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14 M5 12h14",
  x:       "M18 6L6 18 M6 6l12 12",
  trash:   "M3 6h18 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6 M9 6V4h6v2",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  server:  "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  python:  "M12 2C8.5 2 8 3.5 8 5v2h8v1H6.5C4.5 8 3 9.5 3 12s1.5 4 3.5 4H8v-2.5c0-2 1-3 3-3h4c2 0 3-1 3-3V5c0-2-1-3-4-3z M12 22c3.5 0 4-1.5 4-3v-2H8v-1h9.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H16v2.5c0 2-1 3-3 3H9c-2 0-3 1-3 3v3c0 2 1 3 4 3z",
  arrowl:  "M19 12H5 M12 19l-7-7 7-7",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  grid:    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
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
    --cyan:    #06b6d4;
    --mono:    'Space Mono', monospace;
    --sans:    'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:var(--sans); background:var(--bg); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  /* NAV */
  .nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:56px; background:rgba(8,12,24,.92); backdrop-filter:blur(14px); border-bottom:1px solid var(--border); }
  .logo { display:flex; align-items:center; gap:9px; cursor:pointer; }
  .logo-icon { width:30px; height:30px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius:7px; display:flex; align-items:center; justify-content:center; }
  .logo-text { font-family:var(--mono); font-size:12px; font-weight:700; }
  .nav-right { display:flex; align-items:center; gap:9px; }
  .icon-btn { width:32px; height:32px; border-radius:7px; border:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .2s; }
  .icon-btn:hover { color:var(--text); border-color:var(--border2); }
  .avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; font-family:var(--mono); }
  .sys-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.18); font-size:11px; font-weight:700; color:var(--green); letter-spacing:.06em; }
  .sys-badge::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* PAGE */
  .page { padding:32px 24px 80px; max-width:720px; margin:0 auto; }
  .page-title { font-size:26px; font-weight:700; margin-bottom:4px; }
  .page-sub   { font-size:13px; color:var(--muted); margin-bottom:30px; }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:var(--sans); transition:all .2s; white-space:nowrap; }
  .btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border2); }
  .btn-ghost:hover { background:var(--surface3); }
  .btn-sm { padding:6px 12px; font-size:12px; }

  /* SECTIONS */
  .form-section { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:24px; margin-bottom:16px; transition:border-color .2s; }
  .form-section:hover { border-color:var(--border2); }
  .section-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .section-title { display:flex; align-items:center; gap:10px; font-size:15px; font-weight:700; }
  .num-badge { width:26px; height:26px; border-radius:50%; background:var(--accent); color:#fff; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; font-family:var(--mono); flex-shrink:0; }
  .optional { font-size:11px; color:var(--muted); font-weight:500; }

  /* FORM ELEMENTS */
  .form-row { margin-bottom:16px; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:7px; display:block; }
  .input-row { display:flex; gap:8px; }
  .input { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:9px; padding:11px 14px; font-size:13px; color:var(--text); font-family:var(--sans); outline:none; transition:border-color .2s; min-width:0; }
  .input:focus { border-color:var(--accent); }
  .input::placeholder { color:var(--muted); }

  /* SUBDOMAIN */
  .subdomain-wrap { display:flex; overflow:hidden; border:1px solid var(--border2); border-radius:9px; transition:border-color .2s; }
  .subdomain-wrap:focus-within { border-color:var(--accent); }
  .subdomain-wrap .input { border:none; border-radius:0; }
  .subdomain-suffix { background:var(--surface3); padding:0 14px; font-size:13px; color:var(--muted); display:flex; align-items:center; white-space:nowrap; border-left:1px solid var(--border2); }

  /* DETECT BUTTON */
  .detect-btn { display:inline-flex; align-items:center; gap:7px; padding:11px 16px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; border:1px solid var(--border2); background:var(--surface2); color:var(--text); font-family:var(--sans); transition:all .18s; white-space:nowrap; }
  .detect-btn:hover { background:var(--surface3); }
  .detect-btn:disabled { opacity:.5; cursor:not-allowed; }

  /* DETECTED RUNTIME */
  .runtime-detected { display:flex; align-items:center; gap:12px; padding:11px 14px; background:rgba(6,182,212,.07); border:1px solid rgba(6,182,212,.18); border-radius:9px; margin-top:10px; animation:slideIn .25s ease; }
  @keyframes slideIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .rt-icon { width:32px; height:32px; border-radius:8px; background:rgba(6,182,212,.12); display:flex; align-items:center; justify-content:center; color:var(--cyan); flex-shrink:0; }
  .rt-label { font-size:11px; color:var(--muted); }
  .rt-name  { font-size:13px; font-weight:700; }

  /* ENV VARS */
  .env-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .env-add-row { display:flex; gap:8px; margin-bottom:8px; align-items:center; }
  .env-key { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:8px; padding:9px 12px; font-size:13px; color:var(--text); font-family:var(--sans); outline:none; transition:border-color .2s; min-width:0; }
  .env-key:focus { border-color:var(--accent); }
  .env-key::placeholder { color:var(--muted); }
  .env-del { width:30px; height:30px; border-radius:7px; border:1px solid var(--border2); background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); transition:all .18s; flex-shrink:0; }
  .env-del:hover { color:var(--red); border-color:rgba(239,68,68,.3); background:rgba(239,68,68,.07); }

  /* DEPLOY BUTTON */
  .deploy-btn { width:100%; padding:15px; border-radius:11px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border:none; color:#fff; font-size:15px; font-weight:700; cursor:pointer; font-family:var(--sans); display:flex; align-items:center; justify-content:center; gap:9px; transition:all .22s; margin-bottom:10px; letter-spacing:.01em; }
  .deploy-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 32px rgba(59,130,246,.4); }
  .deploy-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }
  .tos { text-align:center; font-size:11px; color:var(--muted); }
  .tos span { color:var(--accent2); cursor:pointer; }

  /* PROGRESS STEPS */
  .steps { display:flex; align-items:center; margin-top:30px; }
  .step { display:flex; flex-direction:column; align-items:center; gap:7px; flex:1; }
  .step-circle { width:36px; height:36px; border-radius:50%; border:2px solid var(--border2); background:var(--surface2); color:var(--muted); display:flex; align-items:center; justify-content:center; position:relative; z-index:1; transition:all .3s; }
  .step.done   .step-circle { border-color:var(--green); background:rgba(34,197,94,.1); color:var(--green); }
  .step.active .step-circle { border-color:var(--accent); background:rgba(59,130,246,.12); color:var(--accent); }
  .step-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
  .step.done   .step-label,
  .step.active .step-label { color:var(--text); }
  .step-line { flex:1; height:2px; background:var(--border2); margin-top:-20px; transition:background .3s; }
  .step-line.done { background:var(--green); }

  /* SUCCESS STATE */
  .success-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:52px 24px; text-align:center; animation:fadeIn .35s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .success-icon { width:68px; height:68px; border-radius:50%; background:rgba(34,197,94,.12); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
  .success-title { font-size:22px; font-weight:700; margin-bottom:6px; }
  .success-sub { font-size:13px; color:var(--muted); margin-bottom:26px; }
  .success-actions { display:flex; gap:10px; justify-content:center; }

  /* MOBILE BOTTOM NAV */
  .mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:8px 0 16px; z-index:100; }
  .mob-nav-items { display:flex; justify-content:space-around; }
  .mob-item { display:flex; flex-direction:column; align-items:center; gap:4px; color:var(--muted); cursor:pointer; font-size:10px; font-weight:600; padding:6px 14px; transition:color .18s; }
  .mob-item.active { color:var(--accent2); }

  @media (max-width: 700px) {
    .page { padding:20px 16px 90px; }
    .page-title { font-size:22px; }
    .mob-nav { display:block; }
    .input-row { flex-direction:column; }
    .detect-btn { width:100%; justify-content:center; }
    .nav-right .sys-badge { display:none; }
  }
`;

const STEPS = [
  { id:"connected",   lbl:"Connected",   icon:I.check    },
  { id:"configuring", lbl:"Configuring", icon:I.settings },
  { id:"building",    lbl:"Building",    icon:I.cloud     },
  { id:"live",        lbl:"Live",        icon:I.zap       },
];

const RUNTIME_OPTIONS = [
  { id:"node",   label:"Node.js 18.x",  icon:I.server,  color:"#3b82f6" },
  { id:"python", label:"Python 3.11",   icon:I.activity,color:"#f59e0b" },
  { id:"go",     label:"Go 1.21",       icon:I.zap,     color:"#06b6d4" },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function DeployPage({ onBack, onDeployed }) {
  const [url, setUrl]             = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected]   = useState(null);  // runtime object
  const [subdomain, setSubdomain] = useState("");
  const [envRows, setEnvRows]     = useState([{ k:"", v:"" }]);
  const [deploying, setDeploying] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 0=connected, 1=configuring, etc.
  const [mobActive, setMobActive] = useState("deploy");

  const detectRuntime = () => {
    if (!url.trim()) return;
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      // pick runtime based on URL hint or random
      const pick = url.includes("python") ? RUNTIME_OPTIONS[1] : RUNTIME_OPTIONS[0];
      setDetected(pick);
      setCurrentStep(1);
    }, 800);
  };

  const addEnvRow = () => setEnvRows(r => [...r, { k:"", v:"" }]);
  const delEnvRow = (i) => setEnvRows(r => r.filter((_,j) => j !== i));
  const setEnvK   = (i, k) => setEnvRows(r => r.map((x,j) => j===i ? {...x,k} : x));
  const setEnvV   = (i, v) => setEnvRows(r => r.map((x,j) => j===i ? {...x,v} : x));

  const deploy = () => {
    setDeploying(true);
    setCurrentStep(2);
    setTimeout(() => { setCurrentStep(3); }, 1000);
    setTimeout(() => { setDeploying(false); setSuccess(true); }, 2400);
  };

  // ── SUCCESS ──
  if (success) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
        <nav className="nav">
          <div className="logo" onClick={onBack}>
            <div className="logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div>
            <span className="logo-text">CloudDeployLite</span>
          </div>
          <div className="nav-right">
            <div className="icon-btn"><Icon d={I.bell} size={14}/></div>
            <div className="avatar">IJ</div>
          </div>
        </nav>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{width:"100%",maxWidth:500}}>
            <div className="success-card">
              <div className="success-icon"><Icon d={I.check} size={32} color="var(--green)"/></div>
              <div className="success-title">Deployment Started! 🚀</div>
              <div className="success-sub">
                Your app is building right now. It'll be live at&nbsp;
                <span style={{color:"var(--accent2)",fontFamily:"var(--mono)",fontSize:12}}>
                  {subdomain||"your-app"}.clouddeploylite.io
                </span>
                &nbsp;in about 2 minutes.
              </div>
              <div className="success-actions">
                <button className="btn btn-ghost" onClick={onBack}><Icon d={I.arrowl} size={13}/>Dashboard</button>
                <button className="btn" style={{background:"var(--accent)",color:"#fff"}} onClick={()=>setSuccess(false)}>
                  <Icon d={I.activity} size={13}/>View Build Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ── FORM ──
  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"var(--bg)"}}>

        {/* NAV */}
        <nav className="nav">
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

        <div className="page">

          {/* BACK */}
          <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>
            <Icon d={I.arrowl} size={13}/>Back to Dashboard
          </button>

          <div className="page-title">Deploy a New Project</div>
          <div className="page-sub">Connect your repository and we'll handle the rest.</div>

          {/* ── SECTION 1: SOURCE ── */}
          <div className="form-section">
            <div className="section-title">
              <div className="num-badge">1</div>Source Code
            </div>

            <div className="form-row" style={{marginTop:4}}>
              <label className="form-label">GitHub Repository URL</label>
              <div className="input-row">
                <input
                  className="input"
                  placeholder="https://github.com/username/project-name"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && detectRuntime()}
                />
                <button className="detect-btn" onClick={detectRuntime} disabled={detecting||!url.trim()}>
                  <Icon d={I.search} size={13}/>
                  {detecting ? "Detecting..." : "Detect Runtime"}
                </button>
              </div>

              {detected && (
                <div className="runtime-detected">
                  <div className="rt-icon">
                    <Icon d={detected.icon} size={16}/>
                  </div>
                  <div>
                    <div className="rt-label">Detected Environment</div>
                    <div className="rt-name">{detected.label} (Auto)</div>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                    {RUNTIME_OPTIONS.map(rt => (
                      <div
                        key={rt.id}
                        onClick={() => setDetected(rt)}
                        style={{
                          width:28,height:28,borderRadius:7,display:"flex",alignItems:"center",
                          justifyContent:"center",cursor:"pointer",border:"1px solid",
                          borderColor: rt.id===detected.id ? rt.color : "var(--border2)",
                          background: rt.id===detected.id ? rt.color+"18" : "var(--surface2)",
                          color: rt.id===detected.id ? rt.color : "var(--muted)",
                          transition:"all .18s",
                        }}
                        title={rt.label}
                      >
                        <Icon d={rt.icon} size={13}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 2: CONFIGURATION ── */}
          <div className="form-section">
            <div className="section-hdr">
              <div className="section-title">
                <div className="num-badge">2</div>Configuration
              </div>
              <span className="optional">Optional</span>
            </div>

            {/* SUBDOMAIN */}
            <div className="form-row">
              <label className="form-label">Subdomain Name</label>
              <div className="subdomain-wrap">
                <input
                  className="input"
                  placeholder="my-awesome-project"
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))}
                />
                <div className="subdomain-suffix">.clouddeploylite.io</div>
              </div>
              {subdomain && (
                <div style={{marginTop:6,fontSize:11,color:"var(--green)",display:"flex",alignItems:"center",gap:5}}>
                  <Icon d={I.check} size={11}/>
                  <span>{subdomain}.clouddeploylite.io is available</span>
                </div>
              )}
            </div>

            {/* ENV VARS */}
            <div>
              <div className="env-hdr">
                <label className="form-label" style={{margin:0}}>Environment Variables</label>
                <button className="btn btn-ghost btn-sm" onClick={addEnvRow}>
                  <Icon d={I.plus} size={12}/>Add Variable
                </button>
              </div>

              {envRows.map((row, i) => (
                <div className="env-add-row" key={i}>
                  <input
                    className="env-key"
                    placeholder="KEY (e.g. DATABASE_URL)"
                    value={row.k}
                    onChange={e => setEnvK(i, e.target.value)}
                  />
                  <input
                    className="env-key"
                    placeholder="VALUE"
                    value={row.v}
                    type={row.k.toLowerCase().includes("key")||row.k.toLowerCase().includes("secret")?"password":"text"}
                    onChange={e => setEnvV(i, e.target.value)}
                  />
                  {envRows.length > 1 && (
                    <button className="env-del" onClick={() => delEnvRow(i)}>
                      <Icon d={I.trash} size={13}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── DEPLOY BUTTON ── */}
          <button className="deploy-btn" onClick={deploy} disabled={deploying}>
            {deploying
              ? <><Icon d={I.refresh} size={17}/>Building & Deploying...</>
              : <><Icon d={I.rocket}  size={17}/>Deploy Now</>
            }
          </button>
          <div className="tos">
            By clicking deploy, you agree to our <span>Terms of Service</span>.
          </div>

          {/* ── PROGRESS STEPS ── */}
          <div className="steps">
            {STEPS.map((s, idx) => {
              const state = idx < currentStep ? "done" : idx===currentStep ? "active" : "";
              return (
                <>
                  {idx > 0 && (
                    <div key={"line"+idx} className={`step-line ${idx<=currentStep?"done":""}`}/>
                  )}
                  <div key={s.id} className={`step ${state}`}>
                    <div className="step-circle"><Icon d={s.icon} size={14}/></div>
                    <div className="step-label">{s.lbl}</div>
                  </div>
                </>
              );
            })}
          </div>

        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          <div className="mob-nav-items">
            {[["dashboard","Apps",I.grid],["deploy","Deploy",I.rocket],["logs","Logs",I.activity],["settings","Settings",I.settings]].map(([id,lb,ic])=>(
              <div key={id} className={`mob-item ${mobActive===id?"active":""}`} onClick={()=>{
                setMobActive(id);
                if(id!=="deploy" && onBack) onBack();
              }}>
                <Icon d={ic} size={20}/>{lb}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}