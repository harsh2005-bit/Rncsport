import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAuth } from "@/lib/auth-util";

export async function POST(req: Request) {
  try {
    const { authId, name, email, phoneNumber } = await req.json();

    // 1. Verify Authentication Token
    const decodedToken = await verifyAuth(req);
    
    // 2. Critical Security Check: Ensure the token belongs to the user being synced
    if (!decodedToken || decodedToken.uid !== authId) {
      return NextResponse.json({ error: "Unauthorized: Invalid or mismatched token" }, { status: 401 });
    }

    const userRef = adminDb.collection("users").doc(authId);
    const userSnapshot = await userRef.get();
    
    const adminEmails = (process.env.ADMIN_EMAILS || "harshjhabksc@gmail.com,jsrsportsofficial@gmail.com").split(',').map(e => e.trim().toLowerCase());
    const isAdmin = adminEmails.includes(email.toLowerCase());
    
    const userData = {
        authId,
        name,
        email,
        phoneNumber: phoneNumber || "",
        ...(userSnapshot.exists ? {} : { createdAt: new Date() }),
        role: isAdmin ? "ADMIN" : (userSnapshot.exists ? (userSnapshot.data()?.role || "USER") : "USER"),
        updatedAt: new Date(),
    };

    await userRef.set(userData, { merge: true });

    return NextResponse.json({ id: authId, ...userData });
  } catch (error: unknown) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
