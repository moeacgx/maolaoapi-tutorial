# 异步生图任务

这一页合并 MaolaoAPI Images API 的异步图片生成与编辑教程。它适合需要提交生图任务、轮询任务状态、下载受保护图片内容，或在代码里接入图片 API 的场景。

## 接口总览

推荐使用 MaoLao API 的 OpenAI 兼容 Base URL：

```text
https://api.maolaoapi.cc/v1
```

| 接口 | 用途 |
| --- | --- |
| `POST /images/tasks` | 提交异步图片生成或编辑任务 |
| `GET /images/tasks/{task_id}` | 查询任务状态与结果 |
| `GET /images/tasks/{task_id}/content/{index}` | 获取受保护的图片正文 |

异步任务请求多张图片时，调用方应以 `result.data.length` 判断实际交付数量。固定按张计费会按实际可交付数量结算，且不超过请求的 `n`；没有可交付图片时进入失败、重试或退款流程。

## 鉴权

所有请求都要携带 API Key：

```http
Authorization: Bearer sk-你的API_KEY
```

任务归属于令牌对应的账号。同一账号下的其他有效令牌可以查询任务，其他账号会得到 `404 task not found`。

## 提交图片生成任务

不传 `action` 时，默认创建图片生成任务。请求体与 `/v1/images/generations` 保持兼容。

```bash
curl -X POST "https://api.maolaoapi.cc/v1/images/tasks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2-enterprise",
    "prompt": "一只坐在月球上的橘猫，电影级光影",
    "size": "1024x1024",
    "quality": "high",
    "n": 1,
    "response_format": "b64_json"
  }'
```

提交成功返回 `202`，表示任务已接收，不表示生成已经完成。

```json
{
  "task_id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "status": "queued"
}
```

生成结果、参数错误、余额错误或模型错误都会在任务状态中返回。

## 图片模型尺寸

请求时直接传 MaolaoAPI 对外模型名即可。下面列出常用图片模型的尺寸行为。

| 模型 | 默认 `size` | 支持尺寸 |
| --- | --- | --- |
| `gpt-image-1-enterprise` | `1024x1024` | `1024x1024`、`1024x1536`、`1536x1024` |
| `gpt-image-1.5-enterprise` | `1024x1024` | `1024x1024`、`1024x1536`、`1536x1024` |
| `gpt-image-2-enterprise` | `1024x1024` | `1024x1024`、`1024x768`、`768x1024`、`1024x1536`、`1536x1024`、`2048x2048`、`2048x1152`、`1152x2048`、`2560x1088`、`1088x2560`、`2880x2160`、`2160x2880`、`3840x2160`、`2160x3840`，以及符合规则的 `WIDTHxHEIGHT` 自定义尺寸 |
| `gpt-image-2-4K` | `1024x1024` | 支持合法 `WIDTHxHEIGHT` 尺寸，可用于 `3840x2160`、`2160x3840` 等 4K 档位 |
| `grok-imagine-image` | `1k` / `1:1` | 使用 `extra_fields.resolution` 和 `extra_fields.aspect_ratio` 表达尺寸 |

`gpt-image-2-enterprise` 和 `gpt-image-2-4K` 使用自定义尺寸时，宽高都需要是 16 的倍数，宽高比需要在 1:3 到 3:1 之间，且最大不超过 `3840x2160` 等效边界。

Grok 生图示例：

```json
{
  "model": "grok-imagine-image",
  "prompt": "一辆停在雨夜街角的复古跑车",
  "extra_fields": {
    "resolution": "2k",
    "aspect_ratio": "16:9"
  },
  "response_format": "b64_json"
}
```

## 图片生成参数

| 参数 | 说明 |
| --- | --- |
| `model` | 图片模型名称。建议始终显式填写。 |
| `prompt` | 图片描述或编辑指令。 |
| `n` | 请求图片数量，默认 1。实际交付数量以 `result.data.length` 为准。 |
| `size` | GPT Enterprise 模型不传时默认 `1024x1024`。 |
| `quality` | GPT Enterprise 模型不传时默认 `medium`。 |
| `response_format` | 建议使用 `b64_json`，结果会转换成站内图片内容地址。 |

## 单图输入编辑

把 `action=edits` 放在查询参数中。图片编辑任务使用同一个对外模型名。

```bash
curl -X POST "https://api.maolaoapi.cc/v1/images/tasks?action=edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-2-enterprise" \
  -F "prompt=把背景替换成夜晚的东京街道" \
  -F "image=@input.png" \
  -F "size=1024x1024" \
  -F "quality=high"
```

异步执行可以避免等待生成结果时的 HTTP 超时，但不能绕过请求体大小限制。

## 多图输入编辑

