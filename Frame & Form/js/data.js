/**
 * Frame & Form — Master Dataset
 * Comprehensive data for projects, archive, clients, awards, and exhibitions.
 */

export const STUDIO_INFO = {
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
  stats: {
    founded: 2018,
    awards: 42,
    monographs: 7,
    exhibitions: 19
  }
};

export const DISCIPLINES = [
  { id: "all", label: "All Works", count: 12 },
  { id: "art-direction", label: "Art Direction", count: 4 },
  { id: "photography", label: "Photography", count: 5 },
  { id: "branding", label: "Branding", count: 3 },
  { id: "editorial", label: "Editorial", count: 3 },
  { id: "film", label: "Film", count: 2 },
  { id: "digital", label: "Digital", count: 3 }
];

export const PROJECTS = [
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
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop",
        caption: "Plate I — Concrete Cantilever & Equinox Shadow",
        aspect: "landscape",
        camera: "Hasselblad H6D-100c · 50mm f/3.5 · ISO 64 · 1/125s",
        dimension: "100 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
        caption: "Plate II — Angular Light Well & Geometric Convergence",
        aspect: "portrait",
        camera: "Hasselblad H6D-100c · 80mm f/2.2 · ISO 64 · 1/60s",
        dimension: "100 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?q=80&w=1800&auto=format&fit=crop",
        caption: "Plate III — Monograph Specimen & Foil Deboss Binding",
        aspect: "landscape",
        camera: "Leica SL2 · Summilux-SL 50mm f/1.4 · ISO 100 · 1/200s",
        dimension: "47 MP / Full Frame"
      },
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
        caption: "Plate IV — Structural Rhythm in Cast Aggregates",
        aspect: "square",
        camera: "Hasselblad H6D-100c · 35mm f/3.5 · ISO 64 · 1/90s",
        dimension: "100 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop",
        caption: "Plate V — Verticality & Atmospheric Haze",
        aspect: "portrait",
        camera: "Phase One IQ4 150MP · Schneider 55mm · ISO 50 · 1/250s",
        dimension: "151 MP / Trichromatic"
      }
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
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop",
        caption: "Look 01 — Kinetic Wool Pleat & Strobe Dissolve",
        aspect: "portrait",
        camera: "Leica S3 · Summarit-S 70mm f/2.5 · ISO 100 · 1/500s",
        dimension: "64 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1600&auto=format&fit=crop",
        caption: "Look 02 — Sculptural Leather Silhouette in Monolith Chamber",
        aspect: "landscape",
        camera: "Hasselblad X2D 100C · XCD 90V · ISO 64 · 1/320s",
        dimension: "100 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop",
        caption: "Look 03 — Chromatic Cascade & Texture Study",
        aspect: "portrait",
        camera: "Phase One IQ4 · 110mm f/2.8 · ISO 50 · 1/160s",
        dimension: "151 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
        caption: "Look 04 — Geometric Drape & Mineral Backing",
        aspect: "portrait",
        camera: "Leica SL2-S · APO-Summicron 35mm · ISO 200 · 1/400s",
        dimension: "24 MP / Full Frame"
      }
    ],
    credits: [
      { role: "Art Direction & Stills", name: "Kaelen Vane" },
      { role: "Styling Direction", name: "Marie-Claire Dupuis" },
      { role: "Cinematography (16mm)", name: "Arthur Pendelton" },
      { role: "Sound Design", name: "Yukihiro Takahashi Studio" },
      { role: "Colorist", name: "Company 3 Paris" }
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
      {
        url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1800&auto=format&fit=crop",
        caption: "Specimen A — Machined Baffle & Sound Absorption Geometry",
        aspect: "landscape",
        camera: "Sony A1 · FE 90mm f/2.8 Macro · ISO 100 · 1/160s",
        dimension: "50 MP / High-Res"
      },
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop",
        caption: "Specimen B — Generative Acoustic Waveform Interface",
        aspect: "landscape",
        camera: "Digital Render / WebGL Engine 4K",
        dimension: "3840 x 2160"
      },
      {
        url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1800&auto=format&fit=crop",
        caption: "Specimen C — Anodized Identity Suite & Milled Packaging",
        aspect: "portrait",
        camera: "Hasselblad X2D · 45mm f/4 · ISO 64 · 1/200s",
        dimension: "100 MP / Medium Format"
      }
    ],
    credits: [
      { role: "Brand Architecture & Direction", name: "Studio Frame & Form" },
      { role: "Generative Systems & WebGL", name: "Lars Kjeldsen" },
      { role: "Industrial Design Liaison", name: "Astrid Lindgren" },
      { role: "Type Design", name: "Kaelen Vane" }
    ],
    awards: ["Red Dot Best of the Best 2025", "Awwwards Site of the Month", "Cannes Lions Silver"]
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
    description: "Commissioned as an exhibition centerpiece, Synthetic Botany examines how cellular plant structures might mutate under extreme atmospheric pressure and synthetic bio-luminescence. Utilising custom microscope lenses and focus-stacking of up to 400 exposures per plate, microscopic stamens and trichomes take on the colossal presence of extraterrestrial landscapes.",
    concept: "We stripped botanical photography of its pastoral clichés. Instead, plants are framed with the forensic precision of industrial aerospace parts, highlighting their mathematically flawless vein structures and iridescent cuticle layers.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1800&auto=format&fit=crop",
        caption: "Micrograph 01 — Sub-cellular Cryo-Crystalline Trichome",
        aspect: "portrait",
        camera: "Mitutoyo 10x M Plan Apo · Custom Bellows · 320 Focus Stack",
        dimension: "150 MP Composite"
      },
      {
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
        caption: "Micrograph 02 — Iridescent Cuticle & Chlorophyll Matrix",
        aspect: "landscape",
        camera: "Nikon Z9 · Laowa 25mm 2.5-5X Ultra Macro · ISO 64",
        dimension: "45 MP / Forensic Macro"
      },
      {
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1800&auto=format&fit=crop",
        caption: "Micrograph 03 — Forest Floor Atmospheric Deposition",
        aspect: "landscape",
        camera: "Hasselblad H6D · Macro 120mm · ISO 100",
        dimension: "100 MP"
      }
    ],
    credits: [
      { role: "Principal Macrographer & Director", name: "Kaelen Vane" },
      { role: "Botanical Consultant", name: "Dr. Solveig Arnalds" },
      { role: "Lighting Engineer", name: "Kenji Sato" }
    ],
    awards: ["Nature Photography Prize Zurich", "Tokyo International Photo Award Gold"]
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
    description: "Spanning three years of remote expeditions into volcanic fault lines in the central Icelandic highlands and the hyper-arid Atacama desert, Terra Incognita represents an unyielding documentary of Earth's primordial crust. Published by Rizzoli in a monumental 31x42cm format, the volume is bound in volcanic ash-pigmented boards.",
    concept: "We eliminated the romantic horizon line. Every photograph is a top-down orthogonal or steep oblique perspective, transforming mountains and geothermal vents into abstract geometric tapestries of sulfur, basalt, and obsidian.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop",
        caption: "Plate 14 — Basalt Rift & Glacial Silt Horizon",
        aspect: "landscape",
        camera: "Phase One IQ4 150MP · Rodenstock 70mm · ISO 50",
        dimension: "151 MP / Medium Format"
      },
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
        caption: "Plate 28 — Obsidian Scree Field & Thermal Steam",
        aspect: "landscape",
        camera: "Hasselblad H6D-100c · 35mm f/3.5 · ISO 64",
        dimension: "100 MP"
      },
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1800&auto=format&fit=crop",
        caption: "Plate 42 — High Altitude Ridge at Dawn",
        aspect: "portrait",
        camera: "Leica S3 · Summarit-S 120mm · ISO 100",
        dimension: "64 MP"
      }
    ],
    credits: [
      { role: "Photographer & Author", name: "Kaelen Vane" },
      { role: "Editorial Art Director", name: "Thomas Persson" },
      { role: "Lithography & Color Separation", name: "Triltsch Print Media" }
    ],
    awards: ["German Photobook Award Gold", "Lucie Awards Monograph of the Year"]
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
    description: "Kinetic Shadows captures four dancers from the Opéra National de Lyon within an industrial hangar in Berlin equipped with 64 synchronized motorized spotlight gantry arms. As the lighting arms tilt and orbit, cast shadows elongate, collide, and warp the perceived depth of the room.",
    concept: "We treated shadows not as the absence of light, but as physical matter with mass and velocity. The score by experimental composer Ben Frost was synced via DMX signals to trigger both lighting cues and camera shutter pulses.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1800&auto=format&fit=crop",
        caption: "Frame 01 — DMX Spotlight Grid & Negative Silhouette",
        aspect: "landscape",
        camera: "ARRI Alexa 35 · Cooke Anamorphic/i Full Frame Plus · ISO 800",
        dimension: "4.6K ProRes 4444 XQ"
      },
      {
        url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1600&auto=format&fit=crop",
        caption: "Frame 02 — High Speed Motion Sweep & Shadow Split",
        aspect: "portrait",
        camera: "Phantom Flex4K · 1000 fps · Master Prime 35mm",
        dimension: "4K Raw Cinema"
      },
      {
        url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1800&auto=format&fit=crop",
        caption: "Frame 03 — Spatial Volume Collapse & Tungsten Haze",
        aspect: "landscape",
        camera: "ARRI Alexa 35 · 50mm Anamorphic · ISO 1600",
        dimension: "4.6K Cinema"
      }
    ],
    credits: [
      { role: "Director & Cinematographer", name: "Kaelen Vane" },
      { role: "Choreographer", name: "Sidi Larbi Cherkaoui" },
      { role: "Music & Sound Design", name: "Ben Frost" },
      { role: "Lighting Architect", name: "Studio Drift Collaborators" }
    ],
    awards: ["Vimeo Staff Pick of the Year", "Cannes Lions Bronze (Film Craft)", "Berlin Commercial Best Art Direction"]
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
    description: "Commissioned by Polestar Concept Lab, Metric Dissolve reimagines human-machine interface away from hyper-stimulating touchscreens toward calm, reductive typographic telemetry. Visual widgets dissolve into the ambient dashboard fabric when not required, appearing with micro-anisotropic lighting as the driver approaches.",
    concept: "We eliminated ornamental skeuomorphism and cartoonish 3D rendering. The UI is built entirely upon high-precision Swiss grid ratios, ultra-condensed monospaced numerals, and optical laser-etched light guides.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1800&auto=format&fit=crop",
        caption: "Interface Mode 01 — Optical Telemetry & Swiss Monospace Ratio",
        aspect: "landscape",
        camera: "Real-time Vector UI Render Engine · OLED 8K",
        dimension: "7680 x 2160"
      },
      {
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
        caption: "Interface Mode 02 — Ambient Micro-HUD & Spatial Depth",
        aspect: "landscape",
        camera: "Industrial Design Prototype Capture",
        dimension: "6000 x 4000"
      },
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1800&auto=format&fit=crop",
        caption: "Hardware Integration — Anisotropic Glass Surface",
        aspect: "portrait",
        camera: "Leica SL2 · Macro-Elmarit 60mm · ISO 50",
        dimension: "47 MP"
      }
    ],
    credits: [
      { role: "Digital Creative Director", name: "Kaelen Vane" },
      { role: "HMI Lead Engineer", name: "Magnus Hedberg" },
      { role: "Generative Systems", name: "Studio Frame & Form" },
      { role: "Motion Design", name: "Yoann Bourgeois" }
    ],
    awards: ["UX Design Awards Gold 2026", "iF Gold Design Award", "Core77 Interaction Award"]
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
    description: "Designed for Aesop's flagship sanctuary in Gion, Kyoto, Tactile Void explores sensory reduction. Customers transition from the bustling historic street through a 12-meter sound-attenuating tunnel of charred cedar into a luminous central stone chamber anchored by a 4-ton granite basin.",
    concept: "We treated space as a tangible tactile vessel. No labels or corporate logos are visible upon entry; the identity manifests entirely through scent dispersion, thermal gradients between stone surfaces, and acoustic resonance.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1800&auto=format&fit=crop",
        caption: "Space 01 — Monolithic Granite Basin & Charred Cedar Corridor",
        aspect: "portrait",
        camera: "Hasselblad H6D-100c · 28mm f/4 · ISO 64 · 2.5s",
        dimension: "100 MP"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
        caption: "Space 02 — Hammered Copper Water Fixture & Rammed Earth Wall",
        aspect: "landscape",
        camera: "Leica S3 · 70mm f/2.5 · ISO 100 · 1/80s",
        dimension: "64 MP"
      }
    ],
    credits: [
      { role: "Spatial Art Direction", name: "Kaelen Vane" },
      { role: "Traditional Sukiya Carpenter", name: "Toshio Odate" },
      { role: "Sensory Landscape", name: "Barnabé Fillion" }
    ],
    awards: ["Architectural Digest Great Design Award", "Frame Awards Retail Space of the Year"]
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
    summary: "Curatorial catalogue documenting 30 years of Japanese light installations, featuring translucent vellum inserts and UV spot silk-screening.",
    description: "Aura Archive is a 520-page comprehensive curatorial volume for the landmark retrospective on ephemeral art in post-war Japan. The book uses varying paper stocks—from translucent vellum to heavy unbleached craft paper—to mirror the gradual physical materialization of light installations.",
    concept: "The book block itself serves as a light-refracting object. Edges are gilded with reflective mirror foil, causing the closed book to disappear into its surrounding environment when placed on a polished plinth.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1800&auto=format&fit=crop",
        caption: "Catalogue Object — Mirror Gilded Edge & Vellum Overlay",
        aspect: "landscape",
        camera: "Leica SL2 · APO-Macro-Elmarit-TL 60mm · ISO 50",
        dimension: "47 MP"
      },
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?q=80&w=1600&auto=format&fit=crop",
        caption: "Spread 114 — Typographic Grid & Dual Inks",
        aspect: "landscape",
        camera: "Hasselblad X2D · 80mm · ISO 100",
        dimension: "100 MP"
      }
    ],
    credits: [
      { role: "Editorial Design & Direction", name: "Studio Frame & Form" },
      { role: "Head Curator", name: "Yuko Hasegawa" },
      { role: "Printing", name: "Nissha Printing / Kyoto" }
    ],
    awards: ["Tokyo TDC Annual Book Award", "AIGA 50 Books / 50 Covers"]
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
    summary: "A 20-minute speculative cinema piece on extreme solar radiation and post-oceanic habitats, projected on a 180° curved screen in the Arsenale.",
    description: "Selected for the official pavilion of the Venice Biennale, Solaris Redux combines 70mm large format cinematography with sub-bass infrasound transducers embedded beneath the gallery floor. The film follows a solitary scientific outpost on the edge of an evaporating salt lake as solar flares distort radio transmissions.",
    concept: "We explored how architectural cinema can evoke physical thermal sensations. Audience members experienced subtle temperature shifts and directional sub-harmonic vibrations timed to the film's solar events.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1800&auto=format&fit=crop",
        caption: "Still 01 — 70mm Solar Flare & Salt Flat Horizon",
        aspect: "landscape",
        camera: "IMAX MSM 9802 65mm 15-perf · 50mm Lens · Kodak Vision3 50D",
        dimension: "70mm Film Scan 12K"
      },
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
        caption: "Still 02 — Geothermal Sensor Array at Sunset",
        aspect: "landscape",
        camera: "ARRI 765 65mm · 80mm Lens · ISO 100",
        dimension: "8K Cine Scan"
      }
    ],
    credits: [
      { role: "Director & Visual Artist", name: "Kaelen Vane" },
      { role: "Sound Design & Spatial Acoustics", name: "Tim Hecker" },
      { role: "Pavilion Commissioner", name: "Lesley Lokko" }
    ],
    awards: ["Venice Biennale Special Mention", "IDFA Experimental Documentary Award"]
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
    summary: "A modular wayfinding and spatial typography system cast in bush-hammered terrazzo and acid-etched raw bronze for the Barbican estate.",
    description: "Commissioned as part of the Barbican Renewal initiative, Echoes of Brutalism provides a renewed visual navigation hierarchy that respects the heroic concrete architecture of Chamberlin, Powell and Bon while enhancing accessibility across the labyrinthine multi-level complex.",
    concept: "We rejected surface-applied vinyl signage. Every directional marker is directly cast into modular concrete aggregate bricks or precision-milled bronze plates that age in harmony with the building's exterior patina.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1800&auto=format&fit=crop",
        caption: "Wayfinding Marker — Terrazzo Brick & Bronze Lettering",
        aspect: "portrait",
        camera: "Leica M11-P · APO-Summicron-M 50mm · ISO 64",
        dimension: "60 MP"
      },
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
        caption: "Highwalk Perspective & Vertical Directional Pylon",
        aspect: "landscape",
        camera: "Hasselblad H6D · 35mm · ISO 100",
        dimension: "100 MP"
      }
    ],
    credits: [
      { role: "Spatial Graphic Design", name: "Studio Frame & Form" },
      { role: "Architectural Lead", name: "Allies and Morrison" },
      { role: "Materials Foundry", name: "Vaught Bronze Works London" }
    ],
    awards: ["SEGD Global Design Award of Honor", "Design Week Award Best Wayfinding"]
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
    description: "Hyper-Flora digitizes 5,000 of the world's most endangered botanical specimens utilizing photogrammetry, computed tomography (CT scanning), and interactive shaders. Users navigate through microscopic leaf stomata, peel back cellular layers in real-time WebGL, and examine pollen grains at sub-micron scales.",
    concept: "We sought to create the world's most tactile digital botany experience. Custom audio synthesis generates responsive bio-acoustic feedback as visitors interact with virtual plant stems and petals.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1800&auto=format&fit=crop",
        caption: "Specimen 0042 — Interactive 3D Photogrammetry & Spectral Shader",
        aspect: "square",
        camera: "WebGL 3D Engine / Custom Volumetric Shader",
        dimension: "Real-time 4K / 60fps"
      },
      {
        url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1600&auto=format&fit=crop",
        caption: "Volumetric CT Scan — Internal Seed Pod Vascular System",
        aspect: "portrait",
        camera: "Bruker SkyScan 1272 Micro-CT",
        dimension: "High-Density Voxel Cloud"
      }
    ],
    credits: [
      { role: "Interactive Creative Director", name: "Kaelen Vane" },
      { role: "Lead 3D Shader Engineer", name: "Dmitri Ivanov" },
      { role: "Botany Curator", name: "Dr. Alistair Finch" }
    ],
    awards: ["FWA of the Month", "Webby Award Best Visual Design", "Awwwards Site of the Year Nominee"]
  }
];

