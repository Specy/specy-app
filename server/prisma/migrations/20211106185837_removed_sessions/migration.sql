/*
  Warnings:

  - You are about to drop the `ValidTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ValidTokens";

-- CreateTable
CREATE TABLE "WhitelistedSession" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiry" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistedSession_token_key" ON "WhitelistedSession"("token");
