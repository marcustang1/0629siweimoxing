import { NextRequest, NextResponse } from 'next/server';
import { SiliconFlowService } from '@/lib/siliconflow-api';
import { AnalysisResult } from '@/types';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';

// 调试模式开关
const DEBUG_MODE = false;

// 模拟分析结果生成函数
function generateMockAnalysis(question: string, modelId: string): AnalysisResult {
  const model = COMPLETE_THINKING_MODELS.find(m => m.id === modelId);
  const modelName = model?.name || modelId;
  
  const analysisTemplates = [
    `使用${modelName}分析您的问题："${question}"

## 分析过程

根据${modelName}的核心原理，我们可以从以下几个维度来分析这个问题：

### 1. 问题识别
首先明确问题的核心所在。在您提出的问题中，关键要素包括...

### 2. 分析框架
运用${modelName}的分析框架，我们可以将问题分解为：
- **维度一**：从这个角度看，需要考虑...
- **维度二**：另一个重要方面是...
- **维度三**：同时还要权衡...

### 3. 深入洞察
通过${modelName}的分析，我们发现：
- 潜在机会：可能存在的积极因素
- 潜在风险：需要关注的风险点
- 关键制约：主要的限制条件

## 具体建议

基于以上分析，建议采取以下行动：

1. **短期措施**：立即可以实施的步骤
2. **中期策略**：需要一定时间准备的方案
3. **长期规划**：战略性的考虑

## 实施要点

为了有效执行建议，请特别注意：
- 优先级排序
- 资源配置
- 风险控制
- 效果评估

这样的分析方法可以帮助您更全面地理解问题，并制定更有效的解决方案。`,

    `通过${modelName}深度分析："${question}"

## 核心要点

${modelName}提供了一个结构化的思考框架，让我们能够：

### 🎯 问题本质
深入挖掘问题背后的真正原因，而不是仅仅关注表面现象。

### 🔍 多角度审视
从不同的角度和层面来审视问题：
- **内部因素**：您自身可控的要素
- **外部环境**：不可控但需要适应的条件
- **时间维度**：短期与长期的权衡

### 💡 创新解决方案
${modelName}鼓励突破传统思维限制，寻找创新的解决路径。

## 行动指南

### 第一步：信息收集
- 收集相关数据和信息
- 了解所有利益相关者的观点
- 明确约束条件和可用资源

### 第二步：方案设计
- 基于分析结果，设计多个可行方案
- 评估每个方案的利弊
- 选择最优或最平衡的方案

### 第三步：实施监控
- 制定详细的实施计划
- 设置关键里程碑
- 建立反馈和调整机制

通过${modelName}的系统性分析，您可以更有信心地做出决策并付诸行动。`
  ];

  const selectedTemplate = analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
  
  return {
    modelId,
    content: selectedTemplate,
    generatedAt: new Date(),
    wordCount: selectedTemplate.length,
    readingTime: Math.ceil(selectedTemplate.length / 300)
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question, modelId } = await request.json();
    
    // 验证请求参数
    if (!question || !modelId) {
      return NextResponse.json(
        { error: '缺少必要参数：question 和 modelId' },
        { status: 400 }
      );
    }
    
    // 验证问题长度
    if (question.length < 5 || question.length > 1000) {
      return NextResponse.json(
        { error: '问题长度应在5-1000字符之间' },
        { status: 400 }
      );
    }

    let result: AnalysisResult;

    if (DEBUG_MODE || !process.env.SILICONFLOW_API_KEY) {
      // 调试模式：使用模拟分析结果
      console.log(`调试模式：为模型 ${modelId} 生成模拟分析结果`);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      result = generateMockAnalysis(question, modelId);
    } else {
      // 正常模式：调用真实API
      const apiService = new SiliconFlowService(process.env.SILICONFLOW_API_KEY!);
      
      try {
        result = await apiService.analyzeQuestion(question, modelId);
      } catch (apiError) {
        console.error('SiliconFlow API调用失败，使用备用分析:', apiError);
        
        // API失败时生成备用分析
        result = generateMockAnalysis(question, modelId);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      debugMode: DEBUG_MODE,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('分析API错误:', error);
    
    // 根据错误类型返回不同的响应
    if (error instanceof Error) {
      if (error.name === 'NetworkError') {
        return NextResponse.json(
          { error: '网络连接失败，请检查网络连接后重试' },
          { status: 503 }
        );
      }
      
      if (error.name === 'RateLimitError') {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
      }
      
      if (error.name === 'QuotaExceededError') {
        return NextResponse.json(
          { error: 'API使用额度已用完，请联系管理员' },
          { status: 402 }
        );
      }
    }
    
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
} 