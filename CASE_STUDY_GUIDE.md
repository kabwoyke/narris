# Case study guide

Case studies live in `data/case-studies.json`. Adding one entry publishes it. `npm run validate` blocks entries that break the consent rules.

**Default to anonymous.** Narris's brand principle is discretion.

## Adding a case study

1. Copy the entry with slug `template-entry` and paste it at the end of the array.
2. Edit every field (see below). Set `"published": true` and `"sample": false` when it is approved.
3. Run `npm run validate`. Fix anything it reports.
4. Open `case-studies.html` and the entry's page (`case-study.html?slug=<slug>`).

## Fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Plain, specific, no client name unless `client-approved` |
| `slug` | yes | Lowercase kebab-case, unique. Becomes the URL |
| `sector` | yes | Used for the listing filter. Keep wording consistent between entries |
| `serviceTags` | yes | One or more service ids: `strategy`, `design`, `brand-communication`, `brand-led-change` |
| `summary` | yes | One or two sentences, shown on cards |
| `challenge`, `approach`, `outcome` | yes | Separate paragraphs with a blank line (`\n\n`). Qualitative. No guarantees, rankings or invented statistics |
| `date` | yes | `YYYY-MM-DD`. Newest first |
| `disclosure` | yes | `anonymous`, `redacted` or `client-approved` |
| `published` | yes | `false` hides the entry everywhere |
| `sample` | yes | `true` entries show only when `flags.showSamples` is true. Their summary must start with `SAMPLE.` |
| `consentRef` | client-approved only | Where the written consent is filed (email date, signed form id) |
| `approvedBy` | client-approved only | Name and role of the person at the client who approved |

Anonymous and redacted entries may not carry `client`, `clientName`, `clientLogo`, `logo`, `logoUrl`, `clientUrl` or `website`. The validator fails if they do.

## Consent checklist

- [ ] Default is anonymous. Is naming the client truly needed?
- [ ] Written consent from someone with authority at the client (`consentRef`, `approvedBy` filled in)
- [ ] Consent covers the exact text on the page, not an earlier draft
- [ ] No names, logos, locations, dates, figures or combinations of details that could identify the client or its people
- [ ] Sensitive details removed, even when the client is named
- [ ] No claim of guaranteed outcomes, rankings or invented statistics
- [ ] Client can withdraw consent: note how, and set `published` to `false` if they do
- [ ] `npm run validate` passes

## Sample entries

Three clearly labelled samples ship so the layout can be reviewed. They are fictional, render only with `flags.showSamples: true` in `js/config.js`, and must never go live. Delete them before launch if the client prefers.
