-- CreateTable
CREATE TABLE "acaiteria_prime"."Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."ProductVariation" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "included_complements" INTEGER NOT NULL,
    "included_fruits" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."Complement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "extra_price" DOUBLE PRECISION NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Complement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."ProductComplement" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "complement_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductComplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."Order" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "whatsapp_message" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variation_id" TEXT,
    "note" TEXT,
    "final_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acaiteria_prime"."OrderItemComplement" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "complement_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItemComplement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "acaiteria_prime"."Admin"("login");

-- CreateIndex
CREATE UNIQUE INDEX "ProductComplement_product_id_complement_id_key" ON "acaiteria_prime"."ProductComplement"("product_id", "complement_id");

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."ProductVariation" ADD CONSTRAINT "ProductVariation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."ProductComplement" ADD CONSTRAINT "ProductComplement_complement_id_fkey" FOREIGN KEY ("complement_id") REFERENCES "acaiteria_prime"."Complement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."ProductComplement" ADD CONSTRAINT "ProductComplement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "acaiteria_prime"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "acaiteria_prime"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "acaiteria_prime"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."OrderItem" ADD CONSTRAINT "OrderItem_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "acaiteria_prime"."ProductVariation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."OrderItemComplement" ADD CONSTRAINT "OrderItemComplement_complement_id_fkey" FOREIGN KEY ("complement_id") REFERENCES "acaiteria_prime"."Complement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acaiteria_prime"."OrderItemComplement" ADD CONSTRAINT "OrderItemComplement_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "acaiteria_prime"."OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
