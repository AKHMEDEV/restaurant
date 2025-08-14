-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" "public"."AuthProvider" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;
