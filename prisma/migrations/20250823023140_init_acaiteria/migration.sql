/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Complement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItemComplement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductComplement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "acaiteria_prime"."Order" DROP CONSTRAINT "Order_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" DROP CONSTRAINT "OrderItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" DROP CONSTRAINT "OrderItem_variation_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."OrderItemComplement" DROP CONSTRAINT "OrderItemComplement_complement_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."OrderItemComplement" DROP CONSTRAINT "OrderItemComplement_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."ProductComplement" DROP CONSTRAINT "ProductComplement_complement_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."ProductComplement" DROP CONSTRAINT "ProductComplement_product_id_fkey";

-- DropForeignKey
ALTER TABLE "acaiteria_prime"."ProductVariation" DROP CONSTRAINT "ProductVariation_product_id_fkey";

-- DropTable
DROP TABLE "acaiteria_prime"."Admin";

-- DropTable
DROP TABLE "acaiteria_prime"."Complement";

-- DropTable
DROP TABLE "acaiteria_prime"."Customer";

-- DropTable
DROP TABLE "acaiteria_prime"."Order";

-- DropTable
DROP TABLE "acaiteria_prime"."OrderItem";

-- DropTable
DROP TABLE "acaiteria_prime"."OrderItemComplement";

-- DropTable
DROP TABLE "acaiteria_prime"."Product";

-- DropTable
DROP TABLE "acaiteria_prime"."ProductComplement";

-- DropTable
DROP TABLE "acaiteria_prime"."ProductVariation";

-- CreateTable
CREATE TABLE "acaiteria_prime"."admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."product_variations" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "included_complements" INTEGER NOT NULL,
    "included_fruits" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."complements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "extra_price" DOUBLE PRECISION NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."product_complements" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "complement_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_complements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."orders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "whatsapp_message" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variation_id" TEXT,
    "note" TEXT,
    "final_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."order_item_complements" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "complement_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_item_complements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_login_key" ON "acaiteria_prime"."admins"("login");

-- CreateIndex
CREATE UNIQUE INDEX "product_complements_product_id_complement_id_key" ON "acaiteria_prime"."product_complements"("product_id", "complement_id");

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."product_variations" ADD CONSTRAINT "product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."product_complements" ADD CONSTRAINT "product_complements_complement_id_fkey" FOREIGN KEY ("complement_id") REFERENCES "acaiteria_prime"."complements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."product_complements" ADD CONSTRAINT "product_complements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "acaiteria_prime"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "acaiteria_prime"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."order_items" ADD CONSTRAINT "order_items_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "acaiteria_prime"."product_variations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."order_item_complements" ADD CONSTRAINT "order_item_complements_complement_id_fkey" FOREIGN KEY ("complement_id") REFERENCES "acaiteria_prime"."complements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."order_item_complements" ADD CONSTRAINT "order_item_complements_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "acaiteria_prime"."order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
