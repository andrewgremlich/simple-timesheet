// import { generateProject } from "@/lib/actions";
import { generateProject } from "../lib/actions";
import { useSimpletimesheetStore } from "../lib/store";
import type { Customer } from "../lib/types";
import { Label } from "./label";

export const GenerateProject = ({ customers }: { customers: Customer[] }) => {
	const { addProject, addTimesheet } = useSimpletimesheetStore();

	return (
		<form
			className="grid grid-cols-3 gap-6"
			onSubmit={(e) => {
				e.preventDefault();

				const formData = new FormData(e.currentTarget);

				generateProject(formData).then(({ project, timesheet }) => {
					addProject(project);
					addTimesheet(timesheet);
				});
			}}
		>
			<div className="col-span-3">
				<Label htmlFor="name">Project Name</Label>
				<input
					name="name"
					placeholder="Enter project name"
					required
					className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
				/>
			</div>
			<div className="col-span-1">
				<Label htmlFor="rate">Rate</Label>
				<input
					type="number"
					name="rate"
					placeholder="Enter project rate"
					required
					className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
				/>
			</div>
			<div className="col-span-2">
				<Label htmlFor="customerId">Customer</Label>
				<select
					name="customerId"
					required
					className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
				>
					<option value="">Select a customer</option>
					{customers.map((customer) => (
						<option key={customer.id} value={customer.id}>
							{customer.name} ({customer.email})
						</option>
					))}
				</select>
			</div>
			<div className="col-span-3">
				<Label htmlFor="description">Project Description</Label>
				<textarea
					name="description"
					placeholder="Enter project description"
					className="flex h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
				/>
			</div>
			<button
				type="submit"
				className="hover:bg-blue-300 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
			>
				Generate Project
			</button>
		</form>
	);
};
