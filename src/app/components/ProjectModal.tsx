import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateTimesheet, getProjectById } from "../lib/dbClient";
import { useSimpletimesheetStore } from "../lib/store";
import { CardContent, CardHeader } from "./Card";
import { CardPreview } from "./CardPreview";
import { Dialog } from "./Dialog";
import { H2, P, Section } from "./HtmlElements";
import { Label } from "./Label";
import { TimesheetName } from "./TimesheetName";

export const ProjectModal = () => {
	const queryClient = useQueryClient();
	const {
		projectModalActive,
		toggleProjectModal,
		toggleTimesheetModal,
		activeProjectId,
	} = useSimpletimesheetStore();
	const { data: project } = useQuery({
		queryKey: ["project", activeProjectId],
		queryFn: () => {
			if (activeProjectId) {
				return getProjectById(activeProjectId);
			}
			return null;
		},
		enabled: !!activeProjectId,
	});
	const { mutate } = useMutation({
		mutationFn: async (formData: FormData) => {
			await generateTimesheet(formData);
			await queryClient.invalidateQueries({
				queryKey: ["project", activeProjectId],
			});
		},
	});

	return (
		<Dialog
			isOpen={projectModalActive}
			onClose={() => toggleProjectModal({ projectId: undefined })}
		>
			<CardHeader>
				<H2>{project?.name}</H2>
				<P>
					Started:{" "}
					{project?.createdAt
						? new Date(project?.createdAt).toLocaleDateString()
						: "N/A"}
				</P>
				<P>Active: {project?.status}</P>
				<P>{project?.description}</P>
				<P>Rate: {project?.rate ? `$${project.rate}/hr` : "N/A"}</P>
				{project?.customerId && <P>Customer: {project?.customerId}</P>}
			</CardHeader>
			<CardContent>
				<div className="mb-6">
					{project?.timesheets.map((timesheet) => (
						<CardPreview
							key={timesheet.id}
							name={timesheet.name}
							description={timesheet.description ?? "No description provided"}
							action={() => {
								toggleProjectModal({ projectId: undefined });
								toggleTimesheetModal({ timesheetId: timesheet.id });
							}}
						/>
					))}
				</div>
				<hr />
				<Section>
					<H2>Generate Timesheet for {project?.name}</H2>
					<form
						onSubmit={(evt) => {
							evt.preventDefault();
							const formData = new FormData(evt.currentTarget);
							mutate(formData);
						}}
					>
						<input type="hidden" name="projectId" value={project?.id} />
						<div className="grid gap-4 grid-cols-3">
							<TimesheetName />
							<div className="col-span-3">
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
								className="mt-2 p-2 bg-blue-500 text-white rounded grid-span-3 cursor-pointer"
							>
								Generate Timesheet
							</button>
						</div>
					</form>
				</Section>
			</CardContent>
		</Dialog>
	);
};
