/*
  Warnings:

  - The `expiry` column on the `WhitelistedSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WhitelistedSession" DROP COLUMN "expiry",
ADD COLUMN     "expiry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
