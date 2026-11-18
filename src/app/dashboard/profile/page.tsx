import type { Metadata } from "next";
import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  getDashboardSession,
  toDashboardViewer,
} from "@/lib/dashboard-session";
import { formatDate } from "@/lib/format";
import { ROLE_BADGE_CLASSES, ROLE_LABELS, getInitials } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function DashboardProfilePage() {
  const viewer = toDashboardViewer(await getDashboardSession());

  const details = [
    { icon: Mail, label: "Email", value: viewer.email },
    { icon: ShieldCheck, label: "Role", value: ROLE_LABELS[viewer.role] },
    {
      icon: CalendarDays,
      label: "Member since",
      value: formatDate(viewer.joinedAt),
    },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-3xl">
        <PageHeader
          title="Profile"
          description="The account details tied to your FixMate session."
        />
      </div>

      <Card className="mx-auto w-full max-w-3xl rounded-2xl border border-border/70 ring-0 shadow-sm [--card-spacing:1.5rem]">
        <CardContent className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar size="lg">
              {viewer.image ? (
                <AvatarImage
                  src={viewer.image}
                  alt={`${viewer.name}'s avatar`}
                />
              ) : null}
              <AvatarFallback>{getInitials(viewer.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground">
                {viewer.name}
              </p>
              <p className="text-sm break-all text-muted-foreground">
                {viewer.email}
              </p>
            </div>

            <Badge
              variant="outline"
              className={`h-6 px-3 ${ROLE_BADGE_CLASSES[viewer.role]}`}
            >
              {ROLE_LABELS[viewer.role]}
            </Badge>
          </div>

          <dl className="mt-8 grid w-full gap-4 border-t border-border/60 pt-6 sm:grid-cols-2">
            {details.map((detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-muted-foreground dark:bg-slate-900">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">
                      {detail.label}
                    </dt>
                    <dd className="text-sm font-medium break-all text-foreground">
                      {detail.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>

          <p className="mt-8 w-full rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            Photo, phone number, service area, and bio editing will be connected
            once the profile API is available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
