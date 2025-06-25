import { Card, CardContent, CardHeader } from "@/components/card";
import { CardPreview } from "@/components/cardPreview";

import { H1, H2, P, Section } from "@/components/htmlElements";
import { Label } from "@/components/label";
import { TimesheetName } from "@/components/timesheetName";
import { generateTimesheet, getProjectById } from "@/lib/actions";

export default async function ProjectPage({
	searchParams,
}: {
	searchParams: Promise<{ projectId?: string }>;
}) {
	const params = await searchParams;
	const projectId = params.projectId;

	if (!projectId) {
		return <div className="container mx-auto py-10">Project not found.</div>;
	}

	const project = await getProjectById(projectId);

	if (!project) {
		return <div className="container mx-auto py-10">Project not found.</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<H1>{project.name}</H1>
					<P>{project.description}</P>
					<P>Rate: {project.rate}</P>
				</CardHeader>
				<CardContent>
					<div className="mb-6">
						{project.timesheets.map((timesheet) => (
							<CardPreview
								key={timesheet.id}
								title={timesheet.name}
								description={timesheet.description ?? "No description provided"}
								url={`/timesheet?timesheetId=${timesheet.id}`}
							/>
						))}
					</div>
					<hr />
					<Section>
						<H2>Generate Timesheet for {project.name}</H2>
						<form action={generateTimesheet}>
							<input type="hidden" name="projectId" value={project.id} />
							<TimesheetName />
							<div>
								<Label htmlFor="description">Timesheet Description</Label>
								<input
									type="text"
									name="description"
									placeholder="Timesheet Description"
									className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
								/>
							</div>
							<button
								type="submit"
								className="mt-2 p-2 bg-blue-500 text-white rounded"
							>
								Generate Timesheet
							</button>
						</form>
					</Section>
				</CardContent>
			</Card>
		</div>
	);
}
