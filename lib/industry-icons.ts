import {
  Globe,
  Smartphone,
  Workflow,
  ShoppingBag,
  CreditCard,
  PiggyBank,
  BadgePercent,
  ShieldCheck,
  Siren,
  GraduationCap,
  LifeBuoy,
  Users,
  HardHat,
  UsersRound,
  Rocket,
  Network,
  type LucideIcon,
} from 'lucide-react';

// Industry label → illustrative icon. Labels come from Venture.industries
// (lib/ventures-data.ts); unknown labels fall back to the Network glyph.
export const industryIcons: Record<string, LucideIcon> = {
  Web: Globe,
  App: Smartphone,
  Automation: Workflow,
  'E-commerce': ShoppingBag,
  Payments: CreditCard,
  Savings: PiggyBank,
  Cashback: BadgePercent,
  Insurance: ShieldCheck,
  'Road Safety': Siren,
  Education: GraduationCap,
  '24/7 SOS': LifeBuoy,
  Staffing: Users,
  Labor: HardHat,
  Community: UsersRound,
  Accelerator: Rocket,
  Training: GraduationCap,
};

export function industryIcon(label: string): LucideIcon {
  return industryIcons[label] ?? Network;
}
