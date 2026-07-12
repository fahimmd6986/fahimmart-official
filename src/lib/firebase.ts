import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDuYmvlwsltW1CFSp9byHRT45knuMSlEb8",
  authDomain: "zesty-effort-06ppv.firebaseapp.com",
  projectId: "zesty-effort-06ppv",
  storageBucket: "zesty-effort-06ppv.firebasestorage.app",
  messagingSenderId: "704307114921",
  appId: "1:704307114921:web:35a39ddd8186a583688ab8"
};

const app = initializeApp(firebaseConfig);

// Initialize with the custom database ID from firebase-applet-config.json
export const db = initializeFirestore(app, {}, "ai-studio-fahimmart-68387a08-00c9-46d2-b7aa-b05236cb0678");
