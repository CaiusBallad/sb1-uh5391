import React, { useState, useEffect } from 'react';
import { Settings, History, Loader2, X, ChevronRight, ChevronLeft, Home, Share2 } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import HistoryView from './components/HistoryView';

function App() {
  const [currentText, setCurrentText] = useState('');
  const [translation, setTranslation] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // ... (保持原有的useEffect逻辑不变)
  }, []);

  const handleClear = () => {
    // ... (保持原有的handleClear逻辑不变)
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'toggleSidebar', isMinimized: !isMinimized });
    }
  };

  const hasContent = currentText || translation || explanation;

  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ${isMinimized ? 'w-12' : 'w-[400px]'} flex flex-col`}>
      <div className="flex justify-between items-center p-4 bg-white text-gray-700 border-b">
        <button onClick={toggleMinimize} className="p-1 hover:bg-gray-100 rounded">
          {isMinimized ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <h1 className={`font-bold ${isMinimized ? 'hidden' : 'block'}`}>翻译助手</h1>
        <button onClick={toggleMinimize} className="p-1 hover:bg-gray-100 rounded">
          {isMinimized ? <ChevronLeft size={20} /> : <X size={20} />}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="flex justify-between mb-6">
            <button onClick={() => setShowHistory(!showHistory)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300">
              <Home size={20} />
            </button>
            <button onClick={() => {}} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300">
              <Share2 size={20} />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300">
              <Settings size={20} />
            </button>
          </div>

          {showHistory ? (
            <HistoryView />
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
              <p className="mt-4 text-lg font-medium text-gray-700">正在处理...</p>
            </div>
          ) : (
            <div className="relative">
              {currentText && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">选中的文本：</h3>
                  <p className="text-gray-700">{currentText}</p>
                </div>
              )}
              {translation && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">翻译：</h3>
                  <p className="text-gray-700">{translation}</p>
                </div>
              )}
              {explanation && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">解释：</h3>
                  <p className="text-gray-700">{explanation}</p>
                </div>
              )}
              {hasContent && (
                <button 
                  onClick={handleClear}
                  className="absolute bottom-2 right-2 p-1 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-all duration-300"
                  title="清除内容"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
      )}
    </div>
  );
}

export default App;