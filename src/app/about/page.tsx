import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="How FixMate Works"
      description="Request a repair, get matched with a verified technician, track every step of the job, and pay only after the work is complete."
    />
  );
}
