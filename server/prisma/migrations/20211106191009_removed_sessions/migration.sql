/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `WhitelistedSession` table. All the data in the column will be lost.
  - Added the required column `expiry` to the `WhitelistedSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WhitelistedSession" DROP COLUMN "updatedAt",
ADD COLUMN     "expiry" INTEGER NOT NULL;
