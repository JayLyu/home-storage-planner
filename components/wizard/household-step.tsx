"use client";

import {
  FormField,
  Input,
  SelectField,
  SwitchField,
} from "@/components/form-fields";
import { WizardNav } from "@/components/wizard/step-indicator";
import { useAssessment } from "@/lib/store";
import type { HouseholdGrowth, TimeHorizon } from "@/lib/types";
import { Label } from "@/components/ui/label";

export function HouseholdStep() {
  const { household, setHousehold, setStep } = useAssessment();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <Label>家庭人数</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={household.householdSize}
            onChange={(e) => setHousehold({ householdSize: Number(e.target.value) })}
          />
        </FormField>
        <SelectField<TimeHorizon>
          label="评估时间范围"
          value={household.timeHorizon}
          onChange={(timeHorizon) => setHousehold({ timeHorizon })}
          options={[
            { value: "1年", label: "1 年" },
            { value: "3年", label: "3 年" },
            { value: "5年", label: "5 年" },
          ]}
        />
      </div>

      <SwitchField
        label="家中有孩子"
        checked={household.hasChildren}
        onChange={(hasChildren) => setHousehold({ hasChildren })}
      />
      <SwitchField
        label="计划生育"
        checked={household.plansForChildren}
        onChange={(plansForChildren) => setHousehold({ plansForChildren })}
      />
      <SwitchField
        label="有宠物"
        checked={household.hasPets}
        onChange={(hasPets) => setHousehold({ hasPets })}
      />
      <SwitchField
        label="在家办公"
        checked={household.worksFromHome}
        onChange={(worksFromHome) => setHousehold({ worksFromHome })}
      />

      <SelectField<HouseholdGrowth>
        label="未来 3 年人数变化"
        value={household.expectedHouseholdGrowth}
        onChange={(expectedHouseholdGrowth) => setHousehold({ expectedHouseholdGrowth })}
        options={[
          { value: "无", label: "无变化" },
          { value: "可能增加", label: "可能增加" },
          { value: "明确增加", label: "明确增加" },
        ]}
      />

      <WizardNav onNext={() => setStep("oldHome")} />
    </div>
  );
}
