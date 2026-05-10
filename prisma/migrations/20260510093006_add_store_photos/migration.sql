-- CreateTable
CREATE TABLE "store_photos" (
    "id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "storage_path" TEXT,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_photos_store_id_sort_order_idx" ON "store_photos"("store_id", "sort_order");

-- CreateIndex
CREATE INDEX "store_photos_store_id_is_primary_idx" ON "store_photos"("store_id", "is_primary");

-- AddForeignKey
ALTER TABLE "store_photos" ADD CONSTRAINT "store_photos_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
