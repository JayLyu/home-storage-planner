"use client";

import { RoomDemandVisualization } from "@/components/report/room-demand-visualization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconLabel } from "@/components/ui/icon-text";
import { useAssessment } from "@/lib/store";
import type { RiskLevel } from "@/lib/types";
import { cn, formatNumber, scoreLabel, scoreSummary } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeftRight,
  Box,
  ClipboardCheck,
  Download,
  LayoutGrid,
  ListChecks,
  PenLine,
  RefreshCw,
} from "lucide-react";

function riskBadgeVariant(level: RiskLevel): "destructive" | "secondary" | "outline" {
  if (level === "高") return "destructive";
  if (level === "中") return "secondary";
  return "outline";
}

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-lime-600";
  if (score >= 60) return "text-amber-600";
  return "text-destructive";
}

export function ResultStep() {
  const { result, computeResult, setStep, reset } = useAssessment();
  const data = result ?? computeResult();

  const handleExport = () => {
    const text = [
      `Home Storage Planner 评估报告`,
      ``,
      `收纳评分：${data.score} / 100`,
      `风险等级：${data.riskLevel}`,
      `总物品净需求：${formatNumber(data.netVolume)} m³`,
      `推荐柜体毛体积：${formatNumber(data.grossVolume)} m³`,
      `推荐冗余率：${data.redundancyRate}%`,
      ``,
      `旧房柜体容量（估算）：${formatNumber(data.roomComparison.totalOldCapacity)} m³`,
      `新房物品净需求：${formatNumber(data.netVolume)} m³`,
      `较旧房变化：${formatNumber(data.roomComparison.capacityDelta)} m³`,
      ``,
      `核心建议：`,
      ...data.recommendations.map((r, i) => `${i + 1}. ${r.description}`),
      ``,
      `风险报告：`,
      ...data.risks.map((r) => `- [${r.level}] ${r.riskType}：${r.suggestion}`),
      ``,
      `设计师沟通清单：`,
      ...data.designerChecklist.map((c) => `- ${c}`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "home-storage-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader>
          <CardDescription>评估结论</CardDescription>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <CardTitle className={cn("text-5xl tabular-nums", scoreColor(data.score))}>
              {data.score}
              <span className="text-xl font-normal text-muted-foreground"> / 100</span>
            </CardTitle>
            <Badge variant={riskBadgeVariant(data.riskLevel)} className="mb-1">
              {scoreLabel(data.score)} · 风险{data.riskLevel}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {scoreSummary(data.score, data.riskLevel)}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-background/80 p-4">
            <div className="text-sm text-muted-foreground">物品净需求</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(data.netVolume)} m³
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              扣除整理意愿后，实际需要收纳的物品体积
            </p>
          </div>
          <div className="rounded-lg border bg-background/80 p-4">
            <div className="text-sm text-muted-foreground">推荐柜体毛体积</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {formatNumber(data.grossVolume)} m³
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              含 {data.redundancyRate}% 操作冗余，便于取放与增长
            </p>
          </div>
        </CardContent>
      </Card>

      {data.comparisonNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <IconLabel icon={ArrowLeftRight}>旧房 → 新房对照</IconLabel>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {data.comparisonNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span>•</span>
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            <IconLabel icon={LayoutGrid}>分空间需求</IconLabel>
          </CardTitle>
          <CardDescription>
            总体量 {formatNumber(data.netVolume)} m³，共 {data.roomDemands.filter((r) => r.volume > 0).length} 个空间有收纳需求
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomDemandVisualization
            roomDemands={data.roomDemands}
            roomComparison={data.roomComparison}
            totalVolume={data.netVolume}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <IconLabel icon={Box}>柜体建议</IconLabel>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recommendations.map((rec) => (
            <Card key={rec.description} size="sm">
              <CardContent className="flex items-start gap-3 pt-4">
                <Badge variant={rec.priority === "高" ? "default" : "secondary"}>
                  {rec.priority}
                </Badge>
                <div>
                  <div className="text-sm font-medium">
                    {rec.targetZone} · {rec.cabinetType}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{rec.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <IconLabel icon={AlertTriangle}>风险报告</IconLabel>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.risks.length === 0 ? (
            <p className="text-sm text-muted-foreground">未发现明显风险，当前规划基本合理。</p>
          ) : (
            data.risks.map((risk) => (
              <Card key={risk.riskType + risk.evidence} size="sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={riskBadgeVariant(risk.level)}>{risk.level}</Badge>
                    <span className="font-medium">{risk.riskType}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{risk.evidence}</p>
                  <p className="mt-1 text-sm leading-relaxed">{risk.suggestion}</p>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <IconLabel icon={ListChecks}>空间优先级</IconLabel>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium text-emerald-700">优先保留</div>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {data.spacePriority.keep.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-amber-700">可牺牲</div>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {data.spacePriority.sacrifice.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-destructive">不建议压缩</div>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {data.spacePriority.doNotCompress.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <IconLabel icon={ClipboardCheck}>设计师沟通清单</IconLabel>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.designerChecklist.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button variant="secondary" onClick={() => setStep("inventory")}>
          <PenLine className="size-4" aria-hidden />
          调整输入
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="size-4" aria-hidden />
          导出报告
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RefreshCw className="size-4" aria-hidden />
          重新开始
        </Button>
      </div>
    </div>
  );
}
