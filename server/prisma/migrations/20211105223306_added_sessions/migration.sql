-- CreateTable
CREATE TABLE "SessionToken" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiry" INTEGER NOT NULL,

    CONSTRAINT "SessionToken_pkey" PRIMARY KEY ("sessionId")
);

-- AddForeignKey
ALTER TABLE "SessionToken" ADD CONSTRAINT "SessionToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
