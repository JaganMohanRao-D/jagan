# Jagan — Student Developer Portfolio

A deep-space portfolio: Three.js launch + orbit hero, planet project cards, "Deep Space Network" reports panel,
swipeable constellation experience section, and an interactive 3D skills cloud.
It is a static site (no build step). Three.js and all fonts are bundled locally, so it makes **no external requests**.

## Run locally

ES modules and import maps need an HTTP server (opening `index.html` by double-click will not work).

```bash
# any one of these, from this folder:
python3 -m http.server 8000      # then open http://localhost:8000
npx serve .                      # or: npm start
```

## Deploy to Vercel

**Option A: CLI**
```bash
npm i -g vercel
vercel          # first deploy (accept defaults; Framework Preset: Other, no build command, output dir: .)
vercel --prod
```

**Option B: Dashboard**
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repo.
3. Framework Preset: **Other**. Leave Build Command empty and Output Directory as `.`  then **Deploy**.

## Things to personalise

| What | Where |
|---|---|
| Profile photo (currently a placeholder) | Replace `assets/img/profile-placeholder.svg`, or change the `<img class="me_pic">` `src` in `index.html` |
| Projects | `<section id="projects">` in `index.html` (one `<a class="planet-card">` each) |
| Reports | `<section id="reports">`. Currently shows an idle "No reports yet" row. Add rows copied from the idle row, make them `<a href="reports/your-file.pdf">`, drop the `dsn-row--idle` class, and update the "00 packets" counter |
| Experience / achievements | `JOBS` array in the inline script of `index.html` (keep 5 entries: the constellations have 5 anchor stars) |
| Skills | `.cloud-tag` spans in `<section id="skills">` |
| Social links | `.social-card` in the About section |

## Structure

```
index.html            page markup + scripts (Three.js scene, interactions)
assets/styles.css     all styles
assets/fonts.css      self-hosted @font-face rules
assets/fonts/         Instrument Serif, Inter Tight, JetBrains Mono (woff2)
assets/img/           placeholder photo, favicon, constellation line art
vendor/three/         Three.js r160 + the post-processing addons used
vercel.json           static hosting config
```

## Credits

Design and interaction concept adapted from an open-source portfolio template, reused with the original author's permission.
Constellation figures: Sidney Hall, *Urania's Mirror* (1825), public domain.
Social-card style from Uiverse.io (Valeron-T). Three.js is MIT licensed; fonts are SIL OFL.
