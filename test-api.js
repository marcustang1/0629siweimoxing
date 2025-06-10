// 简单的API配置测试脚本
// 运行方式: node test-api.js

import fs from 'fs';
import path from 'path';

console.log('🔍 开始API配置检测...\n');

// 1. 检查环境变量
function checkEnvFile() {
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ 未找到 .env.local 文件');
    console.log('📝 请在项目根目录创建 .env.local 文件，内容如下:');
    console.log('NEXT_PUBLIC_SILICONFLOW_API_KEY=your_api_key_here\n');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ 找到 .env.local 文件');
  console.log('📄 文件内容:');
  console.log(envContent);
  
  // 检查格式
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const apiKeyLine = lines.find(line => line.includes('NEXT_PUBLIC_SILICONFLOW_API_KEY'));
  
  if (!apiKeyLine) {
    console.log('❌ 未找到 NEXT_PUBLIC_SILICONFLOW_API_KEY 配置');
    return false;
  }
  
  const [key, value] = apiKeyLine.split('=');
  if (!value || value.trim() === 'your_api_key_here') {
    console.log('❌ 请将 your_api_key_here 替换为实际的API Key');
    return false;
  }
  
  const apiKey = value.trim();
  if (!apiKey.startsWith('sk-')) {
    console.log('⚠️ API Key格式可能不正确，SiliconFlow的API Key通常以"sk-"开头');
  }
  
  if (apiKey.length < 20) {
    console.log('⚠️ API Key长度似乎太短，请检查是否完整');
  }
  
  console.log(`✅ API Key格式检查通过: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  return apiKey;
}

// 2. 测试API调用
async function testApiCall(apiKey) {
  console.log('\n🔄 正在测试API连接...');
  
  const url = "https://api.siliconflow.cn/v1/chat/completions";
  
  const payload = {
    model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    messages: [
      {
        role: "user",
        content: "请回复'测试成功'"
      }
    ],
    max_tokens: 50,
    temperature: 0.7,
    enable_thinking: true,
    thinking_budget: 1024,
    stream: false
  };

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    // 使用原生fetch (Node.js 18+) 或者fetch polyfill
    const fetchFn = globalThis.fetch || (await import('node-fetch')).default;
    const response = await fetchFn(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API调用失败: ${response.status} ${response.statusText}`);
      console.log(`错误详情: ${errorText}`);
      
      if (response.status === 401) {
        console.log('🔍 诊断: API Key可能错误或已过期');
      } else if (response.status === 429) {
        console.log('🔍 诊断: API调用频率过高，请稍后重试');
      }
      
      return false;
    }

    const data = await response.json();
    console.log('🎉 API调用成功！');
    console.log(`📝 响应内容: ${data.choices[0]?.message?.content || '无内容'}`);
    return true;

  } catch (error) {
    console.log(`❌ 请求出错: ${error.message}`);
    
    if (error.message.includes('node-fetch')) {
      console.log('📦 需要安装依赖: npm install node-fetch');
    }
    
    return false;
  }
}

// 主函数
async function main() {
  try {
    // 检查文件
    const apiKey = checkEnvFile();
    if (!apiKey) {
      console.log('\n🚨 请先正确配置 .env.local 文件');
      return;
    }
    
    // 测试API
    const success = await testApiCall(apiKey);
    
    console.log('\n' + '='.repeat(50));
    if (success) {
      console.log('🎉 恭喜！API配置完全正确，可以正常使用！');
    } else {
      console.log('❌ API配置有问题，请检查API Key是否正确');
      console.log('🔗 获取API Key: https://cloud.siliconflow.cn/account/ak');
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.log(`❌ 检测过程出错: ${error.message}`);
  }
}

// 运行测试
main(); 