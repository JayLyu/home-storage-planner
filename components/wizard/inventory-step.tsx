"use client";

import { FormField, Input, SelectField } from "@/components/form-fields";
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
import {
  DEFAULT_SIZE_PRESET,
  DEFAULT_USAGE_FREQUENCY,
  SIZE_PRESET_OPTIONS,
  USAGE_FREQUENCY_OPTIONS,
} from "@/lib/inventory-meta";
import { useAssessment } from "@/lib/store";
import type { CustomDimensions, InventoryItem, InventoryMode, SizePreset, UsageFrequency } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ClipboardList, ListChecks, Zap, type LucideIcon } from "lucide-react";

const MODES: {
  id: InventoryMode;
  title: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { id: "quick", title: "快速估算", desc: "基于家庭画像自动生成物品基线，约 5 分钟完成", icon: Zap },
  { id: "category", title: "分类盘点", desc: "按品类填写数量，衣物与鞋包区分男/女主人", icon: ListChecks },
  {
    id: "detailed",
    title: "精细盘点",
    desc: "在分类基础上补充尺寸档位与使用频率，结果更精确",
    icon: ClipboardList,
  },
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

function DetailedCategoryInput({
  cat,
  item,
  onUpdate,
}: {
  cat: ItemCategory;
  item?: InventoryItem;
  onUpdate: (update: Partial<Omit<InventoryItem, "categoryId" | "unit">>) => void;
}) {
  const calcHint = formatCategoryCalcHint(cat);
  const quantity = item?.quantity ?? 0;
  const sizePreset = item?.sizePreset ?? DEFAULT_SIZE_PRESET;
  const usageFrequency = item?.usageFrequency ?? DEFAULT_USAGE_FREQUENCY;
  const dims = item?.customDimensions ?? { width: 0, depth: 0, height: 0 };

  const sizeHint = SIZE_PRESET_OPTIONS.find((o) => o.value === sizePreset)?.hint;
  const freqHint = USAGE_FREQUENCY_OPTIONS.find((o) => o.value === usageFrequency)?.hint;

  const updateDim = (key: keyof CustomDimensions, value: number) => {
    onUpdate({
      customDimensions: { ...dims, [key]: value },
      sizePreset: "自定义",
    });
  };

  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Label className="leading-snug">
          {cat.name} ({cat.unit})
        </Label>
        <span className="shrink-0 text-right text-[11px] leading-snug text-muted-foreground">
          {calcHint}
        </span>
      </div>

      <FormField className="mb-0">
        <Label className="text-xs text-muted-foreground">数量</Label>
        <Input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
        />
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField<SizePreset>
          label="尺寸档位"
          value={sizePreset}
          onChange={(value) => onUpdate({ sizePreset: value })}
          options={SIZE_PRESET_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          className="mb-0"
        />
        <SelectField<UsageFrequency>
          label="使用频率"
          value={usageFrequency}
          onChange={(value) => onUpdate({ usageFrequency: value })}
          options={USAGE_FREQUENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          className="mb-0"
        />
      </div>

      {(sizeHint || freqHint) && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {sizeHint}
          {sizeHint && freqHint ? " · " : null}
          {freqHint}
        </p>
      )}

      {sizePreset === "自定义" ? (
        <div>
          <Label className="mb-2 block text-xs text-muted-foreground">自定义尺寸 (cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="宽"
              value={dims.width || ""}
              onChange={(e) => updateDim("width", Number(e.target.value))}
            />
            <Input
              type="number"
              min={0}
              placeholder="深"
              value={dims.depth || ""}
              onChange={(e) => updateDim("depth", Number(e.target.value))}
            />
            <Input
              type="number"
              min={0}
              placeholder="高"
              value={dims.height || ""}
              onChange={(e) => updateDim("height", Number(e.target.value))}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OwnerScopedGroup({
  categories,
  inventory,
  detailed,
  setInventoryItem,
  updateInventoryItem,
}: {
  categories: ItemCategory[];
  inventory: InventoryItem[];
  detailed: boolean;
  setInventoryItem: (categoryId: string, quantity: number) => void;
  updateInventoryItem: (
    categoryId: string,
    update: Partial<Omit<InventoryItem, "categoryId" | "unit">>
  ) => void;
}) {
  return (
    <div className="space-y-5">
      {OWNER_ORDER.map((owner) => {
        const ownerCategories = categories.filter((c) => c.owner === owner);
        return (
          <div key={owner}>
            <p className="mb-3 text-sm font-medium text-foreground">{OWNER_LABELS[owner]}</p>
            <div className={cn("grid gap-3", detailed ? "grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2")}>
              {ownerCategories.map((cat) => {
                const item = inventory.find((i) => i.categoryId === cat.id);
                return detailed ? (
                  <DetailedCategoryInput
                    key={cat.id}
                    cat={cat}
                    item={item}
                    onUpdate={(update) => updateInventoryItem(cat.id, update)}
                  />
                ) : (
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

function groupDescription(groupId: string, detailed: boolean, isOwnerScoped: boolean) {
  if (detailed) {
    return isOwnerScoped
      ? "分别填写男/女主人的数量、尺寸档位与使用频率"
      : "填写数量，并补充尺寸档位与使用频率以修正收纳估算";
  }
  return isOwnerScoped
    ? "请分别填写男主人与女主人的数量，右侧为换算基准"
    : "右侧数字为填入数量换算成收纳模块的基准";
}

export function InventoryStep() {
  const {
    inventoryMode,
    setInventoryMode,
    inventory,
    setInventoryItem,
    updateInventoryItem,
    setStep,
  } = useAssessment();

  const isDetailed = inventoryMode === "detailed";
  const showCategoryForm = inventoryMode === "category" || isDetailed;

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
              衣物与鞋包会按男/女主人各半估算。如需更精确结果，可切换到「分类盘点」或「精细盘点」模式。
            </p>
          </CardContent>
        </Card>
      ) : showCategoryForm ? (
        <div className="space-y-6">
          {isDetailed ? (
            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardContent className="pt-6 text-sm leading-relaxed text-muted-foreground">
                精细盘点会在数量基础上，按<strong className="font-medium text-foreground">尺寸档位</strong>
                调整物品体积估算，并按<strong className="font-medium text-foreground">使用频率</strong>
                影响便利收纳与风险提示。数量为 0 的品类可跳过。
              </CardContent>
            </Card>
          ) : null}

          {CATEGORY_GROUPS.map((group) => {
            const categories = ITEM_CATEGORIES.filter((c) => c.parentId === group.id);
            const isOwnerScoped = OWNER_SCOPED_GROUP_IDS.has(group.id);

            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription>{groupDescription(group.id, isDetailed, isOwnerScoped)}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isOwnerScoped ? (
                    <OwnerScopedGroup
                      categories={categories}
                      inventory={inventory}
                      detailed={isDetailed}
                      setInventoryItem={setInventoryItem}
                      updateInventoryItem={updateInventoryItem}
                    />
                  ) : (
                    <div
                      className={cn(
                        "grid gap-3",
                        isDetailed ? "grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2"
                      )}
                    >
                      {categories.map((cat) => {
                        const item = inventory.find((i) => i.categoryId === cat.id);
                        return isDetailed ? (
                          <DetailedCategoryInput
                            key={cat.id}
                            cat={cat}
                            item={item}
                            onUpdate={(update) => updateInventoryItem(cat.id, update)}
                          />
                        ) : (
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
      ) : null}

      <WizardNav
        onBack={() => setStep("lifestyle")}
        onNext={() => setStep("result")}
        nextLabel="生成报告"
      />
    </div>
  );
}
