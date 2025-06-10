// SiliconFlow API 服务
interface SiliconFlowMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SiliconFlowRequest {
  model: string;
  messages: SiliconFlowMessage[];
  max_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
  min_p: number;
  enable_thinking: boolean;
  thinking_budget: number;
  stream: boolean;
  n: number;
  stop: string[];
}

interface SiliconFlowResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface ApiCallOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  enableThinking?: boolean;
  thinkingBudget?: number;
}

export class SiliconFlowService {
  private readonly baseUrl = 'https://api.siliconflow.cn/v1/chat/completions';
  private readonly model = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B';
  
  private getApiKey(): string {
    // 注意：在实际部署时，需要在环境变量中设置 NEXT_PUBLIC_SILICONFLOW_API_KEY
    // 或者通过API路由在服务端调用，避免在客户端暴露API密钥
    const apiKey = (globalThis as any)?.process?.env?.NEXT_PUBLIC_SILICONFLOW_API_KEY;
    
    if (!apiKey) {
      throw new Error('SiliconFlow API Key not found. Please set NEXT_PUBLIC_SILICONFLOW_API_KEY in your .env.local file.');
    }
    
    return apiKey;
  }

  private buildRequestPayload(
    messages: SiliconFlowMessage[], 
    options: ApiCallOptions = {}
  ): SiliconFlowRequest {
    const {
      maxTokens = 2048,        // 修复：增加输出长度
      temperature = 0.7,
      topP = 0.9,              // 修复：优化参数
      enableThinking = true,
      thinkingBudget = 4096
    } = options;

    return {
      model: this.model,
      messages,                 // 修复：添加必需的messages字段
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      top_k: 50,
      frequency_penalty: 0.5,
      min_p: 0.05,
      enable_thinking: enableThinking,
      thinking_budget: thinkingBudget,
      stream: false,
      n: 1,
      stop: []
    };
  }

  private buildHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.getApiKey()}`, // 修复：使用环境变量
      'Content-Type': 'application/json'
    };
  }

  /**
   * 调用SiliconFlow API进行文本生成
   * @param userMessage 用户输入的消息
   * @param systemMessage 可选的系统提示词
   * @param options 可选的API参数配置
   * @returns AI生成的回复内容
   */
  async generateResponse(
    userMessage: string,
    systemMessage?: string,
    options: ApiCallOptions = {}
  ): Promise<string> {
    try {
      // 构建消息数组
      const messages: SiliconFlowMessage[] = [];
      
      if (systemMessage) {
        messages.push({
          role: 'system',
          content: systemMessage
        });
      }
      
      messages.push({
        role: 'user',
        content: userMessage
      });

      // 构建请求
      const payload = this.buildRequestPayload(messages, options);
      const headers = this.buildHeaders();

      // 发送请求
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      // 检查响应状态
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // 解析响应
      const data: SiliconFlowResponse = await response.json();
      
      // 验证响应格式
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Invalid API response: No choices returned');
      }

      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid API response: No content in response');
      }

      return content.trim();

    } catch (error) {
      // 增强错误处理
      if (error instanceof Error) {
        throw new Error(`SiliconFlow API Error: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while calling SiliconFlow API');
      }
    }
  }

  /**
   * 专门用于思维模型分析的方法
   * @param question 用户问题
   * @param thinkingModelPrompt 思维模型的提示词模板
   * @returns 分析结果
   */
  async analyzeWithThinkingModel(
    question: string,
    thinkingModelPrompt: string
  ): Promise<string> {
    // 将问题插入到提示词模板中
    const finalPrompt = thinkingModelPrompt.replace('{question}', question);
    
    // 使用更高的thinking_budget进行复杂分析
    return this.generateResponse(finalPrompt, undefined, {
      maxTokens: 2048,
      temperature: 0.7,
      enableThinking: true,
      thinkingBudget: 6144  // 为复杂分析提供更多推理预算
    });
  }

  /**
   * 批量分析多个思维模型
   * @param question 用户问题
   * @param modelPrompts 多个思维模型的提示词
   * @returns 分析结果数组
   */
  async batchAnalyze(
    question: string,
    modelPrompts: Array<{ modelId: string; prompt: string }>
  ): Promise<Array<{ modelId: string; result: string; error?: string }>> {
    const results = await Promise.allSettled(
      modelPrompts.map(async ({ modelId, prompt }) => {
        const result = await this.analyzeWithThinkingModel(question, prompt);
        return { modelId, result };
      })
    );

    return results.map((result, index) => {
      const modelId = modelPrompts[index].modelId;
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          modelId,
          result: '',
          error: result.reason?.message || 'Unknown error'
        };
      }
    });
  }

  /**
   * 健康检查：测试API连接
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.generateResponse('Hello', undefined, { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error('SiliconFlow API health check failed:', error);
      return false;
    }
  }
}

// 导出单例实例
export const siliconFlowService = new SiliconFlowService(); 