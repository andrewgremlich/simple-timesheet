import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
	// Log the request method and URL
	console.log(`[Customer API] ${request.method} ${request.url}`);

	if (!process.env.STRIPE_SECRET_KEY) {
		return NextResponse.json(
			{ error: "Stripe is not configured" },
			{ status: 500 },
		);
	}

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

	const customers = await stripe.customers.list({
		limit: 100, // Adjust as needed
	});

	return NextResponse.json(customers.data, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
