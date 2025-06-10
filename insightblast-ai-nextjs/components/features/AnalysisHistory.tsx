import React, { useState, useEffect } from 'react';
import { Clock, Heart, Download, Trash2, Search } from 'lucide-react';
import { AnalysisHistoryItem, storage } from '@/lib/localStorage';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';

interface AnalysisHistoryProps {
  onSelectHistory?: (item: AnalysisHistoryItem) => void;
  className?: string;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  onSelectHistory,
  className = ''
}) => {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 加载历史记录
  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true);
      try {
        const items = storage.analysisHistory.get();
        setHistoryItems(items);
      } catch (error) {
        console.error('加载历史记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 过滤历史记录
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  // 切换收藏状态
  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    storage.analysisHistory.toggleFavorite(id);
    setHistoryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // 删除历史记录
  const deleteItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('确定要删除这条分析记录吗？')) {
      storage.analysisHistory.remove(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // 导出历史记录
  const exportHistory = () => {
    const data = storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InsightBlast-历史记录-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 获取模型名称
  const getModelName = (modelId: string) => {
    const model = COMPLETE_THINKING_MODELS.find(m => m.id === modelId);
    return model?.name || modelId;
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* 头部控制栏 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">分析历史</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportHistory}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50"
            >
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索分析记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-1 px-3 py-2 text-sm border rounded-md ${
              showFavoritesOnly 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            <span>收藏</span>
          </button>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="max-h-96 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {historyItems.length === 0 ? (
              <>
                <Clock size={48} className="mx-auto mb-3 text-gray-300" />
                <p>还没有分析记录</p>
                <p className="text-sm">完成一次分析后，记录会自动保存在这里</p>
              </>
            ) : (
              <>
                <Search size={48} className="mx-auto mb-3 text-gray-300" />
                <p>没有找到匹配的记录</p>
                <p className="text-sm">尝试修改搜索条件</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory?.(item)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.question}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                      <span>{item.selectedModels.length} 个模型</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.selectedModels.slice(0, 3).map(modelId => (
                        <span
                          key={modelId}
                          className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {getModelName(modelId)}
                        </span>
                      ))}
                      {item.selectedModels.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                          +{item.selectedModels.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`p-1.5 rounded-full hover:bg-gray-200 ${
                        item.isFavorite ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <Heart size={14} fill={item.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => deleteItem(item.id, e)}
                      className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      {filteredItems.length > 0 && (
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
          显示 {filteredItems.length} 条记录
          {historyItems.length !== filteredItems.length && ` / 共 ${historyItems.length} 条`}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory; 