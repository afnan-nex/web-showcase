/**
 * Haven Realty - Master Property & Agency Data Store
 * Fictional luxury residential, penthouse, waterfront, and architectural estates.
 */

const HAVEN_AGENTS = [
  {
    id: "agent-1",
    name: "Genevieve DeWitt",
    title: "Managing Director & Principal Partner",
    specialty: "Beverly Hills & Bel Air Estates",
    phone: "+1 (310) 849-2100",
    email: "g.dewitt@havenrealty.com",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$480M+",
    experienceYears: 16,
    languages: ["English", "French"],
    bio: "Genevieve has represented visionary founders, architectural collectors, and global tastemakers for over fifteen years. Known for discretion and encyclopedic market insight, she leads Haven's West Coast flagship division."
  },
  {
    id: "agent-2",
    name: "Alister Vance",
    title: "Head of Penthouse & High-Rise Advisory",
    specialty: "Manhattan & Tribeca Penthouses",
    phone: "+1 (212) 694-8830",
    email: "a.vance@havenrealty.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$620M+",
    experienceYears: 14,
    languages: ["English", "German"],
    bio: "Recognized as a leading authority in Manhattan ultra-luxury towers, Alister brings rigorous financial structuring and architectural curation to every marquee acquisition."
  },
  {
    id: "agent-3",
    name: "Elena Rostova",
    title: "Senior Partner, Coastal & Waterfront Estates",
    specialty: "Palm Beach & Miami Waterfront",
    phone: "+1 (305) 512-9900",
    email: "e.rostova@havenrealty.com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$390M+",
    experienceYears: 11,
    languages: ["English", "Italian", "Spanish"],
    bio: "Specializing in barrier-island compounds, deep-water dockage estates, and coastal modern masterpieces, Elena represents premier beachfront properties across South Florida."
  },
  {
    id: "agent-4",
    name: "Marcus Thorne",
    title: "Director of Mountain & Alpine Properties",
    specialty: "Aspen & Rocky Mountain Compounds",
    phone: "+1 (970) 925-4120",
    email: "m.thorne@havenrealty.com",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$290M+",
    experienceYears: 12,
    languages: ["English"],
    bio: "Marcus pairs a deep appreciation for timber-and-stone contemporary design with an intimate understanding of alpine microclimates, ski-in/ski-out tracts, and conservation ranches."
  },
  {
    id: "agent-5",
    name: "Camilla Saint-Claire",
    title: "European Prime & Heritage Specialist",
    specialty: "London Mayfair & Lake Como",
    phone: "+44 20 7946 0912",
    email: "c.saintclaire@havenrealty.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$510M+",
    experienceYears: 18,
    languages: ["English", "French", "Italian"],
    bio: "Camilla consults international family offices and discerning private collectors on historic townhouses, Lake Como villas, and prime central London residences."
  },
  {
    id: "agent-6",
    name: "Harrison Brooks",
    title: "Senior Commercial & Trophy Asset Advisor",
    specialty: "Mixed-Use & Architectural Commercial",
    phone: "+1 (212) 710-4490",
    email: "h.brooks@havenrealty.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    salesVolume: "$750M+",
    experienceYears: 20,
    languages: ["English", "Mandarin"],
    bio: "With two decades navigating prime commercial transactions, trophy hospitality acquisitions, and architectural office headquarters, Harrison offers bespoke institutional guidance."
  }
];

