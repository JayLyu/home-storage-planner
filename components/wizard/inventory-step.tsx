"use client";

import { FormField, Input } from "@/components/form-fields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLabel } from "@/components/ui/icon-text";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WizardNav } from "@/components/wizard/step-indicator";
import {
  CATEGORY_GROUPS,
  formatCategoryCalcHint,
  ITEM_CATEGORIES,
  OWNER_LABELS,
  OWNER_SCOPED_GROUP_IDS,
  type ItemCategory,
  type OwnerScope,
} from "@/lib/categories";
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
  { id: "category", title: "分类盘点", desc: "按品类填写数量，衣物与鞋包区分男/女主人", icon: ListChecks },
  { id: "detailed", title: "精细盘点", desc: "与分类盘点相同，后续版本将支持尺寸与频率", icon: ClipboardList },
];

const OWNER_ORDER: OwnerScope[] = ["male", "female"];

function CategoryInput({
  cat,
  quantity,
  onChange,
}: {
  cat: ItemCategory;
  quantity: number;
  onChange: (value: number) => void;
}) {
  const calcHint = formatCategoryCalcHint(cat);

  return (
    <FormField className="mb-0">
      <div className="flex items-start justify-between gap-2">
        <Label className="leading-snug">
          {cat.name} ({cat.unit})
        </Label>
        <span className="shrink-0 text-right text-[11px] leading-snug text-muted-foreground">
          {calcHint}
        </span>
      </div>
      <Input type="number" min={0} value={quantity} onChange={(e) => onChange(Number(e.target.value))} />
    </FormField>
  );
}

function OwnerScopedGroup({
  categories,
  inventory,
  setInventoryItem,
}: {
  categories: ItemCategory[];
  inventory: { categoryId: string; quantity: number }[];
  setInventoryItem: (categoryId: string, quantity: number) => void;
}) {
  return (
    <div className="space-y-5">
      {OWNER_ORDER.map((owner) => {
        const ownerCategories = categories.filter((c) => c.owner === owner);
        return (
          <div key={owner}>
            <p className="mb-3 text-sm font-medium text-foreground">{OWNER_LABELS[owner]}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {ownerCategories.map((cat) => {
                const item = inventory.find((i) => i.categoryId === cat.id);
                return (
                  <CategoryInput
                    key={cat.id}
                    cat={cat}
                    quantity={item?.quantity ?? 0}
                    onChange={(value) => setInventoryItem(cat.id, value)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
              衣物与鞋包会按男/女主人各半估算。如需更精确结果，可切换到「分类盘点」模式。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {CATEGORY_GROUPS.map((group) => {
            const categories = ITEM_CATEGORIES.filter((c) => c.parentId === group.id);
            const isOwnerScoped = OWNER_SCOPED_GROUP_IDS.has(group.id);

            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  {isOwnerScoped ? (
                    <CardDescription>请分别填写男主人与女主人的数量，右侧为换算基准</CardDescription>
                  ) : (
                    <CardDescription>右侧数字为填入数量换算成收纳模块的基准</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {isOwnerScoped ? (
                    <OwnerScopedGroup
                      categories={categories}
                      inventory={inventory}
                      setInventoryItem={setInventoryItem}
                    />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {categories.map((cat) => {
                        const item = inventory.find((i) => i.categoryId === cat.id);
                        return (
                          <CategoryInput
                            key={cat.id}
                            cat={cat}
                            quantity={item?.quantity ?? 0}
                            onChange={(value) => setInventoryItem(cat.id, value)}
                          />
                        );
                      })}
                    </div>
                  )}
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
