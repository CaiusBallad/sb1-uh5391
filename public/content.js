console.log('Translation content script is starting...');

let translateButton = null;
let sidebarContainer = null;

function createTranslateButton() {
  console.log('Creating translate button...');
  translateButton = document.createElement('button');
  translateButton.textContent = '翻译';
  translateButton.style.position = 'fixed';
  translateButton.style.zIndex = '10000000';
  translateButton.style.padding = '5px 10px';
  translateButton.style.backgroundColor = '#4CAF50';
  translateButton.style.color = 'white';
  translateButton.style.border = 'none';
  translateButton.style.borderRadius = '5px';
  translateButton.style.cursor = 'pointer';
  translateButton.style.display = 'none';
  translateButton.style.fontSize = '14px';
  translateButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  document.body.appendChild(translateButton);
  console.log('Translate button created and added to the body');

  translateButton.addEventListener('click', () => {
    console.log('Translate button clicked');
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      console.log('Sending translation request for:', selectedText);
      chrome.runtime.sendMessage({
        action: 'translate',
        text: selectedText,
        url: window.location.href
      });
    }
    hideTranslateButton();
  });
}

function showTranslateButton(x, y) {
  console.log('Showing translate button at', x, y);
  translateButton.style.left = `${x}px`;
  translateButton.style.top = `${y}px`;
  translateButton.style.display = 'block';
}

function hideTranslateButton() {
  if (translateButton) {
    console.log('Hiding translate button');
    translateButton.style.display = 'none';
  }
}

function createSidebarContainer() {
  sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'translation-sidebar-container';
  sidebarContainer.style.position = 'fixed';
  sidebarContainer.style.top = '0';
  sidebarContainer.style.right = '0';
  sidebarContainer.style.width = '400px';
  sidebarContainer.style.height = '100%';
  sidebarContainer.style.zIndex = '10000001';
  sidebarContainer.style.transition = 'width 0.3s ease-in-out';
  document.body.appendChild(sidebarContainer);

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.src = chrome.runtime.getURL('index.html');
  sidebarContainer.appendChild(iframe);
}

function init() {
  console.log('Initializing content script...');
  createTranslateButton();
  createSidebarContainer();

  document.addEventListener('mouseup', (event) => {
    console.log('Mouse up event detected');
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      console.log('Text selected:', selectedText);
      showTranslateButton(event.pageX, event.pageY);
    } else {
      hideTranslateButton();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target !== translateButton) {
      hideTranslateButton();
    }
  });
}

// 确保DOM加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.action === 'getSelectedText') {
    sendResponse({ text: window.getSelection().toString().trim() });
  } else if (request.action === 'updateStatus' || request.action === 'updateTranslation') {
    // 将消息转发到插件页面
    chrome.runtime.sendMessage(request);
  } else if (request.action === 'sidebarStateChanged') {
    if (request.isMinimized) {
      sidebarContainer.style.width = '48px';
      document.body.style.marginRight = '48px';
    } else {
      sidebarContainer.style.width = '400px';
      document.body.style.marginRight = '400px';
    }
  }
});

// 初始调整页面内容
document.body.style.marginRight = '400px';
document.body.style.transition = 'margin-right 0.3s';

console.log('Translation content script loaded and initialized');