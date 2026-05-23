"use client";

import {
  FormField,
  Input,
  MultiSelectField,
  SelectField,
  SwitchField,
} from "@/components/form-fields";
import { Label } from "@/components/ui/label";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { CabinetDepth, LayoutType, StoragePriority } from "@/lib/types";

const PLANNED_ZONES = ["玄关柜", "衣柜", "餐边柜", "厨房高柜", "家政柜", "阳台柜", "衣帽间", "书柜"];
const FLEXIBLE_ZONES = ["岛台", "书房", "阳台", "装饰性开放格", "电视墙"];

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: "一居", label: "一居" },
  { value: "两居", label: "两居" },
  { value: "三居", label: "三居" },
  { value: "四居及以上", label: "四居及以上" },
];

export function NewHomeStep() {
  const { newHome, setNewHome, setStep } = useAssessment();

  return (
    <div className="w-full min-w-0">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <Label>新房面积 (㎡)</Label>
          <Input
            type="number"
            min={20}
            value={newHome.newHomeArea}
            onChange={(e) => setNewHome({ newHomeArea: Number(e.target.value) })}
          />
        </FormField>
        <SelectField<LayoutType>
          label="新房户型"
          value={newHome.newHomeLayout}
          onChange={(newHomeLayout) => setNewHome({ newHomeLayout })}
          options={LAYOUT_OPTIONS}
        />
      </div>

      <SwitchField
        label="有独立储物间"
        checked={newHome.hasStorageRoom}
        onChange={(hasStorageRoom) => setNewHome({ hasStorageRoom })}
      />

      <MultiSelectField
        label="已规划柜体区域"
        options={PLANNED_ZONES}
        selected={newHome.plannedCabinetZones}
        onChange={(plannedCabinetZones) => setNewHome({ plannedCabinetZones })}
      />

      <MultiSelectField
        label="可调整/可牺牲空间"
        options={FLEXIBLE_ZONES}
        selected={newHome.flexibleZones}
        onChange={(flexibleZones) => setNewHome({ flexibleZones })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<StoragePriority>
          label="收纳优先级"
          value={newHome.storagePriority}
          onChange={(storagePriority) => setNewHome({ storagePriority })}
          options={[
            { value: "外观优先", label: "外观优先" },
            { value: "均衡", label: "均衡" },
            { value: "收纳优先", label: "收纳优先" },
          ]}
        />
        <SelectField<CabinetDepth>
          label="柜体深度偏好"
          value={newHome.cabinetDepthPreference}
          onChange={(cabinetDepthPreference) => setNewHome({ cabinetDepthPreference })}
          options={[
            { value: "浅柜为主", label: "浅柜为主" },
            { value: "标准柜", label: "标准柜" },
            { value: "深柜可接受", label: "深柜可接受" },
          ]}
        />
      </div>

      <WizardNav onBack={() => setStep("oldHome")} onNext={() => setStep("lifestyle")} />
    </div>
  );
}
