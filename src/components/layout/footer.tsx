import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Camera, GitBranch, X } from "lucide-react";
import { Brand } from "@/components/layout/brand";

type FooterLink = {
  label: string;
  href: string;
};

const SOCIALS: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "GitHub", href: "https://github.com/atikhasananik/fixMate", icon: GitBranch },
  { label: "X / Twitter", href: "https://x.com/fixmate", icon: X },
  { label: "Instagram", href: "https://instagram.com/fixmate", icon: Camera },
  { label: "LinkedIn", href: "https://linkedin.com/company/fixmate", icon: Briefcase },
];

const QUICK_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/#faq" },
];

const CUSTOMER_SUPPORT_LINKS: FooterLink[] = [
  { label: "My Bookings", href: "/dashboard/customer/bookings" },
  { label: "My Profile", href: "/dashboard/profile" },
  { label: "Help Center", href: "/#faq" },
  { label: "FAQ", href: "/#faq" },
];

const SERVICE_LINKS: FooterLink[] = [
  { label: "Appliance Repair", href: "/services?category=Refrigerator" },
  { label: "AC Repair", href: "/services?category=AC" },
  { label: "Electrical Services", href: "/services?category=Electrical" },
  {
    label: "Computer & Laptop Repair",
    href: "/services?category=Laptop%20%26%20PC",
  },
];

function FooterLinkColumn({
  ariaLabel,
  links,
}: {
  ariaLabel: string;
  links: FooterLink[];
}) {
  return (
    <nav aria-label={ariaLabel} className="flex flex-col gap-4">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-[#e8eef6] dark:bg-[#070c16]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Brand />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Verified repair professionals for smartphones, laptops, and home
              appliances — upfront estimates, tracked repairs, and pay after the
              work is done.
            </p>
            <ul className="mt-2 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-200 hover:border-blue-200 hover:text-blue-600 dark:hover:border-blue-900/70 dark:hover:text-blue-400"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <FooterLinkColumn ariaLabel="Quick links" links={QUICK_LINKS} />

          {/* Customer support */}
          <FooterLinkColumn
            ariaLabel="Customer support"
            links={CUSTOMER_SUPPORT_LINKS}
          />

          {/* Services */}
          <FooterLinkColumn
            ariaLabel="Popular services"
            links={SERVICE_LINKS}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} FixMate. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true">•</span>
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Terms & Conditions
            </Link>
            <span aria-hidden="true">•</span>
            <span>Made with care by FixMate.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
