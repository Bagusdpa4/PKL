-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT,
    "google_id" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT DEFAULT 'user',
    "avatar_url" TEXT,
    "family_name" TEXT,
    "otp" TEXT,
    "otpCreatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "flight_number" TEXT NOT NULL,
    "time_arrive" TIME(6) NOT NULL,
    "time_departure" TIME(6) NOT NULL,
    "date_flight" DATE NOT NULL,
    "city_arrive_id" INTEGER NOT NULL,
    "city_destination_id" INTEGER NOT NULL,
    "estimation_minute" INTEGER NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_flight" (
    "id" SERIAL NOT NULL,
    "flight_id" INTEGER,
    "price" INTEGER NOT NULL,
    "detail_plane_id" INTEGER NOT NULL,

    CONSTRAINT "detail_flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "capacity" INTEGER NOT NULL,
    "airlinesId" INTEGER NOT NULL,
    "series" TEXT NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_plane" (
    "id" SERIAL NOT NULL,
    "total_seat" INTEGER NOT NULL,
    "seat_class_id" INTEGER NOT NULL,
    "plane_id" INTEGER NOT NULL,

    CONSTRAINT "detail_plane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "since" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat_class" (
    "id" SERIAL NOT NULL,
    "type_class" TEXT NOT NULL,

    CONSTRAINT "seat_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "identity_type" TEXT,
    "identity_number" TEXT NOT NULL,
    "issuing_country" TEXT NOT NULL,
    "expired_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "age_group" INTEGER,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "continents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "continents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "continent_id" INTEGER NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "airport_name" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "code" TEXT NOT NULL,
    "detail_flight_id" INTEGER NOT NULL,
    "expired_paid" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "method_payment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "flights_flight_number_key" ON "flights"("flight_number");

-- CreateIndex
CREATE UNIQUE INDEX "planes_series_key" ON "planes"("series");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_code_key" ON "airlines"("code");

-- CreateIndex
CREATE UNIQUE INDEX "continents_code_key" ON "continents"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cities_code_key" ON "cities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_city_arrive_id_fkey" FOREIGN KEY ("city_arrive_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_city_destination_id_fkey" FOREIGN KEY ("city_destination_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_detail_plane_id_fkey" FOREIGN KEY ("detail_plane_id") REFERENCES "detail_plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_flight" ADD CONSTRAINT "detail_flight_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_airlinesId_fkey" FOREIGN KEY ("airlinesId") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_plane" ADD CONSTRAINT "detail_plane_seat_class_id_fkey" FOREIGN KEY ("seat_class_id") REFERENCES "seat_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "continents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_detail_flight_id_fkey" FOREIGN KEY ("detail_flight_id") REFERENCES "detail_flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
