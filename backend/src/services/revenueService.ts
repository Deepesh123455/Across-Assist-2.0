// ─── Maps (match frontend exactly) ───────────────────────────────────────────

export const VOLUME_MIDPOINTS: Record<string, number> = {
  'Under 5K units': 2500,
  '5K–50K': 25000,
  '50K–5L': 150000,
  '5L+ units': 750000,
};

export const ATTACH_RATES: Record<string, number> = {
  'OEM/Brand': 0.30,
  'NBFC/Fintech': 0.22,
  'Retailer': 0.35,
  'Marketplace': 0.18,
  'Telecom': 0.28,
};

export const REVENUE_SHARES: Record<string, number> = {
  'OEM/Brand': 0.25,
  'NBFC/Fintech': 0.083,
  'Retailer': 0.21,
  'Marketplace': 0.083,
  'Telecom': 0.21,
};

// ─── displayStat formatter (shared with bundle/recommendation controllers) ────

export function formatDisplayStat(totalClients: number, totalMonthlyUnits: number): string {
  const companyLabel = `${totalClients} ${totalClients === 1 ? 'company' : 'companies'}`;
  let unitStr: string;
  if (totalMonthlyUnits >= 100000) {
    unitStr = `${(totalMonthlyUnits / 100000).toFixed(2)}L units/month`;
  } else if (totalMonthlyUnits >= 1000) {
    unitStr = `${(totalMonthlyUnits / 1000).toFixed(1)}K units/month`;
  } else {
    unitStr = `${totalMonthlyUnits} units/month`;
  }
  return `${companyLabel} · ${unitStr}`;
}

// ─── Revenue calculator ───────────────────────────────────────────────────────

export interface RevenueResult {
  projectedAnnualRevenue: number;
  monthlyUnits: number;
  attachRate: number;
  revenueShare: number;
  planValue: number;
}

export function calculateRevenue(
  partnerType: string,
  volume: string,
  planValue = 1200,
  aiRevenue?: number,
): RevenueResult {
  const monthlyUnits = VOLUME_MIDPOINTS[volume] ?? 25000;
  const attachRate = ATTACH_RATES[partnerType] ?? 0.25;
  const revenueShare = REVENUE_SHARES[partnerType] ?? 0.21;

  const projectedAnnualRevenue =
    aiRevenue ?? Math.round(monthlyUnits * attachRate * planValue * revenueShare * 12);

  return { projectedAnnualRevenue, monthlyUnits, attachRate, revenueShare, planValue };
}
