import { NextRequest, NextResponse } from 'next/server';
import { SiliconFlowService } from '@/lib/siliconflow-api';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';

// 调试模式开关
const DEBUG_MODE = false;

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    // 验证请求参数
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: '缺少必要参数：question' },
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

    let recommendedModels;

    if (DEBUG_MODE || !process.env.SILICONFLOW_API_KEY) {
      // 调试模式或缺少API Key时使用智能备用推荐
      
      // 基于问题内容智能选择模型
      const questionLower = question.toLowerCase();
      let selectedModels = [];

      // 决策相关问题
      if (questionLower.includes('选择') || questionLower.includes('决策') || questionLower.includes('换工作') || questionLower.includes('投资')) {
        selectedModels.push('decision-tree', 'pros-cons', 'opportunity-cost');
      }
      
      // 效率相关问题
      if (questionLower.includes('效率') || questionLower.includes('时间') || questionLower.includes('管理')) {
        selectedModels.push('eisenhower-matrix', 'pareto-principle', 'time-blocking');
      }
      
      // 创新相关问题
      if (questionLower.includes('创新') || questionLower.includes('想法') || questionLower.includes('创业')) {
        selectedModels.push('design-thinking', 'blue-ocean', 'scamper');
      }
      
      // 问题解决相关
      if (questionLower.includes('问题') || questionLower.includes('解决') || questionLower.includes('怎么办')) {
        selectedModels.push('root-cause', 'fishbone', 'five-whys');
      }

      // 如果没有匹配到特定类型，使用通用推荐
      if (selectedModels.length === 0) {
        selectedModels = ['decision-tree', 'pros-cons', 'swot', 'root-cause', 'design-thinking', 'cost-benefit'];
      }

      // 确保有6个推荐，用高频模型补充
      while (selectedModels.length < 6) {
        const popularModels = COMPLETE_THINKING_MODELS
          .filter(m => !selectedModels.includes(m.id))
          .sort((a, b) => b.usageFrequency - a.usageFrequency);
        
        if (popularModels.length > 0) {
          selectedModels.push(popularModels[0].id);
        } else {
          break;
        }
      }

      recommendedModels = selectedModels
        .map(id => COMPLETE_THINKING_MODELS.find(m => m.id === id))
        .filter(Boolean)
        .slice(0, 6);

    } else {
      // 正常API调用模式
      const apiService = new SiliconFlowService(process.env.SILICONFLOW_API_KEY!);
      
      try {
        const recommendedModelIds = await apiService.getRecommendedModels(question);
        
        recommendedModels = recommendedModelIds
          .map(id => COMPLETE_THINKING_MODELS.find(m => m.id === id))
          .filter(Boolean)
          .slice(0, 6);
          
        // 如果推荐的模型少于6个，补充热门模型
        if (recommendedModels.length < 6) {
          const popularModels = COMPLETE_THINKING_MODELS
            .filter(m => !recommendedModelIds.includes(m.id))
            .sort((a, b) => b.usageFrequency - a.usageFrequency)
            .slice(0, 6 - recommendedModels.length);
          
          recommendedModels.push(...popularModels);
        }
      } catch (apiError) {
        console.error('SiliconFlow API调用失败，使用备用推荐:', apiError);
        
        // API调用失败时的备用逻辑
        const fallbackModels = COMPLETE_THINKING_MODELS
          .sort((a, b) => b.usageFrequency - a.usageFrequency)
          .slice(0, 6);
        recommendedModels = fallbackModels;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        question,
        recommendedModels: recommendedModels.slice(0, 6),
        totalModels: COMPLETE_THINKING_MODELS.length,
        debugMode: DEBUG_MODE
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('模型推荐API错误:', error);
    
    // 即使出错也返回备用推荐
    const fallbackModels = COMPLETE_THINKING_MODELS
      .sort((a, b) => b.usageFrequency - a.usageFrequency)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      data: {
        question: 'fallback',
        recommendedModels: fallbackModels,
        totalModels: COMPLETE_THINKING_MODELS.length,
        fallback: true,
        error: error instanceof Error ? error.message : '未知错误'
      },
      timestamp: new Date().toISOString()
    });
  }
}

// GET请求：返回所有模型列表
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        models: COMPLETE_THINKING_MODELS,
        totalCount: COMPLETE_THINKING_MODELS.length,
        categories: [...new Set(COMPLETE_THINKING_MODELS.map(m => m.category))]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取模型列表错误:', error);
    
    return NextResponse.json(
      { error: '获取模型列表失败' },
      { status: 500 }
    );
  }
} 