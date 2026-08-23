/**
 * NORTHSTAR COMMERCE - Centralized Product Dataset
 * Realistic luxury products across Fashion, Electronics, and Lifestyle.
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 20 },
  { id: 'fashion', name: 'Fashion & Apparel', count: 7, description: 'Refined tailoring, architectural silhouettes, and organic textiles crafted for longevity.' },
  { id: 'electronics', name: 'Electronics & Audio', count: 7, description: 'Precision acoustics, tactile mechanical peripherals, and monolithic industrial design.' },
  { id: 'lifestyle', name: 'Objects & Living', count: 6, description: 'Sculptural homewares, artisanal ceramics, and sensory objects for considered spaces.' }
];

export const BRANDS = [
  'SOLARIS Atelier',
  'KRONOS Tech',
  'NORDIC Form',
  'LUMEN Audio',
  'VERTEX Design',
  'ÉLAN Studio',
  'AURA Objects',
  'ORBIT Lab'
];

export const PRODUCTS = [
  // ==========================================
  // FASHION
  // ==========================================
  {
    id: 'prod-1',
    sku: 'NS-FAS-001',
    name: 'Aero Double-Breasted Wool Overcoat',
    brand: 'SOLARIS Atelier',
    category: 'fashion',
    price: 540,
    originalPrice: 620,
    rating: 4.9,
    reviewsCount: 28,
    stock: 6,
    isNew: true,
    isFeatured: true,
    tags: ['outerwear', 'wool', 'tailored', 'minimalist'],
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Charcoal Mélange', hex: '#2b2c30', inStock: true },
        { name: 'Camel Tan', hex: '#a68058', inStock: true },
        { name: 'Midnight Navy', hex: '#1a2233', inStock: true }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    shortDescription: 'Structured double-breasted overcoat tailored from heavy virgin wool blend with dropped shoulders and horn buttons.',
    description: `Engineered in Northern Italy, the Aero Double-Breasted Overcoat reconciles classical sartorial architecture with relaxed modern drape. Constructed from an unyielding 680gsm virgin wool-cashmere blend, it delivers structured warmth without unneeded bulk. Features wide peak lapels, horn buttons, deep flap pockets, and a full cupro lining that glides smoothly over knitwear.`,
    specs: {
      'Material': '90% Virgin Wool, 10% Cashmere',
      'Lining': '100% Bemberg Cupro',
      'Hardware': 'Natural Horn Buttons',
      'Origin': 'Crafted in Biella, Italy',
      'Care': 'Specialist dry clean only'
    },
    features: [
      'Heavyweight 680gsm thermal insulation',
      'Interior passport & smart device pocket',
      'Reinforced structural shoulder line',
      'Supplied with cedar wood hanger and organic cotton dust garment bag'
    ],
    reviews: [
      {
        id: 'rev-101',
        author: 'Julian V.',
        avatar: 'JV',
        rating: 5,
        title: 'Unrivaled tailoring and drape',
        date: '2 weeks ago',
        verified: true,
        content: 'The drape and weight are truly museum-tier. The charcoal mélange has subtle tonal depth that photos can barely capture.',
        helpful: 14
      },
      {
        id: 'rev-102',
        author: 'Elena R.',
        avatar: 'ER',
        rating: 5,
        title: 'Worth every cent',
        date: '1 month ago',
        verified: true,
        content: 'Worn it during a trip to Oslo in 0°C weather. Windproof, impeccably structured, and receives compliments constantly.',
        helpful: 8
      }
    ]
  },
  {
    id: 'prod-2',
    sku: 'NS-FAS-002',
    name: 'Atelier Minimalist Calfskin Tote',
    brand: 'ÉLAN Studio',
    category: 'fashion',
    price: 420,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 34,
    stock: 9,
    isNew: false,
    isFeatured: true,
    tags: ['leather', 'bags', 'accessories', 'everyday'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Obsidian Black', hex: '#111215', inStock: true },
        { name: 'Cognac Saddle', hex: '#7c4323', inStock: true },
        { name: 'Bone White', hex: '#ebe7df', inStock: false }
      ],
      sizes: ['Standard 16L', 'Grande 24L']
    },
    shortDescription: 'Full-grain Tuscan calfskin leather tote with magnetic gusset closures and dedicated 16-inch laptop compartment.',
    description: `A masterclass in restraint. The Atelier Tote is sculpted from vegetable-tanned full-grain leather that will develop an irreplaceable patina over decades of use. Seamless edge-painted finishes, discreet solid brass hardware, and an interior zipped organizer.`,
    specs: {
      'Leather': 'Vegetable-Tanned Full Grain Tuscan Calfskin',
      'Capacity': '16 Liters (Accommodates 16" MacBook Pro)',
      'Dimensions': '40cm x 34cm x 12cm',
      'Weight': '860g',
      'Origin': 'Florence, Italy'
    },
    features: [
      'Padded micro-suede laptop pocket',
      'Magnetic top clasp closure',
      'Reinforced base studs for upright stability'
    ],
    reviews: [
      {
        id: 'rev-103',
        author: 'Marcus K.',
        avatar: 'MK',
        rating: 5,
        title: 'The ultimate daily commuter tote',
        date: '3 weeks ago',
        verified: true,
        content: 'Clean lines, no loud logos, and the leather aroma is sublime. Fits my laptop, charger, notebook, and water bottle seamlessly.',
        helpful: 19
      }
    ]
  },
  {
    id: 'prod-3',
    sku: 'NS-FAS-003',
    name: 'Raw Selvedge Organic Denim Jean',
    brand: 'VERTEX Design',
    category: 'fashion',
    price: 210,
    originalPrice: 260,
    rating: 4.7,
    reviewsCount: 19,
    stock: 4,
    isNew: false,
    isFeatured: false,
    tags: ['denim', 'selvedge', 'pants', 'organic'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Indigo Dry Selvedge', hex: '#1b2a47', inStock: true },
        { name: 'Washed Black', hex: '#33353b', inStock: true }
      ],
      sizes: ['29/32', '30/32', '31/32', '32/32', '34/32', '36/32']
    },
    shortDescription: '14.5oz Japanese shuttle-loom selvedge denim woven with GOTS certified organic long-staple cotton.',
    description: `Woven on vintage shuttle looms in Okayama, Japan. Features a mid-rise straight relaxed taper, custom copper rivets, and a natural vegetable-tanned leather waistband patch.`,
    specs: {
      'Weight': '14.5 oz Sanforized Selvedge Denim',
      'Cotton': '100% GOTS Organic Cotton',
      'Weave': 'Right-hand 3x1 Twill with Red ID Selvedge',
      'Origin': 'Okayama, Japan'
    },
    features: ['Chain-stitched hems', 'Custom debossed brass rivets', 'Hidden selvedge coin pocket detail'],
    reviews: []
  },
  {
    id: 'prod-4',
    sku: 'NS-FAS-004',
    name: 'Monolith High-Top Leather Sneaker',
    brand: 'SOLARIS Atelier',
    category: 'fashion',
    price: 360,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 42,
    stock: 2, /* LOW STOCK */
    isNew: true,
    isFeatured: true,
    tags: ['footwear', 'leather', 'sneakers', 'monochrome'],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Monochrome Chalk', hex: '#f0eee6', inStock: true },
        { name: 'Triple Black', hex: '#161719', inStock: true }
      ],
      sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45']
    },
    shortDescription: 'Margom vulcanized rubber sole sneaker assembled with Italian nappa leather and ortholite calfskin footbed.',
    description: `Constructed utilizing traditional Strobel construction for maximal flexion. The upper is made with buttery soft buttery nappa leather, hand-stitched to an authentic Italian Margom rubber sole.`,
    specs: {
      'Upper': 'Italian Full-Grain Nappa Leather',
      'Sole': 'Margom Italian Rubber Cup Sole',
      'Footbed': 'Ergonomic Calfskin-lined OrthoLite',
      'Origin': 'Civitanova Marche, Italy'
    },
    features: ['Waxed cotton tonal laces', 'Reinforced heel counter', 'Debossed minimal gold foil series code'],
    reviews: [
      {
        id: 'rev-104',
        author: 'Soren A.',
        avatar: 'SA',
        rating: 5,
        title: 'Architectural perfection on foot',
        date: '3 days ago',
        verified: true,
        content: 'The leather softens in one day. Far superior in build quality to standard designer sneakers.',
        helpful: 7
      }
    ]
  },
  {
    id: 'prod-5',
    sku: 'NS-FAS-005',
    name: 'Fine Gauge Merino Turtleneck',
    brand: 'ÉLAN Studio',
    category: 'fashion',
    price: 185,
    originalPrice: 220,
    rating: 4.8,
    reviewsCount: 16,
    stock: 12,
    isNew: false,
    isFeatured: false,
    tags: ['knitwear', 'merino', 'winter', 'layering'],
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Oatmeal Heather', hex: '#d9d2c5', inStock: true },
        { name: 'Anthracite', hex: '#373a40', inStock: true },
        { name: 'Forest Moss', hex: '#2f3d32', inStock: true }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    shortDescription: '18-gauge extra-fine Australian Merino wool knit with seamless circular construction.',
    description: `Spinning 100% traceable Australian Merino wool into ultra-fine yarns yields an exceptionally smooth, non-itchy knit that regulates body temperature through seasonal transitions.`,
    specs: {
      'Fibre': '100% 19.5 Micron Australian Merino',
      'Gauge': '18-Gauge Fine Knit',
      'Fit': 'Tailored European Cut',
      'Care': 'Hand wash cold or dry clean'
    },
    features: ['Ribbed collar and cuffs', 'Naturally antimicrobial', 'Zero pilling finish'],
    reviews: []
  },
  {
    id: 'prod-6',
    sku: 'NS-FAS-006',
    name: 'Silk Georgette Relaxed Camp Shirt',
    brand: 'SOLARIS Atelier',
    category: 'fashion',
    price: 240,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 11,
    stock: 0, /* SOLD OUT */
    isNew: false,
    isFeatured: false,
    tags: ['silk', 'shirts', 'summer', 'luxury'],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Sand Shell', hex: '#ded6c8', inStock: false },
        { name: 'Nocturne Black', hex: '#17181c', inStock: false }
      ],
      sizes: ['S', 'M', 'L']
    },
    shortDescription: 'Sand-washed mulberry silk camp collar shirt with mother-of-pearl buttons and boxy cut.',
    description: `Ultra-luxurious 22 momme matte sand-washed mulberry silk shirt. Features an open Cuban collar, chest patch pocket, and straight vented hem for effortless elegance.`,
    specs: {
      'Composition': '100% Mulberry Silk (22 Momme)',
      'Buttons': 'Genuine Australian Mother-of-Pearl',
      'Origin': 'Hangzhou'
    },
    features: ['Matte sueded finish', 'Breathable drape', 'Side vent splits'],
    reviews: []
  },
  {
    id: 'prod-7',
    sku: 'NS-FAS-007',
    name: 'Architectural Pleated Trouser',
    brand: 'VERTEX Design',
    category: 'fashion',
    price: 275,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 22,
    stock: 7,
    isNew: true,
    isFeatured: false,
    tags: ['trousers', 'tailored', 'wool', 'contemporary'],
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Slate Taupe', hex: '#635e58', inStock: true },
        { name: 'Ink Black', hex: '#191a1e', inStock: true }
      ],
      sizes: ['30', '32', '34', '36']
    },
    shortDescription: 'Double forward-pleated wide leg trouser cut from high-twist tropical wool with adjustable side tabs.',
    description: `Generous silhouette with crisp permanent front creases and internal hook-and-bar closure. Designed for dramatic fluidity in motion.`,
    specs: {
      'Fabric': '100% High-Twist Tropical Wool',
      'Rise': 'High Rise (12")',
      'Hem': '2" Turnback cuff'
    },
    features: ['Brass side adjuster buckles', 'Slanted side pockets', 'After-dinner split rear waistband'],
    reviews: []
  },

  // ==========================================
  // ELECTRONICS & AUDIO
  // ==========================================
  {
    id: 'prod-8',
    sku: 'NS-ELE-001',
    name: 'AURA 01 Planar Magnetic Reference Headphones',
    brand: 'LUMEN Audio',
    category: 'electronics',
    price: 790,
    originalPrice: 890,
    rating: 5.0,
    reviewsCount: 56,
    stock: 5,
    isNew: true,
    isFeatured: true,
    tags: ['audio', 'headphones', 'audiophile', 'aluminum'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Brushed Silver & Lambskin', hex: '#c5c7cb', inStock: true },
        { name: 'Anodized Space Black', hex: '#1c1e22', inStock: true }
      ],
      sizes: ['Open-Back Edition', 'Closed-Back Studio Edition']
    },
    shortDescription: 'Audiophile open-back headphones with 90mm planar transducer drivers, aircraft CNC aluminum earcups, and memory lambskin cushions.',
    description: `Conceived for mastering engineers and discerning audiophiles, the AURA 01 delivers holographic stereo imaging and sub-bass extension down to 6Hz with zero harmonic distortion. CNC-milled from solid blocks of 6061-T6 aerospace aluminum.`,
    specs: {
      'Driver Type': '90mm Ultra-Thin Planar Magnetic',
      'Frequency Response': '6 Hz – 48,000 Hz',
      'Impedance': '32 Ohms (Easy to drive)',
      'THD': '< 0.05% @ 1kHz, 100dB',
      'Weight': '395g'
    },
    features: [
      'Custom silver-plated oxygen-free copper cable (4.4mm Pentaconn & 6.35mm adapter)',
      'Replaceable magnetic memory foam lambskin pads',
      'Machined aluminum flight travel case'
    ],
    reviews: [
      {
        id: 'rev-105',
        author: 'Dr. Henrik T.',
        avatar: 'HT',
        rating: 5,
        title: 'Micro-detail retrieval is staggering',
        date: '5 days ago',
        verified: true,
        content: 'I have tested everything from Sennheiser HD800S to Focal Utopias. The tonal balance and soundstage separation on the AURA 01 are sublime.',
        helpful: 24
      }
    ]
  },
  {
    id: 'prod-9',
    sku: 'NS-ELE-002',
    name: 'KRONOS CNC Wireless Mechanical Keyboard',
    brand: 'KRONOS Tech',
    category: 'electronics',
    price: 310,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 68,
    stock: 14,
    isNew: true,
    isFeatured: true,
    tags: ['keyboard', 'desk', 'wireless', 'cnc'],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Raw E-White', hex: '#f4f4f4', inStock: true },
        { name: 'Basalt Grey', hex: '#393c43', inStock: true },
        { name: 'Forest Anodized', hex: '#263a2b', inStock: true }
      ],
      sizes: ['Linear Lubed (Silent 45g)', 'Tactile Lubed (55g)']
    },
    shortDescription: 'Gasket-mounted 75% mechanical keyboard housed in a 2.1kg CNC aluminum enclosure with tri-mode wireless connectivity.',
    description: `A weighty desktop monolith. Built with a gasket-mounted FR4 plate, PORON acoustic damping foams, factory hand-lubricated switches, and custom PBT dye-sublimated keycaps. Features 2.4Ghz low-latency, Bluetooth 5.2, and USB-C connectivity.`,
    specs: {
      'Layout': '75% Compact (82 Keys)',
      'Weight': '2,150g (Solid Brass Weight Bar)',
      'Battery': '4000mAh (Up to 240 hours without backlight)',
      'Connectivity': 'Bluetooth 5.2 / 2.4GHz / USB-C'
    },
    features: ['Rotary knurled aluminum volume encoder', 'Hot-swappable 5-pin PCB', 'RGB ambient underglow diffusion'],
    reviews: [
      {
        id: 'rev-106',
        author: 'Liam C.',
        avatar: 'LC',
        rating: 5,
        title: 'Deep creamy acoustics out of the box',
        date: '1 week ago',
        verified: true,
        content: 'No modifications required whatsoever. The gasket bounce is soft, stabilizers are zero rattle, and the battery lasts weeks.',
        helpful: 18
      }
    ]
  },
  {
    id: 'prod-10',
    sku: 'NS-ELE-003',
    name: 'Horizon Smart Chronograph Titanium',
    brand: 'ORBIT Lab',
    category: 'electronics',
    price: 490,
    originalPrice: 560,
    rating: 4.8,
    reviewsCount: 39,
    stock: 3, /* LOW STOCK */
    isNew: false,
    isFeatured: true,
    tags: ['smartwatch', 'titanium', 'wearable', 'sapphire'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Grade 5 Satin Titanium', hex: '#9da3a6', inStock: true },
        { name: 'DLC Midnight Black', hex: '#1b1b1c', inStock: true }
      ],
      sizes: ['42mm Case', '45mm Case']
    },
    shortDescription: 'Ultra-thin Grade 5 Titanium smartwatch with sapphire crystal display, ECG monitoring, and 14-day battery life.',
    description: `Combines haute horlogerie proportions with state-of-the-art biometrics. Features dual-frequency GPS, sleep tracking, 5ATM water resistance, and an always-on 1000-nit AMOLED display.`,
    specs: {
      'Case Material': 'Grade 5 Aerospace Titanium',
      'Glass': 'Double-domed Sapphire Crystal with Anti-Reflective Coating',
      'Water Resistance': '50M / 5 ATM',
      'Battery Life': '14 Days Typical Use'
    },
    features: ['Continuous PPG optical sensor & ECG', 'Quick-release Milanese mesh & Fluoroelastomer straps included', 'Wireless fast magnetic charging'],
    reviews: []
  },
  {
    id: 'prod-11',
    sku: 'NS-ELE-004',
    name: 'Beam Anodized Task Lamp',
    brand: 'VERTEX Design',
    category: 'electronics',
    price: 260,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 15,
    stock: 8,
    isNew: false,
    isFeatured: false,
    tags: ['lighting', 'desk', 'minimalist', 'led'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Brushed Champagne', hex: '#c9bfa8', inStock: true },
        { name: 'Matte Jet', hex: '#1a1a1a', inStock: true }
      ],
      sizes: ['Standard Desk 45cm']
    },
    shortDescription: 'CRI 98 full-spectrum adjustable task light with optical rotary dimmer and USB-C power delivery.',
    description: `Engineered to eliminate eye fatigue. Emits flicker-free sunlight-equivalent light with a color rendering index of 98+. Rotates 360 degrees on friction-damped brass pivot joints.`,
    specs: {
      'Light Source': 'Full-Spectrum High CRI (>98) LEDs',
      'Color Temperature': '2700K - 5000K Stepless',
      'Max Luminance': '1200 Lux @ 40cm',
      'Power': 'USB-C PD 30W'
    },
    features: ['Precision knurled rotary brightness control', 'Solid heavy steel anti-tip base', 'Automatic ambient light sensor mode'],
    reviews: []
  },
  {
    id: 'prod-12',
    sku: 'NS-ELE-005',
    name: 'Monolith Solid Aluminum MagCharge Dock',
    brand: 'KRONOS Tech',
    category: 'electronics',
    price: 145,
    originalPrice: 170,
    rating: 4.9,
    reviewsCount: 51,
    stock: 18,
    isNew: true,
    isFeatured: false,
    tags: ['charger', 'wireless', 'magcharge', 'aluminum'],
    images: [
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Space Silver', hex: '#d1d5db', inStock: true },
        { name: 'Matte Obsidian', hex: '#111215', inStock: true }
      ],
      sizes: ['3-in-1 Charging Stand']
    },
    shortDescription: '15W Fast Qi2 wireless charging station machined from a single block of unibody aluminum for phone, watch, and earbuds.',
    description: `Weighing over 650g, it stays firmly planted when lifting your phone with one hand. Features official Qi2 15W high-speed magnetic alignment for iPhone and Android devices.`,
    specs: {
      'Outputs': '15W Phone Mag + 5W Watch + 5W Earbuds',
      'Weight': '680g (Solid CNC machined)',
      'Input': 'USB-C PD 45W'
    },
    features: ['Integrated weighted micro-suction silicone foot', 'Braided 2m nylon USB-C cable included', 'Smart temperature management IC'],
    reviews: []
  },
  {
    id: 'prod-13',
    sku: 'NS-ELE-006',
    name: 'Resonance Titanium ANC Earbuds',
    brand: 'LUMEN Audio',
    category: 'electronics',
    price: 280,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 31,
    stock: 10,
    isNew: false,
    isFeatured: false,
    tags: ['earbuds', 'wireless', 'anc', 'audio'],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Graphite Ceramic', hex: '#2c2e35', inStock: true },
        { name: 'Pearl White', hex: '#f4f3ef', inStock: true }
      ],
      sizes: ['Standard (Includes 4 Ear Tip Sizes)']
    },
    shortDescription: 'Hybrid active noise cancelling earbuds with beryllium drivers, LDAC lossless codec, and 32h playback.',
    description: `Custom 11mm beryllium-coated dynamic drivers deliver crystal clarity and punchy, tight bass. 45dB active noise reduction silences commute rumble.`,
    specs: {
      'Codecs': 'LDAC, AAC, SBC, aptX Adaptive',
      'ANC Depth': 'Up to -45dB Hybrid Adaptive',
      'Battery': '8h per charge (32h with case)'
    },
    features: ['6-mic beamforming voice isolation', 'IPX5 sweat resistance', 'Multipoint Bluetooth connection'],
    reviews: []
  },
  {
    id: 'prod-14',
    sku: 'NS-ELE-007',
    name: 'Prism Ambient Bluetooth HiFi Speaker',
    brand: 'LUMEN Audio',
    category: 'electronics',
    price: 450,
    originalPrice: 520,
    rating: 4.9,
    reviewsCount: 27,
    stock: 6,
    isNew: true,
    isFeatured: true,
    tags: ['speaker', 'bluetooth', 'hifi', 'design'],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Nordic Oak & Kvadrat Wool', hex: '#c4a682', inStock: true },
        { name: 'Smoked Walnut & Dark Grey', hex: '#543d2b', inStock: true }
      ],
      sizes: ['Single Speaker', 'Stereo Pair Set']
    },
    shortDescription: 'Room-filling 80W acoustic speaker wrapped in Danish Kvadrat fabric with continuous 360-degree diffusion.',
    description: `Acoustically tuned with dual passive radiators, custom silk dome tweeters, and Class-D amplification. Seamless AirPlay 2, Spotify Connect, and Bluetooth 5.3 streaming.`,
    specs: {
      'Amplifier': '80W Class-D Digital Amp',
      'Frequency': '42 Hz - 22,000 Hz',
      'Dimensions': '18cm x 18cm x 24cm'
    },
    features: ['Multi-room stereo pairing', 'Touch sensitive glass volume disc', '16h built-in Li-ion battery'],
    reviews: []
  },

  // ==========================================
  // OBJECTS & LIFESTYLE
  // ==========================================
  {
    id: 'prod-15',
    sku: 'NS-LIF-001',
    name: 'Kyoto Hand-Thrown Ceramic Pour-Over Set',
    brand: 'AURA Objects',
    category: 'lifestyle',
    price: 135,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 47,
    stock: 11,
    isNew: true,
    isFeatured: true,
    tags: ['coffee', 'ceramics', 'artisanal', 'living'],
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Speckled Sand Glaze', hex: '#d6cbbe', inStock: true },
        { name: 'Charcoal Matte Iron', hex: '#3a3938', inStock: true }
      ],
      sizes: ['500ml Server + Dripper Set']
    },
    shortDescription: 'Artisanal stoneware dripper and carafe wheel-thrown by master potters in Kyoto with raw textured glaze.',
    description: `Each set is unique, bearing the individual touch of the potter’s wheel and kiln reduction atmosphere. Designed with optimal 60-degree conical extraction ridges to bring out nuanced floral notes in single-origin beans.`,
    specs: {
      'Material': 'High-Fired Japanese Stoneware',
      'Capacity': '500 ml (2 Cups)',
      'Filter Compatibility': 'Standard V60 02 Filters',
      'Origin': 'Kyoto, Japan'
    },
    features: ['Heat-retentive thick ceramic walls', 'Dishwasher and microwave safe', 'Includes solid brass measuring scoop'],
    reviews: [
      {
        id: 'rev-107',
        author: 'Chloe M.',
        avatar: 'CM',
        rating: 5,
        title: 'Elevated morning ritual',
        date: '4 days ago',
        verified: true,
        content: 'The texture of the clay and the deliberate thermal retention make this the best coffee brewing experience I have ever had.',
        helpful: 15
      }
    ]
  },
  {
    id: 'prod-16',
    sku: 'NS-LIF-002',
    name: 'Brushed Brass Incense Burner & Vessel',
    brand: 'AURA Objects',
    category: 'lifestyle',
    price: 95,
    originalPrice: 120,
    rating: 4.8,
    reviewsCount: 23,
    stock: 8,
    isNew: false,
    isFeatured: false,
    tags: ['sensory', 'brass', 'incense', 'decor'],
    images: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Raw Spun Brass', hex: '#d4af37', inStock: true },
        { name: 'Aged Patina Bronze', hex: '#634f36', inStock: true }
      ],
      sizes: ['Compact Dome (10cm)']
    },
    shortDescription: 'Solid untreated spun brass incense holder that catches ash gracefully while developing a living patina.',
    description: `Turned from a solid ingot of heavy brass. Accommodates standard Japanese bamboo-core and extruded incense sticks.`,
    specs: {
      'Material': '100% Solid Brass (Untreated)',
      'Weight': '420g',
      'Diameter': '100mm'
    },
    features: ['Dual-gauge holder hole (2mm & 3mm)', 'Includes sample pack of 15 Hinoki Cedar incense sticks'],
    reviews: []
  },
  {
    id: 'prod-17',
    sku: 'NS-LIF-003',
    name: 'Washed French Linen Bedding Set',
    brand: 'NORDIC Form',
    category: 'lifestyle',
    price: 320,
    originalPrice: 380,
    rating: 4.9,
    reviewsCount: 38,
    stock: 5,
    isNew: false,
    isFeatured: true,
    tags: ['bedding', 'linen', 'textiles', 'home'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Flax Natural', hex: '#d8cfbc', inStock: true },
        { name: 'Olive Slate', hex: '#5e6357', inStock: true },
        { name: 'Crisp Snow', hex: '#fcfcfc', inStock: true }
      ],
      sizes: ['Queen Duvet Set', 'King Duvet Set']
    },
    shortDescription: '170gsm vintage pre-washed French flax linen duvet cover and two pillowcase shams.',
    description: `Woven from harvested Normandy flax. Stonewashed for relaxed crinkled softness on night one. Highly breathable and moisture-wicking across every season.`,
    specs: {
      'Fabric': '100% Normandy French Flax',
      'Weight': '170 GSM',
      'Set Includes': '1x Duvet Cover, 2x Standard Pillowcases',
      'Closure': 'Natural Corozo Nut Hidden Buttons'
    },
    features: ['Corner interior tie ribbons', 'OEKO-TEX Standard 100 certified non-toxic', 'Softens with every wash cycle'],
    reviews: []
  },
  {
    id: 'prod-18',
    sku: 'NS-LIF-004',
    name: 'Monolithic Travertine Catchall Tray',
    brand: 'NORDIC Form',
    category: 'lifestyle',
    price: 110,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 19,
    stock: 7,
    isNew: true,
    isFeatured: false,
    tags: ['stone', 'travertine', 'minimalist', 'decor'],
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Roman Beige Travertine', hex: '#ded6c6', inStock: true },
        { name: 'Nero Marquina Black', hex: '#202022', inStock: true }
      ],
      sizes: ['Rectangular 28x18cm', 'Circular 22cm']
    },
    shortDescription: 'Sculptural display tray carved from solid unfilled Italian travertine with subtle organic pore textures.',
    description: `A tactile centerpiece for keys, fine jewelry, or timepieces. Hand-honed to a smooth matte finish with padded velvet base.`,
    specs: {
      'Material': 'Solid Natural Italian Travertine',
      'Weight': '1.4 kg',
      'Dimensions': '28cm x 18cm x 2.5cm'
    },
    features: ['Felt protective bottom backing', 'Honed matte non-glossy finish'],
    reviews: []
  },
  {
    id: 'prod-19',
    sku: 'NS-LIF-005',
    name: 'Vacuum Insulated Titanium Flask 600ml',
    brand: 'ORBIT Lab',
    category: 'lifestyle',
    price: 85,
    originalPrice: 100,
    rating: 4.9,
    reviewsCount: 44,
    stock: 15,
    isNew: false,
    isFeatured: false,
    tags: ['flask', 'titanium', 'outdoor', 'everyday'],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Sandblasted Matte Titanium', hex: '#a8abb0', inStock: true },
        { name: 'Anodized Arctic Blue', hex: '#4d6980', inStock: true }
      ],
      sizes: ['600ml / 20oz']
    },
    shortDescription: 'Double-walled pure medical-grade titanium thermos flask. 24h cold, 12h hot insulation at half the weight of steel.',
    description: `Imparts zero metallic taste to delicate teas, coffee, or citrus water. Weighs merely 195 grams yet practically indestructible.`,
    specs: {
      'Material': 'TA1 Medical Grade Pure Titanium',
      'Weight': '195g (Empty)',
      'Insulation': 'Double Wall Vacuum Sealed'
    },
    features: ['Leakproof food-grade silicone gasket', 'BPA-free & lifetime corrosion warranty'],
    reviews: []
  },
  {
    id: 'prod-20',
    sku: 'NS-LIF-006',
    name: 'Santal & Hinoki Botanical Extrait de Parfum',
    brand: 'AURA Objects',
    category: 'lifestyle',
    price: 175,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 36,
    stock: 9,
    isNew: true,
    isFeatured: true,
    tags: ['fragrance', 'botanical', 'sensory', 'parfum'],
    images: [
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: {
      colors: [
        { name: 'Amber Glass Bottle', hex: '#966034', inStock: true }
      ],
      sizes: ['50ml Extrait', '100ml Extrait']
    },
    shortDescription: 'Smoked Australian sandalwood, Japanese Hinoki cypress, dry vetiver, and black cardamon in 30% concentration.',
    description: `A calming architectural scent evoking misty Kyoto temples and cedar groves. Formulated with organic cane alcohol and cold-pressed botanical essences.`,
    specs: {
      'Concentration': '30% Extrait de Parfum',
      'Volume': '50ml (1.7 fl oz)',
      'Top Notes': 'Black Cardamom, Bergamot Peel',
      'Heart Notes': 'Hinoki Cypress, Papyrus, Orris',
      'Base Notes': 'Australian Sandalwood, Vetiver, Amber Resins'
    },
    features: ['Hand-numbered batch bottle', 'Heavy magnetic zamak cap', '12+ hour longevity on skin'],
    reviews: [
      {
        id: 'rev-108',
        author: 'Noor S.',
        avatar: 'NS',
        rating: 5,
        title: 'Meditation in a bottle',
        date: '2 weeks ago',
        verified: true,
        content: 'Warm, grounding, sophisticated. I get stopped on the street regularly by people asking what I am wearing.',
        helpful: 29
      }
    ]
  }
];
