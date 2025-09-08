
import Database from "@tauri-apps/plugin-sql";

const db = new Database("sqlite:timesheet.db");

export { db };

