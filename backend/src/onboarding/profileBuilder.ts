import { Segment } from './questions';

export interface PartnerProfile {
  segment: Segment;
  answers: Record<string, string>;
  // Derived fields for rule engine
  partnerSubType: string;
  monthlyVolume: string;
  primaryGoal: string;
  distributionModel: string;
  preferredProtection: string;
}

export function buildProfile(
  segment: Segment,
  answers: Record<string, string>,
): PartnerProfile {
  if (segment === 'gadget') {
    return {
      segment,
      answers,
      partnerSubType:       answers['partner_type']      ?? 'OEM',
      monthlyVolume:        answers['monthly_volume']    ?? '<1K',
      primaryGoal:          answers['main_objective']    ?? 'Add revenue per device',
      distributionModel:    answers['distribution_model'] ?? 'Offline retail',
      preferredProtection:  answers['priority_product']  ?? 'Accidental damage',
    };
  }

  if (segment === 'travel') {
    return {
      segment,
      answers,
      partnerSubType:       answers['business_model']    ?? 'OTA',
      monthlyVolume:        answers['monthly_volume']    ?? '<10K',
      primaryGoal:          answers['business_goal']     ?? 'More revenue per booking',
      distributionModel:    answers['commercial_model']  ?? 'Revenue share',
      preferredProtection:  'travel-device-protection',
    };
  }

  // automobile
  return {
    segment,
    answers,
    partnerSubType:       answers['partner_type']      ?? 'OEM',
    monthlyVolume:        answers['monthly_volume']    ?? '<1K',
    primaryGoal:          answers['commercial_goal']   ?? 'More revenue per sale',
    distributionModel:    answers['sales_model']       ?? 'Dealer-led',
    preferredProtection:  answers['priority_addon']    ?? 'Extended warranty',
  };
}