const HAVEN_PROPERTIES = [
  {
    id: "prop-101",
    slug: "the-glass-pavilion-crestview",
    title: "The Glass Pavilion at Crestview",
    tagline: "Mid-century modernist masterwork with panoramic city-to-ocean vistas",
    price: 18500000,
    priceDisplay: "$18,500,000",
    pricePerSqFt: 2284,
    status: "for-sale",
    type: "villa",
    featured: true,
    bedrooms: 5,
    bathrooms: 7,
    area: 8100,
    lotSize: "1.45 Acres",
    yearBuilt: 2023,
    garage: "4-Car Subterranean",
    hoaMonthly: 850,
    propertyTaxesYearly: 148000,
    location: {
      address: "1420 Crestview Way",
      neighborhood: "Beverly Hills",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
      coordinates: { lat: 34.0837, lng: -118.4004 }
    },
    agentId: "agent-1",
    description: "Conceived by world-renowned architectural studio Olson Kundig, The Glass Pavilion stands as a pinnacle of organic modernism in prime Beverly Hills. Cantilevered floor-to-ceiling glass walls dissolve boundaries between the grand reception volumes and zero-edge infinity waters. Materials include hand-chiseled Roman travertine, rift-sawn European white oak, and blackened structural steel. The primary wing occupies a private promontory with dual sculptural stone baths, couture walk-in dressing galleries, and a secluded wellness plunge pool.",
    keyFeatures: [
      "Zero-edge 80-foot infinity pool overlooking the Los Angeles basin",
      "Subterranean temperature-regulated wine vault holding 1,200 bottles",
      "Private wellness center with cedar dry sauna and cold plunge",
      "Integrated Crestron smart home automation and motorized privacy louvers",
      "Custom Poliform chef's kitchen with Gaggenau 400-series appliances",
      "Gated private motor court with 4-car showroom garage"
    ],
    amenities: [
      "Swimming Pool",
      "Ocean View",
      "Wine Cellar",
      "Wellness Spa",
      "Smart Home",
      "Garage",
      "Concierge",
      "Security System",
      "Fireplace",
      "Outdoor Kitchen"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Ground Level — Main Pavilion & Terraces",
        dimensions: "4,600 sq ft",
        description: "Open grand salon, formal dining, chef's show kitchen, prep scullery, library, and poolside loggia."
      },
      {
        level: "Upper Level — Owner's Sanctuary",
        dimensions: "2,300 sq ft",
        description: "Primary retreat with dual dressing galleries, private terrace, meditation room, and observation deck."
      },
      {
        level: "Subterranean — Wellness & Motor Court",
        dimensions: "1,200 sq ft",
        description: "Wine vault, wellness spa suite, screening room, and direct access to the 4-vehicle showcase."
      }
    ],
    viewsCount: 3420,
    dateAdded: "2026-07-15"
  },
  {
    id: "prop-102",
    slug: "the-woolworth-crown-penthouse",
    title: "The Woolworth Crown Penthouse",
    tagline: "Triplex pinnacle with 360-degree skyline and harbor panoramas",
    price: 24900000,
    priceDisplay: "$24,900,000",
    pricePerSqFt: 3557,
    status: "for-sale",
    type: "penthouse",
    featured: true,
    bedrooms: 4,
    bathrooms: 5.5,
    area: 7000,
    lotSize: "Private Rooftop 1,850 sq ft",
    yearBuilt: 2022,
    garage: "2 Private Valet Spaces",
    hoaMonthly: 4200,
    propertyTaxesYearly: 215000,
    location: {
      address: "233 Broadway, Penthouse 58",
      neighborhood: "Tribeca",
      city: "New York",
      state: "NY",
      zip: "10007",
      country: "United States",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    agentId: "agent-2",
    description: "Crowning one of Manhattan's most storied neo-Gothic landmarks, this triplex penthouse offers an unprecedented scale of high-altitude living. Soaring 24-foot vaulted ceilings frame sweeping vistas across the Hudson River, New York Harbor, and Midtown's iconic spires. A private key-locked elevator opens directly into a double-height gallery anchored by a sculptural bronze spiral staircase. The expansive private rooftop observatory includes a heated plunge pool, summer kitchen, and wind-shielded glass loggia.",
    keyFeatures: [
      "Direct private high-speed elevator opening to all 3 residence levels",
      "Private 1,850 sq ft wrap-around rooftop terrace with skyline plunge pool",
      "24-foot double-height great room with restored architectural moldings",
      "Bespoke Boffi kitchen in fumed oak and Calacatta Paonazzo marble",
      "Primary suite with dual spa baths, gas hearth, and private cocktail bar",
      "Full 24/7 white-glove doorman, sommelier, and private fitness facility"
    ],
    amenities: [
      "Private Elevator",
      "Swimming Pool",
      "Concierge",
      "Wine Cellar",
      "Smart Home",
      "Fireplace",
      "Security System",
      "Gym"
    ],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Level 58 — Entertaining Salons",
        dimensions: "3,200 sq ft",
        description: "Double-height great room, corner library, show kitchen, wine gallery, and staff suite."
      },
      {
        level: "Level 59 — Bedroom Suites",
        dimensions: "2,600 sq ft",
        description: "Primary retreat with dual dressing salons, plus three en-suite guest quarters."
      },
      {
        level: "Level 60 — Sky Pavilion & Observatory",
        dimensions: "1,200 interior + 1,850 exterior sq ft",
        description: "Sky lounge with fireplace, plunge pool terrace, outdoor kitchen, and 360-degree panorama."
      }
    ],
    viewsCount: 5120,
    dateAdded: "2026-06-20"
  },
  {
    id: "prop-103",
    slug: "villa-bel-sogno-palm-beach",
    title: "Villa Bel Sogno Waterfront Estate",
    tagline: "Palladian-inspired oceanfront compound with 200 feet of private beach",
    price: 32000000,
    priceDisplay: "$32,000,000",
    pricePerSqFt: 2560,
    status: "for-sale",
    type: "villa",
    featured: true,
    bedrooms: 7,
    bathrooms: 9.5,
    area: 12500,
    lotSize: "2.1 Acres",
    yearBuilt: 2024,
    garage: "6-Car Climate Controlled",
    hoaMonthly: 1200,
    propertyTaxesYearly: 290000,
    location: {
      address: "1080 S Ocean Boulevard",
      neighborhood: "Palm Beach",
      city: "Palm Beach",
      state: "FL",
      zip: "33480",
      country: "United States",
      coordinates: { lat: 26.7056, lng: -80.0364 }
    },
    agentId: "agent-3",
    description: "Nestled along the most coveted stretch of South Ocean Boulevard, Villa Bel Sogno is a generational compound combining classical Mediterranean symmetry with crisp contemporary luxury. Featuring over 200 feet of direct Atlantic beachfront, lush tropical courtyards, and a deep-water yacht dock on the Intracoastal. The residence features soaring hand-carved limestone arches, Venetian plaster finishes, a 100-foot resort pool, and a private detached two-bedroom guest villa.",
    keyFeatures: [
      "Direct private Atlantic ocean frontage and Intracoastal yacht dockage",
      "100-foot Olympic-length limestone swimming pool with private cabanas",
      "Detached two-bedroom luxury guest villa with full independent kitchen",
      "Subterranean 2,000-bottle tasting cellar and state-of-the-art cinema",
      "Tennis / Pickleball pavilion surrounded by mature royal palms",
      "Six-vehicle climate-controlled gallery garage with electric charging"
    ],
    amenities: [
      "Swimming Pool",
      "Ocean View",
      "Tennis Court",
      "Wine Cellar",
      "Wellness Spa",
      "Helipad",
      "Garage",
      "Concierge",
      "Smart Home",
      "Security System"
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Main Residence — Ground Level",
        dimensions: "7,200 sq ft",
        description: "Grand foyer, formal ocean salon, banquet dining room, family kitchen, library, and loggias."
      },
      {
        level: "Main Residence — Second Level",
        dimensions: "4,100 sq ft",
        description: "Oceanfront primary compound with dual verandas, plus four expansive en-suite bedrooms."
      },
      {
        level: "Guest Villa & Wellness Pavilions",
        dimensions: "1,200 sq ft",
        description: "Two independent guest suites, massage suite, fitness studio, and poolside kitchen."
      }
    ],
    viewsCount: 6890,
    dateAdded: "2026-08-01"
  },
  {
    id: "prop-104",
    slug: "the-aspen-alpine-sanctuary",
    title: "The Aspen Alpine Sanctuary",
    tagline: "Ski-in/ski-out timber and quartzite lodge on Red Mountain",
    price: 14200000,
    priceDisplay: "$14,200,000",
    pricePerSqFt: 2184,
    status: "for-sale",
    type: "house",
    featured: true,
    bedrooms: 5,
    bathrooms: 6,
    area: 6500,
    lotSize: "3.8 Acres",
    yearBuilt: 2023,
    garage: "3-Car Heated",
    hoaMonthly: 600,
    propertyTaxesYearly: 112000,
    location: {
      address: "480 Red Mountain Road",
      neighborhood: "Aspen",
      city: "Aspen",
      state: "CO",
      zip: "81611",
      country: "United States",
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    agentId: "agent-4",
    description: "Positioned on the prestigious slopes of Red Mountain, this architectural masterpiece blends reclaimed Douglas fir timbers with monumental Colorado quartzite. Expansive walls of triple-pane architectural glass capture dramatic views of Aspen Mountain and the Roaring Fork Valley. Featuring a heated ski lounge with direct slope access, heated outdoor stone terraces with a cantilevered hot tub, and a two-story stone hearth.",
    keyFeatures: [
      "Direct ski-in/ski-out access with heated equipment locker and boot dryers",
      "Heated stone terraces with 12-person hot tub overlooking Ajax Mountain",
      "Two-story monumental wood-burning hearth in locally quarried stone",
      "Bespoke commercial-grade kitchen with dual La Cornue ranges",
      "Dedicated cinema room with 4K laser projection and Dolby Atmos acoustics",
      "Full hydronic radiant floor heating and geothermal climate control"
    ],
    amenities: [
      "Fireplace",
      "Wellness Spa",
      "Wine Cellar",
      "Smart Home",
      "Garage",
      "Security System",
      "Concierge"
    ],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Main Level — Great Room & Kitchen",
        dimensions: "3,400 sq ft",
        description: "Cathedral ceiling great room, chef's kitchen, wine wall, ski salon, and heated terraces."
      },
      {
        level: "Upper Level — Primary & Family Suites",
        dimensions: "2,100 sq ft",
        description: "Primary lodge suite with double fireplace, private viewing balcony, plus two bunk suites."
      },
      {
        level: "Lower Level — Entertainment & Spa",
        dimensions: "1,000 sq ft",
        description: "Media theater, spa room with cedar sauna and steam shower, ski-out portal."
      }
    ],
    viewsCount: 2950,
    dateAdded: "2026-07-28"
  },
  {
    id: "prop-105",
    slug: "the-sky-villa-continuum-miami",
    title: "The Sky Villa at Continuum",
    tagline: "Full-floor oceanfront penthouse with wrap-around cantilevered glass terraces",
    price: 11750000,
    priceDisplay: "$11,750,000",
    pricePerSqFt: 2447,
    status: "for-sale",
    type: "penthouse",
    featured: false,
    bedrooms: 4,
    bathrooms: 4.5,
    area: 4800,
    lotSize: "1,400 sq ft Terrace",
    yearBuilt: 2024,
    garage: "3 Valet Spaces",
    hoaMonthly: 3400,
    propertyTaxesYearly: 98000,
    location: {
      address: "100 South Pointe Drive",
      neighborhood: "South of Fifth",
      city: "Miami Beach",
      state: "FL",
      zip: "33139",
      country: "United States",
      coordinates: { lat: 25.7681, lng: -80.1345 }
    },
    agentId: "agent-3",
    description: "Located in Miami Beach's ultra-exclusive South of Fifth enclave, this full-floor Sky Villa at Continuum delivers breathtaking unobstructed vistas of the Atlantic Ocean, Government Cut, and the glittering Miami skyline. Custom interiors by Studio Liaigre showcase white terrazzo, bespoke walnut wall paneling, and an open floor plan flooded with natural sunlight from sunrise to sunset.",
    keyFeatures: [
      "1,400 sq ft deep wrap-around glass terrace with outdoor summer kitchen",
      "Private elevator landing with keyed biometric security",
      "Custom Boffi kitchen with Sub-Zero refrigeration and waterfall quartz island",
      "Full access to Continuum's 12 acres of private beachfront amenities and tennis courts",
      "Smart lighting, motorized shades, and multi-zone audio integration",
      "3 reserved underground garage parking spaces with private storage unit"
    ],
    amenities: [
      "Ocean View",
      "Private Elevator",
      "Swimming Pool",
      "Tennis Court",
      "Concierge",
      "Smart Home",
      "Gym"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Full 34th Floor Sky Residence",
        dimensions: "4,800 interior + 1,400 exterior sq ft",
        description: "Central great salon, oceanfront dining, primary master suite facing east, three guest suites."
      }
    ],
    viewsCount: 4210,
    dateAdded: "2026-07-02"
  },
  {
    id: "prop-106",
    slug: "mayfair-regency-mansion-london",
    title: "Mayfair Regency Heritage Mansion",
    tagline: "Grade II listed Georgian townhouse restored to contemporary perfection",
    price: 19500000,
    priceDisplay: "$19,500,000",
    pricePerSqFt: 2785,
    status: "for-sale",
    type: "house",
    featured: true,
    bedrooms: 6,
    bathrooms: 7,
    area: 7000,
    lotSize: "Private Mews Courtyard",
    yearBuilt: 1840,
    garage: "2-Car Mews Garage",
    hoaMonthly: 950,
    propertyTaxesYearly: 130000,
    location: {
      address: "18 Upper Brook Street",
      neighborhood: "Mayfair",
      city: "London",
      state: "Greater London",
      zip: "W1K 7PF",
      country: "United Kingdom",
      coordinates: { lat: 51.5113, lng: -0.1534 }
    },
    agentId: "agent-5",
    description: "An extraordinary Grade II listed residence located moments from Grosvenor Square and Hyde Park. Meticulously restored over four years by master craftsmen, this five-story residence pairs original Regency cornicing and fireplaces with cutting-edge comfort: passenger lift to all floors, a subterranean swimming pool and spa, private cinema, and an adjoining private mews house with garage.",
    keyFeatures: [
      "Restored Georgian architectural proportion with 14-foot ceiling heights",
      "Subterranean 12-meter stone pool, hammam, and private treatment room",
      "Discreet passenger lift servicing all six levels",
      "Adjoining private mews house with independent guest quarters and garage",
      "Temperature-controlled wine cellar and tasting salon",
      "Air conditioning and Lutron lighting integrated throughout"
    ],
    amenities: [
      "Swimming Pool",
      "Private Elevator",
      "Wine Cellar",
      "Wellness Spa",
      "Fireplace",
      "Garage",
      "Concierge",
      "Security System"
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Ground & First Floor — Formal Entertaining",
        dimensions: "2,800 sq ft",
        description: "Formal reception rooms, drawing room with balcony, library, and grand staircase."
      },
      {
        level: "Second & Third Floors — Private Suites",
        dimensions: "2,600 sq ft",
        description: "Principal bedroom suite spanning the entire second floor, plus four guest en-suites."
      },
      {
        level: "Lower Ground & Basement — Wellness Sanctuary",
        dimensions: "1,600 sq ft",
        description: "Swimming pool, hammam steam spa, cinema room, wine cellar, and staff quarters."
      }
    ],
    viewsCount: 3880,
    dateAdded: "2026-06-11"
  },
  {
    id: "prop-107",
    slug: "villa-il-tramonto-lake-como",
    title: "Villa Il Tramonto",
    tagline: "Historic waterfront sanctuary with botanical gardens and private boathouse",
    price: 16800000,
    priceDisplay: "$16,800,000",
    pricePerSqFt: 2100,
    status: "for-sale",
    type: "villa",
    featured: false,
    bedrooms: 6,
    bathrooms: 8,
    area: 8000,
    lotSize: "1.9 Acres",
    yearBuilt: 1910,
    garage: "4-Car Covered Portico",
    hoaMonthly: 500,
    propertyTaxesYearly: 85000,
    location: {
      address: "Via Regina 42",
      neighborhood: "Lake Como",
      city: "Tremezzo",
      state: "Lombardy",
      zip: "22019",
      country: "Italy",
      coordinates: { lat: 45.9867, lng: 9.2272 }
    },
    agentId: "agent-5",
    description: "Positioned directly on the western shore of Lake Como with unobstructed sunset vistas over Bellagio. Villa Il Tramonto features terraced Italianate gardens with century-old cypress and olive trees, a private mooring jetty with automated boathouse, and an infinity pool that merges seamlessly with the lake's sparkling waters. Frescoed ceilings and terrazzo floors have been preserved with supreme precision.",
    keyFeatures: [
      "Direct private lake frontage with restored boathouse and motorized boat lift",
      "Botanical gardens with historic fountains and pergola dining pavilion",
      "Heated infinity pool overlooking the Tremezzina riviera and Alps",
      "Restored original Liberty-era frescoes and hand-laid Venetian terrazzo",
      "Separate caretaker lodge and standalone guest apartment",
      "Helipad landing clearance on lower lawn"
    ],
    amenities: [
      "Swimming Pool",
      "Ocean View",
      "Helipad",
      "Wine Cellar",
      "Fireplace",
      "Garage",
      "Concierge",
      "Security System"
    ],
    images: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Piano Nobile — Grand Reception Rooms",
        dimensions: "3,600 sq ft",
        description: "Double reception salons with frescoes, lakeside dining loggia, modern culinary wing."
      },
      {
        level: "Piano Superiore — Bedroom Suites",
        dimensions: "3,000 sq ft",
        description: "Primary lakeside suite with marble terrace, plus four guest en-suites."
      },
      {
        level: "Darsena & Boathouse Level",
        dimensions: "1,400 sq ft",
        description: "Boathouse with electric winch, wine tasting vault, changing rooms, lakeside terrace."
      }
    ],
    viewsCount: 3100,
    dateAdded: "2026-07-19"
  },
  {
    id: "prop-108",
    slug: "pacific-panorama-residence-malibu",
    title: "The Pacific Panorama Residence",
    tagline: "Architectural bluff compound with private funicular to secluded beach",
    price: 21000000,
    priceDisplay: "$21,000,000",
    pricePerSqFt: 2800,
    status: "for-sale",
    type: "house",
    featured: true,
    bedrooms: 5,
    bathrooms: 6,
    area: 7500,
    lotSize: "1.8 Acres",
    yearBuilt: 2024,
    garage: "4-Car Motor Court",
    hoaMonthly: 750,
    propertyTaxesYearly: 165000,
    location: {
      address: "31800 Broad Beach Road",
      neighborhood: "Malibu",
      city: "Malibu",
      state: "CA",
      zip: "90265",
      country: "United States",
      coordinates: { lat: 34.0259, lng: -118.7798 }
    },
    agentId: "agent-1",
    description: "Perched high on the private bluffs of western Malibu, this Tadao Ando-inspired masterpiece of board-formed concrete and warm teakwood commands endless ocean views from Point Dume to the Channel Islands. A custom glass funicular transports residents directly down the cliffside to a private beach cabana and pristine sands. The residence includes a 75-foot cantilevered lap pool and an organic chef's garden.",
    keyFeatures: [
      "Private glass funicular descending to private beachfront cabana",
      "75-foot cantilevered infinity pool suspended over the Pacific ocean",
      "Architectural board-formed concrete and sustainably harvested teak construction",
      "Bespoke Bulthaup kitchen with integrated Gaggenau induction suites",
      "Primary suite with dual oceanfront soaking tubs and private garden deck",
      "Off-grid solar storage system with Tesla Powerwalls and backup generators"
    ],
    amenities: [
      "Ocean View",
      "Swimming Pool",
      "Smart Home",
      "Wine Cellar",
      "Wellness Spa",
      "Garage",
      "Security System",
      "Fireplace"
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Main Level — Oceanside Pavilion",
        dimensions: "4,200 sq ft",
        description: "Continuous living and dining gallery, show kitchen, wine room, and cantilevered terrace."
      },
      {
        level: "Upper Level — Owner's Sanctuary",
        dimensions: "2,300 sq ft",
        description: "Primary retreat with 180-degree ocean views, dual dressing salons, library."
      },
      {
        level: "Beach Cabana Level",
        dimensions: "1,000 sq ft",
        description: "Funicular terminal, beach kitchen, surfboard gallery, outdoor freshwater showers."
      }
    ],
    viewsCount: 4720,
    dateAdded: "2026-08-04"
  },
  {
    id: "prop-109",
    slug: "the-soho-architectural-loft",
    title: "The SoHo Architectural Cast-Iron Loft",
    tagline: "Full-floor museum-quality loft in prime Historic Cast Iron District",
    price: 28000,
    priceDisplay: "$28,000 / mo",
    pricePerSqFt: 8,
    status: "for-rent",
    type: "apartment",
    featured: false,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 3600,
    lotSize: "Full Floor",
    yearBuilt: 1895,
    garage: "1 Garage Space Nearby",
    hoaMonthly: 0,
    propertyTaxesYearly: 0,
    location: {
      address: "102 Prince Street, 3rd Floor",
      neighborhood: "SoHo",
      city: "New York",
      state: "NY",
      zip: "10012",
      country: "United States",
      coordinates: { lat: 40.7247, lng: -73.9998 }
    },
    agentId: "agent-2",
    description: "An authentic architectural loft preserving historic Corinthian cast-iron columns, 13-foot timber-beamed ceilings, and oversized sash windows overlooking Prince and Mercer Streets. Fully reimagined for modern living with bespoke minimalist millwork, wide-plank French oak flooring, a sculptural marble fireplace, and a private key-activated elevator opening right into the gallery.",
    keyFeatures: [
      "Key-locked elevator opening directly into a 45-foot dramatic gallery",
      "Original 1895 cast-iron Corinthian columns and exposed pine timber beams",
      "Custom minimalist kitchen with matte black steel and honed Pietra Cardosa stone",
      "Primary bathroom clad in monolithic slabs of silver travertine",
      "Fully soundproofed acoustic windows and integrated multi-zone Sonos sound",
      "Furnished or unfurnished luxury lease terms available"
    ],
    amenities: [
      "Private Elevator",
      "Fireplace",
      "Smart Home",
      "Security System",
      "Concierge",
      "Gym"
    ],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Full 3rd Floor Loft",
        dimensions: "3,600 sq ft",
        description: "Open great room with 13-foot ceilings, corner dining, chef's kitchen, three bedroom suites."
      }
    ],
    viewsCount: 2210,
    dateAdded: "2026-08-10"
  },
  {
    id: "prop-110",
    slug: "horizon-modern-compound-scottsdale",
    title: "The Horizon Modern Desert Compound",
    tagline: "Sculptural rammed-earth sanctuary framing Camelback Mountain views",
    price: 8900000,
    priceDisplay: "$8,900,000",
    pricePerSqFt: 1236,
    status: "for-sale",
    type: "house",
    featured: false,
    bedrooms: 4,
    bathrooms: 5.5,
    area: 7200,
    lotSize: "2.4 Acres",
    yearBuilt: 2024,
    garage: "4-Car Showroom",
    hoaMonthly: 400,
    propertyTaxesYearly: 62000,
    location: {
      address: "6400 E Desert Jewel Trail",
      neighborhood: "Scottsdale",
      city: "Scottsdale",
      state: "AZ",
      zip: "85253",
      country: "United States",
      coordinates: { lat: 33.5092, lng: -111.8990 }
    },
    agentId: "agent-1",
    description: "Constructed with massive insulated rammed-earth walls that harmonize with the Sonoran Desert palette, this modernist residence is an exercise in tranquility. Features a central courtyard with reflection pools, sunken fire lounge, cantilevered steel shading structures, and a 60-foot lap pool that mirrors fiery desert sunsets.",
    keyFeatures: [
      "Thermal-mass rammed earth walls providing supreme energy efficiency and silence",
      "Sunken outdoor fire lounge and 60-foot reflection lap pool",
      "Bespoke walnut millwork and terrazzo flooring throughout",
      "Temperature-controlled 800-bottle glass wine gallery",
      "Detached casita guest house with private desert terrace",
      "Automated solar array and dual EV charging stations"
    ],
    amenities: [
      "Swimming Pool",
      "Wine Cellar",
      "Fireplace",
      "Smart Home",
      "Garage",
      "Security System",
      "Wellness Spa"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Main Residence Level",
        dimensions: "5,800 sq ft",
        description: "Central courtyard, open great room, chef's kitchen, primary retreat and 2 guest wings."
      },
      {
        level: "Guest Casita",
        dimensions: "1,400 sq ft",
        description: "Self-contained 1-bedroom villa with private patio and outdoor shower."
      }
    ],
    viewsCount: 1980,
    dateAdded: "2026-07-22"
  },
  {
    id: "prop-111",
    slug: "the-pinnacle-commercial-plaza",
    title: "The Pinnacle Commercial Plaza",
    tagline: "Class-A boutique architectural headquarters & flagship retail podium",
    price: 45000000,
    priceDisplay: "$45,000,000",
    pricePerSqFt: 1800,
    status: "for-sale",
    type: "commercial",
    featured: false,
    bedrooms: 0,
    bathrooms: 12,
    area: 25000,
    lotSize: "0.45 Acres Corner Lot",
    yearBuilt: 2023,
    garage: "Subterranean 20-Car Garage",
    hoaMonthly: 5500,
    propertyTaxesYearly: 410000,
    location: {
      address: "520 Madison Avenue",
      neighborhood: "Midtown Manhattan",
      city: "New York",
      state: "NY",
      zip: "10022",
      country: "United States",
      coordinates: { lat: 40.7589, lng: -73.9744 }
    },
    agentId: "agent-6",
    description: "A marquee boutique commercial asset located in the epicenter of Midtown Manhattan. Features seven stories of ultra-luxury column-free office plates, a double-height flagship retail ground concourse, landscaped tenant rooftop pavilion, and dedicated private executive elevator. Fully LEED Platinum certified with high-efficiency HVAC and floor-to-ceiling ultra-clear low-E glass.",
    keyFeatures: [
      "Seven stories of column-free flexible floorplates with 13-foot clear ceiling heights",
      "Flagship ground floor retail concourse with 60 feet of Madison Avenue frontage",
      "Private landscaped tenant rooftop garden with catering kitchen and conference pavilion",
      "LEED Platinum certified with smart building automation and touchless access",
      "Subterranean 20-vehicle automated parking system and executive bicycle lounge",
      "Full 100% occupancy potential or turnkey corporate world headquarters"
    ],
    amenities: [
      "Private Elevator",
      "Concierge",
      "Security System",
      "Smart Home",
      "Garage"
    ],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Ground & Mezzanine Retail Flagship",
        dimensions: "6,000 sq ft",
        description: "Double-height street retail showroom with Madison Avenue corner exposure."
      },
      {
        level: "Floors 2 through 6 — Executive Plates",
        dimensions: "3,200 sq ft per floor",
        description: "Column-free architectural creative or private equity workspaces."
      },
      {
        level: "Rooftop Garden & Boardroom Pavilion",
        dimensions: "3,000 sq ft indoor/outdoor",
        description: "Executive boardroom, event bar, landscaped open terrace."
      }
    ],
    viewsCount: 3150,
    dateAdded: "2026-05-18"
  },
  {
    id: "prop-112",
    slug: "the-knightsbridge-mews-penthouse",
    title: "The Knightsbridge Mews Penthouse",
    tagline: "Ultra-prime duplex apartment with private rooftop terrace overlooking Harrods",
    price: 18500,
    priceDisplay: "$18,500 / mo",
    pricePerSqFt: 7.7,
    status: "for-rent",
    type: "apartment",
    featured: false,
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    lotSize: "Private Terrace 600 sq ft",
    yearBuilt: 2021,
    garage: "1 Allocated Space",
    hoaMonthly: 0,
    propertyTaxesYearly: 0,
    location: {
      address: "12 Hans Crescent",
      neighborhood: "Knightsbridge",
      city: "London",
      state: "Greater London",
      zip: "SW1X 0NA",
      country: "United Kingdom",
      coordinates: { lat: 51.4998, lng: -0.1608 }
    },
    agentId: "agent-5",
    description: "An impeccably styled duplex penthouse in the heart of Knightsbridge. Boasts direct lift access, chevron oak flooring, bespoke marble kitchen with integrated wine climate cabinets, and an expansive private rooftop terrace offering views across iconic red-brick Victorian facades. Available for discerning private tenants seeking turnkey perfection.",
    keyFeatures: [
      "Direct private lift opening into modern reception and dining hall",
      "Private 600 sq ft landscaped rooftop terrace with fire pit and outdoor dining",
      "Custom Italian kitchen in Calacatta marble and brushed brass accents",
      "Three en-suite bedrooms with custom walk-in closets and heated marble floors",
      "24/7 dedicated concierge service and secure underground parking space",
      "Full Lutron smart lighting, climate control, and Bowers & Wilkins audio"
    ],
    amenities: [
      "Private Elevator",
      "Concierge",
      "Fireplace",
      "Smart Home",
      "Garage",
      "Security System"
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85"
    ],
    floorPlans: [
      {
        level: "Penthouse Lower Level",
        dimensions: "1,500 sq ft",
        description: "Grand reception salon, dining room, culinary kitchen, two guest en-suite bedrooms."
      },
      {
        level: "Penthouse Upper Level & Sky Terrace",
        dimensions: "900 interior + 600 terrace sq ft",
        description: "Primary suite with walk-in wardrobe, marble bath, and sliding glass wall to rooftop terrace."
      }
    ],
    viewsCount: 1840,
    dateAdded: "2026-08-14"
  }
];

