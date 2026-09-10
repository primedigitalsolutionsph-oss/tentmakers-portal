-- Align seeded venture long-form content with lib/ventures-data.ts.
-- Safe to re-run: keyed on slug, update only.

update public.ventures set
  full_description = array[
    'Panay Island has over 57,000 MSMEs, yet fewer than 15% have a meaningful online presence. The gap between consumer behavior (57.4% of retail transactions are now digital) and business readiness is massive.',
    'Prime Digital Solutions bridges this gap by offering affordable, branded digital storefronts that allow MSMEs to showcase products, accept orders, and reach customers beyond their immediate geography.',
    'Each storefront is designed for mobile-first experiences, optimized for local search, and integrated with social media channels that MSMEs already use.'
  ],
  updated_at = now()
where slug = 'prime-digital-solutions';

update public.ventures set
  full_description = array[
    'Everyday prices keep rising, and households feel it on every purchase. Thrifty Tribe answers with a simple proposition: one membership, discounts everywhere you already shop.',
    'Members subscribe once and unlock exclusive prices at a growing network of partner merchants — stores, eateries, and local services that gain loyal, repeat customers in return.',
    'It is savings without the sacrifice: no coupons to clip, no points to chase. Show your membership, pay less, and keep more of what you earn.'
  ],
  updated_at = now()
where slug = 'thrifty-tribe';

update public.ventures set
  full_description = array[
    'Panay Island recorded over 31,000 road accidents in 2024, yet insurance penetration remains under 2%. For gig workers, tricycle drivers, and delivery riders — the backbone of local mobility — an accident can be financially devastating.',
    'ICKY provides affordable, micro-insurance products designed specifically for this population: driver protection, accident coverage, and vehicle insurance with flexible payment terms.',
    'The product is distributed through the Tentmakers network, leveraging trust relationships rather than cold sales — making it the most accessible protection layer for Panay''s working drivers.'
  ],
  updated_at = now()
where slug = 'icky';

update public.ventures set
  full_description = array[
    'SMEs on Panay Island are growing — 41% increased headcount in 2024 — but hiring remains painful. Job boards are generic, recruiters focus on large employers, and SMEs need people who are ready to work.',
    'Prime Axis solves this by maintaining a pipeline of vetted, trained candidates specifically matched to SME needs. From operations staff to sales roles, Prime Axis reduces time-to-hire from weeks to days.',
    'The talent pipeline feeds directly from Tentmakers'' ecosystem — creating a virtuous cycle where trained members become employable talent, and employable talent becomes future venture operators.'
  ],
  updated_at = now()
where slug = 'prime-axis';

update public.ventures set
  full_description = array[
    'Every ecosystem needs connective tissue. Tentmakers Network is the training hub that transforms members from day-one participants into skilled operators, and transforms five standalone ventures into a unified ecosystem.',
    'The 3-tier progression (Basic → Intermediate → Advanced) gives members increasing access to tools, training, and opportunities across all five ventures.',
    'The strongest performers enter a franchise pipeline — becoming future regional operators who replicate the model across neighboring islands and provinces.'
  ],
  updated_at = now()
where slug = 'tentmakers-network';