export const ARCHIVE = [
  { id: "A-2026-01", year: 2026, title: "Neo-Monolith", client: "Vitra Architecture Institute", discipline: "Art Direction", location: "Basel / Tokyo", medium: "Hardcover Monograph, Spatial Installation", scope: "Comprehensive", slug: "neo-monolith" },
  { id: "A-2026-02", year: 2026, title: "Metric Dissolve", client: "Polestar Electric Vehicles", discipline: "Digital", location: "Gothenburg / Tokyo", medium: "In-Car Telemetry UI & Generative System", scope: "Global HMI", slug: "metric-dissolve" },
  { id: "A-2026-03", year: 2026, title: "Hyper-Flora", client: "Kew Gardens / Google Arts", discipline: "Digital", location: "London / Tokyo", medium: "WebGL Volumetric 3D Herbarium", scope: "Interactive", slug: "hyper-flora" },
  { id: "A-2025-01", year: 2025, title: "Chroma Vestige", client: "Bottega Veneta", discipline: "Photography", location: "Milan / Paris", medium: "Global Campaign & 16mm Art Film", scope: "Worldwide", slug: "chroma-vestige" },
  { id: "A-2025-02", year: 2025, title: "Silent Frequencies", client: "Bang & Olufsen", discipline: "Branding", location: "Copenhagen / Zurich", medium: "Identity System & Sound Lab", scope: "Brand Suite", slug: "silent-frequencies" },
  { id: "A-2025-03", year: 2025, title: "Synthetic Botany", client: "Nat. Museum of Nature & Science", discipline: "Photography", location: "Reykjavík / Tokyo", medium: "Large Format Macrochromes", scope: "Exhibition", slug: "synthetic-botany" },
  { id: "A-2025-04", year: 2025, title: "Aura Archive", client: "Museum of Contemporary Art Tokyo", discipline: "Editorial", location: "Tokyo", medium: "520p Curatorial Monograph", scope: "Print & Identity", slug: "aura-archive" },
  { id: "A-2024-01", year: 2024, title: "Terra Incognita", client: "Acne Paper / Rizzoli", discipline: "Editorial", location: "Iceland / Atacama", medium: "400p Clothbound Book", scope: "Publishing", slug: "terra-incognita" },
  { id: "A-2024-02", year: 2024, title: "Kinetic Shadows", client: "NOWNESS / Biennale Danse", discipline: "Film", location: "Lyon / Berlin", medium: "35mm Spatial Cinema", scope: "Film & Sound", slug: "kinetic-shadows" },
  { id: "A-2024-03", year: 2024, title: "Tactile Void", client: "Aesop Skin Care", discipline: "Art Direction", location: "Kyoto / Paris", medium: "Spatial Flagship Interior & Identity", scope: "Architecture", slug: "tactile-void" },
  { id: "A-2024-04", year: 2024, title: "Echoes of Brutalism", client: "Barbican Centre London", discipline: "Branding", location: "London, UK", medium: "Bronze Wayfinding & Visual Identity", scope: "Wayfinding", slug: "echoes-of-brutalism" },
  { id: "A-2023-01", year: 2023, title: "Solaris Redux", client: "Venice Biennale of Architecture", discipline: "Film", location: "Venice / Atacama", medium: "70mm Multi-Sensory Pavilion", scope: "Art Exhibition", slug: "solaris-redux" },
  { id: "A-2023-02", year: 2023, title: "Sub-Zero Monograph", client: "Rimowa Luggage", discipline: "Editorial", location: "Cologne / Tokyo", medium: "Titanium Cased Monograph", scope: "Print Publication", slug: "neo-monolith" },
  { id: "A-2023-03", year: 2023, title: "Monochrome Phantasm", client: "Balenciaga", discipline: "Art Direction", location: "Paris / Los Angeles", medium: "Haute Couture Visual Direction", scope: "Runway & Campaign", slug: "chroma-vestige" },
  { id: "A-2022-01", year: 2022, title: "Sonic Obelisk", client: "Sony Music Masterworks", discipline: "Art Direction", location: "Tokyo / London", medium: "Sculptural Vinyl Box Set", scope: "Packaging & Film", slug: "silent-frequencies" },
  { id: "A-2022-02", year: 2022, title: "Nordic Tectonic", client: "Architectural Association London", discipline: "Photography", location: "Reykjavík / Oslo", medium: "Geological Survey & Prints", scope: "Exhibition", slug: "terra-incognita" },
  { id: "A-2021-01", year: 2021, title: "Zero Gravity Typography", client: "Tokyo TDC", discipline: "Branding", location: "Tokyo", medium: "Kinetic Font System & Campaign", scope: "Identity", slug: "metric-dissolve" }
];

