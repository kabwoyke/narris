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
    { label: 'Insights', href: '/case-studies.html' },
    { label: 'Gen Z Research', href: '/gen-z-research.html' },
    { label: 'FAQs', href: '/faqs.html' },
    { label: 'Contact', href: '/contact.html' },
  ],

  footerLinks: [
    { label: 'What we do', href: '/services.html' },
    { label: 'How we do it', href: '/about.html#approach' },
    { label: 'About Us', href: '/about.html' },
    { label: 'Our Team', href: '/team.html' },
    { label: 'Insights', href: '/case-studies.html' },
    { label: 'Gen Z Research', href: '/gen-z-research.html' },
    { label: 'Testimonials', href: '/testimonials.html' },
    { label: 'FAQs', href: '/faqs.html' },
    { label: 'Careers', href: '/careers.html' },
    { label: 'Contact', href: '/contact.html' },
  ],

  quoteCta: { label: 'Request a quote', href: '/contact.html?quote=1' },

  // Service list (public names from the questionnaire). Used by forms and the Home cards.
  services: [
    { id: 'research-interpretation', name: 'Research interpretation and strategic insight' },
    { id: 'positioning-stakeholder-alignment', name: 'Positioning and stakeholder alignment' },
    { id: 'strategic-narrative-communication', name: 'Strategic narrative and communication' },
    { id: 'executive-strategic-counsel', name: 'Executive strategic counsel' },
    { id: 'transition-communication-trust', name: 'Transition communication and trust' },
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
        cta: { label: "Become your customer's obvious choice", href: '/services.html#positioning-stakeholder-alignment' },
        visual: 'rings',
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
        cta: { label: 'Build a shared understanding', href: '/services.html#positioning-stakeholder-alignment' },
        visual: 'motif',
      },
      {
        id: 'communication',
        tab: 'Communication',
        headline: 'We define communication as a strategic mechanism for achieving outcomes, not expression for its own sake.',
        support: ['What does it take to truly “speak to your audience’s hearts?”'],
        // D4: client's exact CTA kept. Suggested alternative: "Let us shape your narrative".
        cta: { label: 'Let us tell your story', href: '/services.html#strategic-narrative-communication' },
        visual: 'photo',
        image: 'slide2',
      },
      {
        id: 'gen-z',
        tab: 'Gen Z research',
        // Client wording (Narris hero section-edited.docx): single question, no supporting line.
        headline: 'What if the intelligence that helps powerful institutions make better decisions became accessible, affordable, and genuinely useful to the young people making decisions about their own futures?',
        support: [],
        // TODO(client): scope of Gen Z research is unconfirmed (D5)
        cta: { label: 'Experience research differently', href: '/gen-z-research.html' },
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
    slide2: {
      src: unsplash('1758518731706-be5d5230e5a5'),
      alt: 'A diverse team of colleagues around a table, working through documents and a tablet.',
      width: 2000, height: 1333,
    },
    slide3: {
      src: unsplash('1573164574048-f968d7ee9f20'),
      alt: 'Two professionals in quiet conversation across a small table beside a tall window.',
      width: 2000, height: 1333,
    },
    slide4: {
      src: unsplash('1486406146926-c627a92ad1ab'),
      alt: 'Tall glass buildings seen from below against a pale sky.',
      width: 2000, height: 1333,
    },
    slide5: {
      src: unsplash('1573497019329-8c73173b95fb'),
      alt: 'Young professionals of colour laughing and talking around a laptop.',
      width: 2000, height: 1333,
    },
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
    // Drifting-points canvas in the hero.
    showNetwork: true,
    // Cookie notice scaffold. Goes live in Phase 4 together with the privacy policy.
    showCookieNotice: false,
  },

  // Optional credentials strip. Hidden while empty. TODO(client): supply, with evidence.
  credentials: [],
};

export default config;
