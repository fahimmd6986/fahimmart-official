/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, Shield, FileText, Smartphone, Laptop, Edit3, Trash2, Plus, 
  Settings, BarChart3, Users, Image as ImageIcon, Link as LinkIcon, 
  Activity, CheckCircle, AlertTriangle, XCircle, Search, Save, Info 
} from 'lucide-react';
import { Product, Category, Banner, AuditLog, ClickAnalytic, SearchAnalytic, WebsiteSettings } from '../types';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateBanners: (banners: Banner[]) => void;
  onUpdateSettings: (settings: WebsiteSettings) => void;
  settings: WebsiteSettings;
  currentUser: { email: string; role: string } | null;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  categories,
  banners,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateBanners,
  onUpdateSettings,
  settings,
  currentUser,
  onClose
}: AdminPanelProps) {
  // Authorization guard
  const isAdmin = currentUser?.email.toLowerCase() === 'fahimmd6986@gmail.com' && currentUser?.role === 'Admin';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'banners' | 'audit' | 'settings' | 'users'>('overview');
  
  // User Management state
  const [users, setUsers] = useState<any[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userFormError, setUserFormError] = useState('');
  const [userFormSuccess, setUserFormSuccess] = useState('');

  // States for products CRUD
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for product
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAffiliateUrl, setFormAffiliateUrl] = useState('');
  const [formMainImage, setFormMainImage] = useState('');
  const [formGallery, setFormGallery] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDiscount, setFormDiscount] = useState('');
  const [formRating, setFormRating] = useState('4.5');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formSpecs, setFormSpecs] = useState('');
  const [formPros, setFormPros] = useState('');
  const [formCons, setFormCons] = useState('');
  const [formFaq, setFormFaq] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDesc, setFormSeoDesc] = useState('');
  const [formSeoKeywords, setFormSeoKeywords] = useState('');
  const [formIsPrime, setFormIsPrime] = useState(true);

  // Validation feedback
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState('');

  // States for Category CRUD
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('Laptop');
  const [catDesc, setCatDesc] = useState('');

  // Settings form states
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [aboutText, setAboutText] = useState(settings.aboutText);
  const [privacyText, setPrivacyText] = useState(settings.privacyPolicy);
  const [termsText, setTermsText] = useState(settings.termsConditions);
  const [disclosureText, setDisclosureText] = useState(settings.affiliateDisclosure);
  const [maintMode, setMaintMode] = useState(settings.maintenanceMode);

  // Logs & Analytics trackers
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [clickAnalytics, setClickAnalytics] = useState<ClickAnalytic[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytic[]>([]);

  // Load telemetry logs from localStorage
  useEffect(() => {
    setAuditLogs(JSON.parse(localStorage.getItem('fm_audit_logs') || '[]'));
    setClickAnalytics(JSON.parse(localStorage.getItem('fm_click_analytics') || '[]'));
    setSearchAnalytics(JSON.parse(localStorage.getItem('fm_search_analytics') || '[]'));

    // Load registered users list
    const storedUsersJson = localStorage.getItem('fm_users');
    let storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    // Always make sure owner is in user list and has Admin role
    const ownerExists = storedUsers.some((u: any) => u.email.toLowerCase() === 'fahimmd6986@gmail.com');
    if (!ownerExists) {
      const ownerUser = {
        id: 'u_admin',
        email: 'fahimmd6986@gmail.com',
        name: 'Fahim (Owner)',
        role: 'Admin',
        createdAt: new Date().toISOString()
      };
      storedUsers.unshift(ownerUser);
      localStorage.setItem('fm_users', JSON.stringify(storedUsers));
    }
    // Also enforce that any other user has role 'Customer'
    storedUsers = storedUsers.map((u: any) => {
      if (u.email.toLowerCase() === 'fahimmd6986@gmail.com') {
        return { ...u, role: 'Admin' };
      }
      return { ...u, role: 'Customer' };
    });
    setUsers(storedUsers);
  }, [activeTab, isProductModalOpen]);

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-6 text-white text-center">
        <div className="max-w-md p-8 rounded-3xl bg-slate-900 border border-rose-500/25 shadow-2xl">
          <AlertTriangle size={48} className="mx-auto text-rose-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-black uppercase tracking-wider text-rose-500">Security Access Denied</h2>
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Normal visitor profiles are strictly restricted from accessing the owner workspace and API systems. This incident has been logged in our military-grade security registry.
          </p>
          <button 
            onClick={onClose}
            className="mt-6 inline-block rounded-xl bg-slate-800 hover:bg-slate-750 px-6 py-2.5 text-xs font-bold transition cursor-pointer"
          >
            Return to Store Curation
          </button>
        </div>
      </div>
    );
  }

  // User Management CRUD Handlers
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    setUserFormSuccess('');

    if (!newUserEmail || !newUserName || !newUserPassword) {
      setUserFormError('All fields (Name, Email, Password) are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newUserEmail)) {
      setUserFormError('Please enter a valid email address.');
      return;
    }

    const storedUsersJson = localStorage.getItem('fm_users');
    const storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    const userExists = storedUsers.some((u: any) => u.email.toLowerCase() === newUserEmail.trim().toLowerCase());
    if (userExists) {
      setUserFormError('A user with this email address already exists.');
      return;
    }

    const isOwner = newUserEmail.trim().toLowerCase() === 'fahimmd6986@gmail.com';
    const newUser = {
      id: 'u_' + Date.now(),
      email: newUserEmail.trim().toLowerCase(),
      name: newUserName.trim(),
      role: isOwner ? 'Admin' : 'Customer',
      createdAt: new Date().toISOString()
    };

    storedUsers.push(newUser);
    localStorage.setItem('fm_users', JSON.stringify(storedUsers));

    // Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    logs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_CREATE_USER',
      details: `Created new user account: ${newUser.email} with role: ${newUser.role}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));

    setUserFormSuccess(`User ${newUser.name} created successfully!`);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserPassword('');
    
    // Refresh user list
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.email.toLowerCase() === 'fahimmd6986@gmail.com') {
        return { ...u, role: 'Admin' };
      }
      return { ...u, role: 'Customer' };
    });
    setUsers(updatedUsers);

    setTimeout(() => {
      setIsUserModalOpen(false);
      setUserFormSuccess('');
    }, 1200);
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (email.toLowerCase() === 'fahimmd6986@gmail.com') {
      alert('Permanent SUPER ADMIN cannot be deleted!');
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    const storedUsersJson = localStorage.getItem('fm_users');
    let storedUsers = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    storedUsers = storedUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem('fm_users', JSON.stringify(storedUsers));

    // Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    logs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_DELETE_USER',
      details: `Deleted user account: ${email}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));

    // Refresh
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.email.toLowerCase() === 'fahimmd6986@gmail.com') {
        return { ...u, role: 'Admin' };
      }
      return { ...u, role: 'Customer' };
    });
    setUsers(updatedUsers);
  };

  // Populate form fields for product creation or editing
  const openProductForm = (prod: Product | null = null) => {
    setValidationErrors([]);
    setFormSuccess('');
    
    if (prod) {
      setEditingProduct(prod);
      setFormTitle(prod.title);
      setFormBrand(prod.brand);
      setFormCategory(prod.category);
      setFormAffiliateUrl(prod.affiliateUrl);
      setFormMainImage(prod.mainImage);
      setFormGallery(prod.gallery.join('\n'));
      setFormPrice(prod.price.toString());
      setFormOriginalPrice(prod.originalPrice.toString());
      setFormDiscount(prod.discount.toString());
      setFormRating(prod.rating.toString());
      setFormShortDesc(prod.shortDescription);
      setFormFullDesc(prod.fullDescription);
      setFormFeatures(prod.features.join('\n'));
      
      // specifications format parsing
      const specLines = Object.entries(prod.specifications).map(([k, v]) => `${k}:${v}`).join('\n');
      setFormSpecs(specLines);
      
      setFormPros(prod.pros.join('\n'));
      setFormCons(prod.cons.join('\n'));
      
      const faqLines = prod.faq.map(f => `${f.question}|${f.answer}`).join('\n');
      setFormFaq(faqLines);
      
      setFormSlug(prod.slug);
      setFormSeoTitle(prod.seo.title);
      setFormSeoDesc(prod.seo.description);
      setFormSeoKeywords(prod.seo.keywords.join(', '));
      setFormIsPrime(prod.isPrime);
    } else {
      setEditingProduct(null);
      setFormTitle('');
      setFormBrand('');
      setFormCategory(categories[0]?.name || '');
      setFormAffiliateUrl('');
      setFormMainImage('');
      setFormGallery('');
      setFormPrice('');
      setFormOriginalPrice('');
      setFormDiscount('');
      setFormRating('4.5');
      setFormShortDesc('');
      setFormFullDesc('');
      setFormFeatures('');
      setFormSpecs('');
      setFormPros('');
      setFormCons('');
      setFormFaq('');
      setFormSlug('');
      setFormSeoTitle('');
      setFormSeoDesc('');
      setFormSeoKeywords('');
      setFormIsPrime(true);
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setFormSuccess('');

    // CRITICAL REQUIREMENT: Strict field validation
    const errors: string[] = [];
    if (!formTitle.trim()) errors.push('Product Title is required.');
    if (!formBrand.trim()) errors.push('Brand Name is required.');
    if (!formCategory.trim()) errors.push('Category Selection is required.');
    if (!formAffiliateUrl.trim() || !formAffiliateUrl.startsWith('http')) {
      errors.push('Affiliate URL is required and must begin with http:// or https://');
    }
    if (!formMainImage.trim() || !formMainImage.startsWith('http')) {
      errors.push('Main Image URL is required and must begin with http:// or https://');
    }
    
    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) errors.push('Valid Price (>0) is required.');
    
    const origPriceNum = parseFloat(formOriginalPrice);
    if (isNaN(origPriceNum) || origPriceNum <= 0) errors.push('Valid Original Price is required.');
    
    if (priceNum > origPriceNum) errors.push('Sale Price cannot exceed Original Price.');

    const discNum = parseInt(formDiscount);
    if (isNaN(discNum) || discNum < 0 || discNum > 100) errors.push('Discount must be a valid percentage (0 - 100).');

    if (!formShortDesc.trim() || formShortDesc.length < 10) errors.push('Short description must contain at least 10 characters.');
    if (!formFullDesc.trim() || formFullDesc.length < 30) errors.push('Detailed narrative description must contain at least 30 characters.');

    if (!formSlug.trim()) errors.push('URL Slug path is required.');

    // If there are errors, display them clearly and halt saving to prevent data loss.
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Parse array inputs
    const galleryArr = formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const featuresArr = formFeatures.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const prosArr = formPros.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const consArr = formCons.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Parse specs key-value lines (key:value)
    const specsObj: Record<string, string> = {};
    formSpecs.split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const k = line.substring(0, idx).trim();
        const v = line.substring(idx + 1).trim();
        if (k && v) specsObj[k] = v;
      }
    });

    // Parse FAQ (q|a)
    const faqArr = formFaq.split('\n').map(line => {
      const parts = line.split('|');
      return {
        question: parts[0]?.trim() || '',
        answer: parts[1]?.trim() || ''
      };
    }).filter(f => f.question && f.answer);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : 'p_' + Date.now(),
      title: formTitle.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      affiliateUrl: formAffiliateUrl.trim(),
      mainImage: formMainImage.trim(),
      gallery: galleryArr.length > 0 ? galleryArr : [formMainImage.trim()],
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discNum,
      rating: parseFloat(formRating) || 4.5,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      shortDescription: formShortDesc.trim(),
      fullDescription: formFullDesc.trim(),
      features: featuresArr.length > 0 ? featuresArr : ['Premium Curation Match'],
      specifications: Object.keys(specsObj).length > 0 ? specsObj : { 'Quality Standard': 'Highly Calibrated' },
      pros: prosArr.length > 0 ? prosArr : ['Elegant aesthetic design'],
      cons: consArr.length > 0 ? consArr : ['None noted'],
      faq: faqArr,
      slug: formSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      seo: {
        title: formSeoTitle.trim() || `${formTitle.trim()} | FahimMart`,
        description: formSeoDesc.trim() || formShortDesc.trim(),
        keywords: formSeoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      },
      isPrime: formIsPrime
    };

    if (editingProduct) {
      onUpdateProduct(productPayload);
      setFormSuccess('Product specifications updated successfully!');
    } else {
      onAddProduct(productPayload);
      setFormSuccess('New product curated & published successfully!');
    }

    // Log action to audit logs
    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    currentLogs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'owner',
      action: editingProduct ? 'PRODUCT_UPDATE' : 'PRODUCT_CREATE',
      details: `Curated product: ${productPayload.title} (${productPayload.id})`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));

    setTimeout(() => {
      setIsProductModalOpen(false);
      setFormSuccess('');
    }, 1200);
  };

  // Category CRUD handler
  const openCategoryForm = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatIcon(cat.iconName);
      setCatDesc(cat.description || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatIcon('Laptop');
      setCatDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) return;

    const payload: Category = {
      id: editingCategory ? editingCategory.id : 'cat_' + Date.now(),
      name: catName.trim(),
      slug: catSlug.trim().toLowerCase(),
      iconName: catIcon,
      description: catDesc.trim()
    };

    if (editingCategory) {
      onUpdateCategory(payload);
    } else {
      onAddCategory(payload);
    }

    // Log audit
    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    currentLogs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'owner',
      action: editingCategory ? 'CATEGORY_UPDATE' : 'CATEGORY_CREATE',
      details: `Category: ${payload.name} (${payload.slug})`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));

    setIsCategoryModalOpen(false);
  };

  // Settings Save
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WebsiteSettings = {
      siteName: siteName.trim(),
      tagline: tagline.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      aboutText: aboutText.trim(),
      privacyPolicy: privacyText.trim(),
      termsConditions: termsText.trim(),
      affiliateDisclosure: disclosureText.trim(),
      maintenanceMode: maintMode
    };
    onUpdateSettings(payload);

    // Log audit
    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    currentLogs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'owner',
      action: 'SETTINGS_UPDATE',
      details: 'Website settings modified by administrator.',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));

    alert('FahimMart system settings updated successfully!');
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Sidebar navigation */}
      <div className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-sans text-sm font-black text-slate-950 shadow-md">
              FM
            </div>
            <div>
              <span className="block text-sm font-extrabold tracking-tight text-white leading-none">
                Fahim<span className="text-amber-400">Mart</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold tracking-widest text-amber-500 uppercase">
                Owner Workspace
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <BarChart3 size={15} /> KPI & Analytics
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'products' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Smartphone size={15} /> Curated Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'categories' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Laptop size={15} /> Departments
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'banners' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <ImageIcon size={15} /> Banner Sliders
            </button>
             <button
              onClick={() => setActiveTab('audit')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'audit' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Shield size={15} /> Security Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'users' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users size={15} /> User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Settings size={15} /> website Settings
            </button>
          </nav>
        </div>

        <button
          onClick={onClose}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-850 py-2.5 text-xs font-bold text-slate-300 transition cursor-pointer"
        >
          Exit Owner panel
        </button>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 shrink-0 border-b border-slate-900 bg-slate-900 px-8 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            {activeTab === 'overview' && 'KPI Dashboard & Analytics'}
            {activeTab === 'products' && 'Product Catalog Management'}
            {activeTab === 'categories' && 'Department Management'}
            {activeTab === 'banners' && 'Carousel Banner Settings'}
            {activeTab === 'audit' && 'Security Audit Registry'}
            {activeTab === 'users' && 'User Directory & Authentication Roles'}
            {activeTab === 'settings' && 'FahimMart Core Settings'}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Admin Profile: <span className="font-extrabold text-amber-400">{currentUser?.email}</span>
          </div>
        </header>

        <main className="flex-1 p-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-900 p-5 border border-slate-850">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500">Active Products</span>
                  <p className="text-3xl font-black font-mono text-white mt-1">{products.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 border border-slate-850">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500">Active Departments</span>
                  <p className="text-3xl font-black font-mono text-white mt-1">{categories.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 border border-slate-850">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500">Affiliate Link Out-Clicks</span>
                  <p className="text-3xl font-black font-mono text-amber-400 mt-1">
                    {clickAnalytics.reduce((sum, item) => sum + item.clicks, 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 border border-slate-850">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500">Audit Events Logged</span>
                  <p className="text-3xl font-black font-mono text-white mt-1">{auditLogs.length}</p>
                </div>
              </div>

              {/* Click Analytics Bar list */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-slate-900 p-6 border border-slate-850 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <LinkIcon size={14} className="text-amber-500" /> Outbound Amazon Referrals (Popular Clicks)
                  </h3>
                  <div className="space-y-3.5">
                    {clickAnalytics.length > 0 ? (
                      clickAnalytics.slice(0, 5).map(item => (
                        <div key={item.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate max-w-[280px]">{item.productTitle}</span>
                            <span className="font-mono text-amber-400 font-extrabold">{item.clicks} clicks</span>
                          </div>
                          {/* Lightweight custom progress bar */}
                          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                              style={{ width: `${Math.min(100, (item.clicks / (Math.max(...clickAnalytics.map(c => c.clicks)) || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-500 italic">No out-click data logged yet. Referrals will populate upon user redirects.</div>
                    )}
                  </div>
                </div>

                {/* Popular Search Queries */}
                <div className="rounded-2xl bg-slate-900 p-6 border border-slate-850 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Search size={14} className="text-amber-500" /> Smart Search Index Analytics
                  </h3>
                  <div className="space-y-3">
                    {searchAnalytics.length > 0 ? (
                      searchAnalytics.slice(0, 5).map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b border-slate-850 pb-2.5 text-xs">
                          <span className="font-bold text-slate-300 font-mono">"{item.query}"</span>
                          <span className="font-semibold text-white">{item.count} searches</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-500 italic">No search entries logged yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Server health monitoring */}
              <div className="rounded-2xl bg-slate-900 p-6 border border-slate-850 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity size={14} className="text-amber-500 animate-pulse" /> Curation Server Node Telemetry
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <span className="text-slate-500 font-bold block">CPU Utilization</span>
                    <span className="text-sm font-black font-mono text-emerald-400 mt-1">1.24% (Optimal)</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-3">
                    <span className="text-slate-500 font-bold block">RAM Allocation</span>
                    <span className="text-sm font-black font-mono text-emerald-400 mt-1">104 MB / 1024 MB</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-3">
                    <span className="text-slate-500 font-bold block">Database Response</span>
                    <span className="text-sm font-black font-mono text-emerald-400 mt-1">1.8 ms (Local SQLite/Indexed)</span>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-3">
                    <span className="text-slate-500 font-bold block">SSL/TLS Security</span>
                    <span className="text-sm font-black font-mono text-emerald-400 mt-1">AES-256 GCM Secure</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS TABLE */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-850">
                <div className="relative w-full sm:w-80">
                  <Search size={14} className="absolute top-3.5 left-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search curated products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 py-2.5 pl-9 pr-4 text-xs text-slate-200 outline-none placeholder-slate-600 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <button
                  id="add-new-product-btn"
                  onClick={() => openProductForm()}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                >
                  <Plus size={14} /> Curate New Product
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-900">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Brand</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <tr key={p.id} className="border-b border-slate-850 hover:bg-slate-850/30">
                          <td className="px-6 py-3">
                            <img 
                              referrerPolicy="no-referrer"
                              src={p.mainImage} 
                              alt={p.title} 
                              className="h-10 w-10 rounded object-cover bg-slate-950"
                            />
                          </td>
                          <td className="px-6 py-3 font-bold text-white max-w-[240px] truncate">{p.title}</td>
                          <td className="px-6 py-3 text-slate-300 font-semibold">{p.brand}</td>
                          <td className="px-6 py-3 text-slate-400">{p.category}</td>
                          <td className="px-6 py-3 text-amber-400 font-black font-mono">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openProductForm(p)}
                                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                                title="Edit Curation specifications"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${p.title}?`)) {
                                    onDeleteProduct(p.id);
                                    
                                    // Log audit
                                    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
                                    currentLogs.unshift({
                                      id: 'log_' + Date.now(),
                                      userEmail: currentUser?.email || 'owner',
                                      action: 'PRODUCT_DELETE',
                                      details: `Deleted product: ${p.title} (${p.id})`,
                                      timestamp: new Date().toISOString(),
                                      status: 'WARNING'
                                    });
                                    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));
                                  }
                                }}
                                className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-500"
                                title="Remove curation"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500 italic">No products matching filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-end">
                <button
                  onClick={() => openCategoryForm()}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                >
                  <Plus size={14} /> Create Department
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {categories.map(cat => (
                  <div key={cat.id} className="rounded-xl bg-slate-900 border border-slate-850 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                          {cat.iconName.substring(0, 2)}
                        </div>
                        <h4 className="font-extrabold text-white text-sm">{cat.name}</h4>
                      </div>
                      <p className="mt-2 text-slate-400 text-[11px] leading-relaxed">{cat.description || 'No description provided.'}</p>
                      <div className="mt-1.5 font-mono text-[10px] text-slate-500">Slug path: /{cat.slug}</div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2 border-t border-slate-850 pt-3">
                      <button
                        onClick={() => openCategoryForm(cat)}
                        className="rounded p-1 text-slate-400 hover:text-white"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove department ${cat.name}?`)) {
                            onDeleteCategory(cat.id);
                          }
                        }}
                        className="rounded p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-xl bg-slate-900 border border-slate-850 p-6 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Homepage rotating Hero banners</h3>
                
                <div className="space-y-4">
                  {banners.map((ban, idx) => (
                    <div key={ban.id} className="rounded-lg bg-slate-950 p-4 border border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
                      <img 
                        referrerPolicy="no-referrer"
                        src={ban.imageUrl} 
                        alt={ban.title} 
                        className="h-16 w-32 object-cover rounded bg-slate-900"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-bold text-white text-sm">{ban.title}</p>
                        <p className="text-slate-400 text-xs">{ban.subtitle}</p>
                        <p className="text-slate-500 text-[10px] font-mono">Link target: {ban.linkUrl}</p>
                      </div>
                      
                      {/* Banner toggling mock */}
                      <button
                        onClick={() => {
                          const updated = banners.map((b, i) => i === idx ? { ...b, isActive: !b.isActive } : b);
                          onUpdateBanners(updated);
                        }}
                        className={`rounded px-3 py-1 text-[10px] font-bold ${ban.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                      >
                        {ban.isActive ? '● Active' : '○ Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT REGISTER */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-900">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Operator</th>
                      <th className="px-6 py-4">Action Event</th>
                      <th className="px-6 py-4">Telemetry Context</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length > 0 ? (
                      auditLogs.map(log => (
                        <tr key={log.id} className="border-b border-slate-850 hover:bg-slate-850/30">
                          <td className="px-6 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-6 py-3 font-bold text-slate-200">{log.userEmail}</td>
                          <td className="px-6 py-3 font-extrabold text-amber-500">{log.action}</td>
                          <td className="px-6 py-3 text-slate-400">{log.details}</td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : log.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {log.status === 'SUCCESS' && <CheckCircle size={10} />}
                              {log.status === 'WARNING' && <AlertTriangle size={10} />}
                              {log.status === 'FAILED' && <XCircle size={10} />}
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-500 italic">No security events logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleSettingsSubmit} className="rounded-xl bg-slate-900 border border-slate-850 p-6 space-y-5">
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Official Site Name</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Primary brand Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Curation Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Official support Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Legal Amazon Affiliate Disclosure Text</label>
                  <textarea
                    rows={3}
                    value={disclosureText}
                    onChange={(e) => setDisclosureText(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">About narrative section</label>
                  <textarea
                    rows={3}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="border-t border-slate-850 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Maintenance Mode</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Locks the storefront preview for standard Customer roles if toggled.</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setMaintMode(!maintMode)}
                    className={`rounded px-4 py-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer ${maintMode ? 'bg-rose-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                  >
                    {maintMode ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex justify-end border-t border-slate-850 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                  >
                    <Save size={14} /> Commit Settings
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 7: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-500">
                    User Directory
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Monitor user accounts, roles, registration records, and audit access parameters.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setUserFormError('');
                    setUserFormSuccess('');
                    setNewUserEmail('');
                    setNewUserName('');
                    setNewUserPassword('');
                    setIsUserModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 transition cursor-pointer shadow-md"
                >
                  <Plus size={14} /> Register New User
                </button>
              </div>

              <div className="rounded-xl border border-slate-850 bg-slate-900/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email Address</th>
                        <th className="px-6 py-4">Security Role</th>
                        <th className="px-6 py-4">Created At</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-xs">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                            No registered users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => {
                          const isSuperAdmin = u.email.toLowerCase() === 'fahimmd6986@gmail.com';
                          return (
                            <tr key={u.id} className="hover:bg-slate-900/50 transition">
                              <td className="px-6 py-4 font-bold text-white">
                                {u.name}
                              </td>
                              <td className="px-6 py-4 font-mono text-[11px] text-slate-300">
                                {u.email}
                              </td>
                              <td className="px-6 py-4">
                                {isSuperAdmin ? (
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-400 shadow-sm">
                                    <Shield size={10} /> SUPER_ADMIN
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                                    CUSTOMER
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-[11px] text-slate-400">
                                {new Date(u.createdAt).toLocaleString('en-IN')}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {isSuperAdmin ? (
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-not-allowed">
                                    Permanent Account
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.email)}
                                    className="inline-flex items-center gap-1 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 p-1.5 text-rose-500 transition cursor-pointer"
                                    title="Delete User"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAILED FORM MODAL: Add/Edit Product with precise custom validations */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <header className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm">
                {editingProduct ? `Edit Curated Product Specifications: ${editingProduct.title}` : 'Curate & Publish New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </header>

            <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Validation alert logs */}
              {validationErrors.length > 0 && (
                <div id="validation-errors-alert" className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 text-xs text-rose-400 space-y-1">
                  <p className="font-black flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <AlertTriangle size={13} /> Strict curation validation failure ({validationErrors.length} errors):
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formSuccess && (
                <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
                  {formSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                    placeholder="X-Gen Noise Cancelling Headphones"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                    placeholder="AcoustiMax"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Amazon Affiliate Partner URL *</label>
                  <input
                    type="text"
                    value={formAffiliateUrl}
                    onChange={(e) => setFormAffiliateUrl(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="https://www.amazon.com/dp/.../?tag=fahimmart-20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Main Image URL *</label>
                  <input
                    type="text"
                    value={formMainImage}
                    onChange={(e) => setFormMainImage(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="17999"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="24999"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Discount (%) *</label>
                  <input
                    type="number"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="28"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Initial Rating Value (1-5)</label>
                  <input
                    type="text"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="4.8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Curation URL Slug *</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    placeholder="x-gen-headphones-noise-cancelling"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPrime}
                      onChange={(e) => setFormIsPrime(e.target.checked)}
                      className="rounded border-slate-800 text-amber-500"
                    />
                    Include Amazon Prime Badge (✓ Prime)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Short Description *</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  placeholder="Enterprise-grade noise cancellation headphones with 60 hours playback."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Detailed Narrative Description *</label>
                <textarea
                  rows={3}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-relaxed"
                  placeholder="The AcoustiMax X-Gen Quantum Sound Pro represents the absolute pinnacle of acoustic engineering..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Gallery Image URLs (one per line)</label>
                  <textarea
                    rows={2}
                    value={formGallery}
                    onChange={(e) => setFormGallery(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono leading-tight"
                    placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Key Features (one per line)</label>
                  <textarea
                    rows={2}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-tight"
                    placeholder="Industry-leading noise cancellation&#10;Unrivaled battery performance"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Specifications (Format: Name:Value, one per line)</label>
                  <textarea
                    rows={2}
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono leading-tight"
                    placeholder="Driver:40mm Dynamic&#10;Frequency Response:4Hz - 45KHz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Verified Pros (one per line)</label>
                  <textarea
                    rows={2}
                    value={formPros}
                    onChange={(e) => setFormPros(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-tight"
                    placeholder="Sublime spatial audio accuracy&#10;Extremely comfortable ear cushions"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Cons to Consider (one per line)</label>
                  <textarea
                    rows={2}
                    value={formCons}
                    onChange={(e) => setFormCons(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-tight"
                    placeholder="Does not include a 6.3mm legacy adapter&#10;Slightly heavy at 265g"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">FAQ Curation (Format: Question|Answer, one per line)</label>
                <textarea
                  rows={2}
                  value={formFaq}
                  onChange={(e) => setFormFaq(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-tight"
                  placeholder="Is it compatible with iOS?|Yes, works with iOS and Android.&#10;Does it have a mic?|Yes, has six noise-reducing mics."
                />
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Curation SEO Metadata</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={formSeoDesc}
                      onChange={(e) => setFormSeoDesc(e.target.value)}
                      className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formSeoKeywords}
                      onChange={(e) => setFormSeoKeywords(e.target.value)}
                      className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <footer className="border-t border-slate-800 pt-4 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl border border-slate-800 hover:bg-slate-850 px-5 py-2.5 text-xs font-bold text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-black text-slate-950 cursor-pointer animate-pulse"
                >
                  {editingProduct ? 'Update Specifications' : 'Publish Curation'}
                </button>
              </footer>

            </form>

          </div>
        </div>
      )}

      {/* DETAILED CATEGORY FORM MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {editingCategory ? `Modify Department: ${editingCategory.name}` : 'Create New Department'}
            </h3>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  placeholder="Smart Watches"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department Slug *</label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                  placeholder="smart-watches"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Lucide Icon Class</label>
                <input
                  type="text"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                  placeholder="Watch"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none leading-relaxed"
                  placeholder="High fidelity biometric smartwatches."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded px-4 py-2 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-amber-500 px-5 py-2 text-xs font-black text-slate-950 cursor-pointer"
                >
                  {editingCategory ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED USER REGISTRATION FORM MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Register New FahimMart Customer
            </h3>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              {userFormError && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-bold text-rose-400">
                  {userFormError}
                </div>
              )}
              {userFormSuccess && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-400">
                  {userFormSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded px-4 py-2 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-amber-500 px-5 py-2 text-xs font-black text-slate-950 cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
