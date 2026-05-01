import { PartnerProfile } from './profileBuilder';

// ─── Add-On type ──────────────────────────────────────────────────────────────

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  isDefault: boolean;
  segment: string;
  icon: string;
}

// ─── Deterministic Bundle Selection ───────────────────────────────────────────

/**
 * Returns the slug of the best-fit bundle for the given partner profile.
 * Uses only the 4 seeded bundles: complete-device-shield, emi-bundle-pack,
 * travel-protection-suite, refurb-shield.
 */
export function selectBundle(profile: PartnerProfile): string {
  const { segment, answers } = profile;

  if (segment === 'travel') {
    return 'travel-protection-suite';
  }

  if (segment === 'gadget') {
    const partnerType = answers['partner_type'] ?? '';
    const distribution = answers['distribution_model'] ?? '';
    const objective = answers['main_objective'] ?? '';
    const productCat = answers['product_category'] ?? '';

    // NBFC-flavoured partners → EMI Bundle Pack
    if (partnerType === 'NBFC' || distribution === 'NBFC EMI') {
      return 'emi-bundle-pack';
    }

    // Marketplace selling refurb / reducing complaints → Refurb Shield
    if (
      partnerType === 'Marketplace' &&
      (objective === 'Reduce complaints' || productCat === 'Mobile')
    ) {
      return 'refurb-shield';
    }

    // OEM / Retailer / high-ASP → Complete Device Shield (flagship)
    return 'complete-device-shield';
  }

  if (segment === 'automobile') {
    const partnerType = answers['partner_type'] ?? '';
    const emiBundling = answers['emi_bundling'] ?? '';
    const salesModel = answers['sales_model'] ?? '';

    // NBFC, fleet, or explicit EMI bundling → EMI Bundle Pack
    if (
      partnerType === 'NBFC' ||
      partnerType === 'Fleet operator' ||
      emiBundling === 'Yes' ||
      salesModel === 'NBFC-led'
    ) {
      return 'emi-bundle-pack';
    }

    // All other auto partners → Complete Device Shield (EW+AD for vehicles)
    return 'complete-device-shield';
  }

  return 'complete-device-shield';
}

// ─── Contextual Add-Ons ───────────────────────────────────────────────────────

const TRAVEL_ADDONS: AddOn[] = [
  {
    id: 'baggage-cover',
    name: 'Baggage & Belongings Cover',
    description: 'Covers lost, stolen, or damaged baggage and personal items during travel',
    price: 199,
    isDefault: false,
    segment: 'travel',
    icon: '🧳',
  },
  {
    id: 'medical-assistance',
    name: 'Medical Assistance Cover',
    description: '24×7 emergency medical helpline + expense coverage up to ₹25,000 per trip',
    price: 299,
    isDefault: true,
    segment: 'travel',
    icon: '🏥',
  },
  {
    id: 'flight-delay',
    name: 'Flight Delay Compensation',
    description: 'Fixed compensation for delays over 2 hours at Indian airports',
    price: 149,
    isDefault: false,
    segment: 'travel',
    icon: '⏱️',
  },
  {
    id: 'trip-cancellation',
    name: 'Trip Cancellation Protection',
    description: 'Protects non-refundable booking costs on emergency cancellations',
    price: 249,
    isDefault: true,
    segment: 'travel',
    icon: '🔒',
  },
  {
    id: 'cyber-travel',
    name: 'Travel Cyber Protection',
    description: 'UPI fraud & digital theft coverage while travelling internationally',
    price: 199,
    isDefault: false,
    segment: 'travel',
    icon: '🛡️',
  },
];

const AUTO_ADDONS: AddOn[] = [
  {
    id: 'roadside-assistance',
    name: 'Roadside Assistance Pack',
    description: '24×7 breakdown, towing, flat tyre, and emergency fuel delivery across 500+ cities',
    price: 499,
    isDefault: true,
    segment: 'automobile',
    icon: '🛣️',
  },
  {
    id: 'extended-warranty-auto',
    name: 'Extended Warranty (Vehicle)',
    description: 'Covers mechanical & electrical failures beyond OEM warranty for up to 3 years',
    price: 999,
    isDefault: true,
    segment: 'automobile',
    icon: '🔧',
  },
  {
    id: 'amc-pack',
    name: 'Annual Maintenance Contract',
    description: 'Scheduled servicing + priority workshop slots at 1,200+ partner garages',
    price: 699,
    isDefault: false,
    segment: 'automobile',
    icon: '📋',
  },
  {
    id: 'pickup-drop',
    name: 'Pickup & Drop Service',
    description: 'Doorstep vehicle pickup and drop for all service and repair visits',
    price: 299,
    isDefault: false,
    segment: 'automobile',
    icon: '🚙',
  },
];

/**
 * Returns contextual add-ons for travel and automobile segments (synthetic).
 * For gadget, returns an empty array — the BundlesPage fetches products directly
 * from the bundle endpoint and shows non-bundle products as add-ons.
 */
export function getContextualAddOns(profile: PartnerProfile): AddOn[] {
  switch (profile.segment) {
    case 'travel': return TRAVEL_ADDONS;
    case 'automobile': return AUTO_ADDONS;
    case 'gadget': return []; // derived from DB products in onboardingService
  }
}

// ─── Revenue projection helpers ───────────────────────────────────────────────

export interface ProjectedMetrics {
  monthlyUnits: number;
  attachRate: number;
  planValue: number;
  revenueShare: number;
  projectedAnnualRevenue: number;
}

const VOLUME_MAP: Record<string, number> = {
  // travel booking volumes
  '<10K': 5000, '10K–50K': 30000, '50K–1L': 75000, '1L+': 150000,
  // gadget monthly sales
  '<1K': 500, '1K–10K': 5500, '15K–55K': 30000, '50K+': 75000,
  // auto monthly units (auto questions use '1K–5K' etc so distinct from gadget)
  '1K–5K': 3000, '5K–20K': 12500, '20K+': 25000,
};


const SEGMENT_ATTACH_RATE: Record<string, number> = {
  travel: 0.18,
  gadget: 0.28,
  automobile: 0.22,
};

const SEGMENT_PLAN_VALUE: Record<string, number> = {
  travel: 649,
  gadget: 1200,
  automobile: 1299,
};

const SEGMENT_REVENUE_SHARE: Record<string, number> = {
  travel: 0.25,
  gadget: 0.22,
  automobile: 0.20,
};

export function projectRevenue(profile: PartnerProfile): ProjectedMetrics {
  const monthlyUnits = VOLUME_MAP[profile.monthlyVolume] ?? 5000;
  const attachRate = SEGMENT_ATTACH_RATE[profile.segment] ?? 0.22;
  const planValue = SEGMENT_PLAN_VALUE[profile.segment] ?? 1200;
  const revenueShare = SEGMENT_REVENUE_SHARE[profile.segment] ?? 0.20;

  const projectedAnnualRevenue = Math.round(
    monthlyUnits * attachRate * planValue * revenueShare * 12,
  );

  return { monthlyUnits, attachRate, planValue, revenueShare, projectedAnnualRevenue };
}
