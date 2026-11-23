import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Compass,
  HeartHandshake,
  Info,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HowItWorksStep, TrustPoint } from "@/types/type";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "FixMate connects customers with verified technicians for reliable home and electronic repairs — clear pricing, tracked bookings, and pay after the work is done.",
};

const highlights = [
  "Verified technicians",
  "Upfront estimates",
  "Pay after service",
];

const benefits: TrustPoint[] = [
  {
    icon: ShieldCheck,
    title: "Trusted Technicians",
    description:
      "Every technician is verified before they can accept jobs on the platform.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking Process",
    description:
      "Send a repair request in a few steps and pick the time that works for you.",
  },
  {
    icon: BadgeCheck,
    title: "Reliable Services",
    description:
      "Only approved service listings appear on FixMate, with clear scopes of work.",
  },
  {
    icon: ReceiptText,
    title: "Transparent Payments",
    description:
      "See upfront estimates and pay securely only after the repair is completed.",
  },
  {
    icon: Zap,
    title: "Convenient Experience",
    description:
      "Home visits or shop drop-off — choose the service mode that suits your day.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-Focused Support",
    description:
      "Track every booking from your dashboard and cancel while a request is pending.",
  },
];

const steps: HowItWorksStep[] = [
  {
    icon: Search,
    title: "Browse Services",
    description:
      "Find the repair service you need across phones, laptops, and home appliances.",
  },
  {
    icon: Send,
    title: "Book a Technician",
    description:
      "Submit your booking request with the issue details and your preferred time.",
  },
  {
    icon: Wrench,
    title: "Get Your Service",
    description:
      "Connect with a verified technician, get your issue resolved, and pay after completion.",
  },
];

// Shared card styling: quiet border, soft shadow, hover feedback without lift.
const cardClass =
  "h-full border border-border/70 ring-0 shadow-sm transition-colors duration-300 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70";

const iconTileClass =
  "flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero — text-first, no illustration */}
      <section
        aria-labelledby="about-hero-heading"
        className="border-b border-border/60 bg-muted/40"
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
          <Badge
            variant="outline"
            className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
          >
            <Info className="size-3" aria-hidden="true" />
            Our story
          </Badge>

          <h1
            id="about-hero-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            About{" "}
            <span className="text-blue-600 dark:text-blue-400">FixMate</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            FixMate connects customers with verified technicians for reliable
            home and electronic repairs — with clear pricing, tracked bookings,
            and payment only after the work is done.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
              className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
            >
              Browse Services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/#how-it-works" />}
              className="h-11 rounded-xl px-5"
            >
              How It Works
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-sm text-muted-foreground">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Check className="size-2.5" aria-hidden="true" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who we are — editorial, no card */}
      <section aria-labelledby="who-we-are-heading" className="bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <Badge
            variant="outline"
            className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
          >
            <Users className="size-3" aria-hidden="true" />
            Who we are
          </Badge>

          <h2
            id="who-we-are-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Repair help, without the hassle
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              FixMate is an on-demand repair platform for smartphones, laptops,
              and home appliances. Instead of chasing recommendations or
              guessing who to trust, you browse approved services, compare
              upfront estimates, and book the repair that fits your schedule.
            </p>
            <p>
              Every technician on the platform is verified before they can
              accept jobs, and every booking is tracked from request to
              completion — so you always know who is handling your repair and
              where things stand.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section
        aria-labelledby="mission-vision-heading"
        className="border-y border-border/60 bg-muted/40"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="mission-vision-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              What drives us
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              A simple goal, and a clear picture of where we are headed.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className={iconTileClass}>
                    <Target className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle>Our Mission</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Make repair and maintenance services accessible, reliable,
                  and convenient — so getting something fixed is as simple as
                  booking it.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Compass className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle>Our Vision</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Build a trusted platform that connects customers and skilled
                  technicians through technology, raising the standard for
                  everyday repair services.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why choose FixMate */}
      <section aria-labelledby="why-fixmate-heading" className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="h-6 gap-1.5 border-blue-200 bg-blue-50 px-3 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <ShieldCheck className="size-3" aria-hidden="true" />
              Why choose FixMate
            </Badge>

            <h2
              id="why-fixmate-heading"
              className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Built around trust and convenience
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Verified people, clear pricing, and a booking process that stays
              out of your way.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <li key={benefit.title}>
                  <Card className={cardClass}>
                    <CardHeader>
                      <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <CardTitle className="mt-1">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How it works — numbered steps with a connecting line */}
      <section
        aria-labelledby="about-steps-heading"
        className="border-y border-border/60 bg-muted/40"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="about-steps-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              How it works
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              From browsing to a finished repair in three simple steps.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-16">
            {/* Subtle connector behind the step markers on desktop. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-16 top-6 hidden h-px bg-border md:block"
            />

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border/70 bg-card text-blue-600 shadow-sm dark:text-blue-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-4 font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                  >
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section aria-labelledby="about-cta-heading" className="bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="rounded-2xl border border-blue-200/70 bg-blue-50 px-6 py-12 text-center shadow-sm sm:px-12 dark:border-blue-900/60 dark:bg-blue-950/40">
            <h2
              id="about-cta-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Ready to get it fixed?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse approved repair services and book a verified technician in
              minutes — pay only after the work is done.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/services" />}
                className="h-11 rounded-xl bg-blue-600 px-5 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400"
              >
                Browse Services
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              {/* No dedicated contact route yet; the FAQ anchor is the
                  platform's existing support entry point (see footer). */}
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={<Link href="/#faq" />}
                className="h-11 rounded-xl px-5"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}