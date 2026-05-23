"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OldRoomEstimate, RoomDemand, RoomDemandComparison } from "@/lib/types";
import {
  ROOM_BAR_BG,
  cabinetLengthHint,
  volumeScaleHint,
} from "@/lib/volume-scale";
import { cn, formatNumber } from "@/lib/utils";
import {
  ArrowRight,
  Bed,
  DoorOpen,
  Sofa,
  Sun,
  UtensilsCrossed,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { RoomZone } from "@/lib/types";

const ROOM_ICONS: Record<RoomZone, LucideIcon> = {
  玄关: DoorOpen,
  客厅: Sofa,
  厨房: UtensilsCrossed,
  卧室: Bed,
  阳台: Sun,
  储物间: Warehouse,
};

interface RoomDemandVisualizationProps {
  roomDemands: RoomDemand[];
  roomComparison: RoomDemandComparison;
  totalVolume: number;
}

function formatDelta(delta: number): string {
  if (delta > 0) return `+${formatNumber(delta)}`;
  if (delta < 0) return formatNumber(delta);
  return "0";
}

function deltaTone(delta: number): string {
  if (delta > 0.05) return "text-amber-700";
  if (delta < -0.05) return "text-emerald-700";
  return "text-muted-foreground";
}

export function RoomDemandVisualization({
  roomDemands,
  roomComparison,
  totalVolume,
}: RoomDemandVisualizationProps) {
  const activeRooms = roomDemands
    .filter((r) => r.volume > 0)
    .sort((a, b) => b.volume - a.volume);

  const oldByRoom = new Map(
    roomComparison.oldRoomEstimates.map((item) => [item.room, item])
  );

  if (activeRooms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">暂无分空间收纳需求数据。</p>
    );
  }

  const maxVolume = activeRooms[0]?.volume ?? 1;
  const { capacityDelta, capacityDeltaPct, totalOldCapacity, totalOldEffectiveLoad } =
    roomComparison;

  return (
    <div className="space-y-6">
      <Card className="border-dashed bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">旧房 → 新房收纳对比</CardTitle>
          <CardDescription>
            旧房数据来自柜体长度与爆仓区域估算；新房为物品盘点后的净需求
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/80 p-3">
              <p className="text-xs text-muted-foreground">旧房柜体容量（估算）</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatNumber(totalOldCapacity)} m³
              </p>
              {totalOldEffectiveLoad > totalOldCapacity ? (
                <p className="mt-1 text-xs text-amber-700">
                  含爆仓压力约 {formatNumber(totalOldEffectiveLoad)} m³
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              <ArrowRight className="size-5" aria-hidden />
            </div>
            <div className="rounded-lg border bg-background/80 p-3">
              <p className="text-xs text-muted-foreground">新房物品净需求</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatNumber(totalVolume)} m³
              </p>
              <p className={cn("mt-1 text-xs tabular-nums", deltaTone(capacityDelta))}>
                较旧房柜体 {formatDelta(capacityDelta)} m³
                {totalOldCapacity > 0 ? `（${capacityDeltaPct > 0 ? "+" : ""}${capacityDeltaPct}%）` : null}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>旧房柜体</span>
              <span>新房需求</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground/35"
                  style={{
                    width: `${Math.min(100, (totalOldCapacity / Math.max(totalVolume, totalOldCapacity, 0.01)) * 100)}%`,
                  }}
                />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{
                    width: `${Math.min(100, (totalVolume / Math.max(totalVolume, totalOldCapacity, 0.01)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">尺度参照</p>
        <ul className="mt-2 space-y-1">
          <li>· 1 m³ ≈ 1 台双门冰箱的体积</li>
          <li>· 1 组顶天立地高柜（80×60×240 cm）≈ 1.15 m³</li>
          <li>· 下方彩色条长度 = 该空间占新房总量比例</li>
        </ul>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">新房空间占比分布</p>
        <div
          className="flex h-10 w-full overflow-hidden rounded-lg ring-1 ring-border"
          role="img"
          aria-label="各空间收纳需求占比"
        >
          {activeRooms.map((room) => {
            const pct = totalVolume > 0 ? (room.volume / totalVolume) * 100 : 0;
            if (pct <= 0) return null;
            return (
              <div
                key={room.room}
                className={cn(
                  "relative h-full min-w-[2px] transition-all",
                  ROOM_BAR_BG[room.room]
                )}
                style={{ width: `${pct}%` }}
                title={`${room.room} ${formatNumber(room.volume)} m³（${formatNumber(pct)}%）`}
              >
                {pct >= 12 ? (
                  <span className="absolute inset-0 flex items-center justify-center px-1 text-[10px] font-medium text-white/95 drop-shadow-sm">
                    {room.room}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {activeRooms.map((room) => {
            const pct = totalVolume > 0 ? (room.volume / totalVolume) * 100 : 0;
            const Icon = ROOM_ICONS[room.room];
            return (
              <span key={room.room} className="inline-flex items-center gap-1.5">
                <span className={cn("size-2.5 shrink-0 rounded-sm", ROOM_BAR_BG[room.room])} />
                <Icon className="size-3 shrink-0" aria-hidden />
                {room.room} {formatNumber(pct)}%
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {activeRooms.map((room) => {
          const Icon = ROOM_ICONS[room.room];
          const pct = totalVolume > 0 ? (room.volume / totalVolume) * 100 : 0;
          const barWidth = maxVolume > 0 ? (room.volume / maxVolume) * 100 : 0;
          const lengthHint = cabinetLengthHint(room.modules);
          const oldEstimate = oldByRoom.get(room.room);
          const roomDelta =
            oldEstimate != null
              ? Math.round((room.volume - oldEstimate.capacity) * 100) / 100
              : null;

          return (
            <Card key={room.room} size="sm" className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <span className="inline-flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    {room.room}
                    {oldEstimate?.isOverflow ? (
                      <Badge variant="destructive" className="text-[10px] font-normal">
                        旧房爆仓
                      </Badge>
                    ) : null}
                  </span>
                  <span className="text-lg tabular-nums">{formatNumber(room.volume)} m³</span>
                </CardTitle>
                <CardDescription>{volumeScaleHint(room.volume)}</CardDescription>
                {oldEstimate && roomDelta != null ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    旧房柜体约 {formatNumber(oldEstimate.capacity)} m³
                    {oldEstimate.isOverflow
                      ? `，有效负载约 ${formatNumber(oldEstimate.effectiveLoad)} m³`
                      : null}
                    <span className={cn("ml-1 tabular-nums", deltaTone(roomDelta))}>
                      → 新房 {formatDelta(roomDelta)} m³
                    </span>
                  </p>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-3">
                {oldEstimate && oldEstimate.capacity > 0 ? (
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>旧房柜体</span>
                      <span className="tabular-nums">{formatNumber(oldEstimate.capacity)} m³</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-muted-foreground/40"
                        style={{
                          width: `${Math.min(100, (oldEstimate.capacity / Math.max(room.volume, oldEstimate.capacity, 0.01)) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="mb-1 mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>新房需求</span>
                      <span className="tabular-nums">{formatNumber(room.volume)} m³</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", ROOM_BAR_BG[room.room])}
                        style={{
                          width: `${Math.min(100, (room.volume / Math.max(room.volume, oldEstimate.capacity, 0.01)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>占总量 {formatNumber(pct)}%</span>
                      {lengthHint ? <span>{lengthHint}</span> : null}
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", ROOM_BAR_BG[room.room])}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {room.modules.map((m) => (
                    <span
                      key={`${room.room}-${m.moduleId}`}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {m.moduleName} ×{m.count}
                    </span>
                  ))}
                </div>

                {oldEstimate?.isOverflow ? (
                  <RoomLoadComparison
                    oldEstimate={oldEstimate}
                    modules={room.modules}
                    roomVolume={room.volume}
                  />
                ) : (
                  <RoomModuleBlocks modules={room.modules} roomVolume={room.volume} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/** 爆仓空间：旧房负载 vs 新房模块 */
function RoomLoadComparison({
  oldEstimate,
  modules,
  roomVolume,
}: {
  oldEstimate: OldRoomEstimate;
  modules: RoomDemand["modules"];
  roomVolume: number;
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">旧房负载 vs 新房模块示意</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Before · 旧房
          </p>
          <OldLoadBlocks effectiveLoad={oldEstimate.effectiveLoad} maxVolume={roomVolume} />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            After · 新房
          </p>
          <RoomModuleBlocks modules={modules} roomVolume={roomVolume} compact />
        </div>
      </div>
    </div>
  );
}

function OldLoadBlocks({
  effectiveLoad,
  maxVolume,
}: {
  effectiveLoad: number;
  maxVolume: number;
}) {
  const blockCount = Math.min(8, Math.max(3, Math.ceil(effectiveLoad / 0.45)));
  const base = effectiveLoad / blockCount;

  return (
    <div className="flex flex-wrap items-end gap-1">
      {Array.from({ length: blockCount }, (_, i) => {
        const ratio = Math.sqrt(base / Math.max(maxVolume, effectiveLoad, 0.01));
        const size = Math.max(12, Math.min(44, ratio * 120));
        return (
          <div
            key={`old-${i}`}
            className="rounded-sm bg-muted-foreground/25 ring-1 ring-muted-foreground/30"
            style={{ width: size, height: size }}
            title={`旧房有效负载 ${formatNumber(effectiveLoad)} m³`}
          />
        );
      })}
    </div>
  );
}

/** 用方块堆叠示意模块数量与相对体量 */
function RoomModuleBlocks({
  modules,
  roomVolume,
  compact = false,
}: {
  modules: RoomDemand["modules"];
  roomVolume: number;
  compact?: boolean;
}) {
  if (modules.length === 0 || roomVolume <= 0) return null;

  const blocks = modules.flatMap((m) =>
    Array.from({ length: Math.min(m.count, 8) }, (_, i) => ({
      key: `${m.moduleId}-${i}`,
      volume: m.grossVolume / m.count,
      label: m.moduleName,
    }))
  );

  const shown = blocks.slice(0, compact ? 10 : 12);
  const extra = blocks.length - shown.length;

  return (
    <div>
      {!compact ? (
        <p className="mb-2 text-xs text-muted-foreground">模块体量示意（方块面积 ∝ 体积）</p>
      ) : null}
      <div className="flex flex-wrap items-end gap-1">
        {shown.map((block) => {
          const ratio = Math.sqrt(block.volume / roomVolume);
          const size = Math.max(12, Math.min(48, ratio * 120));
          return (
            <div
              key={block.key}
              className="rounded-sm bg-primary/20 ring-1 ring-primary/30"
              style={{ width: size, height: size }}
              title={`${block.label} ${formatNumber(block.volume)} m³`}
            />
          );
        })}
        {extra > 0 && (
          <span className="pb-1 text-xs text-muted-foreground">+{extra} 组</span>
        )}
      </div>
    </div>
  );
}
