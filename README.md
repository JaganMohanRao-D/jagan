# Jagan — Space Portfolio

A responsive, single-page portfolio for Jagan Mohan Rao Dunna. It uses a deep-space visual language, editorial serif typography, an animated Three.js starfield/planet, launch overlay, custom reticle cursor, scroll reveals, constellation-style milestones, interactive skills cloud, and two verified project cards.

## Requirements

- Node.js 20.19+ (or a compatible current LTS release)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The deployable static site is generated in `dist/`.

## Deploy to Vercel

1. Extract the ZIP.
2. Open the extracted folder in a terminal.
3. Run `npm install` and confirm `npm run build` works.
4. Import the folder into Vercel, or push it to a repository you control and import that repository.
5. Framework preset: **Vite**.
6. Build command: `npm run build`.
7. Output directory: `dist`.
8. Deploy.

No environment variables are required.

## Personalization

- Replace `public/profile-placeholder.svg` with a photo you own. For best results use a square image, then update the `src` in `index.html` if you change the filename.
- Main page content is in `index.html`.
- Interactions and Three.js scene are in `src/main.js`.
- Visual styling and responsive breakpoints are in `src/style.css`.
- The portfolio deliberately lists only **Naa College** and **Plantmokk AI**. It does not include reports, job history, internships, clients, or certifications because none were supplied.
- Fonts are loaded from Google Fonts. The Three.js dependency is installed locally through npm and bundled by Vite; no iframe or runtime HTML replacement is used.

## Accessibility and behavior

- Responsive navigation for mobile.
- Keyboard-visible focus outlines and skip link.
- Reduced-motion preferences are respected for most motion effects.
- Three.js failure falls back to the CSS starry background.
- Project links open the supplied live websites. GitHub, LinkedIn, and email links use Jagan's supplied contact details.
