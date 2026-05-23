# AGENT.md — Home Storage Planner 开发守则

本文档面向 AI Agent 与人类协作者，定义本仓库的开发边界、约定与优先级。开始任何任务前请先阅读本文档与 `docs/` 中的 PRD。

## 项目定位

Home Storage Planner 是**装修前收纳需求评估工具**，不是 CAD、不是柜体布局器、不是效果图软件。

V1 核心闭环：

```
家庭/旧房/新房/生活方式输入 → 物品盘点 → 规则换算 → 风险评估 → 报告输出
```

## 技术栈（不得随意替换）

| 层级 | 选型 |
| --- | --- |
| 框架 | Next.js 16 App Router |
| UI | React 19 + TypeScript |
| 样式 | Tailwind CSS 4 |
| 组件库 | **shadcn/ui**（`components/ui/`） |
| 图标 | **lucide-react** |
| 状态 | React Context + localStorage（`lib/store.tsx`） |

### UI 硬性规则

1. **禁止**在 `components/ui/` 外手写基础 UI 原语（Button、Input、Card 等）；需要新组件时用 CLI 添加：

   ```bash
   npx shadcn@latest add <component> --overwrite -y
   ```

2. **禁止**引入 Ant Design、MUI 等第二套组件库。
3. 业务表单复用 `components/form-fields.tsx`（基于 shadcn 的组合封装），不要新建平行表单体系。
4. 图标统一使用 Lucide，保持 `size-4` / `aria-hidden` 惯例；步骤图标映射在 `lib/step-icons.tsx`。
5. 用户可见文案使用**中文**。

## 目录职责

```
app/                  # 路由与页面（尽量薄）
components/
  ui/                 # shadcn 生成组件（少改、用 CLI 更新）
  wizard/             # 评估向导步骤
  form-fields.tsx     # 可复用表单字段组合
lib/
  types.ts            # 领域类型与向导步骤定义
  categories.ts       # 物品分类
  modules.ts          # 标准收纳模块
  calculate.ts        # 规则引擎（核心逻辑）
  store.tsx           # 客户端状态
docs/                 # PRD 与产品文档
```

## 计算与数据规则

1. **精确数值计算**必须在 `lib/calculate.ts` 完成，UI 层只做展示与格式化。
2. LLM **不负责**模块数量与体积计算（PRD 13 节）；V1 不做 LLM 集成，除非明确要求。
3. 修改分类、模块、冗余率、风险规则时，需能追溯到 PRD 或注释说明依据。
4. 新增物品分类时，同时更新 `lib/categories.ts` 与 PRD 分类表（或文档注释）。

## 代码风格

1. **最小改动**：只改与任务相关的文件，不顺手重构无关代码。
2. **匹配现有风格**：命名、导入路径（`@/`）、组件粒度与周边文件保持一致。
3. **类型优先**：避免 `any`；Wizard 步骤 ID 使用 `WizardStepId`。
4. **Client 边界**：仅交互组件加 `"use client"`；页面默认可为 Server Component。
5. 不为显而易见的行为写测试/注释；注释只解释非显而易见的业务规则。

## 开发命令

```bash
npm install
npm run dev      # http://localhost:3000（监听 0.0.0.0）
npm run build    # 提交前必须通过
npm run lint
```

## Git 与发布

1. **不要**提交 `.env*`、密钥、本地 `.next/`。
2. Commit message 使用**中文**，说明「为什么」而不只是「做了什么」。
3. 未经用户明确要求，不要 `git push`、`force push` 或 amend 已推送提交。
4. 功能完成以 `npm run build` 通过为最低验收标准。

## V1 明确不做

- CAD 级精确绘图、自动柜体布局
- 平面图 / LiDAR / 图像识别
- 电商接入、定制报价、毫米级生产尺寸
- 替代设计师做最终结构设计

## 常见任务指引

| 任务 | 建议入口 |
| --- | --- |
| 新增向导步骤 | `lib/types.ts` → `components/wizard/` → `app/assess/page.tsx` |
| 调整收纳算法 | `lib/calculate.ts`、`lib/modules.ts` |
| 新增 shadcn 组件 | `npx shadcn@latest add ...` |
| 步骤 UI / 响应式 | `components/wizard/step-indicator.tsx` |
| 产品需求变更 | 先更新 `docs/` PRD，再改代码 |

## 参考

- PRD：`docs/Home Storage Planner PRD V1 补充版.md`
- 仓库：https://github.com/JayLyu/home-storage-planner
