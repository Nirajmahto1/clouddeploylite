import { useState } from "react";
import api from "../api/axios";

const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  rocket:  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  search:  "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  settings:"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  check:   "M20 6L9 17l-5-5",
  plus:    "M12 5v14 M5 12h14",
  trash:   "M3 6h18 M19 6l-1 14H6L5 6 M9 6V4h6v2",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  server:  "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  arrowl:  "M19 12H5 M12 19l-7-7 7-7",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  grid:    "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  :root {
    --bg:#080c18; --surface:#0f1623; --surface2:#161e2e; --surface3:#1c2640;
    --border:#1c2640; --border2:#243352; --text:#dce8ff; --muted:#5a6a8a;
    --accent:#3b82f6; --accent2:#60a5fa; --green:#22c55e; --red:#ef4444; --cyan:#06b6d4;
    --mono:'Space Mono',monospace; --sans:'DM Sans',sans-serif;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--sans);background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}

  .nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:rgba(8,12,24,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
  .logo{display:flex;align-items:center;gap:9px;cursor:pointer}
  .logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border-radius:7px;display:flex;align-items:center;justify-content:center}
  .logo-text{font-family:var(--mono);font-size:12px;font-weight:700}
  .nav-right{display:flex;align-items:center;gap:9px}
  .icon-btn{width:32px;height:32px;border-radius:7px;border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .2s}
  .icon-btn:hover{color:var(--text)}
  .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:var(--mono)}
  .sys-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.18);font-size:11px;font-weight:700;color:var(--green);letter-spacing:.06em}
  .sys-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:p 2s infinite}
  @keyframes p{0%,100%{opacity:1}50%{opacity:.4}}

  .page{padding:32px 24px 90px;max-width:700px;margin:0 auto}
  .page-title{font-size:26px;font-weight:700;margin-bottom:4px}
  .page-sub  {font-size:13px;color:var(--muted);margin-bottom:30px}

  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:var(--sans);transition:all .2s;white-space:nowrap}
  .btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
  .btn-ghost:hover{background:var(--surface3)}
  .btn-sm{padding:6px 12px;font-size:12px}

  .section{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;margin-bottom:16px;transition:border-color .2s}
  .section:focus-within{border-color:var(--border2)}
  .sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
  .sec-title{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:700}
  .num{width:26px;height:26px;border-radius:50%;background:var(--accent);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:var(--mono);flex-shrink:0}
  .optional{font-size:11px;color:var(--muted);font-weight:500}

  .form-row{margin-bottom:16px}
  .lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:7px;display:block}
  .irow{display:flex;gap:8px}
  .input{flex:1;background:var(--surface2);border:1px solid var(--border2);border-radius:9px;padding:11px 14px;font-size:13px;color:var(--text);font-family:var(--sans);outline:none;transition:border-color .2s;min-width:0}
  .input:focus{border-color:var(--accent)}
  .input::placeholder{color:var(--muted)}
  .input:disabled{opacity:.5;cursor:not-allowed}

  .subdomain-wrap{display:flex;overflow:hidden;border:1px solid var(--border2);border-radius:9px;transition:border-color .2s}
  .subdomain-wrap:focus-within{border-color:var(--accent)}
  .subdomain-wrap .input{border:none;border-radius:0}
  .subdomain-suffix{background:var(--surface3);padding:0 14px;font-size:13px;color:var(--muted);display:flex;align-items:center;white-space:nowrap;border-left:1px solid var(--border2)}

  .detect-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 16px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border2);background:var(--surface2);color:var(--text);font-family:var(--sans);transition:all .18s;white-space:nowrap}
  .detect-btn:hover:not(:disabled){background:var(--surface3)}
  .detect-btn:disabled{opacity:.45;cursor:not-allowed}

  .rt-box{display:flex;align-items:center;gap:12px;padding:11px 14px;background:rgba(6,182,212,.07);border:1px solid rgba(6,182,212,.18);border-radius:9px;margin-top:10px;animation:slideIn .25s ease}
  @keyframes slideIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
  .rt-ico{width:32px;height:32px;border-radius:8px;background:rgba(6,182,212,.12);display:flex;align-items:center;justify-content:center;color:var(--cyan);flex-shrink:0}
  .rt-lbl{font-size:11px;color:var(--muted)}
  .rt-name{font-size:13px;font-weight:700}

  .env-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .env-row{display:flex;gap:8px;margin-bottom:8px;align-items:center}
  .env-key{flex:1;background:var(--surface2);border:1px solid var(--border2);border-radius:8px;padding:9px 12px;font-size:13px;color:var(--text);font-family:var(--sans);outline:none;transition:border-color .2s;min-width:0}
  .env-key:focus{border-color:var(--accent)}
  .env-key::placeholder{color:var(--muted)}
  .env-del{width:30px;height:30px;border-radius:7px;border:1px solid var(--border2);background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .18s;flex-shrink:0}
  .env-del:hover{color:var(--red);border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.07)}

  .deploy-btn{width:100%;padding:15px;border-radius:11px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:none;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;justify-content:center;gap:9px;transition:all .22s;margin-bottom:10px}
  .deploy-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(59,130,246,.4)}
  .deploy-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:none}
  .tos{text-align:center;font-size:11px;color:var(--muted)}
  .tos span{color:var(--accent2);cursor:pointer}

  .steps{display:flex;align-items:center;margin-top:30px}
  .step{display:flex;flex-direction:column;align-items:center;gap:7px;flex:1}
  .step-c{width:36px;height:36px;border-radius:50%;border:2px solid var(--border2);background:var(--surface2);color:var(--muted);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;transition:all .3s}
  .step.done   .step-c{border-color:var(--green);background:rgba(34,197,94,.1);color:var(--green)}
  .step.active .step-c{border-color:var(--accent);background:rgba(59,130,246,.12);color:var(--accent)}
  .step-lbl{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .step.done .step-lbl,.step.active .step-lbl{color:var(--text)}
  .step-line{flex:1;height:2px;background:var(--border2);margin-top:-20px;transition:background .4s}
  .step-line.done{background:var(--green)}

  .err-banner{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:9px;padding:12px 16px;margin-bottom:14px;font-size:13px;color:var(--red);display:flex;align-items:center;gap:8px}

  .success-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:52px 24px;text-align:center;animation:fadeIn .35s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .success-ico{width:68px;height:68px;border-radius:50%;background:rgba(34,197,94,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
  .success-title{font-size:22px;font-weight:700;margin-bottom:6px}
  .success-sub{font-size:13px;color:var(--muted);margin-bottom:26px}
  .success-acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}

  .mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);padding:8px 0 16px;z-index:100}
  .mob-items{display:flex;justify-content:space-around}
  .mob-item{display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--muted);cursor:pointer;font-size:10px;font-weight:600;padding:6px 14px;transition:color .18s}
  .mob-item.active{color:var(--accent2)}

  .fade-in{animation:fi .3s ease}
  @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  @media(max-width:700px){
    .page{padding:20px 16px 90px}
    .page-title{font-size:22px}
    .mob-nav{display:block}
    .irow{flex-direction:column}
    .detect-btn{width:100%;justify-content:center}
    .sys-badge{display:none}
  }
