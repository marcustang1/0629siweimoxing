export interface ThinkingModel {
  id: string;                    // 唯一标识符
  name: string;                  // 模型名称
  nameEn?: string;              // 英文名称（如果有）
  category: ModelCategory;       // 分类
  description: string;           // 简短描述
  detailedDescription: string;   // 详细说明
  applicableScenarios: string[]; // 适用场景
  keywords: string[];            // 关键词（用于检索）
  tags: string[];               // 标签
  difficulty: 'easy' | 'medium' | 'hard'; // 难度等级
  usageFrequency: number;       // 使用频率权重(1-10)
  relatedModels: string[];      // 相关模型ID
  promptTemplate: string;       // AI分析提示词模板
  exampleQuestions: string[];   // 示例问题
}

export type ModelCategory = 
  | '决策分析' 
  | '逻辑思维' 
  | '问题解决' 
  | '时间管理'
  | '创新思维'
  | '风险管理'
  | '效率优化'
  | '认知偏差'
  | '系统思维'
  | '沟通协作';

export interface ModelMatchResult {
  model: ThinkingModel;
  relevanceScore: number;
  matchedKeywords: string[];
  reason?: string;
}

export interface ModelSuggestion {
  model: ThinkingModel;
  reason: string;
  relevanceScore: number;
}

export interface AnalysisResult {
  modelId: string;
  content: string;
  generatedAt: Date;
  wordCount: number;
  readingTime: number;
}

export interface AppState {
  // 用户输入
  question: string;
  isQuestionValid: boolean;
  
  // 模型选择
  suggestedModels: ThinkingModel[];
  selectedModels: string[];
  showAllModels: boolean;
  
  // 分析结果
  interpretations: Record<string, AnalysisResult>;
  
  // UI状态
  loadingStates: Record<string, LoadingState>;
  errors: Record<string, ErrorState>;
  
  // 应用元数据
  sessionHistory: string[];
  preferences: UserPreferences;
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  stage?: 'analyzing' | 'generating' | 'formatting';
}

export interface ErrorState {
  hasError: boolean;
  errorType: 'network' | 'api_limit' | 'validation' | 'unknown';
  message: string;
  retryCount: number;
  canRetry: boolean;
}

export interface UserPreferences {
  preferredModels: string[];
  defaultDifficulty?: 'easy' | 'medium' | 'hard';
  maxSuggestions: number;
}

// API相关类型
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SiliconFlowRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  max_tokens?: number;
  temperature?: number;
}

export interface SiliconFlowResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 错误类型
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuotaExceededError';
  }
} 