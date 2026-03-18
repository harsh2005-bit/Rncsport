import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const adminUid = "1czGF4rnznXQI6cA209ZDLpy8BF3";
    
    console.log("Seeding Admin User in Firestore:", adminUid);
    
    await adminDb.collection("users").doc(adminUid).set({
      uid: adminUid,
      email: "harshjhabksc@gmail.com",
      name: "Harsh Kumar",
      phoneNumber: "+917667161841",
      role: "admin",
      createdAt: new Date()
    });

    console.log("✅ Admin Seeded Successfully!");

    return NextResponse.json({ 
      success: true, 
      message: "Admin user seeded correctly in 'users' collection.",
      uid: adminUid
    });

  } catch (error: any) {
    console.error("❌ Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
