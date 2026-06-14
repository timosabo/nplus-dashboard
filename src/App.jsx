import { useState, useMemo, useEffect } from "react";
import { PROJECTS, STRATEGIES } from "./projectData.js";

// ── Design system ──────────────────────────────────────────────────────────
const C = {
  EARTH:  "#2E1E0C", ADOBE:  "#A88858", BARK:   "#4A2E10",
  CORTEN: "#C9942A", SAGE:   "#7A9060", DUST:   "#9A8C7A",
  CREAM:  "#F0E8D8", LIGHT:  "#FDFBF8", ALT:    "#F0ECE6",
};
const LENSES = [
  { key:"l1", label:"L1  Energy & Carbon",      short:"Energy",      color:C.CORTEN },
  { key:"l2", label:"L2  Longevity & Circular", short:"Longevity",   color:C.SAGE   },
  { key:"l3", label:"L3  Regenerative Design",  short:"Regenerative",color:C.BARK   },
  { key:"l4", label:"L4  Biophilic Design",     short:"Biophilic",   color:C.ADOBE  },
];
const CERTIFICATIONS = [
  { name:"Passive House", org:"Passive House Institute",
    url:"https://passivehouse.com/en/home/building-certification/#certification-criteria",
    badge:"PH", color:C.CORTEN, lenses:["L1"],
    pitch:"Would you like your home recognized as one of the world's most airtight, energy-efficient buildings?",
    desc:"The rigorous performance standard for envelope, airtightness, and mechanical ventilation. Verified by third-party blower-door testing and energy modeling." },
  { name:"LEED for Homes", org:"U.S. Green Building Council",
    url:"https://www.usgbc.org/leed/rating-systems/leed-homes",
    badge:"LEED", color:C.SAGE, lenses:["L1","L2","L3"],
    pitch:"Would you like your home certified under the world's most widely recognized green building standard?",
    desc:"Comprehensive points-based certification covering energy, water, materials, indoor air quality, and site. Multiple achievement levels from Certified to Platinum." },
  { name:"Living Building Challenge", org:"International Living Future Institute",
    url:"https://living-future.org/lbc/",
    badge:"LBC", color:C.BARK, lenses:["L1","L2","L3","L4"],
    pitch:"Would you like your home to be net-positive in energy, water, and materials — leaving your site better than you found it?",
    desc:"The most ambitious standard in sustainable design. Net-positive across all resource flows. Deeply aligned with the [n+] philosophy — designing spaces to be measurably better for generations." },
  { name:"DOE Zero Energy Ready Home", org:"U.S. Department of Energy",
    url:"https://www.energy.gov/eere/buildings/zero-energy-ready-home",
    badge:"ZERH", color:C.CORTEN, lenses:["L1"],
    pitch:"Would you like your home certified as ready to produce as much energy as it uses — with the addition of solar?",
    desc:"Federal recognition for homes built to a rigorous energy code baseline, designed to reach net-zero energy with the addition of a solar PV array. Pairs naturally with the heat pump + solar strategy." },
  { name:"Cradle to Cradle Certified™", org:"C2C Products Innovation Institute",
    url:"https://www.c2ccertified.org/",
    badge:"C2C", color:C.DUST, lenses:["L2"],
    pitch:"Would you like the materials in your home recognized for being safe, circular, and designed to last?",
    desc:"Product-level certification for material health, recyclability, and responsible manufacturing. Applies to specific assemblies — not the whole building — but creates a documentable materials story." },
  { name:"Architecture 2030 Challenge", org:"Architecture 2030",
    url:"https://architecture2030.org/2030_challenges/2030-challenge/",
    badge:"2030", color:C.ADOBE, lenses:["L1"],
    pitch:"Would you like your home to be part of the global commitment to carbon-neutral buildings by 2030?",
    desc:"The design commitment that drives SALT's energy and carbon targets. Not a building certification — a design standard that can be publicly reported. SALT designs to this benchmark on every project." },
];
const SOURCES = [
  "SALT Sustainability Strategy Library (SSL) — project-adapted cut sheets",
  "Architecture 2030 — The 2030 Challenge (operational carbon and energy targets)",
  "Cradle to Cradle / The Upcycle — McDonough & Braungart (material health and circular economy)",
  "USGBC — Five Key Principles of Regenerative Design (Living Systems Blueprint)",
  "Terrapin Bright Green — 14 Patterns of Biophilic Design",
  "U.S. DOE / ORNL — Whole-wall R-value methodology and airtightness research",
  "IECC Climate Zone data and IRC code requirements (jurisdiction-specific)",
  "Premier Building Systems — SIPs thermal and structural technical data",
  "Passive House Institute — envelope performance benchmarks and airtightness standards",
  "Project-specific structural engineer preliminary design (load and thermal bridge data)",
  "Contractor preliminary pricing input (Design Development phase)",
];

