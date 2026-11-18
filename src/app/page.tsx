import { HeroSection } from "@/components/home/hero-section";

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
    </div>
  );
}
