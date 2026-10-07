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
    // Client wording is used EXACTLY where quoted (CLAUDE.md section 8).
    slides: [
      {
        id: 'positioning',
        tab: 'Positioning',
        headline:
          'Clarify your identity, and understand how customers, partners, investors, or other stakeholders interpret it.',
        // Rewritten as reflective questions with no promised outcome (D2).
        support: [
          'Is your vision understood the way you intend it?',
          'Is it understood the same way inside your organisation as outside it?',
          'Does it resonate with what your target customers need and care about?',
        ],
        // TODO(client): CTA not given for slide 1. Default used.
        cta: { label: 'Explore positioning', href: '/services.html#positioning-stakeholder-alignment' },
        visual: 'motif',
      },
      {
        id: 'communication',
        tab: 'Communication',
        headline: 'Communication is a strategic mechanism for achieving outcomes, not expression for its own sake.',
        support: ["What does it take to truly speak to your audience's hearts?"],
        // D4: client's exact CTA kept. Suggested alternative: "Let us shape your narrative".
        cta: { label: 'Let us tell your story…', href: '/services.html#strategic-narrative-communication' },
        visual: 'photo',
        image: 'slide2',
      },
      {
        id: 'counsel',
        tab: 'Counsel',
        headline: 'Work through complex decisions and communication challenges with a thoughtful advisory partner.',
        support: [],
        cta: { label: 'Start with the question you are facing', href: '/contact.html?service=executive-strategic-counsel' },
        visual: 'photo',
        image: 'slide3',
      },
      {
        id: 'tagline',
        // Tab label follows the tagline (config.brand.tagline) at runtime.
        tab: null,
        headline: null, // = config.brand.tagline. TODO(client): confirm tagline (D8)
        support: [], // TODO(client): supporting line for the tagline slide
        // TODO(client): CTA not given for slide 4. Default used.
        cta: { label: 'Request a consultation', href: '/contact.html' },
        visual: 'rings',
        image: 'slide4',
      },
      {
        id: 'gen-z',
        tab: 'Gen Z research',
        headline:
          'How are we reimagining and redesigning market and social research to make it more relevant, engaging and effective for Gen Z.',
        support: [],
        // TODO(client): scope of Gen Z research is unconfirmed (D5)
        cta: { label: 'Discover now', href: '/gen-z-research.html' },
        visual: 'photo',
        image: 'slide5',
      },
    ],
  },

  // Image sources. Swap the `src` (or point to /assets/images/...) to change any image.
  // TODO(client): all placeholders. Slide 2 should match the MOOD of Untold Research without copying its imagery (D3).
  images: {
    slide2: {
      src: unsplash('1573164574511-73c773193279'),
      alt: 'Colleagues in discussion around a long table, hands resting on notebooks and documents.',
      width: 2000, height: 1333,
    },
    slide3: {
      src: unsplash('1521737604893-d14cc237f11d'),
      alt: 'A small group in quiet conversation at a table in a softly lit room.',
      width: 2000, height: 1333,
    },
    slide4: {
      src: unsplash('1486406146926-c627a92ad1ab'),
      alt: 'Tall glass buildings seen from below against a pale sky.',
      width: 2000, height: 1333,
    },
    slide5: {
      src: unsplash('1531545514256-b1400bc00f31'),
      alt: 'Young professionals gathered around a laptop, talking through what is on the screen.',
      width: 2000, height: 1333,
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
