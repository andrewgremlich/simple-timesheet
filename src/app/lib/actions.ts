import { execute, select } from "./db";
import type { Customer, Project, Timesheet } from "./types";

export async function generateProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const rate = formData.get("rate") as string;
  const customerId = formData.get("customerId") as string;

  if (!name) {
    throw new Error("Project name is required");
  }

  const result = await execute(
    "INSERT INTO projects (name, description, rate, customerId) VALUES ($1, $2, $3, $4)",
    [
      name,
      description || null,
      rate ? parseFloat(rate) : null,
      customerId || null,
    ]
  );
  const projectId = result.lastInsertId;

  await execute(
    "INSERT INTO timesheets (projectId, name, description) VALUES ($1, $2, $3)",
    [
      projectId,
      `${new Date().toLocaleDateString()} Timesheet`,
      `Timesheet for project ${name}`,
    ]
  );

  const [project]: Project[] = await select(
    "SELECT * FROM projects WHERE id = $1",
    [projectId]
  );
  const [timesheet]: Timesheet[] = await select(
    "SELECT * FROM timesheets WHERE projectId = $1 ORDER BY id DESC LIMIT 1",
    [projectId]
  );

  return { project, timesheet };
}

export async function getAllProjects(): Promise<Project[]> {
  const projects: Project[] = await select(
    `SELECT *
    from projects p`
  );

  return projects;
}

export async function getProjectById(projectId: string) {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const rows = await select(
    `SELECT p.*, t.id as timesheetId, t.name as timesheetName, t.description as timesheetDescription,
            r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount
     FROM project p
     LEFT JOIN timesheet t ON t.projectId = p.id
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id
     WHERE p.id = $1`,
    [projectId]
  );
  if (rows.length === 0) {
    throw new Error("Project not found");
  }
  const project = { ...rows[0], timesheets: [] };
  for (const row of rows) {
    if (row.timesheetId) {
      let timesheet = project.timesheets.find(
        (ts) => ts.id === row.timesheetId
      );
      if (!timesheet) {
        timesheet = {
          id: row.timesheetId,
          name: row.timesheetName,
          description: row.timesheetDescription,
          records: [],
        };
        project.timesheets.push(timesheet);
      }
      if (row.recordId) {
        timesheet.records.push({
          id: row.recordId,
          date: row.recordDate,
          hours: row.recordHours,
          description: row.recordDescription,
          rate: row.recordRate,
          amount: row.recordAmount,
        });
      }
    }
  }
  return project;
}

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Project ID is required");
  }

  await execute("DELETE FROM project WHERE id = $1", [id]);
}

export async function generateTimesheet(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  await execute(
    "INSERT INTO timesheet (projectId, name, description) VALUES ($1, $2, $3)",
    [
      projectId,
      name || `Timesheet for Project ${projectId}`,
      description || `Timesheet for project with ID ${projectId}`,
    ]
  );
  await execute("UPDATE project SET updatedAt = ? WHERE id = ?", [
    new Date().toISOString(),
    projectId,
  ]);
}

export async function getTimesheetById(timesheetId: string) {
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }
  const rows = await select(
    `SELECT t.*, r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount, p.id as projectId, p.name as projectName
     FROM timesheet t
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id
     LEFT JOIN project p ON t.projectId = p.id
     WHERE t.id = $1`,
    [timesheetId]
  );
  if (rows.length === 0) {
    throw new Error("Timesheet not found");
  }
  const timesheet = {
    ...rows[0],
    records: [],
    project: { id: rows[0].projectId, name: rows[0].projectName },
  };
  for (const row of rows) {
    if (row.recordId) {
      timesheet.records.push({
        id: row.recordId,
        date: row.recordDate,
        hours: row.recordHours,
        description: row.recordDescription,
        rate: row.recordRate,
        amount: row.recordAmount,
      });
    }
  }
  return timesheet;
}

export async function getAllTimesheets(): Promise<Timesheet[]> {
  const rows: Timesheet[] = await select(
    `SELECT t.*, p.name as projectName, p.description as projectDescription FROM timesheets t
     LEFT JOIN projects p ON t.projectId = p.id 
     ORDER BY t.updatedAt DESC
     LIMIT 5`
  );

  console.log(rows);

  return rows;
}

export async function createTimesheetRecord(formData: FormData) {
  const timesheetId = formData.get("timesheetId") as string;
  const date = formData.get("date") as string;
  const hours = formData.get("hours") as string;
  const description = formData.get("description") as string;
  const rate = formData.get("rate") as string;
  if (!timesheetId || !date || !hours || !description || !rate) {
    throw new Error("All fields are required");
  }
  const timesheet = await select("SELECT * FROM timesheet WHERE id = $1", [
    timesheetId,
  ]);
  if (timesheet.length === 0) {
    throw new Error("Timesheet not found");
  }
  const hoursFloat = parseFloat(hours);
  const rateFloat = parseFloat(rate);
  const amount = hoursFloat * rateFloat;
  await execute(
    "INSERT INTO timesheetRecord (timesheetId, date, hours, description, rate, amount) VALUES ($1, $2, $3, $4, $5, $6)",
    [timesheetId, date, hoursFloat, description, rateFloat, amount]
  );
  await execute("UPDATE timesheet SET updatedAt = $1 WHERE id = $2", [
    new Date().toISOString(),
    timesheetId,
  ]);
}

export async function deleteTimesheetRecord(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Record ID is required");
  }
  await execute("DELETE FROM timesheetRecord WHERE id = $1", [id]);
}

export async function markReceivedPayment(formData: FormData) {
  const invoiceId = formData.get("invoiceId") as string;
  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }
  await execute("UPDATE invoice SET paid = 1 WHERE id = $1", [invoiceId]);
}

export async function generateInvoice(formData: FormData) {
  const timesheetId = formData.get("timesheetId") as string;
  const customerId = formData.get("customerId") as string;
  if (!customerId) {
    throw new Error("Customer ID is required");
  }
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }
  const records = await select(
    "SELECT * FROM timesheetRecord WHERE timesheetId = $1",
    [timesheetId]
  );
  if (records.length === 0) {
    throw new Error("No timesheet entries found");
  }
  const invoiceDetails = records.reduce(
    (acc, record) => {
      acc.totalHours += record.hours;
      acc.finalInvoiceAmount += record.amount;
      acc.memo += `${formatDate(record.date)} => ${record.hours.toFixed(
        2
      )}hrs => ${record.description}\n`;
      return acc;
    },
    {
      totalHours: 0,
      finalInvoiceAmount: 0,
      memo: "",
      rate: records[0].rate,
      customerId,
    }
  );
  const invoiceResult = await execute(
    "INSERT INTO invoice (customerId, totalHours, finalInvoiceAmount, memo, rate) VALUES ($1, $2, $3, $4, $5)",
    [
      customerId,
      invoiceDetails.totalHours,
      invoiceDetails.finalInvoiceAmount,
      invoiceDetails.memo,
      invoiceDetails.rate,
    ]
  );
  const invoiceId = invoiceResult.lastInsertId;
  await execute(
    "UPDATE timesheet SET updatedAt = $1, closed = 1, invoiceId = $2 WHERE id = $3",
    [new Date().toISOString(), invoiceId, timesheetId]
  );
}

export async function getAllCustomers(key: string | null): Promise<Customer[]> {
  if (!key) {
    throw new Error("Stripe key is required to fetch customers");
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(key);

  try {
    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Transform Stripe customer data to match expected format
    return customers.data.map((customer) => ({
      id: customer.id,
      name: customer.name || customer.email || "Unknown",
      email: customer.email || "",
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
