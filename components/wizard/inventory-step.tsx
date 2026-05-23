"use client";

import { FormField, Input } from "@/components/form-fields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLabel } from "@/components/ui/icon-text";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WizardNav } from "@/components/wizard/step-indicator";
import { CATEGORY_GROUPS, ITEM_CATEGORIES } from "@/lib/categories";
import { useAssessment } from "@/lib/store";
import type { InventoryMode } from "@/lib/types";
import { ClipboardList, ListChecks, Zap, type LucideIcon } from "lucide-react";

const MODES: {
  id: InventoryMode;
  title: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { id: "quick", title: "快速估算", desc: "基于家庭画像自动生成物品基线，约 5 分钟完成", icon: Zap },
  { id: "category", title: "分类盘点", desc: "按品类填写数量，适合有大致概念的用户", icon: ListChecks },
  { id: "detailed", title: "精细盘点", desc: "与分类盘点相同，后续版本将支持尺寸与频率", icon: ClipboardList },
];

export function InventoryStep() {
  const { inventoryMode, setInventoryMode, inventory, setInventoryItem, setStep } = useAssessment();

  return (
    <div className="w-full min-w-0">
      <ToggleGroup
        variant="outline"
        spacing={2}
        value={[inventoryMode]}
        onValueChange={(values) => {
          const value = values[0];
          if (value) setInventoryMode(value as InventoryMode);
        }}
        className="mb-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <ToggleGroupItem
              key={mode.id}
              value={mode.id}
              className="h-auto w-full min-w-0 shrink whitespace-normal rounded-xl p-4 text-left data-pressed:border-primary data-pressed:bg-accent flex-col items-start"
            >
              <IconLabel icon={Icon} className="font-medium">
                {mode.title}
              </IconLabel>
              <span className="mt-1 w-full text-left text-xs leading-relaxed font-normal whitespace-normal text-muted-foreground">
                {mode.desc}
              </span>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      {inventoryMode === "quick" ? (
        <Card className="border-dashed">
          <CardContent className="flex gap-3 pt-6 text-sm text-muted-foreground">
            <Zap className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p>
              系统将基于你的家庭人数、户型、生活方式和旧房现状，自动生成默认物品基线并进行模块换算。
              如需更精确结果，可切换到「分类盘点」模式。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {CATEGORY_GROUPS.map((group) => {
            const categories = ITEM_CATEGORIES.filter((c) => c.parentId === group.id);
            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {categories.map((cat) => {
                    const item = inventory.find((i) => i.categoryId === cat.id);
                    return (
                      <FormField key={cat.id} className="mb-0">
                        <Label>
                          {cat.name} ({cat.unit})
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={item?.quantity ?? 0}
                          onChange={(e) => setInventoryItem(cat.id, Number(e.target.value))}
                        />
                      </FormField>
                    );
                  })}
                </CardContent>
              </Card>
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
