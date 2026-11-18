import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

export type UserRole = "customer" | "technician" | "admin";

export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
};

/** Roles a visitor can pick on the sign-up form. `admin` is never self-assignable. */
export type SignUpRole = "customer" | "technician";

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
  role: SignUpRole;
};

export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

export type RoleOption = {
  value: SignUpRole;
  title: string;
  description: string;
  icon: LucideIcon;
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

export type BrandProps = {
  className?: string;
  onClick?: () => void;
};

export type MobileNavProps = {
  user: NavbarUser | null;
  onSignOut: () => void;
};

export type UserMenuProps = {
  user: NavbarUser;
  onSignOut: () => void;
};

export type PagePlaceholderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

export type HeroAction = {
  label: string;
  href: string;
};

export type HeroSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  image: {
    src: string;
    alt: string;
  };
  highlights?: string[];
  className?: string;
};

export type HeroVisualProps = {
  src: string;
  alt: string;
};

/* -------------------------------------------------------------------------- */
/*                                 How it works                               */
/* -------------------------------------------------------------------------- */

export type HowItWorksStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type HowItWorksProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: HowItWorksStep[];
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                           Categories & trust points                        */
/* -------------------------------------------------------------------------- */

export type ServiceCategory = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type PopularCategoriesProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  categories: ServiceCategory[];
  className?: string;
};

export type TrustPoint = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type WhyChooseUsProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  points: TrustPoint[];
  className?: string;
};
