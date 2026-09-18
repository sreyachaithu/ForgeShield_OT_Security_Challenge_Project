import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const assets = [
  {id:"PLC-104", name:"Line 4 PLC", type:"PLC", zone:"Production / Line 4", criticality:"Critical", risk:91, state:"Online", vendor:"Siemens", protocol:"S7", x:18, y:48},
  {id:"HMI-220", name:"Line 4 HMI", type:"HMI", zone:"Production / Line 4", criticality:"High", risk:72, state:"Online", vendor:"Siemens", protocol:"HTTP", x:38, y:35},
  {id:"ENG-018", name:"Engineering Workstation", type:"Workstation", zone:"Engineering", criticality:"High", risk:84, state:"Online", vendor:"Dell", protocol:"RDP", x:57, y:57},
  {id:"HIST-02", name:"Process Historian", type:"Server", zone:"Operations", criticality:"Critical", risk:79, state:"Online", vendor:"Microsoft", protocol:"SMB", x:76, y:32},
  {id:"SCADA-01", name:"SCADA Server", type:"Server", zone:"Operations", criticality:"Critical", risk:88, state:"Online", vendor:"Microsoft", protocol:"OPC-UA", x:73, y:66},
  {id:"FW-01", name:"OT Firewall", type:"Firewall", zone:"DMZ", criticality:"Critical", risk:44, state:"Online", vendor:"Palo Alto", protocol:"TLS", x:40, y:77},
  {id:"JUMP-01", name:"Remote Access Jump Host", type:"Server", zone:"DMZ", criticality:"High", risk:76, state:"Online", vendor:"Linux", protocol:"SSH", x:58, y:20}
];

const findings = [
  ["F-2418","Critical","Engineering workstation can reach Line 4 PLC","ENG-018","12 min ago"],
  ["F-2407","High","Unexpected SMB communication to historian","HIST-02","38 min ago"],
  ["F-2399","High","Remote access host outside maintenance window","JUMP-01","1 hr ago"],
  ["F-2381","Medium","New unmanaged device detected","—","2 hrs ago"]
];

const edges = [
  ["ENG-018","HMI-220","RDP","Suspicious"],
  ["HMI-220","PLC-104","S7","Normal"],
  ["ENG-018","SCADA-01","SMB","Suspicious"],
  ["SCADA-01","HIST-02","OPC-UA","Normal"],
  ["JUMP-01","ENG-018","SSH","Suspicious"],
  ["FW-01","ENG-018","TLS","Normal"]
];

function Icon({name, size=18}) {
  const paths = {
    grid:"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    path:"M5 5h5v5H5zM14 14h5v5h-5zM10 7h4M14 7l-2-2M14 7l-2 2",
    search:"M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm5-2 4 4",
    bell:"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
    alert:"M12 3 2 20h20L12 3Zm0 6v5m0 3h.01",
    check:"m5 12 4 4L19 6",
    arrow:"M5 12h14m-6-6 6 6-6 6",
    clock:"M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
    filter:"M4 5h16M7 12h10m-7 7h4",
    zoomin:"M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-12v6m-3-3h6m4 4 4 4",
    fit:"M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5",
    menu:"M4 6h16M4 12h16M4 18h16",
    close:"M6 6l12 12M18 6 6 18",
    info:"M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
    server:"M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01",
    activity:"M3 12h4l2-7 5 14 2-7h5",
    layers:"M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.info}/></svg>
}

function Severity({level}) {
  return <span className={`severity ${level.toLowerCase()}`}><i></i>{level}</span>
}

function Header({page,setPage}) {
  return <header className="topbar">
    <div className="brand"><div className="brand-mark">F</div><div><strong>ForgeShield</strong><span>OT SECURITY</span></div></div>
    <nav>
      <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}><Icon name="grid"/>Dashboard</button>
      <button className={page==="paths"?"active":""} onClick={()=>setPage("paths")}><Icon name="path"/>Attack Paths</button>
    </nav>
    <div className="top-actions"><button className="icon-btn" aria-label="Search"><Icon name="search"/></button><button className="icon-btn" aria-label="Notifications"><Icon name="bell"/></button><div className="avatar" aria-label="Analyst profile">CA</div></div>
  </header>
}