const HAVEN_NEIGHBORHOODS = [
  {
    name: "Beverly Hills",
    city: "Los Angeles",
    count: 14,
    avgPrice: "$16.2M",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80",
    description: "Palatial manicured estates, legendary privacy, and tree-lined avenues of architectural excellence."
  },
  {
    name: "Tribeca & SoHo",
    city: "New York",
    count: 19,
    avgPrice: "$18.5M",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    description: "Historic cast-iron facades, cobblestone streets, and the world's most sought-after sky penthouses."
  },
  {
    name: "Palm Beach & Miami",
    city: "Florida",
    count: 22,
    avgPrice: "$21.0M",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80",
    description: "Sun-drenched Atlantic barrier estates, yacht harbor frontage, and vibrant architectural modernism."
  },
  {
    name: "Aspen & Rockies",
    city: "Colorado",
    count: 11,
    avgPrice: "$14.8M",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Alpine sanctuaries, ski-in/ski-out timber lodges, and private mountain valley compounds."
  },
  {
    name: "Mayfair & Prime London",
    city: "United Kingdom",
    count: 16,
    avgPrice: "$17.4M",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    description: "Grade-listed Georgian townhouses, royal parkside residences, and distinguished private mews."
  },
  {
    name: "Lake Como & Côte d'Azur",
    city: "Europe",
    count: 8,
    avgPrice: "$19.0M",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Timeless lakeside villas, botanical parklands, private docks, and Mediterranean glamour."
  }
];

