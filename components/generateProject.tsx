/** biome-ignore-all lint/nursery/useUniqueElementIds: ids are for server side and not client */
import { generateProject } from "@/lib/actions";
import { Label } from "./label";

export const GenerateProject = ({
	customers,
}: {
	customers: { id: string; name: string; email: string }[];
}) => {
	return (
		<form action={generateProject} className="grid grid-cols-3 gap-6">
			<div className="col-span-3">
				<Label htmlFor="name">Project Name</Label>
				<input
					id="name"
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
					id="rate"
					name="rate"
					placeholder="Enter project rate"
					required
					className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
				/>
			</div>
			<div className="col-span-2">
				<Label htmlFor="customerId">Customer</Label>
				<select
					id="customerId"
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
					id="description"
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
