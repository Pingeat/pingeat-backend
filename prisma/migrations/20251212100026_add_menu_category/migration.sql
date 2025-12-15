/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `RestaurantMenuItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RestaurantMenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "category" TEXT,
    "cuisine" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "RestaurantMenuItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RestaurantMenuItem" ("category", "code", "id", "isAvailable", "name", "price", "tenantId") SELECT "category", "code", "id", "isAvailable", "name", "price", "tenantId" FROM "RestaurantMenuItem";
DROP TABLE "RestaurantMenuItem";
ALTER TABLE "new_RestaurantMenuItem" RENAME TO "RestaurantMenuItem";
CREATE UNIQUE INDEX "RestaurantMenuItem_code_key" ON "RestaurantMenuItem"("code");
CREATE UNIQUE INDEX "RestaurantMenuItem_tenantId_code_key" ON "RestaurantMenuItem"("tenantId", "code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
