import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define properly typed headers for CORS
export async function middleware(request: NextRequest) {
  // Only apply CORS middleware to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Create a response - either continue to the destination
    // or use a new response if you need to respond directly
    const response = NextResponse.next();

    // Add the CORS headers to the response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    // Return the modified response
    return response;
  }

  // Continue without modifications for non-API routes
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
