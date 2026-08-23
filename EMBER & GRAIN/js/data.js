/**
 * EMBER & GRAIN - MASTER DATA STORE
 * Premium contemporary restaurant data: menu items, modifiers, seating zones, testimonials, FAQs
 */

const RESTAURANT_INFO = {
  name: "Ember & Grain",
  tagline: "Contemporary Wood-Fired Gastronomy & Heritage Grains",
  description: "An upscale culinary destination celebrating ancestral wood-fire hearth cooking, ancient heritage grains, and regenerative seasonal farming in a refined architectural sanctuary.",
  phone: "+1 (212) 555-8930",
  email: "concierge@emberandgrain.com",
  pressEmail: "press@emberandgrain.com",
  eventsEmail: "privatedining@emberandgrain.com",
  address: {
    street: "482 Hudson Street",
    district: "West Village",
    city: "New York",
    state: "NY",
    zip: "10014",
    coordinates: { lat: 40.7338, lng: -74.0060 }
  },
  hours: [
    { days: "Tuesday – Thursday", lunch: "11:30 AM – 2:30 PM", dinner: "5:00 PM – 10:30 PM" },
    { days: "Friday", lunch: "11:30 AM – 2:30 PM", dinner: "5:00 PM – 11:30 PM" },
    { days: "Saturday", brunch: "10:30 AM – 3:00 PM", dinner: "5:00 PM – 11:30 PM" },
    { days: "Sunday", brunch: "10:30 AM – 3:00 PM", dinner: "5:00 PM – 9:30 PM" },
    { days: "Monday", note: "Closed for culinary research & farm sourcing" }
  ],
  stats: [
    { label: "Michelin Guide", value: "2024 Selection" },
    { label: "Wood-Fired Hearth", value: "850° White Oak" },
    { label: "Heritage Grains", value: "100% Ancient" },
    { label: "Cellar Collection", value: "1,800+ Labels" }
  ]
};

const SEATING_AREAS = [
  {
    id: "hearth-room",
    name: "Main Hearth Room",
    tagline: "The beating heart of our open kitchen",
    description: "Bathed in the warm amber glow of our custom dual-hearth white oak fire. High ceilings, charred cedar acoustic paneling, and Italian leather banquettes.",
    capacity: "Tables for 2 to 8 guests",
    minParty: 1,
    maxParty: 8,
    ambiance: "Warm, vibrant, theatrical",
    depositRequired: false,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    tables: [
      { id: "T-01", name: "Hearth Banquette 01", seats: 2, view: "Direct view of open hearth" },
      { id: "T-02", name: "Hearth Banquette 02", seats: 2, view: "Direct view of open hearth" },
      { id: "T-03", name: "Center Salon 03", seats: 4, view: "Dining room panoramic" },
      { id: "T-04", name: "Center Salon 04", seats: 4, view: "Dining room panoramic" },
      { id: "T-05", name: "Window Alcove 05", seats: 4, view: "Hudson Street view" },
      { id: "T-06", name: "Large Banquette 06", seats: 6, view: "Cozy corner & hearth glow" },
      { id: "T-07", name: "Heritage Table 07", seats: 8, view: "Live-edge walnut table" }
    ]
  },
  {
    id: "chefs-counter",
    name: "Chef's Tasting Counter",
    tagline: "Front-row interactive culinary theater",
    description: "An intimate 10-seat monolith black granite counter overlooking Chef Julian Mercer and the culinary team. Includes personalized sommelier pairings.",
    capacity: "Solo or pairs (up to 4 guests)",
    minParty: 1,
    maxParty: 4,
    ambiance: "Intimate, culinary, interactive",
    depositRequired: true,
    depositAmount: 50,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80",
    tables: [
      { id: "CC-01", name: "Counter Seat 1 & 2", seats: 2, view: "Plating station front row" },
      { id: "CC-02", name: "Counter Seat 3 & 4", seats: 2, view: "Ember grill & rotisserie" },
      { id: "CC-03", name: "Counter Seat 5 & 6", seats: 2, view: "Sauce & seasoning pass" },
      { id: "CC-04", name: "Counter Seat 7 & 8", seats: 2, view: "Pastry & bread station" }
    ]
  },
  {
    id: "veranda-garden",
    name: "The Glass Veranda",
    tagline: "Lush botanical sanctuary under the sky",
    description: "Climate-controlled solarium wrapped in climbing jasmine, Meyer lemon espaliers, and custom smoked-glass lanterns. Perfect for romantic and leisurely dining.",
    capacity: "Tables for 2 to 6 guests",
    minParty: 1,
    maxParty: 6,
    ambiance: "Luminous, botanical, serene",
    depositRequired: false,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80",
    tables: [
      { id: "VG-01", name: "Veranda Corner 01", seats: 2, view: "Surrounded by lemon trees" },
      { id: "VG-02", name: "Veranda Corner 02", seats: 2, view: "Living herb wall" },
      { id: "VG-03", name: "Solarium Center 03", seats: 4, view: "Glass roof starlight" },
      { id: "VG-04", name: "Solarium Center 04", seats: 4, view: "Glass roof starlight" },
      { id: "VG-05", name: "Garden Pavilion 05", seats: 6, view: "Veranda private alcove" }
    ]
  },
  {
    id: "cellar-vault",
    name: "The Reserve Cellar Vault",
    tagline: "Subterranean prestige dining among rare vintages",
    description: "Surrounded by our temperature-controlled 1,800-bottle reserve collection. Hand-carved limestone arches, dim candlelight, and acoustic privacy.",
    capacity: "Parties of 4 to 12 guests",
    minParty: 4,
    maxParty: 12,
    ambiance: "Prestige, romantic, ultra-private",
    depositRequired: true,
    depositAmount: 100,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
    tables: [
      { id: "CV-01", name: "Sommelier Table 01", seats: 4, view: "Burgundy Reserve wall" },
      { id: "CV-02", name: "Grand Vault Table", seats: 8, view: "Centuries-old stone arch" },
      { id: "CV-03", name: "Private Cellar Suite", seats: 12, view: "Exclusive private room" }
    ]
  }
];

