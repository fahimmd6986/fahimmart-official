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

// Priority 1: Clear all default/mock/fake products. Products are strictly uploaded by the Super Admin.
export const INITIAL_PRODUCTS: Product[] = [];

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
