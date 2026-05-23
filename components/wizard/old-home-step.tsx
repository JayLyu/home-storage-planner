"use client";

import { Field, Input, MultiSelect, Select, SliderField } from "@/components/ui/form";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { LayoutType, StorageSatisfaction } from "@/lib/types";

const OVERFLOW_OPTIONS = ["卧室", "厨房", "阳台", "玄关", "客厅", "储物间"];
const TEMP_OPTIONS = ["沙发旁", "床底", "餐桌", "地面", "走廊"];
const CABINET_OPTIONS = ["衣柜", "鞋柜", "餐边柜", "厨房高柜", "家政柜", "阳台柜", "书柜"];

export function OldHomeStep() {
  const { oldHome, setOldHome, setStep } = useAssessment();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">旧房面积 (㎡)</label>
          <Input
            type="number"
            min={20}
            value={oldHome.oldHomeArea}
            onChange={(e) => setOldHome({ oldHomeArea: Number(e.target.value) })}
          />
        </Field>
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">旧房户型</label>
          <Select
            value={oldHome.oldHomeLayout}
            onChange={(e) => setOldHome({ oldHomeLayout: e.target.value as LayoutType })}
          >
            <option value="一居">一居</option>
            <option value="两居">两居</option>
            <option value="三居">三居</option>
            <option value="四居及以上">四居及以上</option>
          </Select>
        </Field>
      </div>

      <Field>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">当前收纳满意度</label>
        <Select
          value={oldHome.oldStorageSatisfaction}
          onChange={(e) => setOldHome({ oldStorageSatisfaction: e.target.value as StorageSatisfaction })}
        >
          <option value="充足">充足</option>
          <option value="刚好">刚好</option>
          <option value="不足">不足</option>
          <option value="严重不足">严重不足</option>
        </Select>
      </Field>

      <MultiSelect
        label="爆仓区域"
        options={OVERFLOW_OPTIONS}
        selected={oldHome.overflowZones}
        onChange={(v) => setOldHome({ overflowZones: v })}
      />

      <MultiSelect
        label="临时堆放区域"
        options={TEMP_OPTIONS}
        selected={oldHome.temporaryStorageZones}
        onChange={(v) => setOldHome({ temporaryStorageZones: v })}
      />

      <MultiSelect
        label="现有柜体类型"
        options={CABINET_OPTIONS}
        selected={oldHome.currentCabinetTypes}
        onChange={(v) => setOldHome({ currentCabinetTypes: v })}
      />

      <Field>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">现有柜体总长度 (m)</label>
        <Input
          type="number"
          min={0}
          step={0.5}
          value={oldHome.currentCabinetLength}
          onChange={(e) => setOldHome({ currentCabinetLength: Number(e.target.value) })}
        />
      </Field>

      <SliderField
        label="断舍离意愿"
        value={oldHome.declutterIntent}
        onChange={(v) => setOldHome({ declutterIntent: v })}
      />

      <SliderField
        label="预计减少物品比例 (%)"
        value={Math.round(oldHome.declutterRatio / 5)}
        onChange={(v) => setOldHome({ declutterRatio: v * 5 })}
        min={0}
        max={10}
      />

      <WizardNav onBack={() => setStep("household")} onNext={() => setStep("newHome")} />
    </div>
  );
}
