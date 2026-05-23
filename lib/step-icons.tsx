import {
  Building2,
  Check,
  ClipboardList,
  FileBarChart,
  Home,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { WizardStepId } from "@/lib/types";

export const STEP_ICONS: Record<WizardStepId, LucideIcon> = {
  household: Users,
  oldHome: Home,
  newHome: Building2,
  lifestyle: Sparkles,
  inventory: ClipboardList,
  result: FileBarChart,
};

export function StepIcon({
  stepId,
  className,
}: {
  stepId: WizardStepId;
  className?: string;
}) {
  const Icon = STEP_ICONS[stepId];
  return <Icon className={className} aria-hidden />;
}

export { Check as StepDoneIcon };
