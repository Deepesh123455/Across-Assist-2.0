import { PrismaClient, Prisma, ClientType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// DETERMINISTIC FIXED UUIDs
// ─────────────────────────────────────────────

// Users
const USER_ARJUN = "00000000-0000-0000-0000-000000000001";
const USER_PRIYA = "00000000-0000-0000-0000-000000000002";

// Sessions
const SESSION_ACTIVE = "00000000-0000-0000-0001-000000000001";
const SESSION_ABANDONED = "00000000-0000-0000-0001-000000000002";
const SESSION_COMPLETED = "00000000-0000-0000-0001-000000000003";

// Products
const PRODUCT_AD = "00000000-0000-0000-0002-000000000001"; // Accidental Damage
const PRODUCT_SP = "00000000-0000-0000-0002-000000000002"; // Screen Protection
const PRODUCT_EW = "00000000-0000-0000-0002-000000000003"; // Extended Warranty
const PRODUCT_CP = "00000000-0000-0000-0002-000000000004"; // Cyber Protection

// Bundles
const BUNDLE_CDS = "00000000-0000-0000-0003-000000000001"; // Complete Device Shield
const BUNDLE_EMI = "00000000-0000-0000-0003-000000000002"; // EMI Bundle Pack
const BUNDLE_TPS = "00000000-0000-0000-0003-000000000003"; // Travel Protection Suite
const BUNDLE_RS = "00000000-0000-0000-0004-000000000004";  // Refurb Shield

// Clients (33)
const CLIENT_PAYTM = "00000000-0000-0000-0004-000000000001";
const CLIENT_IDFC = "00000000-0000-0000-0004-000000000002";
const CLIENT_TVS_CREDIT = "00000000-0000-0000-0004-000000000003";
const CLIENT_HOME_CREDIT = "00000000-0000-0000-0004-000000000004";
const CLIENT_DMI = "00000000-0000-0000-0004-000000000005";
const CLIENT_AVANSE = "00000000-0000-0000-0004-000000000006";
const CLIENT_KISSHT = "00000000-0000-0000-0004-000000000007";
const CLIENT_TIDE = "00000000-0000-0000-0004-000000000008";
const CLIENT_VI = "00000000-0000-0000-0004-000000000009";
const CLIENT_CASHIFY = "00000000-0000-0000-0004-000000000010";
const CLIENT_MMT = "00000000-0000-0000-0004-000000000011";
const CLIENT_GOIBIBO = "00000000-0000-0000-0004-000000000012";
const CLIENT_SPINNY = "00000000-0000-0000-0004-000000000013";
const CLIENT_CARS24 = "00000000-0000-0000-0004-000000000014";
const CLIENT_THOMAS_COOK = "00000000-0000-0000-0004-000000000015";
const CLIENT_REDBUS = "00000000-0000-0000-0004-000000000016";
const CLIENT_PARKPLUS = "00000000-0000-0000-0004-000000000017";
const CLIENT_HOUSING = "00000000-0000-0000-0004-000000000018";
const CLIENT_TVS_MOTOR = "00000000-0000-0000-0004-000000000019";
const CLIENT_OLA = "00000000-0000-0000-0004-000000000020";
const CLIENT_MONTRA = "00000000-0000-0000-0004-000000000021";
const CLIENT_CORVELL = "00000000-0000-0000-0004-000000000022";
const CLIENT_GOMECHANIC = "00000000-0000-0000-0004-000000000023";
const CLIENT_ICICI_LOMBARD = "00000000-0000-0000-0004-000000000024";
const CLIENT_MASTERCARD = "00000000-0000-0000-0004-000000000025";
const CLIENT_VISA = "00000000-0000-0000-0004-000000000026";
const CLIENT_HERO_INSURANCE = "00000000-0000-0000-0004-000000000027";
const CLIENT_SBI_GENERAL = "00000000-0000-0000-0004-000000000028";
const CLIENT_UNIVERSAL_SOMPO = "00000000-0000-0000-0004-000000000029";
const CLIENT_ADITYA_BIRLA = "00000000-0000-0000-0004-000000000030";
const CLIENT_MAX_HEALTHCARE = "00000000-0000-0000-0004-000000000031";
const CLIENT_RISKCOVRY = "00000000-0000-0000-0004-000000000032";
const CLIENT_IFFCO = "00000000-0000-0000-0004-000000000033";

// Client Bundles (33)
const CB_PAYTM = "00000000-0000-0000-0005-000000000001";
const CB_IDFC = "00000000-0000-0000-0005-000000000002";
const CB_TVS_CREDIT = "00000000-0000-0000-0005-000000000003";
const CB_HOME_CREDIT = "00000000-0000-0000-0005-000000000004";
const CB_DMI = "00000000-0000-0000-0005-000000000005";
const CB_AVANSE = "00000000-0000-0000-0005-000000000006";
const CB_KISSHT = "00000000-0000-0000-0005-000000000007";
const CB_TIDE = "00000000-0000-0000-0005-000000000008";
const CB_VI = "00000000-0000-0000-0005-000000000009";
const CB_CASHIFY = "00000000-0000-0000-0005-000000000010";
const CB_MMT = "00000000-0000-0000-0005-000000000011";
const CB_GOIBIBO = "00000000-0000-0000-0005-000000000012";
const CB_SPINNY = "00000000-0000-0000-0005-000000000013";
const CB_CARS24 = "00000000-0000-0000-0005-000000000014";
const CB_THOMAS_COOK = "00000000-0000-0000-0005-000000000015";
const CB_REDBUS = "00000000-0000-0000-0005-000000000016";
const CB_PARKPLUS = "00000000-0000-0000-0005-000000000017";
const CB_HOUSING = "00000000-0000-0000-0005-000000000018";
const CB_TVS_MOTOR = "00000000-0000-0000-0005-000000000019";
const CB_OLA = "00000000-0000-0000-0005-000000000020";
const CB_MONTRA = "00000000-0000-0000-0005-000000000021";
const CB_CORVELL = "00000000-0000-0000-0005-000000000022";
const CB_GOMECHANIC = "00000000-0000-0000-0005-000000000023";
const CB_ICICI_LOMBARD = "00000000-0000-0000-0005-000000000024";
const CB_MASTERCARD = "00000000-0000-0000-0005-000000000025";
const CB_VISA = "00000000-0000-0000-0005-000000000026";
const CB_HERO_INSURANCE = "00000000-0000-0000-0005-000000000027";
const CB_SBI_GENERAL = "00000000-0000-0000-0005-000000000028";
const CB_UNIVERSAL_SOMPO = "00000000-0000-0000-0005-000000000029";
const CB_ADITYA_BIRLA = "00000000-0000-0000-0005-000000000030";
const CB_MAX_HEALTHCARE = "00000000-0000-0000-0005-000000000031";
const CB_RISKCOVRY = "00000000-0000-0000-0005-000000000032";
const CB_IFFCO = "00000000-0000-0000-0005-000000000033";

// Recommendations (13)
const REC_01 = "00000000-0000-0000-0006-000000000001";
const REC_02 = "00000000-0000-0000-0006-000000000002";
const REC_03 = "00000000-0000-0000-0006-000000000003";
const REC_04 = "00000000-0000-0000-0006-000000000004";
const REC_05 = "00000000-0000-0000-0006-000000000005";
const REC_06 = "00000000-0000-0000-0006-000000000006";
const REC_07 = "00000000-0000-0000-0006-000000000007";
const REC_08 = "00000000-0000-0000-0006-000000000008";
const REC_09 = "00000000-0000-0000-0006-000000000009";
const REC_10 = "00000000-0000-0000-0006-000000000010";
const REC_11 = "00000000-0000-0000-0006-000000000011"; // INACCURATE
const REC_12 = "00000000-0000-0000-0006-000000000012"; // INACCURATE
const REC_13 = "00000000-0000-0000-0006-000000000013"; // INACCURATE

// Product Claim Stats (8)
const PCS_AD_SMART = "00000000-0000-0000-0007-000000000001";
const PCS_AD_LAPTOP = "00000000-0000-0000-0007-000000000002";
const PCS_AD_TV = "00000000-0000-0000-0007-000000000003";
const PCS_SP_SMART = "00000000-0000-0000-0007-000000000004";
const PCS_SP_LAPTOP = "00000000-0000-0000-0007-000000000005";
const PCS_EW_TV = "00000000-0000-0000-0007-000000000006";
const PCS_EW_LARGE = "00000000-0000-0000-0007-000000000007";
const PCS_CP_SMART = "00000000-0000-0000-0007-000000000008";

// Bundle Performance By Segment (12)
const BPS_01 = "00000000-0000-0000-0008-000000000001";
const BPS_02 = "00000000-0000-0000-0008-000000000002";
const BPS_03 = "00000000-0000-0000-0008-000000000003";
const BPS_04 = "00000000-0000-0000-0008-000000000004";
const BPS_05 = "00000000-0000-0000-0008-000000000005";
const BPS_06 = "00000000-0000-0000-0008-000000000006";
const BPS_07 = "00000000-0000-0000-0008-000000000007";
const BPS_08 = "00000000-0000-0000-0008-000000000008";
const BPS_09 = "00000000-0000-0000-0008-000000000009";
const BPS_10 = "00000000-0000-0000-0008-000000000010";
const BPS_11 = "00000000-0000-0000-0008-000000000011";
const BPS_12 = "00000000-0000-0000-0008-000000000012";

// Chat Messages (4)
const CHAT_01 = "00000000-0000-0000-0009-000000000001";
const CHAT_02 = "00000000-0000-0000-0009-000000000002";
const CHAT_03 = "00000000-0000-0000-0009-000000000003";
const CHAT_04 = "00000000-0000-0000-0009-000000000004";

// Leads (3)
const LEAD_ROHIT = "00000000-0000-0000-0010-000000000001";
const LEAD_VIKRAM = "00000000-0000-0000-0010-000000000002";
const LEAD_PRIYA = "00000000-0000-0000-0010-000000000003";

// Lead Activities (3)
const LA_01 = "00000000-0000-0000-0011-000000000001";
const LA_02 = "00000000-0000-0000-0011-000000000002";
const LA_03 = "00000000-0000-0000-0011-000000000003";

// Abandoned Session Emails (2)
const ASE_01 = "00000000-0000-0000-0012-000000000001";
const ASE_02 = "00000000-0000-0000-0012-000000000002";

// Email Logs (2)
const EL_01 = "00000000-0000-0000-0013-000000000001";
const EL_02 = "00000000-0000-0000-0013-000000000002";

// Analytics Events (12)
const AE_01 = "00000000-0000-0000-0014-000000000001";
const AE_02 = "00000000-0000-0000-0014-000000000002";
const AE_03 = "00000000-0000-0000-0014-000000000003";
const AE_04 = "00000000-0000-0000-0014-000000000004";
const AE_05 = "00000000-0000-0000-0014-000000000005";
const AE_06 = "00000000-0000-0000-0014-000000000006";
const AE_07 = "00000000-0000-0000-0014-000000000007";
const AE_08 = "00000000-0000-0000-0014-000000000008";
const AE_09 = "00000000-0000-0000-0014-000000000009";
const AE_10 = "00000000-0000-0000-0014-000000000010";
const AE_11 = "00000000-0000-0000-0014-000000000011";
const AE_12 = "00000000-0000-0000-0014-000000000012";

// ─────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────

async function main() {
  // ─── TABLE 1: USERS ───────────────────────────────────────────────────────
  console.log("🌱 [1/17] Seeding users...");

  await prisma.user.upsert({
    where: { id: USER_ARJUN },
    update: {},
    create: {
      id: USER_ARJUN,
      email: "arjun.mehta@acrossassist.com",
      name: "Arjun Mehta",
      role: "ADMIN",
      companyName: "Across Assist",
      isVerified: true,
      createdAt: new Date("2024-01-15T09:00:00Z"),
      updatedAt: new Date("2024-01-15T09:00:00Z"),
    },
  });

  await prisma.user.upsert({
    where: { id: USER_PRIYA },
    update: {},
    create: {
      id: USER_PRIYA,
      email: "priya.kapoor@finwise-lending.com",
      name: "Priya Kapoor",
      role: "CLIENT",
      clientType: "NBFC",
      companyName: "FinWise Lending Solutions",
      city: "Pune",
      isVerified: true,
      createdAt: new Date("2024-03-10T11:30:00Z"),
      updatedAt: new Date("2024-03-10T11:30:00Z"),
    },
  });

  console.log("  ✅ Users seeded (2 records)");

  // ─── TABLE 2: SESSIONS ────────────────────────────────────────────────────
  console.log("🌱 [2/17] Seeding sessions...");

  await prisma.session.upsert({
    where: { id: SESSION_ACTIVE },
    update: {},
    create: {
      id: SESSION_ACTIVE,
      status: "ACTIVE",
      currentStep: 3,
      name: "Rohit Sharma",
      contactEmail: "rohit.sharma@techcorpdist.com",
      companyName: "TechCorp Distribution",
      clientType: "RETAILER",
      formData: {
        clientType: "RETAILER",
        gadgetCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
        monthlyVolume: "RANGE_5K_50K",
        primaryGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
        distributionModel: "OFFLINE_RETAIL",
        avgDeviceASP: "RANGE_20K_50K",
        cityTier: 2,
        existingProtectionVendor: "Competitor:Onsitego",
        nbfcPartnerNames: ["Bajaj Finance", "HDFC Bank"],
        primaryDistributionStates: ["Maharashtra", "Gujarat", "Rajasthan"],
      },
      createdAt: new Date("2024-06-10T10:00:00Z"),
      updatedAt: new Date("2024-06-10T10:45:00Z"),
    },
  });

  await prisma.session.upsert({
    where: { id: SESSION_ABANDONED },
    update: {},
    create: {
      id: SESSION_ABANDONED,
      status: "ABANDONED",
      currentStep: 4,
      name: "Vikram Nair",
      contactEmail: "vikram.nair@mobilezone.in",
      companyName: "Mobilezone Retail Chain",
      clientType: "MARKETPLACE" as ClientType,
      formData: {
        clientType: "MARKETPLACE",
        gadgetCategories: ["SMARTPHONES", "REFURBISHED_DEVICES"],
        monthlyVolume: "RANGE_50K_5L",
        primaryGoal: "REDUCE_REPAIR_COMPLAINTS",
        distributionModel: "ONLINE_ECOMMERCE",
        avgDeviceASP: "RANGE_10K_20K",
        cityTier: 1,
        existingProtectionVendor: "None",
        nbfcPartnerNames: [],
        primaryDistributionStates: ["Karnataka", "Tamil Nadu", "Telangana", "Kerala"],
      },
      createdAt: new Date("2024-06-08T14:00:00Z"),
      updatedAt: new Date("2024-06-08T15:22:00Z"),
    },
  });

  await prisma.session.upsert({
    where: { id: SESSION_COMPLETED },
    update: {},
    create: {
      id: SESSION_COMPLETED,
      status: "COMPLETED",
      currentStep: 5,
      name: "Priya Kapoor",
      contactEmail: "priya.kapoor@finwise-lending.com",
      companyName: "FinWise Lending Solutions",
      clientType: "NBFC",
      formData: {
        clientType: "NBFC",
        gadgetCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
        monthlyVolume: "RANGE_5K_50K",
        primaryGoal: "BUNDLE_WITH_EMI",
        distributionModel: "NBFC_EMI",
        avgDeviceASP: "RANGE_20K_50K",
        cityTier: 2,
        existingProtectionVendor: "NONE",
        nbfcPartnerNames: [],
        primaryDistributionStates: ["Maharashtra", "Goa", "Karnataka"],
      },
      userId: USER_PRIYA,
      createdAt: new Date("2024-06-05T09:00:00Z"),
      updatedAt: new Date("2024-06-05T10:30:00Z"),
    },
  });

  console.log("  ✅ Sessions seeded (3 records)");

  // ─── TABLE 3: PRODUCTS ────────────────────────────────────────────────────
  console.log("🌱 [3/17] Seeding products...");

  await prisma.product.upsert({
    where: { id: PRODUCT_AD },
    update: {},
    create: {
      id: PRODUCT_AD,
      name: "Accidental Damage Protection",
      slug: "accidental-damage-protection",
      tagline: "Coverage for drops, spills & physical damage",
      description:
        "Comprehensive accidental damage protection covering all physical damage including drops, spills, liquid ingress, and crushing. Pays for genuine OEM repairs or device replacement up to invoice value. Zero deductible on first claim, 10% on subsequent claims.",
      iconEmoji: "🛡️",
      category: "ACCIDENTAL_DAMAGE",
      basePrice: new Prisma.Decimal(799),
      claimFrequency: "HIGH",
      avgClaimCost: new Prisma.Decimal(4200),
      coverageItems: [
        "Accidental drops & physical impact",
        "Liquid damage & spills",
        "Screen cracks from accidental impact",
        "Electrical surge damage",
        "Damage during transit",
      ],
      applicableGadgets: [
        "SMARTPHONES",
        "LAPTOPS_TABLETS",
        "TVS",
        "WEARABLES",
        "TWO_WHEELERS",
      ],
      isActive: true,
      sortOrder: 1,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.product.upsert({
    where: { id: PRODUCT_SP },
    update: {},
    create: {
      id: PRODUCT_SP,
      name: "Screen Protection Plan",
      slug: "screen-protection-plan",
      tagline: "Single-claim screen repair, zero hassle",
      description:
        "Dedicated screen protection plan covering cracked or shattered displays due to accidental damage. Covers touchscreen failure post-impact. Redeemable at 2,000+ authorized service centres across India. One claim per policy year with a flat ₹199 service fee.",
      iconEmoji: "📱",
      category: "SCREEN_PROTECTION",
      basePrice: new Prisma.Decimal(349),
      claimFrequency: "HIGH",
      avgClaimCost: new Prisma.Decimal(3800),
      coverageItems: [
        "Cracked or shattered screen",
        "Touchscreen failure due to accidental impact",
        "Display discolouration after physical impact",
        "Front camera cover glass breakage",
      ],
      applicableGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "WEARABLES"],
      isActive: true,
      sortOrder: 2,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.product.upsert({
    where: { id: PRODUCT_EW },
    update: {},
    create: {
      id: PRODUCT_EW,
      name: "Extended Warranty",
      slug: "extended-warranty",
      tagline: "Manufacturer warranty extended up to 3 years",
      description:
        "Extends OEM warranty for up to 3 additional years covering all manufacturing defects, hardware failures, and component breakdowns. Includes on-site repair for large appliances, pick-and-drop for smartphones, and doorstep service for TVs. Backed by Across Assist OEM-certified engineer network.",
      iconEmoji: "🔧",
      category: "EXTENDED_WARRANTY",
      basePrice: new Prisma.Decimal(599),
      claimFrequency: "MEDIUM",
      avgClaimCost: new Prisma.Decimal(6500),
      coverageItems: [
        "Manufacturing defects",
        "Hardware component failures",
        "Battery degradation below 80% capacity",
        "Software-linked hardware faults",
        "Motherboard and logic board failures",
        "OEM-certified spare parts",
      ],
      applicableGadgets: [
        "SMARTPHONES",
        "LAPTOPS_TABLETS",
        "TVS",
        "LARGE_APPLIANCES",
        "TWO_WHEELERS",
        "COMMERCIAL_VEHICLES",
        "REFURBISHED_DEVICES",
      ],
      isActive: true,
      sortOrder: 3,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.product.upsert({
    where: { id: PRODUCT_CP },
    update: {},
    create: {
      id: PRODUCT_CP,
      name: "Cyber Protection Plan",
      slug: "cyber-protection-plan",
      tagline: "UPI fraud, identity theft & data breach coverage",
      description:
        "Financial loss protection against cyber threats including UPI fraud, online banking fraud, identity theft, phishing attacks, and ransomware. Covers unauthorized transactions up to ₹50,000 per incident. Includes 24×7 cyber helpline, credit monitoring, and dark web monitoring for 12 months.",
      iconEmoji: "🔐",
      category: "CYBER_PROTECTION",
      basePrice: new Prisma.Decimal(499),
      claimFrequency: "LOW",
      avgClaimCost: new Prisma.Decimal(18000),
      coverageItems: [
        "UPI & mobile wallet fraud",
        "Online banking unauthorized transactions",
        "Identity theft & credit fraud",
        "Phishing & social engineering losses",
        "Ransomware & data extortion",
        "Dark web identity monitoring",
      ],
      applicableGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS"],
      isActive: true,
      sortOrder: 4,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  console.log("  ✅ Products seeded (4 records)");

  // ─── TABLE 4: BUNDLES ─────────────────────────────────────────────────────
  console.log("🌱 [4/17] Seeding bundles...");

  await prisma.bundle.upsert({
    where: { id: BUNDLE_CDS },
    update: {},
    create: {
      id: BUNDLE_CDS,
      name: "Complete Device Shield",
      slug: "complete-device-shield",
      tagline: "The gold standard for high-ASP device protection",
      description:
        "Complete Device Shield is Across Assist's flagship bundle for premium device markets. Anchored by Accidental Damage protection, it layers Screen Protection and Extended Warranty to deliver end-to-end coverage across the device lifecycle. Ideal for OEMs, retailers, and telcos serving customers with ₹50K+ devices.",
      targetClientType: ["OEM", "RETAILER", "TELECOM"] as any[],
      targetGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "TVS", "WEARABLES"],
      targetDistribution: "OFFLINE_RETAIL",
      targetGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      averagePlanValue: new Prisma.Decimal(1899),
      attachmentRateBench: new Prisma.Decimal(0.28),
      attachRateP10: new Prisma.Decimal(0.16),
      attachRateP50: new Prisma.Decimal(0.28),
      attachRateP90: new Prisma.Decimal(0.38),
      oemRevenueShare: new Prisma.Decimal(0.25),
      retailerRevenueShare: new Prisma.Decimal(0.22),
      nbfcRevenueShare: new Prisma.Decimal(0.15),
      acrossAssistShare: new Prisma.Decimal(0.38),
      whyThisBundle: [
        "Premium attach at point-of-sale: With an average plan value of ₹1,899 and attach rates reaching 38% for top performers, CDS is the highest-revenue-per-device bundle in the portfolio. Retailers and OEMs in offline channels see the strongest results because the sales associate can narrate a compelling 'what if you drop this phone tomorrow' story face-to-face.",
        "Full lifecycle coverage drives repeat trust: The combination of Accidental Damage + Screen Protection + Extended Warranty means a customer's device is protected from day 1 accident to year 3 component failure. This dramatically reduces post-purchase dissatisfaction and returns — a critical metric for high-ASP OEMs like Samsung and Apple resellers.",
        "25% OEM revenue share — the highest in the portfolio: OEMs earn more per plan sold through CDS than any other bundle, incentivising their sales teams to push protection at checkout. Combined with branded documentation and OEM-certified repair network, CDS becomes an integral part of the OEM's premium brand narrative rather than an afterthought.",
      ],
      objectionHandler:
        "If a prospect says 'our customers don't buy add-ons at checkout', the data tells a different story. Our top-performing retail clients achieve 38% attach rates by integrating the plan into the device purchase flow — not as an upsell, but as a mandatory-choice prompt. Customers in the ₹50K+ ASP bracket are already psychologically primed to protect a significant purchase. The screen protection alone has a 32% annual claim rate among smartphone buyers, meaning nearly 1 in 3 plan holders files a claim each year — customers who do file become strong repeat purchasers.",
      performanceData: {
        avgAttachmentRate: 0.28,
        attachRateRange: "16%–38%",
        avgMonthlyUnitsPerClient: 2800,
        topClientVolume: 18000,
        activeClients: 12,
        revenueGeneratedCr: 47.2,
      },
      isPopular: true,
      isActive: true,
      sortOrder: 1,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.bundle.upsert({
    where: { id: BUNDLE_EMI },
    update: {},
    create: {
      id: BUNDLE_EMI,
      name: "EMI Bundle Pack",
      slug: "emi-bundle-pack",
      tagline: "Protection built into every EMI loan disbursement",
      description:
        "EMI Bundle Pack is purpose-built for NBFCs and payment networks disbursing device loans. Accidental Damage anchors the bundle while Cyber Protection guards against UPI fraud — the #1 financial risk for EMI borrowers with smartphone collateral. The plan is bundled at loan origination with zero consumer friction.",
      targetClientType: ["NBFC", "OTHER"] as any[],
      targetGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS"],
      targetDistribution: "NBFC_EMI",
      targetGoal: "BUNDLE_WITH_EMI",
      averagePlanValue: new Prisma.Decimal(1299),
      attachmentRateBench: new Prisma.Decimal(0.35),
      attachRateP10: new Prisma.Decimal(0.22),
      attachRateP50: new Prisma.Decimal(0.35),
      attachRateP90: new Prisma.Decimal(0.48),
      oemRevenueShare: new Prisma.Decimal(0.12),
      retailerRevenueShare: new Prisma.Decimal(0.10),
      nbfcRevenueShare: new Prisma.Decimal(0.30),
      acrossAssistShare: new Prisma.Decimal(0.38),
      whyThisBundle: [
        "30% revenue share for NBFCs — the highest NBFC share in the portfolio: EMI Bundle Pack is designed to be a net-new revenue stream that an NBFC can activate on existing loan origination infrastructure. At ₹1,299 per plan and P50 attach rates of 35%, an NBFC processing 10,000 device loans per month can generate ₹4.5 Cr+ in annual plan revenue with zero incremental customer acquisition cost.",
        "Cyber Protection is the decisive differentiator for digital-first borrowers: NBFCs in Tier-1 and Tier-2 cities serve customers who are deeply embedded in UPI and mobile banking. The ₹18,000 average cyber claim cost — the highest per-incident of any product — means even a single fraud event wipes out months of loan margin. Bundling Cyber Protection at disbursement signals to borrowers that their financial wellbeing is protected, meaningfully improving NPS and reducing loan delinquencies tied to fraud stress.",
        "Single API integration, zero ops overhead: The entire plan is activated through a single REST API call at loan disbursement. No paper, no wet signatures, no claims adjuster liaison required for standard claims under ₹15,000. Our NBFCs average 3–5 engineer-days to go live, and 94% of integrations are completed within 2 weeks of contract signing.",
      ],
      objectionHandler:
        "The most common NBFC objection is 'our borrowers are price-sensitive and will see this as a hidden fee'. Our response: the plan is priced at under ₹4 per day when amortised over a 12-month EMI cycle — well within the noise of the EMI amount itself. More importantly, NBFCs that transparently communicate the protection see a 12% reduction in loan-level complaints related to device damage or fraud, which directly reduces collections cost. Clients like TVS Credit and Home Credit India have reported that borrowers who hold a protection plan have measurably better repayment rates, plausibly because the cognitive stress of an unprotected asset is removed.",
      performanceData: {
        avgAttachmentRate: 0.35,
        attachRateRange: "22%–48%",
        avgMonthlyUnitsPerClient: 5200,
        topClientVolume: 34000,
        activeClients: 9,
        revenueGeneratedCr: 61.8,
      },
      isPopular: true,
      isActive: true,
      sortOrder: 2,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.bundle.upsert({
    where: { id: BUNDLE_TPS },
    update: {},
    create: {
      id: BUNDLE_TPS,
      name: "Travel Protection Suite",
      slug: "travel-protection-suite",
      tagline: "Device protection at travel booking checkout",
      description:
        "Travel Protection Suite is engineered for marketplace platforms in the OTA and travel sector. Bundled at checkout alongside flight or hotel bookings, it provides Accidental Damage and Extended Warranty for the traveller's primary device. The ₹649 price point is optimised for impulse acceptance at booking checkout.",
      targetClientType: ["MARKETPLACE"] as any[],
      targetGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "WEARABLES"],
      targetDistribution: "ONLINE_ECOMMERCE",
      targetGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      averagePlanValue: new Prisma.Decimal(649),
      attachmentRateBench: new Prisma.Decimal(0.18),
      attachRateP10: new Prisma.Decimal(0.10),
      attachRateP50: new Prisma.Decimal(0.18),
      attachRateP90: new Prisma.Decimal(0.28),
      oemRevenueShare: new Prisma.Decimal(0.10),
      retailerRevenueShare: new Prisma.Decimal(0.25),
      nbfcRevenueShare: new Prisma.Decimal(0.10),
      acrossAssistShare: new Prisma.Decimal(0.40),
      whyThisBundle: [
        "Travel intent = high device-risk awareness: Customers booking international travel are already thinking about what happens if their phone breaks abroad. The Travel Protection Suite capitalises on this elevated risk awareness by presenting at the precise moment of booking confirmation — when the customer is already in a 'protect this trip' mindset. MakeMyTrip and Goibibo have seen 18% attach rates without any promotional discount, purely through contextual placement.",
        "25% retailer/marketplace revenue share at ₹649 per plan: While the plan value is lower than CDS or EMI Bundle, the checkout conversion volume on OTA platforms is massive. A marketplace doing 50,000 bookings per month at 18% attach and ₹649 plan value generates ₹5.8 Cr in annual plan revenue. The 40% Across Assist share funds claims servicing for travel-related damage, which peaks during festival seasons and summer holidays.",
        "Extended Warranty is the right anchor for travel: Travellers tend to carry their newest, most expensive devices. Extended Warranty at year-2 and year-3 covers the long tail of hardware failures that occur well after the trip itself — making the plan feel like ongoing value, not just trip insurance. Accidental Damage rounds out the cover for in-transit drops at airports and hotels.",
      ],
      objectionHandler:
        "Travel platform clients sometimes worry that a ₹649 device protection plan looks out of place alongside a ₹5,000 flight booking. Our A/B test data across 3 OTA clients shows that framing the plan as 'device travel insurance' — mirroring the familiar travel insurance nudge — achieves equal or higher accept rates than standard protection language. The key is placement: the highest-converting position is immediately after the travel insurance prompt, before the payment page, where the user is already in a risk-mitigation mode.",
      performanceData: {
        avgAttachmentRate: 0.18,
        attachRateRange: "10%–28%",
        avgMonthlyUnitsPerClient: 9400,
        topClientVolume: 52000,
        activeClients: 4,
        revenueGeneratedCr: 22.4,
      },
      isPopular: false,
      isActive: true,
      sortOrder: 3,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  await prisma.bundle.upsert({
    where: { id: BUNDLE_RS },
    update: {},
    create: {
      id: BUNDLE_RS,
      name: "Refurb Shield",
      slug: "refurb-shield",
      tagline: "Trust signal for refurbished device marketplaces",
      description:
        "Refurb Shield is specifically designed for the refurbished and pre-owned device market. Extended Warranty anchors the bundle — addressing the buyer's primary fear of 'what if this phone breaks next month' — while Screen Protection adds visible confidence. At ₹899, it is the highest-attach bundle in the portfolio with P50 rates of 45%.",
      targetClientType: ["MARKETPLACE", "RETAILER"] as any[],
      targetGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "REFURBISHED_DEVICES"],
      targetDistribution: "MIXED",
      targetGoal: "REDUCE_REPAIR_COMPLAINTS",
      averagePlanValue: new Prisma.Decimal(899),
      attachmentRateBench: new Prisma.Decimal(0.45),
      attachRateP10: new Prisma.Decimal(0.32),
      attachRateP50: new Prisma.Decimal(0.45),
      attachRateP90: new Prisma.Decimal(0.58),
      oemRevenueShare: new Prisma.Decimal(0.15),
      retailerRevenueShare: new Prisma.Decimal(0.30),
      nbfcRevenueShare: new Prisma.Decimal(0.10),
      acrossAssistShare: new Prisma.Decimal(0.35),
      whyThisBundle: [
        "Highest attach rate in the portfolio at P50: 45%: Refurb buyers are uniquely predisposed to protection purchase because their anxiety about device reliability is already primed. The moment a customer selects a Grade-A refurbished phone on Cashify or Cars24, they are mentally computing the risk of buying used. Refurb Shield converts that anxiety directly into plan revenue — with attach rates that can reach 58% for top-performing SKUs.",
        "30% retailer/marketplace revenue share drives active promotion: Refurb Shield's generous revenue share means platforms and retailers earn ₹270 per plan sold at P50 attach. For a marketplace selling 20,000 refurb devices per month, that is ₹64.8 Lakh in monthly plan revenue — enough to justify dedicated checkout placement, seller training, and even plan-bundled product listings where the protection is pre-included in the price.",
        "Reduces post-sale complaint rate by 40-60% — critical for refurb trust economics: Cashify's internal data shows that devices sold with Refurb Shield generate 52% fewer post-30-day customer service tickets vs. unprotected devices. For a marketplace with thin hardware margins, this complaint reduction has direct bottom-line impact: each complaint resolved costs ₹800–1,200 in ops cost. Multiplied across tens of thousands of devices, Refurb Shield effectively pays for itself before a single plan revenue rupee is counted.",
      ],
      objectionHandler:
        "The most common refurb marketplace objection is 'our customers already trust our grading — they don't think they need more protection'. This framing misses the consumer psychology: Refurb Shield is not positioned as distrust of your grading. It is a signal that your platform stands behind its products so completely that it partners with India's leading protection provider to back them up. Clients who reframe protection as a trust amplifier — 'we're so confident in this device, we've included a 1-year extended warranty' — see the highest attach rates. Cashify uses exactly this framing and achieves 52% attach on ₹15K–25K devices.",
      performanceData: {
        avgAttachmentRate: 0.45,
        attachRateRange: "32%–58%",
        avgMonthlyUnitsPerClient: 7200,
        topClientVolume: 41000,
        activeClients: 5,
        revenueGeneratedCr: 38.6,
      },
      isPopular: false,
      isActive: true,
      sortOrder: 4,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    },
  });

  console.log("  ✅ Bundles seeded (4 records)");

  // ─── TABLE 5: BUNDLE_PRODUCTS ─────────────────────────────────────────────
  console.log("🌱 [5/17] Seeding bundle_products...");

  await prisma.bundleProduct.createMany({
    skipDuplicates: true,
    data: [
      // CDS: AD (anchor) + SP + EW
      { bundleId: BUNDLE_CDS, productId: PRODUCT_AD, isAnchor: true, sortOrder: 1 },
      { bundleId: BUNDLE_CDS, productId: PRODUCT_SP, isAnchor: false, sortOrder: 2 },
      { bundleId: BUNDLE_CDS, productId: PRODUCT_EW, isAnchor: false, sortOrder: 3 },
      // EMI Bundle: AD (anchor) + CP
      { bundleId: BUNDLE_EMI, productId: PRODUCT_AD, isAnchor: true, sortOrder: 1 },
      { bundleId: BUNDLE_EMI, productId: PRODUCT_CP, isAnchor: false, sortOrder: 2 },
      // TPS: AD (anchor) + EW
      { bundleId: BUNDLE_TPS, productId: PRODUCT_AD, isAnchor: true, sortOrder: 1 },
      { bundleId: BUNDLE_TPS, productId: PRODUCT_EW, isAnchor: false, sortOrder: 2 },
      // RS: EW (anchor) + SP
      { bundleId: BUNDLE_RS, productId: PRODUCT_EW, isAnchor: true, sortOrder: 1 },
      { bundleId: BUNDLE_RS, productId: PRODUCT_SP, isAnchor: false, sortOrder: 2 },
    ],
  });

  console.log("  ✅ Bundle products seeded (9 records)");

  // ─── TABLE 6: CLIENTS ─────────────────────────────────────────────────────
  console.log("🌱 [6/17] Seeding clients...");

  const clients = [
    {
      id: CLIENT_PAYTM,
      name: "Paytm Payments Bank",
      slug: "paytm-payments-bank",
      type: "NBFC",
      tier: "PLATINUM",
      city: "Noida",
      state: "Uttar Pradesh",
      logoUrl: "https://cdn.acrossassist.com/clients/paytm-payments-bank.png",
      contactName: "Rahul Agarwal",
      contactEmail: "rahul.agarwal@paytmbank.com",
      contactPhone: "+91-9876540001",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(22000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Uttar Pradesh", "Delhi", "Rajasthan", "Haryana"],
      typicalDeviceCategories: ["SMARTPHONES"],
    },
    {
      id: CLIENT_IDFC,
      name: "IDFC First Bank",
      slug: "idfc-first-bank",
      type: "NBFC",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/idfc-first-bank.png",
      contactName: "Sunita Rao",
      contactEmail: "sunita.rao@idfcfirstbank.com",
      contactPhone: "+91-9876540002",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(35000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_TVS_CREDIT,
      name: "TVS Credit",
      slug: "tvs-credit",
      type: "NBFC",
      tier: "GOLD",
      city: "Chennai",
      state: "Tamil Nadu",
      logoUrl: "https://cdn.acrossassist.com/clients/tvs-credit.png",
      contactName: "Karthik S",
      contactEmail: "karthik.s@tvscredit.com",
      contactPhone: "+91-9876540003",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(28000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Tamil Nadu", "Andhra Pradesh", "Karnataka", "Kerala"],
      typicalDeviceCategories: ["SMARTPHONES", "TWO_WHEELERS"],
    },
    {
      id: CLIENT_HOME_CREDIT,
      name: "Home Credit India",
      slug: "home-credit-india",
      type: "NBFC",
      tier: "GOLD",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/home-credit-india.png",
      contactName: "Pradeep Singh",
      contactEmail: "pradeep.singh@homecredit.in",
      contactPhone: "+91-9876540004",
      cityTier: 2,
      avgDeviceASP: new Prisma.Decimal(15000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "Competitor:Servify",
      primaryDistributionStates: ["Uttar Pradesh", "Madhya Pradesh", "Bihar", "Rajasthan", "Odisha"],
      typicalDeviceCategories: ["SMARTPHONES"],
    },
    {
      id: CLIENT_DMI,
      name: "DMI Finance",
      slug: "dmi-finance",
      type: "NBFC",
      tier: "GOLD",
      city: "New Delhi",
      state: "Delhi",
      logoUrl: "https://cdn.acrossassist.com/clients/dmi-finance.png",
      contactName: "Amit Khanna",
      contactEmail: "amit.khanna@dmifinance.in",
      contactPhone: "+91-9876540005",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(18000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Haryana", "Punjab", "Uttar Pradesh"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_AVANSE,
      name: "Avanse Financial Services",
      slug: "avanse-financial-services",
      type: "NBFC",
      tier: "SILVER",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/avanse-financial-services.png",
      contactName: "Meera Nambiar",
      contactEmail: "meera.nambiar@avanse.com",
      contactPhone: "+91-9876540006",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(45000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Gujarat", "Rajasthan"],
      typicalDeviceCategories: ["LAPTOPS_TABLETS", "SMARTPHONES"],
    },
    {
      id: CLIENT_KISSHT,
      name: "Kissht",
      slug: "kissht",
      type: "NBFC",
      tier: "SILVER",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/kissht.png",
      contactName: "Nishant Patel",
      contactEmail: "nishant.patel@kissht.com",
      contactPhone: "+91-9876540007",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(12000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Chhattisgarh"],
      typicalDeviceCategories: ["SMARTPHONES"],
    },
    {
      id: CLIENT_TIDE,
      name: "Tide Business Banking",
      slug: "tide-business-banking",
      type: "NBFC",
      tier: "SILVER",
      city: "Bengaluru",
      state: "Karnataka",
      logoUrl: "https://cdn.acrossassist.com/clients/tide-business-banking.png",
      contactName: "Anika Sharma",
      contactEmail: "anika.sharma@tide.co.in",
      contactPhone: "+91-9876540008",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(55000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana"],
      typicalDeviceCategories: ["LAPTOPS_TABLETS", "SMARTPHONES"],
    },
    {
      id: CLIENT_VI,
      name: "Vi (Vodafone Idea)",
      slug: "vi-vodafone-idea",
      type: "TELECOM",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/vi-vodafone-idea.png",
      contactName: "Deepak Mathur",
      contactEmail: "deepak.mathur@vodafoneidea.com",
      contactPhone: "+91-9876540009",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(38000),
      nbfcPartnerNames: ["Bajaj Finance", "HDFC Bank", "IDFC First Bank"],
      existingProtectionVendor: "Competitor:Onsitego",
      primaryDistributionStates: ["Maharashtra", "Gujarat", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh"],
      typicalDeviceCategories: ["SMARTPHONES"],
    },
    {
      id: CLIENT_CASHIFY,
      name: "Cashify",
      slug: "cashify",
      type: "MARKETPLACE",
      tier: "PLATINUM",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/cashify.png",
      contactName: "Rohan Verma",
      contactEmail: "rohan.verma@cashify.in",
      contactPhone: "+91-9876540010",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(18000),
      nbfcPartnerNames: ["Bajaj Finance"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "REFURBISHED_DEVICES"],
    },
    {
      id: CLIENT_MMT,
      name: "MakeMyTrip",
      slug: "makemytrip",
      type: "MARKETPLACE",
      tier: "PLATINUM",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/makemytrip.png",
      contactName: "Shalini Gupta",
      contactEmail: "shalini.gupta@makemytrip.com",
      contactPhone: "+91-9876540011",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(55000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_GOIBIBO,
      name: "Goibibo",
      slug: "goibibo",
      type: "MARKETPLACE",
      tier: "GOLD",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/goibibo.png",
      contactName: "Manish Tripathi",
      contactEmail: "manish.tripathi@goibibo.com",
      contactPhone: "+91-9876540012",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(48000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Gujarat"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_SPINNY,
      name: "Spinny",
      slug: "spinny",
      type: "MARKETPLACE",
      tier: "GOLD",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/spinny.png",
      contactName: "Aarav Choudhary",
      contactEmail: "aarav.choudhary@spinny.com",
      contactPhone: "+91-9876540013",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(35000),
      nbfcPartnerNames: ["HDFC Bank", "ICICI Bank"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Uttar Pradesh", "Haryana", "Karnataka", "Maharashtra"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "REFURBISHED_DEVICES"],
    },
    {
      id: CLIENT_CARS24,
      name: "Cars24",
      slug: "cars24",
      type: "MARKETPLACE",
      tier: "GOLD",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/cars24.png",
      contactName: "Pooja Iyer",
      contactEmail: "pooja.iyer@cars24.com",
      contactPhone: "+91-9876540014",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(20000),
      nbfcPartnerNames: ["Mahindra Finance", "Shriram Finance"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Rajasthan"],
      typicalDeviceCategories: ["SMARTPHONES", "REFURBISHED_DEVICES"],
    },
    {
      id: CLIENT_THOMAS_COOK,
      name: "Thomas Cook India",
      slug: "thomas-cook-india",
      type: "MARKETPLACE",
      tier: "GOLD",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/thomas-cook-india.png",
      contactName: "Cyrus Mistry",
      contactEmail: "cyrus.mistry@thomascook.in",
      contactPhone: "+91-9876540015",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(62000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Gujarat", "West Bengal", "Tamil Nadu"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "WEARABLES"],
    },
    {
      id: CLIENT_REDBUS,
      name: "redBus",
      slug: "redbus",
      type: "MARKETPLACE",
      tier: "GOLD",
      city: "Bengaluru",
      state: "Karnataka",
      logoUrl: "https://cdn.acrossassist.com/clients/redbus.png",
      contactName: "Srikanth Reddy",
      contactEmail: "srikanth.reddy@redbus.in",
      contactPhone: "+91-9876540016",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(24000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Karnataka", "Andhra Pradesh", "Telangana", "Tamil Nadu", "Maharashtra"],
      typicalDeviceCategories: ["SMARTPHONES"],
    },
    {
      id: CLIENT_PARKPLUS,
      name: "Park+",
      slug: "parkplus",
      type: "MARKETPLACE",
      tier: "SILVER",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/parkplus.png",
      contactName: "Vishal Bansal",
      contactEmail: "vishal.bansal@parkplus.io",
      contactPhone: "+91-9876540017",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(32000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Haryana", "Karnataka", "Maharashtra"],
      typicalDeviceCategories: ["SMARTPHONES", "WEARABLES"],
    },
    {
      id: CLIENT_HOUSING,
      name: "Housing.com",
      slug: "housing-com",
      type: "MARKETPLACE",
      tier: "SILVER",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/housing-com.png",
      contactName: "Aditi Bose",
      contactEmail: "aditi.bose@housing.com",
      contactPhone: "+91-9876540018",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(44000),
      nbfcPartnerNames: ["HDFC Bank", "ICICI Bank", "SBI"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_TVS_MOTOR,
      name: "TVS Motor Company",
      slug: "tvs-motor-company",
      type: "OEM",
      tier: "PLATINUM",
      city: "Chennai",
      state: "Tamil Nadu",
      logoUrl: "https://cdn.acrossassist.com/clients/tvs-motor-company.png",
      contactName: "Suresh Narayanan",
      contactEmail: "suresh.narayanan@tvsmotor.com",
      contactPhone: "+91-9876540019",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(85000),
      nbfcPartnerNames: ["TVS Credit", "Bajaj Finance"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Tamil Nadu", "Karnataka", "Maharashtra", "Andhra Pradesh", "Telangana"],
      typicalDeviceCategories: ["TWO_WHEELERS"],
    },
    {
      id: CLIENT_OLA,
      name: "Ola Electric",
      slug: "ola-electric",
      type: "OEM",
      tier: "PLATINUM",
      city: "Bengaluru",
      state: "Karnataka",
      logoUrl: "https://cdn.acrossassist.com/clients/ola-electric.png",
      contactName: "Harish Kumar",
      contactEmail: "harish.kumar@olaelectric.com",
      contactPhone: "+91-9876540020",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(120000),
      nbfcPartnerNames: ["Bajaj Finance", "HDFC Bank"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Gujarat"],
      typicalDeviceCategories: ["TWO_WHEELERS"],
    },
    {
      id: CLIENT_MONTRA,
      name: "Montra Electric",
      slug: "montra-electric",
      type: "OEM",
      tier: "SILVER",
      city: "Pune",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/montra-electric.png",
      contactName: "Rajan Salvi",
      contactEmail: "rajan.salvi@montraelectric.com",
      contactPhone: "+91-9876540021",
      cityTier: 2,
      avgDeviceASP: new Prisma.Decimal(95000),
      nbfcPartnerNames: ["Shriram Finance"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Gujarat", "Goa"],
      typicalDeviceCategories: ["TWO_WHEELERS", "COMMERCIAL_VEHICLES"],
    },
    {
      id: CLIENT_CORVELL,
      name: "Corvell",
      slug: "corvell",
      type: "MARKETPLACE",
      tier: "SILVER",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/corvell.png",
      contactName: "Vinay Hegde",
      contactEmail: "vinay.hegde@corvell.in",
      contactPhone: "+91-9876540022",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(16000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Karnataka", "Goa"],
      typicalDeviceCategories: ["SMARTPHONES", "REFURBISHED_DEVICES"],
    },
    {
      id: CLIENT_GOMECHANIC,
      name: "GoMechanic",
      slug: "gomechanic",
      type: "MARKETPLACE",
      tier: "SILVER",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/gomechanic.png",
      contactName: "Tanmay Agarwal",
      contactEmail: "tanmay.agarwal@gomechanic.in",
      contactPhone: "+91-9876540023",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(14000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Haryana", "Punjab", "Uttar Pradesh", "Rajasthan"],
      typicalDeviceCategories: ["SMARTPHONES", "REFURBISHED_DEVICES"],
    },
    {
      id: CLIENT_ICICI_LOMBARD,
      name: "ICICI Lombard",
      slug: "icici-lombard",
      type: "OTHER",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/icici-lombard.png",
      contactName: "Bhargav Das",
      contactEmail: "bhargav.das@icicilombard.com",
      contactPhone: "+91-9876540024",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(50000),
      nbfcPartnerNames: ["ICICI Bank"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Karnataka", "Gujarat", "Tamil Nadu"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "TVS"],
    },
    {
      id: CLIENT_MASTERCARD,
      name: "Mastercard India",
      slug: "mastercard-india",
      type: "OTHER",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/mastercard-india.png",
      contactName: "Anita Desai",
      contactEmail: "anita.desai@mastercard.com",
      contactPhone: "+91-9876540025",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(40000),
      nbfcPartnerNames: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_VISA,
      name: "Visa India",
      slug: "visa-india",
      type: "OTHER",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/visa-india.png",
      contactName: "Ravi Shankar",
      contactEmail: "ravi.shankar@visa.com",
      contactPhone: "+91-9876540026",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(42000),
      nbfcPartnerNames: ["HDFC Bank", "ICICI Bank", "SBI", "Kotak Bank"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Gujarat", "Karnataka", "West Bengal"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_HERO_INSURANCE,
      name: "Hero Insurance Broking",
      slug: "hero-insurance-broking",
      type: "OTHER",
      tier: "GOLD",
      city: "New Delhi",
      state: "Delhi",
      logoUrl: "https://cdn.acrossassist.com/clients/hero-insurance-broking.png",
      contactName: "Vikrant Malhotra",
      contactEmail: "vikrant.malhotra@heroinsurance.com",
      contactPhone: "+91-9876540027",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(55000),
      nbfcPartnerNames: ["Hero FinCorp"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Haryana", "Uttar Pradesh", "Rajasthan", "Punjab"],
      typicalDeviceCategories: ["SMARTPHONES", "TWO_WHEELERS"],
    },
    {
      id: CLIENT_SBI_GENERAL,
      name: "SBI General Insurance",
      slug: "sbi-general-insurance",
      type: "OTHER",
      tier: "PLATINUM",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/sbi-general-insurance.png",
      contactName: "Kumari Sinha",
      contactEmail: "kumari.sinha@sbigeneral.in",
      contactPhone: "+91-9876540028",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(30000),
      nbfcPartnerNames: ["SBI"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Maharashtra", "Delhi", "Uttar Pradesh", "West Bengal", "Bihar"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "LARGE_APPLIANCES"],
    },
    {
      id: CLIENT_UNIVERSAL_SOMPO,
      name: "Universal Sompo",
      slug: "universal-sompo",
      type: "OTHER",
      tier: "GOLD",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/universal-sompo.png",
      contactName: "Prashant Gade",
      contactEmail: "prashant.gade@universalsompo.com",
      contactPhone: "+91-9876540029",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(28000),
      nbfcPartnerNames: ["Indian Bank", "Allahabad Bank"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Karnataka", "Gujarat", "Andhra Pradesh"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS", "TVS"],
    },
    {
      id: CLIENT_ADITYA_BIRLA,
      name: "Aditya Birla Health",
      slug: "aditya-birla-health",
      type: "OTHER",
      tier: "GOLD",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/aditya-birla-health.png",
      contactName: "Snehal Parekh",
      contactEmail: "snehal.parekh@adityabirlacapital.com",
      contactPhone: "+91-9876540030",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(45000),
      nbfcPartnerNames: ["Aditya Birla Finance"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Delhi"],
      typicalDeviceCategories: ["SMARTPHONES", "WEARABLES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_MAX_HEALTHCARE,
      name: "Max Healthcare",
      slug: "max-healthcare",
      type: "OTHER",
      tier: "GOLD",
      city: "New Delhi",
      state: "Delhi",
      logoUrl: "https://cdn.acrossassist.com/clients/max-healthcare.png",
      contactName: "Dinesh Khatri",
      contactEmail: "dinesh.khatri@maxhealthcare.in",
      contactPhone: "+91-9876540031",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(52000),
      nbfcPartnerNames: [],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Delhi", "Haryana", "Punjab", "Uttar Pradesh"],
      typicalDeviceCategories: ["LAPTOPS_TABLETS", "SMARTPHONES", "LARGE_APPLIANCES"],
    },
    {
      id: CLIENT_RISKCOVRY,
      name: "Riskcovry",
      slug: "riskcovry",
      type: "OTHER",
      tier: "SILVER",
      city: "Mumbai",
      state: "Maharashtra",
      logoUrl: "https://cdn.acrossassist.com/clients/riskcovry.png",
      contactName: "Vashistha Iyer",
      contactEmail: "vashistha.iyer@riskcovry.com",
      contactPhone: "+91-9876540032",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(25000),
      nbfcPartnerNames: ["Bajaj Finance", "Tata Capital", "IIFL Finance"],
      existingProtectionVendor: "None",
      primaryDistributionStates: ["Maharashtra", "Karnataka", "Telangana", "Tamil Nadu"],
      typicalDeviceCategories: ["SMARTPHONES", "LAPTOPS_TABLETS"],
    },
    {
      id: CLIENT_IFFCO,
      name: "IFFCO-Tokio",
      slug: "iffco-tokio",
      type: "OTHER",
      tier: "GOLD",
      city: "Gurugram",
      state: "Haryana",
      logoUrl: "https://cdn.acrossassist.com/clients/iffco-tokio.png",
      contactName: "Ramesh Chandak",
      contactEmail: "ramesh.chandak@iffcotokio.co.in",
      contactPhone: "+91-9876540033",
      cityTier: 1,
      avgDeviceASP: new Prisma.Decimal(33000),
      nbfcPartnerNames: ["IFFCO"],
      existingProtectionVendor: "In-house",
      primaryDistributionStates: ["Haryana", "Punjab", "Uttar Pradesh", "Rajasthan", "Delhi"],
      typicalDeviceCategories: ["SMARTPHONES", "LARGE_APPLIANCES", "TVS"],
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: {},
      create: {
        id: client.id,
        name: client.name,
        slug: client.slug,
        clientType: client.type as any,
        tier: client.tier as any,
        city: client.city,
        state: client.state,
        logoUrl: client.logoUrl,
        contactName: client.contactName,
        contactEmail: client.contactEmail,
        contactPhone: client.contactPhone,
        cityTier: client.cityTier,
        avgDeviceASP: client.avgDeviceASP,
        nbfcPartnerNames: client.nbfcPartnerNames,
        existingProtectionVendor: client.existingProtectionVendor,
        primaryDistributionStates: client.primaryDistributionStates,
        typicalDeviceCategories: client.typicalDeviceCategories as any[],
        isActive: true,
        createdAt: new Date("2024-01-20T00:00:00Z"),
        updatedAt: new Date("2024-01-20T00:00:00Z"),
      },
    });
  }

  console.log("  ✅ Clients seeded (33 records)");

  // ─── TABLE 7: CLIENT_BUNDLES ───────────────────────────────────────────────
  console.log("🌱 [7/17] Seeding client_bundles...");

  const clientBundleData = [
    // NBFC → EMI Bundle
    {
      id: CB_PAYTM,
      clientId: CLIENT_PAYTM,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 28000,
      attachmentRate: new Prisma.Decimal(0.42),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-04-01"),
      testimonial:
        "Bundling Across Assist's EMI Pack with our device loan disbursements has been a clean win — our borrowers get financial protection without any added paperwork, and the Cyber Protection layer has meaningfully reduced UPI-fraud-related support tickets. We saw attach rates climb to 42% within the first quarter of going live, well ahead of our initial projection of 30%.",
      revenueGenerated: new Prisma.Decimal(17280000),
    },
    {
      id: CB_IDFC,
      clientId: CLIENT_IDFC,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 18000,
      attachmentRate: new Prisma.Decimal(0.38),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-06-15"),
      testimonial:
        "IDFC First Bank's device loan vertical needed a protection partner that could match our zero-friction digital onboarding philosophy. Across Assist delivered exactly that — a single API integration that went live in 4 engineer-days and an EMI Bundle that resonates with our urban, smartphone-first borrowers. Our NPS for device loans has increased by 9 points since the rollout.",
      revenueGenerated: new Prisma.Decimal(10670400),
    },
    {
      id: CB_TVS_CREDIT,
      clientId: CLIENT_TVS_CREDIT,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 22000,
      attachmentRate: new Prisma.Decimal(0.36),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-03-01"),
      testimonial:
        "TVS Credit processes a high volume of device-linked consumer loans across South India, and our Tier-2 borrowers were particularly vulnerable to accidental damage losses. Since deploying the EMI Bundle Pack, our collections team reports a measurable reduction in loan delinquencies attributed to device loss events. The integration was seamless and the claims settlement has been consistently within 48 hours.",
      revenueGenerated: new Prisma.Decimal(12270240),
    },
    {
      id: CB_HOME_CREDIT,
      clientId: CLIENT_HOME_CREDIT,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 34000,
      attachmentRate: new Prisma.Decimal(0.31),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-08-01"),
      testimonial:
        "Home Credit India operates primarily in Tier-2 and Tier-3 markets where our borrowers have limited access to device service centres. The EMI Bundle Pack by Across Assist gives our customers a genuine safety net at disbursement, and the accidental damage coverage has been the most-claimed benefit. We moved from a competitor and the claims turnaround improvement alone justified the switch.",
      revenueGenerated: new Prisma.Decimal(13720440),
    },
    {
      id: CB_DMI,
      clientId: CLIENT_DMI,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 12000,
      attachmentRate: new Prisma.Decimal(0.35),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-10-01"),
      testimonial:
        "DMI Finance's digital-first borrower base in Delhi NCR aligns perfectly with the EMI Bundle Pack's Cyber Protection component. Our borrowers are heavy UPI users and the fraud coverage has become a genuine talking point during loan disbursement conversations. The attach rate of 35% exceeded our pilot target and we expanded to all disbursement channels within 6 weeks.",
      revenueGenerated: new Prisma.Decimal(6434760),
    },
    {
      id: CB_AVANSE,
      clientId: CLIENT_AVANSE,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 5500,
      attachmentRate: new Prisma.Decimal(0.34),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2024-01-01"),
      testimonial:
        "Avanse Financial Services focuses on education loans and laptop financing for students, a demographic that is both tech-savvy and financially cautious. The EMI Bundle Pack's accidental damage coverage is a perfect fit — students are exactly the kind of users who drop their laptops during commutes. The 34% attach rate in our first full quarter was a strong validation of the bundle's resonance.",
      revenueGenerated: new Prisma.Decimal(2669940),
    },
    {
      id: CB_KISSHT,
      clientId: CLIENT_KISSHT,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 9000,
      attachmentRate: new Prisma.Decimal(0.28),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2024-02-01"),
      testimonial:
        "Kissht's rapid device finance growth in Maharashtra and Gujarat required a protection partner that could scale quickly. Across Assist's API-first approach meant we were live in under two weeks, and the EMI Bundle has been received positively by our under-30 borrower segment. The Cyber Protection benefit resonates particularly well with first-time smartphone buyers who are new to digital payments.",
      revenueGenerated: new Prisma.Decimal(3279672),
    },
    // Tide (NBFC) → CDS (exception)
    {
      id: CB_TIDE,
      clientId: CLIENT_TIDE,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 3200,
      attachmentRate: new Prisma.Decimal(0.29),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2024-01-15"),
      testimonial:
        "Tide's SMB customers buy premium laptops and smartphones as business tools, making Complete Device Shield the natural fit over a standard EMI bundle. The extended warranty and accidental damage combination protects assets that our clients literally run their businesses on. Our partnership with Across Assist has helped us differentiate our business banking offer with a tangible device protection benefit that SMBs genuinely value.",
      revenueGenerated: new Prisma.Decimal(2119392),
    },
    // Vi (Telecom) → CDS
    {
      id: CB_VI,
      clientId: CLIENT_VI,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 18000,
      attachmentRate: new Prisma.Decimal(0.26),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-02-01"),
      testimonial:
        "Vi's device upgrade programme needed a protection stack that matched our premium handset partnerships. Complete Device Shield from Across Assist integrated natively into our POS system within 3 weeks and the 26% attach rate on ₹30K+ devices has added a meaningful revenue stream on top of plan activations. Our store staff find the bundle easy to explain because the three products map directly to the three biggest customer concerns at purchase.",
      revenueGenerated: new Prisma.Decimal(26671680),
    },
    // Refurb clients → Refurb Shield
    {
      id: CB_CASHIFY,
      clientId: CLIENT_CASHIFY,
      bundleId: BUNDLE_RS,
      monthlyUnits: 41000,
      attachmentRate: new Prisma.Decimal(0.52),
      planValue: new Prisma.Decimal(899),
      startedAt: new Date("2023-01-01"),
      testimonial:
        "Cashify processes India's largest volume of refurbished smartphone transactions and our post-sale complaint rate was the single biggest barrier to customer trust. Refurb Shield from Across Assist cut our 30-day return and complaint rate by 52%, which translates directly into margin improvement. The 52% attach rate also means protection has become an expected part of the Cashify buying experience, not an optional add-on.",
      revenueGenerated: new Prisma.Decimal(91909920),
    },
    {
      id: CB_CARS24,
      clientId: CLIENT_CARS24,
      bundleId: BUNDLE_RS,
      monthlyUnits: 15000,
      attachmentRate: new Prisma.Decimal(0.46),
      planValue: new Prisma.Decimal(899),
      startedAt: new Date("2023-05-01"),
      testimonial:
        "Cars24's used device vertical needed a credibility booster, and Refurb Shield has delivered exactly that. Our checkout conversion for smartphone listings increased by 14% after we featured the protection badge prominently in listings. The 46% attach rate is driven by our customer base which is highly value-conscious and responds strongly to the extended warranty narrative on pre-owned devices.",
      revenueGenerated: new Prisma.Decimal(37292040),
    },
    {
      id: CB_CORVELL,
      clientId: CLIENT_CORVELL,
      bundleId: BUNDLE_RS,
      monthlyUnits: 7200,
      attachmentRate: new Prisma.Decimal(0.44),
      planValue: new Prisma.Decimal(899),
      startedAt: new Date("2023-09-01"),
      testimonial:
        "Corvell's refurbished device marketplace in Western India serves customers who are highly price-sensitive but also keenly aware of device reliability risk. Refurb Shield gives them the confidence to buy from us rather than an unprotected grey market alternative. The 44% attach rate has exceeded our initial estimate and the revenue share has become a material component of our marketplace economics.",
      revenueGenerated: new Prisma.Decimal(12727872),
    },
    {
      id: CB_GOMECHANIC,
      clientId: CLIENT_GOMECHANIC,
      bundleId: BUNDLE_RS,
      monthlyUnits: 4800,
      attachmentRate: new Prisma.Decimal(0.41),
      planValue: new Prisma.Decimal(899),
      startedAt: new Date("2023-11-01"),
      testimonial:
        "GoMechanic's digital accessory and refurb phone reselling vertical was looking for a way to add protection at checkout without managing claims ourselves. Refurb Shield's zero-ops model means we earn the revenue share while Across Assist handles everything from policy issuance to claims resolution. Our North India customers have responded strongly to the extended warranty message, and our complaint volume for sold devices has dropped by 38%.",
      revenueGenerated: new Prisma.Decimal(8574768),
    },
    // Travel Marketplace → TPS
    {
      id: CB_MMT,
      clientId: CLIENT_MMT,
      bundleId: BUNDLE_TPS,
      monthlyUnits: 52000,
      attachmentRate: new Prisma.Decimal(0.19),
      planValue: new Prisma.Decimal(649),
      startedAt: new Date("2023-03-01"),
      testimonial:
        "MakeMyTrip's checkout is already optimised for add-on conversion, and Travel Protection Suite from Across Assist slotted in naturally alongside our existing travel insurance prompt. The 19% attach rate with zero promotional spend demonstrates how powerful contextual placement is — travellers at checkout are already in a 'protect this trip' mindset. The partnership has added a seven-figure annual revenue line that requires no incremental customer service infrastructure.",
      revenueGenerated: new Prisma.Decimal(77039784),
    },
    {
      id: CB_GOIBIBO,
      clientId: CLIENT_GOIBIBO,
      bundleId: BUNDLE_TPS,
      monthlyUnits: 38000,
      attachmentRate: new Prisma.Decimal(0.17),
      planValue: new Prisma.Decimal(649),
      startedAt: new Date("2023-04-01"),
      testimonial:
        "Goibibo's international travel segment skews toward high-ASP device owners who travel frequently for business. The Travel Protection Suite's combination of accidental damage and extended warranty resonates strongly with this demographic. We've seen the best attach rates on international flight bookings, suggesting that customers travelling abroad are most acutely aware of device risk in unfamiliar environments.",
      revenueGenerated: new Prisma.Decimal(51091752),
    },
    {
      id: CB_THOMAS_COOK,
      clientId: CLIENT_THOMAS_COOK,
      bundleId: BUNDLE_TPS,
      monthlyUnits: 12000,
      attachmentRate: new Prisma.Decimal(0.22),
      planValue: new Prisma.Decimal(649),
      startedAt: new Date("2023-06-01"),
      testimonial:
        "Thomas Cook India serves premium travellers, and our customers tend to carry expensive devices on international tours. The Travel Protection Suite has become an integral part of our holiday package checkout experience. A 22% attach rate on a business that wasn't previously selling device protection at all has been a pleasant financial surprise, and customer feedback on claims settlement has been very positive.",
      revenueGenerated: new Prisma.Decimal(20497392),
    },
    {
      id: CB_REDBUS,
      clientId: CLIENT_REDBUS,
      bundleId: BUNDLE_TPS,
      monthlyUnits: 48000,
      attachmentRate: new Prisma.Decimal(0.13),
      planValue: new Prisma.Decimal(649),
      startedAt: new Date("2023-07-01"),
      testimonial:
        "redBus serves a high-volume, budget-conscious travel audience and we were initially sceptical about device protection attach rates. The ₹649 price point proved to be the right nudge — our South India travellers in particular have shown strong acceptance. While our 13% attach rate is below the TPS portfolio average, the volume of bus bookings means the absolute plan revenue numbers are substantial and growing month-on-month.",
      revenueGenerated: new Prisma.Decimal(48600432),
    },
    // OEM/Marketplace CDS clients
    {
      id: CB_SPINNY,
      clientId: CLIENT_SPINNY,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 6800,
      attachmentRate: new Prisma.Decimal(0.30),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-08-01"),
      testimonial:
        "Spinny's used car buyers often purchase a device package alongside their vehicle, and Complete Device Shield has become our standard protection recommendation for smartphones and tablets sold at our outlets. The 30% attach rate reflects genuine consumer demand for comprehensive coverage on devices that are central to car ownership — navigation, insurance apps, and roadside assistance all live on these phones.",
      revenueGenerated: new Prisma.Decimal(14419440),
    },
    {
      id: CB_PARKPLUS,
      clientId: CLIENT_PARKPLUS,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 4200,
      attachmentRate: new Prisma.Decimal(0.27),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-10-01"),
      testimonial:
        "Park+ is deeply embedded in the connected car and smart parking ecosystem, and our users are urban professionals with premium devices. Complete Device Shield integrates perfectly into our app's lifestyle services layer, offering protection that feels native to our audience. The 27% attach rate on our premium user segment has validated our thesis that device protection is a natural cross-sell for mobility-platform audiences.",
      revenueGenerated: new Prisma.Decimal(5433804),
    },
    {
      id: CB_HOUSING,
      clientId: CLIENT_HOUSING,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 5500,
      attachmentRate: new Prisma.Decimal(0.25),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-09-01"),
      testimonial:
        "Housing.com's home-buying audience tends to be in the ₹40K+ device bracket, making Complete Device Shield's premium positioning a natural fit. We integrated the protection offer into our post-booking communication journey and the 25% attach rate via email and app nudges has outperformed our initial forecast. Across Assist's claims resolution speed has been a strong brand-alignment factor for us.",
      revenueGenerated: new Prisma.Decimal(7695975),
    },
    {
      id: CB_TVS_MOTOR,
      clientId: CLIENT_TVS_MOTOR,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 8500,
      attachmentRate: new Prisma.Decimal(0.32),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-01-01"),
      testimonial:
        "TVS Motor Company's dealership network sells premium two-wheelers alongside connected accessories, and Complete Device Shield is now a standard upsell at our 3,000+ dealer touch points. The 32% attach rate is driven by our sales staff training programme co-developed with Across Assist. Revenue from protection plans has become a meaningful contribution to dealership profitability, strengthening our relationship with the dealer network.",
      revenueGenerated: new Prisma.Decimal(19604160),
    },
    {
      id: CB_OLA,
      clientId: CLIENT_OLA,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 12000,
      attachmentRate: new Prisma.Decimal(0.34),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-03-01"),
      testimonial:
        "Ola Electric's customers are early adopters who invest heavily in their vehicle and their connected device ecosystem. Complete Device Shield has become part of our standard post-purchase onboarding flow, offered alongside our extended vehicle warranty. The 34% attach rate demonstrates that our buyers are highly receptive to comprehensive protection — the same mindset that leads them to buy a premium EV leads them to protect their smartphone.",
      revenueGenerated: new Prisma.Decimal(27672480),
    },
    {
      id: CB_MONTRA,
      clientId: CLIENT_MONTRA,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 2800,
      attachmentRate: new Prisma.Decimal(0.28),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2024-01-01"),
      testimonial:
        "Montra Electric's commercial vehicle buyers in Maharashtra and Gujarat are fleet operators who depend on smartphones for logistics management. Complete Device Shield's three-layer coverage gives our B2B buyers the peace of mind to use their devices intensively in field conditions. The 28% attach rate in our first two quarters validates the bundle's relevance for our specific buyer profile.",
      revenueGenerated: new Prisma.Decimal(3536736),
    },
    // Insurance/Financial OTHER → CDS
    {
      id: CB_ICICI_LOMBARD,
      clientId: CLIENT_ICICI_LOMBARD,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 9500,
      attachmentRate: new Prisma.Decimal(0.31),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-02-01"),
      testimonial:
        "ICICI Lombard's device insurance portfolio needed a specialist claims-services partner for physical damage. Complete Device Shield from Across Assist complements our existing general insurance products and has allowed us to offer a fully-rounded device protection package to our retail banking clients. The 31% attach rate and claims NPS of 72 have both exceeded our internal benchmarks.",
      revenueGenerated: new Prisma.Decimal(20136951),
    },
    {
      id: CB_MASTERCARD,
      clientId: CLIENT_MASTERCARD,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 24000,
      attachmentRate: new Prisma.Decimal(0.36),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-04-01"),
      testimonial:
        "Mastercard India's credit and debit card ecosystem processes millions of device purchase transactions and our cardholders expect value-added benefits that go beyond standard rewards. The EMI Bundle Pack by Across Assist is an ideal benefit attachment at the point of EMI conversion — the Cyber Protection component directly addresses our cardholders' top concern around UPI fraud. The 36% attach rate makes it one of our highest-performing benefit programmes.",
      revenueGenerated: new Prisma.Decimal(13529952),
    },
    {
      id: CB_VISA,
      clientId: CLIENT_VISA,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 20000,
      attachmentRate: new Prisma.Decimal(0.34),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-05-01"),
      testimonial:
        "Visa India's payment network facilitates a substantial share of India's device purchase transactions and our issuing bank partners were looking for differentiated EMI benefits. The EMI Bundle Pack integrates cleanly at the point of EMI conversion and the cyber protection element has strengthened our value proposition for digital-native cardholders. Claims settlement has been consistently fast, which protects our brand reputation among cardholders.",
      revenueGenerated: new Prisma.Decimal(10679280),
    },
    {
      id: CB_HERO_INSURANCE,
      clientId: CLIENT_HERO_INSURANCE,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 5200,
      attachmentRate: new Prisma.Decimal(0.29),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-07-01"),
      testimonial:
        "Hero Insurance Broking's retail distribution network reaches Tier-2 and Tier-3 markets where device damage risk is high and service infrastructure is thin. Complete Device Shield's OEM-certified repair network has been the decisive selling point for our field agents, who can confidently tell customers their device will be repaired even in smaller towns. The 29% attach rate is growing steadily as we expand our agent network.",
      revenueGenerated: new Prisma.Decimal(8530092),
    },
    {
      id: CB_SBI_GENERAL,
      clientId: CLIENT_SBI_GENERAL,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 11000,
      attachmentRate: new Prisma.Decimal(0.28),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-03-01"),
      testimonial:
        "SBI General Insurance's partnership with Across Assist has allowed us to extend our device protection reach beyond our core insurance products. Complete Device Shield is offered to SBI Bank customers purchasing devices through SBI's lifestyle banking programme, and the 28% attach rate reflects the trust that SBI's customer base places in our recommendations. The bundle's comprehensive three-product coverage is a strong match for our premium customer segment.",
      revenueGenerated: new Prisma.Decimal(17522040),
    },
    {
      id: CB_UNIVERSAL_SOMPO,
      clientId: CLIENT_UNIVERSAL_SOMPO,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 4800,
      attachmentRate: new Prisma.Decimal(0.26),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-09-01"),
      testimonial:
        "Universal Sompo's public sector banking partnerships provided access to a large and underserved device protection market. Complete Device Shield has been our go-to bundle for customers purchasing TVs and large appliances alongside smartphones, as the extended warranty component addresses the multi-device household protection need. The 26% attach rate is building steadily as our partner bank branches become more familiar with the product.",
      revenueGenerated: new Prisma.Decimal(5690880),
    },
    {
      id: CB_ADITYA_BIRLA,
      clientId: CLIENT_ADITYA_BIRLA,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 6200,
      attachmentRate: new Prisma.Decimal(0.30),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-06-01"),
      testimonial:
        "Aditya Birla Health Insurance's wearables and health-device ecosystem is an emerging category for device protection. Complete Device Shield's coverage of smartwatches and fitness trackers alongside smartphones has been a genuinely differentiated offer for our health-focused customer base. The 30% attach rate across our digital sales channels confirms that health-tech customers are receptive to comprehensive device protection.",
      revenueGenerated: new Prisma.Decimal(12999780),
    },
    {
      id: CB_MAX_HEALTHCARE,
      clientId: CLIENT_MAX_HEALTHCARE,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 3800,
      attachmentRate: new Prisma.Decimal(0.27),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-10-01"),
      testimonial:
        "Max Healthcare's employee device programme for clinical and administrative staff required a bulk protection solution that covered premium laptops and medical tablets. Complete Device Shield's enterprise pricing and dedicated claims account manager made it the clear choice. The 27% attach rate on our voluntary enrolment programme — where staff choose whether to participate — demonstrates that the bundle offers genuine value that people are willing to pay for.",
      revenueGenerated: new Prisma.Decimal(5569668),
    },
    {
      id: CB_RISKCOVRY,
      clientId: CLIENT_RISKCOVRY,
      bundleId: BUNDLE_EMI,
      monthlyUnits: 8500,
      attachmentRate: new Prisma.Decimal(0.35),
      planValue: new Prisma.Decimal(1299),
      startedAt: new Date("2023-11-01"),
      testimonial:
        "Riskcovry's insurance distribution API connects multiple NBFC and fintech clients to device protection products, and the EMI Bundle Pack's API-first architecture was the critical fit criterion. We can offer it programmatically across our partner network without any manual intervention, and the 35% attach rate across our NBFC channel partners validates the bundle's product-market fit in the embedded finance space.",
      revenueGenerated: new Prisma.Decimal(5132385),
    },
    {
      id: CB_IFFCO,
      clientId: CLIENT_IFFCO,
      bundleId: BUNDLE_CDS,
      monthlyUnits: 4500,
      attachmentRate: new Prisma.Decimal(0.27),
      planValue: new Prisma.Decimal(1899),
      startedAt: new Date("2023-08-01"),
      testimonial:
        "IFFCO-Tokio's rural and semi-urban distribution network serves a customer base that is increasingly purchasing smartphones and TVs but has limited access to device repair services. Complete Device Shield's broad service centre network in Tier-2 and Tier-3 towns was the decisive factor in our choice of partner. The 27% attach rate through our agricultural cooperative channel has surprised us positively and we are expanding the programme to additional states.",
      revenueGenerated: new Prisma.Decimal(6233040),
    },
  ];

  for (const cb of clientBundleData) {
    await prisma.clientBundle.upsert({
      where: { id: cb.id },
      update: {},
      create: {
        id: cb.id,
        clientId: cb.clientId,
        bundleId: cb.bundleId,
        monthlyUnits: cb.monthlyUnits,
        attachmentRate: cb.attachmentRate,
        planValue: cb.planValue,
        startedAt: cb.startedAt,
        testimonial: cb.testimonial,
        revenueGenerated: cb.revenueGenerated,
        isActive: true,
        createdAt: new Date("2024-01-20T00:00:00Z"),
        updatedAt: new Date("2024-06-01T00:00:00Z"),
      },
    });
  }

  console.log("  ✅ Client bundles seeded (33 records)");

  // ─── TABLE 8: RECOMMENDATIONS ─────────────────────────────────────────────
  console.log("🌱 [8/17] Seeding recommendations...");

  const realisticAiResponse = (bundleName: string, clientType: string) =>
    JSON.stringify({
      model: "llama-3.3-70b-versatile",
      id: `chatcmpl-${Math.random().toString(36).substring(2, 18)}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `Based on the input signals provided — clientType: ${clientType}, distribution model, gadget categories, volume range, city tier, and ASP — I recommend the ${bundleName}. The combination of input signals strongly routes to this bundle due to the distribution channel alignment and revenue share structure that favours this client type.`,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 842,
        completion_tokens: 318,
        total_tokens: 1160,
      },
    });

  // REC 1: NBFC × EMI Bundle (COMPLETED session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_01 },
    update: {},
    create: {
      id: REC_01,
      sessionId: SESSION_COMPLETED,
      inputClientType: "NBFC",
      inputGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "BUNDLE_WITH_EMI",
      inputDistribution: "NBFC_EMI",
      inputCityTier: 2,
      inputAvgDeviceASP: "RANGE_20K_50K",
      inputExistingVendor: "NONE",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_EMI,
      bundleName: "EMI Bundle Pack",
      whyThisCombo: [
        "NBFC_EMI distribution model is the single strongest routing signal: your disbursement infrastructure already touches every borrower at the moment of device acquisition — bundling protection here requires zero additional customer touchpoint and eliminates the friction of a separate opt-in step. NBFCs with this model achieve P50 attach rates of 34–38% vs. 18–22% for offline retail equivalents.",
        "Tier-2 city borrowers with ₹20K–50K ASP devices are the highest-risk profile for accidental damage: our claims data shows that Tier-2 smartphone users in the ₹20K–35K ASP bracket file accidental damage claims at 22% annually — nearly double the Tier-1 rate — due to denser urban activity combined with limited service centre proximity. EMI Bundle's AD anchor directly mitigates this risk at scale.",
        "No existing vendor means zero migration friction and maximum revenue upside: with no incumbent protection partner, FinWise Lending Solutions can deploy EMI Bundle Pack and capture the full 30% NBFC revenue share from day one. With 5,000–50,000 disbursements per month and a P50 attach of 35%, this translates to ₹6.8–68 Cr in annual plan revenue at zero incremental customer acquisition cost.",
      ],
      objectionHandler:
        "If the concern is 'our borrowers will see this as a hidden charge', the data is reassuring: NBFCs that present the plan transparently at disbursement — as a protection plan bundled with the loan, not a hidden fee — see 12% fewer loan-level complaints related to device damage and fraud. At ₹1,299 amortised over a 12-month EMI cycle, the daily cost is under ₹4 — well within the noise of the EMI itself. FinWise's Tier-2 Maharashtra borrower profile specifically benefits from Cyber Protection against UPI fraud, which is a genuine and growing risk in this demographic.",
      similarClients: [
        {
          name: "TVS Credit",
          type: "NBFC",
          attachRate: "36%",
          monthlyUnits: 22000,
          planValue: 1299,
          insight: "South India NBFC, Tier-1/2 mix, smartphone-dominant portfolio",
        },
        {
          name: "Home Credit India",
          type: "NBFC",
          attachRate: "31%",
          monthlyUnits: 34000,
          planValue: 1299,
          insight: "Tier-2/3 focus, high-volume borrower base, Maharashtra + UP + Bihar",
        },
      ],
      projectedMonthlyUnits: 15000,
      projectedAttachmentRate: new Prisma.Decimal(0.35),
      projectedPlanValue: new Prisma.Decimal(1299),
      projectedAnnualRevenue: new Prisma.Decimal(8207100),
      segmentP10AnnualRevenue: new Prisma.Decimal(5143500),
      segmentP50AnnualRevenue: new Prisma.Decimal(8207100),
      segmentP90AnnualRevenue: new Prisma.Decimal(11246400),
      clientRevenueShare: new Prisma.Decimal(0.30),
      confidenceScore: new Prisma.Decimal(0.92),
      tokensUsed: 1160,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2340,
      fromCache: false,
      cacheKey: "rec_nbfc_smartphones-laptops_5k50k_emibundle_2_v3",
      feedbackRating: "ACCURATE",
      feedbackNote:
        "Recommendation was spot-on. EMI Bundle deployed within 3 weeks of onboarding, currently at 34% attach rate.",
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("EMI Bundle Pack", "NBFC"),
      createdAt: new Date("2024-06-05T10:00:00Z"),
    },
  });

  // REC 2: MARKETPLACE × Refurb Shield (ABANDONED session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_02 },
    update: {},
    create: {
      id: REC_02,
      sessionId: SESSION_ABANDONED,
      inputClientType: "MARKETPLACE",
      inputGadgets: ["SMARTPHONES", "REFURBISHED_DEVICES"],
      inputVolume: "RANGE_50K_5L",
      inputGoal: "REDUCE_REPAIR_COMPLAINTS",
      inputDistribution: "ONLINE_ECOMMERCE",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_10K_20K",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_RS,
      bundleName: "Refurb Shield",
      whyThisCombo: [
        "REFURBISHED_DEVICES gadget category is the dominant routing signal: when a marketplace explicitly sells refurbished inventory, Refurb Shield's Extended Warranty anchor is architecturally the right fit — it addresses the primary consumer anxiety ('what if this pre-owned device breaks?') that is unique to the refurb buying decision. No other bundle has EW as its anchor product.",
        "REDUCE_REPAIR_COMPLAINTS primary goal maps directly to Refurb Shield's documented outcome data: Cashify and Cars24, both marketplace clients with ₹10K–25K ASP refurb inventory, have seen 38–52% reductions in post-30-day complaint rates after deploying Refurb Shield. At 50,000–500,000 monthly units, even a 40% complaint reduction translates to thousands of avoided ops-cost incidents per month.",
        "Tier-1 online marketplace with no existing vendor and high volume unlocks maximum revenue: with no incumbent vendor, Mobilezone Retail Chain captures the full 30% retailer/marketplace revenue share. At ₹50K–5L monthly volume with P50 attach of 45% at ₹899 per plan, annual plan revenue potential ranges from ₹24 Cr to ₹243 Cr — the highest revenue ceiling of any bundle for this profile.",
      ],
      objectionHandler:
        "A common objection from refurb marketplaces is 'our grading process already ensures quality, so customers don't need extra protection'. This conflates product quality with consumer confidence — they are different things. Refurb Shield is not positioned as a deficiency admission; it is a trust signal that says 'we stand behind this device so completely that we've backed it with India's leading protection provider.' Cashify uses exactly this framing and achieves 52% attach. The Extended Warranty anchor — not accidental damage — is what resonates, because it addresses the specific anxiety of 'what if this phone just stops working in 4 months'.",
      similarClients: [
        {
          name: "Cashify",
          type: "MARKETPLACE",
          attachRate: "52%",
          monthlyUnits: 41000,
          planValue: 899,
          insight: "India's largest refurb marketplace, Tier-1 cities, ₹10K–25K ASP devices",
        },
        {
          name: "Cars24",
          type: "MARKETPLACE",
          attachRate: "46%",
          monthlyUnits: 15000,
          planValue: 899,
          insight: "Multi-category refurb, nationwide, strong checkout conversion",
        },
      ],
      projectedMonthlyUnits: 80000,
      projectedAttachmentRate: new Prisma.Decimal(0.45),
      projectedPlanValue: new Prisma.Decimal(899),
      projectedAnnualRevenue: new Prisma.Decimal(388468800),
      segmentP10AnnualRevenue: new Prisma.Decimal(275020800),
      segmentP50AnnualRevenue: new Prisma.Decimal(388468800),
      segmentP90AnnualRevenue: new Prisma.Decimal(501916800),
      clientRevenueShare: new Prisma.Decimal(0.30),
      confidenceScore: new Prisma.Decimal(0.89),
      tokensUsed: 1240,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2610,
      fromCache: false,
      cacheKey: "rec_marketplace_smartphones-refurbished_50k5l_refurbshield_1_v3",
      feedbackRating: null,
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Refurb Shield", "MARKETPLACE"),
      createdAt: new Date("2024-06-08T14:45:00Z"),
    },
  });

  // REC 3: OEM × CDS (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_03 },
    update: {},
    create: {
      id: REC_03,
      sessionId: SESSION_ACTIVE,
      inputClientType: "OEM",
      inputGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS"],
      inputVolume: "RANGE_50K_5L",
      inputGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      inputDistribution: "OFFLINE_RETAIL",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_50K_PLUS",
      inputExistingVendor: "In-house",
      inputNbfcPartners: ["Bajaj Finance"],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "OEM clientType + OFFLINE_RETAIL distribution + ₹50K+ ASP is the textbook Complete Device Shield scenario: CDS was designed for exactly this combination — a brand that controls the retail experience for premium devices and needs a protection stack that reinforces brand trust. OEMs in the ₹50K+ ASP bracket achieve P50 attach rates of 31% with CDS, translating to ₹593 of plan revenue per device sold.",
        "Switching from an in-house vendor to CDS unlocks significant revenue improvement: in-house protection programmes typically achieve 15–20% attach rates because they lack the claims infrastructure and brand-agnostic trust signal that a third-party programme provides. CDS clients migrating from in-house solutions have seen attach rate improvements of 8–12 percentage points within 6 months, primarily because customers trust a specialist protection brand over an OEM's self-insured warranty.",
        "Tier-1 city OEM with ADDITIONAL_REVENUE_PER_DEVICE goal aligns with CDS's highest revenue ceiling: at ₹50K–5L monthly volume and P50 attach of 31%, annual CDS plan revenue ranges from ₹35 Cr to ₹354 Cr. The 25% OEM revenue share structure incentivises dealer networks to actively sell protection rather than passively offering it, because dealer commission on a ₹1,899 plan (₹418) rivals accessory margins.",
      ],
      objectionHandler:
        "OEMs migrating from in-house protection often raise integration complexity concerns. CDS integrates with existing POS systems through a certified connector that has been deployed in 15+ OEM retail environments. Migration typically takes 3–6 weeks including staff training, and our OEM clients receive co-branded plan documentation, in-store collateral, and a dedicated account manager. The in-house programme's hidden cost — claims adjudication ops, service centre management, and customer complaints — is typically 2–3x higher than the headline 25% revenue share, making CDS net-positive on total ops cost within 6 months.",
      similarClients: [
        {
          name: "TVS Motor Company",
          type: "OEM",
          attachRate: "32%",
          monthlyUnits: 8500,
          planValue: 1899,
          insight: "Premium two-wheeler OEM, 3,000+ dealer network, Tier-1 focus",
        },
        {
          name: "Ola Electric",
          type: "OEM",
          attachRate: "34%",
          monthlyUnits: 12000,
          planValue: 1899,
          insight: "D2C EV OEM, ₹1L+ ASP, tech-forward buyer base",
        },
      ],
      projectedMonthlyUnits: 25000,
      projectedAttachmentRate: new Prisma.Decimal(0.31),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(177543300),
      segmentP10AnnualRevenue: new Prisma.Decimal(91497600),
      segmentP50AnnualRevenue: new Prisma.Decimal(177543300),
      segmentP90AnnualRevenue: new Prisma.Decimal(258048000),
      clientRevenueShare: new Prisma.Decimal(0.25),
      confidenceScore: new Prisma.Decimal(0.91),
      tokensUsed: 1088,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 1980,
      fromCache: false,
      cacheKey: "rec_oem_smartphones-laptops_50k5l_cds_1_v3",
      feedbackRating: "ACCURATE",
      feedbackNote: "CDS was the right call. OEM confirmed in follow-up that they wanted full lifecycle coverage.",
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "OEM"),
      createdAt: new Date("2024-06-10T10:30:00Z"),
    },
  });

  // REC 4: RETAILER × CDS competitor switch (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_04 },
    update: {},
    create: {
      id: REC_04,
      sessionId: SESSION_ACTIVE,
      inputClientType: "RETAILER",
      inputGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      inputDistribution: "OFFLINE_RETAIL",
      inputCityTier: 2,
      inputAvgDeviceASP: "RANGE_20K_50K",
      inputExistingVendor: "Competitor:Onsitego",
      inputNbfcPartners: ["Bajaj Finance", "HDFC Bank"],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "RETAILER + OFFLINE_RETAIL + Competitor:Onsitego signals an existing protection programme that can be directly displaced: the presence of an Onsitego relationship confirms that TechCorp's staff is already trained to sell protection and customers already have a positive mental model for it. CDS wins competitive switches because it offers 22% retailer revenue share vs Onsitego's typical 15–17%, and the three-product bundle (AD + SP + EW) generates higher plan values at the same or better attach rates.",
        "Tier-2 city retailer with ₹20K–50K ASP devices and NBFC partners is the highest-potential CDS segment: Bajaj Finance and HDFC Bank NBFC partnerships mean a significant portion of device sales go through EMI, and CDS can be bundled at the EMI origination step in addition to the retail POS step. This dual-channel deployment typically lifts attach rates by 6–9 percentage points above pure offline retail benchmarks.",
        "RANGE_5K_50K monthly volume at P50 attach of 22% (Tier-2 retailer benchmark) generates ₹25.8 Cr–₹258 Cr in annual plan revenue: at the P50 scenario with 15,000 monthly units and 22% attach at ₹1,899, annual plan revenue is ₹7.5 Cr. Moving from Onsitego to CDS at higher revenue share nets TechCorp approximately ₹1.1 Cr more annually at the same volume, making the switch case straightforward.",
      ],
      objectionHandler:
        "TechCorp's primary concern will be switching cost — training, documentation updates, and the risk of temporary attach rate dip during transition. We mitigate all three: Across Assist provides a dedicated onboarding team for competitive switch clients, co-branded training materials are available in regional languages, and the transition typically achieves equivalent attach rates within 45 days. The financial incentive — ₹1.1 Cr additional annual revenue at current volume — covers all transition costs within the first quarter.",
      similarClients: [
        {
          name: "Vi (Vodafone Idea)",
          type: "TELECOM",
          attachRate: "26%",
          monthlyUnits: 18000,
          planValue: 1899,
          insight: "Competitor switch from Onsitego, Tier-1 focus, 3-week integration",
        },
        {
          name: "Housing.com",
          type: "MARKETPLACE",
          attachRate: "25%",
          monthlyUnits: 5500,
          planValue: 1899,
          insight: "Offline + online mix, Tier-1, premium buyer base",
        },
      ],
      projectedMonthlyUnits: 15000,
      projectedAttachmentRate: new Prisma.Decimal(0.22),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(75196200),
      segmentP10AnnualRevenue: new Prisma.Decimal(40939200),
      segmentP50AnnualRevenue: new Prisma.Decimal(75196200),
      segmentP90AnnualRevenue: new Prisma.Decimal(124113600),
      clientRevenueShare: new Prisma.Decimal(0.22),
      confidenceScore: new Prisma.Decimal(0.88),
      tokensUsed: 1156,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2120,
      fromCache: false,
      cacheKey: "rec_retailer_smartphones-laptops_5k50k_cds_2_v3",
      feedbackRating: null,
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "RETAILER"),
      createdAt: new Date("2024-06-10T10:35:00Z"),
    },
  });

  // REC 5: TELECOM × CDS (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_05 },
    update: {},
    create: {
      id: REC_05,
      sessionId: SESSION_ACTIVE,
      inputClientType: "TELECOM",
      inputGadgets: ["SMARTPHONES"],
      inputVolume: "RANGE_5L_PLUS",
      inputGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      inputDistribution: "OFFLINE_RETAIL",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_30K_50K",
      inputExistingVendor: "None",
      inputNbfcPartners: ["Bajaj Finance", "HDFC Bank", "IDFC First Bank"],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "TELECOM clientType + OFFLINE_RETAIL distribution is CDS's origin use case: telco retail stores are the highest-converting channel for device protection because the purchase and protection decision happen simultaneously at a staffed counter. Vi's 26% attach rate confirms that telco staff, when trained on CDS's three-product narrative, are effective protection advocates. Tier-1 telco with 500K+ monthly units is the highest-volume CDS scenario in the portfolio.",
        "₹30K–50K ASP smartphones with multiple NBFC partners creates a dual-channel opportunity: NBFC partners (Bajaj Finance, HDFC Bank, IDFC First Bank) provide a second attach point at EMI origination on top of the retail POS attach. Telcos with active NBFC relationships typically see 6–10 percentage point attach rate lifts vs. pure POS-only approaches, pushing well above the P50 of 29.4% for this segment.",
        "No existing vendor means this is a greenfield programme with the full 15% NBFC + 22% retailer blended share available from day one: at 500K+ monthly units with P50 attach of 29.4% and ₹1,899 plan value, annual CDS plan revenue exceeds ₹334 Cr. Even at P10 (16% attach), annual revenue exceeds ₹181 Cr — making this the highest-revenue-potential recommendation in the current pipeline.",
      ],
      objectionHandler:
        "Large telcos with extensive retail networks typically raise concerns about POS system integration complexity at scale. Across Assist's enterprise integration team has deployed CDS at networks with 2,000+ retail touch points and the standard integration timeline is 4–8 weeks for enterprise-scale rollouts. We offer a phased deployment starting with 50–100 pilot stores and expanding to full network in 30-day cycles, which allows telco ops teams to validate the integration without disrupting core billing systems.",
      similarClients: [
        {
          name: "Vi (Vodafone Idea)",
          type: "TELECOM",
          attachRate: "26%",
          monthlyUnits: 18000,
          planValue: 1899,
          insight: "National telco, OFFLINE_RETAIL dominant, multiple NBFC partners",
        },
        {
          name: "TVS Motor Company",
          type: "OEM",
          attachRate: "32%",
          monthlyUnits: 8500,
          planValue: 1899,
          insight: "High-volume offline distribution, 3,000+ dealer touch points",
        },
      ],
      projectedMonthlyUnits: 150000,
      projectedAttachmentRate: new Prisma.Decimal(0.294),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(1003521480),
      segmentP10AnnualRevenue: new Prisma.Decimal(548928000),
      segmentP50AnnualRevenue: new Prisma.Decimal(1003521480),
      segmentP90AnnualRevenue: new Prisma.Decimal(1298390400),
      clientRevenueShare: new Prisma.Decimal(0.22),
      confidenceScore: new Prisma.Decimal(0.95),
      tokensUsed: 1298,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2780,
      fromCache: false,
      cacheKey: "rec_telecom_smartphones_5lplus_cds_1_v3",
      feedbackRating: "ACCURATE",
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "TELECOM"),
      createdAt: new Date("2024-06-10T10:40:00Z"),
    },
  });

  // REC 6: MARKETPLACE × Travel Protection Suite (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_06 },
    update: {},
    create: {
      id: REC_06,
      sessionId: SESSION_ACTIVE,
      inputClientType: "MARKETPLACE",
      inputGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "WEARABLES"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      inputDistribution: "ONLINE_ECOMMERCE",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_50K_PLUS",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_TPS,
      bundleName: "Travel Protection Suite",
      whyThisCombo: [
        "MARKETPLACE + ONLINE_ECOMMERCE + travel-category gadgets (smartphones, laptops, wearables) maps precisely to Travel Protection Suite's deployment scenario: OTA and travel marketplaces have a uniquely high-intent buyer at checkout — someone who has just committed to a trip and is in active risk-mitigation mode. The ₹649 price point is calibrated for impulse acceptance at this moment, achieving 18–22% attach without promotional spend.",
        "₹50K+ ASP devices with Tier-1 city travellers is TPS's highest-performing customer segment: MakeMyTrip data shows that business travellers with ₹50K+ devices at checkout accept TPS at 22–26% — well above the P50 of 18% for the segment overall. High-ASP device owners are disproportionately price-insensitive for a ₹649 plan that protects a ₹50K+ asset, making the value equation obvious.",
        "No existing vendor with ONLINE_ECOMMERCE distribution means zero friction deployment: TPS integrates via a single checkout widget with pre-built plugins for common commerce platforms. MakeMyTrip's integration went live in 6 engineer-days. At 5K–50K monthly units with P50 attach of 19.6% and ₹649 plan value, annual plan revenue ranges from ₹7.6 Cr to ₹76 Cr — entirely incremental revenue from a single checkout widget placement.",
      ],
      objectionHandler:
        "Travel platforms often ask whether TPS cannibalises their existing travel insurance products. It does not — TPS covers the device, not the trip. In A/B tests across 3 OTA clients, presenting TPS after the travel insurance prompt increased total attach revenue per booking by 23% without reducing travel insurance acceptance. The two products are complementary in the customer's mental model: trip insurance protects the journey, TPS protects the device you use during it.",
      similarClients: [
        {
          name: "MakeMyTrip",
          type: "MARKETPLACE",
          attachRate: "19%",
          monthlyUnits: 52000,
          planValue: 649,
          insight: "India's largest OTA, Tier-1 focus, ₹50K+ traveller ASP",
        },
        {
          name: "Thomas Cook India",
          type: "MARKETPLACE",
          attachRate: "22%",
          monthlyUnits: 12000,
          planValue: 649,
          insight: "Premium travel, international segment, high-ASP device owners",
        },
      ],
      projectedMonthlyUnits: 20000,
      projectedAttachmentRate: new Prisma.Decimal(0.196),
      projectedPlanValue: new Prisma.Decimal(649),
      projectedAnnualRevenue: new Prisma.Decimal(30631320),
      segmentP10AnnualRevenue: new Prisma.Decimal(15595200),
      segmentP50AnnualRevenue: new Prisma.Decimal(30631320),
      segmentP90AnnualRevenue: new Prisma.Decimal(43814400),
      clientRevenueShare: new Prisma.Decimal(0.25),
      confidenceScore: new Prisma.Decimal(0.87),
      tokensUsed: 1042,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 1870,
      fromCache: true,
      cacheKey: "rec_marketplace_smartphones-laptops-wearables_5k50k_tps_1_v3",
      feedbackRating: null,
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Travel Protection Suite", "MARKETPLACE"),
      createdAt: new Date("2024-06-10T10:45:00Z"),
    },
  });

  // REC 7: NBFC × CDS (Tier-3, hybrid offline) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_07 },
    update: {},
    create: {
      id: REC_07,
      sessionId: SESSION_ACTIVE,
      inputClientType: "NBFC",
      inputGadgets: ["SMARTPHONES", "LARGE_APPLIANCES"],
      inputVolume: "RANGE_UNDER_5K",
      inputGoal: "REDUCE_REPAIR_COMPLAINTS",
      inputDistribution: "MIXED",
      inputCityTier: 3,
      inputAvgDeviceASP: "RANGE_10K_20K",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "Tier-3 NBFC with LARGE_APPLIANCES in the gadget mix routes away from EMI Bundle toward CDS: the Large Appliances category is anchored by Extended Warranty as the primary value proposition (not Cyber Protection), and the REDUCE_REPAIR_COMPLAINTS goal signals that the client's end customers are experiencing post-purchase service issues. CDS's EW component directly addresses appliance repair complaints, which are the #1 source of post-disbursement customer service tickets for rural-market NBFCs.",
        "MIXED distribution model with Tier-3 footprint means CDS's wide service centre network is the decisive competitive advantage: Across Assist's 2,000+ Tier-2 and Tier-3 service centres are a direct response to rural NBFCs' biggest pain point — customers who file claims but have no accessible repair centre. EMI Bundle's Cyber Protection component has low relevance in Tier-3 markets where UPI fraud risk is substantially lower than Tier-1.",
        "RANGE_UNDER_5K monthly volume with no existing vendor means this is a low-volume but high-impact use case: complaint reduction in rural NBFC portfolios has direct collections-cost implications. Even at 5,000 monthly units and P50 attach of 28.7% (Tier-3 benchmark), CDS generates ₹3.2 Cr annually — and the operational savings from complaint reduction are typically worth 1.5x the plan revenue in avoided ops cost.",
      ],
      objectionHandler:
        "Tier-3 NBFCs often worry that their customers won't be able to exercise claims due to limited service infrastructure. This is precisely the scenario Across Assist's Tier-3 network was built for. We have pick-and-drop claims service in all districts with a population over 50,000, and for Tier-4 towns, we offer a mail-in repair programme with pre-paid courier. 94% of our Tier-3 claims are resolved within 7 days. This service guarantee is a genuine differentiator that the client can use as a positive selling point at loan disbursement.",
      similarClients: [
        {
          name: "Home Credit India",
          type: "NBFC",
          attachRate: "31%",
          monthlyUnits: 34000,
          planValue: 1299,
          insight: "Tier-2/3 dominant portfolio, complaint reduction was primary goal",
        },
      ],
      projectedMonthlyUnits: 3500,
      projectedAttachmentRate: new Prisma.Decimal(0.287),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(22839714),
      segmentP10AnnualRevenue: new Prisma.Decimal(12873600),
      segmentP50AnnualRevenue: new Prisma.Decimal(22839714),
      segmentP90AnnualRevenue: new Prisma.Decimal(34401600),
      clientRevenueShare: new Prisma.Decimal(0.15),
      confidenceScore: new Prisma.Decimal(0.81),
      tokensUsed: 984,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 1650,
      fromCache: false,
      cacheKey: "rec_nbfc_smartphones-largeappliances_under5k_cds_3_v3",
      feedbackRating: "ACCURATE",
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "NBFC"),
      createdAt: new Date("2024-06-10T10:50:00Z"),
    },
  });

  // REC 8: NBFC × Cyber Protection upsell (COMPLETED session, existing client) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_08 },
    update: {},
    create: {
      id: REC_08,
      sessionId: SESSION_COMPLETED,
      inputClientType: "NBFC",
      inputGadgets: ["SMARTPHONES"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "BUNDLE_WITH_EMI",
      inputDistribution: "NBFC_EMI",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_20K_50K",
      inputExistingVendor: "AcrossAssist:EMIBundle",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_EMI,
      bundleName: "EMI Bundle Pack",
      whyThisCombo: [
        "Existing AcrossAssist:EMIBundle client with Tier-1 city footprint and ₹20K–50K ASP is an ideal Cyber Protection upsell candidate: the Cyber Protection product within the EMI Bundle is already part of the stack, but an upsell recommendation here means increasing plan depth — recommending higher-coverage cyber tiers or standalone Cyber Protection as an additional annual renewal product for existing plan holders.",
        "Tier-1 NBFC with ₹20K–50K device ASP borrowers are statistically the highest-risk group for UPI fraud: our claims data shows Tier-1 smartphone users with ₹20K–40K devices file cyber claims at 4% annually with an average settlement of ₹18,000. For an NBFC with 15,000 active EMI plans, this means approximately 600 cyber incidents per year — each representing a collection-risk event if the borrower bears the financial loss unprotected.",
        "Zero incremental integration cost for existing clients: since Cyber Protection is already part of the EMI Bundle architecture, activating enhanced cyber coverage or upselling standalone CP to plan renewers requires zero API changes. The upsell can be triggered programmatically at the EMI Bundle renewal notification, achieving an estimated 18–22% acceptance rate on the upsell prompt.",
      ],
      objectionHandler:
        "Existing clients sometimes ask why they should upsell Cyber Protection when it's already included in the EMI Bundle. The distinction is coverage depth: the bundled CP provides ₹25,000 incident coverage, while a standalone or upgraded CP provides ₹50,000 coverage plus dark web monitoring and a dedicated cyber helpline. For borrowers using their device for high-value business transactions, this premium tier resonates strongly and commands a ₹299 annual uplift per plan.",
      similarClients: [
        {
          name: "DMI Finance",
          type: "NBFC",
          attachRate: "35%",
          monthlyUnits: 12000,
          planValue: 1299,
          insight: "Tier-1 Delhi NBFC, digital-first borrowers, high UPI transaction volume",
        },
        {
          name: "Mastercard India",
          type: "OTHER",
          attachRate: "36%",
          monthlyUnits: 24000,
          planValue: 1299,
          insight: "Payment network, card-linked protection, cyber is primary benefit",
        },
      ],
      projectedMonthlyUnits: 15000,
      projectedAttachmentRate: new Prisma.Decimal(0.38),
      projectedPlanValue: new Prisma.Decimal(1299),
      projectedAnnualRevenue: new Prisma.Decimal(8854020),
      segmentP10AnnualRevenue: new Prisma.Decimal(5143500),
      segmentP50AnnualRevenue: new Prisma.Decimal(8854020),
      segmentP90AnnualRevenue: new Prisma.Decimal(11246400),
      clientRevenueShare: new Prisma.Decimal(0.30),
      confidenceScore: new Prisma.Decimal(0.86),
      tokensUsed: 1076,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 1920,
      fromCache: true,
      cacheKey: "rec_nbfc_smartphones_5k50k_emibundle_1_v3",
      feedbackRating: "ACCURATE",
      feedbackNote: "Upsell accepted. Cyber Protection standalone added to renewal flow.",
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("EMI Bundle Pack", "NBFC"),
      createdAt: new Date("2024-06-05T10:15:00Z"),
    },
  });

  // REC 9: MARKETPLACE × CDS Premium (high-ASP) (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_09 },
    update: {},
    create: {
      id: REC_09,
      sessionId: SESSION_ACTIVE,
      inputClientType: "MARKETPLACE",
      inputGadgets: ["SMARTPHONES", "LAPTOPS_TABLETS", "TVS"],
      inputVolume: "RANGE_5L_PLUS",
      inputGoal: "ADDITIONAL_REVENUE_PER_DEVICE",
      inputDistribution: "ONLINE_ECOMMERCE",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_50K_PLUS",
      inputExistingVendor: "Competitor:Onsitego",
      inputNbfcPartners: ["Bajaj Finance", "HDFC Bank", "ICICI Bank"],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "MARKETPLACE with ₹50K+ ASP smartphones, laptops, and TVs routes to CDS rather than Refurb Shield because the devices are new: Complete Device Shield is purpose-built for new, high-ASP device protection. The three-product combination (AD + SP + EW) creates a perceived value stack that justifies ₹1,899 to a customer spending ₹50K–1L on a new device. For new devices, EW coverage on manufacturing defects at years 2–3 is highly valued — a different anxiety profile from the refurb market.",
        "Switching from Competitor:Onsitego with multiple NBFC partners and 5L+ monthly volume is a significant revenue capture opportunity: at P50 attach of 27.4% for Tier-1 marketplace (CDS), annual plan revenue at 5L+ units exceeds ₹1,563 Cr. The 22% retailer/marketplace revenue share translates to ₹344 Cr annually for the marketplace partner — making CDS's revenue share the single-largest ADDITIONAL_REVENUE_PER_DEVICE initiative available to a large online marketplace.",
        "NBFC partners (Bajaj Finance, HDFC Bank, ICICI Bank) provide a second attach point through EMI origination, lifting effective attach rates: the EMI channel for ₹50K+ devices drives 40–60% of all online purchases. Adding CDS at the NBFC EMI step — with Bajaj Finance and HDFC Bank who are both Across Assist certified partners — creates dual-channel attach that our marketplace clients with NBFC integrations routinely report as their highest-volume protection attach channel.",
      ],
      objectionHandler:
        "Large e-commerce marketplaces migrating from Onsitego typically ask about claims NPS and settlement speed — having had complaints about competitor performance. Across Assist's 48-hour digital claims assessment and 7-day physical repair or replacement SLA is contractually guaranteed and backed by ₹50 Cr performance insurance. Our claims NPS of 74 (industry average: 48) is the strongest third-party validated metric we bring to competitive switch conversations.",
      similarClients: [
        {
          name: "Housing.com",
          type: "MARKETPLACE",
          attachRate: "25%",
          monthlyUnits: 5500,
          planValue: 1899,
          insight: "High-ASP device buyer base, online-first, no incumbent",
        },
        {
          name: "Spinny",
          type: "MARKETPLACE",
          attachRate: "30%",
          monthlyUnits: 6800,
          planValue: 1899,
          insight: "Multi-category device sales, NBFC partners active, Tier-1",
        },
      ],
      projectedMonthlyUnits: 200000,
      projectedAttachmentRate: new Prisma.Decimal(0.274),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(1254177600),
      segmentP10AnnualRevenue: new Prisma.Decimal(728985600),
      segmentP50AnnualRevenue: new Prisma.Decimal(1254177600),
      segmentP90AnnualRevenue: new Prisma.Decimal(1651622400),
      clientRevenueShare: new Prisma.Decimal(0.22),
      confidenceScore: new Prisma.Decimal(0.90),
      tokensUsed: 1312,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2890,
      fromCache: false,
      cacheKey: "rec_marketplace_smartphones-laptops-tvs_5lplus_cds_1_v3",
      feedbackRating: null,
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "MARKETPLACE"),
      createdAt: new Date("2024-06-10T10:55:00Z"),
    },
  });

  // REC 10: RETAILER × Refurb Shield (ACTIVE session) — ACCURATE
  await prisma.recommendation.upsert({
    where: { id: REC_10 },
    update: {},
    create: {
      id: REC_10,
      sessionId: SESSION_ACTIVE,
      inputClientType: "RETAILER",
      inputGadgets: ["SMARTPHONES", "REFURBISHED_DEVICES"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "REDUCE_REPAIR_COMPLAINTS",
      inputDistribution: "OFFLINE_RETAIL",
      inputCityTier: 2,
      inputAvgDeviceASP: "RANGE_10K_20K",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_RS,
      bundleName: "Refurb Shield",
      whyThisCombo: [
        "REFURBISHED_DEVICES in the gadget category with REDUCE_REPAIR_COMPLAINTS goal routes decisively to Refurb Shield: a Tier-2 offline retailer selling ₹10K–20K refurb phones is experiencing exactly the complaint pattern Refurb Shield is designed to prevent. Post-30-day returns and complaints on used devices are a margin-eroding problem for offline retailers; Refurb Shield's Extended Warranty anchor converts that complaint vector into protection plan revenue.",
        "Tier-2 city offline retailer with RANGE_5K_50K volume is a sweet spot for Refurb Shield: our Tier-2 RS benchmark shows P50 attach of 42.3% — higher than CDS in the same segment — because the refurb buyer anxiety is acutely felt at the point of purchase in a physical retail environment where the staff can narrate the EW story face-to-face. No existing vendor means the full 30% retailer share is immediately available.",
        "₹10K–20K device ASP is the most price-sensitive bracket for protection purchase: the ₹899 Refurb Shield price point represents 4.5–9% of device value — well within acceptable protection spend ratios for value-conscious refurb buyers. CDS at ₹1,899 would represent 9–19% of device value and face material price resistance in this ASP bracket. Refurb Shield's price calibration is specifically designed for this customer profile.",
      ],
      objectionHandler:
        "Offline retailers sometimes worry that offering a protection plan on refurb devices signals lack of confidence in their inventory quality. The positioning guide we provide to retail staff flips this narrative: 'This phone has been tested to Grade-A standard by our engineers. It's good enough that India's leading protection company, Across Assist, is willing to stand behind it with a full extended warranty.' This framing converts the protection plan from a quality concern to a quality certificate — consistently improving both plan attach and first-purchase conversion rates.",
      similarClients: [
        {
          name: "Cashify",
          type: "MARKETPLACE",
          attachRate: "52%",
          monthlyUnits: 41000,
          planValue: 899,
          insight: "Refurb specialist, offline + online, ₹10K–25K ASP",
        },
        {
          name: "GoMechanic",
          type: "MARKETPLACE",
          attachRate: "41%",
          monthlyUnits: 4800,
          planValue: 899,
          insight: "Tier-1/2 mix, offline-focused, complaint reduction was primary driver",
        },
      ],
      projectedMonthlyUnits: 15000,
      projectedAttachmentRate: new Prisma.Decimal(0.423),
      projectedPlanValue: new Prisma.Decimal(899),
      projectedAnnualRevenue: new Prisma.Decimal(68559660),
      segmentP10AnnualRevenue: new Prisma.Decimal(51667200),
      segmentP50AnnualRevenue: new Prisma.Decimal(68559660),
      segmentP90AnnualRevenue: new Prisma.Decimal(94046400),
      clientRevenueShare: new Prisma.Decimal(0.30),
      confidenceScore: new Prisma.Decimal(0.88),
      tokensUsed: 1064,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2010,
      fromCache: false,
      cacheKey: "rec_retailer_smartphones-refurbished_5k50k_refurbshield_2_v3",
      feedbackRating: null,
      feedbackNote: null,
      correctedBundleId: null,
      correctionReason: null,
      aiResponseRaw: realisticAiResponse("Refurb Shield", "RETAILER"),
      createdAt: new Date("2024-06-10T11:00:00Z"),
    },
  });

  // ─── INACCURATE RECORDS ───

  // REC 11: NBFC wrongly got CDS, should be EMI Bundle
  await prisma.recommendation.upsert({
    where: { id: REC_11 },
    update: {},
    create: {
      id: REC_11,
      sessionId: SESSION_ACTIVE,
      inputClientType: "NBFC",
      inputGadgets: ["SMARTPHONES"],
      inputVolume: "RANGE_5K_50K",
      inputGoal: "BUNDLE_WITH_EMI",
      inputDistribution: "NBFC_EMI",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_20K_50K",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "NBFC with smartphone focus and Tier-1 city presence may benefit from CDS's comprehensive coverage stack for high-ASP devices.",
        "BUNDLE_WITH_EMI goal could suggest bundling a premium plan at loan disbursement.",
        "No existing vendor provides full revenue share opportunity with CDS's 15% NBFC share.",
      ],
      objectionHandler:
        "NBFCs may initially prefer a simpler product, but the comprehensive CDS stack delivers higher plan value per disbursement.",
      similarClients: [
        {
          name: "Tide Business Banking",
          type: "NBFC",
          attachRate: "29%",
          monthlyUnits: 3200,
          planValue: 1899,
          insight: "NBFC with premium device focus, chose CDS over EMI Bundle",
        },
      ],
      projectedMonthlyUnits: 15000,
      projectedAttachmentRate: new Prisma.Decimal(0.22),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(75196200),
      segmentP10AnnualRevenue: new Prisma.Decimal(40939200),
      segmentP50AnnualRevenue: new Prisma.Decimal(75196200),
      segmentP90AnnualRevenue: new Prisma.Decimal(124113600),
      clientRevenueShare: new Prisma.Decimal(0.15),
      confidenceScore: new Prisma.Decimal(0.52),
      tokensUsed: 1124,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2240,
      fromCache: false,
      cacheKey: "rec_nbfc_smartphones_5k50k_cds_1_v3",
      feedbackRating: "INACCURATE",
      feedbackNote:
        "Wrong recommendation. NBFC with NBFC_EMI distribution and BUNDLE_WITH_EMI goal should always get EMI Bundle Pack.",
      correctedBundleId: BUNDLE_EMI,
      correctionReason:
        "The NBFC_EMI distribution model is the single dominant routing signal that was missed. When a client's distribution model is NBFC_EMI, it means their entire plan attach mechanism runs through loan disbursement infrastructure — the EMI Bundle Pack is architecturally designed for exactly this flow, with a 30% NBFC revenue share vs CDS's 15%. Additionally, the BUNDLE_WITH_EMI primary goal explicitly signals that the client wants to bundle protection with EMI disbursement, not sell it as a standalone retail product. CDS requires OFFLINE_RETAIL distribution to achieve its benchmarked attach rates; applying CDS in an NBFC_EMI channel would have resulted in sub-10% attach rates vs. the 35% P50 achievable with EMI Bundle. The model incorrectly weighted the Tier-1 city signal and ₹20K–50K ASP toward CDS while ignoring the stronger distribution and goal signals.",
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "NBFC"),
      createdAt: new Date("2024-06-10T11:05:00Z"),
    },
  });

  // REC 12: MARKETPLACE refurb wrongly got CDS, should be Refurb Shield
  await prisma.recommendation.upsert({
    where: { id: REC_12 },
    update: {},
    create: {
      id: REC_12,
      sessionId: SESSION_ABANDONED,
      inputClientType: "MARKETPLACE",
      inputGadgets: ["SMARTPHONES", "REFURBISHED_DEVICES"],
      inputVolume: "RANGE_50K_5L",
      inputGoal: "REDUCE_REPAIR_COMPLAINTS",
      inputDistribution: "ONLINE_ECOMMERCE",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_10K_20K",
      inputExistingVendor: "None",
      inputNbfcPartners: [],
      recommendedBundleId: BUNDLE_CDS,
      bundleName: "Complete Device Shield",
      whyThisCombo: [
        "Marketplace with high volume could benefit from CDS's comprehensive coverage for smartphones.",
        "Tier-1 city online marketplace typically shows strong CDS attach in benchmark data.",
        "No existing vendor allows full 22% retailer share under CDS.",
      ],
      objectionHandler:
        "Marketplaces with mixed inventory can benefit from CDS's brand-agnostic coverage for all device types.",
      similarClients: [
        {
          name: "Housing.com",
          type: "MARKETPLACE",
          attachRate: "25%",
          monthlyUnits: 5500,
          planValue: 1899,
          insight: "Online marketplace, Tier-1, no incumbent",
        },
      ],
      projectedMonthlyUnits: 80000,
      projectedAttachmentRate: new Prisma.Decimal(0.274),
      projectedPlanValue: new Prisma.Decimal(1899),
      projectedAnnualRevenue: new Prisma.Decimal(499322880),
      segmentP10AnnualRevenue: new Prisma.Decimal(291993600),
      segmentP50AnnualRevenue: new Prisma.Decimal(499322880),
      segmentP90AnnualRevenue: new Prisma.Decimal(660648960),
      clientRevenueShare: new Prisma.Decimal(0.22),
      confidenceScore: new Prisma.Decimal(0.48),
      tokensUsed: 1186,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2350,
      fromCache: false,
      cacheKey: "rec_marketplace_smartphones-refurbished_50k5l_cds_1_v3",
      feedbackRating: "INACCURATE",
      feedbackNote:
        "Wrong. REFURBISHED_DEVICES is the primary routing signal. Should have been Refurb Shield.",
      correctedBundleId: BUNDLE_RS,
      correctionReason:
        "The REFURBISHED_DEVICES gadget category is the dominant routing signal that was entirely missed. Refurb Shield exists precisely and exclusively for refurbished device marketplaces — it is the only bundle with Extended Warranty as the anchor product, which is the specific coverage type that addresses refurb buyers' primary anxiety (device reliability post-purchase). CDS at ₹1,899 plan value represents 9–19% of a ₹10K–20K device value — a ratio that creates significant purchase resistance in the refurb segment. Refurb Shield at ₹899 sits at the 4.5–9% ratio that our data shows is the acceptance threshold. Additionally, the REDUCE_REPAIR_COMPLAINTS primary goal maps directly to Refurb Shield's documented 38–52% post-30-day complaint reduction outcome, not to CDS. The plan-to-device-value ratio for CDS applied to ₹10K–20K devices is too high to achieve meaningful attach rates; Cashify and Cars24 both confirmed that CDS at ₹1,899 saw under 12% attach vs. 46–52% for Refurb Shield at ₹899 on identical device ASP brackets.",
      aiResponseRaw: realisticAiResponse("Complete Device Shield", "MARKETPLACE"),
      createdAt: new Date("2024-06-08T15:00:00Z"),
    },
  });

  // REC 13: OEM wrongly got EMI Bundle, should be CDS
  await prisma.recommendation.upsert({
    where: { id: REC_13 },
    update: {},
    create: {
      id: REC_13,
      sessionId: SESSION_ACTIVE,
      inputClientType: "OEM",
      inputGadgets: ["SMARTPHONES", "TWO_WHEELERS"],
      inputVolume: "RANGE_50K_5L",
      inputGoal: "BUNDLE_WITH_EMI",
      inputDistribution: "OFFLINE_RETAIL",
      inputCityTier: 1,
      inputAvgDeviceASP: "RANGE_50K_PLUS",
      inputExistingVendor: "In-house",
      inputNbfcPartners: ["Bajaj Finance", "TVS Credit"],
      recommendedBundleId: BUNDLE_EMI,
      bundleName: "EMI Bundle Pack",
      whyThisCombo: [
        "BUNDLE_WITH_EMI goal indicates the client wants to bundle protection with EMI disbursement.",
        "NBFC partners Bajaj Finance and TVS Credit suggest EMI Bundle Pack integration at loan origination.",
        "High volume RANGE_50K_5L with no prior Across Assist product could benefit from EMI Bundle's simple two-product structure.",
      ],
      objectionHandler:
        "OEMs with EMI partners may find EMI Bundle Pack simpler to integrate than the full CDS stack.",
      similarClients: [
        {
          name: "Mastercard India",
          type: "OTHER",
          attachRate: "36%",
          monthlyUnits: 24000,
          planValue: 1299,
          insight: "EMI-linked protection via payment network",
        },
      ],
      projectedMonthlyUnits: 25000,
      projectedAttachmentRate: new Prisma.Decimal(0.35),
      projectedPlanValue: new Prisma.Decimal(1299),
      projectedAnnualRevenue: new Prisma.Decimal(136395000),
      segmentP10AnnualRevenue: new Prisma.Decimal(93132000),
      segmentP50AnnualRevenue: new Prisma.Decimal(136395000),
      segmentP90AnnualRevenue: new Prisma.Decimal(187718400),
      clientRevenueShare: new Prisma.Decimal(0.12),
      confidenceScore: new Prisma.Decimal(0.44),
      tokensUsed: 1098,
      modelUsed: "llama-3.3-70b-versatile",
      generationMs: 2180,
      fromCache: false,
      cacheKey: "rec_oem_smartphones-twowheelers_50k5l_emibundle_1_v3",
      feedbackRating: "INACCURATE",
      feedbackNote:
        "Wrong. OEM with ₹50K+ ASP and OFFLINE_RETAIL distribution should always get CDS, not EMI Bundle.",
      correctedBundleId: BUNDLE_CDS,
      correctionReason:
        "The clientType OEM and high ASP (₹50K+) are the primary routing signals that were outweighed by an incorrect interpretation of the BUNDLE_WITH_EMI goal. The BUNDLE_WITH_EMI goal for an OEM means that EMI is the distribution channel through which devices are sold (via NBFC partners like Bajaj Finance and TVS Credit) — it does NOT mean the client wants the EMI-specific product architecture of EMI Bundle Pack. OEMs control the retail and post-purchase experience; their optimal protection bundle is CDS because it delivers the full lifecycle coverage (AD + SP + EW) that matches the customer expectation for a ₹50K+ device. EMI Bundle Pack's Cyber Protection anchor has low relevance for two-wheeler and premium smartphone OEMs whose customers are primarily concerned with physical damage and warranty. Furthermore, OEMs earn only 12% revenue share under EMI Bundle vs. 25% under CDS — a near-halving of OEM revenue at the same plan volume. The model should have treated BUNDLE_WITH_EMI as a distribution channel signal and applied OEM × high-ASP × OFFLINE_RETAIL routing logic, which unambiguously leads to CDS.",
      aiResponseRaw: realisticAiResponse("EMI Bundle Pack", "OEM"),
      createdAt: new Date("2024-06-10T11:10:00Z"),
    },
  });

  console.log("  ✅ Recommendations seeded (13 records)");

  // ─── TABLE 9: PRODUCT_CLAIM_STATS ─────────────────────────────────────────
  console.log("🌱 [9/17] Seeding product_claim_stats...");

  await prisma.productClaimStat.createMany({
    skipDuplicates: true,
    data: [
      {
        id: PCS_AD_SMART,
        productId: PRODUCT_AD,
        gadgetCategory: "SMARTPHONES",
        claimRatePct: new Prisma.Decimal(22),
        avgSettlementDays: new Prisma.Decimal(3.8),
        topClaimReason: "Accidental drop — screen + chassis damage (54% of claims)",
        secondClaimReason: "Liquid ingress — charging port and speaker (21% of claims)",
        avgRepairCostRs: new Prisma.Decimal(4200),
        claimApprovalRatePct: new Prisma.Decimal(91),
        tier1ClaimRatePct: new Prisma.Decimal(18),
        tier2ClaimRatePct: new Prisma.Decimal(24),
        tier3ClaimRatePct: new Prisma.Decimal(28),
        aspirDeviceClaimRatePct: new Prisma.Decimal(26),
        premiumDeviceClaimRatePct: new Prisma.Decimal(16),
        peakClaimMonths: ["January", "July", "October"],
        notes:
          "Tier-2 and Tier-3 smartphone users claim at 24–28%, likely due to higher physical activity patterns and fewer protective case purchases. Post-Diwali (October–November) and post-monsoon (September) are the highest claim volume periods due to festival gifting and liquid damage events respectively.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_AD_LAPTOP,
        productId: PRODUCT_AD,
        gadgetCategory: "LAPTOPS_TABLETS",
        claimRatePct: new Prisma.Decimal(15),
        avgSettlementDays: new Prisma.Decimal(6.2),
        topClaimReason: "Drop damage — screen panel and hinge fracture (48% of claims)",
        secondClaimReason: "Liquid spill — keyboard and motherboard damage (31% of claims)",
        avgRepairCostRs: new Prisma.Decimal(9800),
        claimApprovalRatePct: new Prisma.Decimal(88),
        tier1ClaimRatePct: new Prisma.Decimal(17),
        tier2ClaimRatePct: new Prisma.Decimal(14),
        tier3ClaimRatePct: new Prisma.Decimal(11),
        aspirDeviceClaimRatePct: new Prisma.Decimal(18),
        premiumDeviceClaimRatePct: new Prisma.Decimal(12),
        peakClaimMonths: ["June", "July", "August"],
        notes:
          "Laptop AD claims are higher in Tier-1 cities due to frequent commuting and co-working space usage. Monsoon months (June–August) see a 30% spike in liquid damage claims. Higher-ASP premium laptops show lower claim rates likely due to greater owner care and protective bag usage.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_AD_TV,
        productId: PRODUCT_AD,
        gadgetCategory: "TVS",
        claimRatePct: new Prisma.Decimal(8),
        avgSettlementDays: new Prisma.Decimal(4.5),
        topClaimReason: "Physical impact during installation or relocation (62% of claims)",
        secondClaimReason: "Power surge damage to panel (19% of claims)",
        avgRepairCostRs: new Prisma.Decimal(7600),
        claimApprovalRatePct: new Prisma.Decimal(85),
        tier1ClaimRatePct: new Prisma.Decimal(7),
        tier2ClaimRatePct: new Prisma.Decimal(9),
        tier3ClaimRatePct: new Prisma.Decimal(10),
        aspirDeviceClaimRatePct: new Prisma.Decimal(10),
        premiumDeviceClaimRatePct: new Prisma.Decimal(6),
        peakClaimMonths: ["March", "April", "October"],
        notes:
          "TV accidental damage claims concentrate around relocation events (end of lease season, March–April) and festival season installations (October). Power surge claims spike during monsoon in Tier-3 cities with unstable grid infrastructure. AD is a secondary product for TVs; EW is the primary protection driver in this category.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_SP_SMART,
        productId: PRODUCT_SP,
        gadgetCategory: "SMARTPHONES",
        claimRatePct: new Prisma.Decimal(32),
        avgSettlementDays: new Prisma.Decimal(2.1),
        topClaimReason: "Screen crack from drop — corner impact on hard surface (71% of claims)",
        secondClaimReason: "Screen shatter from pocket/bag compression (18% of claims)",
        avgRepairCostRs: new Prisma.Decimal(3800),
        claimApprovalRatePct: new Prisma.Decimal(94),
        tier1ClaimRatePct: new Prisma.Decimal(28),
        tier2ClaimRatePct: new Prisma.Decimal(34),
        tier3ClaimRatePct: new Prisma.Decimal(37),
        aspirDeviceClaimRatePct: new Prisma.Decimal(38),
        premiumDeviceClaimRatePct: new Prisma.Decimal(24),
        peakClaimMonths: ["January", "August", "October", "November"],
        notes:
          "Screen Protection has the highest claim rate (32%) of any product-category combination in the portfolio, making it the most frequently exercised plan benefit. Tier-2 and Tier-3 users claim at 34–37% due to lower protective case penetration. This high claim frequency is a strong positive for attach rates — customers who know someone who has claimed recommend the plan actively.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_SP_LAPTOP,
        productId: PRODUCT_SP,
        gadgetCategory: "LAPTOPS_TABLETS",
        claimRatePct: new Prisma.Decimal(19),
        avgSettlementDays: new Prisma.Decimal(5.4),
        topClaimReason: "Display panel crack from lid closure with object on keyboard (56% of claims)",
        secondClaimReason: "Touchscreen failure after drop — digitizer separation (28% of claims)",
        avgRepairCostRs: new Prisma.Decimal(12400),
        claimApprovalRatePct: new Prisma.Decimal(90),
        tier1ClaimRatePct: new Prisma.Decimal(22),
        tier2ClaimRatePct: new Prisma.Decimal(17),
        tier3ClaimRatePct: new Prisma.Decimal(14),
        aspirDeviceClaimRatePct: new Prisma.Decimal(22),
        premiumDeviceClaimRatePct: new Prisma.Decimal(15),
        peakClaimMonths: ["June", "July", "August", "January"],
        notes:
          "Laptop screen claims have the second-highest average repair cost (₹12,400) after the cyber product. Tier-1 city students and professionals claim at 22% due to frequent transit in backpacks. The 19% overall claim rate makes SP a compelling upsell on laptops where the screen replacement cost can exceed ₹15,000 on premium panels.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_EW_TV,
        productId: PRODUCT_EW,
        gadgetCategory: "TVS",
        claimRatePct: new Prisma.Decimal(11),
        avgSettlementDays: new Prisma.Decimal(5.8),
        topClaimReason: "Backlight failure and panel discolouration at year 2–3 (44% of claims)",
        secondClaimReason: "Smart OS failure — mainboard and flash storage degradation (28% of claims)",
        avgRepairCostRs: new Prisma.Decimal(8900),
        claimApprovalRatePct: new Prisma.Decimal(87),
        tier1ClaimRatePct: new Prisma.Decimal(10),
        tier2ClaimRatePct: new Prisma.Decimal(12),
        tier3ClaimRatePct: new Prisma.Decimal(14),
        aspirDeviceClaimRatePct: new Prisma.Decimal(14),
        premiumDeviceClaimRatePct: new Prisma.Decimal(8),
        peakClaimMonths: ["May", "June", "November", "December"],
        notes:
          "TV extended warranty claims concentrate in the 18–30 month window post-purchase, which is when OEM warranty expires and component failures begin to emerge. Smart TV mainboard failures tied to software updates are a growing claim category — a useful talking point for AI recommendations when the client's customer base includes smart TV buyers.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_EW_LARGE,
        productId: PRODUCT_EW,
        gadgetCategory: "LARGE_APPLIANCES",
        claimRatePct: new Prisma.Decimal(10),
        avgSettlementDays: new Prisma.Decimal(4.2),
        topClaimReason: "Compressor failure — refrigerators and ACs (39% of claims)",
        secondClaimReason: "PCB and motor failure — washing machines (34% of claims)",
        avgRepairCostRs: new Prisma.Decimal(5400),
        claimApprovalRatePct: new Prisma.Decimal(89),
        tier1ClaimRatePct: new Prisma.Decimal(9),
        tier2ClaimRatePct: new Prisma.Decimal(11),
        tier3ClaimRatePct: new Prisma.Decimal(13),
        aspirDeviceClaimRatePct: new Prisma.Decimal(12),
        premiumDeviceClaimRatePct: new Prisma.Decimal(7),
        peakClaimMonths: ["May", "June", "July"],
        notes:
          "Large appliance EW claims peak sharply in May–July due to AC compressor stress during peak summer. NBFCs financing large appliances in Tier-2/3 markets see 11–13% claim rates with higher-than-average approval rates (89%) because appliance failure is unambiguous and well-documented. This makes EW on large appliances a high-trust, high-NPS product.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: PCS_CP_SMART,
        productId: PRODUCT_CP,
        gadgetCategory: "SMARTPHONES",
        claimRatePct: new Prisma.Decimal(4),
        avgSettlementDays: new Prisma.Decimal(8.6),
        topClaimReason: "UPI fraud — unauthorised transaction via compromised device (58% of claims)",
        secondClaimReason: "Identity theft — KYC data exfiltration from phishing app (22% of claims)",
        avgRepairCostRs: new Prisma.Decimal(18000),
        claimApprovalRatePct: new Prisma.Decimal(78),
        tier1ClaimRatePct: new Prisma.Decimal(5),
        tier2ClaimRatePct: new Prisma.Decimal(4),
        tier3ClaimRatePct: new Prisma.Decimal(2),
        aspirDeviceClaimRatePct: new Prisma.Decimal(3),
        premiumDeviceClaimRatePct: new Prisma.Decimal(5),
        peakClaimMonths: ["November", "December", "January"],
        notes:
          "Cyber Protection has the lowest claim frequency (4%) but the highest average settlement value (₹18,000) of any product. Tier-1 city users claim at 5% vs 2% in Tier-3, reflecting higher digital transaction volume and fraud exposure in metro markets. Festival season (Oct–Jan) sees peak cyber fraud attempts aligned with elevated digital payment activity — a strong contextual selling point for NBFCs with urban smartphone borrower portfolios.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ],
  });

  console.log("  ✅ Product claim stats seeded (8 records)");

  // ─── TABLE 10: BUNDLE_PERFORMANCE_BY_SEGMENT ──────────────────────────────
  console.log("🌱 [10/17] Seeding bundle_performance_by_segment...");

  await prisma.bundlePerformanceBySegment.createMany({
    skipDuplicates: true,
    data: [
      {
        id: BPS_01,
        bundleId: BUNDLE_EMI,
        clientType: "NBFC",
        volumeRange: "RANGE_5K_50K",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(38.4),
        p10AttachRatePct: new Prisma.Decimal(26.1),
        p50AttachRatePct: new Prisma.Decimal(38.4),
        p90AttachRatePct: new Prisma.Decimal(50.2),
        avgPlanValueRs: new Prisma.Decimal(1299),
        sampleSize: 6,
        topDrivers: [
          "Strong UPI fraud awareness in Tier-1 digital-native borrowers amplifies Cyber Protection acceptance",
          "NBFC staff trained on 'protection at disbursement' narrative achieve 40%+ attach consistently",
          "Co-branding with NBFC's digital loan app creates frictionless opt-in UX",
        ],
        topBlockers: [
          "Borrowers who perceive the plan as a hidden EMI component show 8% lower acceptance",
          "NBFCs with high subvention models have less flexibility to add plan cost to EMI",
          "Integration delays beyond 30 days significantly reduce launch momentum",
        ],
        notes:
          "Tier-1 NBFC clients in the 5K–50K monthly disbursement range are the highest-performing EMI Bundle segment. Top performers (P90: 50.2%) typically deploy a dedicated WhatsApp notification at disbursement featuring the plan benefits with a single-tap accept flow. NBFCs that allow plan rejection in a second step rather than a first-tap opt-out see 6–8 percentage point higher attach rates.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_02,
        bundleId: BUNDLE_EMI,
        clientType: "NBFC",
        volumeRange: "RANGE_5K_50K",
        cityTier: 2,
        avgAttachRatePct: new Prisma.Decimal(34.1),
        p10AttachRatePct: new Prisma.Decimal(22.8),
        p50AttachRatePct: new Prisma.Decimal(34.1),
        p90AttachRatePct: new Prisma.Decimal(45.7),
        avgPlanValueRs: new Prisma.Decimal(1299),
        sampleSize: 4,
        topDrivers: [
          "Accidental damage claim frequency (24%) in Tier-2 cities is among the highest in the portfolio, making AD value proposition tangible",
          "NBFC field agent networks in Tier-2 markets provide a human narration point that amplifies plan acceptance",
          "Borrowers with limited insurance exposure are more receptive to novel protection products when explained personally",
        ],
        topBlockers: [
          "Lower average digital literacy means self-serve opt-in flows underperform vs. agent-assisted flows",
          "Cyber Protection has lower resonance in Tier-2 markets where UPI fraud awareness is still growing",
          "Price sensitivity is higher in Tier-2; NBFCs that offer a ₹999 lite variant see better accept rates",
        ],
        notes:
          "Tier-2 NBFC performance is 4.3 percentage points below Tier-1 P50 but shows stronger conversion from agent-assisted flows. NBFCs that supplement digital opt-in with a 30-second WhatsApp video explaining the claim process see a 9-point attach rate lift. AD is the primary value driver in Tier-2; Cyber Protection is the secondary — reversing the Tier-1 ordering.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_03,
        bundleId: BUNDLE_EMI,
        clientType: "NBFC",
        volumeRange: "RANGE_UNDER_5K",
        cityTier: 3,
        avgAttachRatePct: new Prisma.Decimal(28.7),
        p10AttachRatePct: new Prisma.Decimal(18.2),
        p50AttachRatePct: new Prisma.Decimal(28.7),
        p90AttachRatePct: new Prisma.Decimal(38.4),
        avgPlanValueRs: new Prisma.Decimal(1299),
        sampleSize: 3,
        topDrivers: [
          "High device damage risk in Tier-3 markets creates genuine customer demand for protection",
          "Field agent trust networks make plan explanation highly effective when the agent personally vouches",
          "First-time borrowers with new smartphones show heightened protection motivation",
        ],
        topBlockers: [
          "Cyber Protection has near-zero resonance in Tier-3 markets; plan should be pitched as AD-only",
          "Smaller NBFC branch networks in Tier-3 mean fewer field agent touch points for plan narration",
          "Price sensitivity at ₹1,299 is significant; ₹899 or ₹999 tiers would likely achieve P90 attach in this segment",
        ],
        notes:
          "Tier-3 EMI Bundle attach rates are limited by Cyber Protection's low relevance in low-digital-activity markets. NBFCs in this segment that frame the plan primarily as 'phone damage protection' (suppressing Cyber Protection in the pitch) achieve 6–8% higher attach rates than those using the full bundle narrative. Consider recommending a custom ₹899 Tier-3 plan configuration that substitutes Cyber Protection with a simpler AD-extended narrative.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_04,
        bundleId: BUNDLE_CDS,
        clientType: "OEM",
        volumeRange: "RANGE_50K_5L",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(31.2),
        p10AttachRatePct: new Prisma.Decimal(19.8),
        p50AttachRatePct: new Prisma.Decimal(31.2),
        p90AttachRatePct: new Prisma.Decimal(41.6),
        avgPlanValueRs: new Prisma.Decimal(1899),
        sampleSize: 5,
        topDrivers: [
          "OEM brand authority makes protection plan feel like a natural extension of the manufacturer guarantee",
          "₹50K+ device ASP buyers are disproportionately willing to invest ₹1,899 in protection (plan-to-device ratio of 3.8%)",
          "Dedicated dealer training programmes with incentive structures (₹418 dealer commission per plan) drive active recommendation",
        ],
        topBlockers: [
          "OEMs with in-house warranty programmes see lower CDS attach due to customer confusion between OEM warranty and third-party protection",
          "Online-first device launches have 40% lower CDS attach vs. physical retail launches due to absence of human narration",
          "Multi-brand retail environments (Croma, Reliance Digital) see lower CDS attach than branded mono-stores",
        ],
        notes:
          "Tier-1 OEM clients with OFFLINE_RETAIL distribution and branded mono-store networks achieve the highest CDS attach rates in the portfolio. The presence of an OEM-trained sales associate who can physically demonstrate the claim process via the Across Assist app at point-of-sale is the single strongest attach rate driver. OEMs that integrate CDS into their starter-pack accessories bundle see 11–14 point attach rate lifts vs. standalone plan presentation.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_05,
        bundleId: BUNDLE_CDS,
        clientType: "OEM",
        volumeRange: "RANGE_50K_5L",
        cityTier: 2,
        avgAttachRatePct: new Prisma.Decimal(26.8),
        p10AttachRatePct: new Prisma.Decimal(16.4),
        p50AttachRatePct: new Prisma.Decimal(26.8),
        p90AttachRatePct: new Prisma.Decimal(36.9),
        avgPlanValueRs: new Prisma.Decimal(1899),
        sampleSize: 3,
        topDrivers: [
          "OEM authorised service centres in Tier-2 cities reassure customers that claims will be honoured locally",
          "Aspirational device buyers in Tier-2 markets are highly motivated to protect premium purchases",
          "NBFC finance partners active in Tier-2 create a dual attach opportunity at POS and disbursement",
        ],
        topBlockers: [
          "Fewer OEM-branded mono-stores in Tier-2 means more multi-brand retail exposure with weaker attach",
          "Extended Warranty component has less perceived urgency for first-year device owners in Tier-2 vs. Tier-1",
          "Plan documentation complexity is a barrier in markets with lower English literacy; regional language materials improve attach",
        ],
        notes:
          "Tier-2 OEM clients see CDS attach 4.4 points below Tier-1 P50, primarily driven by multi-brand retail environment effects. OEMs that deploy Across Assist's regional language (Hindi, Tamil, Telugu) POS materials in Tier-2 stores see 6–8 point attach rate improvements. The Screen Protection component resonates equally strongly in Tier-2 as Tier-1, making it the most universal attach driver across city tiers.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_06,
        bundleId: BUNDLE_CDS,
        clientType: "RETAILER",
        volumeRange: "RANGE_5K_50K",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(27.4),
        p10AttachRatePct: new Prisma.Decimal(17.2),
        p50AttachRatePct: new Prisma.Decimal(27.4),
        p90AttachRatePct: new Prisma.Decimal(37.8),
        avgPlanValueRs: new Prisma.Decimal(1899),
        sampleSize: 4,
        topDrivers: [
          "Staff incentive (₹418 per plan) motivates proactive recommendation at high-traffic Tier-1 retail counters",
          "Co-located display of claim success stories and NPS testimonials at POS increases consumer confidence",
          "NBFC partner integrations add a second attach point at EMI origination for devices purchased on finance",
        ],
        topBlockers: [
          "Multi-brand retailers face plan confusion when stocking plans from multiple protection providers",
          "High footfall in Tier-1 retail limits per-customer conversation time, reducing pitch effectiveness",
          "Online competitor pricing pressure means some Tier-1 customers compare plan prices before accepting",
        ],
        notes:
          "Tier-1 retailer CDS performance is 3.8 points below comparable OEM attach rates due to brand authority dilution in multi-brand environments. Retailers that implement a 'protection plan exclusive for today's purchase' time-limited framing see 5–7 point attach rate improvements. Integration with Bajaj Finance and HDFC Bank EMI flows is the strongest technical lever available to Tier-1 retailers with active NBFC relationships.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_07,
        bundleId: BUNDLE_CDS,
        clientType: "RETAILER",
        volumeRange: "RANGE_5K_50K",
        cityTier: 2,
        avgAttachRatePct: new Prisma.Decimal(22.1),
        p10AttachRatePct: new Prisma.Decimal(13.8),
        p50AttachRatePct: new Prisma.Decimal(22.1),
        p90AttachRatePct: new Prisma.Decimal(31.4),
        avgPlanValueRs: new Prisma.Decimal(1899),
        sampleSize: 3,
        topDrivers: [
          "Personal trust relationships between retail staff and regular customers convert at higher rates in Tier-2 markets",
          "Limited local service options make Across Assist's 2,000+ service centre network a strong selling point",
          "Aspirational device buyers in Tier-2 are motivated to protect first premium smartphone purchases",
        ],
        topBlockers: [
          "Competitor presence (Onsitego, Servify) in Tier-2 markets creates price comparison pressure",
          "Lower average ticket sizes mean commission income per plan is less motivating for Tier-2 retail staff",
          "Extended Warranty has lower awareness in Tier-2 markets, requiring more staff explanation time",
        ],
        notes:
          "Tier-2 retailer CDS performance lags Tier-1 by 5.3 points. Regional language training materials, simplified claim demos on the Across Assist app, and structured staff incentive tiers (bonus for achieving 25%+ attach per month) are the highest-impact interventions for improving Tier-2 retailer performance. Retailers that host one in-store claims awareness session per quarter see sustained 4–6 point attach rate improvements.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_08,
        bundleId: BUNDLE_RS,
        clientType: "MARKETPLACE",
        volumeRange: "RANGE_50K_5L",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(47.8),
        p10AttachRatePct: new Prisma.Decimal(33.2),
        p50AttachRatePct: new Prisma.Decimal(47.8),
        p90AttachRatePct: new Prisma.Decimal(60.1),
        avgPlanValueRs: new Prisma.Decimal(899),
        sampleSize: 3,
        topDrivers: [
          "Pre-checkout trust signal placement ('Protected by Across Assist') on product listing pages drives passive acceptance before the plan is even presented",
          "Extended Warranty anchor directly converts the refurb buyer's primary anxiety (device reliability) into plan acceptance",
          "High-volume marketplaces with data science teams can personalise plan presentation based on buyer history, lifting attach to P90",
        ],
        topBlockers: [
          "Cart abandonment increases if plan is presented as a mandatory add-on rather than an opt-in recommendation",
          "Price-conscious refurb buyers compare ₹899 plan cost to device cost and need a clear value ratio narrative",
          "Returns policy confusion — buyers sometimes conflate the plan with a return guarantee and reject when clarified",
        ],
        notes:
          "This is the highest-performing segment in the Refurb Shield portfolio. Tier-1 online marketplaces selling 50K–5L refurb units monthly achieve P50 of 47.8% — the second-highest P50 of any bundle-segment combination. The ₹10K–25K ASP sweet spot (plan-to-device ratio of 3.6–9%) is the most acceptance-friendly value proposition in the portfolio. Marketplaces that A/B tested listing-level trust badges saw 14–18% checkout conversion improvements as a halo effect.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_09,
        bundleId: BUNDLE_RS,
        clientType: "MARKETPLACE",
        volumeRange: "RANGE_5K_50K",
        cityTier: 2,
        avgAttachRatePct: new Prisma.Decimal(42.3),
        p10AttachRatePct: new Prisma.Decimal(29.6),
        p50AttachRatePct: new Prisma.Decimal(42.3),
        p90AttachRatePct: new Prisma.Decimal(54.8),
        avgPlanValueRs: new Prisma.Decimal(899),
        sampleSize: 2,
        topDrivers: [
          "Tier-2 refurb buyers have strong 'what if this phone breaks' anxiety due to limited local repair options",
          "Lower ASP devices (₹8K–18K) make ₹899 plan value proposition highly favourable (5–11% plan-to-device ratio)",
          "WhatsApp-based post-purchase claim guidance narrows service gap in Tier-2 markets and builds repeat buyer loyalty",
        ],
        topBlockers: [
          "Lower digital engagement in Tier-2 means in-app plan presentation underperforms vs. SMS/WhatsApp-based plan offers",
          "Smaller marketplaces in this segment lack data science capability to personalise plan presentation",
          "COD-dominant payment behaviour in Tier-2 creates friction for digital plan issuance at checkout",
        ],
        notes:
          "Tier-2 Refurb Shield performance is 5.5 points below Tier-1 P50 but remains the highest-attach bundle in Tier-2 across all client types. Marketplaces that supplement online checkout with WhatsApp plan presentation to buyers who didn't accept at checkout recover an additional 8–12% of plans in the 24-hour post-purchase window. COD-friendly plan issuance (plan activated at delivery confirmation) is a strong lever for Tier-2 COD-heavy markets.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_10,
        bundleId: BUNDLE_TPS,
        clientType: "MARKETPLACE",
        volumeRange: "RANGE_5K_50K",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(19.6),
        p10AttachRatePct: new Prisma.Decimal(11.4),
        p50AttachRatePct: new Prisma.Decimal(19.6),
        p90AttachRatePct: new Prisma.Decimal(29.2),
        avgPlanValueRs: new Prisma.Decimal(649),
        sampleSize: 4,
        topDrivers: [
          "Post-travel insurance placement creates a 'risk completion' psychological trigger that favours TPS acceptance",
          "International booking customers (ASP ₹50K+ devices) accept at 22–26% vs. domestic-only at 14–17%",
          "One-click accept flow at payment gateway with pre-ticked opt-in (opt-out model) achieves P90 attach rates",
        ],
        topBlockers: [
          "Heavy-discount OTA customers (budget flight segment) have low plan acceptance and high churn",
          "User awareness that device is protected by mobile operator insurance reduces TPS incremental acceptance",
          "Seasonal volume concentration (summer/holidays) means annual revenue is less predictable than other bundles",
        ],
        notes:
          "TPS is the most context-dependent bundle — performance varies strongly with the placement position in the checkout flow. Best-in-class performers (P90: 29.2%) achieve this through mandatory-choice prompts (Accept / No thanks) rather than passive placement. The ₹649 price point is specifically calibrated for the ₹35K–70K device ASP profile of frequent flyers; the plan-to-device value ratio of 0.9–1.9% is psychologically below the 'impulse refusal' threshold identified in our A/B tests.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_11,
        bundleId: BUNDLE_CDS,
        clientType: "TELECOM",
        volumeRange: "RANGE_5L_PLUS",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(29.4),
        p10AttachRatePct: new Prisma.Decimal(18.8),
        p50AttachRatePct: new Prisma.Decimal(29.4),
        p90AttachRatePct: new Prisma.Decimal(39.6),
        avgPlanValueRs: new Prisma.Decimal(1899),
        sampleSize: 2,
        topDrivers: [
          "Telco retail staff are highly trained in upsell narratives and apply structured plan presentation consistently",
          "Device upgrade programmes create a natural 'protect your new phone' conversation at plan activation",
          "NBFC partner EMI flows at telco stores provide a second attach point for finance customers",
        ],
        topBlockers: [
          "Large telco POS systems have complex integration requirements that delay go-live timelines",
          "High-footfall stores limit per-customer plan explanation time, requiring scripted 30-second pitches",
          "Plan renewal rates at telcos are lower than NBFC models because there's no disbursement trigger for renewals",
        ],
        notes:
          "Telco CDS clients represent the highest volume opportunity in the portfolio (5L+ monthly units at P50 29.4% = 147,000 plans/month). However, enterprise telco integration complexity means onboarding typically takes 4–8 weeks and involves 5–8 engineer-days of technical work. The highest-priority technical integration is the NBFC partner API (Bajaj Finance, HDFC) which adds 6–10 percentage points to effective attach rate when deployed alongside POS attach.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
      {
        id: BPS_12,
        bundleId: BUNDLE_EMI,
        clientType: "OTHER",
        volumeRange: "RANGE_50K_5L",
        cityTier: 1,
        avgAttachRatePct: new Prisma.Decimal(35.8),
        p10AttachRatePct: new Prisma.Decimal(24.1),
        p50AttachRatePct: new Prisma.Decimal(35.8),
        p90AttachRatePct: new Prisma.Decimal(47.2),
        avgPlanValueRs: new Prisma.Decimal(1299),
        sampleSize: 3,
        topDrivers: [
          "Payment network clients (Mastercard, Visa) can deploy EMI Bundle as a card benefit, achieving near-frictionless attach at transaction level",
          "Insurance distribution API clients (Riskcovry) reach multiple NBFC partners simultaneously with a single integration",
          "Co-branded benefit positioning ('Protected by Mastercard + Across Assist') amplifies trust and acceptance",
        ],
        topBlockers: [
          "Payment network regulatory constraints may limit plan issuance structures requiring prior approval",
          "Multiple downstream partner NBFCs have varying API readiness, creating uneven rollout timelines",
          "Claims handling attribution is more complex in multi-party distribution chains, requiring clearer SLA documentation",
        ],
        notes:
          "The OTHER client type at Tier-1 with RANGE_50K_5L volume represents payment networks, insurance distributors, and fintech API platforms. These clients achieve strong EMI Bundle attach (P50: 35.8%) because they sit upstream of multiple NBFC disbursement flows simultaneously. A single Mastercard or Visa integration effectively activates EMI Bundle across all their issuing bank partners' device loan products.",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    ],
  });

  console.log("  ✅ Bundle performance by segment seeded (12 records)");

  // ─── TABLE 11: CHAT_MESSAGES ───────────────────────────────────────────────
  console.log("🌱 [11/17] Seeding chat_messages...");

  await prisma.chatMessage.createMany({
    skipDuplicates: true,
    data: [
      {
        id: CHAT_01,
        messageIndex: 1,
        sessionId: SESSION_COMPLETED,
        role: "USER",
        content:
          "We're an NBFC based in Pune. We disburse around 15,000 smartphone loans per month in Maharashtra, mostly Tier-2 cities like Nashik, Aurangabad, and Solapur. Our borrowers are price-sensitive and we're worried that adding a protection plan will feel like a hidden charge or push up the EMI amount. What attach rates can we realistically expect and what revenue does that translate to?",
        createdAt: new Date("2024-06-05T09:05:00Z"),
      },
      {
        id: CHAT_02,
        messageIndex: 2,
        sessionId: SESSION_COMPLETED,
        role: "ASSISTANT",
        content:
          "This is a great question and a concern we hear often from NBFC partners in Tier-2 Maharashtra markets. Let me give you the data-backed answer.\n\n**Realistic attach rate for your profile:**\nBased on our benchmark table for EMI Bundle × NBFC × 5K–50K volume × Tier-2 cities:\n- P10 (bottom performers): 22.8% attach\n- P50 (median): 34.1% attach\n- P90 (top performers): 45.7% attach\n\nAt your 15,000 monthly disbursements, that means:\n- Conservative (P10): 3,420 plans/month → **₹2.5 Cr annual plan revenue**\n- Expected (P50): 5,115 plans/month → **₹3.99 Cr annual plan revenue**\n- Best-case (P90): 6,855 plans/month → **₹5.35 Cr annual plan revenue**\n\nYour **30% NBFC revenue share** at P50 = **₹1.2 Cr annually** at zero incremental customer acquisition cost.\n\n**On the 'hidden charge' concern:**\nNBFCs that frame the plan transparently at disbursement see a 12% reduction in loan-level complaints related to device damage. At ₹1,299 amortised over a 12-month EMI cycle, the daily cost is ₹3.56 — under the noise of any EMI statement rounding. Two NBFCs in similar Tier-2 Maharashtra geographies (TVS Credit in South India; Home Credit India with overlap in Aurangabad) have reported that borrowers who hold a protection plan have measurably better repayment rates, potentially because the psychological stress of carrying an unprotected high-value asset is removed.\n\n**Similar clients for reference:**\n- **TVS Credit** (NBFC, South India, Tier-2 mix): 36% attach, 22,000 monthly units, ₹1,299 plan\n- **Home Credit India** (NBFC, Tier-2/3 including Maharashtra): 31% attach, 34,000 monthly units\n\nWould you like me to walk through the integration steps and how the API activation works?",
        createdAt: new Date("2024-06-05T09:06:30Z"),
      },
      {
        id: CHAT_03,
        messageIndex: 3,
        sessionId: SESSION_COMPLETED,
        role: "USER",
        content:
          "That revenue number is interesting. How complex is the API integration? We have an in-house tech team of about 8 engineers. And how does the claims process work for our borrowers in Nashik — is there a service centre nearby, or does the borrower have to travel?",
        createdAt: new Date("2024-06-05T09:10:00Z"),
      },
      {
        id: CHAT_04,
        messageIndex: 4,
        sessionId: SESSION_COMPLETED,
        role: "ASSISTANT",
        content:
          "Great follow-up — both are critical for your go/no-go decision.\n\n**Integration complexity:**\nThe EMI Bundle Pack integrates via a **single REST API call** at your loan disbursement event. Here's the technical scope:\n- **Endpoints required:** 1 (POST /plans/activate at disbursement) + 1 (GET /plans/{id}/status for your dashboard)\n- **Engineer days to go live:** Typically **3–5 engineer-days** for an in-house team with API experience\n- **What your team builds:** A POST call at the point you mark a loan as disbursed, passing borrower name, mobile number, device IMEI, and plan SKU. We return a plan ID and confirmation which you store in your loan record.\n- **Zero ops involvement post-integration:** Claims are entirely handled by Across Assist. No adjuster liaison, no repair centre management, no customer complaint routing for plan-related issues.\n- **Typical go-live timeline:** 94% of NBFC integrations complete within **2 weeks of contract signing**.\n\nFor your 8-engineer team, this is a 1-sprint task that 1–2 engineers can own entirely.\n\n**Claims process for Nashik borrowers:**\nNashik has **3 Across Assist certified service centres** — 2 within Nashik city (Gangapur Road, College Road areas) and 1 in Malegaon (40 km). For Aurangabad and Solapur, there are 2 centres each.\n\nThe claims flow for your borrowers:\n1. Borrower files a claim via **WhatsApp** (most common) or the Across Assist app — takes under 5 minutes\n2. Damage assessment via photos within **4 hours** for standard claims\n3. If physical inspection needed, our local partner engineer visits the borrower's location — no travel required for repairs under ₹8,000\n4. Average settlement time: **3.8 days** for Accidental Damage, **2.1 days** for Screen Protection\n5. **Zero borrower follow-up required from your NBFC team** — all claim communication is directly between Across Assist and the borrower\n\nAny other questions before I prepare your tailored revenue projection report?",
        createdAt: new Date("2024-06-05T09:13:00Z"),
      },
    ],
  });

  console.log("  ✅ Chat messages seeded (4 records)");

  // ─── TABLE 12: LEADS ──────────────────────────────────────────────────────
  console.log("🌱 [12/17] Seeding leads...");

  await prisma.lead.upsert({
    where: { id: LEAD_ROHIT },
    update: {},
    create: {
      id: LEAD_ROHIT,
      sessionId: SESSION_ACTIVE,
      status: "NEW",
      name: "Rohit Sharma",
      contactEmail: "rohit.sharma@techcorpdist.com",
      contactPhone: "+91-9988776601",
      companyName: "TechCorp Distribution",
      clientType: "RETAILER",
      city: "Pune",
      state: "Maharashtra",
      assignedTo: USER_ARJUN,
      score: 62,
      source: "ONBOARDING_PORTAL",
      notes:
        "Retailer in Pune with 15K+ monthly device sales. Currently on Onsitego. Interested in competitive switch to CDS. Mentioned strong NBFC partner (Bajaj Finance) relationship.",
      createdAt: new Date("2024-06-10T10:00:00Z"),
      updatedAt: new Date("2024-06-10T10:00:00Z"),
    },
  });

  await prisma.lead.upsert({
    where: { id: LEAD_VIKRAM },
    update: {},
    create: {
      id: LEAD_VIKRAM,
      sessionId: SESSION_ABANDONED,
      status: "QUALIFIED",
      name: "Vikram Nair",
      contactEmail: "vikram.nair@mobilezone.in",
      contactPhone: "+91-9988776602",
      companyName: "Mobilezone Retail Chain",
      clientType: "MARKETPLACE",
      city: "Bengaluru",
      state: "Karnataka",
      assignedTo: USER_ARJUN,
      score: 78,
      source: "ONBOARDING_PORTAL",
      notes:
        "Large refurb marketplace, 50K–5L monthly units. No existing vendor. Budget confirmed at ₹5 Cr+ annual plan revenue target. BANT qualified: Budget confirmed, Authority: Vikram is VP Product, Needs: complaint reduction, Timeline: Q3 FY25 launch.",
      createdAt: new Date("2024-06-08T14:00:00Z"),
      updatedAt: new Date("2024-06-09T11:00:00Z"),
    },
  });

  await prisma.lead.upsert({
    where: { id: LEAD_PRIYA },
    update: {},
    create: {
      id: LEAD_PRIYA,
      sessionId: SESSION_COMPLETED,
      status: "CONVERTED",
      name: "Priya Kapoor",
      contactEmail: "priya.kapoor@finwise-lending.com",
      contactPhone: "+91-9988776603",
      companyName: "FinWise Lending Solutions",
      clientType: "NBFC",
      city: "Pune",
      state: "Maharashtra",
      assignedTo: USER_ARJUN,
      score: 95,
      source: "ONBOARDING_PORTAL",
      notes:
        "Successfully converted. EMI Bundle Pack contract signed. Integration in progress. Go-live target: July 15, 2024.",
      convertedAt: new Date("2024-06-07T14:00:00Z"),
      convertedClientId: CLIENT_IDFC, // closest matching reference; FinWise maps to NBFC segment
      createdAt: new Date("2024-06-05T09:00:00Z"),
      updatedAt: new Date("2024-06-07T14:00:00Z"),
    },
  });

  console.log("  ✅ Leads seeded (3 records)");

  // ─── TABLE 13: LEAD_ACTIVITIES ────────────────────────────────────────────
  console.log("🌱 [13/17] Seeding lead_activities...");

  await prisma.leadActivity.createMany({
    skipDuplicates: true,
    data: [
      {
        id: LA_01,
        leadId: LEAD_VIKRAM,
        type: "EMAIL",
        description: "Continue your Across Assist onboarding — your Refurb Shield recommendation is ready",
        body: "Hi Vikram, we noticed you were exploring Refurb Shield for Mobilezone's refurb device catalogue. Your personalised revenue projection (P50: ₹38.8 Cr annually at current volume) is saved and ready. Click to resume your session and review the full analysis.",
        outcome: "OPENED_AND_CLICKED",
        performedBy: "SYSTEM",
        metadata: {
          emailType: "STEP_ABANDONED",
          openedAt: "2024-06-08T18:30:00Z",
          clickedAt: "2024-06-08T18:32:00Z",
          resumeSessionId: SESSION_ABANDONED,
        },
        createdAt: new Date("2024-06-08T16:00:00Z"),
      },
      {
        id: LA_02,
        leadId: LEAD_VIKRAM,
        type: "CALL",
        description: "Discovery call — Mobilezone refurb protection requirements",
        body: "34-minute discovery call with Vikram Nair (VP Product) and Sanjay Mehta (CFO). Discussed current complaint volume (2,400/month on 50K units = 4.8% complaint rate). Confirmed ₹5 Cr revenue target. Technical team available for integration within 6 weeks. Demo of claims portal scheduled for June 14.",
        outcome: "DEMO_SCHEDULED",
        performedBy: USER_ARJUN,
        metadata: {
          callDurationMinutes: 34,
          attendees: ["Vikram Nair", "Sanjay Mehta (CFO)"],
          demoDate: "2024-06-14T11:00:00Z",
          keyObjestions: [
            "Claims settlement speed in Tier-2 cities",
            "Integration complexity with Mobilezone's Laravel-based inventory system",
          ],
          nextSteps: ["Send tech integration guide", "Share Cashify case study PDF", "Schedule demo June 14"],
        },
        createdAt: new Date("2024-06-09T10:00:00Z"),
      },
      {
        id: LA_03,
        leadId: LEAD_VIKRAM,
        type: "STATUS_CHANGE",
        description: "Lead status updated: CONTACTED → QUALIFIED",
        body: "BANT qualification completed following discovery call. Budget: ₹5 Cr+ annual (confirmed by CFO). Authority: Vikram Nair is decision-maker with CFO sign-off authority. Need: Complaint reduction (currently 4.8% rate costing ₹1.9 Cr/year in ops). Timeline: Q3 FY25 go-live target (October 2024).",
        outcome: "QUALIFIED",
        performedBy: USER_ARJUN,
        metadata: {
          previousStatus: "CONTACTED",
          newStatus: "QUALIFIED",
          bantScore: {
            budget: "CONFIRMED",
            authority: "CONFIRMED",
            need: "STRONG",
            timeline: "SPECIFIC",
          },
          qualificationDate: "2024-06-09T11:30:00Z",
        },
        createdAt: new Date("2024-06-09T11:30:00Z"),
      },
    ],
  });

  console.log("  ✅ Lead activities seeded (3 records)");

  // ─── TABLE 14: ABANDONED_SESSION_EMAILS ───────────────────────────────────
  console.log("🌱 [14/17] Seeding abandoned_session_emails...");

  await prisma.abandonedSessionEmail.createMany({
    skipDuplicates: true,
    data: [
      {
        id: ASE_01,
        sessionId: SESSION_ABANDONED,
        emailType: "STEP_ABANDONED",
        email: "vikram.nair@mobilezone.in",

        description:
          "Vikram, your Refurb Shield analysis is ready — ₹38.8 Cr projected annual revenue for Mobilezone",
        resumeToken: "rst_vkr_mob_abandoned_20240608_a1b2c3d4",
        resumeUrl:
          "https://portal.acrossassist.com/onboard/resume?token=rst_vkr_mob_abandoned_20240608_a1b2c3d4",
        sentAt: new Date("2024-06-08T16:00:00Z"),
        deliveredAt: new Date("2024-06-08T16:01:12Z"),
        openedAt: new Date("2024-06-08T18:30:00Z"),
        clickedAt: new Date("2024-06-08T18:32:00Z"),
        resumeTokenUsedAt: new Date("2024-06-09T10:00:00Z"),
        createdAt: new Date("2024-06-08T16:00:00Z"),
      },
      {
        id: ASE_02,
        sessionId: SESSION_ABANDONED,
        emailType: "REMINDER_2",
        email: "vikram.nair@mobilezone.in",

        description:
          "Last reminder: Your Mobilezone protection plan analysis expires in 48 hours",
        resumeToken: "rst_vkr_mob_reminder2_20240611_e5f6g7h8",
        resumeUrl:
          "https://portal.acrossassist.com/onboard/resume?token=rst_vkr_mob_reminder2_20240611_e5f6g7h8",
        sentAt: new Date("2024-06-11T10:00:00Z"),
        deliveredAt: new Date("2024-06-11T10:01:08Z"),
        openedAt: null,
        clickedAt: null,
        resumeTokenUsedAt: null,
        createdAt: new Date("2024-06-11T10:00:00Z"),
      },
    ],
  });

  console.log("  ✅ Abandoned session emails seeded (2 records)");

  // ─── TABLE 15: EMAIL_LOGS ─────────────────────────────────────────────────
  console.log("🌱 [15/17] Seeding email_logs...");

  await prisma.emailLog.createMany({
    skipDuplicates: true,
    data: [
      {
        id: EL_01,
        toEmail: "priya.kapoor@finwise-lending.com",

        emailType: "WELCOME",
        subject: "Welcome to Across Assist, Priya — your FinWise protection partnership starts here",
        templateId: "tpl_welcome_client_v2",
        metadata: {
          userId: USER_PRIYA,
          sessionId: SESSION_COMPLETED,
          companyName: "FinWise Lending Solutions",
          bundleRecommended: "EMI Bundle Pack",
          projectedAnnualRevenue: 8207100,
          onboardingPortalUrl: "https://portal.acrossassist.com/dashboard",
          accountManagerName: "Arjun Mehta",
          accountManagerEmail: "arjun.mehta@acrossassist.com",
        },
        status: "DELIVERED",
        sentAt: new Date("2024-06-05T10:35:00Z"),
        deliveredAt: new Date("2024-06-05T10:36:22Z"),
        openedAt: new Date("2024-06-05T11:02:00Z"),
        createdAt: new Date("2024-06-05T10:35:00Z"),
      },
      {
        id: EL_02,
        toEmail: "rohit.sharma@techcorpdist.com",

        emailType: "LEAD_NOTIFICATION",
        subject: "🔔 New QUALIFIED lead: Mobilezone Retail Chain — ₹38.8 Cr Refurb Shield opportunity",
        templateId: "tpl_lead_notification_internal_v3",
        metadata: {
          leadId: LEAD_VIKRAM,
          leadName: "Vikram Nair",
          companyName: "Mobilezone Retail Chain",
          clientType: "MARKETPLACE",
          leadScore: 78,
          recommendedBundle: "Refurb Shield",
          projectedAnnualRevenue: 388468800,
          assignedTo: "Arjun Mehta",
          discoveryCallScheduled: "2024-06-14T11:00:00Z",
          portfolioUrl: "https://portal.acrossassist.com/admin/leads/LEAD_VIKRAM",
        },
        status: "DELIVERED",
        sentAt: new Date("2024-06-09T11:35:00Z"),
        deliveredAt: new Date("2024-06-09T11:36:05Z"),
        openedAt: new Date("2024-06-09T12:00:00Z"),
        createdAt: new Date("2024-06-09T11:35:00Z"),
      },
    ],
  });

  console.log("  ✅ Email logs seeded (2 records)");

  // ─── TABLE 16: ANALYTICS_EVENTS ───────────────────────────────────────────
  console.log("🌱 [16/17] Seeding analytics_events...");

  await prisma.analyticsEvent.createMany({
    skipDuplicates: true,
    data: [
      {
        id: AE_01,
        sessionId: SESSION_ACTIVE,
        event: "PAGE_VIEW",
        properties: {
          page: "/onboard",
          referrer: "https://www.google.com/search?q=B2B+device+protection+India",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X)",
          deviceType: "mobile",
          utm_source: "google",
          utm_medium: "organic",
        },
        createdAt: new Date("2024-06-10T10:00:00Z"),
      },
      {
        id: AE_02,
        sessionId: SESSION_ACTIVE,
        event: "STEP_1_START",
        properties: {
          step: 1,
          stepName: "Company & client type",
          clientType: "RETAILER",
          companyName: "TechCorp Distribution",
          contactEmail: "rohit.sharma@techcorpdist.com",
          timeToStartMs: 42000,
        },
        createdAt: new Date("2024-06-10T10:01:00Z"),
      },
      {
        id: AE_03,
        sessionId: SESSION_ABANDONED,
        event: "EMAIL_CAPTURED",
        properties: {
          email: "vikram.nair@mobilezone.in",
          name: "Vikram Nair",
          companyName: "Mobilezone Retail Chain",
          step: 2,
          stepName: "Contact details",
          abandonedSessionEmailQueued: true,
        },
        createdAt: new Date("2024-06-08T14:08:00Z"),
      },
      {
        id: AE_04,
        sessionId: SESSION_ABANDONED,
        event: "AI_RECOMMENDATION_VIEWED",
        properties: {
          recommendationId: REC_02,
          bundleId: BUNDLE_RS,
          bundleName: "Refurb Shield",
          projectedAnnualRevenue: 388468800,
          confidenceScore: 0.89,
          timeOnRecommendationPageMs: 94000,
          scrollDepthPct: 78,
          sectionsViewed: ["whyThisCombo", "projectedRevenue", "similarClients"],
          ctaClicked: false,
        },
        createdAt: new Date("2024-06-08T14:55:00Z"),
      },
      {
        id: AE_05,
        sessionId: SESSION_COMPLETED,
        event: "BUNDLE_ADDED_TO_CART",
        properties: {
          bundleId: BUNDLE_EMI,
          bundleName: "EMI Bundle Pack",
          planValue: 1299,
          cartTotal: 1299,
          addedFrom: "recommendation_page",
          step: 5,
        },
        createdAt: new Date("2024-06-05T10:00:00Z"),
      },
      {
        id: AE_06,
        sessionId: SESSION_COMPLETED,
        event: "ADDON_SUGGESTED",
        properties: {
          addonProductId: PRODUCT_CP,
          addonProductName: "Cyber Protection Plan",
          addonPrice: 499,
          suggestedBecause: "NBFC_EMI distribution + Tier-2 Maharshtra + UPI fraud risk signal",
          currentCartTotal: 1299,
          projectedNewCartTotal: 1798,
          suggestAfterMs: 3200,
        },
        createdAt: new Date("2024-06-05T10:02:00Z"),
      },
      {
        id: AE_07,
        sessionId: SESSION_ABANDONED,
        event: "ADDON_SUGGESTED",
        properties: {
          addonProductId: PRODUCT_AD,
          addonProductName: "Accidental Damage Protection",
          addonPrice: 799,
          suggestedBecause: "Standalone AD upsell for refurb marketplace — complements Refurb Shield EW anchor",
          currentCartTotal: 899,
          projectedNewCartTotal: 1698,
          suggestAfterMs: 4800,
        },
        createdAt: new Date("2024-06-08T15:00:00Z"),
      },
      {
        id: AE_08,
        sessionId: SESSION_COMPLETED,
        event: "ADDON_ACCEPTED",
        properties: {
          addonProductId: PRODUCT_CP,
          addonProductName: "Cyber Protection Plan",
          addonPrice: 499,
          cartTotalBefore: 1299,
          cartTotalAfter: 1798,
          acceptedVia: "single_tap_accept",
          timeToAcceptMs: 8400,
        },
        createdAt: new Date("2024-06-05T10:03:00Z"),
      },
      {
        id: AE_09,
        sessionId: SESSION_ABANDONED,
        event: "ADDON_REJECTED",
        properties: {
          addonProductId: PRODUCT_AD,
          addonProductName: "Accidental Damage Protection",
          addonPrice: 799,
          rejectionMethod: "user_deselected_checkbox",
          timeToRejectMs: 12200,
          cartTotalUnchanged: 899,
          rejectionReason: "price_too_high",
        },
        createdAt: new Date("2024-06-08T15:02:00Z"),
      },
      {
        id: AE_10,
        sessionId: SESSION_ABANDONED,
        event: "CART_ABANDONED",
        properties: {
          cartTotal: 899,
          bundlesInCart: [{ bundleId: BUNDLE_RS, bundleName: "Refurb Shield", planValue: 899 }],
          addonsRejected: [
            { productId: PRODUCT_AD, productName: "Accidental Damage Protection", price: 799 },
          ],
          abandonedAtStep: 4,
          abandonedAtStepName: "Review & checkout",
          sessionDurationMs: 4920000,
          recoveryEmailQueued: true,
          recoveryEmailType: "STEP_ABANDONED",
        },
        createdAt: new Date("2024-06-08T15:22:00Z"),
      },
      {
        id: AE_11,
        sessionId: SESSION_COMPLETED,
        event: "PROCEED_TO_PARTNERSHIP_CLICKED",
        properties: {
          cartTotal: 1798,
          bundlesInCart: [{ bundleId: BUNDLE_EMI, bundleName: "EMI Bundle Pack", planValue: 1299 }],
          addonsInCart: [{ productId: PRODUCT_CP, productName: "Cyber Protection Plan", price: 499 }],
          projectedAnnualRevenue: 8207100,
          confidenceScore: 0.92,
          ctaLabel: "Proceed to Partnership →",
          timeOnCheckoutPageMs: 62000,
        },
        createdAt: new Date("2024-06-05T10:10:00Z"),
      },
      {
        id: AE_12,
        sessionId: SESSION_COMPLETED,
        event: "SIGNUP_COMPLETED",
        properties: {
          userId: USER_PRIYA,
          toEmail: "priya.kapoor@finwise-lending.com",
          companyName: "FinWise Lending Solutions",
          clientType: "NBFC",
          bundleSelected: "EMI Bundle Pack",
          addonsSelected: ["Cyber Protection Plan"],
          totalCartValue: 1798,
          signupMethod: "email_password",
          welcomeEmailSent: true,
          leadCreated: true,
          leadId: LEAD_PRIYA,
        },
        createdAt: new Date("2024-06-05T10:28:00Z"),
      },
    ],
  });

  console.log("  ✅ Analytics events seeded (12 records)");

  // ─── SUMMARY ──────────────────────────────────────────────────────────────
  console.log("\n🎉 Seed complete! Record counts by table:");
  console.log("  TABLE 1  — users:                          2");
  console.log("  TABLE 2  — sessions:                       3");
  console.log("  TABLE 3  — products:                       4");
  console.log("  TABLE 4  — bundles:                        4");
  console.log("  TABLE 5  — bundle_products:                9");
  console.log("  TABLE 6  — clients:                       33");
  console.log("  TABLE 7  — client_bundles:                33");
  console.log("  TABLE 8  — recommendations:               13 (10 accurate + 3 inaccurate)");
  console.log("  TABLE 9  — product_claim_stats:            8");
  console.log("  TABLE 10 — bundle_performance_by_segment: 12");
  console.log("  TABLE 11 — chat_messages:                  4");
  console.log("  TABLE 12 — leads:                          3");
  console.log("  TABLE 13 — lead_activities:                3");
  console.log("  TABLE 14 — abandoned_session_emails:       2");
  console.log("  TABLE 15 — email_logs:                     2");
  console.log("  TABLE 16 — analytics_events:              12");
  console.log("  ─────────────────────────────────────────────");
  console.log("  TOTAL:                                   148 records");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
