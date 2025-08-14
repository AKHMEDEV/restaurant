/*
  Warnings:

  - You are about to drop the column `location` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "location",
ADD COLUMN     "locationLatitude" DOUBLE PRECISION,
ADD COLUMN     "locationLongitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourierProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicle" TEXT,
    "locationLatitude" DOUBLE PRECISION,
    "locationLongitude" DOUBLE PRECISION,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CourierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_menuId_key" ON "public"."CartItem"("userId", "menuId");

-- CreateIndex
CREATE UNIQUE INDEX "CourierProfile_userId_key" ON "public"."CourierProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourierProfile" ADD CONSTRAINT "CourierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
