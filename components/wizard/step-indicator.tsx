"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WIZARD_STEPS, type WizardStepId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StepIndicator({ currentStep }: { currentStep: WizardStepId }) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = index < currentIndex;
          return (
            <div key={step.id} className="flex shrink-0 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  isActive && "bg-primary text-primary-foreground",
                  isDone && "bg-muted text-muted-foreground",
                  !isActive && !isDone && "bg-muted/50 text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              {index < WIZARD_STEPS.length - 1 && (
                <Separator
                  orientation="horizontal"
                  className={cn("w-6", isDone ? "bg-muted-foreground/40" : "bg-border")}
                />
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {WIZARD_STEPS[currentIndex]?.title}
        </h2>
        <p className="mt-1 text-muted-foreground">{WIZARD_STEPS[currentIndex]?.description}</p>
      </div>
    </div>
  );
}

export function WizardNav({
  onBack,
  onNext,
  nextLabel = "下一步",
  canNext = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  canNext?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t pt-6">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          ← 上一步
        </Button>
      ) : (
        <div />
      )}
      <Button type="button" onClick={onNext} disabled={!canNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
