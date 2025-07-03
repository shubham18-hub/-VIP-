// 获取当前标签页URL
export const getCurrentTabUrl = () => {
    return new Promise((resolve) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs && tabs.length > 0) {
          resolve(tabs[0].url);
        } else {
          resolve("");
        }
      });
    });
  };
