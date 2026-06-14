// ─────────────────────────────────────────────────────────────────────────────
// SALT [n+] Strategy Dashboard — Project Data
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO ADD OR UPDATE A PROJECT:
//
// 1. Add an entry to the PROJECTS object below, using a short URL-safe key
//    (lowercase, no spaces — this becomes the ?project= URL parameter).
//
// 2. Each project entry has:
//    - name:         Displayed in the dashboard header
//    - folderUrl:    Google Drive link to the project's SP analysis folder
//    - strategies:   Array of strategy IDs that are ENABLED by default
//                    (all others start toggled off; client can change them)
//
// 3. Push to GitHub. The site rebuilds automatically in ~60 seconds.
//
// 4. Share the client URL:
//    https://[your-github-username].github.io/nplus-dashboard/?project=[key]
//
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = {

  // ── TEMPLATE — copy this block for each new project ──────────────────────
  template: {
    name: "Project Name",
    folderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
    // List the strategy IDs that should be ON by default for this project.
    // Available IDs: passive-solar, sips-roof, green-roof, ceb-wall, hempcrete,
    //                mineral-wool-wall, cmu-thermal-mass, heat-pump,
    //                solar-pv, site-regeneration
    enabledStrategies: [
      "passive-solar",
      "mineral-wool-wall",
      "sips-roof",
      "cmu-thermal-mass",
      "heat-pump",
      "site-regeneration",
    ],
  },

  // ── EXAMPLE PROJECT — Dory's Addition ────────────────────────────────────
  dory: {
    name: "Dory's Addition — Belvidere, IL",
    folderUrl: "https://drive.google.com/drive/folders/REPLACE_WITH_ACTUAL_FOLDER_ID",
    enabledStrategies: [
      "passive-solar",
      "mineral-wool-wall",
      "sips-roof",
      "cmu-thermal-mass",
      "heat-pump",
      "solar-pv",
      "site-regeneration",
    ],
  },

  // ── ADD YOUR NEXT PROJECT HERE ────────────────────────────────────────────
  // sittig: {
  //   name: "Sittig Residence — Denver, CO",
  //   folderUrl: "https://drive.google.com/drive/folders/...",
  //   enabledStrategies: ["passive-solar", "ceb-wall", "sips-roof", "heat-pump", "site-regeneration"],
  // },

};

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY LIBRARY
// Pre-populated from current SSL entries. Scores and descriptions can be
// updated here as the library grows or as project-specific data is confirmed.
// ─────────────────────────────────────────────────────────────────────────────

