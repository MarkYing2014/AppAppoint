/*
  Warnings:

  - You are about to drop the column `territory` on the `SalesRep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SalesRep" DROP COLUMN "territory",
ADD COLUMN     "territoryId" TEXT;

-- AddForeignKey
ALTER TABLE "SalesRep" ADD CONSTRAINT "SalesRep_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