const MENU_ITEMS = [
  // --- BREAKFAST & BRUNCH ---
  {
    id: "br-01",
    name: "Hearth-Baked Shakshuka",
    category: "breakfast",
    price: 24,
    featured: true,
    description: "Heritage duck eggs poached in ember-roasted San Marzano tomatoes, charred sweet peppers, Aleppo oil, whipped sheep feta, and grilled sourdough.",
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Signature"],
    allergens: ["Eggs", "Dairy", "Gluten"],
    prepTime: "12-15 min",
    pairing: "2022 Domaine Tempier Bandol Rosé",
    story: "Baked in our 800° cast iron pans directly on glowing oak embers for a distinct smoky depth.",
    modifiers: [
      {
        name: "Egg Preparation",
        type: "radio",
        options: [
          { label: "Poached Soft & Runny (Recommended)", price: 0, default: true },
          { label: "Medium Poached", price: 0 },
          { label: "Well Done", price: 0 }
        ]
      },
      {
        name: "Artisanal Additions",
        type: "checkbox",
        options: [
          { label: "House-Smoked Merguez Sausage", price: 7 },
          { label: "Avocado with Smoked Salt", price: 5 },
          { label: "Extra Grilled Sourdough (2 slices)", price: 4 }
        ]
      }
    ]
  },
  {
    id: "br-02",
    name: "Ancient Grain Porridge & Honeycomb",
    category: "breakfast",
    price: 20,
    featured: false,
    description: "Warm einkorn, farro, and steel-cut oat porridge simmered in organic almond milk, caramelized mission figs, toasted hazelnuts, and raw Catskills honeycomb.",
    image: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Vegan Option", "Dairy-Free"],
    allergens: ["Tree Nuts", "Gluten"],
    prepTime: "10 min",
    pairing: "Smoked Fig & Toasted Barley Cold Brew",
    story: "Einkorn is sourced directly from certified organic heritage grain millers in upstate New York.",
    modifiers: [
      {
        name: "Milk Base",
        type: "radio",
        options: [
          { label: "House-Pressed Almond Milk", price: 0, default: true },
          { label: "Organic Oat Milk", price: 0 },
          { label: "Grass-Fed Whole Milk", price: 0 }
        ]
      },
      {
        name: "Additions",
        type: "checkbox",
        options: [
          { label: "Shaved Tahitian Vanilla Bean", price: 3 },
          { label: "Extra Caramelized Figs", price: 4 },
          { label: "Roasted Cacao Nibs", price: 2 }
        ]
      }
    ]
  },
  {
    id: "br-03",
    name: "Smoked Salmon Tartine on Heritage Rye",
    category: "breakfast",
    price: 28,
    featured: true,
    description: "House-cured King Salmon cold-smoked over applewood, whipped dill crème fraîche, pickled shallots, salted caperberries, and trout caviar on Danish rye.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    dietary: ["Pescatarian", "Signature"],
    allergens: ["Fish", "Dairy", "Gluten"],
    prepTime: "10-12 min",
    pairing: "Billecart-Salmon Brut Rosé Champagne",
    story: "Our Danish rye undergoes a 48-hour slow sourdough fermentation with whole sprouted rye berries.",
    modifiers: [
      {
        name: "Caviar Selection",
        type: "radio",
        options: [
          { label: "Wild Trout Roe (Included)", price: 0, default: true },
          { label: "Upgrade to Royal Osetra Caviar (10g)", price: 35 }
        ]
      },
      {
        name: "Additions",
        type: "checkbox",
        options: [
          { label: "Soft Poached Duck Egg", price: 4 },
          { label: "Side Organic Greens with Lemon Dressing", price: 5 }
        ]
      }
    ]
  },
  {
    id: "br-04",
    name: "Brioche French Toast & Roasted Stone Fruit",
    category: "breakfast",
    price: 22,
    featured: false,
    description: "Thick-cut wood-fired brioche, hearth-roasted peaches, whipped bourbon mascarpone, toasted pecans, and Grade A dark amber wood-boiled maple syrup.",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian"],
    allergens: ["Eggs", "Dairy", "Gluten", "Tree Nuts"],
    prepTime: "15 min",
    pairing: "Wild Botanical Mimosa",
    story: "Brioche is baked daily at dawn using grass-fed cultured butter and heritage spelt flour.",
    modifiers: [
      {
        name: "Toppings",
        type: "checkbox",
        options: [
          { label: "Applewood Smoked Bacon (2 strips)", price: 6 },
          { label: "Extra Whipped Mascarpone", price: 3 },
          { label: "Caramelized Banana", price: 4 }
        ]
      }
    ]
  },
  {
    id: "br-05",
    name: "Ember Benedict with Berkshire Pork Belly",
    category: "breakfast",
    price: 26,
    featured: true,
    description: "12-hour braised Berkshire pork belly seared on the grill, soft poached farm eggs, charred spring onion hollandaise, toasted heritage grain English muffin.",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80",
    dietary: ["Signature"],
    allergens: ["Eggs", "Dairy", "Gluten", "Pork"],
    prepTime: "15 min",
    pairing: "Bloody Mary with Smoked Oak Bitters",
    story: "Our hollandaise is infused with cold-smoked clarified butter and charred scallion oil.",
    modifiers: [
      {
        name: "Hollandaise Style",
        type: "radio",
        options: [
          { label: "Classic Smoked Hollandaise", price: 0, default: true },
          { label: "Truffled Hollandaise", price: 6 }
        ]
      }
    ]
  },

  // --- STARTERS ---
  {
    id: "st-01",
    name: "Charred Heirloom Carrots & Whipped Tahini",
    category: "starters",
    price: 21,
    featured: true,
    description: "Ember-roasted multi-color carrots, stone-ground whipped sesame tahini, pistachio dukkah, pomegranate reduction, wild mint, and charred lemon.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegan", "Gluten-Free", "Vegetarian"],
    allergens: ["Sesame", "Tree Nuts (Pistachio)"],
    prepTime: "10 min",
    pairing: "2021 Keller Riesling Trocken, Rheinhessen",
    story: "Carrots are roasted directly in white oak embers until sweet, tender, and deeply caramelized.",
    modifiers: [
      {
        name: "Spice Level",
        type: "radio",
        options: [
          { label: "Subtle Warmth (Standard)", price: 0, default: true },
          { label: "Spicy (Extra Urfa Pepper Dukkah)", price: 0 }
        ]
      },
      {
        name: "Bread Pairing",
        type: "checkbox",
        options: [
          { label: "Warm Wood-Fired Pita", price: 5 }
        ]
      }
    ]
  },
  {
    id: "st-02",
    name: "Wood-Fired Bone Marrow & Gremolata",
    category: "starters",
    price: 27,
    featured: true,
    description: "Split beef bone marrow roasted over open coals, parsley gremolata with charred lemon zest, pickled shallots, capers, and grilled rustic sourdough.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dietary: ["Signature"],
    allergens: ["Gluten"],
    prepTime: "15 min",
    pairing: "2018 Viña Tondonia Reserva Rioja",
    story: "Sourced from pasture-raised Pennsylvania Angus cattle, roasted at 850° for rich unctuous depth.",
    modifiers: [
      {
        name: "Additions",
        type: "checkbox",
        options: [
          { label: "Shaved Black Perigord Truffle", price: 14 },
          { label: "Extra Grilled Sourdough Slices", price: 4 }
        ]
      }
    ]
  },
  {
    id: "st-03",
    name: "Hokkaido Scallop Crudo",
    category: "starters",
    price: 29,
    featured: true,
    description: "Sashimi-grade sea scallops, fermented citrus kosho vinaigrette, Australian finger lime pearls, toasted buckwheat crunch, and smoked dashi droplets.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    dietary: ["Pescatarian", "Gluten-Free", "Dairy-Free", "Signature"],
    allergens: ["Shellfish / Molluscs"],
    prepTime: "8 min",
    pairing: "2020 Domaine Sigalas Assyrtiko, Santorini",
    story: "Diver-caught Hokkaido scallops flown in within 36 hours of harvest for supreme sweetness.",
    modifiers: [
      {
        name: "Add Caviar",
        type: "checkbox",
        options: [
          { label: "Kaluga Hybrid Caviar Bump (5g)", price: 20 }
        ]
      }
    ]
  },
  {
    id: "st-04",
    name: "Ember-Roasted Beetroot Carpaccio",
    category: "starters",
    price: 19,
    featured: false,
    description: "Salt-baked and coal-charred golden and chioggia beets, whipped artisanal goat curd, candied black walnuts, watercress, and aged elderflower balsamic.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Gluten-Free"],
    allergens: ["Dairy", "Tree Nuts"],
    prepTime: "10 min",
    pairing: "2022 Pascal Jolivet Sancerre",
    story: "Beets are cooked buried in embers for 3 hours to concentrate their earthy natural sweetness.",
    modifiers: [
      {
        name: "Cheese Preference",
        type: "radio",
        options: [
          { label: "Whipped Goat Curd (Classic)", price: 0, default: true },
          { label: "Vegan Cashew Truffle Cream", price: 0 },
          { label: "No Cheese (Dairy Free)", price: 0 }
        ]
      }
    ]
  },
  {
    id: "st-05",
    name: "Wagyu Beef Tartare & Smoked Yolk",
    category: "starters",
    price: 31,
    featured: true,
    description: "Hand-cut American Wagyu sirloin, cured quail egg yolk smoked with applewood embers, black garlic emulsion, pickled ramps, crispy sunchoke chips.",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free Option", "Signature"],
    allergens: ["Eggs"],
    prepTime: "12 min",
    pairing: "2019 Produttori del Barbaresco",
    story: "Hand-diced to order to maintain texture and mixed with house-fermented ramp brine.",
    modifiers: [
      {
        name: "Crisp Accompaniment",
        type: "radio",
        options: [
          { label: "Crisp Sunchoke Chips (Gluten-Free)", price: 0, default: true },
          { label: "Grilled Pain de Campagne Slices", price: 0 }
        ]
      }
    ]
  },
  {
    id: "st-06",
    name: "Heritage Grain Sourdough & Cultured Butter",
    category: "starters",
    price: 14,
    featured: false,
    description: "Warm hearth-baked ancient grain sourdough boule, house-churned cultured butter smoked over cherrywood, sea salt flakes, and herb blossom olive oil.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian"],
    allergens: ["Gluten", "Dairy"],
    prepTime: "5 min",
    pairing: "House Vermouth Apertif",
    story: "Our starter has been carefully maintained and fed with organic whole spelt since 2017.",
    modifiers: [
      {
        name: "Butter Selection",
        type: "checkbox",
        options: [
          { label: "Extra Smoked Butter Portion", price: 4 },
          { label: "Black Truffle Cultured Butter", price: 6 }
        ]
      }
    ]
  },

  // --- MAIN COURSES ---
  {
    id: "mc-01",
    name: "45-Day Dry-Aged Prime Ribeye (14oz)",
    category: "mains",
    price: 68,
    featured: true,
    description: "Creekstone Farms prime beef aged in-house with Himalayan salt bricks. Grilled over white oak embers, charred cipollini onions, roasted marrow jus, smoked butter.",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free", "Signature"],
    allergens: ["Dairy"],
    prepTime: "25-30 min",
    pairing: "2017 Château Lynch-Bages Pauillac Bordeaux",
    story: "Aged for a minimum of 45 days in our salt-lined humidity chamber to concentrate pure umami richness.",
    modifiers: [
      {
        name: "Cooking Doneness",
        type: "radio",
        options: [
          { label: "Rare (Cool red center)", price: 0 },
          { label: "Medium Rare (Warm red center - Chef Recommendation)", price: 0, default: true },
          { label: "Medium (Warm pink center)", price: 0 },
          { label: "Medium Well (Slight pink)", price: 0 }
        ]
      },
      {
        name: "Sauce & Accompaniments",
        type: "checkbox",
        options: [
          { label: "Wood-Smoked Chimichurri", price: 4 },
          { label: "Shaved Perigord Black Truffle", price: 18 },
          { label: "Seared Hudson Valley Foie Gras (2oz)", price: 22 }
        ]
      }
    ]
  },
  {
    id: "mc-02",
    name: "Wood-Roasted Black Cod & Maitake",
    category: "mains",
    price: 52,
    featured: true,
    description: "Wild Alaskan black cod steeped in fermented barley miso, roasted on cedar wood over charcoal, wild maitake mushrooms, charred scallion oil, and kombu dashi broth.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    dietary: ["Pescatarian", "Gluten-Free Option", "Signature"],
    allergens: ["Fish", "Soy"],
    prepTime: "20 min",
    pairing: "2021 Meursault Domaine des Comtes Lafon",
    story: "Cedar wood grilling imbues the velvety fish with an irreplaceable sweet smoke and caramelized glaze.",
    modifiers: [
      {
        name: "Grain Accompaniment",
        type: "radio",
        options: [
          { label: "Heritage Einkorn & Kombu Grain Rice", price: 0, default: true },
          { label: "Charred Baby Bok Choy (Grain-Free)", price: 0 }
        ]
      }
    ]
  },
  {
    id: "mc-03",
    name: "Ember-Grilled Venison Loin",
    category: "mains",
    price: 58,
    featured: true,
    description: "New Zealand red deer loin seared over cherry embers, silk parsnip puree, wood-roasted wild blackberries, crispy Jerusalem artichokes, and juniper berry reduction.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free", "Signature"],
    allergens: ["Dairy"],
    prepTime: "22 min",
    pairing: "2016 Guigal Côte-Rôtie Brune et Blonde",
    story: "Ultra-lean, wild-foraged venison pairs perfectly with the tartness of wood-roasted blackberries.",
    modifiers: [
      {
        name: "Cooking Temperature",
        type: "radio",
        options: [
          { label: "Rare (Recommended for Venison)", price: 0 },
          { label: "Medium Rare", price: 0, default: true },
          { label: "Medium", price: 0 }
        ]
      }
    ]
  },
  {
    id: "mc-04",
    name: "Heritage Farro & Morel Mushroom Risotto",
    category: "mains",
    price: 38,
    featured: true,
    description: "Slow-simmered ancient Emmer farro, wild foraged morel mushrooms, roasted hazelnut butter, shaved black summer truffle, 36-month Parmigiano-Reggiano, thyme crisp.",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Vegan Option", "Signature"],
    allergens: ["Dairy", "Tree Nuts", "Gluten"],
    prepTime: "18-20 min",
    pairing: "2019 Bruno Giacosa Barolo Falletto",
    story: "Farro retain a distinct nutty bite and ancient mineral complexity far superior to conventional rice.",
    modifiers: [
      {
        name: "Dietary Customization",
        type: "radio",
        options: [
          { label: "Classic with 36-Month Parmigiano", price: 0, default: true },
          { label: "Plant-Based (Nutritional Yeast & Cashew Cream)", price: 0 }
        ]
      },
      {
        name: "Luxuries",
        type: "checkbox",
        options: [
          { label: "Double Shaved Black Truffle (+5g)", price: 16 },
          { label: "Soft Poached Organic Duck Egg", price: 4 }
        ]
      }
    ]
  },
  {
    id: "mc-05",
    name: "Spiced Rohan Duck Breast & Ember Plums",
    category: "mains",
    price: 48,
    featured: false,
    description: "Dry-aged Rohan duck breast with five-spice honey crust, wood-roasted black plums, charred chicory, toasted coriander farro, and lavender duck jus.",
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free Option"],
    allergens: ["Gluten"],
    prepTime: "22 min",
    pairing: "2018 Domaine Dujac Morey-Saint-Denis",
    story: "Duck skin is rendered slowly over indirect embers to achieve paper-crisp skin and succulent meat.",
    modifiers: [
      {
        name: "Doneness",
        type: "radio",
        options: [
          { label: "Medium Rare (Recommended)", price: 0, default: true },
          { label: "Medium", price: 0 }
        ]
      }
    ]
  },
  {
    id: "mc-06",
    name: "Cast-Iron Pasture Heritage Chicken",
    category: "mains",
    price: 42,
    featured: false,
    description: "Half Lancaster County pasture chicken roasted in cast iron under white oak embers, whole roasted garlic cloves, thyme pan drippings, einkorn grain pilaf, and charred lemon.",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free Option"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "25 min",
    pairing: "2020 Domaine Leflaive Puligny-Montrachet",
    story: "Brined in mountain herbs and buttermilk for 24 hours before cooking under intense radiant hearth heat.",
    modifiers: [
      {
        name: "Side Enhancement",
        type: "checkbox",
        options: [
          { label: "Wood-Roasted Heritage Wild Mushrooms", price: 9 },
          { label: "Smoked Fingerling Potatoes with Chive Butter", price: 8 }
        ]
      }
    ]
  },

  // --- DESSERTS ---
  {
    id: "de-01",
    name: "Smoked Dark Chocolate & Roasted Barley Torte",
    category: "desserts",
    price: 18,
    featured: true,
    description: "72% single-origin Valrhona dark chocolate mousse, cold-smoked with oak sawdust, toasted rye crumble, fleur de sel caramel, and roasted barley gelato.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian", "Signature"],
    allergens: ["Dairy", "Eggs", "Gluten"],
    prepTime: "8 min",
    pairing: "Taylor Fladgate 20 Year Old Tawny Port",
    story: "The slight oak smoke deepens the bitter notes of the Ecuadorian chocolate for an unforgettable finish.",
    modifiers: [
      {
        name: "Accompaniment",
        type: "checkbox",
        options: [
          { label: "Extra Scoop Roasted Barley Gelato", price: 5 },
          { label: "Espresso Shot Pour-Over", price: 4 }
        ]
      }
    ]
  },
  {
    id: "de-02",
    name: "Hearth-Roasted Pear & Frangipane Tart",
    category: "desserts",
    price: 17,
    featured: false,
    description: "Bartlett pears roasted in the dying embers with rosemary honey, almond frangipane, buttery spelt crust, and Tahitian vanilla bean mascarpone.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    dietary: ["Vegetarian"],
    allergens: ["Tree Nuts (Almond)", "Dairy", "Eggs", "Gluten"],
    prepTime: "8 min",
    pairing: "2017 Château d'Yquem Sauternes",
    story: "Baked fresh every evening as the hearth embers settle into their gentle low glow.",
    modifiers: [
      {
        name: "Mascarpone Option",
        type: "radio",
        options: [
          { label: "Vanilla Bean Mascarpone", price: 0, default: true },
          { label: "Dairy-Free Coconut Vanilla Cream", price: 0 }
        ]
      }
    ]
  },
  {
    id: "de-03",
    name: "Toasted Ancient Grain Panna Cotta",
    category: "desserts",
    price: 16,
    featured: true,
    description: "Infused with toasted einkorn grains and sweet cream, wild ember-roasted blackberry compote, crispy buckwheat honey tuile, and micro lemon verbena.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free", "Vegetarian", "Signature"],
    allergens: ["Dairy"],
    prepTime: "6 min",
    pairing: "2021 Donnafugata Ben Ryé Passito di Pantelleria",
    story: "A delicate silk texture infused with the toasted biscuit aroma of ancient heritage einkorn.",
    modifiers: []
  },
  {
    id: "de-04",
    name: "Basque Burnt Cheesecake & Charred Citrus",
    category: "desserts",
    price: 18,
    featured: false,
    description: "Caramelized crust baked at high heat, molten creamy center infused with goat and cow cream cheeses, charred blood orange coulis, and crushed coriander praline.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    dietary: ["Gluten-Free", "Vegetarian"],
    allergens: ["Dairy", "Eggs"],
    prepTime: "6 min",
    pairing: "Rare Tokaji Aszú 5 Puttonyos",
    story: "Our tribute to San Sebastián, baked hot to create a blistered bittersweet surface.",
    modifiers: [
      {
        name: "Sauce",
        type: "radio",
        options: [
          { label: "Charred Blood Orange Coulis", price: 0, default: true },
          { label: "Salted Smoked Caramel", price: 0 }
        ]
      }
    ]
  },

  // --- DRINKS & LIBATIONS ---
  {
    id: "dr-01",
    name: "The Ember Old Fashioned",
    category: "drinks",
    price: 22,
    featured: true,
    description: "WhistlePig 10-year rye whiskey smoked under cloche with charred white oak chips, demerara raw sugar, roasted chicory bitters, flame-expressed orange peel.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    dietary: ["Signature", "Cocktail"],
    allergens: [],
    prepTime: "5 min",
    pairing: "45-Day Dry-Aged Ribeye",
    story: "Served in a heavy crystal tumbler with a single hand-carved crystal ice sphere.",
    modifiers: [
      {
        name: "Whiskey Selection",
        type: "radio",
        options: [
          { label: "WhistlePig 10-Yr Rye (Standard)", price: 0, default: true },
          { label: "Upgrade to Michter's 10-Yr Single Barrel", price: 15 }
        ]
      },
      {
        name: "Ice Preference",
        type: "radio",
        options: [
          { label: "Hand-Carved Crystal Sphere", price: 0, default: true },
          { label: "Neat (No Ice)", price: 0 }
        ]
      }
    ]
  },
  {
    id: "dr-02",
    name: "Smoke & Grain Manhattan",
    category: "drinks",
    price: 21,
    featured: true,
    description: "Heritage bourbon, house-toasted malt vermouth blend, amaro nonino, wild cherry bark bitters, and brandied sour cherry.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    dietary: ["Signature", "Cocktail"],
    allergens: [],
    prepTime: "4 min",
    pairing: "Wood-Fired Bone Marrow",
    story: "Our vermouth is infused in-house with toasted whole barley and star anise.",
    modifiers: []
  },
  {
    id: "dr-03",
    name: "Wild Botanical Sour",
    category: "drinks",
    price: 19,
    featured: false,
    description: "The Botanist Islay gin, St-Germain elderflower, freshly pressed Meyer lemon, organic egg white cloud, and charred rosemary sprig.",
    image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80",
    dietary: ["Cocktail"],
    allergens: ["Eggs"],
    prepTime: "5 min",
    pairing: "Hokkaido Scallop Crudo",
    story: "A crisp, aromatic refresher shaken vigorously to create a silky, aromatic foam.",
    modifiers: [
      {
        name: "Egg White Alternative",
        type: "radio",
        options: [
          { label: "Organic Egg White (Classic Silk Foam)", price: 0, default: true },
          { label: "Aquafaba (Plant-Based Foam)", price: 0 }
        ]
      }
    ]
  },
  {
    id: "dr-04",
    name: "Charred Grapefruit & Mezcal Paloma",
    category: "drinks",
    price: 20,
    featured: false,
    description: "Del Maguey Vida mezcal, fresh ruby red grapefruit juice charred on the grill, lime, wild agave nectar, sparkling mineral water, volcanic black salt rim.",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
    dietary: ["Cocktail"],
    allergens: [],
    prepTime: "4 min",
    pairing: "Charred Heirloom Carrots",
    story: "The charring of whole grapefruit intensifies sugars and lends an alluring smoky note.",
    modifiers: []
  },
  {
    id: "dr-05",
    name: "Smoked Fig & Thyme Shrub (Zero Proof)",
    category: "drinks",
    price: 14,
    featured: true,
    description: "House-fermented Black Mission fig shrub, charred fresh thyme, cold-pressed lemon juice, sparkling mountain spring water, dehydrated fig wheel.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    dietary: ["Non-Alcoholic", "Vegan", "Signature"],
    allergens: [],
    prepTime: "3 min",
    pairing: "Heritage Farro & Morel Risotto",
    story: "A complex, tart, and nuanced zero-proof aperitif with long lingering botanical depth.",
    modifiers: []
  },
  {
    id: "dr-06",
    name: "Toasted Barley Cold Brew",
    category: "drinks",
    price: 10,
    featured: false,
    description: "Single-origin Ethiopian Yirgacheffe cold brew steeped for 24 hours with dark roasted heritage barley, oat milk float, and spiced demerara.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    dietary: ["Non-Alcoholic", "Vegan"],
    allergens: ["Gluten"],
    prepTime: "3 min",
    pairing: "Smoked Dark Chocolate Torte",
    story: "Inspired by traditional mugicha roasted barley tea married with specialty single-origin coffee.",
    modifiers: []
  }
];

