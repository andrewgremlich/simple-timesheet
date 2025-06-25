import { CardPreview } from "@/components/cardPreview";
import { GenerateProject } from "@/components/generateProject";
import { H1, H2, Section } from "@/components/htmlElements";
import { getAllProjects, getAllTimesheets } from "@/lib/actions";

export default async function Home() {
	const allProjects = await getAllProjects();
	const allTimesheets = await getAllTimesheets();

	return (
		<div className="container mx-auto py-10 max-w-prose">
			<H1>Welcome to the Timesheet App</H1>
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
							title={timesheet.name}
							description={timesheet.description ?? "No description provided"}
							url={`/timesheet?timesheetId=${timesheet.id}`}
						/>
					))}
				</Section>
			)}

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
				<H2>Generate a new project?</H2>
				<GenerateProject />
			</Section>
		</div>
	);
}
