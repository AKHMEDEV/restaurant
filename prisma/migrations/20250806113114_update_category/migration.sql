/*
  Warnings:

  - You are about to drop the `CategoryTranslation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."CategoryTranslation";
