import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Trash, Search } from 'lucide-react';

interface HistoryItem {
  id: string;
  text: string;
  translation: string;
  explanation: string;
  url: string;
  timestamp: number;
}

const HistoryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['history'], (result) => {
        setHistory(result.history || []);
      });
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ history: updatedHistory });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredHistory = history.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-6 rounded-lg w-[90%] max-h-[90%] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-purple-700">历史记录</h2>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="搜索历史记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <Search className="absolute left-3 top-2.5 text-purple-400" size={20} />
        </div>
        {filteredHistory.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded-lg shadow-sm bg-purple-50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-600">{item.text.slice(0, 50)}...</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{formatDate(item.timestamp)}</span>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                  <Trash size={18} />
                </button>
                <button onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)} className="text-purple-400 hover:text-purple-600">
                  {expandedItem === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            {expandedItem === item.id && (
              <div className="mt-4 space-y-2">
                <p><strong className="text-purple-600">原文：</strong> <span className="text-gray-600">{item.text}</span></p>
                <p><strong className="text-purple-600">翻译：</strong> <span className="text-gray-600">{item.translation}</span></p>
                <p><strong className="text-purple-600">解释：</strong> <span className="text-gray-600">{item.explanation}</span></p>
                <p><strong className="text-purple-600">URL：</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">{item.url}</a></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryModal;