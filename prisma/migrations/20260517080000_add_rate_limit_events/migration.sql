CREATE TABLE "rate_limit_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "rate_limit_events_user_id_action_created_at_idx" ON "rate_limit_events"("user_id", "action", "created_at");

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;
