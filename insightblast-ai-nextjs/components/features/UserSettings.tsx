import React, { useState, useEffect } from 'react';
import { Settings, Download, Upload, Trash2, Save, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { storage, StoredUserPreferences } from '@/lib/localStorage';
import { COMPLETE_THINKING_MODELS } from '@/data/thinking-models';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isOpen, onClose }) => {
  const { updateStoredPreferences } = useApp();
  const [preferences, setPreferences] = useState<StoredUserPreferences>({
    preferredModels: [],
    maxSuggestions: 6,
    lastUsedModels: [],
    favoriteModels: [],
    language: 'zh-CN',
    theme: 'auto'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 加载当前设置
  useEffect(() => {
    if (isOpen) {
      const stored = storage.userPreferences.get();
      if (stored) {
        setPreferences(stored);
      }
      setHasChanges(false);
    }
  }, [isOpen]);

  // 更新偏好设置
  const updatePreference = <K extends keyof StoredUserPreferences>(
    key: K,
    value: StoredUserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // 保存设置
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      updateStoredPreferences(preferences);
      setHasChanges(false);
      
      // 显示保存成功提示
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('保存设置失败:', error);
      setIsSaving(false);
    }
  };

  // 重置设置
  const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
      const defaultPrefs: StoredUserPreferences = {
        preferredModels: [],
        maxSuggestions: 6,
        lastUsedModels: [],
        favoriteModels: [],
        language: 'zh-CN',
        theme: 'auto'
      };
      setPreferences(defaultPrefs);
      setHasChanges(true);
    }
  };

  // 导出设置
  const exportSettings = () => {
    const data = storage.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InsightBlast-设置-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 导入设置
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.userPreferences) {
          setPreferences(data.userPreferences);
          setHasChanges(true);
        }
        if (confirm('是否同时导入分析历史记录？')) {
          storage.importAll(data);
        }
      } catch {
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // 清空input
  };

  // 清除所有数据
  const clearAllData = () => {
    if (confirm('确定要清除所有数据吗？包括设置、历史记录等。此操作不可撤销。')) {
      storage.clearAll();
      setPreferences({
        preferredModels: [],
        maxSuggestions: 6,
        lastUsedModels: [],
        favoriteModels: [],
        language: 'zh-CN',
        theme: 'auto'
      });
      setHasChanges(true);
    }
  };

  // 切换收藏模型
  const toggleFavoriteModel = (modelId: string) => {
    const newFavorites = preferences.favoriteModels.includes(modelId)
      ? preferences.favoriteModels.filter(id => id !== modelId)
      : [...preferences.favoriteModels, modelId];
    updatePreference('favoriteModels', newFavorites);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings size={24} className="text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">用户设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* 基础设置 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">基础设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  推荐模型数量
                </label>
                <select
                  value={preferences.maxSuggestions}
                  onChange={(e) => updatePreference('maxSuggestions', Number(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3个模型</option>
                  <option value={6}>6个模型</option>
                  <option value={9}>9个模型</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题模式
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => updatePreference('theme', e.target.value as 'light' | 'dark' | 'auto')}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">跟随系统</option>
                  <option value="light">浅色模式</option>
                  <option value="dark">深色模式</option>
                </select>
              </div>
            </div>
          </div>

          {/* 收藏模型 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">收藏的思维模型</h3>
            <p className="text-sm text-gray-600 mb-4">
              收藏的模型会优先在推荐中显示
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {COMPLETE_THINKING_MODELS.map((model) => (
                <label
                  key={model.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={preferences.favoriteModels.includes(model.id)}
                    onChange={() => toggleFavoriteModel(model.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{model.name}</p>
                    <p className="text-xs text-gray-500 truncate">{model.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 数据管理 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">数据管理</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportSettings}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  <span>导出数据</span>
                </button>

                <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                  <Upload size={16} />
                  <span>导入数据</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={clearAllData}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>清除所有数据</span>
                </button>
              </div>

              <p className="text-xs text-gray-500">
                导出的数据包括用户设置、分析历史等。导入数据将覆盖当前设置。
              </p>
            </div>
          </div>

          {/* 统计信息 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">使用统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">分析历史</p>
                <p className="text-xl font-semibold text-gray-900">
                  {storage.analysisHistory.get().length} 条
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">收藏模型</p>
                <p className="text-xl font-semibold text-gray-900">
                  {preferences.favoriteModels.length} 个
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            重置设置
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              取消
            </button>
            <button
              onClick={saveSettings}
              disabled={!hasChanges || isSaving}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                hasChanges && !isSaving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              <span>{isSaving ? '保存中...' : '保存设置'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings; 