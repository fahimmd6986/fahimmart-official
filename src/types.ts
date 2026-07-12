/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  affiliateUrl: string;
  mainImage: string;
  gallery: string[];
  price: number;
  originalPrice: number;
  discount: number; // percentage e.g., 20 for 20%
  rating: number;
  reviewCount: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specifications: Record<string, string>;
  pros: string[];
  cons: string[];
  faq: FAQItem[];
  slug: string;
  seo: SEOMetadata;
  isPrime: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isTodayDeal?: boolean;
  bestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Lucide icon identifier
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  isActive: boolean;
}

export interface ClickAnalytic {
  id: string;
  productId: string;
  productTitle: string;
  clicks: number;
  lastClickedAt: string;
}

export interface SearchAnalytic {
  id: string;
  query: string;
  count: number;
  lastSearchedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface OutfitCombination {
  id: string;
  name: string;
  occasion: string; // 'Casual', 'Office', 'Wedding', 'Festival', 'College', 'Summer', 'Winter', 'Rainy'
  topType: string; // 'Shirt', 'T-Shirt', 'Kurta', 'Blazer'
  topColor: string;
  bottomType: string; // 'Pant', 'Jeans', 'Pajama', 'Chinos'
  bottomColor: string;
  shoesType: string;
  shoesColor: string;
  accessory?: string;
  watchStyle?: string;
  bagStyle?: string;
  paletteColors: string[]; // Hex codes representing the visual palette
  description: string;
}

export interface SkinToneRecommendation {
  tone: 'Fair' | 'Medium' | 'Wheatish' | 'Dark';
  bestColors: string[]; // names
  bestColorsHex: string[]; // hex codes
  avoidColors: string[];
  outfitIdea: string;
  shoesSuggestion: string;
  accessorySuggestion: string;
}

export interface Order {
  id: string;
  userEmail: string;
  productTitle: string;
  affiliateUrl: string;
  price: number;
  timestamp: string;
  status: 'REDIRECTED';
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  aboutText: string;
  privacyPolicy: string;
  termsConditions: string;
  affiliateDisclosure: string;
  maintenanceMode: boolean;
}
