import { STORAGE_MODULES } from "./modules";

export type OwnerScope = "male" | "female";

export interface ItemCategory {
  id: string;
  parentId: string | null;
  name: string;
  unit: string;
  itemsPerModule: number;
  moduleId: string;
  defaultRoom: string;
  /** 衣物、鞋包类按主人区分 */
  owner?: OwnerScope;
}

export const OWNER_LABELS: Record<OwnerScope, string> = {
  male: "男主人",
  female: "女主人",
};

export const OWNER_SCOPED_GROUP_IDS = new Set(["clothing", "shoes-bags"]);

const CLOTHING_TYPES = [
  { id: "long-hang", name: "长挂衣物", itemsPerModule: 20, moduleId: "longHangModule" },
  { id: "short-hang", name: "短挂衣物", itemsPerModule: 40, moduleId: "shortHangModule" },
  { id: "fold-clothing", name: "折叠衣物", itemsPerModule: 50, moduleId: "shelfModule" },
  { id: "small-clothing", name: "小件衣物", itemsPerModule: 50, moduleId: "drawerModule" },
  { id: "seasonal-clothing", name: "换季衣物", itemsPerModule: 30, moduleId: "shelfModule" },
] as const;

const SHOES_BAG_TYPES = [
  { id: "daily-shoes", name: "常穿鞋", unit: "双", itemsPerModule: 14, moduleId: "shoeModule", defaultRoom: "玄关" },
  { id: "seasonal-shoes", name: "季节鞋", unit: "双", itemsPerModule: 10, moduleId: "shoeModule", defaultRoom: "玄关" },
  { id: "bags", name: "箱包", unit: "个", itemsPerModule: 8, moduleId: "shelfModule", defaultRoom: "玄关" },
] as const;

function ownerScopedCategories(
  parentId: string,
  types: readonly {
    id: string;
    name: string;
    unit?: string;
    itemsPerModule: number;
    moduleId: string;
    defaultRoom?: string;
  }[],
  defaultRoom = "卧室"
): ItemCategory[] {
  const owners: OwnerScope[] = ["male", "female"];
  return types.flatMap((type) =>
    owners.map((owner) => ({
      id: `${type.id}-${owner}`,
      parentId,
      owner,
      name: type.name,
      unit: type.unit ?? "件",
      itemsPerModule: type.itemsPerModule,
      moduleId: type.moduleId,
      defaultRoom: type.defaultRoom ?? defaultRoom,
    }))
  );
}

/** 旧版未区分主人的品类 ID → 拆分后的 ID */
export const LEGACY_CATEGORY_SPLIT: Record<string, [string, string]> = {
  "long-hang": ["long-hang-male", "long-hang-female"],
  "short-hang": ["short-hang-male", "short-hang-female"],
  "fold-clothing": ["fold-clothing-male", "fold-clothing-female"],
  "small-clothing": ["small-clothing-male", "small-clothing-female"],
  "seasonal-clothing": ["seasonal-clothing-male", "seasonal-clothing-female"],
  "daily-shoes": ["daily-shoes-male", "daily-shoes-female"],
  "seasonal-shoes": ["seasonal-shoes-male", "seasonal-shoes-female"],
  bags: ["bags-male", "bags-female"],
};