function GlobalFilters({site,setSite,time,setTime,severity,setSeverity}) {
  return <section className="filters">
    <div className="filter-group"><label>ENVIRONMENT</label><select value={site} onChange={e=>setSite(e.target.value)}><option>All Sites</option><option>Plant North</option><option>Plant South</option><option>Warehouse</option></select></div>
    <div className="filter-group"><label>TIME RANGE</label><select value={time} onChange={e=>setTime(e.target.value)}><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select></div>
    <div className="filter-group"><label>SEVERITY</label><select value={severity} onChange={e=>setSeverity(e.target.value)}><option>All severities</option><option>Critical</option><option>High</option><option>Medium</option></select></div>
    <div className="filter-search"><Icon name="search"/><input placeholder="Search assets or findings" aria-label="Search assets or findings"/></div>
    <button className="filter-btn"><Icon name="filter"/> Filters</button>
  </section>
}

function Posture() {
  return <div className="card posture">
    <div className="card-head"><div><p className="eyebrow">SECURITY POSTURE</p><h2>Attention required</h2></div><span className="status-pill warning"><i/>Monitoring with gaps</span></div>
    <div className="posture-grid">
      <div className="score"><div className="ring"><b>72</b><span>/100</span></div><div><strong>Posture score</strong><p>+4 from yesterday</p></div></div>
      <div className="mini-stat"><b>1,284</b><span>Total assets</span><em>1,251 monitored</em></div>
      <div className="mini-stat critical-stat"><b>14</b><span>Critical assets</span><em>3 exposed</em></div>
      <div className="mini-stat"><b>7</b><span>Attack paths</span><em>2 high confidence</em></div>
    </div>
  </div>
}

function RiskChart() {
  return <div className="card chart-card">
    <div className="card-head"><div><p className="eyebrow">RISK & FINDINGS</p><h3>Open findings</h3></div><button className="text-btn">View all <Icon name="arrow" size={14}/></button></div>
    <div className="chart-wrap">
      <div className="donut"><div><b>42</b><span>open</span></div></div>
      <div className="legend"><div><span className="dot critical"></span>Critical <b>4</b></div><div><span className="dot high"></span>High <b>11</b></div><div><span className="dot medium"></span>Medium <b>19</b></div><div><span className="dot low"></span>Low <b>8</b></div></div>
    </div>
    <div className="trend"><span>30-day risk trend</span><svg viewBox="0 0 320 48" preserveAspectRatio="none"><polyline points="0,37 32,34 64,38 96,29 128,32 160,22 192,27 224,16 256,21 288,12 320,14"/></svg><b>−8%</b></div>
  </div>
}

function AssetVisibility() {
  return <div className="card asset-card">
    <div className="card-head"><div><p className="eyebrow">ASSET VISIBILITY</p><h3>1,284 assets</h3></div><span className="status-pill healthy"><i/>97.4% monitored</span></div>
    <div className="asset-bars">
      <div><span>Servers</span><b>284</b><i style={{width:"78%"}}/></div>
      <div><span>PLCs</span><b>391</b><i style={{width:"92%"}}/></div>
      <div><span>HMIs</span><b>246</b><i style={{width:"66%"}}/></div>
      <div><span>Network</span><b>363</b><i style={{width:"84%"}}/></div>
    </div>
    <div className="asset-foot"><span><Icon name="alert" size={14}/> 18 incomplete profiles</span><span><Icon name="clock" size={14}/> 15 offline</span></div>
  </div>
}

function AttackPreview({setPage}) {
  return <div className="card attack-preview">
    <div className="card-head"><div><p className="eyebrow">ATTACK PATH PREVIEW</p><h3>2 high-confidence paths</h3></div><button className="text-btn" onClick={()=>setPage("paths")}>Open map <Icon name="arrow" size={14}/></button></div>
    <div className="path-row">
      <div className="path-line"><span className="node source">ENG</span><i></i><span className="node pivot">HMI</span><i></i><span className="node target">PLC</span></div>
      <div><strong>Engineering → Line 4 PLC</strong><span>3 hops · Cross-zone · High confidence</span></div>
      <Severity level="Critical"/>
    </div>
    <div className="path-row">
      <div className="path-line"><span className="node source">JMP</span><i></i><span className="node pivot">ENG</span><i></i><span className="node target">SCADA</span></div>
      <div><strong>Remote access → SCADA</strong><span>3 hops · DMZ crossing · Medium confidence</span></div>
      <Severity level="High"/>
    </div>
  </div>
}

function Topology() {
  return <div className="card topology">
    <div className="card-head"><div><p className="eyebrow">NETWORK INSIGHT</p><h3>Zone connectivity</h3></div><span className="muted">Last 24h</span></div>
    <div className="topology-visual">
      <div className="zone zone1"><b>ENTERPRISE</b><span>312 assets</span></div>
      <div className="connector c1"></div>
      <div className="zone zone2"><b>DMZ</b><span>86 assets</span></div>
      <div className="connector c2"></div>
      <div className="zone zone3 hot"><b>OPERATIONS</b><span>417 assets</span></div>
      <div className="connector c3"></div>
      <div className="zone zone4"><b>PRODUCTION</b><span>469 assets</span></div>
    </div>
    <div className="topology-note"><span className="pulse"></span><strong>Unusual concentration</strong><span>Engineering zone → Production Line 4</span></div>
  </div>
}

