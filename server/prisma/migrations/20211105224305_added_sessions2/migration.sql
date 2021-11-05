-- DropForeignKey
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "SessionToken" ADD CONSTRAINT "SessionToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
