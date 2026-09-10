// Canonical venture content for all marketing pages.
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
}

export const ventures: Venture[] = [
  {
    slug: 'prime-digital-solutions',
    name: 'Prime Digital Solutions',
    stage: 'Active',
    gap: 'The Storefront Gap',
    offering: 'Digital storefronts for MSMEs — affordable, branded online presence that turns foot traffic into digital traffic.',
    marketSignals: [
      '57.4% of retail transactions are digital',
      '57,469 MSME establishments on Panay Island',
      'Under 15% of MSMEs have a meaningful online presence',
    ],
    description: 'Most MSMEs on Panay Island still rely on word-of-mouth and physical foot traffic. Prime Digital Solutions gives them a professional digital storefront — affordably.',
    fullDescription: [
      'Panay Island has over 57,000 MSMEs, yet fewer than 15% have a meaningful online presence. The gap between consumer behavior (57.4% of retail transactions are now digital) and business readiness is massive.',
      'Prime Digital Solutions bridges this gap by offering affordable, branded digital storefronts that allow MSMEs to showcase products, accept orders, and reach customers beyond their immediate geography.',
      'Each storefront is designed for mobile-first experiences, optimized for local search, and integrated with social media channels that MSMEs already use.',
    ],
    metric: '57,469',
    metricLabel: 'MSME establishments',
  },
  {
    slug: 'thrifty-tribe',
    name: 'Thrifty Tribe',
    stage: 'Scaling',
    gap: 'The Savings Gap',
    offering: 'Group-based savings tools that give communities a structured way to save, pool, and grow together.',
    marketSignals: [
      'Under 30% of adults have formal savings',
      'Strong rotating savings (paluwagan) culture',
      'Growing mobile wallet adoption',
    ],
    description: 'Filipino communities have a deep culture of communal savings. Thrifty Tribe digitizes and structures this practice, making it safer, more transparent, and more effective.',
    fullDescription: [
      'In the Philippines, "paluwagan" — informal rotating savings groups — is a deeply embedded financial practice. But these are often informal, hard to track, and prone to disruption.',
      'Thrifty Tribe brings this cultural practice into a structured digital framework: groups can save together, track contributions, access pooled funds, and build financial discipline with transparency.',
      'The platform is designed for community-first adoption — starting with neighborhoods, workplaces, and church groups on Panay Island before expanding regionally.',
    ],
    metric: '<30%',
    metricLabel: 'adults with formal savings',
  },
  {
    slug: 'icky',
    name: 'ICKY',
    stage: 'Scaling',
    gap: 'The Staffing Gap',
    offering: 'A staffing pipeline that connects growing SMEs with vetted, trained talent — fast.',
    marketSignals: [
      '41% of SMEs increased headcount in 2024',
      'High youth unemployment in Western Visayas',
      'Limited structured hiring platforms for SMEs',
    ],
    description: 'Growing SMEs need talent but lack the hiring infrastructure of large corporations. ICKY provides a vetted, trained staffing pipeline built for speed.',
    fullDescription: [
      'SMEs on Panay Island are growing — 41% increased headcount in 2024 — but hiring remains painful. Job boards are generic, recruiters focus on large employers, and SMEs need people who are ready to work.',
      'ICKY solves this by maintaining a pipeline of vetted, trained candidates specifically matched to SME needs. From operations staff to sales roles, ICKY reduces time-to-hire from weeks to days.',
      'The training pipeline feeds directly from Tentmakers\' ecosystem — creating a virtuous cycle where trained members become employable talent, and employable talent becomes future venture operators.',
    ],
    metric: '41%',
    metricLabel: 'of SMEs increased headcount in 2024',
  },
  {
    slug: 'prime-axis',
    name: 'Prime Axis',
    stage: 'Active',
    gap: 'The Protection Gap',
    offering: 'Driver protection and micro-insurance designed for the people who keep Panay Island moving.',
    marketSignals: [
      'Under 2% insurance penetration',
      '31,000+ road accidents in 2024',
      'Growing ride-hailing and delivery sector',
    ],
    description: 'With under 2% insurance penetration and over 31,000 road accidents in 2024, Panay Island\'s drivers are dangerously unprotected. Prime Axis changes that.',
    fullDescription: [
      'Panay Island recorded over 31,000 road accidents in 2024, yet insurance penetration remains under 2%. For gig workers, tricycle drivers, and delivery riders — the backbone of local mobility — an accident can be financially devastating.',
      'Prime Axis provides affordable, micro-insurance products designed specifically for this population: driver protection, accident coverage, and vehicle insurance with flexible payment terms.',
      'The product is distributed through the Tentmakers network, leveraging trust relationships rather than cold sales — making it the most accessible protection layer for Panay\'s working drivers.',
    ],
    metric: '<2%',
    metricLabel: 'insurance penetration',
  },
  {
    slug: 'tentmakers-network',
    name: 'Tentmakers Network',
    stage: 'Active',
    gap: 'The Trust Gap',
    offering: 'The connective tissue — a training hub that turns members into operators and ventures into an ecosystem.',
    marketSignals: [
      '3-tier training progression',
      'Members get value from day one',
      'Franchise pipeline for top performers',
    ],
    description: 'Tentmakers Network is the operating system — the training hub that turns individual members into operators and individual ventures into a connected ecosystem.',
    fullDescription: [
      'Every ecosystem needs connective tissue. Tentmakers Network is the training hub that transforms members from day-one participants into skilled operators, and transforms five standalone ventures into a unified ecosystem.',
      'The 3-tier progression (Basic → Intermediate → Advanced) gives members increasing access to tools, training, and opportunities across all five ventures.',
      'The strongest performers enter a franchise pipeline — becoming future regional operators who replicate the model across neighboring islands and provinces.',
    ],
    metric: '3',
    metricLabel: 'tier training progression',
  },
];

export function getVentureBySlug(slug: string): Venture | undefined {
  return ventures.find((v) => v.slug === slug);
}
