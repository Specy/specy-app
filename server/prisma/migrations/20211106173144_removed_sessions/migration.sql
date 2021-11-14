-- CreateTable
CREATE TABLE "ValidTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiry" INTEGER NOT NULL,

    CONSTRAINT "ValidTokens_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "ValidTokens" ADD CONSTRAINT "ValidTokens_token_fkey" FOREIGN KEY ("token") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
