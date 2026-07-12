/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Banner, OutfitCombination, SkinToneRecommendation, WebsiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', iconName: 'Laptop', description: 'Premium audio, smart displays, and tech gear' },
  { id: '2', name: 'Mobiles', slug: 'mobiles', iconName: 'Smartphone', description: 'Latest standard and luxury smartphones' },
  { id: '3', name: 'Laptops', slug: 'laptops', iconName: 'Monitor', description: 'High performance laptops and computers' },
  { id: '4', name: 'Fashion', slug: 'fashion', iconName: 'Shirt', description: 'Luxury and casual wear for men, women and kids' },
  { id: '5', name: 'Home & Kitchen', slug: 'home-kitchen', iconName: 'Flame', description: 'Smart appliances and luxury cookware' },
  { id: '6', name: 'Beauty', slug: 'beauty', iconName: 'Sparkles', description: 'Skincare, premium cosmetics, and wellness' },
  { id: '7', name: 'Sports', slug: 'sports', iconName: 'Activity', description: 'Fitness gear, sportswear, and active tracking' },
  { id: '8', name: 'Books', slug: 'books', iconName: 'BookOpen', description: 'Bestsellers, tech reads, and educational guides' },
  { id: '9', name: 'Accessories', slug: 'accessories', iconName: 'Watch', description: 'Smartwatches, luxury bags, and premium eyewear' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'X-Gen Quantum Sound Pro Noise Cancelling Headphones',
    brand: 'AcoustiMax',
    category: 'Electronics',
    affiliateUrl: 'https://www.amazon.in/dp/B08HMWX9G4?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ],
    price: 17999.00,
    originalPrice: 24999.00,
    discount: 28,
    rating: 4.8,
    reviewCount: 1420,
    isPrime: true,
    isTrending: true,
    isFeatured: true,
    isTodayDeal: true,
    bestSeller: true,
    shortDescription: 'Enterprise-grade Hybrid Active Noise Cancellation headphones with 60 hours of ultra-low latency playback and immersive spatial audio.',
    fullDescription: 'The AcoustiMax X-Gen Quantum Sound Pro represents the absolute pinnacle of acoustic engineering. Featuring customized dual 40mm bio-cellulose drivers, hybrid ultra-wide-band ANC (reducing external noise by up to 48dB), and high-resolution LDAC support, it delivers high-fidelity sound that breathes life into your favorite albums. Crafted with premium memory foam ear cushions and reinforced carbon fiber headband slides, it guarantees fatigue-free listening for up to 60 continuous hours on a single charge.',
    features: [
      'Industry-leading 48dB Hybrid Active Noise Cancellation with transparency controls',
      'Custom-engineered 40mm Bio-Cellulose dynamic diaphragms for stunning high-res details',
      'Unrivaled battery performance: Up to 60 hours with ANC off, 40 hours with active ANC',
      'Multipoint dual-device pairing with seamless Bluetooth 5.3 auto-handover',
      'Ultra-low-latency Game Mode (under 32ms response rate)'
    ],
    specifications: {
      'Driver Size': '40mm Dynamic bio-cellulose',
      'Frequency Response': '4Hz - 45,000Hz',
      'Impedance': '32 Ohm',
      'Bluetooth Version': 'v5.3 LE Audio Ready',
      'Codec Support': 'LDAC, AAC, SBC, aptX Adaptive',
      'Battery Capacity': '850 mAh lithium-polymer',
      'Weight': '265 grams'
    },
    pros: [
      'Sublime spatial audio accuracy with real-time head tracking simulation',
      'Incredibly plush, sweat-resistant protein leather cushions',
      'Quick Charge: 10 minutes gives 5 hours of playback',
      'Outstanding multi-mic voice clarity during office calls'
    ],
    cons: [
      'Does not include a legacy 6.3mm headphone adapter in the box',
      'Mobile app companion setup is required for advanced multi-band parametric EQ'
    ],
    faq: [
      {
        question: 'Is it fully compatible with both iOS and Android?',
        answer: 'Yes, it works flawlessly with all iOS, Android, macOS, Windows, and Linux devices. The dedicated app is available on both App Store and Google Play Store.'
      },
      {
        question: 'Does active noise cancellation work while wired via AUX?',
        answer: 'Yes, as long as the headphones have battery remaining, ANC can be toggled on even while using the 3.5mm analog wire connection.'
      }
    ],
    slug: 'x-gen-quantum-sound-pro-noise-cancelling-headphones',
    seo: {
      title: 'AcoustiMax X-Gen Quantum Sound Pro ANC Headphones | FahimMart',
      description: 'Buy AcoustiMax X-Gen Quantum Sound Pro Noise Cancelling Headphones. Features 48dB Hybrid ANC, 60h Battery life and custom dual 40mm bio-cellulose drivers.',
      keywords: ['headphones', 'anc', 'noise cancelling', 'acoustimax', 'best audio', 'amazon electronics']
    }
  },
  {
    id: 'p2',
    title: 'FM Titan Elite 5G Premium Smartphone (256GB, Titanium Gray)',
    brand: 'TitanOS',
    category: 'Mobiles',
    affiliateUrl: 'https://www.amazon.in/dp/B0CXF3JSW8?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80'
    ],
    price: 79999.00,
    originalPrice: 94999.00,
    discount: 16,
    rating: 4.9,
    reviewCount: 382,
    isPrime: true,
    isTrending: true,
    isFeatured: true,
    isTodayDeal: false,
    bestSeller: true,
    shortDescription: 'Next-generation smartphone with Grade 5 Titanium construction, 200MP cinematic camera, and Neural Core AI accelerator.',
    fullDescription: 'The Titan Elite 5G is the modern smartphone redefined. Encased in a refined, brushed Grade 5 aerospace titanium alloy shell, it combines unparalleled durability with an elegant, lightweight aesthetic. Boasting a breathtaking 6.8" 120Hz LTPO AMOLED display with 3000 nits peak outdoor brightness, it is powered by the revolutionary Titan Core-X processor. Capture cinematic masterpieces with the 200MP main triple-camera system featuring 10x optical analog zooming and real-time AI image cleanup.',
    features: [
      'Ultra-durable, lightweight aerospace Grade 5 Titanium chassis with premium micro-blasting',
      'Breathtaking 6.8-inch LTPO AMOLED display with dynamic refresh (1Hz - 120Hz) and 3000 nits peak',
      'Pro-grade 200MP + 50MP + 12MP triple-camera matrix with 10x Optical Analog zoom',
      'Large 5200mAh battery with 80W rapid wireless charging support',
      'Advanced Neural Core AI chip for instant system optimization and real-time translator'
    ],
    specifications: {
      'Display Size': '6.8" LTPO Quad HD+ 3200x1440',
      'Processor': 'Titan Core-X (3nm architectural design)',
      'RAM & Storage': '16GB LPDDR5X + 256GB UFS 4.0',
      'Camera Sensor': '200 Megapixel with physical f/1.4 aperture',
      'Operating System': 'TitanOS v4.1 (Clean stock feel, 7 years updates)',
      'Water Rating': 'IP68 Dust & Water resistance certified'
    },
    pros: [
      'Incredibly beautiful, high-contrast display with minimal reflectivity',
      'Titanium construction is exceptionally scratch-resistant',
      'Astonishingly crisp low-light camera captures stars clearly',
      'Extremely premium and tactile in-hand balance'
    ],
    cons: [
      'Charging power block is sold separately to align with eco-conscious standards',
      'No expandable MicroSD card slot provided'
    ],
    faq: [
      {
        question: 'Does this support dual SIM or eSIM?',
        answer: 'It supports dual physical Nano-SIM cards as well as eSIM multi-profile configurations simultaneously.'
      },
      {
        question: 'What are the security features?',
        answer: 'It includes an ultra-fast ultrasonic under-display fingerprint sensor and secure 3D depth-sensing face recognition.'
      }
    ],
    slug: 'titan-elite-5g-premium-smartphone-256gb',
    seo: {
      title: 'Titan Elite 5G Premium Smartphone (256GB) | FahimMart',
      description: 'Browse the Titan Elite 5G Premium Smartphone with Grade 5 Titanium, 200MP pro-camera, 3nm processor, and beautiful 6.8-inch display.',
      keywords: ['smartphone', '5g', 'titanium phone', 'premium mobile', 'fahimmart', 'buy mobiles']
    }
  },
  {
    id: 'p3',
    title: 'FM ApexBook Ultra 16 Slimline Laptop (M3 Pro Equivalent, 32GB/1TB)',
    brand: 'ApexTech',
    category: 'Laptops',
    affiliateUrl: 'https://www.amazon.in/dp/B0CKZPR2GD?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80'
    ],
    price: 135999.00,
    originalPrice: 159999.00,
    discount: 15,
    rating: 4.7,
    reviewCount: 158,
    isPrime: true,
    isTrending: false,
    isFeatured: true,
    isTodayDeal: true,
    bestSeller: false,
    shortDescription: 'Liquid-cooled 16" creator laptop featuring a stunning 3.2K Mini-LED display, 24-hour battery life, and lightweight magnesium-aluminum body.',
    fullDescription: 'The ApexBook Ultra 16 raises the bar for mobile computing. Designed specifically for professional software developers, graphic artists, and video editors, it features an advanced 3.2K (3200x2000) Mini-LED panel with 100% DCI-P3 color reproduction. Inside lies the Apex 10-Core chipset paired with 32GB of unified dual-channel high-speed RAM and a lightning-fast 1TB NVMe PCIe Gen5 SSD. Enjoy completely silent operation thanks to a dual liquid-phase thermal dispersion system, housed in an incredibly thin 14.9mm structural magnesium-aluminum unibody.',
    features: [
      'Stunning 16-inch 3.2K Mini-LED display, 120Hz VRR, 1000 nits sustainable HDR',
      '32GB Ultra-speed LPDDR5X Unified RAM and ultra-capacity 1TB PCIe Gen 5 SSD',
      'Magnesium-aluminum alloy chassis measuring only 14.9mm in thickness',
      'Advanced vapor-chamber liquid-cooling architecture for thermal safety',
      'Legendary battery performance: Up to 24 hours of non-stop offline web surfing'
    ],
    specifications: {
      'Display': '16" Mini-LED, 3.2K Resolution, 120Hz Variable Refresh',
      'Processor': 'Apex 10-Core silicon chip (3nm lithography)',
      'RAM & Storage': '32GB LPDDR5X + 1TB PCIe 5.0 SSD',
      'Ports': '3x Thunderbolt 4, 1x HDMI 2.1, SD Express card reader, 3.5mm jack',
      'Keyboard': 'Tactile backlit chiclet keyboard with 1.5mm actuation depth',
      'Battery Power': '99.9 Wh (Legal limit for air travel transit)'
    },
    pros: [
      'Mini-LED panel yields absolute deep blacks and blinding highlights',
      'Stays absolutely ice cold and silent under intensive compiling runs',
      'Extra-large fluid haptic glass touchpad feels incredibly responsive',
      'Unmatched studio-quality spatial six-speaker array'
    ],
    cons: [
      'Magnesium unibody easily attracts natural oily fingerprints',
      'Slightly heavier than plastic equivalents at 1.82 kg'
    ],
    faq: [
      {
        question: 'Can the internal storage or memory be upgraded?',
        answer: 'The unified memory is integrated directly into the processor architecture for max speed, but the 1TB SSD can be swapped for up to 4TB via the second PCIe expansion slot.'
      },
      {
        question: 'Does it support charging via standard power banks?',
        answer: 'Yes, any Power Delivery (PD 3.0) compliant power bank rated at 65W or higher can charge the ApexBook Ultra 16.'
      }
    ],
    slug: 'apexbook-ultra-16-slimline-laptop',
    seo: {
      title: 'ApexBook Ultra 16 Slimline Creator Laptop | FahimMart',
      description: 'ApexBook Ultra 16 Slimline Laptop with 16" 3.2K Mini-LED display, 32GB unified RAM, 1TB SSD, and magnesium-aluminum unibody.',
      keywords: ['laptop', 'mini-led laptop', 'creator computer', '32gb ram', 'fahimmart', 'amazon laptops']
    }
  },
  {
    id: 'p4',
    title: 'Minimalist Premium Cashmere Knitwear Sweater (Charcoal)',
    brand: 'Nouveau Couture',
    category: 'Fashion',
    affiliateUrl: 'https://www.amazon.in/dp/B07G9G8YWD?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80'
    ],
    price: 7999.00,
    originalPrice: 12499.00,
    discount: 35,
    rating: 4.6,
    reviewCount: 92,
    isPrime: false,
    isTrending: true,
    isFeatured: false,
    isTodayDeal: false,
    bestSeller: false,
    shortDescription: 'Ethically-sourced 100% Grade-A Mongolian cashmere sweater featuring a classic modern crewneck and tailored athletic profile.',
    fullDescription: 'Indulge in unparalleled softness and luxurious comfort with our flagship Charcoal Knitwear Sweater. Handcrafted entirely from ethically sourced, 100% Grade-A Mongolian cashmere, it boasts an incredibly fine 12-gauge knit structure. It is warm yet wonderfully breathable, making it the perfect year-round layering piece. The modern athletic tailored silhouette has been precision-designed to outline the shoulders while maintaining relaxed draping around the torso.',
    features: [
      'Hand-combed 100% pure Grade-A Mongolian cashmere wool',
      'Superior 2-ply long-staple fibers to ensure high anti-pilling longevity',
      'Ultra-fine 12-gauge flat-bed knit stitch detailing',
      'Durable ribbed crewneck collar, cuffs, and flexible hem',
      'Oeko-Tex certified organic chemical-free dyeing process'
    ],
    specifications: {
      'Material Composition': '100% Pure Mongolian Cashmere',
      'Weave Pattern': '12-Gauge classic jersey stitch',
      'Fit Profile': 'Premium tailored smart-casual cut',
      'Care Instructions': 'Hand wash cold or eco-friendly professional dry clean',
      'Source Location': 'Ulaanbaatar, Outer Mongolia'
    },
    pros: [
      'Impossibly soft on bare skin with zero itchiness',
      'Regulates temperature dynamically—comfortable in spring or deep winter',
      'Sophisticated charcoal color fits both casual and office formal styles'
    ],
    cons: [
      'Requires delicate flat drying to maintain structural shape',
      'Prone to friction pilling if paired with abrasive interior jacket liners'
    ],
    faq: [
      {
        question: 'Does this run true to standard US clothing sizes?',
        answer: 'Yes, it features a contemporary athletic fit. If you prefer a relaxed, oversized look, we recommend sizing up one level.'
      },
      {
        question: 'How do I prevent the cashmere from pilling?',
        answer: 'We recommend washing inside out and using a standard cashmere comb gently once per season to refresh the surface.'
      }
    ],
    slug: 'minimalist-premium-cashmere-knitwear-sweater-charcoal',
    seo: {
      title: 'Premium Charcoal Cashmere Knitwear Sweater | FahimMart',
      description: 'Elegant Cashmere Knitwear Sweater in Charcoal. Ethically-sourced 100% Mongolian cashmere. Luxuriously soft, classic crewneck fit.',
      keywords: ['cashmere', 'sweater', 'luxury clothing', 'charcoal knitwear', 'fahimmart fashion']
    }
  },
  {
    id: 'p5',
    title: 'Sartorial Double-Breasted Wool Blazer (Navy Blue)',
    brand: 'Nouveau Couture',
    category: 'Fashion',
    affiliateUrl: 'https://www.amazon.in/dp/B079D9CH34?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'
    ],
    price: 11999.00,
    originalPrice: 18999.00,
    discount: 37,
    rating: 4.8,
    reviewCount: 46,
    isPrime: false,
    isTrending: false,
    isFeatured: true,
    isTodayDeal: false,
    bestSeller: true,
    shortDescription: 'An elegant, Italian-cut double-breasted navy blazer made of lightweight Tasmanian merino wool, detailed with luxury brass buttons.',
    fullDescription: 'Command presence in any room with this masterclass in sartorial tailoring. Structured with a lightweight canvas construction, it is hand-stitched from ultra-fine Tasmanian Merino wool for a rich drape and natural resilience against creasing. Styled with a classic double-breasted 6-on-2 button configuration, sleek peak lapels, double back vents, and genuine brushed brass buttons, it is an essential piece for high-end office wear and formal events.',
    features: [
      '100% Tasmanian Virgin Merino Wool, super-120s count',
      'Italian tailored silhouette with a modern soft-padded shoulder design',
      'Double-breasted front with 6 brass crest buttons and peak lapels',
      'Double vented back to facilitate comfort during movement',
      'Fully lined with breathable, sweat-wicking Bemberg cupro fabric'
    ],
    specifications: {
      'Shell Material': 'Tasmanian Virgin Merino Wool',
      'Lapel Profile': '10cm Wide peak lapel details',
      'Lining Composition': '100% Cupro Silk',
      'Style Cut': 'Double-Breasted (Classic 6-on-2 configuration)',
      'Dry Cleaning': 'Strictly dry clean only'
    },
    pros: [
      'Spectacular structural contouring creates a powerful, trim shoulder profile',
      'Extremely premium hand feel with a delicate natural luster',
      'Pairs brilliantly with grey wool flannels, chinos, or raw dark denim'
    ],
    cons: [
      'Pockets arrive tacked closed to maintain structure; requires careful snipping before use',
      'Slim-fit armholes may feel snug if you have highly muscular shoulders'
    ],
    faq: [
      {
        question: 'Are the buttons easily replaceable if I prefer plastic?',
        answer: 'Yes, the brass buttons are secured with premium silk threads, easily swappable by any local tailor.'
      }
    ],
    slug: 'sartorial-double-breasted-wool-blazer-navy-blue',
    seo: {
      title: 'Sartorial Navy Blue Double-Breasted Blazer | FahimMart',
      description: 'Shop the Sartorial Double-Breasted Wool Blazer in Navy Blue. Super-120s Tasmanian Merino Wool, Italian cut with classic brass crest buttons.',
      keywords: ['blazer', 'double breasted', 'wool blazer', 'navy jacket', 'men formal wear', 'fahimmart']
    }
  },
  {
    id: 'p6',
    title: 'Elite Smart Fitness Tracker Watch (Carbon Black, GPS)',
    brand: 'ActiveGear',
    category: 'Accessories',
    affiliateUrl: 'https://www.amazon.in/dp/B09G96TFFG?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80'
    ],
    price: 15999.00,
    originalPrice: 19999.00,
    discount: 20,
    rating: 4.5,
    reviewCount: 308,
    isPrime: true,
    isTrending: true,
    isFeatured: false,
    isTodayDeal: true,
    bestSeller: false,
    shortDescription: 'All-weather sports smartwatch with dual-frequency GPS navigation, sapphire glass face, and continuous biometric VO2 Max monitoring.',
    fullDescription: 'The ActiveGear Elite Tracker is built for athletes who demand bulletproof accuracy and rugged reliability. Shelled in a carbon-fiber reinforced case with a scratchproof sapphire crystal glass face, it survives drops, knocks, and ocean dives up to 100 meters. Featuring class-leading dual-frequency multi-satellite GPS, it charts complex off-grid trails with topographical mapping. Monitored by the advanced BioPulse sensor array, it outputs professional statistics on heart rate variability, sleep quality, and VO2 Max metrics.',
    features: [
      'Reinforced carbon fiber polymer chassis with matte black finish',
      'Genuine scratchproof Sapphire Crystal Glass cover over screen',
      'Precision Dual-Frequency GPS supporting GPS, GLONASS, Galileo, and BeiDou',
      'Military Standard 810G rated for thermal, shock, and 100m water immersion',
      'Outstanding 14-day battery life in smart mode, 36 hours continuous GPS tracking'
    ],
    specifications: {
      'Waterproof Rating': '10 ATM (100 meters / 330 feet depth)',
      'Display Screen': '1.4" Transflective memory-in-pixel sunlight-visible',
      'Bezel Material': 'Titanium alloy protective ring',
      'Connectivity': 'Bluetooth 5.2, Wi-Fi 2.4GHz, ANT+ compatibility',
      'Weight': '52 grams with silicone band'
    },
    pros: [
      'Breathtaking readability under blinding outdoor sunshine',
      'GPS acquires connection in under 5 seconds',
      'Syncs seamlessly with Strava, Apple Health, and Android Fit'
    ],
    cons: [
      'Display has conservative colors compared to AMOLED fitness screens',
      'Requires separate chest strap for medical-grade ECG details'
    ],
    faq: [
      {
        question: 'Can I reply to text messages from the watch screen?',
        answer: 'You can reply with pre-set quick responses when paired with an Android smartphone. iOS devices only support text notifications.'
      }
    ],
    slug: 'elite-smart-fitness-tracker-watch-carbon-black',
    seo: {
      title: 'Elite Smart GPS Fitness Tracker Watch | FahimMart',
      description: 'ActiveGear Elite Smart Fitness Tracker Watch. Features Carbon Black finish, dual-frequency GPS, Sapphire glass, 10 ATM waterproof and 14-day battery.',
      keywords: ['smartwatch', 'fitness tracker', 'gps watch', 'activegear', 'fahimmart accessories']
    }
  },
  {
    id: 'p7',
    title: 'KitchenMaster Multi-Oven Smart Air Fryer (8-in-1)',
    brand: 'KitchenMaster',
    category: 'Home & Kitchen',
    affiliateUrl: 'https://www.amazon.in/dp/B08G9972LY?tag=fahimmart-21',
    mainImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80'
    ],
    price: 9999.00,
    originalPrice: 14999.00,
    discount: 33,
    rating: 4.7,
    reviewCount: 2104,
    isPrime: true,
    isTrending: false,
    isFeatured: true,
    isTodayDeal: true,
    bestSeller: true,
    shortDescription: 'High-speed cyclonic 8-in-1 convection air fryer, grill and dehydrator with a double-view insulated glass door and 6-quart capacity.',
    fullDescription: 'Say goodbye to long preheating times and excessive cooking oil. The KitchenMaster Smart Air Fryer utilizes 1700W of Turbo Cyclonic hot air distribution to cook your meals up to 40% faster while slashing oil content by 85%. Features 8 smart programs: air fry, roast, bake, broil, dehydrate, reheat, toast, and grill. Designed with a gorgeous, high-contrast digital glass touchscreen, a dual-layer insulated glass viewing door, and an easy-clean non-stick dishwasher-safe ceramic basket.',
    features: [
      '1700W Cyclonic heat vortex system cooks rapidly without oil',
      '8 One-Touch programs on an elegant black digital tempered glass screen',
      'Double-pane thermal insulated viewing door with interior warm light',
      'Generous 6-quart non-stick ceramic basket (cooks up to a 5lb chicken)',
      'Auto-off safety sensor when the basket is pulled mid-cycle'
    ],
    specifications: {
      'Power Wattage': '1700 Watts convection power',
      'Temperature Range': '90°F - 450°F (32°C - 232°C)',
      'Dehydrator Mode': 'Low temperature fan-assisted 90°F - 150°F',
      'Basket Material': 'Teflon-free ceramic non-stick layer',
      'Dimensions': '11.8" x 12.2" x 13.5"'
    },
    pros: [
      'Crisps frozen fries and chicken wings perfectly with zero grease',
      'Extremely quiet fan motor (measures under 42dB)',
      'Saves tremendous kitchen countertop space'
    ],
    cons: [
      'Power cord is relatively short (3 feet) for kitchen safety standards',
      'First-time use can release a harmless cosmetic protective coating smell'
    ],
    faq: [
      {
        question: 'Does the exterior of the fryer get hot to touch?',
        answer: 'The side panels stay cool thanks to double-wall insulation, but we recommend leaving at least 5 inches of ventilation space at the rear exhaust.'
      }
    ],
    slug: 'kitchenmaster-multi-oven-smart-air-fryer-6qt',
    seo: {
      title: 'KitchenMaster 8-in-1 Smart Air Fryer 6-Quart | FahimMart',
      description: 'KitchenMaster Smart Air Fryer convection oven. 8-in-1 pre-sets, cyclonic hot air, 6qt capacity, ceramic non-stick coating. Save 33%.',
      keywords: ['air fryer', 'kitchen appliance', 'healthy cooking', 'kitchenmaster', 'fahimmart kitchen']
    }
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    title: 'Unrivaled Luxury Shopping Deals',
    subtitle: 'Step into a world of curated style, high-end electronics, and smart choices. Hand-picked Amazon Affiliates.',
    linkUrl: '#products',
    isActive: true
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    title: 'Futuristic Elite Tech Launch',
    subtitle: 'Discover premium smartphones, ultra-slim creator laptops, and biometric wear built for the future.',
    linkUrl: '#category-electronics',
    isActive: true
  },
  {
    id: 'b3',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    title: 'Sartorial Collection Color Studio',
    subtitle: 'Find clothing color combinations matching your personal style and skin tone. More than 1000 premium selections.',
    linkUrl: '#color-studio',
    isActive: true
  }
];

