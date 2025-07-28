import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export const InvoicePaid = z.object({
  invoiceId: z.string(),
});

export type InvoicePaid = z.infer<typeof InvoicePaid>;

export async function POST(request: Request) {
  console.log("[Paid Invoice API] Received request");

  try {
    const jsonData = await request.json();
    const parsedData = InvoicePaid.parse(jsonData);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paid = await stripe.invoices.pay(parsedData.invoiceId, {
      paid_out_of_band: true,
    });

    if (paid.id) {
      console.log("[Paid Invoice API] Invoice marked as paid:", paid.id);
      return NextResponse.json({ success: true, invoiceId: paid.id });
    }
  } catch (validationError) {
    console.error("Validation error:", validationError);
    return NextResponse.json(
      { error: "Invalid invoice details format" },
      { status: 400 }
    );
  }
}
