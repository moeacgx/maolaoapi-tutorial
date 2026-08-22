<script setup>
import { withBase } from "vitepress";

const apiUrls = ["https://api.maolaoapi.cc/v1", "https://api.maolaoapi.com/v1"];

const routes = [
  {
    title: "5 分钟跑通",
    text: "从 Base URL、API Key 到第一次请求，按步骤完成最小可用配置。",
    link: "/quick-start",
  },
  {
    title: "创建 API Key",
    text: "按用途创建独立 Key，学会分组、额度上限和安全保存。",
    link: "/api-key",
  },
  {
    title: "工具接入",
    text: "Claude Code、Cherry Studio、Chatbox、OpenCode 等软件图文教程。",
    link: "/tools/",
  },
  {
    title: "账户订阅",
    text: "充值、套餐、订单、额度异常和账户问题的处理步骤。",
    link: "/account/",
  },
];
</script>

<template>
  <section class="ml-route-grid" aria-label="推荐阅读路径">
    <a v-for="route in routes" :key="route.link" class="ml-route-card" :href="withBase(route.link)">
      <span>{{ route.title }}</span>
      <p>{{ route.text }}</p>
    </a>
  </section>

  <div class="ml-callout" v-if="apiUrls?.length">
    <strong>推荐 API 地址：</strong>
    <span v-for="(url, index) in apiUrls" :key="url">
      <code>{{ url }}</code><span v-if="index < apiUrls.length - 1">、</span>
    </span>
  </div>
</template>
