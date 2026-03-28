import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB2ysHyLGWm4n8J8OLBL2Jkoh4DMFbB9o8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jsr-sports.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jsr-sports",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jsr-sports.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "524268829820",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://jsr-sports-default-rtdb.firebaseio.com",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:524268829820:web:a4757486f3c44e630e5df9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ZBH5S047PG"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app, "default");
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== "undefined" 
  ? isSupported().then(supported => supported ? getAnalytics(app) : null) 
  : null;

export { app, auth, db, storage, analytics };