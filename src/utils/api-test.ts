/**
 * API测试工具
 * 用于验证.env.local配置和API连接
 */

import { siliconFlowService } from '../services/siliconflow-api';

export class ApiTestHelper {
  
  /**
   * 检查环境变量格式
   */
  static checkEnvFormat(): { isValid: boolean; message: string; apiKey?: string } {
    try {
      // 获取环境变量
      const apiKey = (globalThis as any)?.process?.env?.NEXT_PUBLIC_SILICONFLOW_API_KEY;
      
      if (!apiKey) {
        return {
          isValid: false,
          message: '❌ 未找到 NEXT_PUBLIC_SILICONFLOW_API_KEY 环境变量'
        };
      }
      
      // 检查API Key格式
      if (apiKey === 'your_api_key_here') {
        return {
          isValid: false,
          message: '❌ 请将 your_api_key_here 替换为实际的API Key'
        };
      }
      
      // 检查API Key是否以sk-开头（SiliconFlow的格式）
      if (!apiKey.startsWith('sk-')) {
        return {
          isValid: false,
          message: '⚠️ API Key格式可能不正确，SiliconFlow的API Key通常以"sk-"开头'
        };
      }
      
      // 检查长度（通常API Key都比较长）
      if (apiKey.length < 20) {
        return {
          isValid: false,
          message: '⚠️ API Key长度似乎太短，请检查是否完整'
        };
      }
      
      return {
        isValid: true,
        message: '✅ API Key格式看起来正确',
        apiKey: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
      };
      
    } catch (error) {
      return {
        isValid: false,
        message: `❌ 检查环境变量时出错: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
  
  /**
   * 测试API连接
   */
  static async testApiConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🔄 正在测试API连接...');
      
      // 先检查环境变量
      const envCheck = this.checkEnvFormat();
      if (!envCheck.isValid) {
        return {
          success: false,
          message: `环境变量配置问题: ${envCheck.message}`
        };
      }
      
      console.log(`✅ 环境变量检查通过: ${envCheck.message}`);
      
      // 测试API健康检查
      const isHealthy = await siliconFlowService.healthCheck();
      
      if (!isHealthy) {
        return {
          success: false,
          message: '❌ API健康检查失败，请检查网络连接和API Key'
        };
      }
      
      // 测试简单调用
      const response = await siliconFlowService.generateResponse(
        '请回复"测试成功"',
        undefined,
        { maxTokens: 50 }
      );
      
      return {
        success: true,
        message: '🎉 API连接测试成功！',
        details: {
          apiKeyMasked: envCheck.apiKey,
          responsePreview: response.substring(0, 100) + (response.length > 100 ? '...' : '')
        }
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      // 提供详细的错误诊断
      let diagnosis = '';
      if (errorMessage.includes('401')) {
        diagnosis = '可能是API Key错误或已过期';
      } else if (errorMessage.includes('429')) {
        diagnosis = 'API调用频率过高，请稍后重试';
      } else if (errorMessage.includes('500')) {
        diagnosis = 'SiliconFlow服务器错误，请稍后重试';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        diagnosis = '网络连接问题，请检查网络';
      }
      
      return {
        success: false,
        message: `❌ API调用失败: ${errorMessage}`,
        details: {
          diagnosis,
          fullError: errorMessage
        }
      };
    }
  }
  
  /**
   * 完整的诊断报告
   */
  static async runFullDiagnosis(): Promise<void> {
    console.log('\n🔍 开始完整的API诊断...\n');
    
    // 1. 检查环境变量
    console.log('1️⃣ 检查环境变量配置:');
    const envResult = this.checkEnvFormat();
    console.log(`   ${envResult.message}`);
    if (envResult.apiKey) {
      console.log(`   API Key: ${envResult.apiKey}`);
    }
    
    // 2. 测试API连接
    console.log('\n2️⃣ 测试API连接:');
    const apiResult = await this.testApiConnection();
    console.log(`   ${apiResult.message}`);
    
    if (apiResult.success && apiResult.details) {
      console.log(`   响应预览: ${apiResult.details.responsePreview}`);
    } else if (!apiResult.success && apiResult.details) {
      if (apiResult.details.diagnosis) {
        console.log(`   诊断建议: ${apiResult.details.diagnosis}`);
      }
    }
    
    // 3. 给出建议
    console.log('\n3️⃣ 配置建议:');
    if (!envResult.isValid) {
      console.log('   📝 请创建 .env.local 文件，内容如下:');
      console.log('   NEXT_PUBLIC_SILICONFLOW_API_KEY=你的实际API_Key');
      console.log('   ⚠️  注意：不要有多余的空格和引号');
    } else if (!apiResult.success) {
      console.log('   📝 环境变量配置正确，但API调用失败');
      console.log('   🔗 请检查: https://cloud.siliconflow.cn/account/ak');
      console.log('   📞 确认API Key是否有效和有足够余额');
    } else {
      console.log('   🎉 一切配置正确，可以正常使用！');
    }
    
    console.log('\n✨ 诊断完成！\n');
  }
}

// 导出便捷方法
export const testApi = ApiTestHelper.runFullDiagnosis;
export const checkEnv = ApiTestHelper.checkEnvFormat;
export const testConnection = ApiTestHelper.testApiConnection; 