"use client";

import Link from "next/link";
import { HouseholdStep } from "@/components/wizard/household-step";
import { InventoryStep } from "@/components/wizard/inventory-step";
import { LifestyleStep } from "@/components/wizard/lifestyle-step";
import { NewHomeStep } from "@/components/wizard/new-home-step";
import { OldHomeStep } from "@/components/wizard/old-home-step";
import { ResultStep } from "@/components/wizard/result-step";
import { StepIndicator } from "@/components/wizard/step-indicator";
import { Button } from "@/components/ui/button";
import { IconLabel } from "@/components/ui/icon-text";
import { AssessmentProvider, useAssessment } from "@/lib/store";
import { ArrowLeft, Package } from "lucide-react";

function WizardContent() {
  const { step } = useAssessment();

  const steps = {
    household: <HouseholdStep />,
    oldHome: <OldHomeStep />,
    newHome: <NewHomeStep />,
    lifestyle: <LifestyleStep />,
    inventory: <InventoryStep />,
    result: <ResultStep />,
  };

  return (
    <>
      <header className="border-b bg-background/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" aria-hidden />
              返回首页
            </Button>
          </Link>
          <IconLabel icon={Package} className="text-sm font-medium text-muted-foreground">
            收纳评估
          </IconLabel>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <StepIndicator currentStep={step} />
        {steps[step]}
      </div>
    </>
  );
}

export default function AssessPage() {
  return (
    <AssessmentProvider>
      <WizardContent />
    </AssessmentProvider>
  );
}
