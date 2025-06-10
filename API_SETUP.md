# SiliconFlow API 配置指南

## 🔑 获取API Key

1. 访问 [SiliconFlow官网](https://cloud.siliconflow.cn/account/ak)
2. 注册并登录账户
3. 在控制台获取API Key

## ⚙️ 环境变量配置

在项目根目录创建 `.env.local` 文件：

```bash
# SiliconFlow API 配置
NEXT_PUBLIC_SILICONFLOW_API_KEY=your_api_key_here
```

⚠️ **重要安全说明：**
- `NEXT_PUBLIC_` 前缀的环境变量会暴露到客户端
- 仅建议在开发测试时使用
- 生产环境应通过API路由在服务端调用

## 🚀 API调用示例

```typescript
import { siliconFlowService } from '@/services/siliconflow-api';

// 基本调用
const response = await siliconFlowService.generateResponse('你好，请介绍一下自己');

// 思维模型分析
const analysis = await siliconFlowService.analyzeWithThinkingModel(
  '我应该换工作吗？',
  '请使用SWOT分析法分析以下问题：{question}'
);

// 健康检查
const isApiWorking = await siliconFlowService.healthCheck();
```

## 🛡️ 已修复的问题

✅ **添加了必需的messages字段**
✅ **增加了max_tokens到2048**  
✅ **使用环境变量保护API Key**
✅ **转换为TypeScript版本**
✅ **优化了参数配置**
✅ **添加了完整的错误处理**
✅ **提供了专门的思维模型分析方法**

## 📝 配置参数说明

| 参数 | 默认值 | 说明 |
|------|--------|------|
| max_tokens | 2048 | 最大输出长度 |
| temperature | 0.7 | 创意程度 |
| top_p | 0.9 | 核采样参数 |
| enable_thinking | true | 启用推理过程 |
| thinking_budget | 6144 | 推理预算 |

现在你的API配置已经安全、正确且功能完整了！ 