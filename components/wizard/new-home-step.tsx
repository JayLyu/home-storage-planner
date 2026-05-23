"use client";

import { Field, Input, MultiSelect, Select, Toggle } from "@/components/ui/form";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { CabinetDepth, LayoutType, StoragePriority } from "@/lib/types";

const PLANNED_ZONES = ["玄关柜", "衣柜", "餐边柜", "厨房高柜", "家政柜", "阳台柜", "衣帽间", "书柜"];
const FLEXIBLE_ZONES = ["岛台", "书房", "阳台", "装饰性开放格", "电视墙"];

export function NewHomeStep() {
  const { newHome, setNewHome, setStep } = useAssessment();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">新房面积 (㎡)</label>
          <Input
            type="number"
            min={20}
            value={newHome.newHomeArea}
            onChange={(e) => setNewHome({ newHomeArea: Number(e.target.value) })}
          />
        </Field>
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">新房户型</label>
          <Select
            value={newHome.newHomeLayout}
            onChange={(e) => setNewHome({ newHomeLayout: e.target.value as LayoutType })}
          >
            <option value="一居">一居</option>
            <option value="两居">两居</option>
            <option value="三居">三居</option>
            <option value="四居及以上">四居及以上</option>
          </Select>
        </Field>
      </div>

      <Toggle
        label="有独立储物间"
        checked={newHome.hasStorageRoom}
        onChange={(v) => setNewHome({ hasStorageRoom: v })}
      />

      <MultiSelect
        label="已规划柜体区域"
        options={PLANNED_ZONES}
        selected={newHome.plannedCabinetZones}
        onChange={(v) => setNewHome({ plannedCabinetZones: v })}
      />

      <MultiSelect
        label="可调整/可牺牲空间"
        options={FLEXIBLE_ZONES}
        selected={newHome.flexibleZones}
        onChange={(v) => setNewHome({ flexibleZones: v })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">收纳优先级</label>
          <Select
            value={newHome.storagePriority}
            onChange={(e) => setNewHome({ storagePriority: e.target.value as StoragePriority })}
          >
            <option value="外观优先">外观优先</option>
            <option value="均衡">均衡</option>
            <option value="收纳优先">收纳优先</option>
          </Select>
        </Field>
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">柜体深度偏好</label>
          <Select
            value={newHome.cabinetDepthPreference}
            onChange={(e) => setNewHome({ cabinetDepthPreference: e.target.value as CabinetDepth })}
          >
            <option value="浅柜为主">浅柜为主</option>
            <option value="标准柜">标准柜</option>
            <option value="深柜可接受">深柜可接受</option>
          </Select>
        </Field>
      </div>

      <WizardNav onBack={() => setStep("oldHome")} onNext={() => setStep("lifestyle")} />
    </div>
  );
}
