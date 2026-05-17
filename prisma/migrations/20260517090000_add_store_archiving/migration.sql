ALTER TABLE "stores" ADD COLUMN "archived_at" TIMESTAMP(3);

CREATE INDEX "stores_archived_at_idx" ON "stores"("archived_at");
