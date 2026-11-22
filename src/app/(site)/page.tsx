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
import { FeaturedServices } from "@/components/home/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularCategories } from "@/components/home/popular-categories";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { FaqSection } from "@/components/home/faq-section";
import type {
  CustomerReview,
  FaqItem,
  ServiceCategory,
  TrustPoint,
} from "@/types/type";

const categories: ServiceCategory[] = [
  {
    slug: "Smartphone",
    name: "Smartphone",
    description: "Screen, battery, charging port, and water-damage repairs.",
    icon: Smartphone,
  },
  {
    slug: "Laptop & PC",
    name: "Laptop & PC",
    description: "Hardware upgrades, keyboard fixes, and diagnostics.",
    icon: Laptop,
  },
  {
    slug: "AC",
    name: "AC",
    description: "Gas refills, servicing, installation, and cooling repairs.",
    icon: AirVent,
  },
  {
    slug: "Refrigerator",
    name: "Refrigerator",
    description: "Cooling issues, compressor repairs, and thermostat fixes.",
    icon: Refrigerator,
  },
  {
    slug: "TV",
    name: "TV",
    description: "Panel, backlight, sound, and setup support.",
    icon: Tv,
  },
  {
    slug: "Washing Machine",
    name: "Washing Machine",
    description: "Drum, motor, drainage, and control board repairs.",
    icon: WashingMachine,
  },
  {
    slug: "Electrical",
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

// Sample testimonials for the landing page. Replace with real completed
// bookings once reviews are stored in the database.
const customerReviews: CustomerReview[] = [
  {
    name: "Nusrat Jahan",
    service: "Phone screen repair",
    quote:
      "My screen cracked on a Friday and was replaced the same afternoon. The technician confirmed the price before starting, and it was exactly what I paid.",
    rating: 5,
    verified: true,
  },
  {
    name: "Tanvir Ahmed",
    service: "AC servicing",
    quote:
      "Booked a service before summer and the technician arrived on time, worked cleanly, and explained what needed attention. The cooling has been perfect since.",
    rating: 5,
    verified: true,
  },
  {
    name: "Farhana Islam",
    service: "Laptop keyboard repair",
    quote:
      "My keyboard stopped working mid-project. I found a technician nearby and could follow the whole repair from my dashboard without chasing anyone.",
    rating: 4,
    verified: true,
  },
];

const faqs: FaqItem[] = [
  {
    question: "How does FixMate work?",
    answer:
      "Start by browsing the approved services for your device and sending a request with the issue and your preferred time. Verified technicians nearby can then accept the job. From there you follow the repair from your dashboard, and you only pay once the work is completed.",
  },
  {
    question: "Which devices can be repaired?",
    answer:
      "FixMate currently covers smartphones, laptops and PCs, air conditioners, refrigerators, TVs, washing machines, and electrical work. Each category lists the specific services available — from screen and battery replacements to gas refills, compressor repairs, and wiring checks — with an upfront estimate so you know the expected cost before booking.",
  },
  {
    question: "Who are the technicians?",
    answer:
      "Every technician is background-checked before they can accept jobs, and only approved service listings appear on FixMate. That means the person assigned to your repair has been verified by the platform, rather than found through an open marketplace with no checks in place.",
  },
  {
    question: "Can I cancel a repair request?",
    answer:
      "Yes, while your request is still waiting for a technician to accept it, you can cancel it from your dashboard at no cost. Once a technician accepts the job they have reserved that time for you and the booking is already underway, so the request can no longer be cancelled.",
  },
  {
    question: "When and how do I pay?",
    answer:
      "Nothing is charged when you send a request. After the technician finishes the repair, the final amount is added to the booking and you receive a secure checkout link. Payment is completed online, and the booking is marked as paid as soon as the checkout goes through — so you settle the bill for work that has already been done.",
  },
  {
    question: "How do I track my repair?",
    answer:
      "Every booking has a status you can check at any time: requested while it waits for a technician, accepted once someone takes the job, in progress while the repair is happening, and completed when the work is finished. The status updates on your dashboard as the technician moves the job forward, so you never have to call to find out where things stand.",
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
        secondaryAction={{ label: "How It Works", href: "/#how-it-works" }}
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

      <FeaturedServices />

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

      <CustomerReviews
        eyebrow="Customer reviews"
        title="Happy customers, fixed devices"
        description="Real repairs, clear communication, and payments only after the work is done."
        reviews={customerReviews}
      />

      <FaqSection
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Everything you need to know before booking your first repair."
        items={faqs}
      />
    </div>
  );
}
