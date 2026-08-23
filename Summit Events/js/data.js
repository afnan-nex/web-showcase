/**
 * SUMMIT EVENTS — SEED DATA
 * Curated high-impact events, venues, organizers, and promo codes.
 */

const SEED_VENUES = [
  {
    id: "venue-1",
    name: "The Apex Arena & Amphitheatre",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    address: "500 Horizon Boulevard, Mission Bay, San Francisco, CA 94158",
    capacity: "18,500",
    type: "Arena",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    description: "San Francisco's premier modern architectural arena with acoustic perfection, panoramic bay views, and world-class production facilities.",
    transit: "Muni T-Third Line (Mission Bay stop) or Caltrain 4th & King (10-min walk)",
    parking: "On-site multi-level parking garage (Pre-booking recommended)",
    amenities: ["VIP Sky Lounges", "Gourmet Concessions", "EV Charging", "Full ADA Accessibility", "Acoustic Shielding"]
  },
  {
    id: "venue-2",
    name: "Lumina Glasshouse & Innovation Center",
    city: "New York",
    state: "NY",
    country: "USA",
    address: "240 Hudson Yards Promenade, New York, NY 10001",
    capacity: "4,200",
    type: "Conference Center",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    description: "An editorial glass-enclosed space overlooking Manhattan skyline, designed for transformative technology keynotes, summits, and symposiums.",
    transit: "Subway 7 Train to 34th St - Hudson Yards",
    parking: "Hudson Yards underground valet and self-park",
    amenities: ["Ultra-High Speed Fiber", "Simultaneous Interpretation Booths", "Private Boardrooms", "Rooftop Terrace"]
  },
  {
    id: "venue-3",
    name: "Neon Warehouse District — Hall 4",
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    address: "Holzmarktstraße 25, 10243 Berlin, Germany",
    capacity: "3,800",
    type: "Warehouse & Club",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    description: "Raw industrial architecture infused with brutalist lighting, massive Funktion-One sound systems, and multi-tier mezzanine viewing galleries.",
    transit: "S-Bahn / U-Bahn Warschauer Straße or Ostbahnhof",
    parking: "Public street parking / Bike racks on perimeter",
    amenities: ["Immersive Lighting Rig", "Outdoor Courtyard", "Safe Space Policy", "Coat Check"]
  },
  {
    id: "venue-4",
    name: "The Grand Conservatory Hall",
    city: "London",
    state: "Greater London",
    country: "UK",
    address: "Kensington Gore, South Kensington, London SW7 2AP, UK",
    capacity: "5,500",
    type: "Historic Theatre & Hall",
    image: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80",
    description: "Historic Victorian domed amphitheater with majestic tiered seating, warm wood finishes, and celebrated classical and modern acoustics.",
    transit: "London Underground: South Kensington or High Street Kensington",
    parking: "Imperial College Car Park (restricted hours)",
    amenities: ["Royal Tier Boxes", "Champagne Bar", "Audio Description Loops", "Historic Archives"]
  },
  {
    id: "venue-5",
    name: "Horizon Tech Campus — Auditorium X",
    city: "Austin",
    state: "TX",
    country: "USA",
    address: "1100 Congress Avenue, Downtown Austin, TX 78701",
    capacity: "2,600",
    type: "Tech Hub & Auditorium",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    description: "Austin's center for creative technology, startup showcases, venture pitch days, and interactive design hackathons.",
    transit: "CapMetro Rapid Bus 801 / 803 Downtown Stop",
    parking: "Congress Garage & Valet at front lobby",
    amenities: ["4K Laser Projection Array", "Livestream Broadcast Studio", "Networking Lounges", "Maker Lab"]
  },
  {
    id: "venue-6",
    name: "Pacific Dome Sports & Athletics Complex",
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    address: "1-3-61 Koraku, Bunkyo-ku, Tokyo 112-0004, Japan",
    capacity: "45,000",
    type: "Stadium & Arena",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    description: "Futuristic covered dome hosting international championship athletics, esports world finals, and stadium tours.",
    transit: "JR Chuo-Sobu Line (Suidobashi Station) or Marunouchi Line (Korakuen)",
    parking: "Underground Tokyo Dome City Parking",
    amenities: ["360-Degree LED Ribbon", "Esports Zero-Latency Grid", "Hospitality Suites", "Multi-Language Concierge"]
  }
];

const SEED_ORGANIZERS = [
  {
    id: "org-1",
    name: "Summit Collective",
    handle: "@summitcollective",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    category: "Music & Festivals",
    verified: true,
    rating: 4.95,
    eventsCount: 48,
    followersCount: "124K",
    bio: "Global creators of immersive electronic, ambient, and audiovisual live experiences. Designing sonic landscapes since 2018."
  },
  {
    id: "org-2",
    name: "FutureTech Global",
    handle: "@futuretech_global",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    category: "Technology & AI",
    verified: true,
    rating: 4.92,
    eventsCount: 32,
    followersCount: "89K",
    bio: "Curating cutting-edge summits on Artificial Intelligence, frontier engineering, quantum computing, and ethical innovation."
  },
  {
    id: "org-3",
    name: "Apex Athletic Federation",
    handle: "@apexathletics",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    category: "Sports & Fitness",
    verified: true,
    rating: 4.88,
    eventsCount: 26,
    followersCount: "62K",
    bio: "Organizers of elite extreme sports invitationals, endurance marathons, and esports championship tournaments."
  },
  {
    id: "org-4",
    name: "Atelier Studio & Design Guild",
    handle: "@atelierdesign",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    category: "Workshops & Arts",
    verified: true,
    rating: 4.98,
    eventsCount: 65,
    followersCount: "45K",
    bio: "Masterclass intensives and hands-on workshops in typography, generative art, UX architecture, and tactile industrial design."
  },
  {
    id: "org-5",
    name: "Venture Pulse Network",
    handle: "@venturepulse",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    category: "Networking & Business",
    verified: true,
    rating: 4.85,
    eventsCount: 40,
    followersCount: "78K",
    bio: "Connecting founders, venture capitalists, angel syndicates, and innovators through high-impact curated networking roundtables."
  },
  {
    id: "org-6",
    name: "Symphonia Modern Arts",
    handle: "@symphoniamodern",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=80",
    category: "Concerts & Classical",
    verified: true,
    rating: 4.97,
    eventsCount: 19,
    followersCount: "53K",
    bio: "Bridging orchestral classical composition with cinematic synth arrangements and modular acoustic explorations."
  }
];

