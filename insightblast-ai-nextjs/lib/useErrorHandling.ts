import { useState, useCallback, useRef, useMemo } from 'react';

// 错误类型
export type ErrorType = 'network' | 'api_limit' | 'validation' | 'timeout' | 'quota' | 'unknown';

// 错误状态
export interface ErrorState {
  hasError: boolean;
  errorType: ErrorType;
  message: string;
  retryCount: number;
  maxRetries: number;
  canRetry: boolean;
  isRetrying: boolean;
  lastError?: Error;
}

// 重试配置
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  retryCondition?: (error: Error) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  retryCondition: (error) => {
    // 网络错误可以重试
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return true;
    }
    // 5xx服务器错误可以重试
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return true;
    }
    return false;
  }
};

export function useErrorHandling(config: Partial<RetryConfig> = {}) {
  const retryConfig = useMemo(() => ({ ...defaultRetryConfig, ...config }), [config]);
  const [errors, setErrors] = useState<Record<string, ErrorState>>({});
  const retryTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // 设置错误
  const setError = useCallback((key: string, error: Error | string, type: ErrorType = 'unknown') => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorObj = error instanceof Error ? error : new Error(errorMessage);
    
    setErrors(prev => ({
      ...prev,
      [key]: {
        hasError: true,
        errorType: type,
        message: errorMessage,
        retryCount: prev[key]?.retryCount || 0,
        maxRetries: retryConfig.maxRetries,
        canRetry: retryConfig.retryCondition ? retryConfig.retryCondition(errorObj) : false,
        isRetrying: false,
        lastError: errorObj
      }
    }));
  }, [retryConfig]);

  // 清除错误
  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    
    // 清除重试定时器
    if (retryTimeouts.current[key]) {
      clearTimeout(retryTimeouts.current[key]);
      delete retryTimeouts.current[key];
    }
  }, []);

  // 重试操作
  const retry = useCallback(async (key: string, operation: () => Promise<unknown>) => {
    const errorState = errors[key];
    if (!errorState || !errorState.canRetry || errorState.retryCount >= errorState.maxRetries) {
      return;
    }

    // 设置重试状态
    setErrors(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isRetrying: true,
        retryCount: prev[key].retryCount + 1
      }
    }));

    // 计算延迟时间
    const delay = retryConfig.exponentialBackoff 
      ? retryConfig.retryDelay * Math.pow(2, errorState.retryCount)
      : retryConfig.retryDelay;

    // 延迟重试
    retryTimeouts.current[key] = setTimeout(async () => {
      try {
        await operation();
        clearError(key);
      } catch (error) {
        setError(key, error as Error);
      }
      
      delete retryTimeouts.current[key];
    }, delay);
  }, [errors, retryConfig, setError, clearError]);

  // 包装异步操作，自动处理错误
  const withErrorHandling = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      errorType?: ErrorType;
    }
  ): Promise<T | null> => {
    clearError(key);
    
    try {
      const result = await operation();
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const errorType = options?.errorType || detectErrorType(err);
      
      setError(key, err, errorType);
      options?.onError?.(err);
      
      return null;
    }
  }, [setError, clearError]);

  // 检测错误类型
  const detectErrorType = (error: Error): ErrorType => {
    const message = error.message.toLowerCase();
    
    if (error.name === 'NetworkError' || message.includes('fetch') || message.includes('network')) {
      return 'network';
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return 'api_limit';
    }
    
    if (message.includes('timeout')) {
      return 'timeout';
    }
    
    if (message.includes('quota') || message.includes('402')) {
      return 'quota';
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    
    return 'unknown';
  };

  // 获取用户友好的错误消息
  const getFriendlyErrorMessage = (errorType: ErrorType, originalMessage: string): string => {
    switch (errorType) {
      case 'network':
        return '网络连接失败，请检查网络连接后重试';
      case 'api_limit':
        return '请求过于频繁，请稍后再试';
      case 'timeout':
        return '请求超时，请重试';
      case 'quota':
        return 'API使用额度已用完，请联系管理员';
      case 'validation':
        return '输入数据有误，请检查后重试';
      default:
        return originalMessage || '操作失败，请重试';
    }
  };

  // 检查网络状态
  const checkNetworkStatus = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true; // 假设在线
  }, []);

  // 获取重试倒计时
  const getRetryCountdown = useCallback((key: string): number => {
    const errorState = errors[key];
    if (!errorState || !errorState.isRetrying) return 0;
    
    const delay = retryConfig.exponentialBackoff 
      ? retryConfig.retryDelay * Math.pow(2, errorState.retryCount - 1)
      : retryConfig.retryDelay;
    
    return Math.ceil(delay / 1000);
  }, [errors, retryConfig]);

  return {
    errors,
    setError,
    clearError,
    retry,
    withErrorHandling,
    getFriendlyErrorMessage,
    checkNetworkStatus,
    getRetryCountdown,
    
    // 便捷方法
    hasError: (key: string) => errors[key]?.hasError || false,
    canRetry: (key: string) => errors[key]?.canRetry || false,
    isRetrying: (key: string) => errors[key]?.isRetrying || false,
    getError: (key: string) => errors[key] || null,
    
    // 批量操作
    clearAllErrors: () => {
      Object.keys(retryTimeouts.current).forEach(key => {
        clearTimeout(retryTimeouts.current[key]);
      });
      retryTimeouts.current = {};
      setErrors({});
    },
    
    hasAnyError: () => Object.values(errors).some(error => error.hasError)
  };
} 