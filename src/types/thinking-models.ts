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