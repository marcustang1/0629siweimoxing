import { ThinkingModel } from '../types/thinking-models';

export const THINKING_MODELS: ThinkingModel[] = [
  {
    id: 'eisenhower-matrix',
    name: '艾森豪威尔矩阵',
    nameEn: 'Eisenhower Matrix',
    category: '时间管理',
    description: '区分重要任务和紧急任务，优化时间分配',
    detailedDescription: '将任务按重要性和紧急性分为四个象限：重要且紧急（立即做）、重要不紧急（安排时间做）、不重要但紧急（委派他人）、不重要不紧急（删除）',
    applicableScenarios: ['任务规划', '时间管理', '工作优先级', '项目管理', '日程安排', '团队分工'],
    keywords: ['优先级', '重要', '紧急', '时间管理', '任务分配', '效率', '规划', '决策'],
    tags: ['时间管理', '效率工具', '决策框架'],
    difficulty: 'easy',
    usageFrequency: 9,
    relatedModels: ['pareto-principle', 'not-to-do-list'],
    promptTemplate: `请使用艾森豪威尔矩阵分析以下情况：{question}

请将涉及的任务或问题按照以下四个象限进行分类：

**第一象限：重要且紧急（立即执行）**
- 需要马上处理的重要事项

**第二象限：重要但不紧急（计划执行）** 
- 需要安排时间重点处理的事项

**第三象限：不重要但紧急（委派执行）**
- 可以委托他人处理的事项

**第四象限：不重要且不紧急（删除）**
- 应该直接删除或忽略的事项

请为每个象限提供具体的任务清单和建议的处理方式。`,
    exampleQuestions: ['如何合理安排我的工作任务？', '怎样提高工作效率？', '如何平衡工作和生活？']
  },

  {
    id: 'second-order-thinking',
    name: '二阶思维',
    nameEn: 'Second Order Thinking',
    category: '逻辑思维',
    description: '考虑决策的长远影响和连锁反应',
    detailedDescription: '不仅考虑直接后果，更要思考决策会引发的连锁反应，像多米诺骨牌一样的长远影响',
    applicableScenarios: ['战略决策', '投资选择', '政策制定', '商业规划', '人生规划', '风险评估'],
    keywords: ['长远', '连锁反应', '影响', '后果', '多米诺', '深度思考', '战略', '预测'],
    tags: ['深度思考', '战略规划', '风险评估'],
    difficulty: 'hard',
    usageFrequency: 7,
    relatedModels: ['first-principles', 'systems-thinking'],
    promptTemplate: `请运用二阶思维深度分析以下问题：{question}

分析框架：

**一阶影响（直接后果）：**
- 这个决策/行动会直接产生什么结果？

**二阶影响（间接后果）：**
- 这些直接结果又会引发什么连锁反应？
- 会影响到哪些相关方？
- 长期来看会产生什么影响？

**多阶影响（系统性后果）：**
- 在更大的系统中会产生什么影响？
- 有哪些意想不到的后果？
- 哪些"多米诺骨牌"是无法推倒的（机会成本）？

请提供具体的分析和建议。`,
    exampleQuestions: ['这项投资决策的长远影响是什么？', '实施这个政策会产生哪些连锁反应？', '这个商业决策的系统性影响如何？']
  },

  {
    id: 'reversible-decisions',
    name: '可逆决策',
    nameEn: 'Reversible Decisions',
    category: '决策分析',
    description: '区分可逆和不可逆决策，消除犹豫不决',
    detailedDescription: '将决策分为可逆（可以撤销或修改）和不可逆（难以回头）两类，对可逆决策快速行动，对不可逆决策谨慎考虑',
    applicableScenarios: ['产品开发', '业务决策', '职业选择', '投资决策', '创业选择', '生活决策'],
    keywords: ['决策', '可逆', '不可逆', '行动', '试错', '快速', '谨慎', '风险'],
    tags: ['决策框架', '行动指南', '风险管理'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['regret-minimization', '40-70-rule'],
    promptTemplate: `请使用可逆决策框架分析以下问题：{question}

分析步骤：

**决策分类：**
- 这个决策是可逆的还是不可逆的？
- 如果做错了，撤销的成本有多高？

**可逆决策处理：**
- 如果是可逆决策，建议快速行动
- 通过实际行动获得数据和反馈
- 根据结果调整或撤销

**不可逆决策处理：**
- 如果是不可逆决策，需要更谨慎的分析
- 收集更多信息和意见
- 考虑所有可能的后果

请给出具体的决策建议和行动计划。`,
    exampleQuestions: ['我应该换工作吗？', '是否应该投资这个项目？', '要不要搬到新城市？']
  }
];

// 继续添加其他27个模型...
export const ADDITIONAL_MODELS: ThinkingModel[] = [
  // 这里会包含其余27个模型的完整定义
];

// 导出完整的模型列表
export const ALL_THINKING_MODELS = [...THINKING_MODELS, ...ADDITIONAL_MODELS]; 