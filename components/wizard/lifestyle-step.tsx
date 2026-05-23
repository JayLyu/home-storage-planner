"use client";

import { SliderField } from "@/components/ui/form";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";

export function LifestyleStep() {
  const { lifestyle, setLifestyle, setStep } = useAssessment();

  return (
    <div>
      <p className="mb-6 text-sm text-stone-500">
        请根据你家的实际生活方式，为以下维度打分（1 = 低，5 = 高）。
      </p>

      <SliderField label="囤货程度" value={lifestyle.stockpilingLevel} onChange={(v) => setLifestyle({ stockpilingLevel: v })} />
      <SliderField label="极简程度" value={lifestyle.minimalismLevel} onChange={(v) => setLifestyle({ minimalismLevel: v })} />
      <SliderField label="做饭频率" value={lifestyle.cookingFrequency} onChange={(v) => setLifestyle({ cookingFrequency: v })} />
      <SliderField label="旅行频率" value={lifestyle.travelFrequency} onChange={(v) => setLifestyle({ travelFrequency: v })} />
      <SliderField label="数码设备密度" value={lifestyle.digitalDeviceLevel} onChange={(v) => setLifestyle({ digitalDeviceLevel: v })} />
      <SliderField label="兴趣爱好占用空间" value={lifestyle.hobbyStorageLevel} onChange={(v) => setLifestyle({ hobbyStorageLevel: v })} />
      <SliderField label="换季衣物压力" value={lifestyle.seasonalClothingLevel} onChange={(v) => setLifestyle({ seasonalClothingLevel: v })} />

      <WizardNav onBack={() => setStep("newHome")} onNext={() => setStep("inventory")} />
    </div>
  );
}
