import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function IconLabel({
  icon: Icon,
  children,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Icon className={cn("size-4 shrink-0 text-muted-foreground", iconClassName)} aria-hidden />
      {children}
    </span>
  );
}

export function IconHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
