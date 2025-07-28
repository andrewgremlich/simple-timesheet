import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateProject(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const rate = formData.get("rate") as string;
  const customerId = formData.get("customerId") as string;

  if (!name) {
    throw new Error("Project name is required");
  }

  await prisma.project.create({
    data: {
      name,
      description: description || null,
      rate: parseFloat(rate) || null,
      customerId: customerId || null,
      timesheets: {
        create: {
          name: `${new Date().toLocaleDateString()} Timesheet`,
          description: `Timesheet for project ${name}`,
        },
      },
    },
  });

  revalidatePath("/");
}

export async function getAllProjects() {
  "use server";

  const projects = await prisma.project.findMany({
    include: {
      timesheets: {
        include: {
          records: true,
        },
      },
    },
  });

  return projects;
}

export async function getProjectById(projectId: string) {
  "use server";

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      timesheets: {
        include: {
          records: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function deleteProject(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Project ID is required");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
}

export async function generateTimesheet(formData: FormData) {
  "use server";

  const projectId = formData.get("projectId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  await prisma.timesheet.create({
    data: {
      projectId,
      name: name || `Timesheet for Project ${projectId}`,
      description: description || `Timesheet for project with ID ${projectId}`,
    },
  });

  // Update the project's updatedAt field
  await prisma.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/project?projectId=${projectId}`);
}

export async function getTimesheetById(timesheetId: string) {
  "use server";

  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }

  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
    include: {
      records: true,
      project: true,
    },
  });

  if (!timesheet) {
    throw new Error("Timesheet not found");
  }

  return timesheet;
}

export async function getAllTimesheets() {
  "use server";

  const timesheets = await prisma.timesheet.findMany({
    include: {
      records: true,
      project: true,
    },
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return timesheets;
}

export async function createTimesheetRecord(formData: FormData) {
  "use server";

  const timesheetId = formData.get("timesheetId") as string;
  const date = formData.get("date") as string;
  const hours = formData.get("hours") as string;
  const description = formData.get("description") as string;
  const rate = formData.get("rate") as string;

  if (!timesheetId || !date || !hours || !description || !rate) {
    throw new Error("All fields are required");
  }

  // Validate that the timesheet exists
  const timesheet = await prisma.timesheet.findUnique({
    where: { id: timesheetId },
  });

  if (!timesheet) {
    throw new Error("Timesheet not found");
  }

  const hoursFloat = parseFloat(hours);
  const rateFloat = parseFloat(rate);
  const amount = hoursFloat * rateFloat;

  await prisma.timesheetRecord.create({
    data: {
      timesheetId,
      date: new Date(date),
      hours: hoursFloat,
      description,
      rate: rateFloat,
      amount,
    },
  });

  // Update the timesheet's updatedAt field
  await prisma.timesheet.update({
    where: { id: timesheetId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/");
}

export async function deleteTimesheetRecord(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Record ID is required");
  }

  await prisma.timesheetRecord.delete({
    where: { id },
  });

  revalidatePath("/");
}

export async function markReceivedPayment(formData: FormData) {
  "use server";

  const invoiceId = formData.get("invoiceId") as string;

  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }

  console.log("[Mark Received Payment] Marking invoice as paid:", invoiceId);

  const response = await fetch(`${process.env.URL}/api/invoice/paid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoiceId }),
  });
  const data = await response.json();

  console.log("[Mark Received Payment] Response:", data);

  revalidatePath("/");
}

export async function generateInvoice(formData: FormData) {
  "use server";

  const timesheetId = formData.get("timesheetId") as string;
  const customerId = formData.get("customerId") as string;

  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  if (!timesheetId) {
    throw new Error("Timesheet ID is required");
  }

  // Fetch records for the timesheet
  const records = await prisma.timesheetRecord.findMany({
    where: { timesheetId },
    include: { timesheet: true },
  });

  if (records.length === 0) {
    throw new Error("No timesheet entries found");
  }

  const invoiceDetails = records.reduce(
    (acc, record) => {
      acc.totalHours += record.hours;
      acc.finalInvoiceAmount += record.amount;
      acc.memo += `${new Date(
        record.date
      ).toLocaleDateString()} => ${record.hours.toFixed(2)}hrs => ${
        record.description
      }\n`;

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
  const response = await fetch(`${process.env.URL}/api/invoice/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoiceDetails }),
  });
  const data = await response.json();

  if (data.success) {
    await prisma.timesheet.update({
      where: { id: timesheetId },
      data: { updatedAt: new Date(), closed: true, invoiceId: data.invoiceId },
    });

    redirect(
      `${process.env.URL}/timesheet?timesheetId=${timesheetId}&invoiceId=${data.invoiceId}&success=true`
    );
  } else {
    redirect(
      `${process.env.URL}/timesheet?timesheetId=${timesheetId}&invoiceId=${data.invoiceId}&success=false&error=couldnotcreateinvoice`
    );
  }
}
