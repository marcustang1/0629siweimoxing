#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 InsightBlast AI 生产环境测试脚本');
console.log('=====================================\n');

let hasErrors = false;

function logTest(name, status, message) {
  const icon = status ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
  if (!status) hasErrors = true;
}

function logSection(title) {
  console.log(`\n📋 ${title}`);
  console.log('-'.repeat(30));
}

// 1. 检查环境变量
logSection('环境变量检查');

const requiredEnvVars = ['SILICONFLOW_API_KEY'];
const envFile = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  requiredEnvVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    logTest(varName, hasVar, hasVar ? '已配置' : '未配置');
  });
} else {
  logTest('.env.local', false, '文件不存在');
}

// 2. 检查依赖
logSection('依赖检查');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'next',
    'react', 
    'typescript',
    'tailwindcss',
    'lucide-react'
  ];
  
  requiredDeps.forEach(dep => {
    const hasScript = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    logTest(dep, !!hasScript, hasScript ? `版本: ${hasScript}` : '未安装');
  });
} catch (error) {
  logTest('package.json', false, '读取失败');
}

// 3. 检查核心文件
logSection('核心文件检查');

const requiredFiles = [
  'app/page.tsx',
  'app/layout.tsx', 
  'app/api/analyze/route.ts',
  'app/api/models/route.ts',
  'lib/siliconflow-api.ts',
  'context/AppContext.tsx',
  'data/thinking-models.ts'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  logTest(file, exists, exists ? '存在' : '文件缺失');
});

// 4. 生产构建测试
logSection('生产构建测试');

try {
  console.log('正在构建生产版本...');
  execSync('npm run build', { stdio: 'pipe' });
  logTest('生产构建', true, '构建成功');
  
  const buildExists = fs.existsSync('.next');
  logTest('构建产物', buildExists, buildExists ? '.next 目录已生成' : '构建产物缺失');
} catch (error) {
  logTest('生产构建', false, '构建失败: ' + error.message.split('\n')[0]);
}

// 最终结果
console.log('\n🏁 测试完成');
console.log('=====================================');

if (hasErrors) {
  console.log('❌ 发现问题，请修复后再部署');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过，可以部署到生产环境！');
}