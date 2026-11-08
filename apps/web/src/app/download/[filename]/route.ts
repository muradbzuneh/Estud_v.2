import { NextRequest, NextResponse } from "next/server";

const OFFICIAL_EAS_APK_V2_2_1 =
  "https://expo.dev/artifacts/eas/4UCXyoHPFAjNU9QGN8EsLq4Xhv19Wz1Pwnf25D6jkH4.apk";

export async function GET(
  _request: NextRequest,
  _context: { params: Promise<{ filename: string }> }
) {
  // Redirect directly to the official high-speed EAS Android APK binary
  return NextResponse.redirect(OFFICIAL_EAS_APK_V2_2_1, { status: 307 });
}
