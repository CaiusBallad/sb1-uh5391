console.log('Background script is starting...');

let sidebarWindowId = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.contextMenus.create({
    id: "translateAndExplain",
    title: "翻译和解释",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  if (info.menuItemId === "translateAndExplain" && info.selectionText) {
    handleTranslation(info.selectionText, tab.url, tab.id);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  if (request.action === 'translate') {
    handleTranslation(request.text, request.url, sender.tab.id);
  } else if (request.action === 'clearTranslation') {
    chrome.storage.local.set({
      currentText: '',
      translation: '',
      explanation: '',
      isProcessing: false
    });
  } else if (request.action === 'toggleSidebar') {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'sidebarStateChanged',
      isMinimized: request.isMinimized
    });
  }
});

async function handleTranslation(text, url, tabId) {
  console.log('Handling translation for:', text);
  
  chrome.storage.local.set({
    currentText: text,
    isProcessing: true
  });

  chrome.tabs.sendMessage(tabId, {
    action: 'updateStatus',
    isProcessing: true,
    currentText: text
  });

  chrome.storage.sync.get(['apiKey', 'selectedModel'], async (result) => {
    const apiKey = result.apiKey;
    const model = result.selectedModel || 'gpt-3.5-turbo';

    if (!apiKey) {
      updateTranslation('请先在设置中设置 API Key', '', text, tabId);
      return;
    }

    try {
      console.log('Sending request to OpenAI API');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: '你是一个翻译和解释助手。请将给定的英文文本翻译成中文，并提供通俗易懂的解释。' },
            { role: 'user', content: `请翻译并解释以下文本：${text}` }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response from OpenAI API:', data);

      const result = data.choices[0].message.content;
      const [translation, explanation] = result.split('\n\n');

      updateHistory(text, translation.replace('翻译：', ''), explanation.replace('解释：', ''), url);
      updateTranslation(translation.replace('翻译：', ''), explanation.replace('解释：', ''), text, tabId);
    } catch (error) {
      console.error('Translation error:', error);
      updateTranslation('翻译过程中出错: ' + error.message, '', text, tabId);
    }
  });
}

function updateTranslation(translation, explanation, currentText, tabId) {
  console.log('Updating translation:', translation, explanation);
  
  chrome.storage.local.set({
    translation,
    explanation,
    currentText,
    isProcessing: false
  });

  chrome.tabs.sendMessage(tabId, {
    action: 'updateTranslation',
    translation,
    explanation,
    currentText
  });
}

function updateHistory(text, translation, explanation, url) {
  chrome.storage.local.get(['history'], (result) => {
    const history = result.history || [];
    history.unshift({
      id: Date.now().toString(),
      text,
      translation,
      explanation,
      url,
      timestamp: Date.now()
    });
    chrome.storage.local.set({ history: history.slice(0, 100) });
  });
}

console.log('Background script loaded and initialized');