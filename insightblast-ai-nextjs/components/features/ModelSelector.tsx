'use client';

import { useState, useMemo } from 'react';
import { ThinkingModel, ModelCategory } from '@/types';

interface ModelSelectorProps {
  models: ThinkingModel[];
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
  onClose: () => void;
  maxSelection: number;
}

export function ModelSelector({
  models,
  selectedModels,
  onModelToggle,
  onClose,
  maxSelection
}: ModelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');

  // 获取所有分类
  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(models.map(m => m.category)));
    return allCategories.sort();
  }, [models]);

  // 过滤模型
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || model.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [models, searchTerm, selectedCategory, selectedDifficulty]);

  const handleModelClick = (modelId: string) => {
    const isSelected = selectedModels.includes(modelId);
    if (!isSelected && selectedModels.length >= maxSelection) {
      // Optionally show a more prominent warning
      console.warn(`Cannot select more than ${maxSelection} models.`);
      return;
    }
    onModelToggle(modelId);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              选择思维模型
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 搜索和筛选 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="搜索模型名称、描述或关键词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ModelCategory | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">所有分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">所有难度</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              显示 {filteredModels.length} / {models.length} 个模型
            </span>
            <span>
              已选择 {selectedModels.length} / {maxSelection} 个模型
            </span>
          </div>
        </div>

        {/* 模型列表 */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid gap-4">
            {filteredModels.map((model) => {
              const isSelected = selectedModels.includes(model.id);
              const isSelectionDisabled = !isSelected && selectedModels.length >= maxSelection;

              return (
                <div
                  key={model.id}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => handleModelClick(model.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {model.name}
                        </h3>
                        {model.nameEn && (
                          <span className="text-sm text-gray-500">
                            ({model.nameEn})
                          </span>
                        )}
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

                      <div className="flex flex-wrap gap-2">
                        {model.keywords.slice(0, 4).map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                        {model.keywords.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                            +{model.keywords.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <p className="text-gray-500">没有找到匹配的思维模型</p>
              <p className="text-gray-400 text-sm mt-2">尝试调整搜索条件或筛选器</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedModels.length > 0 ? (
                <span>
                  已选择: {selectedModels.map(id => models.find(m => m.id === id)?.name).filter(Boolean).join('、 ')}
                </span>
              ) : (
                <span>从列表中选择最多 {maxSelection} 个模型</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 