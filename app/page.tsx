import { CardPreview } from "@/components/cardPreview";
import { GenerateProject } from "@/components/generateProject";
import { H1, H2, Section } from "@/components/htmlElements";
import {
	getAllCustomers,
	getAllProjects,
	getAllTimesheets,
} from "@/lib/actions";

export default async function Home() {
	const allProjects = await getAllProjects();
	const allTimesheets = await getAllTimesheets();
	const customers = await getAllCustomers();

	return (
		<div className="container mx-auto py-10 max-w-prose">
			<H1>Simple Timesheet</H1>
			<Section>
				<p className="text-gray-700">
					A simple timesheet that integrates with Stripe in order to send
					invoices.
				</p>
			</Section>

			{allTimesheets.length > 0 && (
				<Section>
					<H2>All Timesheets</H2>

					{allTimesheets.map((timesheet) => (
						<CardPreview
							key={timesheet.id}
							title={`${timesheet.closed ? "✅ " : "❌ "}${timesheet.project.name} - ${timesheet.name}`}
							description={
								timesheet.project.description ?? "No description provided"
							}
							url={`/timesheet?timesheetId=${timesheet.id}`}
						/>
					))}
				</Section>
			)}

			<Section>
				<dl>
					<dt>✅</dt>
					<dd>Closed</dd>
					<dt>❌</dt>
					<dd>Open</dd>
				</dl>
			</Section>

			{allProjects.length > 0 && (
				<Section>
					<H2>Projects</H2>
					{allProjects.map((project) => (
						<CardPreview
							key={project.id}
							title={project.name}
							description={project.description ?? "No description provided"}
							url={`/project?projectId=${project.id}`}
						/>
					))}
				</Section>
			)}

			<Section>
				<H2>New Project</H2>
				<GenerateProject customers={customers} />
			</Section>
		</div>
	);
}
