/** biome-ignore-all lint/nursery/useUniqueElementIds: ids are for server side and not client */

import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { CreateTimesheetRecord } from "@/components/createTimesheetRecord";
import { GenerateProject } from "@/components/generateProject";
import { H1, P } from "@/components/htmlElements";
import { TimesheetTable } from "@/components/timesheetTable";
import { generateInvoice, getTimesheetById } from "@/lib/actions";

interface SearchParams {
	invoice?: string;
	success?: string;
	error?: string;
	timesheetId?: string;
}

interface TimesheetPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function TimesheetPage({
	searchParams,
}: TimesheetPageProps) {
	const params = await searchParams;
	const timesheet = await getTimesheetById(params.timesheetId || "");
	const entries = timesheet ? timesheet.records : [];

	return (
		<>
			{/* Success/Error Messages */}
			{params.success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{params.invoice
						? `Invoice ${params.invoice} generated successfully!`
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
				</CardHeader>
				<CardContent>
					{timesheet ? (
						<>
							<CreateTimesheetRecord
								closed={timesheet.closed}
								timesheetId={timesheet.id}
								rate={timesheet.project.rate ?? 25}
							/>
							<TimesheetTable entries={entries} closed={timesheet.closed} />
						</>
					) : (
						<GenerateProject />
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
						<button
							type="submit"
							disabled={entries.length === 0 || timesheet.closed}
							className="shrink-0 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md"
						>
							Generate Invoice
						</button>
					</form>
				</CardFooter>
			</Card>
		</>
	);
}
