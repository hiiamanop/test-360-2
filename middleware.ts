import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect root URL to /products
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  return NextResponse.next();
}
