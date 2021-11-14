/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `WhitelistedSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WhitelistedSession_id_key" ON "WhitelistedSession"("id");
