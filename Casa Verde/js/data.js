/* ==========================================================================
   Casa Verde — Data Models & Mock Datasets
   Realistic fictional boutique hotel & eco-sanctuary content
   ========================================================================== */

const HOTEL_DATA = {
  name: "Casa Verde",
  subname: "Eco-Sanctuary & Ocean Villas",
  location: "Península de la Selva, Costa Verde",
  phone: "+1 (800) 555-VERDE",
  email: "concierge@casaverde-resort.com",
  coordinates: "9.3892° N, 84.1482° W",
  taxRate: 0.12, // 12% Luxury Hospitality Tax
  resortFeePerNight: 50, // $50 daily conservation & resort wellness fee
  weekendMultiplier: 1.15, // +15% Friday & Saturday surge
  highSeasonMultiplier: 1.25, // Dec-April high season surge

  // Room Catalog
  rooms: [
    {
      id: "casita-verde",
      name: "Garden Casita Verde",
      category: "Casita",
      tagline: "Nestled in ancient botanical rainforest with private plunge pool",
      badge: "Signature Classic",
      basePrice: 580,
      sizeSqFt: 850,
      sizeSqM: 79,
      maxGuests: 2,
      beds: "1 King Bed (Organic Linen)",
      view: "Rainforest & Botanical Gardens",
      features: ["Private Heated Plunge Pool", "Outdoor Rainforest Shower", "Living Terrace", "Dyson Styling Tools"],
      amenities: [
        "Private plunge pool surrounded by tropical flora",
        "Outdoor dual rain shower with botanic extracts",
        "Bang & Olufsen bespoke spatial sound system",
        "Complimentary sommelier welcome bar & local roast coffee",
        "Organic Egyptian cotton linens & down duvet selection",
        "24/7 dedicated private butler service",
        "High-speed fiber Wi-Fi & iPad concierge control"
      ],
      description: "Tucked into the lush emerald canopy of our private reserve, the Garden Casita offers uninterrupted peace and intimate seclusion. Floor-to-ceiling glass sliding walls merge the handcrafted teak interiors with a sun-drenched private deck and plunge pool.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "cliffside-ocean-villa",
      name: "Cliffside Ocean Villa",
      category: "Villa",
      tagline: "Panoramic Pacific horizons with cantilevered infinity pool",
      badge: "Guest Favorite",
      basePrice: 920,
      sizeSqFt: 1450,
      sizeSqM: 135,
      maxGuests: 3,
      beds: "1 Master King + Daybed",
      view: "Panoramic Ocean & Sunset Horizon",
      features: ["Cantilevered Infinity Edge Pool", "Sunset Viewing Daybed", "Marble Soaking Tub", "In-Villa Wine Cellar"],
      amenities: [
        "Private cantilevered infinity pool suspended above the ocean",
        "Freestanding hand-carved stone soaking tub with ocean vistas",
        "Climate-controlled private sommelier wine cellar",
        "Open-air lounge with fire bowl and sunken sofa",
        "Complimentary evening sunset canapés & artisanal cocktails",
        "Dyson Supersonic hair care & Aesop apothecary amenities",
        "Dedicated golf cart for resort transit"
      ],
      description: "Perched majestically on the volcanic cliff edge, the Cliffside Ocean Villa commands endless panoramic vistas of the azure ocean. Bask in dramatic sunsets from your private infinity pool or unwind in the open-air sunken lounge.",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "canopy-treehouse-suite",
      name: "Canopy Treehouse Suite",
      category: "Suite",
      tagline: "Elevated architectural living amidst the jungle treetops",
      badge: "Architectural Marvel",
      basePrice: 740,
      sizeSqFt: 1100,
      sizeSqM: 102,
      maxGuests: 2,
      beds: "1 Custom Teak King Bed",
      view: "360° Canopy & Distant Ocean",
      features: ["Suspended Hammock Net", "Wrap-around Veranda", "Open-Air Sky Bath", "Telescope for Stargazing"],
      amenities: [
        "Suspended high-tensile relaxation net overlooking the forest canopy",
        "Handmade copper soaking tub on private terrace under the stars",
        "High-powered Celestron astronomical telescope",
        "Custom Japanese joinery and sustainable reclaimed cedarwood",
        "Bespoke soundproofing and eco-smart temperature regulation",
        "Morning organic birdwatching breakfast basket delivered to deck"
      ],
      description: "Suspended 40 feet above the forest floor, the Canopy Treehouse Suite is a celebration of biophilic architecture and eco-luxury. Wake to the calls of toucans and unwind above the forest canopy on your suspended relaxation net.",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "presidential-ocean-estate",
      name: "The Grand Presidential Estate",
      category: "Estate",
      tagline: "The ultimate private sanctuary with 3 bedrooms & private chef kitchen",
      badge: "Ultra Luxury",
      basePrice: 2450,
      sizeSqFt: 4200,
      sizeSqM: 390,
      maxGuests: 8,
      beds: "3 Master Kings + 2 Twin XLs",
      view: "Direct Coastal Beachfront & Ocean",
      features: ["25m Private Lap Pool", "Dedicated Chef & Butler", "Private Spa Pavilion", "Beachfront Gate"],
      amenities: [
        "25-meter private black granite lap pool and hot hydrotherapy spa",
        "Private commercial kitchen with dedicated executive chef",
        "In-estate private massage pavilion & sauna",
        "Direct private keycard access to secluded crescent beach",
        "Full Range Rover Vogue chauffeur vehicle for duration of stay",
        "Curated 100-bottle grand cru cellar selection included",
        "Daily tailored wellness, yoga, and marine excursions included"
      ],
      description: "Our crowning jewel: a majestic multi-pavilion private compound offering incomparable grandeur, complete seclusion, and an uncompromising level of bespoke personal service. Ideal for multi-generational escapes and discerning travelers.",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "olive-grove-pavilion",
      name: "Olive & Palm Pavilion",
      category: "Pavilion",
      tagline: "Serene courtyard oasis framed by ancient olive trees and reflecting pools",
      badge: "Romantic Retreat",
      basePrice: 660,
      sizeSqFt: 980,
      sizeSqM: 91,
      maxGuests: 2,
      beds: "1 Custom Four-Poster King",
      view: "Reflecting Water Courtyard & Palms",
      features: ["Private Sunken Courtyard", "Outdoor Fireplace", "Terrazzo Soaking Tub", "Complimentary Minibar"],
      amenities: [
        "Private walled garden with reflecting fountain and native palms",
        "Wood-burning outdoor fireplace with nightly fire attendant",
        "Custom hand-poured terrazzo oval bathtub",
        "Handwoven organic textiles and artisanal ceramics",
        "Sonos acoustic sound system with curated ambient vinyl playlist",
        "Gourmet breakfast served en-suite or in the courtyard"
      ],
      description: "An intimate sanctuary designed for romance and renewal. The Olive & Palm Pavilion centers around a tranquil private courtyard with gentle water features, fragrant jasmine, and an outdoor stone fireplace for enchanted evenings.",
      images: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "azure-penthouse",
      name: "Azure Horizon Penthouse",
      category: "Penthouse",
      tagline: "Top-tier coastal penthouse with 180° ocean view rooftop terrace",
      badge: "Exclusive Panoramas",
      basePrice: 1150,
      sizeSqFt: 1850,
      sizeSqM: 172,
      maxGuests: 4,
      beds: "2 King Suites with En-Suite Baths",
      view: "180° Ocean, Coastline & Mountain Range",
      features: ["Private Rooftop Deck", "Hydrotherapy Whirlpool", "Cocktail Bar & Lounge", "Private Lift Access"],
      amenities: [
        "Private rooftop solarium with heated hydrotherapy jacuzzi",
        "Direct biometric private elevator entry into the penthouse",
        "Custom marble cocktail bar with dedicated mixologist service available",
        "Dual master bedrooms each with private en-suite rainfall bathrooms",
        "High-definition OLED home theater with Dolby Atmos",
        "Priority VIP reservations across all resort dining & spa facilities"
      ],
      description: "Commanding the highest elevation of the resort's main enclave, the Azure Penthouse provides breathtaking uninterrupted panoramas of the Pacific coast and rainforest ridgelines, paired with peerless modern luxury.",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ],

  // Curated Add-ons
  addOns: [
    {
      id: "champagne-breakfast",
      name: "Artisanal Champagne Breakfast Daily",
      desc: "Fresh organic bakery basket, farm eggs, tropical seasonal fruits, artisan cheeses, and Laurent-Perrier Champagne served in-suite or at Terra.",
      price: 45,
      priceType: "per_guest_per_night",
      icon: "fa-champagne-glasses"
    },
    {
      id: "airport-transfer",
      name: "Private Chauffeur Airport Transfer",
      desc: "Round-trip luxury Range Rover transfer from San José (SJO) or Quepos airport with chilled towels, refreshments, and Wi-Fi.",
      price: 240,
      priceType: "flat_per_stay",
      icon: "fa-car-side"
    },
    {
      id: "spa-ritual-package",
      name: "The Sanctuary Spa Wellness Package",
      desc: "Includes 90-min Forest Flora massage for two, hydrotherapy circuit pass, and organic herbal rejuvenation kit.",
      price: 380,
      priceType: "flat_per_stay",
      icon: "fa-spa"
    },
    {
      id: "late-checkout",
      name: "Guaranteed Late 3:00 PM Checkout",
      desc: "Extend your final day of relaxation with guaranteed late access to your suite and all resort facilities.",
      price: 150,
      priceType: "flat_per_stay",
      icon: "fa-clock"
    },
    {
      id: "sommelier-welcome",
      name: "Sommelier Grand Cru Welcome Amenity",
      desc: "Chilled bottle of Dom Pérignon 2013, wild Oscietra caviar service, and house-made dark chocolate truffles awaiting your arrival.",
      price: 290,
      priceType: "flat_per_stay",
      icon: "fa-wine-bottle"
    }
  ],

  // Dining Venues
  dining: [
    {
      id: "terra",
      name: "Terra",
      subtitle: "Farm-to-Table Gastronomy & Botanical Tasting Menus",
      hours: "Breakfast: 7:00 – 11:00 AM | Dinner: 6:30 – 10:30 PM",
      dressCode: "Resort Elegant",
      chef: "Executive Chef Mateo Varela (Formerly Michelin 3-Star)",
      desc: "Rooted in our on-site 8-acre biodynamic farm, Terra honors the rich terroir of Costa Verde. Every dish is a dialogue between rainforest flora, heritage grains, and sustainably harvested Pacific seafood.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      menuPreview: [
        { name: "Charred Hearts of Palm", desc: "Wild forest mushrooms, lemon verbena emulsion, crispy amaranth", price: "$28", category: "Starters" },
        { name: "Pacific Hamachi Crudo", desc: "Fermented passionfruit dashi, sea buckthorn oil, pickled sea fennel", price: "$34", category: "Starters" },
        { name: "Smoked Wagyu Short Rib", desc: "48-hour slow braise, cassava puree, heirloom cacao jus, wild herbs", price: "$68", category: "Mains" },
        { name: "Wild Line-Caught Sea Bass", desc: "Wrapped in banana leaf, charred coconut fumet, lemongrass, native rice", price: "$56", category: "Mains" },
        { name: "Costa Verde Cacao Sphere", desc: "72% single-origin dark chocolate, smoked vanilla mousse, salted caramel", price: "$22", category: "Desserts" }
      ]
    },
    {
      id: "sol-y-sombra",
      name: "Sol y Sombra",
      subtitle: "Cliffside Crudo Bar & Sunset Mezcal Lounge",
      hours: "Daily 12:00 PM – Midnight",
      dressCode: "Smart Casual",
      chef: "Head Mixologist Sofia Sterling",
      desc: "Suspended over crashing waves with open ocean breezes, Sol y Sombra serves fresh ceviches, fire-grilled skewers, and bespoke artisanal cocktails crafted with native botanicals and rare aged agave spirits.",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
      menuPreview: [
        { name: "Truffle Snapper Ceviche", desc: "Tiger's milk, sweet potato chips, charred corn, white truffle oil", price: "$29", category: "Starters" },
        { name: "Charcoal Grilled Octopus", desc: "Smoked paprika chimichurri, fingerling potatoes, garlic aioli", price: "$38", category: "Mains" },
        { name: "Hibiscus Mezcalita", desc: "Artisanal Oaxacan mezcal, organic hibiscus cordial, lime, volcanic black salt", price: "$22", category: "Cocktails" },
        { name: "The Emerald Canopy", desc: "Botanical gin, cucumber, elderflower, fresh lime, garden mint, sparkling cava", price: "$21", category: "Cocktails" }
      ]
    },
    {
      id: "botanical-greenhouse",
      name: "The Botanical Greenhouse",
      subtitle: "Artisanal Breakfast, Cold-Pressed Elixirs & Afternoon Tea",
      hours: "Daily 6:30 AM – 4:30 PM",
      dressCode: "Casual Resort",
      chef: "Pastry Chef Laurent Mercier",
      desc: "A sunlit glass sanctuary enveloped by rare orchids and living vertical walls. Indulge in cold-pressed elixirs, organic pastries baked fresh every morning, and artisanal afternoon tea service.",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      menuPreview: [
        { name: "Pitaya & Acai Superfood Bowl", desc: "Sprouted hemp granola, wild rainforest honey, edible flowers, kiwi", price: "$22", category: "Breakfast" },
        { name: "Brioche French Toast", desc: "Caramelized plantains, vanilla bean mascarpone, organic maple glaze", price: "$24", category: "Breakfast" },
        { name: "High Tea Botanical Service", desc: "Tiered organic finger sandwiches, warm scones, clotted cream, rare loose leaves", price: "$55", category: "Afternoon Tea" }
      ]
    }
  ],

  // Spa Treatments & Rituals
  spaRituals: [
    {
      id: "forest-flora-massage",
      name: "Forest Flora Aromatherapy Massage",
      duration: "90 Minutes",
      price: "$280",
      category: "Signature Rituals",
      desc: "A sensory immersion using warm essential oils distilled from native ylang-ylang, cedarwood, and wild lemongrass to melt tension and re-align deep muscular rhythms.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "volcanic-clay-glow",
      name: "Volcanic Clay & Cacao Body Polish",
      duration: "120 Minutes",
      price: "$360",
      category: "Body Therapies",
      desc: "Rich antioxidant ritual utilizing mineralized Costa Verde volcanic mud, raw organic cacao scrub, followed by a warm botanical milk bath overlooking the ocean.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "sound-bath-immersion",
      name: "Private Tibetan Sound Bath & Reiki",
      duration: "60 Minutes",
      price: "$190",
      category: "Mind & Energy",
      desc: "Resonant acoustic therapy in our open-air bamboo pavilion utilizing ancient Tibetan singing bowls, gongs, and vibrational frequency attunement.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "couples-sunset-ritual",
      name: "Couples Sunset Hydrothermal Journey",
      duration: "150 Minutes",
      price: "$650",
      category: "Signature Rituals",
      desc: "Private oceanview spa suite experience featuring side-by-side synchronized massages, private herbal sauna, hot hydrotherapy plunge, and chilled champagne with berries.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // Bespoke Experiences
  experiences: [
    {
      id: "private-catamaran-snorkeling",
      name: "Private 54ft Catamaran & Secluded Cove Charter",
      duration: "Half Day (5 Hours)",
      price: "$1,400",
      groupSize: "Up to 8 Guests",
      desc: "Glide across pristine Pacific waters to private coral reef coves. Includes private on-board chef, open champagne bar, paddleboards, and guided snorkeling with sea turtles.",
      image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "rainforest-canopy-helicopter",
      name: "Helicopter Rainforest & Volcano Aerial Expedition",
      duration: "90 Minutes",
      price: "$1,850",
      groupSize: "Up to 4 Guests",
      desc: "Soar above emerald rainforest canopies, dramatic mountain waterfalls, and the smoking caldera of Arenal Volcano with your private pilot and champagne landing.",
      image: "https://images.unsplash.com/photo-1508672019048-805b876b67e2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "botanical-foraging-masterclass",
      name: "Wild Foraging & Masterclass with Executive Chef",
      duration: "3.5 Hours",
      price: "$240 per guest",
      groupSize: "Up to 6 Guests",
      desc: "Explore our 8-acre organic gardens and private forest trails with Chef Mateo, harvesting heirloom ingredients before preparing a 4-course interactive lunch paired with wines.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "starlight-astronomical-dinner",
      name: "Private Beach Starlight Dining & Astronomy",
      duration: "3 Hours",
      price: "$680 for two",
      groupSize: "Couples",
      desc: "A candlelit 5-course barefoot dinner set on our private beach beneath the canopy of stars, guided by a resident astronomer with high-powered telescope observations.",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // Press & Guest Reviews
  testimonials: [
    {
      quote: "Casa Verde redefines ultra-luxury with an intoxicating blend of biophilic architecture and profound ecological harmony. A transformative sanctuary for the soul.",
      author: "Condé Nast Traveler",
      title: "Gold List Award Winner 2026",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The seamless integration of sustainable timber, dramatic cliffside pools, and Michelin-caliber gastronomy sets a new global benchmark in hospitality.",
      author: "Architectural Digest",
      title: "Architectural Excellence Feature",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "Waking up in the Cliffside Villa to the sound of Pacific waves and toucans in the trees was the most peaceful experience of our lives. The butler service is truly world-class.",
      author: "Elena & Marcus Vance",
      title: "Zurich, Switzerland — Verified Guests",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    }
  ],

  // Realistic Initial Seed Bookings (to demonstrate overlap conflict checks!)
  seedBookings: [
    {
      reservationId: "CV-84920",
      roomId: "casita-verde",
      roomName: "Garden Casita Verde",
      checkIn: "2026-09-10",
      checkOut: "2026-09-15",
      nights: 5,
      guests: 2,
      guestName: "Lady Sarah Montgomery",
      guestEmail: "s.montgomery@mayfair-advisors.co.uk",
      guestPhone: "+44 20 7946 0912",
      addOns: ["champagne-breakfast", "airport-transfer"],
      subtotal: 2900,
      tax: 348,
      resortFee: 250,
      addOnsTotal: 690,
      grandTotal: 4188,
      status: "Confirmed",
      bookedAt: "2026-08-10T14:20:00Z"
    },
    {
      reservationId: "CV-91043",
      roomId: "cliffside-ocean-villa",
      roomName: "Cliffside Ocean Villa",
      checkIn: "2026-09-20",
      checkOut: "2026-09-26",
      nights: 6,
      guests: 2,
      guestName: "Julian & Clara Sterling",
      guestEmail: "jsterling@sterlingcapital.com",
      guestPhone: "+1 (212) 555-0199",
      addOns: ["sommelier-welcome", "spa-ritual-package"],
      subtotal: 5520,
      tax: 662.4,
      resortFee: 300,
      addOnsTotal: 670,
      grandTotal: 7152.4,
      status: "Confirmed",
      bookedAt: "2026-08-15T09:12:00Z"
    }
  ]
};
