import { LucideIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";


export type HowItWorksStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

function StepCard({ step, index }: { step: HowItWorksStep; index: number }) {
  const Icon = step.icon;

  return (
    <Card className="h-full border border-border/70 ring-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:hover:border-blue-900/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-sm font-semibold text-muted-foreground"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <CardTitle className="mt-1">{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}


export default StepCard