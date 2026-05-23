import { ITEM_CATEGORIES } from "./categories";
import { moduleEffectiveVolume, moduleGrossVolume, STORAGE_MODULES } from "./modules";
import type {
  AssessmentInput,
  AssessmentResult,
  InventoryItem,
  ModuleResult,
  OldRoomEstimate,
  Recommendation,
  RiskFactor,
  RoomDemand,
  RoomDemandComparison,
  RoomZone,
} from "./types";
import { formatNumber } from "./utils";

const ALL_ROOMS: RoomZone[] = ["玄关", "客厅", "厨房", "卧室", "阳台", "储物间"];

const CABINET_TYPE_ROOM: Record<string, RoomZone> = {
  衣柜: "卧室",
  鞋柜: "玄关",
  餐边柜: "厨房",
  厨房高柜: "厨房",
  家政柜: "阳台",
  阳台柜: "阳台",
  书柜: "客厅",
};

const DEFAULT_ROOM_WEIGHTS: Record<RoomZone, number> = {
  卧室: 0.35,
  厨房: 0.22,
  玄关: 0.12,
  客厅: 0.15,
  阳台: 0.11,
  储物间: 0.05,
};

/** 80cm 宽标准高柜模块毛体积 (m³) */
const CABINET_VOLUME_PER_MODULE = 1.15;
const CABINET_WIDTH_M = 0.8;

function modulesForInventory(inventory: InventoryItem[]): ModuleResult[] {
  const moduleCounts = new Map<string, { count: number; room: RoomZone }>();

  for (const item of inventory) {
    if (item.quantity <= 0) continue;
    const category = ITEM_CATEGORIES.find((c) => c.id === item.categoryId);
    if (!category) continue;

    const count = Math.ceil(item.quantity / category.itemsPerModule);
    const existing = moduleCounts.get(category.moduleId);
    if (existing) {
      existing.count += count;
    } else {
      moduleCounts.set(category.moduleId, {
        count,
        room: category.defaultRoom as RoomZone,
      });
    }
  }

  return Array.from(moduleCounts.entries()).map(([moduleId, { count, room }]) => ({
    moduleId,
    moduleName: STORAGE_MODULES[moduleId]?.name ?? moduleId,
    count,
    grossVolume: moduleGrossVolume(moduleId) * count,
    room,
  }));
}

function computeRedundancyRate(input: AssessmentInput): number {
  let rate = 0.3;

  if (input.lifestyle.minimalismLevel >= 4) rate = 0.2;
  if (input.lifestyle.stockpilingLevel >= 4) rate += 0.1;
  if (input.household.hasChildren || input.household.plansForChildren) rate += 0.15;
  if (input.lifestyle.digitalDeviceLevel >= 4 || input.lifestyle.hobbyStorageLevel >= 4) rate += 0.1;
  if (input.oldHome.oldStorageSatisfaction === "不足") rate += 0.1;
  if (input.oldHome.oldStorageSatisfaction === "严重不足") rate += 0.2;
  if (input.household.expectedHouseholdGrowth === "明确增加") rate += 0.1;

  return Math.min(Math.max(rate - input.oldHome.declutterRatio / 200, 0.2), 0.65);
}

function buildRoomDemands(modules: ModuleResult[]): RoomDemand[] {
  return ALL_ROOMS.map((room) => {
    const roomModules = modules.filter((m) => m.room === room);
    return {
      room,
      volume: roomModules.reduce((sum, m) => sum + m.grossVolume, 0),
      modules: roomModules,
    };
  });
}

function estimateOldTotalCapacity(input: AssessmentInput): number {
  const { currentCabinetLength, oldHomeArea } = input.oldHome;
  if (currentCabinetLength > 0) {
    return (currentCabinetLength / CABINET_WIDTH_M) * CABINET_VOLUME_PER_MODULE;
  }
  return Math.round(oldHomeArea * 0.018 * 100) / 100;
}

