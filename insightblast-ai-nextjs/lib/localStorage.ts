// 本地存储服务
import { UserPreferences, AnalysisResult, ThinkingModel } from '@/types';

const STORAGE_KEYS = {
  USER_PREFERENCES: 'insightblast_user_preferences',
  ANALYSIS_HISTORY: 'insightblast_analysis_history',
  SESSION_DATA: 'insightblast_session_data',
  USAGE_DATA: 'insightblast_usage_data'
} as const;

// 用户偏好数据类型
export interface StoredUserPreferences extends UserPreferences {
  lastUsedModels: string[];
  favoriteModels: string[];
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

// 分析历史项
export interface AnalysisHistoryItem {
  id: string;
  question: string;
  selectedModels: string[];
  results: Record<string, AnalysisResult>;
  createdAt: Date;
  isFavorite: boolean;
}

// 会话数据
export interface SessionData {
  question: string;
  selectedModels: string[];
  suggestedModels: ThinkingModel[];
  interpretations: Record<string, AnalysisResult>;
  timestamp: Date;
}

// 检查localStorage是否可用
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// 安全的localStorage操作
function safeGetItem(key: string): string | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

function safeRemoveItem(key: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

// 用户偏好管理
export const userPreferencesStorage = {
  get(): StoredUserPreferences | null {
    const stored = safeGetItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing user preferences:', error);
      return null;
    }
  },

  set(preferences: StoredUserPreferences): boolean {
    try {
      return safeSetItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  },

  update(updates: Partial<StoredUserPreferences>): boolean {
    const current = this.get();
    const updated = {
      ...current,
      ...updates,
      preferredModels: current?.preferredModels || [],
      maxSuggestions: 6,
      lastUsedModels: current?.lastUsedModels || [],
      favoriteModels: current?.favoriteModels || [],
      language: 'zh-CN',
      theme: 'auto' as const,
      ...updates
    };
    return this.set(updated);
  },

  clear(): boolean {
    return safeRemoveItem(STORAGE_KEYS.USER_PREFERENCES);
  }
};

// 分析历史管理
export const analysisHistoryStorage = {
  get(): AnalysisHistoryItem[] {
    const stored = safeGetItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    if (!stored) return [];
    
    try {
      const items = JSON.parse(stored) as AnalysisHistoryItem[];
      // 恢复Date对象
      return items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        results: Object.fromEntries(
          Object.entries(item.results || {}).map(([modelId, result]) => [
            modelId,
            {
              ...(result as AnalysisResult),
              generatedAt: new Date((result as AnalysisResult).generatedAt)
            }
          ])
        )
      }));
    } catch (error) {
      console.error('Error parsing analysis history:', error);
      return [];
    }
  },

  add(item: Omit<AnalysisHistoryItem, 'id'>): boolean {
    const history = this.get();
    const newItem: AnalysisHistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    // 添加到开头，保留最近50条
    const updated = [newItem, ...history.slice(0, 49)];
    
    try {
      return safeSetItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving analysis history:', error);
      return false;
    }
  },

  remove(id: string): boolean {
    const history = this.get();
    const updated = history.filter(item => item.id !== id);
    
    try {
      return safeSetItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing from analysis history:', error);
      return false;
    }
  },

  toggleFavorite(id: string): boolean {
    const history = this.get();
    const updated = history.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    
    try {
      return safeSetItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating favorite status:', error);
      return false;
    }
  },

  clear(): boolean {
    return safeRemoveItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  }
};

// 会话数据管理
export const sessionStorage = {
  get(): SessionData | null {
    const stored = safeGetItem(STORAGE_KEYS.SESSION_DATA);
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      return {
        ...data,
        timestamp: new Date(data.timestamp),
        interpretations: Object.fromEntries(
          Object.entries(data.interpretations || {}).map(([modelId, result]) => [
            modelId,
            {
              ...(result as AnalysisResult),
              generatedAt: new Date((result as AnalysisResult).generatedAt)
            }
          ])
        )
      };
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  },

  set(data: SessionData): boolean {
    try {
      return safeSetItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving session data:', error);
      return false;
    }
  },

  clear(): boolean {
    return safeRemoveItem(STORAGE_KEYS.SESSION_DATA);
  },

  // 检查会话是否有效（24小时内）
  isValid(): boolean {
    const data = this.get();
    if (!data) return false;
    
    const now = new Date();
    const sessionAge = now.getTime() - data.timestamp.getTime();
    return sessionAge < 24 * 60 * 60 * 1000; // 24小时
  }
};

// 使用次数管理
export const usageStorage = {
  get(): { count: number; lastUsed: Date | null } {
    const stored = safeGetItem(STORAGE_KEYS.USAGE_DATA);
    if (!stored) return { count: 0, lastUsed: null };

    try {
      const data = JSON.parse(stored);
      return {
        count: data.count || 0,
        lastUsed: data.lastUsed ? new Date(data.lastUsed) : null
      };
    } catch (error) {
      console.error('Error parsing usage data:', error);
      return { count: 0, lastUsed: null };
    }
  },

  increment(): number {
    const current = this.get();
    const newCount = current.count + 1;
    const newData = {
      count: newCount,
      lastUsed: new Date()
    };
    safeSetItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(newData));
    return newCount;
  },

  canUse(limit: number): boolean {
    return this.get().count < limit;
  },

  reset(): boolean {
    return safeSetItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify({ count: 0, lastUsed: null }));
  }
};

// 统一的存储管理器
export const storage = {
  userPreferences: userPreferencesStorage,
  analysisHistory: analysisHistoryStorage,
  session: sessionStorage,
  usage: usageStorage,

  // 清除所有数据
  clearAll(): boolean {
    const results = [
      this.userPreferences.clear(),
      this.analysisHistory.clear(),
      this.session.clear(),
      this.usage.reset()
    ];
    return results.every(result => result);
  },

  // 导出所有数据
  exportAll(): Record<string, unknown> {
    return {
      userPreferences: this.userPreferences.get(),
      analysisHistory: this.analysisHistory.get(),
      session: this.session.get(),
      usage: this.usage.get(),
      exportedAt: new Date().toISOString()
    };
  },

  // 导入数据
  importAll(data: Record<string, unknown>): boolean {
    try {
      if (data.userPreferences) {
        this.userPreferences.set(data.userPreferences as StoredUserPreferences);
      }
      if (data.analysisHistory) {
        safeSetItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(data.analysisHistory));
      }
      if (data.session) {
        this.session.set(data.session as SessionData);
      }
      if (data.usage) {
        safeSetItem(STORAGE_KEYS.USAGE_DATA, JSON.stringify(data.usage));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}; 