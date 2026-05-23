"use client";

import { HouseholdStep } from "@/components/wizard/household-step";
import { InventoryStep } from "@/components/wizard/inventory-step";
import { LifestyleStep } from "@/components/wizard/lifestyle-step";
import { NewHomeStep } from "@/components/wizard/new-home-step";
import { OldHomeStep } from "@/components/wizard/old-home-step";
import { ResultStep } from "@/components/wizard/result-step";
import { StepIndicator } from "@/components/wizard/step-indicator";
import { AssessmentProvider, useAssessment } from "@/lib/store";

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StepIndicator currentStep={step} />
      {steps[step]}
    </div>
  );
}

export default function AssessPage() {
  return (
    <AssessmentProvider>
      <WizardContent />
    </AssessmentProvider>
  );
}
