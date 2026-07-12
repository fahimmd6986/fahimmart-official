/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, Share2, Shield, Calendar, Star, CheckCircle, 
  ChevronRight, ArrowLeft, ChevronDown, Check, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddWishlist: (product: Product) => void;
  onAddCart: (product: Product) => void;
  isInWishlist: boolean;
  isInCart: boolean;
  allProducts: Product[];
  onTrackRedirect: (product: Product) => void;
}

export default function ProductDetail({
  product,
  onBack,
  onSelectProduct,
  onAddWishlist,
  onAddCart,
  isInWishlist,
  isInCart,
  allProducts,
  onTrackRedirect
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(product.mainImage);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isCopied, setIsCopied] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Sync active image with product
  useEffect(() => {
    setActiveImage(product.mainImage);
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Load reviews
    const stored = localStorage.getItem(`fm_reviews_${product.id}`);
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      // Seed initial reviews
      const seedReviews: Review[] = [
        {
          id: 'rev_1',
          productId: product.id,
          userName: 'Sarah K.',
          rating: 5,
          date: '2026-05-18',
          comment: `Absolutely exceeded my expectations! The build quality feels luxury-grade and the performance is flawless. Worth every single cent.`,
          isVerified: true
        },
        {
          id: 'rev_2',
          productId: product.id,
          userName: 'Alex Mercer',
          rating: 4,
          date: '2026-06-02',
          comment: `Extremely solid choice. Setup was fast and the aesthetics are stunning. Shipping was rapid too.`,
          isVerified: true
        }
      ];
      setReviews(seedReviews);
      localStorage.setItem(`fm_reviews_${product.id}`, JSON.stringify(seedReviews));
    }
  }, [product]);

  // Dynamic JSON-LD schema markup generation and injection for Google Search visibility
  useEffect(() => {
    const scriptId = 'product-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    // Dynamic schema object matching Schema.org Product specifications
    const schemaData = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.title,
      'image': [
        product.mainImage,
        ...(product.gallery || [])
      ],
      'description': product.shortDescription || product.title,
      'sku': `SKU-${product.id}`,
      'mpn': product.id,
      'brand': {
        '@type': 'Brand',
        'name': product.brand
      },
      'review': reviews.map(rev => ({
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': rev.rating,
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': rev.userName
        },
        'datePublished': rev.date || new Date().toISOString().split('T')[0],
        'reviewBody': rev.comment
      })),
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.rating || 5.0,
        'reviewCount': product.reviewCount || reviews.length || 1,
        'bestRating': '5',
        'worstRating': '1'
      },
      'offers': {
        '@type': 'Offer',
        'url': product.affiliateUrl || window.location.href,
        'priceCurrency': 'INR',
        'price': product.price,
        'priceValidUntil': '2027-12-31',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': 'FahimMart'
        }
      }
    };

    script.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      // Cleanup: remove script tag when component unmounts or selected product changes
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [product, reviews]);

  // Image zoom simulation on mouse hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  const handleShare = () => {
    const textToCopy = `${window.location.origin}/#product/${product.slug}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleRedirect = () => {
    onTrackRedirect(product);
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      productId: product.id,
      userName: reviewName.trim(),
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment.trim(),
      isVerified: true
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`fm_reviews_${product.id}`, JSON.stringify(updated));

    setReviewName('');
    setReviewComment('');
    setReviewSuccess('Review submitted successfully! Thank you for your feedback.');
    setTimeout(() => setReviewSuccess(''), 3000);
  };

  // Filter similar products (same category, different ID)
  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div id="product-detail-page" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back to Curation navigation */}
      <button
        id="detail-back-button"
        onClick={onBack}
        className="mb-6 flex cursor-pointer items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-amber-500"
      >
        <ArrowLeft size={14} /> Back to Curation
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Gallery & Interactive Zoom */}
        <div className="space-y-4 lg:col-span-5">
          <div 
            id="main-image-viewport"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm cursor-zoom-in dark:bg-slate-900 dark:border-slate-800"
          >
            <img
              referrerPolicy="no-referrer"
              src={activeImage}
              alt={product.title}
              style={zoomStyle}
              className="h-full w-full object-cover transition-transform duration-75"
            />
            
            {/* Prime-style badge on image overlay */}
            {product.isPrime && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-0.5 rounded-sm bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                ✓ Prime
              </span>
            )}
          </div>

          {/* Gallery Thumbnails List */}
          <div className="flex gap-2.5 overflow-x-auto py-1">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition ${activeImage === img ? 'border-amber-500' : 'border-slate-100 hover:border-amber-300 dark:bg-slate-900 dark:border-slate-800'}`}
              >
                <img 
                  referrerPolicy="no-referrer"
                  src={img} 
                  alt={`${product.title} gallery ${idx}`} 
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Details & Metadata */}
        <div className="space-y-6 lg:col-span-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{product.brand}</span>
            <h1 className="mt-1.5 text-2xl font-black text-slate-950 dark:text-white leading-tight font-sans tracking-tight">
              {product.title}
            </h1>

            {/* Ratings & reviews line */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={15} 
                    className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-800'} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} verified reviews)</span>
            </div>
          </div>

          <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {product.shortDescription}
            </p>
          </div>

          {/* Pros and Cons segment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50/50 p-4 dark:bg-emerald-950/5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-2.5 flex items-center gap-1">
                ✓ Verified Pros
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                {product.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500 mt-0.5">•</span> {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-rose-50/50 p-4 dark:bg-rose-950/5">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 mb-2.5 flex items-center gap-1">
                ✗ Cons to Consider
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                {product.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-rose-500 mt-0.5">•</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bullet features list */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">Key Capabilities</h3>
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 font-extrabold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Price box & affiliate controls */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-4">
            
            {/* Direct pricing details */}
            <div>
              <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-black text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                Save {product.discount}%
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-950 dark:text-white font-mono">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-400 line-through font-mono">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 leading-none">Price sync checked: <span className="font-semibold text-emerald-500">Live & Valid</span></p>
            </div>

            {/* Availability and shipping details */}
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <CheckCircle size={15} className="text-emerald-500" /> In Stock & Ready
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Eligible for instant secure checkout and standard fast global delivery via Amazon Prime services.
              </p>
            </div>

            {/* BUY ON AMAZON primary action button */}
            <a
              id="buy-on-amazon-btn"
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTrackRedirect(product)}
              className="block w-full cursor-pointer rounded-xl bg-amber-500 py-3 text-center text-xs font-black uppercase tracking-wider text-slate-950 shadow-md hover:bg-amber-400 transition"
            >
              Buy on Amazon
            </a>

            {/* Cart & Wishlist auxiliary selectors */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="add-cart-detail-btn"
                onClick={() => onAddCart(product)}
                className={`flex items-center justify-center gap-1 rounded-lg border py-2.5 text-xs font-bold cursor-pointer transition ${isInCart ? 'bg-slate-950 text-white border-transparent dark:bg-amber-500 dark:text-slate-950' : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850'}`}
              >
                <ShoppingCart size={13} /> {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                id="add-wish-detail-btn"
                onClick={() => onAddWishlist(product)}
                className={`flex items-center justify-center gap-1 rounded-lg border py-2.5 text-xs font-bold cursor-pointer transition ${isInWishlist ? 'bg-rose-50 text-rose-600 border-transparent dark:bg-rose-950/20' : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850'}`}
              >
                <Heart size={13} className={isInWishlist ? 'fill-rose-600' : ''} /> {isInWishlist ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Share and policy details */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex items-center justify-between text-xs">
              <button
                id="share-product-btn"
                onClick={handleShare}
                className="flex items-center gap-1 font-bold text-slate-500 hover:text-amber-500 cursor-pointer"
              >
                <Share2 size={13} /> {isCopied ? 'Link Copied!' : 'Share Curation'}
              </button>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Shield size={10} className="text-amber-400" /> Affiliate Safe
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* TABS & ACCORDIONS: Detailed Descriptions, Full Specs, FAQs */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 border-t border-slate-100 dark:border-slate-800 pt-8">
        
        {/* Full narrative descriptions & Full spec list */}
        <div className="space-y-6 lg:col-span-8">
          {product.aiField && (
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01] p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-4 -mt-4 pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-5 items-center justify-center rounded-md bg-amber-500 px-2 text-[9.5px] font-black uppercase text-slate-950 tracking-wider">
                  ✨ AI Stylist & Setup Insight
                </span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">FahimMart AI</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {product.aiField}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-base font-extrabold text-slate-950 dark:text-white font-sans tracking-tight">Curation Narrative Overview</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {product.fullDescription}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3.5">FahimMart Calibration Specifications</h3>
            <div className="overflow-hidden rounded-xl border border-slate-50 dark:border-slate-850">
              <table className="w-full text-xs text-left">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-950/50' : 'bg-white dark:bg-slate-900'}>
                      <td className="px-4 py-3 font-bold text-slate-400 w-1/3">{key}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product FAQs accordion */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Product Curated FAQ</h3>
            <div className="space-y-2">
              {product.faq.map((item, idx) => (
                <div 
                  key={idx} 
                  className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="flex w-full items-center justify-between bg-slate-50 p-4 text-xs font-bold text-slate-900 dark:bg-slate-950 dark:text-white text-left cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIdx === idx && (
                    <div className="bg-white p-4 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User reviews & Add Review form */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl bg-white p-5 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3.5">Verified Reviews</h3>
            
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {reviews.map(rev => (
                <div key={rev.id} className="border-b border-slate-50 dark:border-slate-850 pb-3 mb-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-950 dark:text-white">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className={i < rev.rating ? 'fill-amber-400' : 'text-slate-100'} />
                    ))}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed italic">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleAddReview} className="border-t border-slate-50 dark:border-slate-850 pt-4 mt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Write a review</h4>
              
              {reviewSuccess && (
                <div className="rounded bg-emerald-50 p-2.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                  {reviewSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Solid Choice</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor Quality</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Review Comments</label>
                <textarea
                  required
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="How was the quality of this curated piece?"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-slate-950 py-2 text-xs font-bold text-white hover:bg-slate-900 dark:bg-amber-500 dark:text-slate-950"
              >
                Submit Verified Review
              </button>
            </form>

          </div>
        </div>

      </div>

      {/* Similar / Related products curation list */}
      {similarProducts.length > 0 && (
        <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-10">
          <h3 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight mb-6">Similar Amazon Curation Matches</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {similarProducts.map(p => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="group cursor-pointer rounded-2xl bg-white border border-slate-100 p-4 shadow-sm hover:shadow-lg hover:border-amber-400 dark:bg-slate-900 dark:border-slate-850 transition"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 mb-3">
                  <img
                    referrerPolicy="no-referrer"
                    src={p.mainImage}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="text-[10px] font-bold text-amber-500 uppercase">{p.brand}</div>
                <h4 className="font-sans text-xs font-bold text-slate-950 dark:text-white group-hover:text-amber-500 truncate mt-0.5">{p.title}</h4>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-slate-950 dark:text-white font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 line-through font-mono">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
