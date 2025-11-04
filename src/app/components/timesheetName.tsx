import { useState } from "react";
import { Label } from "./Label";

export const TimesheetName = () => {
	const [name, setName] = useState("");

	return (
		<div className="col-span-3">
			<Label htmlFor="name">Timesheet Name</Label>
			<div className="flex flex-row items-center">
				<input
					type="text"
					name="name"
					placeholder="Timesheet Name"
					required
					className="flex h-10 rounded-md border border-input bg-white px-3 text-sm placeholder:text-slate-500 text-slate-900"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					type="button"
					className="cursor-pointer ml-2 p-2 rounded hover:bg-gray-500"
					onClick={() => {
						setName(`${new Date().toLocaleDateString()} Timesheet`);
					}}
				>
					Autogen Name
				</button>
			</div>
		</div>
	);
};
