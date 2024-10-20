import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // ... (保持原有的状态和函数不变)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200">
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">设置</h2>
        <div className="mb-6">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
            onBlur={handleApiKeyBlur}
            placeholder="输入 OpenAI API Key"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
          />
          {isValidating && <p className="mt-2 text-sm text-blue-500 flex items-center"><Check size={16} className="mr-1" /> 正在验证 API Key...</p>}
          {error && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle size={16} className="mr-1" /> {error}</p>}
        </div>
        {models.length > 0 && (
          <div className="mb-6">
            <label htmlFor="modelSelect" className="block text-sm font-medium text-gray-700 mb-2">
              选择模型
            </label>
            <select
              id="modelSelect"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
            >
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
            disabled={isValidating || !apiKey || models.length === 0}
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;