const HAVEN_STATS = [
  { value: "$2.4B+", label: "Total Career Advisory Volume" },
  { value: "98.8%", label: "Average List-to-Sale Ratio" },
  { value: "18 Days", label: "Average Private Sale Velocity" },
  { value: "6 Global", label: "Bespoke Regional Offices" }
];

const HAVEN_TESTIMONIALS = [
  {
    quote: "Haven Realty redefines what a boutique brokerage can accomplish. Genevieve orchestrated our off-market acquisition in Beverly Hills with total confidentiality and surgical precision.",
    author: "Jonathan & Claire Vance",
    role: "Private Art Collectors & Tech Founders",
    location: "Beverly Hills"
  },
  {
    quote: "Alister Vance understands the Manhattan skyline like no one else. Finding an authentic triplex with private outdoor water frontage in Tribeca felt impossible until Haven took the reins.",
    author: "Sir Reginald Sterling",
    role: "Managing Partner, Sterling Global",
    location: "New York"
  },
  {
    quote: "From our first consultation to the closing of our Palm Beach oceanfront estate, Elena's advisory was unmatched. The digital dossier and market analytics were extraordinary.",
    author: "David & Sofia Montgomery",
    role: "Real Estate Investors",
    location: "Palm Beach"
  }
];

const HAVEN_OFFICES = [
  {
    city: "Beverly Hills",
    address: "9601 Wilshire Boulevard, Suite 1200",
    postal: "Beverly Hills, CA 90210",
    phone: "+1 (310) 849-2100",
    email: "beverlyhills@havenrealty.com",
    timezone: "America/Los_Angeles",
    hours: "Mon - Fri: 8:30 AM - 6:30 PM PST"
  },
  {
    city: "New York",
    address: "590 Madison Avenue, 36th Floor",
    postal: "New York, NY 10022",
    phone: "+1 (212) 694-8800",
    email: "newyork@havenrealty.com",
    timezone: "America/New_York",
    hours: "Mon - Fri: 8:30 AM - 7:00 PM EST"
  },
  {
    city: "Miami & Palm Beach",
    address: "200 South Biscayne Boulevard, Suite 2800",
    postal: "Miami, FL 33131",
    phone: "+1 (305) 512-9900",
    email: "miami@havenrealty.com",
    timezone: "America/New_York",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM EST"
  },
  {
    city: "London",
    address: "14 Berkeley Square, Mayfair",
    postal: "London, W1J 6AE, UK",
    phone: "+44 20 7946 0900",
    email: "london@havenrealty.com",
    timezone: "Europe/London",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM GMT"
  },
  {
    city: "Zurich",
    address: "Bahnhofstrasse 45",
    postal: "8001 Zurich, Switzerland",
    phone: "+41 44 220 5000",
    email: "zurich@havenrealty.com",
    timezone: "Europe/Zurich",
    hours: "Mon - Fri: 9:00 AM - 5:30 PM CET"
  }
];
