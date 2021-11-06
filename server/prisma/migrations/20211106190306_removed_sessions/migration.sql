/*
  Warnings:

  - You are about to drop the column `expiry` on the `WhitelistedSession` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `WhitelistedSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WhitelistedSession" DROP COLUMN "expiry",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