const SEED_EVENTS = [
  {
    id: "evt-101",
    title: "SYNTHESIS: Sonic & Audiovisual Biennale 2026",
    tagline: "48 Hours of Continuous Ambient, Modular Synthesizer & Spatial Sound Installations",
    slug: "synthesis-biennale-2026",
    category: "concerts",
    categoryLabel: "Concert / Festival",
    badge: "Featured Headline",
    accentColor: "#FF3366",
    secondaryColor: "#1a0814",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=85",
    date: "2026-09-18",
    endDate: "2026-09-20",
    dateDisplay: "Sep 18 – 20, 2026",
    timeDisplay: "Doors 18:00 • Starts 19:30 PST",
    doorTime: "18:00 PST",
    duration: "3 Days / 48 Hours",
    venueId: "venue-1",
    venueName: "The Apex Arena & Amphitheatre",
    city: "San Francisco",
    state: "CA",
    address: "500 Horizon Boulevard, San Francisco, CA",
    organizerId: "org-1",
    organizerName: "Summit Collective",
    priceRange: "$85 – $340",
    minPrice: 85,
    maxPrice: 340,
    ageRestriction: "18+ (Valid Gov ID required)",
    description: `SYNTHESIS 2026 is an uncompromising celebration of electronic sound synthesis, spatial multi-channel audio, and monumental light sculpture. Gathering over 40 boundary-pushing artists across three expansive stages, SYNTHESIS transforms The Apex Arena into a dynamic living canvas of kinetic lasers, sub-bass architecture, and live hardware improvisation.\n\nFeaturing world-premiere collaborative sets between legendary modular synthesizer pioneers and emerging avant-garde electronic producers, this edition introduces a custom 360-degree d&b Soundscape spatial system that places every sonic frequency in three-dimensional space around you.`,
    highlights: [
      "Custom 64-channel 360° Spatial Audio sound system",
      "World premiere audiovisual performance by Kiasmos & Rival Consoles",
      "Interactive hardware synthesizer testing pavilion with Moog & Elektron",
      "Midnight ambient dome with reclining floor seating",
      "Curated local artisan food market & natural wine bars"
    ],
    lineup: [
      {
        name: "Max Cooper",
        role: "Live 3D AV Experience",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        bio: "Pioneering British electronic producer and computational biologist blending hyper-detailed sound design with biological visualizations."
      },
      {
        name: "Suzanne Ciani & Nils Frahm",
        role: "Modular Keynote Duo",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Historic meeting of the legendary Buchla electronic pioneer and the acclaimed modern neoclassical pianist."
      },
      {
        name: "Jon Hopkins",
        role: "Music for Psychedelic Therapy Live",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        bio: "Grammy-nominated ambient master performing immersive spatial compositions."
      },
      {
        name: "Kelly Lee Owens",
        role: "Live Techno Performance",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        bio: "Welsh electronic artist fusing ethereal dream-pop melodies with driving, minimalist techno grooves."
      }
    ],
    schedule: [
      {
        day: "Day 1 — Friday, Sep 18",
        items: [
          { time: "18:00", title: "Gates Open & Ambient Pavilion Unveiling", stage: "Main Foyer" },
          { time: "19:30", title: "Suzanne Ciani (Quadraphonic Buchla Set)", stage: "Acoustic Sphere" },
          { time: "21:15", title: "Kelly Lee Owens (Live Synthesizers)", stage: "Apex Mainstage" },
          { time: "23:00", title: "Jon Hopkins (Midnight Spatial Odyssey)", stage: "Apex Mainstage" }
        ]
      },
      {
        day: "Day 2 — Saturday, Sep 19",
        items: [
          { time: "14:00", title: "Hardware Modular Patching Masterclass", stage: "Lab & Studio" },
          { time: "17:30", title: "Nils Frahm (Solo Piano & Rhodes)", stage: "Acoustic Sphere" },
          { time: "20:30", title: "Max Cooper (Live 3D Generative AV)", stage: "Apex Mainstage" },
          { time: "23:30", title: "Closing All-Star B2B Hardware Jam", stage: "Underground Vault" }
        ]
      }
    ],
    ticketTiers: [
      {
        id: "tier-ga-single",
        name: "General Admission — Single Day",
        price: 85,
        fee: 9.50,
        description: "Full access to Mainstage, Acoustic Sphere, and Food Pavilion for one selected day.",
        available: 120,
        perks: ["Access to all general stages", "Commemorative fabric wristband", "Digital set recordings"]
      },
      {
        id: "tier-ga-weekend",
        name: "Full Weekend Festival Pass",
        price: 185,
        fee: 14.00,
        description: "Unrestricted entry for all 3 days and 48 hours of programming.",
        available: 45,
        perks: ["3-Day uninterrupted entry", "Re-entry privileges", "Digital event soundboard stems"]
      },
      {
        id: "tier-vip-seated",
        name: "VIP Golden Circle (Tier 1 Seated)",
        price: 340,
        fee: 22.00,
        description: "Reserved premium seated view in the prime acoustic sweet-spot with exclusive lounge access.",
        available: 18,
        requiresSeatMap: true,
        perks: ["Guaranteed center seat selection", "VIP Sky Lounge & Complimentary Bar", "Fast-track priority entry", "Signed festival poster"]
      }
    ],
    faqs: [
      { q: "Is there re-entry allowed?", a: "Weekend pass holders and VIP ticket holders have unlimited re-entry privileges with wristband scan." },
      { q: "Are professional cameras permitted?", a: "Non-commercial point-and-shoot cameras and smartphones are welcome. DSLRs with detachable lenses require press accreditation." },
      { q: "What is the refund policy?", a: "Tickets are refundable up to 14 days prior to the event date. Self-service ticket transfers are supported directly in your Summit account." }
    ]
  },
  {
    id: "evt-102",
    title: "NEURAL 2026: Frontier AI & Autonomous Systems Summit",
    tagline: "Where the World's Leading AI Researchers, Founders, and Systems Engineers Convene",
    slug: "neural-ai-summit-2026",
    category: "conferences",
    categoryLabel: "Conference",
    badge: "Keynote Series",
    accentColor: "#00E5FF",
    secondaryColor: "#04151f",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85",
    date: "2026-09-24",
    endDate: "2026-09-25",
    dateDisplay: "Sep 24 – 25, 2026",
    timeDisplay: "08:30 AM – 06:00 PM EST",
    doorTime: "08:00 AM EST",
    duration: "2 Full Days",
    venueId: "venue-2",
    venueName: "Lumina Glasshouse & Innovation Center",
    city: "New York",
    state: "NY",
    address: "240 Hudson Yards Promenade, New York, NY",
    organizerId: "org-2",
    organizerName: "FutureTech Global",
    priceRange: "$299 – $899",
    minPrice: 299,
    maxPrice: 899,
    ageRestriction: "All Ages / Industry Professional",
    description: `NEURAL 2026 is the flagship technical conference exploring the next horizon of machine intelligence: reasoning models, autonomous agentic swarms, embodied robotics, multimodal architectures, and sustainable computing infrastructure.\n\nOver 1,800 CTOs, research scientists, machine learning leads, and venture investors will gather at Lumina Glasshouse in Manhattan for high-density technical keynotes, unfiltered architecture breakdowns, and live hardware demonstrations.`,
    highlights: [
      "32 Deep-dive technical sessions and unrecorded fireside debates",
      "Live demonstrations of next-generation humanoid robotic actuators",
      "Curated 1-on-1 VC & Founder speed-dating sessions",
      "Exclusive evening networking gala at the Hudson Yards Skydeck",
      "Full access to post-conference technical whitepapers and code repositories"
    ],
    lineup: [
      {
        name: "Dr. Elena Rostova",
        role: "Chief Scientist @ SynthAI Lab",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        bio: "Leading research on self-supervised hierarchical reasoning and synthetic world models."
      },
      {
        name: "Marcus Sterling",
        role: "VP of Autonomous Agents @ Nexus Core",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        bio: "Architecting enterprise multi-agent workflows executing over 50M autonomous actions daily."
      },
      {
        name: "Aria Takahashi",
        role: "Director of Robotics @ Quantum Motion",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Pioneering end-to-end neural torque control for nimble humanoid manipulation."
      }
    ],
    schedule: [
      {
        day: "Day 1 — Sep 24: Architecture & Foundations",
        items: [
          { time: "08:30", title: "Breakfast & Badge Pickup", stage: "Grand Glass Gallery" },
          { time: "09:30", title: "Opening Keynote: The Post-Transformer Era", stage: "Auditorium Prime" },
          { time: "11:15", title: "Autonomous Agent Protocols & Safety Layers", stage: "Auditorium Prime" },
          { time: "14:00", title: "Breakout: Silicon Efficiency & Sub-1nm Packaging", stage: "Technical Stage B" },
          { time: "17:00", title: "Venture Roundtable & Cocktails", stage: "Skydeck Lounge" }
        ]
      },
      {
        day: "Day 2 — Sep 25: Embodied AI & Production",
        items: [
          { time: "09:00", title: "Live Robot Teleoperation Benchmark", stage: "Auditorium Prime" },
          { time: "11:00", title: "Enterprise Case Studies: Scaling to 100M Inference/Day", stage: "Auditorium Prime" },
          { time: "15:00", title: "Founder Pitch Finals ($2M Seed Prize)", stage: "Startup Pavilion" },
          { time: "17:30", title: "Closing Remarks & Networking Reception", stage: "Grand Glass Gallery" }
        ]
      }
    ],
    ticketTiers: [
      {
        id: "tier-academic",
        name: "Academic / Student Pass",
        price: 299,
        fee: 15.00,
        description: "Discounted admission for full-time researchers, university faculty, and graduate students.",
        available: 30,
        perks: ["Access to all talks and stages", "Catered lunch and coffee bars", "Digital session recordings"]
      },
      {
        id: "tier-standard-conf",
        name: "Standard Industry Delegate Pass",
        price: 549,
        fee: 28.00,
        description: "Full access to keynotes, workshops, startup showcases, and the delegate networking app.",
        available: 85,
        perks: ["All stage tracks", "Delegate networking tool", "Catered gourmet meals", "Conference swag bag"]
      },
      {
        id: "tier-executive-vip",
        name: "Executive VIP & Investor Pass (Seated Auditorium)",
        price: 899,
        fee: 45.00,
        description: "Front-row reserved seating, private speaker lounge access, and exclusive VIP Skydeck Gala invitation.",
        available: 12,
        requiresSeatMap: true,
        perks: ["Front Row Keynote Seating", "Access to Private Speaker Green Room", "Skydeck VIP Dinner & Gala", "1-on-1 meeting booking"]
      }
    ],
    faqs: [
      { q: "Will sessions be recorded?", a: "Yes, all keynotes and panel tracks will be available on-demand to ticket holders within 48 hours." },
      { q: "Is catering included?", a: "Yes, full breakfast, gourmet lunch buffet, and evening drinks are included with all ticket tiers." }
    ]
  },
  {
    id: "evt-103",
    title: "BERLIN ELEKTRONIK: Dark Room & Brutalist Echoes",
    tagline: "Pure Underground Techno, Spatial Monoliths & 140BPM Industrial Hypnosis",
    slug: "berlin-elektronik-2026",
    category: "concerts",
    categoryLabel: "Concert / Club",
    badge: "Night Event",
    accentColor: "#E040FB",
    secondaryColor: "#15051b",
    featured: true,
    isSeated: false,
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85",
    date: "2026-10-02",
    endDate: "2026-10-03",
    dateDisplay: "Oct 2, 2026",
    timeDisplay: "22:00 – 10:00 (Next Morning)",
    doorTime: "22:00 CET",
    duration: "12 Hours Non-Stop",
    venueId: "venue-3",
    venueName: "Neon Warehouse District — Hall 4",
    city: "Berlin",
    state: "Berlin",
    address: "Holzmarktstraße 25, Berlin, Germany",
    organizerId: "org-1",
    organizerName: "Summit Collective",
    priceRange: "$35 – $80",
    minPrice: 35,
    maxPrice: 80,
    ageRestriction: "21+ Strictly",
    description: `A tribute to the uncompromising sonic architecture of Berlin's legendary warehouse nightlife. ELEKTRONIK gathers 8 vanguard European techno live acts and DJs across two cavernous industrial floors. No phones on the dancefloor. Infinite kinetic energy.`,
    highlights: [
      "Strict no-photos policy with sticker-covered camera lenses",
      "Quad-stack Funktion-One Resolution 5 acoustic setup",
      "Strobe & monochrome industrial laser grid",
      "Outdoor fire pit garden and ambient chillout room"
    ],
    lineup: [
      { name: "Klangkuenstler", role: "Extended 4-Hour Live Set", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Industrial techno icon notorious for punishing kicks and frenetic acid baselines." },
      { name: "Paula Temple", role: "Hybrid Deconstructed Live", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", bio: "Noise manipulation virtuoso and electronic weapon innovator." },
      { name: "DVS1", role: "Curator & Resident", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", bio: "Purist vinyl selector delivering masterclasses in groove dynamics." }
    ],
    schedule: [
      {
        day: "Friday Night — Oct 2",
        items: [
          { time: "22:00", title: "Doors & Warmup: Deep Sub Focus", stage: "Floor 1 (Warehouse)" },
          { time: "01:00", title: "Paula Temple (Hybrid Live Set)", stage: "Floor 1 (Warehouse)" },
          { time: "03:30", title: "Klangkuenstler (Extended Midnight Set)", stage: "Floor 1 (Warehouse)" },
          { time: "07:30", title: "DVS1 Sunrise Closing Session", stage: "Floor 2 (Glasshouse)" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-early-club", name: "Early Arrival (Entry Before 23:30)", price: 35, fee: 4.50, description: "Valid for entry between 22:00 and 23:30 sharp.", available: 60, perks: ["Priority early queue", "Free coat check"] },
      { id: "tier-anytime-club", name: "General Entry (Anytime Pass)", price: 55, fee: 6.00, description: "Valid for entry at any time throughout the 12-hour session.", available: 150, perks: ["Full venue access", "Re-entry after 05:00"] },
      { id: "tier-backstage-club", name: "Backstage & Artist Gallery Pass", price: 80, fee: 8.00, description: "Elevated viewing mezzanine behind the DJ booth with private bar.", available: 20, perks: ["Backstage booth access", "Separate VIP entrance & coat check", "2 Drink vouchers"] }
    ],
    faqs: [
      { q: "Is there a dress code?", a: "Express yourself freely. Black/minimalist/comfortable footwear strongly recommended." },
      { q: "Can I take pictures?", a: "No. Stickers will be placed over all phone cameras at the door to preserve the immersive sanctuary." }
    ]
  },
  {
    id: "evt-104",
    title: "TYPE & SYSTEM: International Typography & Brand Masterclass",
    tagline: "Hands-on Generative Typography, Editorial Layouts, and Kinetic Branding Systems",
    slug: "type-and-system-masterclass-2026",
    category: "workshops",
    categoryLabel: "Workshop",
    badge: "Limited 60 Seats",
    accentColor: "#FFB300",
    secondaryColor: "#1a1303",
    featured: false,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=85",
    date: "2026-10-10",
    endDate: "2026-10-11",
    dateDisplay: "Oct 10 – 11, 2026",
    timeDisplay: "10:00 AM – 05:00 PM CST",
    doorTime: "09:30 AM CST",
    duration: "2 Days (14 Hours Intensive)",
    venueId: "venue-5",
    venueName: "Horizon Tech Campus — Auditorium X",
    city: "Austin",
    state: "TX",
    address: "1100 Congress Avenue, Austin, TX",
    organizerId: "org-4",
    organizerName: "Atelier Studio & Design Guild",
    priceRange: "$350 – $600",
    minPrice: 350,
    maxPrice: 600,
    ageRestriction: "All Ages / Designers & Creative Directors",
    description: `A deeply immersive, project-driven design workshop for typography obsessives and senior designers. Over two days, participants build responsive variable fonts, code generative CSS type animations, and construct high-end editorial book layouts with industry leaders.`,
    highlights: [
      "Small cohort capped at 60 participants for personalized feedback",
      "License to 12 premium commercial typeface families ($2,400 retail value)",
      "Hands-on Glyphs 3 and variable font coding exercises",
      "Portfolio critique session with top Swiss and Tokyo foundry founders"
    ],
    lineup: [
      { name: "Lucas De Groot", role: "Typeface Master & Founder", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Legendary type designer behind Calibri, Thesis, and countless bespoke identity fonts." },
      { name: "Kasia Krol", role: "Creative Director @ Dinamo", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", bio: "Leading contemporary variable font branding systems for international cultural institutions." }
    ],
    schedule: [
      {
        day: "Day 1: Letterform Geometry & Variable Axes",
        items: [
          { time: "10:00", title: "Historical Grid Systems & Radical Modernism", stage: "Design Lab 1" },
          { time: "13:00", title: "Catered Studio Lunch & Font Sharing", stage: "Lounge" },
          { time: "14:30", title: "Live Exercise: Drawing Bézier Curves with Extreme Tension", stage: "Design Lab 1" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-workshop-seat", name: "Standard Masterclass Seat", price: 350, fee: 18.00, description: "Includes desk seat, software licences, materials, and lunch both days.", available: 14, perks: ["Full 2-day workshop access", "Typeface licenses included", "Catered lunches", "Physical typography specimen book"] },
      { id: "tier-workshop-vip", name: "Masterclass + 1-on-1 Studio Critique", price: 600, fee: 30.00, description: "Includes everything in standard plus a dedicated 45-min private portfolio review.", available: 4, perks: ["Everything in standard", "45-min private review with Lucas De Groot", "Dinner with instructors"] }
    ],
    faqs: [
      { q: "What hardware should I bring?", a: "Please bring a laptop with macOS or Windows. We will supply temporary Glyphs / Illustrator licenses." }
    ]
  },
  {
    id: "evt-105",
    title: "WORLD APEX: Extreme Downhill & Urban Freeride Championship",
    tagline: "International Urban MTB & Freeride Invitational Through High-Speed Concrete Canyons",
    slug: "world-apex-urban-freeride-2026",
    category: "sports",
    categoryLabel: "Sports & Athletics",
    badge: "World Championship",
    accentColor: "#00E676",
    secondaryColor: "#021a0c",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=85",
    date: "2026-10-17",
    endDate: "2026-10-18",
    dateDisplay: "Oct 17 – 18, 2026",
    timeDisplay: "13:00 – 21:00 JST",
    doorTime: "11:30 JST",
    duration: "2 Days",
    venueId: "venue-6",
    venueName: "Pacific Dome Sports & Athletics Complex",
    city: "Tokyo",
    state: "Tokyo",
    address: "1-3-61 Koraku, Bunkyo-ku, Tokyo, Japan",
    organizerId: "org-3",
    organizerName: "Apex Athletic Federation",
    priceRange: "$45 – $220",
    minPrice: 45,
    maxPrice: 220,
    ageRestriction: "All Ages (Family Friendly)",
    description: `Watch the world's most fearless riders descend down a custom-built 4-story urban obstacle mega-ramp with 60-foot aerial gap jumps inside the iconic Pacific Dome in Tokyo. Featuring 32 world-ranked athletes competing in Best Trick, Speed Downhill, and Slopestyle.`,
    highlights: [
      "Spectacular 60ft indoor mega-ramp jump line",
      "Live telemetry screens showing rider speed and G-force",
      "Athlete pit walk and signing sessions",
      "Interactive pump track for kids and spectators"
    ],
    lineup: [
      { name: "Brandon Semenuk", role: "Defending World Champion", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", bio: "5-time Red Bull Rampage winner pushing the absolute limit of slopestyle perfection." },
      { name: "Emil Johansson", role: "Slopestyle Phenom", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Swedish rider with undefeated trick precision." }
    ],
    schedule: [
      {
        day: "Saturday, Oct 17: Qualifications",
        items: [
          { time: "13:00", title: "Practice & Telemetry Calibration", stage: "Main Dome Arena" },
          { time: "16:00", title: "Downhill Speed Runs: Round of 32", stage: "Main Dome Arena" },
          { time: "19:30", title: "Night Whip-Off & Best Whip Contest", stage: "Mega-Jump Feature" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-grandstand-ga", name: "Grandstand General Admission", price: 45, fee: 5.00, description: "Unreserved grandstand seating with clear views of the full mega-course.", available: 400, perks: ["Grandstand access", "Course big-screen viewing"] },
      { id: "tier-finish-bowl", name: "Finish Line Lower Bowl (Seated)", price: 110, fee: 11.00, description: "Reserved lower tier seat right at the final drop and jump landing zone.", available: 50, requiresSeatMap: true, perks: ["Reserved seat at jump landing", "Pit walk pass included"] },
      { id: "tier-vip-athletes", name: "VIP Rider Lounge & Pit Access", price: 220, fee: 18.00, description: "All-inclusive hospitality lounge, buffet, and behind-the-scenes athlete staging access.", available: 15, perks: ["VIP Lounge & Bar", "Behind the scenes pit pass", "Signed commemorative jersey"] }
    ],
    faqs: [
      { q: "Are earplugs needed?", a: "Sound levels are moderate, but complimentary earplugs are provided at all information desks." }
    ]
  },
  {
    id: "evt-106",
    title: "VENTURE HORIZONS: Global Founders & Angel Syndicate 2026",
    tagline: "High-Density Networking, $50M Syndicate Matchmaking & Curated Dealmaking",
    slug: "venture-horizons-summit-2026",
    category: "networking",
    categoryLabel: "Networking & Business",
    badge: "Invite & Curated",
    accentColor: "#7C4DFF",
    secondaryColor: "#0f081e",
    featured: true,
    isSeated: false,
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=85",
    date: "2026-10-22",
    endDate: "2026-10-22",
    dateDisplay: "Oct 22, 2026",
    timeDisplay: "14:00 – 21:30 PST",
    doorTime: "13:30 PST",
    duration: "1 Afternoon & Evening Gala",
    venueId: "venue-1",
    venueName: "The Apex Arena & Amphitheatre",
    city: "San Francisco",
    state: "CA",
    address: "500 Horizon Boulevard, San Francisco, CA",
    organizerId: "org-5",
    organizerName: "Venture Pulse Network",
    priceRange: "$175 – $495",
    minPrice: 175,
    maxPrice: 495,
    ageRestriction: "21+",
    description: `A curated networking summit bringing together 400 vetted early-stage founders with 150 top-tier angel investors, family offices, and Tier-1 venture partners. No stale panel discussions: 100% structured speed-networking, lightning pitches, and closed-door dining.`,
    highlights: [
      "Algorithmic 1-on-1 Founder & Investor matchmaking tables",
      "Over $50M in committed syndicate capital participating",
      "Cocktail reception overlooking San Francisco Bay",
      "Private deal-closing suites with NDA confidentiality support"
    ],
    lineup: [
      { name: "Seraphina Vance", role: "Managing Partner @ Apex Ventures", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", bio: "Leading early-stage investments across frontier software, climate tech, and developer infrastructure." },
      { name: "Devon Chen", role: "3x Unicorn Founder & Angel", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Angel investor with 45+ exits and founder of cloud security platforms." }
    ],
    schedule: [
      {
        day: "Thursday, Oct 22",
        items: [
          { time: "14:00", title: "Registration & Matchmaking App Onboarding", stage: "Bayview Lounge" },
          { time: "15:00", title: "Round 1: Speed Matchmaking (10-min sprints)", stage: "Syndicate Hall" },
          { time: "17:30", title: "Curated Lightning Pitches (Top 10 Finalists)", stage: "Main Amphitheatre" },
          { time: "19:00", title: "Executive Dinner & Wine Reception", stage: "Bayview Terrace" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-founder-pass", name: "Vetted Founder Pass", price: 175, fee: 12.00, description: "Includes guaranteed minimum of 6 curated 1-on-1 investor meetings.", available: 40, perks: ["6+ Scheduled 1-on-1 meetings", "Access to investor directory", "Cocktail dinner reception"] },
      { id: "tier-investor-pass", name: "Angel & VC Partner Pass", price: 495, fee: 25.00, description: "Unrestricted access to all founder pitch decks, private deal rooms, and VIP dinner.", available: 25, perks: ["Access to all 400 founder profiles", "Private meeting suite", "VIP Dinner & Premium Bar"] }
    ],
    faqs: [
      { q: "How are meetings matched?", a: "Our proprietary matching algorithm aligns your industry, stage, and cheque size before the event." }
    ]
  },
  {
    id: "evt-107",
    title: "NEO-CLASSICAL ODE: Max Richter & 40-Piece Symphony",
    tagline: "Vivaldi Recomposed & The Blue Notebooks Performed Live in Architectural Splendor",
    slug: "max-richter-symphony-london-2026",
    category: "concerts",
    categoryLabel: "Concert / Classical",
    badge: "Orchestral Special",
    accentColor: "#F59E0B",
    secondaryColor: "#171004",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=800&q=85",
    date: "2026-11-06",
    endDate: "2026-11-06",
    dateDisplay: "Nov 6, 2026",
    timeDisplay: "19:30 – 22:30 GMT",
    doorTime: "18:30 GMT",
    duration: "3 Hours with Intermission",
    venueId: "venue-4",
    venueName: "The Grand Conservatory Hall",
    city: "London",
    state: "Greater London",
    address: "Kensington Gore, London SW7 2AP, UK",
    organizerId: "org-6",
    organizerName: "Symphonia Modern Arts",
    priceRange: "$65 – $240",
    minPrice: 65,
    maxPrice: 240,
    ageRestriction: "All Ages (Recommended 8+)",
    description: `Experience the breathtaking majesty of composer Max Richter performing his modern masterpieces 'Vivaldi Recomposed' and 'The Blue Notebooks' alongside the 40-piece London Contemporary Philharmonic Orchestra beneath the soaring Victorian dome of The Grand Conservatory Hall.`,
    highlights: [
      "Full 40-piece philharmonic orchestra with bespoke analog synth integration",
      "Acoustic perfection in one of London's most historic auditoriums",
      "Solo violin virtuosity by Mari Samuelsen",
      "Commemorative embossed vinyl program booklet for all attendees"
    ],
    lineup: [
      { name: "Max Richter", role: "Piano, Moog Synthesizer & Direction", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Celebrated British-German neoclassical and cinematic score composer." },
      { name: "Mari Samuelsen", role: "Soloist Violin", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", bio: "Norwegian violinist renowned for breathtaking modern dynamic technique." }
    ],
    schedule: [
      {
        day: "Friday, Nov 6",
        items: [
          { time: "18:30", title: "Doors Open & Champagne Bar in Rotunda", stage: "Grand Rotunda" },
          { time: "19:30", title: "Part 1: The Blue Notebooks (Complete Suite)", stage: "Main Hall" },
          { time: "20:45", title: "Intermission", stage: "Grand Rotunda" },
          { time: "21:15", title: "Part 2: Vivaldi Recomposed (Spring, Summer, Autumn, Winter)", stage: "Main Hall" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-balcony", name: "Upper Balcony Tier", price: 65, fee: 7.00, description: "Elevated panoramic acoustics from the historic gallery.", available: 80, requiresSeatMap: true, perks: ["Historic gallery seat", "Printed programme"] },
      { id: "tier-stalls", name: "Grand Stalls (Orchestra Floor)", price: 140, fee: 12.00, description: "Prime central ground-floor seating near the orchestra pit.", available: 45, requiresSeatMap: true, perks: ["Grand stalls seat", "Optimal acoustic axis", "Embossed programme"] },
      { id: "tier-royal-box", name: "Royal Tier Private Box (Seated)", price: 240, fee: 20.00, description: "Private elevated tier box with dedicated champagne butler service.", available: 8, requiresSeatMap: true, perks: ["Private box seating", "Glass of Laurent-Perrier Champagne", "Fast-track entrance", "Signed vinyl record"] }
    ],
    faqs: [
      { q: "Is late seating permitted?", a: "Latecomers will only be admitted during the first pause between musical movements." }
    ]
  },
  {
    id: "evt-108",
    title: "ETH & PROTOCOL: Decentralized Infrastructure Congress",
    tagline: "Cryptographic Proofs, Zero-Knowledge Rollups, and Peer-to-Peer Computing",
    slug: "eth-and-protocol-congress-2026",
    category: "conferences",
    categoryLabel: "Conference",
    badge: "Developer Congress",
    accentColor: "#3D5AFE",
    secondaryColor: "#050d24",
    featured: false,
    isSeated: false,
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=800&q=85",
    date: "2026-11-14",
    endDate: "2026-11-16",
    dateDisplay: "Nov 14 – 16, 2026",
    timeDisplay: "09:00 AM – 07:00 PM CET",
    doorTime: "08:30 AM CET",
    duration: "3 Full Days",
    venueId: "venue-3",
    venueName: "Neon Warehouse District — Hall 4",
    city: "Berlin",
    state: "Berlin",
    address: "Holzmarktstraße 25, Berlin, Germany",
    organizerId: "org-2",
    organizerName: "FutureTech Global",
    priceRange: "$150 – $420",
    minPrice: 150,
    maxPrice: 420,
    ageRestriction: "All Ages",
    description: `The premier technical congress for distributed systems engineers, zero-knowledge cryptographers, and protocol architects. 3 days of code sprints, peer-reviewed technical papers, and open-source infrastructure building.`,
    highlights: [
      "48-hour decentralized hackathon with $150,000 in developer bounties",
      "Deep-dive cryptography workshops on STARKs, SNARKs, and multi-party computation",
      "Decentralized governance debates and public goods funding"
    ],
    lineup: [
      { name: "Alexandre Moreau", role: "Lead Cryptographer @ ZK Rollup Lab", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Pioneering recursive zero-knowledge proofs for trustless cross-chain verification." }
    ],
    schedule: [
      {
        day: "Day 1: Cryptographic Primitives",
        items: [
          { time: "09:00", title: "Opening Address: The State of Verifiable Compute", stage: "Monolith Stage" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-hacker", name: "Hacker / Builder Pass", price: 150, fee: 10.00, description: "Includes full hackathon entry, 24-hour venue access, food, and drinks.", available: 75, perks: ["Hackathon participation", "Mentorship access", "24/7 Hacker Lounge"] },
      { id: "tier-full-congress", name: "Full Congress & Workshop Pass", price: 420, fee: 22.00, description: "Access to all research tracks, breakout sessions, and official networking dinners.", available: 50, perks: ["All stage tracks", "Workshop reservations", "Official Gala Dinner"] }
    ],
    faqs: [
      { q: "Is remote streaming available?", a: "Keynotes are streamed freely, but workshops and hackathons are exclusively in-person." }
    ]
  },
  {
    id: "evt-109",
    title: "CREATIVE CODE & SHADERS: Generative Art Lab",
    tagline: "WebGL, GLSL Fragment Shaders, Real-Time GPU Graphics & Kinetic Audio Reactivity",
    slug: "creative-code-shaders-workshop-2026",
    category: "workshops",
    categoryLabel: "Workshop",
    badge: "Interactive Lab",
    accentColor: "#00E5FF",
    secondaryColor: "#02151c",
    featured: false,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
    date: "2026-11-21",
    endDate: "2026-11-22",
    dateDisplay: "Nov 21 – 22, 2026",
    timeDisplay: "10:00 AM – 06:00 PM EST",
    doorTime: "09:30 AM EST",
    duration: "2 Intensive Days",
    venueId: "venue-2",
    venueName: "Lumina Glasshouse & Innovation Center",
    city: "New York",
    state: "NY",
    address: "240 Hudson Yards Promenade, New York, NY",
    organizerId: "org-4",
    organizerName: "Atelier Studio & Design Guild",
    priceRange: "$280 – $450",
    minPrice: 280,
    maxPrice: 450,
    ageRestriction: "All Ages",
    description: `Master the art of real-time GPU shader programming. Learn how to write raw GLSL raymarching math, simulation noise algorithms, and WebGPU compute shaders that react dynamically to live microphone input and MIDI signals.`,
    highlights: [
      "Write your own procedural 3D raymarched universe from scratch",
      "Hook up live audio input to create interactive audiovisual sculptures",
      "Full repository of boilerplates, math cheatsheets, and shader packs"
    ],
    lineup: [
      { name: "Inigo Quilez (Guest Session)", role: "Shader Legend & Mathematician", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Creator of Shadertoy and master of distance field mathematics." }
    ],
    schedule: [
      {
        day: "Day 1: Shader Foundations & Signed Distance Fields",
        items: [
          { time: "10:00", title: "Fragment Shaders: Vector Math & Coordinate Spaces", stage: "Code Lab A" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-shader-lab", name: "Hands-on Lab Ticket", price: 280, fee: 14.00, description: "Includes desk, high-speed power/ethernet, and 1-year shader library access.", available: 30, perks: ["Desk setup & WiFi", "Shader starter pack", "Lunch included"] }
    ],
    faqs: [
      { q: "Do I need prior shader experience?", a: "Basic JavaScript or coding experience is recommended; no prior GLSL shader knowledge is required." }
    ]
  },
  {
    id: "evt-110",
    title: "PACIFIC ESPORTS: Global Apex Legends & Valorant Invitational",
    tagline: "16 Elite Squads Competing for $1,000,000 Live on the 360-Degree LED Stage",
    slug: "pacific-esports-invitational-2026",
    category: "sports",
    categoryLabel: "Esports & Sports",
    badge: "$1M Prize Pool",
    accentColor: "#FF1744",
    secondaryColor: "#1d0208",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=85",
    date: "2026-11-28",
    endDate: "2026-11-29",
    dateDisplay: "Nov 28 – 29, 2026",
    timeDisplay: "11:00 AM – 21:00 JST",
    doorTime: "09:30 JST",
    duration: "2 Days of Finals",
    venueId: "venue-6",
    venueName: "Pacific Dome Sports & Athletics Complex",
    city: "Tokyo",
    state: "Tokyo",
    address: "1-3-61 Koraku, Bunkyo-ku, Tokyo, Japan",
    organizerId: "org-3",
    organizerName: "Apex Athletic Federation",
    priceRange: "$50 – $260",
    minPrice: 50,
    maxPrice: 260,
    ageRestriction: "All Ages",
    description: `The highest-stakes competitive gaming event in Asia. 16 world champion squads battle across a monumental 360-degree floating LED stage inside Tokyo's Pacific Dome with live caster analysis, instant replay holotanks, and massive crowd synergy.`,
    highlights: [
      "Immense 360° panoramic LED arena center stage",
      "Meet & greet booths with top pro players and streamers",
      "Exclusive in-game drops for all attendees",
      "Cosplay championship contest with $20,000 reward"
    ],
    lineup: [
      { name: "Team Fnatic", role: "EMEA Champions", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", bio: "Defending tournament juggernauts." },
      { name: "Paper Rex", role: "Pacific Champions", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Ultra-aggressive tactical powerhouse." }
    ],
    schedule: [
      {
        day: "Saturday: Semifinals & Upper Bracket",
        items: [
          { time: "11:00", title: "Opening Ceremony & Light Show", stage: "Center Stage" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-esports-ga", name: "Standard Arena Seating", price: 50, fee: 5.50, description: "Seating in mid/upper bowl with great stage sightlines.", available: 350, perks: ["Standard seating", "In-game code card"] },
      { id: "tier-esports-floor", name: "Floor Seat & Pro Pass (Seated)", price: 140, fee: 12.00, description: "Floor seat close to player pods and casters with meet & greet access.", available: 40, requiresSeatMap: true, perks: ["Floor seating", "Meet & Greet pass", "Limited team jersey"] }
    ],
    faqs: [
      { q: "Can I bring fan signs?", a: "Yes, signs up to A2 size are welcome as long as they don't block aisles." }
    ]
  },
  {
    id: "evt-111",
    title: "FOUNDERS UNPLUGGED: Rooftop Dinner & Pitch Salon",
    tagline: "Intimate 50-Person Dining & Pitch Gathering Overlooking the Austin Skyline",
    slug: "founders-unplugged-austin-2026",
    category: "networking",
    categoryLabel: "Networking",
    badge: "Curated 50 Seats",
    accentColor: "#E91E63",
    secondaryColor: "#1d040e",
    featured: false,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=85",
    date: "2026-12-04",
    endDate: "2026-12-04",
    dateDisplay: "Dec 4, 2026",
    timeDisplay: "18:30 – 23:00 CST",
    doorTime: "18:00 CST",
    duration: "4.5 Hours",
    venueId: "venue-5",
    venueName: "Horizon Tech Campus — Auditorium X",
    city: "Austin",
    state: "TX",
    address: "1100 Congress Avenue, Austin, TX",
    organizerId: "org-5",
    organizerName: "Venture Pulse Network",
    priceRange: "$120 – $220",
    minPrice: 120,
    maxPrice: 220,
    ageRestriction: "21+",
    description: `An unforgettable evening of farm-to-table dining, curated Texas craft cocktails, and candid fireside discussions on scaling startups from Seed to Series B without burning out.`,
    highlights: [
      "4-course chef-prepared dinner with wine pairings",
      "Off-the-record founder war stories and turnaround secrets",
      "Direct intros to 12 active lead investors attending as dinner guests"
    ],
    lineup: [
      { name: "Travis Vance", role: "Founder & Host", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Serial entrepreneur and angel investor." }
    ],
    schedule: [
      {
        day: "Evening",
        items: [
          { time: "18:30", title: "Welcome Cocktails & Hors d'Oeuvres", stage: "Rooftop Terrace" },
          { time: "19:30", title: "4-Course Seated Dinner & Lightning Salon", stage: "Glass Dining Room" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-dinner-seat", name: "Seated Dinner & Salon Ticket", price: 120, fee: 10.00, description: "Includes 4-course dinner, open bar, and curated table seating.", available: 16, perks: ["4-course dinner", "Open craft bar", "Founder directory"] }
    ],
    faqs: [
      { q: "Are dietary preferences accommodated?", a: "Yes, vegan, gluten-free, and allergen-free options are fully catered." }
    ]
  },
  {
    id: "evt-112",
    title: "SOLARIS: Solar Eclipse Ambient Music & Star Gazing",
    tagline: "Celestial Soundscapes, Analog Synths, and Deep Space Telescopes in the Desert",
    slug: "solaris-ambient-desert-2026",
    category: "concerts",
    categoryLabel: "Concert / Experience",
    badge: "Outdoor Experience",
    accentColor: "#FF6D00",
    secondaryColor: "#1d0c00",
    featured: true,
    isSeated: false,
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=85",
    date: "2026-12-12",
    endDate: "2026-12-13",
    dateDisplay: "Dec 12 – 13, 2026",
    timeDisplay: "16:00 – 06:00 (Overnight)",
    doorTime: "15:00 PST",
    duration: "Overnight Celestial Camp",
    venueId: "venue-1",
    venueName: "The Apex Arena & Amphitheatre",
    city: "San Francisco",
    state: "CA",
    address: "500 Horizon Boulevard, San Francisco, CA",
    organizerId: "org-1",
    organizerName: "Summit Collective",
    priceRange: "$70 – $190",
    minPrice: 70,
    maxPrice: 190,
    ageRestriction: "18+",
    description: `An overnight acoustic celebration blending deep ambient drone, modular sound synthesis, and real-time celestial astronomy. Bring your sleeping pads and blankets to lie under the stars while international composers perform 14 hours of continuous sound.`,
    highlights: [
      "14 Hours of continuous seamless ambient performances",
      "High-power observatory telescopes guided by astrophysicists",
      "Complimentary hot herbal tea and breakfast at sunrise"
    ],
    lineup: [
      { name: "Stars of the Lid Tribute", role: "Drone Ensemble", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", bio: "String quartet and twin guitar ambient loops." }
    ],
    schedule: [
      {
        day: "Overnight",
        items: [
          { time: "16:00", title: "Arrival & Stargazing Mat Setup", stage: "Open Sky Amphitheatre" },
          { time: "18:00", title: "Sunset Drone Performance", stage: "Open Sky Amphitheatre" },
          { time: "06:30", title: "Sunrise Ambient Awakening & Coffee", stage: "Open Sky Amphitheatre" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-stargazer", name: "Stargazer Pass (Lawn Entry)", price: 70, fee: 6.50, description: "Includes outdoor open amphitheatre lawn access and sunrise tea.", available: 120, perks: ["Lawn access", "Telescope viewing", "Sunrise tea & pastries"] },
      { id: "tier-glamping", name: "VIP Glamping Pod Package", price: 190, fee: 15.00, description: "Includes furnished heated bell tent for two with luxury mattresses.", available: 10, perks: ["Heated luxury bell tent", "Prime central lawn spot", "Gourmet hot breakfast"] }
    ],
    faqs: [
      { q: "What should I bring?", a: "Warm layers, a sleeping bag or thick blanket, and an insulated mug." }
    ]
  },
  {
    id: "evt-113",
    title: "GLOBAL SPORTS TECH & PERFORMANCE SYMPOSIUM",
    tagline: "Biometrics, Neural Conditioning, Recovery Science and High-Performance Sports Engineering",
    slug: "global-sports-tech-symposium-2026",
    category: "sports",
    categoryLabel: "Sports / Conference",
    badge: "Industry Summit",
    accentColor: "#00B0FF",
    secondaryColor: "#00141f",
    featured: false,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=85",
    date: "2026-12-18",
    endDate: "2026-12-19",
    dateDisplay: "Dec 18 – 19, 2026",
    timeDisplay: "09:00 – 17:30 EST",
    doorTime: "08:30 EST",
    duration: "2 Days",
    venueId: "venue-2",
    venueName: "Lumina Glasshouse & Innovation Center",
    city: "New York",
    state: "NY",
    address: "240 Hudson Yards Promenade, New York, NY",
    organizerId: "org-3",
    organizerName: "Apex Athletic Federation",
    priceRange: "$210 – $480",
    minPrice: 210,
    maxPrice: 480,
    ageRestriction: "All Ages",
    description: `Where Olympic physiologists, data scientists from Formula 1, Premier League directors, and neuro-ergonomics researchers meet to break down the science of human endurance and athletic peak states.`,
    highlights: [
      "Live biomechanics motion-capture lab demonstrations",
      "Cryotherapy and recovery pod testing zone",
      "Case studies from NBA and F1 championship engineering teams"
    ],
    lineup: [
      { name: "Dr. Aris Thorne", role: "Director of Biomechanics", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", bio: "Advising champions across Grand Slam tennis and Olympic sprinting." }
    ],
    schedule: [
      {
        day: "Day 1",
        items: [
          { time: "09:00", title: "Keynote: Pushing the 2-Hour Marathon and Beyond", stage: "Auditorium A" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-sports-delegate", name: "Standard Delegate Pass", price: 210, fee: 15.00, description: "Full access to presentations, lab demonstrations, and networking expo.", available: 45, perks: ["All presentations", "Expo floor pass", "Lunch provided"] }
    ],
    faqs: [
      { q: "Is CPE / CEU certification available?", a: "Yes, attendance certificates for continuing sports science education credits are issued." }
    ]
  },
  {
    id: "evt-114",
    title: "IMPACT 2027: Climate & Clean Energy Global Leaders Forum",
    tagline: "Scaling Decarbonization, Fusion Energy, Clean Mobility and Planetary Resilience",
    slug: "impact-climate-leaders-forum-2027",
    category: "conferences",
    categoryLabel: "Conference",
    badge: "Global Forum",
    accentColor: "#10B981",
    secondaryColor: "#021c13",
    featured: true,
    isSeated: true,
    heroImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=85",
    posterImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=85",
    date: "2027-01-15",
    endDate: "2027-01-17",
    dateDisplay: "Jan 15 – 17, 2027",
    timeDisplay: "09:00 AM – 18:00 GMT",
    doorTime: "08:00 GMT",
    duration: "3 Days",
    venueId: "venue-4",
    venueName: "The Grand Conservatory Hall",
    city: "London",
    state: "Greater London",
    address: "Kensington Gore, London SW7 2AP, UK",
    organizerId: "org-2",
    organizerName: "FutureTech Global",
    priceRange: "$240 – $750",
    minPrice: 240,
    maxPrice: 750,
    ageRestriction: "All Ages",
    description: `A decisive summit convening clean energy innovators, fusion engineers, sovereign wealth fund directors, and urban resilience planners to deploy capital and scale transformative carbon solutions.`,
    highlights: [
      "Over $10B in climate deployment funds represented",
      "Showcase of 50 Breakthrough CleanTech Scaleups",
      "Chatham House Rule private policy roundtables"
    ],
    lineup: [
      { name: "Dame Evelyn Hart", role: "Special Envoy for Clean Energy", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", bio: "Leading international policy frameworks on grid-scale energy storage." }
    ],
    schedule: [
      {
        day: "Day 1",
        items: [
          { time: "09:30", title: "Opening Plenary: Next-Gen Baseload Power", stage: "Grand Dome" }
        ]
      }
    ],
    ticketTiers: [
      { id: "tier-climate-pass", name: "Full Summit Delegate Pass", price: 240, fee: 16.00, description: "3-Day access to all plenary halls, breakout sessions, and exhibition suites.", available: 60, perks: ["3-Day access", "Networking directory", "Lunch & refreshments"] }
    ],
    faqs: [
      { q: "Is the event carbon neutral?", a: "Yes, all event emissions and delegate travel are rigorously measured and offset through certified direct air capture." }
    ]
  }
];

const SEED_PROMO_CODES = [
  { code: "SUMMIT2026", discountType: "percent", value: 20, description: "20% off all ticket tiers" },
  { code: "VIPACCESS", discountType: "fixed", value: 50, description: "$50 off total order" },
  { code: "STUDENT50", discountType: "percent", value: 25, description: "25% student discount" },
  { code: "EARLYBIRD", discountType: "percent", value: 15, description: "15% early bird special" },
  { code: "WELCOME10", discountType: "percent", value: 10, description: "10% off your first ticket purchase" }
];

const SEED_CATEGORIES = [
  { id: "all", name: "All Events", icon: "sparkles", count: 14 },
  { id: "concerts", name: "Concerts & Music", icon: "music", count: 4, desc: "Festivals, electronic, classical, indie & live sets" },
  { id: "conferences", name: "Conferences", icon: "briefcase", count: 4, desc: "AI, technology, engineering & global leadership" },
  { id: "workshops", name: "Workshops", icon: "pen-tool", count: 2, desc: "Typography, creative code, design & hands-on masterclasses" },
  { id: "sports", name: "Sports & Athletics", icon: "activity", count: 3, desc: "Extreme sports, esports, championship tournaments & performance" },
  { id: "networking", name: "Networking", icon: "users", count: 2, desc: "Founders, venture capital, investor salons & private dinners" }
];
