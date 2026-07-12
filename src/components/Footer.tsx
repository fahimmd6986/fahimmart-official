/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Mail, Phone, ExternalLink, ArrowUp, Heart, ShoppingBag } from 'lucide-react';

interface FooterProps {
  onNavigateTo: (page: string) => void;
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  affiliateDisclosure: string;
}

export default function Footer({
  onNavigateTo,
  siteName,
  tagline,
  contactEmail,
  contactPhone,
  affiliateDisclosure
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      {/* Back to Top bar */}
      <button 
        id="back-to-top"
        onClick={scrollToTop}
        className="w-full bg-slate-900 py-3 text-center text-xs font-bold text-slate-400 hover:bg-slate-850 hover:text-white transition duration-200 cursor-pointer"
      >
        <span className="flex items-center justify-center gap-1">
          Back to top <ArrowUp size={14} />
        </span>
      </button>

      {/* Main links container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Presentation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-slate-950">
                FM
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-white">
                Fahim<span className="text-amber-400">Mart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {tagline}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
              <ShieldCheck size={14} className="text-amber-500 animate-pulse" /> Verified Amazon Associate Partner
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="font-sans text-sm font-extrabold text-white tracking-wider uppercase mb-4">Discover</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateTo('home')} className="hover:text-amber-400 cursor-pointer">
                  Featured Curation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('color-studio')} className="hover:text-amber-400 cursor-pointer">
                  Color Match Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('skin-guide')} className="hover:text-amber-400 cursor-pointer">
                  Skin Tone Matches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('wishlist')} className="hover:text-amber-400 cursor-pointer">
                  My Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Integrity Policies */}
          <div>
            <h4 className="font-sans text-sm font-extrabold text-white tracking-wider uppercase mb-4">Integrity & Rules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigateTo('about')} className="hover:text-amber-400 cursor-pointer">
                  About FahimMart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('privacy')} className="hover:text-amber-400 cursor-pointer">
                  Privacy Safeguards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('terms')} className="hover:text-amber-400 cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTo('disclosure')} className="hover:text-amber-400 cursor-pointer">
                  Affiliate Disclosure
                </button>
              </li>
            </ul>
          </div>

          {/* Luxury Contact Curation */}
          <div className="space-y-3">
            <h4 className="font-sans text-sm font-extrabold text-white tracking-wider uppercase mb-4">Official Curation Contact</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail size={14} className="text-amber-400" />
              <a href={`mailto:${contactEmail}`} className="hover:text-amber-400">{contactEmail}</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone size={14} className="text-amber-400" />
              <span>{contactPhone}</span>
            </div>
            <div className="pt-2 text-[10px] text-slate-500">
              Curation Hours: <span className="font-medium text-slate-400">24/7 Automated Stream</span>
            </div>
          </div>

        </div>

        {/* Affiliate Disclosure Section */}
        <div className="mt-8 border-t border-slate-900 pt-8">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-400 block mb-1">Legal Associate Curation Disclosure:</span>
            {affiliateDisclosure}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with luxury design and absolute role security.
          </p>
        </div>
      </div>
    </footer>
  );
}
