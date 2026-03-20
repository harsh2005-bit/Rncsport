import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyAdminKey } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = await context.params;
    const { id } = params;
    const { status } = await req.json();
    const newStatus = status.toUpperCase() === "APPROVED" ? "APPROVED" : "REJECTED";

    const docRef = adminDb.collection("paymentRequests").doc(id);
    await docRef.update({ 
      status: newStatus,
      updatedAt: new Date()
    });

    const updatedDoc = await docRef.get();
    const updated = updatedDoc.data() || {};
    
    if (updated.createdAt && updated.createdAt.toDate) {
       updated.createdAt = updated.createdAt.toDate().toISOString();
    }
    if (updated.updatedAt && updated.updatedAt.toDate) {
       updated.updatedAt = updated.updatedAt.toDate().toISOString();
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