function distributeOldCapacity(input: AssessmentInput, totalCapacity: number): Record<RoomZone, number> {
  const weights: Record<RoomZone, number> = { ...DEFAULT_ROOM_WEIGHTS };
  const types = input.oldHome.currentCabinetTypes;

  if (types.length > 0) {
    for (const room of ALL_ROOMS) weights[room] = 0;
    for (const type of types) {
      const room = CABINET_TYPE_ROOM[type];
      if (room) weights[room] += 1;
    }
    const weightSum = ALL_ROOMS.reduce((s, r) => s + weights[r], 0);
    if (weightSum === 0) {
      Object.assign(weights, DEFAULT_ROOM_WEIGHTS);
    }
  }

  const weightSum = ALL_ROOMS.reduce((s, r) => s + weights[r], 0);
  const distribution = {} as Record<RoomZone, number>;
  for (const room of ALL_ROOMS) {
    distribution[room] = Math.round((totalCapacity * (weights[room] / weightSum)) * 100) / 100;
  }
  return distribution;
}

function buildRoomComparison(
  input: AssessmentInput,
  roomDemands: RoomDemand[],
  totalNewVolume: number
): RoomDemandComparison {
  const totalOldCapacity = estimateOldTotalCapacity(input);
  const distribution = distributeOldCapacity(input, totalOldCapacity);
  const overflowSet = new Set(input.oldHome.overflowZones);
  const satisfactionFactor =
    input.oldHome.oldStorageSatisfaction === "严重不足" ? 1.15 :
    input.oldHome.oldStorageSatisfaction === "不足" ? 1.08 : 1;

  const oldRoomEstimates: OldRoomEstimate[] = ALL_ROOMS.map((room) => {
    const capacity = distribution[room];
    const isOverflow = overflowSet.has(room);
    const newVolume = roomDemands.find((d) => d.room === room)?.volume ?? 0;

    let effectiveLoad = capacity * satisfactionFactor;
    if (isOverflow) {
      effectiveLoad = Math.max(effectiveLoad * 1.28, newVolume * 0.92, capacity * 1.15);
    }

    return {
      room,
      capacity,
      effectiveLoad: Math.round(effectiveLoad * 100) / 100,
      isOverflow,
    };
  });

  const totalOldEffectiveLoad = Math.round(
    oldRoomEstimates.reduce((s, r) => s + r.effectiveLoad, 0) * 100
  ) / 100;
  const capacityDelta = Math.round((totalNewVolume - totalOldCapacity) * 100) / 100;
  const capacityDeltaPct =
    totalOldCapacity > 0
      ? Math.round((capacityDelta / totalOldCapacity) * 100)
      : 0;

  return {
    totalOldCapacity: Math.round(totalOldCapacity * 100) / 100,
    totalOldEffectiveLoad,
    totalNewVolume: totalNewVolume,
    capacityDelta,
    capacityDeltaPct,
    oldRoomEstimates,
  };
}

