import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";

// ─── Icon ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const I = {
  cloud:    "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  grid:     "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  layers:   "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  chart:    "M18 20V10 M12 20V4 M6 20v-6",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  docs:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  rocket:   "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  zap:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  search:   "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  globe:    "M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  server:   "M2 2h20v8H2z M2 14h20v8H2z M6 6h.01 M6 18h.01",
  arrowup:  "M12 19V5 M5 12l7-7 7 7",
  arrowdn:  "M12 5v14 M19 12l-7 7-7-7",
};

// ─── CSS ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Sora:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg:       #07090f;
    --surface:  #0d1117;
    --surface2: #131920;
    --surface3: #192130;
    --border:   #1a2535;
    --border2:  #223045;
    --text:     #d8e8ff;
    --muted:    #4a607e;
    --accent:   #3b82f6;
    --accent2:  #60a5fa;
    --green:    #22c55e;
    --red:      #ef4444;
    --yellow:   #f59e0b;
    --cyan:     #06b6d4;
    --purple:   #8b5cf6;
    --mono:     'Space Mono', monospace;
    --sans:     'Sora', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--sans); background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── LAYOUT ── */
  .analytics-wrap { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 220px; flex-shrink: 0;
    border-right: 1px solid var(--border);
    padding: 0 10px 20px;
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }
  .s-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 18px 12px 20px;
    border-bottom: 1px solid var(--border); margin-bottom: 12px;
  }
  .s-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
  }
  .s-logo-title { font-family: var(--mono); font-size: 12px; font-weight: 700; line-height: 1.2; }
  .s-logo-sub { font-size: 9px; font-weight: 600; letter-spacing: .12em; color: var(--muted); text-transform: uppercase; }
  .s-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--muted);
    cursor: pointer; transition: all .18s; margin-bottom: 2px;
  }
  .s-item:hover  { background: var(--surface2); color: var(--text); }
  .s-item.active { background: rgba(59,130,246,.13); color: var(--accent2); }
  .s-div { height: 1px; background: var(--border); margin: 10px 2px 12px; }
  .s-deploy {
    margin: auto 0 0; padding: 10px 14px;
    border-radius: 10px; background: rgba(59,130,246,.18);
    border: 1px solid rgba(59,130,246,.3); color: var(--accent2);
    font-size: 13px; font-weight: 700; cursor: pointer; font-family: var(--sans);
    display: flex; align-items: center; gap: 8px; transition: all .2s;
  }
  .s-deploy:hover { background: rgba(59,130,246,.28); transform: translateY(-1px); }
  .s-logout {
    margin-top: 8px; padding: 9px 12px; border-radius: 8px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500; color: var(--muted);
    cursor: pointer; transition: all .18s; border: none; background: none;
    font-family: var(--sans); width: 100%;
  }
  .s-logout:hover { color: var(--red); }

  /* ── TOP NAV ── */
  .right { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .topnav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; gap: 16px;
    padding: 0 28px; height: 58px;
    background: rgba(7,9,15,.92); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .topnav-search { position: relative; flex: 1; max-width: 380px; }
  .topnav-search input {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px 7px 34px; font-size: 12px;
    color: var(--text); font-family: var(--sans); outline: none; transition: border-color .2s;
  }
  .topnav-search input:focus { border-color: var(--accent); }
  .topnav-search input::placeholder { color: var(--muted); }
  .search-ico { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .topnav-links { display: flex; gap: 22px; margin-left: 8px; }
  .topnav-link { font-size: 13px; color: var(--muted); cursor: pointer; transition: color .2s; font-weight: 500; }
  .topnav-link:hover { color: var(--text); }
  .topnav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .t-icon-btn {
    width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--muted); transition: all .2s; position: relative;
  }
  .t-icon-btn:hover { color: var(--text); border-color: var(--border2); }
  .notif-dot {
    position: absolute; top: 6px; right: 6px; width: 6px; height: 6px;
    border-radius: 50%; background: var(--red); border: 1px solid var(--bg);
  }
  .user-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px 4px 4px; border-radius: 20px;
    background: var(--surface2); border: 1px solid var(--border);
    cursor: pointer;
  }
  .user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg,#3b82f6,#8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; font-family: var(--mono);
  }
  .user-name { font-size: 12px; font-weight: 600; }
  .user-tier { font-size: 9px; font-weight: 700; letter-spacing: .1em; color: var(--yellow); text-transform: uppercase; }

  /* ── MAIN BODY ── */
  .main { flex: 1; padding: 28px; overflow-y: auto; }

  /* ── BUTTONS ── */
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: var(--sans); transition: all .18s; white-space: nowrap; }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--surface3); }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #2563eb; }

  /* ── PAGE HEADER ── */
  .page-hdr { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 26px; flex-wrap: wrap; gap: 14px; }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -.5px; }
  .page-sub   { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .hdr-right  { display: flex; align-items: center; gap: 10px; }
  .time-select {
    background: var(--surface2); border: 1px solid var(--border2); border-radius: 8px;
    padding: 7px 14px; font-size: 12px; font-weight: 600; color: var(--text);
    cursor: pointer; font-family: var(--sans); outline: none;
  }

  /* ── STAT CARDS TOP ROW ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; position: relative; overflow: hidden; transition: border-color .2s, transform .2s; }
  .stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .stat-card::after { content:''; position:absolute; top:0; right:0; width:80px; height:80px; border-radius:50%; opacity:.05; }
  .stat-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .stat-main  { display: flex; align-items: flex-end; gap: 8px; }
  .stat-val   { font-size: 30px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
  .stat-delta { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 20px; margin-bottom: 3px; white-space: nowrap; }
  .delta-up   { background: rgba(34,197,94,.1); color: var(--green); }
  .delta-dn   { background: rgba(239,68,68,.1);  color: var(--red); }
  .delta-neu  { background: rgba(6,182,212,.1);  color: var(--cyan); }
  .stat-bar-wrap { margin-top: 14px; height: 3px; background: var(--surface3); border-radius: 3px; overflow: hidden; }
  .stat-bar-fill { height: 100%; border-radius: 3px; }
  .stat-sub   { font-size: 11px; color: var(--muted); margin-top: 8px; }
  /* Mini bar chart in bandwidth card */
  .mini-bars  { display: flex; align-items: flex-end; gap: 3px; height: 30px; margin-top: 12px; }
  .mini-bar   { flex: 1; border-radius: 2px; transition: height .4s; }
  /* Healthy dot */
  .health-dot { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--green); margin-top: 10px; }
  .health-dot::before { content:''; width:7px; height:7px; border-radius:50%; background:var(--green); animation: hpulse 1.5s ease-in-out infinite; }
  @keyframes hpulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* ── MIDDLE ROW ── */
  .mid-grid { display: grid; grid-template-columns: 1fr 340px; gap: 18px; margin-bottom: 18px; }

  /* ── BAR CHART ── */
  .chart-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .chart-hdr  { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .chart-title{ font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .chart-sub  { font-size: 12px; color: var(--muted); }
  .chart-legend { display: flex; gap: 14px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); font-weight: 500; }
  .legend-dot  { width: 8px; height: 8px; border-radius: 50%; }
  .bar-chart-svg { width: 100%; overflow: visible; }
  .bar-chart-wrap { position: relative; }
  .chart-tooltip {
    position: absolute; background: var(--surface3); border: 1px solid var(--border2);
    border-radius: 8px; padding: 8px 12px; font-size: 11px; font-family: var(--mono);
    pointer-events: none; white-space: nowrap; z-index: 10;
    transform: translate(-50%, -110%);
  }
  .chart-x-labels { display: flex; justify-content: space-between; padding: 6px 0 0; }
  .chart-x-label  { font-size: 10px; color: var(--muted); font-family: var(--mono); }

  /* ── LATENCY HEATMAP ── */
  .heatmap-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .hmap-row { margin-bottom: 10px; }
  .hmap-lbl-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .hmap-lbl   { font-size: 11px; font-weight: 600; font-family: var(--mono); color: var(--muted); }
  .hmap-pct   { font-size: 11px; font-weight: 700; }
  .hmap-bar   { height: 8px; background: var(--surface3); border-radius: 4px; overflow: hidden; }
  .hmap-fill  { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(.4,0,.2,1); }
  .p99-box {
    margin-top: 20px; padding: 16px; background: var(--surface2);
    border: 1px solid var(--border2); border-radius: 10px;
    display: flex; align-items: center; gap: 12px;
  }
  .p99-ico { width: 36px; height: 36px; border-radius: 9px; background: rgba(245,158,11,.12); display: flex; align-items: center; justify-content: center; color: var(--yellow); flex-shrink: 0; }
  .p99-label { font-size: 11px; color: var(--muted); margin-bottom: 3px; }
  .p99-val   { font-size: 22px; font-weight: 800; letter-spacing: -1px; font-family: var(--mono); }

  /* ── BOTTOM ROW ── */
  .bot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  /* ── REGIONAL TRAFFIC ── */
  .regional-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .globe-wrap { position: relative; margin: 16px 0; }
  .globe-svg { width: 100%; }
  .region-bars { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 16px; }
  .region-item { text-align: center; }
  .region-name { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .region-pct  { font-size: 18px; font-weight: 800; letter-spacing: -1px; }
  .region-bar-wrap { height: 3px; background: var(--surface3); border-radius: 3px; overflow: hidden; margin-top: 5px; }
  .region-bar-fill { height: 100%; border-radius: 3px; transition: width 1.2s cubic-bezier(.4,0,.2,1); }

  /* ── TOP ROUTES ── */
  .routes-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
  .routes-hdr  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .view-all    { font-size: 12px; font-weight: 600; color: var(--accent2); cursor: pointer; transition: opacity .2s; }
  .view-all:hover { opacity: .7; }
  .routes-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .routes-table th { padding: 6px 8px; text-align: left; font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); }
  .routes-table td { padding: 11px 8px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .routes-table tr:last-child td { border-bottom: none; }
  .routes-table tr:hover td { background: rgba(255,255,255,.015); }
  .endpoint-chip { background: var(--surface2); border: 1px solid var(--border2); border-radius: 5px; padding: 3px 8px; font-family: var(--mono); font-size: 11px; color: var(--accent2); white-space: nowrap; }
  .err-high { color: var(--red); font-weight: 700; }
  .err-med  { color: var(--yellow); font-weight: 700; }
  .err-low  { color: var(--green); font-weight: 700; }

  /* ── SKELETON ── */
  .skeleton { background: linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── MOBILE BOTTOM NAV ── */
  .mob-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 8px 0 16px; z-index: 100; }
  .mob-nav-items { display: flex; justify-content: space-around; }
  .mob-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--muted); cursor: pointer; font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 6px 14px; transition: color .18s; }
  .mob-item.active { color: var(--accent2); }

  .fade-in { animation: fadeIn .4s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .stagger-1 { animation-delay: .05s; animation-fill-mode: both; }
  .stagger-2 { animation-delay: .1s;  animation-fill-mode: both; }
  .stagger-3 { animation-delay: .15s; animation-fill-mode: both; }
  .stagger-4 { animation-delay: .2s;  animation-fill-mode: both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .mid-grid   { grid-template-columns: 1fr; }
    .bot-grid   { grid-template-columns: 1fr; }
  }
  @media (max-width: 900px) {
    .sidebar   { display: none; }
    .topnav    { padding: 0 16px; }
    .topnav-links { display: none; }
    .main      { padding: 16px 16px 90px; }
    .mob-nav   { display: block; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .page-title { font-size: 20px; }
    .user-name, .user-tier { display: none; }
  }
  @media (max-width: 540px) {
    .stats-grid { grid-template-columns: 1fr; }
    .region-bars { grid-template-columns: repeat(2,1fr); }
    .hdr-right  { display: none; }
  }
`;

// ─── Bar Chart SVG ────────────────────────────────────────────────────────
function BarChart({ data, loading }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  if (loading) return (
    <div style={{height:180}}>
      <div className="skeleton" style={{height:"100%", borderRadius:8}}/>
    </div>
  );

  const max    = Math.max(...data.map(d => d.success + d.failed), 1);
  const W      = 560;
  const H      = 160;
  const barW   = Math.floor(W / data.length) - 6;
  const xStep  = W / data.length;

  return (
    <div className="bar-chart-wrap" style={{position:"relative"}}>
      <svg ref={svgRef} className="bar-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* Y grid lines */}
        {[0.25,0.5,0.75,1].map(f => (
          <line key={f} x1={0} y1={H*(1-f)} x2={W} y2={H*(1-f)}
            stroke="rgba(255,255,255,.04)" strokeWidth={1} strokeDasharray="4 4"/>
        ))}

        {data.map((d, i) => {
          const totalH  = ((d.success + d.failed) / max) * H;
          const failH   = (d.failed / max) * H;
          const succH   = totalH - failH;
          const x       = i * xStep + (xStep - barW) / 2;
          const isHover = tooltip?.idx === i;

          return (
            <g key={i}
              onMouseEnter={e => {
                const rect = svgRef.current?.getBoundingClientRect();
                const svgX = (x + barW/2) / W * 100;
                setTooltip({ idx:i, x:svgX, d });
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{cursor:"pointer"}}
            >
              {/* Success bar */}
              <rect
                x={x} y={H - totalH} width={barW} height={succH}
                rx={3} ry={3}
                fill={isHover ? "#60a5fa" : "rgba(59,130,246,.45)"}
                style={{transition:"fill .15s"}}
              />
              {/* Failed bar on top */}
              {failH > 0 && (
                <rect
                  x={x} y={H - failH} width={barW} height={failH}
                  rx={2} ry={2}
                  fill={isHover ? "#f87171" : "rgba(239,68,68,.55)"}
                  style={{transition:"fill .15s"}}
                />
              )}
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div className="chart-tooltip" style={{
          left: tooltip.x+"%", top: 0,
          fontSize:11, color:"var(--text)",
        }}>
          <div style={{color:"var(--accent2)",marginBottom:3}}>{tooltip.d.label}</div>
          <div>✓ {(tooltip.d.success/1000).toFixed(1)}k requests</div>
          {tooltip.d.failed > 0 && <div style={{color:"var(--red)"}}>✕ {tooltip.d.failed} errors</div>}
        </div>
      )}

      <div className="chart-x-labels">
        {data.filter((_,i) => i % Math.ceil(data.length/6) === 0).map((d,i) => (
          <span key={i} className="chart-x-label">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Globe SVG ───────────────────────────────────────────────────────────
function GlobeViz({ regions }) {
  return (
    <div className="globe-wrap">
      <svg className="globe-svg" viewBox="0 0 400 220" style={{height:180}}>
        <defs>
          <radialGradient id="globeGrad" cx="50%" cy="40%">
            <stop offset="0%"   stopColor="#0d2a3a" stopOpacity="1"/>
            <stop offset="100%" stopColor="#060d14" stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity=".15"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Globe body */}
        <ellipse cx="200" cy="110" rx="180" ry="105" fill="url(#globeGrad)" stroke="#1a3a4a" strokeWidth=".8"/>
        <ellipse cx="200" cy="110" rx="180" ry="105" fill="url(#glowGrad)"/>

        {/* Latitude lines */}
        {[-60,-30,0,30,60].map(lat => {
          const y = 110 + (lat/90)*105;
          const rx = Math.sqrt(Math.max(0, 180*180 - (y-110)*(y-110)));
          return rx > 0 ? <ellipse key={lat} cx="200" cy={y} rx={rx} ry={rx*0.25}
            fill="none" stroke="rgba(6,182,212,.08)" strokeWidth=".6"/> : null;
        })}
        {/* Longitude lines */}
        {[0,30,60,90,120,150].map(lon => (
          <ellipse key={lon} cx="200" cy="110" rx={180*Math.abs(Math.cos(lon*Math.PI/180))+1} ry="105"
            fill="none" stroke="rgba(6,182,212,.06)" strokeWidth=".6"
            transform={`rotate(${lon},200,110)`}/>
        ))}

        {/* Continents rough shapes */}
        {/* North America */}
        <path d="M80 70 Q100 60 120 75 Q130 90 115 110 Q105 120 90 115 Q75 100 80 70Z"
          fill="rgba(6,182,212,.18)" stroke="rgba(6,182,212,.3)" strokeWidth=".8"/>
        {/* Europe */}
        <path d="M185 65 Q200 60 215 68 Q218 80 210 85 Q198 88 188 80Z"
          fill="rgba(59,130,246,.2)" stroke="rgba(59,130,246,.35)" strokeWidth=".8"/>
        {/* Africa */}
        <path d="M188 88 Q205 85 215 95 Q220 115 215 135 Q205 145 192 140 Q182 130 184 110Z"
          fill="rgba(6,182,212,.12)" stroke="rgba(6,182,212,.22)" strokeWidth=".8"/>
        {/* Asia */}
        <path d="M215 58 Q255 55 285 70 Q295 85 285 100 Q270 108 245 102 Q228 95 218 82Z"
          fill="rgba(139,92,246,.15)" stroke="rgba(139,92,246,.28)" strokeWidth=".8"/>
        {/* Australia */}
        <path d="M290 125 Q308 120 318 130 Q320 145 308 150 Q295 152 288 142Z"
          fill="rgba(245,158,11,.12)" stroke="rgba(245,158,11,.22)" strokeWidth=".8"/>
        {/* South America */}
        <path d="M110 118 Q125 112 132 125 Q135 145 128 160 Q118 168 108 160 Q100 148 102 132Z"
          fill="rgba(34,197,94,.12)" stroke="rgba(34,197,94,.22)" strokeWidth=".8"/>

        {/* Traffic dots with pulse */}
        {[
          {cx:100,cy:92, r:4, col:"#60a5fa", label:"NA"},
          {cx:198,cy:74, r:3.5, col:"#60a5fa", label:"EU"},
          {cx:258,cy:80, r:3, col:"#8b5cf6",  label:"AP"},
          {cx:305,cy:135,r:2.5,col:"#f59e0b",  label:"OT"},
        ].map((dot,i) => (
          <g key={i}>
            <circle cx={dot.cx} cy={dot.cy} r={dot.r*2.5} fill={dot.col} opacity=".1">
              <animate attributeName="r" values={`${dot.r*2} ${dot.r*4} ${dot.r*2}`} dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".15 0 .15" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.col} opacity=".9"/>
          </g>
        ))}

        {/* Connection lines */}
        {[
          {x1:100,y1:92,x2:198,y2:74},
          {x1:198,y1:74,x2:258,y2:80},
          {x1:258,y1:80,x2:305,y2:135},
        ].map((l,i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(96,165,250,.15)" strokeWidth=".8" strokeDasharray="3 3"/>
        ))}
      </svg>

      {/* Region bars below globe */}
      <div className="region-bars">
        {regions.map((r,i) => (
          <div className="region-item" key={i}>
            <div className="region-name">{r.label}</div>
            <div className="region-pct" style={{color:r.color}}>{r.pct}%</div>
            <div className="region-bar-wrap">
              <div className="region-bar-fill" style={{width:r.pct+"%", background:r.color}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"dashboard", icon:"grid",     lbl:"Dashboard"},
  {id:"projects",  icon:"layers",   lbl:"Projects"},
  {id:"analytics", icon:"chart",    lbl:"Analytics"},
  {id:"settings",  icon:"settings", lbl:"Settings"},
  {id:"docs",      icon:"docs",     lbl:"Docs"},
];
const MOB_ITEMS = [
  {id:"dashboard", icon:"grid",     lbl:"Dashboard"},
  {id:"projects",  icon:"layers",   lbl:"Projects"},
  {id:"analytics", icon:"chart",    lbl:"Analytics"},
  {id:"settings",  icon:"settings", lbl:"Settings"},
  {id:"docs",      icon:"docs",     lbl:"Docs"},
];

// Fallback / demo data while API loads
const DEMO = {
  totalRequests: 1200000,
  totalRequestsDelta: "+12.4%",
  bandwidth: "4.5TB",
  bandwidthDelta: "+5.2%",
  avgLatency: 42,
  avgLatencyDelta: "-3ms",
  errorRate: 0.12,
  errorRateDelta: "+0.02%",
  chartData: [
    {label:"00:00",success:48000, failed:120},
    {label:"02:00",success:52000, failed:80},
    {label:"04:00",success:38000, failed:60},
    {label:"06:00",success:70000, failed:200},
    {label:"08:00",success:120000,failed:450},
    {label:"10:00",success:145000,failed:380},
    {label:"12:00",success:162000,failed:520},
    {label:"14:00",success:138000,failed:310},
    {label:"16:00",success:155000,failed:280},
    {label:"18:00",success:148000,failed:360},
    {label:"20:00",success:130000,failed:290},
    {label:"22:00",success:95000, failed:180},
  ],
  latencyBuckets: [
    {label:"0–20ms",  pct:85, color:"#22c55e"},
    {label:"21–50ms", pct:12, color:"#06b6d4"},
    {label:"51–100ms",pct:2,  color:"#f59e0b"},
    {label:"100ms+",  pct:1,  color:"#ef4444"},
  ],
  p99Latency: 142,
  regions: [
    {label:"North America", pct:42, color:"#60a5fa"},
    {label:"Europe",        pct:31, color:"#60a5fa"},
    {label:"Asia Pacific",  pct:19, color:"#8b5cf6"},
    {label:"Others",        pct:8,  color:"#f59e0b"},
  ],
  topRoutes: [
    {endpoint:"/api/v1/auth/login",      traffic:"412,890",  errorRate:"0.02%", level:"low"},
    {endpoint:"/api/v1/users/profile",   traffic:"288,102",  errorRate:"0.05%", level:"low"},
    {endpoint:"/api/v1/billing/checkout",traffic:"156,774",  errorRate:"1.42%", level:"high"},
    {endpoint:"/static/assets/bundle.js",traffic:"92,400",   errorRate:"0.00%", level:"low"},
    {endpoint:"/api/v1/search",          traffic:"64,212",   errorRate:"0.88%", level:"med"},
  ],
};

const fmt = (n) => {
  if (n >= 1e9) return (n/1e9).toFixed(1)+"B";
  if (n >= 1e6) return (n/1e6).toFixed(1)+"M";
  if (n >= 1e3) return (n/1e3).toFixed(0)+"K";
  return n;
};

export default function AnalyticsPage({ user, onNavigate, onLogout }) {
  const [active, setActive]     = useState("analytics");
  const [timeRange, setTimeRange] = useState("Last 24 Hours");
  const [data, setData]         = useState(DEMO);
  const [loading, setLoading]   = useState(true);
  const [animated, setAnimated] = useState(false);

  // ── Fetch real analytics from backend ───────────────────────
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Trigger bar animations after mount
  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/analytics", { params: { range: timeRange } });
      // Merge with DEMO structure (backend may return partial data)
      setData(prev => ({ ...prev, ...res.data }));
    } catch (_) {
      // Silently fall back to demo data if backend not available
    } finally {
      setLoading(false);
    }
  };

  const navigate = (id) => { setActive(id); onNavigate && onNavigate(id); };

  const initials = user?.username ? user.username.slice(0,2).toUpperCase() : "AR";
  const username = user?.username || "Alex Rivera";

  const errClass = (level) => level==="high"?"err-high":level==="med"?"err-med":"err-low";

  return (
    <>
      <style>{css}</style>
      <div className="analytics-wrap">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="s-logo">
            <div className="s-logo-icon"><Icon d={I.cloud} size={16} color="#fff"/></div>
            <div>
              <div className="s-logo-title">CloudDeployLite</div>
              <div className="s-logo-sub">Infrastructure Console</div>
            </div>
          </div>

          {NAV_ITEMS.map(n => (
            <div key={n.id} className={`s-item ${active===n.id?"active":""}`} onClick={()=>navigate(n.id)}>
              <Icon d={I[n.icon]} size={15}/>{n.lbl}
            </div>
          ))}

          <div className="s-div"/>
          <button className="s-deploy" onClick={()=>navigate("deploy")}>
            <Icon d={I.rocket} size={15}/>+ Deploy New App
          </button>
          <button className="s-logout" onClick={onLogout}>
            <Icon d={I.logout} size={15}/>Logout
          </button>
        </aside>

        {/* ── RIGHT ── */}
        <div className="right">

          {/* TOP NAV */}
          <nav className="topnav">
            <div className="topnav-search">
              <span className="search-ico"><Icon d={I.search} size={13}/></span>
              <input placeholder="Search clusters, logs, or metrics..."/>
            </div>
            <div className="topnav-links">
              <span className="topnav-link">Docs</span>
              <span className="topnav-link">Feedback</span>
              <span className="topnav-link">Support</span>
            </div>
            <div className="topnav-right">
              <div className="t-icon-btn">
                <Icon d={I.bell} size={15}/>
                <div className="notif-dot"/>
              </div>
              <div className="t-icon-btn"><Icon d={I.settings} size={15}/></div>
              <div className="user-chip">
                <div className="user-avatar">{initials}</div>
                <div>
                  <div className="user-name">{username}</div>
                  <div className="user-tier">Pro Tier</div>
                </div>
              </div>
            </div>
          </nav>

          {/* ── MAIN ── */}
          <div className="main">

            {/* PAGE HEADER */}
            <div className="page-hdr fade-in">
              <div>
                <div className="page-title">Analytics</div>
                <div className="page-sub">Real-time infrastructure performance and usage metrics.</div>
              </div>
              <div className="hdr-right">
                <select className="time-select" value={timeRange} onChange={e=>setTimeRange(e.target.value)}>
                  {["Last 1 Hour","Last 6 Hours","Last 24 Hours","Last 7 Days","Last 30 Days"].map(t=>(
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <button className="btn btn-ghost" onClick={fetchAnalytics}>
                  <Icon d={I.download} size={13}/>Export
                </button>
              </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="stats-grid">

              {/* Total Requests */}
              <div className="stat-card fade-in stagger-1">
                <div className="stat-label">Total Requests</div>
                <div className="stat-main">
                  <div className="stat-val" style={{color:"var(--text)"}}>
                    {loading
                      ? <span className="skeleton" style={{display:"inline-block",width:80,height:30}}/>
                      : fmt(data.totalRequests)
                    }
                  </div>
                  <div className="stat-delta delta-up">
                    <Icon d={I.trending} size={10}/>
                    {data.totalRequestsDelta}
                  </div>
                </div>
                <div className="stat-bar-wrap">
                  <div className="stat-bar-fill" style={{width: animated?"72%":"0%", background:"var(--accent)", transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
                </div>
                <div className="stat-sub">vs. previous period</div>
              </div>

              {/* Bandwidth */}
              <div className="stat-card fade-in stagger-2">
                <div className="stat-label">Bandwidth</div>
                <div className="stat-main">
                  <div className="stat-val" style={{color:"var(--cyan)"}}>
                    {loading ? <span className="skeleton" style={{display:"inline-block",width:60,height:30}}/> : data.bandwidth}
                  </div>
                  <div className="stat-delta delta-up">
                    <Icon d={I.arrowup} size={10}/>{data.bandwidthDelta}
                  </div>
                </div>
                <div className="mini-bars">
                  {[30,50,45,70,60,80,65,90,75,85,70,95].map((h,i)=>(
                    <div key={i} className="mini-bar" style={{
                      height: animated ? h*0.3+"px" : "4px",
                      background: i===11 ? "var(--cyan)" : "rgba(6,182,212,.35)",
                      transition: `height ${0.6+i*0.04}s cubic-bezier(.4,0,.2,1)`,
                    }}/>
                  ))}
                </div>
              </div>

              {/* Avg Latency */}
              <div className="stat-card fade-in stagger-3">
                <div className="stat-label">Avg Latency</div>
                <div className="stat-main">
                  <div className="stat-val" style={{color:"var(--yellow)"}}>
                    {loading ? <span className="skeleton" style={{display:"inline-block",width:60,height:30}}/> : `${data.avgLatency}ms`}
                  </div>
                  <div className="stat-delta delta-neu">
                    <Icon d={I.arrowdn} size={10}/>{data.avgLatencyDelta}
                  </div>
                </div>
                <div className="stat-bar-wrap" style={{marginTop:14}}>
                  <div className="stat-bar-fill" style={{width: animated ? (data.avgLatency/200*100)+"%" : "0%", background:"var(--yellow)", transition:"width 1.2s .2s cubic-bezier(.4,0,.2,1)"}}/>
                </div>
                <div className="stat-sub">Global baseline: 45ms</div>
              </div>

              {/* Error Rate */}
              <div className="stat-card fade-in stagger-4">
                <div className="stat-label">Error Rate</div>
                <div className="stat-main">
                  <div className="stat-val" style={{color:"var(--text)"}}>
                    {loading ? <span className="skeleton" style={{display:"inline-block",width:70,height:30}}/> : `${data.errorRate}%`}
                  </div>
                  <div className="stat-delta delta-dn">
                    <Icon d={I.arrowup} size={10}/>{data.errorRateDelta}
                  </div>
                </div>
                <div className="health-dot">HEALTHY</div>
              </div>
            </div>

            {/* ── CHART + HEATMAP ── */}
            <div className="mid-grid">

              {/* Bar Chart */}
              <div className="chart-card fade-in">
                <div className="chart-hdr">
                  <div>
                    <div className="chart-title">Requests Over Time</div>
                    <div className="chart-sub">Global aggregate throughput across all endpoints.</div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-dot" style={{background:"var(--accent)"}}/>Successful
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot" style={{background:"var(--red)"}}/>Failed
                    </div>
                  </div>
                </div>
                <BarChart data={data.chartData} loading={loading}/>
              </div>

              {/* Latency Heatmap */}
              <div className="heatmap-card fade-in">
                <div className="chart-title" style={{marginBottom:4}}>Latency Heatmap</div>
                <div className="chart-sub" style={{marginBottom:20}}>Distribution by response time.</div>

                {data.latencyBuckets.map((b,i) => (
                  <div className="hmap-row" key={i}>
                    <div className="hmap-lbl-row">
                      <span className="hmap-lbl">{b.label}</span>
                      <span className="hmap-pct" style={{color:b.color}}>{b.pct}%</span>
                    </div>
                    <div className="hmap-bar">
                      <div className="hmap-fill" style={{
                        width: animated ? b.pct+"%" : "0%",
                        background: b.color,
                        transitionDelay: `${i*0.1}s`,
                      }}/>
                    </div>
                  </div>
                ))}

                <div className="p99-box">
                  <div className="p99-ico"><Icon d={I.zap} size={18}/></div>
                  <div>
                    <div className="p99-label">P99 Latency</div>
                    <div className="p99-val">{data.p99Latency}ms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── REGIONAL + TOP ROUTES ── */}
            <div className="bot-grid">

              {/* Regional Traffic */}
              <div className="regional-card fade-in">
                <div className="chart-title">Regional Traffic</div>
                <div className="chart-sub" style={{marginTop:3}}>Global edge nodes distribution.</div>
                <GlobeViz regions={data.regions}/>
              </div>

              {/* Top Routes */}
              <div className="routes-card fade-in">
                <div className="routes-hdr">
                  <div>
                    <div className="chart-title">Top Routes</div>
                  </div>
                  <span className="view-all">View All Routes</span>
                </div>

                {loading ? (
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[1,2,3,4,5].map(i=>(
                      <div key={i} className="skeleton" style={{height:36,borderRadius:6}}/>
                    ))}
                  </div>
                ) : (
                  <table className="routes-table">
                    <thead><tr>
                      <th>Endpoint</th>
                      <th>Traffic</th>
                      <th>Error Rate</th>
                    </tr></thead>
                    <tbody>
                      {data.topRoutes.map((r,i) => (
                        <tr key={i}>
                          <td><span className="endpoint-chip">{r.endpoint}</span></td>
                          <td style={{fontSize:12,color:"var(--muted)",fontFamily:"var(--mono)",whiteSpace:"nowrap"}}>{r.traffic} reqs</td>
                          <td className={errClass(r.level)} style={{fontFamily:"var(--mono)",fontSize:12}}>{r.errorRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── MOBILE BOTTOM NAV ── */}
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