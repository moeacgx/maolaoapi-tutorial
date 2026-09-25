# TypeSafe / Jev API

`typesafe/jev` 用于对一份共享材料做结构化判断，例如工单分类、紧急程度判断和质量评分。你提供 `state` 和 `questions`，接口在同一次请求中返回每个问题的答案、概率和 Token 用量。

## 接口与鉴权

| 项目     | 填写内容                                                            |
| -------- | ------------------------------------------------------------------- |
| 请求方法 | `POST`                                                              |
| 完整地址 | `https://api.maolaoapi.cc/v1/systemone`                             |
| Base URL | `https://api.maolaoapi.cc/v1`，在其后拼接 `/systemone`              |
| 鉴权     | `Authorization: Bearer <猫佬 API Key>`                              |
| 请求格式 | `Content-Type: application/json`                                    |
| 模型     | `typesafe/jev`；控制台若提供别名 `Typesafe-jev`，按其精确大小写填写 |
| 返回方式 | 同步 JSON，不支持 SSE / 流式输出                                    |

先在[令牌页面创建 API Key](/api-key)，确认令牌的分组、模型权限和可用额度覆盖 Jev。模型名称以控制台实际开放为准，`Typesafe-jev` 需要站点已配置相应映射，不能任意改变大小写或自行添加别名。

::: warning 路径与请求格式
Jev 使用 `/v1/systemone`，不能把它当作普通聊天模型发送到 `/v1/chat/completions` 或 `/v1/responses`。请求直接包含 `model`、`state`、`questions`，不使用 `messages`，也不需要再包一层 `input`。

网上其他接入方式可能展示 TypeSafe 插件的 `/typesafe/v1/systemone`，或 Cloudflare 的账户接口；这些不是本文的猫佬 API 入口。调用猫佬 API 只需要猫佬 API Key，无需提供供应商账号或密钥。
:::

## 最小请求

下面是 Bash / macOS / Linux 的 cURL 示例。先在本地环境变量中设置 `MAOLAO_API_KEY`，不要将真实 Key 写入脚本或提交到仓库。

```bash
curl --fail-with-body --max-time 60 \
  "https://api.maolaoapi.cc/v1/systemone" \
  -H "Authorization: Bearer ${MAOLAO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev",
    "state": "订单已付款，但连续两天没有收到发货通知，请尽快核实。",
    "questions": {
      "urgent": {
        "type": "noul",
        "instructions": "这条消息是否要求尽快处理？"
      }
    }
  }'
```

请求成功直接返回 `answers.urgent.noul` 等结果，不会先返回一个需要轮询的任务 ID。下文的 JavaScript 和 Python 示例也适合 Windows 用户。

## 请求参数

| 字段        | 必填 | 类型与说明                                                                                                        |
| ----------- | ---- | ----------------------------------------------------------------------------------------------------------------- |
| `model`     | 是   | 字符串。填写 `typesafe/jev` 或控制台已开放的 `Typesafe-jev`。                                                     |
| `state`     | 是   | 字符串、对象、数组或 `null`，供所有问题共同参考的材料。整个字段不能是数字或布尔值；对象内部可以包含这些 JSON 值。 |
| `questions` | 是   | 非空对象。键是自行定义的非空问题 ID，值是下面的题目对象。                                                         |
| `stream`    | 否   | 省略或填写布尔值 `false`。不接受 `true`、字符串 `"false"` 或 `null`。                                             |

每个题目包含以下字段：

| 字段           | 必填   | 类型与说明                                                                          |
| -------------- | ------ | ----------------------------------------------------------------------------------- |
| `type`         | 是     | `noul`、`choice` 或 `score`。                                                       |
| `instructions` | 是     | 字符串、对象、数组或 `null`。建议写清要判断的问题；允许 `null` 不代表可以省略字段。 |
| `criteria`     | 按题型 | 判断标准、候选项或评分档位，格式见下一节。描述值可使用字符串、对象、数组或 `null`。 |

问题 ID 用于把请求与答案对应起来。请将完整问题写入 `instructions`，不要只靠 `urgent` 这样的 ID 表达含义。

不要附加聊天接口的 `messages`、`temperature`、`max_tokens`、`response_format`、`tools` 等字段，也不要传 `api_key`、`base_url` 或上游 `input` 包装。当前入口会拒绝未支持的请求字段；题目内也只接受 `type`、`instructions`、`criteria`。普通调用无需提交 `group`，分组由令牌和站点路由规则处理。

### Noul：是或否的概率

