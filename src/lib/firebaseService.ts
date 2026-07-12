import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Category, Banner, WebsiteSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_SETTINGS } from '../data/initialData';

// Collection References
export const productsCol = collection(db, 'products');
export const categoriesCol = collection(db, 'categories');
export const bannersCol = collection(db, 'banners');
export const settingsCol = collection(db, 'settings');
export const usersCol = collection(db, 'users');
export const auditLogsCol = collection(db, 'audit_logs');

/**
 * Seed Firestore database with initial data if collections are empty.
 */
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Categories
    const catSnap = await getDocs(categoriesCol);
    if (catSnap.empty) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CATEGORIES.forEach((cat) => {
        const docRef = doc(categoriesCol, cat.id);
        batch.set(docRef, cat);
      });
      await batch.commit();
    }

    // 2. Seed Banners
    const bannerSnap = await getDocs(bannersCol);
    if (bannerSnap.empty) {
      console.log('Seeding initial banners to Firestore...');
      const batch = writeBatch(db);
      INITIAL_BANNERS.forEach((banner) => {
        const docRef = doc(bannersCol, banner.id);
        batch.set(docRef, banner);
      });
      await batch.commit();
    }

    // 3. Seed Website Settings
    const settingsSnap = await getDocs(settingsCol);
    if (settingsSnap.empty) {
      console.log('Seeding initial settings to Firestore...');
      const docRef = doc(settingsCol, 'core_settings');
      await setDoc(docRef, INITIAL_SETTINGS);
    }

    // 4. Seed Products (Mock products are completely disabled. We also delete any legacy p1-p7 mock products from Firestore)
    const mockIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
    const deleteBatch = writeBatch(db);
    mockIds.forEach((id) => {
      const docRef = doc(productsCol, id);
      deleteBatch.delete(docRef);
    });
    await deleteBatch.commit();
    console.log('Legacy mock products cleaned up from Firestore.');

    console.log('FahimMart database seeding check completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// --- PRODUCT CRUD OPERATIONS ---

export async function saveProductToCloud(product: Product): Promise<void> {
  const docRef = doc(productsCol, product.id);
  await setDoc(docRef, product);
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  const docRef = doc(productsCol, productId);
  await deleteDoc(docRef);
}

// --- CATEGORY CRUD OPERATIONS ---

export async function saveCategoryToCloud(category: Category): Promise<void> {
  const docRef = doc(categoriesCol, category.id);
  await setDoc(docRef, category);
}

export async function deleteCategoryFromCloud(categoryId: string): Promise<void> {
  const docRef = doc(categoriesCol, categoryId);
  await deleteDoc(docRef);
}

// --- BANNER CRUD OPERATIONS ---

export async function saveBannersToCloud(bannersList: Banner[]): Promise<void> {
  const batch = writeBatch(db);
  // Clear old banners and write new ones
  const bannerSnap = await getDocs(bannersCol);
  bannerSnap.forEach((d) => {
    batch.delete(doc(bannersCol, d.id));
  });
  bannersList.forEach((banner) => {
    batch.set(doc(bannersCol, banner.id), banner);
  });
  await batch.commit();
}

// --- SETTINGS CRUD OPERATIONS ---

export async function saveSettingsToCloud(settingsData: WebsiteSettings): Promise<void> {
  const docRef = doc(settingsCol, 'core_settings');
  await setDoc(docRef, settingsData);
}

// --- USER MANAGEMENT CRUD OPERATIONS ---

export async function saveUserToCloud(userData: any): Promise<void> {
  const docRef = doc(usersCol, userData.id || userData.email);
  await setDoc(docRef, userData);
}

export async function deleteUserFromCloud(userId: string): Promise<void> {
  const docRef = doc(usersCol, userId);
  await deleteDoc(docRef);
}

// --- AUDIT LOGS CRUD OPERATIONS ---

export async function saveAuditLogToCloud(logData: any): Promise<void> {
  const docRef = doc(auditLogsCol, logData.id);
  await setDoc(docRef, logData);
}

// --- REAL-TIME LISTENERS ---

export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  return onSnapshot(productsCol, (snapshot) => {
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    // Sort so newer items are first or preserve some order
    onUpdate(products);
  });
}

export function subscribeToCategories(onUpdate: (categories: Category[]) => void) {
  return onSnapshot(categoriesCol, (snapshot) => {
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data() as Category);
    });
    onUpdate(categories);
  });
}

export function subscribeToBanners(onUpdate: (banners: Banner[]) => void) {
  return onSnapshot(bannersCol, (snapshot) => {
    const banners: Banner[] = [];
    snapshot.forEach((doc) => {
      banners.push(doc.data() as Banner);
    });
    onUpdate(banners);
  });
}

export function subscribeToSettings(onUpdate: (settings: WebsiteSettings) => void) {
  return onSnapshot(doc(settingsCol, 'core_settings'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as WebsiteSettings);
    }
  });
}

export function subscribeToUsers(onUpdate: (users: any[]) => void) {
  return onSnapshot(usersCol, (snapshot) => {
    const users: any[] = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });
    onUpdate(users);
  });
}

export function subscribeToAuditLogs(onUpdate: (logs: any[]) => void) {
  return onSnapshot(query(auditLogsCol, orderBy('timestamp', 'desc')), (snapshot) => {
    const logs: any[] = [];
    snapshot.forEach((doc) => {
      logs.push(doc.data());
    });
    onUpdate(logs);
  });
}