export const INITIAL_COMBINATIONS: OutfitCombination[] = [
  {
    id: 'c1',
    name: 'Monochromatic Executive Signature',
    occasion: 'Office Wear',
    topType: 'Shirt',
    topColor: 'Brilliant White',
    bottomType: 'Pant',
    bottomColor: 'Charcoal Grey',
    shoesType: 'Oxfords',
    shoesColor: 'Oxblood Red',
    accessory: 'Silk Patterned Necktie',
    watchStyle: 'Silver Case with Black Leather Strap',
    bagStyle: 'Sleek Tan Leather Briefcase',
    paletteColors: ['#FFFFFF', '#4B5563', '#4C1D95', '#D97706'],
    description: 'The golden standard of executive boardroom tailoring. High-contrast white shirt perfectly counters professional charcoal wool pants, accented by oxblood leather shoes for a rich punch of modern visual luxury.'
  },
  {
    id: 'c2',
    name: 'Sartorial Navy Blue Contrast',
    occasion: 'Office Wear',
    topType: 'Blazer',
    topColor: 'Deep Navy Blue',
    bottomType: 'Chinos',
    bottomColor: 'Warm Khaki / Beige',
    shoesType: 'Loafers',
    shoesColor: 'Rich Chocolate Brown',
    accessory: 'Brushed Brass Crest Buttons',
    watchStyle: 'Rose Gold Case with Dark Brown Leather Strap',
    bagStyle: 'Textured Brown Suede Messenger',
    paletteColors: ['#1E3A8A', '#F59E0B', '#78350F', '#F472B6'],
    description: 'A timeless Italian-inspired look. The structured navy double-breasted blazer creates power contours, harmoniously balanced by comfortable beige chinos. Ideal for client consultations and creative corporate meetings.'
  },
  {
    id: 'c3',
    name: 'Modern Streetwear Indigo Combo',
    occasion: 'Casual Wear',
    topType: 'T-Shirt',
    topColor: 'Heather Charcoal',
    bottomType: 'Jeans',
    bottomColor: 'Deep Indigo Raw Denim',
    shoesType: 'Retro Sneakers',
    shoesColor: 'Off-White Canvas',
    accessory: 'Minimalist Titanium Ring',
    watchStyle: 'All-Black Tactical Sportwatch',
    bagStyle: 'Cordura Nylon Utility Backpack',
    paletteColors: ['#374151', '#1E1B4B', '#F9FAFB', '#0369A1'],
    description: 'Relaxed, durable, and highly stylish. Raw indigo selvedge denim pairs with an organic heather grey t-shirt, tied together by minimalist off-white retro trainers for a clean, non-pretentious city look.'
  },
  {
    id: 'c4',
    name: 'Royal Heritage Festive Kurta',
    occasion: 'Festival Wear',
    topType: 'Kurta',
    topColor: 'Deep Royal Crimson / Ruby Red',
    bottomType: 'Pajama',
    bottomColor: 'Lustrous Ivory Cream',
    shoesType: 'Mojaris / Peshawari Sandals',
    shoesColor: 'Intricate Gold Embroidery Tan',
    accessory: 'Crushed Silk Dupatta Stole',
    watchStyle: 'Vintage Gold Dress Watch',
    bagStyle: 'Embroidered Velvet Clutch Bag',
    paletteColors: ['#991B1B', '#FEF3C7', '#B45309', '#FBBF24'],
    description: 'Perfect for religious celebrations, cultural festivals and family banquets. Crimson red stands beautifully against silk cream pajamas, completed by gold-accented Peshawari sandals.'
  },
  {
    id: 'c5',
    name: 'Winter Cabin Layered Aesthetic',
    occasion: 'Winter Collection',
    topType: 'Sweater',
    topColor: 'Forest Green Heavy Knit',
    bottomType: 'Jeans',
    bottomColor: 'Washed Matte Black Denim',
    shoesType: 'Chelsea Boots',
    shoesColor: 'Sand Taupe Suede',
    accessory: 'Merino Wool Oatmeal Scarf',
    watchStyle: 'Bronze Case with Olive Canvas Band',
    bagStyle: 'Waxed Canvas Duffle Bag',
    paletteColors: ['#064E3B', '#111827', '#D1FAE5', '#F59E0B'],
    description: 'Warmth meets modern outdoor luxury. The chunky forest green knitwear sweater acts as a powerful seasonal anchor over black jeans, rounded off with classic sand-colored suede Chelsea boots.'
  },
  {
    id: 'c6',
    name: 'Summer Linen Breeze',
    occasion: 'Summer Collection',
    topType: 'Shirt',
    topColor: 'Pastel Sky Blue Linen',
    bottomType: 'Chinos',
    bottomColor: 'Bright Ivory White',
    shoesType: 'Espadrilles',
    shoesColor: 'Beige Canvas',
    accessory: 'Acetate Tortoiseshell Sunglasses',
    watchStyle: 'Mesh Steel Band Sport Chrono',
    bagStyle: 'Woven Straw Tote Bag',
    paletteColors: ['#E0F2FE', '#FFFFFF', '#FEF3C7', '#0284C7'],
    description: 'Crisp, lightweight, and engineered for high heat. A breathable sky blue linen shirt keeps you ventilated, paired with clean white chinos and traditional jute espadrilles for resort-like elegance.'
  }
];

