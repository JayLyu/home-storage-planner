"use client";

import { CATEGORY_GROUPS, ITEM_CATEGORIES } from "@/lib/categories";
import { useAssessment } from "@/lib/store";
import type { InventoryMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WizardNav } from "@/components/wizard/step-indicator";
import { Field, Input } from "@/components/ui/form";

const MODES: { id: InventoryMode; title: string; desc: string }[] = [
  { id: "quick", title: "快速估算", desc: "基于家庭画像自动生成物品基线，约 5 分钟完成" },
  { id: "category", title: "分类盘点", desc: "按品类填写数量，适合有大致概念的用户" },
  { id: "detailed", title: "精细盘点", desc: "与分类盘点相同，后续版本将支持尺寸与频率" },
];

export function InventoryStep() {
  const { inventoryMode, setInventoryMode, inventory, setInventoryItem, setStep } = useAssessment();

  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setInventoryMode(mode.id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              inventoryMode === mode.id
                ? "border-stone-800 bg-stone-50 ring-2 ring-stone-800"
                : "border-stone-200 hover:border-stone-400"
            )}
          >
            <div className="font-medium text-stone-900">{mode.title}</div>
            <div className="mt-1 text-xs text-stone-500">{mode.desc}</div>
          </button>
        ))}
      </div>

      {inventoryMode === "quick" ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
          系统将基于你的家庭人数、户型、生活方式和旧房现状，自动生成默认物品基线并进行模块换算。
          如需更精确结果，可切换到「分类盘点」模式。
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORY_GROUPS.map((group) => {
            const categories = ITEM_CATEGORIES.filter((c) => c.parentId === group.id);
            return (
              <div key={group.id}>
                <h4 className="mb-3 font-medium text-stone-800">{group.name}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((cat) => {
                    const item = inventory.find((i) => i.categoryId === cat.id);
                    return (
                      <Field key={cat.id}>
                        <label className="mb-1.5 block text-sm text-stone-600">
                          {cat.name} ({cat.unit})
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={item?.quantity ?? 0}
                          onChange={(e) => setInventoryItem(cat.id, Number(e.target.value))}
                        />
                      </Field>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WizardNav
        onBack={() => setStep("lifestyle")}
        onNext={() => setStep("result")}
        nextLabel="生成报告"
      />
    </div>
  );
}
