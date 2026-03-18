import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

if (!admin.apps.length) {
  try {
    // Try to load service account key from backend directory
    const serviceAccountPath = "c:\\Users\\harsh\\Downloads\\Rncsport-main\\backend\\serviceAccountKey.json";
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "jsr-sports.firebasestorage.app", // Fixed bucket
    });
    
    console.log("Firebase Admin Initialized for Payment API");
  } catch (error) {
    console.error("Firebase Admin Init Error:", error);
    // Fallback: If no file, try to initialize with project ID for some basic features (might fail for storage)
    admin.initializeApp({
      projectId: "jsr-sports",
      storageBucket: "jsr-sports.firebasestorage.app",
    });
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
