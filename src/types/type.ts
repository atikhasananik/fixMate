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
  /** ImgBB URL for the profile picture; empty when the user skips it. */
  image: string;
};

export type SignUpErrors = Partial<Record<keyof SignUpValues, string>>;

export type RoleOption = {
  value: SignUpRole;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SignInValues = {
  email: string;
  password: string;
};

export type SignInErrors = Partial<Record<keyof SignInValues, string>>;

export type SignInFormProps = {
  /** Internal path to return to after login (e.g. the page the user tried to open). */
  redirectTo?: string;
  googleEnabled: boolean;
};

export type GoogleSignInButtonProps = {
  callbackURL: string;
};

export type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  highlights?: string[];
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

/* -------------------------------------------------------------------------- */
/*                                   Reviews                                  */
/* -------------------------------------------------------------------------- */

export type CustomerReview = {
  name: string;
  /** Repair that was booked, e.g. "AC Repair". */
  service: string;
  quote: string;
  /** 1–5 stars. */
  rating: number;
  verified?: boolean;
};

export type ReviewCardProps = {
  review: CustomerReview;
};

export type CustomerReviewsProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  reviews: CustomerReview[];
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                                    FAQ                                     */
/* -------------------------------------------------------------------------- */

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FaqItem[];
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Dashboard                                  */
/* -------------------------------------------------------------------------- */

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export type ServiceApprovalStatus = "pending" | "approved" | "rejected";

export type ServiceMode = "home-visit" | "shop-drop-off";

export type Booking = {
  id: string;
  serviceTitle: string;
  customerId: string;
  customerName: string;
  technicianId: string;
  technicianName: string;
  /** ISO date string. */
  preferredDate: string;
  basePrice: number;
  finalAmount?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

export type ServiceListing = {
  id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  /** ImgBB URL, stored when the technician uploads the service image. */
  image?: string;
  technicianId: string;
  technicianName: string;
  isAvailable: boolean;
  approvalStatus: ServiceApprovalStatus;
  createdAt: Date;
};

/** Raw document returned by `GET /get-services/:email` on the Express API. */
export type ServiceApiItem = {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  image?: string;
  basePrice?: number;
  estimatedDuration?: string;
  /** API label form: "Home Visit" or "Shop Drop-off". */
  serviceMode?: string;
  serviceArea?: string;
  technicianName?: string;
  technicianEmail?: string;
  approvalStatus?: ServiceApprovalStatus;
  isAvailable?: boolean;
  createdAt?: string;
};

/** Normalised service shape used by the technician My Services table. */
export type TechnicianService = {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName?: string;
  approvalStatus: ServiceApprovalStatus;
  isAvailable: boolean;
};

export type TechnicianServicesProps = {
  services: TechnicianService[];
  error?: string | null;
};

/* -------------------------------------------------------------------------- */
/*                            Public services page                            */
/* -------------------------------------------------------------------------- */

export type ServiceCardProps = {
  service: TechnicianService;
};

export type ServicesToolbarProps = {
  categories: string[];
  /** Raw route search params, used to read and preserve query values. */
  searchParams: Record<string, string | string[] | undefined>;
};

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  /** ISO date string. */
  joinedAt: string;
};

export type DashboardViewer = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  /** ISO date string. */
  joinedAt: string;
};

export type DashboardStat = {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: string;
};

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match only the exact path (used by overview links). */
  exact?: boolean;
};

export type DashboardNavConfig = Record<UserRole, DashboardNavItem[]>;

export type ServiceFormValues = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  image: string;
};

export type ServiceFormErrors = Partial<Record<keyof ServiceFormValues, string>>;

export type ServiceFormProps = {
  /** Existing listing to edit; omit when creating a new service. */
  service?: TechnicianService | null;
  technician: {
    name: string;
    email: string;
  };
  onSubmit: (values: ServiceFormValues) => void;
};

export type DashboardStoreProviderProps = {
  viewer: DashboardViewer;
  children: ReactNode;
};

export type DashboardStoreValue = {
  viewer: DashboardViewer;
  bookings: Booking[];
  services: ServiceListing[];
  users: PlatformUser[];
  cancelBooking: (bookingId: string) => void;
  addService: (data: IServiceData) => void;
  updateService: (serviceId: string, values: ServiceFormValues) => void;
  deleteService: (serviceId: string) => void;
  setServiceAvailability: (serviceId: string, isAvailable: boolean) => void;
  setServiceApprovalStatus: (
    serviceId: string,
    status: ServiceApprovalStatus
  ) => void;
  setUserRole: (userId: string, role: UserRole) => void;
};

/* Dashboard component props */

export type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export type StatCardProps = {
  stat: DashboardStat;
};

export type StatsGridProps = {
  stats: DashboardStat[];
  className?: string;
};

export type StatusBadgeProps =
  | { kind: "booking"; status: BookingStatus }
  | { kind: "payment"; status: PaymentStatus }
  | { kind: "approval"; status: ServiceApprovalStatus };

export type ServiceThumbnailProps = {
  title: string;
  image?: string;
  className?: string;
};

export type ServiceCellProps = {
  title: string;
  category: string;
  image?: string;
};

export type TableCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
};

export type DashboardSidebarProps = {
  viewer: DashboardViewer;
};

export type DashboardTopbarProps = {
  viewer: DashboardViewer;
};



export interface IServiceData {
  title: string;
  category:
    | "Smartphone"
    | "Laptop & PC"
    | "AC"
    | "Refrigerator"
    | "TV"
    | "Washing Machine"
    | "Electrical";
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: Date;
}