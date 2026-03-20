import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("Payment Submission Started...");
    
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const platform = formData.get("platform") as string;
    const transactionId = formData.get("transactionId") as string;
    const file = formData.get("file") as File;

    console.log("PAYMENT FORM DATA RECEIVED:", {
      userId,
      name,
      phoneNumber,
      paymentMethod,
      platform,
      transactionId,
      fileName: file?.name,
      fileType: file?.type,
    });

    if (!userId || !file) {
      console.error("Missing required fields: userId or file");
      return NextResponse.json({ message: "Missing required fields (userId or file)" }, { status: 400 });
    }

    console.log(`Processing upload for user: ${userId}, file: ${file.name}`);

    // Generate unique filename and token
    const timestamp = Date.now();
    const fileName = `payment_proofs/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const downloadToken = randomUUID();

    // Convert File to Buffer for Firebase Admin
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);

    console.log("Uploading to Storage...");
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    // Construct Persistent Download URL (Firebase standard)
    const screenshotUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
    console.log("Download URL generated:", screenshotUrl);

    console.log("Saving to Firestore collection: payments");
    const docRef = await adminDb.collection("payments").add({
      userId,
      name: name || "Unknown",
      phoneNumber: phoneNumber || "Unknown",
      paymentMethod: paymentMethod || "UPI",
      platform: platform || "All Panel Exch",
      transactionId: transactionId || null,
      screenshotUrl,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Record saved successfully with ID:", docRef.id);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      screenshotUrl
    });

  } catch (error: any) {
    console.error("CRITICAL PAYMENT ERROR:", error);
    return NextResponse.json({ 
      message: error.message || "Internal server error during payment submission",
      error: error.toString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection("payments")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt
    }));
    
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET Payments Error:", error);
    return NextResponse.json({ message: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ message: "Missing id or status" }, { status: 400 });
    }

    await adminDb.collection("payments").doc(id).update({
      status,
      notified: false,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH Payment Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
