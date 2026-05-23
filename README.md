# Home Storage Planner

装修前家庭收纳空间评估工具。基于 PRD V1，帮助用户在装修阶段量化收纳需求、生成柜体建议与风险报告。

## 功能

- 多步骤向导：家庭信息 → 旧房现状 → 新房信息 → 生活方式 → 物品盘点 → 评估报告
- 三种盘点模式：快速估算、分类盘点、精细盘点
- 规则引擎：物品 → 标准收纳模块 → 柜体容量建议
- 风险评估：容量、增长、大件、囤货、爆仓区域
- 报告导出：一键下载文本报告

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui（Base UI + Radix 风格组件）

## 开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 构建

```bash
npm run build
npm start
```

## 项目结构

```
app/           # 页面路由
components/    # UI 与向导组件
lib/           # 类型、分类、计算引擎、状态管理
docs/          # PRD 文档
```

## 说明

V1 聚焦「手动盘点 + 规则换算 + 风险解释」，不做 CAD 绘图、自动布局或 LLM 集成（后续版本）。