function Timeline() {
  return <div className="card timeline-card">
    <div className="card-head"><div><p className="eyebrow">RECENT CHANGES</p><h3>Activity timeline</h3></div><button className="text-btn">View history</button></div>
    <div className="timeline">
      {findings.map((f,i)=><div className="timeline-item" key={f[0]}><div className={`timeline-icon ${i===0?"danger":""}`}><Icon name={i===0?"alert":i===1?"activity":"server"} size={14}/></div><div><strong>{f[2]}</strong><span>{f[4]} · {f[3]}</span></div><Severity level={f[1]}/></div>)}
    </div>
  </div>
}

function SensorHealth() {
  return <div className="card sensor">
    <div className="card-head"><div><p className="eyebrow">PLATFORM HEALTH</p><h3>Collection status</h3></div><span className="status-pill warning"><i/>Degraded</span></div>
    <div className="health-main"><div className="health-number">97.4<span>%</span></div><div><strong>Data freshness</strong><p>8 sensors delayed &gt; 15 min</p></div></div>
    <div className="health-list"><div><span>North Plant</span><b>100%</b></div><div><span>South Plant</span><b>96%</b></div><div><span>Warehouse</span><b>91%</b></div></div>
    <div className="data-note"><Icon name="info" size={14}/> Conclusions may be incomplete where collection is degraded.</div>
  </div>
}

function Dashboard({setPage}) {
  const [site,setSite]=useState("All Sites"), [time,setTime]=useState("Last 24 hours"), [severity,setSeverity]=useState("All severities");
  return <main>
    <div className="page-title"><div><p className="eyebrow">OVERVIEW / 18 SEP 2026</p><h1>Security operations</h1><p>Operational posture across monitored industrial environments.</p></div><button className="primary"><Icon name="activity"/> Run health check</button></div>
    <GlobalFilters {...{site,setSite,time,setTime,severity,setSeverity}}/>
    <div className="grid dashboard-grid">
      <div className="wide"><Posture/></div>
      <RiskChart/>
      <AssetVisibility/>
      <AttackPreview setPage={setPage}/>
      <Topology/>
      <Timeline/>
      <SensorHealth/>
    </div>
  </main>
}

function Graph({selected,setSelected}) {
  const byId = Object.fromEntries(assets.map(a=>[a.id,a]));
  return <div className="graph">
    <div className="graph-toolbar"><span><b>Path 01</b> · Engineering → Line 4 PLC</span><div><button aria-label="Zoom in"><Icon name="zoomin"/></button><button aria-label="Fit to view"><Icon name="fit"/></button><button aria-label="Layers"><Icon name="layers"/></button></div></div>
    <svg className="edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Attack path graph">
      <defs><marker id="arrow-risk" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor"/></marker></defs>
      {edges.map(([a,b,p,kind])=>{const A=byId[a],B=byId[b]; return <g key={a+b} className={kind==="Suspicious"?"risky-edge":"normal-edge"}><line x1={A.x} y1={A.y} x2={B.x} y2={B.y} markerEnd="url(#arrow-risk)"/><text x={(A.x+B.x)/2} y={(A.y+B.y)/2-2}>{p}</text></g>})}
    </svg>
    {assets.map(a=><button key={a.id} className={`graph-node ${a.criticality.toLowerCase()} ${selected===a.id?"selected":""}`} style={{left:`${a.x}%`,top:`${a.y}%`}} onClick={()=>setSelected(a.id)} aria-label={`${a.name}, ${a.criticality}, risk ${a.risk}`}>
      <div className="node-symbol"><Icon name={a.type==="Server"?"server":a.type==="PLC"?"activity":"grid"} size={17}/></div><div className="node-copy"><b>{a.name}</b><span>{a.type} · {a.zone}</span></div><em>{a.risk}</em>
    </button>)}
    <div className="legend-box"><b>GRAPH LEGEND</b><span><i className="legend-dot source"/>Source</span><span><i className="legend-dot pivot"/>Pivot</span><span><i className="legend-dot target"/>Target</span><span><i className="legend-line"/>Normal relationship</span><span><i className="legend-line risky"/>Suspicious / risky</span></div>
    <div className="minimap"><span className="mini-rect"></span><i></i><i></i><i></i></div>
  </div>
}

