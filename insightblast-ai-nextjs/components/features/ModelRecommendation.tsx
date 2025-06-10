'use client';

import { useState } from 'react';
import { ThinkingModel } from '@/types';
import { useApp } from '@/context/AppContext';

interface ModelRecommendationProps {
  models: ThinkingModel[];
  question: string;
  isLoading?: boolean;
  onModelSelect: (modelId: string) => void;
  onModelDeselect: (modelId: string) => void;
}

const ModelRecommendation: React.FC<ModelRecommendationProps> = ({
  models,
  question,
  isLoading = false,
  onModelSelect,
  onModelDeselect,
}) => {
  const { state } = useApp();
  const [expandedModel] = useState<string | null>(null);

  const handleModelToggle = (modelId: string) => {
    if (state.selectedModels.includes(modelId)) {
      onModelDeselect(modelId);
    } else {
      onModelSelect(modelId);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">AI正在为您推荐最适合的思维模型...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          🤖 AI为您推荐的思维模型
        </h2>
        <p className="text-gray-600">
          基于您的问题：<span className="font-medium text-gray-800">&ldquo;{question}&rdquo;</span>，AI推荐以下6个最适合的思维模型
        </p>
      </div>

      <div className="grid gap-4">
        {models.map((model) => {
          const isSelected = state.selectedModels.includes(model.id);
          const isExpanded = expandedModel === model.id;

          return (
            <div
              key={model.id}
              className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleModelToggle(model.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {model.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(model.difficulty)}`}>
                      {getDifficultyText(model.difficulty)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {model.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {model.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {model.keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">详细说明：</h4>
                      <p className="text-gray-700 mb-3">{model.detailedDescription}</p>
                      
                      <h4 className="font-medium text-gray-900 mb-2">适用场景：</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {model.applicableScenarios.map((scenario, index) => (
                          <li key={index}>{scenario}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isSelected ? '已选择' : '选择'}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {isExpanded ? '收起详情' : '查看详情'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {state.selectedModels.length > 0 && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-indigo-800 font-medium">
            已选择 {state.selectedModels.length} 个模型
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {state.selectedModels.map((modelId) => {
              const selectedModel = models.find(m => m.id === modelId);
              return selectedModel ? (
                <span
                  key={modelId}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {selectedModel.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelRecommendation; 