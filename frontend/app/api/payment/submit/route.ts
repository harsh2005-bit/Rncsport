import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { 
      authId, 
      name, 
      phoneNumber, 
      paymentMethod, 
      platform, 
      transactionId, 
      screenshotUrl 
    } = await req.json();

    if (!authId || !screenshotUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find or Create the user in MongoDB
    let user = await prisma.user.findUnique({
      where: { authId },
    });

    if (!user && authId === "GUEST") {
      // Create a persistent GUEST user if it doesn't exist
      user = await prisma.user.upsert({
        where: { authId: "GUEST" },
        update: {},
        create: {
          authId: "GUEST",
          name: "Guest User",
          phoneNumber: phoneNumber || "GUEST",
          role: "user"
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found and not a valid guest." }, { status: 404 });
    }

    const request = await prisma.paymentRequest.create({
      data: {
        userId: user.id,
        name: name || user.name,
        phoneNumber: phoneNumber || user.phoneNumber,
        paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "UPI",
        platform: platform || "All Panel Exch",
        transactionId: transactionId || null,
        screenshotUrl: screenshotUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(request);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Payment Submission Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
