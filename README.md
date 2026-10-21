# 💍 Khushal weds Mitali — A Premium Digital Wedding Invitation

A visually stunning, cinematic, single-page wedding invitation website built with
**pure HTML, CSS & JavaScript** — no frameworks, no build step. Designed to feel
like a luxury digital invitation blending modern cinematic motion with Indian
wedding aesthetics (gold, maroon, marigold).

## ✨ Features

- **Cinematic opening** — mandala preloader + a parting curtain reveal of the hero.
- **Falling marigold petals** — a lightweight `<canvas>` particle system.
- **Live countdown** to the wedding day (with "Add to calendar" `.ics`).
- **The Couple**, five **celebration** cards
  (Mehndi · Haldi · Sangeet · Wedding · Reception), and an animated
  **DJ Night** section (neon lights, spinning turntable, and an
  equalizer that reacts live to the couple's song).
- **Gallery** with hover captions, a **venue map**, and a working **RSVP form**
  (client-side, with graceful local save).
- **Scroll-reveal animations**, parallax hero, sticky nav, mobile menu,
  optional background music toggle.
- **Accessible** — keyboard focus, `aria` labels, and full `prefers-reduced-motion`
  support.

## 🗂 Structure

```
index.html                  # landing page — choose groom's or bride's invitation
KhushalWedsMitali/index.html  # groom's side  (/KhushalWedsMitali)
MitaliWedsKhushal/index.html  # bride's side  (/MitaliWedsKhushal)
css/style.css               # the full design system & animations
js/script.js                # countdown, petals, reveal, RSVP, nav, music, side-switch
assets/                     # favicon, calendar file, (add your photos & music here)
.github/workflows/          # GitHub Pages deployment
```

## 🔀 The two invitations

- **`/KhushalWedsMitali`** opens the **groom's** side (Goyal family, maroon &
  gold).
- **`/MitaliWedsKhushal`** opens the **bride's** side (Gupta family, rani-pink —
  names lead with Mitali, bride-side hosts, a separate song).
- **`/`** (the root) is a chooser so anyone landing on the bare domain can pick
  a side.

Which side a page shows is decided by `<html data-side="groom|bride">` on that
page (falling back to the URL path), so the **two sub-page files share the exact
same body markup** — all the side-specific differences live in
`js/script.js` (the `BRIDE` object) and `css/style.css` (`body.bride`).

> **Maintenance note:** a content change to the invitation itself (dates, venue,
> event cards, photos) must be made in **both** `KhushalWedsMitali/index.html`
> and `MitaliWedsKhushal/index.html` — they are intentionally identical except
> for the `data-side` flag and the `<head>` meta (title / social preview).

### RSVP & links

- Add **`?rsvp=1`** to either invitation (e.g. `/MitaliWedsKhushal?rsvp=1`) to
  reveal the RSVP section, nav link and hero button. `?rsvp=0` forces it off.
- Old links still work: `?bride=1` / `?side=bride` on the root redirect to
  `/MitaliWedsKhushal`, and any `?rsvp=…` is carried across.

## 🚀 Viewing it locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 GitHub Pages

A GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys the site to
GitHub Pages on every push. If Pages isn't enabled yet, open
**Settings → Pages** and set **Source: GitHub Actions** (the workflow also
attempts to enable it automatically). The live URL appears in the Actions run
summary.

## 🎨 Make it yours

- **Names / dates / venue** — edit the text in `index.html`; update
  `WEDDING_DATE` in `js/script.js` and the `.ics` file.
- **Photos** — set `background-image` on `.couple__photo` and `.gallery__item`
  in `css/style.css` (placeholders are gradients for now).
- **Colours** — tweak the CSS custom properties at the top of `css/style.css`.
- **Music** — the toggle plays a built-in, synthesized wedding melody out of
  the box (no file needed). Drop a track at `assets/music.mp3` and it will
  automatically play that instead.
- **Real RSVP** — point the form at a service (Formspree / Google Forms /
  Netlify Forms); see the note in `js/script.js`.

---

Made with love 💛
