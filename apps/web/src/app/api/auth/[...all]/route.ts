import { auth } from "@estud/api";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse, type NextRequest } from "next/server";

const { GET: handleGet, POST: handlePost } = toNextJsHandler(auth.handler);

export const GET = async (req: NextRequest) => {
  try {
    const res = await handleGet(req);
    // If Better Auth returned a server error (e.g. Neon cold-start/timeout during get-session),
    // prevent app crash by gracefully falling back to unauthenticated session
    if (res.status >= 500 && req.nextUrl.pathname.endsWith("/get-session")) {
      console.warn("[Auth API] Gracefully handled GET session 500 error (e.g. DB cold start)");
      return NextResponse.json(null, { status: 200 });
    }
    return res;
  } catch (err) {
    console.warn("[Auth API] Gracefully handled GET session lookup error:", err);
    return NextResponse.json(null, { status: 200 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return await handlePost(req);
  } catch (err: any) {
    console.error("[Auth API] POST error:", err);
    return NextResponse.json(
      { error: { message: err?.message || "Authentication request failed", status: 400 } },
      { status: 400 }
    );
  }
};