export const CLIENTS = [
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
  { name: "Sony Music", category: "Sound & Recorded Arts", location: "Tokyo" },
  { name: "Balenciaga", category: "Fashion & Sculpture", location: "Paris" },
  { name: "Venice Biennale", category: "International Architecture", location: "Venice" }
];

export const AWARDS_LIST = [
  { year: "2026", title: "D&AD Yellow Pencil", project: "Neo-Monolith", category: "Spatial Design & Monograph" },
  { year: "2026", title: "UX Design Awards Gold", project: "Metric Dissolve", category: "Autonomous Interface" },
  { year: "2025", title: "Tokyo TDC Annual Award", project: "Aura Archive", category: "Book Design & Typography" },
  { year: "2025", title: "Red Dot Best of the Best", project: "Silent Frequencies", category: "Sound & Spatial Identity" },
  { year: "2025", title: "Clio Fashion Grand Prix", project: "Chroma Vestige", category: "Art Direction & Film" },
  { year: "2024", title: "Venice Biennale Special Mention", project: "Solaris Redux", category: "Atmospheric Cinema" },
  { year: "2024", title: "German Photobook Award Gold", project: "Terra Incognita", category: "Landscape Monograph" },
  { year: "2024", title: "SEGD Global Honor Award", project: "Echoes of Brutalism", category: "Wayfinding & Brutalist Type" },
  { year: "2023", title: "Frame Awards Retail of the Year", project: "Tactile Void", category: "Spatial Architecture" },
  { year: "2023", title: "FWA of the Year Nominee", project: "Hyper-Flora", category: "Real-time WebGL" }
];

