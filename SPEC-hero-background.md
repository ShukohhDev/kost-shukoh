# Specification: Hero Section Real Building Background

## 1. Objective
Replace the generic CSS gradient background of the landing page's Hero Section (`#beranda` in `index.html`) with the authentic photograph of the Kost Shukoh 2-story building (`public/images/kost-building.jpg`).
Maintain high contrast and text readability across both Light Mode and Dark Mode using dual-axis gradient overlays.
Keep the rest of the website below the hero section clean and solid (`surface-canvas` in light mode, `slate-950` in dark mode) as requested by the user.

## 2. Scope & Constraints
- **Target File:** `index.html` (Hero Section `#beranda`), `public/images/kost-building.jpg`.
- **Overlay Strategy:**
  - Horizontal mask: `from-white/95 via-white/85 to-white/60` (Light) & `dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-900/60` (Dark).
  - Vertical bottom mask: `from-surface-canvas via-transparent to-white/30` (Light) & `dark:from-slate-950 dark:via-transparent dark:to-slate-950/30` (Dark).
  - Subtle blur and scaling: `scale-105 filter blur-[0.5px]` for depth of field without losing building identity.
- **Content Stacking:** Content wrapped in `relative z-10` to preserve full clickability and interactive hover states for buttons and stats.
- **Sections Below:** `#kamar`, `#fasilitas`, `#aturan`, `#kontak`, and footer remain clean solid canvases without photo clutter.

## 3. Commands
- Build CSS: `npm run build:css`
- Vite Build: `npm run build`
- Unit Test: `npm test`
- Deploy: `npx wrangler pages deploy dist --project-name kost-shukoh --branch main`
- Git Sync: `git add . && git commit -m "..." && git push origin main`

## 4. Acceptance Criteria
1. `public/images/kost-building.jpg` is present on disk and referenced cleanly in `index.html`.
2. Hero section displays the authentic building photograph behind the hero headline and room card.
3. Headline and CTA buttons remain 100% readable in both Light and Dark modes.
4. Scrolling down into the rooms list transitions seamlessly to the clean background.
5. All 19+ unit tests pass without error.
6. Cloudflare Pages build succeeds and changes are pushed to GitHub.
