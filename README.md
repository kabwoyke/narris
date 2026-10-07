# Narris International: website

HTML5 + Tailwind CSS + vanilla JavaScript (ES modules). No framework, no backend.
The build brief is `Claude.md`; it is built **one phase at a time** (see "Status").

## Run it

```bash
npm install            # once: installs Tailwind
npm run serve          # http://localhost:5173  (ES modules and fetch() need http, not file://)
npm run dev            # in a second terminal: rebuilds css/styles.css on change
npm run build          # minified CSS (the built file is committed, so deploys need no build step)
npm run validate       # link, data, banned-word and "never publish" checks
npm run stubs          # (re)creates "In progress" stubs for pages not yet built; never overwrites built pages
```

## Where to edit things

| To change | Edit |
|---|---|
| Phone, WhatsApp, email, address, hours, social | `js/config.js` -> `contact` (email lives in one place; optional values hide when empty) |
| Navigation, footer links | `js/config.js` -> `nav`, `footerLinks` |
| Hero slides (wording, CTAs, images) | `js/config.js` -> `hero.slides`, `images` |
| Tagline (hero slide 4) | `js/config.js` -> `brand.tagline` |
| Form endpoint | `js/config.js` -> `forms.endpoint` (Formspree or Web3Forms URL). Empty = `mailto:` fallback |
| Show sample content | `js/config.js` -> `flags.showSamples` (keep `false` in production) |
| Hero slide 1 footage instead of the SVG motif | `js/config.js` -> `hero.heroVideo` (`webm`, `mp4`, `poster`) |
| Colours, fonts | `tailwind.config.js` (then `npm run build`) |
| Case studies, team, testimonials, FAQs | `data/*.json` |

Home section copy (vision, mission, values, services, philosophy) is static HTML in `index.html` so the page reads without JavaScript and is fully indexable. The pre-rendered hero slide 1 text in `index.html` must match `config.hero.slides[0]`; `npm run validate` checks this.

### Swapping images and the logo
- Hero photos are Unsplash placeholders in `config.images`. Point `src` at `/assets/images/your-file.jpg` (or any URL) and update `alt`. Unsplash URLs get `srcset` automatically; local files use the single `src`.
- The logo mark in the header and footer is an inline SVG traced from the supplied logo (`js/components.js` -> `logoMark`). Original files: `assets/logo/narris-logo.png` (transparent) and `assets/logo/narris-logo-bg.png` (warm background, used as the favicon for now).

## Palette
Dark Azure `#162b3a` is the primary colour (buttons, text, dark bands). Warm Light `#ebe6e4` is the soft background and the button colour on dark surfaces. White is the base. There is no separate accent colour; secondary tones are tints of azure (`azure-300`, `azure-600`). Tokens live in `tailwind.config.js`.

## Hero slide 4 tagline options (client to choose)
1. "Clarity creates trust." (provisional, from the client's philosophy)
2. "Interpretation before influence."
3. "Understood, precisely."

## Status

| Phase | Scope | State |
|---|---|---|
| 0 | Foundation: scaffold, config, header/footer, stubs, validator | Done |
| 1 | Home page | Done, awaiting review |
| 2-9 | Services, About, Contact + Privacy, Insights, Gen Z Research, Team + Testimonials, FAQs + Careers, Hardening | Not started |

Pages for later phases show a shared "In progress" stub with contact options, so no link is ever dead.

## Decisions taken with defaults (CLAUDE.md section 4)
D1 titles use the questionnaire wording, body copy uses the Concept wording. D2 slide 1 uses reflective questions, no guarantee. D3 imagery is original-mood placeholders, not Untold Research's. D4 client's CTA "Let us tell your story…" kept. D5 Gen Z research scope is `TODO(client)`. D6 one CTA per slide. D7 "How we do it" is `/about.html#approach`. D8 tagline "Clarity creates trust." D9 samples hidden by default. D10 email set in one place.

## Open `TODO(client)` items
Search the code for `TODO(client)`. The consolidated list is in `Claude.md` section 14 (email and domain, tagline, hero CTAs for slides 1 and 4, Gen Z scope, imagery direction, address/social/hours, team and testimonials, service one-liners, legal review, form endpoint).

## Notes
- Fonts (Fraunces, Inter) load from Google Fonts with `display=swap`, non-blocking.
- Motion respects `prefers-reduced-motion`: the carousel starts paused, Ken Burns and the network canvas are off, and the slide 1 motif shows its aligned static state.
- The drifting-points canvas switches itself off on low-power devices, data-saver, or if frames drop.
- Careers CV upload (Phase 8): note the file-size limit of whichever form service is chosen.
