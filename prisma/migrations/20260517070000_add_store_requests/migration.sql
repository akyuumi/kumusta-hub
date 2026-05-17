CREATE TABLE "store_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "store_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "url" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "rejection_reason" TEXT,
    "approved_store_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "store_requests_user_id_idx" ON "store_requests"("user_id");
CREATE INDEX "store_requests_status_idx" ON "store_requests"("status");

ALTER TABLE "store_requests" ADD CONSTRAINT "store_requests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "store_requests" ADD CONSTRAINT "store_requests_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE public.store_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create own store requests" ON public.store_requests;
CREATE POLICY "Users can create own store requests"
ON public.store_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own store requests" ON public.store_requests;
CREATE POLICY "Users can read own store requests"
ON public.store_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
