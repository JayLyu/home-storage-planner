# Home Storage Planner

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 装修前家庭收纳空间评估工具 — 量化收纳需求，生成柜体建议与风险报告，帮助你在装修阶段与设计师清晰沟通。

**在线仓库**：[github.com/JayLyu/home-storage-planner](https://github.com/JayLyu/home-storage-planner)

---

## 为什么需要它

装修前，很多家庭只能靠设计师经验或主观感觉判断「柜子够不够」。Home Storage Planner 基于真实家庭信息、旧房现状、生活方式与物品盘点，将物品转换为**标准收纳模块**，输出：

- 总收纳需求体积与推荐柜体毛体积
- 分空间、分品类的收纳需求
- 柜体长度 / 类型建议与冗余率
- 容量、增长、大件、囤货等风险报告
- 可直接发给设计师的沟通清单

## 功能特性

| 模块 | 说明 |
| --- | --- |
| 多步骤向导 | 家庭信息 → 旧房现状 → 新房信息 → 生活方式 → 物品盘点 → 评估报告 |
| 三种盘点模式 | 快速估算 / 分类盘点 / 精细盘点 |
| 规则引擎 | 物品 → 收纳模块 → 柜体容量建议 |
| 风险评估 | 容量、增长、拿取、大件、囤货、阶段变化 |
| 报告导出 | 一键下载文本报告 |
| 响应式 UI | shadcn/ui + Lucide 图标，移动端纵向步骤导航 |

## 快速开始

### 环境要求

- Node.js 20+
- npm 10+

### 安装与运行

```bash
git clone https://github.com/JayLyu/home-storage-planner.git
cd home-storage-planner
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)，点击「开始评估」进入向导。

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
app/                    # Next.js App Router 页面
  page.tsx              # 首页
  assess/page.tsx       # 评估向导
components/
  ui/                   # shadcn/ui 组件
  wizard/               # 向导步骤与报告
  form-fields.tsx       # 表单字段组合
lib/
  types.ts              # 类型与步骤定义
  categories.ts         # 物品分类
  modules.ts            # 标准收纳模块
  calculate.ts          # 规则计算引擎
  store.tsx             # 客户端状态（localStorage）
docs/                   # PRD 与产品文档
AGENT.md                # AI / 协作者开发守则
```

## 技术栈

- **框架**：Next.js 16（App Router）
- **UI**：React 19、TypeScript、Tailwind CSS 4
- **组件**：shadcn/ui（Base UI）
- **图标**：lucide-react

## 产品范围（V1）

**做什么**：手动盘点 + 规则换算 + 风险解释 + 报告导出

**不做**：CAD 绘图、自动布局、平面图识别、LiDAR/图像识别、电商报价、LLM 精确计算（后续版本规划见 PRD）

详细需求见 [`docs/Home Storage Planner PRD V1 补充版.md`](./docs/Home%20Storage%20Planner%20PRD%20V1%20补充版.md)

## 参与开发

1. Fork 本仓库并创建功能分支
2. 阅读 [`AGENT.md`](./AGENT.md) 了解开发守则
3. 确保 `npm run build` 与 `npm run lint` 通过
4. 提交 Pull Request（Commit message 建议使用中文）

## 路线图（摘要）

- **V2**：户型图联动
- **V3**：3D 白模与动线检查
- **V4**：长期 AI Agent 与消费趋势跟踪

## License

[MIT](./LICENSE) © JayLyu
