# Narris International — Website Build Brief (v2, phased)

**Status:** Refined from the original build prompt, the *Narris International Concept* document, the *Hero section* notes, and the client's questionnaire answers.
**Date:** 2026-10-07
**How to use:** Build **one phase at a time**. After each phase, stop, show the result, and wait for approval before starting the next. Commit once per phase (`phase-N: <summary>`).

---

## 1. What changed from v1

| Area | v1 | v2 (this document) |
|---|---|---|
| Build order | Everything in one pass, hero first | Ten phases, one page (or system) at a time. Phase 1 is the Home page only |
| Hero | 5 generic philosophy slides | 5 slides using the client's **exact wording** and CTAs; slide 1 gets a bespoke "alignment" animation; slide 5 introduces a new Gen Z Research page |
| Copy | Invented placeholder copy | Client-approved copy from the Concept document is used verbatim (vision, mission, values, philosophy, services, process) |
| Services | Five names from the questionnaire only | Same five public names, now enriched with deliverables and outcomes from the Concept document |
| Values | Generic icon grid | The client's five: Precision, Integrity, Strategic thinking, Listening, Depth |
| Design references | WorldQuant, ApexResearch | **Untold Research and Motivaction International are primary** (client's own picks). WorldQuant and Apex are secondary, for tone and hero structure only |
| Navigation | Standard page list | Header carries "What we do / How we do it / Who we are" as the client described, plus the Gen Z Research page |
| Sample content | Sample case studies and testimonials shown | Samples are **hidden in production**. Nothing fictional can go live by accident |
| Publishing rules | Not stated | Explicit "never publish" list (internal strategy notes, guarantees, fees) |

---

## 2. Precedence rules (when sources disagree)

1. **Client's exact wording** (hero document, questionnaire) wins over everything.
2. **Concept document copy** wins over invented copy.
3. This brief's recommendations apply only where the client gave nothing.
4. Anything assumed, unconfirmed or missing is marked `TODO(client)` in code and listed in section 14.

---

## 3. Client snapshot (confirmed facts)

| Item | Value |
|---|---|
| Company | Narris International |
| What it is | A research-informed strategy advisory focused on positioning, stakeholder understanding and strategic communication |
| Industry | Consultancy: research and insights |
| HQ / reach | Nairobi, serving clients worldwide. Work can be delivered remotely |
| Audience | C-suite executives and leaders in private corporations; leaders in NGOs; business owners. Also institutions, development organisations and research-heavy bodies (from the Concept document) |
| Website goals | Introduce the company, showcase services, generate enquiries and leads, build credibility |
| Visitor actions | Call, email, fill in a contact form, request a quotation |
| Phone and WhatsApp | 0111429478. WhatsApp link: `https://wa.me/254111429478` |
| Email | `bdu@narrisinternational.com` — **unconfirmed**, depends on domain setup |
| Colours | Dark Azure `#162b3a`, Warm Light `#ebe6e4` (client calls it "Light Orange"), White `#ffffff` |
| Logo | Supplied via Google Drive (not yet downloaded). Use a text wordmark placeholder until then |
| Not provided | Tagline, address, social accounts, operating hours, domain, team details, testimonials, case studies |

---

## 4. Flags and decisions to confirm with the client

Build with the default shown. Do not block on these.

| # | Issue | Default used in the build |
|---|---|---|
| D1 | **Two descriptors exist.** Questionnaire: "research-informed strategy advisory." Concept document: "boutique strategic narrative and positioning advisory." | Page titles and meta descriptions use the questionnaire wording. Body copy on Home and About uses the Concept positioning statement |
| D2 | **Hero slide 1 contains the line "Can we guarantee zero internal fragmentation…?"** Publishing a guarantee is a credibility and legal risk | Rewritten as reflective questions with no guarantee (see section 8) |
| D3 | **Hero slide 2 asks to copy Untold Research's imagery.** Copying another firm's imagery is a copyright risk and conflicts with the client's own wish for a distinct identity | Build original imagery in the same *mood* (see slide 2). Ask the client which specific qualities of that imagery they like |
| D4 | **"Let us tell your story…" (slide 2 CTA) sits against the Concept document's position that Narris is "more serious and strategic than storytelling."** | Keep the client's exact CTA. Suggest an alternative later, e.g. "Let us shape your narrative" |
| D5 | **Slide 5 (Gen Z research) introduces market and social research, which is not among the five services in the questionnaire.** | Build the page and CTA as specified. Mark scope `TODO(client)`: confirm this is an offer, a project or a thought-leadership piece |
| D6 | **Hero has one CTA per slide in the client's notes; v1 had two.** | One slide-specific primary CTA per slide (calmer). "Request a quote" stays in the header |
| D7 | **"How we do it" has no matching page in the client's page list.** | It is a dedicated section (`/about.html#approach`) with its own nav item. Promote to a page later if content grows |
| D8 | **Tagline not provided (slide 4 placeholder).** | Provisional line: "Clarity creates trust." (taken from the client's philosophy). Alternatives in section 8 |
| D9 | **Case studies and testimonials do not exist yet.** | Sections hide when empty. Samples render only when `showSamples` is true in `config.js` (default false in production) |
| D10 | **Email address may change.** | Single value in `config.js`, mailto fallback reads from it |

---

## 5. Never publish (internal material in the Concept document)

The Concept document mixes public copy with internal strategy. Do **not** put any of the following on the site:

- Competitor analysis, market opportunity notes, growth phases, partnership targets
- The revenue model and any pricing or fee levels (quotations are on request only)
- The "Narris shall avoid" list and anything written in first person ("I can…", "My background…")
- Any claim of guaranteed outcomes, results, rankings or statistics
- Client names, logos or identifying details unless there is documented consent

Services that are explicitly out of scope and must not appear: social media management, broad marketing, commodity content production.

---

## 6. Tech stack and conventions (strict)

- **HTML5 + Tailwind CSS + vanilla JavaScript (ES modules).** No React, Next.js or jQuery.
- Tailwind CLI: `npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify`, with a `tailwind.config.js` holding brand tokens. npm scripts: `dev` (watch), `build`, `validate`. Commit the built CSS so the site opens without a build step.
- Animation: CSS transitions and keyframes, IntersectionObserver for reveals, SVG/SMIL or Web Animations API for the slide 1 motif. No heavy libraries. A ~3KB gesture helper is allowed only if hand-written swipe proves unreliable.
- Shared header and footer injected by `/js/components.js` into `#site-header` and `#site-footer`, with a `<noscript>` fallback nav so pages stay readable without JS.
- Fonts: Fraunces or Cormorant Garamond (headlines) and Inter (body). Preconnect, `display=swap`.
- Folder structure:
  ```
  /index.html /about.html /services.html /team.html /testimonials.html /faqs.html
  /contact.html /careers.html /case-studies.html /case-study.html /gen-z-research.html /privacy.html
  /css (input + built)  /js (main, hero, network, components, case-studies, forms, config)
  /data (case-studies.json, team.json, testimonials.json, faqs.json)  /assets (images, svg, logo, video)
  /scripts/validate.mjs
  ```
- **Everything editable lives in `config.js` or `/data`**: copy, contact details, nav, hero slides, image sources, form endpoints, feature flags.
- Code is commented. Every placeholder or assumption carries a `TODO(client)` comment.

### `config.js` keys (minimum)
`brand` (name, wordmark, tagline, descriptor) · `contact` (phone, whatsapp, email, address, hours, social) · `nav` · `hero.slides[]` · `images{}` · `forms` (endpoint, careersEndpoint, mailtoFallback) · `flags` (showSamples, showNetwork, showCookieNotice). Optional values (address, hours, social, tagline) **hide gracefully when empty**.

---

## 7. Brand, voice and design

**Feel:** calm, composed, precise, thoughtful, quietly authoritative, human. Not loud, generic, corporate-stock or visually noisy. Alive through restrained motion and purposeful imagery, not effects.

**Brand traits (from the Concept document):** intelligent, quietly authoritative, precise, composed, global, human-centred, trusted, refined, structured.

**Palette:** Dark Azure `#162b3a` (primary, dark bands, text), Warm Light `#ebe6e4` (soft background), White. Add **one** muted accent (desaturated copper or soft teal) for CTAs and highlights. Check WCAG AA on every pairing.

**Type and layout:** serif headlines, sans body, large type, short line lengths, generous whitespace, 12-column grid, one idea per section.

**References:**
- *Primary (client's picks):* **Untold Research** and **Motivaction International**: insight-led storytelling, human tone, clean layouts.
- *Secondary:* WorldQuant (editorial, research-led headlines) and ApexResearchSolutions (clean full-bleed hero). Borrow one or two ideas only.
- Take inspiration, never copy layouts, imagery or text. The result must look like Narris.

**Voice:** thoughtful, structured, refined, human-centred. Short sentences. Speak to a senior leader's time and intelligence. Banned words: cutting-edge, world-class, synergy, game-changing, leverage (as a verb), unlock, supercharge. No invented statistics.

**Imagery:** calm, human, editorial. Leaders in thoughtful conversation, round tables, hands over documents, East African and global professional settings, quiet architecture, abstract depth of field. One consistent treatment toward the Azure/Warm palette. Unsplash/Pexels placeholders for now with descriptive alt text, all sourced from `config.js`. Use `<picture>`, `srcset`, `sizes`, explicit width/height, lazy loading below the fold, `fetchpriority="high"` on the first hero image. Inline SVG motifs (network nodes, concentric "insight" rings, connecting lines) repeat across the site.

---

## 8. Hero specification (Home page)

Full-viewport carousel in `hero.js`. Five slides, client wording used **exactly** where quoted.

| # | Tab label | Headline (client wording) | Supporting line | Primary CTA | CTA goes to | Visual |
|---|---|---|---|---|---|---|
| 1 | 01 Positioning | "Clarify your identity, and understand how customers, partners, investors, or other stakeholders interpret it." | Reflective questions (see below) | TODO(client): CTA not given. Default "Explore positioning" | `/services.html#positioning-stakeholder-alignment` | **Alignment motif** (see below) |
| 2 | 02 Communication | "Communication is a strategic mechanism for achieving outcomes, not expression for its own sake." | "What does it take to truly speak to your audience's hearts?" | "Let us tell your story…" | `/services.html#strategic-narrative-communication` | Original editorial imagery, mood-matched to Untold Research (see D3) |
| 3 | 03 Counsel | "Work through complex decisions and communication challenges with a thoughtful advisory partner." | none, or one short line | "Start with the question you are facing" | `/contact.html` (pre-selects "Executive strategic counsel") | Quiet one-to-one conversation, over-the-shoulder, soft depth of field |
| 4 | 04 [Tagline] | **Placeholder tagline** from `config.js`. Provisional: "Clarity creates trust." | TODO(client) | "Request a consultation" | `/contact.html` | Concentric "insight" rings over calm architecture |
| 5 | 05 Gen Z research | "How are we reimagining and redesigning market and social research to make it more relevant, engaging and effective for Gen Z." | none | "Discover now" | `/gen-z-research.html` | Young East African professionals in dialogue, research-lab calm |

**Slide 1 supporting questions** (rewritten from the client's highlighted notes, no guarantee):
- "Is your vision understood the way you intend it?"
- "Is it understood the same way inside your organisation as outside it?"
- "Does it resonate with what your target customers need and care about?"

**Slide 1 alignment motif** (the client's image idea): several translucent cards, each with a grid of holes, stacked so the holes line up and a thin line of light passes through them. Two cards drift out of alignment, then slide back and the light passes through again. Loop about 10 seconds. Build it as inline SVG with CSS or Web Animations (lightweight, no video file). Reduced motion shows the aligned static state. `config.js` accepts an optional `heroVideo` (webm + mp4, muted, playsinline, with poster) so the client can substitute real footage later.

**Slide 4 tagline options for the README** (client to choose):
1. "Clarity creates trust."
2. "Interpretation before influence."
3. "Understood, precisely."

**Behaviour**
- Auto-advance about 7s with a thin progress bar. Pause on hover and focus. Respect `prefers-reduced-motion`.
- Cross-fade plus slide-up text, touch swipe (pointer events), arrow keys, prev/next buttons.
- Numbered tabs so visitors can jump to any slide.
- `role="region"`, `aria-roledescription="carousel"`, polite `aria-live`; only the active slide is focusable.
- Ken Burns zoom on photographic slides; dark-azure gradient overlay for legibility.
- `network.js`: faint canvas of drifting connected points that reacts gently to the cursor. Cap point count, pause when the tab is hidden or hero is off-screen, disable on low-power devices, on mobile if it drops frames, and under reduced motion. It must not compete with the slide 1 motif: hide the canvas on slide 1.
- Animated scroll cue. Sticky transparent header turning solid Dark Azure on scroll.

---

## 9. Global components

### Header and navigation
Logo wordmark left. Client's described top strip, extended:

| Nav item | Destination |
|---|---|
| What we do | `/services.html` |
| How we do it | `/about.html#approach` (see D7) |
| Who we are (dropdown) | About Us, Our Team, Testimonials, Careers |
| Insights | `/case-studies.html` |
| Gen Z Research | `/gen-z-research.html` (client: "will feature in the strip") |
| FAQs | `/faqs.html` |
| Contact | `/contact.html` |

Right side: phone/WhatsApp quick action and a **"Request a quote"** button. Mobile: slide-in panel with focus trap and Esc to close. Skip-to-content link on every page.

**Pages not yet built** link to a shared "In progress" stub (same header/footer, a short note and the contact options), so no link is ever dead during phased delivery. Each phase replaces its stub.

### Footer
Nav, contact details, privacy link, social placeholders (hidden if empty), short line on confidentiality.

### Conversion system
- Sticky mobile bar (Call / WhatsApp / Email) and floating WhatsApp button.
- Quote request is a toggle on the contact form and a header button.
- Form fields: name, organisation, role, email, phone, service of interest, message, "Request a quotation" toggle. Vanilla JS validation, inline errors with `aria-describedby`, honeypot, success and error states, `mailto:` fallback. Endpoint is a `TODO(client)` Formspree or Web3Forms value in `config.js`. No backend.
- Consent line under every form linking to the privacy page.

---

## 10. Content bank (approved copy)

Use verbatim unless marked.

**Positioning statement (Home):**
"Narris International is a boutique strategic narrative and positioning advisory helping leaders and institutions align complexity, communication, and stakeholder understanding with precision and strategic clarity."

**Purpose line:**
"To help leaders and institutions transform complexity, fragmentation, and strategic ambiguity into clarity, coherence, resonance, and trusted understanding."

**Vision:**
"To become the most trusted strategic narrative and positioning advisory for organizations operating within complex, emerging, and globally interconnected environments."

**Mission:**
"To help organizations, institutions, and leadership teams align vision, positioning, communication, and stakeholder understanding through strategic interpretation, narrative architecture, and precision-driven advisory."

**Core values**

| Value | Line |
|---|---|
| Precision | We pursue interpretive, strategic and narrative precision in every engagement. Detail, analytical rigour, thoughtful framing, disciplined thinking. |
| Integrity | Trust is built through honesty, discretion and intellectual responsibility. Truthful advisory, ethical positioning, confidentiality, authentic communication. |
| Strategic thinking | We do not treat communication as isolated messaging. We work systemically: long-term orientation, systems thinking, institutional understanding, contextual intelligence. |
| Listening | Meaningful communication begins with deep understanding. Audience interpretation, executive understanding, contextual immersion, empathy without assumption. |
| Depth | Thoughtful analysis over superficial visibility. Intellectual seriousness, nuance, strategic maturity. |

**Strategic philosophy (Home section and About)**
- Intro: "Most organisations have the ambition, intelligence or capability. They can still fail because they are misunderstood, internally fragmented, poorly positioned, strategically unclear, or disconnected from the people they seek to influence."
- "Narris International exists to close the gap between organizational intent and audience interpretation."
- Three principles: **Interpretation precedes communication. Listening precedes positioning. Understanding precedes influence.**
- Definition: "We define communication as a strategic mechanism for achieving outcomes, not expression for its own sake."
- Interactive chain: **Clarity → Trust → Alignment → Influence → Meaningful outcomes** ("Clarity creates trust. Trust creates alignment. Alignment creates influence. And influence creates meaningful outcomes.")

**"The gap we close" (paired rows, hover or focus links each pair)**

| Internal reality | External understanding |
|---|---|
| Vision | Perception |
| Complexity | Clarity |
| Strategy | Communication |
| Intention | Interpretation |
| Knowledge | Influence |
| Ideas | Action |

**Five services (public names from the questionnaire, detail from the Concept document)**

| Public name | Anchor id | Who it's for | Deliverables | Outcomes |
|---|---|---|---|---|
| Research interpretation and strategic insight | `research-interpretation` | Research-heavy institutions, policy bodies, leaders with valuable knowledge that is poorly communicated | Strategic reports; publication architecture; policy communication frameworks; research synthesis documents; executive-ready reports | Research translated into actionable, audience-aligned direction |
| Positioning and stakeholder alignment | `positioning-stakeholder-alignment` | Organisations whose identity, perception and communication have drifted apart | Positioning audits; stakeholder alignment reports; perception analysis; audience interpretation frameworks; institutional coherence assessments | Organisational positioning; institutional coherence; understanding of market perception |
| Strategic narrative and communication | `strategic-narrative-communication` | Organisations in transition or repositioning; leadership teams needing one voice | Narrative architecture frameworks; messaging systems; executive narrative maps; institutional communication strategy; positioning documents | Stakeholder and investor trust and clarity; executive communication strategy; improved market perception |
| Executive strategic counsel | `executive-strategic-counsel` | CEOs, institutional leaders, executive teams, founders | Strategic advisory sessions; executive briefings; confidential strategic memos; communication direction; leadership positioning guidance | Clearer thinking, clearer communication, more coherent action. Narris acts as thought partner and trusted confidant |
| Transition communication and trust | `transition-communication-trust` | Organisations facing institutional transition, mergers, leadership change, market entry, public mistrust or reputational complexity | Transition communication frameworks; stakeholder trust strategies; crisis positioning guidance; narrative stabilisation strategies | Clear, steady messaging through change |

Each service gets a one-line summary for Home cards. TODO(client) to approve final one-liners.

**How we engage (names only, no prices):** retained executive advisory; fixed-fee strategic projects; strategic reports and analysis; workshops and executive sessions; long-term institutional partnerships.

**Approach: nine stages (full on About, condensed to four on Home)**

| Home step | About stages |
|---|---|
| 1. Listen | Discovery (executive conversations) · Context mapping (goals, vision, audiences) |
| 2. Interpret | Audience interpretation (motivations, emotional realities) · Strategic diagnosis (fragmentation, misalignment) |
| 3. Shape | Narrative development (resonance, positioning) · Strategic framing (aligning communication with objectives) |
| 4. Align and sustain | Stakeholder alignment (coherence across audiences) · Advisory guidance · Implementation support |

**"Part research, part interpretation, part strategic architecture"** layers (About): Research (understanding realities) · Interpretation (extracting meaning) · Strategy (creating direction) · Narrative (shaping understanding) · Positioning (influencing perception) · Alignment (sustaining coherence).

**What sets Narris apart (About):** Interpretive precision · Strategic and human integration · Cross-cultural understanding · Relationship-centred advisory · Narrative architecture (structure of meaning, positioning and communication systems, not just storytelling).

**Who we serve (Home cards):** C-suite and leaders in private corporations · Leaders in NGOs and mission-driven organisations · Business owners and founders. Mention institutions and development organisations in About.

**Problems we solve (optional About list):** fragmented messaging, weak positioning, stakeholder misalignment, audience misunderstanding, communication incoherence, institutional ambiguity, narrative inconsistency, perception challenges, cross-cultural interpretation gaps, transition-related trust issues.

**Contact line:** "Work can be delivered remotely, with clients worldwide."

---

## 11. Phased build plan

Each phase ends with a **review stop**. Do not start the next phase until approved.

### Phase 0: Foundation (no finished pages)
- Scaffold repo, Tailwind config with brand tokens, npm scripts, folder structure, `config.js` with all keys and `TODO(client)` markers.
- `components.js` (header, footer, noscript nav), shared stub page for every unbuilt URL, skip link, cookie notice scaffold, base typography and reveal utilities.
- `scripts/validate.mjs` skeleton, README skeleton, `.gitignore`.
- **Done when:** every URL in the nav loads the stub with working header and footer; mobile menu works; no console errors.

### Phase 1: Home page only
Build in this order, showing the header and hero working **first**, then the rest:
1. Header (sticky, transparent to solid) and hero carousel per section 8, including slide 1 alignment motif and `network.js`.
2. Positioning statement with CTA.
3. "The gap we close" (internal reality / external understanding).
4. Services overview: five cards (icon, one-liner, hover) linking to service anchors.
5. Strategic philosophy: three principles plus the interactive Clarity → Outcomes chain (buttons, `aria-expanded`).
6. Vision and Mission on a Dark Azure band.
7. Core values: five items.
8. How we work: four steps.
9. Who we serve: three audience cards.
10. Insights: renders from `case-studies.json`; **section is hidden when no publishable entries exist**.
11. Credibility: testimonials strip and credentials placeholder; **hidden when empty**.
12. Final CTA band: phone, WhatsApp, email and a short inline enquiry form (`forms.js`).
13. Footer, sticky mobile bar, floating WhatsApp button.

- One idea per section, staggered scroll reveals, generous whitespace, no invented statistics.
- **Done when:** Lighthouse 90+ on Home, no layout shift, keyboard and screen-reader pass on carousel and philosophy chain, reduced-motion works, all hero CTAs resolve (stubs where needed), empty-state sections hide cleanly.

### Phase 2: Services page
- Sticky anchor nav, one detail section per service (what it is, who it's for, deliverables, outcomes), "How we engage" block (no prices), CTA to quotation.
- Anchor ids exactly as in section 10 so hero and Home links land correctly.
- **Done when:** every Home and hero link to a service lands on the right section.

### Phase 3: About Us
- Story (positioning statement, purpose, philosophy), vision, mission, values, what sets Narris apart, six-layer bridge, full nine-stage approach at `#approach`, HQ Nairobi with global reach.
- **Done when:** "How we do it" nav item scrolls correctly and the approach is readable on mobile.

### Phase 4: Contact Us and Privacy
- Full contact form with quotation toggle, phone, WhatsApp, email (hide address, hours and social when empty), `mailto:` fallback, service pre-selection from query string (`?service=`).
- Privacy policy referencing the **Kenya Data Protection Act**, cookie notice live. TODO(client): legal review of privacy text.
- **Done when:** a test submission succeeds against a real endpoint, errors are accessible, honeypot works.

### Phase 5: Insights and case studies (system)
- `data/case-studies.json` with documented schema and a template entry. `case-studies.html` lists with filters by sector and service. `case-study.html?slug=…` renders one.
- Fields: title, slug, sector, serviceTags, summary, challenge, approach, outcome, date, `disclosure` (`anonymous | client-approved | redacted`), `published`, `sample`.
- Anonymous entries never render client names, logos or identifying details. `client-approved` entries need `consentRef` and `approvedBy`, otherwise the renderer refuses to show them and logs a warning. `npm run validate` fails on violations.
- Page note: "Case studies are shared with client consent or fully anonymised in line with the Data Protection Act."
- 2–3 clearly labelled **sample** entries, rendered only when `flags.showSamples` is true. Write `CASE_STUDY_GUIDE.md` with a consent checklist.
- **Done when:** adding one JSON entry publishes a case study and the validator blocks an unapproved one.

### Phase 6: Gen Z Research page
- Own page at `/gen-z-research.html`, linked from header and hero slide 5. Opening statement uses the client's exact slide 5 wording.
- Content is not yet supplied. Build a structure the client can fill: the question, what is different about the approach, what it can answer for clients, how to engage, CTA. All body copy is `TODO(client)` and the page carries no claims until approved (see D5).
- **Done when:** page is complete in layout and clearly flagged for content sign-off.

### Phase 7: Our Team and Testimonials
- Cards from `team.json` and quotes from `testimonials.json`. Placeholder entries are marked and hidden in production. Empty states are graceful ("Profiles coming soon" is not shown publicly; the section is hidden or the page shows a short confidentiality-minded note).
- **Done when:** both pages render from JSON and hide placeholders by default.

### Phase 8: FAQs and Careers
- Accessible accordion from `faqs.json`. Write the content on: engagement process, confidentiality, who we work with, timelines, fees and quotations (no figures), working internationally, remote delivery.
- Careers: culture blurb in the brand voice, open roles list with graceful empty state, spontaneous application form with CV upload (note service file-size limits in README).
- **Done when:** accordion is keyboard accessible and the application form submits.

### Phase 9: Hardening and launch
- Unique title and meta per page, Open Graph and Twitter tags, canonical URLs, `sitemap.xml`, `robots.txt`, JSON-LD (Organization, ProfessionalService), favicon set.
- Lighthouse 90+ in all categories on every page, WCAG AA audit, cross-browser and device pass, broken-link check, image optimisation.
- Final README: setup, running Tailwind, endpoint config, adding case studies, swapping images and logo, deployment (Netlify, Vercel or GitHub Pages).
- Swap in the real logo, confirmed email, domain and any supplied tagline, address, hours and social links.
- **Done when:** the client's `TODO(client)` list (section 14) is cleared or consciously deferred.

---

## 12. Quality bar (applies to every phase)

- Mobile-first, fully responsive, semantic HTML, visible focus states, keyboard navigable, reduced-motion support, WCAG AA contrast.
- Minified CSS, deferred JS modules, lazy images, no layout shift.
- No console errors. No dead links (stubs until the real page exists).
- Fictional or placeholder content never renders in production.

## 13. Case study and data protection rules

Sensitive client information is never shown without authorisation. Acceptable forms: anonymous, client-approved, redacted, or generalised descriptions. Explicit consent is required before any identifying publication, and sensitive details can always be excluded. Narris's own brand principle of discretion applies: **default to anonymous**.

## 14. Client TODO list (collect over time)

1. Confirm email address and domain
2. Choose the tagline (section 8) or supply their own
3. Provide the logo file (Google Drive link already shared)
4. Confirm CTA wording for hero slides 1 and 4 (not given)
5. Scope for Gen Z Research (offer, project or insight piece), plus page content
6. Guidance on Untold Research imagery: which qualities they want matched
7. Address, social accounts, operating hours (all optional)
8. Team profiles and photos, testimonials, first case studies with consent
9. Approve service one-liners and FAQ answers
10. Legal review of privacy policy and cookie notice
11. Form service account (Formspree or Web3Forms) for the endpoint

---

## 15. Kickoff instruction for the build agent

> Read this whole brief. Start with **Phase 0**, then **Phase 1 (Home page only)**. Show the header and hero working first, then complete the Home page. Stop after Phase 1 and wait for approval. Use the client's exact wording where quoted, follow the precedence rules in section 2, never publish anything from section 5, and mark every assumption with `TODO(client)`. Commit once per phase.