export const EXHIBITIONS = [
  { year: "2026", title: "Tension & Monolith", venue: "Vitra Design Museum", location: "Weil am Rhein, Germany" },
  { year: "2025", title: "Aura: 30 Years of Ephemeral Light", venue: "Museum of Contemporary Art Tokyo", location: "Tokyo, Japan" },
  { year: "2024", title: "Biennale Architettura 2024 (Pavilion of Solaris)", venue: "Arsenale di Venezia", location: "Venice, Italy" },
  { year: "2023", title: "Silent Surfaces & Geological Scars", venue: "Kunsthaus Zürich", location: "Zurich, Switzerland" },
  { year: "2022", title: "Raw Aggregates & Kinetic Type", venue: "Barbican Curve Gallery", location: "London, UK" },
  { year: "2021", title: "The Cryogenic Garden", venue: "Harpa Concert & Art Center", location: "Reykjavík, Iceland" }
];

export const CRITICAL_RECEPTION = [
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

export const MANIFESTO_PARAGRAPHS = [
  {
    num: "01",
    heading: "The Brutalism of Reduction",
    body: "We construct visual worlds through uncompromising reduction. A frame is not a decorative container; it is an architectural incision into chaotic space. When unnecessary ornamentation is eliminated, what remains is the raw materiality of form, light, and geometry."
  },
  {
    num: "02",
    heading: "Materiality in the Digital Vacuum",
    body: "Digital experiences must carry the physical weight of cast concrete and the tactile resistance of unbleached cotton paper. We engineer interfaces with mathematical precision, spatial depth, and tactile audio feedback that anchor virtual spaces in visceral reality."
  },
  {
    num: "03",
    heading: "Typography as Structural Mass",
    body: "Letterforms are architectural columns. We treat typography not merely as legible text, but as monumental mass that dictates visual rhythm, ocular pacing, and emotional gravity."
  },
  {
    num: "04",
    heading: "Light as Ephemeral Geometry",
    body: "Photography is the documentation of time colliding with mineral matter. Whether directing high-fashion campaigns in Paris or geological expeditions across volcanic fault lines, we seek out moments where natural and synthetic illumination sculpt new spatial dimensions."
  }
];
