/*
  Warnings:

  - Changed the type of `type` on the `order_item_complements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "acaiteria_prime"."OrderItemComplementType" AS ENUM ('INCLUDED', 'EXTRA');

-- AlterTable
ALTER TABLE "acaiteria_prime"."order_item_complements" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "type",
ADD COLUMN     "type" "acaiteria_prime"."OrderItemComplementType" NOT NULL;
