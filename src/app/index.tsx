import "./globals.css";

import { invoke } from "@tauri-apps/api/core";

import { CardPreview } from "@/components/cardPreview";
import { GenerateProject } from "@/components/generateProject";
import { H1, H2, Section } from "@/components/htmlElements";
import { useEffect, useState } from "react";
import {
	getAllCustomers,
	getAllProjects,
	getAllTimesheets,
} from "./lib/actions";
import { useSimpletimesheetStore } from "./lib/store";
import type { Customer, Project, Timesheet } from "./lib/types";

export const App = () => {
	const { stripeKey } = useSimpletimesheetStore();
	const [allProjects, setAllProjects] = useState<Project[]>([]);
	const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
	const [customers, setCustomers] = useState<Customer[]>([]);

	useEffect(() => {
		if (!stripeKey) return;
		getAllCustomers(stripeKey).then((customers) => setCustomers(customers));
	}, [stripeKey]);

	useEffect(() => {
		getAllProjects().then((projects) => setAllProjects(projects));
		getAllTimesheets().then((timesheets) => setAllTimesheets(timesheets));
	}, []);

	const [greetMsg, setGreetMsg] = useState("");
	const [name, setName] = useState("");

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
		setGreetMsg(await invoke("greet", { name }));
	}

	return (
		<div className="container mx-auto py-25 max-w-prose">
			<H1>Simple Timesheet</H1>
			<input
				onChange={(e) => setName(e.currentTarget.value)}
				placeholder="Enter a name..."
			/>
			<button type="button" onClick={greet}>
				Greet
			</button>
			<p>{greetMsg}</p>
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
							title={`${timesheet.closed ? "✅ " : "❌ "}${timesheet.projectName} - ${timesheet.name}`}
							description={
								timesheet.projectDescription ?? "No description provided"
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
};