function InvestigationPanel({assetId,onClose}) {
  const a=assets.find(x=>x.id===assetId);
  if(!a) return <aside className="investigation empty-panel"><Icon name="path" size={28}/><h3>Select a node</h3><p>Select an asset, edge, or path to inspect its evidence without leaving the graph.</p></aside>
  return <aside className="investigation">
    <div className="panel-head"><div><p className="eyebrow">SELECTED ASSET</p><h2>{a.name}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close details"><Icon name="close"/></button></div>
    <div className="asset-identity"><div className="large-icon"><Icon name={a.type==="Server"?"server":"activity"} size={24}/></div><div><b>{a.type}</b><span>{a.id} · {a.vendor}</span></div><Severity level={a.criticality==="Critical"?"Critical":"High"}/></div>
    <div className="risk-callout"><div><span>Exposure risk</span><strong>{a.risk}<small>/100</small></strong></div><div className="risk-meter"><i style={{width:`${a.risk}%`}}/></div><p>Risk is elevated because this asset participates in a reachable cross-zone path.</p></div>
    <section className="detail-section"><h4>WHY IT MATTERS</h4><p>{a.name} is a {a.criticality.toLowerCase()}-critical {a.type.toLowerCase()} in the {a.zone} zone. The selected path can reach this asset through {a.protocol} traffic.</p></section>
    <section className="detail-section"><h4>EVIDENCE</h4><div className="evidence"><span>12 min ago</span><b>Communication observed</b><p>{a.protocol} relationship observed outside the asset's normal peer set.</p></div><div className="evidence"><span>38 min ago</span><b>Finding F-2418</b><p>Engineering workstation has reachable access to this asset.</p></div></section>
    <section className="detail-section"><h4>CONTEXT</h4><div className="kv"><span>Zone</span><b>{a.zone}</b></div><div className="kv"><span>State</span><b className="online">● {a.state}</b></div><div className="kv"><span>Protocol</span><b>{a.protocol}</b></div><div className="kv"><span>Confidence</span><b>High</b></div></section>
    <div className="panel-actions"><button className="primary">Investigate finding</button><button className="secondary">View asset</button></div>
  </aside>
}

function Paths() {
  const [selected,setSelected]=useState("ENG-018");
  const [severity,setSeverity]=useState("All");
  const [single,setSingle]=useState(true);
  return <main className="paths-page">
    <div className="page-title"><div><p className="eyebrow">INVESTIGATION / ATTACK PATHS</p><h1>Attack path map</h1><p>Trace reachable routes to high-value OT assets and inspect the evidence behind each relationship.</p></div><button className="secondary"><Icon name="layers"/> Compare paths</button></div>
    <div className="path-layout">
      <section className="graph-shell">
        <div className="path-controls">
          <div className="search-box"><Icon name="search"/><input placeholder="Search within graph" aria-label="Search within graph"/></div>
          <select value={severity} onChange={e=>setSeverity(e.target.value)}><option>All severity</option><option>Critical</option><option>High</option></select>
          <select><option>All zones</option><option>Production</option><option>Operations</option><option>DMZ</option></select>
          <button className={single?"toggle active":"toggle"} onClick={()=>setSingle(!single)}><span></span>{single?"Single path":"Multi-path"}</button>
        </div>
        <div className="path-meta"><span><Severity level="Critical"/> <b>Path risk 91</b></span><span>3 hops</span><span>High confidence</span><span>Cross-zone exposure</span><button>Show blast radius</button></div>
        <Graph selected={selected} setSelected={setSelected}/>
      </section>
      <InvestigationPanel assetId={selected} onClose={()=>setSelected(null)}/>
    </div>
    <div className="state-strip"><div><span className="state-icon"><Icon name="info"/></span><div><b>Uncertainty is explicit</b><p>Low-confidence relationships are shown with dashed edges and are never presented as confirmed movement.</p></div></div><div><span className="state-icon"><Icon name="clock"/></span><div><b>Data recency</b><p>Graph last refreshed 2 min ago. 8 sensors are currently delayed.</p></div></div></div>
  </main>
}

function App(){
  const [page,setPage]=useState("dashboard");
  return <><Header page={page} setPage={setPage}/>{page==="dashboard"?<Dashboard setPage={setPage}/>:<Paths/>}<footer><span>ForgeShield OT Security · Candidate design prototype</span><span>Keyboard accessible · WCAG-aware status cues · Data shown is illustrative</span></footer></>
}

createRoot(document.getElementById("root")).render(<App/>);