// ── Helpers ────────────────────────────────────────────────────────────────
const composite = s => s.l1 + s.l2 + s.l3 + s.l4;
const scoreColor = n => n >= 34 ? C.SAGE : n >= 26 ? C.ADOBE : n >= 18 ? C.CORTEN : C.DUST;

// ── Tiny components ────────────────────────────────────────────────────────
function ScoreBadge({ score, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: scoreColor(score), display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: size * 0.31, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: size * 0.17, color: "rgba(255,255,255,0.75)", lineHeight: 1 }}>/40</span>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={e => { e.stopPropagation(); onToggle(); }} style={{
      width: 38, height: 22, borderRadius: 11, flexShrink: 0, cursor: "pointer",
      background: on ? C.SAGE : "#C8BFB4", position: "relative", transition: "background 0.2s",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2, left: on ? 18 : 2,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      }} />
    </div>
  );
}

function LensBars({ scores }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {LENSES.map(l => (
        <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
          <div style={{ width: 58, fontSize: 9, color: C.DUST, flexShrink: 0 }}>{l.short}</div>
          <div style={{ flex: 1, height: 5, background: "#E8E0D4", borderRadius: 3 }}>
            <div style={{ width: `${scores[l.key] * 10}%`, height: "100%", background: l.color, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <div style={{ width: 16, fontSize: 9, fontWeight: 700, color: C.BARK, textAlign: "right" }}>{scores[l.key]}</div>
        </div>
      ))}
    </div>
  );
}

// ── Strategy row ───────────────────────────────────────────────────────────
function StrategyRow({ strategy, enabled, onToggle, folderUrl }) {
  const [open, setOpen] = useState(false);
  const score = composite(strategy.scores);
  return (
    <div style={{
      border: `1px solid ${enabled ? "#C8A870" : "#DDD8D0"}`,
      borderLeft: `4px solid ${enabled ? C.CORTEN : "#C8BFB4"}`,
      borderRadius: 6, marginBottom: 8, transition: "all 0.2s",
      background: enabled ? C.CREAM : "#F5F2EE", opacity: enabled ? 1 : 0.6,
    }}>
      {/* Main row */}
      <div onClick={() => setOpen(o => !o)} style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 148px 96px 88px 80px",
        alignItems: "center", gap: 8, padding: "10px 14px", cursor: "pointer",
      }}>
        <Toggle on={enabled} onToggle={onToggle} />

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.EARTH }}>{strategy.name}</div>
          <div style={{ fontSize: 10, color: C.DUST, marginTop: 2 }}>
            {strategy.category} · <span style={{ color: C.ADOBE }}>{strategy.sslRef}</span>
          </div>
        </div>

        <LensBars scores={strategy.scores} />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ScoreBadge score={score} size={44} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: strategy.carbonDelta < 0 ? C.SAGE : C.CORTEN }}>
            {strategy.carbonDelta < 0 ? "−" : "+"}{Math.abs(strategy.carbonDelta)}
          </div>
          <div style={{ fontSize: 9, color: C.DUST, lineHeight: 1.4 }}>kg CO₂e/m²<br />vs. baseline</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: strategy.costPremium <= 5 ? C.SAGE : strategy.costPremium <= 20 ? C.CORTEN : C.BARK }}>
            {strategy.costPremium === 0 ? "Parity" : `+${strategy.costPremium}%`}
          </div>
          <div style={{ fontSize: 9, color: C.DUST, lineHeight: 1.4 }}>vs. standard<br />construction</div>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: "4px 14px 14px 62px", borderTop: `1px solid #E8E0D4` }}>
          <p style={{ fontSize: 12, color: C.BARK, lineHeight: 1.7, marginTop: 10 }}>{strategy.description}</p>
          {folderUrl && (
            <p style={{ fontSize: 11, marginTop: 8 }}>
              <span style={{ color: C.DUST }}>Full project analysis: </span>
              <a href={folderUrl} target="_blank" rel="noreferrer" style={{ color: C.CORTEN, fontWeight: 600 }}>
                Strategy Analysis Folder →
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Certification card ─────────────────────────────────────────────────────
function CertCard({ cert }) {
  return (
    <div style={{ border: `1px solid #DDD`, borderLeft: `4px solid ${cert.color}`, borderRadius: 6, padding: "14px", marginBottom: 10, background: C.CREAM }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 6, background: cert.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, textAlign: "center", lineHeight: 1.2 }}>
          {cert.badge}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.EARTH }}>{cert.name}</span>
            <span style={{ fontSize: 10, color: C.DUST }}>{cert.org}</span>
            {cert.lenses.map(l => (
              <span key={l} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: LENSES.find(x => x.label.startsWith(l))?.color || C.DUST, color: "#fff" }}>{l}</span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.BARK, lineHeight: 1.6, marginBottom: 8 }}>{cert.desc}</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.CORTEN, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>{cert.pitch}</p>
          <a href={cert.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: C.ADOBE, textDecoration: "underline" }}>
            Certification criteria →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  // Read ?project= from URL
  const urlKey = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get("project");
    return p && PROJECTS[p] ? p : null;
  }, []);

  const projectConfig = urlKey ? PROJECTS[urlKey] : null;

  // Enabled state: keyed by strategy id
  const initialEnabled = useMemo(() => {
    const defaultOn = new Set(projectConfig?.enabledStrategies ?? [
      "passive-solar", "mineral-wool-wall", "sips-roof",
      "cmu-thermal-mass", "heat-pump", "site-regeneration",
    ]);
    return Object.fromEntries(STRATEGIES.map(s => [s.id, defaultOn.has(s.id)]));
  }, [projectConfig]);

  const [enabled, setEnabled] = useState(initialEnabled);
  const [tab, setTab] = useState("strategies");

  const toggle = id => setEnabled(prev => ({ ...prev, [id]: !prev[id] }));

  const active = STRATEGIES.filter(s => enabled[s.id]);

  const totals = useMemo(() => {
    const carbon = active.reduce((sum, s) => sum + s.carbonDelta, 0);
    const avgScore = active.length ? Math.round(active.reduce((sum, s) => sum + composite(s.scores), 0) / active.length) : 0;
    const avgLens = LENSES.map(l => ({
      ...l, avg: active.length ? Math.round(active.reduce((sum, s) => sum + s.scores[l.key], 0) / active.length) : 0,
    }));
    return { carbon, avgScore, avgLens, count: active.length };
  }, [active]);

  const folderUrl = projectConfig?.folderUrl ?? "";
  const projectName = projectConfig?.name ?? "[n+] Strategy Dashboard";

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{
      padding: "10px 20px", border: "none", cursor: "pointer", fontFamily: "sans-serif",
      background: "transparent", fontSize: 13, transition: "all 0.15s",
      borderBottom: tab === id ? `3px solid ${C.CORTEN}` : "3px solid transparent",
      color: tab === id ? C.EARTH : C.DUST, fontWeight: tab === id ? 700 : 400,
    }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "sans-serif", background: "#FAF7F2", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ background: C.EARTH, padding: "24px 28px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: C.ADOBE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              SALT Workshop · [n+] Net-Positive Design
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.CREAM, lineHeight: 1.1 }}>
              Strategy Dashboard
            </div>
            <div style={{ fontSize: 13, color: C.DUST, marginTop: 5 }}>{projectName}</div>
            {folderUrl && (
              <a href={folderUrl} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: C.ADOBE, marginTop: 6, display: "inline-block", textDecoration: "underline" }}>
                Project Analysis Folder →
              </a>
            )}
          </div>

          {/* Summary circles */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <ScoreBadge score={totals.avgScore} size={56} />
              <div style={{ fontSize: 9, color: C.DUST, marginTop: 4 }}>avg [n+] score</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: totals.carbon < 0 ? C.SAGE : C.CORTEN,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{Math.abs(totals.carbon)}</span>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.75)" }}>kg/m²</span>
              </div>
              <div style={{ fontSize: 9, color: C.DUST, marginTop: 4 }}>{totals.carbon < 0 ? "carbon saved" : "carbon added"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.ADOBE, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{totals.count}</span>
              </div>
              <div style={{ fontSize: 9, color: C.DUST, marginTop: 4 }}>strategies<br />selected</div>
            </div>
          </div>
        </div>

        {/* Aggregate lens bars */}
        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "6px 6px 0 0", padding: "12px 16px" }}>
          <div style={{ fontSize: 10, color: C.ADOBE, letterSpacing: 1, marginBottom: 10 }}>
            COMBINED PERFORMANCE — all selected strategies
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 28px" }}>
            {totals.avgLens.map(l => (
              <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, color: C.CREAM, width: 140, flexShrink: 0 }}>{l.label}</div>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3 }}>
                  <div style={{ width: `${l.avg * 10}%`, height: "100%", background: l.color, borderRadius: 3, transition: "width 0.4s" }} />
                </div>
                <div style={{ width: 24, fontSize: 12, fontWeight: 700, color: C.CREAM, textAlign: "right" }}>{l.avg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ borderBottom: `1px solid #DDD`, background: "#F0EBE3", padding: "0 16px" }}>
        <TabBtn id="strategies"     label={`Strategies (${STRATEGIES.length})`} />
        <TabBtn id="certifications" label="Recognition & Certification" />
        <TabBtn id="sources"        label="Sources & Methodology" />
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding: "20px 24px" }}>

        {/* STRATEGIES */}
        {tab === "strategies" && <>
          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "48px 1fr 148px 96px 88px 80px",
            gap: 8, padding: "0 14px 8px", fontSize: 9, color: C.DUST,
            letterSpacing: 1, textTransform: "uppercase",
          }}>
            <div /><div>Strategy / System / Assembly</div>
            <div style={{ textAlign: "center" }}>Four-Lens Scores</div>
            <div style={{ textAlign: "center" }}>[n+] Score</div>
            <div style={{ textAlign: "center" }}>Carbon Impact</div>
            <div style={{ textAlign: "center" }}>Cost vs. Standard</div>
          </div>

          {STRATEGIES.map(s => (
            <StrategyRow key={s.id} strategy={s} enabled={enabled[s.id]}
              onToggle={() => toggle(s.id)} folderUrl={folderUrl} />
          ))}

          {/* Footnote */}
          <div style={{ marginTop: 20, padding: "14px 16px", background: "#EDE8E0", borderRadius: 6, fontSize: 11, color: C.DUST, lineHeight: 1.8 }}>
            <strong style={{ color: C.BARK }}>How did we reach these scores?</strong>{" "}
            Each strategy is evaluated against SALT's four [n+] design lenses — Energy & Carbon, Longevity & Circular Economy, Regenerative Design, and Biophilic Design — and scored out of 10 per lens, for a combined total of 40. Scores draw from the SALT Sustainability Strategy Library (SSL), project-adapted analysis documents, and the external frameworks listed in the Sources tab.{" "}
            {folderUrl
              ? <><a href={folderUrl} target="_blank" rel="noreferrer" style={{ color: C.CORTEN, fontWeight: 600 }}>Find your full project-specific analysis here →</a></>
              : <em>Your project analysis folder will be linked here.</em>
            }
            <br />
            <em>Carbon figures represent embodied carbon delta vs. wood-frame baseline (kg CO₂e/m²). Cost premiums are preliminary estimates — final contractor pricing is confirmed at the end of Design Development. Toggle strategies on or off to explore combinations and see their combined impact in the header above.</em>
          </div>
        </>}

        {/* CERTIFICATIONS */}
        {tab === "certifications" && <>
          <div style={{ background: C.CREAM, border: `1px solid #DDD`, borderLeft: `4px solid ${C.SAGE}`, borderRadius: 6, padding: "16px", marginBottom: 20, fontSize: 13, color: C.BARK, lineHeight: 1.7 }}>
            <strong style={{ color: C.EARTH }}>Your home is on a path to something worth recognizing.</strong>{" "}
            The strategies you're considering align with several established certification and recognition programs. Each represents a different way of having your design choices validated, documented, and — if you choose — publicly celebrated.
            <br /><br />
            Certification is never required. But for the right client and project, it can be a deeply satisfying capstone — a third-party affirmation that what you built actually performs the way it was designed to. SALT can advise on which programs make sense for your project. Just ask.
          </div>
          {CERTIFICATIONS.map(c => <CertCard key={c.name} cert={c} />)}
        </>}

        {/* SOURCES */}
        {tab === "sources" && <>
          <div style={{ background: C.CREAM, border: `1px solid #DDD`, borderLeft: `4px solid ${C.ADOBE}`, borderRadius: 6, padding: "16px", marginBottom: 20, fontSize: 13, color: C.BARK, lineHeight: 1.7 }}>
            <strong style={{ color: C.EARTH }}>These scores were derived from multiple sources.</strong>{" "}
            The [n+] evaluation draws on established performance research, recognized sustainability standards, and project-specific data from your design team and contractor. Sources with an active certification or recognition process are listed in the Recognition tab.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SOURCES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: C.CREAM, border: `1px solid #DDD`, borderRadius: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.ADOBE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: C.EARTH, lineHeight: 1.7 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px 16px", background: "#EDE8E0", borderRadius: 6, fontSize: 11, color: C.DUST, lineHeight: 1.8 }}>
            <strong style={{ color: C.BARK }}>A note on scoring methodology: </strong>
            [n+] lens scores represent SALT's professional judgment applied to each strategy, calibrated against the external frameworks above. They are qualitative-to-quantitative translations informed by published research, manufacturer testing data, and contractor experience — not the output of certified energy modeling software. Where specific performance data exists (EPDs, blower-door results, thermal modeling), that data informs the score directly. Where data is preliminary, scores reflect reasonable professional estimates. Final performance verification occurs through contractor submittals, third-party testing where applicable, and post-occupancy review.
            {folderUrl && <><br /><br /><strong>Full project-specific analysis: </strong><a href={folderUrl} target="_blank" rel="noreferrer" style={{ color: C.CORTEN, fontWeight: 600 }}>Project Analysis Folder →</a></>}
          </div>
        </>}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1px solid #DDD`, padding: "16px 24px", background: "#EDE8E0", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.DUST }}>
          SALT Workshop, Ltd.  ·  <a href="https://saltworkshop.com" target="_blank" rel="noreferrer" style={{ color: C.ADOBE }}>saltworkshop.com</a>  ·  [n+] Net-Positive Design
        </div>
        <div style={{ fontSize: 10, color: "#B8B0A4", marginTop: 4 }}>
          This dashboard is an interactive design tool. Strategy data reflects Design Development phase analysis and is subject to refinement through Construction Documents.
        </div>
      </div>
    </div>
  );
}
