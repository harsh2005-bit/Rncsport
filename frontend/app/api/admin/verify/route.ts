import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    const adminKey = process.env.ADMIN_SECRET_KEY;

    if (key === adminKey) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
