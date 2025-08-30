-- CreateTable
CREATE TABLE "public"."AnalysisResult" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisResult_pkey" PRIMARY KEY ("id")
);
