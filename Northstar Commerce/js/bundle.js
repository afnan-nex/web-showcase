/* ==========================================================================
   NORTHSTAR COMMERCE - Production Bundle
   Compatible with file:// and http(s):// protocols
   ========================================================================== */
(function() {
  "use strict";


/* --- MODULE: js/utils/storage.js --- */
/**
 * NORTHSTAR COMMERCE - LocalStorage Management & State Sync
 */

const PREFIX = 'northstar_';

// In-memory fallback if localStorage is unavailable
const memoryFallback = {};

const Storage = {
  get(key, defaultValue = null) {
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(PREFIX + key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return memoryFallback[PREFIX + key] ? JSON.parse(memoryFallback[PREFIX + key]) : defaultValue;
    } catch (e) {
      console.warn(`Storage get error for key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PREFIX + key, serialized);
      } else {
        memoryFallback[PREFIX + key] = serialized;
      }
      return true;
    } catch (e) {
      console.warn(`Storage set error for key "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(PREFIX + key);
      } else {
        delete memoryFallback[PREFIX + key];
      }
      return true;
    } catch (e) {
      console.warn(`Storage remove error for key "${key}":`, e);
      return false;
    }
  },

  clearAll() {
    try {
      if (typeof localStorage !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        Object.keys(memoryFallback).forEach(k => delete memoryFallback[k]);
      }
      return true;
    } catch (e) {
      console.warn('Storage clearAll error:', e);
      return false;
    }
  }
};


/* --- MODULE: js/data/coupons.js --- */
/**
 * NORTHSTAR COMMERCE - Coupon Dataset & Rules Engine
 */

const COUPONS = [
  {
    code: 'NORTHSTAR15',
    type: 'percentage',
    value: 15, // 15% off
    minSpend: 0,
    description: '15% off your entire order (Welcome special)',
    expiresAt: '2030-12-31'
  },
  {
    code: 'SAVE50',
    type: 'fixed',
    value: 50, // $50 off
    minSpend: 300,
    description: '$50 off on orders over $300',
    expiresAt: '2030-12-31'
  },
  {
    code: 'VIP20',
    type: 'percentage',
    value: 20, // 20% off
    minSpend: 500,
    description: 'VIP 20% off for purchases of $500 or more',
    expiresAt: '2030-12-31'
  },
  {
    code: 'FREESHIP',
    type: 'shipping',
    value: 0, // Free shipping override
    minSpend: 50,
    description: 'Complimentary Express Worldwide Shipping',
    expiresAt: '2030-12-31'
  },
  {
    code: 'EXPIRED25',
    type: 'percentage',
    value: 25,
    minSpend: 100,
    description: 'Expired seasonal discount code for testing validation',
    expiresAt: '2023-01-01'
  }
];

/**
 * Validate and calculate discount for a given coupon code and cart total
 */
function evaluateCoupon(codeStr, subtotal) {
  if (!codeStr || typeof codeStr !== 'string') {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const normalized = codeStr.trim().toUpperCase();
  const coupon = COUPONS.find(c => c.code === normalized);

  if (!coupon) {
    return { valid: false, message: 'Invalid or unrecognized coupon code.' };
  }

  // Check expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: 'This coupon code has expired.' };
  }

  // Check minimum spend
  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return {
      valid: false,
      message: `Minimum order of $${coupon.minSpend} required for this code. (Current: $${subtotal.toFixed(2)})`
    };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
  } else if (coupon.type === 'fixed') {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'shipping') {
    discountAmount = 0; // Handled in shipping fee deduction
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Promo code ${coupon.code} applied: ${coupon.description}`
  };
}


/* --- MODULE: js/data/products.js --- */
/**
 * NORTHSTAR COMMERCE - Centralized Product Dataset
 * Realistic luxury products across Fashion, Electronics, and Lifestyle.
 */

const CATEGORIES = [
  { id: 'all', name: 'All Products', count: 20 },
  { id: 'fashion', name: 'Fashion & Apparel', count: 7, description: 'Refined tailoring, architectural silhouettes, and organic textiles crafted for longevity.' },
  { id: 'electronics', name: 'Electronics & Audio', count: 7, description: 'Precision acoustics, tactile mechanical peripherals, and monolithic industrial design.' },
  { id: 'lifestyle', name: 'Objects & Living', count: 6, description: 'Sculptural homewares, artisanal ceramics, and sensory objects for considered spaces.' }
];

const BRANDS = [
  'SOLARIS Atelier',
  'KRONOS Tech',
  'NORDIC Form',
  'LUMEN Audio',
  'VERTEX Design',
  'ÉLAN Studio',
  'AURA Objects',
  'ORBIT Lab'
];

const PRODUCTS = [
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


/* --- MODULE: js/utils/helpers.js --- */
/**
 * NORTHSTAR COMMERCE - Core Helper Utilities
 */

function formatPrice(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function debounce(func, wait = 250) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function generateOrderId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NS-${randomStr}`;
}

function fuzzySearch(query, items, fields = ['name', 'brand', 'category', 'shortDescription', 'tags']) {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter(Boolean);

  return items.filter(item => {
    let searchableText = '';
    fields.forEach(f => {
      if (Array.isArray(item[f])) {
        searchableText += ' ' + item[f].join(' ');
      } else if (item[f]) {
        searchableText += ' ' + item[f];
      }
    });
    searchableText = searchableText.toLowerCase();

    // Must match all query words somewhere in the searchable text
    return qWords.every(word => searchableText.includes(word));
  });
}

function renderStars(rating = 5, size = 14) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3 && rating % 1 <= 0.8;
  const total = 5;
  let html = `<span class="rating-stars" style="display:inline-flex; align-items:center; gap:2px;">`;

  for (let i = 0; i < fullStars; i++) {
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#d97706"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
  if (hasHalf) {
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#d97706"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.4"></path><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" fill="#d97706"></path></svg>`;
  }
  const remaining = total - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#d1d5db"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }

  html += `</span>`;
  return html;
}

function getSvgIcon(name, customClass = '') {
  const icons = {
    bag: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    heart: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    heartFilled: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    search: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    user: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    close: `<svg class="${customClass}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    menu: `<svg class="${customClass}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    arrowRight: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    chevronDown: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    chevronRight: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    truck: `<svg class="${customClass}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    shield: `<svg class="${customClass}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    refresh: `<svg class="${customClass}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    trash: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    eye: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    filter: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
    check: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    star: `<svg class="${customClass}" width="16" height="16" viewBox="0 0 24 24" fill="#d97706"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
  };

  return icons[name] || '';
}


/* --- MODULE: js/utils/toast.js --- */
/**
 * NORTHSTAR COMMERCE - Toast Notification System
 */

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  },

  show(message, type = 'info', duration = 3200, action = null) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
        ${iconSvg}
        <span>${message}</span>
      </div>
      ${action ? `<button class="toast-action-btn" style="color: #ffffff; text-decoration: underline; font-size: 12px; margin-left: 8px; font-weight: 600;">${action.label}</button>` : ''}
    `;

    if (action && action.onClick) {
      const actionBtn = toast.querySelector('.toast-action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          action.onClick();
          this.dismiss(toast);
        });
      }
    }

    this.container.appendChild(toast);

    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });

    return toast;
  },

  success(msg, duration = 3000, action = null) {
    return this.show(msg, 'success', duration, action);
  },

  error(msg, duration = 4000) {
    return this.show(msg, 'danger', duration);
  },

  warning(msg, duration = 3500) {
    return this.show(msg, 'warning', duration);
  },

  info(msg, duration = 3000) {
    return this.show(msg, 'info', duration);
  },

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 280);
  }
};


/* --- MODULE: js/store/cartStore.js --- */
/**
 * NORTHSTAR COMMERCE - Cart State Management
 */





const CART_STORAGE_KEY = 'cart_state';
const FREE_SHIPPING_THRESHOLD = 150; // $150 for free standard shipping
const STANDARD_SHIPPING_FEE = 15;
const TAX_RATE = 0.08; // 8%

class CartStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    const saved = Storage.get(CART_STORAGE_KEY, null);
    if (saved && Array.isArray(saved.items)) {
      return {
        items: saved.items,
        couponCode: saved.couponCode || null,
        shippingMethod: saved.shippingMethod || 'standard',
        orderNotes: saved.orderNotes || ''
      };
    }
    return {
      items: [],
      couponCode: null,
      shippingMethod: 'standard',
      orderNotes: ''
    };
  }

  saveState() {
    Storage.set(CART_STORAGE_KEY, this.state);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const summary = this.getSummary();
    this.listeners.forEach(fn => fn(this.state, summary));
  }

  getItems() {
    return this.state.items;
  }

  getCount() {
    return this.state.items.reduce((total, item) => total + item.quantity, 0);
  }

  addItem(product, variant = {}, quantity = 1) {
    if (!product || product.stock <= 0) {
      Toast.error('Sorry, this product is currently sold out.');
      return false;
    }

    const color = variant.color || (product.variants?.colors?.[0]?.name || 'Standard');
    const size = variant.size || (product.variants?.sizes?.[0] || 'Standard');
    const itemKey = `${product.id}_${color}_${size}`;

    const existingIndex = this.state.items.findIndex(item => item.key === itemKey);

    if (existingIndex > -1) {
      const currentQty = this.state.items[existingIndex].quantity;
      const newQty = currentQty + quantity;
      
      if (newQty > product.stock) {
        Toast.warning(`Maximum available stock (${product.stock} units) reached for this selection.`);
        this.state.items[existingIndex].quantity = product.stock;
      } else {
        this.state.items[existingIndex].quantity = newQty;
        Toast.success(`Updated "${product.name}" quantity in bag.`);
      }
    } else {
      const initialQty = Math.min(quantity, product.stock);
      this.state.items.push({
        key: itemKey,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        color: color,
        size: size,
        quantity: initialQty,
        maxStock: product.stock
      });
      Toast.success(`Added "${product.name}" (${color}) to your bag.`);
    }

    this.saveState();
    return true;
  }

  updateQuantity(itemKey, quantity) {
    const item = this.state.items.find(i => i.key === itemKey);
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(itemKey);
      return;
    }

    if (quantity > item.maxStock) {
      item.quantity = item.maxStock;
      Toast.warning(`Cannot exceed available inventory (${item.maxStock} units).`);
    } else {
      item.quantity = quantity;
    }

    this.saveState();
  }

  removeItem(itemKey) {
    const item = this.state.items.find(i => i.key === itemKey);
    const itemName = item ? item.name : 'Item';
    this.state.items = this.state.items.filter(i => i.key !== itemKey);
    this.saveState();
    Toast.info(`Removed "${itemName}" from bag.`);
  }

  clear() {
    this.state.items = [];
    this.state.couponCode = null;
    this.state.orderNotes = '';
    this.saveState();
  }

  applyCoupon(code) {
    const subtotal = this.getSubtotal();
    const evaluation = evaluateCoupon(code, subtotal);

    if (!evaluation.valid) {
      Toast.error(evaluation.message);
      return false;
    }

    this.state.couponCode = evaluation.coupon.code;
    this.saveState();
    Toast.success(evaluation.message);
    return true;
  }

  removeCoupon() {
    this.state.couponCode = null;
    this.saveState();
    Toast.info('Promo code removed.');
  }

  setShippingMethod(method) {
    this.state.shippingMethod = method;
    this.saveState();
  }

  getSubtotal() {
    return this.state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getSummary() {
    const subtotal = this.getSubtotal();
    let discount = 0;
    let couponDetails = null;

    if (this.state.couponCode) {
      const evaluation = evaluateCoupon(this.state.couponCode, subtotal);
      if (evaluation.valid) {
        discount = evaluation.discountAmount;
        couponDetails = evaluation.coupon;
      } else {
        this.state.couponCode = null;
      }
    }

    let shippingFee = 0;
    const isFreeShippingByAmount = subtotal >= FREE_SHIPPING_THRESHOLD;
    const isFreeShippingByCoupon = couponDetails?.type === 'shipping';

    if (this.state.items.length === 0) {
      shippingFee = 0;
    } else if (isFreeShippingByCoupon || (isFreeShippingByAmount && this.state.shippingMethod === 'standard')) {
      shippingFee = 0;
    } else if (this.state.shippingMethod === 'express') {
      shippingFee = 25;
    } else if (this.state.shippingMethod === 'overnight') {
      shippingFee = 45;
    } else {
      shippingFee = STANDARD_SHIPPING_FEE;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const estimatedTax = discountedSubtotal > 0 ? discountedSubtotal * TAX_RATE : 0;
    const grandTotal = discountedSubtotal + shippingFee + estimatedTax;

    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    return {
      itemsCount: this.getCount(),
      subtotal,
      discount,
      couponCode: this.state.couponCode,
      couponDetails,
      shippingFee,
      shippingMethod: this.state.shippingMethod,
      estimatedTax,
      grandTotal,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      freeShippingProgress,
      isFreeShipping: isFreeShippingByAmount || isFreeShippingByCoupon
    };
  }
}

const cartStore = new CartStore();


/* --- MODULE: js/store/wishlistStore.js --- */
/**
 * NORTHSTAR COMMERCE - Wishlist State Management
 */




const WISHLIST_STORAGE_KEY = 'wishlist_ids';

class WishlistStore {
  constructor() {
    this.listeners = [];
    this.productIds = this.loadState();
  }

  loadState() {
    const saved = Storage.get(WISHLIST_STORAGE_KEY, []);
    return Array.isArray(saved) ? saved : [];
  }

  saveState() {
    Storage.set(WISHLIST_STORAGE_KEY, this.productIds);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.productIds));
  }

  getItems() {
    return this.productIds;
  }

  getCount() {
    return this.productIds.length;
  }

  has(productId) {
    return this.productIds.includes(productId);
  }

  toggle(product) {
    if (!product || !product.id) return false;
    const exists = this.has(product.id);

    if (exists) {
      this.productIds = this.productIds.filter(id => id !== product.id);
      Toast.info(`Removed "${product.name}" from your wishlist.`);
    } else {
      this.productIds.push(product.id);
      Toast.success(`Saved "${product.name}" to your wishlist.`);
    }

    this.saveState();
    return !exists;
  }

  add(product) {
    if (!product || !product.id) return;
    if (!this.has(product.id)) {
      this.productIds.push(product.id);
      this.saveState();
      Toast.success(`Saved "${product.name}" to your wishlist.`);
    }
  }

  remove(productId) {
    this.productIds = this.productIds.filter(id => id !== productId);
    this.saveState();
  }

  clear() {
    this.productIds = [];
    this.saveState();
    Toast.info('Wishlist cleared.');
  }
}

const wishlistStore = new WishlistStore();


/* --- MODULE: js/store/productStore.js --- */
/**
 * NORTHSTAR COMMERCE - Product Query & Store Engine
 */






const RECENTLY_VIEWED_KEY = 'recently_viewed';
const CUSTOM_REVIEWS_KEY = 'custom_reviews';

class ProductStore {
  constructor() {
    this.rawProducts = PRODUCTS;
    this.categories = CATEGORIES;
    this.brands = BRANDS;
    this.customReviews = Storage.get(CUSTOM_REVIEWS_KEY, {});
  }

  /**
   * Get all products with dynamic customer reviews attached
   */
  getAllProducts() {
    return this.rawProducts.map(product => {
      const addedReviews = this.customReviews[product.id] || [];
      const allReviews = [...(product.reviews || []), ...addedReviews];
      
      let calculatedRating = product.rating;
      let calculatedCount = product.reviewsCount;

      if (addedReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        calculatedRating = Number((totalRating / allReviews.length).toFixed(1));
        calculatedCount = allReviews.length;
      }

      return {
        ...product,
        reviews: allReviews,
        rating: calculatedRating,
        reviewsCount: calculatedCount
      };
    });
  }

