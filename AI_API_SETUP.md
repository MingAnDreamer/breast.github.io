# AI助手 API 配置说明

## 概述

AI助手已经集成了**硅基流动(SiliconFlow)**大模型API，支持多种国产大模型。

## 快速配置

### 1. 获取API Key

1. 访问 [硅基流动官网](https://cloud.siliconflow.cn/)
2. 注册/登录账号
3. 进入「API密钥」页面
4. 创建新的API Key

### 2. 配置环境变量

**方法一：创建 .env 文件（推荐）**

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，填入你的API Key
VITE_SILICONFLOW_API_KEY=你的实际API密钥
```

**方法二：直接创建 .env 文件**

在项目根目录创建 `.env` 文件：

```env
# 硅基流动 API Key
VITE_SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# 可选：指定模型（默认使用 DeepSeek-V2.5）
VITE_SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V2.5
```

### 3. 重启开发服务器

```bash
npm run dev
```

## 支持的模型

| 模型名称 | 说明 |
|---------|------|
| `deepseek-ai/DeepSeek-V2.5` | 默认模型，性价比高 |
| `deepseek-ai/DeepSeek-V3` | 最新版本，性能更强 |
| `Qwen/Qwen2.5-72B-Instruct` | 通义千问72B |
| `Qwen/Qwen2.5-32B-Instruct` | 通义千问32B |
| `Qwen/Qwen2.5-14B-Instruct` | 通义千问14B |
| `THUDM/glm-4-9b-chat` | 智谱GLM-4 |
| `01-ai/Yi-1.5-34B-Chat` | 零一万物 |
| `meta-llama/Meta-Llama-3.1-70B-Instruct` | Llama 3.1 |

## 费用说明

硅基流动提供**免费额度**，新注册用户可获得一定数量的免费Token。具体费用请参考：
- [硅基流动定价页面](https://siliconflow.cn/pricing)

## 故障排查

### 问题：提示"未配置API Key"

**解决方案：**
1. 检查 `.env` 文件是否存在
2. 确认 `VITE_SILICONFLOW_API_KEY` 已正确设置
3. 重启开发服务器

### 问题：API请求失败

**解决方案：**
1. 检查API Key是否正确（以 `sk-` 开头）
2. 检查网络连接
3. 查看浏览器控制台错误信息
4. 确认账户余额充足

### 问题：回复速度慢

**解决方案：**
1. 尝试切换不同的模型
2. 检查网络连接
3. 减少历史消息数量

## 安全提示

⚠️ **重要：**
- 不要将 `.env` 文件提交到Git仓库（已添加到 `.gitignore`）
- 不要在客户端代码中硬编码API Key
- 定期更换API Key

## 文件结构

```
app/
├── src/
│   ├── services/
│   │   └── aiApi.ts          # API服务封装
│   ├── pages/
│   │   ├── AIPage.tsx        # AI助手页面
│   │   └── AIPage.css        # 样式文件
│   └── vite-env.d.ts         # 环境变量类型声明
├── .env                      # 环境变量（需要创建）
├── .env.example              # 环境变量示例
└── AI_API_SETUP.md           # 本说明文档
```

## 自定义配置

如需修改系统提示词或调整模型参数，请编辑 `src/services/aiApi.ts` 文件。

## 技术支持

- 硅基流动文档：https://docs.siliconflow.cn/
- 硅基流动控制台：https://cloud.siliconflow.cn/
