// Canonical venture content for all marketing pages.
// Grounded in Tentmakers_Ecosystem_Business_Plan.docx (Sept 2026):
// Prime Digital Solutions is Operating; Thrifty Tribe, ICKY, and Prime Axis
// are Prototype Ready; Tentmakers Network is pre-launch (300-member Q4 2026
// target). Statistics below come from the plan's §8 (PSA, DTI, BSP, Insurance
// Commission, PNP-HPG, CPA Australia) — most are national or Western
// Visayas-regional proxies, not Panay-specific measurements.
// The public.ventures table (supabase/migrations/20260910000000_tentmakers_core.sql
// + 20260911000001_ventures_content.sql) mirrors this file field-for-field for
// future CMS use. Until pages read from the database, edit HERE — then mirror
// the change into the seed migration to keep both sources consistent.
export type VentureStage = 'Active' | 'Scaling' | 'Early';

export interface Venture {
  slug: string;
  name: string;
  stage: VentureStage;
  gap: string;
  offering: string;
  marketSignals: string[];
  description: string;
  fullDescription: string[];
  metric: string;
  metricLabel: string;
  industries: string[];
}

export const ventures: Venture[] = [
  {
    slug: 'prime-digital-solutions',
    name: 'Prime Digital Solutions',
    stage: 'Active',
    gap: 'The Storefront Gap',
    offering: 'Websites, apps, and automation for MSMEs — the technology backbone discounting dev services for member founders.',
    marketSignals: [
      '99.5% of Philippine businesses are MSMEs; they generate 63% of employment',
      '90.8% own computers and 81% have internet, yet real digital-tool adoption lags far behind',
      'National e-commerce market of roughly $20–24 billion and growing fast',
    ],
    description: 'Founders needing digital storefronts — website and app development plus business automation, built for the Panay MSME base.',
    fullDescription: [
      'MSMEs make up 99.5% of all Philippine businesses and generate roughly 63% of national employment — the addressable base for web, app, and automation services is almost the entire business population, not a niche.',
      '90.8% of business establishments already own computers and 81% have internet access, but adoption of actual digital tools, e-commerce, and AI remains far behind that baseline. The gap between basic connectivity and a real digital presence is exactly what Prime Digital Solutions sells.',
      'As the ecosystem\'s technology backbone, it builds and hosts the Tentmakers platform itself while offering discounted website, app, and automation packages to founders — including accelerator teams preparing for Demo Day.',
    ],
    metric: '57,469',
    metricLabel: 'MSMEs in Western Visayas (DTI)',
    industries: ['Web', 'App', 'Automation', 'E-commerce'],
  },
  {
    slug: 'thrifty-tribe',
    name: 'Thrifty Tribe',
    stage: 'Early',
    gap: 'The Savings Gap',
    offering: 'A smart savings membership — structured savings, QR-code deals, and cashback at partner merchants, built into Tentmakers membership from day one.',
    marketSignals: [
      'Digital payments reached 57.4% of retail volume in 2024 — QR spending is the norm',
      '43% of adults hold e-money accounts; 58% have a formal financial account',
      'Member businesses become partner-merchants, compounding the network',
    ],
    description: 'Savers building financial habits — structured savings through Thrifty Tribe, with QR-code deals and cashback at partner merchants.',
    fullDescription: [
      'Digital payments reached 57.4% of retail transaction volume nationally in 2024 — QR-based, cashless spending is now the norm, not the exception. Thrifty Tribe rides exactly that behavior with QR-code deals and cashback.',
      'With 43% of adults holding e-money accounts and 58% having some formal financial account, a fast-growing pool of people is already comfortable transacting the way Thrifty Tribe requires.',
      'Member businesses become partner-merchants, so every new member grows the discount network and every new merchant makes membership more valuable — while paid Thrifty Tribe upgrades taken up by members form part of the ecosystem\'s revenue base.',
    ],
    metric: 'Members-only',
    metricLabel: 'QR deals & cashback at partner merchants',
    industries: ['Payments', 'Savings', 'Cashback'],
  },
  {
    slug: 'icky',
    name: 'ICKY',
    stage: 'Early',
    gap: 'The Staffing Gap',
    offering: 'A general and specialized labor marketplace — staffing for Tentmakers events today, and a hiring resource for members’ growing businesses.',
    marketSignals: [
      '41% of SMEs increased headcount in 2024; 57% planned further hiring in 2025',
      'MSMEs generate ~63% of national employment and keep formalizing',
      'No Panay-specific labor-market sizing exists — demand is validated via SME hiring data',
    ],
    description: 'SMEs scaling their headcount — a labor marketplace for skilled and general talent, starting with network event staffing and growing into the hiring resource for members’ businesses.',
    fullDescription: [
      '41% of Philippine SMEs increased headcount in 2024, and 57% planned further hiring in 2025 — direct evidence of rising demand for the flexible skilled and general labor ICKY supplies.',
      'As MSMEs formalize and grow, demand for reliable outside staffing and technical labor grows alongside them — and ICKY earns placement margin on that demand, including staffing for network events.',
      'No Panay-specific marketplace sizing exists in public sources, so the case rests honestly on adjacent SME-hiring data — to be validated with ICKY\'s own operating data as volume grows.',
    ],
    metric: '41%',
    metricLabel: 'of SMEs increased headcount in 2024',
    industries: ['Staffing', 'Labor'],
  },
  {
    slug: 'prime-axis',
    name: 'Prime Axis',
    stage: 'Early',
    gap: 'The Protection Gap',
    offering: 'Driver protection and road-safety education — insurance literacy, 3D driving simulation, and 24/7 SOS for the people who keep Panay Island moving.',
    marketSignals: [
      'Insurance penetration only ~1.79% in 2025, below the 2% national target',
      '31,000+ road accidents in 2024, 2,747 deaths — 87% from reckless driving',
      'Masa and Iskolar plans plus discounted cover for members and their riders',
    ],
    description: 'Drivers and families needing protection — insurance literacy, road-safety education, 3D driving simulation, and 24/7 SOS with discounted plans for members and their riders.',
    fullDescription: [
      'Overall Philippine insurance penetration was only about 1.79% in 2025 — below the Insurance Commission\'s own 2% target — leaving most households and vehicle owners uninsured beyond the legal minimum.',
      'Over 31,000 road accidents were recorded in 2024, resulting in 2,747 deaths, with roughly 87% attributed to reckless driving. That is exactly the risk Prime Axis\'s road-safety education and 3D simulation training targets.',
      'Through campus workshops, safety and literacy programming, 24/7 SOS response, and the Masa and Iskolar plans, Prime Axis protects riders and vehicles while giving members discounted cover for themselves and their riders.',
    ],
    metric: '~1.79%',
    metricLabel: 'insurance penetration (2025)',
    industries: ['Insurance', 'Road Safety', 'Education', '24/7 SOS'],
  },
  {
    slug: 'tentmakers-network',
    name: 'Tentmakers Network',
    stage: 'Early',
    gap: 'The Trust Gap',
    offering: 'A member network launching across Panay Island — three readiness tiers, mentorship, and real venture access, targeting 300 members by Q4 2026.',
    marketSignals: [
      '300-member target: Iloilo HQ 150, Capiz 60, Aklan 50, Antique 40',
      'Three readiness tiers: Foundation, Building, Established — plus Anchor band for mentor-track candidates',
      'Readiness Score blends training, savings, site engagement, protection, and mentorship',
    ],
    description: 'The connective tissue across all ventures — a member network with a Readiness Score, three training tiers, and real venture access, not a franchise offer.',
    fullDescription: [
      'Tentmakers Network is launching across Panay Island — Iloilo, Capiz, Aklan, and Antique — targeting 300 members by Q4 2026: 150 at Iloilo HQ, 60 in Capiz, 50 in Aklan, and 40 in Antique.',
      'Members progress through three readiness tiers — Foundation, Building, Established — with an Anchor band (90–100) flagging mentor-track candidates. The Readiness Score blends training completion, savings consistency, site engagement, protection enrollment, and mentorship participation so advancement reflects real readiness, not course-clicking alone.',
      'Tiers are strictly readiness gates, not a ladder toward a Tentmakers role. A member can complete all three tiers and never engage with the ventures again — that\'s a successful outcome, not an attrition problem.',
    ],
    metric: '300',
    metricLabel: 'member target by Q4 2026',
    industries: ['Community', 'Training', 'Mentorship'],
  },
];

