import {
  AirVent,
  BadgeCheck,
  Clock,
  Laptop,
  Plug,
  ReceiptText,
  Refrigerator,
  Search,
  Send,
  Smartphone,
  Tv,
  Wallet,
  WashingMachine,
  Wrench,
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularCategories } from "@/components/home/popular-categories";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import type { ServiceCategory, TrustPoint } from "@/types/type";

const categories: ServiceCategory[] = [
  {
    slug: "smartphone",
    name: "Smartphone",
    description: "Screen, battery, charging port, and water-damage repairs.",
    icon: Smartphone,
  },
  {
    slug: "laptop-pc",
    name: "Laptop & PC",
    description: "Hardware upgrades, keyboard fixes, and diagnostics.",
    icon: Laptop,
  },
  {
    slug: "ac",
    name: "AC",
    description: "Gas refills, servicing, installation, and cooling repairs.",
    icon: AirVent,
  },
  {
    slug: "refrigerator",
    name: "Refrigerator",
    description: "Cooling issues, compressor repairs, and thermostat fixes.",
    icon: Refrigerator,
  },
  {
    slug: "tv",
    name: "TV",
    description: "Panel, backlight, sound, and setup support.",
    icon: Tv,
  },
  {
    slug: "washing-machine",
    name: "Washing Machine",
    description: "Drum, motor, drainage, and control board repairs.",
    icon: WashingMachine,
  },
  {
    slug: "electrical",
    name: "Electrical",
    description: "Wiring, switches, breakers, lighting, and safety checks.",
    icon: Plug,
  },
];

const trustPoints: TrustPoint[] = [
  {
    icon: BadgeCheck,
    title: "Verified technicians",
    description:
      "Every technician is background-checked before they can accept jobs.",
  },
  {
    icon: Wallet,
    title: "Pay after service",
    description:
      "You only pay once the repair is completed to your satisfaction.",
  },
  {
    icon: ReceiptText,
    title: "Upfront estimates",
    description: "See clear pricing before you approve any work.",
  },
  {
    icon: Clock,
    title: "Real-time tracking",
    description: "Follow your job from request to completion.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection
        eyebrow="Verified repair professionals"
        title={
          <>
            Broken device?{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Get it fixed
            </span>{" "}
            by verified technicians.
          </>
        }
        description="Book trusted professionals for smartphones, laptops, and home appliances. Transparent pricing, real-time tracking, and pay only after the repair is done."
        primaryAction={{ label: "Browse Services", href: "/services" }}
        secondaryAction={{ label: "How It Works", href: "/about" }}
        image={{
          src: "/hero-technician.svg",
          alt: "Illustration of a smartphone being repaired with a screwdriver and a gear",
        }}
        highlights={[
          "Verified technicians",
          "Upfront estimates",
          "Pay after service",
        ]}
      />

      <HowItWorks
        eyebrow="How it works"
        title="From request to repair in four simple steps"
        description="Tell us what needs fixing, pick a verified technician, and pay only after the job is done — no hidden fees, no guesswork."
        steps={[
          {
            icon: Search,
            title: "Find a Service",
            description:
              "Browse approved repair services for phones, laptops, and home appliances, with clear upfront estimates.",
          },
          {
            icon: Send,
            title: "Send a Request",
            description:
              "Share your device details and preferred time so verified technicians nearby can accept the job.",
          },
          {
            icon: Wrench,
            title: "Technician Fixes It",
            description:
              "Track the repair as your technician diagnoses the issue and completes the work.",
          },
          {
            icon: Wallet,
            title: "Pay After Completion",
            description:
              "Pay securely only once you're happy with the finished repair.",
          },
        ]}
      />

      <PopularCategories
        eyebrow="Popular categories"
        title="What can we fix for you?"
        description="Pick the device or system that needs help and jump straight into the right services."
        categories={categories}
      />

      <WhyChooseUs
        eyebrow="Why choose FixMate"
        title="Repairs you can actually trust"
        description="Verified people, clear pricing, and payment only when the job is done."
        points={trustPoints}
      />
    </div>
  );
}
