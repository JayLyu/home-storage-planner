"use client";

import {
  FormField,
  Input,
  MultiSelectField,
  SelectField,
  SliderField,
} from "@/components/form-fields";
import { Label } from "@/components/ui/label";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { LayoutType, StorageSatisfaction } from "@/lib/types";

const OVERFLOW_OPTIONS = ["卧室", "厨房", "阳台", "玄关", "客厅", "储物间"];
const TEMP_OPTIONS = ["沙发旁", "床底", "餐桌", "地面", "走廊"];
const CABINET_OPTIONS = ["衣柜", "鞋柜", "餐边柜", "厨房高柜", "家政柜", "阳台柜", "书柜"];

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: "一居", label: "一居" },
  { value: "两居", label: "两居" },
  { value: "三居", label: "三居" },
  { value: "四居及以上", label: "四居及以上" },
];

export function OldHomeStep() {
  const { oldHome, setOldHome, setStep } = useAssessment();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <Label>旧房面积 (㎡)</Label>
          <Input
            type="number"
            min={20}
            value={oldHome.oldHomeArea}
            onChange={(e) => setOldHome({ oldHomeArea: Number(e.target.value) })}
          />
        </FormField>
        <SelectField<LayoutType>
          label="旧房户型"
          value={oldHome.oldHomeLayout}
          onChange={(oldHomeLayout) => setOldHome({ oldHomeLayout })}
          options={LAYOUT_OPTIONS}
        />
      </div>

      <SelectField<StorageSatisfaction>
        label="当前收纳满意度"
        value={oldHome.oldStorageSatisfaction}
        onChange={(oldStorageSatisfaction) => setOldHome({ oldStorageSatisfaction })}
        options={[
          { value: "充足", label: "充足" },
          { value: "刚好", label: "刚好" },
          { value: "不足", label: "不足" },
          { value: "严重不足", label: "严重不足" },
        ]}
      />

      <MultiSelectField
        label="爆仓区域"
        options={OVERFLOW_OPTIONS}
        selected={oldHome.overflowZones}
        onChange={(overflowZones) => setOldHome({ overflowZones })}
      />

      <MultiSelectField
        label="临时堆放区域"
        options={TEMP_OPTIONS}
        selected={oldHome.temporaryStorageZones}
        onChange={(temporaryStorageZones) => setOldHome({ temporaryStorageZones })}
      />

      <MultiSelectField
        label="现有柜体类型"
        options={CABINET_OPTIONS}
        selected={oldHome.currentCabinetTypes}
        onChange={(currentCabinetTypes) => setOldHome({ currentCabinetTypes })}
      />

      <FormField>
        <Label>现有柜体总长度 (m)</Label>
        <Input
          type="number"
          min={0}
          step={0.5}
          value={oldHome.currentCabinetLength}
          onChange={(e) => setOldHome({ currentCabinetLength: Number(e.target.value) })}
        />
      </FormField>

      <SliderField
        label="断舍离意愿"
        value={oldHome.declutterIntent}
        onChange={(declutterIntent) => setOldHome({ declutterIntent })}
      />

      <SliderField
        label="预计减少物品比例 (%)"
        value={Math.round(oldHome.declutterRatio / 5)}
        displayValue={oldHome.declutterRatio}
        onChange={(v) => setOldHome({ declutterRatio: v * 5 })}
        min={0}
        max={10}
      />

      <WizardNav onBack={() => setStep("household")} onNext={() => setStep("newHome")} />
    </div>
  );
}
