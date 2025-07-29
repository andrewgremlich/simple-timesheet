/** biome-ignore-all lint/nursery/useUniqueElementIds: ids are for server side and not client */

import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { CreateTimesheetRecord } from "@/components/createTimesheetRecord";
import { GenerateInvoiceButton } from "@/components/generateInvoiceButton";
import { H1, P } from "@/components/htmlElements";
import { TimesheetTable } from "@/components/timesheetTable";
import {
	generateInvoice,
	getTimesheetById,
	markReceivedPayment,
} from "@/lib/actions";

const SearchParamsSchema = z.object({
	invoiceId: z.string().optional(),
	success: z.preprocess(
		(val) => (val === "true" ? true : val === "false" ? false : val),
		z.boolean().optional(),
	),
	error: z.string().optional(),
	timesheetId: z.string().optional(),
});

export default async function TimesheetPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | undefined>>;
}) {
	const rawParams = await searchParams;
	const parseResult = SearchParamsSchema.safeParse(rawParams);
	const params = parseResult.success ? parseResult.data : {};
	const timesheet = await getTimesheetById(params.timesheetId || "");
	const entries = timesheet ? timesheet.records : [];

	let invoiceData: { invoice: { status?: string } } = { invoice: {} };

	if (timesheet?.invoiceId) {
		const invoiceDataRes = await fetch(
			`${process.env.URL}/api/invoice?invoiceId=${timesheet.invoiceId}`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			},
		);
		invoiceData = await invoiceDataRes.json();
	}

	return (
		<>
			{/* Success/Error Messages */}
			{params.success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{params.invoiceId
						? `Invoice ${params.invoiceId} generated successfully!`
						: "Action completed successfully!"}
				</div>
			)}
			{params.error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					Error: {params.error}
				</div>
			)}

			<Card>
				<CardHeader>
					<H1>
						{timesheet?.name ?? "Timesheet Invoice Generator"}
						{timesheet?.closed && " (Closed)"}
					</H1>
					<P>
						{timesheet?.project.customerId &&
							`Customer ID: ${timesheet.project.customerId}`}
					</P>
					{timesheet?.invoiceId && (
						<form action={markReceivedPayment}>
							<P>Invoice ID: {timesheet?.invoiceId}</P>
							{invoiceData.invoice.status === "paid" && (
								<P>Invoice has been marked as paid.</P>
							)}
							<input
								type="hidden"
								name="invoiceId"
								value={timesheet?.invoiceId}
							/>
							<button
								disabled={invoiceData.invoice.status === "paid"}
								type="submit"
								className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md  ${
									invoiceData.invoice.status === "paid"
										? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
										: "cursor-pointer"
								}`}
							>
								{invoiceData.invoice.status === "paid"
									? "Has been paid"
									: "Mark as Paid"}
							</button>
						</form>
					)}
				</CardHeader>
				<CardContent>
					{timesheet && (
						<>
							<CreateTimesheetRecord
								closed={timesheet.closed}
								timesheetId={timesheet.id}
								rate={timesheet.project.rate ?? 25}
							/>
							<TimesheetTable entries={entries} closed={timesheet.closed} />
						</>
					)}
				</CardContent>
				<CardFooter>
					<form action={generateInvoice}>
						<input type="hidden" name="timesheetId" value={timesheet?.id} />
						{timesheet?.project.customerId && (
							<input
								type="hidden"
								name="customerId"
								value={timesheet?.project.customerId}
							/>
						)}
						<GenerateInvoiceButton isClosed={timesheet?.closed} />
					</form>
				</CardFooter>
			</Card>
		</>
	);
}