const CHEFS_TEAM = [
  {
    name: "Julian Mercer",
    role: "Chef Patron & Co-Founder",
    bio: "Trained across three-Michelin-starred kitchens in San Sebastián, Copenhagen, and Lyon. Julian brings a profound dedication to ancestral open-flame hearth cooking and heritage grain preservation.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    quote: "Fire is not just heat; it is an ingredient with soul, memory, and ancient rhythm."
  },
  {
    name: "Evelyn Saint-Claire",
    role: "Executive Pastry & Master Baker",
    bio: "A pioneer in ancient grain sourdough fermentation. Evelyn oversees our wood-fired hearth bread program and artisan heritage dessert creations with artisanal millers.",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    quote: "Grains are living capsules of history. When stone-milled and fermented slowly, they transform into pure poetry."
  },
  {
    name: "Marcello Vance",
    role: "Head Sommelier & Beverage Director",
    bio: "Advanced Sommelier through the Court of Master Sommeliers. Curates our 1,800-bottle cellar emphasizing low-intervention, biodynamic, and classic European reserve estates.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    quote: "The perfect wine pairing does not shout; it breathes in effortless harmony with smoke and earth."
  }
];

const TESTIMONIALS = [
  {
    quote: "Ember & Grain redefines modern American luxury dining. The wood-roasted cod and dry-aged ribeye are generational masterpieces of fire and grain.",
    author: "Eleanor Vance",
    title: "Culinary Editor, The New Yorker",
    rating: 5,
    date: "November 2024"
  },
  {
    quote: "An extraordinary sensory symphony. From the amber hearth light to the 48-hour fermented rye, every millisecond here feels curated for royalty.",
    author: "Christian Laurent",
    title: "Michelin Guide Reviewer",
    rating: 5,
    date: "January 2025"
  },
  {
    quote: "The reservation at the Chef's Counter is the finest dining experience in Manhattan right now. Julian Mercer's mastery over open wood flame is unmatched.",
    author: "Dr. Marcus Sterling",
    title: "Private Collector & Gastronome",
    rating: 5,
    date: "February 2025"
  }
];

