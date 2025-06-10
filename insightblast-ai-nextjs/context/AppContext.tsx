'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, LoadingState, ErrorState, ThinkingModel, AnalysisResult, UserPreferences } from '@/types';
import { storage, StoredUserPreferences } from '@/lib/localStorage';

// 初始状态
const initialState: AppState = {
  // 用户输入
  question: '',
  isQuestionValid: false,
  
  // 模型选择
  suggestedModels: [],
  selectedModels: [],
  showAllModels: false,
  
  // 分析结果
  interpretations: {},
  
  // UI状态
  loadingStates: {},
  errors: {},
  
  // 应用元数据
  sessionHistory: [],
  preferences: {
    preferredModels: [],
    maxSuggestions: 6
  }
};

// Action类型
type Action =
  | { type: 'SET_QUESTION'; payload: string }
  | { type: 'SET_QUESTION_VALID'; payload: boolean }
  | { type: 'SET_SUGGESTED_MODELS'; payload: ThinkingModel[] }
  | { type: 'ADD_SELECTED_MODEL'; payload: string }
  | { type: 'REMOVE_SELECTED_MODEL'; payload: string }
  | { type: 'CLEAR_SELECTED_MODELS' }
  | { type: 'TOGGLE_SHOW_ALL_MODELS' }
  | { type: 'SET_ANALYSIS_RESULT'; payload: { modelId: string; result: AnalysisResult } }
  | { type: 'SET_LOADING_STATE'; payload: { key: string; state: LoadingState } }
  | { type: 'SET_ERROR_STATE'; payload: { key: string; error: ErrorState } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'LOAD_STORED_PREFERENCES'; payload: StoredUserPreferences }
  | { type: 'RESTORE_SESSION'; payload: { question: string; selectedModels: string[]; suggestedModels: ThinkingModel[]; interpretations: Record<string, AnalysisResult> } }
  | { type: 'RESET_SESSION' };

// Reducer函数
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_QUESTION':
      return {
        ...state,
        question: action.payload,
        isQuestionValid: action.payload.length >= 10 && action.payload.length <= 1000
      };
      
    case 'SET_QUESTION_VALID':
      return {
        ...state,
        isQuestionValid: action.payload
      };
      
    case 'SET_SUGGESTED_MODELS':
      return {
        ...state,
        suggestedModels: action.payload
      };
      
    case 'ADD_SELECTED_MODEL':
      return {
        ...state,
        selectedModels: [...state.selectedModels, action.payload]
      };
      
    case 'REMOVE_SELECTED_MODEL':
      return {
        ...state,
        selectedModels: state.selectedModels.filter(id => id !== action.payload)
      };
      
    case 'CLEAR_SELECTED_MODELS':
      return {
        ...state,
        selectedModels: []
      };
      
    case 'TOGGLE_SHOW_ALL_MODELS':
      return {
        ...state,
        showAllModels: !state.showAllModels
      };
      
    case 'SET_ANALYSIS_RESULT':
      return {
        ...state,
        interpretations: {
          ...state.interpretations,
          [action.payload.modelId]: action.payload.result
        }
      };
      
    case 'SET_LOADING_STATE':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.state
        }
      };
      
    case 'SET_ERROR_STATE':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };
      
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors
      };
      
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        sessionHistory: [action.payload, ...state.sessionHistory.slice(0, 9)] // 保留最近10条
      };
      
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };

    case 'LOAD_STORED_PREFERENCES':
      return {
        ...state,
        preferences: {
          preferredModels: action.payload.preferredModels || [],
          maxSuggestions: action.payload.maxSuggestions || 6
        }
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        question: action.payload.question,
        selectedModels: action.payload.selectedModels,
        suggestedModels: action.payload.suggestedModels,
        interpretations: action.payload.interpretations,
        isQuestionValid: action.payload.question.length >= 10 && action.payload.question.length <= 1000
      };
      
    case 'RESET_SESSION':
      return {
        ...initialState,
        preferences: state.preferences // 保留用户偏好
      };
      
    default:
      return state;
  }
}

