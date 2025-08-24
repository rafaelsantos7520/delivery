/*
  Warnings:

  - The `address` column on the `customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `complements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "acaiteria_prime"."ComplementType" AS ENUM ('ACOMPANHAMENTO', 'FRUTA', 'COBERTURA');

-- AlterTable
ALTER TABLE "acaiteria_prime"."complements" DROP COLUMN "type",
ADD COLUMN     "type" "acaiteria_prime"."ComplementType" NOT NULL;

-- AlterTable
ALTER TABLE "acaiteria_prime"."customers" DROP COLUMN "address",
ADD COLUMN     "address" JSONB;
