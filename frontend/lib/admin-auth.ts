import { NextRequest } from "next/server";

export function verifyAdminKey(req: NextRequest) {
  const providedKey = req.headers.get("x-admin-key");
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (!providedKey || providedKey !== secretKey) {
    return false;
  }
  return true;
}
