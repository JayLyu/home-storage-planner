"use client";

import { Button } from "@/components/ui/button";
import { IconHeading } from "@/components/ui/icon-text";
import { STEP_ICONS, StepDoneIcon } from "@/lib/step-icons";
import { WIZARD_STEPS, type WizardStepId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

function StepBadge({
  stepId,
  isActive,
  isDone,
  index,
  title,
}: {
  stepId: WizardStepId;
  isActive: boolean;
  isDone: boolean;
  index: number;
  title: string;
}) {
  const Icon = STEP_ICONS[stepId];

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        isActive && "bg-primary text-primary-foreground",
        isDone && "bg-muted text-muted-foreground",
        !isActive && !isDone && "bg-muted/50 text-muted-foreground"
      )}
    >
      {isDone ? <StepDoneIcon className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
      <span className="sr-only">
        {index + 1}. {title}
        {isDone ? "（已完成）" : isActive ? "（当前）" : ""}
      </span>
    </div>
  );
}

export function StepIndicator({ currentStep }: { currentStep: WizardStepId }) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
  const current = WIZARD_STEPS[currentIndex];
  const CurrentIcon = current ? STEP_ICONS[current.id] : STEP_ICONS.household;

  return (
    <div className="mb-8">
      {/* 窄屏：纵向步骤列表 */}
      <ol className="space-y-0 md:hidden" aria-label="评估步骤">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = index < currentIndex;
          const isLast = index === WIZARD_STEPS.length - 1;

          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <StepBadge
                  stepId={step.id}
                  isActive={isActive}
                  isDone={isDone}
                  index={index}
                  title={step.title}
                />
                {!isLast && <div className="my-1 w-px flex-1 min-h-4 bg-border" aria-hidden />}
              </div>
              <p
                className={cn(
                  "pb-4 pt-1.5 text-sm",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
            </li>
          );
        })}
      </ol>

      {/* 宽屏：横向仅图标，Chevron 连接 */}
      <ol
        className="hidden md:flex md:flex-nowrap md:items-center md:gap-1 md:overflow-x-auto md:pb-2"
        aria-label="评估步骤"
      >
        {WIZARD_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = index < currentIndex;

          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              className="flex shrink-0 items-center gap-1"
            >
              <StepBadge
                stepId={step.id}
                isActive={isActive}
                isDone={isDone}
                index={index}
                title={step.title}
              />
              {index < WIZARD_STEPS.length - 1 && (
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0",
                    isDone ? "text-muted-foreground" : "text-border"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      {current ? (
        <>
          <p className="mt-4 text-sm text-muted-foreground md:hidden">{current.description}</p>
          <div className="mt-6 hidden md:block">
            <IconHeading
              icon={CurrentIcon}
              title={current.title}
              description={current.description}
            />
          </div>
        </>
      ) : null}
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
  const isReport = nextLabel === "生成报告";

  return (
    <div className="mt-8 flex items-center justify-between border-t pt-6">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="size-4" aria-hidden />
          上一步
        </Button>
      ) : (
        <div />
      )}
      <Button type="button" onClick={onNext} disabled={!canNext}>
        {isReport ? <FileText className="size-4" aria-hidden /> : null}
        {nextLabel}
        {!isReport ? <ChevronRight className="size-4" aria-hidden /> : null}
      </Button>
    </div>
  );
}
