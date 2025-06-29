'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/ui/Hero';
import Features from '@/components/ui/Features';
import Navigation from '@/components/ui/Navigation';
import FAQ from '@/components/ui/FAQ';
import Footer from '@/components/ui/Footer';
import ModelRecommendationBlot from '@/components/features/ModelRecommendationBlot';
import AnalysisResultsBlot from '@/components/features/AnalysisResultsBlot';
import { ModelSelector } from '@/components/features/ModelSelector';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';
import { ClientAPIService } from '@/lib/siliconflow-api';
import { usageStorage } from '@/lib/localStorage';
import AlertDialog from '@/components/ui/AlertDialog';
import type { ThinkingModel, AnalysisResult, LoadingState as GlobalLoadingState } from '@/types';

type AppStep = 'hero' | 'recommendation' | 'analysis' | 'results';

// Simplified local state types
type LoadingState = Pick<GlobalLoadingState, 'isLoading' | 'stage'>;
type ErrorState = { hasError: boolean; message: string };

export default function Home() {
  const { saveToHistory } = useApp();
  
  // Core application state, managed locally for each analysis session
  const [question, setQuestion] = useState('');
  const [suggestedModels, setSuggestedModels] = useState<ThinkingModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [interpretations, setInterpretations] = useState<Record<string, AnalysisResult>>({});
  
  // UI and workflow state
  const [currentStep, setCurrentStep] = useState<AppStep>('hero');
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  const [errors, setErrors] = useState<Record<string, ErrorState>>({});
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  
  const TRIAL_LIMIT = 3;

  const [apiService] = useState(() => new ClientAPIService());
  const aiContentRef = useRef<HTMLDivElement>(null);
  
  // Load initial usage count on mount
  useEffect(() => {
    // No longer needed to set state
  }, []);

  // Helper functions for state updates
  const setLoading = (key: string, isLoading: boolean, stage?: GlobalLoadingState['stage']) => {
    setLoadingStates(prev => ({ ...prev, [key]: { isLoading, stage } }));
  };

  const setError = (key: string, message: string) => {
    setErrors(prev => ({ ...prev, [key]: { hasError: true, message } }));
  };

  const clearError = (key: string) => {
    setErrors(prev => ({ ...prev, [key]: { hasError: false, message: '' } }));
  };

  const resetAnalysisState = useCallback(() => {
    console.log("Resetting analysis state for new session.");
    setSuggestedModels([]);
    setSelectedModels([]);
    setInterpretations({});
    setLoadingStates({});
    setErrors({});
    setCurrentStep('hero');
  }, []);

  const scrollToAIContent = () => {
    aiContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // The single entry point for starting a new analysis.
  const handleBlastOff = async (submittedQuestion: string) => {
    console.log('--- New Analysis Initiated ---');

    // 1. STATE RESET: Clear state from any previous analysis.
    resetAnalysisState();
    setQuestion(submittedQuestion);

    // 2. USAGE CHECK: The very first step.
    const currentUsage = usageStorage.get().count;
    if (currentUsage >= TRIAL_LIMIT) {
      console.log('Usage limit reached. Aborting analysis.');
      setShowLimitDialog(true);
      return; // ABORT
    }

    // Move to next step in UI
    setCurrentStep('recommendation');
    setLoading('model-recommendation', true, 'analyzing');
    clearError('model-recommendation');
    
    // Scroll to the content area
    setTimeout(() => scrollToAIContent(), 100);
    
    // GET RECOMMENDATIONS
    try {
      const response = await apiService.getRecommendedModels(submittedQuestion);
      if (response.success) {
        setSuggestedModels(response.data.recommendedModels);
      } else {
        throw new Error(response.error || '推荐失败');
      }
    } catch (error) {
      console.error('获取推荐失败:', error);
      setError('model-recommendation', error instanceof Error ? error.message : '获取推荐失败');
      const fallbackModels = [...COMPLETE_THINKING_MODELS]
        .sort((a, b) => b.usageFrequency - a.usageFrequency)
        .slice(0, 6);
      setSuggestedModels(fallbackModels);
    } finally {
      setLoading('model-recommendation', false);
    }
  };

  const handleModelToggle = (modelId: string) => {
    // Prevent selection if already at max
    if (!selectedModels.includes(modelId) && selectedModels.length >= TRIAL_LIMIT) {
        setError('model-selection', `最多只能选择 ${TRIAL_LIMIT} 个模型进行分析。`);
        // auto-hide error message
        setTimeout(() => clearError('model-selection'), 3000);
        return;
    }

    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };
  
  const handleStartAnalysis = async () => {
    if (selectedModels.length === 0) {
      setError('model-selection', '请至少选择一个思维模型。');
      setTimeout(() => clearError('model-selection'), 3000);
      return;
    }

    // ATOMIC USAGE INCREMENT
    const newCount = usageStorage.increment();
    console.log(`Usage incremented to: ${newCount}`);
    
    setCurrentStep('analysis');
    clearError('analysis');
    
    const analysisPromises = selectedModels.map(async (modelId) => {
      setLoading(`analysis-${modelId}`, true, 'analyzing');
      try {
        const response = await apiService.analyzeQuestion(question, modelId);
        if (response.success) {
          setInterpretations(prev => ({...prev, [modelId]: response.data}));
        } else {
          throw new Error(response.error || '分析失败');
        }
      } catch (error) {
        console.error(`模型 ${modelId} 分析失败:`, error);
        setError(`analysis-${modelId}`, error instanceof Error ? error.message : '分析失败');
      } finally {
        setLoading(`analysis-${modelId}`, false);
      }
    });

    await Promise.all(analysisPromises);
    
    setCurrentStep('results');
    
    // Save to history after a short delay
    setTimeout(() => {
      if (question && Object.keys(interpretations).length > 0) {
        saveToHistory({
          question,
          interpretations,
          selectedModels,
        });
      }
    }, 1000);
  };

  // Resets the entire page to start over
  const handleRestart = () => {
    resetAnalysisState();
    setQuestion('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleExportResults = () => {
    const content = `# InsightBlast AI 分析报告\n\n## 分析问题\n${question}\n\n## 分析结果\n\n${Object.entries(interpretations).map(([modelId, result]) => {
      const model = COMPLETE_THINKING_MODELS.find(m => m.id === modelId);
      return `### ${model?.name || modelId}\n${result.content}\n\n---`;
    }).join('\n')}\n\n生成时间：${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InsightBlast-分析报告-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getLoadingStatesForBlot = () => {
    return Object.fromEntries(
      Object.entries(loadingStates).map(([key, value]) => [key, value.isLoading])
    );
  };

  const getErrorsForBlot = () => {
    return Object.fromEntries(
      Object.entries(errors)
        .filter(([, value]) => value.hasError)
        .map(([key, value]) => [key, value.message])
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <Hero 
          onSubmit={handleBlastOff}
          isLoading={loadingStates['model-recommendation']?.isLoading}
        />
        
        <div ref={aiContentRef} className={`transition-all duration-700 ease-out ${
          currentStep === 'hero' ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-none'
        }`}>
          {currentStep === 'recommendation' && (
            <div className="animate-slideInUp">
              <ModelRecommendationBlot
                question={question}
                recommendedModels={suggestedModels}
                selectedModels={selectedModels}
                onModelToggle={handleModelToggle}
                onStartAnalysis={handleStartAnalysis}
                onShowAllModels={() => setShowModelSelector(true)}
                isLoading={loadingStates['model-recommendation']?.isLoading || false}
                error={errors['model-recommendation']?.message || errors['model-selection']?.message}
                maxSelection={TRIAL_LIMIT}
              />
            </div>
          )}
          
          {(currentStep === 'analysis' || currentStep === 'results') && (
            <div className="animate-slideInUp">
              <AnalysisResultsBlot
                question={question}
                results={interpretations}
                selectedModels={selectedModels}
                allModels={COMPLETE_THINKING_MODELS}
                loadingStates={getLoadingStatesForBlot()}
                errors={getErrorsForBlot()}
                onRestart={handleRestart}
                onAddMoreModels={() => setShowModelSelector(true)}
                onExport={handleExportResults}
              />
            </div>
          )}
        </div>

        {showModelSelector && (
          <ModelSelector
            models={COMPLETE_THINKING_MODELS}
            selectedModels={selectedModels}
            onModelToggle={handleModelToggle}
            onClose={() => setShowModelSelector(false)}
            maxSelection={TRIAL_LIMIT}
          />
        )}

        <AlertDialog
          isOpen={showLimitDialog}
          onClose={() => setShowLimitDialog(false)}
          title="Usage Limit Reached"
          confirmText="Got it"
        >
          You have used up your 3 free analyses for the trial. The full version is under development. Please stay tuned.
        </AlertDialog>

        {/* Static sections */}
        <Features />
        <FAQ />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