export const INITIAL_SKIN_TONES: SkinToneRecommendation[] = [
  {
    tone: 'Fair',
    bestColors: ['Emerald Green', 'Deep Royal Blue', 'Burgundy Wine', 'Navy Blue', 'Charcoal', 'Soft Lavender', 'Pastel Rose'],
    bestColorsHex: ['#047857', '#1D4ED8', '#881337', '#1E3A8A', '#374151', '#C084FC', '#F472B6'],
    avoidColors: ['Blinding Neon Yellow', 'Pale Mustard', 'Faded Washed Beige', 'Undertoned Lime'],
    outfitIdea: 'Pair an Emerald Green structured blazer over a crisp Brilliant White crewneck and slim Charcoal trousers. Accent with dark silver watches and premium polished black loafers.',
    shoesSuggestion: 'Polished Black Oxfords, Rich Dark Burgundy Derby Shoes, or minimalist Off-White Leather Sneakers.',
    accessorySuggestion: 'Silver chronographs, cool-toned platinum cuff links, and classic black titanium-rimmed aviator frames.',
    watchSuggestion: 'Silver link metal strap watches with obsidian black or ice blue watch faces.'
  } as any,
  {
    tone: 'Medium',
    bestColors: ['Olive Green', 'Rich Terracotta', 'Warm Mustard', 'Dusty Lavender', 'Royal Indigo', 'Sage', 'Teal Blue'],
    bestColorsHex: ['#3F6212', '#9A3412', '#D97706', '#A78BFA', '#312E81', '#14B8A6', '#0891B2'],
    avoidColors: ['Extremely cold icy blues', 'Dull faded greys that wash out mid-tones'],
    outfitIdea: 'An Olive Green button-down linen shirt layered unbuttoned over a heather grey tank, paired with tailored sand chinos. Complete the look with light beige suede Chelsea boots.',
    shoesSuggestion: 'Sand Suede Chelsea Boots, Warm Oak Loafers, or Camel-tone leather driving shoes.',
    accessorySuggestion: 'Dual-tone metal watch bands, antique bronze rings, and dark tortoiseshell sunglasses.',
    watchSuggestion: 'Dual-tone gold and steel mesh bands or tan leather straps.'
  } as any,
  {
    tone: 'Wheatish',
    bestColors: ['Warm Saffron', 'Rich Navy Blue', 'Muted Olive', 'Rust Brown', 'Wine Crimson', 'Teal', 'Ivory Cream'],
    bestColorsHex: ['#EA580C', '#1E3A8A', '#166534', '#C2410C', '#9F1239', '#0F766E', '#FFFBEB'],
    avoidColors: ['Very bright neons', 'Dull faded beige matching skin hue exactly'],
    outfitIdea: 'A gorgeous Wine Crimson fitted Kurta with crisp ivory silk pajamas, paired with masterfully embroidered Peshawari sandals in warm tan.',
    shoesSuggestion: 'Rich Chocolate brown double-monk straps, embroidered Peshawari sandals, or Tan suede loafers.',
    accessorySuggestion: 'Rose gold analog watch casings, brown braided leather cuffs, and golden-rimmed spectacles.',
    watchSuggestion: 'Rose gold dials with premium dark chocolate textured leather straps.'
  } as any,
  {
    tone: 'Dark',
    bestColors: ['Dazzling Mustard Yellow', 'Crimson Red', 'Cobalt Blue', 'Ivory White', 'Mint Green', 'Warm Orange', 'Gold Accent'],
    bestColorsHex: ['#F59E0B', '#DC2626', '#2563EB', '#F9FAFB', '#34D399', '#F97316', '#FBBF24'],
    avoidColors: ['Saturated dark muddy browns', 'Dull charcoal greys that lack contrast'],
    outfitIdea: 'A pristine Ivory White linen casual shirt paired with vibrant Cobalt Blue chinos. Accentuate with high-quality gold accessories and light sand espadrilles.',
    shoesSuggestion: 'Vibrant White canvas retro trainers, tan leather driving shoes, or light tan suede loafers.',
    accessorySuggestion: 'High-contrast 24k gold-plated chains, bright yellow-gold watch casings, and clear frame specs.',
    watchSuggestion: 'Gleaming yellow-gold case with dark navy dials or textured black silicone athletic bands.'
  } as any
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  siteName: 'FahimMart',
  tagline: 'Smart Shopping. Better Choices. Trusted Amazon Deals.',
  contactEmail: 'fahimmd6986@gmail.com',
  contactPhone: '+91 (800) 555-3632',
  aboutText: 'FahimMart is an ultra-premium, high-speed affiliate shopping platform dedicated to showcasing the absolute finest, top-rated products on Amazon India. Our mission is to combine luxury visual design, absolute digital security, and smart features like the Color Match Studio to provide a shopping journey that is beautiful, modern, and exceptionally fast.',
  privacyPolicy: 'Your privacy is of critical importance to us. FahimMart does not sell, lease, or distribute user account profiles to third-party entities. We collect standard telemetry and registration metadata strictly to secure your account and personalize your fashion profile.',
  termsConditions: 'By utilizing FahimMart, you acknowledge that all visual curation links redirect to Amazon.in. As an Amazon Associate, FahimMart earns from qualifying purchases. Product prices, shipping schedules, and warranties are governed strictly by Amazon policies.',
  affiliateDisclosure: 'FahimMart is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in. All prices and specifications are synchronized with live Amazon India offerings, subject to real-time adjustments.',
  maintenanceMode: false
};
