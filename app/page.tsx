import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLabel } from "@/components/ui/icon-text";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowRightLeft, Clock, Package, ShieldAlert } from "lucide-react";

const FEATURES = [
  {
    title: "15 分钟",
    desc: "快速估算模式，基于画像生成基线",
    icon: Clock,
  },
  {
    title: "规则换算",
    desc: "物品 → 收纳模块 → 柜体建议",
    icon: ArrowRightLeft,
  },
  {
    title: "风险报告",
    desc: "容量、增长、大件与爆仓分析",
    icon: ShieldAlert,
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <IconLabel icon={Package} className="font-semibold text-foreground">
            Home Storage Planner
          </IconLabel>
          <Link href="/assess" className={buttonVariants({ variant: "ghost" })}>
            开始评估
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-20">
        <div className="max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            装修前收纳评估
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            量化你的收纳需求，
            <br />
            与设计师清晰沟通
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            基于家庭信息、旧房现状、生活方式和物品盘点，将物品转换为标准收纳模块，
            输出新房所需的收纳容量、柜体建议与风险报告。
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/assess" className={cn(buttonVariants(), "min-w-[160px] justify-center")}>
              开始评估
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/assess?mode=quick"
              className={cn(buttonVariants({ variant: "secondary" }), "min-w-[160px] justify-center")}
            >
              <Clock className="size-4" aria-hidden />
              快速估算
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            快速估算会默认使用「快速盘点」模式，约 15 分钟完成
          </p>

          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            {FEATURES.map((item) => (
              <Card key={item.title} className="border-muted/80">
                <CardHeader>
                  <CardTitle className="text-base">
                    <IconLabel icon={item.icon}>{item.title}</IconLabel>
                  </CardTitle>
                  <CardDescription className="leading-relaxed">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Home Storage Planner · V1 MVP
      </footer>
    </div>
  );
}