`;

const STEPS = [
  {lbl:"Connected",   icon:I.check},
  {lbl:"Configuring", icon:I.settings},
  {lbl:"Building",    icon:I.cloud},
  {lbl:"Live",        icon:I.zap},
];

export default function DeployPage({ onBack, onDeployed }) {
  const [repoUrl, setRepoUrl]     = useState("");
  const [appName, setAppName]     = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected]   = useState(null);
  const [envRows, setEnvRows]     = useState([{k:"", v:""}]);
  const [deploying, setDeploying] = useState(false);
  const [step, setStep]           = useState(1);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [createdApp, setCreatedApp] = useState(null);

  // ── Detect runtime from GitHub repo URL ─────────────────────
  const detectRuntime = async () => {
    if (!repoUrl.trim()) return;
    setDetecting(true);
    setDetected(null);
    setError("");
    try {
      // Call backend to detect runtime (backend can check package.json / requirements.txt etc.)
      const res = await api.post("/api/apps/detect-runtime", { repoUrl });
      setDetected(res.data.message); // e.g. "Node.js 18.x" or "Python 3.11"
      setStep(1);
    } catch (e) {
      // Fallback: basic client-side guess
      if (repoUrl.includes("python") || repoUrl.includes("flask") || repoUrl.includes("django")) {
        setDetected("Python 3.11");
      } else {
        setDetected("Node.js 18.x");
      }
    } finally {
      setDetecting(false); }
  };

  // ── Deploy ───────────────────────────────────────────────────
  const deploy = async () => {
    if (!repoUrl.trim()) { setError("Please enter a GitHub repository URL."); return; }

    setError("");
    setDeploying(true);
    setStep(2);

    // Build env object from rows
    const env = {};
    envRows.filter(r => r.k.trim()).forEach(r => { env[r.k.trim()] = r.v; });

    try {
      const res = await api.post("/api/apps", {
        name:      appName || subdomain || repoUrl.split("/").pop(),
        repoUrl:  repoUrl,
        subdomain: subdomain || repoUrl.split("/").pop().toLowerCase().replace(/[^a-z0-9]/g,"-"),
        env,
      });

      setCreatedApp(res.data);
      setStep(3);

      // Poll status until running or failed
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.get(`/api/apps/${res.data.app.id}`);
          
          if (status.data.app.status === "running") {
            setStep(4);
            clearInterval(pollInterval);
            setTimeout(() => { setDeploying(false); setSuccess(true); }, 500);
          }
         
          if (status.data.app.status === "failed") {
            clearInterval(pollInterval);
            setDeploying(false);
            setError("Build failed. Check the logs for details.");
          }
        } catch (_) { clearInterval(pollInterval); }
      }, 3000);

      // Safety timeout: stop polling after 5 minutes
      setTimeout(() => { clearInterval(pollInterval); setDeploying(false); }, 300000);

    } catch (e) {
      setError(e.response?.data?.message || "Deployment failed. Please try again.");
      setDeploying(false);
      setStep(1);
    }
  };

  const addEnv = () => setEnvRows(r => [...r, {k:"",v:""}]);
  const delEnv = (i) => setEnvRows(r => r.filter((_,j) => j!==i));
  const setK = (i,k) => setEnvRows(r => r.map((x,j) => j===i?{...x,k}:x));
  const setV = (i,v) => setEnvRows(r => r.map((x,j) => j===i?{...x,v}:x));

  // ── SUCCESS SCREEN ───────────────────────────────────────────
  if (success) return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"var(--bg)"}}>
        <nav className="nav">
          <div className="logo" onClick={onBack}><div className="logo-icon"><Icon d={I.cloud} size={15} color="#fff"/></div><span className="logo-text">CloudDeployLite</span></div>
          <div className="nav-right"><div className="icon-btn"><Icon d={I.bell} size={14}/></div><div className="avatar">ME</div></div>
        </nav>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 56px)",padding:24}}>
          <div style={{width:"100%",maxWidth:500}}>
            <div className="success-card">
              <div className="success-ico"><Icon d={I.check} size={32} color="var(--green)"/></div>
              <div className="success-title">Your app is live! 🚀</div>
              <div className="success-sub">
                Deployed at&nbsp;

                <a href={`https://${createdApp?.app?.subdomain}.psnlprojects.fun`}
                  target="_blank" rel="noreferrer"
                  style={{color:"var(--accent2)",fontFamily:"var(--mono)",fontSize:12}}>
                  {createdApp?.app?.subdomain}.psnlprojects.fun
                </a>
              </div>
              <div className="success-acts">
                <button className="btn btn-ghost" onClick={onBack}>
                  <Icon d={I.arrowl} size={13}/>Dashboard
                </button>
                <button className="btn" style={{background:"var(--accent)",color:"#fff"}}
                  onClick={() => { onDeployed && onDeployed(createdApp); }}>
                  <Icon d={I.activity} size={13}/>View Logs
                </button>
                <button className="btn btn-ghost"
                  onClick={() => window.open(`https://${createdApp?.app?.subdomain}.psnlprojects.fun`)}>
                  <Icon d={I.zap} size={13}/>Visit App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ── FORM ─────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"var(--bg)"}}>

        <nav className="nav">
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

        <div className="page fade-in">
          <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={onBack}>
            <Icon d={I.arrowl} size={13}/>Back to Dashboard
          </button>

          <div className="page-title">Deploy a New Project</div>
          <div className="page-sub">Connect your repository and we'll handle the rest.</div>

          {error && (
            <div className="err-banner">
              <Icon d={I.zap} size={14}/>
              {error}
              <span style={{marginLeft:"auto",cursor:"pointer",opacity:.6}} onClick={()=>setError("")}>✕</span>
            </div>
          )}

          {/* ── SECTION 1: SOURCE ── */}
          <div className="section">
            <div className="sec-title"><div className="num">1</div>Source Code</div>
            <div className="form-row" style={{marginTop:4}}>
              <label className="lbl">App Name</label>
              <input className="input" placeholder="my-awesome-app" value={appName}
                onChange={e => setAppName(e.target.value)} disabled={deploying}/>
            </div>
            <div className="form-row">
              <label className="lbl">GitHub Repository URL</label>
              <div className="irow">
                <input
                  className="input"
                  placeholder="https://github.com/username/project-name"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  disabled={deploying}
                  onKeyDown={e => e.key==="Enter" && detectRuntime()}
                />
                <button className="detect-btn" onClick={detectRuntime}
                  disabled={detecting || deploying || !repoUrl.trim()}>
                  <Icon d={I.search} size={13}/>
                  {detecting ? "Detecting..." : "Detect Runtime"}
                </button>
              </div>

              {detected && (
                <div className="rt-box">
                  <div className="rt-ico"><Icon d={I.server} size={16}/></div>
                  <div>
                    <div className="rt-lbl">Detected Environment</div>
                    <div className="rt-name">{detected} (Auto)</div>
                  </div>
                  <div style={{marginLeft:"auto",fontSize:11,color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
                    <Icon d={I.check} size={12}/>Ready
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SECTION 2: CONFIGURATION ── */}
          <div className="section">
            <div className="sec-hdr">
              <div className="sec-title"><div className="num">2</div>Configuration</div>
              <span className="optional">Optional</span>
            </div>

            <div className="form-row">
              <label className="lbl">Subdomain Name</label>
              <div className="subdomain-wrap">
                <input
                  className="input"
                  placeholder="my-awesome-project"
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))}
                  disabled={deploying}
                />
                <div className="subdomain-suffix">.psnlprojects.fun</div>
              </div>
              {subdomain && (
                <div style={{marginTop:6,fontSize:11,color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
                  <Icon d={I.check} size={11}/>
                  {subdomain}.psnlprojects.fun
                </div>
              )}
            </div>

            <div>
              <div className="env-hdr">
                <label className="lbl" style={{margin:0}}>Environment Variables</label>
                <button className="btn btn-ghost btn-sm" onClick={addEnv} disabled={deploying}>
                  <Icon d={I.plus} size={12}/>Add Variable
                </button>
              </div>
              {envRows.map((row, i) => (
                <div className="env-row" key={i}>
                  <input className="env-key" placeholder="KEY (e.g. DATABASE_URL)"
                    value={row.k} onChange={e=>setK(i,e.target.value)} disabled={deploying}/>
                  <input className="env-key" placeholder="VALUE"
                    type={row.k.toLowerCase().includes("key")||row.k.toLowerCase().includes("secret")?"password":"text"}
                    value={row.v} onChange={e=>setV(i,e.target.value)} disabled={deploying}/>
                  {envRows.length > 1 && (
                    <button className="env-del" onClick={()=>delEnv(i)} disabled={deploying}>
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
              ? <><Icon d={I.refresh} size={17}/>
                  {step===2?"Queuing deployment...":step===3?"Building & deploying...":"Launching..."}
                </>
              : <><Icon d={I.rocket} size={17}/>Deploy Now</>
            }
          </button>
          <div className="tos">By clicking deploy, you agree to our <span>Terms of Service</span>.</div>

          {/* ── PROGRESS STEPS ── */}
          <div className="steps">
            {STEPS.map((s, idx) => {
              const state = idx < step ? "done" : idx === step ? "active" : "";
              return (
                <>
                  {idx > 0 && <div key={"l"+idx} className={`step-line ${idx<=step?"done":""}`}/>}
                  <div key={s.lbl} className={`step ${state}`}>
                    <div className="step-c"><Icon d={s.icon} size={14}/></div>
                    <div className="step-lbl">{s.lbl}</div>
                  </div>
                </>
              );
            })}
          </div>

        </div>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mob-nav">
          <div className="mob-items">
            {[["dashboard","Apps",I.grid],["deploy","Deploy",I.rocket],["logs","Logs",I.activity],["settings","Settings",I.settings]].map(([id,lb,ic])=>(
              <div key={id} className={`mob-item ${id==="deploy"?"active":""}`}
                onClick={()=>{ if(id!=="deploy") onBack&&onBack(); }}>
                <Icon d={ic} size={20}/>{lb}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
