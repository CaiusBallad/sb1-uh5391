import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash, Search } from 'lucide-react';

interface HistoryItem {
  id: string;
  text: string;
  translation: string;
  explanation: string;
  url: string;
  timestamp: number;
}

const HistoryView: React.FC = () => {
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
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索历史记录..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      {filteredHistory.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">{item.text.slice(0, 50)}...</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{formatDate(item.timestamp)}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                <Trash size={18} />
              </button>
              <button onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)} className="text-gray-500 hover:text-gray-700">
                {expandedItem === item.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>
          {expandedItem === item.id && (
            <div className="mt-4 space-y-2">
              <p><strong className="text-gray-700">原文：</strong> <span className="text-gray-600">{item.text}</span></p>
              <p><strong className="text-gray-700">翻译：</strong> <span className="text-gray-600">{item.translation}</span></p>
              <p><strong className="text-gray-700">解释：</strong> <span className="text-gray-600">{item.explanation}</span></p>
              <p><strong className="text-gray-700">URL：</strong> <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.url}</a></p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryView;