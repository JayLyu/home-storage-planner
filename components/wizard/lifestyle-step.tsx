"use client";

import { SliderField } from "@/components/form-fields";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";

export function LifestyleStep() {
  const { lifestyle, setLifestyle, setStep } = useAssessment();

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        请根据你家的实际生活方式，为以下维度打分（1 = 低，5 = 高）。
      </p>

      <SliderField
        label="囤货程度"
        value={lifestyle.stockpilingLevel}
        onChange={(stockpilingLevel) => setLifestyle({ stockpilingLevel })}
      />
      <SliderField
        label="极简程度"
        value={lifestyle.minimalismLevel}
        onChange={(minimalismLevel) => setLifestyle({ minimalismLevel })}
      />
      <SliderField
        label="做饭频率"
        value={lifestyle.cookingFrequency}
        onChange={(cookingFrequency) => setLifestyle({ cookingFrequency })}
      />
      <SliderField
        label="旅行频率"
        value={lifestyle.travelFrequency}
        onChange={(travelFrequency) => setLifestyle({ travelFrequency })}
      />
      <SliderField
        label="数码设备密度"
        value={lifestyle.digitalDeviceLevel}
        onChange={(digitalDeviceLevel) => setLifestyle({ digitalDeviceLevel })}
      />
      <SliderField
        label="兴趣爱好占用空间"
        value={lifestyle.hobbyStorageLevel}
        onChange={(hobbyStorageLevel) => setLifestyle({ hobbyStorageLevel })}
      />
      <SliderField
        label="换季衣物压力"
        value={lifestyle.seasonalClothingLevel}
        onChange={(seasonalClothingLevel) => setLifestyle({ seasonalClothingLevel })}
      />

      <WizardNav onBack={() => setStep("newHome")} onNext={() => setStep("inventory")} />
    </div>
  );
}