  getProductById(id) {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  getCategories() {
    return this.categories;
  }

  getBrands() {
    return this.brands;
  }

  /**
   * Advanced Multi-Facet Filter and Sort
   */
  filterAndSort(options = {}) {
    let list = this.getAllProducts();

    const {
      category = 'all',
      searchQuery = '',
      minPrice = 0,
      maxPrice = Infinity,
      brands = [],
      minRating = 0,
      inStockOnly = false,
      onSaleOnly = false,
      sortBy = 'featured'
    } = options;

    // Category filter
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    // Search query
    if (searchQuery && searchQuery.trim()) {
      list = fuzzySearch(searchQuery, list);
    }

    // Price range
    list = list.filter(p => p.price >= minPrice && (maxPrice === Infinity || p.price <= maxPrice));

    // Brands
    if (brands.length > 0) {
      list = list.filter(p => brands.includes(p.brand));
    }

    // Rating
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // In stock
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    // On sale
    if (onSaleOnly) {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }

  // ----------------------------------------------------
  // Recently Viewed Products System
  // ----------------------------------------------------
  trackRecentlyViewed(productId) {
    if (!productId) return;
    let recent = Storage.get(RECENTLY_VIEWED_KEY, []);
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 8) {
      recent = recent.slice(0, 8);
    }
    Storage.set(RECENTLY_VIEWED_KEY, recent);
  }

  getRecentlyViewedProducts(currentProductId = null) {
    const recentIds = Storage.get(RECENTLY_VIEWED_KEY, []);
    const filteredIds = currentProductId ? recentIds.filter(id => id !== currentProductId) : recentIds;
    return filteredIds
      .map(id => this.getProductById(id))
      .filter(Boolean);
  }

  // ----------------------------------------------------
  // Review Submission & Persistence System
  // ----------------------------------------------------
  addReview(productId, reviewData) {
    const { author, rating, title, content } = reviewData;
    if (!author || !rating || !content) {
      Toast.error('Please complete all required review fields.');
      return false;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      avatar: author.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CU',
      rating: Number(rating),
      title: title ? title.trim() : '',
      content: content.trim(),
      date: 'Just now',
      verified: true,
      helpful: 0
    };

    if (!this.customReviews[productId]) {
      this.customReviews[productId] = [];
    }

    this.customReviews[productId].unshift(newReview);
    Storage.set(CUSTOM_REVIEWS_KEY, this.customReviews);
    Toast.success('Thank you! Your review has been published.');
    return newReview;
  }
}

const productStore = new ProductStore();


/* --- MODULE: js/store/orderStore.js --- */
/**
 * NORTHSTAR COMMERCE - Order Management & Customer Account Store
 */






const ORDERS_KEY = 'customer_orders';
const USER_PROFILE_KEY = 'customer_profile';

// Seed demo past order if empty so customer history looks rich immediately
const DEFAULT_DEMO_ORDER = {
  orderId: 'NS-783921',
  date: '2026-08-10T14:32:00Z',
  status: 'Delivered',
  trackingNumber: 'TRK-9823184920',
  carrier: 'DHL Express',
  customer: {
    fullName: 'Alexander Wright',
    email: 'alexander.wright@atelier.io',
    phone: '+1 (555) 234-5678',
    address: '420 Madison Avenue, Suite 1800',
    city: 'New York',
    state: 'NY',
    postalCode: '10017',
    country: 'United States'
  },
  shippingMethod: 'Express Courier',
  payment: {
    method: 'Credit Card',
    last4: '4242',
    cardBrand: 'Visa'
  },
  items: [
    {
      productId: 'prod-8',
      name: 'AURA 01 Planar Magnetic Reference Headphones',
      brand: 'LUMEN Audio',
      price: 790,
      color: 'Brushed Silver & Lambskin',
      size: 'Open-Back Edition',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    }
  ],
  subtotal: 790,
  discount: 0,
  shippingFee: 0,
  tax: 63.20,
  total: 853.20
};

class OrderStore {
  constructor() {
    this.orders = this.loadOrders();
    this.profile = this.loadProfile();
  }

  loadOrders() {
    const saved = Storage.get(ORDERS_KEY, null);
    if (saved && Array.isArray(saved)) {
      return saved;
    }
    // Seed initial demo order
    const initial = [DEFAULT_DEMO_ORDER];
    Storage.set(ORDERS_KEY, initial);
    return initial;
  }

  loadProfile() {
    return Storage.get(USER_PROFILE_KEY, {
      fullName: 'Alexander Wright',
      email: 'alexander.wright@atelier.io',
      phone: '+1 (555) 234-5678',
      address: '420 Madison Avenue, Suite 1800',
      city: 'New York',
      state: 'NY',
      postalCode: '10017',
      country: 'United States'
    });
  }

  saveOrders() {
    Storage.set(ORDERS_KEY, this.orders);
  }

  saveProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
    Storage.set(USER_PROFILE_KEY, this.profile);
    Toast.success('Profile preferences updated.');
  }

  getOrders() {
    return this.orders;
  }

  getOrderById(orderId) {
    return this.orders.find(o => o.orderId === orderId) || null;
  }

  getProfile() {
    return this.profile;
  }

  /**
   * Process and place order from checkout
   */
  createOrder(checkoutData) {
    const summary = cartStore.getSummary();
    const cartItems = cartStore.getItems();

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const orderId = generateOrderId();
    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      carrier: 'DHL Express Worldwide',
      customer: {
        fullName: `${checkoutData.firstName} ${checkoutData.lastName}`,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        apartment: checkoutData.apartment || '',
        city: checkoutData.city,
        state: checkoutData.state,
        postalCode: checkoutData.postalCode,
        country: checkoutData.country || 'United States'
      },
      shippingMethod: checkoutData.shippingMethodName || 'Standard Tracked Delivery',
      payment: {
        method: checkoutData.paymentMethod || 'Credit Card',
        last4: checkoutData.cardNumber ? checkoutData.cardNumber.replace(/\s+/g, '').slice(-4) : '4242',
        cardBrand: 'Visa'
      },
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: summary.subtotal,
      discount: summary.discount,
      couponCode: summary.couponCode,
      shippingFee: summary.shippingFee,
      tax: summary.estimatedTax,
      total: summary.grandTotal
    };

    // Prepend to orders history
    this.orders.unshift(newOrder);
    this.saveOrders();

    // Optionally update user profile with latest shipping address
    this.profile = {
      ...this.profile,
      fullName: newOrder.customer.fullName,
      email: newOrder.customer.email,
      phone: newOrder.customer.phone,
      address: newOrder.customer.address,
      city: newOrder.customer.city,
      state: newOrder.customer.state,
      postalCode: newOrder.customer.postalCode,
      country: newOrder.customer.country
    };
    Storage.set(USER_PROFILE_KEY, this.profile);

    // Clear cart
    cartStore.clear();

    return newOrder;
  }
}

const orderStore = new OrderStore();


/* --- MODULE: js/components/productCard.js --- */
/**
 * NORTHSTAR COMMERCE - Standardized Product Card Component
 */




