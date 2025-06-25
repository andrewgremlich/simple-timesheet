/** biome-ignore-all lint/nursery/useUniqueElementIds: ids are for server side and not client */

import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { createTimesheetRecord } from "@/lib/actions";
// import { Timer, TimerOff } from "lucide-react";

import { Label } from "./label";

export const CreateTimesheetRecord = ({
	timesheetId,
	rate,
	closed,
}: {
	timesheetId: string;
	rate: number;
	closed: boolean;
}) => {
	return (
		<form action={createTimesheetRecord}>
			<input type="hidden" name="timesheetId" value={timesheetId} />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
				<div>
					<Label htmlFor="date">Date</Label>
					<input
						id="date"
						name="date"
						type="date"
						defaultValue={format(new Date(), "yyyy-MM-dd")}
						required
						className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
					/>
				</div>
				<div>
					<Label htmlFor="hours">Hours</Label>
					<input
						id="hours"
						name="hours"
						type="number"
						step="0.25"
						min="0.25"
						placeholder="Hours worked"
						required
						className="mb-2 flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
					/>
					{/* <button type="button">
						<Timer />
						<TimerOff />
					</button> */}
				</div>
				<div>
					<Label htmlFor="rate">Rate ($/hr)</Label>
					<input
						id="rate"
						name="rate"
						type="number"
						step="0.01"
						min="0"
						defaultValue={rate}
						placeholder="Hourly rate"
						required
						className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
					/>
				</div>
				<div>
					<Label htmlFor="description">Description</Label>
					<div className="flex space-x-2">
						<input
							id="description"
							name="description"
							placeholder="Work description"
							required
							className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-slate-500 text-slate-900"
						/>
						<button
							type="submit"
							disabled={closed}
							className="disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0 px-3 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
						>
							<PlusIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};
