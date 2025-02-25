-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "token" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);
