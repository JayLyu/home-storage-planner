export interface ItemCategory {
  id: string;
  parentId: string | null;
  name: string;
  unit: string;
  itemsPerModule: number;
  moduleId: string;
  defaultRoom: string;
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  { id: "long-hang", parentId: "clothing", name: "长挂衣物", unit: "件", itemsPerModule: 20, moduleId: "longHangModule", defaultRoom: "卧室" },
  { id: "short-hang", parentId: "clothing", name: "短挂衣物", unit: "件", itemsPerModule: 40, moduleId: "shortHangModule", defaultRoom: "卧室" },
  { id: "fold-clothing", parentId: "clothing", name: "折叠衣物", unit: "件", itemsPerModule: 50, moduleId: "shelfModule", defaultRoom: "卧室" },
  { id: "small-clothing", parentId: "clothing", name: "小件衣物", unit: "件", itemsPerModule: 50, moduleId: "drawerModule", defaultRoom: "卧室" },
  { id: "seasonal-clothing", parentId: "clothing", name: "换季衣物", unit: "件", itemsPerModule: 30, moduleId: "shelfModule", defaultRoom: "卧室" },
  { id: "daily-shoes", parentId: "shoes-bags", name: "常穿鞋", unit: "双", itemsPerModule: 14, moduleId: "shoeModule", defaultRoom: "玄关" },
  { id: "seasonal-shoes", parentId: "shoes-bags", name: "季节鞋", unit: "双", itemsPerModule: 10, moduleId: "shoeModule", defaultRoom: "玄关" },
  { id: "bags", parentId: "shoes-bags", name: "箱包", unit: "个", itemsPerModule: 8, moduleId: "shelfModule", defaultRoom: "玄关" },
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
