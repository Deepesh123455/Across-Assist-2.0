import api from './api';

export type Segment = 'travel' | 'gadget' | 'automobile';

export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  isDefault: boolean;
  segment: string;
  icon: string;
}

export interface BundleProduct {
  id: string;
  name: string;
  category: string;
  iconEmoji: string | null;
  tagline: string | null;
  isAnchor: boolean;
}

export interface RecommendationResult {
  bundleSlug: string;
  bundleName: string;
  bundleTagline: string | null;
  bundleDescription: string;
  whyThisBundle: string[];
  objectionHandler: string;
  products: BundleProduct[];
  addOns: AddOn[];
  metrics: {
    monthlyUnits: number;
    attachRate: number;
    planValue: number;
    revenueShare: number;
    projectedAnnualRevenue: number;
    attachRateP10: number | null;
    attachRateP50: number | null;
    attachRateP90: number | null;
    averagePlanValue: number;
  };
  similarClients: { name: string; logoUrl: string | null; tier: string; monthlyUnits: number | null }[];
}

export const onboardingService = {
  async getQuestions(segment: Segment): Promise<{ questions: Question[]; totalSteps: number }> {
    const res = await api.get(`/onboarding/questions/${segment}`);
    return res.data.data;
  },

  async saveAnswer(
    sessionToken: string | null,
    segment: Segment,
    questionId: string,
    answer: string,
  ): Promise<{ currentStep: number; totalSteps: number; isLastQuestion: boolean; sessionToken?: string }> {
    const res = await api.post('onboarding/answer', { sessionToken, segment, questionId, answer });
    return res.data.data;
  },

  async getRecommendation(sessionToken: string, segment: Segment): Promise<RecommendationResult> {
    const res = await api.post('onboarding/recommend', { sessionToken, segment });
    return res.data.data;
  },

  async getProfileStatus(sessionToken: string) {
    const res = await api.get(`/onboarding/profile/${sessionToken}`);
    return res.data.data;
  },

  async getAddOns(segment: Segment, bundleSlug?: string): Promise<AddOn[]> {
    const params = bundleSlug ? `?bundleSlug=${bundleSlug}` : '';
    const res = await api.get(`/onboarding/addons/${segment}${params}`);
    return res.data.data.addOns;
  },
};
