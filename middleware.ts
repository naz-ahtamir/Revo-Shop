import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
};

// Force Node.js runtime (not Edge) to support fs operations
export const runtime = "nodejs";
