
import Database from "@tauri-apps/plugin-sql";

// In Tauri v2 the SQL plugin must be loaded via Database.load().
// We keep a single promise to avoid creating multiple connections.
let dbPromise: Promise<Database> | null = null;

function loadDb() {
	if (!dbPromise) {
		dbPromise = Database.load("sqlite:simple-timesheet.db");
	}
	return dbPromise;
}

// For existing code expecting a 'db' object, we expose an async proxy-like helper.
// Prefer updating callers to: const db = await loadDb(); then db.select/execute(...)
export async function getDb() {
	return await loadDb();
}

// (Optional) convenience wrappers if you want to gradually migrate
export async function execute(sql: string, params: unknown[] = []) {
	const db = await loadDb();
	return db.execute(sql, params);
}

export async function select<T = unknown>(sql: string, params: unknown[] = []) {
	const db = await loadDb();
	return db.select<T[]>(sql, params);
}

// If you still import { db } in legacy code, you can (temporarily) do:
// const db = await getDb(); inside the function that uses it.

