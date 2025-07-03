// 加载保存的设置
export const loadSettings = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['videoParserSettings'], (result) => {
        resolve(result.videoParserSettings);
      });
    });
  };
  
  // 保存设置
  export const saveSettings = (settings) => {
    chrome.storage.local.set({ videoParserSettings: settings });
  };