function renderProductCard(product) {
  if (!product) return '';

  const isWishlisted = wishlistStore.has(product.id);
  const isSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const mainImg = product.images[0];
  const hoverImg = product.images[1] || product.images[0];

  return `
    <article class="product-card ${isSoldOut ? 'sold-out' : ''}" data-product-id="${product.id}" aria-label="${product.name}">
      <div class="product-card-image-wrap">
        <a href="#/product/${product.id}" class="product-card-link" aria-label="View details for ${product.name}">
          <img src="${mainImg}" alt="${product.name} primary angle" class="product-card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'" />
          <img src="${hoverImg}" alt="${product.name} alternate view" class="product-card-image-hover" loading="lazy" onerror="this.style.display='none'" />
        </a>

        <!-- Status Badges -->
        <div class="product-card-badges">
          ${isSoldOut ? `<span class="badge badge-soldout">Sold Out</span>` : ''}
          ${!isSoldOut && product.isNew ? `<span class="badge badge-dark">New Season</span>` : ''}
          ${!isSoldOut && isSale ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          ${!isSoldOut && isLowStock ? `<span class="badge badge-warning">Only ${product.stock} Left</span>` : ''}
        </div>

        <!-- Wishlist Button -->
        <button type="button" class="product-card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-product-id="${product.id}" title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}" aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
          ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
        </button>

        <!-- Quick Actions Overlay -->
        ${!isSoldOut ? `
          <div class="product-card-quick-actions">
            <button type="button" class="product-card-quick-btn" data-action="quick-view" data-product-id="${product.id}" aria-label="Quick view ${product.name}">
              Quick View
            </button>
            <button type="button" class="product-card-quick-btn" data-action="quick-add" data-product-id="${product.id}" aria-label="Quick add ${product.name} to shopping bag">
              + Add to Bag
            </button>
          </div>
        ` : ''}
      </div>

      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-brand">${product.brand}</span>
          <div class="product-card-rating" title="${product.rating} stars from ${product.reviewsCount} customer reviews">
            ${getSvgIcon('star')}
            <span>${product.rating}</span>
            <span class="text-muted">(${product.reviewsCount})</span>
          </div>
        </div>

        <h3 class="product-card-title">
          <a href="#/product/${product.id}">${product.name}</a>
        </h3>

        ${product.variants?.colors ? `
          <div class="product-card-swatches" title="Available in ${product.variants.colors.length} colorways">
            ${product.variants.colors.slice(0, 4).map(c => `
              <span class="swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('')}
            ${product.variants.colors.length > 4 ? `<span class="text-2xs text-muted">+${product.variants.colors.length - 4}</span>` : ''}
          </div>
        ` : ''}

        <div class="product-card-price-wrap">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          ${isSale ? `
            <span class="product-card-price-original">${formatPrice(product.originalPrice)}</span>
            <span class="product-card-discount-tag">Save ${discountPercent}%</span>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}


/* --- MODULE: js/components/drawerCart.js --- */
/**
 * NORTHSTAR COMMERCE - Slide-Over Cart Drawer Component
 */




const DrawerCart = {
  drawerEl: null,
  overlayEl: null,

  init() {
    this.drawerEl = document.getElementById('drawer-cart');
    this.overlayEl = document.getElementById('drawer-overlay');

    if (!this.drawerEl) return;

    // Listen for cart changes to re-render drawer
    cartStore.subscribe(() => {
      this.render();
    });

    // Close buttons and overlay clicks
    const closeBtn = this.drawerEl.querySelector('.drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    // Attach delegated events
    this.attachEvents();
    this.render();
  },

  open() {
    if (!this.drawerEl) return;
    this.render();
    this.drawerEl.classList.add('open');
    if (this.overlayEl) this.overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.drawerEl) return;
    this.drawerEl.classList.remove('open');
    if (this.overlayEl) this.overlayEl.classList.remove('active');
    document.body.style.overflow = '';
  },

  attachEvents() {
    this.drawerEl.addEventListener('click', (e) => {
      const target = e.target.closest('[data-cart-action]');
      if (!target) return;

      const action = target.getAttribute('data-cart-action');
      const itemKey = target.getAttribute('data-item-key');

      if (action === 'increase' && itemKey) {
        const item = cartStore.getItems().find(i => i.key === itemKey);
        if (item) cartStore.updateQuantity(itemKey, item.quantity + 1);
      } else if (action === 'decrease' && itemKey) {
        const item = cartStore.getItems().find(i => i.key === itemKey);
        if (item) cartStore.updateQuantity(itemKey, item.quantity - 1);
      } else if (action === 'remove' && itemKey) {
        cartStore.removeItem(itemKey);
      } else if (action === 'apply-coupon') {
        const input = this.drawerEl.querySelector('.promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          input.value = '';
        }
      } else if (action === 'remove-coupon') {
        cartStore.removeCoupon();
      } else if (action === 'checkout') {
        this.close();
        window.location.hash = '#/checkout';
      } else if (action === 'view-cart') {
        this.close();
        window.location.hash = '#/cart';
      }
    });

    // Enter key in coupon input
    this.drawerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('promo-input')) {
        e.preventDefault();
        const code = e.target.value.trim();
        if (code) {
          cartStore.applyCoupon(code);
          e.target.value = '';
        }
      }
    });
  },

  render() {
    if (!this.drawerEl) return;
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();

    const bodyEl = this.drawerEl.querySelector('.drawer-cart-body');
    const footerEl = this.drawerEl.querySelector('.drawer-cart-footer');
    const countBadge = this.drawerEl.querySelector('.drawer-cart-count');
    const shippingBarEl = this.drawerEl.querySelector('.shipping-bar-wrap');

    if (countBadge) {
      countBadge.textContent = `(${summary.itemsCount})`;
    }

    // Free shipping progress bar
    if (shippingBarEl && shippingBarEl.style) {
      if (items.length > 0) {
        shippingBarEl.style.display = 'block';
        if (summary.freeShippingRemaining <= 0 || summary.isFreeShipping) {
          shippingBarEl.innerHTML = `
            <div class="shipping-bar-text" style="color: var(--color-success); font-weight: 600;">
              ✓ You've unlocked Complimentary Express Delivery!
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress free" style="width: 100%;"></div>
            </div>
          `;
        } else {
          shippingBarEl.innerHTML = `
            <div class="shipping-bar-text">
              Add <strong>${formatPrice(summary.freeShippingRemaining)}</strong> more to claim <strong>Free Express Shipping</strong>
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress" style="width: ${summary.freeShippingProgress}%;"></div>
            </div>
          `;
        }
      } else {
        shippingBarEl.style.display = 'none';
      }
    }

    if (!bodyEl) return;

    // Body content (items or empty state)
    if (items.length === 0) {
      bodyEl.innerHTML = `
        <div class="cart-empty-state">
          ${getSvgIcon('bag')}
          <h4>Your Bag is Empty</h4>
          <p class="text-sm text-muted" style="max-width: 260px;">Explore our curated collection of luxury apparel, precision electronics, and design objects.</p>
          <a href="#/shop" class="btn btn-secondary btn-sm" onclick="document.getElementById('drawer-cart').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('active'); document.body.style.overflow='';">Explore Collection</a>
        </div>
      `;
      if (footerEl && footerEl.style) footerEl.style.display = 'none';
      return;
    }

    if (footerEl && footerEl.style) footerEl.style.display = 'flex';

    bodyEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title"><a href="#/product/${item.productId}" onclick="document.getElementById('drawer-cart').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('active'); document.body.style.overflow='';">${item.name}</a></h4>
            <div class="cart-item-variant">${item.color} • ${item.size}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn" data-cart-action="decrease" data-item-key="${item.key}" aria-label="Decrease">−</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly />
              <button type="button" class="qty-btn" data-cart-action="increase" data-item-key="${item.key}" ${item.quantity >= item.maxStock ? 'disabled' : ''} aria-label="Increase">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-cart-action="remove" data-item-key="${item.key}" title="Remove item">
              ${getSvgIcon('trash')}
            </button>
          </div>
        </div>
        <div style="text-align: right; font-size: var(--text-sm); font-weight: 700;">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');

    // Footer content
    if (footerEl) {
      footerEl.innerHTML = `
        ${summary.couponCode ? `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-bg-alt); padding: 8px 12px; border-radius: var(--radius-xs); font-size: var(--text-xs);">
            <span style="font-family: var(--font-mono); font-weight: 600;">CODE: ${summary.couponCode}</span>
            <button type="button" data-cart-action="remove-coupon" style="color: var(--color-danger); text-decoration: underline; font-weight: 600;">Remove</button>
          </div>
        ` : `
          <div class="promo-box">
            <input type="text" class="promo-input" placeholder="Promo code (e.g. NORTHSTAR15)" />
            <button type="button" class="btn btn-secondary btn-sm" data-cart-action="apply-coupon">Apply</button>
          </div>
        `}

        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(summary.subtotal)}</span>
          </div>
          ${summary.discount > 0 ? `
            <div class="cart-summary-row" style="color: var(--color-danger);">
              <span>Discount (${summary.couponCode})</span>
              <span>-${formatPrice(summary.discount)}</span>
            </div>
          ` : ''}
          <div class="cart-summary-row">
            <span>Estimated Shipping</span>
            <span>${summary.shippingFee === 0 ? 'FREE' : formatPrice(summary.shippingFee)}</span>
          </div>
          <div class="divider-subtle" style="margin: 4px 0;"></div>
          <div class="cart-summary-row cart-summary-total">
            <span>Estimated Total</span>
            <span>${formatPrice(summary.grandTotal)}</span>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-full" data-cart-action="checkout">
          Proceed to Checkout
        </button>
        <button type="button" class="btn btn-link btn-sm" data-cart-action="view-cart" style="text-align: center; margin-top: 2px;">
          View Full Bag Details
        </button>
      `;
    }
  }
};


/* --- MODULE: js/components/quickViewModal.js --- */
/**
 * NORTHSTAR COMMERCE - Quick View Modal Component
 */






const QuickViewModal = {
  modalEl: null,
  currentProduct: null,
  selectedColor: null,
  selectedSize: null,
  quantity: 1,

  init() {
    this.modalEl = document.getElementById('quick-view-modal');
    if (!this.modalEl) return;

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    this.attachEvents();
  },

  open(productId) {
    const product = productStore.getProductById(productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedColor = product.variants?.colors?.[0]?.name || 'Standard';
    this.selectedSize = product.variants?.sizes?.[0] || 'Standard';
    this.quantity = 1;

    this.render();
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  },

  attachEvents() {
    this.modalEl.addEventListener('click', (e) => {
      const colorBtn = e.target.closest('[data-qv-color]');
      if (colorBtn) {
        this.selectedColor = colorBtn.getAttribute('data-qv-color');
        this.render();
        return;
      }

      const sizeBtn = e.target.closest('[data-qv-size]');
      if (sizeBtn) {
        this.selectedSize = sizeBtn.getAttribute('data-qv-size');
        this.render();
        return;
      }

      const thumbBtn = e.target.closest('[data-qv-thumb]');
      if (thumbBtn) {
        const src = thumbBtn.getAttribute('data-qv-thumb');
        const mainImg = this.modalEl.querySelector('.qv-main-img');
        if (mainImg) mainImg.src = src;
        this.modalEl.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumbBtn.classList.add('active');
        return;
      }

      const qtyAction = e.target.closest('[data-qv-qty]');
      if (qtyAction) {
        const type = qtyAction.getAttribute('data-qv-qty');
        if (type === 'inc' && this.quantity < this.currentProduct.stock) {
          this.quantity++;
        } else if (type === 'dec' && this.quantity > 1) {
          this.quantity--;
        }
        const qtyInput = this.modalEl.querySelector('.qv-qty-val');
        if (qtyInput) qtyInput.value = this.quantity;
        return;
      }

      const addBtn = e.target.closest('[data-action="qv-add-to-cart"]');
      if (addBtn && this.currentProduct) {
        cartStore.addItem(this.currentProduct, { color: this.selectedColor, size: this.selectedSize }, this.quantity);
        this.close();
        return;
      }

      const wishlistBtn = e.target.closest('[data-action="qv-wishlist"]');
      if (wishlistBtn && this.currentProduct) {
        wishlistStore.toggle(this.currentProduct);
        this.render();
        return;
      }
    });
  },

  render() {
    if (!this.modalEl || !this.currentProduct) return;
    const p = this.currentProduct;
    const isWishlisted = wishlistStore.has(p.id);
    const isSale = p.originalPrice && p.originalPrice > p.price;
    const discountPercent = isSale ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const isSoldOut = p.stock <= 0;

    const cardEl = this.modalEl.querySelector('.modal-card');
    if (!cardEl) return;
    cardEl.className = 'modal-card quick-view-card';

    cardEl.innerHTML = `
      <button type="button" class="modal-close-btn" aria-label="Close modal">
        ${getSvgIcon('close')}
      </button>

      <!-- Left Gallery -->
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        <div style="aspect-ratio: 4/5; overflow: hidden; border-radius: var(--radius-xs); background: var(--color-bg-alt);">
          <img src="${p.images[0]}" alt="${p.name}" class="qv-main-img" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="display: flex; gap: var(--space-2); overflow-x: auto;">
          ${p.images.map((img, idx) => `
            <button type="button" class="qv-thumb ${idx === 0 ? 'active' : ''}" data-qv-thumb="${img}" style="width: 60px; height: 75px; flex-shrink: 0; border: 1px solid var(--color-border); border-radius: var(--radius-xs); overflow: hidden; background: var(--color-bg-alt); padding: 0;">
              <img src="${img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Right Info -->
      <div style="display: flex; flex-direction: column;">
        <span class="text-uppercase text-muted" style="margin-bottom: 4px;">${p.brand}</span>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-2);">${p.name}</h2>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4);">
          ${renderStars(p.rating, 14)}
          <span class="text-xs text-muted">${p.rating} (${p.reviewsCount} reviews)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <span style="font-size: var(--text-xl); font-weight: 700;">${formatPrice(p.price)}</span>
          ${isSale ? `
            <span style="font-size: var(--text-base); color: var(--color-text-muted); text-decoration: line-through;">${formatPrice(p.originalPrice)}</span>
            <span class="badge badge-sale">Save ${discountPercent}%</span>
          ` : ''}
        </div>

        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4); line-height: 1.5;">
          ${p.shortDescription}
        </p>

        <!-- Color Selector -->
        ${p.variants?.colors ? `
          <div style="margin-bottom: var(--space-4);">
            <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
              Color: <span style="color: var(--color-text-secondary); font-weight: 400;">${this.selectedColor}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              ${p.variants.colors.map(c => `
                <button type="button" class="swatch-dot ${this.selectedColor === c.name ? 'active' : ''}" data-qv-color="${c.name}" style="background-color: ${c.hex}; width: 24px; height: 24px; border: 2px solid ${this.selectedColor === c.name ? 'var(--color-accent)' : 'transparent'}; box-shadow: 0 0 0 1px var(--color-border);" title="${c.name}"></button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Size Selector -->
        ${p.variants?.sizes ? `
          <div style="margin-bottom: var(--space-4);">
            <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
              Size / Variant: <span style="color: var(--color-text-secondary); font-weight: 400;">${this.selectedSize}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${p.variants.sizes.map(s => `
                <button type="button" class="btn btn-outline btn-sm ${this.selectedSize === s ? 'btn-primary' : ''}" data-qv-size="${s}" style="padding: 4px 10px; font-size: 12px;">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Stock Indicator -->
        <div style="margin-bottom: var(--space-4);">
          ${isSoldOut ? `
            <span class="badge badge-soldout">Currently Out of Stock</span>
          ` : p.stock <= 3 ? `
            <span class="badge badge-warning">Low Stock — Only ${p.stock} units remaining</span>
          ` : `
            <span class="badge badge-success">In Stock (${p.stock} units ready to ship)</span>
          `}
        </div>

        <!-- Action Row -->
        ${!isSoldOut ? `
          <div style="display: flex; gap: var(--space-3); margin-top: auto;">
            <div class="qty-control" style="height: 44px;">
              <button type="button" class="qty-btn" data-qv-qty="dec" style="width: 36px;">−</button>
              <input type="text" class="qty-input qv-qty-val" value="${this.quantity}" readonly style="width: 36px; font-size: 14px;" />
              <button type="button" class="qty-btn" data-qv-qty="inc" style="width: 36px;">+</button>
            </div>
            <button type="button" class="btn btn-primary" data-action="qv-add-to-cart" style="flex: 1; height: 44px;">
              Add to Bag • ${formatPrice(p.price * this.quantity)}
            </button>
            <button type="button" class="btn-icon" data-action="qv-wishlist" style="width: 44px; height: 44px; color: ${isWishlisted ? 'var(--color-danger)' : 'inherit'};" title="Save to wishlist">
              ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
            </button>
          </div>
        ` : `
          <button type="button" class="btn btn-secondary btn-full" disabled style="margin-top: auto;">
            Sold Out
          </button>
        `}

        <a href="#/product/${p.id}" class="btn btn-link btn-sm" style="text-align: center; margin-top: var(--space-4);" onclick="document.getElementById('quick-view-modal').classList.remove('open'); document.body.style.overflow='';">
          View Complete Product Specifications →
        </a>
      </div>
    `;
  }
};


/* --- MODULE: js/components/searchModal.js --- */
/**
 * NORTHSTAR COMMERCE - Global Fuzzy Search Modal Component
 */




const SearchModal = {
  modalEl: null,
  inputEl: null,
  resultsEl: null,

  init() {
    this.modalEl = document.getElementById('search-modal');
    if (!this.modalEl) return;

    this.inputEl = this.modalEl.querySelector('.search-main-input');
    this.resultsEl = this.modalEl.querySelector('.search-results-list');

    // Close listeners
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
      // Global shortcut: Ctrl+K or '/' to open search
      if (e && (e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.open();
      }
    });

    // Debounced search typing listener
    if (this.inputEl) {
      this.inputEl.addEventListener('input', debounce((e) => {
        this.performSearch(e.target.value);
      }, 180));
    }

    // Quick tag chips click
    this.modalEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.search-chip');
      if (chip) {
        const query = chip.getAttribute('data-search-tag');
        if (this.inputEl) {
          this.inputEl.value = query;
          this.performSearch(query);
        }
      }
    });
  },

  open(initialQuery = '') {
    if (!this.modalEl) return;
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (this.inputEl) {
      this.inputEl.value = initialQuery;
      setTimeout(() => this.inputEl.focus(), 50);
      this.performSearch(initialQuery);
    }
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  },

  performSearch(query) {
    if (!this.resultsEl) return;

    const trimmed = (query || '').trim();

    if (!trimmed) {
      this.resultsEl.innerHTML = `
        <div style="padding: var(--space-4) 0; color: var(--color-text-muted); font-size: var(--text-sm); text-align: center;">
          Type to search products, brands, or materials...
        </div>
      `;
      return;
    }

    const matches = productStore.filterAndSort({ searchQuery: trimmed });

    if (matches.length === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: var(--space-8) 0; text-align: center;">
          <p style="font-size: var(--text-sm); font-weight: 600; margin-bottom: 4px;">No matching items found for "${trimmed}"</p>
          <p class="text-xs text-muted">Try checking for spelling errors or searching for broad terms like "wool", "audio", "titanium", or "living".</p>
        </div>
      `;
      return;
    }

    this.resultsEl.innerHTML = `
      <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: flex; justify-content: space-between;">
        <span>Found ${matches.length} matches</span>
        <a href="#/shop?q=${encodeURIComponent(trimmed)}" onclick="document.getElementById('search-modal').classList.remove('open'); document.body.style.overflow='';" style="color: var(--color-accent); text-decoration: underline;">View all in Catalog →</a>
      </div>
      ${matches.slice(0, 8).map(p => `
        <a href="#/product/${p.id}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('open'); document.body.style.overflow='';">
          <img src="${p.images[0]}" alt="${p.name}" class="search-result-img" />
          <div style="flex: 1; min-width: 0;">
            <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em;">${p.brand} • ${p.category}</div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: 700; color: var(--color-text-primary);">
            ${formatPrice(p.price)}
          </div>
        </a>
      `).join('')}
    `;
  }
};


/* --- MODULE: js/components/infoModal.js --- */
/**
 * NORTHSTAR COMMERCE - Information & Policy Modal Component
 * Renders complete, authentic brand policies, sustainability monographs, and terms.
 */



const INFO_CONTENT = {
  privacy: {
    title: 'Client Privacy & Data Confidentiality',
    subtitle: 'Revision 2026.08 — Northstar Atelier Compliance',
    body: `
      <p>Northstar Commerce collects client data exclusively for the fulfillment of orders, courier dispatch tracking, and archival warranty records. We do not sell, rent, or trade client telemetry or payment credentials to third-party data brokers.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Information Collected</h4>
      <p>When an order is authorized, we record full name, shipping destination, encrypted contact info, and tokenized payment verification. We do not store raw cardholder CVV codes.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Local Storage</h4>
      <p>Your shopping bag, saved wishlist, and local order logs are persisted directly inside your client browser storage for instant retrieval and offline continuity.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Data Erasure</h4>
      <p>Clients may purge all stored local profile data anytime via the Client Portal settings or by clearing browser cache.</p>
    `
  },
  terms: {
    title: 'Terms of Sale & Client Agreement',
    subtitle: 'Governing Archival Acquisitions',
    body: `
      <p>By authorizing an order through Northstar Commerce, you agree to our standard terms of sale, authentic craftsmanship certifications, and courier dispatch guidelines.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Order Authenticity</h4>
      <p>All items listed on Northstar Commerce are 100% authentic, numbered studio editions crafted in direct collaboration with our partner ateliers in Biella, Florence, Kyoto, and Okayama.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Pricing & Taxes</h4>
      <p>Prices are denominated in USD. Applicable local state taxes and duties are computed and itemized transparently at checkout prior to final payment authorization.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Title of Goods</h4>
      <p>Title and risk of loss pass to the client upon recorded courier handover with signature verification.</p>
    `
  },
  sustainability: {
    title: 'The Sustainability & Materials Manifesto',
    subtitle: 'Traceable Textiles, Recycled Alloys & Zero Waste Packaging',
    body: `
      <p>We reject planned obsolescence. Our design philosophy mandates that every garment, acoustic peripheral, and ceramic vessel withstand decades of tactile utility.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Traceable Raw Fibres</h4>
      <p>100% of our wools are sourced from non-mulesed farms in Biella and Australia. Our denim uses GOTS certified organic long-staple cotton, woven on vintage Japanese low-tension shuttle looms.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Monolithic Metals</h4>
      <p>Our electronics utilize Grade 5 aerospace titanium and 6061-T6 aluminum milled with 98% recycled swarf recovery.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Circular Packaging</h4>
      <p>All shipments are dispatched in FSC-certified unbleached corrugated cartons with water-activated starch tape and unbleached organic cotton dust bags.</p>
    `
  },
  shipping: {
    title: 'Worldwide Concierge Courier & Shipping',
    subtitle: 'Insured Priority Dispatch',
    body: `
      <p>Every Northstar order is inspected by hand, wrapped in organic cotton dust packaging, and dispatched via insured courier.</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0;">
        <tr style="border-bottom: 1px solid var(--color-border); font-weight: 600;">
          <td style="padding: 8px 0;">Method</td>
          <td style="padding: 8px 0;">Transit Window</td>
          <td style="padding: 8px 0; text-align: right;">Cost</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border-subtle);">
          <td style="padding: 8px 0;">Standard Tracked Delivery</td>
          <td style="padding: 8px 0;">3–5 Business Days</td>
          <td style="padding: 8px 0; text-align: right;">Free over $150 ($15 below)</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-border-subtle);">
          <td style="padding: 8px 0;">Express Priority Courier</td>
          <td style="padding: 8px 0;">1–2 Business Days</td>
          <td style="padding: 8px 0; text-align: right;">$25.00</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">White-Glove Overnight</td>
          <td style="padding: 8px 0;">Next Day (Morning)</td>
          <td style="padding: 8px 0; text-align: right;">$45.00</td>
        </tr>
      </table>
      <p>All shipments include end-to-end tracking and direct signature verification upon delivery.</p>
    `
  },
  returns: {
    title: '30-Day Doorstep Complimentary Returns',
    subtitle: 'Hassle-Free Trial Guarantee',
    body: `
      <p>We want you to experience our pieces in your personal daily environment. If any item does not exceed your exacting expectations, return it within 30 days of delivery.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Condition of Returns</h4>
      <p>Items must be in unworn, unwashed condition with intact security tags, original dust bags, and presentation boxes.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Prepaid Courier Pickup</h4>
      <p>Initiate a return request via your Client Portal. We supply a prepaid DHL/FedEx return label and schedule a doorstep courier collection at your convenience.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Rapid Refund</h4>
      <p>Refunds are credited to your original payment method within 48 hours of atelier inspection.</p>
    `
  },
  warranty: {
    title: 'Lifetime Archival Warranty',
    subtitle: 'Structural Integrity Guarantee',
    body: `
      <p>Northstar pieces are engineered to outlive temporary trends. We provide comprehensive repair and warranty coverage against structural and material defects.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. Outerwear & Leather Goods</h4>
      <p>Lifetime coverage for hardware (zippers, horn buttons, rivets) and structural stitching seams.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Electronics & Acoustics</h4>
      <p>3-Year comprehensive hardware warranty covering planar transducer drivers, wireless charging ICs, and mechanical keyboard switches.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">3. Atelier Restoration Service</h4>
      <p>Our European ateliers provide re-waxing, leather conditioning, and sole replacement services at nominal cost.</p>
    `
  },
  security: {
    title: 'Security Verification & Payment Protocols',
    subtitle: 'Bank-Grade 256-Bit SSL Protection',
    body: `
      <p>All transactions processed through Northstar Commerce are encrypted end-to-end adhering to Level 1 PCI-DSS financial industry standards.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">1. End-to-End Encryption</h4>
      <p>Payment data is transmitted over TLS 1.3 cryptographic protocols with modern AES-256 GCM cipher suites.</p>
      <h4 style="margin: 18px 0 6px; font-size: 14px;">2. Fraud Shielding</h4>
      <p>3D-Secure 2.0 biometric verification and real-time velocity monitoring protect client identities against unauthorized card usage.</p>
    `
  }
};

const InfoModal = {
  modalEl: null,

  init() {
    this.modalEl = document.getElementById('info-modal');
    if (!this.modalEl) return;

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    // Global listener for info triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-info-topic]');
      if (trigger) {
        e.preventDefault();
        const topic = trigger.getAttribute('data-info-topic');
        this.open(topic);
      }
    });
  },

  open(topicKey) {
    if (!this.modalEl) return;
    const content = INFO_CONTENT[topicKey] || INFO_CONTENT.privacy;

    const card = this.modalEl.querySelector('.info-modal-card');
    if (card) {
      card.innerHTML = `
        <button type="button" class="modal-close-btn" aria-label="Close information dialog">
          ${getSvgIcon('close')}
        </button>
        <div class="text-xs text-uppercase font-semibold" style="letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: 4px;">
          ${content.subtitle}
        </div>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-4);">${content.title}</h2>
        <div class="divider-subtle" style="margin: 12px 0 18px;"></div>
        <div style="font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7;">
          ${content.body}
        </div>
        <div style="margin-top: var(--space-8); display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary btn-sm modal-close-btn">Understood</button>
        </div>
      `;
    }

    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }
};


/* --- MODULE: js/views/homeView.js --- */
/**
 * NORTHSTAR COMMERCE - Home Page View
 */






const HomeView = {
  render() {
    const featuredProducts = productStore.filterAndSort({ sortBy: 'featured' }).slice(0, 4);
    const newArrivals = productStore.filterAndSort({ sortBy: 'newest' }).slice(0, 4);

    return `
      <div class="home-view">
        <!-- 1. Hero Section -->
        <section class="hero-section">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85" alt="Northstar Commerce Campaign" class="hero-bg-media" />
          <div class="hero-overlay"></div>
          <div class="container">
            <div class="hero-content">
              <div class="hero-badge">
                <span>Autumn / Winter Monograph</span>
                <span>•</span>
                <span>Edition 2026</span>
              </div>
              <h1 class="hero-title font-serif">
                Considered design for tactile living.
              </h1>
              <p class="hero-subtitle">
                An uncompromising collection of architectural tailoring, planar acoustic engineering, and hand-thrown Japanese homewares.
              </p>
              <div class="hero-actions">
                <a href="#/shop" class="btn btn-primary btn-lg">
                  Explore Catalog
                  ${getSvgIcon('arrowRight')}
                </a>
                <a href="#/category/fashion" class="btn btn-outline btn-lg">
                  View Lookbook
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Value Pillars -->
        <section class="values-section">
          <div class="container">
            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('truck')}</div>
                <div>
                  <h4>Complimentary Express</h4>
                  <p>Global expedited shipping on all orders over $150.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('shield')}</div>
                <div>
                  <h4>Archival Longevity</h4>
                  <p>Virgin wools, grade 5 titanium, and hand-honed travertine.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('refresh')}</div>
                <div>
                  <h4>30-Day Effortless Trial</h4>
                  <p>Hassle-free doorstep returns and full refund guarantee.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('star')}</div>
                <div>
                  <h4>Master Craftsmanship</h4>
                  <p>Direct partnerships with independent ateliers in Italy and Kyoto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Category Portals -->
        <section class="category-portals">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Curated Disciplines</h2>
                <p>Browse by design category</p>
              </div>
              <a href="#/shop" class="btn btn-link">View All Categories →</a>
            </div>

            <div class="portal-grid">
              <!-- Fashion -->
              <a href="#/category/fashion" class="portal-card">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Fashion Apparel" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 01</div>
                  <h3 class="portal-card-title">Apparel & Tailoring</h3>
                  <span class="portal-card-cta">Discover Fashion ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>

              <!-- Electronics -->
              <a href="#/category/electronics" class="portal-card">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" alt="Electronics & Audio" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 02</div>
                  <h3 class="portal-card-title">Acoustics & Tech</h3>
                  <span class="portal-card-cta">Explore Audio ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>

              <!-- Lifestyle -->
              <a href="#/category/lifestyle" class="portal-card">
                <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" alt="Objects & Living" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 03</div>
                  <h3 class="portal-card-title">Living & Objects</h3>
                  <span class="portal-card-cta">Explore Objects ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- 4. Featured Products Grid -->
        <section style="padding: var(--space-16) 0; background-color: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Featured Archive</h2>
                <p>Selected icons defined by uncompromising material integrity.</p>
              </div>
              <a href="#/shop" class="btn btn-secondary btn-sm">Shop All Featured</a>
            </div>

            <div class="grid grid-cols-4">
              ${featuredProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 5. Editorial Lookbook Split Section -->
        <section class="lookbook-section">
          <div class="container">
            <div class="lookbook-card">
              <div class="lookbook-media">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85" alt="Aero Double-Breasted Wool Overcoat" />
              </div>
              <div class="lookbook-content">
                <span class="text-uppercase" style="color: #b38b4d; margin-bottom: 8px; display: block; font-weight: 600;">The Sartorial Monolith</span>
                <h3 class="font-serif">The Aero Wool Overcoat</h3>
                <p>
                  Cut from 680gsm Biella virgin wool with dropped shoulders and unyielding drape. Designed in collaboration with third-generation master weavers in Northern Italy.
                </p>
                <div style="display: flex; gap: var(--space-4); align-items: center;">
                  <a href="#/product/prod-1" class="btn btn-primary">
                    View Overcoat • $540
                  </a>
                  <a href="#/category/fashion" class="btn btn-outline" style="border-color: rgba(255,255,255,0.3); color: #fff;">
                    Browse Outerwear
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. New Season Arrivals -->
        <section style="padding: var(--space-16) 0;">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>New Season Releases</h2>
                <p>The newest arrivals to the Northstar catalog.</p>
              </div>
              <a href="#/shop?sort=newest" class="btn btn-link">View All New →</a>
            </div>

            <div class="grid grid-cols-4">
              ${newArrivals.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 7. Press Quotes / Accolades -->
        <section style="padding: var(--space-16) 0; background-color: var(--color-surface); border-top: 1px solid var(--color-border);">
          <div class="container-narrow" style="text-align: center;">
            <div class="text-uppercase text-muted" style="margin-bottom: var(--space-4);">Critical Acclaim</div>
            <blockquote class="font-serif" style="font-size: var(--text-2xl); font-style: italic; line-height: 1.4; color: var(--color-text-primary); margin-bottom: var(--space-6);">
              "Northstar Commerce has set a standard for digital commerce — where physical object materiality meets ruthless digital restraint."
            </blockquote>
            <cite style="font-size: var(--text-xs); font-style: normal; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted);">
              — The Design Review Quarterly
            </cite>
          </div>
        </section>
      </div>
    `;
  },

  attachEvents(container) {
    // Events are handled by global card delegation or specific page hooks
  }
};


/* --- MODULE: js/views/shopView.js --- */
/**
 * NORTHSTAR COMMERCE - Shop / Catalog View with Multi-Facet Filters & Sorting
 */





const ShopView = {
  state: {
    category: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 1000,
    selectedBrands: [],
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
    viewMode: 'grid-3', // 'grid-4' | 'grid-3' | 'grid-2' | 'list'
    mobileFilterOpen: false
  },

  render(routeParams = {}, queryParams = {}) {
    // Initialize filter state from route & query
    if (routeParams.category) this.state.category = routeParams.category;
    if (queryParams.category) this.state.category = queryParams.category;
    if (queryParams.q) this.state.searchQuery = queryParams.q;
    if (queryParams.sort) this.state.sortBy = queryParams.sort;
    if (queryParams.sale === 'true') this.state.onSaleOnly = true;

    const categories = productStore.getCategories();
    const brands = productStore.getBrands();
    const currentCategoryObj = categories.find(c => c.id === this.state.category);

    const filteredProducts = productStore.filterAndSort({
      category: this.state.category,
      searchQuery: this.state.searchQuery,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      brands: this.state.selectedBrands,
      minRating: this.state.minRating,
      inStockOnly: this.state.inStockOnly,
      onSaleOnly: this.state.onSaleOnly,
      sortBy: this.state.sortBy
    });

    const hasActiveFilters = this.state.category !== 'all' ||
      this.state.searchQuery !== '' ||
      this.state.minPrice > 0 ||
      this.state.maxPrice < 1000 ||
      this.state.selectedBrands.length > 0 ||
      this.state.minRating > 0 ||
      this.state.inStockOnly ||
      this.state.onSaleOnly;

    return `
      <div class="shop-page container">
        <!-- Shop Header & Breadcrumbs -->
        <header class="shop-header">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumb">
            <a href="#/home">Home</a>
            <span>/</span>
            <a href="#/shop">Catalog</a>
            ${this.state.category !== 'all' ? `
              <span>/</span>
              <span style="color: var(--color-text-primary); font-weight: 600;">${currentCategoryObj ? currentCategoryObj.name : this.state.category}</span>
            ` : ''}
          </nav>

          <div class="shop-title-row">
            <div>
              <h1 style="font-size: var(--text-3xl);">
                ${this.state.category !== 'all' ? (currentCategoryObj?.name || 'Category') : 'Complete Catalog'}
              </h1>
              <p class="text-sm text-muted" style="margin-top: 4px; max-width: 640px;">
                ${currentCategoryObj?.description || 'Explore our full repository of luxury outerwear, audio transducers, mechanical tools, and artisanal living objects.'}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-4);">
              <!-- Mobile Filter Drawer Trigger -->
              <button type="button" class="btn btn-outline btn-sm mobile-filter-btn" id="open-mobile-filters-btn" style="display: none;">
                ${getSvgIcon('filter')}
                <span>Filters ${hasActiveFilters ? '• Active' : ''}</span>
              </button>
              <div class="text-sm text-muted" style="font-weight: 500;">
                Showing <strong>${filteredProducts.length}</strong> items
              </div>
            </div>
          </div>
        </header>

        <div class="shop-layout">
          <!-- Left Filter Sidebar (Desktop & Mobile Drawer) -->
          <aside class="shop-filters-sidebar ${this.state.mobileFilterOpen ? 'mobile-open' : ''}" id="shop-filter-aside">
            <div class="filters-header">
              <span style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Refine By</span>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                ${hasActiveFilters ? `
                  <button type="button" class="btn-link btn-xs" id="clear-all-filters-btn" style="color: var(--color-danger); font-size: 11px;">Clear All</button>
                ` : ''}
                <button type="button" class="action-btn mobile-filter-close-btn" id="close-mobile-filters-btn" style="display: none; width: 32px; height: 32px;" aria-label="Close filters">
                  ${getSvgIcon('close')}
                </button>
              </div>
            </div>

            <!-- In-catalog Search Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Search</div>
              <input type="text" id="shop-filter-search" class="form-input" placeholder="Keyword, brand..." value="${this.state.searchQuery}" style="padding: 6px 10px; font-size: 13px;" />
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Category</div>
              <div class="filter-options-list">
                ${categories.map(cat => `
                  <label class="filter-checkbox-item">
                    <span style="display: flex; align-items: center; gap: 8px;">
                      <input type="radio" name="shop-category" value="${cat.id}" ${this.state.category === cat.id ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <span style="${this.state.category === cat.id ? 'font-weight: 600; color: var(--color-text-primary);' : ''}">${cat.name}</span>
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <div class="filter-group-title">
                <span>Price</span>
                <span class="filter-count" id="price-display-val">${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}</span>
              </div>
              <input type="range" id="shop-price-slider" min="0" max="1000" step="25" value="${this.state.maxPrice}" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;" aria-label="Price range filter slider" />
              <div class="price-range-inputs">
                <div class="price-input-box">
                  <span>$</span>
                  <input type="number" id="min-price-input" min="0" max="1000" value="${this.state.minPrice}" aria-label="Minimum price" />
                </div>
                <span class="text-muted">–</span>
                <div class="price-input-box">
                  <span>$</span>
                  <input type="number" id="max-price-input" min="0" max="1000" value="${this.state.maxPrice}" aria-label="Maximum price" />
                </div>
              </div>
            </div>

            <!-- Brand Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Brand / Atelier</div>
              <div class="filter-options-list" style="max-height: 180px; overflow-y: auto;">
                ${brands.map(b => `
                  <label class="filter-checkbox-item">
                    <span style="display: flex; align-items: center; gap: 8px;">
                      <input type="checkbox" class="shop-brand-checkbox" value="${b}" ${this.state.selectedBrands.includes(b) ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <span>${b}</span>
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Minimum Rating</div>
              <div class="filter-options-list">
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="0" ${this.state.minRating === 0 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>All Ratings</span>
                  </span>
                </label>
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="4.8" ${this.state.minRating === 4.8 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>★ 4.8 & above</span>
                  </span>
                </label>
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="4.5" ${this.state.minRating === 4.5 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>★ 4.5 & above</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Toggles (In Stock & Sale) -->
            <div class="filter-group" style="margin-bottom: 0;">
              <div class="filter-options-list">
                <label class="form-checkbox-label">
                  <input type="checkbox" class="form-checkbox" id="shop-instock-toggle" ${this.state.inStockOnly ? 'checked' : ''} />
                  <span>In Stock Only</span>
                </label>
                <label class="form-checkbox-label" style="margin-top: 6px;">
                  <input type="checkbox" class="form-checkbox" id="shop-sale-toggle" ${this.state.onSaleOnly ? 'checked' : ''} />
                  <span>Special Archive Releases</span>
                </label>
              </div>
            </div>

            <!-- Mobile Apply Filters Action -->
            <button type="button" class="btn btn-primary btn-full mobile-apply-filters-btn" id="mobile-apply-btn" style="display: none; margin-top: var(--space-6);">
              Apply Filters (${filteredProducts.length} items)
            </button>
          </aside>

          <!-- Right Main Catalog Area -->
          <main class="shop-products-main">
            <!-- Catalog Top Toolbar -->
            <div class="catalog-top-bar">
              <div style="display: flex; align-items: center; gap: var(--space-4);">
                <label for="catalog-sort-select" style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">
                  Sort:
                </label>
                <select id="catalog-sort-select" class="form-select" style="width: auto; padding: 4px 10px; font-size: 13px;">
                  <option value="featured" ${this.state.sortBy === 'featured' ? 'selected' : ''}>Curated / Featured</option>
                  <option value="newest" ${this.state.sortBy === 'newest' ? 'selected' : ''}>New Season First</option>
                  <option value="price-asc" ${this.state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-desc" ${this.state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${this.state.sortBy === 'rating' ? 'selected' : ''}>Highest Customer Rating</option>
                  <option value="name-asc" ${this.state.sortBy === 'name-asc' ? 'selected' : ''}>Alphabetical (A–Z)</option>
                </select>
              </div>

              <!-- View Switchers (Grid / List) -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn-icon" data-view-mode="grid-3" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-3' ? 'background: var(--color-accent); color: #fff;' : ''}" title="3-Column Grid">3</button>
                <button type="button" class="btn-icon" data-view-mode="grid-4" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-4' ? 'background: var(--color-accent); color: #fff;' : ''}" title="4-Column Grid">4</button>
                <button type="button" class="btn-icon" data-view-mode="grid-2" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-2' ? 'background: var(--color-accent); color: #fff;' : ''}" title="2-Column Grid">2</button>
                <button type="button" class="btn-icon" data-view-mode="list" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'list' ? 'background: var(--color-accent); color: #fff;' : ''}" title="List View">≡</button>
              </div>
            </div>

            <!-- Active Filters Chip Bar -->
            ${hasActiveFilters ? `
              <div class="active-filter-chips">
                ${this.state.category !== 'all' ? `
                  <span class="filter-chip-removable">
                    Category: ${currentCategoryObj?.name || this.state.category}
                    <button type="button" data-remove-filter="category" aria-label="Remove category filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.searchQuery ? `
                  <span class="filter-chip-removable">
                    "${this.state.searchQuery}"
                    <button type="button" data-remove-filter="search" aria-label="Remove search filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.maxPrice < 1000 || this.state.minPrice > 0 ? `
                  <span class="filter-chip-removable">
                    ${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}
                    <button type="button" data-remove-filter="price" aria-label="Remove price filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.selectedBrands.map(b => `
                  <span class="filter-chip-removable">
                    ${b}
                    <button type="button" data-remove-brand="${b}" aria-label="Remove ${b} brand filter">&times;</button>
                  </span>
                `).join('')}
                ${this.state.inStockOnly ? `
                  <span class="filter-chip-removable">
                    In Stock Only
                    <button type="button" data-remove-filter="instock" aria-label="Remove in-stock filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.onSaleOnly ? `
                  <span class="filter-chip-removable">
                    Special Archive
                    <button type="button" data-remove-filter="sale" aria-label="Remove sale filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.minRating > 0 ? `
                  <span class="filter-chip-removable">
                    ★ ${this.state.minRating}+
                    <button type="button" data-remove-filter="rating" aria-label="Remove rating filter">&times;</button>
                  </span>
                ` : ''}
                <button type="button" class="btn-link btn-xs" id="clear-all-chips-btn" style="color: var(--color-danger); align-self: center; margin-left: 8px;">Reset All</button>
              </div>
            ` : ''}

            <!-- Products Grid or Empty State -->
            ${filteredProducts.length > 0 ? `
              <div class="${this.state.viewMode === 'list' ? 'grid-list-view' : this.state.viewMode === 'grid-4' ? 'grid grid-cols-4' : this.state.viewMode === 'grid-2' ? 'grid grid-cols-2' : 'grid grid-cols-3'}" id="shop-product-grid">
                ${filteredProducts.map(p => renderProductCard(p)).join('')}
              </div>
            ` : `
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-16) var(--space-8); text-align: center;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4);">
                  ${getSvgIcon('search')}
                </div>
                <h3 style="margin-bottom: var(--space-2);">No Products Match Your Criteria</h3>
                <p class="text-sm text-muted" style="max-width: 380px; margin: 0 auto var(--space-6);">Try adjusting your price range, clearing brand selections, or searching for a broader term.</p>
                <button type="button" class="btn btn-secondary btn-sm" id="empty-reset-filters-btn">Reset All Filters</button>
              </div>
            `}
          </main>
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    // Mobile filter drawer triggers
    const openMobileFiltersBtn = container.querySelector('#open-mobile-filters-btn');
    const closeMobileFiltersBtn = container.querySelector('#close-mobile-filters-btn');
    const mobileApplyBtn = container.querySelector('#mobile-apply-btn');
    const filterAside = container.querySelector('#shop-filter-aside');

    if (openMobileFiltersBtn && filterAside) {
      openMobileFiltersBtn.addEventListener('click', () => {
        filterAside.classList.add('mobile-open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeMobileFiltersBtn && filterAside) {
      closeMobileFiltersBtn.addEventListener('click', () => {
        filterAside.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    }

    if (mobileApplyBtn && filterAside) {
      mobileApplyBtn.addEventListener('click', () => {
        filterAside.classList.remove('mobile-open');
        document.body.style.overflow = '';
        refresh();
      });
    }

    // Category Radio
    const catRadios = container.querySelectorAll('input[name="shop-category"]');
    catRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        refresh();
      });
    });

    // Search Input
    const searchInput = container.querySelector('#shop-filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        const gridEl = container.querySelector('#shop-product-grid');
        const matches = productStore.filterAndSort({
          category: this.state.category,
          searchQuery: this.state.searchQuery,
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          brands: this.state.selectedBrands,
          minRating: this.state.minRating,
          inStockOnly: this.state.inStockOnly,
          onSaleOnly: this.state.onSaleOnly,
          sortBy: this.state.sortBy
        });
        if (gridEl) {
          gridEl.innerHTML = matches.map(p => renderProductCard(p)).join('');
        }
      });
    }

    // Price Slider & Number Inputs
    const priceSlider = container.querySelector('#shop-price-slider');
    const maxPriceInput = container.querySelector('#max-price-input');
    const minPriceInput = container.querySelector('#min-price-input');

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.state.maxPrice = Number(e.target.value);
        if (maxPriceInput) maxPriceInput.value = this.state.maxPrice;
        const disp = container.querySelector('#price-display-val');
        if (disp) disp.textContent = `${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}`;
      });
      priceSlider.addEventListener('change', () => refresh());
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener('change', (e) => {
        this.state.maxPrice = Number(e.target.value);
        refresh();
      });
    }

    if (minPriceInput) {
      minPriceInput.addEventListener('change', (e) => {
        this.state.minPrice = Number(e.target.value);
        refresh();
      });
    }

    // Brand Checkboxes
    const brandCheckboxes = container.querySelectorAll('.shop-brand-checkbox');
    brandCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(container.querySelectorAll('.shop-brand-checkbox:checked')).map(el => el.value);
        this.state.selectedBrands = checked;
        refresh();
      });
    });

    // Rating Radio
    const ratingRadios = container.querySelectorAll('input[name="shop-rating"]');
    ratingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.minRating = Number(e.target.value);
        refresh();
      });
    });

    // In Stock Toggle
    const inStockToggle = container.querySelector('#shop-instock-toggle');
    if (inStockToggle) {
      inStockToggle.addEventListener('change', (e) => {
        this.state.inStockOnly = e.target.checked;
        refresh();
      });
    }

    // Sale Toggle
    const saleToggle = container.querySelector('#shop-sale-toggle');
    if (saleToggle) {
      saleToggle.addEventListener('change', (e) => {
        this.state.onSaleOnly = e.target.checked;
        refresh();
      });
    }

    // Sort Dropdown
    const sortSelect = container.querySelector('#catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        refresh();
      });
    }

    // View Mode Switchers
    const viewModeBtns = container.querySelectorAll('[data-view-mode]');
    viewModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.viewMode = btn.getAttribute('data-view-mode');
        refresh();
      });
    });

    // Remove active filter chips & Clear All
    container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-filter]');
      if (removeBtn) {
        const filterType = removeBtn.getAttribute('data-remove-filter');
        if (filterType === 'category') this.state.category = 'all';
        if (filterType === 'search') this.state.searchQuery = '';
        if (filterType === 'price') { this.state.minPrice = 0; this.state.maxPrice = 1000; }
        if (filterType === 'instock') this.state.inStockOnly = false;
        if (filterType === 'sale') this.state.onSaleOnly = false;
        if (filterType === 'rating') this.state.minRating = 0;
        refresh();
        return;
      }

      const removeBrandBtn = e.target.closest('[data-remove-brand]');
      if (removeBrandBtn) {
        const brand = removeBrandBtn.getAttribute('data-remove-brand');
        this.state.selectedBrands = this.state.selectedBrands.filter(b => b !== brand);
        refresh();
        return;
      }

      const clearAllBtn = e.target.closest('#clear-all-filters-btn') || e.target.closest('#clear-all-chips-btn') || e.target.closest('#empty-reset-filters-btn');
      if (clearAllBtn) {
        this.state.category = 'all';
        this.state.searchQuery = '';
        this.state.minPrice = 0;
        this.state.maxPrice = 1000;
        this.state.selectedBrands = [];
        this.state.minRating = 0;
        this.state.inStockOnly = false;
        this.state.onSaleOnly = false;
        this.state.sortBy = 'featured';
        refresh();
        return;
      }
    });
  }
};


