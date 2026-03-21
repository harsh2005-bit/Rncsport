import { adminAuth, adminDb } from "./firebase-admin";

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1];
  
  if (!token) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function verifyIsAdmin(req: Request) {
  // 1. Allow Admin Secret Key Bypass
  const providedKey = req.headers.get("x-admin-key");
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (providedKey && secretKey && providedKey === secretKey) {
    return { uid: 'admin-secret-key-user', email: 'admin' };
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) return null;

  // 1. Check role in Firestore (Source of truth)
  const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
  const isAdminRole = userSnapshotExistsAndIsAdmin(userDoc);
  
  if (isAdminRole) return decodedToken;

  // 2. Fallback: Check email in ADMIN_EMAILS env variable
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(',').map(e => e.trim().toLowerCase());
  if (decodedToken.email && adminEmails.includes(decodedToken.email.toLowerCase())) {
    return decodedToken;
  }

  return null;
}

function userSnapshotExistsAndIsAdmin(doc: any) {
    return doc.exists && doc.data()?.role === "ADMIN";
}
