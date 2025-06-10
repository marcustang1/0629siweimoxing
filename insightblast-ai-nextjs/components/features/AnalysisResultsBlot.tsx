import React, { useState } from 'react';
import { Copy, Download, ChevronDown, ChevronUp, RefreshCw, CheckCircle } from 'lucide-react';
import { AnalysisResult, ThinkingModel } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AnalysisResultsBlotProps {
  question: string;
  selectedModels: string[];
  allModels: ThinkingModel[];
  results: Record<string, AnalysisResult>;
  loadingStates: Record<string, boolean>;
  errors: Record<string, string>;
  onRestart: () => void;
  onExport: () => void;
  onAddMoreModels?: () => void;
}

const AnalysisResultsBlot: React.FC<AnalysisResultsBlotProps> = ({
  question,
  selectedModels,
  allModels,
  results,
  loadingStates,
  errors,
  onRestart,
  onExport,
  onAddMoreModels
}) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set(selectedModels));
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const toggleExpanded = (modelId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedResults(newExpanded);
  };

  const copyToClipboard = async (content: string, modelId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStates(prev => ({ ...prev, [modelId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [modelId]: false }));
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const getModelById = (id: string) => allModels.find(m => m.id === id);

  const completedCount = Object.keys(results).length;
  const totalCount = selectedModels.length;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <section className="section bg-background">
      <div className="container-custom">
        {/* 标题和进度 */}
        <div className="text-center mb-12">
          <h2 className="mb-4">分析结果</h2>
          <p className="text-secondary max-w-3xl mx-auto mb-6">
            针对问题&ldquo;<span className="text-primary font-medium">{question}</span>&rdquo;的多角度分析
          </p>
          
          {/* 进度指示器 */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${isAllCompleted ? 'bg-green-500' : 'bg-accent'}`}>
                {isAllCompleted && <CheckCircle size={16} className="text-white" />}
              </div>
              <span className="text-sm text-secondary">
                {completedCount}/{totalCount} 个模型分析完成
              </span>
            </div>
            
            {isAllCompleted && (
              <div className="flex space-x-3">
                <button
                  onClick={onExport}
                  className="flex items-center space-x-2 text-accent hover:text-accent/80 text-sm"
                >
                  <Download size={16} />
                  <span>导出报告</span>
                </button>
                <button
                  onClick={onRestart}
                  className="flex items-center space-x-2 text-accent hover:text-accent/80 text-sm"
                >
                  <RefreshCw size={16} />
                  <span>重新分析</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 分析结果列表 */}
        <div className="space-y-6">
          {selectedModels.map((modelId) => {
            const model = getModelById(modelId);
            const result = results[modelId];
            const isLoading = loadingStates[modelId];
            const error = errors[modelId];
            const isExpanded = expandedResults.has(modelId);
            const isCopied = copiedStates[modelId];

            if (!model) return null;

            return (
              <div key={modelId} className="card">
                {/* 模型标题栏 */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(modelId)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      result ? 'bg-green-100 text-green-600' :
                      isLoading ? 'bg-blue-100 text-blue-600' :
                      error ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {result ? <CheckCircle size={20} /> :
                       isLoading ? <LoadingSpinner size="sm" /> :
                       error ? '!' : '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{model.name}</h3>
                      <p className="text-sm text-secondary">{model.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result && (
                      <span className="text-xs text-secondary">
                        {result.readingTime} 分钟阅读
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* 展开的内容 */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-separator">
                    {isLoading && (
                      <div className="text-center py-8">
                        <LoadingSpinner size="md" />
                        <p className="mt-4 text-secondary">AI正在使用{model.name}分析您的问题...</p>
                      </div>
                    )}

                    {error && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full text-red-600">
                          !
                        </div>
                        <h4 className="text-primary mb-2">分析失败</h4>
                        <p className="text-secondary">{error}</p>
                      </div>
                    )}

                    {result && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-secondary">
                            生成时间: {result.generatedAt.toLocaleString()} | 
                            字数: {result.wordCount}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(result.content, modelId);
                            }}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                              isCopied 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                            <span>{isCopied ? '已复制' : '复制'}</span>
                          </button>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-primary leading-relaxed">
                            {result.content}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部操作 */}
        {isAllCompleted && (
          <div className="text-center mt-12 pt-8 border-t border-separator">
            <h3 className="text-primary mb-4">分析完成！</h3>
            <p className="text-secondary mb-6">
              您已经从 {totalCount} 个不同角度分析了这个问题。
              您可以导出完整报告或开始新的分析。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onExport}
                className="btn btn-primary"
              >
                <Download size={18} className="mr-2" />
                导出完整报告
              </button>
              {onAddMoreModels && (
                <button
                  onClick={onAddMoreModels}
                  className="btn text-accent border border-accent bg-transparent hover:bg-accent hover:text-white"
                >
                  添加更多模型
                </button>
              )}
              <button
                onClick={onRestart}
                className="text-accent hover:text-accent/80 font-medium"
              >
                <RefreshCw size={18} className="mr-2 inline" />
                开始新的分析
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisResultsBlot; 