/* --- MODULE: js/views/productView.js --- */
/**
 * NORTHSTAR COMMERCE - Product Detail Page (PDP) View
 * Split Editorial Layout with Sticky Gallery & Comprehensive Specs
 */








const ProductView = {
  state: {
    product: null,
    selectedImage: '',
    selectedColor: '',
    selectedSize: '',
    quantity: 1,
    reviewModalOpen: false
  },

  render(routeParams = {}) {
    const productId = routeParams.id;
    const product = productStore.getProductById(productId);

    if (!product) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Product Not Found</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">The requested product piece does not exist or has been archived.</p>
          <a href="#/shop" class="btn btn-primary">Return to Catalog</a>
        </div>
      `;
    }

    // Track recently viewed
    productStore.trackRecentlyViewed(product.id);

    this.state.product = product;
    if (!this.state.selectedImage || !product.images.includes(this.state.selectedImage)) {
      this.state.selectedImage = product.images[0];
    }
    if (!this.state.selectedColor) {
      this.state.selectedColor = product.variants?.colors?.[0]?.name || 'Standard';
    }
    if (!this.state.selectedSize) {
      this.state.selectedSize = product.variants?.sizes?.[0] || 'Standard';
    }

    const isWishlisted = wishlistStore.has(product.id);
    const isSale = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = isSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const isSoldOut = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 3;

    // Calculate rating histogram
    const totalReviews = product.reviews.length;
    const histogramCounts = [5, 4, 3, 2, 1].map(stars => {
      const count = product.reviews.filter(r => Math.floor(r.rating) === stars).length;
      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return { stars, count, pct };
    });

    // Related products (same category, excluding current)
    const related = productStore.getAllProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    // Recently viewed products
    const recentlyViewed = productStore.getRecentlyViewedProducts(product.id).slice(0, 4);

    return `
      <div class="pdp-page container">
        <!-- Breadcrumbs -->
        <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-6);">
          <a href="#/home">Home</a>
          <span>/</span>
          <a href="#/shop">Catalog</a>
          <span>/</span>
          <a href="#/category/${product.category}">${product.category.toUpperCase()}</a>
          <span>/</span>
          <span style="color: var(--color-text-primary); font-weight: 600;">${product.name}</span>
        </nav>

        <div class="pdp-grid">
          <!-- Left Column: Gallery -->
          <div class="pdp-gallery-wrap">
            <!-- Thumbnails Strip -->
            <div class="pdp-thumbs-list">
              ${product.images.map((img, idx) => `
                <div class="pdp-thumb-item ${img === this.state.selectedImage ? 'active' : ''}" data-pdp-thumb="${img}">
                  <img src="${img}" alt="${product.name} angle ${idx + 1}" />
                </div>
              `).join('')}
            </div>

            <!-- Main High-Res Viewer -->
            <div class="pdp-main-image-wrap" id="pdp-main-img-box">
              <img src="${this.state.selectedImage}" alt="${product.name}" class="pdp-main-image" id="pdp-main-image-el" />
              ${isSoldOut ? `
                <div style="position: absolute; top: 12px; left: 12px; z-index: 5;">
                  <span class="badge badge-soldout">Sold Out</span>
                </div>
              ` : isSale ? `
                <div style="position: absolute; top: 12px; left: 12px; z-index: 5;">
                  <span class="badge badge-sale">Save ${discountPercent}%</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Product Details & Purchase Block -->
          <div class="pdp-info-column">
            <div class="pdp-meta-strip">
              <span class="pdp-brand-tag">${product.brand}</span>
              <span class="text-xs font-mono text-muted">SKU: ${product.sku}</span>
            </div>

            <h1 class="pdp-title font-serif">${product.name}</h1>

            <div class="pdp-reviews-row">
              ${renderStars(product.rating, 15)}
              <a href="#reviews-section" style="text-decoration: underline; font-size: var(--text-xs); color: var(--color-text-secondary);">
                ${product.rating} rating (${product.reviewsCount} customer reviews)
              </a>
            </div>

            <div class="pdp-price-box">
              <span class="pdp-current-price">${formatPrice(product.price)}</span>
              ${isSale ? `
                <span class="pdp-original-price">${formatPrice(product.originalPrice)}</span>
                <span class="badge badge-sale">-${discountPercent}%</span>
              ` : ''}
              <span class="text-xs text-muted" style="margin-left: auto;">Tax included. Shipping calculated at checkout.</span>
            </div>

            <!-- Short Editorial Intro -->
            <p style="font-size: var(--text-base); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-6);">
              ${product.shortDescription}
            </p>

            <!-- Color Variant Selector -->
            ${product.variants?.colors ? `
              <div class="pdp-block">
                <div class="pdp-block-header">
                  <span>Colorway: <strong style="color: var(--color-text-primary); text-transform: none;">${this.state.selectedColor}</strong></span>
                </div>
                <div class="pdp-color-swatches">
                  ${product.variants.colors.map(c => `
                    <button type="button" class="pdp-color-swatch-btn ${this.state.selectedColor === c.name ? 'active' : ''}" data-pdp-color="${c.name}" ${!c.inStock ? 'style="opacity: 0.5;"' : ''}>
                      <span style="width: 14px; height: 14px; border-radius: 50%; background-color: ${c.hex}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);"></span>
                      <span>${c.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size / Model Variant Selector -->
            ${product.variants?.sizes ? `
              <div class="pdp-block">
                <div class="pdp-block-header">
                  <span>Select Size / Model: <strong style="color: var(--color-text-primary); text-transform: none;">${this.state.selectedSize}</strong></span>
                </div>
                <div class="pdp-size-options">
                  ${product.variants.sizes.map(s => `
                    <button type="button" class="pdp-size-btn ${this.state.selectedSize === s ? 'active' : ''}" data-pdp-size="${s}">
                      ${s}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Live Stock Status Pill -->
            <div class="pdp-stock-status">
              <span class="stock-indicator-dot ${isSoldOut ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}"></span>
              <span>
                ${isSoldOut
                  ? 'Currently Sold Out — Join the waitlist for the next release.'
                  : isLowStock
                    ? `Low Inventory: Only ${product.stock} units left in the studio.`
                    : `In Stock — Ready to ship from our fulfillment atelier.`}
              </span>
            </div>

            <!-- Add to Bag / Buy Now / Wishlist Row -->
            ${!isSoldOut ? `
              <div class="pdp-cta-row">
                <div class="qty-control" style="height: 48px;">
                  <button type="button" class="qty-btn" id="pdp-qty-dec" style="width: 40px; font-size: 1.1rem;">−</button>
                  <input type="text" class="qty-input" id="pdp-qty-input" value="${this.state.quantity}" readonly style="width: 40px; font-size: 15px;" />
                  <button type="button" class="qty-btn" id="pdp-qty-inc" style="width: 40px; font-size: 1.1rem;">+</button>
                </div>
                <button type="button" class="btn btn-primary" id="pdp-add-to-cart-btn" style="flex: 1; height: 48px; font-size: var(--text-base);">
                  Add to Bag • ${formatPrice(product.price * this.state.quantity)}
                </button>
                <button type="button" class="btn-icon" id="pdp-wishlist-toggle-btn" style="width: 48px; height: 48px; color: ${isWishlisted ? 'var(--color-danger)' : 'inherit'};" title="Save to wishlist">
                  ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
                </button>
              </div>

              <button type="button" class="btn btn-secondary btn-full pdp-buy-now-btn" id="pdp-buy-now-btn">
                Instant Buy with 1-Click Checkout
              </button>
            ` : `
              <div style="margin-bottom: var(--space-8);">
                <button type="button" class="btn btn-secondary btn-full" disabled style="height: 48px;">Sold Out</button>
              </div>
            `}

            <!-- Compact Value Prop Badges -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); padding: var(--space-4) 0; border-top: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-6); font-size: var(--text-xs); color: var(--color-text-secondary);">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('truck')}
                <span>Complimentary Delivery over $150</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('refresh')}
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>

            <!-- Accordion Details -->
            <div class="pdp-accordions">
              <!-- Description -->
              <div class="pdp-accordion-item open">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Product Story & Design Rationale</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <p>${product.description}</p>
                </div>
              </div>

              <!-- Materials & Specifications -->
              <div class="pdp-accordion-item">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Materials & Specifications</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <table style="width: 100%; border-collapse: collapse; font-size: var(--text-xs);">
                    ${Object.entries(product.specs || {}).map(([key, val]) => `
                      <tr style="border-bottom: 1px solid var(--color-border-subtle);">
                        <td style="padding: 8px 0; font-weight: 600; color: var(--color-text-primary); width: 35%;">${key}</td>
                        <td style="padding: 8px 0; color: var(--color-text-secondary);">${val}</td>
                      </tr>
                    `).join('')}
                  </table>
                  ${product.features ? `
                    <div style="margin-top: var(--space-4);">
                      <strong style="display: block; margin-bottom: 6px; font-size: var(--text-xs);">Highlights:</strong>
                      <ul style="list-style: disc; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; font-size: var(--text-xs);">
                        ${product.features.map(f => `<li>${f}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Shipping & Returns -->
              <div class="pdp-accordion-item">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Shipping & Complimentary Returns</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <p>All items are carefully packaged in archival unbleached organic cotton dust bags and recycled corrugated boxes.</p>
                  <p style="margin-top: 8px;"><strong>Standard Delivery:</strong> 3–5 business days (Free over $150).</p>
                  <p><strong>Express Courier:</strong> 1–2 business days ($25).</p>
                  <p style="margin-top: 8px;">We offer full refunds within 30 days of receipt provided items are unwashed, in original condition with intact seals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Reviews Section -->
        <section class="pdp-reviews-section" id="reviews-section">
          <div class="section-header">
            <div class="section-header-title">
              <h2>Customer Appraisals & Reviews</h2>
              <p>Verified feedback from owners worldwide.</p>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="open-write-review-btn">
              Write a Review
            </button>
          </div>

          <!-- Reviews Summary Histogram -->
          <div class="reviews-summary-grid">
            <div style="text-align: center;">
              <div class="reviews-score-huge">${product.rating}</div>
              <div style="margin: 8px 0;">${renderStars(product.rating, 18)}</div>
              <div class="text-xs text-muted">Based on ${product.reviewsCount} reviews</div>
            </div>

            <!-- Histogram Bars -->
            <div>
              ${histogramCounts.map(item => `
                <div class="histogram-row">
                  <span style="width: 48px;">${item.stars} Stars</span>
                  <div class="histogram-bar-track">
                    <div class="histogram-bar-fill" style="width: ${item.pct}%;"></div>
                  </div>
                  <span style="width: 24px; text-align: right;" class="text-muted">${item.count}</span>
                </div>
              `).join('')}
            </div>

            <!-- Write Review Promo Box -->
            <div style="border-left: 1px solid var(--color-border); padding-left: var(--space-8);">
              <h4 style="font-size: var(--text-sm); margin-bottom: 4px;">Own this piece?</h4>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-4); max-width: 200px;">Share your experience with fit, acoustics, or tactile materials.</p>
              <button type="button" class="btn btn-outline btn-sm" id="open-write-review-btn-2">Leave Review</button>
            </div>
          </div>

          <!-- Inline Write Review Form (Collapsible) -->
          <div id="inline-review-form-box" style="display: none; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6); margin-bottom: var(--space-8);">
            <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-4);">Write an Appraisal for ${product.name}</h3>
            <form id="pdp-review-form">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4);">
                <div class="form-group">
                  <label class="form-label">Your Name / Identifier *</label>
                  <input type="text" class="form-input" id="review-author" required placeholder="e.g. Julian V." />
                </div>
                <div class="form-group">
                  <label class="form-label">Rating *</label>
                  <select class="form-select" id="review-rating" required>
                    <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                    <option value="4">★★★★☆ (4 Stars - Great)</option>
                    <option value="3">★★★☆☆ (3 Stars - Average)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Disappointing)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Review Headline</label>
                <input type="text" class="form-input" id="review-title" placeholder="e.g. Unrivaled tailoring and drape" />
              </div>
              <div class="form-group">
                <label class="form-label">Your Detailed Feedback *</label>
                <textarea class="form-textarea" id="review-content" rows="4" required placeholder="Share your experience regarding material quality, sizing, sound signature, or durability..."></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4);">
                <button type="button" class="btn btn-outline btn-sm" id="cancel-review-form-btn">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Publish Review</button>
              </div>
            </form>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list">
            ${product.reviews && product.reviews.length > 0 ? product.reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-author-info">
                    <div class="review-avatar">${r.avatar || 'CU'}</div>
                    <div>
                      <div style="font-size: var(--text-sm); font-weight: 600;">${r.author}</div>
                      <div style="display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--color-text-muted);">
                        ${renderStars(r.rating, 12)}
                        <span>•</span>
                        <span>${r.date}</span>
                        ${r.verified ? `
                          <span>•</span>
                          <span style="color: var(--color-success); font-weight: 600;">✓ Verified Purchaser</span>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                ${r.title ? `<h4 style="font-size: var(--text-sm); margin-bottom: 6px;">${r.title}</h4>` : ''}
                <div class="review-content">${r.content}</div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: var(--space-8) 0; color: var(--color-text-muted);">
                No customer reviews yet. Be the first to appraise this piece!
              </div>
            `}
          </div>
        </section>

        <!-- Related Products Section -->
        ${related.length > 0 ? `
          <section style="margin-top: var(--space-20); padding-top: var(--space-12); border-top: 1px solid var(--color-border);">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Complementary Objects</h2>
                <p>Designed to exist in dialogue with this piece.</p>
              </div>
              <a href="#/category/${product.category}" class="btn btn-link">Explore ${product.category} →</a>
            </div>
            <div class="grid grid-cols-4">
              ${related.map(p => renderProductCard(p)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Recently Viewed Section -->
        ${recentlyViewed.length > 0 ? `
          <section style="margin-top: var(--space-16); padding-top: var(--space-12); border-top: 1px solid var(--color-border);">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Recently Viewed</h2>
              </div>
            </div>
            <div class="grid grid-cols-4">
              ${recentlyViewed.map(p => renderProductCard(p)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Mobile Sticky PDP Buy Bar -->
        ${!isSoldOut ? `
          <div class="mobile-sticky-buy-bar">
            <div>
              <div style="font-size: var(--text-xs); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${product.name}</div>
              <div style="font-size: var(--text-sm); font-weight: 700;">${formatPrice(product.price)}</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="mobile-sticky-buy-btn" style="flex: 1;">
              Add to Bag
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;
    const p = this.state.product;
    if (!p) return;

    const refresh = () => {
      container.innerHTML = this.render({ id: p.id });
      this.attachEvents(container);
    };

    // Thumbnails click
    const thumbs = container.querySelectorAll('[data-pdp-thumb]');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-pdp-thumb');
        this.state.selectedImage = src;
        const mainImg = container.querySelector('#pdp-main-image-el');
        if (mainImg) mainImg.src = src;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Color Swatch buttons
    const colorBtns = container.querySelectorAll('[data-pdp-color]');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedColor = btn.getAttribute('data-pdp-color');
        refresh();
      });
    });

    // Size buttons
    const sizeBtns = container.querySelectorAll('[data-pdp-size]');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedSize = btn.getAttribute('data-pdp-size');
        refresh();
      });
    });

    // Quantity buttons
    const qtyInc = container.querySelector('#pdp-qty-inc');
    const qtyDec = container.querySelector('#pdp-qty-dec');
    const qtyInput = container.querySelector('#pdp-qty-input');

    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        if (this.state.quantity < p.stock) {
          this.state.quantity++;
          if (qtyInput) qtyInput.value = this.state.quantity;
          const addBtn = container.querySelector('#pdp-add-to-cart-btn');
          if (addBtn) addBtn.textContent = `Add to Bag • ${formatPrice(p.price * this.state.quantity)}`;
        }
      });
    }

    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        if (this.state.quantity > 1) {
          this.state.quantity--;
          if (qtyInput) qtyInput.value = this.state.quantity;
          const addBtn = container.querySelector('#pdp-add-to-cart-btn');
          if (addBtn) addBtn.textContent = `Add to Bag • ${formatPrice(p.price * this.state.quantity)}`;
        }
      });
    }

    // Add to Bag
    const addBtn = container.querySelector('#pdp-add-to-cart-btn');
    const mobileBuyBtn = container.querySelector('#mobile-sticky-buy-btn');
    const handleAddToCart = () => {
      cartStore.addItem(p, { color: this.state.selectedColor, size: this.state.selectedSize }, this.state.quantity);
    };

    if (addBtn) addBtn.addEventListener('click', handleAddToCart);
    if (mobileBuyBtn) mobileBuyBtn.addEventListener('click', handleAddToCart);

    // Buy Now (Instant Checkout)
    const buyNowBtn = container.querySelector('#pdp-buy-now-btn');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        cartStore.addItem(p, { color: this.state.selectedColor, size: this.state.selectedSize }, this.state.quantity);
        window.location.hash = '#/checkout';
      });
    }

    // Wishlist Toggle
    const wishlistBtn = container.querySelector('#pdp-wishlist-toggle-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        wishlistStore.toggle(p);
        refresh();
      });
    }

    // Accordions
    const accordionTriggers = container.querySelectorAll('.pdp-accordion-trigger');
    accordionTriggers.forEach(trig => {
      trig.addEventListener('click', () => {
        const item = trig.closest('.pdp-accordion-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });

    // Write Review Box toggle
    const openReviewBtns = container.querySelectorAll('#open-write-review-btn, #open-write-review-btn-2');
    const formBox = container.querySelector('#inline-review-form-box');
    const cancelReviewBtn = container.querySelector('#cancel-review-form-btn');
    const reviewForm = container.querySelector('#pdp-review-form');

    openReviewBtns.forEach(b => {
      b.addEventListener('click', () => {
        if (formBox) {
          formBox.style.display = 'block';
          formBox.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    if (cancelReviewBtn && formBox) {
      cancelReviewBtn.addEventListener('click', () => {
        formBox.style.display = 'none';
      });
    }

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = container.querySelector('#review-author').value;
        const rating = container.querySelector('#review-rating').value;
        const title = container.querySelector('#review-title').value;
        const content = container.querySelector('#review-content').value;

        const success = productStore.addReview(p.id, { author, rating, title, content });
        if (success) {
          refresh();
        }
      });
    }
  }
};


/* --- MODULE: js/views/cartView.js --- */
/**
 * NORTHSTAR COMMERCE - Full Cart Page View
 */





const CartView = {
  render() {
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6);">
              ${getSvgIcon('bag')}
            </div>
            <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">Your Shopping Bag is Empty</h1>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-8); line-height: 1.6;">
              Items added to your shopping bag will be preserved here. Explore our latest arrivals in tailoring, audio hardware, and homewares.
            </p>
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="margin-bottom: var(--space-8);">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-3);">
            <a href="#/home">Home</a>
            <span>/</span>
            <span style="color: var(--color-text-primary); font-weight: 600;">Shopping Bag (${summary.itemsCount})</span>
          </nav>
          <h1 style="font-size: var(--text-4xl);">Shopping Bag</h1>
        </header>

        <!-- Free shipping banner -->
        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-4) var(--space-6); margin-bottom: var(--space-8);">
          ${summary.freeShippingRemaining <= 0 || summary.isFreeShipping ? `
            <div style="display: flex; align-items: center; gap: 8px; color: var(--color-success); font-weight: 600; font-size: var(--text-sm);">
              ${getSvgIcon('check')}
              <span>Complimentary Worldwide Express Delivery unlocked on this order!</span>
            </div>
          ` : `
            <div style="font-size: var(--text-sm); margin-bottom: 6px;">
              Add <strong>${formatPrice(summary.freeShippingRemaining)}</strong> more to your bag for <strong>Complimentary Express Shipping</strong>.
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress" style="width: ${summary.freeShippingProgress}%;"></div>
            </div>
          `}
        </div>

        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-12); align-items: start;">
          <!-- Left: Items Table -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); overflow: hidden;">
            <div style="padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--color-border); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); display: grid; grid-template-columns: 3fr 1fr 1fr; gap: var(--space-4);">
              <span>Product Item</span>
              <span style="text-align: center;">Quantity</span>
              <span style="text-align: right;">Total</span>
            </div>

            <div style="padding: 0 var(--space-6);">
              ${items.map(item => `
                <div style="display: grid; grid-template-columns: 3fr 1fr 1fr; gap: var(--space-4); align-items: center; padding: var(--space-6) 0; border-bottom: 1px solid var(--color-border-subtle);">
                  <!-- Product info -->
                  <div style="display: flex; gap: var(--space-4); align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 100px; object-fit: cover; border-radius: var(--radius-xs); background: var(--color-bg-alt);" />
                    <div>
                      <span class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em;">${item.brand}</span>
                      <h4 style="font-size: var(--text-sm); margin: 2px 0 4px;"><a href="#/product/${item.productId}">${item.name}</a></h4>
                      <div class="text-xs text-muted" style="margin-bottom: 6px;">Variant: ${item.color} • ${item.size}</div>
                      <div class="text-xs font-semibold">${formatPrice(item.price)} each</div>
                      <button type="button" class="btn-link text-xs" data-cart-page-action="remove" data-item-key="${item.key}" style="color: var(--color-danger); margin-top: 6px;">
                        Remove from bag
                      </button>
                    </div>
                  </div>

                  <!-- Quantity Control -->
                  <div style="display: flex; justify-content: center;">
                    <div class="qty-control">
                      <button type="button" class="qty-btn" data-cart-page-action="dec" data-item-key="${item.key}">−</button>
                      <input type="text" class="qty-input" value="${item.quantity}" readonly />
                      <button type="button" class="qty-btn" data-cart-page-action="inc" data-item-key="${item.key}" ${item.quantity >= item.maxStock ? 'disabled' : ''}>+</button>
                    </div>
                  </div>

                  <!-- Total Price -->
                  <div style="text-align: right; font-size: var(--text-base); font-weight: 700;">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Bottom Actions -->
            <div style="padding: var(--space-4) var(--space-6); background-color: var(--color-bg-alt); display: flex; justify-content: space-between; align-items: center;">
              <a href="#/shop" class="btn btn-outline btn-sm">← Continue Shopping</a>
              <button type="button" class="btn-link btn-xs" id="cart-clear-all-btn" style="color: var(--color-danger);">Empty Shopping Bag</button>
            </div>
          </div>

          <!-- Right: Order Summary Card -->
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <!-- Summary Box -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
              <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
                Order Summary
              </h3>

              <div style="display: flex; flex-direction: column; gap: var(--space-3); font-size: var(--text-sm); margin-bottom: var(--space-6);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal (${summary.itemsCount} items)</span>
                  <span>${formatPrice(summary.subtotal)}</span>
                </div>

                ${summary.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${summary.couponCode})</span>
                    <span>-${formatPrice(summary.discount)}</span>
                  </div>
                ` : ''}

                <div class="flex justify-between">
                  <span class="text-muted">Estimated Shipping</span>
                  <span>${summary.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(summary.shippingFee)}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-muted">Estimated State Tax (8%)</span>
                  <span>${formatPrice(summary.estimatedTax)}</span>
                </div>

                <div class="divider-subtle" style="margin: 4px 0;"></div>

                <div class="flex justify-between" style="font-size: var(--text-lg); font-weight: 700;">
                  <span>Grand Total</span>
                  <span>${formatPrice(summary.grandTotal)}</span>
                </div>
              </div>

              <!-- Promo Code Input -->
              <div style="margin-bottom: var(--space-6);">
                <label class="form-label" style="margin-bottom: 6px;">Promotional Code</label>
                ${summary.couponCode ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-bg-alt); padding: 8px 12px; border-radius: var(--radius-xs); font-size: var(--text-xs);">
                    <span style="font-family: var(--font-mono); font-weight: 600;">ACTIVE: ${summary.couponCode}</span>
                    <button type="button" id="cart-page-remove-coupon" style="color: var(--color-danger); text-decoration: underline; font-weight: 600;">Remove</button>
                  </div>
                ` : `
                  <div class="promo-box">
                    <input type="text" class="promo-input" id="cart-page-promo-input" placeholder="e.g. NORTHSTAR15" />
                    <button type="button" class="btn btn-secondary btn-sm" id="cart-page-apply-coupon">Apply</button>
                  </div>
                `}

                <!-- Demo Coupons Shortcuts -->
                <div style="margin-top: var(--space-3);">
                  <span class="text-xs text-muted" style="display: block; margin-bottom: 4px;">Click a demo code to test:</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${COUPONS.filter(c => c.code !== 'EXPIRED25').map(c => `
                      <button type="button" class="badge badge-muted demo-coupon-chip" data-code="${c.code}" style="cursor: pointer;" title="${c.description}">
                        ${c.code}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <a href="#/checkout" class="btn btn-primary btn-full btn-lg">
                Proceed to Checkout
                ${getSvgIcon('arrowRight')}
              </a>
            </div>

            <!-- Guarantee Icons -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-4) var(--space-6); font-size: var(--text-xs); color: var(--color-text-secondary); display: flex; flex-direction: column; gap: var(--space-2);">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('shield')}
                <span>Encrypted 256-Bit SSL Checkout Protection</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('refresh')}
                <span>30-Day Doorstep Complimentary Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    container.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-cart-page-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-cart-page-action');
        const itemKey = actionBtn.getAttribute('data-item-key');
        const item = cartStore.getItems().find(i => i.key === itemKey);

        if (action === 'inc' && item) {
          cartStore.updateQuantity(itemKey, item.quantity + 1);
          refresh();
        } else if (action === 'dec' && item) {
          cartStore.updateQuantity(itemKey, item.quantity - 1);
          refresh();
        } else if (action === 'remove' && itemKey) {
          cartStore.removeItem(itemKey);
          refresh();
        }
        return;
      }

      const applyBtn = e.target.closest('#cart-page-apply-coupon');
      if (applyBtn) {
        const input = container.querySelector('#cart-page-promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          refresh();
        }
        return;
      }

      const removeCouponBtn = e.target.closest('#cart-page-remove-coupon');
      if (removeCouponBtn) {
        cartStore.removeCoupon();
        refresh();
        return;
      }

      const demoChip = e.target.closest('.demo-coupon-chip');
      if (demoChip) {
        const code = demoChip.getAttribute('data-code');
        if (code) {
          cartStore.applyCoupon(code);
          refresh();
        }
        return;
      }

      const clearAllBtn = e.target.closest('#cart-clear-all-btn');
      if (clearAllBtn) {
        if (confirm('Are you sure you want to clear your shopping bag?')) {
          cartStore.clear();
          refresh();
        }
        return;
      }
    });
  }
};


