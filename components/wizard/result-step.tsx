"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useAssessment } from "@/lib/store";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

function riskColor(level: RiskLevel) {
  if (level === "高") return "text-red-600 bg-red-50 border-red-200";
  if (level === "中") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-emerald-700 bg-emerald-50 border-emerald-200";
}

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-lime-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
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
          <CardDescription>收纳评分</CardDescription>
          <div className={cn("mt-2 text-4xl font-bold", scoreColor(data.score))}>
            {data.score}
            <span className="text-lg font-normal text-stone-400"> / 100</span>
          </div>
        </Card>
        <Card>
          <CardDescription>风险等级</CardDescription>
          <div className={cn("mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium", riskColor(data.riskLevel))}>
            {data.riskLevel}
          </div>
        </Card>
        <Card>
          <CardDescription>物品净需求</CardDescription>
          <div className="mt-2 text-3xl font-bold text-stone-900">{data.netVolume} m³</div>
        </Card>
        <Card>
          <CardDescription>推荐柜体毛体积</CardDescription>
          <div className="mt-2 text-3xl font-bold text-stone-900">{data.grossVolume} m³</div>
          <p className="mt-1 text-xs text-stone-500">冗余率 {data.redundancyRate}%</p>
        </Card>
      </div>

      {data.comparisonNotes.length > 0 && (
        <Card>
          <CardTitle>旧房 → 新房对照</CardTitle>
          <ul className="mt-4 space-y-2">
            {data.comparisonNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm text-stone-600">
                <span className="text-stone-400">•</span>
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <CardTitle>分空间需求</CardTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.roomDemands
            .filter((r) => r.volume > 0)
            .map((room) => (
              <div key={room.room} className="rounded-xl bg-stone-50 p-4">
                <div className="font-medium text-stone-800">{room.room}</div>
                <div className="mt-1 text-2xl font-semibold text-stone-900">{room.volume.toFixed(1)} m³</div>
                <div className="mt-2 text-xs text-stone-500">
                  {room.modules.map((m) => `${m.moduleName} ×${m.count}`).join("、")}
                </div>
              </div>
            ))}
        </div>
      </Card>

      <Card>
        <CardTitle>柜体建议</CardTitle>
        <div className="mt-4 space-y-3">
          {data.recommendations.map((rec) => (
            <div key={rec.description} className="flex items-start gap-3 rounded-xl border border-stone-100 p-4">
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                  rec.priority === "高" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-700"
                )}
              >
                {rec.priority}
              </span>
              <div>
                <div className="text-sm font-medium text-stone-800">
                  {rec.targetZone} · {rec.cabinetType}
                </div>
                <div className="mt-1 text-sm text-stone-600">{rec.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>风险报告</CardTitle>
        <div className="mt-4 space-y-3">
          {data.risks.length === 0 ? (
            <p className="text-sm text-stone-500">未发现明显风险，当前规划基本合理。</p>
          ) : (
            data.risks.map((risk) => (
              <div key={risk.riskType + risk.evidence} className="rounded-xl border border-stone-100 p-4">
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", riskColor(risk.level))}>
                    {risk.level}
                  </span>
                  <span className="font-medium text-stone-800">{risk.riskType}</span>
                </div>
                <p className="mt-2 text-sm text-stone-500">{risk.evidence}</p>
                <p className="mt-1 text-sm text-stone-700">{risk.suggestion}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>空间优先级</CardTitle>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="font-medium text-emerald-700">优先保留</div>
              <ul className="mt-1 list-inside list-disc text-stone-600">
                {data.spacePriority.keep.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-amber-700">可牺牲</div>
              <ul className="mt-1 list-inside list-disc text-stone-600">
                {data.spacePriority.sacrifice.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-red-700">不建议压缩</div>
              <ul className="mt-1 list-inside list-disc text-stone-600">
                {data.spacePriority.doNotCompress.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>设计师沟通清单</CardTitle>
          <ul className="mt-4 space-y-2">
            {data.designerChecklist.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-stone-600">
                <span className="text-stone-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-6">
        <Button variant="secondary" onClick={() => setStep("inventory")}>
          调整输入
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          导出报告
        </Button>
        <Button variant="ghost" onClick={reset}>
          重新开始
        </Button>
      </div>
    </div>
  );
}
