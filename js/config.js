/**
 * Narris International: site configuration.
 * Everything a non-developer may need to edit lives here or in /data.
 * Optional values (address, hours, social, tagline) HIDE GRACEFULLY when left empty.
 * Every assumption carries a TODO(client) marker; the full list is in CLAUDE.md section 14.
 */

// Unsplash placeholder helper. TODO(client): replace all stock imagery with approved photography
// (calm, human, editorial; East African and global professional settings).
const unsplash = (id) => `https://images.unsplash.com/photo-${id}`;

export const config = {
  brand: {
    name: 'Narris International',
    wordmark: 'Narris International',
    // Shown under the wordmark in the footer. Logo files: /assets/logo
    descriptor: 'Strategy advisory',
    // TODO(client): tagline not supplied. Provisional line from the client's philosophy (D8).
    // Alternatives: "Interpretation before influence." / "Understood, precisely."
    tagline: 'Clarity creates trust.',
    // Questionnaire wording is used for titles and meta descriptions (D1).
    metaDescriptor: 'A research-informed strategy advisory focused on positioning, stakeholder understanding and strategic communication.',
  },

  // Public site address, used for canonical URLs, Open Graph, sitemap.xml and JSON-LD (`npm run seo`).
  site: {
    // TODO(client): domain not confirmed. Assumed from the email domain; change here, then run `npm run seo`.
    url: 'https://narrisinternational.com',
    ogImage: 'assets/images/og-image.png',
  },

  contact: {
    phone: '0111429478',
    phoneIntl: '+254111429478',
    whatsapp: 'https://wa.me/254111429478',
    // TODO(client): email unconfirmed, depends on domain setup (D10). Change here only.
    email: 'bdu@narrisinternational.com',
    // TODO(client): optional. Leave empty to hide.
    address: '',
    hours: '',
    location: 'Nairobi, Kenya',
    social: { linkedin: '', x: '', instagram: '', facebook: '', youtube: '' },
    reachLine: 'Work can be delivered remotely, with clients worldwide.',
  },

  // Header navigation. A `children` array renders a dropdown.
  nav: [
    { label: 'What we do', href: '/services.html' },
    { label: 'How we do it', href: '/about.html#approach' }, // D7: section, not a page
    {
      label: 'Who we are',
      href: '/about.html',
      children: [
        { label: 'About Us', href: '/about.html' },
        { label: 'Our Team', href: '/team.html' },
        { label: 'Testimonials', href: '/testimonials.html' },
        { label: 'Careers', href: '/careers.html' },
      ],
    },
    { label: 'Perspectives', href: '/case-studies.html' },
    { label: 'NarGens', href: '/nargens.html' },
    { label: 'FAQs', href: '/faqs.html' },
    { label: 'Contact', href: '/contact.html' },
  ],

  footerLinks: [
    { label: 'What we do', href: '/services.html' },
    { label: 'How we do it', href: '/about.html#approach' },
    { label: 'About Us', href: '/about.html' },
    { label: 'Our Team', href: '/team.html' },
    { label: 'Perspectives', href: '/case-studies.html' },
    { label: 'NarGens', href: '/nargens.html' },
    { label: 'Testimonials', href: '/testimonials.html' },
    { label: 'FAQs', href: '/faqs.html' },
    { label: 'Careers', href: '/careers.html' },
    { label: 'Contact', href: '/contact.html' },
  ],

  quoteCta: { label: 'Request a quote', href: '/contact.html?quote=1' },

  // Service categories (client's four: Strategy, Design, Brand communication, Brand-led change). Used by forms and the Home cards.
  services: [
    { id: 'strategy', name: 'Strategy' },
    { id: 'design', name: 'Design' },
    { id: 'brand-communication', name: 'Brand communication' },
    { id: 'brand-led-change', name: 'Brand-led change' },
  ],


  hero: {
    intervalMs: 5000, // time each slide stays before advancing (ms)
    // Optional: real footage for slide 1 instead of the SVG alignment motif.
    // { webm: '/assets/video/alignment.webm', mp4: '/assets/video/alignment.mp4', poster: '/assets/images/alignment-poster.jpg' }
    heroVideo: null,
    // Client wording (revised hero document, Phase 2) is used EXACTLY.
    slides: [
      {
        id: 'positioning',
        tab: 'Positioning',
        headline:
          'Positioning begins long before the first interaction, in the shaping of the perceptions, expectations, and associations through which a brand is understood.',
        support: ['Are you intentionally shaping that perception, or leaving it to chance?'],
        cta: { label: "Become your customer's obvious choice", href: '/service-strategy.html' },
        visual: 'photo',
        image: 'slide4',
      },
      {
        id: 'shared-understanding',
        tab: 'Shared understanding',
        headline:
          'We believe a vision can only achieve its full potential when the people responsible for bringing it to life share a common understanding of it.',
        support: [
          'Is your vision consistently understood across your organization, and does it connect meaningfully with the people the business exists to serve?',
        ],
        cta: { label: 'Build a shared understanding', href: '/service-strategy.html' },
        // Client feedback: the alignment animation was dropped in favour of a background photo, like the other slides.
        visual: 'photo',
        image: 'slide1',
      },
      {
        id: 'communication',
        tab: 'Communication',
        headline: 'We define communication as a strategic mechanism for achieving outcomes, not expression for its own sake.',
        support: ['What does it take to truly “speak to your audience’s hearts?”'],
        // D4: client's exact CTA kept. Suggested alternative: "Let us shape your narrative".
        cta: { label: 'Let us tell your story', href: '/service-brand-communication.html' },
        visual: 'photo',
        image: 'slide2',
      },
      {
        id: 'gen-z',
        tab: 'NarGens',
        // Client wording (Nargens comments.docx): bold statement above the question.
        statement: 'Think with Narris, Grow with Narris',
        headline: 'What if the intelligence that helps powerful institutions make better decisions became accessible, affordable, and genuinely useful to the young people making decisions about their own futures?',
        support: [],
        // TODO(client): scope of NarGens is unconfirmed (D5)
        cta: { label: 'Experience research differently', href: '/nargens.html' },
        visual: 'photo',
        image: 'slide5',
      },
      {
        id: 'report',
        tab: 'Latest report',
        // TODO(client): placeholder slide, reserved for the latest strategic report. Replace the question,
        // image and CTA link (currently the Insights page) when the report is ready.
        headline: 'How are brands positioning themselves to win consumer preference this coming holiday season?',
        support: [],
        cta: { label: 'Find out now', href: '/case-studies.html' },
        visual: 'photo',
        image: 'slide3',
      },
    ],
  },

  // Image sources. Swap the `src` (or point to /assets/images/...) to change any image.
  // TODO(client): all placeholders. Slide 2 should match the MOOD of Untold Research without copying its imagery (D3).
  images: {
    slide1: {
      src: unsplash('1758691737543-09a1b2b715fa'),
      alt: 'A multiracial group of colleagues in relaxed conversation by a window.',
      width: 2000, height: 1333,
    },
    slide2: {
      src: unsplash('1573167710701-35950a41e251'),
      alt: 'Black women executives in a meeting room, one speaking while the other listens.',
      width: 2000, height: 1333,
    },
    slide3: {
      src: unsplash('1758876202980-0a28b744fb24'),
      alt: 'A Black woman and a colleague talking through a laptop screen together at a desk.',
      width: 2000, height: 1333,
    },
    slide4: {
      src: unsplash('1573496130488-f3bd89d03653'),
      alt: 'A Black woman professional at a meeting table, attentive and mid-conversation.',
      width: 2000, height: 1333,
    },
    slide5: {
      src: unsplash('1631131431211-4f768d89087d'),
      alt: 'A confident young African business leader in a blue suit, smiling outdoors.',
      width: 2000, height: 1333,
    },
    // Perspectives article thumbnails: a pool of Unsplash photo ids, shuffled on each page load so cards get random images.
    // TODO(client): placeholders. Add or remove ids freely; an article can still set its own `image` in data/articles.json.
    articles: [
      '1522071820081-009f0129c71c', '1552664730-d307ca884978', '1517048676732-d65bc937f952', '1454165804606-c3d57bc86b40',
      '1497366216548-37526070297c', '1556761175-5973dc0f32e7', '1521737711867-e3b97375f902', '1531482615713-2afd69097998',
      '1553877522-43269d4ea984', '1542744173-8e7e53415bb0', '1600880292203-757bb62b4baf', '1507679799987-c73779587ccf',
      '1573497019940-1c28c88b4f3e', '1519389950473-47ba0277781c',
    ],
    // Home page section images (one per section, rendered by main.js into <figure data-section-img="key">).
    // TODO(client): placeholders. Replace with supplied photography; keep calm, editorial, Azure/Warm-leaning.
    sections: {
      positioning: { src: unsplash('1573164574572-cb89e39749b4'), alt: 'A diverse group of professionals seated along a long boardroom table, in discussion.' },
      gap: { src: unsplash('1758876202980-0a28b744fb24'), alt: 'A Black woman and a white man talking through a laptop screen together at a desk.' },
      services: { src: unsplash('1573167710701-35950a41e251'), alt: 'Black women executives in a meeting room, one speaking while the other listens.' },
      philosophy: { src: unsplash('1758691737543-09a1b2b715fa'), alt: 'A multiracial group of colleagues in relaxed conversation by a window.' },
      values: { src: unsplash('1573496130488-f3bd89d03653'), alt: 'Women of colour at a meeting table, attentive and mid-conversation.' },
      how: { src: unsplash('1758691737045-3ece61135061'), alt: 'A multi-ethnic team working through ideas on notes stuck to a glass wall.' },
      serve: { src: unsplash('1631131431211-4f768d89087d'), alt: 'A confident African business leader in a blue suit, smiling outdoors.' },
      // Gen Z (NarGens) page. TODO(client): placeholders.
      gzIntro: { src: unsplash('1687422808565-929533931584'), alt: 'A young African entrepreneur at his fruit stand, giving a thumbs up.' },
      gzProblem: { src: unsplash('1566397000179-d83e7535349d'), alt: 'Aerial view of a broken hanging bridge, a gap that is hard to cross.' },
      gzSolution: { src: unsplash('1687422809654-579d81c29d32'), alt: 'A young African woman entrepreneur at her fruit stand, checking her phone.' },
      contact: { src: unsplash('1600679472868-eae382e28b34'), alt: 'A smiling African professional in a navy suit and striped tie.' },
    },
  },

  forms: {
    // TODO(client): add a Formspree / Web3Forms endpoint, e.g. 'https://formspree.io/f/xxxxxxx'.
    // While empty, forms fall back to a pre-filled mailto: message.
    endpoint: '',
    careersEndpoint: '',
    mailtoFallback: true,
  },

  flags: {
    // Sample case studies / testimonials render ONLY when this is true. Keep false in production (D9).
    showSamples: false,
    // Visible "Draft" notes on pages awaiting client sign-off (NarGens). Set false at launch.
    showDraftNotes: true,
    // Drifting-points canvas in the hero.
    showNetwork: true,
    // Cookie notice scaffold. Live since Phase 4 (privacy policy exists).
    showCookieNotice: true,
  },

  // Optional credentials strip. Hidden while empty. TODO(client): supply, with evidence.
  credentials: [],
};

export default config;
