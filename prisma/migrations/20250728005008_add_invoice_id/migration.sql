/*
  Warnings:

  - You are about to drop the column `timerActive` on the `timesheets` table. All the data in the column will be lost.
  - You are about to drop the column `timerElapsed` on the `timesheets` table. All the data in the column will be lost.
  - You are about to drop the column `timerStarted` on the `timesheets` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_timesheets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "timesheets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_timesheets" ("closed", "createdAt", "description", "id", "name", "projectId", "updatedAt") SELECT "closed", "createdAt", "description", "id", "name", "projectId", "updatedAt" FROM "timesheets";
DROP TABLE "timesheets";
ALTER TABLE "new_timesheets" RENAME TO "timesheets";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
