import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { authId, name, email, phoneNumber } = await req.json();

    if (!authId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRef = adminDb.collection("users").doc(authId);
    const userSnapshot = await userRef.get();
    
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(',').map(e => e.trim().toLowerCase());
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
