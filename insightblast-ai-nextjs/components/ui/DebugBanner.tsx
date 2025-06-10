'use client';

interface DebugBannerProps {
  className?: string;
}

export function DebugBanner({ className = '' }: DebugBannerProps) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>调试模式</strong> - 当前使用智能备用分析和模拟数据进行演示。所有功能都可正常使用！
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            💡 所有推荐和分析结果都是基于问题内容智能生成的高质量内容
          </p>
        </div>
      </div>
    </div>
  );
} 