`type: "noul"` 适合判断是否紧急、是否符合条件等问题。`criteria` 可省略，也可为 `null` 或空对象；填写非空对象时只能使用 `"true"` 和 `"false"` 两个键描述判断标准。

答案字段 `noul` 是 **0 到 1 的数值**，表示肯定答案的概率，不是布尔值。`0` 是合法结果。业务需要二选一时，应自行选择阈值，不能用 `Boolean(answer.noul)` 判断，否则任意非零概率都会变成 `true`。

### Choice：从候选项中选择

`type: "choice"` 的 `criteria` 必须是非空对象，键是候选项标识，值是候选项描述。答案的 `choice` 返回选中的键，`probabilities` 给出各候选项的概率，`confidence` 给出模型置信度。

### Score：按档位评分

`type: "score"` 的 `criteria` 必须是至少两项的有序数组。数组从下标 `0` 开始表示档位，返回的 `score` 可以是小数。若有三档，取值范围是 `0` 到 `2`，不是百分制。`legend` 解释各下标，`probabilities` 提供各档概率，`confidence` 提供模型置信度。

## 一次提交三种问题

将下面的 JSON 作为 `POST /v1/systemone` 的请求体，即可对同一份材料同时判断紧急程度、分类和评分。

```json
{
  "model": "typesafe/jev",
  "state": {
    "message": "订单已付款，但连续两天没有收到发货通知，请尽快核实。",
    "order": { "paid": true, "waiting_days": 2 }
  },
  "questions": {
    "urgent": {
      "type": "noul",
      "instructions": "用户是否要求尽快处理？",
      "criteria": {
        "true": "明确提出尽快处理或给出时间要求",
        "false": "普通咨询，没有提出时间要求"
      }
    },
    "category": {
      "type": "choice",
      "instructions": "这条消息属于哪类服务请求？",
      "criteria": {
        "delivery": "发货进度或物流问题",
        "payment": "付款失败或金额错误",
        "other": "其他请求"
      }
    },
    "urgency_level": {
      "type": "score",
      "instructions": "按处理时效要求评估这条消息的紧急程度。",
      "criteria": ["无时间要求", "希望尽快处理", "需要立即处理"]
    }
  }
}
```

## 成功响应

成功时返回 HTTP `200`，正文直接包含 `model`、`answers`、`usage`。下面是与上面三题请求对应的**结构示例**，概率与用量仅用于说明格式，不是一次真实调用的结果。

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "urgent": { "type": "noul", "noul": 0.9 },
    "category": {
      "type": "choice",
      "choice": "delivery",
      "probabilities": { "delivery": 0.9, "payment": 0.06, "other": 0.04 },
      "confidence": 0.8
    },
    "urgency_level": {
      "type": "score",
      "score": 1.2,
      "probabilities": { "0": 0.05, "1": 0.7, "2": 0.25 },
      "confidence": 0.75,
      "legend": { "0": "无时间要求", "1": "希望尽快处理", "2": "需要立即处理" }
    }
  },
  "usage": { "input_tokens": 512, "output_tokens": 80 }
}
```

- `answers` 的键与请求中的问题 ID 对应，不能按对象遍历顺序猜测答案属于哪道题。
- `model` 是实际执行评估的模型版本，可能与请求别名不同；不要强制校验它等于 `typesafe/jev`，也不要把返回的版本号自动改填到下一次请求中。
- `usage.input_tokens` 和 `usage.output_tokens` 分别表示本次实际输入、输出用量。它们不是金额，输出 Token 非零也不等于输出一定收费。
- 这里读取的是 `answers`，不需要再从 `choices[0].message.content` 中解析 JSON。

## JavaScript 示例

适用于 Node.js 18+，将代码保存为 `jev.mjs` 后执行 `node jev.mjs`。通过环境变量设置 `MAOLAO_API_KEY`；如控制台使用别名，可额外设置 `MAOLAO_MODEL=Typesafe-jev`。示例不依赖 OpenAI SDK，不自动重试提交。

```js
const apiKey = process.env.MAOLAO_API_KEY;
if (!apiKey) throw new Error("请先设置 MAOLAO_API_KEY");

const baseURL = "https://api.maolaoapi.cc/v1";
const response = await fetch(`${baseURL}/systemone`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  signal: AbortSignal.timeout(60_000),
  body: JSON.stringify({
    model: process.env.MAOLAO_MODEL || "typesafe/jev",
    state: "订单已付款，请尽快核实发货进度。",
    questions: {
      urgent: { type: "noul", instructions: "用户是否要求尽快处理？" },
    },
  }),
});

