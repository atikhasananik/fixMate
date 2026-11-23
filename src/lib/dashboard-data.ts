import {
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  HardHat,
  Inbox,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type {
  Booking,
  BookingStatus,
  CustomerPayment,
  DashboardStat,
  IServiceData,
  PlatformUser,
  ServiceApprovalStatus,
  ServiceListing,
  ServiceMode,
} from "@/types/type";
import { formatMoney } from "@/lib/format";

export const SERVICE_CATEGORIES: readonly IServiceData["category"][] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export const SERVICE_MODE_LABELS: Record<ServiceMode, string> = {
  "home-visit": "Home visit",
  "shop-drop-off": "Shop drop-off",
};

export const SERVICE_MODE_OPTIONS: { value: ServiceMode; label: string }[] = [
  { value: "home-visit", label: SERVICE_MODE_LABELS["home-visit"] },
  { value: "shop-drop-off", label: SERVICE_MODE_LABELS["shop-drop-off"] },
];

export const BOOKING_STATUS_OPTIONS: {
  value: BookingStatus;
  label: string;
}[] = [
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export const APPROVAL_STATUS_OPTIONS: {
  value: ServiceApprovalStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

/**
 * Sample records so every dashboard route is usable before the MongoDB
 * collections and Express API exist. Replace with real queries later.
 */
export const SAMPLE_USERS: PlatformUser[] = [
  {
    id: "u-customer-1",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    role: "customer",
    joinedAt: "2026-08-14",
  },
  {
    id: "u-customer-2",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    role: "customer",
    joinedAt: "2026-09-02",
  },
  {
    id: "u-tech-1",
    name: "Rakib Hasan",
    email: "rakib.hasan@example.com",
    role: "technician",
    joinedAt: "2026-07-21",
  },
  {
    id: "u-tech-2",
    name: "Mehedi Alam",
    email: "mehedi.alam@example.com",
    role: "technician",
    joinedAt: "2026-06-30",
  },
  {
    id: "u-admin-1",
    name: "Sadia Karim",
    email: "sadia.karim@example.com",
    role: "admin",
    joinedAt: "2026-05-11",
  },
];

export const SAMPLE_SERVICES: ServiceListing[] = [
  {
    id: "svc-1",
    createdAt: new Date("2026-06-02"),
    title: "iPhone Screen Replacement",
    category: "Smartphone",
    description:
      "Original-quality screen replacement for iPhone 11 and newer, including a full touch and display test before handover.",
    basePrice: 89,
    estimatedDuration: "45–60 minutes",
    serviceMode: "shop-drop-off",
    serviceArea: "Dhanmondi, Dhaka",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    isAvailable: true,
    approvalStatus: "approved",
  },
  {
    id: "svc-2",
    createdAt: new Date("2026-06-18"),
    title: "Laptop Keyboard Repair",
    category: "Laptop & PC",
    description:
      "Keyboard replacement and key-level repair for common laptop models, with a typing test after reassembly.",
    basePrice: 45,
    estimatedDuration: "1–2 hours",
    serviceMode: "shop-drop-off",
    serviceArea: "Dhanmondi, Dhaka",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    isAvailable: true,
    approvalStatus: "pending",
  },
  {
    id: "svc-3",
    createdAt: new Date("2026-07-05"),
    title: "AC Servicing & Gas Refill",
    category: "AC",
    description:
      "Full indoor and outdoor unit cleaning, filter wash, and refrigerant top-up when pressure is below the recommended range.",
    basePrice: 60,
    estimatedDuration: "90 minutes",
    serviceMode: "home-visit",
    serviceArea: "Mirpur, Dhaka",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    isAvailable: true,
    approvalStatus: "approved",
  },
  {
    id: "svc-4",
    createdAt: new Date("2026-07-23"),
    title: "Refrigerator Compressor Check",
    category: "Refrigerator",
    description:
      "Compressor and relay diagnostics for fridges that stop cooling, including a written report of the fault found.",
    basePrice: 75,
    estimatedDuration: "2 hours",
    serviceMode: "home-visit",
    serviceArea: "Mirpur, Dhaka",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    isAvailable: false,
    approvalStatus: "rejected",
  },
  {
    id: "svc-5",
    createdAt: new Date("2026-08-09"),
    title: "Washing Machine Drain Fix",
    category: "Washing Machine",
    description:
      "Clears blocked drain pumps and hoses, checks the filter, and confirms a full spin-and-drain cycle before leaving.",
    basePrice: 40,
    estimatedDuration: "60 minutes",
    serviceMode: "home-visit",
    serviceArea: "Mohammadpur, Dhaka",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    isAvailable: false,
    approvalStatus: "approved",
  },
  {
    id: "svc-6",
    createdAt: new Date("2026-08-30"),
    title: "Smart TV Backlight Repair",
    category: "TV",
    description:
      "Backlight strip replacement for LED TVs with dim or dark panels, including a brightness uniformity check.",
    basePrice: 70,
    estimatedDuration: "2–3 hours",
    serviceMode: "shop-drop-off",
    serviceArea: "Mirpur, Dhaka",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    isAvailable: true,
    approvalStatus: "pending",
  },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "bk-1",
    serviceTitle: "iPhone Screen Replacement",
    customerId: "u-customer-1",
    customerName: "Nusrat Jahan",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    preferredDate: "2026-11-20",
    basePrice: 89,
    status: "requested",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-2",
    serviceTitle: "AC Servicing & Gas Refill",
    customerId: "u-customer-1",
    customerName: "Nusrat Jahan",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    preferredDate: "2026-11-19",
    basePrice: 60,
    finalAmount: 65,
    status: "in-progress",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-3",
    serviceTitle: "Laptop Keyboard Repair",
    customerId: "u-customer-2",
    customerName: "Tanvir Ahmed",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    preferredDate: "2026-11-12",
    basePrice: 45,
    finalAmount: 45,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "bk-4",
    serviceTitle: "Smart TV Backlight Repair",
    customerId: "u-customer-2",
    customerName: "Tanvir Ahmed",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    preferredDate: "2026-11-15",
    basePrice: 70,
    finalAmount: 70,
    status: "completed",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-5",
    serviceTitle: "Washing Machine Drain Fix",
    customerId: "u-customer-1",
    customerName: "Nusrat Jahan",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    preferredDate: "2026-11-10",
    basePrice: 40,
    status: "cancelled",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-6",
    serviceTitle: "Refrigerator Compressor Check",
    customerId: "u-customer-2",
    customerName: "Tanvir Ahmed",
    technicianId: "u-tech-2",
    technicianName: "Mehedi Alam",
    preferredDate: "2026-11-08",
    basePrice: 75,
    status: "rejected",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-7",
    serviceTitle: "Laptop Keyboard Repair",
    customerId: "u-customer-1",
    customerName: "Nusrat Jahan",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    preferredDate: "2026-11-22",
    basePrice: 45,
    status: "accepted",
    paymentStatus: "unpaid",
  },
  {
    id: "bk-8",
    serviceTitle: "iPhone Screen Replacement",
    customerId: "u-customer-2",
    customerName: "Tanvir Ahmed",
    technicianId: "u-tech-1",
    technicianName: "Rakib Hasan",
    preferredDate: "2026-11-05",
    basePrice: 89,
    finalAmount: 95,
    status: "completed",
    paymentStatus: "paid",
  },
];

export function getCustomerStats(
  bookings: Pick<Booking, "status">[],
  payments: Pick<CustomerPayment, "amount" | "status">[],
): DashboardStat[] {
  const paidPayments = payments.filter(
    (payment) => payment.status === "paid",
  );
  const totalPaid = paidPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return [
    {
      label: "Total bookings",
      value: bookings.length,
      icon: ClipboardList,
      hint: "Every repair request you have sent",
    },
    {
      label: "Active bookings",
      value: bookings.filter(
        (booking) =>
          booking.status === "accepted" || booking.status === "in-progress",
      ).length,
      icon: Wrench,
      hint: "Accepted or currently being repaired",
    },
    {
      label: "Completed bookings",
      value: bookings.filter((booking) => booking.status === "completed").length,
      icon: CalendarCheck,
      hint: "Finished repairs, paid or awaiting payment",
    },
    {
      label: "Total payments",
      value: paidPayments.length,
      icon: CreditCard,
      hint:
        paidPayments.length > 0
          ? `${formatMoney(totalPaid)} paid in total`
          : "No completed payments yet",
    },
  ];
}

export function getTechnicianStats(
  services: ServiceListing[],
  bookings: Booking[],
): DashboardStat[] {
  return [
    {
      label: "Total services",
      value: services.length,
      icon: Wrench,
      hint: "Listings you have created",
    },
    {
      label: "Approved services",
      value: services.filter((service) => service.approvalStatus === "approved")
        .length,
      icon: BadgeCheck,
      hint: "Visible on the public services page",
    },
    {
      label: "Pending requests",
      value: bookings.filter((booking) => booking.status === "requested")
        .length,
      icon: Inbox,
      hint: "Repair requests waiting for a technician",
    },
  ];
}

export function getAdminStats(
  users: PlatformUser[],
  services: ServiceListing[],
): DashboardStat[] {
  return [
    {
      label: "Total users",
      value: users.length,
      icon: ShieldCheck,
      hint: "Customers, technicians, and admins",
    },
    {
      label: "Total technicians",
      value: users.filter((user) => user.role === "technician").length,
      icon: HardHat,
      hint: "Accounts that can accept repair jobs",
    },
    {
      label: "Pending services",
      value: services.filter((service) => service.approvalStatus === "pending")
        .length,
      icon: ClipboardList,
      hint: "Listings waiting for approval",
    },
  ];
}
