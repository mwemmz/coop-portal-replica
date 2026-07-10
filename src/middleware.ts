import { NextResponse } from "next/server";

// Frontend-only replica: no authentication gating.
// All routes are publicly accessible so the UI renders without a backend.
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