可以重复传 `image` 字段上传多张图片。不同模型的输入图数量上限不同，超出上限会返回错误。

```bash
curl -X POST "https://api.maolaoapi.cc/v1/images/tasks?action=edits" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "model=gpt-image-1.5-enterprise" \
  -F "prompt=合并两张图的主体，保持自然光照" \
  -F "image=@input-a.png" \
  -F "image=@input-b.png" \
  -F "size=1024x1024" \
  -F "quality=medium"
```

| 模型 | 编辑输入上限 |
| --- | --- |
| `gpt-image-1-enterprise` | 最多 4 张输入图 |
| `gpt-image-1.5-enterprise` | 最多 10 张输入图 |
| `gpt-image-2-enterprise` | 最多 10 张输入图 |

## 使用 task_id 查询状态

```bash
curl "https://api.maolaoapi.cc/v1/images/tasks/task_xxx" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

常见任务状态：

| 状态 | 含义 |
| --- | --- |
| `queued` | 任务已接收 |
| `processing` | 正在处理 |
| `succeeded` | 至少交付一张图片 |
| `failed` | 任务执行失败 |

成功状态示例：

```json
{
  "task_id": "task_xxx",
  "status": "succeeded",
  "progress": "100%",
  "expires_at": 1784200000,
  "result": {
    "created": 1784196400,
    "data": [
      {
        "url": "/v1/images/tasks/task_xxx/content/0",
        "revised_prompt": "..."
      }
    ]
  }
}
```

## 下载受保护的图片内容

如果 `result.data[].url` 以 `/v1/` 开头，请拼接 API 域名，并继续携带 Bearer Token。

```bash
curl "https://api.maolaoapi.cc/v1/images/tasks/task_xxx/content/0" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o result.png
```

浏览器里的普通 `<img src>` 不能附加 `Authorization` 请求头，不要直接把受保护的相对地址放进 `src`。前端需要先用 `fetch` 获取 Blob，再把 Blob URL 交给图片组件。

## JavaScript 轮询示例

```js
const baseURL = "https://api.maolaoapi.cc/v1";
const apiKey = process.env.MAOLAO_API_KEY;

async function createImageTask() {
  const response = await fetch(`${baseURL}/images/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-2-enterprise",
      prompt: "一座漂浮在云海上的未来城市",
      size: "1024x1024",
      quality: "high",
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

async function waitForTask(taskId) {
  while (true) {
    const response = await fetch(
      `${baseURL}/images/tasks/${encodeURIComponent(taskId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );

    if (!response.ok) throw new Error(await response.text());
    const task = await response.json();

    if (task.status === "succeeded") return task.result;
    if (task.status === "failed") {
      throw new Error(task.error || "图片生成失败");
    }

    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
}

const submitted = await createImageTask();
const result = await waitForTask(submitted.task_id);
console.log(result);
```

## Imagen 兼容

Imagen 可以使用同一条异步路径。请求体仍然采用 OpenAI Images 格式。当前 Gemini 图片适配器支持最终模型名称以 `imagen` 开头的模型。

```bash
curl -X POST "https://api.maolaoapi.cc/v1/images/tasks" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "imagen-4.0-generate-001",
    "prompt": "赛博朋克风格的重庆夜景",
    "n": 1,
    "size": "16:9",
    "quality": "2K",
    "response_format": "b64_json"
  }'
```

支持 `imagen-*` 以及映射后为 `imagen-*` 的业务别名；暂不支持 Gemini 原生 `contents`、`parts`、`generationConfig` 请求体。

## 错误与保留时间

同时处理 HTTP 状态和任务状态：

| HTTP 状态 | 含义 |
| --- | --- |
| `200` | 任务查询或图片读取成功 |
| `202` | 任务已接收，需要继续轮询 |
| `400` | `action`、参数或当前任务状态不合法 |
| `401` | API Key 缺失或无效 |
| `404` | 任务、图片序号不存在，或任务不属于当前账号 |
| `410` | 图片正文已经过期 |
| `413` | 请求超过上传限制 |

错误响应示例：

```json
{
  "error": {
    "message": "task not found",
    "type": "invalid_request_error"
  }
}
```

图片正文默认保留 1 小时。到期后任务状态和审计记录仍然保留，但图片正文无法继续读取。

```json
{
  "task_id": "task_xxx",
  "status": "succeeded",
  "progress": "100%",
  "result_expired": true,
  "expires_at": 1784200000
}
```

当前限制：

- 暂不提供取消任务接口。
- 暂不提供完成回调或 Webhook。
- 暂不提供公开的任务列表接口。
- `?group=xxx` 不能覆盖 API Key 对应的分组。
- 固定按张计费以实际可交付数量结算，最多不超过请求的 `n`。
