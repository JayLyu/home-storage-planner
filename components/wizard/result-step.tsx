"use client";

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
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeftRight,
  Box,
  ClipboardCheck,
  Download,
  Gauge,
  LayoutGrid,
  ListChecks,
  Package,
  PenLine,
  RefreshCw,
  ShieldAlert,
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
      `总物品净需求：${data.netVolume} m³`,
      `推荐柜体毛体积：${data.grossVolume} m³`,
      `推荐冗余率：${data.redundancyRate}%`,
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
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>
              <IconLabel icon={Gauge}>收纳评分</IconLabel>
            </CardDescription>
            <CardTitle className={cn("text-4xl", scoreColor(data.score))}>
              {data.score}
              <span className="text-lg font-normal text-muted-foreground"> / 100</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              <IconLabel icon={ShieldAlert}>风险等级</IconLabel>
            </CardDescription>
            <Badge variant={riskBadgeVariant(data.riskLevel)} className="mt-2">
              {data.riskLevel}
            </Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              <IconLabel icon={Box}>物品净需求</IconLabel>
            </CardDescription>
            <CardTitle className="text-3xl">{data.netVolume} m³</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              <IconLabel icon={Package}>推荐柜体毛体积</IconLabel>
            </CardDescription>
            <CardTitle className="text-3xl">{data.grossVolume} m³</CardTitle>
            <CardDescription>冗余率 {data.redundancyRate}%</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {data.comparisonNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <IconLabel icon={ArrowLeftRight}>旧房 → 新房对照</IconLabel>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.roomDemands
            .filter((r) => r.volume > 0)
            .map((room) => (
              <Card key={room.room} size="sm" className="bg-muted/40">
                <CardHeader>
                  <CardTitle>{room.room}</CardTitle>
                  <CardDescription className="text-2xl font-semibold text-foreground">
                    {room.volume.toFixed(1)} m³
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {room.modules.map((m) => `${m.moduleName} ×${m.count}`).join("、")}
                </CardContent>
              </Card>
            ))}
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
                  <p className="mt-2 text-sm text-muted-foreground">{risk.evidence}</p>
                  <p className="mt-1 text-sm">{risk.suggestion}</p>
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
