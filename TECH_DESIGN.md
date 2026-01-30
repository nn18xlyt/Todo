# 技术设计

## 技术栈
前端用 React + TypeScript + Vite，状态管理用 Zustand（一个轻量级的状态管理库，比 Redux 简单很多），样式用 Tailwind CSS，日期处理用 date-fns，数据存储用 LocalStorage。

## 项目结构

建议结构（按功能拆）：

```
src/
  app/
    App.tsx
    routes.ts
  components/
    layout/
    todo/
    category/
    stats/
    common/
  store/
    index.ts
    todoStore.ts
  domain/
    types.ts
    selectors.ts
  lib/
    storage.ts
    id.ts
    dates.ts
  styles/
    globals.css
```

## 数据模型

### Todo
- `id`: string
- `title`: string
- `description`: string
- `dueDate`: string | null（ISO 日期，精度到日，如 `2026-01-30`）
- `priority`: `"P0" | "P1" | "P2"`
- `categoryId`: string | null
- `completed`: boolean
- `createdAt`: number（ms）
- `updatedAt`: number（ms）

### Category
- `id`: string
- `name`: string
- `createdAt`: number（ms）

### 过滤与排序状态
- `status`: `"all" | "active" | "completed"`
- `priority`: `"all" | "P0" | "P1" | "P2"`
- `categoryId`: `"all" | string`
- `query`: string
- `sort`: `"default"`（当前只做一种，后续可扩）

## 状态管理（Zustand）

### Store 形态
- 单 store，多 slice。
- actions 只做状态变更。
- 过滤/排序/统计用 selector 计算。

建议拆分：
- `todos`: Todo[]
- `categories`: Category[]
- `filters`: FilterState
- `ui`: `{ editingTodoId?: string }`

核心 actions：
- `addTodo(payload)`
- `updateTodo(id, patch)`
- `toggleTodo(id)`
- `deleteTodo(id)`
- `addCategory(name)`
- `renameCategory(id, name)`
- `deleteCategory(id)`（同时把相关 todo 的 `categoryId` 置空）
- `setFilters(patch)`
- `hydrate()` / `reset()`

## 筛选 / 搜索 / 排序

### 搜索
- 匹配字段：`title` + `description`。
- 规则：大小写不敏感，包含即可。

### 筛选
- 状态：
  - `active`：`completed=false`
  - `completed`：`completed=true`
- 优先级：按 `priority` 精确匹配。
- 分类：按 `categoryId` 精确匹配，空值视为“未分类”。

### 默认排序（PRD 同步）
排序键（从高到低）：
- 未完成在前。
- 有截止日期在前。
- 截止日期更早在前。
- `createdAt` 新的在前。

日期比较建议：
- 用 `date-fns` 解析 `yyyy-MM-dd`。
- 逾期判断用本地“今天”。

## LocalStorage 设计

### Key 与版本
- key：`todo_app_state_v1`
- 数据带 `version` 字段，方便迁移。

### Schema
```ts
type PersistedStateV1 = {
  version: 1
  todos: Todo[]
  categories: Category[]
  filters: FilterState
}
```

### 读写策略
- 写入：store 变更后节流（例如 300-500ms）。
- 读取：应用启动时 `hydrate()`。
- 容错：
  - JSON 解析失败：提示 + 回退空数据。
  - version 不匹配：走迁移或回退。

## 样式与 UI 约束

### 与 `AGENTS.md` 的对齐
- 允许用 Tailwind 做排版与布局。
- 不使用 Tailwind 默认色板类名（如 `bg-slate-900`）。
- 颜色用自定义 token：
  - CSS 变量（推荐）：`bg-[color:var(--bg-0)]`。
  - 或 Tailwind `theme.extend.colors` 的自定义命名（不要用默认名字）。
- 背景必须有噪点纹理或渐变。
- 动效不要用 `ease-in-out`，用自定义 `cubic-bezier(...)`。
- 图标统一走 Iconify。

## 错误处理
- LocalStorage 读写失败：给出可恢复提示（例如“存不进去，先用临时模式”）。
- 表单校验：标题为空、长度超限要明确提示。
- 删除分类/任务：二次确认。

## 测试策略
- 单元测试：
  - selector（筛选/排序/统计）。
  - storage 读写与迁移。
- 组件测试：
  - 新增任务流程。
  - 筛选与搜索联动。

## 性能与体验
- 列表渲染：先不做虚拟滚动，任务量 > 300 再评估。
- 计算型 selector 用 memo（按依赖）。
- 输入搜索做防抖（200-300ms）。



