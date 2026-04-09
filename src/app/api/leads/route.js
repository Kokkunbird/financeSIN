import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), "data");
const leadFile = path.join(dataDirectory, "leads.json");

async function readLeads() {
  try {
    const contents = await readFile(leadFile, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    if (error.code === "ENOENT") {
      await mkdir(dataDirectory, { recursive: true });
      await writeFile(leadFile, "[]", "utf8");
      return [];
    }

    if (error.name === "SyntaxError") {
      await mkdir(dataDirectory, { recursive: true });
      await writeFile(leadFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { lead, answers, result } = body || {};

    if (!lead?.name || !lead?.email || !lead?.phone || !lead?.consent) {
      return Response.json(
        { error: "Missing required lead fields or consent." },
        { status: 400 }
      );
    }

    const existing = await readLeads();
    const submission = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      lead,
      answers,
      result,
    };

    existing.push(submission);
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(leadFile, JSON.stringify(existing, null, 2), "utf8");

    return Response.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Lead storage error:", error);
    return Response.json(
      { error: "Unable to save lead right now." },
      { status: 500 }
    );
  }
}
