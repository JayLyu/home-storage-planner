"use client";

import { Field, Input, Select, Toggle } from "@/components/ui/form";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { HouseholdGrowth, TimeHorizon } from "@/lib/types";

export function HouseholdStep() {
  const { household, setHousehold, setStep } = useAssessment();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">家庭人数</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={household.householdSize}
            onChange={(e) => setHousehold({ householdSize: Number(e.target.value) })}
          />
        </Field>
        <Field>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">评估时间范围</label>
          <Select
            value={household.timeHorizon}
            onChange={(e) => setHousehold({ timeHorizon: e.target.value as TimeHorizon })}
          >
            <option value="1年">1 年</option>
            <option value="3年">3 年</option>
            <option value="5年">5 年</option>
          </Select>
        </Field>
      </div>

      <Toggle label="家中有孩子" checked={household.hasChildren} onChange={(v) => setHousehold({ hasChildren: v })} />
      <Toggle label="计划生育" checked={household.plansForChildren} onChange={(v) => setHousehold({ plansForChildren: v })} />
      <Toggle label="有宠物" checked={household.hasPets} onChange={(v) => setHousehold({ hasPets: v })} />
      <Toggle label="在家办公" checked={household.worksFromHome} onChange={(v) => setHousehold({ worksFromHome: v })} />

      <Field>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">未来 3 年人数变化</label>
        <Select
          value={household.expectedHouseholdGrowth}
          onChange={(e) => setHousehold({ expectedHouseholdGrowth: e.target.value as HouseholdGrowth })}
        >
          <option value="无">无变化</option>
          <option value="可能增加">可能增加</option>
          <option value="明确增加">明确增加</option>
        </Select>
      </Field>

      <WizardNav onNext={() => setStep("oldHome")} />
    </div>
  );
}