function assessRisks(input: AssessmentInput, modules: ModuleResult[], grossVolume: number): RiskFactor[] {
  const risks: RiskFactor[] = [];

  const plannedLength = input.newHome.plannedCabinetZones.length * 1.2;
  const estimatedLength = modules.reduce((sum, m) => {
    const mod = STORAGE_MODULES[m.moduleId];
    return sum + (mod ? (mod.width / 100) * m.count : 0);
  }, 0);

  if (estimatedLength > plannedLength + 1) {
    risks.push({
      riskType: "容量风险",
      level: estimatedLength > plannedLength + 3 ? "高" : "中",
      evidence: `估算柜体总长度约 ${formatNumber(estimatedLength)}m，超出当前规划区域容量`,
      suggestion: "建议增加高柜、储物间或餐边柜，或减少非必要开放空间",
    });
  }

  if (input.lifestyle.digitalDeviceLevel >= 4 || input.household.plansForChildren) {
    risks.push({
      riskType: "增长风险",
      level: input.household.plansForChildren ? "高" : "中",
      evidence: "数码设备或阶段型物品（儿童用品）存在持续增长预期",
      suggestion: "为增长型物品预留 20%-50% 冗余，并规划独立模块",
    });
  }

  const hasDeep = modules.some((m) => m.moduleId === "deepStorageModule");
  const hasBulky = input.inventory.some(
    (i) => ["luggage", "sports-camping"].includes(i.categoryId) && i.quantity > 0
  );
  if (hasBulky && !hasDeep) {
    risks.push({
      riskType: "大件连续空间风险",
      level: "高",
      evidence: "存在行李箱或运动露营物品，但缺少深收纳模块规划",
      suggestion: "建议保留至少 1 组 60cm 深高柜用于大件低频物品",
    });
  }

  if (input.lifestyle.stockpilingLevel >= 4) {
    risks.push({
      riskType: "囤货风险",
      level: "中",
      evidence: "囤货倾向较高，食品、纸品、洗护库存需要额外空间",
      suggestion: "厨房和家政区域需预留囤货区，建议使用封闭柜体",
    });
  }

  if (input.oldHome.overflowZones.length >= 2) {
    risks.push({
      riskType: "爆仓区域修复",
      level: input.oldHome.oldStorageSatisfaction === "严重不足" ? "高" : "中",
      evidence: `旧房在 ${input.oldHome.overflowZones.join("、")} 等区域存在爆仓`,
      suggestion: "新房需为这些区域分配专门柜体，避免临时堆放延续",
    });
  }

  if (input.newHome.newHomeArea < input.oldHome.oldHomeArea * 0.95 && grossVolume > 15) {
    risks.push({
      riskType: "面积缩减风险",
      level: "中",
      evidence: "新房面积小于或接近旧房，但收纳需求较高",
      suggestion: "考虑提高垂直收纳利用率，或执行更积极的断舍离",
    });
  }

  return risks;
}

function buildRecommendations(modules: ModuleResult[], input: AssessmentInput): Recommendation[] {
  const recs: Recommendation[] = [];

  const wardrobeModules = modules.filter((m) =>
    ["shortHangModule", "longHangModule", "drawerModule", "shelfModule"].includes(m.moduleId)
  );
  const wardrobeLength = wardrobeModules.reduce((sum, m) => {
    const mod = STORAGE_MODULES[m.moduleId];
    return sum + (mod ? (mod.width / 100) * m.count : 0);
  }, 0);

  if (wardrobeLength > 0) {
    recs.push({
      targetZone: "卧室",
      cabinetType: "衣柜",
      description: `建议衣柜总长度不少于 ${formatNumber(wardrobeLength)}m，含短挂、长挂与抽屉区`,
      priority: wardrobeLength >= 4 ? "高" : "中",
    });
  }

  const shoeCount = modules.find((m) => m.moduleId === "shoeModule");
  if (shoeCount) {
    recs.push({
      targetZone: "玄关",
      cabinetType: "鞋柜",
      description: `建议 ${shoeCount.count} 组鞋柜模块（约 ${formatNumber(shoeCount.count * 0.8)}m）`,
      priority: "高",
    });
  }

  const hk = modules.find((m) => m.moduleId === "housekeepingModule");
  if (hk || input.oldHome.overflowZones.includes("阳台")) {
    recs.push({
      targetZone: "阳台/家政区",
      cabinetType: "家政柜",
      description: "保留家政柜用于吸尘器、清洁工具和洗护囤货",
      priority: "高",
    });
  }

  const deep = modules.find((m) => m.moduleId === "deepStorageModule");
  if (deep) {
    recs.push({
      targetZone: "储物间",
      cabinetType: "深收纳柜",
      description: `需要 ${deep.count} 组 60cm 深高柜存放行李箱与大件物品`,
      priority: "高",
    });
  }

  const kitchen = modules.filter((m) => m.moduleId === "applianceModule");
  if (kitchen.length > 0) {
    const count = kitchen.reduce((s, m) => s + m.count, 0);
    recs.push({
      targetZone: "厨房/餐边",
      cabinetType: "厨房高柜或餐边柜",
      description: `小家电与锅具建议 ${count} 组模块，避免挤占台面`,
      priority: "中",
    });
  }

  return recs;
}

