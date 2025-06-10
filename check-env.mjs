// API配置检查脚本 (ES模块版本)
// 运行方式: node check-env.mjs

import fs from 'fs';
import path from 'path';

console.log('🔍 检查 .env.local 文件配置...\n');

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // 检查文件是否存在
  if (!fs.existsSync(envPath)) {
    console.log('❌ 未找到 .env.local 文件');
    console.log('📝 请在项目根目录创建 .env.local 文件，内容格式如下:');
    console.log('');
    console.log('NEXT_PUBLIC_SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('');
    console.log('⚠️ 重要提醒:');
    console.log('• 文件必须位于项目根目录');
    console.log('• 不要有多余的空格');
    console.log('• 不要用引号包围API Key');
    console.log('• API Key通常以 "sk-" 开头');
    console.log('• 从 https://cloud.siliconflow.cn/account/ak 获取API Key');
    return false;
  }
  
  // 读取文件内容
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ 找到 .env.local 文件');
  console.log('📄 文件内容预览:');
  
  // 安全地显示内容（隐藏敏感信息）
  const lines = envContent.split('\n');
  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      if (line.includes('SILICONFLOW_API_KEY')) {
        const [key, value] = line.split('=');
        if (value && value.trim() !== 'your_api_key_here') {
          const apiKey = value.trim();
          console.log(`   ${key}=${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
        } else {
          console.log(`   ${line}`);
        }
      } else {
        console.log(`   ${line}`);
      }
    }
  });
  
  // 验证配置
  const lines_filtered = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const apiKeyLine = lines_filtered.find(line => line.includes('NEXT_PUBLIC_SILICONFLOW_API_KEY'));
  
  if (!apiKeyLine) {
    console.log('\n❌ 未找到 NEXT_PUBLIC_SILICONFLOW_API_KEY 配置行');
    console.log('📝 请添加以下行到 .env.local 文件:');
    console.log('NEXT_PUBLIC_SILICONFLOW_API_KEY=你的API密钥');
    return false;
  }
  
  const [key, value] = apiKeyLine.split('=');
  if (!value || value.trim() === '' || value.trim() === 'your_api_key_here') {
    console.log('\n❌ API Key值为空或未替换默认值');
    console.log('📝 请将 your_api_key_here 替换为你的实际API Key');
    return false;
  }
  
  const apiKey = value.trim();
  
  // 格式验证
  let warnings = [];
  let errors = [];
  
  if (!apiKey.startsWith('sk-')) {
    warnings.push('⚠️ API Key通常以 "sk-" 开头，请确认是否正确');
  }
  
  if (apiKey.length < 20) {
    errors.push('❌ API Key长度太短，可能不完整');
  }
  
  if (apiKey.includes(' ')) {
    errors.push('❌ API Key包含空格，请检查格式');
  }
  
  if (apiKey.includes('"') || apiKey.includes("'")) {
    errors.push('❌ API Key被引号包围，请去除引号');
  }
  
  // 显示结果
  console.log('\n📋 验证结果:');
  
  if (errors.length > 0) {
    errors.forEach(error => console.log(error));
    return false;
  }
  
  if (warnings.length > 0) {
    warnings.forEach(warning => console.log(warning));
  }
  
  console.log('✅ API Key格式检查通过');
  console.log(`🔑 API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`📏 长度: ${apiKey.length} 字符`);
  
  return true;
}

// 运行检查
const result = checkEnvFile();

console.log('\n' + '='.repeat(60));
if (result) {
  console.log('🎉 .env.local 文件配置正确！');
  console.log('📝 下一步：运行项目并测试API连接');
  console.log('💡 如果API调用仍然失败，请检查：');
  console.log('   • API Key是否有效（未过期）');
  console.log('   • 账户是否有足够余额');
  console.log('   • 网络连接是否正常');
} else {
  console.log('❌ .env.local 文件配置有问题');
  console.log('📖 请参考上面的提示进行修正');
}
console.log('='.repeat(60)); 