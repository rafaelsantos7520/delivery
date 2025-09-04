/*
  Warnings:

  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "acaiteria_prime"."products" DROP COLUMN "category",
ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "acaiteria_prime"."categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "acaiteria_prime"."categories"("name");

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "acaiteria_prime"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