function computeScore(risks: RiskFactor[], redundancyRate: number, input: AssessmentInput): number {
  let score = 85;
  for (const risk of risks) {
    if (risk.level === "高") score -= 12;
    if (risk.level === "中") score -= 6;
  }
  if (input.newHome.hasStorageRoom) score += 5;
  if (input.newHome.storagePriority === "收纳优先") score += 3;
  if (redundancyRate >= 0.35) score += 2;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildComparisonNotes(input: AssessmentInput): string[] {
  const notes: string[] = [];
  const areaDelta =
    ((input.newHome.newHomeArea - input.oldHome.oldHomeArea) / input.oldHome.oldHomeArea) * 100;

  if (areaDelta > 0) {
    notes.push(`新房面积较旧房增加约 ${areaDelta.toFixed(0)}%，但仍需关注收纳结构是否匹配物品类型。`);
  } else if (areaDelta < 0) {
    notes.push(`新房面积较旧房减少约 ${Math.abs(areaDelta).toFixed(0)}%，建议提高收纳效率或断舍离。`);
  }

  if (input.oldHome.overflowZones.length > 0) {
    notes.push(
      `旧房 ${input.oldHome.overflowZones.join("、")} 存在爆仓，新房需为这些品类分配专门空间。`
    );
  }

  if (input.oldHome.temporaryStorageZones.length > 0) {
    notes.push(
      `旧房临时堆放区（${input.oldHome.temporaryStorageZones.join("、")}）的物品需要在新房找到固定归属。`
    );
  }

  if (input.household.plansForChildren) {
    notes.push("计划生育会显著增加阶段型收纳压力，建议冗余率不低于 40%。");
  }

  if (!input.newHome.plannedCabinetZones.includes("餐边柜") && input.lifestyle.cookingFrequency >= 3) {
    notes.push("如果取消餐边柜，小家电将挤占厨房台面和高柜空间。");
  }

  return notes;
}

function buildDesignerChecklist(
  modules: ModuleResult[],
  input: AssessmentInput,
  recommendations: Recommendation[]
): string[] {
  const checklist: string[] = [];

  recommendations.filter((r) => r.priority === "高").forEach((r) => {
    checklist.push(`${r.targetZone}：${r.description}`);
  });

  const longHang = modules.find((m) => m.moduleId === "longHangModule");
  if (longHang) {
    checklist.push(`长挂区需连续高度 ≥ 150cm，长度 ≥ ${formatNumber(longHang.count * 0.8)}m`);
  }

  if (input.lifestyle.digitalDeviceLevel >= 3) {
    checklist.push("数码设备与线材需要分格收纳，避免与杂物混放");
  }

  if (input.oldHome.overflowZones.includes("厨房")) {
    checklist.push("高频厨房物品应放在腰部至视线高度，减少动线阻碍");
  }

  return checklist;
}

export function calculateAssessment(input: AssessmentInput): AssessmentResult {
  const modules = modulesForInventory(input.inventory);
  const netVolume = modules.reduce(
    (sum, m) => sum + moduleEffectiveVolume(m.moduleId) * m.count,
    0
  );
  const redundancyRate = computeRedundancyRate(input);
  const baseGross = modules.reduce((sum, m) => sum + m.grossVolume, 0);
  const grossVolume = baseGross * (1 + redundancyRate);
  const roomDemands = buildRoomDemands(modules);
  const roomComparison = buildRoomComparison(input, roomDemands, netVolume);
  const risks = assessRisks(input, modules, grossVolume);
  const recommendations = buildRecommendations(modules, input);
  const score = computeScore(risks, redundancyRate, input);
  const highRisks = risks.filter((r) => r.level === "高").length;
  const riskLevel = highRisks >= 2 ? "高" : highRisks >= 1 || risks.length >= 3 ? "中" : "低";

  return {
    score,
    riskLevel,
    netVolume: Math.round(netVolume * 100) / 100,
    grossVolume: Math.round(grossVolume * 100) / 100,
    redundancyRate: Math.round(redundancyRate * 100),
    modules,
    roomDemands,
    roomComparison,
    risks,
    recommendations,
    designerChecklist: buildDesignerChecklist(modules, input, recommendations),
    spacePriority: {
      keep: [
        ...(modules.some((m) => m.moduleId === "housekeepingModule") ? ["家政柜"] : []),
        ...(modules.some((m) => m.moduleId === "shoeModule") ? ["玄关鞋柜"] : []),
        ...(modules.some((m) => m.moduleId === "deepStorageModule") ? ["深收纳高柜"] : []),
        "主卧室衣柜",
      ],
      sacrifice: input.newHome.flexibleZones.length > 0 ? input.newHome.flexibleZones : ["装饰性开放格"],
      doNotCompress: [
        ...(modules.some((m) => m.moduleId === "longHangModule") ? ["长挂区连续高度"] : []),
        "高频清洁工具拿取路径",
      ],
    },
    comparisonNotes: buildComparisonNotes(input),
  };
}

function splitByOwner(total: number): { male: number; female: number } {
  if (total <= 0) return { male: 0, female: 0 };
  const female = Math.floor(total / 2);
  return { male: total - female, female };
}

function expandOwnerScopedBase(base: Record<string, number>): Record<string, number> {
  const ownerKeys = [
    "short-hang",
    "long-hang",
    "fold-clothing",
    "small-clothing",
    "seasonal-clothing",
    "daily-shoes",
    "seasonal-shoes",
    "bags",
  ] as const;
  const expanded = { ...base };

  for (const key of ownerKeys) {
    const total = expanded[key];
    if (total == null) continue;
    delete expanded[key];
    const { male, female } = splitByOwner(total);
    if (male > 0) expanded[`${key}-male`] = male;
    if (female > 0) expanded[`${key}-female`] = female;
  }

  return expanded;
}

export function generateQuickInventory(input: AssessmentInput): InventoryItem[] {
  const size = input.household.householdSize;
  const layoutMultiplier =
    input.newHome.newHomeLayout === "一居" ? 0.8 :
    input.newHome.newHomeLayout === "两居" ? 1 :
    input.newHome.newHomeLayout === "三居" ? 1.2 : 1.4;

  const base = expandOwnerScopedBase({
    "short-hang": Math.round(30 * size * layoutMultiplier),
    "long-hang": Math.round(8 * size),
    "fold-clothing": Math.round(40 * size),
    "small-clothing": Math.round(30 * size),
    "seasonal-clothing": Math.round(15 * input.lifestyle.seasonalClothingLevel),
    "daily-shoes": Math.round(6 * size),
    "seasonal-shoes": Math.round(4 * input.lifestyle.seasonalClothingLevel),
    "bags": Math.round(3 * size),
    "tableware": Math.round(20 * size),
    "cookware": Math.round(4 + input.lifestyle.cookingFrequency),
    "appliances": Math.round(2 + input.lifestyle.cookingFrequency),
    "food-stock": Math.round(input.lifestyle.stockpilingLevel * 1.5),
    "cleaning-tools": 5,
    "care-stock": Math.round(input.lifestyle.stockpilingLevel * 2),
    "tools-misc": 8,
    "digital-devices": Math.round(3 + input.lifestyle.digitalDeviceLevel * 2),
    "digital-accessories": Math.round(10 + input.lifestyle.digitalDeviceLevel * 5),
    "device-boxes": Math.round(input.lifestyle.digitalDeviceLevel * 3),
    "documents": 15,
    "memorabilia": Math.round(input.lifestyle.hobbyStorageLevel * 3),
    "luggage": Math.round(1 + input.lifestyle.travelFrequency),
    "sports-camping": Math.round(input.lifestyle.hobbyStorageLevel * 2),
    "children-items": input.household.hasChildren ? 30 : input.household.plansForChildren ? 15 : 0,
    "pet-items": input.household.hasPets ? 20 : 0,
  });

  return Object.entries(base)
    .filter(([, qty]) => qty > 0)
    .map(([categoryId, quantity]) => ({
      categoryId,
      quantity,
      unit: ITEM_CATEGORIES.find((c) => c.id === categoryId)?.unit ?? "件",
    }));
}
