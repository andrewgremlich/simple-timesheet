import { type NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  console.log(`[Check Stripe Middleware] ${request.method} ${request.url}`);

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  // Continue to the API route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
