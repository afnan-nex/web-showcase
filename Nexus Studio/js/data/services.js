/**
 * NEXUS STUDIO — SERVICES & CAPABILITIES DATA
 * Detailed specifications, deliverables, methodologies and capabilities
 */

const SERVICES_DATA = [
  {
    id: "brand-strategy",
    number: "01",
    title: "Brand Strategy & Identity",
    summary: "Category-defining brand architectures, visual identity systems, and naming.",
    description: "We position forward-thinking institutions to command category leadership through rigorous market differentiation, distinct visual identities, comprehensive design systems, and art-directed brand playbooks.",
    deliverables: [
      "Brand Architecture & Positioning",
      "Comprehensive Design Systems & Tokens",
      "Typography Calibration & Custom Iconography",
      "Verbal Identity & Editorial Tone of Voice",
      "Motion Identity & Sonic Guidelines",
      "Brand Guidelines & Asset Repositories"
    ],
    tools: ["Figma", "Glyphs", "Adobe Creative Suite", "Cinema 4D"],
    leadTime: "4 – 8 Weeks"
  },
  {
    id: "ui-ux-design",
    number: "02",
    title: "UI/UX Design Systems",
    summary: "Ergonomic, high-density interfaces designed for complex workflows and high stakes.",
    description: "We create human-centered interfaces that balance visual elegance with surgical ergonomics. Every pixel is calculated to reduce friction, elevate comprehension, and delight discerning users across every viewport.",
    deliverables: [
      "User Journey Mapping & Mental Models",
      "High-Fidelity Interactive Prototypes",
      "Atomic Component Libraries in Figma",
      "Micro-interaction & Transition Specs",
      "WCAG 2.2 AAA Accessibility Compliance",
      "Design System Documentation (Zeroheight / Storybook)"
    ],
    tools: ["Figma", "ProtoPie", "Rive", "Principle"],
    leadTime: "6 – 12 Weeks"
  },
  {
    id: "web-development",
    number: "03",
    title: "Web Architecture & Engineering",
    summary: "Sub-50ms speed, zero-bloat static architecture, and bespoke WebGL interactions.",
    description: "We write clean, semantic, handcrafted code optimized for extreme speed, accessibility, and search indexation. No generic frameworks or bloatware — only high-performance digital craft that lasts for years.",
    deliverables: [
      "High-Performance Vanilla & Static Hydration",
      "Bespoke WebGL & Canvas Shaders",
      "100/100 Lighthouse Performance Tuning",
      "Zero-Downtime Static & Edge Deployments",
      "Headless CMS Integration (Sanity / Storyblok)",
      "Strict Security Audits & CSP Headers"
    ],
    tools: ["HTML5", "Modern CSS", "Vanilla JavaScript", "Three.js / WebGL", "Vite", "Edge Networks"],
    leadTime: "6 – 16 Weeks"
  },
  {
    id: "ecommerce",
    number: "04",
    title: "E-Commerce Flagships",
    summary: "Bespoke digital ateliers and conversion-optimized luxury commerce engines.",
    description: "We design and build bespoke e-commerce experiences for luxury brands and direct-to-consumer pioneers where storytelling and transaction merge into an elevated customer journey.",
    deliverables: [
      "Custom 3D Product Configurators",
      "Headless Shopify Plus & Medusa Architectures",
      "Frictionless Multi-Currency Checkout",
      "Inventory & ERP Pipeline Integrations",
      "Custom Post-Purchase Loyalty Portals",
      "Conversion Rate Optimization (CRO) Frameworks"
    ],
    tools: ["Shopify Plus", "Medusa.js", "Stripe Elements", "WebGL 3D"],
    leadTime: "8 – 16 Weeks"
  },
  {
    id: "product-design",
    number: "05",
    title: "Product Design & SaaS Architecture",
    summary: "Complex enterprise software transformed into intuitive, lightning-fast tools.",
    description: "From quantitative trading terminals to clinical AI diagnostics, we untangle deep enterprise workflows into intuitive, resilient digital products that empower operators to work at the speed of thought.",
    deliverables: [
      "Data Density & Telemetry Hierarchies",
      "Cross-Platform SaaS Design Systems",
      "Role-Based Permission Matrix UI",
      "Real-Time Collaborative Multi-Cursor UX",
      "Keyboard-First Hotkey Ergonomics",
      "Usability Testing & Telemetry Analytics"
    ],
    tools: ["Figma", "React / Vanilla Web Components", "Mixpanel", "Hotjar"],
    leadTime: "8 – 20 Weeks"
  },
  {
    id: "motion-design",
    number: "06",
    title: "Motion & Creative Technology",
    summary: "60 FPS physics-based micro-interactions, 3D spatial models, and interactive graphics.",
    description: "Motion gives static layouts life and tactile weight. We choreograph purposeful, physics-driven animations, interactive 3D assets, and spatial elements that guide the user’s eye without degrading performance.",
    deliverables: [
      "Interactive 3D WebGL / Spline Environments",
      "Lottie / Rive Vector Micro-Animations",
      "Physics-Driven Scroll Animations",
      "Custom Video Encoding & Canvas Playback",
      "Interactive Sound FX & Audio UI Cues",
      "60 FPS GPU-Accelerated CSS Choreography"
    ],
    tools: ["Three.js", "GLSL Shaders", "Rive", "Spline", "After Effects", "Web Audio API"],
    leadTime: "4 – 10 Weeks"
  },
  {
    id: "seo",
    number: "07",
    title: "Technical SEO & Core Web Vitals",
    summary: "Semantic markup, schema graphs, and sub-second page loads for dominant rankings.",
    description: "We build websites that search engines love to index. By combining semantic HTML5 structures, structured JSON-LD schemas, and flawless Core Web Vitals, we establish durable organic search dominance.",
    deliverables: [
      "Full Technical SEO & Semantic Architecture",
      "Structured Schema.org JSON-LD Knowledge Graphs",
      "Core Web Vitals Optimization (LCP < 0.8s, CLS = 0)",
      "Automated XML Sitemap & OpenGraph Generators",
      "Internationalization (Hreflang) Architecture",
      "Competitor Organic Gap Audits"
    ],
    tools: ["Google Search Console", "Screaming Frog", "Ahrefs", "Schema App"],
    leadTime: "3 – 6 Weeks"
  },
  {
    id: "digital-strategy",
    number: "08",
    title: "Digital Strategy & Technology Advisory",
    summary: "Roadmapping, technology stack evaluation, and digital transformation for leadership.",
    description: "We advise executive teams and founders on digital positioning, technology choices, technical debt mitigation, and scalable digital roadmaps that maximize enterprise valuation.",
    deliverables: [
      "Digital Roadmap & Capital Allocation Advisory",
      "Technology Stack Due Diligence",
      "Vendor & Agency Assessment Frameworks",
      "AI & Automation Workflow Integration",
      "Executive Technical Advisory & Board Briefings",
      "Digital ROI Measurement Models"
    ],
    tools: ["Executive Workshops", "Architecture Blueprints", "ROI Financial Models"],
    leadTime: "2 – 6 Weeks"
  }
];

function getAllServices() {
  return SERVICES_DATA;
}

function getServiceById(id) {
  return SERVICES_DATA.find(s => s.id === id) || null;
}
