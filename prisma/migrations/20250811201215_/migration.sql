/*
  Warnings:

  - You are about to drop the column `targetId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Menu_targetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Restaurant_targetId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "targetId",
ADD COLUMN     "targetMenuId" TEXT,
ADD COLUMN     "targetRestaurantId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_targetRestaurantId_fkey" FOREIGN KEY ("targetRestaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_targetMenuId_fkey" FOREIGN KEY ("targetMenuId") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
