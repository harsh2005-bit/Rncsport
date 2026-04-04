import { NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { randomUUID } from 'crypto';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Core payload
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const amount = Number(formData.get("amount"));
    
    // Bank Details
    const accountNumber = formData.get("accountNumber") as string;
    const ifsc = formData.get("ifsc") as string;
    const holderName = formData.get("holderName") as string;
    
    // UPI Details
    const upiId = formData.get("upiId") as string;
    const file = formData.get("file") as File;
    
    // Credentials
    const bettingId = formData.get("bettingId") as string;
    const bettingPassword = formData.get("bettingPassword") as string;

    if (!userId || !amount) {
      return NextResponse.json({ message: "Missing required core fields." }, { status: 400 });
    }

    let qrImageUrl = "";
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const timestamp = Date.now();
      const fileName = `withdrawals/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const downloadToken = randomUUID();

      const bucket = adminStorage.bucket();
      const fileRef = bucket.file(fileName);

      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
          metadata: { firebaseStorageDownloadTokens: downloadToken },
        },
      });

      qrImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
    }

    const withdrawalData = {
      userId,
      name: name || "Unknown",
      phoneNumber: phoneNumber || "Unknown",
      amount,
      paymentMethod: "BOTH",
      bankDetails: {
        accountNumber: accountNumber?.trim() || "",
        ifsc: ifsc?.trim().toUpperCase() || "",
        holderName: holderName?.trim() || ""
      },
      upiDetails: {
        upiId: upiId?.trim() || "",
        qrImageUrl
      },
      credentials: {
        id: bettingId?.trim() || "",
        password: bettingPassword?.trim() || ""
      },
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb.collection("withdrawals").add(withdrawalData);

    return NextResponse.json({
      success: true,
      id: docRef.id
    });

  } catch (error: unknown) {
    console.error("CRITICAL WITHDRAWAL SUBMISSION ERROR:", error);
    const err = error as Error;
    return NextResponse.json({ 
      message: err.message || "Internal server error during withdrawal submission",
      error: err.toString()
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let withdrawalsRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('withdrawals');
    
    if (userId) {
      withdrawalsRef = withdrawalsRef.where('userId', '==', userId);
    }
    
    withdrawalsRef = withdrawalsRef.orderBy('createdAt', 'desc').limit(100);

    const snapshot = await withdrawalsRef.get();
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : docData.createdAt,
        updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : docData.updatedAt,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error (Withdrawals GET):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, adminNote } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = adminDb.collection('withdrawals').doc(id);
    const docData = await docRef.get();
    if (!docData.exists) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    await docRef.update({
      status,
      adminNote: adminNote || null,
      updatedAt: new Date()
    });

    // Create Notification
    const userId = docData.data()?.userId;
    console.log(`[WITHDRAWAL_API] Action: ${status}, ID: ${id}, UserID Found: ${userId}`);

    if (userId) {
      const title = status === "approved" ? "Withdrawal Approved ✅" : "Withdrawal Rejected ❌";
      const message = status === "approved" ? "Your withdrawal has been processed 💸" : "Your withdrawal has been rejected ❌";

      await adminDb.collection('notifications').add({
        userId,
        title,
        message,
        type: "withdraw",
        read: false,
        createdAt: new Date(),
        status
      });
      console.log(`[WITHDRAWAL_API] Notification created for user: ${userId}`);
    } else {
      console.warn(`[WITHDRAWAL_API] FAILED to create notification - No userId in document: ${id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (Withdrawals PATCH):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
