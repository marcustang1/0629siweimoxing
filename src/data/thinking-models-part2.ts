import { ThinkingModel } from '../types/thinking-models';

export const THINKING_MODELS_PART2: ThinkingModel[] = [
  {
    id: 'satisficing',
    name: '满足者策略',
    nameEn: 'Satisficing',
    category: '决策分析',
    description: '寻求"满意度"而非完美，避免过度优化',
    detailedDescription: '区分满足者（设定标准，达到即可）和最大化者（追求最优解），采用37%法则等实用边界',
    applicableScenarios: ['招聘决策', '产品选择', '合作伙伴选择', '投资决策', '日常选择', '资源分配'],
    keywords: ['满意', '标准', '效率', '选择', '边界', '37%法则', '够用', '实用'],
    tags: ['决策优化', '效率工具', '实用主义'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['40-70-rule', 'pareto-principle'],
    promptTemplate: `请使用满足者策略分析以下选择问题：{question}

分析框架：

**设定满意标准：**
- 什么样的结果是可以接受的？
- 必须满足的核心要求是什么？

**避免过度优化：**
- 继续寻找更好选项的成本是多少？
- 当前选项是否已经"足够好"？

**实施建议：**
- 设定明确的评估标准
- 达到标准后停止搜索
- 避免无休止的比较

请提供具体的标准设定和决策建议。`,
    exampleQuestions: ['如何选择合适的员工？', '怎样选择性价比最高的产品？', '如何在有限时间内做出好决策？']
  },

  {
    id: '40-70-rule',
    name: '40%-70%法则',
    nameEn: '40-70 Rule',
    category: '决策分析',
    description: '在信息充足度40%-70%之间做决策',
    detailedDescription: '少于40%信息时决策过于鲁莽，超过70%时过于谨慎错失机会，最佳区间是40%-70%',
    applicableScenarios: ['商业决策', '投资时机', '产品发布', '市场进入', '战略规划', '项目启动'],
    keywords: ['信息', '时机', '平衡', '行动', '谨慎', '机会', '决策时机', '风险'],
    tags: ['决策时机', '信息平衡', '行动指南'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['satisficing', 'reversible-decisions'],
    promptTemplate: `请使用40%-70%法则评估以下决策时机：{question}

评估框架：

**当前信息充足度评估：**
- 我们现在掌握了多少相关信息？
- 还有哪些关键信息缺失？

**信息区间分析：**
- 少于40%：风险过高，需要更多信息
- 40%-70%：最佳决策区间，应该行动
- 超过70%：可能错失机会，陷入分析瘫痪

**行动建议：**
- 如果在最佳区间，建议立即行动
- 如果信息不足，确定还需要哪些关键信息
- 如果信息过多，专注于核心要素

请给出具体的信息评估和行动建议。`,
    exampleQuestions: ['现在是进入这个市场的好时机吗？', '产品是否已经准备好发布？', '这个投资机会应该把握吗？']
  },

  {
    id: 'regret-minimization',
    name: '遗憾最小化框架',
    nameEn: 'Regret Minimization Framework',
    category: '决策分析',
    description: '从未来80岁的角度思考当前决策',
    detailedDescription: '想象自己80岁时回顾人生，思考哪些决策会让未来的自己感到遗憾，以此指导当前选择',
    applicableScenarios: ['人生重大决策', '职业转换', '创业选择', '感情决策', '冒险机会', '投资决策'],
    keywords: ['遗憾', '未来', '80岁', '人生', '长远', '价值观', '意义', '选择'],
    tags: ['人生规划', '长远思考', '价值决策'],
    difficulty: 'medium',
    usageFrequency: 6,
    relatedModels: ['second-order-thinking', 'first-principles'],
    promptTemplate: `请使用遗憾最小化框架分析以下人生决策：{question}

思考步骤：

**未来视角：**
- 想象自己已经80岁，回顾这个决策
- 如果选择A，80岁的我会有什么感受？
- 如果选择B，80岁的我会有什么感受？

**遗憾分析：**
- 哪种选择更可能让我感到遗憾？
- 不行动的遗憾 vs 行动失败的遗憾
- 哪种遗憾我更难以承受？

**价值对齐：**
- 这个决策是否符合我的核心价值观？
- 这个选择是否会让我成为想成为的人？

请提供基于长远视角的决策建议。`,
    exampleQuestions: ['我应该离开稳定工作去创业吗？', '要不要为了梦想放弃现有机会？', '这个冒险值得承担吗？']
  },

  {
    id: 'black-swan-thinking',
    name: '黑天鹅思维',
    nameEn: 'Black Swan Thinking',
    category: '风险管理',
    description: '理解异常事件不应改变基本判断',
    detailedDescription: '黑天鹅事件是极端异常的事件，不应该让这些异常事件改变我们对常态的判断和决策',
    applicableScenarios: ['风险评估', '投资决策', '业务规划', '保险规划', '危机管理', '预期管理'],
    keywords: ['异常', '极端事件', '常态', '概率', '风险', '预期', '理性', '规律'],
    tags: ['风险管理', '概率思维', '理性决策'],
    difficulty: 'hard',
    usageFrequency: 5,
    relatedModels: ['mean-reversion', 'bayes-theorem'],
    promptTemplate: `请使用黑天鹅思维分析以下风险情况：{question}

分析框架：

**事件分类：**
- 这是常态事件还是异常事件？
- 这种情况发生的历史频率如何？

**黑天鹅识别：**
- 哪些是真正的黑天鹅事件（极端异常）？
- 哪些看似异常但实际有规律可循？

**决策建议：**
- 不要因为黑天鹅事件改变基本策略
- 保持对常态的正确判断
- 适当准备但不过度反应

**风险管理：**
- 如何在不被异常事件误导的同时做好准备？

请提供理性的风险评估和应对建议。`,
    exampleQuestions: ['如何看待市场的极端波动？', '是否应该因为小概率风险改变计划？', '如何平衡风险准备和正常经营？']
  }
];

export default THINKING_MODELS_PART2; 