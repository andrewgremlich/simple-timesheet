-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_timesheets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "timerActive" BOOLEAN NOT NULL DEFAULT false,
    "timerStarted" DATETIME,
    "timerElapsed" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "timesheets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_timesheets" ("closed", "createdAt", "description", "id", "name", "projectId", "updatedAt") SELECT "closed", "createdAt", "description", "id", "name", "projectId", "updatedAt" FROM "timesheets";
DROP TABLE "timesheets";
ALTER TABLE "new_timesheets" RENAME TO "timesheets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
