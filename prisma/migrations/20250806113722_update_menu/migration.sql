/*
  Warnings:

  - You are about to drop the `MenuTranslation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MenuTranslation" DROP CONSTRAINT "MenuTranslation_menuId_fkey";

-- DropTable
DROP TABLE "public"."MenuTranslation";
