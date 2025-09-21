import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { createTimesheetRecord } from "../lib/dbClient";

// import { Timer, TimerOff } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Label } from "./Label";

export const CreateTimesheetRecord = ({
	timesheetId,
	rate,
	closed,
}: {
	timesheetId: string;
	rate: number;
	closed: boolean;
}) => {
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: async (formData: FormData) => {
			await createTimesheetRecord(formData);
			await queryClient.invalidateQueries({
				queryKey: ["timesheet", timesheetId],
			});
		},
	});

	return (
		<form
			onSubmit={(evt) => {
				evt.preventDefault();
				const formData = new FormData(evt.currentTarget);
				mutate(formData);
				evt.currentTarget.reset();
			}}
		>
			<input type="hidden" name="timesheetId" value={timesheetId} />
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
				<div>
					<Label htmlFor="date">Date</Label>
					<input
						name="date"
						type="date"
						defaultValue={formatDate(new Date())}
						required
						className="flex h-10 rounded-md border border-input bg-white text-black px-3 py-2 text-sm placeholder:text-black"
					/>
				</div>
				<div>
					<Label htmlFor="hours">Hours</Label>
					<input
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