export const ITEM_CATEGORIES: ItemCategory[] = [
  ...ownerScopedCategories("clothing", CLOTHING_TYPES),
  ...ownerScopedCategories("shoes-bags", SHOES_BAG_TYPES, "玄关"),
  { id: "tableware", parentId: "kitchen", name: "餐具", unit: "件", itemsPerModule: 40, moduleId: "shelfModule", defaultRoom: "厨房" },
  { id: "cookware", parentId: "kitchen", name: "锅具", unit: "个", itemsPerModule: 6, moduleId: "applianceModule", defaultRoom: "厨房" },
  { id: "appliances", parentId: "kitchen", name: "小家电", unit: "个", itemsPerModule: 4, moduleId: "applianceModule", defaultRoom: "厨房" },
  { id: "food-stock", parentId: "kitchen", name: "食品囤货", unit: "箱", itemsPerModule: 8, moduleId: "shelfModule", defaultRoom: "厨房" },
  { id: "cleaning-tools", parentId: "housekeeping", name: "清洁工具", unit: "件", itemsPerModule: 5, moduleId: "housekeepingModule", defaultRoom: "阳台" },
  { id: "care-stock", parentId: "housekeeping", name: "洗护囤货", unit: "箱", itemsPerModule: 6, moduleId: "housekeepingModule", defaultRoom: "阳台" },
  { id: "tools-misc", parentId: "housekeeping", name: "工具杂物", unit: "件", itemsPerModule: 10, moduleId: "housekeepingModule", defaultRoom: "储物间" },
  { id: "digital-devices", parentId: "digital", name: "数码设备", unit: "件", itemsPerModule: 8, moduleId: "digitalModule", defaultRoom: "客厅" },
  { id: "digital-accessories", parentId: "digital", name: "数码配件", unit: "件", itemsPerModule: 20, moduleId: "digitalModule", defaultRoom: "客厅" },
  { id: "device-boxes", parentId: "digital", name: "包装盒", unit: "个", itemsPerModule: 12, moduleId: "digitalModule", defaultRoom: "储物间" },
  { id: "documents", parentId: "files", name: "文件资料", unit: "份", itemsPerModule: 30, moduleId: "shelfModule", defaultRoom: "客厅" },
  { id: "memorabilia", parentId: "files", name: "纪念物", unit: "件", itemsPerModule: 15, moduleId: "displayModule", defaultRoom: "客厅" },
  { id: "luggage", parentId: "bulky", name: "行李箱", unit: "个", itemsPerModule: 2, moduleId: "deepStorageModule", defaultRoom: "储物间" },
  { id: "sports-camping", parentId: "bulky", name: "运动露营", unit: "件", itemsPerModule: 4, moduleId: "deepStorageModule", defaultRoom: "储物间" },
  { id: "children-items", parentId: "kids-pets", name: "儿童用品", unit: "件", itemsPerModule: 20, moduleId: "shelfModule", defaultRoom: "卧室" },
  { id: "pet-items", parentId: "kids-pets", name: "宠物用品", unit: "件", itemsPerModule: 15, moduleId: "shelfModule", defaultRoom: "阳台" },
];

export const CATEGORY_GROUPS = [
  { id: "clothing", name: "衣物" },
  { id: "shoes-bags", name: "鞋包" },
  { id: "kitchen", name: "厨房" },
  { id: "housekeeping", name: "家政" },
  { id: "digital", name: "数码" },
  { id: "files", name: "文件纪念" },
  { id: "bulky", name: "大件低频" },
  { id: "kids-pets", name: "儿童宠物" },
];

export function getCategoryById(id: string): ItemCategory | undefined {
  return ITEM_CATEGORIES.find((c) => c.id === id);
}

/** 品类换算基准：每 N 件/双/个 ≈ 1 组标准模块（含模块外尺寸 cm） */
export function formatCategoryCalcHint(cat: ItemCategory): string {
  const mod = STORAGE_MODULES[cat.moduleId];
  if (!mod) {
    return `每 ${cat.itemsPerModule} ${cat.unit} ≈ 1 组`;
  }
  return `每 ${cat.itemsPerModule} ${cat.unit} ≈ 1 组 · ${mod.width}×${mod.depth}×${mod.height} cm`;
}

/** 将旧版 inventory 中的合并品类拆分为男/女主人两项 */
export function migrateLegacyInventory(
  inventory: { categoryId: string; quantity: number; unit: string }[]
): { categoryId: string; quantity: number; unit: string }[] {
  const merged = new Map<string, { categoryId: string; quantity: number; unit: string }>();

  for (const item of inventory) {
    const split = LEGACY_CATEGORY_SPLIT[item.categoryId];
    if (split && item.quantity > 0) {
      const femaleQty = Math.floor(item.quantity / 2);
      const maleQty = item.quantity - femaleQty;
      for (const [id, qty] of [
        [split[0], maleQty],
        [split[1], femaleQty],
      ] as const) {
        if (qty <= 0) continue;
        const cat = getCategoryById(id);
        const existing = merged.get(id);
        if (existing) {
          existing.quantity += qty;
        } else {
          merged.set(id, { categoryId: id, quantity: qty, unit: cat?.unit ?? item.unit });
        }
      }
      continue;
    }

    const existing = merged.get(item.categoryId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(item.categoryId, { ...item });
    }
  }

  return Array.from(merged.values());
}
