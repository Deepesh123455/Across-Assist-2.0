/*
  Warnings:

  - You are about to drop the column `projected_monthly_units` on the `recommendations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recommendations" DROP COLUMN "projected_monthly_units",
ADD COLUMN     "projectedMonthlyUnits" INTEGER;

-- AddForeignKey
ALTER TABLE "product_claim_stats" ADD CONSTRAINT "product_claim_stats_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_performance_by_segments" ADD CONSTRAINT "bundle_performance_by_segments_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