export function getVentureBySlug(slug: string): Venture | undefined {
  return ventures.find((v) => v.slug === slug);
}

export type NetworkNode = {
  slug: string;
  name: string;
  x: number;
  y: number;
  gap: string;
  metric: string;
};

export const networkLayout: {
  width: number;
  height: number;
  center: NetworkNode;
  satellites: NetworkNode[];
  colors: Record<string, string>;
} = {
  width: 240,
  height: 240,
  center: {
    slug: 'tentmakers-network',
    name: 'Tentmakers Network',
    x: 120,
    y: 120,
    gap: 'The Trust Gap',
    metric: '300',
  },
  satellites: [
    { slug: 'prime-digital-solutions', name: 'Prime Digital Solutions', x: 60, y: 60, gap: 'The Storefront Gap', metric: '57,469' },
    { slug: 'thrifty-tribe', name: 'Thrifty Tribe', x: 180, y: 60, gap: 'The Savings Gap', metric: 'Members-only' },
    { slug: 'icky', name: 'ICKY', x: 60, y: 180, gap: 'The Staffing Gap', metric: '41%' },
    { slug: 'prime-axis', name: 'Prime Axis', x: 180, y: 180, gap: 'The Protection Gap', metric: '~1.79%' },
  ],
  colors: {
    'prime-digital-solutions': '#0e1120',
    'thrifty-tribe': '#ea8b1d',
    'icky': '#22875c',
    'prime-axis': '#ea8b1d',
    'tentmakers-network': '#ea8b1d',
  },
};
