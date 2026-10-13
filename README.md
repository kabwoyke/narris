# Narris International: website

HTML5 + Tailwind CSS + vanilla JavaScript (ES modules). No framework, no backend.
The build brief is `Claude.md`; it is built **one phase at a time** (see "Status").

## Run it

```bash
npm install            # once: installs Tailwind
npm run serve          # http://localhost:5173  (ES modules and fetch() need http, not file://)
npm run dev            # in a second terminal: rebuilds css/styles.css on change
npm run build          # minified CSS (the built file is committed, so deploys need no build step)
npm run validate       # link, data, banned-word, "never publish" and SEO checks
npm run seo            # regenerates the SEO head block, sitemap.xml and robots.txt from js/config.js
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
| Domain (canonical URLs, Open Graph, sitemap, JSON-LD) | `js/config.js` -> `site.url`, then `npm run seo` |
| Show sample content | `js/config.js` -> `flags.showSamples` (keep `false` in production) |
| Hero slide 1 footage instead of the SVG motif | `js/config.js` -> `hero.heroVideo` (`webm`, `mp4`, `poster`) |
| Colours, fonts | `tailwind.config.js` (then `npm run build`) |
| Case studies, team, testimonials, FAQs | `data/*.json` |

Home section copy (vision, mission, values, services, philosophy) is static HTML in `index.html` so the page reads without JavaScript and is fully indexable. The pre-rendered hero slide 1 text in `index.html` must match `config.hero.slides[0]`; `npm run validate` checks this.

### Swapping images and the logo
- Hero photos are Unsplash placeholders in `config.images`. Point `src` at `/assets/images/your-file.jpg` (or any URL) and update `alt`. Unsplash URLs get `srcset` automatically; local files use the single `src`.
- The header shows a white SVG lockup over the hero and, once the bar turns white, the image `assets/logo/narris-logo-nav.png` (cropped from the supplied logo; CSS swaps them on `data-solid`). To change it, replace that file (keep it cropped tight) and update `width`/`height` in `headerLogo` (`js/components.js`).
- Social share image: `assets/images/og-image.png` (1200 x 630). Favicons: `favicon.ico` and `assets/icons/favicon-*.png`.
- The logo mark in the footer and footer is an inline SVG traced from the supplied logo (`js/components.js` -> `logoMark`). Original files: `assets/logo/narris-logo.png` (transparent) and `assets/logo/narris-logo-bg.png` (warm background, used as the favicon for now).

### SEO and launch
`npm run seo` writes a generated block (between `seo:start` and `seo:end`) into every page head: canonical URL, favicons, Open Graph, Twitter card, plus JSON-LD (Organization and ProfessionalService) on the home page. It also writes `sitemap.xml` and `robots.txt`. Titles and descriptions are read from each page, so edit them in the HTML and re-run. Pages with a `noindex` tag (Gen Z Research until sign-off) and the `case-study.html` template stay out of the sitemap. When the domain is confirmed, change `site.url` and run `npm run seo`; `npm run validate` fails if a canonical or sitemap entry is stale.

Lighthouse (mobile, local server, Oct 2026): 91-99 Performance, 100 Accessibility, 100 Best Practices and 100 SEO on every page. The exception is Gen Z Research at 69 SEO, which is the deliberate `noindex` and will rise once it is removed.

### Deployment
The site is static and the built CSS is committed, so any static host works.
- **Vercel:** import the repo; `vercel.json` sets the build command (`npm run build`), output directory and security headers.
- **Netlify:** build command `npm run build`, publish directory `.`.
- **GitHub Pages:** publish the branch root. If the site is not served from the domain root, change `site.url` and the absolute paths first.
After deploying, set the custom domain, update `site.url`, run `npm run seo` and redeploy. Bump `VERSION` in `sw.js` whenever the precached files change.

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
| 2 | Services page | Done, awaiting review |
| 3 | About Us | Done, awaiting review |
| 4 | Contact + Privacy, cookie notice live | Done, awaiting review. Form endpoint still needed for a live submission test |
| 5 | Insights and case studies (see `CASE_STUDY_GUIDE.md`) | Done, awaiting review |
| 6 | Gen Z Research (playful layout, placeholder copy, noindex until sign-off) | Done, awaiting review |
| 7 | Our Team + Testimonials (from `data/team.json` and `data/testimonials.json`; placeholders hidden) | Done, awaiting review |
| 8 | FAQs accordion + Careers (roles, application form) | Done, awaiting review |
| 9 | Hardening and launch: SEO tags, sitemap, robots, JSON-LD, favicons, Lighthouse and accessibility pass | Done, awaiting review. Domain, real email and logo swap-in still pending client input |

Pages for later phases show a shared "In progress" stub with contact options, so no link is ever dead.

## Decisions taken with defaults (CLAUDE.md section 4)
D1 titles use the questionnaire wording, body copy uses the Concept wording. D2 slide 1 uses reflective questions, no guarantee. D3 imagery is original-mood placeholders, not Untold Research's. D4 client's CTA "Let us tell your story…" kept. D5 Gen Z research scope is `TODO(client)`. D6 one CTA per slide. D7 "How we do it" is `/about.html#approach`. D8 tagline "Clarity creates trust." D9 samples hidden by default. D10 email set in one place.

## Open `TODO(client)` items
Search the code for `TODO(client)`. The consolidated list is in `Claude.md` section 14 (email and domain, tagline, hero CTAs for slides 1 and 4, Gen Z scope, imagery direction, address/social/hours, team and testimonials, service one-liners, legal review, form endpoint).

## Notes
- Fonts (Plus Jakarta Sans) load from Google Fonts with `display=swap`, non-blocking.
- Motion respects `prefers-reduced-motion`: the carousel starts paused, Ken Burns and the network canvas are off, and the slide 1 motif shows its aligned static state.
- The drifting-points canvas switches itself off on low-power devices, data-saver, or if frames drop.
- Careers CV upload: the page caps files at 5 MB (`MAX_CV_BYTES` in `js/forms.js`). Check this against the limit of whichever form service is chosen (free plans are often smaller). With no endpoint set, the mailto fallback cannot attach files, so it asks the applicant to attach the CV.
