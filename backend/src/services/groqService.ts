import Groq from 'groq-sdk';
import { env } from '../config/env';

const groqClient = new Groq({ apiKey: env.GROQ_API_KEY });

// ─── Prompt injection helpers ─────────────────────────────────────────────────

const STATIC_SYSTEM_PROMPT = `You are a senior Across Assist sales executive and protection bundle strategist. Across Assist is India's fastest-growing B2B protection platform — "Trust | Care | Protect".

PRODUCT CATALOG:
1. Accidental & Liquid Damage Protection (ALD)
   - Covers: Mobile, Laptop, Tablet, Smartwatch, TV
   - Best for: OEMs, retailers, telecom, NBFC EMI partners
   - Avg plan value: ₹800–₹1,500

2. Screen Damage Protection – OTSR (One Time Screen Replacement)
   - Covers: Single screen replacement from brand-authorized service centers
   - Best for: High-volume smartphone retailers, telecom
   - Avg plan value: ₹600–₹900

3. Extended Warranty (EW)
   - Covers: Beyond OEM warranty for appliances, mobile, laptop, tablet, TV
   - Includes: Home AMC + Burglary cover
   - Best for: Large appliance OEMs, NBFCs, retailers
   - Avg plan value: ₹1,200–₹2,500

4. Cyber Protection
   - Covers: Data security, antivirus, password security, digital theft insurance, identity theft assistance
   - Best for: Fintech, NBFC, corporate B2B
   - Avg plan value: ₹999–₹1,800

COMMISSION STRUCTURE (out of ₹1,200 standard plan value):
- Retailer: ₹250 (21% revenue share)
- Distributor: ₹100 (8.3% revenue share)
- NBFC/Fintech: ₹100 (8.3% revenue share)
- OEM/Brand: ₹300 (25% revenue share)
- Across Assist retains: ₹450 (37.5%)

REVENUE FORMULA:
Annual Revenue = Monthly Units × (Attachment Rate %) × Plan Value × (Revenue Share %)
Use realistic attachment rates: OEM=30%, Retailer=35%, NBFC=22%, Telecom=28%, Marketplace=18%

HISTORICAL BUNDLE PERFORMANCE DATA:
- OEM/Brand: ALD + Extended Warranty → 40% higher attachment, avg ₹1,800 plan, 30% attach rate
- NBFC/Fintech: Extended Warranty + Cyber Protection → 28% attach, best EMI conversion, reduces NPA
- Retailer (Smartphones): OTSR + ALD → 35% attach, impulse purchase at POS, highest ROI
- Telecom: ALD + Cyber Protection → 28% attach, strong device launch upsell
- Marketplace: EW + ALD → 18% attach, reduces returns, improves NPS

SIMILAR CLIENT EXAMPLES:
- OEM: TVS Motors (EW+ALD), IDFC First Bank (EW+Cyber), TVS Credit (ALD+EW)
- NBFC: Home Credit, DMI Finance, Kissht (ALD+EW bundle)
- Telecom: Vi/Vodafone Idea (ALD+OTSR)
- Fintech: Paytm Payments Bank, FPay, Tide (Cyber+ALD)
- Retailer: Cashify (OTSR+ALD for refurbished), MasterCard merchant partners
- Travel/Marketplace: MakeMyTrip, Thomas Cook, Goibibo
- Automotive: Spinny, Cars24 (EW+ALD for used vehicles)

INSTRUCTIONS:
1. Analyze the partner profile carefully and pick the best 2–3 product bundle
2. Calculate realistic projected annual revenue using the formula above
3. Give 3 specific, non-generic reasons for this bundle based on their goal and distribution
4. Reference 2 real similar clients from the list
5. Handle the most common objection this partner type raises
6. Be confident, specific, and data-driven — like a senior sales exec who has closed 100+ deals

OUTPUT: Respond ONLY with valid JSON. No markdown. No explanation. No preamble.
{
  "bundleName": "descriptive commercial bundle name",
  "products": ["Product Name 1", "Product Name 2"],
  "projectedAnnualRevenue": 18000000,
  "reasons": ["specific reason 1", "specific reason 2", "specific reason 3"],
  "similarClients": ["Client 1", "Client 2"],
  "objectionHandle": "one clear sentence addressing the #1 objection"
}`;

// ─── Chat system prompt (conversational — separate from recommendation JSON prompt) ──

