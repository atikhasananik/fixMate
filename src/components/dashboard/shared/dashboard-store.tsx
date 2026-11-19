"use client";

import { createContext, useContext, useState } from "react";
import {
  SAMPLE_BOOKINGS,
  SAMPLE_SERVICES,
  SAMPLE_USERS,
} from "@/lib/dashboard-data";
import { SERVICE_MODE_VALUE_BY_LABEL } from "@/lib/service-payload";
import type {
  Booking,
  DashboardStoreProviderProps,
  DashboardStoreValue,
  IServiceData,
  PlatformUser,
  ServiceListing,
} from "@/types/type";

const DashboardStoreContext = createContext<DashboardStoreValue | null>(null);

function createUsers(viewer: DashboardStoreProviderProps["viewer"]): PlatformUser[] {
  const viewerRecord: PlatformUser = {
    id: viewer.id,
    name: viewer.name,
    email: viewer.email,
    image: viewer.image ?? undefined,
    role: viewer.role,
    joinedAt: viewer.joinedAt,
  };

  const known = SAMPLE_USERS.some(
    (user) => user.id === viewer.id || user.email === viewer.email
  );

  return known ? SAMPLE_USERS : [viewerRecord, ...SAMPLE_USERS];
}

/**
 * In-memory dashboard data until MongoDB collections and the Express API are
 * wired up. Mutations work across dashboard routes during the session and
 * reset on a full reload.
 */
export function DashboardStoreProvider({
  viewer,
  children,
}: DashboardStoreProviderProps) {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [services, setServices] = useState<ServiceListing[]>(SAMPLE_SERVICES);
  const [users, setUsers] = useState<PlatformUser[]>(() =>
    createUsers(viewer)
  );

  function cancelBooking(bookingId: string) {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === bookingId && booking.status === "requested"
          ? { ...booking, status: "cancelled" }
          : booking
      )
    );
  }

  function addService(data: IServiceData) {
    const service: ServiceListing = {
      id: `svc-${crypto.randomUUID()}`,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      basePrice: data.basePrice,
      estimatedDuration: data.estimatedDuration.trim(),
      serviceMode: SERVICE_MODE_VALUE_BY_LABEL[data.serviceMode],
      serviceArea: data.serviceArea.trim(),
      image: data.image || undefined,
      technicianId: viewer.id,
      technicianName: data.technicianName,
      isAvailable: data.isAvailable,
      approvalStatus: data.approvalStatus,
      createdAt: data.createdAt,
    };

    setServices((previous) => [service, ...previous]);
  }

  function updateService(
    serviceId: string,
    values: Parameters<DashboardStoreValue["updateService"]>[1]
  ) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              title: values.title.trim(),
              category: values.category,
              description: values.description.trim(),
              basePrice: Number(values.basePrice),
              estimatedDuration: values.estimatedDuration.trim(),
              serviceMode: values.serviceMode,
              serviceArea: values.serviceArea.trim(),
              image: values.image || undefined,
              // Any edit needs to be reviewed again.
              approvalStatus: "pending",
            }
          : service
      )
    );
  }

  function deleteService(serviceId: string) {
    setServices((previous) =>
      previous.filter((service) => service.id !== serviceId)
    );
  }

  function setServiceAvailability(serviceId: string, isAvailable: boolean) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === serviceId ? { ...service, isAvailable } : service
      )
    );
  }

  function setServiceApprovalStatus(
    serviceId: string,
    status: Parameters<DashboardStoreValue["setServiceApprovalStatus"]>[1]
  ) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === serviceId
          ? { ...service, approvalStatus: status }
          : service
      )
    );
  }

  function setUserRole(
    userId: string,
    role: Parameters<DashboardStoreValue["setUserRole"]>[1]
  ) {
    // The admin can never change their own role, even if called directly.
    if (userId === viewer.id) {
      return;
    }

    setUsers((previous) =>
      previous.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    );
  }

  const value: DashboardStoreValue = {
    viewer,
    bookings,
    services,
    users,
    cancelBooking,
    addService,
    updateService,
    deleteService,
    setServiceAvailability,
    setServiceApprovalStatus,
    setUserRole,
  };

  return (
    <DashboardStoreContext.Provider value={value}>
      {children}
    </DashboardStoreContext.Provider>
  );
}

export function useDashboardStore() {
  const context = useContext(DashboardStoreContext);

  if (!context) {
    throw new Error(
      "useDashboardStore must be used inside DashboardStoreProvider."
    );
  }

  return context;
}
