import { Search, Send, Wallet, Wrench } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";

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
    </div>
  );
}
