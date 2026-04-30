-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MonthlyVolumeRange" ADD VALUE 'RANGE_UNDER_5K';
ALTER TYPE "MonthlyVolumeRange" ADD VALUE 'RANGE_5L_PLUS';

-- AlterTable
ALTER TABLE "abandoned_session_emails" ADD COLUMN     "description" TEXT,
ADD COLUMN     "resume_token_used_at" TIMESTAMP(3),
ADD COLUMN     "resume_url" TEXT,
ADD COLUMN     "to_email" TEXT;

-- AlterTable
ALTER TABLE "analytics_events" ADD COLUMN     "event_type" TEXT;

-- AlterTable
ALTER TABLE "bundles" ADD COLUMN     "attach_rate_p10" DECIMAL(5,4),
ADD COLUMN     "attach_rate_p50" DECIMAL(5,4),
ADD COLUMN     "attach_rate_p90" DECIMAL(5,4);

-- AlterTable
ALTER TABLE "chat_messages" ALTER COLUMN "message_index" DROP NOT NULL;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "avgDeviceASP" DECIMAL(10,2),
ADD COLUMN     "cityTier" INTEGER,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "existingProtectionVendor" TEXT,
ADD COLUMN     "nbfcPartnerNames" TEXT[],
ADD COLUMN     "primaryDistributionStates" TEXT[],
ADD COLUMN     "typicalDeviceCategories" "GadgetCategory"[];

-- AlterTable
ALTER TABLE "email_logs" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "opened_at" TIMESTAMP(3),
ADD COLUMN     "template_id" TEXT,
ADD COLUMN     "to_name" TEXT;

-- AlterTable
ALTER TABLE "lead_activities" ADD COLUMN     "body" TEXT,
ADD COLUMN     "outcome" TEXT,
ADD COLUMN     "subject" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "converted_client_id" TEXT,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "company_name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "attach_rate_p10" DECIMAL(5,2),
ADD COLUMN     "attach_rate_p50" DECIMAL(5,2),
ADD COLUMN     "attach_rate_p90" DECIMAL(5,2),
ADD COLUMN     "confidence_score" DECIMAL(5,2),
ADD COLUMN     "corrected_bundle_id" TEXT,
ADD COLUMN     "correction_reason" TEXT,
ADD COLUMN     "input_avg_device_asp" TEXT,
ADD COLUMN     "input_city_tier" INTEGER,
ADD COLUMN     "input_existing_vendor" TEXT,
ADD COLUMN     "input_nbfc_partners" TEXT[],
ADD COLUMN     "segment_p10_annual_revenue" DECIMAL(15,2),
ADD COLUMN     "segment_p50_annual_revenue" DECIMAL(15,2),
ADD COLUMN     "segment_p90_annual_revenue" DECIMAL(15,2),
ALTER COLUMN "ai_response_raw" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "client_type" "ClientType",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contact_name" TEXT,
ALTER COLUMN "session_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_email_verified" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "product_claim_stats" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "gadget_category" "GadgetCategory" NOT NULL,
    "claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "avg_settlement_days" DECIMAL(5,1) NOT NULL,
    "top_claim_reason" TEXT NOT NULL,
    "second_claim_reason" TEXT,
    "avg_repair_cost_rs" DECIMAL(10,2) NOT NULL,
    "claim_approval_rate_pct" DECIMAL(5,2) NOT NULL,
    "tier1_claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "tier2_claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "tier3_claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "aspir_device_claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "premium_device_claim_rate_pct" DECIMAL(5,2) NOT NULL,
    "peak_claim_months" TEXT[],
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_claim_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_performance_by_segments" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "client_type" "ClientType" NOT NULL,
    "volume_range" "MonthlyVolumeRange" NOT NULL,
    "city_tier" INTEGER NOT NULL,
    "avg_attach_rate_pct" DECIMAL(5,2) NOT NULL,
    "p10_attach_rate_pct" DECIMAL(5,2) NOT NULL,
    "p50_attach_rate_pct" DECIMAL(5,2) NOT NULL,
    "p90_attach_rate_pct" DECIMAL(5,2) NOT NULL,
    "avg_plan_value_rs" DECIMAL(10,2) NOT NULL,
    "sample_size" INTEGER NOT NULL,
    "top_drivers" TEXT[],
    "top_blockers" TEXT[],
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bundle_performance_by_segments_pkey" PRIMARY KEY ("id")
);
