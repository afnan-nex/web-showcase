/**
 * NEXUS STUDIO — PORTFOLIO & CASE STUDIES REPOSITORY
 * Structured data for all client projects and dynamic routing
 */

const PROJECTS_DATA = [
  {
    id: "aurora",
    slug: "aurora",
    title: "Aurora Financial",
    subtitle: "Next-Gen Institutional Wealth & Algorithmic Trading Architecture",
    category: "web",
    categories: ["web", "product", "strategy"],
    industry: "Fintech / Global Markets",
    year: "2026",
    client: "Aurora Global Capital Ltd.",
    timeline: "18 Weeks",
    role: "Lead Digital Architecture & Brand System",
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=85",
    tags: ["Web Architecture", "UI/UX Systems", "Real-Time Data", "Design System"],
    featured: true,
    excerpt: "Re-architecting institutional asset management for tier-1 hedge funds with sub-millisecond execution clarity and tactile typography.",
    overview: "Aurora Financial is an ultra-high-frequency quantitative asset manager managing over $8.4B in institutional capital. They commissioned Nexus Studio to overhaul their flagship investor terminal, institutional marketing presence, and proprietary multi-asset visualization system from the ground up.",
    challenge: "The existing platform suffered from legacy enterprise bloat: dense 4K screens cluttered with unstyled tables, slow cold-boot times exceeding 4.2 seconds, and a fragmented brand identity that failed to inspire confidence among sovereign wealth fund allocators.",
    strategy: "We engineered a clean, high-density editorial design system nicknamed 'Monolith Alpha'. We reduced cognitive friction by prioritizing hierarchical telemetry, utilizing monospaced metrics paired with bespoke typographic weights, and structuring a modular layout tailored for high-stakes financial operations.",
    designApproach: "Deep obsidian surfaces with controlled high-contrast fluorescent data highlights. Bespoke custom data charting visualizations built with lightweight vector rendering and fluid micro-transitions.",
    development: "Engineered with modern zero-overhead static hydration, WebSockets data streaming integration, WebGL charting engines, and aggressive asset caching resulting in sub-50ms paint times.",
    results: "Within 90 days of launch, Aurora secured an additional $1.8B in institutional allocation commitments and received the 2026 FWA Site of the Day.",
    metrics: [
      { value: "+280%", label: "Qualified Institutional Inquiries" },
      { value: "38ms", label: "Average Interaction Latency" },
      { value: "$1.8B", label: "New Capital Onboarded (Q1)" },
      { value: "100/100", label: "Lighthouse Performance Score" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
        caption: "Bespoke high-density liquidity matrix and trade execution view."
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Quantitative portfolio modeling engine and historical backtesting UI."
      },
      {
        url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
        caption: "Investor telemetry dashboard for private client portal."
      },
      {
        url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
        caption: "Multi-market order book with tactile typographic hierarchy."
      }
    ],
    testimonial: {
      quote: "Nexus Studio delivered something exceedingly rare: an interface that satisfies both hardline quantitative traders and executive board members. It redefined our market stature entirely.",
      author: "Elena Rostova",
      role: "Managing Director & Head of Quantitative Strategy",
      company: "Aurora Global Capital",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "lumina",
    slug: "lumina",
    title: "Lumina Health AI",
    subtitle: "Clinical Intelligence & Neural Diagnostic Imaging Platform",
    category: "product",
    categories: ["product", "branding", "web"],
    industry: "Biotech & Clinical AI",
    year: "2025",
    client: "Lumina Therapeutics Inc.",
    timeline: "20 Weeks",
    role: "Brand Identity, Product Design & Web Platform",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85",
    tags: ["Product Design", "Biotech Branding", "Diagnostic UI", "FDA Compliance UX"],
    featured: true,
    excerpt: "Transforming complex oncological neural scans into unambiguous clinical diagnostic decisions for 400+ leading research hospitals.",
    overview: "Lumina Health develops FDA-cleared neural networks for rapid cancer detection. Nexus Studio built their entire consumer-facing brand, physician diagnostic portal, and research platform.",
    challenge: "Radiologists process thousands of multi-spectral slices daily. The challenge was displaying high-dimensional probabilistic AI heatmaps without obscuring raw DICOM imaging or creating clinical alert fatigue.",
    strategy: "We worked alongside certified neuro-radiologists to formulate an ergonomic UI with zero visual pollution, ultra-precise calibrated grayscale palettes, and single-click diagnostic audit trails.",
    designApproach: "Surgical minimalism with ultra-refined typography, dual-layer vector overlays, and intelligent keyboard-first hotkeys.",
    development: "Zero-latency canvas-based volumetric rendering, lossless client decompression, and WCAG AAA clinical accessibility.",
    results: "Accelerated average diagnostic triage time by 44% while achieving 99.8% physician adoption rate across pilot university hospitals.",
    metrics: [
      { value: "-44%", label: "Diagnostic Triage Time" },
      { value: "400+", label: "Hospitals Deployed" },
      { value: "99.8%", label: "Physician Satisfaction" },
      { value: "$64M", label: "Series B Funding Secured" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
        caption: "Multi-planar volumetric MRI reconstruction and anomaly segmentation."
      },
      {
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        caption: "Physician diagnostic verification flow and comparative pathology ledger."
      },
      {
        url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
        caption: "Lumina brand visual identity guidelines and clinical icon system."
      }
    ],
    testimonial: {
      quote: "The interface Nexus crafted is now saving lives every single morning. The clarity and restraint of the UX allows our clinicians to make critical decisions with total confidence.",
      author: "Dr. Marcus Vance",
      role: "Chief Medical Officer & Co-Founder",
      company: "Lumina Health AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "vortex",
    slug: "vortex",
    title: "Vortex Dynamics",
    subtitle: "Autonomous Drone Fleet Telematics & Spatial Logistics OS",
    category: "web",
    categories: ["web", "product"],
    industry: "Robotics & Aerospace",
    year: "2026",
    client: "Vortex Aerospace Corp.",
    timeline: "14 Weeks",
    role: "Interactive 3D Web & Flight Control UX",
    heroImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1800&q=85",
    tags: ["3D Spatial UI", "WebGL Experience", "Aerospace Design", "Fleet Telemetry"],
    featured: true,
    excerpt: "An interactive spatial mission control center managing 10,000+ simultaneous autonomous logistics drones in urban airspace.",
    overview: "Vortex Dynamics pioneers automated commercial air corridors. They partnered with Nexus Studio to design their global commercial website and interactive 3D fleet simulation hub.",
    challenge: "Communicating complex 4D airspace deconfliction algorithms to municipal stakeholders and enterprise logistics directors in a compelling, interactive medium.",
    strategy: "We built an interactive, browser-native 3D globe and airspace sandbox allowing prospects to test drone delivery routes in real-time under fluctuating weather scenarios.",
    designApproach: "Futuristic yet industrial aesthetics: technical blueprints, dark aerospace materials, vector HUD accents, and fluid 60FPS physics transitions.",
    development: "Optimized custom Three.js shader pipelines, lightweight spatial coordinates compression, and real-time interactive parameter tweaking.",
    results: "Generated 340+ enterprise pilot inquiries in the first month post-launch and earned Site of the Month honors on Awwwards.",
    metrics: [
      { value: "60 FPS", label: "Fluid 3D Browser Performance" },
      { value: "340+", label: "Enterprise Inquiries" },
      { value: "4.8 min", label: "Average Session Duration" },
      { value: "2x", label: "Contract Win Rate" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
        caption: "3D urban airspace density map with dynamic flight path routing."
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        caption: "Planetary fleet telemetry command center and weather sensor array."
      }
    ],
    testimonial: {
      quote: "Working with Nexus felt like having an elite skunkworks team embedded within our engineering unit. The website they created directly won us our largest government aerospace contract.",
      author: "Julian H. Croft",
      role: "VP of Product & Government Affairs",
      company: "Vortex Aerospace",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "solaris",
    slug: "solaris",
    title: "Solaris Spatial",
    subtitle: "Spatial Computing & Virtual Architecture Studio",
    category: "branding",
    categories: ["branding", "strategy", "web"],
    industry: "Spatial Computing / Architecture",
    year: "2025",
    client: "Solaris Spatial Labs AG",
    timeline: "12 Weeks",
    role: "Brand Identity, Editorial Web & Sound Design",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
    tags: ["Brand Identity", "Editorial Web", "Spatial Design", "Creative Direction"],
    featured: true,
    excerpt: "Crafting a boundary-pushing visual identity for a Zurich-based spatial architecture atelier building immersive virtual pavilions.",
    overview: "Solaris Spatial builds hyper-luxury architectural pavilions for spatial headsets and physical-digital hybrid events. Nexus created their global brand positioning and digital showcase.",
    challenge: "Avoiding the tacky 'metaverse' tropes and instead positioning spatial architecture alongside high-end physical architectural institutions like Foster + Partners and Herzog & de Meuron.",
    strategy: "We built an art-gallery aesthetic characterized by monospaced architectural drawings, expansive negative space, and large-scale photography of virtual geometry.",
    designApproach: "Monochromatic editorial minimalism, Swiss grid disciplines, customized typography, and tactile scroll-driven parallax layers.",
    development: "Zero external frameworks, hand-crafted CSS grids, responsive fluid typography formulas, and instant navigation transitions.",
    results: "Won Red Dot Best of the Best 2025 in Brand & Communication Design, with an average project inquiry size growing from $50k to $250k+.",
    metrics: [
      { value: "5x", label: "Average Project Deal Size" },
      { value: "Red Dot", label: "Best of the Best Award" },
      { value: "100%", label: "Organic Press Coverage" },
      { value: "< 0.4s", label: "Global Page Load Time" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        caption: "Virtual pavilion architectural blueprint and light refraction study."
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        caption: "Bespoke physical exhibition catalog and debossed stationery system."
      }
    ],
    testimonial: {
      quote: "Nexus understood our architectural philosophy immediately. They translated intangible spatial concepts into an unforgettable online experience.",
      author: "Mathias Weber",
      role: "Principal Architect",
      company: "Solaris Spatial Labs AG",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "kinetix",
    slug: "kinetix",
    title: "Kinetix Mobility",
    subtitle: "Electric Hypercar Telematics & Bespoke Flagship Configurator",
    category: "e-commerce",
    categories: ["e-commerce", "web", "product"],
    industry: "Automotive & Clean Tech",
    year: "2026",
    client: "Kinetix Motors UK",
    timeline: "22 Weeks",
    role: "E-Commerce Architecture, 3D Configurator & Design System",
    heroImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1800&q=85",
    tags: ["E-Commerce", "3D Vehicle Configurator", "Luxury UX", "Web Performance"],
    featured: false,
    excerpt: "Engineering a bespoke digital showroom and real-time vehicle customizer for a $1.2M limited-production electric hypercar.",
    overview: "Kinetix Mobility engineers ultra-exclusive electric performance vehicles. Nexus built their multi-tier digital atelier and client reservation portal.",
    challenge: "Enabling high-net-worth buyers to customize bespoke paint finishes, interior carbon weaves, and bespoke telemetry packages with photorealistic precision on any device.",
    strategy: "Created an immersive cinematic 360-degree configurator with real-time price estimation, bespoke option locking, and concierge checkout integrations.",
    designApproach: "Monolithic luxury styling, dark carbon textures, precision mechanical typography, and micro-animated component states.",
    development: "WebGL PBR material rendering, dynamic GLTF asset streaming, state persistence via localStorage, and instant currency switching.",
    results: "Entire 150-unit production run sold out within 72 hours of configurator debut, totaling $180M in direct reservations.",
    metrics: [
      { value: "$180M", label: "Direct Reservations in 72h" },
      { value: "100%", label: "Allocated Production Run" },
      { value: "4.2M", label: "Configurator Sessions" },
      { value: "98.4%", label: "Customer Concierge CSAT" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        caption: "Bespoke interior carbon trim and telemetry interface customizer."
      },
      {
        url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
        caption: "Aerodynamic downforce visualization and digital wind tunnel module."
      }
    ],
    testimonial: {
      quote: "The digital showroom Nexus created for Kinetix became our most potent sales weapon. Our clients spent hours customizing every stitch.",
      author: "Alastair Sterling",
      role: "Chief Commercial Officer",
      company: "Kinetix Motors",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "archipelago",
    slug: "archipelago",
    title: "Archipelago Reserve",
    subtitle: "Ultra-Luxury Regenerative Eco-Resort & Private Islands",
    category: "branding",
    categories: ["branding", "web", "strategy"],
    industry: "Luxury Hospitality & Conservation",
    year: "2024",
    client: "Archipelago Hospitality Group",
    timeline: "16 Weeks",
    role: "Brand Identity, Editorial Content & Booking Engine",
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85",
    tags: ["Brand Identity", "Luxury Hospitality", "Direct Booking", "Editorial Design"],
    featured: false,
    excerpt: "An art-directed digital sanctuary for a collection of private eco-villas in the Seychelles powered entirely by solar and tidal energy.",
    overview: "Archipelago Reserve combines ultra-luxury hospitality with marine conservation. Nexus Studio directed their worldwide brand relaunch and bespoke direct-booking portal.",
    challenge: "Differentiating from standard luxury hotels by highlighting serious biodiversity conservation milestones without diminishing the ultra-luxury hospitality allure.",
    strategy: "Conceived an editorial journal narrative pairing long-form nature essays with seamless villa availability reservation flows.",
    designApproach: "Warm sand and deep ocean hues, graceful serif typography, cinematic photography layouts, and generous whitespace.",
    development: "Zero-dependency date range selector, synchronized currency converter, and lightning-fast client-side page transitions.",
    results: "Direct commission-free bookings surged by +215%, eliminating third-party OTA dependency for 88% of all stays.",
    metrics: [
      { value: "+215%", label: "Direct Booking Revenue" },
      { value: "88%", label: "Commission-Free Bookings" },
      { value: "4.9/5", label: "Guest Digital Feedback" },
      { value: "$3.4k", label: "Average Daily Rate" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        caption: "Overwater architectural sanctuary and solar canopy integration."
      },
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        caption: "Bespoke print collateral, guest welcome compendium, and brass room keys."
      }
    ],
    testimonial: {
      quote: "Nexus captured the essence of Archipelago with astonishing delicacy. The website is an art piece that pays for itself ten times over each week.",
      author: "Camille Dupont",
      role: "Managing Director",
      company: "Archipelago Reserve",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "novus",
    slug: "novus",
    title: "Novus Clean Energy",
    subtitle: "Decentralized Fusion Grid & Clean Power Infrastructure",
    category: "strategy",
    categories: ["strategy", "web", "branding"],
    industry: "Climate Tech & Deep Energy",
    year: "2025",
    client: "Novus Energy Systems Inc.",
    timeline: "14 Weeks",
    role: "Strategic Brand Positioning & Global Web Architecture",
    heroImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=85",
    tags: ["Clean Tech", "Brand Strategy", "Data Architecture", "Enterprise Web"],
    featured: false,
    excerpt: "Repositioning a breakthrough magnet-confinement fusion energy startup for sovereign infrastructure investments.",
    overview: "Novus Energy developed proprietary high-temperature superconducting magnets for clean fusion energy. They engaged Nexus to define their institutional brand narrative.",
    challenge: "Translating extreme physics and fusion plasma containment metrics into credible, defensible commercial milestones for institutional energy ministers.",
    strategy: "Structured an interactive roadmap emphasizing grid parity timelines, safety containment physics, and supply chain scalability.",
    designApproach: "Scientific clarity: deep slate backgrounds, high-precision technical diagrams, clear data charts, and authoritative typography.",
    development: "Modular component architecture, vector animation engines, zero external dependencies, and optimized SVG schematics.",
    results: "Positioned Novus to successfully close a $420M Series C led by global infrastructure funds.",
    metrics: [
      { value: "$420M", label: "Series C Funding Raised" },
      { value: "14", label: "National Utilities Partnered" },
      { value: "0ms", label: "Layout Shift (CLS = 0.00)" },
      { value: "+380%", label: "Investor Engagement Time" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
        caption: "Superconducting magnet torus cross-section and thermal dissipation model."
      }
    ],
    testimonial: {
      quote: "The strategic positioning Nexus built became the core narrative of our investor roadshow. They made nuclear fusion feel immediate, elegant, and achievable.",
      author: "Dr. Sean K. Ward",
      role: "Chief Executive Officer",
      company: "Novus Energy",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    }
  },
  {
    id: "prism",
    slug: "prism",
    title: "Prism Spatial Audio",
    subtitle: "High-Fidelity Audiophile Hardware & Companion OS",
    category: "e-commerce",
    categories: ["e-commerce", "product", "branding"],
    industry: "Acoustics & Consumer Tech",
    year: "2026",
    client: "Prism Acoustics Corp.",
    timeline: "15 Weeks",
    role: "E-Commerce Flagship, Acoustic Visualizer & Companion App",
    heroImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=85",
    tags: ["Acoustics UI", "E-Commerce", "Sound Design", "Audio Visualizer"],
    featured: false,
    excerpt: "A tactile digital flagship and real-time parametric frequency equalizer for studio reference planar magnetic headphones.",
    overview: "Prism Audio engineers handcrafted beryllium planar magnetic headphones for audio mastering engineers and discerning listeners.",
    challenge: "Demonstrating the transcendent acoustic fidelity of physical studio headphones through a digital browser screen.",
    strategy: "Developed an interactive Web Audio API acoustic testing lab allowing visitors to toggle frequency responses, simulate binaural rooms, and order custom wood finishes.",
    designApproach: "Studio console aesthetics, machined aluminum textures, brushed brass accents, and subtle oscilloscope micro-animations.",
    development: "Zero-dependency Web Audio API oscillator visualizer, dynamic shopping cart drawer, and frictionless one-page checkout simulation.",
    results: "Initial pre-order batch of 2,500 units sold out in 4.5 hours with an average cart value exceeding $1,400.",
    metrics: [
      { value: "4.5 hrs", label: "Initial Inventory Sellout" },
      { value: "$1,420", label: "Average Order Value" },
      { value: "+190%", label: "Interactive Demo Conversion" },
      { value: "48 Awards", label: "International Design Accolades" }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
        caption: "Beryllium driver cross-section and CNC milled aluminum earcups."
      },
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
        caption: "Interactive parametric EQ profile editor with real-time frequency curve."
      }
    ],
    testimonial: {
      quote: "Nexus gave our hardware the digital altar it deserved. The interactive frequency simulator alone doubled our baseline conversion rate.",
      author: "Taro Takahashi",
      role: "Founder & Chief Acoustic Engineer",
      company: "Prism Audio",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  }
];

// Helper functions for easy querying
function getAllProjects() {
  return PROJECTS_DATA;
}

function getFeaturedProjects() {
  return PROJECTS_DATA.filter(p => p.featured);
}

function getProjectBySlug(slug) {
  if (!slug) return null;
  return PROJECTS_DATA.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

function getProjectsByCategory(category) {
  if (!category || category === "all") return PROJECTS_DATA;
  return PROJECTS_DATA.filter(p => p.categories.includes(category.toLowerCase()));
}
