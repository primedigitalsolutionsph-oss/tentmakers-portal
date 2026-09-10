-- Align seeded venture long-form content with lib/ventures-data.ts.
-- Safe to re-run: keyed on slug, update only.
-- Content grounded in Tentmakers_Ecosystem_Business_Plan.docx (Sept 2026).

update public.ventures set
  full_description = array[
    'MSMEs make up 99.5% of all Philippine businesses and generate roughly 63% of national employment — the addressable base for web, app, and automation services is almost the entire business population, not a niche.',
    '90.8% of business establishments already own computers and 81% have internet access, but adoption of actual digital tools, e-commerce, and AI remains far behind that baseline. The gap between basic connectivity and a real digital presence is exactly what Prime Digital Solutions sells.',
    'As the ecosystem''s technology backbone, it builds and hosts the Tentmakers platform itself while offering discounted website, app, and automation packages to founders — including accelerator teams preparing for Demo Day.'
  ],
  updated_at = now()
where slug = 'prime-digital-solutions';

update public.ventures set
  full_description = array[
    'Digital payments reached 57.4% of retail transaction volume nationally in 2024 — QR-based, cashless spending is now the norm, not the exception. Thrifty Tribe rides exactly that behavior with QR-code deals and cashback.',
    'With 43% of adults holding e-money accounts and 58% having some formal financial account, a fast-growing pool of people is already comfortable transacting the way Thrifty Tribe requires.',
    'Member businesses become partner-merchants, so every new member grows the discount network and every new merchant makes membership more valuable — while paid Thrifty Tribe upgrades taken up by members form part of the ecosystem''s revenue base.'
  ],
  updated_at = now()
where slug = 'thrifty-tribe';

update public.ventures set
  full_description = array[
    'Overall Philippine insurance penetration was only about 1.79% in 2025 — below the Insurance Commission''s own 2% target — leaving most households and vehicle owners uninsured beyond the legal minimum.',
    'Over 31,000 road accidents were recorded in 2024, resulting in 2,747 deaths, with roughly 87% attributed to reckless driving. That is exactly the risk ICKY''s road-safety education and 3D simulation training targets.',
    'Through campus workshops, safety and literacy programming, 24/7 SOS response, and the Masa and Iskolar plans, ICKY protects riders and vehicles while giving members discounted cover for themselves and their riders.'
  ],
  updated_at = now()
where slug = 'icky';

update public.ventures set
  full_description = array[
    '41% of Philippine SMEs increased headcount in 2024, and 57% planned further hiring in 2025 — direct evidence of rising demand for the flexible skilled and general labor Prime Axis supplies.',
    'As MSMEs formalize and grow, demand for reliable outside staffing and technical labor grows alongside them — and Prime Axis earns placement margin on that demand, including staffing for network events.',
    'No Panay-specific marketplace sizing exists in public sources, so the case rests honestly on adjacent SME-hiring data — to be validated with Prime Axis''s own operating data as volume grows.'
  ],
  updated_at = now()
where slug = 'prime-axis';

update public.ventures set
  full_description = array[
    'Tentmakers Network is launching across Panay Island — Iloilo, Capiz, Aklan, and Antique — targeting 300 members by Q4 2026: 150 at Iloilo HQ, 60 in Capiz, 50 in Aklan, and 40 in Antique.',
    'A two-tier model keeps it open yet selective: a low-friction Network Member tier where the 300-member target lives, plus capacity-capped Accelerator Cohorts of 15–25 founders per 12-week cycle, ending in a founder-to-investor Demo Day.',
    'Beyond customers of the four ventures, members are intended to become future franchise or regional-operator candidates — a stated long-term intent, not a running program: no franchise terms exist yet, so Batch 1 hears it as vision while the buildout happens in parallel.'
  ],
  updated_at = now()
where slug = 'tentmakers-network';
