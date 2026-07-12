/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, ShoppingBag, Eye, Star, Search, ShieldCheck, 
  ChevronLeft, ChevronRight, Sparkles, Award, ArrowRight, Mail, 
  SlidersHorizontal, Check, RefreshCw, X, ShieldAlert, BadgeInfo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Product, Category, Banner, User, AuditLog, 
  ClickAnalytic, SearchAnalytic, WebsiteSettings, OutfitCombination 
} from './types';

import { 
  INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_BANNERS, 
  INITIAL_SETTINGS 
} from './data/initialData';

// Component imports
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ColorMatchStudio from './components/ColorMatchStudio';
import SkinToneGuide from './components/SkinToneGuide';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // --- APPLICATION STATES ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home'); // home, product-detail, color-studio, skin-guide, wishlist, cart, about, privacy, terms, disclosure
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [savedOutfitCombos, setSavedOutfitCombos] = useState<OutfitCombination[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Home Banner Slider state
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Filtering / Sorting states in Storefront
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<string>('featured'); // featured, price-low, price-high, rating

  // --- PERSISTENT SEEDING & INITIALIZATION ---
  useEffect(() => {
    // 1. Theme initialization (Default to dark theme)
    const savedTheme = localStorage.getItem('fm_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 2. Load Core Content (Products, Categories, Banners, Settings)
    const storedProds = localStorage.getItem('fm_products');
    if (storedProds) {
      setProducts(JSON.parse(storedProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('fm_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const storedCats = localStorage.getItem('fm_categories');
    if (storedCats) {
      setCategories(JSON.parse(storedCats));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('fm_categories', JSON.stringify(INITIAL_CATEGORIES));
    }

    const storedBanners = localStorage.getItem('fm_banners');
    if (storedBanners) {
      setBanners(JSON.parse(storedBanners));
    } else {
      setBanners(INITIAL_BANNERS);
      localStorage.setItem('fm_banners', JSON.stringify(INITIAL_BANNERS));
    }

    const storedSettings = localStorage.getItem('fm_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('fm_settings', JSON.stringify(INITIAL_SETTINGS));
    }

    // 3. Load user session
    const activeSession = localStorage.getItem('fm_user_session');
    if (activeSession) {
      const parsedUser = JSON.parse(activeSession);
      if (parsedUser.email.trim().toLowerCase() === 'fahimmd6986@gmail.com') {
        parsedUser.role = 'Admin';
      } else {
        parsedUser.role = 'Customer';
      }
      setCurrentUser(parsedUser);
      localStorage.setItem('fm_user_session', JSON.stringify(parsedUser));
    }

    // 4. Load Wishlist & Cart
    const storedWish = localStorage.getItem('fm_wishlist');
    if (storedWish) setWishlist(JSON.parse(storedWish));

    const storedCombos = localStorage.getItem('fm_saved_combos');
    if (storedCombos) setSavedOutfitCombos(JSON.parse(storedCombos));

    const storedCart = localStorage.getItem('fm_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    // 5. Seed empty Analytics registries if needed
    if (!localStorage.getItem('fm_click_analytics')) {
      localStorage.setItem('fm_click_analytics', JSON.stringify([]));
    }
    if (!localStorage.getItem('fm_search_analytics')) {
      localStorage.setItem('fm_search_analytics', JSON.stringify([]));
    }
    if (!localStorage.getItem('fm_audit_logs')) {
      // Seed first admin creation audit log entry
      const initialLogs: AuditLog[] = [{
        id: 'log_seed',
        userEmail: 'system',
        action: 'SYSTEM_BOOT',
        details: 'FahimMart secure node boot complete. Curation engines fully functional.',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      }];
      localStorage.setItem('fm_audit_logs', JSON.stringify(initialLogs));
    }
  }, []);

  // --- AUTOMATED CAROUSEL TIMER ---
  useEffect(() => {
    const activeBanners = banners.filter(b => b.isActive);
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners]);

  // --- REGISTRY SEARCH LOGGER ---
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const searchLogs: SearchAnalytic[] = JSON.parse(localStorage.getItem('fm_search_analytics') || '[]');
      const existing = searchLogs.find(l => l.query.toLowerCase() === searchQuery.toLowerCase());
      
      if (existing) {
        existing.count += 1;
        existing.lastSearchedAt = new Date().toISOString();
      } else {
        searchLogs.push({
          id: 'search_' + Date.now(),
          query: searchQuery.trim(),
          count: 1,
          lastSearchedAt: new Date().toISOString()
        });
      }
      localStorage.setItem('fm_search_analytics', JSON.stringify(searchLogs));
    }
  }, [searchQuery]);

  // --- ACTIONS & MUTATORS ---
  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fm_theme', 'light');
    }
  };

  const handleLoginSuccess = (user: User) => {
    const finalizedUser = { ...user };
    if (user.email.trim().toLowerCase() === 'fahimmd6986@gmail.com') {
      finalizedUser.role = 'Admin';
    } else {
      finalizedUser.role = 'Customer';
    }
    setCurrentUser(finalizedUser);
    localStorage.setItem('fm_user_session', JSON.stringify(finalizedUser));
  };

  const handleLogout = () => {
    // Log audit
    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    currentLogs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'unknown',
      action: 'USER_LOGOUT',
      details: 'User session terminated manually.',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));

    setCurrentUser(null);
    setIsAdminPanelOpen(false);
    localStorage.removeItem('fm_user_session');
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Click tracking helper for affiliate mapping
  const trackAffiliateRedirect = (product: Product) => {
    const clicks: ClickAnalytic[] = JSON.parse(localStorage.getItem('fm_click_analytics') || '[]');
    const existing = clicks.find(c => c.productId === product.id);

    if (existing) {
      existing.clicks += 1;
      existing.lastClickedAt = new Date().toISOString();
    } else {
      clicks.push({
        id: 'click_' + Date.now(),
        productId: product.id,
        productTitle: product.title,
        clicks: 1,
        lastClickedAt: new Date().toISOString()
      });
    }
    localStorage.setItem('fm_click_analytics', JSON.stringify(clicks));

    // Audit logs entry
    const audits = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    audits.unshift({
      id: 'aud_' + Date.now(),
      userEmail: currentUser?.email || 'Anonymous Guest',
      action: 'AFFILIATE_REDIRECT',
      details: `Redirected to Amazon checkout for item: ${product.title}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(audits));
  };

  // Product CRUD state connectors (linked to Admin panel)
  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('fm_products', JSON.stringify(updated));
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem('fm_products', JSON.stringify(updated));
    if (selectedProduct?.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('fm_products', JSON.stringify(updated));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
      setCurrentPage('home');
    }
  };

  // Categories CRUD state connectors
  const handleAddCategory = (newCat: Category) => {
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('fm_categories', JSON.stringify(updated));
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    const updated = categories.map(c => c.id === updatedCat.id ? updatedCat : c);
    setCategories(updated);
    localStorage.setItem('fm_categories', JSON.stringify(updated));
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updated = categories.filter(c => c.id !== categoryId);
    setCategories(updated);
    localStorage.setItem('fm_categories', JSON.stringify(updated));
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    let updated: Product[];
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      updated = wishlist.filter(p => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem('fm_wishlist', JSON.stringify(updated));
  };

  const handleAddOutfitComboWishlist = (combo: OutfitCombination) => {
    const exists = savedOutfitCombos.some(sc => sc.name === combo.name);
    if (exists) return;
    const updated = [combo, ...savedOutfitCombos];
    setSavedOutfitCombos(updated);
    localStorage.setItem('fm_saved_combos', JSON.stringify(updated));
  };

  const handleRemoveOutfitCombo = (comboId: string) => {
    const updated = savedOutfitCombos.filter(sc => sc.id !== comboId);
    setSavedOutfitCombos(updated);
    localStorage.setItem('fm_saved_combos', JSON.stringify(updated));
  };

  // Cart actions
  const handleToggleCart = (product: Product) => {
    let updated: Product[];
    const exists = cart.some(p => p.id === product.id);
    if (exists) {
      updated = cart.filter(p => p.id !== product.id);
    } else {
      updated = [...cart, product];
    }
    setCart(updated);
    localStorage.setItem('fm_cart', JSON.stringify(updated));
  };

  // --- FILTERED STORE PRODUCTS ---
  const getFilteredStoreProducts = () => {
    let list = [...products];

    // Filter by category slug mapping
    if (selectedCategorySlug) {
      const activeCat = categories.find(c => c.slug === selectedCategorySlug);
      if (activeCat) {
        list = list.filter(p => p.category.toLowerCase() === activeCat.name.toLowerCase());
      }
    }

    // Filter by text search query
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      if (query === 'deals' || query === 'deal') {
        list = list.filter(p => p.isTodayDeal);
      } else {
        list = list.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query)
        );
      }
    }

    // Filter by Brand
    if (selectedBrand !== 'All') {
      list = list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Filter by Max Price
    list = list.filter(p => p.price <= maxPrice);

    // Sorting algorithm
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } // featured default (retains loaded order)

    return list;
  };

  const storeProducts = getFilteredStoreProducts();
  
  // Available unique brands list in store for filter dropdown
  const uniqueBrands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

  const activeBanners = banners.filter(b => b.isActive);
  const currentBanner = activeBanners[currentBannerIdx] || activeBanners[0];

  return (
    <div className={`min-h-screen font-sans dark ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'} transition-colors duration-200`}>
      
      {/* Sticky Header */}
      <Header
        categories={categories}
        products={products}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuthModal}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onSelectCategory={setSelectedCategorySlug}
        onSelectProduct={setSelectedProduct}
        onSetSearchQuery={setSearchQuery}
        wishlistCount={wishlist.length + savedOutfitCombos.length}
        cartCount={cart.length}
        currentSearchQuery={searchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNavigateTo={setCurrentPage}
        currentPage={currentPage}
      />

      {/* --- RENDER VIEW CHANGER --- */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: HOME STOREFRONT */}
        {currentPage === 'home' && !selectedProduct && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Amazon-inspired full-width premium Hero banner rotating slider */}
            {currentBanner && (
              <div id="hero-slider" className="relative h-[480px] w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={currentBanner.imageUrl}
                    alt={currentBanner.title}
                    className="h-full w-full object-cover opacity-35 scale-105 transition-all duration-1000"
                  />
                  {/* Luxury dynamic lighting gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
                </div>

                <div className="absolute inset-x-0 bottom-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-end h-full">
                  <div className="max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-widest uppercase text-amber-400">
                      <Sparkles size={11} /> Smart affiliate curation
                    </span>
                    <h1 className="text-3xl font-black text-white sm:text-5xl font-sans tracking-tight leading-none">
                      {currentBanner.title}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 font-medium">
                      {currentBanner.subtitle}
                    </p>
                    
                    {/* Integrated Search overlay inside Hero */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          const el = document.getElementById('storefront-grid-start');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-lg cursor-pointer"
                      >
                        Shop Curation Now
                      </button>
                      
                      <button
                        onClick={() => {
                          setSearchQuery('deals');
                          const el = document.getElementById('storefront-grid-start');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-850 px-6 py-3 text-xs font-bold text-white transition cursor-pointer"
                      >
                        🔥 Today's Trending Deals
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner controls indicators */}
                {activeBanners.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIdx(idx)}
                        className={`h-2 rounded-full transition-all ${idx === currentBannerIdx ? 'w-6 bg-amber-500' : 'w-2 bg-slate-600 hover:bg-slate-400'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Main store display grid starting */}
            <div id="storefront-grid-start" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category Grid slider list */}
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight">Browse Premium Departments</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Curated high-performance items</p>
                  </div>
                  {selectedCategorySlug && (
                    <button
                      onClick={() => {
                        setSelectedCategorySlug(null);
                        setSearchQuery('');
                      }}
                      className="text-xs font-bold text-amber-500 hover:underline"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-9">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setSearchQuery('');
                        setSelectedProduct(null);
                      }}
                      className={`rounded-2xl border p-4 text-center transition hover:border-amber-400 hover:bg-white hover:shadow-md dark:hover:bg-slate-900 cursor-pointer ${selectedCategorySlug === cat.slug ? 'border-amber-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-amber-500' : 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800'}`}
                    >
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-bold text-xs uppercase">
                        {cat.name.substring(0, 2)}
                      </div>
                      <h4 className="mt-2.5 text-[11px] font-black tracking-tight text-slate-950 dark:text-white truncate">{cat.name}</h4>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Filters & main Products grid division */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 border-t border-slate-100 dark:border-slate-900 pt-8">
                
                {/* Store Filters Left column */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="rounded-2xl bg-white p-5 border border-slate-150 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-1">
                        <SlidersHorizontal size={13} /> Filter Curation
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedBrand('All');
                          setMaxPrice(200000);
                          setSortBy('featured');
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-amber-500"
                      >
                        Reset Filters
                      </button>
                    </div>

                    {/* Filter by Brand */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Filter Brand</label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      >
                        {uniqueBrands.map(br => (
                          <option key={br} value={br}>{br}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filter by Price Range */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        <span>Max Price Limit</span>
                        <span className="font-mono text-amber-500">₹{maxPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="200000"
                        step="5000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:bg-slate-800"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                        <span>₹5,000</span>
                        <span>₹2,00,000</span>
                      </div>
                    </div>

                    {/* Sort Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="featured">Featured Matches</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated (Highest)</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Products Grid list right column */}
                <div className="lg:col-span-9 space-y-6">
                  
                  {/* Results summary header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Showing <span className="font-extrabold text-slate-900 dark:text-white">{storeProducts.length}</span> curated pieces 
                      {selectedCategorySlug && ` in Department: ${selectedCategorySlug}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </div>
                  </div>

                  {/* Amazon-style product card listings */}
                  {storeProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      {storeProducts.map(prod => {
                        const wishlisted = wishlist.some(p => p.id === prod.id);
                        const inCart = cart.some(p => p.id === prod.id);

                        return (
                          <div
                            key={prod.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-150 p-4 shadow-sm hover:shadow-xl hover:border-amber-500 dark:bg-slate-900 dark:border-slate-800 transition duration-300"
                          >
                            {/* Card Image */}
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 mb-3.5">
                              <img
                                referrerPolicy="no-referrer"
                                src={prod.mainImage}
                                alt={prod.title}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              
                              {/* Overlay Wishlist heart */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWishlist(prod);
                                }}
                                className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-600 dark:bg-slate-950/80 cursor-pointer ${wishlisted ? 'text-rose-500' : ''}`}
                              >
                                <Heart size={14} className={wishlisted ? 'fill-rose-500' : ''} />
                              </button>

                              {/* Prime badge overlay */}
                              {prod.isPrime && (
                                <span className="absolute bottom-2 left-2 inline-flex items-center gap-0.5 rounded-xs bg-blue-600 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-xs">
                                  ✓ Prime
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="space-y-1" onClick={() => setSelectedProduct(prod)}>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{prod.brand}</span>
                              <h4 className="font-sans text-xs font-extrabold text-slate-950 dark:text-white truncate group-hover:text-amber-500 cursor-pointer">
                                {prod.title}
                              </h4>

                              {/* Ratings */}
                              <div className="flex items-center gap-1">
                                <span className="flex text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={11} className={i < Math.floor(prod.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-100 dark:text-slate-800'} />
                                  ))}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500">({prod.reviewCount})</span>
                              </div>

                              {/* Pricing */}
                              <div className="pt-1 flex items-baseline gap-1.5">
                                <span className="text-base font-black text-slate-950 dark:text-white font-mono">₹{prod.price.toLocaleString('en-IN')}</span>
                                <span className="text-[11px] text-slate-400 line-through font-mono">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                                <span className="text-[9px] font-extrabold text-rose-500">-{prod.discount}%</span>
                              </div>
                            </div>

                            {/* Actions CTA panel */}
                            <div className="mt-4 pt-3.5 border-t border-slate-50 dark:border-slate-850/60 flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(prod);
                                  setCurrentPage('product-detail');
                                }}
                                className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-150 py-2 text-[10px] font-extrabold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 cursor-pointer"
                              >
                                View Details
                              </button>

                              <button
                                onClick={() => {
                                  trackAffiliateRedirect(prod);
                                  window.open(prod.affiliateUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className="flex-1 rounded-lg bg-amber-500 py-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                              >
                                Buy on Amazon
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 rounded-2xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                      <ShieldAlert size={36} className="mx-auto text-amber-500 mb-3 animate-pulse" />
                      <h4 className="text-sm font-extrabold text-white">No Curations Match Selected Filters</h4>
                      <p className="mt-1 text-xs text-slate-500">Try loosening your brand selectors or max-price slider to view items.</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 2: PRODUCT DETAIL PAGE */}
        {currentPage === 'product-detail' && selectedProduct && (
          <motion.div
            key="product-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="animate-fade-in"
          >
            <ProductDetail
              product={selectedProduct}
              onBack={() => {
                setSelectedProduct(null);
                setCurrentPage('home');
              }}
              onSelectProduct={setSelectedProduct}
              onAddWishlist={handleToggleWishlist}
              onAddCart={handleToggleCart}
              isInWishlist={wishlist.some(p => p.id === selectedProduct.id)}
              isInCart={cart.some(p => p.id === selectedProduct.id)}
              allProducts={products}
              onTrackRedirect={trackAffiliateRedirect}
            />
          </motion.div>
        )}

        {/* VIEW 3: COLOR MATCH STUDIO */}
        {currentPage === 'color-studio' && (
          <motion.div key="color-studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ColorMatchStudio
              products={products}
              onSelectProduct={setSelectedProduct}
              onNavigateTo={setCurrentPage}
              onAddWishlistCombo={handleAddOutfitComboWishlist}
              savedCombos={savedOutfitCombos}
            />
          </motion.div>
        )}

        {/* VIEW 4: SKIN MATCH COMPLEXION GUIDE */}
        {currentPage === 'skin-guide' && (
          <motion.div key="skin-guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkinToneGuide />
          </motion.div>
        )}

        {/* VIEW 5: WISHLIST VIEW */}
        {currentPage === 'wishlist' && (
          <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">My Saved Curation Wishlist</h2>
              <p className="text-xs text-slate-400 mt-1">Products and custom clothing combinations saved for reference.</p>
            </div>

            {/* Curated Products Wishlist */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Curated Products ({wishlist.length})</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                  {wishlist.map(p => (
                    <div key={p.id} className="group rounded-2xl bg-white border border-slate-100 p-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 mb-3">
                        <img referrerPolicy="no-referrer" src={p.mainImage} alt={p.title} className="h-full w-full object-cover" />
                        <button
                          onClick={() => handleToggleWishlist(p)}
                          className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-white text-rose-500 shadow-sm flex items-center justify-center cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-950 dark:text-white truncate group-hover:text-amber-500" onClick={() => { setSelectedProduct(p); setCurrentPage('product-detail'); }}>{p.title}</h4>
                        <p className="text-sm font-black text-amber-500 font-mono mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => {
                          trackAffiliateRedirect(p);
                          window.open(p.affiliateUrl, '_blank');
                        }}
                        className="mt-4 w-full rounded-lg bg-amber-500 py-2 text-center text-[10px] font-black uppercase text-slate-950 hover:bg-amber-400 cursor-pointer"
                      >
                        Buy on Amazon
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-400">
                  Your product wishlist is empty. Browse store curation to save items.
                </div>
              )}
            </div>

            {/* Saved Outfit Combinations Wishlist */}
            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-900">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Saved Custom Outfit combinations ({savedOutfitCombos.length})</h3>
              {savedOutfitCombos.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {savedOutfitCombos.map(combo => (
                    <div key={combo.id} className="rounded-2xl bg-white border border-slate-100 p-5 dark:bg-slate-900 dark:border-slate-800 space-y-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">{combo.occasion}</span>
                          <button
                            onClick={() => handleRemoveOutfitCombo(combo.id)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            title="Remove combination"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <h4 className="font-sans text-xs font-black text-slate-950 dark:text-white mt-2 leading-snug">{combo.name}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 italic">"{combo.description}"</p>
                        
                        <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-[10px] border-t border-slate-50 dark:border-slate-850 pt-2.5">
                          <div>
                            <span className="block text-slate-500 font-bold uppercase tracking-wider text-[8px]">Top Wear</span>
                            <span className="text-slate-800 dark:text-slate-300 font-semibold">{combo.topColor} {combo.topType}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 font-bold uppercase tracking-wider text-[8px]">Bottom Wear</span>
                            <span className="text-slate-800 dark:text-slate-300 font-semibold">{combo.bottomColor} {combo.bottomType}</span>
                          </div>
                          <div>
                            <span className="block text-slate-500 font-bold uppercase tracking-wider text-[8px]">Footwear</span>
                            <span className="text-slate-800 dark:text-slate-300 font-semibold">{combo.shoesColor} {combo.shoesType}</span>
                          </div>
                        </div>
                      </div>

                      {/* Display combo color palette */}
                      <div className="flex h-3 w-full rounded-full overflow-hidden border border-slate-200 dark:border-slate-850 mt-4">
                        {combo.paletteColors.map((col, idx) => (
                          <span key={idx} className="flex-1" style={{ backgroundColor: col }} />
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-400">
                  No custom outfit designs saved yet. Head over to the Color Match Studio!
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 6: SHOPPING CART BAG */}
        {currentPage === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-900 pb-4">
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Shopping Curation Bag</h2>
              <p className="text-xs text-slate-400 mt-1">Your temporary reference checklist for Amazon purchase checkout.</p>
            </div>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* List items columns */}
                <div className="space-y-4 lg:col-span-8">
                  {cart.map(item => (
                    <div key={item.id} className="rounded-2xl bg-white border border-slate-100 p-4 dark:bg-slate-900 dark:border-slate-800 flex gap-4 items-center">
                      <img referrerPolicy="no-referrer" src={item.mainImage} alt={item.title} className="h-16 w-16 rounded-xl object-cover bg-slate-50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-950 dark:text-white truncate cursor-pointer" onClick={() => { setSelectedProduct(item); setCurrentPage('product-detail'); }}>{item.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.brand} • <span className="text-amber-500 font-extrabold">In Stock</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-black text-slate-950 dark:text-white">₹{item.price.toLocaleString('en-IN')}</span>
                        <button
                          onClick={() => handleToggleCart(item)}
                          className="block mt-1.5 text-[10px] font-bold text-rose-500 hover:underline cursor-pointer ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary Sidebar column */}
                <div className="lg:col-span-4">
                  <div className="rounded-2xl bg-white p-5 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Order Summary</h3>
                    
                    <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-50 dark:border-slate-850 pb-3">
                      <div className="flex justify-between">
                        <span>Subtotal Curation</span>
                        <span className="font-mono text-slate-900 dark:text-white font-semibold">
                          ₹{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-500 font-bold">
                        <span>Affiliate discount</span>
                        <span className="font-mono">-₹0.00 (Sync Live)</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs font-black text-slate-950 dark:text-white">
                      <span>Total (INR)</span>
                      <span className="font-mono text-base text-amber-500">
                        ₹{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        // Open the top affiliate URL from cart items as checkout simulator
                        if (cart.length > 0) {
                          trackAffiliateRedirect(cart[0]);
                          window.open(cart[0].affiliateUrl, '_blank');
                        }
                      }}
                      className="w-full rounded-xl bg-amber-500 py-3 text-center text-xs font-black uppercase text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md"
                    >
                      Checkout on Amazon
                    </button>

                    <p className="text-[10px] text-slate-400 leading-relaxed text-center">Checkout operations sync secure partner codes. Your purchase is fulfilled directly on Amazon.com.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <ShoppingBag size={40} className="mx-auto text-amber-400 mb-3" />
                <h4 className="text-sm font-black text-white">Your Shopping Curation Bag is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">Add premium smartphones, headphones or fashion wear to save their specs and links for bulk purchase checkouts.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 7: ABOUT PAGE */}
        {currentPage === 'about' && (
          <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white font-sans tracking-tight">About FahimMart</h2>
            <div className="rounded-2xl bg-white p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-4">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Welcome to FahimMart – Curation of Absolute Smartness, better options, and Verified Amazon Deals.
              </p>
              <p>{settings.aboutText}</p>
              <p>
                Each product is parsed by our quality index team to verify specifications, validate pros and cons, draft comprehensive FAQs, and synchronize actual pricing values. When you click buy, you are safely routed with encoded affiliate tags.
              </p>
              <div className="rounded-xl bg-amber-500/5 p-4 border border-amber-500/10 flex gap-3.5 items-center">
                <div className="h-10 w-10 bg-amber-500 text-slate-950 flex items-center justify-center font-sans font-black rounded-lg">FM</div>
                <div>
                  <p className="font-extrabold text-slate-950 dark:text-white">FahimMart Core Integrity Standard</p>
                  <p className="text-[10px] text-slate-400 leading-none mt-0.5">Continuous automated sitemap feeds and secure roles audits.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 8: PRIVACY SAFEGUARDS */}
        {currentPage === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white font-sans tracking-tight">Privacy Safeguards Policy</h2>
            <div className="rounded-2xl bg-white p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <p>{settings.privacyPolicy}</p>
            </div>
          </motion.div>
        )}

        {/* VIEW 9: TERMS & CONDITIONS */}
        {currentPage === 'terms' && (
          <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white font-sans tracking-tight">Terms & Conditions of Service</h2>
            <div className="rounded-2xl bg-white p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <p>{settings.termsConditions}</p>
            </div>
          </motion.div>
        )}

        {/* VIEW 10: FULL DISCLOSURE */}
        {currentPage === 'disclosure' && (
          <motion.div key="disclosure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl px-4 py-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white font-sans tracking-tight">Associate Affiliate Disclosure</h2>
            <div className="rounded-2xl bg-white p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <p>{settings.affiliateDisclosure}</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- EXQUISITE BRAND TRUST BADGES --- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-b border-slate-100 dark:border-slate-900">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 text-center">
          <div className="space-y-2 p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"><ShieldCheck size={22} /></div>
            <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Secure Curation</h4>
            <p className="text-[11px] text-slate-400">Military role-based credentials. Verified secure links.</p>
          </div>
          <div className="space-y-2 p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"><Award size={22} /></div>
            <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Premium Selection</h4>
            <p className="text-[11px] text-slate-400">Strict spec-checking of tech, audio and outfit combinations.</p>
          </div>
          <div className="space-y-2 p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"><RefreshCw size={22} className="animate-spin-slow" /></div>
            <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Price Sync Index</h4>
            <p className="text-[11px] text-slate-400">Hourly synchronizations with actual Amazon catalogs.</p>
          </div>
          <div className="space-y-2 p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500"><Sparkles size={22} className="animate-pulse" /></div>
            <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Outfit Combiner</h4>
            <p className="text-[11px] text-slate-400">Match styles dynamically according to complexion & season.</p>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-950 dark:text-white font-sans tracking-tight">Join FahimMart VIP Registry</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">Receive immediate alerts when luxury laptops, smartphones or new seasonal outfit palettes hit the curation indices.</p>
        <form onSubmit={(e) => { e.preventDefault(); alert('Successfully subscribed to FahimMart Curation Registry!'); }} className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            required
            placeholder="curator@example.com"
            className="flex-1 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 text-xs text-slate-950 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 text-xs font-extrabold text-slate-950 cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Sticky Affiliate Disclaimer Bar */}
      <div className="sticky bottom-0 z-30 w-full bg-slate-950 text-slate-500 text-[10px] text-center border-t border-slate-900 py-1 px-4 truncate">
        As an Amazon Associate, FahimMart earns from qualifying purchases. Pricing is subject to live modifications on Amazon.in.
      </div>

      {/* Premium Footer */}
      <Footer
        onNavigateTo={setCurrentPage}
        siteName={settings.siteName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        affiliateDisclosure={settings.affiliateDisclosure}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authInitialMode}
      />

      {/* Exclusive Admin Panel Drawer overlay */}
      {isAdminPanelOpen && (
        <AdminPanel
          products={products}
          categories={categories}
          banners={banners}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateBanners={setBanners}
          onUpdateSettings={setSettings}
          settings={settings}
          currentUser={currentUser}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

    </div>
  );
}