export const STRATEGIES = [
  {
    id: "passive-solar",
    name: "Passive Solar Design",
    category: "RSP 5 — Passive Solar Strategies",
    sslRef: "Calculated from DD1 geometry",
    description: "Building orientation, glazing ratios by elevation, and calculated overhang depths for summer shading and winter gain. Free heating in winter; natural shading in summer. The highest-leverage decision in residential design — and it costs nothing extra when built into the design from the start.",
    scores: { l1: 9, l2: 6, l3: 7, l4: 8 },
    carbonDelta: -18,
    costPremium: 2,
  },
  {
    id: "sips-roof",
    name: "SIPs Roof System",
    category: "RSP 3 — Roof Assembly",
    sslRef: "SSL-A-002",
    description: "Premier SIPs 12-1/4\" EPS panels replace conventional I-joist + blown insulation. The panel IS the structure, insulation, and air barrier in one — far fewer seams, far less thermal bridging. Creates a conditioned attic where HVAC ducts live in conditioned space, which meaningfully improves system efficiency.",
    scores: { l1: 9, l2: 7, l3: 5, l4: 3 },
    carbonDelta: -6,
    costPremium: 18,
  },
  {
    id: "green-roof",
    name: "Low-Slope Green Roof System",
    category: "RSP 3 — Roof Assembly",
    sslRef: "SSL-A-003",
    description: "EPDM waterproofing membrane + 8\" engineered growing medium + living plant layer. Manages stormwater on-site, adds R-value to the roof assembly, supports pollinator habitat, reduces urban heat island effect, and extends membrane life by protecting it from UV. Requires structural engineering for all options — PE stamp mandatory.",
    scores: { l1: 7, l2: 6, l3: 9, l4: 9 },
    carbonDelta: -4,
    costPremium: 35,
  },
  {
    id: "ceb-wall",
    name: "CEB / EcoBlox Wall System",
    category: "RSP 2 — Wall Systems",
    sslRef: "SSL-A-001",
    description: "Compressed Earth Block with perlite cavity. 95% lower embodied carbon than wood-frame baseline. 100+ year design life. Zero VOC — earth, perlite, and lime only. 38× more thermal mass than wood framing, which dramatically reduces peak heating and cooling loads. The most regenerative wall system currently available at production scale.",
    scores: { l1: 7, l2: 10, l3: 10, l4: 9 },
    carbonDelta: -42,
    costPremium: 28,
  },
  {
    id: "hempcrete",
    name: "Hempcrete Wall Assembly",
    category: "RSP 2 — Wall Systems",
    sslRef: "SSL-C-001",
    description: "Cast-in-place hemp-lime wall (non-structural — requires structural frame). Carbon-negative: hemp sequesters CO₂ during growth AND during lime curing. Active hygroscopic — lime plaster regulates interior humidity passively. Zero petrochemicals, zero VOC. 100-year material. Emerging contractor availability in Colorado.",
    scores: { l1: 8, l2: 10, l3: 9, l4: 9 },
    carbonDelta: -52,
    costPremium: 45,
  },
  {
    id: "mineral-wool-wall",
    name: "Mineral Wool Wall System",
    category: "RSP 2 — Wall Systems",
    sslRef: "SSL-A-001 (Option A)",
    description: "2×6 wood framing + R-13 mineral wool cavity insulation + continuous insulation exterior. High-performance baseline: non-combustible, vapor-open, low VOC. Familiar to most contractors. A significant step above fiberglass — and the right choice when budget, timeline, or contractor availability rules out mass wall alternatives.",
    scores: { l1: 7, l2: 7, l3: 5, l4: 4 },
    carbonDelta: -8,
    costPremium: 5,
  },
  {
    id: "cmu-thermal-mass",
    name: "CMU Thermal Mass / Hearth Wall",
    category: "RSP 2 / RSP 1 — Thermal Battery",
    sslRef: "SSL-B-001",
    description: "Masonry CMU enclosure at fireplace or hearth. Functions as a thermal battery: absorbs heat from the firebox housing and co-linear exhaust liner, stores 13,000–19,000 BTU per evening fire, releases it passively over 8–14 hours overnight. Also provides summer passive cooling in high-altitude climates via night-flush charging.",
    scores: { l1: 8, l2: 9, l3: 6, l4: 10 },
    carbonDelta: -5,
    costPremium: 12,
  },
  {
    id: "heat-pump",
    name: "Cold-Climate Heat Pump",
    category: "RSP 6 — Active Mechanical",
    sslRef: "Mechanical Systems — TBD",
    description: "Inverter-driven cold-climate heat pump (capable to -15°F). 250–400% efficiency (vs. 95–98% for the best gas furnace). No combustion, no flue, no gas line. Grid-decarbonization ready — as the grid gets cleaner, your home automatically gets cleaner. Pairs with solar PV for a path to net-zero operational energy.",
    scores: { l1: 9, l2: 6, l3: 5, l4: 3 },
    carbonDelta: -28,
    costPremium: 8,
  },
  {
    id: "solar-pv",
    name: "Rooftop Solar PV",
    category: "RSP 7 — Energy Systems",
    sslRef: "Energy Systems — TBD",
    description: "Grid-tied photovoltaic array sized to offset annual energy consumption. Net-metering credits excess generation. Structural loading confirmed with engineer at DD3. With a cold-climate heat pump, creates a path to net-zero operational energy — the building produces as much as it uses over a year.",
    scores: { l1: 10, l2: 5, l3: 6, l4: 4 },
    carbonDelta: -38,
    costPremium: 22,
  },
  {
    id: "site-regeneration",
    name: "Site Regeneration Strategy",
    category: "RSP 8 — Site & Ecosystem",
    sslRef: "Site Systems — project-specific",
    description: "Native and adaptive plantings replacing lawn, stormwater infiltration zones, composting system, and pollinator corridors. Transforms the site from a resource consumer into living infrastructure: cooling the microclimate, feeding local pollinators, building soil carbon, and managing water on-site rather than routing it to stormwater systems.",
    scores: { l1: 5, l2: 7, l3: 10, l4: 10 },
    carbonDelta: -3,
    costPremium: 6,
  },
];
