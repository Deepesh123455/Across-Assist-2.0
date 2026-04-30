-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('OEM', 'NBFC', 'RETAILER', 'MARKETPLACE', 'TELECOM', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientTier" AS ENUM ('PLATINUM', 'GOLD', 'SILVER');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ACCIDENTAL_DAMAGE', 'SCREEN_PROTECTION', 'EXTENDED_WARRANTY', 'CYBER_PROTECTION');

-- CreateEnum
CREATE TYPE "DistributionModel" AS ENUM ('OFFLINE_RETAIL', 'ONLINE_ECOMMERCE', 'NBFC_EMI', 'DIRECT_TO_CONSUMER', 'MIXED');

-- CreateEnum
CREATE TYPE "MonthlyVolumeRange" AS ENUM ('UNDER_5K', 'RANGE_5K_50K', 'RANGE_50K_5L', 'ABOVE_5L');

-- CreateEnum
CREATE TYPE "PrimaryGoal" AS ENUM ('POST_WARRANTY_REVENUE', 'ADDITIONAL_REVENUE_PER_DEVICE', 'REDUCE_REPAIR_COMPLAINTS', 'BEAT_COMPETITORS', 'BUNDLE_WITH_EMI');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'ABANDONED', 'COMPLETED', 'RECOVERED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'CONVERTED', 'LOST', 'COLD');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('STEP_ABANDONED', 'CHAT_ABANDONED', 'REMINDER_2', 'REMINDER_3', 'WELCOME', 'VERIFICATION', 'LEAD_NOTIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "GadgetCategory" AS ENUM ('SMARTPHONES', 'LAPTOPS_TABLETS', 'TVS', 'LARGE_APPLIANCES', 'WEARABLES', 'REFURBISHED_DEVICES', 'TWO_WHEELERS', 'COMMERCIAL_VEHICLES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT,
    "google_id" TEXT,
    "avatar_url" TEXT,
    "client_type" "ClientType",
    "industry" TEXT,
    "city" TEXT,
    "website" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "onboarding_done" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "primary_session_id" TEXT,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "company_name" TEXT,
    "phone" TEXT,
    "user_id" TEXT,
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "form_data" JSONB,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_converted" BOOLEAN NOT NULL DEFAULT false,
    "abandoned_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "recovered_at" TIMESTAMP(3),
    "follow_up_sent" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_sent_at" TIMESTAMP(3),
    "follow_up_opened" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_clicked" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "logo_public_id" TEXT,
    "website" TEXT,
    "client_type" "ClientType" NOT NULL,
    "industry" TEXT,
    "tier" "ClientTier" NOT NULL DEFAULT 'SILVER',
    "city" TEXT,
    "state" TEXT,
    "partnership_since" TIMESTAMP(3),
    "monthly_volume" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "icon_emoji" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "claim_frequency" TEXT,
    "avg_claim_cost" DECIMAL(10,2),
    "coverage_items" JSONB NOT NULL,
    "applicable_gadgets" "GadgetCategory"[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "target_client_type" "ClientType",
    "target_gadgets" "GadgetCategory"[],
    "target_distribution" "DistributionModel",
    "target_goal" "PrimaryGoal",
    "average_plan_value" DECIMAL(10,2) NOT NULL,
    "attachment_rate_bench" DECIMAL(5,4) NOT NULL,
    "oem_revenue_share" DECIMAL(5,4) NOT NULL,
    "retailer_revenue_share" DECIMAL(5,4) NOT NULL,
    "nbfc_revenue_share" DECIMAL(5,4) NOT NULL,
    "across_assist_share" DECIMAL(5,4) NOT NULL,
    "why_this_bundle" JSONB NOT NULL,
    "objection_handler" TEXT NOT NULL,
    "performance_data" JSONB,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_products" (
    "bundle_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "is_anchor" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "bundle_products_pkey" PRIMARY KEY ("bundle_id","product_id")
);

-- CreateTable
CREATE TABLE "client_bundles" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "monthly_units" INTEGER,
    "display_volume" TEXT,
    "attachment_rate" DECIMAL(5,4),
    "plan_value" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "testimonial" TEXT,
    "revenue_generated" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "input_client_type" "ClientType",
    "input_gadgets" "GadgetCategory"[],
    "input_volume" "MonthlyVolumeRange",
    "input_goal" "PrimaryGoal",
    "input_distribution" "DistributionModel",
    "recommended_bundle_id" TEXT,
    "ai_response_raw" TEXT NOT NULL,
    "bundle_name" TEXT NOT NULL,
    "why_this_combo" JSONB NOT NULL,
    "objection_handler" TEXT,
    "similar_clients" JSONB,
    "projected_monthly_units" INTEGER,
    "projected_attachment_rate" DECIMAL(5,4),
    "projected_plan_value" DECIMAL(10,2),
    "projected_annual_revenue" DECIMAL(15,2),
    "client_revenue_share" DECIMAL(5,4),
    "tokens_used" INTEGER,
    "model_used" TEXT,
    "generation_ms" INTEGER,
    "from_cache" BOOLEAN NOT NULL DEFAULT false,
    "cache_key" TEXT,
    "feedback_rating" TEXT,
    "feedback_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "message_index" INTEGER NOT NULL,
    "tokens_used" INTEGER,
    "model_used" TEXT,
    "response_ms" INTEGER,
    "is_error" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "client_type" "ClientType",
    "gadget_categories" "GadgetCategory"[],
    "monthly_volume" "MonthlyVolumeRange",
    "primary_goal" "PrimaryGoal",
    "distribution_model" "DistributionModel",
    "recommended_bundle_id" TEXT,
    "ai_recommendation_text" TEXT,
    "projected_annual_revenue" DECIMAL(15,2),
    "chat_summary" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "assigned_to" TEXT,
    "notes" TEXT,
    "follow_up_at" TIMESTAMP(3),
    "converted_at" TIMESTAMP(3),
    "lost_reason" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performed_by" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abandoned_session_emails" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_type" "EmailType" NOT NULL,
    "sent_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "fail_reason" TEXT,
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),
    "resume_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "token_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abandoned_session_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "to_email" TEXT NOT NULL,
    "email_type" "EmailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT,
    "message_id" TEXT,
    "error" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "user_id" TEXT,
    "event" TEXT NOT NULL,
    "properties" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_primary_session_id_key" ON "users"("primary_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_email_idx" ON "sessions"("email");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_updated_at_idx" ON "sessions"("updated_at");

-- CreateIndex
CREATE INDEX "sessions_session_token_idx" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE INDEX "clients_client_type_idx" ON "clients"("client_type");

-- CreateIndex
CREATE INDEX "clients_is_featured_idx" ON "clients"("is_featured");

-- CreateIndex
CREATE INDEX "clients_is_active_idx" ON "clients"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bundles_slug_key" ON "bundles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "client_bundles_client_id_bundle_id_key" ON "client_bundles"("client_id", "bundle_id");

-- CreateIndex
CREATE UNIQUE INDEX "recommendations_session_id_key" ON "recommendations"("session_id");

-- CreateIndex
CREATE INDEX "chat_messages_session_id_message_index_idx" ON "chat_messages"("session_id", "message_index");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_assigned_to_idx" ON "leads"("assigned_to");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "lead_activities_lead_id_idx" ON "lead_activities"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "abandoned_session_emails_resume_token_key" ON "abandoned_session_emails"("resume_token");

-- CreateIndex
CREATE INDEX "abandoned_session_emails_session_id_idx" ON "abandoned_session_emails"("session_id");

-- CreateIndex
CREATE INDEX "abandoned_session_emails_resume_token_idx" ON "abandoned_session_emails"("resume_token");

-- CreateIndex
CREATE INDEX "email_logs_to_email_idx" ON "email_logs"("to_email");

-- CreateIndex
CREATE INDEX "email_logs_email_type_idx" ON "email_logs"("email_type");

-- CreateIndex
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events"("session_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_idx" ON "analytics_events"("event");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_primary_session_id_fkey" FOREIGN KEY ("primary_session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_products" ADD CONSTRAINT "bundle_products_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_products" ADD CONSTRAINT "bundle_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_bundles" ADD CONSTRAINT "client_bundles_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_bundles" ADD CONSTRAINT "client_bundles_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_recommended_bundle_id_fkey" FOREIGN KEY ("recommended_bundle_id") REFERENCES "bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_recommended_bundle_id_fkey" FOREIGN KEY ("recommended_bundle_id") REFERENCES "bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abandoned_session_emails" ADD CONSTRAINT "abandoned_session_emails_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
