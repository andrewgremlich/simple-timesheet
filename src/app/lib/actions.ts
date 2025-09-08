import { db } from "./db";

export async function generateProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const rate = formData.get("rate") as string;
  const customerId = formData.get("customerId") as string;
  if (!name) {
    throw new Error("Project name is required");
  }
  const result = await db.execute(
    "INSERT INTO project (name, description, rate, customerId) VALUES (?, ?, ?, ?)",
    [
      name,
      description || null,
      rate ? parseFloat(rate) : null,
      customerId || null,
    ]
  );
  const projectId = result.lastInsertId;
  await db.execute(
    "INSERT INTO timesheet (projectId, name, description) VALUES (?, ?, ?)",
    [
      projectId,
      `${new Date().toLocaleDateString()} Timesheet`,
      `Timesheet for project ${name}`,
    ]
  );
}

export async function getAllProjects() {
  const projects = await db.select(
    `SELECT p.*, t.id as timesheetId, t.name as timesheetName, t.description as timesheetDescription,
            r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount
     FROM project p
     LEFT JOIN timesheet t ON t.projectId = p.id
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id`
  );
  const map = new Map();
  for (const row of projects) {
    if (!map.has(row.id)) {
      map.set(row.id, { ...row, timesheets: [] });
    }
    const project = map.get(row.id);
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
  return Array.from(map.values());
}

export async function getProjectById(projectId: string) {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  const rows = await db.select(
    `SELECT p.*, t.id as timesheetId, t.name as timesheetName, t.description as timesheetDescription,
            r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount
     FROM project p
     LEFT JOIN timesheet t ON t.projectId = p.id
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id
     WHERE p.id = ?`,
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
  await db.execute("DELETE FROM project WHERE id = ?", [id]);
}

export async function generateTimesheet(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  await db.execute(
    "INSERT INTO timesheet (projectId, name, description) VALUES (?, ?, ?)",
    [
      projectId,
      name || `Timesheet for Project ${projectId}`,
      description || `Timesheet for project with ID ${projectId}`,
    ]
  );
  await db.execute("UPDATE project SET updatedAt = ? WHERE id = ?", [
    new Date().toISOString(),
    projectId,
  ]);
}

export async function getTimesheetById(timesheetId: string) {
  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }
  const rows = await db.select(
    `SELECT t.*, r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount, p.id as projectId, p.name as projectName
     FROM timesheet t
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id
     LEFT JOIN project p ON t.projectId = p.id
     WHERE t.id = ?`,
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

export async function getAllTimesheets() {
  const rows = await db.select(
    `SELECT t.*, r.id as recordId, r.date as recordDate, r.hours as recordHours, r.description as recordDescription, r.rate as recordRate, r.amount as recordAmount, p.id as projectId, p.name as projectName
     FROM timesheet t
     LEFT JOIN timesheetRecord r ON r.timesheetId = t.id
     LEFT JOIN project p ON t.projectId = p.id
     ORDER BY t.updatedAt DESC
     LIMIT 5`
  );
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        ...row,
        records: [],
        project: { id: row.projectId, name: row.projectName },
      });
    }
    const timesheet = map.get(row.id);
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
  return Array.from(map.values());
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
  const timesheet = await db.select("SELECT * FROM timesheet WHERE id = ?", [
    timesheetId,
  ]);
  if (timesheet.length === 0) {
    throw new Error("Timesheet not found");
  }
  const hoursFloat = parseFloat(hours);
  const rateFloat = parseFloat(rate);
  const amount = hoursFloat * rateFloat;
  await db.execute(
    "INSERT INTO timesheetRecord (timesheetId, date, hours, description, rate, amount) VALUES (?, ?, ?, ?, ?, ?)",
    [timesheetId, date, hoursFloat, description, rateFloat, amount]
  );
  await db.execute("UPDATE timesheet SET updatedAt = ? WHERE id = ?", [
    new Date().toISOString(),
    timesheetId,
  ]);
}

export async function deleteTimesheetRecord(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Record ID is required");
  }
  await db.execute("DELETE FROM timesheetRecord WHERE id = ?", [id]);
}

export async function markReceivedPayment(formData: FormData) {
  const invoiceId = formData.get("invoiceId") as string;
  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }
  await db.execute("UPDATE invoice SET paid = 1 WHERE id = ?", [invoiceId]);
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
  const records = await db.select(
    "SELECT * FROM timesheetRecord WHERE timesheetId = ?",
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
  const invoiceResult = await db.execute(
    "INSERT INTO invoice (customerId, totalHours, finalInvoiceAmount, memo, rate) VALUES (?, ?, ?, ?, ?)",
    [
      customerId,
      invoiceDetails.totalHours,
      invoiceDetails.finalInvoiceAmount,
      invoiceDetails.memo,
      invoiceDetails.rate,
    ]
  );
  const invoiceId = invoiceResult.lastInsertId;
  await db.execute(
    "UPDATE timesheet SET updatedAt = ?, closed = 1, invoiceId = ? WHERE id = ?",
    [new Date().toISOString(), invoiceId, timesheetId]
  );
}

export async function getAllCustomers() {
  const customers = await db.select("SELECT * FROM customer");
  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name || customer.email || "Unknown",
    email: customer.email || "",
  }));
}
