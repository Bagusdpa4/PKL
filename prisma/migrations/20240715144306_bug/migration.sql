/*
  Warnings:

  - You are about to drop the column `isThuesday` on the `cron_job_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cron_job_schedule" DROP COLUMN "isThuesday",
ADD COLUMN     "isTuesday" BOOLEAN NOT NULL DEFAULT false;
