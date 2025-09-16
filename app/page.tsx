import {
	getAllCustomers,
	getAllProjects,
	getAllTimesheets,
} from "@/lib/actions";

export default async function Home() {
	const allProjects = await getAllProjects();
	const allTimesheets = await getAllTimesheets();
	const customers = await getAllCustomers();
}
