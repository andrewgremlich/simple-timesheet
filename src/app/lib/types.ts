export interface Customer {
	id: string;
	name: string;
	email: string;
}

export interface Project {
	createdAt: string;
	updatedAt: string;
	id: string;
	name: string;
	description?: string | null;
	status?: string | null;
	rate?: number | null;
	customerId?: string | null;
	customer?: Customer;
}

export interface TimesheetRecord {
	id: string;
	timesheetId: string;
	date: string;
	hours: number;
	description: string;
	rate: number;
	amount: number;
	createdAt: Date;
	updatedAt: Date;
	timesheet?: Timesheet;
}

export interface Timesheet {
	id: string;
	name: string;
	description?: string | null;
	projectId: string;
	projectName: string;
	projectDescription?: string | null;
	projectRate?: number | null;
	customerId?: string | null;
	invoiceId?: string | null;
	closed: boolean;
	createdAt: Date;
	updatedAt: Date;
	records: TimesheetRecord[];
}

export interface CreateTimesheetData {
	name: string;
	description?: string;
}

export interface CreateTimesheetRecordData {
	timesheetId: string;
	date: Date;
	hours: number;
	description: string;
	rate: number;
}
