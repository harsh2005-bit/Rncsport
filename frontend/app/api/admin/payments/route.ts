import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminKey } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("paymentRequests")
      .orderBy("createdAt", "desc")
      .get();
      
    const requests = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    });

    return NextResponse.json(requests);
  } catch (error: unknown) {
    console.error("Fetch Payments Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
