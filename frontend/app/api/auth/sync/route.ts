import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { authId, name, phoneNumber } = await req.json();

    if (!authId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { authId },
      update: { 
        name, 
        phoneNumber: phoneNumber || "" 
      },
      create: {
        authId,
        name,
        phoneNumber: phoneNumber || "",
        role: "user"
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
