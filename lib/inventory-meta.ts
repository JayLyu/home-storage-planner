import type { ItemCategory } from "./categories";
import { moduleGrossVolume } from "./modules";
import type {
  CustomDimensions,
  InventoryItem,
  InventoryMode,
  SizePreset,
  UsageFrequency,
} from "./types";

export const SIZE_PRESET_OPTIONS: { value: SizePreset; label: string; hint: string }[] = [
  { value: "小", label: "小", hint: "体积约为标准件 85%" },
  { value: "中", label: "中", hint: "标准参照尺寸" },
  { value: "大", label: "大", hint: "体积约为标准件 115%" },
  { value: "超大", label: "超大", hint: "体积约为标准件 135%" },
  { value: "自定义", label: "自定义", hint: "按长宽高估算" },
];

export const USAGE_FREQUENCY_OPTIONS: { value: UsageFrequency; label: string; hint: string }[] = [
  { value: "高频", label: "高频", hint: "每日或每周使用，需便利拿取" },
  { value: "中频", label: "中频", hint: "每周至每月使用" },
  { value: "低频", label: "低频", hint: "季节性或偶尔使用" },
  { value: "超低频", label: "超低频", hint: "长期存放，可置于深柜" },
];

export const DEFAULT_SIZE_PRESET: SizePreset = "中";
export const DEFAULT_USAGE_FREQUENCY: UsageFrequency = "中频";

const SIZE_VOLUME_FACTOR: Record<Exclude<SizePreset, "自定义">, number> = {
  小: 0.85,
  中: 1,
  大: 1.15,
  超大: 1.35,
};

const FREQUENCY_SPACE_FACTOR: Record<UsageFrequency, number> = {
  高频: 1.1,
  中频: 1,
  低频: 0.95,
  超低频: 0.9,
};

/** 精细盘点默认属性 */
export function defaultDetailedItemFields(): Pick<InventoryItem, "sizePreset" | "usageFrequency"> {
  return {
    sizePreset: DEFAULT_SIZE_PRESET,
    usageFrequency: DEFAULT_USAGE_FREQUENCY,
  };
}

function customSizeFactor(item: InventoryItem, category: ItemCategory): number {
  const dims = item.customDimensions;
  if (!dims || dims.width <= 0 || dims.depth <= 0 || dims.height <= 0) return 1;

  const itemVol = (dims.width * dims.depth * dims.height) / 1_000_000;
  const moduleVol = moduleGrossVolume(category.moduleId);
  const perItemRef = moduleVol / Math.max(category.itemsPerModule, 1);
  if (perItemRef <= 0) return 1;

  return Math.max(0.5, Math.min(2.5, itemVol / perItemRef));
}

function sizeFactor(item: InventoryItem, category: ItemCategory): number {
  if (item.sizePreset === "自定义") return customSizeFactor(item, category);
  if (item.sizePreset) return SIZE_VOLUME_FACTOR[item.sizePreset];
  return 1;
}

function frequencyFactor(item: InventoryItem): number {
  if (!item.usageFrequency) return 1;
  return FREQUENCY_SPACE_FACTOR[item.usageFrequency];
}

/** 精细盘点下按尺寸与频率修正后的等效数量 */
export function effectiveInventoryQuantity(
  item: InventoryItem,
  category: ItemCategory,
  mode: InventoryMode
): number {
  if (item.quantity <= 0) return 0;
  if (mode !== "detailed") return item.quantity;

  return item.quantity * sizeFactor(item, category) * frequencyFactor(item);
}

export function normalizeCustomDimensions(
  dims?: CustomDimensions
): CustomDimensions | undefined {
  if (!dims) return undefined;
  const width = Math.max(0, dims.width);
  const depth = Math.max(0, dims.depth);
  const height = Math.max(0, dims.height);
  if (width === 0 && depth === 0 && height === 0) return undefined;
  return { width, depth, height };
}
