import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Security check: prevent directory traversal
  const safeFilename = path.basename(filename);
  
  // Prefer exact file or fallback to latest v2.2.0 APK
  let filePath = path.join(process.cwd(), "public", "download", safeFilename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), "public", "download", "estud-v2.2.0.apk");
  }

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.android.package-archive");
    headers.set("Content-Disposition", `attachment; filename="${safeFilename}"`);
    headers.set("Content-Length", fileBuffer.length.toString());
    headers.set("Cache-Control", "public, max-age=3600, immutable");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  }

  // Cloud fallback: redirect to verified Expo EAS Builds repository
  return NextResponse.redirect(
    "https://expo.dev/accounts/muradbzuneh/projects/estud-monorepo/builds",
    { status: 307 }
  );
}
