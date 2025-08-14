/*
  Warnings:

  - You are about to drop the column `image` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Restaurant" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
