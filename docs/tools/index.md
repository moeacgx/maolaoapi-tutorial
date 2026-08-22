# 工具接入

这一组文档用于把 MaoLao API 接入常见客户端和开发工具。新手不要从软件下载表开始乱点，建议先看 [怎么选工具](/tools/choose-tool)，确定自己要配置哪一类软件。

## 先走这条新手路线

| 顺序 | 要做什么 | 对应页面 |
| --- | --- | --- |
| 1 | 按聊天、写代码、VS Code、自部署等用途选择教程 | [怎么选工具](/tools/choose-tool) |
| 2 | 为每个软件单独创建 API Key，方便排查和控制额度 | [创建 API Key](/api-key) |
| 3 | 先弄懂 Base URL、API Key、Model 三个核心字段 | [OpenAI Compatible](/tools/openai-compatible) |
| 4 | 遇到无响应、模型不存在、频繁断线时按清单排查 | [常见问题排查](/tools/troubleshooting) |

## 通用填写规则

除非单页特别说明，默认使用 OpenAI 兼容配置：

| 配置项 | 推荐值 |
| --- | --- |
| Base URL | `https://api.maolaoapi.cc/v1` |
| 备用 Base URL | `https://api.maolaoapi.com/v1` |
| API Key | 控制台令牌页创建的 Key |
| 模型名 | 根据目标软件支持的模型填写 |

接入前建议先完成三件事：

1. 在 [创建 API Key](/api-key) 页面创建独立 Key。
2. 在对应软件教程中确认接口格式、模型填写位置和分组要求。
3. 第一次配置时优先使用 `auto` 分组，跑通后再按工具单独拆 Key。

## 小白图文配置方法

每篇软件教程都按这个方式读：

1. 先看下载地址，确认软件来源。
2. 再看准备工作，把 Key、Base URL、模型 ID 准备好。
3. 对照图片逐步填写，不要跳过中间步骤。
4. 保存后只发一句“请回复 ok”测试。
5. 失败时先看本页底部排查顺序，再看对应软件的常见问题。

![MaoLao API 通用 Provider 配置示意图](/tutorial-shots/common-provider.svg)

## 软件下载地址速查

优先从官网或官方 GitHub 下载，不建议从第三方软件下载站下载。

| 软件 | 官方下载地址 | 新手建议 |
| --- | --- | --- |
| Claude Code | [Claude Code 安装文档](https://docs.anthropic.com/en/docs/claude-code/setup) | 按官方文档安装命令行工具 |
| Claude Coworks | [Claude 官网](https://claude.com) / [下载页](https://claude.com/download) | 更新到支持开发者模式和第三方推理供应商的版本 |
| Codex CLI | [Codex CLI 官方文档](https://developers.openai.com/codex/cli/) / [GitHub](https://github.com/openai/codex) | 先看官方文档，再按系统安装 |
| OpenCode | [opencode.ai](https://opencode.ai) / [GitHub](https://github.com/sst/opencode) | 适合命令行或代码智能体场景 |
| Cherry Studio | [GitHub Releases](https://github.com/CherryHQ/cherry-studio/releases) | 下载最新稳定版 |
| Chatbox | [chatboxai.app](https://chatboxai.app/en) | 官网会提供 Windows、macOS、Linux 和移动端 |
| GitHub Copilot | [官方快速开始](https://docs.github.com/copilot/get-started/quickstart) | 不能直接填写 MaoLao API Key |
| Zed Editor | [zed.dev/download](https://zed.dev/download) | 安装后在设置里找 AI / Provider |
| Cline | [cline.bot](https://cline.bot) / [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) | 适合 VS Code 用户 |
| Open WebUI | [安装文档](https://docs.openwebui.com/getting-started/) / [GitHub](https://github.com/open-webui/open-webui) | 适合 Docker 或服务器部署 |
| CodeBuddy | [codebuddy.ai/ide](https://www.codebuddy.ai/ide) | 下载 CodeBuddy IDE 或按官方文档安装插件 |
| Trae | [trae.ai/download](https://www.trae.ai/download) | 进入下载中心选择对应系统 |
| CC Switch | [官网](https://ccswitch.io/en/) / [GitHub Releases](https://github.com/farion1231/cc-switch/releases) | 只从官网或官方 GitHub 下载 |
| LlamaIndex | [官方文档](https://developers.llamaindex.ai) / [GitHub](https://github.com/run-llama/llama_index) | 开发框架，不是聊天客户端 |
| BotGem | [botgem.com](https://botgem.com) | 看当前版本是否支持自定义 API |
| WorkBuddy | [官方入口](https://copilot.tencent.com/work/) | 企业版可能限制自定义 Provider |
| LobeHub / LobeChat | [lobehub.com](https://lobehub.com) / [GitHub](https://github.com/lobehub/lobe-chat) | 适合网页聊天或自部署 |
| OpenCat | [opencat.app](https://opencat.app) | 移动端和桌面端能力可能不同 |
| NextChat | [nextchat.club](https://nextchat.club) / [GitHub](https://github.com/ChatGPTNextWeb/NextChat) | 适合网页版使用或自部署；新手优先用官方网页 |

## 快速判断用哪个教程

| 你要接入的工具 | 看哪一页 |
| --- | --- |
| 通用 OpenAI 接口、自写代码 | [OpenAI Compatible](/tools/openai-compatible) |
| Claude Code | [Claude Code](/tools/claude-code) |
| Claude Coworks | [Claude Coworks](/tools/claude-cowork) |
| Codex CLI | [Codex CLI](/tools/codex-cli) |
| OpenCode | [OpenCode](/tools/opencode) |
| Cherry Studio | [Cherry Studio](/tools/cherry-studio) |
| Chatbox | [Chatbox](/tools/chatbox) |
| GitHub Copilot | [GitHub Copilot](/tools/github-copilot) |
| Zed Editor | [Zed Editor](/tools/zed-editor) |
| Cline | [Cline](/tools/cline) |
| Open WebUI | [Open WebUI](/tools/open-webui) |
| CodeBuddy | [CodeBuddy](/tools/codebuddy) |
| Trae | [Trae](/tools/trae) |
| CC Switch | [CC Switch](/tools/cc-switch) |
| BotGem | [BotGem](/tools/botgem) |
| WorkBuddy | [WorkBuddy](/tools/workbuddy) |
| LobeHub / LobeChat | [LobeHub / LobeChat](/tools/lobehub) |
| OpenCat | [OpenCat](/tools/opencat) |
| NextChat | [NextChat](/tools/nextchat) |
| Hermes / OpenClaw 遇到 403 | [Hermes / OpenClaw 403 代理](/tools/hermes-openclaw-403) |
| LangChain、OpenAI SDK、脚本开发 | [LangChain / SDK](/tools/langchain-sdk) |
| LlamaIndex 知识库开发 | [LlamaIndex / SDK](/tools/llamaindex) |

## 通用排查顺序

如果接入失败，先按这个顺序查：

1. Base URL 是否带 `/v1`。
2. API Key 是否来自 MaoLao API 控制台，复制时没有空格。
3. 模型名是否完整一致。
4. 当前 Key 的分组是否支持该模型。
5. 客户端选择的是 OpenAI、Anthropic 还是其他接口格式。
