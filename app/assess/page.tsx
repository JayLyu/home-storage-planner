"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { HouseholdStep } from "@/components/wizard/household-step";
import { InventoryStep } from "@/components/wizard/inventory-step";
import { LifestyleStep } from "@/components/wizard/lifestyle-step";
import { NewHomeStep } from "@/components/wizard/new-home-step";
import { OldHomeStep } from "@/components/wizard/old-home-step";
import { ResultStep } from "@/components/wizard/result-step";
import { StepIndicator } from "@/components/wizard/step-indicator";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconHeading } from "@/components/ui/icon-text";
import { AssessmentProvider, useAssessment } from "@/lib/store";
import { STEP_ICONS } from "@/lib/step-icons";
import { WIZARD_STEPS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";

/** 评估向导统一内容宽度，避免各步骤切换时布局跳动 */
const ASSESS_LAYOUT = "mx-auto w-full max-w-3xl min-w-0 px-4";

function WizardContent() {
  const { step, setInventoryMode } = useAssessment();
  const searchParams = useSearchParams();
  const isResult = step === "result";
  const currentMeta = WIZARD_STEPS.find((item) => item.id === step);

  useEffect(() => {
    if (searchParams.get("mode") === "quick") {
      setInventoryMode("quick");
    }
  }, [searchParams, setInventoryMode]);

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
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className={cn(ASSESS_LAYOUT, "flex items-center justify-between py-3")}>
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden />
            返回首页
          </Link>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Package className="size-4" aria-hidden />
            收纳评估
          </span>
        </div>
      </header>
      <main className={cn(ASSESS_LAYOUT, "py-8 sm:py-10")}>
        {isResult && currentMeta ? (
          <div className="mb-8">
            <IconHeading
              icon={STEP_ICONS.result}
              title={currentMeta.title}
              description="基于你的输入生成的收纳容量、柜体建议与风险提示"
            />
          </div>
        ) : (
          <StepIndicator currentStep={step} />
        )}
        <div className="w-full min-w-0">
          {isResult ? (
            steps[step]
          ) : (
            <Card className="w-full">
              <CardContent className="pt-6">{steps[step]}</CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

export default function AssessPage() {
  return (
    <AssessmentProvider>
      <Suspense fallback={<div className={cn(ASSESS_LAYOUT, "py-10 text-muted-foreground")}>加载中…</div>}>
        <WizardContent />
      </Suspense>
    </AssessmentProvider>
  );
}
