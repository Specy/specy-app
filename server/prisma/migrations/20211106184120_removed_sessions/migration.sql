/*
  Warnings:

  - The primary key for the `ValidTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[token]` on the table `ValidTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ValidTokens" DROP CONSTRAINT "ValidTokens_pkey",
ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ValidTokens_token_key" ON "ValidTokens"("token");
