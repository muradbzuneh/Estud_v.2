import { NextRequest, NextResponse } from "next/server";

const OFFICIAL_EAS_APK_V2_2_0 =
  "https://expo.dev/artifacts/eas/KOpOJDPTN-GKp495yQQyzROKddpMmSh_HhodhoBx7kc.apk";

export async function GET(
  _request: NextRequest,
  _context: { params: Promise<{ filename: string }> }
) {
  // Redirect directly to the official high-speed EAS Android APK binary
  return NextResponse.redirect(OFFICIAL_EAS_APK_V2_2_0, { status: 307 });
}
