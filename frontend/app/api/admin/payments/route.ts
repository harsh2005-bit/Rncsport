import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminKey } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await prisma.paymentRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
