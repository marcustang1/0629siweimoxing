'use client';

import { useState } from 'react';
import { AnalysisResult, ThinkingModel } from '@/types';

interface AnalysisResultsProps {
  results: Record<string, AnalysisResult>;
  models: ThinkingModel[];
  question: string;
  isAnalyzing?: boolean;
  onExport?: () => void;
  onReset?: () => void;
}

export function AnalysisResults({
  results,
  models,
  question,
  isAnalyzing = false,
  onExport,
  onReset
}: AnalysisResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});
  const [compareMode, setCompareMode] = useState(false);

  const toggleExpanded = (modelId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const getModelName = (modelId: string) => {
    return models.find(m => m.id === modelId)?.name || modelId;
  };

  const getModelCategory = (modelId: string) => {
    return models.find(m => m.id === modelId)?.category || '';
  };

  const resultEntries = Object.entries(results);
  const totalResults = resultEntries.length;
  const completedResults = resultEntries.filter(([, result]) => result.content).length;

  if (isAnalyzing && totalResults === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">AI正在使用选定的思维模型分析您的问题...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 分析概览 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            📊 分析结果
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                compareMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              对比模式
            </button>
            {onExport && (
              <button
                onClick={onExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                导出结果
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                重新分析
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">分析问题：</span>
            {question}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
            <div className="text-blue-800 text-sm">分析模型</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{completedResults}</div>
            <div className="text-green-800 text-sm">完成分析</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {resultEntries.reduce((total, [, result]) => total + result.wordCount, 0)}
            </div>
            <div className="text-purple-800 text-sm">总字数</div>
          </div>
        </div>
      </div>

      {/* 分析结果列表 */}
      <div className={`grid gap-6 ${compareMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
        {resultEntries.map(([modelId, result]) => {
          const isExpanded = expandedResults[modelId];
          const modelName = getModelName(modelId);
          const modelCategory = getModelCategory(modelId);

          return (
            <div
              key={modelId}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* 结果头部 */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{modelName}</h3>
                    <p className="text-indigo-100 text-sm">{modelCategory}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-indigo-100">阅读时间</div>
                    <div className="text-lg font-semibold">{result.readingTime} 分钟</div>
                  </div>
                </div>
              </div>

              {/* 结果内容 */}
              <div className="p-6">
                {result.content ? (
                  <>
                    <div className={`prose max-w-none ${!isExpanded ? 'line-clamp-6' : ''}`}>
                      {result.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>字数：{result.wordCount}</span>
                        <span>生成时间：{new Date(result.generatedAt).toLocaleString()}</span>
                      </div>

                      <button
                        onClick={() => toggleExpanded(modelId)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        {isExpanded ? '收起' : '展开全文'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">正在分析中...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 空状态 */}
      {totalResults === 0 && !isAnalyzing && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            暂无分析结果
          </h3>
          <p className="text-gray-600">
            请先选择思维模型并开始分析
          </p>
        </div>
      )}

      {/* 对比视图提示 */}
      {compareMode && totalResults > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-blue-500 mr-3">💡</div>
            <div>
              <p className="text-blue-800 font-medium">对比模式已开启</p>
              <p className="text-blue-600 text-sm">
                您可以并排查看不同思维模型的分析结果，便于对比和综合理解
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 