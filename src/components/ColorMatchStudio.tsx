/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Check, RefreshCw, Smartphone, Award, ShoppingBag, Eye } from 'lucide-react';
import { OutfitCombination, Product } from '../types';
import { INITIAL_COMBINATIONS } from '../data/initialData';

interface ColorMatchStudioProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateTo: (page: string) => void;
  onAddWishlistCombo: (combo: OutfitCombination) => void;
  savedCombos: OutfitCombination[];
}

export default function ColorMatchStudio({
  products,
  onSelectProduct,
  onNavigateTo,
  onAddWishlistCombo,
  savedCombos
}: ColorMatchStudioProps) {
  // Selections
  const [occasion, setOccasion] = useState('Office Wear');
  const [topType, setTopType] = useState('Shirt');
  const [topColor, setTopColor] = useState({ name: 'Brilliant White', hex: '#FFFFFF' });
  const [bottomType, setBottomType] = useState('Pant');
  const [bottomColor, setBottomColor] = useState({ name: 'Charcoal Grey', hex: '#4B5563' });
  const [shoesType, setShoesType] = useState('Oxfords');
  const [shoesColor, setShoesColor] = useState({ name: 'Oxblood Red', hex: '#7F1D1D' });
  const [accessory, setAccessory] = useState('Silk Patterned Necktie');
  const [watchStyle, setWatchStyle] = useState('Silver Case with Black Leather Strap');
  const [bagStyle, setBagStyle] = useState('Sleek Tan Leather Briefcase');

  // Computed state
  const [harmonyScore, setHarmonyScore] = useState(98);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Available options
  const occasions = [
    'Office Wear', 'Casual Wear', 'Festival Wear', 'Wedding Wear', 
    'College Wear', 'Summer Collection', 'Winter Collection', 'Rainy Season Collection'
  ];

  const topTypes = ['Shirt', 'T-Shirt', 'Kurta', 'Blazer', 'Sweater'];
  
  const topColors = [
    { name: 'Brilliant White', hex: '#FFFFFF' },
    { name: 'Deep Navy Blue', hex: '#1E3A8A' },
    { name: 'Forest Green', hex: '#064E3B' },
    { name: 'Charcoal Black', hex: '#111827' },
    { name: 'Crimson Red', hex: '#991B1B' },
    { name: 'Sky Blue', hex: '#BAE6FD' },
    { name: 'Saffron Orange', hex: '#EA580C' },
    { name: 'Muted Lavender', hex: '#DDD6FE' },
    { name: 'Golden Mustard', hex: '#EAB308' },
    { name: 'Blossom Pink', hex: '#FBCFE8' }
  ];

  const bottomTypes = ['Pant', 'Jeans', 'Pajama', 'Chinos'];
  
  const bottomColors = [
    { name: 'Charcoal Grey', hex: '#4B5563' },
    { name: 'Matte Jet Black', hex: '#111827' },
    { name: 'Deep Indigo Denim', hex: '#1E1B4B' },
    { name: 'Warm Beige / Khaki', hex: '#D97706' },
    { name: 'Lustrous Cream Ivory', hex: '#FEF3C7' },
    { name: 'Sage Green', hex: '#86EFAC' },
    { name: 'Olive Green', hex: '#3F6212' },
    { name: 'Stonewashed Light Blue', hex: '#93C5FD' }
  ];

  const shoesTypes = ['Oxfords', 'Loafers', 'Chelsea Boots', 'Espadrilles', 'Sneakers', 'Monk Straps'];
  
  const shoesColors = [
    { name: 'Oxblood Red', hex: '#7F1D1D' },
    { name: 'Chocolate Brown', hex: '#78350F' },
    { name: 'Sleek Obsidian Black', hex: '#030712' },
    { name: 'Tan Suede', hex: '#D97706' },
    { name: 'Off-White Canvas', hex: '#F9FAFB' },
    { name: 'Sand Suede', hex: '#FEF3C7' }
  ];

  const accessories = ['Silk Patterned Necktie', 'Gold Crest Cufflinks', 'Tortoiseshell Sunglasses', 'Minimalist Ring', 'Woolen Oatmeal Scarf', 'Linen pocket square', 'None'];
  const watchStyles = ['Silver Link Classic Dial', 'Rose Gold Classic with Brown Strap', 'Tac-Black Sport Smartwatch', 'Bronze Case Olive Strap', 'Gold Dial Dual-tone', 'None'];
  const bagStyles = ['Sleek Tan Leather Briefcase', 'Suede Brown Messenger Bag', 'Canvas Utility Backpack', 'Leather Duffle Bag', 'None'];

  // Trigger dynamic color match compatibility evaluation
  useEffect(() => {
    // Generate a matching compatibility rating based on color-wheel rules
    let baseScore = 80;

    // Contrast principles
    if (topColor.hex === bottomColor.hex) {
      if (topColor.name.includes('White') || topColor.name.includes('Cream') || topColor.name.includes('Black')) {
        baseScore += 5; // Monochromatic fits are good
      } else {
        baseScore -= 12; // Double oversaturated colors can look too loud
      }
    } else {
      baseScore += 10; // High-contrast is typically highly valued
    }

    // Classic combinations
    if (topColor.name.includes('White') && bottomColor.name.includes('Charcoal')) baseScore += 8;
    if (topColor.name.includes('Navy') && bottomColor.name.includes('Beige')) baseScore += 9;
    if (topColor.name.includes('Green') && bottomColor.name.includes('Black')) baseScore += 6;
    if (topColor.name.includes('Crimson') && bottomColor.name.includes('Ivory')) baseScore += 9;

    // Shoes matching accessories guidelines
    if (shoesColor.name.includes('Red') && watchStyle.includes('Brown')) baseScore -= 3;
    if (shoesColor.name.includes('Brown') && bagStyle.includes('Brown')) baseScore += 5; // Matching brown leather is excellent
    if (shoesColor.name.includes('Black') && watchStyle.includes('Black Strap')) baseScore += 5;

    // Cap at 100, min 50
    const finalScore = Math.min(100, Math.max(50, baseScore));
    setHarmonyScore(finalScore);

    // Filter matching curated catalog products
    const related = products.filter(p => {
      // Find matches in brand, descriptions or categories
      const titleLower = p.title.toLowerCase();
      const descLower = p.fullDescription.toLowerCase();
      const searchTerms = [occasion.split(' ')[0], topType, topColor.name.split(' ')[0], bottomType, bottomColor.name.split(' ')[0]];
      
      return searchTerms.some(term => 
        term.length > 2 && (titleLower.includes(term.toLowerCase()) || descLower.includes(term.toLowerCase()))
      );
    }).slice(0, 3);

    setMatchingProducts(related);
    
    // Check if currently saved in wishlist
    const alreadySaved = savedCombos.some(sc => 
      sc.occasion === occasion &&
      sc.topType === topType &&
      sc.topColor === topColor.name &&
      sc.bottomType === bottomType &&
      sc.bottomColor === bottomColor.name &&
      sc.shoesType === shoesType &&
      sc.shoesColor === shoesColor.name
    );
    setIsSaved(alreadySaved);

  }, [occasion, topType, topColor, bottomType, bottomColor, shoesType, shoesColor, watchStyle, bagStyle, products, savedCombos]);

  // Load preset template
  const applyPreset = (preset: OutfitCombination) => {
    setOccasion(preset.occasion);
    setTopType(preset.topType as any);
    
    const tCol = topColors.find(c => c.name.toLowerCase().includes(preset.topColor.toLowerCase()) || preset.topColor.toLowerCase().includes(c.name.toLowerCase())) || topColors[0];
    setTopColor(tCol);
    
    setBottomType(preset.bottomType as any);
    const bCol = bottomColors.find(c => c.name.toLowerCase().includes(preset.bottomColor.toLowerCase()) || preset.bottomColor.toLowerCase().includes(c.name.toLowerCase())) || bottomColors[0];
    setBottomColor(bCol);
    
    setShoesType(preset.shoesType as any);
    const sCol = shoesColors.find(c => c.name.toLowerCase().includes(preset.shoesColor.toLowerCase()) || preset.shoesColor.toLowerCase().includes(c.name.toLowerCase())) || shoesColors[0];
    setShoesColor(sCol);

    if (preset.accessory) setAccessory(preset.accessory);
    if (preset.watchStyle) setWatchStyle(preset.watchStyle);
    if (preset.bagStyle) setBagStyle(preset.bagStyle);
  };

  const handleSaveToWishlist = () => {
    const customCombo: OutfitCombination = {
      id: 'cc_' + Date.now(),
      name: `${occasion} Custom Combo - ${topColor.name} & ${bottomColor.name}`,
      occasion,
      topType,
      topColor: topColor.name,
      bottomType,
      bottomColor: bottomColor.name,
      shoesType,
      shoesColor: shoesColor.name,
      accessory,
      watchStyle,
      bagStyle,
      paletteColors: [topColor.hex, bottomColor.hex, shoesColor.hex, '#D97706'],
      description: `Tailored match of ${topColor.name} ${topType} and ${bottomColor.name} ${bottomType}, accented by ${shoesColor.name} ${shoesType}. Styled with premium accessories in mind.`
    };
    onAddWishlistCombo(customCombo);
    setIsSaved(true);
  };

  const randomizeAll = () => {
    const rOcc = occasions[Math.floor(Math.random() * occasions.length)];
    const rTopType = topTypes[Math.floor(Math.random() * topTypes.length)];
    const rTopCol = topColors[Math.floor(Math.random() * topColors.length)];
    const rBotType = bottomTypes[Math.floor(Math.random() * bottomTypes.length)];
    const rBotCol = bottomColors[Math.floor(Math.random() * bottomColors.length)];
    const rShoeType = shoesTypes[Math.floor(Math.random() * shoesTypes.length)];
    const rShoeCol = shoesColors[Math.floor(Math.random() * shoesColors.length)];
    const rAcc = accessories[Math.floor(Math.random() * accessories.length)];
    const rWat = watchStyles[Math.floor(Math.random() * watchStyles.length)];
    const rBag = bagStyles[Math.floor(Math.random() * bagStyles.length)];

    setOccasion(rOcc);
    setTopType(rTopType);
    setTopColor(rTopCol);
    setBottomType(rBotType);
    setBottomColor(rBotCol);
    setShoesType(rShoeType);
    setShoesColor(rShoeCol);
    setAccessory(rAcc);
    setWatchStyle(rWat);
    setBagStyle(rBag);
  };

  return (
    <div id="color-match-studio-section" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Visual Header introduction */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-amber-500">
          <Sparkles size={12} className="animate-pulse" /> FM Exclusive Innovation
        </span>
        <h2 className="mt-2.5 text-3xl font-black text-slate-950 dark:text-white font-sans tracking-tight">
          FahimMart Color Match Studio
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-500 dark:text-slate-400 text-sm">
          Select individual shirts, pants, shoes, and luxury accessories. Our automated chromatic harmony calculator dynamically evaluates over <span className="text-amber-500 font-extrabold font-mono">1,000,000+ custom combinations</span> instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Controls & Pickers */}
        <div className="space-y-6 lg:col-span-7">
          
          {/* Quick preset templates */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Premium Preset Templates</h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {INITIAL_COMBINATIONS.slice(0, 3).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="rounded-xl border border-slate-100 p-3 text-left transition hover:border-amber-400 hover:bg-amber-500/5 dark:border-slate-800 dark:hover:border-amber-400 dark:hover:bg-amber-500/5 cursor-pointer"
                >
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{preset.name}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">{preset.occasion}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {preset.paletteColors.slice(0, 3).map((col, idx) => (
                        <span key={idx} className="h-2 w-2 rounded-full border border-slate-200/50" style={{ backgroundColor: col }} />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pickers */}
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-6">
            
            {/* Occasion & Type row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Occasion Curation</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {occasions.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mannequin Top Wear</label>
                <select
                  value={topType}
                  onChange={(e) => setTopType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {topTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Top color picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Top Color: <span className="text-slate-800 dark:text-slate-200 font-extrabold">{topColor.name}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {topColors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setTopColor(col)}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition hover:scale-115 cursor-pointer ${topColor.name === col.name ? 'ring-2 ring-amber-500 border-transparent scale-110' : 'border-slate-200 dark:border-slate-800'}`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {topColor.name === col.name && (
                      <Check size={14} className={col.hex === '#FFFFFF' ? 'text-slate-950' : 'text-white'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom type & color picker */}
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 grid grid-cols-1 gap-4 sm:grid-cols-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mannequin Bottom Wear</label>
                <div className="flex gap-2 mb-3">
                  {bottomTypes.map(bt => (
                    <button
                      key={bt}
                      onClick={() => setBottomType(bt)}
                      className={`rounded-lg px-4 py-1.5 text-xs font-semibold border transition cursor-pointer ${bottomType === bt ? 'bg-slate-950 text-white border-transparent dark:bg-amber-500 dark:text-slate-950' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'}`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Bottom Color: <span className="text-slate-800 dark:text-slate-200 font-extrabold">{bottomColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {bottomColors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setBottomColor(col)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition hover:scale-115 cursor-pointer ${bottomColor.name === col.name ? 'ring-2 ring-amber-500 border-transparent scale-110' : 'border-slate-200 dark:border-slate-800'}`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {bottomColor.name === col.name && (
                        <Check size={14} className="text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shoes Picker */}
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 grid grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mannequin Shoes Type</label>
                  <select
                    value={shoesType}
                    onChange={(e) => setShoesType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    {shoesTypes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Shoes Color: <span className="text-slate-800 dark:text-slate-200 font-extrabold">{shoesColor.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {shoesColors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setShoesColor(col)}
                        className={`relative flex h-7 w-7 items-center justify-center rounded-full border shadow-xs transition hover:scale-115 cursor-pointer ${shoesColor.name === col.name ? 'ring-2 ring-amber-500 border-transparent' : 'border-slate-200 dark:border-slate-800'}`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {shoesColor.name === col.name && (
                          <Check size={12} className="text-white mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Luxury accessories columns */}
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Accessory Curation</label>
                <select
                  value={accessory}
                  onChange={(e) => setAccessory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {accessories.map(acc => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Watch Style Match</label>
                <select
                  value={watchStyle}
                  onChange={(e) => setWatchStyle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {watchStyles.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Luggage & Bag Match</label>
                <select
                  value={bagStyle}
                  onChange={(e) => setBagStyle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {bagStyles.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Visual Mannequin, Harmony & Related Products */}
        <div className="space-y-6 lg:col-span-5">
          
          {/* Mannequin Preview & Score card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl border border-slate-900">
            {/* Background lighting simulation */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

            {/* Compatibility rating gauge */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h4 className="font-sans text-sm font-extrabold text-amber-400">Harmony Index</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Automated Color Evaluation</p>
              </div>
              <div className="flex items-end gap-1 text-right">
                <span className="text-3xl font-black font-mono text-white leading-none">{harmonyScore}%</span>
                <span className="text-[10px] font-bold text-amber-400 pb-1">Excellent Match</span>
              </div>
            </div>

            {/* Visual Mannequin Canvas layout */}
            <div className="relative flex flex-col items-center justify-center py-8 space-y-4">
              
              {/* Head Silhouette icon */}
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                <div className="h-6 w-6 rounded-full bg-slate-800" />
              </div>

              {/* Top layer box */}
              <div className="relative flex flex-col items-center">
                <span className="absolute -top-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">{topType}</span>
                <div 
                  className="h-16 w-32 rounded-xl shadow-md border border-slate-200/10 flex items-center justify-center"
                  style={{ backgroundColor: topColor.hex }}
                >
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm mix-blend-difference`}>
                    {topColor.name}
                  </span>
                </div>
              </div>

              {/* Belt dividing line */}
              <div className="h-1 w-24 bg-slate-900 rounded-full" />

              {/* Bottom layer box */}
              <div className="relative flex flex-col items-center">
                <span className="absolute -top-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">{bottomType}</span>
                <div 
                  className="h-20 w-28 rounded-xl shadow-md border border-slate-200/10 flex items-center justify-center"
                  style={{ backgroundColor: bottomColor.hex }}
                >
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm mix-blend-difference`}>
                    {bottomColor.name}
                  </span>
                </div>
              </div>

              {/* Shoes segment */}
              <div className="relative flex items-center gap-3 pt-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-slate-500">{shoesType}</span>
                <div 
                  className="h-6 w-12 rounded-lg border border-slate-200/10"
                  style={{ backgroundColor: shoesColor.hex }}
                />
                <div 
                  className="h-6 w-12 rounded-lg border border-slate-200/10"
                  style={{ backgroundColor: shoesColor.hex }}
                />
              </div>

              {/* Outfit dynamic visual color palette bar */}
              <div className="w-full pt-4 border-t border-slate-900">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Mannequin Visual Color Palette</p>
                <div className="flex h-4 w-full rounded-full overflow-hidden border border-slate-900">
                  <span className="flex-1" style={{ backgroundColor: topColor.hex }} title={`Top: ${topColor.name}`} />
                  <span className="flex-1" style={{ backgroundColor: bottomColor.hex }} title={`Bottom: ${bottomColor.name}`} />
                  <span className="flex-1" style={{ backgroundColor: shoesColor.hex }} title={`Shoes: ${shoesColor.name}`} />
                </div>
              </div>

            </div>

            {/* Saved indicator and Action buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <button
                id="randomize-combo-btn"
                onClick={randomizeAll}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-4 py-2.5 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                <RefreshCw size={13} /> Randomize Outfit
              </button>
              
              <button
                id="save-combo-wishlist-btn"
                onClick={handleSaveToWishlist}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'}`}
              >
                <Heart size={13} className={isSaved ? 'fill-white' : ''} />
                {isSaved ? 'Saved in Wishlist' : 'Save Combo to Wishlist'}
              </button>
            </div>
          </div>

          {/* Related products recommended dynamically */}
          <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3.5">FahimMart Matching Catalog Products</h3>
            {matchingProducts.length > 0 ? (
              <div className="space-y-3">
                {matchingProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onNavigateTo('product-detail');
                    }}
                    className="group flex cursor-pointer items-center gap-3.5 rounded-xl border border-slate-50 p-2.5 hover:border-amber-400 dark:border-slate-850 dark:hover:border-amber-400"
                  >
                    <img 
                      referrerPolicy="no-referrer"
                      src={p.mainImage} 
                      alt={p.title} 
                      className="h-12 w-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-950"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-xs font-extrabold text-slate-950 dark:text-white group-hover:text-amber-500">{p.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.brand} • <span className="font-extrabold text-amber-500">₹{p.price.toLocaleString('en-IN')}</span></div>
                    </div>
                    <span className="text-slate-300 group-hover:text-amber-500 pr-1.5">
                      <Eye size={14} />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                No direct match in active catalog. Try shifting colors or occasions.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