const FAQS = [
  {
    question: "What is your dress code?",
    answer: "We recommend Elegant Smart Casual. We request that guests refrain from athletic wear, beachwear, and flip-flops to preserve the sophisticated atmosphere for all diners."
  },
  {
    question: "How far in advance can I book a table?",
    answer: "Reservations open 30 days in advance at 9:00 AM EST every morning. For private dining or buyouts of over 8 guests, please reach out via our contact page up to 6 months in advance."
  },
  {
    question: "Can you accommodate dietary restrictions and allergies?",
    answer: "Yes, our culinary team takes allergies and dietary preferences very seriously. We offer comprehensive Gluten-Free, Vegetarian, and Dairy-Free adaptations for almost all dishes. Please notify us during booking."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Standard table reservations may be cancelled without penalty up to 24 hours prior to the seating. Chef's Counter and Cellar Vault reservations require 48 hours notice to avoid a cancellation fee of $50/guest."
  },
  {
    question: "Do you offer corkage service?",
    answer: "Guests may bring up to two 750ml bottles of personal wine that are not currently represented on our reserve wine list. The corkage fee is $65 per bottle."
  }
];

// Export to window object for browser access
if (typeof window !== "undefined") {
  window.EG_DATA = {
    RESTAURANT_INFO,
    SEATING_AREAS,
    MENU_ITEMS,
    CHEFS_TEAM,
    TESTIMONIALS,
    FAQS
  };
}
