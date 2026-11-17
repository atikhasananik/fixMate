import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <PagePlaceholder
      title="Our Services"
      description="Browse approved repair services for smartphones, laptops, home appliances, and more. Service listings are being prepared by our verified technicians."
    />
  );
}