const CHAT_SYSTEM_PROMPT = `You are a senior Across Assist sales executive and protection bundle strategist. Across Assist is India's fastest-growing B2B protection platform — "Trust | Care | Protect".

PRODUCT CATALOG:
1. Accidental & Liquid Damage Protection (ALD)
   - Covers: Mobile, Laptop, Tablet, Smartwatch, TV
   - Best for: OEMs, retailers, telecom, NBFC EMI partners
   - Avg plan value: ₹800–₹1,500

2. Screen Damage Protection – OTSR (One Time Screen Replacement)
   - Covers: Single screen replacement from brand-authorized service centers
   - Best for: High-volume smartphone retailers, telecom
   - Avg plan value: ₹600–₹900

3. Extended Warranty (EW)
   - Covers: Beyond OEM warranty for appliances, mobile, laptop, tablet, TV
   - Includes: Home AMC + Burglary cover
   - Best for: Large appliance OEMs, NBFCs, retailers
   - Avg plan value: ₹1,200–₹2,500

4. Cyber Protection
   - Covers: Data security, antivirus, password security, digital theft insurance, identity theft assistance
   - Best for: Fintech, NBFC, corporate B2B
   - Avg plan value: ₹999–₹1,800

COMMISSION STRUCTURE (out of ₹1,200 standard plan value):
- Retailer: ₹250 (21% revenue share)
- Distributor: ₹100 (8.3% revenue share)
- NBFC/Fintech: ₹100 (8.3% revenue share)
- OEM/Brand: ₹300 (25% revenue share)
- Across Assist retains: ₹450 (37.5%)

REVENUE FORMULA:
Annual Revenue = Monthly Units × (Attachment Rate %) × Plan Value × (Revenue Share %)
Use realistic attachment rates: OEM=30%, Retailer=35%, NBFC=22%, Telecom=28%, Marketplace=18%

SIMILAR CLIENT EXAMPLES:
- OEM: TVS Motors (EW+ALD), IDFC First Bank (EW+Cyber), TVS Credit (ALD+EW)
- NBFC: Home Credit, DMI Finance, Kissht (ALD+EW bundle)
- Telecom: Vi/Vodafone Idea (ALD+OTSR)
- Fintech: Paytm Payments Bank, FPay, Tide (Cyber+ALD)
- Retailer: Cashify (OTSR+ALD for refurbished), MasterCard merchant partners
- Travel/Marketplace: MakeMyTrip, Thomas Cook, Goibibo
- Automotive: Spinny, Cars24 (EW+ALD for used vehicles)

INSTRUCTIONS:
- Answer questions conversationally as a knowledgeable senior sales executive
- Be specific and data-driven — reference real clients, real numbers, real formulas
- If asked about revenue, use the formula above with realistic attachment rates
- Explain bundle benefits clearly and address concerns with confidence
- Do NOT respond in JSON format — respond in plain, concise conversational text`;

function buildChatSystemPrompt(ctx?: ChatSessionContext): string {
  if (!ctx) return CHAT_SYSTEM_PROMPT + '\n\nKeep responses concise — under 300 words. Be specific and data-driven.';

  let prompt = CHAT_SYSTEM_PROMPT;
  const profileLines: string[] = [];

  if (ctx.partnerType) profileLines.push(`This client is a ${ctx.partnerType}`);
  if (ctx.segment) profileLines.push(`operating in the ${ctx.segment} sector`);
  if (ctx.products?.length) profileLines.push(`selling ${ctx.products.join(', ')}`);
  if (ctx.volume) profileLines.push(`at ${ctx.volume} monthly volume`);
  if (profileLines.length > 0) prompt += `\n\n${profileLines.join(', ')}.`;
  if (ctx.goal) prompt += `\nTheir primary goal is: ${ctx.goal}`;
  if (ctx.distribution) prompt += `\nDistribution model: ${ctx.distribution}`;
  if (ctx.recommendedBundle) {
    prompt += `\nThey have already been recommended: ${ctx.recommendedBundle}. Do not recommend a different bundle unless they explicitly ask. Instead, help them understand this bundle better and answer their specific questions.`;
  }

  return prompt + '\n\nKeep responses concise — under 300 words. Be specific and data-driven.';
}

// ─── Blocked message guard (also exported for chatController) ─────────────────

const BLOCKED_PATTERNS = [
  /ignore (previous|above|all) instructions/i,
  /you are now/i,
  /pretend you are/i,
  /jailbreak/i,
  /DAN mode/i,
  /reveal your (prompt|instructions)/i,
  /forget your instructions/i,
];

