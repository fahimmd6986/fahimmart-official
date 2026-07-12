/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, Flame, Shield, Sparkles } from 'lucide-react';
import { INITIAL_SKIN_TONES } from '../data/initialData';

export default function SkinToneGuide() {
  const [selectedTone, setSelectedTone] = useState<'Fair' | 'Medium' | 'Wheatish' | 'Dark'>('Fair');

  const activeRecommendation = INITIAL_SKIN_TONES.find(t => t.tone === selectedTone) || INITIAL_SKIN_TONES[0];

  const toneCards = [
    { tone: 'Fair', label: 'Fair Tone', bgClass: 'bg-[#FFF5EB]', borderClass: 'border-[#EAE0D5]', description: 'Cool-toned pinkish or porcelain complexions' },
    { tone: 'Medium', label: 'Medium Tone', bgClass: 'bg-[#F2D2B6]', borderClass: 'border-[#D9A07E]', description: 'Golden, olive, or light honey undertones' },
    { tone: 'Wheatish', label: 'Wheatish Tone', bgClass: 'bg-[#D29E74]', borderClass: 'border-[#B07D5A]', description: 'Warm sand, tanned, or sub-continental wheat hues' },
    { tone: 'Dark', label: 'Dark Tone', bgClass: 'bg-[#8F593E]', borderClass: 'border-[#663A25]', description: 'Rich espresso, deep cocoa, or chocolate shades' }
  ];

  return (
    <div id="skin-tone-guide-section" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Title block */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold tracking-wider uppercase text-amber-500">
          <Award size={12} className="animate-pulse" /> Curated Chromatic Advice
        </span>
        <h2 className="mt-2.5 text-3xl font-black text-slate-950 dark:text-white font-sans tracking-tight">
          FahimMart Skin Tone Matching Guide
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-500 dark:text-slate-400 text-sm">
          A professional reference guide mapping classic clothing colors to your natural complexion undertones. Ensure your outfits accentuate your skin tone.
        </p>
      </div>

      {/* Tone Selection cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {toneCards.map(tc => (
          <button
            key={tc.tone}
            onClick={() => setSelectedTone(tc.tone as any)}
            className={`relative rounded-2xl p-5 text-left transition duration-200 cursor-pointer ${selectedTone === tc.tone ? 'ring-2 ring-amber-500 bg-white shadow-lg dark:bg-slate-900' : 'bg-slate-50 hover:bg-white hover:shadow-md dark:bg-slate-950 dark:hover:bg-slate-900'} border ${tc.borderClass}`}
          >
            {/* Tone indicator color swatch */}
            <div className={`h-10 w-10 rounded-full border border-black/10 shadow-inner mb-3 ${tc.bgClass}`} />
            <h4 className="text-sm font-black text-slate-950 dark:text-white">{tc.label}</h4>
            <p className="mt-1 text-[11px] leading-tight text-slate-400">{tc.description}</p>
            {selectedTone === tc.tone && (
              <span className="absolute top-4 right-4 text-amber-500">
                <CheckCircle size={16} className="fill-amber-500 text-white dark:text-slate-950" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Structured Recommendation Panel */}
      <div className="overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl dark:bg-slate-900 dark:border-slate-800">
        
        {/* Banner with professional illustration illustration */}
        <div className="relative bg-slate-950 px-6 py-10 text-white md:px-12 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
          
          {/* Professional Minimalist Portrait Avatar Illustration */}
          <div className="shrink-0 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900 border border-slate-850 p-1 shadow-2xl">
            <div className="relative h-full w-full rounded-xl overflow-hidden bg-slate-800 flex flex-col items-center justify-end">
              {/* Scalp element */}
              <div className="absolute top-3 h-10 w-12 rounded-full bg-slate-950/80" />
              {/* Skin Tone Silhouette color block */}
              <div className={`h-16 w-16 rounded-full translate-y-3 border border-black/10`} 
                style={{ 
                  backgroundColor: 
                    selectedTone === 'Fair' ? '#FFF5EB' : 
                    selectedTone === 'Medium' ? '#F2D2B6' : 
                    selectedTone === 'Wheatish' ? '#D29E74' : '#8F593E' 
                }} 
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl font-black">{selectedTone} Skin Curation</span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400 uppercase">Premium Recommendations</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xl">
              Undertone evaluation indicates high compatibility with deep rich hues. The recommendations below are calibrated to prevent pale washing or dark saturation muddying.
            </p>
          </div>
        </div>

        {/* Curation details body */}
        <div className="p-6 md:p-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Suitable colors / Colors to Avoid */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Best Compatible Colors
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {activeRecommendation.bestColors.map((col, idx) => (
                  <div key={col} className="flex items-center gap-2 rounded-xl border border-slate-50 p-2.5 dark:border-slate-850">
                    <span 
                      className="h-4 w-4 rounded-full border border-black/15 shadow-inner" 
                      style={{ backgroundColor: activeRecommendation.bestColorsHex?.[idx] || '#CCCCCC' }} 
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{col}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 dark:border-slate-850 pt-5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Colors to Avoid
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeRecommendation.avoidColors.map(col => (
                  <span key={col} className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/10 dark:text-rose-400">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Outfit Matching Recommendations */}
          <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-950 space-y-4">
            <h4 className="font-sans text-xs font-extrabold text-slate-400 uppercase tracking-widest">Complete Suggested Outfit Formula</h4>
            
            <div className="space-y-3 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <p className="font-extrabold text-slate-900 dark:text-white">Outfit Curation:</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{activeRecommendation.outfitIdea}</p>
              </div>

              <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                <p className="font-extrabold text-slate-900 dark:text-white">Shoes Pairing:</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{activeRecommendation.shoesSuggestion}</p>
              </div>

              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Accessories & Watch Curation:</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {activeRecommendation.accessorySuggestion}. We highly recommend pairing this skin tone with brushed metal or gold accent watches.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
