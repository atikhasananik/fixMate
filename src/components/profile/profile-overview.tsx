import {
  CalendarDays,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROLE_BADGE_CLASSES, ROLE_LABELS, getInitials } from "@/lib/nav";
import { formatDate } from "@/lib/format";
import type { DashboardViewer } from "@/types/type";

type ProfileOverviewProps = {
  viewer: DashboardViewer;
};

export function ProfileOverview({ viewer }: ProfileOverviewProps) {
  const details = [
    {
      icon: Phone,
      label: "Phone",
      value: viewer.phone == null ? "Not added yet" : String(viewer.phone),
    },
    {
      icon: MapPin,
      label: "Area / Location",
      value: viewer.area || "Not added yet",
    },
    {
      icon: CalendarDays,
      label: "Member since",
      value: formatDate(viewer.joinedAt),
    },
  ];

  return (
    <Card className="w-full rounded-2xl border border-border/70 shadow-sm">
      <CardHeader className="pb-5">
        <CardTitle className="text-lg">Profile overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar size="lg" className="size-20">
            {viewer.image ? (
              <AvatarImage src={viewer.image} alt={`${viewer.name}'s avatar`} />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(viewer.name) || <UserRound className="size-6" />}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-semibold tracking-tight text-foreground">
              {viewer.name}
            </h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {viewer.email}
            </p>
            <Badge
              variant="outline"
              className={`mt-3 h-6 px-3 ${ROLE_BADGE_CLASSES[viewer.role]}`}
            >
              {ROLE_LABELS[viewer.role]}
            </Badge>
          </div>
        </div>

        <Separator />

        <dl className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-foreground">
                    {detail.value}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-medium text-muted-foreground">Bio</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
            {viewer.bio || "Add a short bio to tell others about yourself."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
