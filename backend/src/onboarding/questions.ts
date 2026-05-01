export type Segment = 'travel' | 'gadget' | 'automobile';

export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface SegmentOption {
  id: Segment;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const SEGMENT_OPTIONS: SegmentOption[] = [
  {
    id: 'travel',
    label: 'Travel',
    description: 'OTA, offline agency, corporate travel, holiday packages',
    color: 'blue',
    icon: '✈️',
  },
  {
    id: 'gadget',
    label: 'Gadget & Appliances',
    description: 'OEM, retailer, marketplace, NBFC, distributor',
    color: 'purple',
    icon: '📱',
  },
  {
    id: 'automobile',
    label: 'Automobile',
    description: 'OEM, dealer network, NBFC, fleet operator',
    color: 'green',
    icon: '🚗',
  },
];

export const TRAVEL_QUESTIONS: Question[] = [
  {
    id: 'business_model',
    text: 'What is your primary travel business model?',
    options: ['OTA', 'Offline travel agency', 'Corporate travel', 'Holiday packages'],
  },
  {
    id: 'monthly_volume',
    text: 'What is your monthly booking volume?',
    options: ['<10K', '10K–50K', '50K–1L', '1L+'],
  },
  {
    id: 'ticket_size',
    text: 'What is your average ticket size?',
    options: ['<₹5K', '₹5K–₹15K', '₹15K–₹50K', '₹50K+'],
  },
  {
    id: 'products_sold',
    text: 'What travel products do you sell most?',
    options: ['Flights', 'Hotels', 'Packages', 'Visa/support services'],
  },
  {
    id: 'intl_pct',
    text: 'What percentage of bookings are international?',
    options: ['0–10%', '10–25%', '25–50%', '50%+'],
  },
  {
    id: 'protection_stage',
    text: 'At what stage do you want to show protection?',
    options: ['Search results', 'Cart', 'Payment page', 'Post-booking'],
  },
  {
    id: 'business_goal',
    text: 'What is your main business goal?',
    options: ['More revenue per booking', 'Higher conversion', 'Better customer trust', 'Reduced post-booking support'],
  },
  {
    id: 'existing_addon',
    text: 'Do you already sell any add-on or insurance product?',
    options: ['Yes', 'No'],
  },
  {
    id: 'claims_setup',
    text: 'What is your claims/support setup?',
    options: ['In-house', 'Partner-managed', 'Need full support'],
  },
  {
    id: 'commercial_model',
    text: 'What is your preferred commercial model?',
    options: ['Fixed commission', 'Revenue share', 'Hybrid', 'Per-transaction fee'],
  },
  {
    id: 'api_integration',
    text: 'Do you want integration via API?',
    options: ['Yes', 'No', 'Need both portal and API'],
  },
  {
    id: 'target_markets',
    text: 'Which markets are you targeting?',
    options: ['India domestic', 'International', 'Both'],
  },
];

export const GADGET_QUESTIONS: Question[] = [
  {
    id: 'partner_type',
    text: 'What type of partner are you?',
    options: ['OEM', 'Retailer', 'Marketplace', 'NBFC', 'Distributor'],
  },
  {
    id: 'product_category',
    text: 'What product category do you sell most?',
    options: ['Mobile', 'Laptop', 'TV', 'Large appliance'],
  },
  {
    id: 'device_price_band',
    text: 'What is your average device price band?',
    options: ['<₹20K', '₹20K–₹50K', '₹50K+'],
  },
  {
    id: 'monthly_volume',
    text: 'What is your monthly sales volume?',
    options: ['<1K', '1K–10K', '10K–50K', '50K+'],
  },
  {
    id: 'distribution_model',
    text: 'What is your current distribution model?',
    options: ['Offline retail', 'Online commerce', 'NBFC EMI', 'Mixed'],
  },
  {
    id: 'main_objective',
    text: 'What is your main objective?',
    options: ['Add revenue per device', 'Reduce complaints', 'Increase EMI attachment', 'Improve post-sale retention'],
  },
  {
    id: 'attach_timing',
    text: 'When do you want to attach the plan?',
    options: ['At purchase', 'At EMI disbursal', 'At delivery', 'Post-sale'],
  },
  {
    id: 'existing_addon',
    text: 'Do you already offer any protection or warranty add-on?',
    options: ['Yes', 'No'],
  },
  {
    id: 'claims_setup',
    text: 'What is your current service/claims setup?',
    options: ['In-house', 'Partner-managed', 'Need full backend support'],
  },
  {
    id: 'priority_product',
    text: 'Which protection product matters most?',
    options: ['Accidental damage', 'Screen protection', 'Extended warranty', 'Cyber protection'],
  },
  {
    id: 'settlement_cycle',
    text: 'What is your preferred settlement cycle?',
    options: ['Weekly', 'Monthly', 'Quarterly'],
  },
  {
    id: 'staff_training',
    text: 'Do you need retailer/sales-staff training?',
    options: ['Yes', 'No'],
  },
];

export const AUTO_QUESTIONS: Question[] = [
  {
    id: 'partner_type',
    text: 'What type of mobility partner are you?',
    options: ['OEM', 'Marketplace', 'NBFC', 'Dealer network', 'Fleet operator'],
  },
  {
    id: 'vehicle_category',
    text: 'What vehicle category do you sell?',
    options: ['2W', '4W', 'EV', 'Commercial vehicle'],
  },
  {
    id: 'monthly_volume',
    text: 'What is your monthly unit volume?',
    options: ['<1K', '1K–5K', '5K–20K', '20K+'],
  },
  {
    id: 'vehicle_value',
    text: 'What is your average vehicle value?',
    options: ['<₹1L', '₹1L–₹3L', '₹3L–₹10L', '₹10L+'],
  },
  {
    id: 'commercial_goal',
    text: 'What is your commercial goal?',
    options: ['More revenue per sale', 'Better financing attach', 'Lower post-sale risk', 'Higher retention'],
  },
  {
    id: 'sales_model',
    text: 'Which sales model do you use?',
    options: ['Dealer-led', 'Online-led', 'NBFC-led', 'Hybrid'],
  },
  {
    id: 'priority_addon',
    text: 'Which add-on matters most?',
    options: ['Roadside assistance', 'Extended warranty', 'AMC', 'Pickup/drop support'],
  },
  {
    id: 'offer_stage',
    text: 'At what stage should the offer appear?',
    options: ['Lead stage', 'Booking stage', 'Financing stage', 'Delivery stage'],
  },
  {
    id: 'existing_claims',
    text: 'Do you already have service partners or a claims network?',
    options: ['Yes', 'No', 'Need Across Assist support'],
  },
  {
    id: 'emi_bundling',
    text: 'Do you want EMI bundling?',
    options: ['Yes', 'No', 'Maybe'],
  },
  {
    id: 'commercial_structure',
    text: 'What is your preferred commercial structure?',
    options: ['Revenue share', 'Fixed fee', 'Hybrid', 'Per unit sold'],
  },
  {
    id: 'multi_state',
    text: 'Do you want support in multiple states?',
    options: ['Yes', 'No'],
  },
];

export function getQuestionsForSegment(segment: Segment): Question[] {
  switch (segment) {
    case 'travel':     return TRAVEL_QUESTIONS;
    case 'gadget':     return GADGET_QUESTIONS;
    case 'automobile': return AUTO_QUESTIONS;
  }
}
