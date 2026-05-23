import type { RoomZone } from "./types";
import { formatNumber } from "./utils";

/** 常见参照物体积（m³），用于帮助用户建立尺度感 */
export const VOLUME_REFERENCES = {
  /** 标准双门冰箱 */
  fridge: 0.6,
  /** 80×60×240cm 顶天立地柜（毛体积） */
  tallCabinet: 1.15,
  /** 80×60×100cm 短柜模块（毛体积） */
  shortCabinet: 0.48,
} as const;

export function volumeScaleHint(volumeM3: number): string {
  if (volumeM3 <= 0) return "";

  const { fridge, tallCabinet, shortCabinet } = VOLUME_REFERENCES;

  if (volumeM3 < shortCabinet * 0.6) {
    return "约等于一组玄关鞋柜的体量";
  }

  const fridgeCount = volumeM3 / fridge;
  if (fridgeCount < 1.8) {
    return `约等于 ${formatNumber(fridgeCount)} 台双门冰箱的占用空间`;
  }

  const tallCount = volumeM3 / tallCabinet;
  if (tallCount < 3.5) {
    return `约等于 ${formatNumber(tallCount)} 组顶天立地高柜（80×60×240cm）的体量`;
  }

  const floorArea = volumeM3;
  return `约等于 ${formatNumber(floorArea)}㎡ 地面堆高 1m 的杂物量`;
}

export function cabinetLengthHint(modules: { moduleId: string; count: number }[]): string | null {
  let lengthM = 0;
  for (const m of modules) {
    // 80cm 宽模块占主导，用 count × 0.8m 估算柜体总长度
    lengthM += m.count * 0.8;
  }
  if (lengthM <= 0) return null;
  return `柜体展开约 ${formatNumber(lengthM)}m`;
}

export const ROOM_COLORS: Record<RoomZone, string> = {
  玄关: "bg-sky-500",
  客厅: "bg-violet-500",
  厨房: "bg-amber-500",
  卧室: "bg-primary",
  阳台: "bg-emerald-500",
  储物间: "bg-orange-500",
};

export const ROOM_BAR_BG: Record<RoomZone, string> = {
  玄关: "bg-sky-500/85",
  客厅: "bg-violet-500/85",
  厨房: "bg-amber-500/85",
  卧室: "bg-primary/85",
  阳台: "bg-emerald-500/85",
  储物间: "bg-orange-500/85",
};
