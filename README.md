# [n+] Strategy Dashboard
### SALT Workshop — Net-Positive Design Client Tool

An interactive strategy dashboard for client meetings and self-guided exploration during the Design Development phase. Clients can toggle strategies on/off and see their combined [n+] scores, carbon impact, and cost premiums update in real time.

---

## Live URL

Once deployed, your dashboard lives at:
```
https://[your-github-username].github.io/nplus-dashboard/
```

Each project gets its own URL via a query parameter:
```
https://[your-github-username].github.io/nplus-dashboard/?project=dory
https://[your-github-username].github.io/nplus-dashboard/?project=sittig
```

Share the project-specific URL with clients. They can bookmark it and return any time.

---

## Adding a New Project (2 steps)

### Step 1 — Open `src/projectData.js`

Find the `PROJECTS` section near the top. Copy the template block and fill it in:

```js
yourprojectkey: {
  name: "Smith Residence — Boulder, CO",
  folderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
  enabledStrategies: [
    "passive-solar",
    "mineral-wool-wall",
    "sips-roof",
    "heat-pump",
    "site-regeneration",
  ],
},
```

**`yourprojectkey`** — short, lowercase, no spaces. This becomes the `?project=` URL parameter.

**`folderUrl`** — paste the Google Drive link to the project's SP analysis folder. This appears in footnotes and strategy detail links throughout the dashboard.

**`enabledStrategies`** — list the strategies that should be toggled ON by default when a client opens this project's URL. The client can toggle any strategy on or off themselves.

Available strategy IDs:
- `passive-solar`
- `sips-roof`
- `green-roof`
- `ceb-wall`
- `hempcrete`
- `mineral-wool-wall`
- `cmu-thermal-mass`
- `heat-pump`
- `solar-pv`
- `site-regeneration`

### Step 2 — Push to GitHub

```bash
git add src/projectData.js
git commit -m "Add [project name] project"
git push
```

GitHub Actions automatically rebuilds and deploys the site. The new URL is live in about 60 seconds.

---

## First-Time Setup

### 1. Create a GitHub repository

- Go to github.com → New repository
- Name it exactly: `nplus-dashboard`
- Set to Public (required for free GitHub Pages)
- Do NOT initialize with README (you already have one)

### 2. Push this folder to GitHub

In Terminal, navigate to this folder, then:

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/[your-username]/nplus-dashboard.git
git push -u origin main
```

### 3. Enable GitHub Pages

- Go to your repo on github.com
- Settings → Pages
- Source: **GitHub Actions** (not "Deploy from branch")
- Save

The first deployment runs automatically. Check the Actions tab to watch it build (~60 seconds). When it shows a green checkmark, your URL is live.

### 4. Verify

Open `https://[your-username].github.io/nplus-dashboard/` in a browser. You should see the dashboard with the default strategy set.

---

## Updating Strategy Data

If SSL library scores change, or you want to update descriptions, edit the `STRATEGIES` array in `src/projectData.js`. Each strategy has:

- `scores` — four lens scores (l1–l4), each /10
- `carbonDelta` — kg CO₂e/m² vs. wood-frame baseline (negative = savings)
- `costPremium` — % above standard construction (0 = parity)
- `description` — shown when client clicks to expand a strategy row

Push the change and the live site updates in ~60 seconds.

---

## Folder Structure

```
nplus-dashboard/
├── src/
│   ├── main.jsx          # Entry point (don't touch)
│   ├── App.jsx           # Dashboard UI (don't touch)
│   └── projectData.js    # ← THE FILE YOU EDIT
├── .github/
│   └── workflows/
│       └── deploy.yml    # Auto-deployment (don't touch)
├── index.html            # HTML shell (don't touch)
├── vite.config.js        # Build config (don't touch)
└── package.json          # Dependencies (don't touch)
```

**The only file you ever need to edit is `src/projectData.js`.**

---

## Questions

Built by SALT Workshop using React + Vite, hosted on GitHub Pages.
