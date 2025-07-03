// 后台服务脚本
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      // 扩展首次安装时初始化设置
      chrome.storage.local.set({
        videoParserSettings: {
          theme: "light",
          language: "zh"
        }
      });
    }
  });