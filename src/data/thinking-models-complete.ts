import { ThinkingModel } from '../types/thinking-models';

// 完整的30个思维模型索引库
export const COMPLETE_THINKING_MODELS: ThinkingModel[] = [
  // 时间管理类
  {
    id: 'eisenhower-matrix',
    name: '艾森豪威尔矩阵',
    category: '时间管理',
    description: '区分重要任务和紧急任务，优化时间分配',
    detailedDescription: '将任务按重要性和紧急性分为四个象限进行优先级管理',
    applicableScenarios: ['任务规划', '时间管理', '工作优先级', '项目管理'],
    keywords: ['优先级', '重要', '紧急', '时间管理', '任务分配', '效率'],
    tags: ['时间管理', '效率工具'],
    difficulty: 'easy',
    usageFrequency: 9,
    relatedModels: ['pareto-principle'],
    promptTemplate: '使用艾森豪威尔矩阵分析任务优先级：{question}',
    exampleQuestions: ['如何合理安排工作任务？', '怎样提高工作效率？']
  },

  // 逻辑思维类
  {
    id: 'second-order-thinking',
    name: '二阶思维',
    category: '逻辑思维', 
    description: '考虑决策的长远影响和连锁反应',
    detailedDescription: '不仅考虑直接后果，更要思考决策引发的连锁反应',
    applicableScenarios: ['战略决策', '投资选择', '政策制定', '商业规划'],
    keywords: ['长远', '连锁反应', '影响', '后果', '深度思考', '战略'],
    tags: ['深度思考', '战略规划'],
    difficulty: 'hard',
    usageFrequency: 7,
    relatedModels: ['first-principles', 'systems-thinking'],
    promptTemplate: '运用二阶思维分析长远影响：{question}',
    exampleQuestions: ['这项投资的长远影响？', '政策的连锁反应？']
  },

  // 决策分析类
  {
    id: 'reversible-decisions',
    name: '可逆决策',
    category: '决策分析',
    description: '区分可逆和不可逆决策，消除犹豫不决',
    detailedDescription: '将决策分为可逆和不可逆两类，采用不同的决策策略',
    applicableScenarios: ['产品开发', '业务决策', '职业选择', '投资决策'],
    keywords: ['决策', '可逆', '不可逆', '行动', '试错', '风险'],
    tags: ['决策框架', '行动指南'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['regret-minimization', '40-70-rule'],
    promptTemplate: '用可逆决策框架分析：{question}',
    exampleQuestions: ['应该换工作吗？', '是否投资这个项目？']
  },

  {
    id: 'satisficing',
    name: '满足者策略',
    category: '决策分析',
    description: '寻求"满意度"而非完美，避免过度优化',
    detailedDescription: '设定满意标准，达到即可，避免无休止的寻找最优解',
    applicableScenarios: ['招聘决策', '产品选择', '合作伙伴选择'],
    keywords: ['满意', '标准', '效率', '选择', '37%法则', '够用'],
    tags: ['决策优化', '效率工具'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['40-70-rule', 'pareto-principle'],
    promptTemplate: '用满足者策略分析选择：{question}',
    exampleQuestions: ['如何选择合适员工？', '怎样选择性价比产品？']
  },

  {
    id: '40-70-rule',
    name: '40%-70%法则',
    category: '决策分析',
    description: '在信息充足度40%-70%之间做决策',
    detailedDescription: '避免信息不足的鲁莽和信息过载的犹豫，在最佳区间行动',
    applicableScenarios: ['商业决策', '投资时机', '产品发布', '市场进入'],
    keywords: ['信息', '时机', '平衡', '行动', '决策时机'],
    tags: ['决策时机', '信息平衡'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['satisficing', 'reversible-decisions'],
    promptTemplate: '用40%-70%法则评估决策时机：{question}',
    exampleQuestions: ['现在进入市场的时机？', '产品准备好发布了吗？']
  },

  {
    id: 'regret-minimization',
    name: '遗憾最小化框架',
    category: '决策分析',
    description: '从未来80岁的角度思考当前决策',
    detailedDescription: '想象未来回顾人生时的感受，以此指导重要决策',
    applicableScenarios: ['人生重大决策', '职业转换', '创业选择'],
    keywords: ['遗憾', '未来', '80岁', '人生', '长远', '价值观'],
    tags: ['人生规划', '长远思考'],
    difficulty: 'medium',
    usageFrequency: 6,
    relatedModels: ['second-order-thinking'],
    promptTemplate: '用遗憾最小化框架分析：{question}',
    exampleQuestions: ['应该离职创业吗？', '要为梦想放弃机会吗？']
  },

  // 风险管理类
  {
    id: 'black-swan-thinking',
    name: '黑天鹅思维',
    category: '风险管理',
    description: '理解异常事件不应改变基本判断',
    detailedDescription: '不被极端异常事件误导，保持对常态的正确判断',
    applicableScenarios: ['风险评估', '投资决策', '业务规划', '危机管理'],
    keywords: ['异常', '极端事件', '常态', '概率', '风险', '理性'],
    tags: ['风险管理', '概率思维'],
    difficulty: 'hard',
    usageFrequency: 5,
    relatedModels: ['mean-reversion', 'bayes-theorem'],
    promptTemplate: '用黑天鹅思维分析风险：{question}',
    exampleQuestions: ['如何看待市场极端波动？', '是否因小概率风险改变计划？']
  },

  {
    id: 'diminishing-returns',
    name: '收益递减规律',
    category: '效率优化',
    description: '寻找投入产出的均衡点',
    detailedDescription: '理解投入增加到一定程度后，产出增长会逐渐放缓',
    applicableScenarios: ['资源分配', '时间管理', '投资决策', '学习规划'],
    keywords: ['均衡点', '投入', '产出', '效率', '边际效益'],
    tags: ['效率优化', '资源管理'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['pareto-principle'],
    promptTemplate: '用收益递减规律分析效率：{question}',
    exampleQuestions: ['如何优化投入产出比？', '何时停止继续投入？']
  },

  {
    id: 'mean-reversion',
    name: '均值回归',
    category: '风险管理',
    description: '异常事件后等待回归常态',
    detailedDescription: '相信极端情况后，事物会回归到正常状态',
    applicableScenarios: ['投资决策', '市场分析', '业绩评估', '情绪管理'],
    keywords: ['均值', '回归', '常态', '极端', '等待', '耐心'],
    tags: ['概率思维', '耐心策略'],
    difficulty: 'medium',
    usageFrequency: 6,
    relatedModels: ['black-swan-thinking'],
    promptTemplate: '用均值回归思维分析：{question}',
    exampleQuestions: ['市场会回归正常吗？', '这种极端情况会持续吗？']
  },

  {
    id: 'bayes-theorem',
    name: '贝叶斯定理',
    category: '逻辑思维',
    description: '根据新信息更新判断概率',
    detailedDescription: '随着新证据的出现，持续更新和调整判断',
    applicableScenarios: ['概率分析', '诊断决策', '投资判断', '预测分析'],
    keywords: ['概率', '更新', '证据', '判断', '预测', '贝叶斯'],
    tags: ['概率思维', '科学方法'],
    difficulty: 'hard',
    usageFrequency: 6,
    relatedModels: ['darwin-golden-rule'],
    promptTemplate: '用贝叶斯思维更新判断：{question}',
    exampleQuestions: ['如何根据新信息调整判断？', '这个概率如何计算？']
  },

  // 认知偏差类
  {
    id: 'darwin-golden-rule',
    name: '达尔文黄金法则',
    category: '认知偏差',
    description: '强观点，弱坚持，寻求真实情况',
    detailedDescription: '对矛盾观点保持开放态度，跟着证据走而非固执己见',
    applicableScenarios: ['观点辩论', '科学研究', '商业分析', '学习思考'],
    keywords: ['开放', '证据', '真相', '观点', '坚持', '灵活'],
    tags: ['开放思维', '科学精神'],
    difficulty: 'hard',
    usageFrequency: 7,
    relatedModels: ['peer-review', 'red-team'],
    promptTemplate: '用达尔文黄金法则寻求真相：{question}',
    exampleQuestions: ['如何客观看待这个问题？', '我的观点可能错在哪里？']
  },

  {
    id: 'system1-system2',
    name: '系统1与系统2思维',
    category: '认知偏差',
    description: '区分快思维和慢思维',
    detailedDescription: '系统1是快速直觉，系统2是深度分析，重要决策需要调动系统2',
    applicableScenarios: ['重要决策', '问题分析', '学习思考', '情绪管理'],
    keywords: ['快思维', '慢思维', '直觉', '分析', '深度', '系统'],
    tags: ['思维方式', '决策工具'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['darwin-golden-rule'],
    promptTemplate: '调动系统2深度思考：{question}',
    exampleQuestions: ['这个决策需要深度分析吗？', '直觉判断是否可靠？']
  },

  {
    id: 'peer-review',
    name: '同行评议',
    category: '沟通协作',
    description: '让观点接受他人的审视和评价',
    detailedDescription: '通过他人的视角发现盲点，提高观点的准确性',
    applicableScenarios: ['方案评估', '决策咨询', '学术研究', '团队合作'],
    keywords: ['评议', '审视', '他人视角', '盲点', '准确性', '协作'],
    tags: ['协作工具', '质量保证'],
    difficulty: 'easy',
    usageFrequency: 8,
    relatedModels: ['red-team', 'darwin-golden-rule'],
    promptTemplate: '寻求同行评议：{question}',
    exampleQuestions: ['这个方案有什么问题？', '我遗漏了什么重要因素？']
  },

  {
    id: 'red-team',
    name: '红队思维',
    category: '问题解决',
    description: '主动寻找自己观点的缺陷',
    detailedDescription: '扮演对立角色，专门寻找自己论点的漏洞和问题',
    applicableScenarios: ['方案验证', '风险评估', '辩论准备', '决策检验'],
    keywords: ['缺陷', '对立', '验证', '漏洞', '检验', '反思'],
    tags: ['批判思维', '质量保证'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['peer-review', 'correlation-causation'],
    promptTemplate: '用红队思维检验：{question}',
    exampleQuestions: ['我的方案有什么致命缺陷？', '对手会如何攻击这个观点？']
  },

  {
    id: 'correlation-causation',
    name: '相关性与因果关系',
    category: '逻辑思维',
    description: '区分相关性和因果关系',
    detailedDescription: '理解相关不等于因果，寻找真正的因果关系',
    applicableScenarios: ['数据分析', '问题诊断', '研究分析', '决策分析'],
    keywords: ['相关性', '因果关系', '真正原因', '根本原因', '5why'],
    tags: ['逻辑思维', '分析工具'],
    difficulty: 'medium',
    usageFrequency: 8,
    relatedModels: ['fishbone-diagram', '5-whys'],
    promptTemplate: '区分相关性和因果关系：{question}',
    exampleQuestions: ['这两个现象有因果关系吗？', '真正的原因是什么？']
  },

  {
    id: 'fishbone-diagram',
    name: '鱼骨图分析',
    category: '问题解决',
    description: '从结果反推多个潜在原因',
    detailedDescription: '系统性地分析一个问题或结果的多个潜在原因',
    applicableScenarios: ['问题诊断', '质量分析', '故障排除', '根因分析'],
    keywords: ['原因分析', '鱼骨图', '系统性', '潜在原因', '诊断'],
    tags: ['分析工具', '问题解决'],
    difficulty: 'easy',
    usageFrequency: 7,
    relatedModels: ['5-whys', 'correlation-causation'],
    promptTemplate: '用鱼骨图分析原因：{question}',
    exampleQuestions: ['这个问题的根本原因是什么？', '有哪些可能的影响因素？']
  },

  // 创新思维类
  {
    id: 'scamper',
    name: 'SCAMPER法',
    category: '创新思维',
    description: '七个维度激发创意解决方案',
    detailedDescription: '替代、组合、调整、修改、其他用途、消除、重排序',
    applicableScenarios: ['产品创新', '流程改进', '创意设计', '问题解决'],
    keywords: ['创意', '创新', '替代', '组合', '调整', 'SCAMPER'],
    tags: ['创新工具', '创意方法'],
    difficulty: 'easy',
    usageFrequency: 6,
    relatedModels: ['first-principles'],
    promptTemplate: '用SCAMPER法激发创意：{question}',
    exampleQuestions: ['如何改进这个产品？', '有什么创新的解决方案？']
  },

  {
    id: 'first-principles',
    name: '第一性原理',
    category: '创新思维',
    description: '回归事物本质，破除假设重新构建',
    detailedDescription: '从最基础的事实出发，打破既有假设，重新思考解决方案',
    applicableScenarios: ['创新设计', '技术突破', '商业模式创新', '复杂问题'],
    keywords: ['本质', '原理', '基础', '创新', '突破', '重构'],
    tags: ['创新工具', '深度思考'],
    difficulty: 'hard',
    usageFrequency: 7,
    relatedModels: ['inversion-thinking', 'second-order-thinking'],
    promptTemplate: '运用第一性原理分析：{question}',
    exampleQuestions: ['如何从根本上解决这个问题？', '事物的本质是什么？']
  },

  {
    id: 'inversion-thinking',
    name: '逆向思维',
    category: '创新思维',
    description: '通过考虑相反情况来解决问题',
    detailedDescription: '从反面思考问题，通过避免失败来获得成功',
    applicableScenarios: ['问题解决', '风险预防', '策略规划', '目标实现'],
    keywords: ['逆向', '反面', '避免', '失败', '相反', '倒推'],
    tags: ['创新思维', '问题解决'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['first-principles', 'expert-beginner'],
    promptTemplate: '用逆向思维分析：{question}',
    exampleQuestions: ['怎样避免失败？', '什么会让情况变糟？']
  },

  // 系统思维类
  {
    id: 'expert-beginner',
    name: '专家与新手模式',
    category: '系统思维',
    description: '平衡全局视野和细节关注',
    detailedDescription: '专家模式关注全局，新手模式关注细节，需要灵活切换',
    applicableScenarios: ['学习方法', '工作模式', '团队管理', '知识应用'],
    keywords: ['专家', '新手', '全局', '细节', '模式', '切换'],
    tags: ['学习方法', '认知模式'],
    difficulty: 'medium',
    usageFrequency: 6,
    relatedModels: ['genius-zone'],
    promptTemplate: '分析专家与新手模式：{question}',
    exampleQuestions: ['应该关注全局还是细节？', '如何平衡深度和广度？']
  },

  {
    id: 'genius-zone',
    name: '天才区理论',
    category: '效率优化',
    description: '专注于自己的核心优势领域',
    detailedDescription: '识别并专注于自己最擅长、最有价值的工作领域',
    applicableScenarios: ['职业规划', '任务分配', '团队建设', '个人发展'],
    keywords: ['优势', '天才区', '专长', '核心能力', '专注'],
    tags: ['个人发展', '效率优化'],
    difficulty: 'easy',
    usageFrequency: 8,
    relatedModels: ['not-to-do-list', 'pareto-principle'],
    promptTemplate: '寻找天才区：{question}',
    exampleQuestions: ['我的核心优势是什么？', '应该专注哪个领域？']
  },

  {
    id: 'not-to-do-list',
    name: '不该办事项清单',
    category: '效率优化',
    description: '明确不应该做的事情',
    detailedDescription: '列出低价值、不紧急、不能增值的任务，主动排除',
    applicableScenarios: ['时间管理', '任务筛选', '优先级设定', '资源分配'],
    keywords: ['排除', '低价值', '不重要', '删除', '聚焦'],
    tags: ['时间管理', '效率工具'],
    difficulty: 'easy',
    usageFrequency: 8,
    relatedModels: ['eisenhower-matrix', 'genius-zone'],
    promptTemplate: '制定不该办事项清单：{question}',
    exampleQuestions: ['我应该停止做哪些事？', '什么任务在浪费时间？']
  },

  {
    id: 'path-of-least-resistance',
    name: '阻力最小路径',
    category: '效率优化',
    description: '避免总是选择最简单的道路',
    detailedDescription: '识别并避免因为简单而选择的低效路径，追求正确而非容易',
    applicableScenarios: ['目标实现', '习惯养成', '技能学习', '自我提升'],
    keywords: ['阻力', '简单', '正确', '坚持', '自律', '有效'],
    tags: ['自我管理', '目标实现'],
    difficulty: 'medium',
    usageFrequency: 6,
    relatedModels: ['regret-minimization'],
    promptTemplate: '分析阻力最小路径：{question}',
    exampleQuestions: ['为什么选择这条路？', '这是正确的还是简单的选择？']
  },

  // 风险管理类续
  {
    id: 'murphys-law',
    name: '墨菲定律',
    category: '风险管理',
    description: '预期可能出错的事情并做好准备',
    detailedDescription: '可能出错的事情终将出错，要做好最坏情况的准备',
    applicableScenarios: ['风险管理', '应急预案', '项目管理', '质量控制'],
    keywords: ['出错', '准备', '风险', '预期', '最坏情况', '预防'],
    tags: ['风险管理', '预防思维'],
    difficulty: 'easy',
    usageFrequency: 7,
    relatedModels: ['black-swan-thinking'],
    promptTemplate: '用墨菲定律分析风险：{question}',
    exampleQuestions: ['可能出现什么问题？', '如何做好最坏准备？']
  },

  {
    id: 'occams-razor',
    name: '奥卡姆剃刀',
    category: '逻辑思维',
    description: '最简单的解释通常是正确的',
    detailedDescription: '如无必要，勿增实体，选择变量最少的解决方案',
    applicableScenarios: ['问题诊断', '方案选择', '决策分析', '理论构建'],
    keywords: ['简单', '变量', '最少', '实体', '解释', '正确'],
    tags: ['简化思维', '决策工具'],
    difficulty: 'easy',
    usageFrequency: 8,
    relatedModels: ['hanlons-razor'],
    promptTemplate: '用奥卡姆剃刀分析：{question}',
    exampleQuestions: ['最简单的解释是什么？', '哪个方案变量最少？']
  },

  {
    id: 'hanlons-razor',
    name: '汉隆剃刀',
    category: '认知偏差',
    description: '不要恶意揣测，多考虑无能或疏忽',
    detailedDescription: '看似恶意的行为更可能是无能、愚蠢或疏忽的结果',
    applicableScenarios: ['人际关系', '冲突处理', '团队管理', '沟通协作'],
    keywords: ['恶意', '无能', '疏忽', '善意', '理解', '宽容'],
    tags: ['人际关系', '沟通技巧'],
    difficulty: 'easy',
    usageFrequency: 7,
    relatedModels: ['occams-razor'],
    promptTemplate: '用汉隆剃刀分析：{question}',
    exampleQuestions: ['他们是故意的吗？', '这是恶意还是疏忽？']
  },

  // 效率优化类
  {
    id: 'pareto-principle',
    name: '帕累托法则',
    category: '效率优化',
    description: '20%的行动产生80%的结果',
    detailedDescription: '专注于能产生最大影响的关键20%，提高投入产出比',
    applicableScenarios: ['时间管理', '资源分配', '业务优化', '学习规划'],
    keywords: ['20%', '80%', '关键', '影响', '投入产出', '专注'],
    tags: ['效率工具', '优化原则'],
    difficulty: 'easy',
    usageFrequency: 9,
    relatedModels: ['genius-zone', 'diminishing-returns'],
    promptTemplate: '用帕累托法则分析：{question}',
    exampleQuestions: ['哪20%最重要？', '如何提高投入产出比？']
  },

  {
    id: 'sturgeons-law',
    name: '史特金定律',
    category: '效率优化',
    description: '90%都是垃圾，专注于优质的10%',
    detailedDescription: '在任何领域，90%的内容都是低质量的，要专注寻找优质部分',
    applicableScenarios: ['信息筛选', '学习资源', '内容选择', '质量管理'],
    keywords: ['90%', '垃圾', '10%', '优质', '筛选', '质量'],
    tags: ['质量管理', '筛选工具'],
    difficulty: 'easy',
    usageFrequency: 6,
    relatedModels: ['pareto-principle'],
    promptTemplate: '用史特金定律筛选：{question}',
    exampleQuestions: ['如何筛选优质内容？', '哪些是真正有价值的？']
  },

  {
    id: 'bikeshedding',
    name: '帕金森鸡毛蒜皮定律',
    category: '效率优化',
    description: '避免在无关紧要的细节上浪费时间',
    detailedDescription: '人们倾向于过度关注无关紧要的细节，忽视重大问题',
    applicableScenarios: ['会议管理', '决策优先级', '时间分配', '注意力管理'],
    keywords: ['细节', '无关紧要', '重大问题', '注意力', '优先级'],
    tags: ['注意力管理', '优先级工具'],
    difficulty: 'medium',
    usageFrequency: 7,
    relatedModels: ['eisenhower-matrix', 'parkinsons-law'],
    promptTemplate: '识别鸡毛蒜皮问题：{question}',
    exampleQuestions: ['这个细节重要吗？', '我们在回避什么重大问题？']
  },

  {
    id: 'parkinsons-law',
    name: '帕金森定律',
    category: '时间管理',
    description: '工作会扩展到填满所有可用时间',
    detailedDescription: '如果不设定明确期限，工作会无限扩展占用所有时间',
    applicableScenarios: ['时间管理', '项目管理', '任务规划', '效率提升'],
    keywords: ['时间', '扩展', '期限', '约束', '效率', '拖延'],
    tags: ['时间管理', '效率原则'],
    difficulty: 'easy',
    usageFrequency: 8,
    relatedModels: ['eisenhower-matrix', 'bikeshedding'],
    promptTemplate: '用帕金森定律管理时间：{question}',
    exampleQuestions: ['如何设定合理期限？', '为什么总是拖延到最后？']
  }
];

// 按分类导出
export const MODELS_BY_CATEGORY = {
  '决策分析': COMPLETE_THINKING_MODELS.filter(m => m.category === '决策分析'),
  '逻辑思维': COMPLETE_THINKING_MODELS.filter(m => m.category === '逻辑思维'),
  '时间管理': COMPLETE_THINKING_MODELS.filter(m => m.category === '时间管理'),
  '效率优化': COMPLETE_THINKING_MODELS.filter(m => m.category === '效率优化'),
  '创新思维': COMPLETE_THINKING_MODELS.filter(m => m.category === '创新思维'),
  '风险管理': COMPLETE_THINKING_MODELS.filter(m => m.category === '风险管理'),
  '认知偏差': COMPLETE_THINKING_MODELS.filter(m => m.category === '认知偏差'),
  '系统思维': COMPLETE_THINKING_MODELS.filter(m => m.category === '系统思维'),
  '沟通协作': COMPLETE_THINKING_MODELS.filter(m => m.category === '沟通协作'),
  '问题解决': COMPLETE_THINKING_MODELS.filter(m => m.category === '问题解决')
};

// 按难度导出
export const MODELS_BY_DIFFICULTY = {
  easy: COMPLETE_THINKING_MODELS.filter(m => m.difficulty === 'easy'),
  medium: COMPLETE_THINKING_MODELS.filter(m => m.difficulty === 'medium'),
  hard: COMPLETE_THINKING_MODELS.filter(m => m.difficulty === 'hard')
};

export default COMPLETE_THINKING_MODELS; 