// Context类型
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // 便捷方法
  setQuestion: (question: string) => void;
  addSelectedModel: (modelId: string) => void;
  removeSelectedModel: (modelId: string) => void;
  setLoading: (key: string, loading: boolean, stage?: LoadingState['stage']) => void;
  setError: (key: string, error: string, type?: ErrorState['errorType']) => void;
  clearError: (key: string) => void;
  // 存储相关方法
  saveToHistory: (session: { question: string, interpretations: Record<string, AnalysisResult>, selectedModels: string[] }) => void;
  restoreSession: () => boolean;
  clearSession: () => void;
  updateStoredPreferences: (updates: Partial<StoredUserPreferences>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化：加载存储的偏好和会话数据
  useEffect(() => {
    // 加载用户偏好
    const storedPreferences = storage.userPreferences.get();
    if (storedPreferences) {
      dispatch({ type: 'LOAD_STORED_PREFERENCES', payload: storedPreferences });
    }

    // 尝试恢复会话
    if (storage.session.isValid()) {
      const sessionData = storage.session.get();
      if (sessionData && sessionData.question) {
        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            question: sessionData.question,
            selectedModels: sessionData.selectedModels,
            suggestedModels: sessionData.suggestedModels,
            interpretations: sessionData.interpretations
          }
        });
      }
    }
  }, []);

  // 自动保存会话数据
  useEffect(() => {
    if (state.question || Object.keys(state.interpretations).length > 0) {
      storage.session.set({
        question: state.question,
        selectedModels: state.selectedModels,
        suggestedModels: state.suggestedModels,
        interpretations: state.interpretations,
        timestamp: new Date()
      });
    }
  }, [state.question, state.selectedModels, state.suggestedModels, state.interpretations]);
  
  // 便捷方法
  const setQuestion = (question: string) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  };
  
  const addSelectedModel = (modelId: string) => {
    if (!state.selectedModels.includes(modelId)) {
      dispatch({ type: 'ADD_SELECTED_MODEL', payload: modelId });
    }
  };
  
  const removeSelectedModel = (modelId: string) => {
    dispatch({ type: 'REMOVE_SELECTED_MODEL', payload: modelId });
  };
  
  const setLoading = (key: string, loading: boolean, stage?: LoadingState['stage']) => {
    dispatch({
      type: 'SET_LOADING_STATE',
      payload: {
        key,
        state: { isLoading: loading, stage }
      }
    });
  };
  
  const setError = (key: string, error: string, type: ErrorState['errorType'] = 'unknown') => {
    dispatch({
      type: 'SET_ERROR_STATE',
      payload: {
        key,
        error: {
          hasError: true,
          errorType: type,
          message: error,
          retryCount: 0,
          canRetry: true
        }
      }
    });
  };
  
  const clearError = (key: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: key });
  };

  // 存储相关方法
  const saveToHistory = (session: { question: string, interpretations: Record<string, AnalysisResult>, selectedModels: string[] }) => {
    if (session.question) {
      storage.analysisHistory.add({
        question: session.question,
        results: session.interpretations,
        selectedModels: session.selectedModels,
        createdAt: new Date(),
        isFavorite: false,
      });
      // The context state for history only stores the question string for a simple list display
      dispatch({ type: 'ADD_TO_HISTORY', payload: session.question });
    }
  };

  const restoreSession = (): boolean => {
    if (storage.session.isValid()) {
      const sessionData = storage.session.get();
      if (sessionData && sessionData.question) {
        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            question: sessionData.question,
            selectedModels: sessionData.selectedModels,
            suggestedModels: sessionData.suggestedModels,
            interpretations: sessionData.interpretations
          }
        });
        return true;
      }
    }
    return false;
  };

  const clearSession = () => {
    storage.session.clear();
    dispatch({ type: 'RESET_SESSION' });
  };

  const updateStoredPreferences = (updates: Partial<StoredUserPreferences>) => {
    storage.userPreferences.update(updates);
    
    // 同时更新Context中的偏好
    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: {
        preferredModels: updates.preferredModels || state.preferences.preferredModels,
        maxSuggestions: updates.maxSuggestions || state.preferences.maxSuggestions
      }
    });
  };
  
  const value = {
    state,
    dispatch,
    setQuestion,
    addSelectedModel,
    removeSelectedModel,
    setLoading,
    setError,
    clearError,
    saveToHistory,
    restoreSession,
    clearSession,
    updateStoredPreferences
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook使用Context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 