/* --- MODULE: js/views/wishlistView.js --- */
/**
 * NORTHSTAR COMMERCE - Wishlist View
 */







const WishlistView = {
  render() {
    const itemIds = wishlistStore.getItems();
    const allProducts = productStore.getAllProducts();
    const items = itemIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6);">
              ${getSvgIcon('heart')}
            </div>
            <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">Your Saved Wishlist is Empty</h1>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-8); line-height: 1.6;">
              Curate your personal collection. Tap the heart icon on any design piece in our catalog to save items for future acquisition.
            </p>
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--space-8); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <div>
            <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-3);">
              <a href="#/home">Home</a>
              <span>/</span>
              <span style="color: var(--color-text-primary); font-weight: 600;">Saved Wishlist (${items.length})</span>
            </nav>
            <h1 style="font-size: var(--text-4xl);">Saved Wishlist</h1>
          </div>

          <div style="display: flex; gap: var(--space-3);">
            <button type="button" class="btn btn-primary btn-sm" id="wishlist-move-all-btn">
              Move All In-Stock to Bag
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="wishlist-clear-all-btn" style="color: var(--color-danger);">
              Clear Wishlist
            </button>
          </div>
        </header>

        <div class="grid grid-cols-4">
          ${items.map(product => {
            const isSoldOut = product.stock <= 0;
            const isSale = product.originalPrice && product.originalPrice > product.price;
            return `
              <article class="product-card" data-product-id="${product.id}">
                <div class="product-card-image-wrap">
                  <a href="#/product/${product.id}">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" />
                  </a>
                  <button type="button" class="product-card-wishlist-btn active" data-wishlist-action="remove" data-product-id="${product.id}" title="Remove from wishlist">
                    ${getSvgIcon('close')}
                  </button>
                </div>
                <div class="product-card-body">
                  <div class="product-card-meta">
                    <span class="product-card-brand">${product.brand}</span>
                    <span class="text-xs ${isSoldOut ? 'text-muted' : 'text-success'} font-semibold">
                      ${isSoldOut ? 'Sold Out' : 'In Stock'}
                    </span>
                  </div>
                  <h3 class="product-card-title"><a href="#/product/${product.id}">${product.name}</a></h3>
                  <div class="product-card-price-wrap" style="margin-bottom: var(--space-4);">
                    <span class="product-card-price">${formatPrice(product.price)}</span>
                    ${isSale ? `<span class="product-card-price-original">${formatPrice(product.originalPrice)}</span>` : ''}
                  </div>
                  ${!isSoldOut ? `
                    <button type="button" class="btn btn-secondary btn-full btn-sm" data-wishlist-action="move-to-cart" data-product-id="${product.id}">
                      Move to Bag
                    </button>
                  ` : `
                    <button type="button" class="btn btn-outline btn-full btn-sm" disabled>
                      Sold Out
                    </button>
                  `}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-wishlist-action="remove"]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-product-id');
        wishlistStore.remove(id);
        Toast.info('Item removed from wishlist.');
        refresh();
        return;
      }

      const moveToCartBtn = e.target.closest('[data-wishlist-action="move-to-cart"]');
      if (moveToCartBtn) {
        const id = moveToCartBtn.getAttribute('data-product-id');
        const product = productStore.getProductById(id);
        if (product) {
          cartStore.addItem(product);
          wishlistStore.remove(id);
          refresh();
        }
        return;
      }

      const moveAllBtn = e.target.closest('#wishlist-move-all-btn');
      if (moveAllBtn) {
        const itemIds = wishlistStore.getItems();
        let addedCount = 0;
        itemIds.forEach(id => {
          const product = productStore.getProductById(id);
          if (product && product.stock > 0) {
            cartStore.addItem(product);
            wishlistStore.remove(id);
            addedCount++;
          }
        });
        if (addedCount > 0) {
          Toast.success(`Moved ${addedCount} items to your shopping bag.`);
          refresh();
        } else {
          Toast.info('No available in-stock items to move.');
        }
        return;
      }

      const clearAllBtn = e.target.closest('#wishlist-clear-all-btn');
      if (clearAllBtn) {
        if (confirm('Clear all saved items in your wishlist?')) {
          wishlistStore.clear();
          refresh();
        }
        return;
      }
    });
  }
};


/* --- MODULE: js/views/checkoutView.js --- */
/**
 * NORTHSTAR COMMERCE - Multi-Step Checkout View
 */






const CheckoutView = {
  currentStep: 1, // 1: Shipping Info, 2: Shipping Method, 3: Payment, 4: Review

  formData: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    shippingMethod: 'standard',
    shippingMethodName: 'Standard Tracked Delivery (3-5 Days)',
    paymentMethod: 'credit-card',
    cardNumber: '•••• •••• •••• ••••',
    cardName: 'YOUR NAME',
    cardExpiry: 'MM/YY',
    cardCvv: ''
  },

  render() {
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();
    const profile = orderStore.getProfile();

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Your bag is empty</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">Add items to your bag before proceeding to checkout.</p>
          <a href="#/shop" class="btn btn-primary">Discover Catalog</a>
        </div>
      `;
    }

    // Prepopulate from customer profile if fields are empty
    if (!this.formData.email && profile.email) {
      this.formData.email = profile.email;
      const names = (profile.fullName || '').split(' ');
      this.formData.firstName = names[0] || '';
      this.formData.lastName = names.slice(1).join(' ') || '';
      this.formData.phone = profile.phone || '';
      this.formData.address = profile.address || '';
      this.formData.city = profile.city || '';
      this.formData.state = profile.state || '';
      this.formData.postalCode = profile.postalCode || '';
      this.formData.cardName = profile.fullName ? profile.fullName.toUpperCase() : 'YOUR NAME';
    }

    return `
      <div class="checkout-page container">
        <header style="margin-bottom: var(--space-8);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-2);">
                <a href="#/cart">Shopping Bag</a>
                <span>/</span>
                <span style="color: var(--color-text-primary); font-weight: 600;">Secure Checkout</span>
              </nav>
              <h1 style="font-size: var(--text-3xl);">Checkout</h1>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="checkout-autofill-btn" style="background: var(--color-bg-alt);">
              ⚡ Auto-Fill Demo Info
            </button>
          </div>
        </header>

        <!-- Stepper Navigation -->
        <div class="checkout-stepper">
          <div class="checkout-step-item ${this.currentStep === 1 ? 'active' : this.currentStep > 1 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 1 ? '✓' : '1'}</span>
            <span>1. Information</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 2 ? 'active' : this.currentStep > 2 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 2 ? '✓' : '2'}</span>
            <span>2. Shipping</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 3 ? 'active' : this.currentStep > 3 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 3 ? '✓' : '3'}</span>
            <span>3. Payment</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 4 ? 'active' : ''}">
            <span class="checkout-step-num">4</span>
            <span>4. Review & Place</span>
          </div>
        </div>

        <div class="checkout-grid">
          <!-- Left: Step Forms -->
          <div class="checkout-main-forms">
            <!-- ================= STEP 1: CONTACT & SHIPPING ADDRESS ================= -->
            <div id="checkout-step-1" style="${this.currentStep === 1 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <h3 class="checkout-section-title">
                  <span>Contact Information</span>
                  <span class="text-xs text-muted">Step 1 of 4</span>
                </h3>
                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input type="email" class="form-input" id="co-email" required value="${this.formData.email}" placeholder="alexander.wright@atelier.io" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number (For courier delivery SMS updates) *</label>
                  <input type="tel" class="form-input" id="co-phone" required value="${this.formData.phone}" placeholder="+1 (555) 234-5678" />
                </div>
              </div>

              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Shipping Address</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                  <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input type="text" class="form-input" id="co-firstname" required value="${this.formData.firstName}" placeholder="Alexander" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Last Name *</label>
                    <input type="text" class="form-input" id="co-lastname" required value="${this.formData.lastName}" placeholder="Wright" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Street Address *</label>
                  <input type="text" class="form-input" id="co-address" required value="${this.formData.address}" placeholder="420 Madison Avenue" />
                </div>

                <div class="form-group">
                  <label class="form-label">Apartment, Suite, Unit (Optional)</label>
                  <input type="text" class="form-input" id="co-apartment" value="${this.formData.apartment}" placeholder="Suite 1800" />
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-4);">
                  <div class="form-group">
                    <label class="form-label">City *</label>
                    <input type="text" class="form-input" id="co-city" required value="${this.formData.city}" placeholder="New York" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">State / Region *</label>
                    <input type="text" class="form-input" id="co-state" required value="${this.formData.state}" placeholder="NY" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Postal Code *</label>
                    <input type="text" class="form-input" id="co-zip" required value="${this.formData.postalCode}" placeholder="10017" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Country</label>
                  <select class="form-select" id="co-country">
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="#/cart" class="btn btn-link btn-sm">← Back to Bag</a>
                <button type="button" class="btn btn-primary" id="co-btn-step-1-next">
                  Continue to Shipping Method →
                </button>
              </div>
            </div>

            <!-- ================= STEP 2: SHIPPING METHOD ================= -->
            <div id="checkout-step-2" style="${this.currentStep === 2 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <div style="display: flex; justify-content: space-between; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-4); font-size: var(--text-sm);">
                  <div>
                    <span class="text-muted">Ship to: </span>
                    <strong>${this.formData.address}, ${this.formData.city}, ${this.formData.state} ${this.formData.postalCode}</strong>
                  </div>
                  <button type="button" class="btn-link text-xs" id="co-edit-address-btn">Change</button>
                </div>

                <h3 class="checkout-section-title">Select Shipping Method</h3>

                <div class="shipping-methods-list">
                  <!-- Standard -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'standard' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="standard" ${this.formData.shippingMethod === 'standard' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">Standard Tracked Delivery (3–5 Business Days)</div>
                        <div class="text-xs text-muted">Dispatched via DHL Ground / USPS Priority</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">
                      ${summary.isFreeShipping ? '<span style="color: var(--color-success);">FREE</span>' : '$15.00'}
                    </div>
                  </label>

                  <!-- Express -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'express' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="express" ${this.formData.shippingMethod === 'express' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">Express Priority Air (1–2 Business Days)</div>
                        <div class="text-xs text-muted">DHL Air Express with signature confirmation</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">$25.00</div>
                  </label>

                  <!-- Overnight White Glove -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'overnight' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="overnight" ${this.formData.shippingMethod === 'overnight' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">White-Glove Next Day Morning Delivery</div>
                        <div class="text-xs text-muted">Hand-carried courier with scheduled delivery window</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">$45.00</div>
                  </label>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-2-back">← Back to Information</button>
                <button type="button" class="btn btn-primary" id="co-btn-step-2-next">
                  Continue to Payment →
                </button>
              </div>
            </div>

            <!-- ================= STEP 3: PAYMENT ================= -->
            <div id="checkout-step-3" style="${this.currentStep === 3 ? 'display: block;' : 'display: none;'}">
              <!-- Live Interactive Credit Card Preview -->
              <div class="credit-card-preview">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: var(--text-xs); letter-spacing: 0.15em; font-weight: 700;">NORTHSTAR ATELIER</span>
                  <div class="card-preview-chip"></div>
                </div>
                <div class="card-preview-number" id="card-preview-num-el">${this.formData.cardNumber || '•••• •••• •••• ••••'}</div>
                <div class="card-preview-bottom">
                  <div>
                    <div style="font-size: 9px; opacity: 0.7;">CARDHOLDER</div>
                    <div id="card-preview-name-el" style="font-weight: 600;">${this.formData.cardName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style="font-size: 9px; opacity: 0.7;">EXPIRES</div>
                    <div id="card-preview-exp-el" style="font-weight: 600;">${this.formData.cardExpiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Payment Method</h3>

                <div style="display: flex; gap: var(--space-4); margin-bottom: var(--space-6);">
                  <label class="form-checkbox-label" style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                    <input type="radio" name="co-payment-type" value="credit-card" checked style="accent-color: var(--color-accent);" />
                    <span style="font-weight: 600;">Credit / Debit Card</span>
                  </label>
                  <label class="form-checkbox-label" style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                    <input type="radio" name="co-payment-type" value="apple-pay" style="accent-color: var(--color-accent);" />
                    <span>Apple / Google Pay</span>
                  </label>
                </div>

                <div id="credit-card-fields-group">
                  <div class="form-group">
                    <label class="form-label">Card Number *</label>
                    <input type="text" class="form-input font-mono" id="co-card-num" maxlength="19" placeholder="4242 •••• •••• 4242" value="${this.formData.cardNumber === '•••• •••• •••• ••••' ? '4242 8812 9934 4242' : this.formData.cardNumber}" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Cardholder Name *</label>
                    <input type="text" class="form-input" id="co-card-name" placeholder="Alexander Wright" value="${this.formData.cardName}" />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">Expiration (MM/YY) *</label>
                      <input type="text" class="form-input font-mono" id="co-card-exp" maxlength="5" placeholder="12/28" value="${this.formData.cardExpiry === 'MM/YY' ? '12/28' : this.formData.cardExpiry}" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">CVV Security Code *</label>
                      <input type="password" class="form-input font-mono" id="co-card-cvv" maxlength="4" placeholder="•••" value="842" />
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-3-back">← Back to Shipping</button>
                <button type="button" class="btn btn-primary" id="co-btn-step-3-next">
                  Review Complete Order →
                </button>
              </div>
            </div>

            <!-- ================= STEP 4: REVIEW & PLACE ORDER ================= -->
            <div id="checkout-step-4" style="${this.currentStep === 4 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Final Order Confirmation</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); font-size: var(--text-sm); margin-bottom: var(--space-6); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-border-subtle);">
                  <div>
                    <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em; margin-bottom: 4px;">Delivering To:</div>
                    <div style="font-weight: 600;">${this.formData.firstName} ${this.formData.lastName}</div>
                    <div class="text-muted">${this.formData.address}</div>
                    <div class="text-muted">${this.formData.city}, ${this.formData.state} ${this.formData.postalCode}</div>
                    <div class="text-muted">${this.formData.email} • ${this.formData.phone}</div>
                  </div>
                  <div>
                    <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em; margin-bottom: 4px;">Method & Payment:</div>
                    <div style="font-weight: 600;">${this.formData.shippingMethodName}</div>
                    <div class="text-muted" style="margin-top: 4px;">Paid via: Credit Card (ending in 4242)</div>
                    <div style="color: var(--color-success); font-size: var(--text-xs); margin-top: 4px;">✓ Instant Verification Active</div>
                  </div>
                </div>

                <!-- Items Review Strip -->
                <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6);">
                  ${items.map(item => `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-sm);">
                      <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 58px; object-fit: cover; border-radius: var(--radius-xs);" />
                        <div>
                          <div style="font-weight: 600;">${item.name}</div>
                          <div class="text-xs text-muted">${item.color} • ${item.size} × ${item.quantity}</div>
                        </div>
                      </div>
                      <div style="font-weight: 700;">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                  `).join('')}
                </div>

                <div style="background-color: var(--color-bg-alt); padding: var(--space-4); border-radius: var(--radius-xs); font-size: var(--text-xs); color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-6);">
                  By selecting <strong>"Authorize & Place Order"</strong>, you agree to Northstar Commerce's terms of service and acknowledge that your payment method will be charged <strong>${formatPrice(summary.grandTotal)}</strong>.
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-4-back">← Edit Payment</button>
                  <button type="button" class="btn btn-primary btn-lg" id="co-btn-place-order" style="min-width: 240px;">
                    Authorize & Place Order (${formatPrice(summary.grandTotal)})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Sticky Order Summary Sidebar -->
          <aside class="checkout-summary-sidebar" style="position: sticky; top: calc(var(--header-height) + var(--space-4));">
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
              <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
                Summary (${summary.itemsCount} items)
              </h3>

              <div style="display: flex; flex-direction: column; gap: var(--space-3); max-height: 240px; overflow-y: auto; margin-bottom: var(--space-4); padding-right: 4px;">
                ${items.map(item => `
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-xs);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="${item.image}" alt="${item.name}" style="width: 36px; height: 44px; object-fit: cover; border-radius: 2px;" />
                      <div>
                        <div style="font-weight: 600; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                        <div class="text-muted">Qty: ${item.quantity}</div>
                      </div>
                    </div>
                    <div style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
                  </div>
                `).join('')}
              </div>

              <div class="divider-subtle"></div>

              <div style="display: flex; flex-direction: column; gap: 6px; font-size: var(--text-xs); margin-bottom: var(--space-4);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal</span>
                  <span>${formatPrice(summary.subtotal)}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${summary.couponCode})</span>
                    <span>-${formatPrice(summary.discount)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span class="text-muted">Shipping</span>
                  <span>${summary.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(summary.shippingFee)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Estimated Tax (8%)</span>
                  <span>${formatPrice(summary.estimatedTax)}</span>
                </div>
                <div class="divider-subtle" style="margin: 4px 0;"></div>
                <div class="flex justify-between" style="font-size: var(--text-base); font-weight: 700;">
                  <span>Grand Total</span>
                  <span>${formatPrice(summary.grandTotal)}</span>
                </div>
              </div>

              <!-- Promo Code in Checkout -->
              ${summary.couponCode ? `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; background: var(--color-bg-alt); padding: 6px 10px; border-radius: 2px;">
                  <span style="font-family: var(--font-mono); font-weight: 600;">CODE: ${summary.couponCode}</span>
                  <span style="color: var(--color-success); font-weight: 600;">Applied</span>
                </div>
              ` : `
                <div class="promo-box">
                  <input type="text" class="promo-input" id="co-sidebar-promo-input" placeholder="Promo code" />
                  <button type="button" class="btn btn-secondary btn-sm" id="co-sidebar-apply-btn">Apply</button>
                </div>
              `}
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    // Auto-fill Demo Information button
    const autofillBtn = container.querySelector('#checkout-autofill-btn');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => {
        this.formData.email = 'alexander.wright@atelier.io';
        this.formData.phone = '+1 (555) 234-5678';
        this.formData.firstName = 'Alexander';
        this.formData.lastName = 'Wright';
        this.formData.address = '420 Madison Avenue';
        this.formData.apartment = 'Suite 1800';
        this.formData.city = 'New York';
        this.formData.state = 'NY';
        this.formData.postalCode = '10017';
        this.formData.country = 'United States';
        this.formData.cardNumber = '4242 8812 9934 4242';
        this.formData.cardName = 'ALEXANDER WRIGHT';
        this.formData.cardExpiry = '12/28';
        Toast.success('Populated form with verified demo customer details.');
        refresh();
      });
    }

    // Step 1: Validate & Next
    const step1Next = container.querySelector('#co-btn-step-1-next');
    if (step1Next) {
      step1Next.addEventListener('click', () => {
        const email = container.querySelector('#co-email')?.value.trim();
        const phone = container.querySelector('#co-phone')?.value.trim();
        const firstName = container.querySelector('#co-firstname')?.value.trim();
        const lastName = container.querySelector('#co-lastname')?.value.trim();
        const address = container.querySelector('#co-address')?.value.trim();
        const city = container.querySelector('#co-city')?.value.trim();
        const state = container.querySelector('#co-state')?.value.trim();
        const zip = container.querySelector('#co-zip')?.value.trim();

        if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
          Toast.error('Please complete all required shipping fields.');
          return;
        }

        this.formData.email = email;
        this.formData.phone = phone || '+1 (555) 000-0000';
        this.formData.firstName = firstName;
        this.formData.lastName = lastName;
        this.formData.address = address;
        this.formData.apartment = container.querySelector('#co-apartment')?.value.trim() || '';
        this.formData.city = city;
        this.formData.state = state;
        this.formData.postalCode = zip;
        this.formData.country = container.querySelector('#co-country')?.value || 'United States';

        this.currentStep = 2;
        refresh();
      });
    }

    // Step 2: Shipping method change & Next
    const shipRadios = container.querySelectorAll('input[name="co-ship-method"]');
    shipRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const method = e.target.value;
        this.formData.shippingMethod = method;
        cartStore.setShippingMethod(method);

        if (method === 'standard') this.formData.shippingMethodName = 'Standard Tracked Delivery (3–5 Days)';
        if (method === 'express') this.formData.shippingMethodName = 'Express Priority Air (1–2 Days)';
        if (method === 'overnight') this.formData.shippingMethodName = 'White-Glove Next Day Morning Delivery';

        refresh();
      });
    });

    const step2Next = container.querySelector('#co-btn-step-2-next');
    const step2Back = container.querySelector('#co-btn-step-2-back');
    const editAddress = container.querySelector('#co-edit-address-btn');

    if (step2Next) {
      step2Next.addEventListener('click', () => {
        this.currentStep = 3;
        refresh();
      });
    }
    if (step2Back || editAddress) {
      const backHandler = () => {
        this.currentStep = 1;
        refresh();
      };
      if (step2Back) step2Back.addEventListener('click', backHandler);
      if (editAddress) editAddress.addEventListener('click', backHandler);
    }

    // Step 3: Card live inputs & Next
    const cardNumInput = container.querySelector('#co-card-num');
    const cardNameInput = container.querySelector('#co-card-name');
    const cardExpInput = container.querySelector('#co-card-exp');

    if (cardNumInput) {
      cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = val;
        this.formData.cardNumber = val || '•••• •••• •••• ••••';
        const el = container.querySelector('#card-preview-num-el');
        if (el) el.textContent = this.formData.cardNumber;
      });
    }

    if (cardNameInput) {
      cardNameInput.addEventListener('input', (e) => {
        this.formData.cardName = e.target.value.toUpperCase() || 'YOUR NAME';
        const el = container.querySelector('#card-preview-name-el');
        if (el) el.textContent = this.formData.cardName;
      });
    }

    if (cardExpInput) {
      cardExpInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
        e.target.value = val;
        this.formData.cardExpiry = val || 'MM/YY';
        const el = container.querySelector('#card-preview-exp-el');
        if (el) el.textContent = this.formData.cardExpiry;
      });
    }

    const step3Next = container.querySelector('#co-btn-step-3-next');
    const step3Back = container.querySelector('#co-btn-step-3-back');

    if (step3Next) {
      step3Next.addEventListener('click', () => {
        this.currentStep = 4;
        refresh();
      });
    }
    if (step3Back) {
      step3Back.addEventListener('click', () => {
        this.currentStep = 2;
        refresh();
      });
    }

    // Step 4: Final Place Order Action
    const placeOrderBtn = container.querySelector('#co-btn-place-order');
    const step4Back = container.querySelector('#co-btn-step-4-back');

    if (step4Back) {
      step4Back.addEventListener('click', () => {
        this.currentStep = 3;
        refresh();
      });
    }

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `
          <span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px;">↻</span>
          Authorizing Transaction...
        `;

        setTimeout(() => {
          try {
            const order = orderStore.createOrder(this.formData);
            this.currentStep = 1; // reset stepper
            window.location.hash = `#/orders/${order.orderId}`;
          } catch (err) {
            Toast.error(err.message || 'Payment failed.');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Authorize & Place Order';
          }
        }, 1200);
      });
    }

    // Promo code in sidebar
    const sidebarApply = container.querySelector('#co-sidebar-apply-btn');
    if (sidebarApply) {
      sidebarApply.addEventListener('click', () => {
        const input = container.querySelector('#co-sidebar-promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          refresh();
        }
      });
    }
  }
};


