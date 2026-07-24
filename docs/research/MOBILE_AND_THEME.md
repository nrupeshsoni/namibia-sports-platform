# Mobile readiness & light theme (2026-07-24)

Audit of Home, Nav (drawer + bottom bar), Admin, Federation layout, Map, and News.
Theme work reuses `client/src/contexts/ThemeContext.tsx` with `switchable` enabled.

## Verdict

| Area | Status | Notes |
|------|--------|--------|
| **Mobile overall** | **Mostly ready** — not fully polished | Safe areas, 44px targets, hamburger + bottom nav present on public shell |
| **Light theme** | **Shipped** | Sun/moon toggle; persists in `localStorage` key `theme` |

---

## How to toggle theme

1. Tap the **sun** (when dark) or **moon** (when light) in page headers (Home, Events, News, Map, Admin, Federation hero) or inside the Home **NavDrawer**.
2. Preference is stored as `localStorage.theme` = `"light"` \| `"dark"`.
3. Default remains **dark** until the user toggles.
4. `ThemeProvider` is mounted in `App.tsx` with `defaultTheme="dark"` and `switchable`.

---

## Mobile audit

### Home — OK (good baseline)

- Fixed glass header with search + hamburger (≥44px).
- `NavDrawer` slide-over; Escape + body scroll lock.
- `MobileBottomNav` (`md:hidden`) + `main` bottom padding.
- Horizontal federation/event rows use snap + overflow-x; `overflow-x-hidden` on page.

**Remaining:** Many mid-page sections still use hardcoded dark glass + `text-white` (fine on dark; uneven on light). Hero stays image-led (intentional).

### Nav (drawer + bottom) — OK

- Bottom nav: 56px rows + safe-area inset.
- Drawer full-width on phones, 380px on `sm+`.
- Theme toggle added in drawer header.

**Remaining:** Social icon row is fine; Federations bottom-nav item is `/#federations` (hash scroll only works when already navigating to Home).

### Admin — Improved

- Horizontal tab strip scrolls; tabs use `min-h-[44px]`.
- Header title shortened to **ADMIN** on small screens; Logout icon-only on `sm` down.
- Theme toggle in sticky header.

**Remaining:** Wide data tables still need horizontal scroll / card layouts on narrow phones (Medium). Search + Add row can wrap tightly on ~320px.

### Federation layout — OK

- Sticky tab nav scrolls horizontally (`scrollbar-hide`).
- Back control ≥44px; Admin chip for editors.
- Theme toggle on hero (`onMedia` for contrast over photos).

**Remaining:** Public tab content pages still largely dark-inline styles; Fed Admin sidebar stacks to horizontal scroll on mobile (acceptable, not polished).

### Map — Critical fix shipped

**Was:** `flex` row with `aside w-full` beside the map → on phones the panel stole width and crushed the map.

**Now:** `flex-col md:flex-row`; map `min-h-[45vh]`; panel `max-h-[50vh]` on mobile. Tile layer switches with theme (`light_all` / `dark_all`).

**Remaining:** Panel-below-map is usable but not a sheet/drawer UX; Leaflet attribution/zoom crowding on very small screens (Low).

### News — Improved

- Header chrome theme-aware; theme toggle; Back label hidden on tiny widths.
- Article modal close control now ≥44px + `aria-label`.

**Remaining:** Category pills wrap (OK); article cards still dark-glass inline styles under light page shell (Medium visual polish).

---

## Light theme implementation

| Piece | Location |
|-------|----------|
| Context + `localStorage` | `client/src/contexts/ThemeContext.tsx` |
| Enable toggle | `App.tsx` → `switchable` |
| Toggle UI | `client/src/components/ThemeToggle.tsx` |
| Tokens / chrome / glass | `client/src/index.css` (`:root` + `.dark`, `--chrome-*`, `--glass-*`, `.theme-page`, `.theme-chrome`) |
| Toasts | `sonner.tsx` uses app `useTheme` (was `next-themes`) |

Light palette is cool slate (sports brand), not cream/purple. Glassmorphism kept via frosted white chrome; heroes/photo overlays stay dark for contrast.

---

## Remaining follow-ups (not blocking)

1. **Content cards** on Home / News / Events / Live: migrate inline `rgba(255,255,255,0.05)` + `text-white` to theme variables so light mode is consistent beyond chrome.
2. **Admin tables** → responsive card rows on `<md`.
3. **Map** region panel → bottom sheet on mobile.
4. **Live / AthleteProfile / auth / legal** shells: still mostly hardcoded dark (toggle still works globally via `html.dark`).
5. Optional: `prefers-color-scheme` initial default when no `localStorage` value.

---

## Rules applied

Workspace: search/reuse ThemeContext; smallest chrome + critical Map fix; docs + CHANGELOG; no new dependencies.
