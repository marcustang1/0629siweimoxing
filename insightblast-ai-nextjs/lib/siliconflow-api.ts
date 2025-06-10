import { AnalysisResult, SiliconFlowRequest, SiliconFlowResponse, APIError, NetworkError, RateLimitError, QuotaExceededError } from '@/types';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';

export class SiliconFlowService {
  constructor(private apiKey: string) {}

  // 获取模型推荐
  async getRecommendedModels(question: string): Promise<string[]> {
    const prompt = `
用户问题：${question}

请从以下思维模型中选择最适合分析这个问题的6个模型ID：

决策分析类：decision-tree, pros-cons, opportunity-cost, reversible-decisions, satisficing, 40-70-rule
逻辑思维类：first-principles, second-order-thinking, inversion, systems-thinking, mental-models
创新思维类：design-thinking, blue-ocean, scamper, lateral-thinking, six-hats
效率优化类：eisenhower-matrix, pareto-principle, time-blocking, genius-zone, diminishing-returns
问题解决类：root-cause, fishbone, five-whys, hypothesis-testing, red-team
沟通协作类：peer-review, darwin-golden-rule, steel-man, perspective-taking, feedback-loops

请直接返回6个模型ID，用逗号分隔，不需要解释。例如：decision-tree,pros-cons,swot,root-cause,design-thinking,cost-benefit
    `;
    
    const response = await this.makeRequest({ 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150  // 推荐结果很短
    });
    
    const modelIds = response.content.split(',').map(id => id.trim());
    
    // 验证返回的模型ID是否有效
    const validIds = modelIds.filter(id => 
      COMPLETE_THINKING_MODELS.some(m => m.id === id)
    );
    
    // 如果有效模型少于6个，补充热门模型
    if (validIds.length < 6) {
      const popularModels = COMPLETE_THINKING_MODELS
        .filter(m => !validIds.includes(m.id))
        .sort((a, b) => b.usageFrequency - a.usageFrequency)
        .slice(0, 6 - validIds.length)
        .map(m => m.id);
      
      validIds.push(...popularModels);
    }
    
    return validIds.slice(0, 6);
  }
  
  // 执行问题分析
  async analyzeQuestion(question: string, modelId: string): Promise<AnalysisResult> {
    const model = COMPLETE_THINKING_MODELS.find(m => m.id === modelId);
    if (!model) throw new Error(`模型 ${modelId} 未找到`);
    
    const prompt = `
请使用"${model.name}"思维模型分析以下问题：

问题：${question}

模型说明：${model.description}
应用场景：${model.applicableScenarios.join('、')}

请提供详细的分析，包括：
1. 使用该思维模型的分析过程
2. 具体的见解和建议
3. 可能的行动方案

请用中文回答，内容要实用且具体。
    `;
    
    const response = await this.makeRequest({ 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048  // 分析结果较长
    });
    
    return {
      modelId,
      content: response.content,
      generatedAt: new Date(),
      wordCount: response.content.length,
      readingTime: Math.ceil(response.content.length / 300) // 假设每分钟300字
    };
  }
  
  // 基础请求方法
  private async makeRequest(payload: SiliconFlowRequest, retryCount = 0): Promise<SiliconFlowResponse> {
    try {
      const response = await fetch(process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
          ...payload
        })
      });
      
      if (!response.ok) {
        throw new APIError(response.status, await response.text());
      }
      
      const data = await response.json();
      
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage
      };
      
    } catch (error) {
      return this.handleError(error, payload, retryCount);
    }
  }
  
  private async handleError(error: unknown, payload: SiliconFlowRequest, retryCount: number): Promise<SiliconFlowResponse> {
    // 网络错误（指数退避重试）
    if (error instanceof Error && error.name === 'TypeError') {
      if (retryCount < 3) {
        await this.delay(1000 * Math.pow(2, retryCount));
        return this.makeRequest(payload, retryCount + 1);
      }
      throw new NetworkError('连接失败，请检查网络连接');
    }
    
    // API速率限制
    if (error instanceof APIError && error.status === 429) {
      throw new RateLimitError('请求过于频繁，请稍后再试');
    }
    
    // API配额超出
    if (error instanceof APIError && error.status === 402) {
      throw new QuotaExceededError('API 使用额度已用完');
    }
    
    throw error;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 客户端调用包装器
export class ClientAPIService {
  // 客户端通过内部API调用，无需暴露密钥
  async analyzeQuestion(question: string, modelId: string) {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, modelId })
    });
    
    if (!response.ok) {
      throw new Error('分析请求失败');
    }
    
    return response.json();
  }
  
  async getRecommendedModels(question: string) {
    const response = await fetch('/api/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    
    if (!response.ok) {
      throw new Error('模型推荐失败');
    }
    
    return response.json();
  }
} 