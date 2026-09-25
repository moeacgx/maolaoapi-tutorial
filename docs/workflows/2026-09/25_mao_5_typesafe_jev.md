# MAO-5：TypeSafe / Jev API 文档

## 范围与方案

在当前维护的 `maolaoapi-tutorial` 中新增 `docs/typesafe-jev.md`，补齐导航、首页阅读路径和 README 索引。`maolaoapi-docs` 已由维护者明确为过期文档，本工作项不再使用它，也不删除其远程仓库。

面向用户说明猫佬 API 的同步 `POST /v1/systemone` 合同：Bearer 鉴权、模型和精确大小写别名、必填字段、三题型、结果格式、用量与错误处理。官方 TypeSafe 直连插件的 `/typesafe/v1/systemone` 仅用于解释区别，不作为本站已开放端点承诺。

## 核对依据

- 文档基线：`moeacgx/maolaoapi-tutorial@3355047`，已包含图片模型文档 PR #1。
- 宿主源码：`moeacgx/NewAPI-Mao@5f5c1432686989a5251c7e4f8dd5a7188db0b6f9`。
- 独立插件源码：`moeacgx/maolaonewapi-plugins@f5d2dae4aa3cc42198604e84c459d07b00f80b2d`，`published/cloudflare-jev/0.2.4/plugin.js`；此版本与 0.2.3 的客户端请求/响应合同一致。
- 原生入口、权限与错误：宿主 `router/plugin-router.go`、`middleware/task_plugin.go`、`controller/relay.go`。
- 官方直连对照：宿主 `router/testdata/typesafe-1.0.0.js`、`router/jev_native_integration_test.go`。
- 供应商语义：核对 [Cloudflare Jev 模型文档](https://developers.cloudflare.com/ai/models/typesafe/jev/)与 [TypeSafe API reference](https://docs.typesafe.ai/api)；仅用于核对题型和字段语义，不将供应商路径、凭据或报价作为猫佬 API 合同。

## 契约与安全边界

- 请求模型 `typesafe/jev` / `Typesafe-jev` 与实际响应版本可能不同；别名需匹配站点模型映射与权限。
- `instructions` 不可省略；`state` 可以为 `null`；显式零概率与小数评分保留。
- 客户端直接发送 `model/state/questions`，不传 Cloudflare 的 `input` 包装、不覆盖上游地址和凭据。
- 成功直接返回 `model/answers/usage`；同步结果不支持轮询补取，不把账务记录称为答案归档。
- 不固定站点售价，不承诺失败一律退款或可安全重试，不宣称已实测当前生产可用性。
- 示例只读环境变量中的用户 Key；离线验证使用假 Key 和模拟响应，不发送收费请求。
- 本次仅改文档站内容和导航，不修改宿主、插件、Default/Classic 页面或生产部署。

## 验证计划

1. 解析所有 JSON 与 cURL 请求体，通过固定发布插件的 decoder、请求构建和响应解析钩子核对示例。
2. JavaScript/Python 示例在无网络模拟环境运行，覆盖成功、合法零值、错误状态与无效响应。
3. 使用现有 VitePress 构建命令验证新页面、导航和内部链接；检查构建输出包含新内容。
4. 使用仓库同类 Markdown 格式化工具，执行 `git diff --check` 并复核改动范围。

这里只验证文档与现有合同一致性；不修改插件，因此不扩展为新的宿主资金、安装、生产供应商或多数据库验收。

## 验证结果

- `cloudflare-jev` 0.2.3、0.2.4 的原始发布脚本均通过文档示例回放：最小请求、三题型组合、精确别名、响应呈现和实际用量匹配；合法零概率保留。
- 两个 JSON 代码块与 cURL 请求体解析通过；JavaScript 和 Python 示例各 8 个确定性模拟场景通过，覆盖成功、零值、别名、错误及缺失凭据。验证拦截全部请求，未访问真实推理服务。
- `npm run docs:build` 调用现有 `docs:build` 脚本，VitePress 1.6.4 构建通过；复核产物 `typesafe-jev.html` 包含新导航、接口路径、三题型和两种语言示例。没有安装依赖或改动锁文件。
- 新增页面及 README 的内部链接检查通过，导航配置通过 `node --check`。
- Markdown 使用 `oxfmt@0.57.0` 格式化，`git diff --check` 通过。导航配置保留既有行，新增行使用 LF，避免原文件已提交 CRLF 的差异空白告警。
- 独立只读审查通过；已补充 JavaScript 的 `.mjs` 执行方式及 Noul `criteria` 的空值说明。
- 首次交付时，改动保留在文档仓库任务分支 `docs/mao-5-typesafe-jev`，尚未提交、推送、合并或部署。2026-09-25 维护者随后明确要求合并到文档主分支；合并前已重新核对远端 `main`、示例与站点构建，按授权提交并快进整合，推送后由现有 GitHub Pages 流程发布。公开站点是否更新以对应提交的部署结果为准。主程序仓库源码未改动。
- 共享契约影响：仅记录已实现的用户 API，没有更改认证、模型、计费或响应合同；不自动向其他仓库发送通知。