export const BLOCKED_RESPONSE =
  "I'm specifically here to help with gadget protection bundles for institutional clients. What would you like to know about our protection plans or revenue model?";

export function isBlockedMessage(msg: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(msg));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecommendationInput {
  partnerType: string;
  products: string[];
  volume: string;
  goal: string;
  distribution: string;
}

export interface RecommendationResult {
  bundleName: string;
  products: string[];
  projectedAnnualRevenue: number;
  reasons: string[];
  similarClients: string[];
  objectionHandle: string;
}

interface RecommendationMeta {
  tokensUsed: number;
  modelUsed: string;
  generationMs: number;
}

interface DbBundle {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
}

interface DbSimilarClient {
  client: { name: string; tier: string; industry: string | null };
  monthlyUnits: number | null;
}

interface DbContext {
  bundles: DbBundle[];
  similarClients: DbSimilarClient[];
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSessionContext {
  partnerType?: string | null;
  products?: string[];
  volume?: string | null;
  goal?: string | null;
  distribution?: string | null;
  recommendedBundle?: string | null;
  /** NEW — set from Session.formData.segment after onboarding ('travel' | 'gadget' | 'automobile') */
  segment?: string | null;
}

// ─── GroqService ──────────────────────────────────────────────────────────────

export class GroqService {
  async generateRecommendation(
    input: RecommendationInput,
    dbContext: DbContext,
  ): Promise<{ result: RecommendationResult; metadata: RecommendationMeta }> {
    const dynamicSection = this.buildDbContextSection(dbContext);

    const systemPrompt = STATIC_SYSTEM_PROMPT + dynamicSection;

    const userMessage = `Partner Profile:
- Partner Type: ${input.partnerType}
- Products Sold: ${input.products.join(', ')}
- Monthly Volume: ${input.volume}
- Primary Goal: ${input.goal}
- Distribution Model: ${input.distribution}

Recommend the optimal Across Assist protection bundle for this partner. Use the formula: Monthly Units × Attachment Rate × Plan Value × Revenue Share % to calculate projected annual revenue. Pick the most realistic volume from the range given.`;

    const t0 = Date.now();

    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.65,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const generationMs = Date.now() - t0;
    const content = completion.choices[0]?.message?.content ?? '';
    const tokensUsed = completion.usage?.total_tokens ?? 0;
    const modelUsed = completion.model;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned an unexpected response format. Please try again.');

    const result = JSON.parse(jsonMatch[0]) as RecommendationResult;
    return { result, metadata: { tokensUsed, modelUsed, generationMs } };
  }

  async generateChatResponse(
    history: ChatHistoryItem[],
    userMessage: string,
    sessionContext?: ChatSessionContext,
  ): Promise<{ content: string; tokensUsed: number; modelUsed: string; responseMs: number }> {
    const t0 = Date.now();

    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: 'system', content: buildChatSystemPrompt(sessionContext) },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ],
    });

    const responseMs = Date.now() - t0;
    const content =
      completion.choices[0]?.message?.content ??
      "I'm having trouble responding right now. Please try again.";
    const tokensUsed = completion.usage?.total_tokens ?? 0;
    const modelUsed = completion.model;

    return { content, tokensUsed, modelUsed, responseMs };
  }

  private buildDbContextSection(dbContext: DbContext): string {
    if (!dbContext.bundles.length && !dbContext.similarClients.length) return '';

    const lines: string[] = ['\n\nREAL-TIME DATA FROM DATABASE (use this for accuracy):'];

    if (dbContext.bundles.length) {
      lines.push('\nACTIVE BUNDLES — use one of these EXACT names in bundleName field:');
      dbContext.bundles.forEach((b) => {
        lines.push(`- ${b.name}${b.tagline ? `: ${b.tagline}` : ''}`);
      });
    }

    if (dbContext.similarClients.length) {
      lines.push('\nVERIFIED CLIENT PARTNERSHIPS (similar partner type):');
      dbContext.similarClients.slice(0, 8).forEach((cb) => {
        const units = cb.monthlyUnits
          ? ` — ${cb.monthlyUnits.toLocaleString('en-IN')} units/month`
          : '';
        lines.push(`- ${cb.client.name} (${cb.client.tier}${cb.client.industry ? `, ${cb.client.industry}` : ''})${units}`);
      });
    }

    return lines.join('\n');
  }
}

export const groqService = new GroqService();
