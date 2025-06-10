import React from 'react';
import { Check, Brain, Lightbulb, Target, Zap } from 'lucide-react';
import { ThinkingModel } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ModelRecommendationBlotProps {
  question: string;
  recommendedModels: ThinkingModel[];
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
  onStartAnalysis: () => void;
  onShowAllModels: () => void;
  isLoading: boolean;
  error?: string;
  maxSelection: number;
}

const ModelRecommendationBlot: React.FC<ModelRecommendationBlotProps> = ({
  question,
  recommendedModels,
  selectedModels,
  onModelToggle,
  onStartAnalysis,
  onShowAllModels,
  isLoading,
  error,
  maxSelection
}) => {
  const getModelIcon = (category: string) => {
    switch (category) {
      case 'strategic': return <Target size={20} />;
      case 'creative': return <Lightbulb size={20} />;
      case 'analytical': return <Brain size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const handleToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelToggle(modelId);
    } else if (selectedModels.length < maxSelection) {
      onModelToggle(modelId);
    } else {
      alert(`最多只能选择 ${maxSelection} 个模型进行分析。`);
    }
  };

  if (isLoading) {
    return (
      <section className="section bg-background">
        <div className="container-custom">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h3 className="mt-6 text-primary">AI正在分析您的问题...</h3>
            <p className="text-secondary">从30个思维模型中为您挑选最合适的分析角度</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section bg-background">
        <div className="container-custom">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full text-red-600">
              <Zap size={24} />
            </div>
            <h3 className="text-primary mb-2">推荐获取失败</h3>
            <p className="text-secondary mb-6">{error}</p>
            <button 
              onClick={onShowAllModels}
              className="btn btn-primary"
            >
              手动选择模型
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="mb-4">AI为您推荐的分析角度</h2>
          <p className="text-secondary max-w-3xl mx-auto">
            基于您的问题&ldquo;<span className="text-primary font-medium">{question}</span>&rdquo;，
            AI从30个思维模型中精选了以下6个最合适的分析角度
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recommendedModels.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            const isDisabled = !selectedModels.includes(model.id) && selectedModels.length >= maxSelection;
            
            return (
              <div
                key={model.id}
                onClick={() => handleToggle(model.id)}
                className={`card cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-accent bg-accent/5 transform scale-[1.02]' 
                    : 'hover:shadow-lg hover:transform hover:scale-[1.01]'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                    }`}>
                      {getModelIcon(model.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{model.name}</h3>
                      <span className="text-sm text-secondary capitalize">{model.category}</span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                <p className="text-secondary text-sm mb-4">{model.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {model.applicableScenarios.slice(0, 2).map((scenario: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-separator text-secondary text-xs rounded-lg"
                    >
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartAnalysis}
              disabled={selectedModels.length === 0}
              className={`btn btn-primary ${
                selectedModels.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              开始分析 ({selectedModels.length} 个模型)
            </button>
            
            <button
              onClick={onShowAllModels}
              className="text-accent hover:text-accent/80 font-medium"
            >
              查看全部30个模型 →
            </button>
          </div>
          
          {selectedModels.length === 0 && (
            <p className="text-secondary text-sm mt-3">
              请至少选择一个思维模型开始分析
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModelRecommendationBlot; 