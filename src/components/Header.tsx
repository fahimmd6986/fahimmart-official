/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Mic, Heart, ShoppingBag, User as UserIcon, LogOut, 
  Menu, X, Sun, Moon, Bell, ChevronDown, Award, Sparkles, Check
} from 'lucide-react';
import { User, Category, Product } from '../types';

interface HeaderProps {
  categories: Category[];
  products: Product[];
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categorySlug: string | null) => void;
  onSelectProduct: (product: Product | null) => void;
  onSetSearchQuery: (query: string) => void;
  wishlistCount: number;
  cartCount: number;
  currentSearchQuery: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateTo: (page: string) => void;
  currentPage: string;
}

export default function Header({
  categories,
  products,
  currentUser,
  onLogout,
  onOpenAuth,
  onOpenAdmin,
  onSelectCategory,
  onSelectProduct,
  onSetSearchQuery,
  wishlistCount,
  cartCount,
  currentSearchQuery,
  isDarkMode,
  onToggleDarkMode,
  onNavigateTo,
  currentPage
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState(currentSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Synchronize internal search input with outer search query
  useEffect(() => {
    setSearchInput(currentSearchQuery);
  }, [currentSearchQuery]);

  // Handle autocomplete search suggestions
  useEffect(() => {
    if (searchInput.trim().length > 1) {
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.category.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchInput, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetSearchQuery(searchInput);
    onSelectProduct(null);
    onSelectCategory(null);
    onNavigateTo('home');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product: Product) => {
    onSelectProduct(product);
    onSetSearchQuery(product.title);
    setSearchInput(product.title);
    setShowSuggestions(false);
    onNavigateTo('product-detail');
  };

  // Simulate voice search
  const triggerVoiceSearchSim = () => {
    setIsVoiceActive(true);
    setVoiceText('Listening...');
    
    const phrases = ['Quantum Sound Headphones', 'Titan Elite 5G Phone', 'Air Fryer', 'Premium Cashmere'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    setTimeout(() => {
      setVoiceText(`"${randomPhrase}"`);
    }, 1200);

    setTimeout(() => {
      setSearchInput(randomPhrase);
      onSetSearchQuery(randomPhrase);
      onSelectProduct(null);
      onSelectCategory(null);
      onNavigateTo('home');
      setIsVoiceActive(false);
    }, 2400);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 text-white shadow-xl">
      {/* Dynamic Voice Search overlay popup */}
      {isVoiceActive && (
        <div id="voice-overlay" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 text-white backdrop-blur-xs">
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-4 rounded-full bg-amber-500/30 animate-ping" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl">
              <Mic size={40} className="animate-pulse" />
            </div>
            <p className="mt-8 text-xl font-bold tracking-wider font-sans text-amber-400">{voiceText}</p>
            <p className="mt-2 text-sm text-slate-400">Speak now or wait for FahimMart Smart Voice Index...</p>
            <button 
              onClick={() => setIsVoiceActive(false)}
              className="mt-8 rounded-full border border-slate-700 bg-slate-900 px-6 py-2 text-xs font-semibold tracking-wide hover:bg-slate-800"
            >
              Cancel Voice
            </button>
          </div>
        </div>
      )}

      {/* Brand & Top Header line */}
      <div className="border-b border-slate-900 bg-slate-950 px-4 py-1 text-center text-[10px] md:text-xs text-slate-400 font-medium tracking-wide">
        <span className="text-amber-400 font-bold">FahimMart VIP:</span> Smart Shopping. Better Choices. <span className="text-amber-400">★ Trusted Amazon affiliate curator</span>. Fast Global Referrals.
      </div>

      {/* Main Header Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            id="fahimmart-logo-container"
            onClick={() => {
              onSelectCategory(null);
              onSelectProduct(null);
              onSetSearchQuery('');
              onNavigateTo('home');
            }} 
            className="flex shrink-0 cursor-pointer items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 font-sans text-base font-black text-slate-950 shadow-lg ring-2 ring-amber-400/50 relative overflow-hidden group">
              <span className="relative z-10 font-black tracking-tighter">FM</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
            <div className="flex flex-col">
              <span className="block font-sans text-lg sm:text-xl font-black tracking-tight text-white leading-none">
                FAHIM<span className="text-amber-400">MART</span>
              </span>
              <span className="mt-1 block text-[8px] sm:text-[9px] font-extrabold tracking-[0.2em] text-amber-400/85 uppercase leading-none">
                PREMIUM CURATOR
              </span>
            </div>
          </div>

          {/* Smart Search Bar with autocomplete and simulated voice */}
          <div className="relative hidden flex-1 max-w-2xl md:block">
            <form onSubmit={handleSearchSubmit} className="flex">
              <select
                id="search-category-dropdown"
                onChange={(e) => {
                  const val = e.target.value;
                  onSelectCategory(val === 'all' ? null : val);
                  onSelectProduct(null);
                  onNavigateTo('home');
                }}
                className="rounded-l-lg border-r border-slate-800 bg-slate-900 px-3 text-xs text-slate-300 font-medium outline-none hover:bg-slate-850 cursor-pointer"
              >
                <option value="all">All Departments</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>

              <div className="relative flex-1">
                <input
                  id="smart-search-input"
                  type="text"
                  placeholder="Search over 1,000+ trusted premium products..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-slate-900 py-2.5 pl-4 pr-12 text-sm text-white placeholder-slate-500 outline-none focus:bg-slate-850 focus:ring-1 focus:ring-amber-400"
                />
                
                {/* Voice search mic button */}
                <button
                  id="voice-search-mic"
                  type="button"
                  onClick={triggerVoiceSearchSim}
                  className="absolute inset-y-0 right-12 flex items-center pr-3 text-slate-400 hover:text-amber-400 cursor-pointer"
                  title="Search with Voice Assistant"
                >
                  <Mic size={16} />
                </button>
              </div>

              <button
                id="search-submit-button"
                type="submit"
                className="rounded-r-lg bg-amber-500 px-5 text-slate-950 font-bold hover:bg-amber-400 transition-colors duration-200 cursor-pointer"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Auto Suggestions list dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                id="search-suggestions-dropdown" 
                className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-lg bg-slate-900 border border-slate-800 p-2 shadow-2xl"
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Suggested products</div>
                {suggestions.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSuggestionClick(p)}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2.5 hover:bg-slate-800 transition-all duration-150"
                  >
                    <img 
                      referrerPolicy="no-referrer"
                      src={p.mainImage} 
                      alt={p.title} 
                      className="h-8 w-8 rounded-md object-cover bg-slate-800"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-xs font-semibold text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-400">{p.brand} • <span className="text-amber-400">${p.price.toFixed(2)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls & Nav actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={onToggleDarkMode}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-all duration-200 cursor-pointer"
              title={isDarkMode ? 'Switch to Midnight Charcoal theme' : 'Switch to Cosmic Onyx theme'}
            >
              {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Notifications panel with realistic popdown */}
            <div className="relative">
              <button
                id="notifications-button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-all duration-200 cursor-pointer"
              >
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
              {showNotifications && (
                <div id="notifications-dropdown" className="absolute right-0 mt-2.5 w-72 rounded-xl bg-slate-900 border border-slate-800 p-3 shadow-2xl z-50 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-semibold">
                    <span>FahimMart Alerts</span>
                    <span className="text-[9px] text-amber-400 tracking-wide uppercase font-bold">New Offer</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-slate-950 p-2 border-l-2 border-amber-500">
                      <p className="font-bold text-white">🔥 Titan Elite In Stock!</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">The titanium powerhouse phone has arrived. Read exclusive spec breakdown.</p>
                    </div>
                    <div className="rounded-lg bg-slate-950 p-2 border-l-2 border-emerald-500">
                      <p className="font-bold text-white">✨ Color Match Sync Online</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Choose your seasonal clothing matches seamlessly in our dynamic studio.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              id="header-wishlist-button"
              onClick={() => {
                onNavigateTo('wishlist');
              }}
              className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-all duration-200 cursor-pointer"
              title="View Wishlist"
            >
              <Heart size={19} className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-extrabold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              id="header-cart-button"
              onClick={() => onNavigateTo('cart')}
              className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-all duration-200 cursor-pointer"
              title="Cart items"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-extrabold text-slate-950">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Session Profile details */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[9px] text-slate-400 capitalize">{currentUser.role} Account</div>
                </div>
                
                {/* Profile Actions dropdown */}
                <div className="group relative">
                  <button 
                    id="profile-dropdown-btn"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 border border-slate-850 hover:border-amber-400 text-amber-400 transition-all"
                  >
                    <UserIcon size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 text-xs">
                    <div className="border-b border-slate-800 p-2 text-[10px] text-slate-400">
                      Signed in as:<br />
                      <span className="font-bold text-white truncate block">{currentUser.email}</span>
                    </div>

                    {/* Exquisite Owner Admin Dashboard Access */}
                    {currentUser.role === 'Admin' && (
                      <button
                        id="admin-dashboard-link"
                        onClick={onOpenAdmin}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-amber-400 hover:bg-slate-850"
                      >
                        <Award size={14} /> Owner Dashboard
                      </button>
                    )}

                    <button
                      id="view-wishlist-dropdown-link"
                      onClick={() => onNavigateTo('wishlist')}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-300 hover:bg-slate-850"
                    >
                      <Heart size={14} /> My Wishlist
                    </button>

                    <button
                      id="view-color-studio-dropdown-link"
                      onClick={() => onNavigateTo('color-studio')}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-300 hover:bg-slate-850"
                    >
                      <Sparkles size={14} /> Outfit Match Studio
                    </button>

                    <button
                      id="logout-button"
                      onClick={onLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-slate-800/60 px-2.5 py-2 text-left text-rose-400 hover:bg-slate-850"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 shadow-md transition cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-900 md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* Quick horizontal Category navigation strip */}
      <div className="bg-slate-900 shadow-inner px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between overflow-x-auto py-2.5 text-xs no-scrollbar">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <button
              id="dept-all-btn"
              onClick={() => {
                onSelectCategory(null);
                onSelectProduct(null);
                onSetSearchQuery('');
                onNavigateTo('home');
              }}
              className={`flex items-center gap-1 font-bold transition hover:text-amber-400 cursor-pointer ${currentPage === 'home' && !currentSearchQuery ? 'text-amber-400' : 'text-slate-300'}`}
            >
              All Departments
            </button>
            <button
              id="dept-deals-btn"
              onClick={() => {
                onSetSearchQuery('deals');
                onNavigateTo('home');
              }}
              className="text-rose-400 font-extrabold hover:text-rose-350 cursor-pointer"
            >
              Today's Deals
            </button>
            <button
              id="dept-studio-btn"
              onClick={() => onNavigateTo('color-studio')}
              className={`flex items-center gap-1 font-semibold transition hover:text-amber-400 cursor-pointer ${currentPage === 'color-studio' ? 'text-amber-400' : 'text-slate-300'}`}
            >
              <Sparkles size={13} className="text-amber-400" /> Color Combination
            </button>
            <button
              id="dept-skin-btn"
              onClick={() => onNavigateTo('skin-guide')}
              className={`font-semibold transition hover:text-amber-400 cursor-pointer ${currentPage === 'skin-guide' ? 'text-amber-400' : 'text-slate-300'}`}
            >
              Skin Match Guide
            </button>
            
            {/* Custom standard dynamic categories */}
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  onSelectProduct(null);
                  onSetSearchQuery('');
                  onNavigateTo('home');
                }}
                className="text-slate-300 hover:text-amber-400 transition cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-2 text-[10px] text-amber-500 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" /> Amazon Affiliate Partner Code Synchronized
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div id="mobile-drawer-overlay" className="fixed inset-0 top-24 z-30 bg-slate-950/95 p-6 animate-fade-in md:hidden overflow-y-auto">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg bg-slate-900 py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-slate-800 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"
            >
              <Search size={18} />
            </button>
          </form>

          <div className="space-y-6">
            <div>
              <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2">Departments</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                  onClick={() => {
                    onSelectCategory(null);
                    onNavigateTo('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-slate-300 hover:text-white font-semibold"
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.slug);
                      onSelectProduct(null);
                      onNavigateTo('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-2 text-slate-300 hover:text-amber-400"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-900 pt-4 space-y-4">
              <button
                onClick={() => {
                  onNavigateTo('color-studio');
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 text-slate-200 font-semibold"
              >
                <Sparkles size={16} className="text-amber-400" /> Color Match Studio
              </button>
              <button
                onClick={() => {
                  onNavigateTo('skin-guide');
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 text-slate-200 font-semibold"
              >
                <Award size={16} className="text-amber-400" /> Skin Match Guide
              </button>
            </div>

            {currentUser && currentUser.role === 'Admin' && (
              <div className="border-t border-slate-900 pt-4">
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 text-amber-400 font-bold"
                >
                  <Award size={16} /> Owner Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