/* --- MODULE: js/views/accountView.js --- */
/**
 * NORTHSTAR COMMERCE - Customer Account & Order History View
 */






const AccountView = {
  activeTab: 'orders', // 'orders' | 'profile' | 'addresses'

  render(routeParams = {}) {
    const orders = orderStore.getOrders();
    const profile = orderStore.getProfile();
    const wishlistCount = wishlistStore.getCount();

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="margin-bottom: var(--space-8); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-2);">
            <a href="#/home">Home</a>
            <span>/</span>
            <span style="color: var(--color-text-primary); font-weight: 600;">Customer Account</span>
          </nav>
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            <div>
              <h1 style="font-size: var(--text-3xl);">Client Portal</h1>
              <p class="text-sm text-muted">Welcome back, <strong>${profile.fullName || 'Valued Client'}</strong></p>
            </div>
            <span class="badge badge-gold">Northstar Archival Member</span>
          </div>
        </header>

        <div class="account-layout">
          <!-- Left Navigation Sidebar -->
          <aside class="account-sidebar-nav">
            <button type="button" class="account-nav-btn ${this.activeTab === 'orders' ? 'active' : ''}" data-account-tab="orders">
              Order History (${orders.length})
            </button>
            <button type="button" class="account-nav-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-account-tab="profile">
              Personal Information
            </button>
            <button type="button" class="account-nav-btn ${this.activeTab === 'addresses' ? 'account-nav-btn active' : ''}" data-account-tab="addresses">
              Saved Delivery Addresses
            </button>
            <a href="#/wishlist" class="account-nav-btn" style="display: flex; justify-content: space-between;">
              <span>Saved Wishlist</span>
              <span class="text-xs text-muted">(${wishlistCount})</span>
            </a>
          </aside>

          <!-- Right Tab Content -->
          <main class="account-main-content">
            <!-- ================= TAB 1: ORDER HISTORY ================= -->
            <div id="tab-orders" style="${this.activeTab === 'orders' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Past Acquisitions & Orders</h2>
                  <p>View fulfillment tracking, item breakdown, and digital receipts.</p>
                </div>
              </div>

              ${orders.length > 0 ? `
                <div class="orders-table-card">
                  ${orders.map(order => `
                    <div class="order-row-item">
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-family: var(--font-mono); font-weight: 700; font-size: var(--text-sm);">${order.orderId}</span>
                          <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-dark'}">${order.status}</span>
                        </div>
                        <div class="text-xs text-muted">
                          Placed on ${new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • ${order.items.length} item(s)
                        </div>
                        <div class="text-xs text-muted font-mono">
                          Tracking: ${order.trackingNumber} (${order.carrier})
                        </div>
                      </div>

                      <div style="display: flex; align-items: center; gap: var(--space-6);">
                        <div style="text-align: right;">
                          <div style="font-size: var(--text-sm); font-weight: 700;">${formatPrice(order.total)}</div>
                          <div class="text-xs text-muted">${order.payment.method}</div>
                        </div>
                        <a href="#/orders/${order.orderId}" class="btn btn-outline btn-sm">
                          View Receipt
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-12); text-align: center;">
                  <p class="text-muted" style="margin-bottom: var(--space-4);">No orders found in your customer history.</p>
                  <a href="#/shop" class="btn btn-primary btn-sm">Explore Collection</a>
                </div>
              `}
            </div>

            <!-- ================= TAB 2: PROFILE ================= -->
            <div id="tab-profile" style="${this.activeTab === 'profile' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Personal Profile</h2>
                  <p>Manage your account contact preferences.</p>
                </div>
              </div>

              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
                <form id="account-profile-form">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">Full Name</label>
                      <input type="text" class="form-input" id="profile-name" value="${profile.fullName || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email Address</label>
                      <input type="email" class="form-input" id="profile-email" value="${profile.email || ''}" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" id="profile-phone" value="${profile.phone || ''}" />
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" style="margin-top: var(--space-2);">
                    Save Preferences
                  </button>
                </form>
              </div>
            </div>

            <!-- ================= TAB 3: ADDRESSES ================= -->
            <div id="tab-addresses" style="${this.activeTab === 'addresses' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Saved Delivery Address</h2>
                  <p>Primary destination for complimentary insured courier dispatch.</p>
                </div>
              </div>

              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
                <form id="account-address-form">
                  <div class="form-group">
                    <label class="form-label">Street Address</label>
                    <input type="text" class="form-input" id="addr-street" value="${profile.address || ''}" required />
                  </div>
                  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">City</label>
                      <input type="text" class="form-input" id="addr-city" value="${profile.city || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">State</label>
                      <input type="text" class="form-input" id="addr-state" value="${profile.state || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Postal Code</label>
                      <input type="text" class="form-input" id="addr-zip" value="${profile.postalCode || ''}" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" class="form-input" id="addr-country" value="${profile.country || 'United States'}" required />
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" style="margin-top: var(--space-2);">
                    Update Default Address
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    // Switch Tabs
    const tabBtns = container.querySelectorAll('[data-account-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-account-tab');
        refresh();
      });
    });

    // Profile form submit
    const profileForm = container.querySelector('#account-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = container.querySelector('#profile-name').value;
        const email = container.querySelector('#profile-email').value;
        const phone = container.querySelector('#profile-phone').value;
        orderStore.saveProfile({ fullName, email, phone });
        refresh();
      });
    }

    // Address form submit
    const addressForm = container.querySelector('#account-address-form');
    if (addressForm) {
      addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = container.querySelector('#addr-street').value;
        const city = container.querySelector('#addr-city').value;
        const state = container.querySelector('#addr-state').value;
        const postalCode = container.querySelector('#addr-zip').value;
        const country = container.querySelector('#addr-country').value;
        orderStore.saveProfile({ address, city, state, postalCode, country });
        refresh();
      });
    }
  }
};


/* --- MODULE: js/views/ordersView.js --- */
/**
 * NORTHSTAR COMMERCE - Order Confirmation & Receipt View
 */




const OrdersView = {
  render(routeParams = {}) {
    const orderId = routeParams.id;
    const order = orderStore.getOrderById(orderId);

    if (!order) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Order Record Not Found</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">We could not find an order reference matching "${orderId}".</p>
          <a href="#/account" class="btn btn-primary">Return to Client Portal</a>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <div class="order-success-hero">
          <div class="order-success-icon">
            ${getSvgIcon('check')}
          </div>
          <div class="text-xs text-uppercase font-semibold" style="letter-spacing: 0.1em; color: var(--color-success); margin-bottom: 6px;">
            Transaction Confirmed
          </div>
          <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-2);">Thank You for Your Acquisition</h1>
          <p class="text-lead" style="margin-bottom: var(--space-4);">
            Your order reference is <strong class="font-mono" style="color: var(--color-text-primary);">${order.orderId}</strong>.
          </p>
          <p class="text-sm text-muted" style="max-width: 480px; margin: 0 auto var(--space-8);">
            A confirmation dispatch notice and tax invoice have been transmitted to <strong>${order.customer.email}</strong>.
          </p>

          <!-- Order Status Timeline Tracker -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6); text-align: left; margin-bottom: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
              <span style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Dispatch Timeline</span>
              <span class="badge badge-dark">${order.status}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); text-align: center; position: relative;">
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-success); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Authorized</div>
                <div class="text-xs text-muted">Complete</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: ${order.status === 'Processing' ? 'var(--color-accent)' : 'var(--color-success)'}; margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Atelier Packing</div>
                <div class="text-xs text-muted">In Progress</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-border); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Courier Handoff</div>
                <div class="text-xs text-muted">${order.carrier}</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-border); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Doorstep Delivery</div>
                <div class="text-xs text-muted">Estimated 3–5 Days</div>
              </div>
            </div>
          </div>

          <!-- Order Receipt Card -->
          <div class="order-receipt-card">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
              <div>
                <h3 style="font-size: var(--text-lg);">Itemized Receipt</h3>
                <span class="text-xs text-muted font-mono">Invoice Date: ${new Date(order.date).toLocaleDateString()}</span>
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.print();">
                Print Tax Receipt
              </button>
            </div>

            <!-- Items List -->
            <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6);">
              ${order.items.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border-subtle);">
                  <div style="display: flex; align-items: center; gap: var(--space-4);">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 75px; object-fit: cover; border-radius: var(--radius-xs); background: var(--color-bg-alt);" />
                    <div>
                      <div class="text-xs text-muted text-uppercase">${item.brand}</div>
                      <div style="font-weight: 600; font-size: var(--text-sm);">${item.name}</div>
                      <div class="text-xs text-muted">${item.color} • ${item.size} • Qty: ${item.quantity}</div>
                    </div>
                  </div>
                  <div style="font-weight: 700; font-size: var(--text-sm);">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Breakdown -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-6);">
              <div style="width: 280px; display: flex; flex-direction: column; gap: 6px; font-size: var(--text-sm);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal</span>
                  <span>${formatPrice(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${order.couponCode || 'PROMO'})</span>
                    <span>-${formatPrice(order.discount)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span class="text-muted">Courier Shipping</span>
                  <span>${order.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(order.shippingFee)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Estimated Tax</span>
                  <span>${formatPrice(order.tax)}</span>
                </div>
                <div class="divider-subtle" style="margin: 4px 0;"></div>
                <div class="flex justify-between" style="font-size: var(--text-md); font-weight: 700;">
                  <span>Total Paid</span>
                  <span>${formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <!-- Customer Destination Strip -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); background-color: var(--color-bg-alt); padding: var(--space-4) var(--space-6); border-radius: var(--radius-xs); font-size: var(--text-xs);">
              <div>
                <strong style="display: block; margin-bottom: 4px;">Fulfillment Destination:</strong>
                <div>${order.customer.fullName}</div>
                <div class="text-muted">${order.customer.address}</div>
                <div class="text-muted">${order.customer.city}, ${order.customer.state} ${order.customer.postalCode}</div>
                <div class="text-muted">${order.customer.country}</div>
              </div>
              <div>
                <strong style="display: block; margin-bottom: 4px;">Payment Authorization:</strong>
                <div>${order.payment.method} (ending in ${order.payment.last4})</div>
                <div class="text-muted">Tracking: ${order.trackingNumber}</div>
                <div class="text-muted">Courier: ${order.carrier}</div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div style="display: flex; justify-content: center; gap: var(--space-4); margin-top: var(--space-8);">
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
            <a href="#/account" class="btn btn-outline btn-lg">View Order History</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(container) {}
};


/* --- MODULE: js/router.js --- */
/**
 * NORTHSTAR COMMERCE - Client-Side Router
 */










class Router {
  constructor() {
    this.routes = [
      { pattern: /^\/?$/, view: HomeView },
      { pattern: /^\/?#\/?$/, view: HomeView },
      { pattern: /^#\/home\/?$/, view: HomeView },
      { pattern: /^#\/shop\/?$/, view: ShopView },
      { pattern: /^#\/category\/([^\/?#]+)\/?$/, view: ShopView, paramNames: ['category'] },
      { pattern: /^#\/product\/([^\/?#]+)\/?$/, view: ProductView, paramNames: ['id'] },
      { pattern: /^#\/cart\/?$/, view: CartView },
      { pattern: /^#\/wishlist\/?$/, view: WishlistView },
      { pattern: /^#\/checkout\/?$/, view: CheckoutView },
      { pattern: /^#\/account\/?$/, view: AccountView },
      { pattern: /^#\/orders\/([^\/?#]+)\/?$/, view: OrdersView, paramNames: ['id'] },
      { pattern: /^#\/orders\/?$/, view: AccountView }
    ];

    this.container = null;
  }

  init(containerId = 'app-main') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/home';
    const [pathPart, queryPart] = rawHash.split('?');

    // Parse query params
    const queryParams = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }
    }

    let matchedView = null;
    let routeParams = {};

    for (const route of this.routes) {
      const match = pathPart.match(route.pattern);
      if (match) {
        matchedView = route.view;
        if (route.paramNames) {
          route.paramNames.forEach((name, i) => {
            routeParams[name] = match[i + 1];
          });
        }
        break;
      }
    }

    if (!matchedView) {
      matchedView = HomeView;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav links
    this.updateActiveNav(pathPart);

    // Render view
    this.container.innerHTML = matchedView.render(routeParams, queryParams);
    if (typeof matchedView.attachEvents === 'function') {
      matchedView.attachEvents(this.container);
    }
  }

  updateActiveNav(pathPart) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === pathPart || (pathPart.startsWith('#/category/') && href === '#/shop') || (pathPart === '#/home' && href === '#/home'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

const router = new Router();


/* --- MODULE: js/app.js --- */
/**
 * NORTHSTAR COMMERCE - Central Application Initializer
 */











document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Toasts & Modals
  Toast.init();
  DrawerCart.init();
  QuickViewModal.init();
  SearchModal.init();
  InfoModal.init();

  // 2. Setup Badge Counters (Cart & Wishlist)
  const cartBadge = document.getElementById('header-cart-badge');
  const wishlistBadge = document.getElementById('header-wishlist-badge');

  const updateCartBadge = () => {
    const count = cartStore.getCount();
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? 'flex' : 'none';
      cartBadge.classList.add('pop');
      setTimeout(() => cartBadge.classList.remove('pop'), 200);
    }
  };

  const updateWishlistBadge = () => {
    const count = wishlistStore.getCount();
    if (wishlistBadge) {
      wishlistBadge.textContent = count;
      wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
      wishlistBadge.classList.add('pop');
      setTimeout(() => wishlistBadge.classList.remove('pop'), 200);
    }
  };

  cartStore.subscribe(updateCartBadge);
  wishlistStore.subscribe(updateWishlistBadge);
  updateCartBadge();
  updateWishlistBadge();

  // 3. Header Action Triggers
  const openCartBtn = document.getElementById('open-cart-btn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      DrawerCart.open();
    });
  }

  const openSearchBtn = document.getElementById('open-search-btn');
  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      SearchModal.open();
    });
  }

  // Announcement promo code auto-copy/apply
  const announcementPromoBtn = document.getElementById('announcement-promo-btn');
  if (announcementPromoBtn) {
    announcementPromoBtn.addEventListener('click', () => {
      const code = 'NORTHSTAR15';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      cartStore.applyCoupon(code);
      Toast.success('Promo code NORTHSTAR15 copied & applied to your bag!');
    });
  }

  // 4. Mobile Navigation Drawer Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  const openMobileNav = () => {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'true');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav when clicking any mobile nav link
  if (mobileNavDrawer) {
    mobileNavDrawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMobileNav();
      }
    });
  }

  // 5. Global Product Card Action Delegation (Quick-View, Quick-Add, Wishlist)
  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('[data-action="quick-view"]');
    if (qvBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = qvBtn.getAttribute('data-product-id');
      QuickViewModal.open(id);
      return;
    }

    const qaBtn = e.target.closest('[data-action="quick-add"]');
    if (qaBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = qaBtn.getAttribute('data-product-id');
      const p = productStore.getProductById(id);
      if (p) {
        cartStore.addItem(p);
      }
      return;
    }

    const wlBtn = e.target.closest('[data-action="toggle-wishlist"]');
    if (wlBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = wlBtn.getAttribute('data-product-id');
      const p = productStore.getProductById(id);
      if (p) {
        const added = wishlistStore.toggle(p);
        wlBtn.classList.toggle('active', added);
      }
      return;
    }
  });

  // 6. Footer Newsletter Form
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        Toast.success('Thank you for subscribing to the Northstar Monograph.');
        input.value = '';
      }
    });
  }

  // 7. Initialize Client-Side Router
  router.init('app-main');
});


})();
