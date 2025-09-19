import { z } from "zod";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  rate?: number | null;
  customerId?: string | null;
  customer?: Customer;
}

export interface Timesheet {
  id: string;
  name: string;
  description?: string | null;
  projectId: string;
  projectName: string;
  projectDescription?: string | null;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
  records: TimesheetRecord[];
}

export interface TimesheetRecord {
  id: string;
  timesheetId: string;
  date: Date;
  hours: number;
  description: string;
  rate: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  timesheet?: Timesheet;
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

// Zod schema for invoice details validation
export const InvoiceDetailsSchema = z.object({
  totalHours: z.number().positive("Total hours must be a positive number"),
  finalInvoiceAmount: z
    .number()
    .positive("Final invoice amount must be a positive number"),
  memo: z.string().min(1, "Memo cannot be empty"),
  rate: z.number().positive("Rate must be a positive number"),
  customerId: z.string().min(1, "Customer ID is required"),
});

export type InvoiceDetails = z.infer<typeof InvoiceDetailsSchema>;

export const Invoice = z.object({
  invoiceId: z.string(),
});

export type Invoice = z.infer<typeof Invoice>;
