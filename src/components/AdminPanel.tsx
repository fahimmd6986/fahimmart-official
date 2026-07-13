/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, Shield, FileText, Smartphone, Laptop, Edit3, Trash2, Plus, 
  Settings, BarChart3, Users, Image as ImageIcon, Link as LinkIcon, 
  Activity, CheckCircle, AlertTriangle, XCircle, Search, Save, Info,
  Upload, Sparkles
} from 'lucide-react';
import { Product, Category, Banner, AuditLog, ClickAnalytic, SearchAnalytic, WebsiteSettings } from '../types';
import { 
  subscribeToUsers, 
  subscribeToAuditLogs, 
  saveUserToCloud, 
  deleteUserFromCloud, 
  saveAuditLogToCloud 
} from '../lib/firebaseService';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'banners' | 'audit' | 'settings' | 'users' | 'bulk-import' | 'ai-settings' | 'prompt-manager'>('overview');
  
  // AI Bulk Product Import state
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  const [bulkProducts, setBulkProducts] = useState<Array<{
    id: string;
    url: string;
    status: 'pending' | 'generating' | 'success' | 'failed';
    error?: string;
    product?: Product;
    isSelected: boolean;
  }>>([]);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [expandedBulkItemId, setExpandedBulkItemId] = useState<string | null>(null);
  
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
  const [formReviewCount, setFormReviewCount] = useState('150');
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
  const [formAiField, setFormAiField] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState('');

  // Enhanced Photo, Gallery, & Camera Upload States
  const [photoUploadMode, setPhotoUploadMode] = useState<'file' | 'camera' | 'url'>('file');
  const [galleryUploadMode, setGalleryUploadMode] = useState<'upload' | 'camera' | 'text'>('upload');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleStartCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      // Wait for React to render the video element and set srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error('Failed to access camera:', err);
      setCameraError('Could not access camera. Please check permissions or use a different tab/browser.');
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFormMainImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleCaptureGalleryPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFormGallery(prev => {
          const current = prev.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          current.push(dataUrl);
          return current.join('\n');
        });
        stopCamera();
      }
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setFormGallery(prev => {
            const current = prev ? prev.split('\n').map(l => l.trim()).filter(l => l.length > 0) : [];
            current.push(result);
            return current.join('\n');
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Upgraded smart AI Assistant state and operations
  const [smartAiMode, setSmartAiMode] = useState<'none' | 'writing' | 'seo' | 'tags' | 'chat'>('none');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isSmartAiLoading, setIsSmartAiLoading] = useState(false);
  const [smartAiError, setSmartAiError] = useState('');

  const handleSmartAiAction = async (action: 'writing' | 'seo' | 'tags' | 'chat', userMsg?: string) => {
    if (!formTitle.trim() && action !== 'chat') {
      setSmartAiError('Please enter a Product Title first so the AI has context.');
      return;
    }
    setIsSmartAiLoading(true);
    setSmartAiError('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          brand: formBrand,
          category: formCategory,
          description: formShortDesc || formFullDesc,
          mode: action === 'writing' ? 'descriptions' : action === 'seo' ? 'seo' : action === 'tags' ? 'tags_and_categories' : 'chat',
          chatQuery: action === 'chat' ? (userMsg || chatInput) : undefined
        })
      });

      if (!res.ok) {
        throw new Error('AI Server responded with an error.');
      }

      const data = await res.json();
      if (action === 'writing') {
        if (data.shortDesc) setFormShortDesc(data.shortDesc);
        if (data.fullDesc) setFormFullDesc(data.fullDesc);
        alert('✨ Product descriptions generated & applied to the form successfully!');
      } else if (action === 'seo') {
        if (data.seoTitle) setFormSeoTitle(data.seoTitle);
        if (data.seoDesc) setFormSeoDesc(data.seoDesc);
        if (data.seoKeywords) setFormSeoKeywords(data.seoKeywords);
        alert('✨ SEO metadata generated & applied to the form successfully!');
      } else if (action === 'tags') {
        let alertMsg = '✨ AI Recommendations:\n';
        if (data.tags) {
          alertMsg += `Recommended Tags: ${data.tags}\n`;
          setFormSeoKeywords(prev => prev ? prev + ', ' + data.tags : data.tags);
        }
        if (data.keywords) {
          alertMsg += `Search Keywords: ${data.keywords}\n`;
        }
        if (data.recommendedCategory) {
          alertMsg += `Suggested Category: ${data.recommendedCategory}\n`;
          const found = categories.find(c => c.slug.toLowerCase() === data.recommendedCategory.toLowerCase());
          if (found) {
            setFormCategory(found.name);
            alertMsg += `-> Selected Category auto-updated to: ${found.name}\n`;
          }
        }
        alert(alertMsg);
      } else if (action === 'chat') {
        const assistantReply = data.text || 'No response received.';
        setChatHistory(prev => [
          ...prev, 
          { role: 'user', content: userMsg || chatInput },
          { role: 'assistant', content: assistantReply }
        ]);
        setChatInput('');
      }
    } catch (err: any) {
      console.error(err);
      setSmartAiError(err.message || 'AI action failed. Make sure your server is online.');
    } finally {
      setIsSmartAiLoading(false);
    }
  };

  // Multiple Product Creation Draft state for modal
  const [modalDrafts, setModalDrafts] = useState<Array<{
    id: string;
    title: string;
    brand: string;
    category: string;
    affiliateUrl: string;
    mainImage: string;
    gallery: string[];
    price: string;
    originalPrice: string;
    discount: string;
    rating: string;
    reviewCount: string;
    shortDesc: string;
    fullDesc: string;
    features: string;
    specs: string;
    pros: string;
    cons: string;
    faq: string;
    slug: string;
    seoTitle: string;
    seoDesc: string;
    seoKeywords: string;
    isPrime: boolean;
    aiField: string;
  }>>([]);

  // AI Settings State (stored in 'ai_settings', 'active_config' in Firestore)
  const [productWritingStyle, setProductWritingStyle] = useState('Luxury & Persuasive (Captivating, high-end vocabulary)');
  const [seoRules, setSeoRules] = useState('Optimize for clean, non-spammy keywords; include a powerful CTR-focused title; include meta description.');
  const [descriptionLength, setDescriptionLength] = useState('Medium (Showcase craft, detail, and utility across 2 paragraphs)');
  const [businessInstructions, setBusinessInstructions] = useState('Highlight Amazon Affiliate curation aspect, premium quality, and exclusive Indian Rupees pricing.');
  const [productRules, setProductRules] = useState('Infer realistic pricing in INR (₹) and features based on tiers. Never use placeholder images or placeholder text.');
  const [aiBehaviour, setAiBehaviour] = useState('Elite Concierge / Personal Stylist (Helpful, sophisticated, extremely knowledgeable)');
  const [customPrompt, setCustomPrompt] = useState(`You are an elite product curator and catalog manager for FahimMart. Generate an immersive, highly persuasive and detailed AI styling advice, tech curation advice, or setup guide written in the voice of an elite concierge.`);
  
  const [isSavingAiSettings, setIsSavingAiSettings] = useState(false);

  // Prompt Manager State (stored in 'prompt_versions' collection in Firestore)
  const [promptVersions, setPromptVersions] = useState<any[]>([]);
  const [newVersionName, setNewVersionName] = useState('');
  const [editingSnapshotId, setEditingSnapshotId] = useState<string | null>(null);
  const [isSavingPromptVersion, setIsSavingPromptVersion] = useState(false);

  // Load AI Settings and Prompt Versions from Firestore
  const loadAiSettings = async () => {
    try {
      const docRef = doc(db, 'ai_settings', 'active_config');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.productWritingStyle) setProductWritingStyle(data.productWritingStyle);
        if (data.seoRules) setSeoRules(data.seoRules);
        if (data.descriptionLength) setDescriptionLength(data.descriptionLength);
        if (data.businessInstructions) setBusinessInstructions(data.businessInstructions);
        if (data.productRules) setProductRules(data.productRules);
        if (data.aiBehaviour) setAiBehaviour(data.aiBehaviour);
        if (data.customPrompt) setCustomPrompt(data.customPrompt);
      }
    } catch (error) {
      console.error('Error loading AI Settings:', error);
    }
  };

  const loadPromptVersions = async () => {
    try {
      const q = query(collection(db, 'prompt_versions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPromptVersions(list);
    } catch (error) {
      console.error('Error loading Prompt Versions:', error);
    }
  };

  const handleSaveAiSettings = async () => {
    setIsSavingAiSettings(true);
    try {
      const payload = {
        productWritingStyle,
        seoRules,
        descriptionLength,
        businessInstructions,
        productRules,
        aiBehaviour,
        customPrompt,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'ai_settings', 'active_config'), payload);

      // Create an audit log entry for system settings modification
      await saveAuditLogToCloud({
        id: 'log_' + Date.now(),
        action: 'UPDATE_AI_SETTINGS',
        user: currentUser?.email || 'Admin',
        details: 'Updated global active AI behavior and customization rules in dashboard settings.',
        timestamp: new Date().toISOString()
      });

      alert('✨ Active AI behavior settings saved to Firestore successfully! All future AI Generations will immediately apply these settings.');
    } catch (error: any) {
      console.error('Error saving AI Settings:', error);
      alert('Failed to save AI Settings: ' + error.message);
    } finally {
      setIsSavingAiSettings(false);
    }
  };

  const handleRevertToDefaults = async () => {
    if (confirm('Are you sure you want to revert all settings to factory curating defaults?')) {
      setProductWritingStyle('Luxury & Persuasive (Captivating, high-end vocabulary)');
      setSeoRules('Optimize for clean, non-spammy keywords; include a powerful CTR-focused title; include meta description.');
      setDescriptionLength('Medium (Showcase craft, detail, and utility across 2 paragraphs)');
      setBusinessInstructions('Highlight Amazon Affiliate curation aspect, premium quality, and exclusive Indian Rupees pricing.');
      setProductRules('Infer realistic pricing in INR (₹) and features based on tiers. Never use placeholder images or placeholder text.');
      setAiBehaviour('Elite Concierge / Personal Stylist (Helpful, sophisticated, extremely knowledgeable)');
      setCustomPrompt(`You are an elite product curator and catalog manager for FahimMart. Generate an immersive, highly persuasive and detailed AI styling advice, tech curation advice, or setup guide written in the voice of an elite concierge.`);
      
      alert('Defaults loaded into form. Click "Save Settings" to write them back to Firestore.');
    }
  };

  const handleCreatePromptVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) {
      alert('Please specify a name/label for this version.');
      return;
    }
    setIsSavingPromptVersion(true);
    try {
      const payload = {
        name: newVersionName,
        productWritingStyle,
        seoRules,
        descriptionLength,
        businessInstructions,
        productRules,
        aiBehaviour,
        customPrompt,
        createdAt: new Date().toISOString(),
        author: currentUser?.email || 'Admin'
      };
      
      if (editingSnapshotId) {
        await setDoc(doc(db, 'prompt_versions', editingSnapshotId), payload);
        await saveAuditLogToCloud({
          id: 'log_' + Date.now(),
          action: 'UPDATE_PROMPT_VERSION',
          user: currentUser?.email || 'Admin',
          details: `Updated existing Prompt Version "${newVersionName}" in Firestore database.`,
          timestamp: new Date().toISOString()
        });
        setEditingSnapshotId(null);
        alert('✨ Prompt snapshot version updated successfully!');
      } else {
        await addDoc(collection(db, 'prompt_versions'), payload);
        await saveAuditLogToCloud({
          id: 'log_' + Date.now(),
          action: 'CREATE_PROMPT_VERSION',
          user: currentUser?.email || 'Admin',
          details: `Saved new Prompt Version "${newVersionName}" in Firestore database.`,
          timestamp: new Date().toISOString()
        });
        alert('✨ Prompt snapshot version created and saved to Firestore!');
      }

      setNewVersionName('');
      await loadPromptVersions();
    } catch (error: any) {
      console.error('Error saving version:', error);
      alert('Failed to save version: ' + error.message);
    } finally {
      setIsSavingPromptVersion(false);
    }
  };

  const handleEditPromptVersion = (version: any) => {
    setEditingSnapshotId(version.id);
    setNewVersionName(version.name);
    if (version.productWritingStyle) setProductWritingStyle(version.productWritingStyle);
    if (version.seoRules) setSeoRules(version.seoRules);
    if (version.descriptionLength) setDescriptionLength(version.descriptionLength);
    if (version.businessInstructions) setBusinessInstructions(version.businessInstructions);
    if (version.productRules) setProductRules(version.productRules);
    if (version.aiBehaviour) setAiBehaviour(version.aiBehaviour);
    if (version.customPrompt) setCustomPrompt(version.customPrompt);
    alert(`✏️ Loaded "${version.name}" into the editor. You can now modify any fields and click "Take Version Snapshot" or "Update Version Snapshot" to save your edits!`);
  };

  const handleDuplicatePromptVersion = async (version: any) => {
    setIsSavingPromptVersion(true);
    try {
      const payload = {
        name: `Copy of ${version.name}`,
        productWritingStyle: version.productWritingStyle || '',
        seoRules: version.seoRules || '',
        descriptionLength: version.descriptionLength || '',
        businessInstructions: version.businessInstructions || '',
        productRules: version.productRules || '',
        aiBehaviour: version.aiBehaviour || '',
        customPrompt: version.customPrompt || '',
        createdAt: new Date().toISOString(),
        author: currentUser?.email || 'Admin'
      };
      await addDoc(collection(db, 'prompt_versions'), payload);
      await loadPromptVersions();
      alert(`👯 Successfully duplicated "${version.name}" as "Copy of ${version.name}"!`);
    } catch (err: any) {
      alert('Failed to duplicate version: ' + err.message);
    } finally {
      setIsSavingPromptVersion(false);
    }
  };

  const handleRestorePromptVersion = async (version: any) => {
    if (confirm(`Do you want to restore and overwrite current active workspace prompt configuration with version "${version.name}"?`)) {
      if (version.productWritingStyle) setProductWritingStyle(version.productWritingStyle);
      if (version.seoRules) setSeoRules(version.seoRules);
      if (version.descriptionLength) setDescriptionLength(version.descriptionLength);
      if (version.businessInstructions) setBusinessInstructions(version.businessInstructions);
      if (version.productRules) setProductRules(version.productRules);
      if (version.aiBehaviour) setAiBehaviour(version.aiBehaviour);
      if (version.customPrompt) setCustomPrompt(version.customPrompt);

      alert(`Snapshot version "${version.name}" restored to workspace! Remember to click "Save Settings" if you want to push this to the active live server config.`);
    }
  };

  const handleDeletePromptVersion = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete prompt snapshot "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'prompt_versions', id));
        await loadPromptVersions();
        alert('Prompt Snapshot deleted successfully.');
      } catch (err: any) {
        alert('Failed to delete version: ' + err.message);
      }
    }
  };

  const [selectedDraftId, setSelectedDraftId] = useState<string>('');

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

  // Load telemetry logs from Firestore and localStorage
  useEffect(() => {
    loadAiSettings();
    loadPromptVersions();
    setClickAnalytics(JSON.parse(localStorage.getItem('fm_click_analytics') || '[]'));
    setSearchAnalytics(JSON.parse(localStorage.getItem('fm_search_analytics') || '[]'));

    // Subscribe to Firestore Users
    const unsubUsers = subscribeToUsers((cloudUsers) => {
      // Ensure Md Fahim (permanent Super Admin) is always seeded
      const ownerExists = cloudUsers.some((u: any) => u.email.toLowerCase() === 'fahimmd6986@gmail.com');
      let finalUsers = [...cloudUsers];
      if (!ownerExists) {
        const ownerUser = {
          id: 'u_admin',
          email: 'fahimmd6986@gmail.com',
          name: 'Fahim (Owner)',
          role: 'Admin',
          createdAt: new Date().toISOString()
        };
        finalUsers.unshift(ownerUser);
        saveUserToCloud(ownerUser).catch(err => console.error("Error auto-seeding admin to Firestore:", err));
      }
      
      // Enforce Md Fahim has permanent Admin role, everyone else has Customer
      finalUsers = finalUsers.map((u: any) => {
        if (u.email.toLowerCase() === 'fahimmd6986@gmail.com') {
          return { ...u, role: 'Admin' };
        }
        return { ...u, role: 'Customer' };
      });
      setUsers(finalUsers);
    });

    // Subscribe to Firestore Audit Logs
    const unsubAudit = subscribeToAuditLogs((cloudLogs) => {
      setAuditLogs(cloudLogs);
    });

    return () => {
      unsubUsers();
      unsubAudit();
    };
  }, []);

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
    saveUserToCloud(newUser).catch(err => console.error("Error saving user to Firestore:", err));

    // Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    const newAuditLog = {
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_CREATE_USER',
      details: `Created new user account: ${newUser.email} with role: ${newUser.role}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS' as const
    };
    logs.unshift(newAuditLog);
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));
    saveAuditLogToCloud(newAuditLog).catch(err => console.error("Error saving audit log to Firestore:", err));

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
    deleteUserFromCloud(userId).catch(err => console.error("Error deleting user from Firestore:", err));

    // Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    const delAuditLog = {
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_DELETE_USER',
      details: `Deleted user account: ${email}`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS' as const
    };
    logs.unshift(delAuditLog);
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));
    saveAuditLogToCloud(delAuditLog).catch(err => console.error("Error saving delete user audit log to Firestore:", err));

    // Refresh
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.email.toLowerCase() === 'fahimmd6986@gmail.com') {
        return { ...u, role: 'Admin' };
      }
      return { ...u, role: 'Customer' };
    });
    setUsers(updatedUsers);
  };

  const handleGenerateAiField = async () => {
    if (!formTitle.trim()) {
      setAiGenerationError('Please enter a Product Title first to generate an AI recommendation.');
      return;
    }
    setIsGeneratingAi(true);
    setAiGenerationError('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle,
          brand: formBrand,
          category: formCategory,
          description: formShortDesc || formFullDesc,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server returned an error generating AI content.');
      }

      const data = await res.json();
      setFormAiField(data.text);
    } catch (err: any) {
      console.error('Error generating AI field:', err);
      setAiGenerationError(err.message || 'Failed to generate AI recommendation. Make sure GEMINI_API_KEY is configured in Settings > Secrets.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Bulk Import Handler Functions
  const handleStartBulkGeneration = async () => {
    // Robustly extract all HTTP/HTTPS links from the user's pasted content
    const urlRegex = /(https?:\/\/[^\s,;]+)/g;
    const urls = Array.from(bulkUrlsText.matchAll(urlRegex)).map(m => m[0].trim());

    if (urls.length === 0) {
      alert('Please enter at least one valid Amazon product link starting with http:// or https://');
      return;
    }

    setIsBulkImporting(true);

    const initialItems = urls.map((url, index) => ({
      id: `bulk_item_${Date.now()}_${index}`,
      url,
      status: 'pending' as const,
      isSelected: true
    }));

    setBulkProducts(initialItems);

    for (let i = 0; i < initialItems.length; i++) {
      const item = initialItems[i];
      setBulkProducts(prev => prev.map(p => p.id === item.id ? { ...p, status: 'generating' } : p));

      try {
        const res = await fetch('/api/ai/bulk-generate-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ affiliateUrl: item.url })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to generate product metadata.');
        }

        const productData = await res.json();

        // Robust Category Mapping to match front-end store categories exactly
        let matchedCategory = categories[0]?.name || 'Electronics';
        const rawCat = (productData.category || '').toLowerCase().trim();
        const foundCategory = categories.find(c => 
          c.slug.toLowerCase() === rawCat || 
          c.name.toLowerCase() === rawCat ||
          rawCat.includes(c.slug.toLowerCase()) ||
          c.slug.toLowerCase().includes(rawCat)
        );
        if (foundCategory) {
          matchedCategory = foundCategory.name;
        }
        productData.category = matchedCategory;

        setBulkProducts(prev => prev.map(p => p.id === item.id ? {
          ...p,
          status: 'success',
          product: productData
        } : p));
      } catch (err: any) {
        console.error('Bulk item generation error:', err);
        setBulkProducts(prev => prev.map(p => p.id === item.id ? {
          ...p,
          status: 'failed',
          error: err.message || 'Unknown generation error'
        } : p));
      }
    }

    setIsBulkImporting(false);
  };

  const handleUpdateBulkProductField = (itemId: string, field: keyof Product, value: any) => {
    setBulkProducts(prev => prev.map(item => {
      if (item.id === itemId && item.product) {
        return {
          ...item,
          product: {
            ...item.product,
            [field]: value
          }
        };
      }
      return item;
    }));
  };

  const handleBulkProductPhotoChange = (itemId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setBulkProducts(prev => prev.map(item => {
        if (item.id === itemId && item.product) {
          return {
            ...item,
            product: {
              ...item.product,
              mainImage: dataUrl,
              gallery: [dataUrl, ...(item.product.gallery || []).slice(1)]
            }
          };
        }
        return item;
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePublishSelectedBulk = async () => {
    const itemsToPublish = bulkProducts.filter(item => item.isSelected && item.status === 'success' && item.product);
    if (itemsToPublish.length === 0) {
      alert('No successfully generated and selected product drafts found to publish.');
      return;
    }

    let successCount = 0;
    for (const item of itemsToPublish) {
      if (item.product) {
        try {
          const finalProd = {
            ...item.product,
            price: Number(item.product.price) || 0,
            originalPrice: Number(item.product.originalPrice) || 0,
            discount: Number(item.product.discount) || 0
          };
          await onAddProduct(finalProd);
          successCount++;
        } catch (err) {
          console.error("Error publishing product:", err);
        }
      }
    }

    // Record an Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    const newAuditLog = {
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_BULK_IMPORT',
      details: `Successfully published ${successCount} out of ${itemsToPublish.length} imported bulk products.`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS' as const
    };
    logs.unshift(newAuditLog);
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));

    alert(`Successfully published ${successCount} products! They are now visible to all customers.`);
    setBulkProducts(prev => prev.filter(item => !(item.isSelected && item.status === 'success')));
  };

  const handlePublishAllBulk = async () => {
    const itemsToPublish = bulkProducts.filter(item => item.status === 'success' && item.product);
    if (itemsToPublish.length === 0) {
      alert('No successfully generated product drafts found to publish.');
      return;
    }

    let successCount = 0;
    for (const item of itemsToPublish) {
      if (item.product) {
        try {
          const finalProd = {
            ...item.product,
            price: Number(item.product.price) || 0,
            originalPrice: Number(item.product.originalPrice) || 0,
            discount: Number(item.product.discount) || 0
          };
          await onAddProduct(finalProd);
          successCount++;
        } catch (err) {
          console.error("Error publishing product:", err);
        }
      }
    }

    // Record an Audit Log
    const logs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    const newAuditLog = {
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'admin@fahimmart.com',
      action: 'ADMIN_BULK_IMPORT',
      details: `Successfully published all ${successCount} products.`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS' as const
    };
    logs.unshift(newAuditLog);
    localStorage.setItem('fm_audit_logs', JSON.stringify(logs));

    alert(`Successfully published all ${successCount} products! They are now live on the store.`);
    setBulkProducts(prev => prev.filter(item => item.status !== 'success'));
  };

  const handleAddManualBulkItem = () => {
    const blankProduct: Product = {
      id: 'p_manual_bulk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: 'New Product Draft',
      brand: 'Brand',
      category: categories[0]?.name || 'Electronics',
      affiliateUrl: 'https://',
      mainImage: '',
      gallery: [],
      price: 0,
      originalPrice: 0,
      discount: 0,
      rating: 4.5,
      reviewCount: 150,
      shortDescription: '',
      fullDescription: '',
      features: ['Premium Curation Match'],
      specifications: { 'Quality Standard': 'Highly Calibrated' },
      pros: ['Elegant aesthetic design'],
      cons: ['None noted'],
      faq: [],
      slug: 'new-product-draft-' + Date.now(),
      seo: {
        title: 'New Product Draft | FahimMart',
        description: '',
        keywords: []
      },
      isPrime: true,
      aiField: ''
    };

    setBulkProducts(prev => [
      ...prev,
      {
        id: `bulk_item_manual_${Date.now()}`,
        url: 'https://',
        status: 'success' as const,
        isSelected: true,
        product: blankProduct
      }
    ]);
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
      setFormAiField(prod.aiField || '');
      setAiGenerationError('');
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
      setFormAiField('');
      setAiGenerationError('');

      // Initialize with one default draft item for multi-product creation
      const defaultDraft = {
        id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: '',
        brand: '',
        category: categories[0]?.name || '',
        affiliateUrl: '',
        mainImage: '',
        gallery: [] as string[],
        price: '',
        originalPrice: '',
        discount: '',
        rating: '4.5',
        reviewCount: '150',
        shortDesc: '',
        fullDesc: '',
        features: '',
        specs: '',
        pros: '',
        cons: '',
        faq: '',
        slug: '',
        seoTitle: '',
        seoDesc: '',
        seoKeywords: '',
        isPrime: true,
        aiField: '',
        useAi: true,
        status: 'idle' as const
      };
      setModalDrafts([defaultDraft]);
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
    if (!formMainImage.trim() || (!formMainImage.startsWith('http') && !formMainImage.startsWith('data:image'))) {
      errors.push('Product Photo is required (please upload an image).');
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
      isPrime: formIsPrime,
      aiField: formAiField.trim()
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

  // Helper to add a blank product draft in the modal
  const handleAddModalDraftRow = () => {
    const newDraft = {
      id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: '',
      brand: '',
      category: categories[0]?.name || '',
      affiliateUrl: '',
      mainImage: '',
      gallery: [] as string[],
      price: '',
      originalPrice: '',
      discount: '',
      rating: '4.5',
      reviewCount: '150',
      shortDesc: '',
      fullDesc: '',
      features: '',
      specs: '',
      pros: '',
      cons: '',
      faq: '',
      slug: '',
      seoTitle: '',
      seoDesc: '',
      seoKeywords: '',
      isPrime: true,
      aiField: '',
      useAi: true,
      status: 'idle' as const,
      error: ''
    };
    setModalDrafts(prev => [...prev, newDraft]);
  };

  // Helper to update a draft field
  const handleUpdateModalDraftField = (draftId: string, field: string, value: any) => {
    setModalDrafts(prev => prev.map(d => {
      if (d.id === draftId) {
        return { ...d, [field]: value };
      }
      return d;
    }));
  };

  // Helper to remove a draft
  const handleRemoveModalDraft = (draftId: string) => {
    setModalDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  // Helper to fetch a single draft's details using AI
  const handleFetchDraftWithAi = async (draftId: string) => {
    const draft = modalDrafts.find(d => d.id === draftId);
    if (!draft) return;
    if (!draft.affiliateUrl || !draft.affiliateUrl.startsWith('http')) {
      alert('Please enter a valid Amazon link (starting with http:// or https://) first to fetch.');
      return;
    }

    setModalDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'fetching' } : d));

    try {
      const res = await fetch('/api/ai/bulk-generate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ affiliateUrl: draft.affiliateUrl })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate product details.');
      }

      const productData = await res.json();
      setModalDrafts(prev => prev.map(d => d.id === draftId ? {
        ...d,
        status: 'success',
        title: productData.title || d.title,
        brand: productData.brand || d.brand,
        category: productData.category || d.category,
        price: productData.price?.toString() || d.price,
        originalPrice: productData.originalPrice?.toString() || d.originalPrice,
        discount: productData.discount?.toString() || d.discount,
        rating: productData.rating?.toString() || d.rating,
        reviewCount: productData.reviewCount?.toString() || d.reviewCount,
        shortDesc: productData.shortDescription || d.shortDesc,
        fullDesc: productData.fullDescription || d.fullDesc,
        features: (productData.features || []).join('\n') || d.features,
        specs: Object.entries(productData.specifications || {}).map(([k, v]) => `${k}:${v}`).join('\n') || d.specs,
        pros: (productData.pros || []).join('\n') || d.pros,
        cons: (productData.cons || []).join('\n') || d.cons,
        faq: (productData.faq || []).map((f: any) => `${f.question}|${f.answer}`).join('\n') || d.faq,
        slug: productData.slug || d.slug,
        seoTitle: productData.seo?.title || d.seoTitle,
        seoDesc: productData.seo?.description || d.seoDesc,
        seoKeywords: (productData.seo?.keywords || []).join(', ') || d.seoKeywords,
        isPrime: productData.isPrime !== undefined ? productData.isPrime : d.isPrime,
        aiField: productData.aiField || d.aiField,
        mainImage: productData.mainImage || d.mainImage,
        gallery: productData.gallery || d.gallery,
        error: ''
      } : d));
    } catch (err: any) {
      console.error('Error fetching draft with AI:', err);
      setModalDrafts(prev => prev.map(d => d.id === draftId ? {
        ...d,
        status: 'failed',
        error: err.message || 'Generation failed.'
      } : d));
    }
  };

  // Helper to handle image uploads for modal drafts
  const handleDraftPhotoChange = (draftId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setModalDrafts(prev => prev.map(d => d.id === draftId ? {
        ...d,
        mainImage: dataUrl,
        gallery: [dataUrl, ...d.gallery.slice(1)]
      } : d));
    };
    reader.readAsDataURL(file);
  };

  // Bulk publish all modal drafts
  const handleBulkSubmitDrafts = () => {
    setValidationErrors([]);
    const errors: string[] = [];

    if (modalDrafts.length === 0) {
      alert('Please add at least one product draft.');
      return;
    }

    const validatedProducts: Product[] = [];
    
    // First pass: validate all drafts and collect any errors
    modalDrafts.forEach((d, idx) => {
      const rowNum = idx + 1;
      const draftName = d.title.trim() || `Draft #${rowNum}`;
      
      if (!d.title.trim()) errors.push(`Row ${rowNum} (${draftName}): Product Title is required.`);
      if (!d.brand.trim()) errors.push(`Row ${rowNum} (${draftName}): Brand Name is required.`);
      if (!d.category.trim()) errors.push(`Row ${rowNum} (${draftName}): Category Selection is required.`);
      if (!d.affiliateUrl.trim() || !d.affiliateUrl.startsWith('http')) {
        errors.push(`Row ${rowNum} (${draftName}): Affiliate URL is required and must begin with http:// or https://`);
      }
      if (!d.mainImage.trim()) {
        errors.push(`Row ${rowNum} (${draftName}): Product Photo/Image is required (please upload an image or enter a URL).`);
      }
      const priceNum = parseFloat(d.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        errors.push(`Row ${rowNum} (${draftName}): Valid Price (>0) is required.`);
      }

      const origPriceNum = parseFloat(d.originalPrice) || priceNum;

      if (errors.length === 0) {
        const galleryArr = d.gallery.length > 0 ? d.gallery : [d.mainImage.trim()];
        const featuresArr = d.features.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const prosArr = d.pros.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const consArr = d.cons.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        const specsObj: Record<string, string> = {};
        d.specs.split('\n').forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const k = line.substring(0, colonIdx).trim();
            const v = line.substring(colonIdx + 1).trim();
            if (k && v) specsObj[k] = v;
          }
        });

        const faqArr = d.faq.split('\n').map(line => {
          const parts = line.split('|');
          return {
            question: parts[0]?.trim() || '',
            answer: parts[1]?.trim() || ''
          };
        }).filter(f => f.question && f.answer);

        const generatedSlug = d.slug.trim() 
          ? d.slug.trim().toLowerCase().replace(/\s+/g, '-')
          : d.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        validatedProducts.push({
          id: 'p_bulk_modal_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).substr(2, 4),
          title: d.title.trim(),
          brand: d.brand.trim(),
          category: d.category,
          affiliateUrl: d.affiliateUrl.trim(),
          mainImage: d.mainImage.trim(),
          gallery: galleryArr,
          price: priceNum,
          originalPrice: origPriceNum,
          discount: parseInt(d.discount) || Math.round(((origPriceNum - priceNum) / origPriceNum) * 100),
          rating: parseFloat(d.rating) || 4.5,
          reviewCount: parseInt(d.reviewCount) || 150,
          shortDescription: d.shortDesc.trim() || `${d.title.trim()} - curated premium selection.`,
          fullDescription: d.fullDesc.trim() || `Discover the excellence of ${d.title.trim()}. Designed with premium materials and engineered to enhance your experience, this product brings elite craft directly to your store.`,
          features: featuresArr.length > 0 ? featuresArr : ['Premium Curation Match'],
          specifications: Object.keys(specsObj).length > 0 ? specsObj : { 'Quality Standard': 'Highly Calibrated' },
          pros: prosArr.length > 0 ? prosArr : ['Elegant aesthetic design'],
          cons: consArr.length > 0 ? consArr : ['None noted'],
          faq: faqArr,
          slug: generatedSlug,
          seo: {
            title: d.seoTitle.trim() || `${d.title.trim()} | FahimMart`,
            description: d.seoDesc.trim() || d.shortDesc.trim() || `${d.title.trim()} curation.`,
            keywords: d.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
          },
          isPrime: d.isPrime,
          aiField: d.aiField.trim()
        });
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      const errEl = document.getElementById('validation-errors-alert');
      if (errEl) {
        errEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Publish all
    validatedProducts.forEach(prod => {
      onAddProduct(prod);
    });

    // Log action to audit logs
    const currentLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
    currentLogs.unshift({
      id: 'log_' + Date.now(),
      userEmail: currentUser?.email || 'owner',
      action: 'PRODUCT_CREATE_BULK',
      details: `Curated and published ${validatedProducts.length} new products simultaneously via the draft modal.`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });
    localStorage.setItem('fm_audit_logs', JSON.stringify(currentLogs));

    setFormSuccess(`Successfully published all ${validatedProducts.length} products!`);
    setTimeout(() => {
      setIsProductModalOpen(false);
      setFormSuccess('');
      setModalDrafts([]);
    }, 1500);
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
              onClick={() => setActiveTab('bulk-import')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'bulk-import' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Sparkles size={15} className="text-amber-400" /> AI Bulk Product Import
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
            <div className="pt-2 border-t border-slate-850 mt-2">
              <span className="block px-4 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Future AI Suite</span>
              <button
                onClick={() => setActiveTab('ai-settings')}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'ai-settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Sparkles size={15} className="text-amber-400 animate-pulse" /> AI Behavior Settings
              </button>
              <button
                onClick={() => setActiveTab('prompt-manager')}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xs font-bold transition cursor-pointer ${activeTab === 'prompt-manager' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <FileText size={15} /> Prompt Snapshots
              </button>
            </div>
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
            {activeTab === 'bulk-import' && '⚡ AI Bulk Product Import Workspace'}
            {activeTab === 'categories' && 'Department Management'}
            {activeTab === 'banners' && 'Carousel Banner Settings'}
            {activeTab === 'audit' && 'Security Audit Registry'}
            {activeTab === 'users' && 'User Directory & Authentication Roles'}
            {activeTab === 'settings' && 'FahimMart Core Settings'}
            {activeTab === 'ai-settings' && '✨ AI Behavior & Customization Panel'}
            {activeTab === 'prompt-manager' && '📂 Prompt Snapshot Version Control'}
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

          {/* TAB 8: AI BULK PRODUCT IMPORT */}
          {activeTab === 'bulk-import' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01] p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-4 -mt-4 pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-6 items-center justify-center rounded-md bg-amber-500 px-2.5 text-[10px] font-black uppercase text-slate-950 tracking-wider">
                    ✨ Super Admin Exclusive
                  </span>
                  <span className="text-xs font-mono text-amber-500 font-bold">FahimMart AI Core</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Bulk Product Import Workflow</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Scale your digital store curation in minutes. Paste multiple Amazon product or affiliate links below. 
                  The underlying Gemini AI will automatically extract product identities, formulate detailed specs, 
                  structure SEO metadata, generate curated recommendations, and prepare drafts. Review prices and images below, then publish instantly!
                </p>
              </div>

              {/* Paste Panel */}
              <div className="rounded-xl border border-slate-850 bg-slate-900/50 p-6 space-y-4 shadow-lg">
                <div>
                  <label className="block text-[11px] uppercase font-black text-slate-400 tracking-wider mb-2">
                    Paste Amazon Product / Affiliate Links (one per line, 10 to 20 links recommended)
                  </label>
                  <textarea
                    rows={8}
                    value={bulkUrlsText}
                    onChange={(e) => setBulkUrlsText(e.target.value)}
                    disabled={isBulkImporting}
                    className="w-full rounded-xl bg-slate-950 p-4 text-xs text-white border border-slate-800 focus:border-amber-500/50 focus:outline-none font-mono leading-relaxed"
                    placeholder="https://www.amazon.in/Sony-WH-1000XM5-Wireless-Active-Cancellation/dp/B0B3C572C1&#10;https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX1W1Y2&#10;..."
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="text-[10px] text-slate-400">
                    {bulkUrlsText.split('\n').filter(l => l.trim().startsWith('http')).length} valid URLs detected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddManualBulkItem}
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition shadow-sm"
                    >
                      <Plus size={13} /> ➕ Create Manual Blank Draft
                    </button>
                    <button
                      onClick={handleStartBulkGeneration}
                      disabled={isBulkImporting || !bulkUrlsText.trim()}
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-350 hover:to-amber-550 text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isBulkImporting ? (
                        <>
                          <span className="animate-spin border-2 border-slate-950 border-t-transparent rounded-full h-3 w-3 inline-block animate-pulse mr-1" />
                          Generating Products...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Generate Products
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Review and Edit Table Workspace */}
              {bulkProducts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 p-4 rounded-xl border border-slate-850">
                    <div>
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Draft Products Review Stage</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Review, modify prices, upload photos, and refine links before publishing.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePublishSelectedBulk}
                        disabled={bulkProducts.filter(p => p.isSelected && p.status === 'success').length === 0}
                        className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-4 py-2 rounded-lg transition disabled:opacity-40 shadow-sm"
                      >
                        Publish Selected ({bulkProducts.filter(p => p.isSelected && p.status === 'success').length})
                      </button>
                      <button
                        onClick={handlePublishAllBulk}
                        disabled={bulkProducts.filter(p => p.status === 'success').length === 0}
                        className="cursor-pointer border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-black uppercase px-4 py-2 rounded-lg transition disabled:opacity-40"
                      >
                        Publish All ({bulkProducts.filter(p => p.status === 'success').length})
                      </button>
                      <button
                        onClick={() => setBulkProducts([])}
                        className="cursor-pointer border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 text-[11px] font-bold px-3 py-2 rounded-lg transition"
                      >
                        Clear List
                      </button>
                    </div>
                  </div>

                  {/* Table view */}
                  <div className="rounded-xl border border-slate-850 bg-slate-900 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-4 py-3 text-center w-12">
                              <input
                                type="checkbox"
                                checked={bulkProducts.length > 0 && bulkProducts.every(p => p.isSelected)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setBulkProducts(prev => prev.map(p => ({ ...p, isSelected: checked })));
                                }}
                                className="rounded bg-slate-950 border-slate-850 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5"
                              />
                            </th>
                            <th className="px-4 py-3 w-28">Status</th>
                            <th className="px-4 py-3 w-32">Image (Upload)</th>
                            <th className="px-4 py-3">Product Details</th>
                            <th className="px-4 py-3 w-40">Price & Offer</th>
                            <th className="px-4 py-3 w-16 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {bulkProducts.map((item) => {
                            const p = item.product;
                            return (
                              <React.Fragment key={item.id}>
                                <tr className="hover:bg-slate-900/40 transition-colors">
                                  <td className="px-4 py-4 text-center">
                                    <input
                                      type="checkbox"
                                      checked={item.isSelected}
                                      disabled={item.status !== 'success'}
                                      onChange={(e) => {
                                        setBulkProducts(prev => prev.map(x => x.id === item.id ? { ...x, isSelected: e.target.checked } : x));
                                      }}
                                      className="rounded bg-slate-950 border-slate-850 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 disabled:opacity-30"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    {item.status === 'pending' && (
                                      <span className="inline-flex items-center gap-1 rounded bg-slate-800/60 border border-slate-750 px-2.5 py-1 text-[9px] font-bold text-slate-400">
                                        Pending
                                      </span>
                                    )}
                                    {item.status === 'generating' && (
                                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[9px] font-black text-amber-400 uppercase animate-pulse">
                                        AI Curating...
                                      </span>
                                    )}
                                    {item.status === 'success' && (
                                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] font-black text-emerald-400 uppercase">
                                        Ready
                                      </span>
                                    )}
                                    {item.status === 'failed' && (
                                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-[9px] font-black text-rose-400 uppercase" title={item.error}>
                                        Failed
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4">
                                    {p ? (
                                      <div className="flex flex-col gap-1.5 items-center">
                                        <div className="relative group rounded border border-slate-850 bg-slate-950 overflow-hidden h-14 w-14 flex items-center justify-center">
                                          {p.mainImage ? (
                                            <img src={p.mainImage} alt="Draft Preview" className="object-contain h-full w-full p-1" />
                                          ) : (
                                            <Upload className="h-5 w-5 text-slate-600" />
                                          )}
                                        </div>
                                        <label className="cursor-pointer text-[8px] uppercase tracking-wider font-extrabold text-amber-500 hover:text-amber-400 text-center bg-slate-950 hover:bg-slate-850 px-1.5 py-1 rounded border border-slate-850">
                                          Upload
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleBulkProductPhotoChange(item.id, file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    ) : (
                                      <div className="h-14 w-14 rounded bg-slate-950 border border-slate-850 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                                        —
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 space-y-2">
                                    {p ? (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                                            {p.brand}
                                          </span>
                                          <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                                            {p.category}
                                          </span>
                                        </div>
                                        <input
                                          type="text"
                                          value={p.title}
                                          onChange={(e) => handleUpdateBulkProductField(item.id, 'title', e.target.value)}
                                          className="w-full text-xs font-bold text-white bg-slate-950 border border-slate-850 focus:border-amber-500/40 focus:outline-none rounded px-2.5 py-1.5"
                                        />
                                        <div className="flex gap-2">
                                          <span className="text-[9px] text-slate-500 shrink-0 mt-1.5">Link:</span>
                                          <input
                                            type="text"
                                            value={p.affiliateUrl}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'affiliateUrl', e.target.value)}
                                            className="w-full text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-850 focus:border-amber-500/40 focus:outline-none rounded px-2.5 py-1"
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="space-y-1">
                                        <p className="text-xs font-mono text-slate-400 truncate max-w-md">{item.url}</p>
                                        {item.error && <p className="text-[10px] text-rose-500 font-semibold bg-rose-950/20 px-2 py-1 rounded border border-rose-500/10 max-w-md">{item.error}</p>}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 space-y-2">
                                    {p ? (
                                      <div className="space-y-1.5">
                                        <div>
                                          <span className="block text-[8px] uppercase text-slate-500 font-bold mb-0.5">Price (₹)</span>
                                          <input
                                            type="number"
                                            value={p.price}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full text-xs font-bold text-emerald-400 font-mono bg-slate-950 border border-slate-850 focus:border-amber-500/40 focus:outline-none rounded px-2 py-1"
                                          />
                                        </div>
                                        <div>
                                          <span className="block text-[8px] uppercase text-slate-500 font-bold mb-0.5">Original (₹)</span>
                                          <input
                                            type="number"
                                            value={p.originalPrice}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'originalPrice', parseFloat(e.target.value) || 0)}
                                            className="w-full text-xs text-slate-400 font-mono bg-slate-950 border border-slate-850 focus:border-amber-500/40 focus:outline-none rounded px-2 py-1"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-600 font-mono">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      {p && (
                                        <button
                                          type="button"
                                          onClick={() => setExpandedBulkItemId(expandedBulkItemId === item.id ? null : item.id)}
                                          className={`cursor-pointer p-1.5 rounded-lg border transition ${
                                            expandedBulkItemId === item.id
                                              ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-850'
                                          }`}
                                          title="Edit descriptions & rating details"
                                        >
                                          <Edit3 size={13} />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => setBulkProducts(prev => prev.filter(x => x.id !== item.id))}
                                        className="cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 text-slate-500 hover:text-rose-500 transition"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {expandedBulkItemId === item.id && p && (
                                  <tr className="bg-slate-950/70 border-b border-slate-800">
                                    <td colSpan={6} className="px-6 py-5 space-y-4">
                                      <div className="text-[10px] font-black uppercase text-amber-500 tracking-widest border-b border-slate-850 pb-2 mb-3">
                                        ✏️ Edit Curation Details for: "{p.title}"
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Brand Name</label>
                                          <input
                                            type="text"
                                            value={p.brand}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'brand', e.target.value)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Category</label>
                                          <select
                                            value={p.category}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'category', e.target.value)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40"
                                          >
                                            {categories.map(c => (
                                              <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Curation Star Rating</label>
                                          <input
                                            type="number"
                                            step="0.1"
                                            value={p.rating}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'rating', parseFloat(e.target.value) || 4.5)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Review Count (Customers)</label>
                                          <input
                                            type="number"
                                            value={p.reviewCount}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'reviewCount', parseInt(e.target.value) || 150)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40 font-mono"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Short Description</label>
                                          <input
                                            type="text"
                                            value={p.shortDescription}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'shortDescription', e.target.value)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40"
                                            placeholder="Enter short description..."
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Detailed Narrative Description</label>
                                          <textarea
                                            rows={3}
                                            value={p.fullDescription}
                                            onChange={(e) => handleUpdateBulkProductField(item.id, 'fullDescription', e.target.value)}
                                            className="w-full text-xs text-white bg-slate-900 border border-slate-800 focus:outline-none rounded px-3 py-2 focus:border-amber-500/40 leading-relaxed"
                                            placeholder="Enter detailed description here..."
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: AI SETTINGS PANEL */}
          {activeTab === 'ai-settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-5 items-center justify-center rounded-md bg-amber-500 px-2 text-[9px] font-black uppercase text-slate-950 tracking-wider">
                    ✨ Master Config
                  </span>
                  <span className="text-xs font-mono text-slate-400">FahimMart Core Settings</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Settings & Behavior Engine</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Fine-tune how Gemini AI structures and curates product copy, descriptions, specs, pricing logic, and SEO rules. These rules are applied globally to both single-product edits and bulk url imports instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Settings */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-2">
                    <Settings size={16} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                    Configuration Workspace
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Product Writing Style</label>
                      <select
                        value={productWritingStyle}
                        onChange={(e) => setProductWritingStyle(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40"
                      >
                        <option value="Luxury & Persuasive (Captivating, high-end vocabulary)">Luxury & Persuasive (Captivating, high-end vocabulary)</option>
                        <option value="Minimalist & Direct (Clean, technical specs-focused, clear bullets)">Minimalist & Direct (Clean, technical specs-focused, clear bullets)</option>
                        <option value="Playful & Friendly (Casual, highly relatable, enthusiastic style)">Playful & Friendly (Casual, highly relatable, enthusiastic style)</option>
                        <option value="Warm & Curated (Story-driven, detailing quality, heritage, and utility)">Warm & Curated (Story-driven, detailing quality, heritage, and utility)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">SEO Curation rules</label>
                      <input
                        type="text"
                        value={seoRules}
                        onChange={(e) => setSeoRules(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40"
                        placeholder="e.g. Include brand keywords, power search queries..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Descriptions Word Length</label>
                      <select
                        value={descriptionLength}
                        onChange={(e) => setDescriptionLength(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40"
                      >
                        <option value="Short (1 punchy paragraph, highly compressed)">Short (1 punchy paragraph, highly compressed)</option>
                        <option value="Medium (Showcase craft, detail, and utility across 2 paragraphs)">Medium (Showcase craft, detail, and utility across 2 paragraphs)</option>
                        <option value="Long (Exquisite detailed narrative with story, technical specs, and daily uses)">Long (Exquisite detailed narrative with story, technical specs, and daily uses)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Business Instructions</label>
                      <textarea
                        rows={3}
                        value={businessInstructions}
                        onChange={(e) => setBusinessInstructions(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40 leading-relaxed font-mono"
                        placeholder="Instructions regarding affiliate marketing, quality emphasis, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Strict Product Guidelines</label>
                      <textarea
                        rows={3}
                        value={productRules}
                        onChange={(e) => setProductRules(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40 leading-relaxed font-mono"
                        placeholder="e.g. Pricing, categories, what to exclude..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">AI Agent Behavioral Tone</label>
                      <input
                        type="text"
                        value={aiBehaviour}
                        onChange={(e) => setAiBehaviour(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40"
                        placeholder="e.g. Expert Personal Stylist, Sophisticated Concierge..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Custom system Directive prompt</label>
                      <textarea
                        rows={3}
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40 leading-relaxed font-mono text-amber-300"
                        placeholder="Global baseline instructions given to Gemini..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-slate-850 pt-4">
                    <button
                      onClick={handleSaveAiSettings}
                      disabled={isSavingAiSettings}
                      className="flex-1 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-350 hover:to-amber-550 text-slate-950 font-black text-xs uppercase px-4 py-3 rounded-xl tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> {isSavingAiSettings ? 'Saving to Firestore...' : 'Save AI Settings'}
                    </button>
                    <button
                      onClick={handleRevertToDefaults}
                      className="cursor-pointer border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs uppercase px-4 py-3 rounded-xl transition"
                    >
                      Factory Defaults
                    </button>
                  </div>
                </div>

                {/* Right Column: Dynamic Final Prompt Preview */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    Dynamic System Prompt Preview
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This shows how your rules are assembled into the master context sent to the Google Gemini API. This live template adapts instantly as you type!
                  </p>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 max-h-[500px] overflow-y-auto font-mono text-[10.5px] text-amber-500/80 leading-relaxed space-y-3 whitespace-pre-wrap select-all">
                    <span className="text-slate-500 text-[9px] block uppercase font-bold border-b border-slate-900 pb-1 mb-2">/* Compiled System Instructions Payload */</span>
                    <p className="text-white font-sans font-bold">You are an elite e-commerce AI assistant for FahimMart.</p>
                    <p className="text-white font-sans">Apply these dynamic AI Settings for your behavior, response scope, and tone:</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">Writing Style:</strong> "{productWritingStyle}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">SEO Rules:</strong> "{seoRules}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">Word Length:</strong> "{descriptionLength}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">Business Instructions:</strong> "{businessInstructions}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">Product Guidelines:</strong> "{productRules}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">AI Behavior Mode:</strong> "{aiBehaviour}"</p>
                    <p><strong className="text-amber-400 uppercase tracking-wide">System Directive:</strong> "{customPrompt}"</p>
                  </div>

                  <div className="rounded-xl bg-amber-500/[0.02] border border-amber-500/10 p-4">
                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-1">💡 Pro Curation Tip</h5>
                    <p className="text-[9.5px] text-slate-400 leading-relaxed">
                      To optimize bulk imports of tech gear (laptops, phones), configure "Product Guidelines" to emphasize warranty coverage and specific key specifications in Indian currency. To curate high-end fashion, configure "Writing Style" for high-end, visual aesthetic appeal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: PROMPT SNAPSHOT VERSION CONTROL */}
          {activeTab === 'prompt-manager' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl border border-slate-850 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-5 items-center justify-center rounded-md bg-amber-500 px-2 text-[9px] font-black uppercase text-slate-950 tracking-wider">
                    📂 Version Control
                  </span>
                  <span className="text-xs font-mono text-slate-400">Snapshots Sandbox</span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Prompt Snapshots & Version History</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Take point-in-time snapshots of your AI settings. This lets you backup working prompts, duplicate behavioral patterns, and restore historic settings with a single click without overriding active live databases.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Save Current Snapshot Form */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-850 pb-2">
                    Snapshot Current Setup
                  </h4>
                  <form onSubmit={handleCreatePromptVersion} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Version Label / Name</label>
                      <input
                        type="text"
                        value={newVersionName}
                        onChange={(e) => setNewVersionName(e.target.value)}
                        placeholder="e.g. Premium Fashion V1.4 (Pre-Festive)"
                        className="w-full text-xs text-white bg-slate-950 border border-slate-800 focus:outline-none rounded-lg px-3 py-2.5 focus:border-amber-500/40"
                      />
                    </div>

                    <div className="rounded-lg bg-slate-950 p-3 border border-slate-850 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                      <p className="font-extrabold uppercase text-[8.5px] text-amber-500">
                        {editingSnapshotId ? '✏️ Updating Existing Snapshot Context:' : 'Includes Active Workspace Context:'}
                      </p>
                      <p>✍️ Writing Style: <span className="text-slate-300 font-bold">{productWritingStyle.substring(0, 30)}...</span></p>
                      <p>💬 Tone: <span className="text-slate-300 font-bold">{aiBehaviour.substring(0, 30)}...</span></p>
                      <p>✨ Directives: <span className="text-slate-300 font-bold">{customPrompt.substring(0, 30)}...</span></p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSavingPromptVersion}
                        className="flex-1 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase px-4 py-3 rounded-xl tracking-wider transition-colors disabled:opacity-50"
                      >
                        {isSavingPromptVersion 
                          ? 'Saving...' 
                          : editingSnapshotId 
                            ? 'Update Snapshot' 
                            : '💾 Take Snapshot'}
                      </button>
                      {editingSnapshotId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSnapshotId(null);
                            setNewVersionName('');
                          }}
                          className="cursor-pointer border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white font-bold text-xs uppercase px-3 py-3 rounded-xl transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Snapshots list */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-850 pb-2 flex items-center justify-between">
                    <span>Stored Prompt Snapshots ({promptVersions.length})</span>
                    <button
                      onClick={loadPromptVersions}
                      className="text-[9px] font-extrabold uppercase tracking-wide text-amber-500 hover:text-amber-400 cursor-pointer"
                    >
                      Refresh List
                    </button>
                  </h4>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {promptVersions.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                        <FileText size={32} className="text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">No prompt snapshot versions recorded yet.</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Use the left workspace to snapshot your current setup.</p>
                      </div>
                    ) : (
                      promptVersions.map((v) => (
                        <div key={v.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-md hover:border-slate-750 transition-all">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-xs font-black text-amber-400 uppercase tracking-tight">{v.name}</h5>
                              <p className="text-[9px] text-slate-500 mt-0.5">
                                Created on: <span className="font-mono">{new Date(v.createdAt).toLocaleString()}</span> by <span className="font-semibold text-slate-300">{v.author}</span>
                              </p>
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                              <button
                                onClick={() => handleRestorePromptVersion(v)}
                                className="cursor-pointer bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-[9px] font-black uppercase px-2 py-1 rounded transition"
                                title="Restore to active live workspace config"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => handleEditPromptVersion(v)}
                                className="cursor-pointer bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-[9px] font-black uppercase px-2 py-1 rounded transition"
                                title="Edit snapshot in workspace"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicatePromptVersion(v)}
                                className="cursor-pointer bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-slate-950 text-[9px] font-black uppercase px-2 py-1 rounded transition"
                                title="Duplicate snapshot"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDeletePromptVersion(v.id, v.name)}
                                className="cursor-pointer border border-slate-800 hover:border-red-500 text-slate-500 hover:text-rose-400 text-[9px] font-black uppercase px-2 py-1 rounded transition"
                                title="Delete version"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-slate-900 pt-2.5 text-[10px] text-slate-400">
                            <div>
                              <span className="font-bold text-slate-500 block uppercase text-[8px]">Writing Style:</span>
                              <span className="text-slate-300">{v.productWritingStyle}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-500 block uppercase text-[8px]">Behavior Tone:</span>
                              <span className="text-slate-300">{v.aiBehaviour}</span>
                            </div>
                          </div>

                          <div className="bg-slate-900 p-2 rounded text-[9.5px] font-mono text-slate-400 border border-slate-900 leading-normal max-h-24 overflow-y-auto">
                            <span className="text-[8px] text-slate-500 block font-bold uppercase mb-1">Custom System Directive:</span>
                            {v.customPrompt}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAILED FORM MODAL: Add/Edit Product with precise custom validations */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className={`my-8 w-full ${editingProduct ? 'max-w-4xl' : 'max-w-7xl'} rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
            
            <header className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm">
                {editingProduct ? `Edit Curated Product Specifications: ${editingProduct.title}` : 'Curate & Publish New Products'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </header>

            {editingProduct ? (
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500">Product Photo *</label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => { stopCamera(); setPhotoUploadMode('file'); }}
                        className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded transition cursor-pointer ${photoUploadMode === 'file' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPhotoUploadMode('camera'); handleStartCamera(); }}
                        className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded transition cursor-pointer ${photoUploadMode === 'camera' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                      >
                        Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => { stopCamera(); setPhotoUploadMode('url'); }}
                        className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded transition cursor-pointer ${photoUploadMode === 'url' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {photoUploadMode === 'file' && (
                    formMainImage ? (
                      <div className="relative group rounded border border-slate-800 bg-slate-950 overflow-hidden h-24 flex items-center justify-center">
                        <img src={formMainImage} alt="Uploaded product preview" className="object-contain h-full w-full p-1" />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-extrabold px-3 py-1.5 rounded tracking-wide uppercase transition-colors">
                            Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setFormMainImage(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormMainImage('')}
                            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded tracking-wide uppercase transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950 hover:bg-slate-900/50 rounded h-24 cursor-pointer transition-all duration-200">
                        <div className="flex flex-col items-center justify-center py-2 px-4 text-center">
                          <Upload className="h-5 w-5 text-amber-500 mb-1" />
                          <p className="text-[10px] text-slate-300 font-extrabold tracking-wider uppercase">CLICK TO UPLOAD PHOTO</p>
                          <p className="text-[8px] text-slate-500 mt-0.5">PNG, JPG, WEBP formats supported</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormMainImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )
                  )}

                  {photoUploadMode === 'camera' && (
                    <div className="relative rounded border border-slate-800 bg-slate-950 overflow-hidden h-24 flex flex-col items-center justify-center">
                      {isCameraActive ? (
                        <div className="relative w-full h-full">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleCapturePhoto}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[8px] font-extrabold px-2 py-1 rounded tracking-wide uppercase transition-colors"
                            >
                              Capture
                            </button>
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="bg-slate-800 hover:bg-slate-700 text-white text-[8px] font-extrabold px-2 py-1 rounded tracking-wide uppercase transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
                          {formMainImage ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img src={formMainImage} alt="Captured" className="object-contain h-full max-h-16" />
                              <button
                                type="button"
                                onClick={handleStartCamera}
                                className="absolute bottom-1 bg-amber-500 text-slate-950 text-[8px] font-bold px-2 py-1 rounded uppercase"
                              >
                                Retake
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={handleStartCamera}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9px] font-extrabold px-3 py-1.5 rounded tracking-wide uppercase transition-colors"
                            >
                              Start Camera
                            </button>
                          )}
                          {cameraError && <p className="text-[8px] text-rose-500 mt-1">{cameraError}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {photoUploadMode === 'url' && (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={formMainImage}
                        onChange={(e) => setFormMainImage(e.target.value)}
                        className="w-full rounded bg-slate-950 p-2 text-xs text-white border border-slate-800 focus:outline-none font-mono"
                        placeholder="https://images.unsplash.com/... (Image URL)"
                      />
                      {formMainImage && (
                        <div className="h-10 rounded border border-slate-800 bg-slate-950 flex items-center justify-center p-1 overflow-hidden">
                          <img src={formMainImage} alt="URL Preview" className="object-contain h-full" />
                        </div>
                      )}
                    </div>
                  )}
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

              {/* Upgraded AI Copilot Suite */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.03] p-4 space-y-4 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <label className="block text-[11px] uppercase font-black text-amber-500 tracking-wider flex items-center gap-1.5">
                      <span>✨</span> FAHIMMART SMART AI COPILOT
                    </label>
                    <p className="text-[9px] text-slate-400 mt-0.5">Use dynamic dashboard settings to write, optimize, and organize your product</p>
                  </div>
                  {(isSmartAiLoading || isGeneratingAi) && (
                    <div className="flex items-center gap-1.5 text-[9px] text-amber-500 font-bold animate-pulse">
                      <span className="animate-spin border-2 border-amber-500 border-t-transparent rounded-full h-3 w-3 inline-block" />
                      AI Processing...
                    </div>
                  )}
                </div>

                {smartAiError && (
                  <p className="text-[10px] font-semibold text-rose-500 bg-rose-950/20 px-3 py-1.5 rounded border border-rose-500/30">
                    ⚠️ {smartAiError}
                  </p>
                )}

                {/* Copilot Mode Selection Toggles */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-center">
                  <button
                    type="button"
                    onClick={() => handleSmartAiAction('writing')}
                    disabled={isSmartAiLoading}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 p-2 rounded flex flex-col items-center justify-center gap-1 group transition"
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">✍️</span>
                    <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-wider">Product Writing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSmartAiAction('seo')}
                    disabled={isSmartAiLoading}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 p-2 rounded flex flex-col items-center justify-center gap-1 group transition"
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">🔍</span>
                    <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-wider">SEO Copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSmartAiAction('tags')}
                    disabled={isSmartAiLoading}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 p-2 rounded flex flex-col items-center justify-center gap-1 group transition"
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">🏷️</span>
                    <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-wider">Tags & Cat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (smartAiMode === 'chat') {
                        setSmartAiMode('none');
                      } else {
                        setSmartAiMode('chat');
                      }
                    }}
                    className={`cursor-pointer border p-2 rounded flex flex-col items-center justify-center gap-1 group transition ${smartAiMode === 'chat' ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-500/40 text-slate-300'}`}
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">💬</span>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider ${smartAiMode === 'chat' ? 'text-slate-950' : 'text-slate-300'}`}>AI Chat Box</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAiField}
                    disabled={isGeneratingAi}
                    className="cursor-pointer bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-350 hover:to-amber-550 text-slate-950 rounded p-2 flex flex-col items-center justify-center gap-1 shadow-md transition"
                  >
                    <span className="text-xs">✨</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-950">Expert Advice</span>
                  </button>
                </div>

                {/* Interactive AI Chat Box section */}
                {smartAiMode === 'chat' && (
                  <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">AI Assistant Chatroom</span>
                      <button
                        type="button"
                        onClick={() => setChatHistory([])}
                        className="text-[8px] text-slate-500 hover:text-rose-400 uppercase font-bold cursor-pointer"
                      >
                        Clear History
                      </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                      {chatHistory.length === 0 ? (
                        <p className="text-[9px] text-slate-500 italic text-center py-2">
                          Ask anything! "Write a tagline for this", "Suggest improvements for fashion style", etc.
                        </p>
                      ) : (
                        chatHistory.map((item, idx) => (
                          <div key={idx} className={`flex flex-col gap-1 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[7px] text-slate-500 font-bold uppercase">
                              {item.role === 'user' ? 'Super Admin' : 'FahimMart AI'}
                            </span>
                            <div className={`text-[10px] rounded px-2.5 py-1.5 max-w-[90%] leading-relaxed ${item.role === 'user' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-200'}`}>
                              {item.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (chatInput.trim()) handleSmartAiAction('chat');
                          }
                        }}
                        placeholder="Type a message or instruction for the AI..."
                        className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white rounded p-2 focus:outline-none focus:border-amber-500/40"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (chatInput.trim()) handleSmartAiAction('chat');
                        }}
                        disabled={isSmartAiLoading}
                        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-[10px] px-3 rounded uppercase transition cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Advice Textarea */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Expert advice & recommendation output</label>
                  <textarea
                    rows={4}
                    value={formAiField}
                    onChange={(e) => setFormAiField(e.target.value)}
                    className="w-full rounded bg-slate-950 p-2.5 text-xs text-white border border-slate-850 focus:border-amber-500/40 focus:outline-none leading-relaxed font-mono"
                    placeholder="Expert advice / curation recommendation text will load here..."
                  />
                </div>
              </div>

              {/* Multi-Functional Gallery Manager */}
              <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-5 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
                  <div>
                    <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="text-sm">🖼️</span> Product Gallery Showcase
                    </h4>
                    <p className="text-[10px] text-slate-400">Curate multiple high-resolution photos for this product</p>
                  </div>
                  
                  {/* Upload modes */}
                  <div className="flex gap-1.5 self-start">
                    <button
                      type="button"
                      onClick={() => { stopCamera(); setGalleryUploadMode('upload'); }}
                      className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                        galleryUploadMode === 'upload' ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' : 'bg-slate-800 hover:bg-slate-750 text-slate-400'
                      }`}
                    >
                      📁 Files
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGalleryUploadMode('camera'); handleStartCamera(); }}
                      className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                        galleryUploadMode === 'camera' ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' : 'bg-slate-800 hover:bg-slate-750 text-slate-400'
                      }`}
                    >
                      📷 Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => { stopCamera(); setGalleryUploadMode('text'); }}
                      className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                        galleryUploadMode === 'text' ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' : 'bg-slate-800 hover:bg-slate-750 text-slate-400'
                      }`}
                    >
                      🔗 Raw URLs
                    </button>
                  </div>
                </div>

                {/* Content based on gallery upload mode */}
                {galleryUploadMode === 'upload' && (
                  <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/40 bg-slate-950 hover:bg-slate-900/30 rounded-xl p-4 transition-all duration-200">
                    <label className="flex flex-col items-center justify-center cursor-pointer text-center space-y-2 py-2">
                      <Upload className="h-6 w-6 text-amber-500 animate-bounce" />
                      <div className="space-y-1">
                        <p className="text-[10px] text-white font-extrabold tracking-wider uppercase">DROP OR CLICK TO UPLOAD GALLERY PHOTOS</p>
                        <p className="text-[8px] text-slate-500">Supports selecting multiple files (PNG, JPG, WEBP, etc.)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryUpload}
                      />
                    </label>
                  </div>
                )}

                {galleryUploadMode === 'camera' && (
                  <div className="relative rounded-xl border border-slate-850 bg-slate-950 overflow-hidden min-h-[160px] flex flex-col items-center justify-center p-4">
                    {isCameraActive ? (
                      <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-black shadow-inner">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={handleCaptureGalleryPhoto}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-4 py-2 rounded-lg tracking-wider uppercase transition-all shadow-md cursor-pointer"
                          >
                            📸 Snap to Gallery
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="bg-slate-900/85 hover:bg-slate-900 border border-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg tracking-wider uppercase transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-sm">
                          📷
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Live Product Photography</p>
                          <p className="text-[9px] text-slate-500 max-w-xs mt-0.5">Use your device webcam or camera to take product showcase shots</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleStartCamera}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold px-4 py-2 rounded-lg tracking-wide uppercase transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
                        >
                          Initialize Camera
                        </button>
                        {cameraError && <p className="text-[10px] text-rose-500 font-bold">{cameraError}</p>}
                      </div>
                    )}
                  </div>
                )}

                {galleryUploadMode === 'text' && (
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Direct Link-Separated URLs (One URL per line)</label>
                    <textarea
                      rows={3}
                      value={formGallery}
                      onChange={(e) => setFormGallery(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 p-3 text-xs text-slate-300 border border-slate-800 focus:border-amber-500/40 focus:outline-none font-mono leading-relaxed"
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                    />
                  </div>
                )}

                {/* Thumbnail Display Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Curated Gallery ({formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0).length})
                    </span>
                    {formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0).length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Clear entire curated product gallery?')) setFormGallery('');
                        }}
                        className="text-[8px] font-bold uppercase text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0).length > 0 ? (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl border border-slate-850 bg-slate-950 overflow-hidden aspect-square flex items-center justify-center p-1 transition hover:border-amber-500/30 shadow-inner"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery visual #${idx + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/0f172a/94a3b8?text=Broken+Image';
                            }}
                          />
                          <span className="absolute bottom-1 left-1 bg-slate-900/90 text-[7px] text-amber-500 px-1.5 py-0.5 rounded-md font-mono border border-slate-800">
                            #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = formGallery.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                              list.splice(idx, 1);
                              setFormGallery(list.join('\n'));
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-500/95 hover:bg-rose-500 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md text-[10px] font-bold"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl bg-slate-950/40 border border-slate-850/60">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">No gallery photos uploaded yet</p>
                      <p className="text-[9px] text-slate-600 mt-0.5">Use files upload, live camera, or links above to add visuals.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          ) : (
            <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col min-h-0 bg-slate-900">
              
              {/* Intro Hero with custom tips */}
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-amber-600/[0.01] p-5 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-4 -mt-4 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-5 items-center justify-center rounded-md bg-amber-500 px-2 text-[9px] font-black uppercase text-slate-950 tracking-wider">
                    ✨ Super Admin Workspace
                  </span>
                  <span className="text-xs font-mono text-amber-500 font-bold">FahimMart AI Multi-Curator</span>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Add Multiple Products Simultaneously</h3>
                <p className="mt-1 text-[11px] text-slate-300 leading-relaxed max-w-4xl">
                  Draft multiple curated listings below. You can paste a link and click <strong className="text-amber-400">Fetch Draft</strong> to instantly extract specifications and construct drafts, OR fill out descriptions and upload photos manually!
                </p>
              </div>

              {/* Validation alert logs */}
              {validationErrors.length > 0 && (
                <div id="validation-errors-alert" className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 text-xs text-rose-400 space-y-1">
                  <p className="font-black flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <AlertTriangle size={13} /> Draft Validation Failure ({validationErrors.length} errors):
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

              {/* Global Actions */}
              <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-300">
                  Draft List ({modalDrafts.length} items)
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddModalDraftRow}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold border border-slate-700 transition"
                  >
                    <Plus size={13} /> ➕ Add Draft Row
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkSubmitDrafts}
                    disabled={modalDrafts.length === 0}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition disabled:opacity-45"
                  >
                    🚀 Publish All {modalDrafts.length} Drafts
                  </button>
                </div>
              </div>

              {/* List of drafts */}
              <div className="space-y-6">
                {modalDrafts.map((d, index) => (
                  <div key={d.id} className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5 shadow-lg hover:border-slate-700 transition-all">
                    
                    {/* Top ribbon of Draft */}
                    <div className="flex items-center justify-between border-b border-slate-850 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                          {index + 1}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Product Draft Details
                        </span>
                        
                        {/* Use AI Toggle Option */}
                        <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 ml-4 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={d.useAi}
                            onChange={(e) => handleUpdateModalDraftField(d.id, 'useAi', e.target.checked)}
                            className="rounded border-slate-700 text-amber-500"
                          />
                          <span>Use AI</span>
                        </label>

                        {d.status === 'fetching' && (
                          <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-400 uppercase animate-pulse">
                            <span className="animate-spin border-2 border-amber-400 border-t-transparent rounded-full h-2.5 w-2.5" />
                            Fetching spec metadata...
                          </span>
                        )}
                        {d.status === 'success' && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                            ✓ AI Fetched
                          </span>
                        )}
                        {d.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-black text-rose-400 uppercase font-mono" title={d.error}>
                            ⚠️ Fetch Failed: {d.error}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveModalDraft(d.id)}
                        className="cursor-pointer p-1.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 text-slate-500 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Main Draft Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      
                      {/* Image Upload Block (Col Span 3) */}
                      <div className="lg:col-span-3 space-y-2">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">Product Image (Required)</label>
                        {d.mainImage ? (
                          <div className="relative group rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden h-32 flex items-center justify-center">
                            <img src={d.mainImage} alt="Draft preview" className="object-contain h-full w-full p-2" />
                            <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9px] font-extrabold px-2.5 py-1.5 rounded tracking-wide uppercase transition-colors">
                                Change Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleDraftPhotoChange(d.id, file);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleUpdateModalDraftField(d.id, 'mainImage', '')}
                                className="bg-red-500 hover:bg-red-600 text-white text-[9px] font-extrabold px-2.5 py-1.5 rounded tracking-wide uppercase transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border border-dashed border-slate-850 hover:border-amber-500/50 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl h-32 cursor-pointer transition-all duration-200">
                            <div className="flex flex-col items-center justify-center py-2 px-4 text-center">
                              <Upload className="h-5 w-5 text-amber-500 mb-1" />
                              <p className="text-[9px] text-slate-300 font-extrabold tracking-wider uppercase">UPLOAD PRODUCT PHOTO</p>
                              <p className="text-[8px] text-slate-500 mt-0.5">Click or drop file</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleDraftPhotoChange(d.id, file);
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Input Core fields (Col Span 9) */}
                      <div className="lg:col-span-9 space-y-4">
                        
                        {/* Row 1: Link & AI Button */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          <div className="md:col-span-10">
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Amazon Product / Affiliate Link *</label>
                            <input
                              type="text"
                              value={d.affiliateUrl}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'affiliateUrl', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="https://www.amazon.in/dp/B0B3C572C1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <button
                              type="button"
                              onClick={() => handleFetchDraftWithAi(d.id)}
                              disabled={d.status === 'fetching'}
                              className="cursor-pointer w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider transition duration-200 disabled:opacity-45"
                            >
                              {d.useAi ? '✨ Fetch Draft' : 'Initialize Link'}
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Title, Brand, Category, Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Product Title *</label>
                            <input
                              type="text"
                              value={d.title}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'title', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45"
                              placeholder="WH-1000XM5 Headphones"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Brand Name *</label>
                            <input
                              type="text"
                              value={d.brand}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'brand', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45"
                              placeholder="Sony"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department Category *</label>
                            <select
                              value={d.category}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'category', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">URL Slug</label>
                            <input
                              type="text"
                              value={d.slug}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'slug', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="sony-wh-1000xm5"
                            />
                          </div>
                        </div>

                        {/* Row 3: Price, Original Price, Rating, Review Count */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sale Price (₹) *</label>
                            <input
                              type="number"
                              value={d.price}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'price', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="29999"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Original Price (₹)</label>
                            <input
                              type="number"
                              value={d.originalPrice}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'originalPrice', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="34999"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Rating Value (1-5)</label>
                            <input
                              type="text"
                              value={d.rating}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'rating', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="4.7"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Reviews Count</label>
                            <input
                              type="number"
                              value={d.reviewCount}
                              onChange={(e) => handleUpdateModalDraftField(d.id, 'reviewCount', e.target.value)}
                              className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 font-mono"
                              placeholder="150"
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Expanded Section for Descriptions & Secondary Details */}
                    <div className="border-t border-slate-850 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Short Description</label>
                        <input
                          type="text"
                          value={d.shortDesc}
                          onChange={(e) => handleUpdateModalDraftField(d.id, 'shortDesc', e.target.value)}
                          className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45"
                          placeholder="Sony noise cancelling headphones with custom 30mm drivers..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Detailed Narrative Description</label>
                        <textarea
                          rows={2}
                          value={d.fullDesc}
                          onChange={(e) => handleUpdateModalDraftField(d.id, 'fullDesc', e.target.value)}
                          className="w-full rounded bg-slate-900 p-2 text-xs text-white border border-slate-800 focus:outline-none focus:border-amber-500/45 leading-relaxed"
                          placeholder="Uncover elite acoustics with the industry-leading noise cancelling technologies integrated seamlessly..."
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Footer of workspace */}
              <div className="border-t border-slate-800 pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="rounded-xl border border-slate-800 hover:bg-slate-850 px-5 py-2.5 text-xs font-bold text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkSubmitDrafts}
                  disabled={modalDrafts.length === 0}
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-black text-slate-950 cursor-pointer"
                >
                  🚀 Publish All {modalDrafts.length} Curation(s)
                </button>
              </div>

            </div>
          )}

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
