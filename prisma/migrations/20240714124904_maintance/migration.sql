/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "cron_job_schedule" (
    "id" SERIAL NOT NULL,
    "flight_key" TEXT NOT NULL,
    "time_arrive" TIME(6) NOT NULL,
    "time_departure" TIME(6) NOT NULL,
    "city_arrive_id" INTEGER NOT NULL,
    "city_destination_id" INTEGER NOT NULL,
    "estimation_minute" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "isMonday" BOOLEAN NOT NULL DEFAULT false,
    "isThuesday" BOOLEAN NOT NULL DEFAULT false,
    "isWednesday" BOOLEAN NOT NULL DEFAULT false,
    "isThursday" BOOLEAN NOT NULL DEFAULT false,
    "isFriday" BOOLEAN NOT NULL DEFAULT false,
    "isSaturday" BOOLEAN NOT NULL DEFAULT false,
    "isSunday" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cron_job_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_cron_job_schedul" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "detail_plane_id" INTEGER NOT NULL,
    "cron_job_Schedule_id" INTEGER,

    CONSTRAINT "detail_cron_job_schedul_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cron_job_schedule_flight_key_key" ON "cron_job_schedule"("flight_key");

-- AddForeignKey
ALTER TABLE "cron_job_schedule" ADD CONSTRAINT "cron_job_schedule_city_arrive_id_fkey" FOREIGN KEY ("city_arrive_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cron_job_schedule" ADD CONSTRAINT "cron_job_schedule_city_destination_id_fkey" FOREIGN KEY ("city_destination_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_cron_job_schedul" ADD CONSTRAINT "detail_cron_job_schedul_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_cron_job_schedul" ADD CONSTRAINT "detail_cron_job_schedul_cron_job_Schedule_id_fkey" FOREIGN KEY ("cron_job_Schedule_id") REFERENCES "cron_job_schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
