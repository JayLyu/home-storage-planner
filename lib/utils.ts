import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 格式化为最多 maxDecimals 位小数，并去掉多余尾随 0 */
export function formatNumber(value: number, maxDecimals = 2): string {
  const rounded = Math.round(value * 10 ** maxDecimals) / 10 ** maxDecimals;
  return rounded.toFixed(maxDecimals).replace(/\.?0+$/, "");
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "规划充分";
  if (score >= 75) return "基本合理";
  if (score >= 60) return "存在缺口";
  return "需要加强";
}

export function scoreSummary(score: number, riskLevel: string): string {
  if (score >= 75 && riskLevel === "低") {
    return "当前收纳规划与家庭需求基本匹配，可按报告清单与设计师沟通细节。";
  }
  if (score >= 60) {
    return "部分空间容量偏紧或存在增长风险，建议优先关注报告中的高风险项与柜体建议。";
  }
  return "收纳容量明显不足，请重点核对分空间需求与柜体建议，必要时增加储物面积。";
}
