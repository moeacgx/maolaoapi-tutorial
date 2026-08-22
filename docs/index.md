---
layout: home

hero:
  text: MaoLao API 新手使用文档
  tagline: 从注册、创建 API Key、选择模型、异步生图到理解计费额度，按真实项目方式整理的一站式教程。
  actions:
    - theme: brand
      text: 快速开始
      link: /quick-start
    - theme: alt
      text: 查看工具教程
      link: /tools/

features:
  - title: 面向新手
    details: 尽量用直白步骤解释 API Key、Base URL、模型名、分组和额度，不假设你已经熟悉开发工具。
  - title: 内容清晰
    details: 按注册、创建 API Key、客户端配置和问题排查拆分，适合第一次接触 API 的用户。
  - title: 可维护项目
    details: 使用 VitePress、异步数据脚本和 GitHub Pages 工作流组织，适合长期维护。
---

<HomeDataCards />

## MaoLao API 是什么

MaoLao API 是一个 AI 模型聚合与分发网关。它把不同模型服务整理成兼容 OpenAI、Claude、Gemini 等客户端习惯的 API 调用方式，让你可以在一个控制台里管理模型、分组、额度和 API Key。

对新手来说，你可以先把它理解成三件事：

1. **控制台**：注册、登录、充值、查看额度、创建 API Key。
2. **API 地址**：客户端或代码里填写的 Base URL，例如公开配置推荐的 API 域名。
3. **模型和分组**：模型决定能力和基础消耗，分组决定线路、稳定性、适用客户端和倍率。

## 本教程适合谁

- 第一次使用 API Key 接入 AI 工具的人。
- 想把 MaoLao API 配进 Cherry Studio、Claude Code、Codex CLI 或自己代码里的人。
- 想弄懂模型倍率、分组倍率、固定消耗、额度消耗关系的人。
- 后续希望维护一份公开文档站的人。

## 阅读顺序

建议从 [快速开始](/quick-start) 开始，完成一次最小可用调用；然后阅读 [创建 API Key](/api-key) 和 [计费与额度](/billing-quota)。需要图片生成时，继续看 [异步生图任务](/images-tasks)。如果你已经会配置客户端，可以直接进入 [工具接入](/tools/) 查看对应软件的图文教程。
