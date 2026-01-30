# 页面与组件清单

## 页面信息架构

### 页面 1：任务台（/）
- 左侧：标题区。
- 右侧：快速新增。
- 中段：筛选与搜索。
- 主区：任务列表。
- 角落：统计贴纸。

本应用先做单页。
不做多路由。

## 页面布局分区（按实现落点）

### A. 背景层（Background）
- 背景必须有噪点。
- 叠一层渐变。
- 禁用纯平色。

### B. 顶部区（Top）
- 左偏标题。
- 右偏操作。

### C. 控制区（Controls）
- 筛选像标签。
- 搜索像撕开的纸条。

### D. 列表区（List）
- 任务项像便签。
- 允许错位。

### E. 统计区（Stats Sticker）
- 像贴上去的。
- 有一点倾斜。

## 组件清单（建议）

### AppShell
- 职责：页面骨架。
- 数据：不直接读 store。
- 包含：Background、Top、Controls、List、Stats。

### BackgroundTexture
- 职责：噪点 + 渐变。
- 数据：无。
- 交互：无。

### TopBar
- 职责：放标题与快捷新增。
- 数据：无。

### TitleBlock
- 职责：主标题 + 一句话副标题。
- 数据：统计可选。
- 文案：短句。

### QuickAddBar
- 职责：3 秒加一条。
- 数据来源：`store.addTodo`。
- 字段：只填标题。
- 交互：
  - 回车提交。
  - 空标题拦截。
- 提示文案：
  - placeholder："写点啥？"
  - 校验："标题别空。"

### ControlsPanel
- 职责：筛选 + 搜索。
- 数据来源：`store.filters`。
- 写入：`store.setFilters`。

### FilterChips
- 职责：状态/优先级/分类。
- 数据来源：
  - `filters`。
  - `categories`。
- 交互：点击切换。
- 规则：
  - 分类含“未分类”。
  - 删除分类后回退。

### SearchStrip
- 职责：关键字搜索。
- 数据来源：`filters.query`。
- 交互：输入防抖。
- placeholder："你找啥？"

### TodoList
- 职责：渲染列表。
- 数据来源：selector。
  - 已筛选。
  - 已排序。
- 空状态：显示 EmptyState。

### EmptyState
- 职责：列表为空。
- 文案："先写一条。"
- 动作：聚焦 QuickAdd。

### TodoNoteItem
- 职责：单条任务。
- 数据：Todo。
- 交互：
  - 完成切换。
  - 打开编辑抽屉。
  - 删除确认。
- 图标（Iconify）：
  - 完成：`carbon:checkmark`
  - 编辑：`carbon:edit`
  - 删除：`carbon:trash-can`

### PriorityBadge
- 职责：显示 P0/P1/P2。
- 规则：颜色必须自定义。

### DueDateChip
- 职责：显示截止日。
- 图标：`carbon:calendar`
- 规则：
  - 逾期要明显。
  - 文案短："超时了"。

### TodoEditorDrawer
- 职责：编辑任务。
- 形态：抽屉。
- 数据来源：
  - `ui.editingTodoId`。
  - `todos`。
- 写入：`updateTodo`。
- 字段：
  - 标题。
  - 描述。
  - 日期。
  - 优先级。
  - 分类。
- 操作：保存、取消。
- 成功提示："收下了。"

### CategoryManagerDrawer
- 职责：管理分类。
- 数据来源：`categories`。
- 写入：add/rename/delete。
- 规则：
  - 上限 20。
  - 删除分类，任务回“未分类”。

### ConfirmModal
- 职责：删除二次确认。
- 文案：
  - 标题："真删？"
  - 描述："删了就没了。"
  - 确认："删掉"
  - 取消："算了"

### StatsSticker
- 职责：展示统计。
- 数据来源：selector。
  - 待办数。
  - 已完成。
  - 完成率。
  - 逾期数。
- 排版：数字要大。

### Toast
- 职责：轻提示。
- 场景：保存成功、存储失败。
- 文案示例：
  - 成功："收下了。"
  - 失败："存不进去。"

## 状态来源对照（Zustand）

### 读取
- `todos`
- `categories`
- `filters`
- `ui.editingTodoId`

### 写入
- `addTodo`
- `updateTodo`
- `toggleTodo`
- `deleteTodo`
- `addCategory`
- `renameCategory`
- `deleteCategory`
- `setFilters`

## 交互与边界

### 标题校验
- 为空不让存。
- 超长要拦。

### 搜索
- 空搜索回到筛选。
- 防抖 200-300ms。

### 逾期
- 只看本地今天。
- 只标未完成。

### LocalStorage 失败
- 不崩。
- 给提示。
- 允许继续用。

## 视觉落地提示（对齐 AGENTS）
- 禁紫。
- 背景带噪点。
- 不要完美居中。
- 组件别太圆。
- 阴影像纸影。
- 动效别太顺。
