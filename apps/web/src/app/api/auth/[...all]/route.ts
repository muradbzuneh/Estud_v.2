import { auth } from "@estud/api";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse, type NextRequest } from "next/server";

const { GET: handleGet, POST: handlePost } = toNextJsHandler(auth.handler);

export const GET = async (req: NextRequest) => {
  try {
    return await handleGet(req);
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
