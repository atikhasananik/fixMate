import { MapPin, UserRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ServiceDetails } from "@/types/type";

type TechnicianCardProps = Pick<ServiceDetails, "technician">;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const name = technician.name || "Technician profile";

  return (
    <Card className="gap-0 rounded-2xl border border-border/70 shadow-sm">
      <CardHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-xl font-semibold">
          Your technician
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-14">
            {technician.image ? (
              <AvatarImage src={technician.image} alt={name} />
            ) : null}
            <AvatarFallback>
              {getInitials(name) || <UserRound className="size-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{name}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              {technician.serviceArea || "Location not specified"}
            </p>
          </div>
        </div>

        <Separator className="my-5" />

        <p className="text-sm leading-6 text-muted-foreground">
          {technician.bio ||
            "Technician profile information has not been provided yet."}
        </p>
      </CardContent>
    </Card>
  );
}
