import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Invoice } from "@/lib/types";

export async function POST(request: Request) {
	try {
		const jsonData = await request.json();
		const parsedData = Invoice.parse(jsonData);
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

		const paid = await stripe.invoices.pay(parsedData.invoiceId, {
			paid_out_of_band: true,
		});

		if (paid.id) {
			return NextResponse.json({ success: true, invoiceId: paid.id });
		}

		return NextResponse.json(
			{ error: "Failed to mark invoice as paid" },
			{ status: 500 },
		);
	} catch (validationError) {
		console.error("Validation error:", validationError);
		return NextResponse.json(
			{ error: "Invalid invoice details format" },
			{ status: 400 },
		);
	}
}
