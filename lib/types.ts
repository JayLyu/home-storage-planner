export type LayoutType = "一居" | "两居" | "三居" | "四居及以上";
export type StorageSatisfaction = "充足" | "刚好" | "不足" | "严重不足";
export type HouseholdGrowth = "无" | "可能增加" | "明确增加";
export type TimeHorizon = "1年" | "3年" | "5年";
export type StoragePriority = "外观优先" | "均衡" | "收纳优先";
export type CabinetDepth = "浅柜为主" | "标准柜" | "深柜可接受";
export type InventoryMode = "quick" | "category" | "detailed";
export type RiskLevel = "低" | "中" | "高";
export type RoomZone =
  | "玄关"
  | "客厅"
  | "厨房"
  | "卧室"
  | "阳台"
  | "储物间";

export interface HouseholdInfo {
  householdSize: number;
  hasChildren: boolean;
  plansForChildren: boolean;
  hasPets: boolean;
  worksFromHome: boolean;
  expectedHouseholdGrowth: HouseholdGrowth;
  timeHorizon: TimeHorizon;
}

export interface OldHomeInfo {
  oldHomeArea: number;
  oldHomeLayout: LayoutType;
  oldStorageSatisfaction: StorageSatisfaction;
  overflowZones: string[];
  temporaryStorageZones: string[];
  currentCabinetTypes: string[];
  currentCabinetLength: number;
  declutterIntent: number;
  declutterRatio: number;
}

export interface NewHomeInfo {
  newHomeArea: number;
  newHomeLayout: LayoutType;
  hasStorageRoom: boolean;
  plannedCabinetZones: string[];
  flexibleZones: string[];
  storagePriority: StoragePriority;
  cabinetDepthPreference: CabinetDepth;
}

export interface LifestyleProfile {
  stockpilingLevel: number;
  minimalismLevel: number;
  cookingFrequency: number;
  travelFrequency: number;
  digitalDeviceLevel: number;
  hobbyStorageLevel: number;
  seasonalClothingLevel: number;
}

export interface InventoryItem {
  categoryId: string;
  quantity: number;
  unit: string;
}

export interface AssessmentInput {
  household: HouseholdInfo;
  oldHome: OldHomeInfo;
  newHome: NewHomeInfo;
  lifestyle: LifestyleProfile;
  inventoryMode: InventoryMode;
  inventory: InventoryItem[];
}

export interface ModuleResult {
  moduleId: string;
  moduleName: string;
  count: number;
  grossVolume: number;
  room: RoomZone;
}

export interface RoomDemand {
  room: RoomZone;
  volume: number;
  modules: ModuleResult[];
}

/** 旧房分空间收纳估算（基于柜体长度与爆仓区域推断） */
export interface OldRoomEstimate {
  room: RoomZone;
  /** 估算柜体容量 (m³) */
  capacity: number;
  /** 含爆仓压力的有效负载 (m³) */
  effectiveLoad: number;
  isOverflow: boolean;
}

export interface RoomDemandComparison {
  totalOldCapacity: number;
  totalOldEffectiveLoad: number;
  totalNewVolume: number;
  /** 新房净需求 − 旧房柜体容量 */
  capacityDelta: number;
  capacityDeltaPct: number;
  oldRoomEstimates: OldRoomEstimate[];
}

export interface RiskFactor {
  riskType: string;
  level: RiskLevel;
  evidence: string;
  suggestion: string;
}

export interface Recommendation {
  targetZone: string;
  cabinetType: string;
  description: string;
  priority: "高" | "中" | "低";
}

export interface AssessmentResult {
  score: number;
  riskLevel: RiskLevel;
  netVolume: number;
  grossVolume: number;
  redundancyRate: number;
  modules: ModuleResult[];
  roomDemands: RoomDemand[];
  roomComparison: RoomDemandComparison;
  risks: RiskFactor[];
  recommendations: Recommendation[];
  designerChecklist: string[];
  spacePriority: {
    keep: string[];
    sacrifice: string[];
    doNotCompress: string[];
  };
  comparisonNotes: string[];
}

export const WIZARD_STEPS = [
  { id: "household", title: "家庭信息", description: "了解家庭成员与变化预期" },
  { id: "oldHome", title: "旧房现状", description: "记录当前收纳痛点" },
  { id: "newHome", title: "新房信息", description: "规划中的收纳空间" },
  { id: "lifestyle", title: "生活方式", description: "囤货、极简与兴趣画像" },
  { id: "inventory", title: "物品盘点", description: "估算或分类录入物品" },
  { id: "result", title: "评估报告", description: "收纳需求与风险分析" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];
