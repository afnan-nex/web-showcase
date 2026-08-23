/**
 * FRAME & FORM — MASTER UNIFIED APPLICATION BUNDLE
 * Self-contained, zero-dependency, works on file://, localhost, and GitHub Pages.
 */

(function () {
  'use strict';

  /* =============================================================
     1. DATASET
     ============================================================= */
  const STUDIO_INFO = {
    name: "Frame & Form",
    subtitle: "Visual Architecture & Multidisciplinary Creative Direction",
    director: "Kaelen Vane",
    tagline: "Exploring the tension between rigid structural framing and organic visual form.",
    locations: [
      { city: "Tokyo", country: "Japan", tz: "Asia/Tokyo", code: "TYO", address: "5-7-2 Minami-Aoyama, Minato-ku" },
      { city: "Zurich", country: "Switzerland", tz: "Europe/Zurich", code: "ZRH", address: "Rämistrasse 101, 8001 Zürich" },
      { city: "Paris", country: "France", tz: "Europe/Paris", code: "CDG", address: "14 Rue de Turenne, 75004 Paris" },
      { city: "New York", country: "USA", tz: "America/New_York", code: "NYC", address: "520 W 28th St, Chelsea" }
    ],
    stats: { founded: 2018, awards: 42, monographs: 7, exhibitions: 19 }
  };

  const DISCIPLINES = [
    { id: "all", label: "All Works", count: 12 },
    { id: "art-direction", label: "Art Direction", count: 4 },
    { id: "photography", label: "Photography", count: 5 },
    { id: "branding", label: "Branding", count: 3 },
    { id: "editorial", label: "Editorial", count: 3 },
    { id: "film", label: "Film", count: 2 },
    { id: "digital", label: "Digital", count: 3 }
  ];

  const PROJECTS = [
    {
      id: "neo-monolith",
      slug: "neo-monolith",
      title: "Neo-Monolith",
      subtitle: "Brutalist Spatial Study & Monograph",
      client: "Vitra Architecture Institute",
      year: 2026,
      location: "Basel / Tokyo",
      discipline: "Art Direction",
      disciplines: ["Art Direction", "Photography", "Editorial"],
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#D4AF37",
      summary: "A spatial investigation into raw concrete forms, optical shadow planes, and monolithic scale in contemporary sacred structures.",
      description: "Neo-Monolith investigates the intersection of brutalist architectural permanence and ephemeral light dynamics. Commissioned as both a limited-run monograph and a traveling spatial installation for the Vitra Architecture Institute, the project synthesizes large-format medium format photography, custom geometric typography, and architectural scale models. Each image was captured during the spring equinox across three continents, utilizing natural cross-angles of illumination.",
      concept: "We approached raw concrete not as inert mineral mass, but as a sensitive photographic emulsion—a surface that captures time, atmospheric particulate, and solar geometries. The accompanying 320-page hardcover publication employs raw bookcloth, unbleached Japanese cotton paper, and foil debossed glyphs.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop", caption: "Plate I — Concrete Cantilever & Equinox Shadow", camera: "Hasselblad H6D-100c · 50mm f/3.5 · ISO 64 · 1/125s", dimension: "100 MP / Medium Format" },
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop", caption: "Plate II — Angular Light Well & Geometric Convergence", camera: "Hasselblad H6D-100c · 80mm f/2.2 · ISO 64 · 1/60s", dimension: "100 MP / Medium Format" },
        { url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?q=80&w=1800&auto=format&fit=crop", caption: "Plate III — Monograph Specimen & Foil Deboss Binding", camera: "Leica SL2 · Summilux-SL 50mm f/1.4 · ISO 100 · 1/200s", dimension: "47 MP / Full Frame" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", caption: "Plate IV — Structural Rhythm in Cast Aggregates", camera: "Hasselblad H6D-100c · 35mm f/3.5 · ISO 64 · 1/90s", dimension: "100 MP / Medium Format" },
        { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop", caption: "Plate V — Verticality & Atmospheric Haze", camera: "Phase One IQ4 150MP · Schneider 55mm · ISO 50 · 1/250s", dimension: "151 MP / Trichromatic" }
      ],
      credits: [
        { role: "Creative Direction & Photography", name: "Kaelen Vane" },
        { role: "Spatial Architect", name: "Hiroshi Moriyama" },
        { role: "Typography & Book Design", name: "Studio Frame & Form" },
        { role: "Print Production", name: "Steidl Verlag / Göttingen" },
        { role: "Curation", name: "Elena Rostova" }
      ],
      awards: ["D&AD Yellow Pencil 2026", "Tokyo TDC Annual Award", "Swiss Design Award Nominee"]
    },
    {
      id: "chroma-vestige",
      slug: "chroma-vestige",
      title: "Chroma Vestige",
      subtitle: "High Fashion Campaign & Visual Identity",
      client: "Bottega Veneta / Special Projects",
      year: 2025,
      location: "Milan / Paris",
      discipline: "Photography",
      disciplines: ["Photography", "Art Direction", "Film"],
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#E05A47",
      summary: "Explorations in high-saturation chromatic drape, kinetic motion blur, and sculptural silhouetting for Autumn/Winter.",
      description: "Chroma Vestige is an international multi-channel campaign exploring the tension between hyper-refined luxury textiles and raw physical velocity. Captured across brutalist sets in Cergy-Pontoise and studio spaces in Milan, the series rejects sterile studio illumination in favor of dynamic strobe painting, prism refraction, and 16mm motion capture.",
      concept: "We treated each garment not as apparel, but as a kinetic sculpture reacting to turbulent air currents and harsh tungsten beams. The campaign extended into bespoke retail window projections, silk-screened outdoor billboards across six capitals, and a limited 16mm art film.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop", caption: "Look 01 — Kinetic Wool Pleat & Strobe Dissolve", camera: "Leica S3 · Summarit-S 70mm f/2.5 · ISO 100 · 1/500s", dimension: "64 MP / Medium Format" },
        { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1600&auto=format&fit=crop", caption: "Look 02 — Sculptural Leather Silhouette in Monolith Chamber", camera: "Hasselblad X2D 100C · XCD 90V · ISO 64 · 1/320s", dimension: "100 MP / Medium Format" },
        { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop", caption: "Look 03 — Chromatic Cascade & Texture Study", camera: "Phase One IQ4 · 110mm f/2.8 · ISO 50 · 1/160s", dimension: "151 MP / Medium Format" }
      ],
      credits: [
        { role: "Art Direction & Stills", name: "Kaelen Vane" },
        { role: "Styling Direction", name: "Marie-Claire Dupuis" },
        { role: "Cinematography (16mm)", name: "Arthur Pendelton" }
      ],
      awards: ["Clio Fashion Grand Prix", "Paris Photo Fashion Series of the Year"]
    },
    {
      id: "silent-frequencies",
      slug: "silent-frequencies",
      title: "Silent Frequencies",
      subtitle: "Acoustic Architecture & Spatial Branding",
      client: "Bang & Olufsen / Atelier Sound",
      year: 2025,
      location: "Copenhagen / Zurich",
      discipline: "Branding",
      disciplines: ["Branding", "Digital", "Art Direction"],
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#9C9C9C",
      summary: "Visualizing unperceivable acoustic resonance through machined anodized aluminum, generative waveforms, and bespoke typography.",
      description: "Silent Frequencies is a comprehensive brand identity and digital spatial presence for Bang & Olufsen's bespoke acoustic research laboratory. The identity translates sound pressures and resonance chambers into pure structural vectors, CNC-milled aluminum collateral, and a real-time WebGL interactive acoustic room configurator.",
      concept: "Every typographic glyph in the custom typeface 'Frequency Sans' has its stem width algorithmically modulated by acoustic frequency harmonics. We created an unadorned tactile universe of brushed metal, blind embossings, and dark tonal micro-surfaces.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1800&auto=format&fit=crop", caption: "Specimen A — Machined Baffle & Sound Absorption Geometry", camera: "Sony A1 · FE 90mm f/2.8 Macro · ISO 100 · 1/160s", dimension: "50 MP / High-Res" },
        { url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop", caption: "Specimen B — Generative Acoustic Waveform Interface", camera: "Digital Render / WebGL Engine 4K", dimension: "3840 x 2160" }
      ],
      credits: [
        { role: "Brand Architecture & Direction", name: "Studio Frame & Form" },
        { role: "Generative Systems & WebGL", name: "Lars Kjeldsen" }
      ],
      awards: ["Red Dot Best of the Best 2025", "Awwwards Site of the Month"]
    },
    {
      id: "synthetic-botany",
      slug: "synthetic-botany",
      title: "Synthetic Botany",
      subtitle: "Speculative Organic Flora & Macro Photography",
      client: "National Museum of Nature & Science",
      year: 2025,
      location: "Reykjavík / Tokyo",
      discipline: "Photography",
      disciplines: ["Photography", "Art Direction"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#3B7A57",
      summary: "Deep-macro study of cryogenic flora, cellular micro-pigmentation, and futuristic biomechanics.",
      description: "Commissioned as an exhibition centerpiece, Synthetic Botany examines how cellular plant structures might mutate under extreme atmospheric pressure and synthetic bio-luminescence. Utilising custom microscope lenses and focus-stacking of up to 400 exposures per plate.",
      concept: "We stripped botanical photography of its pastoral clichés. Instead, plants are framed with the forensic precision of industrial aerospace parts, highlighting their mathematically flawless vein structures.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1800&auto=format&fit=crop", caption: "Micrograph 01 — Sub-cellular Cryo-Crystalline Trichome", camera: "Mitutoyo 10x M Plan Apo · Custom Bellows", dimension: "150 MP Composite" }
      ],
      credits: [{ role: "Principal Macrographer", name: "Kaelen Vane" }],
      awards: ["Nature Photography Prize Zurich"]
    },
    {
      id: "terra-incognita",
      slug: "terra-incognita",
      title: "Terra Incognita",
      subtitle: "Cinematic Monograph & Geological Study",
      client: "Acne Paper / Rizzoli International",
      year: 2024,
      location: "Highlands of Iceland / Atacama",
      discipline: "Editorial",
      disciplines: ["Editorial", "Photography", "Art Direction"],
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#C2B280",
      summary: "A 400-page monograph documenting unmapped volcanic textures, tectonic fissures, and basalt formations across extreme altitudes.",
      description: "Spanning three years of remote expeditions into volcanic fault lines in the central Icelandic highlands and the hyper-arid Atacama desert, Terra Incognita represents an unyielding documentary of Earth's primordial crust.",
      concept: "We eliminated the romantic horizon line. Every photograph is a top-down orthogonal or steep oblique perspective, transforming mountains into abstract geometric tapestries.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop", caption: "Plate 14 — Basalt Rift & Glacial Silt Horizon", camera: "Phase One IQ4 150MP · Rodenstock 70mm", dimension: "151 MP" }
      ],
      credits: [{ role: "Photographer & Author", name: "Kaelen Vane" }],
      awards: ["German Photobook Award Gold"]
    },
    {
      id: "kinetic-shadows",
      slug: "kinetic-shadows",
      title: "Kinetic Shadows",
      subtitle: "Spatial Dance Film & Interactive Choreography",
      client: "NOWNESS / Biennale de la Danse",
      year: 2024,
      location: "Lyon / Berlin",
      discipline: "Film",
      disciplines: ["Film", "Art Direction", "Digital"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#5B6770",
      summary: "A 12-minute 35mm dance film exploring human biomechanics inside a motorized lighting grid that reshapes architectural volume.",
      description: "Kinetic Shadows captures four dancers within an industrial hangar in Berlin equipped with 64 synchronized motorized spotlight gantry arms.",
      concept: "We treated shadows not as the absence of light, but as physical matter with mass and velocity.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1800&auto=format&fit=crop", caption: "Frame 01 — DMX Spotlight Grid & Negative Silhouette", camera: "ARRI Alexa 35 · Cooke Anamorphic", dimension: "4.6K Cine" }
      ],
      credits: [{ role: "Director", name: "Kaelen Vane" }],
      awards: ["Vimeo Staff Pick of the Year"]
    },
    {
      id: "metric-dissolve",
      slug: "metric-dissolve",
      title: "Metric Dissolve",
      subtitle: "Autonomous Spatial Interface & Generative Design System",
      client: "Polestar Electric Vehicles",
      year: 2026,
      location: "Gothenburg / Tokyo",
      discipline: "Digital",
      disciplines: ["Digital", "Branding", "Art Direction"],
      featured: true,
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#4E82A0",
      summary: "A next-generation in-cockpit visual design language and real-time generative telemetry dashboard for luxury autonomous travel.",
      description: "Commissioned by Polestar Concept Lab, Metric Dissolve reimagines human-machine interface away from hyper-stimulating touchscreens toward calm, reductive typographic telemetry.",
      concept: "The UI is built entirely upon high-precision Swiss grid ratios, ultra-condensed monospaced numerals, and optical laser-etched light guides.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1800&auto=format&fit=crop", caption: "Interface Mode 01 — Optical Telemetry & Swiss Monospace Ratio", camera: "Real-time Vector UI Render Engine OLED 8K", dimension: "7680 x 2160" }
      ],
      credits: [{ role: "Digital Creative Director", name: "Kaelen Vane" }],
      awards: ["UX Design Awards Gold 2026"]
    },
    {
      id: "tactile-void",
      slug: "tactile-void",
      title: "Tactile Void",
      subtitle: "Flagship Retail Architecture & Spatial Identity",
      client: "Aesop Skin Care",
      year: 2024,
      location: "Kyoto / Paris",
      discipline: "Art Direction",
      disciplines: ["Art Direction", "Branding"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#A67B5B",
      summary: "A spatial concept built with rammed earth from Kyoto riverbeds, hand-hammered raw copper basins, and subterranean acoustic isolation.",
      description: "Designed for Aesop's flagship sanctuary in Gion, Kyoto, Tactile Void explores sensory reduction.",
      concept: "The identity manifests entirely through scent dispersion, thermal gradients between stone surfaces, and acoustic resonance.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1800&auto=format&fit=crop", caption: "Space 01 — Monolithic Granite Basin & Charred Cedar Corridor", camera: "Hasselblad H6D-100c · 28mm", dimension: "100 MP" }
      ],
      credits: [{ role: "Spatial Art Direction", name: "Kaelen Vane" }],
      awards: ["Architectural Digest Great Design Award"]
    },
    {
      id: "aura-archive",
      slug: "aura-archive",
      title: "Aura Archive",
      subtitle: "Exhibition Monograph & Curatorial Catalogue",
      client: "Museum of Contemporary Art Tokyo",
      year: 2025,
      location: "Tokyo",
      discipline: "Editorial",
      disciplines: ["Editorial", "Branding", "Art Direction"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#8E7D6B",
      summary: "Curatorial catalogue documenting 30 years of Japanese light installations, featuring translucent vellum inserts.",
      description: "Aura Archive is a 520-page comprehensive curatorial volume for the landmark retrospective on ephemeral art in post-war Japan.",
      concept: "Edges are gilded with reflective mirror foil, causing the closed book to disappear into its surrounding environment.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1800&auto=format&fit=crop", caption: "Catalogue Object — Mirror Gilded Edge & Vellum Overlay", camera: "Leica SL2 · Macro 60mm", dimension: "47 MP" }
      ],
      credits: [{ role: "Editorial Design", name: "Studio Frame & Form" }],
      awards: ["Tokyo TDC Annual Book Award"]
    },
    {
      id: "solaris-redux",
      slug: "solaris-redux",
      title: "Solaris Redux",
      subtitle: "Experimental Short Film & Sound Architecture",
      client: "Venice Biennale of Architecture",
      year: 2023,
      location: "Venice / Atacama",
      discipline: "Film",
      disciplines: ["Film", "Photography"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#D35400",
      summary: "A 20-minute speculative cinema piece on extreme solar radiation and post-oceanic habitats.",
      description: "Selected for the official pavilion of the Venice Biennale, Solaris Redux combines 70mm large format cinematography with sub-bass infrasound transducers.",
      concept: "We explored how architectural cinema can evoke physical thermal sensations.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1800&auto=format&fit=crop", caption: "Still 01 — 70mm Solar Flare & Salt Flat Horizon", camera: "IMAX MSM 9802 65mm 15-perf", dimension: "12K Cine Scan" }
      ],
      credits: [{ role: "Director", name: "Kaelen Vane" }],
      awards: ["Venice Biennale Special Mention"]
    },
    {
      id: "echoes-of-brutalism",
      slug: "echoes-of-brutalism",
      title: "Echoes of Brutalism",
      subtitle: "Architectural Identity & Wayfinding System",
      client: "Barbican Centre London",
      year: 2024,
      location: "London, UK",
      discipline: "Branding",
      disciplines: ["Branding", "Editorial", "Art Direction"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#708090",
      summary: "A modular wayfinding and spatial typography system cast in bush-hammered terrazzo and acid-etched raw bronze.",
      description: "Commissioned as part of the Barbican Renewal initiative, Echoes of Brutalism provides a renewed visual navigation hierarchy.",
      concept: "Every directional marker is directly cast into modular concrete aggregate bricks or precision-milled bronze plates.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1800&auto=format&fit=crop", caption: "Wayfinding Marker — Terrazzo Brick & Bronze Lettering", camera: "Leica M11-P · 50mm", dimension: "60 MP" }
      ],
      credits: [{ role: "Spatial Graphic Design", name: "Studio Frame & Form" }],
      awards: ["SEGD Global Design Award of Honor"]
    },
    {
      id: "hyper-flora",
      slug: "hyper-flora",
      title: "Hyper-Flora",
      subtitle: "Interactive Digital Herbarium & Web Experience",
      client: "Kew Royal Botanic Gardens / Google Arts",
      year: 2026,
      location: "London / Tokyo",
      discipline: "Digital",
      disciplines: ["Digital", "Photography"],
      featured: false,
      coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2400&auto=format&fit=crop",
      accentColor: "#2E8B57",
      summary: "An ultra-high-resolution 3D digital herbarium allowing users to deconstruct rare and extinct specimens in multi-spectral light layers.",
      description: "Hyper-Flora digitizes 5,000 botanical specimens utilizing photogrammetry and interactive volumetric CT shaders.",
      concept: "Custom audio synthesis generates responsive bio-acoustic feedback as visitors interact with virtual plant structures.",
      gallery: [
        { url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800&auto=format&fit=crop", caption: "Specimen 0042 — Interactive 3D Photogrammetry & Spectral Shader", camera: "WebGL Volumetric 3D Engine", dimension: "Real-time 4K" }
      ],
      credits: [{ role: "Interactive Creative Director", name: "Kaelen Vane" }],
      awards: ["FWA of the Month", "Webby Award Winner"]
    }
  ];

  const ARCHIVE = [
    { id: "A-2026-01", year: 2026, title: "Neo-Monolith", client: "Vitra Architecture Institute", discipline: "Art Direction", location: "Basel / Tokyo", medium: "Hardcover Monograph, Spatial Installation", slug: "neo-monolith" },
    { id: "A-2026-02", year: 2026, title: "Metric Dissolve", client: "Polestar Electric Vehicles", discipline: "Digital", location: "Gothenburg / Tokyo", medium: "In-Car Telemetry UI & Generative System", slug: "metric-dissolve" },
    { id: "A-2026-03", year: 2026, title: "Hyper-Flora", client: "Kew Gardens / Google Arts", discipline: "Digital", location: "London / Tokyo", medium: "WebGL Volumetric 3D Herbarium", slug: "hyper-flora" },
    { id: "A-2025-01", year: 2025, title: "Chroma Vestige", client: "Bottega Veneta", discipline: "Photography", location: "Milan / Paris", medium: "Global Campaign & 16mm Art Film", slug: "chroma-vestige" },
    { id: "A-2025-02", year: 2025, title: "Silent Frequencies", client: "Bang & Olufsen", discipline: "Branding", location: "Copenhagen / Zurich", medium: "Identity System & Sound Lab", slug: "silent-frequencies" },
    { id: "A-2025-03", year: 2025, title: "Synthetic Botany", client: "Nat. Museum of Nature & Science", discipline: "Photography", location: "Reykjavík / Tokyo", medium: "Large Format Macrochromes", slug: "synthetic-botany" },
    { id: "A-2025-04", year: 2025, title: "Aura Archive", client: "Museum of Contemporary Art Tokyo", discipline: "Editorial", location: "Tokyo", medium: "520p Curatorial Monograph", slug: "aura-archive" },
    { id: "A-2024-01", year: 2024, title: "Terra Incognita", client: "Acne Paper / Rizzoli", discipline: "Editorial", location: "Iceland / Atacama", medium: "400p Clothbound Book", slug: "terra-incognita" },
    { id: "A-2024-02", year: 2024, title: "Kinetic Shadows", client: "NOWNESS / Biennale Danse", discipline: "Film", location: "Lyon / Berlin", medium: "35mm Spatial Cinema", slug: "kinetic-shadows" },
    { id: "A-2024-03", year: 2024, title: "Tactile Void", client: "Aesop Skin Care", discipline: "Art Direction", location: "Kyoto / Paris", medium: "Spatial Flagship Interior & Identity", slug: "tactile-void" },
    { id: "A-2024-04", year: 2024, title: "Echoes of Brutalism", client: "Barbican Centre London", discipline: "Branding", location: "London, UK", medium: "Bronze Wayfinding & Visual Identity", slug: "echoes-of-brutalism" },
    { id: "A-2023-01", year: 2023, title: "Solaris Redux", client: "Venice Biennale of Architecture", discipline: "Film", location: "Venice / Atacama", medium: "70mm Multi-Sensory Pavilion", slug: "solaris-redux" }
  ];

  const CLIENTS = [
    { name: "Acne Studios", category: "Fashion & Culture", location: "Stockholm" },
    { name: "Bottega Veneta", category: "Luxury & Leather", location: "Milan" },
    { name: "Vitra", category: "Architecture & Furniture", location: "Weil am Rhein" },
    { name: "Bang & Olufsen", category: "Acoustic Engineering", location: "Struer" },
    { name: "Aesop", category: "Spatial & Body Care", location: "Melbourne" },
    { name: "Polestar", category: "Electric Performance", location: "Gothenburg" },
    { name: "Barbican Centre", category: "Cultural Institution", location: "London" },
    { name: "Museum of Contemporary Art Tokyo", category: "Art & Curation", location: "Tokyo" },
    { name: "Rimowa", category: "Mobility & Aluminum", location: "Cologne" },
    { name: "NOWNESS", category: "Global Video & Culture", location: "London / Paris" },
    { name: "Rizzoli International", category: "Publishing", location: "New York" },
    { name: "Sony Music", category: "Sound & Recorded Arts", location: "Tokyo" }
  ];

  const EXHIBITIONS = [
    { year: "2026", title: "Tension & Monolith", venue: "Vitra Design Museum", location: "Weil am Rhein, Germany" },
    { year: "2025", title: "Aura: 30 Years of Ephemeral Light", venue: "Museum of Contemporary Art Tokyo", location: "Tokyo, Japan" },
    { year: "2024", title: "Biennale Architettura 2024 (Pavilion of Solaris)", venue: "Arsenale di Venezia", location: "Venice, Italy" },
    { year: "2023", title: "Silent Surfaces & Geological Scars", venue: "Kunsthaus Zürich", location: "Zurich, Switzerland" },
    { year: "2022", title: "Raw Aggregates & Kinetic Type", venue: "Barbican Curve Gallery", location: "London, UK" },
    { year: "2021", title: "The Cryogenic Garden", venue: "Harpa Concert & Art Center", location: "Reykjavík, Iceland" }
  ];

  const CRITICAL_RECEPTION = [
    {
      quote: "Kaelen Vane treats spatial volume and typography not as commercial decoration, but as tectonic mass. The results are visceral, uncompromising, and sublime.",
      author: "Elena Rostova",
      title: "Senior Curator, Vitra Architecture Institute"
    },
    {
      quote: "Frame & Form achieved what conventional fashion campaigns cannot: capturing the raw physical velocity and sculptural permanence of contemporary couture.",
      author: "Marc-Antoine Laurent",
      title: "Creative Director, Bottega Veneta Special Projects"
    },
    {
      quote: "In an age of endless digital noise, Frame & Form constructs an architectural silence that commands total focus.",
      author: "Dr. Hiroshi Moriyama",
      title: "Professor of Spatial Typography, University of Tokyo"
    }
  ];

  const MANIFESTO_PARAGRAPHS = [
    { num: "01", heading: "The Brutalism of Reduction", body: "We construct visual worlds through uncompromising reduction. A frame is not a decorative container; it is an architectural incision into chaotic space. When unnecessary ornamentation is eliminated, what remains is the raw materiality of form, light, and geometry." },
    { num: "02", heading: "Materiality in the Digital Vacuum", body: "Digital experiences must carry the physical weight of cast concrete and the tactile resistance of unbleached cotton paper. We engineer interfaces with mathematical precision, spatial depth, and tactile audio feedback." },
    { num: "03", heading: "Typography as Structural Mass", body: "Letterforms are architectural columns. We treat typography not merely as legible text, but as monumental mass that dictates visual rhythm, ocular pacing, and emotional gravity." },
    { num: "04", heading: "Light as Ephemeral Geometry", body: "Photography is the documentation of time colliding with mineral matter. Whether directing high-fashion campaigns in Paris or geological expeditions across volcanic fault lines, we seek out moments where light sculpts space." }
  ];

  /* =============================================================
     2. PROCEDURAL AUDIO SYNTHESIZER
     ============================================================= */
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.isEnabled = false;
      try {
        if (typeof localStorage !== 'undefined') {
          this.isEnabled = localStorage.getItem('ff_sound_enabled') === 'true';
        }
      } catch (e) {}
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.isEnabled = !this.isEnabled;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ff_sound_enabled', this.isEnabled);
        }
      } catch (e) {}
      if (this.isEnabled) {
        this.initContext();
        this.playSuccess();
      }
      return this.isEnabled;
    }

    playClick() {
      if (!this.isEnabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playHover() {
      if (!this.isEnabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {}
    }

    playTransition() {
      if (!this.isEnabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.18);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.isEnabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        [523.25, 659.25, 783.99].forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.05);
          gain.gain.setValueAtTime(0.05, this.ctx.currentTime + index * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.05 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + index * 0.05);
          osc.stop(this.ctx.currentTime + index * 0.05 + 0.35);
        });
      } catch (e) {}
    }
  }

  const sound = new AudioEngine();

  /* =============================================================
     3. CUSTOM PHYSICS CURSOR
     ============================================================= */
  class CustomCursor {
    constructor() {
      this.dot = document.querySelector('.cursor-dot');
      this.follower = document.querySelector('.cursor-follower');
      this.label = document.querySelector('.cursor-label');
      this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.lerpFactor = 0.16;
      this.isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

      if (!this.isTouch && this.dot && this.follower) {
        this.init();
      }
    }

    init() {
      window.addEventListener('mousemove', (e) => {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
        if (this.dot) {
          this.dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      });

      window.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
      window.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

      document.addEventListener('mouseleave', () => {
        if (this.dot) this.dot.style.opacity = '0';
        if (this.follower) this.follower.style.opacity = '0';
      });

      document.addEventListener('mouseenter', () => {
        if (this.dot) this.dot.style.opacity = '1';
        if (this.follower) this.follower.style.opacity = '1';
      });

      this.bindHoverElements();
      this.render();
    }

    bindHoverElements() {
      document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-cursor], a, button, input, textarea, .clickable');
        if (!target) {
          this.resetState();
          return;
        }
        const cursorType = target.getAttribute('data-cursor');
        const customLabel = target.getAttribute('data-cursor-label');
        if (cursorType) {
          this.setState(cursorType, customLabel || cursorType.toUpperCase());
        } else {
          this.setState('hover', '');
        }
      });

      document.body.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-cursor], a, button, input, textarea, .clickable');
        if (target) this.resetState();
      });
    }

    setState(state, labelText = '') {
      this.resetState();
      document.body.classList.add(`cursor-${state}`);
      if (this.label && labelText) this.label.textContent = labelText;
    }

    resetState() {
      const states = ['cursor-hover', 'cursor-view', 'cursor-drag', 'cursor-zoom', 'cursor-expand', 'cursor-next', 'cursor-prev', 'cursor-close', 'cursor-saved'];
      states.forEach(s => document.body.classList.remove(s));
      if (this.label) this.label.textContent = '';
    }

    render() {
      this.pos.x += (this.target.x - this.pos.x) * this.lerpFactor;
      this.pos.y += (this.target.y - this.pos.y) * this.lerpFactor;
      if (this.follower) {
        this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(() => this.render());
    }

    refresh() {
      this.resetState();
    }
  }

  /* =============================================================
     4. EFFECTS & SCROLL REVEALS & WORLD CLOCKS
     ============================================================= */
  class EffectsController {
    constructor() {
      this.observer = null;
      this.floatingPreview = document.querySelector('.floating-preview');
      this.previewImg = this.floatingPreview ? this.floatingPreview.querySelector('img') : null;
      this.clocks = [
        { id: 'tyo-time', tz: 'Asia/Tokyo' },
        { id: 'zrh-time', tz: 'Europe/Zurich' },
        { id: 'cdg-time', tz: 'Europe/Paris' },
        { id: 'nyc-time', tz: 'America/New_York' }
      ];

      this.initObserver();
      this.initWorldClocks();
      this.initFloatingPreview();
      this.initHorizontalDrag();
    }

    initObserver() {
      // Direct reveal for elements immediately in viewport
      this.revealInViewport();
      window.addEventListener('scroll', () => this.revealInViewport(), { passive: true });
    }

    revealInViewport() {
      const els = document.querySelectorAll('.reveal-init:not(.reveal-in-view)');
      const windowHeight = window.innerHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.92 && rect.bottom >= 0) {
          el.classList.add('reveal-in-view');
        }
      });
    }

    refreshReveals() {
      // Force trigger reveal on next frame
      setTimeout(() => this.revealInViewport(), 50);
    }

    initWorldClocks() {
      const updateTimes = () => {
        const now = new Date();
        this.clocks.forEach(clock => {
          const el = document.getElementById(clock.id);
          if (el) {
            try {
              const timeStr = now.toLocaleTimeString('en-GB', {
                timeZone: clock.tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });
              el.textContent = timeStr;
            } catch (e) {
              el.textContent = '--:--:--';
            }
          }
        });
      };
      updateTimes();
      setInterval(updateTimes, 1000);
    }

    initFloatingPreview() {
      if (!this.floatingPreview) return;
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;

      window.addEventListener('mousemove', (e) => {
        targetX = e.clientX + 20;
        targetY = e.clientY + 20;
      });

      const animatePreview = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        if (this.floatingPreview.classList.contains('visible')) {
          this.floatingPreview.style.left = `${currentX}px`;
          this.floatingPreview.style.top = `${currentY}px`;
        }
        requestAnimationFrame(animatePreview);
      };
      animatePreview();

      document.body.addEventListener('mouseover', (e) => {
        const row = e.target.closest('[data-preview-img]');
        if (row && this.previewImg && this.floatingPreview) {
          const src = row.getAttribute('data-preview-img');
          if (src) {
            this.previewImg.src = src;
            this.floatingPreview.classList.add('visible');
          }
        }
      });

      document.body.addEventListener('mouseout', (e) => {
        const row = e.target.closest('[data-preview-img]');
        if (row && this.floatingPreview) {
          this.floatingPreview.classList.remove('visible');
        }
      });
    }

    initHorizontalDrag() {
      document.body.addEventListener('wheel', (e) => {
        const reel = e.target.closest('.reel-container');
        if (reel && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          reel.scrollLeft += e.deltaY * 1.5;
        }
      }, { passive: false });

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      document.body.addEventListener('mousedown', (e) => {
        const reel = e.target.closest('.reel-container');
        if (!reel) return;
        isDown = true;
        startX = e.pageX - reel.offsetLeft;
        scrollLeft = reel.scrollLeft;
      });

      window.addEventListener('mouseup', () => { isDown = false; });

      document.body.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const reel = e.target.closest('.reel-container');
        if (!reel) return;
        e.preventDefault();
        const x = e.pageX - reel.offsetLeft;
        const walk = (x - startX) * 1.8;
        reel.scrollLeft = scrollLeft - walk;
      });
    }
  }

  /* =============================================================
     5. LIGHTBOX GALLERY
     ============================================================= */
  class GalleryLightbox {
    constructor() {
      this.overlay = document.querySelector('.lightbox-overlay');
      this.stage = document.querySelector('.lightbox-main-stage');
      this.imgWrapper = document.querySelector('.lightbox-img-wrapper');
      this.mainImg = document.querySelector('.lightbox-main-img');
      this.captionEl = document.querySelector('.lightbox-caption');
      this.cameraMetaEl = document.querySelector('.lightbox-camera-meta');
      this.counterEl = document.querySelector('.lightbox-counter');
      this.thumbsContainer = document.querySelector('.lightbox-thumbnails');
      this.closeBtn = document.querySelector('.lightbox-close-btn');
      this.fullscreenBtn = document.querySelector('.lightbox-fullscreen-btn');
      this.zoomBtn = document.querySelector('.lightbox-zoom-btn');
      this.prevBtn = document.querySelector('.lightbox-nav-arrow.prev');
      this.nextBtn = document.querySelector('.lightbox-nav-arrow.next');

      this.images = [];
      this.currentIndex = 0;
      this.isOpen = false;
      this.isZoomed = false;
      this.zoomLevel = 1;
      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.panPos = { x: 0, y: 0 };

      this.bindEvents();
    }

    bindEvents() {
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
      if (this.fullscreenBtn) this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
      if (this.zoomBtn) this.zoomBtn.addEventListener('click', () => this.toggleZoom());

      window.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        switch (e.key) {
          case 'Escape': this.close(); break;
          case 'ArrowLeft': this.prev(); break;
          case 'ArrowRight': this.next(); break;
          case 'f': case 'F': this.toggleFullscreen(); break;
          case 'z': case 'Z': this.toggleZoom(); break;
        }
      });

      if (this.imgWrapper) {
        this.imgWrapper.addEventListener('click', () => {
          if (!this.isDragging) this.toggleZoom();
        });

        this.imgWrapper.addEventListener('mousedown', (e) => {
          if (!this.isZoomed) return;
          this.isDragging = true;
          this.dragStart.x = e.clientX - this.panPos.x;
          this.dragStart.y = e.clientY - this.panPos.y;
        });

        window.addEventListener('mousemove', (e) => {
          if (!this.isDragging || !this.isZoomed) return;
          this.panPos.x = e.clientX - this.dragStart.x;
          this.panPos.y = e.clientY - this.dragStart.y;
          this.updateTransform();
        });

        window.addEventListener('mouseup', () => { this.isDragging = false; });
      }
    }

    open(images, startIndex = 0) {
      this.images = images || [];
      this.currentIndex = startIndex;
      this.isOpen = true;
      this.resetZoom();
      if (this.overlay) this.overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.renderCurrent();
      this.renderThumbnails();
      sound.playTransition();
    }

    close() {
      this.isOpen = false;
      this.resetZoom();
      if (this.overlay) this.overlay.classList.remove('open');
      document.body.style.overflow = '';
      sound.playClick();
    }

    next() {
      if (!this.images.length) return;
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.resetZoom();
      this.renderCurrent();
      sound.playHover();
    }

    prev() {
      if (!this.images.length) return;
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.resetZoom();
      this.renderCurrent();
      sound.playHover();
    }

    goTo(index) {
      if (index >= 0 && index < this.images.length) {
        this.currentIndex = index;
        this.resetZoom();
        this.renderCurrent();
        sound.playHover();
      }
    }

    renderCurrent() {
      const item = this.images[this.currentIndex];
      if (!item) return;
      if (this.mainImg) {
        this.mainImg.src = item.url;
        this.mainImg.alt = item.caption || 'Project Specimen';
      }
      if (this.captionEl) this.captionEl.textContent = item.caption || `Image ${this.currentIndex + 1}`;
      if (this.cameraMetaEl) this.cameraMetaEl.textContent = item.camera ? `${item.camera} · ${item.dimension || ''}` : 'Medium Format Capture';
      if (this.counterEl) this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.images.length).padStart(2, '0')}`;

      if (this.thumbsContainer) {
        const thumbs = this.thumbsContainer.querySelectorAll('.lightbox-thumb');
        thumbs.forEach((t, i) => t.classList.toggle('active', i === this.currentIndex));
      }
    }

    renderThumbnails() {
      if (!this.thumbsContainer) return;
      this.thumbsContainer.innerHTML = '';
      this.images.forEach((item, index) => {
        const thumb = document.createElement('img');
        thumb.className = `lightbox-thumb clickable ${index === this.currentIndex ? 'active' : ''}`;
        thumb.src = item.url;
        thumb.alt = item.caption || `Thumbnail ${index + 1}`;
        thumb.addEventListener('click', () => this.goTo(index));
        this.thumbsContainer.appendChild(thumb);
      });
    }

    toggleZoom() {
      if (this.isZoomed) {
        this.resetZoom();
      } else {
        this.isZoomed = true;
        this.zoomLevel = 2.2;
        this.updateTransform();
      }
      sound.playClick();
    }

    resetZoom() {
      this.isZoomed = false;
      this.zoomLevel = 1;
      this.panPos = { x: 0, y: 0 };
      this.updateTransform();
    }

    updateTransform() {
      if (!this.imgWrapper) return;
      this.imgWrapper.style.transform = `translate3d(${this.panPos.x}px, ${this.panPos.y}px, 0) scale(${this.zoomLevel})`;
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      sound.playClick();
    }
  }

  /* =============================================================
     6. SPA ROUTER & VIEW ENGINE
     ============================================================= */
  class AppRouter {
    constructor(app) {
      this.app = app;
      this.container = document.getElementById('view-container');
      this.curtain = document.querySelector('.page-transition-curtain');
      this.workState = { filter: 'all', mode: 'grid', searchQuery: '' };

      window.addEventListener('hashchange', () => this.handleRoute());
      window.addEventListener('popstate', () => this.handleRoute());
    }

    init() {
      this.handleRoute(true);
    }

    parseHash() {
      const hash = window.location.hash.slice(1) || 'home';
      const [path, queryString] = hash.split('?');
      const params = {};
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        for (const [k, v] of urlParams.entries()) params[k] = v;
      }
      return { path, params };
    }

    navigate(hashString) {
      window.location.hash = hashString;
    }

    async handleRoute(isInitial = false) {
      const { path, params } = this.parseHash();
      this.updateNavLinks(path);

      if (!isInitial) sound.playTransition();

      const renderView = () => {
        window.scrollTo(0, 0);
        switch (path) {
          case 'home': this.renderHome(); break;
          case 'work': this.renderWork(); break;
          case 'project': this.renderProject(params.id || 'neo-monolith'); break;
          case 'about': this.renderAbout(); break;
          case 'archive': this.renderArchive(); break;
          case 'contact': this.renderContact(); break;
          default: this.renderHome();
        }
        this.app.afterRender();
      };

      if (isInitial) {
        renderView();
      } else {
        await this.animatePageTransition(renderView);
      }
    }

    updateNavLinks(activePath) {
      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const linkPath = href.replace('#', '').split('?')[0];
        const isActive = linkPath === activePath;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      const navMenu = document.querySelector('.nav-menu');
      const mobileBtn = document.getElementById('mobile-toggle-btn');
      if (navMenu) navMenu.classList.remove('open');
      if (mobileBtn) {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    }

    async animatePageTransition(renderCallback) {
      if (!this.curtain) {
        renderCallback();
        return;
      }
      this.curtain.classList.remove('animating-out');
      this.curtain.classList.add('animating-in');
      await new Promise(r => setTimeout(r, 300));
      renderCallback();
      await new Promise(r => setTimeout(r, 40));
      this.curtain.classList.remove('animating-in');
      this.curtain.classList.add('animating-out');
      setTimeout(() => {
        this.curtain.classList.remove('animating-out');
      }, 450);
    }

    renderHome() {
      const featuredProjects = PROJECTS.filter(p => p.featured);
      this.container.innerHTML = `
        <div class="view-home">
          <section class="site-container hero-editorial">
            <div class="hero-meta-bar reveal-init delay-100">
              <div>
                <span>STUDIO FRAME &amp; FORM</span>
                <span style="margin: 0 0.5rem; opacity: 0.3;">/</span>
                <span>2026 ARCHIVE</span>
              </div>
              <div class="hero-clocks">
                <div class="clock-item"><span class="clock-code">TYO</span> <span id="tyo-time">--:--:--</span></div>
                <div class="clock-item"><span class="clock-code">ZRH</span> <span id="zrh-time">--:--:--</span></div>
                <div class="clock-item"><span class="clock-code">CDG</span> <span id="cdg-time">--:--:--</span></div>
                <div class="clock-item"><span class="clock-code">NYC</span> <span id="nyc-time">--:--:--</span></div>
              </div>
            </div>

            <div class="hero-title-wrap">
              <span class="hero-super-title reveal-init delay-200">Creative Direction · Spatial Photography · Brand Architecture</span>
              <h1 class="hero-headline reveal-init delay-300">
                FRAME <span class="italic-serif">&amp;</span> FORM
              </h1>
            </div>

            <div class="hero-footer-bar reveal-init delay-400">
              <p class="hero-statement">
                An international design practice operating at the threshold between rigid structural containment and organic visual expression.
              </p>
              <div>
                <span class="font-mono text-muted uppercase" style="font-size:0.7rem; display:block; margin-bottom:0.25rem;">AVAILABILITY STATUS</span>
                <span style="color:var(--text-primary);">Accepting Select Commissions Q3/Q4 2026</span>
              </div>
              <div style="display:flex; justify-content:flex-end;">
                <a href="#work" class="hud-btn clickable" data-cursor="explore">
                  <span>Explore Works (12)</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </section>

          <div class="marquee-wrapper">
            <div class="marquee-track">
              <div class="marquee-item"><span>ART DIRECTION</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>MEDIUM FORMAT PHOTOGRAPHY</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>SPATIAL BRANDING</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>EDITORIAL MONOGRAPHS</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>35MM CINEMATOGRAPHY</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>GENERATIVE DIGITAL SYSTEMS</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>TOKYO</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>ZURICH</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>PARIS</span><span class="marquee-bullet">◆</span></div>
              <div class="marquee-item"><span>NEW YORK</span><span class="marquee-bullet">◆</span></div>
            </div>
          </div>

          <section class="reel-section">
            <div class="reel-header">
              <div>
                <div class="section-label reveal-init">FLAGSHIP SELECTION</div>
                <h2 class="section-heading reveal-init delay-100">Featured Curations</h2>
              </div>
              <div class="font-mono text-muted reveal-init" style="font-size:0.75rem;">
                <span>← SCROLL OR DRAG →</span>
              </div>
            </div>

            <div class="reel-container clickable" data-cursor="drag" data-cursor-label="DRAG">
              ${featuredProjects.map((p, idx) => `
                <a href="#project?id=${p.slug}" class="reel-card clickable" data-cursor="view" data-cursor-label="VIEW">
                  <div class="reel-media-wrap">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                    <div class="reel-meta-overlay">
                      <span class="meta-pill">${p.discipline}</span>
                      <span class="meta-pill">${p.year}</span>
                    </div>
                  </div>
                  <div class="reel-info">
                    <div>
                      <h3 class="reel-title">${p.title}</h3>
                      <p class="reel-client">${p.client} — ${p.location}</p>
                    </div>
                    <span class="reel-year">0${idx + 1}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </section>

          <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline);">
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 3.5rem;">
              <div>
                <div class="section-label reveal-init">DISCIPLINE MATRIX</div>
                <h2 class="section-heading reveal-init delay-100">Core Practices</h2>
              </div>
              <a href="#about" class="font-mono text-muted uppercase clickable hover-underline" style="font-size:0.75rem;">
                Studio Philosophy →
              </a>
            </div>

            <div class="editorial-grid" style="padding:0;">
              <div class="project-card-asym col-span-7 reveal-init">
                <a href="#project?id=neo-monolith" class="card-media-box aspect-landscape clickable" data-cursor="view">
                  <img src="${PROJECTS[0].coverImage}" alt="${PROJECTS[0].title}" />
                </a>
                <div class="card-info-block">
                  <div class="card-meta-line">
                    <span>01 / ART DIRECTION</span>
                    <span>VITRA INSTITUTE</span>
                  </div>
                  <h3 class="card-project-title"><a href="#project?id=neo-monolith">NEO-MONOLITH</a></h3>
                  <p class="card-description-snippet">${PROJECTS[0].summary}</p>
                </div>
              </div>

              <div class="project-card-asym col-span-5 reveal-init delay-200">
                <a href="#project?id=chroma-vestige" class="card-media-box aspect-portrait clickable" data-cursor="view">
                  <img src="${PROJECTS[1].coverImage}" alt="${PROJECTS[1].title}" />
                </a>
                <div class="card-info-block">
                  <div class="card-meta-line">
                    <span>02 / PHOTOGRAPHY</span>
                    <span>BOTTEGA VENETA</span>
                  </div>
                  <h3 class="card-project-title"><a href="#project?id=chroma-vestige">CHROMA VESTIGE</a></h3>
                  <p class="card-description-snippet">${PROJECTS[1].summary}</p>
                </div>
              </div>

              <div class="project-card-asym col-span-5 offset-left-1 reveal-init">
                <a href="#project?id=silent-frequencies" class="card-media-box aspect-square clickable" data-cursor="view">
                  <img src="${PROJECTS[2].coverImage}" alt="${PROJECTS[2].title}" />
                </a>
                <div class="card-info-block">
                  <div class="card-meta-line">
                    <span>03 / BRANDING</span>
                    <span>BANG &amp; OLUFSEN</span>
                  </div>
                  <h3 class="card-project-title"><a href="#project?id=silent-frequencies">SILENT FREQUENCIES</a></h3>
                  <p class="card-description-snippet">${PROJECTS[2].summary}</p>
                </div>
              </div>

              <div class="project-card-asym col-span-7 offset-right-1 reveal-init delay-200">
                <a href="#project?id=metric-dissolve" class="card-media-box aspect-landscape clickable" data-cursor="view">
                  <img src="${PROJECTS[6].coverImage}" alt="${PROJECTS[6].title}" />
                </a>
                <div class="card-info-block">
                  <div class="card-meta-line">
                    <span>04 / DIGITAL</span>
                    <span>POLESTAR</span>
                  </div>
                  <h3 class="card-project-title"><a href="#project?id=metric-dissolve">METRIC DISSOLVE</a></h3>
                  <p class="card-description-snippet">${PROJECTS[6].summary}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline); background: var(--bg-secondary);">
            <div style="max-width: 900px; margin: 0 auto; text-align: center;">
              <span class="font-mono text-muted uppercase tracking-widest reveal-init" style="font-size:0.75rem; display:block; margin-bottom:1.5rem;">
                MANIFESTO / STATEMENT 01
              </span>
              <blockquote class="font-serif italic reveal-init delay-100" style="font-size: clamp(1.8rem, 3.5vw, 3.2rem); line-height: 1.25; color: var(--text-primary); margin-bottom: 2.5rem;">
                “A frame is not a decorative container; it is an architectural incision into chaotic space.”
              </blockquote>
              <div class="reveal-init delay-200" style="display:flex; justify-content:center; gap:1.5rem;">
                <a href="#contact" class="submit-btn-cta clickable" style="padding: 1rem 2.5rem;" data-cursor="contact">
                  Initiate Project Commission →
                </a>
              </div>
            </div>
          </section>
        </div>
      `;
    }

    renderWork() {
      const filter = this.workState.filter;
      const mode = this.workState.mode;
      const search = this.workState.searchQuery.toLowerCase().trim();

      let filtered = PROJECTS.filter(p => {
        const matchesDiscipline = filter === 'all' 
          || (filter === 'saved' && this.app.isBookmarked(p.id))
          || p.disciplines.some(d => d.toLowerCase().replace(/\s+/g, '-') === filter)
          || p.discipline.toLowerCase().replace(/\s+/g, '-') === filter;

        const matchesSearch = !search
          || p.title.toLowerCase().includes(search)
          || p.client.toLowerCase().includes(search)
          || p.discipline.toLowerCase().includes(search)
          || p.location.toLowerCase().includes(search)
          || p.year.toString().includes(search);

        return matchesDiscipline && matchesSearch;
      });

      const savedCount = this.app.getBookmarks().length;

      this.container.innerHTML = `
        <div class="view-work">
          <div class="work-controls-bar">
            <div class="filter-pills">
              ${DISCIPLINES.map(d => `
                <button class="filter-btn clickable ${filter === d.id ? 'active' : ''}" data-filter="${d.id}">
                  ${d.label}
                  <span class="filter-count">(${d.id === 'all' ? PROJECTS.length : d.count})</span>
                </button>
              `).join('')}
              <button class="filter-btn clickable ${filter === 'saved' ? 'active' : ''}" data-filter="saved">
                Saved <span class="filter-count">(${savedCount})</span>
              </button>
            </div>

            <div class="view-actions">
              <div class="search-input-wrap">
                <span class="search-icon">⚲</span>
                <input type="text" class="search-input" id="work-search" placeholder="Search archive..." value="${this.workState.searchQuery}" />
              </div>

              <div class="view-mode-toggle">
                <button class="view-mode-btn clickable ${mode === 'grid' ? 'active' : ''}" data-mode="grid" title="Editorial Grid">GRID</button>
                <button class="view-mode-btn clickable ${mode === 'index' ? 'active' : ''}" data-mode="index" title="List Index">INDEX</button>
                <button class="view-mode-btn clickable ${mode === 'reel' ? 'active' : ''}" data-mode="reel" title="Horizontal Reel">REEL</button>
              </div>
            </div>
          </div>

          ${filtered.length === 0 ? `
            <div class="site-container" style="text-align:center; padding: 10rem 0;">
              <p class="font-mono text-muted uppercase">No projects match the current filter criteria.</p>
              <button class="hud-btn clickable" style="margin-top: 1.5rem;" id="reset-filter-btn">Reset All Filters</button>
            </div>
          ` : mode === 'grid' ? `
            <div class="editorial-grid">
              ${filtered.map((p, idx) => {
                const colSpans = ['col-span-7', 'col-span-5', 'col-span-12', 'col-span-6', 'col-span-6', 'col-span-4', 'col-span-8'];
                const aspectRatios = ['aspect-landscape', 'aspect-portrait', 'aspect-wide', 'aspect-square', 'aspect-landscape', 'aspect-portrait'];
                const spanClass = colSpans[idx % colSpans.length];
                const aspectClass = aspectRatios[idx % aspectRatios.length];
                const isSaved = this.app.isBookmarked(p.id);

                return `
                  <article class="project-card-asym ${spanClass} reveal-init">
                    <div class="card-top-actions">
                      <button class="bookmark-icon-btn clickable ${isSaved ? 'saved' : ''}" data-bookmark-id="${p.id}" title="${isSaved ? 'Saved to Moodboard' : 'Save to Moodboard'}">
                        ${isSaved ? '★' : '☆'}
                      </button>
                    </div>
                    <a href="#project?id=${p.slug}" class="card-media-box ${aspectClass} clickable" data-cursor="view" data-cursor-label="VIEW">
                      <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                    </a>
                    <div class="card-info-block">
                      <div class="card-meta-line">
                        <span>${String(idx + 1).padStart(2, '0')} / ${p.discipline}</span>
                        <span>${p.client} · ${p.year}</span>
                      </div>
                      <h2 class="card-project-title">
                        <a href="#project?id=${p.slug}" class="clickable">${p.title}</a>
                      </h2>
                      <p class="card-description-snippet">${p.summary}</p>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          ` : mode === 'index' ? `
            <div class="index-list-view">
              <table class="index-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Project Title</th>
                    <th>Client</th>
                    <th>Discipline</th>
                    <th>Location</th>
                    <th>Year</th>
                    <th style="text-align:right;">Save</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.map((p, idx) => {
                    const isSaved = this.app.isBookmarked(p.id);
                    return `
                      <tr class="index-row clickable" data-preview-img="${p.coverImage}" data-cursor="view" data-href="#project?id=${p.slug}">
                        <td>0${idx + 1}</td>
                        <td><a href="#project?id=${p.slug}" class="index-row-title">${p.title}</a></td>
                        <td>${p.client}</td>
                        <td><span class="meta-pill">${p.discipline}</span></td>
                        <td>${p.location}</td>
                        <td>${p.year}</td>
                        <td style="text-align:right;" onclick="event.stopPropagation();">
                          <button class="bookmark-icon-btn clickable ${isSaved ? 'saved' : ''}" data-bookmark-id="${p.id}">
                            ${isSaved ? '★' : '☆'}
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="site-container-full" style="padding-top: 3rem; padding-bottom: 6rem;">
              <div class="reel-container clickable" data-cursor="drag" data-cursor-label="DRAG" style="padding-left:0; padding-right:0;">
                ${filtered.map((p, idx) => `
                  <div class="reel-card clickable" style="flex: 0 0 clamp(360px, 45vw, 750px);" data-cursor="view">
                    <a href="#project?id=${p.slug}">
                      <div class="reel-media-wrap" style="aspect-ratio: 16/10;">
                        <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                        <div class="reel-meta-overlay">
                          <span class="meta-pill">${p.discipline}</span>
                          <span class="meta-pill">${p.year}</span>
                        </div>
                      </div>
                    </a>
                    <div class="reel-info">
                      <div>
                        <h3 class="reel-title"><a href="#project?id=${p.slug}">${p.title}</a></h3>
                        <p class="reel-client">${p.client} — ${p.location}</p>
                      </div>
                      <span class="reel-year">0${idx + 1}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </div>
      `;

      this.bindWorkControls();
    }

    bindWorkControls() {
      const filterBtns = this.container.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.workState.filter = btn.getAttribute('data-filter');
          sound.playClick();
          this.renderWork();
          this.app.afterRender();
        });
      });

      const modeBtns = this.container.querySelectorAll('.view-mode-btn');
      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.workState.mode = btn.getAttribute('data-mode');
          sound.playClick();
          this.renderWork();
          this.app.afterRender();
        });
      });

      const searchInput = document.getElementById('work-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.workState.searchQuery = e.target.value;
          this.renderWork();
          this.app.afterRender();
          const newSearch = document.getElementById('work-search');
          if (newSearch) {
            newSearch.focus();
            newSearch.selectionStart = newSearch.selectionEnd = newSearch.value.length;
          }
        });
      }

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.workState.filter = 'all';
          this.workState.searchQuery = '';
          this.renderWork();
          this.app.afterRender();
        });
      }

      const rows = this.container.querySelectorAll('.index-row');
      rows.forEach(row => {
        row.addEventListener('click', (e) => {
          if (!e.target.closest('.bookmark-icon-btn')) {
            const href = row.getAttribute('data-href');
            if (href) this.navigate(href);
          }
        });
      });
    }

    renderProject(projectId) {
      const project = PROJECTS.find(p => p.slug === projectId || p.id === projectId) || PROJECTS[0];
      const currentIndex = PROJECTS.indexOf(project);
      const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
      const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
      const isSaved = this.app.isBookmarked(project.id);

      this.container.innerHTML = `
        <div class="project-deep-dive">
          <header class="project-hero-header">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <a href="#work" class="project-back-link clickable" data-cursor="explore">
                <span>←</span>
                <span>Back to Works Catalog</span>
              </a>
              <button class="hud-btn clickable ${isSaved ? 'active' : ''}" data-bookmark-id="${project.id}">
                <span>${isSaved ? '★ Saved to Moodboard' : '☆ Save Project'}</span>
              </button>
            </div>

            <h1 class="project-main-title reveal-init delay-100">${project.title}</h1>

            <div class="project-meta-grid reveal-init delay-200">
              <div>
                <div class="meta-field-label">CLIENT</div>
                <div class="meta-field-val">${project.client}</div>
              </div>
              <div>
                <div class="meta-field-label">DISCIPLINE</div>
                <div class="meta-field-val">${project.discipline}</div>
              </div>
              <div>
                <div class="meta-field-label">YEAR</div>
                <div class="meta-field-val">${project.year}</div>
              </div>
              <div>
                <div class="meta-field-label">LOCATION</div>
                <div class="meta-field-val">${project.location}</div>
              </div>
            </div>
          </header>

          <div class="project-full-cover reveal-init delay-300">
            <img src="${project.heroImage || project.coverImage}" alt="${project.title} Hero View" class="clickable" data-cursor="zoom" data-cursor-label="EXPAND" data-gallery-open="0" />
          </div>

          <section class="project-editorial-body">
            <div class="sticky-brief reveal-init">
              <div class="meta-field-label">PROJECT STATEMENT</div>
              <h2 class="editorial-headline">${project.subtitle || project.summary}</h2>
              <div style="margin-top: 1rem;">
                <span class="meta-pill">${project.disciplines.join(' / ')}</span>
              </div>
            </div>

            <div class="editorial-narrative reveal-init delay-200">
              <p>${project.description}</p>
              <p>${project.concept}</p>
            </div>
          </section>

          <section class="project-gallery-array">
            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-hairline); display:flex; justify-content:space-between; align-items:baseline;">
              <span class="font-mono text-muted uppercase" style="font-size:0.75rem;">VISUAL ARCHIVE &amp; SPECIMENS (${project.gallery.length})</span>
              <span class="font-mono text-muted" style="font-size:0.72rem;">Click any plate for fullscreen metadata inspection</span>
            </div>

            ${project.gallery.map((item, idx) => `
              <div class="gallery-row ${idx % 3 === 0 ? 'layout-single' : 'layout-dual'} reveal-init">
                <div class="gallery-item clickable" data-cursor="zoom" data-cursor-label="EXPAND" data-gallery-open="${idx}">
                  <img src="${item.url}" alt="${item.caption}" loading="lazy" />
                  <div class="gallery-caption-bar">
                    <span>${item.caption}</span>
                    <span>${item.camera || 'Medium Format Plate'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </section>

          <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline);">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem;">
              <div>
                <div class="meta-field-label" style="margin-bottom: 1.5rem;">COLLABORATORS &amp; CREDITS</div>
                <ul style="display:flex; flex-direction:column; gap:1rem; font-family:var(--font-mono); font-size:0.85rem;">
                  ${project.credits.map(c => `
                    <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-hairline); padding-bottom:0.6rem;">
                      <span class="text-muted">${c.role}</span>
                      <span style="color:var(--text-primary); font-weight:500;">${c.name}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div>
                <div class="meta-field-label" style="margin-bottom: 1.5rem;">HONORS &amp; RECOGNITION</div>
                <ul style="display:flex; flex-direction:column; gap:1rem; font-family:var(--font-mono); font-size:0.85rem;">
                  ${project.awards.map(a => `
                    <li style="display:flex; align-items:center; gap:0.75rem; border-bottom:1px solid var(--border-hairline); padding-bottom:0.6rem;">
                      <span style="color:var(--accent-gold);">★</span>
                      <span>${a}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </section>

          <nav class="project-nav-footer">
            <a href="#project?id=${prevProject.slug}" class="nav-proj-item prev clickable" data-cursor="prev">
              <span class="nav-proj-direction">← Previous Project</span>
              <span class="nav-proj-title">${prevProject.title}</span>
              <span class="font-mono text-muted" style="font-size:0.75rem;">${prevProject.discipline} · ${prevProject.year}</span>
            </a>

            <a href="#project?id=${nextProject.slug}" class="nav-proj-item next clickable" data-cursor="next">
              <span class="nav-proj-direction">Next Project →</span>
              <span class="nav-proj-title">${nextProject.title}</span>
              <span class="font-mono text-muted" style="font-size:0.75rem;">${nextProject.discipline} · ${nextProject.year}</span>
            </a>
          </nav>
        </div>
      `;

      const galleryItems = this.container.querySelectorAll('[data-gallery-open]');
      galleryItems.forEach(el => {
        el.addEventListener('click', () => {
          const index = parseInt(el.getAttribute('data-gallery-open'), 10) || 0;
          this.app.gallery.open(project.gallery, index);
        });
      });
    }

    renderAbout() {
      this.container.innerHTML = `
        <div class="about-view">
          <section class="site-container section-padding">
            <div class="about-intro-grid">
              <div class="about-portrait-frame reveal-init">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" alt="Creative Director Kaelen Vane" />
                <div class="gallery-caption-bar" style="padding: 1rem 0;">
                  <span>Kaelen Vane — Founder &amp; Creative Director</span>
                  <span>Tokyo / Zurich / Paris</span>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span class="font-mono text-muted uppercase tracking-widest reveal-init" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                    PRACTICE OVERVIEW
                  </span>
                  <h1 class="hero-headline reveal-init delay-100" style="font-size: clamp(2.4rem, 5vw, 5rem); margin-bottom: 2rem;">
                    MATERIALITY <span class="italic-serif">&amp;</span> REDUCTION
                  </h1>
                  <div class="editorial-narrative reveal-init delay-200" style="font-size:1.15rem;">
                    <p>
                      Frame &amp; Form is an award-winning multidisciplinary studio founded by creative director and photographer Kaelen Vane. We collaborate globally with architectural institutes, luxury fashion houses, cultural foundations, and technology pioneers.
                    </p>
                    <p>
                      Our methodology rejects ornamental surplus in favor of raw structural clarity, spatial typography, and large-format photographic documentation. We design visual ecosystems that balance mathematical discipline with visceral emotional resonance.
                    </p>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1.5rem; border-top:1px solid var(--border-hairline); padding-top:2rem; margin-top:3rem;" class="reveal-init delay-300">
                  <div>
                    <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">2018</div>
                    <div class="font-mono text-muted" style="font-size:0.7rem;">ESTABLISHED</div>
                  </div>
                  <div>
                    <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--accent-gold);">42</div>
                    <div class="font-mono text-muted" style="font-size:0.7rem;">GLOBAL AWARDS</div>
                  </div>
                  <div>
                    <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">07</div>
                    <div class="font-mono text-muted" style="font-size:0.7rem;">MONOGRAPHS</div>
                  </div>
                  <div>
                    <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">19</div>
                    <div class="font-mono text-muted" style="font-size:0.7rem;">EXHIBITIONS</div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 6rem;">
              <div class="section-label reveal-init">CORE PILLARS</div>
              <h2 class="section-heading reveal-init delay-100">Studio Manifesto</h2>

              <div class="manifesto-columns">
                ${MANIFESTO_PARAGRAPHS.map(p => `
                  <div class="manifesto-item reveal-init">
                    <span class="manifesto-num">${p.num}</span>
                    <h3 class="manifesto-heading">${p.heading}</h3>
                    <p class="manifesto-text">${p.body}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: 8rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <div>
                  <div class="section-label reveal-init">COMMISSION ROSTER</div>
                  <h2 class="section-heading reveal-init delay-100">Selected Clients</h2>
                </div>
                <span class="font-mono text-muted" style="font-size:0.75rem;">2018 — 2026</span>
              </div>

              <div class="roster-grid reveal-init delay-200">
                ${CLIENTS.map(c => `
                  <div class="roster-cell">
                    <div class="roster-name">${c.name}</div>
                    <div>
                      <div class="roster-category">${c.category}</div>
                      <div class="font-mono text-muted" style="font-size:0.65rem; margin-top:0.2rem;">${c.location}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: 8rem;">
              <div class="section-label reveal-init">RETROSPECTIVE</div>
              <h2 class="section-heading reveal-init delay-100">Exhibitions &amp; Honors</h2>

              <div style="margin-top:3rem; border-top:1px solid var(--border-hairline);">
                ${EXHIBITIONS.map(e => `
                  <div style="display:grid; grid-template-columns: 100px 1fr 1fr; padding:1.5rem 0; border-bottom:1px solid var(--border-hairline); font-family:var(--font-mono); font-size:0.85rem;" class="reveal-init">
                    <span style="color:var(--accent-gold);">${e.year}</span>
                    <span style="color:var(--text-primary); font-weight:500;">${e.title}</span>
                    <span class="text-muted" style="text-align:right;">${e.venue} — ${e.location}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="margin-top: 8rem;">
              <div class="section-label reveal-init">CRITICAL DISCOURSE</div>
              <h2 class="section-heading reveal-init delay-100">Curatorial Reception</h2>

              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; margin-top: 3.5rem;">
                ${CRITICAL_RECEPTION.map(c => `
                  <div style="border: 1px solid var(--border-hairline); padding: 2.5rem; background: var(--bg-secondary); display:flex; flex-direction:column; justify-content:space-between; min-height: 240px;" class="reveal-init">
                    <blockquote class="font-serif italic" style="font-size: 1.25rem; line-height: 1.45; color: var(--text-primary); margin-bottom: 2rem;">
                      “${c.quote}”
                    </blockquote>
                    <div>
                      <div class="font-display" style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">${c.author}</div>
                      <div class="font-mono text-muted" style="font-size: 0.72rem; margin-top: 0.25rem;">${c.title}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        </div>
      `;
    }

    renderArchive() {
      this.container.innerHTML = `
        <div class="archive-view">
          <header class="archive-header">
            <div>
              <div class="section-label reveal-init">CHRONOLOGICAL INDEX</div>
              <h1 class="section-heading reveal-init delay-100">Complete Archive</h1>
            </div>
            <div class="font-mono text-muted reveal-init" style="font-size:0.75rem;">
              <span>TOTAL RECORDS: ${ARCHIVE.length}</span>
            </div>
          </header>

          <div style="overflow-x: auto;">
            <table class="archive-table">
              <thead>
                <tr>
                  <th>Index ID</th>
                  <th>Year</th>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Discipline</th>
                  <th>Location</th>
                  <th>Medium / Format</th>
                  <th style="text-align:right;">Access</th>
                </tr>
              </thead>
              <tbody>
                ${ARCHIVE.map(item => `
                  <tr class="archive-row clickable" data-preview-img="${PROJECTS.find(p => p.slug === item.slug)?.coverImage || PROJECTS[0].coverImage}" data-cursor="view" data-href="#project?id=${item.slug}">
                    <td class="archive-id">${item.id}</td>
                    <td>${item.year}</td>
                    <td class="archive-title">${item.title}</td>
                    <td>${item.client}</td>
                    <td><span class="meta-pill">${item.discipline}</span></td>
                    <td>${item.location}</td>
                    <td class="text-muted">${item.medium}</td>
                    <td style="text-align:right;">
                      <a href="#project?id=${item.slug}" class="hud-btn clickable" style="padding:0.25rem 0.6rem; font-size:0.65rem;">View →</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      const rows = this.container.querySelectorAll('.archive-row');
      rows.forEach(row => {
        row.addEventListener('click', () => {
          const href = row.getAttribute('data-href');
          if (href) this.navigate(href);
        });
      });
    }

    renderContact() {
      const savedInquiries = this.app.getInquiries();

      this.container.innerHTML = `
        <div class="contact-view">
          <header style="border-bottom: 1px solid var(--border-hairline); padding-bottom: 2rem;">
            <div class="section-label reveal-init">INITIATE COLLABORATION</div>
            <h1 class="section-heading reveal-init delay-100">Project Commission Builder</h1>
          </header>

          <div class="contact-grid">
            <div class="contact-info-col">
              <div class="reveal-init">
                <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                  STUDIO LOCATIONS &amp; BUREAUS
                </span>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  ${STUDIO_INFO.locations.map(loc => `
                    <div class="contact-location-card">
                      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.4rem;">
                        <span class="font-display" style="font-size:1.15rem; font-weight:600;">${loc.city}, ${loc.country}</span>
                        <span class="font-mono" style="color:var(--accent-gold); font-size:0.75rem;">${loc.code}</span>
                      </div>
                      <p class="font-mono text-muted" style="font-size:0.75rem;">${loc.address}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="reveal-init delay-100" style="border-top:1px solid var(--border-hairline); padding-top:2rem;">
                <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                  DIRECT CHANNELS
                </span>
                <ul style="display:flex; flex-direction:column; gap:0.75rem; font-family:var(--font-mono); font-size:0.85rem;">
                  <li style="display:flex; justify-content:space-between;">
                    <span class="text-muted">General Commissions:</span>
                    <a href="mailto:commissions@frameandform.studio" class="hover-underline">commissions@frameandform.studio</a>
                  </li>
                  <li style="display:flex; justify-content:space-between;">
                    <span class="text-muted">Press &amp; Publications:</span>
                    <a href="mailto:press@frameandform.studio" class="hover-underline">press@frameandform.studio</a>
                  </li>
                  <li style="display:flex; justify-content:space-between;">
                    <span class="text-muted">Gallery Representations:</span>
                    <span>Zurich / Tokyo / Paris</span>
                  </li>
                </ul>
              </div>

              ${savedInquiries.length > 0 ? `
                <div class="reveal-init delay-200" style="border-top:1px solid var(--border-hairline); padding-top:2rem;">
                  <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                    YOUR RECORDED SUBMISSIONS (${savedInquiries.length})
                  </span>
                  <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    ${savedInquiries.map(inq => `
                      <div style="background:var(--bg-secondary); border:1px solid var(--border-hairline); padding:1rem; font-family:var(--font-mono); font-size:0.75rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                          <span style="color:var(--accent-gold); font-weight:600;">${inq.id}</span>
                          <span class="meta-pill" style="font-size:0.6rem;">${inq.status || 'CONFIRMED'}</span>
                        </div>
                        <div style="color:var(--text-primary); font-weight:500;">${inq.org || inq.name} — ${inq.type}</div>
                        <div class="text-muted" style="font-size:0.68rem; margin-top:0.2rem;">Submitted: ${inq.timestamp}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="reveal-init delay-100">
              <form id="inquiry-form" class="inquiry-builder-form">
                <div>
                  <h2 class="font-display" style="font-size:1.6rem; font-weight:700; margin-bottom:0.5rem;">Interactive Brief Builder</h2>
                  <p class="font-body text-secondary" style="font-size:0.9rem;">Configure project specifications to generate an official commission reference dossier.</p>
                </div>

                <div class="form-group">
                  <label class="form-label">01 / Commission Scope (Select All That Apply)</label>
                  <div class="chip-selector-group" id="scope-chips">
                    <button type="button" class="chip-choice selected" data-val="Art Direction">Art Direction</button>
                    <button type="button" class="chip-choice" data-val="Spatial Photography">Spatial Photography</button>
                    <button type="button" class="chip-choice" data-val="Brand Architecture">Brand Architecture</button>
                    <button type="button" class="chip-choice" data-val="Editorial Monograph">Editorial Monograph</button>
                    <button type="button" class="chip-choice" data-val="35mm Film">35mm Film</button>
                    <button type="button" class="chip-choice" data-val="Digital System">Digital System</button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">02 / Target Timeline</label>
                  <div class="chip-selector-group" id="timeline-chips">
                    <button type="button" class="chip-choice" data-val="Immediate (< 1 Month)">Immediate (&lt; 1 Mo)</button>
                    <button type="button" class="chip-choice selected" data-val="Q3 / Q4 2026">Q3 / Q4 2026</button>
                    <button type="button" class="chip-choice" data-val="2027 Strategic">2027 Strategic</button>
                    <button type="button" class="chip-choice" data-val="Flexible / Exploratory">Flexible</button>
                  </div>
                </div>

                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <label class="form-label">03 / Estimated Project Allocation (USD)</label>
                    <span class="budget-val-display" id="budget-display">$75,000</span>
                  </div>
                  <input type="range" min="25000" max="300000" step="5000" value="75000" class="budget-slider clickable" id="budget-slider" />
                  <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">
                    <span>$25K (Small Feature)</span>
                    <span>$150K (Comprehensive)</span>
                    <span>$300K+ (Global Monolith)</span>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label">Client Name *</label>
                    <input type="text" class="form-input-box" id="client-name" required placeholder="Elena Rostova" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Organization / Brand *</label>
                    <input type="text" class="form-input-box" id="client-org" required placeholder="Vitra / Bottega Veneta / Self" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input type="email" class="form-input-box" id="client-email" required placeholder="elena@institution.ch" />
                </div>

                <div class="form-group">
                  <label class="form-label">Project Synopsis &amp; Objectives</label>
                  <textarea class="form-input-box" id="client-synopsis" rows="4" placeholder="Describe the physical/digital dimensions, core objectives, materials, and creative vision..."></textarea>
                </div>

                <button type="submit" class="submit-btn-cta clickable" data-cursor="send">
                  <span>Transmit Commission Brief</span>
                  <span>→</span>
                </button>

                <div class="submission-receipt" id="submission-receipt-box">
                  <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border-hairline); padding-bottom:0.5rem;">
                    <span style="color:var(--accent-gold); font-weight:700;">COMMISSION REFERENCE GENERATED</span>
                    <span id="receipt-id">FF-2026-XXXX</span>
                  </div>
                  <p style="margin-bottom:0.5rem; color:var(--text-primary);">
                    Your project inquiry has been securely compiled into the studio intake registry.
                  </p>
                  <div id="receipt-summary" style="color:var(--text-muted); font-size:0.75rem; line-height:1.5;"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;

      this.bindContactForm();
    }

    bindContactForm() {
      const scopeChips = this.container.querySelectorAll('#scope-chips .chip-choice');
      scopeChips.forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('selected');
          sound.playClick();
        });
      });

      const timelineChips = this.container.querySelectorAll('#timeline-chips .chip-choice');
      timelineChips.forEach(chip => {
        chip.addEventListener('click', () => {
          timelineChips.forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          sound.playClick();
        });
      });

      const budgetSlider = document.getElementById('budget-slider');
      const budgetDisplay = document.getElementById('budget-display');
      if (budgetSlider && budgetDisplay) {
        budgetSlider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          budgetDisplay.textContent = `$${val.toLocaleString()}${val >= 300000 ? '+' : ''}`;
        });
      }

      const form = document.getElementById('inquiry-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.app.submitInquiry();
        });
      }
    }
  }

  /* =============================================================
     7. MASTER APPLICATION
     ============================================================= */
  class FrameAndFormApp {
    constructor() {
      this.bookmarks = [];
      this.inquiries = [];

      try {
        if (typeof localStorage !== 'undefined') {
          this.bookmarks = JSON.parse(localStorage.getItem('ff_bookmarks') || '[]');
          this.inquiries = JSON.parse(localStorage.getItem('ff_inquiries') || '[]');
        }
      } catch (e) {}

      this.cursor = null;
      this.gallery = null;
      this.effects = null;
      this.router = null;
      this.paletteOpen = false;
      this.savedDrawerOpen = false;

      this.init();
    }

    init() {
      this.cursor = new CustomCursor();
      this.gallery = new GalleryLightbox();
      this.effects = new EffectsController();
      this.router = new AppRouter(this);

      this.initGlobalHUD();
      this.initCommandPalette();
      this.initSavedDrawer();
      this.initShortcuts();
      this.updateBookmarkBadge();

      this.router.init();
    }

    initGlobalHUD() {
      const soundBtn = document.getElementById('sound-toggle-btn');
      const soundLabel = document.getElementById('sound-toggle-label');
      if (soundBtn) {
        const updateSoundUI = () => {
          if (sound.isEnabled) {
            soundBtn.classList.add('active');
            if (soundLabel) soundLabel.textContent = 'SOUND: ON';
          } else {
            soundBtn.classList.remove('active');
            if (soundLabel) soundLabel.textContent = 'SOUND: OFF';
          }
        };
        updateSoundUI();

        soundBtn.addEventListener('click', () => {
          const state = sound.toggle();
          updateSoundUI();
          this.showToast(state ? 'Procedural Audio Enabled' : 'Procedural Audio Muted');
        });
      }

      const savedBtn = document.getElementById('saved-toggle-btn');
      if (savedBtn) {
        savedBtn.addEventListener('click', () => this.toggleSavedDrawer());
      }

      const cmdBtn = document.getElementById('cmd-palette-btn');
      if (cmdBtn) {
        cmdBtn.addEventListener('click', () => this.openCommandPalette());
      }

      const mobileBtn = document.getElementById('mobile-toggle-btn');
      const navMenu = document.querySelector('.nav-menu');
      if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
          const isOpen = navMenu.classList.toggle('open');
          mobileBtn.classList.toggle('active', isOpen);
          mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          sound.playClick();
        });
      }
    }

    getBookmarks() { return this.bookmarks; }
    isBookmarked(id) { return this.bookmarks.includes(id); }

    toggleBookmark(id) {
      const project = PROJECTS.find(p => p.id === id || p.slug === id);
      if (!project) return;

      const index = this.bookmarks.indexOf(project.id);
      let added = false;

      if (index === -1) {
        this.bookmarks.push(project.id);
        added = true;
        sound.playSuccess();
        this.showToast(`Added "${project.title}" to Moodboard`);
      } else {
        this.bookmarks.splice(index, 1);
        sound.playClick();
        this.showToast(`Removed "${project.title}" from Moodboard`);
      }

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ff_bookmarks', JSON.stringify(this.bookmarks));
        }
      } catch (e) {}

      this.updateBookmarkBadge();
      this.renderSavedDrawer();

      const btns = document.querySelectorAll(`[data-bookmark-id="${project.id}"]`);
      btns.forEach(btn => {
        btn.classList.toggle('saved', added);
        btn.classList.toggle('active', added);
        if (btn.classList.contains('bookmark-icon-btn')) {
          btn.textContent = added ? '★' : '☆';
        }
      });
      return added;
    }

    updateBookmarkBadge() {
      const badge = document.getElementById('saved-badge-count');
      if (badge) badge.textContent = this.bookmarks.length;
    }

    toggleSavedDrawer() {
      this.savedDrawerOpen = !this.savedDrawerOpen;
      const drawer = document.querySelector('.saved-drawer');
      const backdrop = document.querySelector('.drawer-backdrop');
      if (drawer && backdrop) {
        drawer.classList.toggle('open', this.savedDrawerOpen);
        backdrop.classList.toggle('open', this.savedDrawerOpen);
      }
      if (this.savedDrawerOpen) {
        this.renderSavedDrawer();
        sound.playTransition();
      } else {
        sound.playClick();
      }
    }

    initSavedDrawer() {
      const drawerClose = document.getElementById('saved-drawer-close');
      const backdrop = document.querySelector('.drawer-backdrop');
      const exportBtn = document.getElementById('export-moodboard-btn');
      const clearBtn = document.getElementById('clear-moodboard-btn');

      if (drawerClose) drawerClose.addEventListener('click', () => this.toggleSavedDrawer());
      if (backdrop) backdrop.addEventListener('click', () => this.toggleSavedDrawer());

      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const savedProjects = PROJECTS.filter(p => this.bookmarks.includes(p.id));
          if (!savedProjects.length) {
            this.showToast('Your Moodboard is empty.');
            return;
          }
          const textDossier = `FRAME & FORM — MOODBOARD EXPORT\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
            savedProjects.map(p => `• [${p.year}] ${p.title} (${p.discipline})\n  Client: ${p.client}\n  Location: ${p.location}\n  Link: https://frameandform.studio/#project?id=${p.slug}\n`).join('\n');

          navigator.clipboard.writeText(textDossier).then(() => {
            sound.playSuccess();
            this.showToast('Moodboard dossier copied to clipboard.');
          }).catch(() => {
            this.showToast('Export ready.');
          });
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.bookmarks = [];
          try {
            if (typeof localStorage !== 'undefined') localStorage.setItem('ff_bookmarks', JSON.stringify([]));
          } catch (e) {}
          this.updateBookmarkBadge();
          this.renderSavedDrawer();
          this.showToast('Moodboard cleared.');
          sound.playClick();
        });
      }
    }

    renderSavedDrawer() {
      const body = document.querySelector('.drawer-body');
      if (!body) return;

      const savedProjects = PROJECTS.filter(p => this.bookmarks.includes(p.id));

      if (!savedProjects.length) {
        body.innerHTML = `
          <div style="text-align:center; padding: 4rem 1rem; color:var(--text-muted); font-family:var(--font-mono); font-size:0.8rem;">
            <div style="font-size:2rem; margin-bottom:1rem; opacity:0.3;">★</div>
            <p style="color:var(--text-primary); font-weight:500; margin-bottom:0.4rem;">Your saved collection is empty.</p>
            <p style="font-size:0.72rem; opacity:0.7; max-width:280px; margin: 0 auto 1.5rem;">Click the star on any project across the catalog to curate your private moodboard.</p>
            <a href="#work" class="hud-btn clickable" style="display:inline-flex;" onclick="document.querySelector('.drawer-backdrop').click();">Explore Works Catalog →</a>
          </div>
        `;
        return;
      }

      body.innerHTML = savedProjects.map(p => `
        <div class="saved-item-card">
          <img src="${p.coverImage}" alt="${p.title}" class="saved-item-thumb" />
          <div class="saved-item-info">
            <div class="font-display" style="font-size:1.1rem; font-weight:600;">
              <a href="#project?id=${p.slug}" class="clickable" onclick="document.querySelector('.drawer-backdrop').click();">${p.title}</a>
            </div>
            <div class="font-mono text-muted" style="font-size:0.72rem;">${p.client} · ${p.discipline}</div>
          </div>
          <button class="bookmark-icon-btn clickable saved" data-remove-saved="${p.id}" title="Remove from moodboard" style="width:28px; height:28px; font-size:0.75rem;">
            ✕
          </button>
        </div>
      `).join('');

      const removeBtns = body.querySelectorAll('[data-remove-saved]');
      removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-remove-saved');
          this.toggleBookmark(id);
        });
      });
    }

    initCommandPalette() {
      const overlay = document.querySelector('.command-palette-overlay');
      const input = document.getElementById('palette-input');
      const list = document.getElementById('palette-results-list');
      if (!overlay || !input || !list) return;

      const renderResults = (query = '') => {
        const q = query.toLowerCase().trim();
        list.innerHTML = '';

        const navItems = [
          { title: 'Home', subtitle: 'Flagship Overview & Selected Reels', href: '#home', type: 'PAGE' },
          { title: 'Works Catalog', subtitle: 'Complete 12 Projects with Filters', href: '#work', type: 'PAGE' },
          { title: 'About & Manifesto', subtitle: 'Studio Philosophy, Clients & Awards', href: '#about', type: 'PAGE' },
          { title: 'Archive', subtitle: 'Chronological Data Index 2018-2026', href: '#archive', type: 'PAGE' },
          { title: 'Initiate Commission', subtitle: 'Interactive Project Brief Builder', href: '#contact', type: 'PAGE' }
        ];

        const projectItems = PROJECTS.map(p => ({
          title: p.title,
          subtitle: `${p.client} · ${p.discipline} (${p.year})`,
          href: `#project?id=${p.slug}`,
          type: 'PROJECT'
        }));

        const allItems = [...navItems, ...projectItems].filter(item => {
          return !q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
        });

        if (!allItems.length) {
          list.innerHTML = `<div style="padding:1.5rem; text-align:center; font-family:var(--font-mono); color:var(--text-muted); font-size:0.8rem;">No results found for "${query}"</div>`;
          return;
        }

        allItems.forEach((item, index) => {
          const el = document.createElement('div');
          el.className = `palette-item clickable ${index === 0 ? 'active' : ''}`;
          el.setAttribute('data-href', item.href);
          el.innerHTML = `
            <div>
              <div style="font-weight:600; color:var(--text-primary);">${item.title}</div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.15rem;">${item.subtitle}</div>
            </div>
            <span class="meta-pill" style="font-size:0.6rem;">${item.type}</span>
          `;
          el.addEventListener('click', () => {
            this.closeCommandPalette();
            this.router.navigate(item.href);
          });
          list.appendChild(el);
        });
      };

      input.addEventListener('input', (e) => renderResults(e.target.value));

      input.addEventListener('keydown', (e) => {
        const items = list.querySelectorAll('.palette-item');
        let activeIndex = Array.from(items).findIndex(it => it.classList.contains('active'));

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (items.length > 0) {
            if (activeIndex >= 0) items[activeIndex].classList.remove('active');
            activeIndex = (activeIndex + 1) % items.length;
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (items.length > 0) {
            if (activeIndex >= 0) items[activeIndex].classList.remove('active');
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeIndex >= 0 && items[activeIndex]) {
            const href = items[activeIndex].getAttribute('data-href');
            this.closeCommandPalette();
            if (href) this.router.navigate(href);
          }
        } else if (e.key === 'Escape') {
          this.closeCommandPalette();
        }
      });

      overlay.addEventListener('click', (e) => {
        if (!e.target.closest('.command-palette-box')) this.closeCommandPalette();
      });
    }

    openCommandPalette() {
      const overlay = document.querySelector('.command-palette-overlay');
      const input = document.getElementById('palette-input');
      if (!overlay || !input) return;
      this.paletteOpen = true;
      overlay.classList.add('open');
      input.value = '';
      input.focus();
      input.dispatchEvent(new Event('input'));
      sound.playClick();
    }

    closeCommandPalette() {
      const overlay = document.querySelector('.command-palette-overlay');
      if (!overlay) return;
      this.paletteOpen = false;
      overlay.classList.remove('open');
    }

    initShortcuts() {
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (this.paletteOpen) this.closeCommandPalette();
          else this.openCommandPalette();
        }
        if (e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          const soundBtn = document.getElementById('sound-toggle-btn');
          if (soundBtn) soundBtn.click();
        }
      });
    }

    getInquiries() { return this.inquiries; }

    submitInquiry() {
      const nameEl = document.getElementById('client-name');
      const orgEl = document.getElementById('client-org');
      const emailEl = document.getElementById('client-email');
      const synopsisEl = document.getElementById('client-synopsis');
      const budgetSlider = document.getElementById('budget-slider');
      const submitBtn = document.querySelector('.submit-btn-cta[type="submit"]');

      if (!nameEl || !orgEl || !emailEl || !nameEl.value.trim() || !emailEl.value.trim()) {
        this.showToast('Please provide your name, organization, and valid email.');
        return;
      }

      const scopeChips = document.querySelectorAll('#scope-chips .chip-choice.selected');
      const scopes = Array.from(scopeChips).map(c => c.getAttribute('data-val')).join(', ') || 'Comprehensive Creative Direction';

      const timelineChip = document.querySelector('#timeline-chips .chip-choice.selected');
      const timeline = timelineChip ? timelineChip.getAttribute('data-val') : 'Q3 / Q4 2026';

      const submissionId = `FF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const submissionData = {
        id: submissionId,
        name: nameEl.value.trim(),
        org: orgEl.value.trim() || 'Independent',
        email: emailEl.value.trim(),
        type: scopes,
        timeline: timeline,
        budget: budgetSlider ? `$${parseInt(budgetSlider.value, 10).toLocaleString()}` : '$75,000',
        synopsis: synopsisEl ? synopsisEl.value.trim() : '',
        timestamp: new Date().toLocaleString(),
        status: 'CONFIRMED'
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Compiling Dossier...</span> <span>⏳</span>';
      }

      setTimeout(() => {
        this.inquiries.unshift(submissionData);
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('ff_inquiries', JSON.stringify(this.inquiries));
          }
        } catch (e) {}

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Transmit Commission Brief</span> <span>→</span>';
        }

        const receiptBox = document.getElementById('submission-receipt-box');
        const receiptId = document.getElementById('receipt-id');
        const receiptSummary = document.getElementById('receipt-summary');

        if (receiptBox && receiptId && receiptSummary) {
          receiptId.innerHTML = `<span style="font-weight:700;">${submissionId}</span> <button type="button" class="hud-btn clickable" id="copy-receipt-id-btn" style="margin-left:0.75rem; padding:0.2rem 0.5rem; font-size:0.65rem;">COPY ID</button>`;
          receiptSummary.innerHTML = `
            <strong>Client:</strong> ${submissionData.name} (${submissionData.org})<br>
            <strong>Scope:</strong> ${submissionData.type}<br>
            <strong>Budget Allocation:</strong> ${submissionData.budget} · <strong>Timeline:</strong> ${submissionData.timeline}<br>
            <strong>Dossier Reference:</strong> Recorded in Studio Intake Registry
          `;
          receiptBox.style.display = 'block';
          receiptBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

          const copyBtn = document.getElementById('copy-receipt-id-btn');
          if (copyBtn) {
            copyBtn.addEventListener('click', () => {
              navigator.clipboard.writeText(submissionId).then(() => {
                this.showToast(`Reference ID #${submissionId} copied to clipboard`);
                sound.playClick();
              }).catch(() => {
                this.showToast(`Reference ID #${submissionId}`);
              });
            });
          }
        }

        sound.playSuccess();
        this.showToast(`Commission Brief #${submissionId} Logged Successfully`);
      }, 450);
    }

    showToast(message) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 400);
      }, 3200);
    }

    afterRender() {
      const bookmarkBtns = document.querySelectorAll('[data-bookmark-id]');
      bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.getAttribute('data-bookmark-id');
          this.toggleBookmark(id);
        });
      });

      if (this.effects) this.effects.refreshReveals();
      if (this.cursor) this.cursor.refresh();
    }
  }

  // Initialize once DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.app = new FrameAndFormApp();
      });
    } else {
      window.app = new FrameAndFormApp();
    }
  }
})();
