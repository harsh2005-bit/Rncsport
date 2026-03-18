import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminKey } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await req.json();

    const updated = await prisma.paymentRequest.update({
      where: { id },
      data: { 
        status: status.toUpperCase() === "APPROVED" ? "APPROVED" : "REJECTED" 
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
