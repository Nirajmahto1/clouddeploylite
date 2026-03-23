import { useState } from "react";

// ─── Icon primitive ───────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  rocket:  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  github:  "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  check:   "M20 6L9 17l-5-5",
  cloud:   "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  server:  "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  layers:  "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  docs:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
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
    --cyan:    #06b6d4;
    --mono:    'Space Mono', monospace;
    --sans:    'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:var(--sans); background:var(--bg); color:var(--text); -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  /* NAV */
  .nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 28px; height:58px; background:rgba(8,12,24,.92); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); }
  .logo { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .logo-icon { width:32px; height:32px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .logo-text { font-family:var(--mono); font-size:13px; font-weight:700; }
  .nav-links { display:flex; gap:26px; }
  .nav-link  { font-size:13px; color:var(--muted); cursor:pointer; transition:color .2s; }
  .nav-link:hover { color:var(--text); }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:var(--sans); transition:all .18s; white-space:nowrap; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#2563eb; transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,130,246,.3); }
  .btn-ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border2); }
  .btn-ghost:hover { background:var(--surface3); }

  /* LANDING WRAPPER */
  .landing { max-width:1100px; margin:0 auto; padding:0 28px 80px; }

  /* HERO */
  .hero { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; padding:76px 0 60px; }
  .hero-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; background:rgba(6,182,212,.08); border:1px solid rgba(6,182,212,.2); font-size:11px; font-weight:700; color:var(--cyan); letter-spacing:.08em; margin-bottom:22px; }
  .hero-title { font-size:52px; font-weight:700; line-height:1.06; margin-bottom:18px; }
  .hero-title span { color:var(--accent2); }
  .hero-sub { font-size:15px; color:var(--muted); line-height:1.7; margin-bottom:30px; max-width:400px; }
  .hero-btns { display:flex; gap:10px; flex-wrap:wrap; }
  .hero-trusted { display:flex; align-items:center; gap:10px; margin-top:26px; font-size:12px; color:var(--muted); }
  .hero-avatars { display:flex; }
  .hero-avatar { width:26px; height:26px; border-radius:50%; border:2px solid var(--bg); margin-right:-7px; }

  /* HERO VISUAL */
  .hero-visual { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px; animation:fadeUp .6s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .v-dots { display:flex; gap:6px; margin-bottom:16px; }
  .v-dot  { width:11px; height:11px; border-radius:50%; }
  .v-url  { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:6px; padding:7px 12px; font-family:var(--mono); font-size:11px; color:var(--muted); }
  .v-input { width:100%; background:var(--surface2); border:1px solid var(--border2); border-radius:8px; padding:10px 14px; font-size:13px; color:var(--text); font-family:var(--sans); outline:none; margin-bottom:10px; transition:border-color .2s; }
  .v-input:focus { border-color:var(--accent); }
  .v-input::placeholder { color:var(--muted); }
  .v-analyze { width:100%; padding:11px; border-radius:8px; background:linear-gradient(135deg,#3b82f6,#1d4ed8); border:none; color:#fff; font-size:13px; font-weight:700; cursor:pointer; font-family:var(--sans); margin-bottom:18px; transition:all .2s; }
  .v-analyze:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,130,246,.3); }
  .v-runtimes { display:flex; justify-content:space-around; }
  .v-rt { display:flex; flex-direction:column; align-items:center; gap:5px; }
  .v-rt-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
  .v-rt-label { font-size:10px; font-weight:700; letter-spacing:.1em; color:var(--muted); }

  /* FEATURES */
  .section { padding:72px 0 0; }
  .section-head { text-align:center; margin-bottom:40px; }
  .section-title { font-size:32px; font-weight:700; margin-bottom:10px; }
  .section-sub   { font-size:14px; color:var(--muted); }
  .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .feat-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:26px; transition:border-color .25s,transform .25s; }
  .feat-card:hover { border-color:var(--border2); transform:translateY(-3px); }
  .feat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
  .feat-name { font-size:15px; font-weight:700; margin-bottom:8px; }
  .feat-desc { font-size:13px; color:var(--muted); line-height:1.62; }

  /* CTA */
  .cta-section { text-align:center; padding:72px 0; }
  .cta-title { font-size:36px; font-weight:700; margin-bottom:10px; }
  .cta-sub   { font-size:14px; color:var(--muted); margin-bottom:24px; }
  .cta-row   { display:flex; gap:10px; max-width:500px; margin:0 auto 18px; }
  .cta-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:9px; padding:12px 16px; font-size:13px; color:var(--text); font-family:var(--sans); outline:none; transition:border-color .2s; }
  .cta-input:focus { border-color:var(--accent); }
  .cta-input::placeholder { color:var(--muted); }
  .tech-strip { display:flex; justify-content:center; gap:14px; flex-wrap:wrap; }
  .tech-tag { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--muted); padding:5px 14px; border-radius:20px; border:1px solid var(--border); }

  /* PRICING */
  .pricing-section { padding:72px 0; }
  .pricing-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; max-width:620px; margin:0 auto; }
  .price-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; position:relative; }
  .price-card.popular { border-color:var(--accent); }
  .popular-tag { position:absolute; top:-12px; right:18px; background:var(--accent); color:#fff; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:3px 12px; border-radius:20px; }
  .price-plan { font-size:10px; font-weight:700; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
  .price-val  { font-size:38px; font-weight:700; line-height:1; margin-bottom:4px; }
  .price-val span { font-size:14px; font-weight:500; color:var(--muted); }
  .price-tag  { font-size:12px; color:var(--muted); margin-bottom:22px; }
  .price-feats { list-style:none; display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .price-feats li { display:flex; align-items:center; gap:8px; font-size:13px; }
  .price-btn { width:100%; padding:11px; border-radius:9px; font-size:13px; font-weight:700; cursor:pointer; font-family:var(--sans); transition:all .2s; border:1px solid var(--border2); background:var(--surface2); color:var(--text); }
  .price-card.popular .price-btn { background:var(--accent); border-color:var(--accent); color:#fff; }
  .price-btn:hover { opacity:.85; }

  /* FOOTER */
  .footer { border-top:1px solid var(--border); padding:24px 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; }
  .footer-links { display:flex; gap:20px; }
  .footer-link { font-size:12px; color:var(--muted); cursor:pointer; transition:color .2s; }
  .footer-link:hover { color:var(--text); }

  /* MOBILE */
  @media (max-width: 860px) {
    .nav-links { display:none; }
    .hero { grid-template-columns:1fr; gap:30px; padding:40px 0; }
    .hero-visual { display:none; }
    .hero-title { font-size:36px; }
    .features-grid { grid-template-columns:1fr; }
    .pricing-grid { grid-template-columns:1fr; }
    .cta-row { flex-direction:column; }
  }
  @media (max-width:500px) {
    .hero-title { font-size:30px; }
    .landing { padding:0 16px 60px; }
  }
`;

export default function LandingPage({ onLogin }) {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon"><Icon d={I.cloud} size={16} color="#fff"/></div>
          <span className="logo-text">CloudDeployLite</span>
        </div>
        <div className="nav-links">
          <span className="nav-link">Features</span>
          <span className="nav-link">Pricing</span>
          <span className="nav-link">Docs</span>
        </div>
        <button className="btn btn-primary" onClick={onLogin}>
          <Icon d={I.github} size={14}/>Login with GitHub
        </button>
      </nav>

      {/* ── BODY ── */}
      <div className="landing">

        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-badge"><Icon d={I.zap} size={12}/>V2.0 IS LIVE</div>
            <h1 className="hero-title">Deploy your apps <span>in seconds.</span></h1>
            <p className="hero-sub">
              Just paste your GitHub URL. CloudDeployLite handles building,
              scaling, and SSL with zero configuration.
            </p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={onLogin}>
                <Icon d={I.rocket} size={14}/>Get Started Free
              </button>
              <button className="btn btn-ghost">View Demo</button>
            </div>
            <div className="hero-trusted">
              <div className="hero-avatars">
                {["#3b82f6","#8b5cf6","#f59e0b"].map((c,i)=>(
                  <div key={i} className="hero-avatar" style={{background:c}}/>
                ))}
              </div>
              Trusted by&nbsp;<strong style={{color:"var(--text)"}}>2,000+</strong>&nbsp;developers
            </div>
          </div>

          <div className="hero-visual">
            <div className="v-dots" style={{alignItems:"center"}}>
              {["#f87171","#fbbf24","#4ade80"].map((c,i)=>(
                <div key={i} className="v-dot" style={{background:c}}/>
              ))}
              <div className="v-url" style={{marginLeft:8}}>clouddeploylite.io/dashboard/new</div>
            </div>
            <input
              className="v-input"
              placeholder="https://github.com/username/project"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
            />
            <button className="v-analyze" onClick={onLogin}>Analyze Repository</button>
            <div className="v-runtimes">
              {[["server","NODE.JS","#3b82f6"],["activity","REACT","#61dafb"],["cloud","DOCKER","#2496ed"]].map(([ic,lb,cl])=>(
                <div className="v-rt" key={lb}>
                  <div className="v-rt-icon" style={{background:cl+"1e"}}>
                    <Icon d={I[ic]} size={16} color={cl}/>
                  </div>
                  <span className="v-rt-label">{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Powerful features for modern developers</h2>
            <p className="section-sub">Everything you need to go from code to production in record time.</p>
          </div>
          <div className="features-grid">
            {[
              { icon:"zap",     col:"#8b5cf6", name:"Auto-detection of runtimes",
                desc:"We automatically identify your framework—be it Next.js, Django, or Go—and optimize the build process accordingly." },
              { icon:"shield",  col:"#22c55e", name:"Subdomains with HTTPS",
                desc:"Every single deployment gets a secure, custom subdomain with automated SSL certificates out of the box." },
              { icon:"activity",col:"#3b82f6", name:"Real-time build logs",
                desc:"Monitor your deployment progress with live streaming logs, detailed analytics, and instant build failure alerts." },
            ].map(f => (
              <div className="feat-card" key={f.name}>
                <div className="feat-icon" style={{background:f.col+"18"}}>
                  <Icon d={I[f.icon]} size={20} color={f.col}/>
                </div>
                <div className="feat-name">{f.name}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to deploy?</h2>
          <p className="cta-sub">Enter your repository URL to see the magic happen.</p>
          <div className="cta-row">
            <input className="cta-input" placeholder="https://github.com/username/repo"/>
            <button className="btn btn-primary" onClick={onLogin}>Deploy Now</button>
          </div>
          <div className="tech-strip">
            {[["docs","Next.js"],["layers","Python"],["server","PostgreSQL"],["activity","Go Lang"]].map(([ic,lb])=>(
              <div className="tech-tag" key={lb}><Icon d={I[ic]} size={13}/>{lb}</div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing-section">
          <div className="section-head">
            <h2 className="section-title">Simple Pricing</h2>
            <p className="section-sub">Scale as you grow</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-plan">Hobby</div>
              <div className="price-val">$0<span>/mo</span></div>
              <div className="price-tag">For personal projects & side hustles.</div>
              <ul className="price-feats">
                {["Unlimited public repos","Free .deploylite.app subdomains","Community support"].map(f=>(
                  <li key={f}><Icon d={I.check} size={14} color="var(--green)"/>{f}</li>
                ))}
              </ul>
              <button className="price-btn" onClick={onLogin}>Get Started</button>
            </div>

            <div className="price-card popular">
              <div className="popular-tag">MOST POPULAR</div>
              <div className="price-plan">Professional</div>
              <div className="price-val">$19<span>/mo</span></div>
              <div className="price-tag">For scaling teams & startups.</div>
              <ul className="price-feats">
                {["Private repositories","Custom domains with managed SSL","Priority build queue (5x faster)","Advanced team permissions"].map(f=>(
                  <li key={f}><Icon d={I.check} size={14} color="var(--green)"/>{f}</li>
                ))}
              </ul>
              <button className="price-btn">Upgrade to Pro</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="logo">
            <div className="logo-icon" style={{width:24,height:24,borderRadius:6}}>
              <Icon d={I.cloud} size={13} color="#fff"/>
            </div>
            <span className="logo-text" style={{fontSize:12}}>CloudDeployLite</span>
          </div>
          <div className="footer-links">
            {["Twitter","GitHub","Status","Privacy"].map(l=>(
              <span key={l} className="footer-link">{l}</span>
            ))}
          </div>
          <span style={{fontSize:12,color:"var(--muted)"}}>© 2024 CloudDeployLite Inc.</span>
        </footer>
      </div>
    </>
  );
}