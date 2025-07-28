import { NextResponse } from "next/server";
import Stripe from "stripe";
import { InvoiceDetailsSchema } from "@/lib/types";

export async function POST(request: Request) {
  console.log("[Create Invoice API] Received request");

  try {
    const requestBody = await request.json();
    const parsedData = InvoiceDetailsSchema.parse(requestBody);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const customer = await stripe.customers.retrieve(parsedData.customerId);

    // Create the invoice first as a draft
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true,
      collection_method: "send_invoice",
      days_until_due: 30,
      currency: "usd",
      description: `${parsedData.memo}`,
    });

    // Create the invoice item
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id, // Explicitly attach to this invoice
      amount: Math.round(parsedData.finalInvoiceAmount * 100), // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        totalHours: parsedData.totalHours.toString(),
        rate: parsedData.rate.toString(),
        finalInvoiceAmount: parsedData.finalInvoiceAmount.toString(),
      },
      description: `Software Engineering Services total hours ${parsedData.totalHours} at rate $${parsedData.rate} per hour.`,
    });

    // Finalize the invoice to prepare it for sending
    if (invoice.id) {
      await stripe.invoices.finalizeInvoice(invoice.id);

      return NextResponse.json({
        success: true,
        invoiceId: invoice.id,
        invoiceUrl: invoice.hosted_invoice_url,
      });
    }

    throw new Error("Failed to create invoice");
  } catch (createInvoiceError) {
    console.error("Create Invoice error:", createInvoiceError);
    return NextResponse.json(
      { error: "Invalid invoice details format" },
      { status: 400 }
    );
  }
}
