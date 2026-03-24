import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase-admin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name.replace(/\s+/g, "_")}`;
    const downloadToken = randomUUID();

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;

    return NextResponse.json({ success: true, url });
  } catch (error: unknown) {
    console.error("Upload handler specific Error:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
