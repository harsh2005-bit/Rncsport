import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  try {
    let serviceAccount: any;
    
    // 1. Try to load from environment variable (Production/Deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } 
    // 2. Try to load from local file (Development fallback)
    else {
      try {
        const { readFileSync } = require("fs");
        const path = require("path");
        // Use relative path for better portability
        const serviceAccountPath = path.join(process.cwd(), "..", "backend", "serviceAccountKey.json");
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
      } catch (fError) {
        console.warn("No service account key found in environment or local file.");
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jsr-sports.firebasestorage.app",
      });
      console.log("Firebase Admin Initialized securely.");
    } else {
      // Fallback: Default initialization (might only work in Google Cloud environments)
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jsr-sports",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jsr-sports.firebasestorage.app",
      });
      console.log("Firebase Admin Initialized with default credentials.");
    }
  } catch (error) {
    console.error("Firebase Admin Critical Init Error:", error);
  }
}

export const adminDb = getFirestore(admin.app(), "default");
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
