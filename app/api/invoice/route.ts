import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Invoice } from "@/lib/types";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const searchParams = Object.fromEntries(url.searchParams.entries());
		const parsedData = Invoice.parse(searchParams);
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

		const invoice = await stripe.invoices.retrieve(parsedData.invoiceId);

		if (invoice) {
			return NextResponse.json({ success: true, invoice });
		} else {
			return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
		}
	} catch (validationError) {
		console.error("Validation error:", validationError);
		return NextResponse.json(
			{ error: "Invalid invoice details format" },
			{ status: 400 },
		);
	}
}
