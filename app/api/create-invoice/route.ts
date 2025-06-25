import { NextResponse } from "next/server";
import Stripe from "stripe";
import { type InvoiceDetails, InvoiceDetailsSchema } from "@/lib/types";

export async function POST(request: Request) {
  const { invoiceDetails }: { invoiceDetails: InvoiceDetails } =
    await request.json();

  try {
    InvoiceDetailsSchema.parse(invoiceDetails);
  } catch (validationError) {
    console.error("Validation error:", validationError);
    return NextResponse.json(
      { error: "Invalid invoice details format" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const customer = await stripe.customers.retrieve(invoiceDetails.customerId);

    // Create the invoice first as a draft
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true,
      collection_method: "send_invoice",
      days_until_due: 30,
      currency: "usd",
      description: `${invoiceDetails.memo}`,
    });

    // Now create an invoice item and attach it to the specific invoice
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id, // Explicitly attach to this invoice
      amount: Math.round(invoiceDetails.finalInvoiceAmount * 100), // Stripe expects amount in cents
      currency: "usd",
      description: `Software Engineering Services total hours ${invoiceDetails.totalHours} at rate $${invoiceDetails.rate} per hour.`,
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
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create invoice",
      },
      { status: 500 }
    );
  }
}