// 先读取文本，兼容反向代理返回的非 JSON 错误页。
const text = await response.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error(`HTTP ${response.status}：返回内容不是 JSON`);
}
if (!response.ok) {
  const message = data?.detail || data?.error?.message || data?.message || "请求失败";
  throw new Error(`HTTP ${response.status}：${message}`);
}

const probability = data?.answers?.urgent?.noul;
if (
  typeof probability !== "number" ||
  !Number.isFinite(probability) ||
  probability < 0 ||
  probability > 1
) {
  throw new Error("响应缺少有效的 urgent.noul");
}
console.log("紧急概率：", probability);
console.log("Token 用量：", data.usage);
```

## Python 示例

适用于 Python 3，仅使用标准库。环境变量与 JavaScript 示例相同。

```python
import json
import math
import os
import urllib.error
import urllib.request

api_key = os.environ.get("MAOLAO_API_KEY")
if not api_key:
    raise RuntimeError("请先设置 MAOLAO_API_KEY")

payload = {
    "model": os.environ.get("MAOLAO_MODEL") or "typesafe/jev",
    "state": "订单已付款，请尽快核实发货进度。",
    "questions": {
        "urgent": {"type": "noul", "instructions": "用户是否要求尽快处理？"}
    },
}
request = urllib.request.Request(
    "https://api.maolaoapi.cc/v1/systemone",
    data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(request, timeout=60) as response:
        data = json.load(response)
except urllib.error.HTTPError as error:
    raise RuntimeError(f"请求失败：HTTP {error.code}，请检查接口、权限和额度") from error
except urllib.error.URLError as error:
    raise RuntimeError("连接失败或超时，请先核实请求结果再决定是否重试") from error

probability = data.get("answers", {}).get("urgent", {}).get("noul")
if (isinstance(probability, bool) or not isinstance(probability, (int, float))
        or not math.isfinite(probability) or not 0 <= probability <= 1):
    raise RuntimeError("响应缺少有效的 urgent.noul")
print("紧急概率：", probability)
print("Token 用量：", data.get("usage"))
```

## 用量、超时与结果保存

Cloudflare Jev 的上下文窗口为 **32,000 Token**，共享 `state` 与问题内容都会占用输入预算；这不是 32,000 个字符，也不要套用其他 TypeSafe 接入的上下文上限。

猫佬 API 的实际消耗以控制台当前模型价格、分组倍率及使用日志为准。按量配置下，请求前会预留额度，成功后按实际用量结算；当前插件用 32,000 输入 Token 作为预估，因此短请求也需要足够的预扣额度。站点也可能配置按次计费，不要直接用供应商报价推算本站扣费。

Jev 是同步接口，客户端要等待完整 JSON。示例的 60 秒超时是客户端配置，不代表服务承诺的处理时长。请求超时、连接中断或出现服务端错误时，供应商可能已经处理，不要自动连续重发；先核对控制台使用日志，必要时联系管理员。

请在客户端自行保存本次 `answers`。本接口不提供异步任务轮询或答案补取；任务列表即使留下账务记录，也不代表可以取回答案。这里的结果留存规则不代表整个平台所有日志或其他归档功能的隐私承诺。

## 常见问题

| 现象                                   | 检查方法                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | --- | ------------------------ |
| HTTP 400、`Invalid request`            | 检查三个必填顶层字段、每题的 `instructions`、`criteria` 类型和多余字段；确保 `stream` 省略或为 `false`。 |
| HTTP 401                               | 检查 Bearer Key 是否正确、是否过期或被禁用。                                                             |
| HTTP 403、模型或额度错误               | 核对令牌模型权限、所选分组、令牌额度与可用余额/套餐；错误码可能随拦截阶段变化。                          |
| HTTP 404 / 405、返回网页或聊天格式错误 | 确认完整路径恰好为 `/v1/systemone` 且方法为 `POST`，没有重复 `/v1`；也请管理员确认接口已启用。           |
| HTTP 429                               | 降低并发和请求频率，检查站点限流提示。                                                                   |
| HTTP 5xx 或无可用渠道                  | 可能是路由、插件、上游或服务端处理故障；结合请求时间和请求 ID 联系管理员，不能仅凭状态码判断具体原因。   |
| `noul` 为 `0` 或 `score` 带小数        | 都可能是正常结果；不要使用 `value                                                                        |     | 默认值` 覆盖合法的零值。 |

不同拦截阶段可能返回 `detail`、`error.message`、`message` 等错误字段，也可能返回非 JSON 正文。客户端应先检查 HTTP 状态，再处理正文；不要依赖完整错误文案保持不变。

需要通用接入排查时，可继续查看[常见问题排查](/tools/troubleshooting)和[计费与额度](/billing-quota)。
