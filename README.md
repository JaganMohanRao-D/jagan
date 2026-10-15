# Jagan Portfolio

A space-inspired personal portfolio for **Jagan Mohan Rao Dunna**, featuring animated celestial visuals, a Three.js starfield, project showcases, an interactive project journey, a filterable skills cloud, and contact links.

## Run locally

This project is a static HTML/CSS/JavaScript site and does not require a build step.

- Open `index.html` in a modern browser, or
- Run a local static server from this directory, for example:
  - `python -m http.server 8000`
  - Open `http://localhost:8000`

The 3D starfield imports Three.js from jsDelivr. If the module or WebGL is unavailable, the page still uses its CSS graphics as a fallback.

## Deploy to Vercel

1. Create a new GitHub repository named `jagan-portfolio`.
2. Upload the contents of this folder to the repository root (the `index.html`, `styles.css`, `script.js`, and this README must be at the root).
3. In Vercel, import the repository.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: `.` (repository root).
7. Deploy.

Vercel will provide a free `*.vercel.app` URL.

## Personalization already applied

- Name, location, education and About copy
- Naa College and Plantmokk AI links and summaries
- Confirmed skills and platforms only
- College general quiz — 2nd place
- College Project Expo — 3rd prize for Naa College
- Email, GitHub and LinkedIn links
- Temporary portrait placeholder and honest empty state for reports

## Before publishing

- Replace the portrait placeholder with a photo you choose and have permission to publish.
- Confirm that the live projects and source repositories are public and their links are correct.
- Add real technical reports only when they exist.
- Review third-party asset and font licenses before reusing assets from any reference repository.
- Test keyboard navigation, mobile layouts, reduced-motion settings and WebGL fallback.
