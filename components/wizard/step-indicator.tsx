"use client";

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
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  isActive && "bg-stone-900 text-white",
                  isDone && "bg-stone-200 text-stone-700",
                  !isActive && !isDone && "bg-stone-100 text-stone-400"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  isActive ? "font-medium text-stone-900" : "text-stone-400"
                )}
              >
                {step.title}
              </span>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={cn("h-px w-6", isDone ? "bg-stone-400" : "bg-stone-200")} />
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-stone-900">
          {WIZARD_STEPS[currentIndex]?.title}
        </h2>
        <p className="mt-1 text-stone-500">{WIZARD_STEPS[currentIndex]?.description}</p>
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
    <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          ← 上一步
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}
