import { defineConfig } from "vitepress";

const base = process.env.VITEPRESS_BASE || "/";
const asset = (fileName) => `${base}${fileName}`.replace(/\/{2,}/g, "/");

export default defineConfig({
  title: "MaoLaoAPI教程",
  description: "面向新手的 MaoLao API 使用文档",
  lang: "zh-CN",
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["link", { rel: "icon", type: "image/jpeg", href: asset("favicon.jpg") }],
  ],
  themeConfig: {
    logo: asset("favicon.jpg"),
    siteTitle: "MaoLaoAPI教程",
    nav: [
      { text: "快速开始", link: "/quick-start" },
      { text: "API Key", link: "/api-key" },
      { text: "计费与额度", link: "/billing-quota" },
      { text: "异步生图", link: "/images-tasks" },
      { text: "工具接入", link: "/tools/" },
      { text: "账户与订阅", link: "/account/" },
    ],
    sidebar: [
      {
        text: "入门",
        items: [
          { text: "产品介绍", link: "/" },
          { text: "快速开始", link: "/quick-start" },
          { text: "创建 API Key", link: "/api-key" },
          { text: "计费与额度", link: "/billing-quota" },
        ],
      },
      {
        text: "API 教程",
        items: [
          { text: "异步生图任务", link: "/images-tasks" },
        ],
      },
      {
        text: "工具接入",
        items: [
          { text: "怎么选工具", link: "/tools/choose-tool" },
          { text: "OpenAI Compatible", link: "/tools/openai-compatible" },
          { text: "Claude Code", link: "/tools/claude-code" },
          { text: "Claude Coworks", link: "/tools/claude-cowork" },
          { text: "Codex CLI", link: "/tools/codex-cli" },
          { text: "CC Switch", link: "/tools/cc-switch" },
          { text: "OpenCode", link: "/tools/opencode" },
          { text: "Cherry Studio", link: "/tools/cherry-studio" },
          { text: "GitHub Copilot", link: "/tools/github-copilot" },
          { text: "Zed Editor", link: "/tools/zed-editor" },
          { text: "Cline", link: "/tools/cline" },
          { text: "Chatbox", link: "/tools/chatbox" },
          { text: "WorkBuddy", link: "/tools/workbuddy" },
          { text: "Open WebUI", link: "/tools/open-webui" },
          { text: "CodeBuddy", link: "/tools/codebuddy" },
          { text: "Trae", link: "/tools/trae" },
          { text: "BotGem", link: "/tools/botgem" },
          { text: "LobeHub", link: "/tools/lobehub" },
          { text: "OpenCat", link: "/tools/opencat" },
          { text: "NextChat", link: "/tools/nextchat" },
        ],
      },
      {
        text: "进阶与排查",
        items: [
          { text: "Hermes / OpenClaw 403 代理", link: "/tools/hermes-openclaw-403" },
          { text: "LangChain / SDK", link: "/tools/langchain-sdk" },
          { text: "LlamaIndex / SDK", link: "/tools/llamaindex" },
          { text: "常见问题排查", link: "/tools/troubleshooting" },
        ],
      },
      {
        text: "账户与订阅",
        items: [
          { text: "账户概览", link: "/account/" },
          { text: "充值余额", link: "/account/recharge" },
          { text: "订阅套餐选择", link: "/account/subscription-plans" },
          { text: "订单与发票", link: "/account/orders-invoices" },
          { text: "账户问题排查", link: "/account/troubleshooting" },
        ],
      },
    ],
    outline: {
      label: "本页目录",
      level: [2, 3],
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            displayDetails: "显示详情",
            resetButtonTitle: "清空搜索",
            backButtonTitle: "关闭搜索",
            noResultsText: "没有找到结果",
            footer: {
              selectText: "选择",
              selectKeyAriaLabel: "回车",
              navigateText: "切换",
              navigateUpKeyAriaLabel: "上箭头",
              navigateDownKeyAriaLabel: "下箭头",
              closeText: "关闭",
              closeKeyAriaLabel: "Esc",
            },
          },
        },
      },
    },
    socialLinks: [{ icon: "github", link: "https://github.com/moeacgx/maolaoapi-tutorial" }],
  },
});
