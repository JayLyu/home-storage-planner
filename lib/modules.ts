import type { RoomZone } from "./types";

export interface StorageModuleDef {
  id: string;
  name: string;
  width: number;
  depth: number;
  height: number;
  effectiveRate: number;
  defaultRoom: RoomZone;
}

export const STORAGE_MODULES: Record<string, StorageModuleDef> = {
  shortHangModule: {
    id: "shortHangModule",
    name: "短挂模块",
    width: 80,
    depth: 60,
    height: 100,
    effectiveRate: 0.65,
    defaultRoom: "卧室",
  },
  longHangModule: {
    id: "longHangModule",
    name: "长挂模块",
    width: 80,
    depth: 60,
    height: 150,
    effectiveRate: 0.65,
    defaultRoom: "卧室",
  },
  drawerModule: {
    id: "drawerModule",
    name: "抽屉模块",
    width: 60,
    depth: 45,
    height: 20,
    effectiveRate: 0.7,
    defaultRoom: "卧室",
  },
  shelfModule: {
    id: "shelfModule",
    name: "层板模块",
    width: 80,
    depth: 45,
    height: 35,
    effectiveRate: 0.7,
    defaultRoom: "卧室",
  },
  deepStorageModule: {
    id: "deepStorageModule",
    name: "深收纳模块",
    width: 60,
    depth: 60,
    height: 240,
    effectiveRate: 0.55,
    defaultRoom: "储物间",
  },
  housekeepingModule: {
    id: "housekeepingModule",
    name: "家政模块",
    width: 80,
    depth: 60,
    height: 240,
    effectiveRate: 0.6,
    defaultRoom: "阳台",
  },
  shoeModule: {
    id: "shoeModule",
    name: "鞋柜模块",
    width: 80,
    depth: 35,
    height: 100,
    effectiveRate: 0.65,
    defaultRoom: "玄关",
  },
  applianceModule: {
    id: "applianceModule",
    name: "小家电模块",
    width: 80,
    depth: 60,
    height: 90,
    effectiveRate: 0.65,
    defaultRoom: "厨房",
  },
  digitalModule: {
    id: "digitalModule",
    name: "数码模块",
    width: 60,
    depth: 45,
    height: 120,
    effectiveRate: 0.7,
    defaultRoom: "客厅",
  },
  displayModule: {
    id: "displayModule",
    name: "展示模块",
    width: 80,
    depth: 35,
    height: 120,
    effectiveRate: 0.6,
    defaultRoom: "客厅",
  },
};

export function moduleGrossVolume(moduleId: string): number {
  const mod = STORAGE_MODULES[moduleId];
  if (!mod) return 0;
  return (mod.width * mod.depth * mod.height) / 1_000_000;
}

export function moduleEffectiveVolume(moduleId: string): number {
  const mod = STORAGE_MODULES[moduleId];
  if (!mod) return 0;
  return moduleGrossVolume(moduleId) * mod.effectiveRate;
}
