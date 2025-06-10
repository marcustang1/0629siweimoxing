import { APIError, NetworkError } from '@/types';

// 错误类型映射
export const ERROR_TYPES = {
  NETWORK: 'network',
  API_LIMIT: 'api_limit', 
  VALIDATION: 'validation',
  UNKNOWN: 'unknown'
} as const;

// 错误信息映射
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络连接后重试',
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  QUOTA_EXCEEDED: 'API使用额度已用完，请联系管理员',
  VALIDATION_ERROR: '输入验证失败，请检查输入内容',
  UNKNOWN_ERROR: '发生了未知错误，请稍后重试',
  API_ERROR: '服务暂时不可用，请稍后重试'
} as const;

// 错误处理器接口
export interface ErrorHandler {
  canHandle(error: unknown): boolean;
  handle(error: unknown): {
    message: string;
    type: string;
    canRetry: boolean;
    retryDelay?: number;
  };
}

// 网络错误处理器
class NetworkErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof TypeError ||
           (error instanceof Error && error.name === 'TypeError') ||
           error instanceof NetworkError;
  }
  
  handle() {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      type: ERROR_TYPES.NETWORK,
      canRetry: true,
      retryDelay: 2000
    };
  }
}

// API错误处理器
class APIErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof APIError;
  }
  
  handle(error: unknown) {
    const apiError = error as APIError;
    
    switch (apiError.status) {
      case 429:
        return {
          message: ERROR_MESSAGES.RATE_LIMIT,
          type: ERROR_TYPES.API_LIMIT,
          canRetry: true,
          retryDelay: 60000 // 1分钟
        };
        
      case 402:
        return {
          message: ERROR_MESSAGES.QUOTA_EXCEEDED,
          type: ERROR_TYPES.API_LIMIT,
          canRetry: false
        };
        
      case 400:
        return {
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          type: ERROR_TYPES.VALIDATION,
          canRetry: false
        };
        
      default:
        return {
          message: ERROR_MESSAGES.API_ERROR,
          type: ERROR_TYPES.UNKNOWN,
          canRetry: true,
          retryDelay: 5000
        };
    }
  }
}

// 验证错误处理器
class ValidationErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof Error && 
           (error.message.includes('验证') || 
            error.message.includes('无效') ||
            error.message.includes('必填'));
  }
  
  handle(error: unknown) {
    const validationError = error as Error;
    
    return {
      message: validationError.message,
      type: ERROR_TYPES.VALIDATION,
      canRetry: false
    };
  }
}

// 默认错误处理器
class DefaultErrorHandler implements ErrorHandler {
  canHandle(): boolean {
    return true; // 捕获所有未处理的错误
  }
  
  handle(error: unknown) {
    console.error('未处理的错误:', error);
    
    return {
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      type: ERROR_TYPES.UNKNOWN,
      canRetry: true,
      retryDelay: 3000
    };
  }
}

// 错误处理器链
class ErrorHandlerChain {
  private handlers: ErrorHandler[] = [
    new NetworkErrorHandler(),
    new APIErrorHandler(),
    new ValidationErrorHandler(),
    new DefaultErrorHandler() // 必须放在最后
  ];
  
  handle(error: unknown) {
    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        return handler.handle(error);
      }
    }
    
    // 理论上不会到达这里，因为DefaultErrorHandler会捕获所有错误
    return {
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      type: ERROR_TYPES.UNKNOWN,
      canRetry: false
    };
  }
}

// 全局错误处理器实例
export const errorHandler = new ErrorHandlerChain();

// 重试机制
export class RetryManager {
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;
  
  canRetry(key: string): boolean {
    const attempts = this.retryAttempts.get(key) || 0;
    return attempts < this.maxRetries;
  }
  
  incrementRetry(key: string): number {
    const attempts = (this.retryAttempts.get(key) || 0) + 1;
    this.retryAttempts.set(key, attempts);
    return attempts;
  }
  
  resetRetry(key: string): void {
    this.retryAttempts.delete(key);
  }
  
  getRetryCount(key: string): number {
    return this.retryAttempts.get(key) || 0;
  }
  
  // 计算重试延迟（指数退避）
  getRetryDelay(attempt: number, baseDelay = 1000): number {
    return Math.min(baseDelay * Math.pow(2, attempt), 10000); // 最多10秒
  }
}

// 全局重试管理器实例
export const retryManager = new RetryManager();

// 便捷的错误处理函数
export function handleError(error: unknown, context = 'unknown') {
  const result = errorHandler.handle(error);
  
  // 记录错误日志
  console.error(`[${context}] 错误处理:`, {
    error,
    result,
    timestamp: new Date().toISOString()
  });
  
  return result;
}

// 用于React组件的错误处理Hook
export function useErrorHandler() {
  const handleAsyncError = async <T>(
    asyncFn: () => Promise<T>,
    context = 'async-operation',
    onError?: (error: unknown) => void
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const result = handleError(error, context);
      
      if (onError) {
        onError({
          ...result,
          originalError: error
        });
      }
      
      return null;
    }
  };
  
  return { handleAsyncError };
}

// 验证工具
export const validators = {
  question: (text: string) => {
    if (!text || typeof text !== 'string') {
      throw new Error('问题不能为空');
    }
    
    if (text.length < 10) {
      throw new Error('问题长度至少需要10个字符');
    }
    
    if (text.length > 1000) {
      throw new Error('问题长度不能超过1000个字符');
    }
    
    return true;
  },
  
  modelId: (id: string) => {
    if (!id || typeof id !== 'string') {
      throw new Error('模型ID不能为空');
    }
    
    if (!/^[a-z-]+$/.test(id)) {
      throw new Error('模型ID格式无效');
    }
    
    return true;
  }
}; 