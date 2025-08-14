/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_name_key" ON "public"."Restaurant"("name");
