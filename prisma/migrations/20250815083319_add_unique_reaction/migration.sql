/*
  Warnings:

  - A unique constraint covering the columns `[userId,targetId,targetType,type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_targetId_targetType_type_key" ON "public"."Reaction"("userId", "targetId", "targetType", "type");
