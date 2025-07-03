import { getCurrentTabUrl } from './utils/api.js';
import { loadSettings, saveSettings } from './utils/storage.js';
import { parsingServices, translations } from './utils/data.js';

// 测试服务状态
const testServiceStatus = (service) => {
  return new Promise((resolve) => {
    // 提取基础URL
    const baseUrl = service.url.split('?')[0];
    if (!baseUrl) {
      resolve({ status: "offline", latency: 0 });
      return;
    }
    
    const testUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const startTime = Date.now();
    
    // 使用HEAD请求测试服务可用性
    fetch(testUrl, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    })
    .then(() => {
      const latency = Date.now() - startTime;
      resolve({ status: "online", latency });
    })
    .catch(() => {
      resolve({ status: "offline", latency: 0 });
    });
  });
};

// 创建应用
export const createApp = () => {
  // 当前状态
  const state = {
    services: [...parsingServices],
    currentTabUrl: "",
    selectedServiceIndex: -1,
    isDarkMode: false,
    currentLang: 'zh',
    showNotification: false,
    notificationMessage: "",
    showAnnouncement: false,
    activeFilter: 'all',
    isTesting: false,
    customName: "",
    customUrl: "",
    customType: "通用解析"
  };
  
  // DOM元素引用
  const appContainer = document.getElementById('app');
  
  // 渲染函数
  const render = () => {
    appContainer.innerHTML = `
      <div class="container">
        <!-- 头部 -->
        <div class="header">
          <div class="logo">VIP</div>
          <h1 id="app-title">${translations[state.currentLang].appTitle}</h1>
          <div class="subtitle" id="app-subtitle">${translations[state.currentLang].appSubtitle}</div>
        </div>
        
        <!-- 工具栏 -->
        <div class="toolbar">
          <button class="theme-toggle" id="theme-toggle">
            <i class="${state.isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}"></i>
            <span id="theme-text">${state.isDarkMode ? translations[state.currentLang].lightText : translations[state.currentLang].darkText}</span>
          </button>
          
          <button class="lang-toggle" id="lang-toggle">
            <i class="fas fa-globe"></i>
            <span id="lang-text">${translations[state.currentLang].langText}</span>
          </button>
          
          <button class="announcement-btn" id="announcement-btn">
            <i class="fas fa-bullhorn"></i>
            <span id="announcement-text">${translations[state.currentLang].announcementText}</span>
          </button>
        </div>
        
        <!-- 内容区域 -->
        <div class="content">
          <!-- URL显示 -->
          <div class="section">
            <div class="section-title">
              <i class="fas fa-link"></i>
              <span id="url-title">${translations[state.currentLang].urlTitle}</span>
            </div>
            <div class="url-container">
              <div class="url-display" id="current-url">
                ${state.currentTabUrl || translations[state.currentLang].fetchingUrl}
              </div>
              <button class="copy-btn" id="copy-btn">
                <i class="fas fa-copy"></i>
                <span id="copy-text">${translations[state.currentLang].copyText}</span>
              </button>
            </div>
          </div>
          
          <!-- 服务选择 -->
          <div class="section">
            <div class="section-title">
              <i class="fas fa-plug"></i>
              <span id="service-title">${translations[state.currentLang].serviceTitle}</span>
            </div>
            
            <div class="filter-bar">
              <button class="filter-btn ${state.activeFilter === 'all' ? 'active' : ''}" id="filter-all">
                ${translations[state.currentLang].allText}
              </button>
              <button class="filter-btn ${state.activeFilter === 'online' ? 'active' : ''}" id="filter-online">
                <i class="fas fa-circle status-online"></i>
                ${translations[state.currentLang].onlineText}
              </button>
              <button class="filter-btn ${state.activeFilter === 'offline' ? 'active' : ''}" id="filter-offline">
                <i class="fas fa-circle status-offline"></i>
                ${translations[state.currentLang].offlineText}
              </button>
            </div>
            
            <div class="service-grid" id="service-grid">
              <!-- 随机选项 -->
              <div class="service-card random-option ${state.selectedServiceIndex === -1 ? 'selected' : ''}" id="random-service">
                <div class="service-name">
                  <i class="fas fa-random"></i>
                  ${translations[state.currentLang].randomText}
                </div>
                <div class="service-url">${translations[state.currentLang].randomDesc}</div>
              </div>
              
              <!-- 服务选项 -->
              ${renderServices()}
            </div>
            
            <button class="refresh-btn" id="refresh-btn" ${state.isTesting ? 'disabled' : ''}>
              <i class="fas fa-sync-alt ${state.isTesting ? 'fa-spin' : ''}"></i>
              ${translations[state.currentLang].refreshText}
            </button>
          </div>
          
          <!-- 自定义接口 -->
          <div class="custom-interface">
            <h3>${translations[state.currentLang].customTitle}</h3>
            <div class="form-group">
              <label>${translations[state.currentLang].nameLabel}</label>
              <input type="text" id="custom-name" value="${state.customName}" placeholder="${translations[state.currentLang].namePlaceholder}">
            </div>
            <div class="form-group">
              <label>${translations[state.currentLang].urlLabel}</label>
              <input type="text" id="custom-url" value="${state.customUrl}" placeholder="${translations[state.currentLang].urlPlaceholder}">
            </div>
            <div class="form-group">
              <label>${translations[state.currentLang].typeLabel}</label>
              <select id="custom-type" class="form-control">
                <option value="通用解析" ${state.customType === '通用解析' ? 'selected' : ''}>${translations[state.currentLang].generalType}</option>
                <option value="抖音/TikTok" ${state.customType === '抖音/TikTok' ? 'selected' : ''}>${translations[state.currentLang].douyinType}</option>
                <option value="多平台万能" ${state.customType === '多平台万能' ? 'selected' : ''}>${translations[state.currentLang].multiType}</option>
                <option value="B站专用" ${state.customType === 'B站专用' ? 'selected' : ''}>${translations[state.currentLang].bilibiliType}</option>
                <option value="平台专用" ${state.customType === '平台专用' ? 'selected' : ''}>${translations[state.currentLang].platformType}</option>
                <option value="海外加速" ${state.customType === '海外加速' ? 'selected' : ''}>${translations[state.currentLang].overseasType}</option>
                <option value="备用接口" ${state.customType === '备用接口' ? 'selected' : ''}>${translations[state.currentLang].backupType}</option>
                <option value="特殊场景" ${state.customType === '特殊场景' ? 'selected' : ''}>${translations[state.currentLang].specialType}</option>
              </select>
            </div>
            <div class="form-actions">
              <button class="test-btn" id="test-custom-btn">
                <i class="fas fa-vial"></i>
                ${translations[state.currentLang].testText}
              </button>
              <button class="add-btn" id="add-custom-btn">
                <i class="fas fa-plus"></i>
                ${translations[state.currentLang].addText}
              </button>
            </div>
          </div>
          
          <!-- 解析按钮 -->
          <button class="action-btn pulse ${!state.currentTabUrl ? 'disabled' : ''}" id="parse-btn">
            <i class="fas fa-play"></i>
            <span id="parse-text">${translations[state.currentLang].parseText}</span>
          </button>
          
          <!-- 导航按钮 -->
          <div class="nav-container">
            <div class="nav-btn" id="github-btn">
              <i class="fab fa-github"></i>
              <span>GitHub</span>
            </div>
            <div class="nav-btn" id="blog-btn">
              <i class="fas fa-blog"></i>
              <span>博客</span>
            </div>
            <div class="nav-btn" id="official-btn">
              <i class="fas fa-home"></i>
              <span>官网</span>
            </div>
          </div>
        </div>
        
        <!-- 页脚 -->
        <div class="footer">
          <p id="footer-text">${translations[state.currentLang].footerText}</p>
        </div>
      </div>
      
      <!-- 通知 -->
      <div class="notification ${state.showNotification ? 'show' : ''}" id="notification">
        <i class="fas fa-check-circle"></i>
        <span id="notification-text">${state.notificationMessage}</span>
      </div>

      <!-- 公告 -->
      <div class="announcement-modal ${state.showAnnouncement ? 'show' : ''}" id="announcement-modal">
        <div class="announcement-content">
          <button class="announcement-close" id="announcement-close">&times;</button>
          <h2 class="announcement-title" id="announcement-title">${translations[state.currentLang].announcementTitle}</h2>
          <div class="announcement-text" id="announcement-text">
            ${renderAnnouncement()}
          </div>
        </div>
      </div>
    `;
    
    // 绑定事件
    bindEvents();
  };
  
  // 渲染服务列表
  const renderServices = () => {
    const filteredServices = state.services.filter(service => {
      if (state.activeFilter === 'all') return true;
      if (state.activeFilter === 'online') return service.status === 'online';
      if (state.activeFilter === 'offline') return service.status === 'offline';
      return true;
    });
    
    if (filteredServices.length === 0) {
      return `<div class="no-services">${translations[state.currentLang].noServicesText}</div>`;
    }
    
    return filteredServices.map((service, index) => `
      <div class="service-card ${state.selectedServiceIndex === index ? 'selected' : ''}" data-index="${index}">
        <div class="service-name">
          <span class="status-indicator ${getStatusClass(service)}"></span>
          ${service.name}
          <span class="service-type">${service.type}</span>
        </div>
        <div class="service-url">${service.url}</div>
        ${service.status !== 'unknown' ? `
          <div class="service-status">
            ${service.status === 'online' ? `
              <i class="fas fa-bolt"></i>
              <span class="service-latency">${service.latency}ms</span>
            ` : translations[state.currentLang].offlineText}
          </div>
        ` : ''}
      </div>
    `).join('');
  };
  
  // 获取状态类名
  const getStatusClass = (service) => {
    if (service.status === 'online') {
      if (service.latency < 300) return 'status-online';
      if (service.latency < 800) return 'status-medium';
      return 'status-slow';
    }
    if (service.status === 'offline') return 'status-offline';
    return 'status-offline';
  };
  
  // 渲染公告内容
  const renderAnnouncement = () => {
    return `
      <p>${translations[state.currentLang].announcementGreeting}</p>
      <p>${translations[state.currentLang].announcementUpdate}</p>
      
      <ul>
        <li>${translations[state.currentLang].update1}</li>
        <li>${translations[state.currentLang].update2}</li>
        <li>${translations[state.currentLang].update3}</li>
        <li>${translations[state.currentLang].update4}</li>
        <li>${translations[state.currentLang].update5}</li>
      </ul>
      
      <p><strong>${translations[state.currentLang].tipsTitle}:</strong></p>
      <p>${translations[state.currentLang].tip1}</p>
      <p>${translations[state.currentLang].tip2}</p>
      <p>${translations[state.currentLang].tip3}</p>
      
      <p>${translations[state.currentLang].announcementFooter} <a href="https://github.com/MrWoods1692/-VIP-" target="_blank">${translations[state.currentLang].githubText}</a> ${translations[state.currentLang].announcementFooter2}</p>
      
      <p>${translations[state.currentLang].thanksText}</p>
      <p style="text-align: right; margin-top: 20px;">${translations[state.currentLang].signature}</p>
    `;
  };
  
  // 绑定事件
  const bindEvents = () => {
    // 主题切换
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // 语言切换
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
    
    // 公告
    document.getElementById('announcement-btn').addEventListener('click', toggleAnnouncement);
    document.getElementById('announcement-close').addEventListener('click', toggleAnnouncement);
    
    // 复制URL
    document.getElementById('copy-btn').addEventListener('click', copyUrlToClipboard);
    
    // 解析按钮
    document.getElementById('parse-btn').addEventListener('click', parseCurrentUrl);
    
    // 筛选按钮
    document.getElementById('filter-all').addEventListener('click', () => setFilter('all'));
    document.getElementById('filter-online').addEventListener('click', () => setFilter('online'));
    document.getElementById('filter-offline').addEventListener('click', () => setFilter('offline'));
    
    // 服务选择
    document.getElementById('random-service').addEventListener('click', () => selectService(-1));
    document.querySelectorAll('.service-card:not(.random-option)').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'));
        selectService(index);
      });
    });
    
    // 刷新服务状态
    document.getElementById('refresh-btn').addEventListener('click', testAllServices);
    
    // 自定义接口
    document.getElementById('test-custom-btn').addEventListener('click', testCustomService);
    document.getElementById('add-custom-btn').addEventListener('click', addCustomService);
    
    // 导航按钮
    document.getElementById('github-btn').addEventListener('click', () => openLink('https://github.com/MrWoods1692/-VIP-'));
    document.getElementById('blog-btn').addEventListener('click', () => openLink('https://www.mrwoods.top/'));
    document.getElementById('official-btn').addEventListener('click', () => openLink('https://vip.mrwoods.top/'));
    
    // 输入框绑定
    document.getElementById('custom-name').addEventListener('input', (e) => {
      state.customName = e.target.value;
    });
    
    document.getElementById('custom-url').addEventListener('input', (e) => {
      state.customUrl = e.target.value;
    });
    
    document.getElementById('custom-type').addEventListener('change', (e) => {
      state.customType = e.target.value;
    });
  };
  
  // 复制URL到剪贴板
  const copyUrlToClipboard = () => {
    if (!state.currentTabUrl) return;
    
    navigator.clipboard.writeText(state.currentTabUrl).then(() => {
      state.showNotification = true;
      state.notificationMessage = translations[state.currentLang].notificationText;
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
    });
  };
  
  // 解析当前URL
  const parseCurrentUrl = () => {
    if (!state.currentTabUrl) {
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '无法获取当前页面URL' : 'Failed to get current URL';
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
      return;
    }
    
    let serviceUrl;
    let serviceName = translations[state.currentLang].randomText;
    
    if (state.selectedServiceIndex === -1) {
      // 从在线服务中随机选择
      const onlineServices = state.services.filter(s => s.status === 'online');
      if (onlineServices.length === 0) {
        state.showNotification = true;
        state.notificationMessage = state.currentLang === 'zh' ? 
          '没有可用的在线接口' : 'No online services available';
        render();
        
        setTimeout(() => {
          state.showNotification = false;
          render();
        }, 2000);
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * onlineServices.length);
      serviceUrl = onlineServices[randomIndex].url;
      serviceName = onlineServices[randomIndex].name;
    } else {
      const service = state.services[state.selectedServiceIndex];
      if (service.status !== 'online') {
        state.showNotification = true;
        state.notificationMessage = state.currentLang === 'zh' ? 
          '所选接口不可用' : 'Selected service is not available';
        render();
        
        setTimeout(() => {
          state.showNotification = false;
          render();
        }, 2000);
        return;
      }
      serviceUrl = service.url;
      serviceName = service.name;
    }
    
    const encodedUrl = encodeURIComponent(state.currentTabUrl);
    const parsedUrl = serviceUrl + encodedUrl;
    
    state.showNotification = true;
    state.notificationMessage = `${state.currentLang === 'zh' ? '使用接口' : 'Using service'}: ${serviceName}...`;
    render();
    
    setTimeout(() => {
      state.showNotification = false;
      render();
    }, 2000);
    
    // 在新窗口中打开解析后的URL
    setTimeout(() => {
      window.open(parsedUrl, '_blank');
    }, 800);
  };
  
  // 切换主题
  const toggleTheme = () => {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-theme', state.isDarkMode);
    saveSettings({
      theme: state.isDarkMode ? 'dark' : 'light',
      language: state.currentLang
    });
    render();
  };
  
  // 切换语言
  const toggleLanguage = () => {
    state.currentLang = state.currentLang === 'zh' ? 'en' : 'zh';
    saveSettings({
      theme: state.isDarkMode ? 'dark' : 'light',
      language: state.currentLang
    });
    render();
  };
  
  // 显示/隐藏公告
  const toggleAnnouncement = () => {
    state.showAnnouncement = !state.showAnnouncement;
    render();
  };
  
  // 设置筛选
  const setFilter = (filter) => {
    state.activeFilter = filter;
    render();
  };
  
  // 选择服务
  const selectService = (index) => {
    state.selectedServiceIndex = index;
    render();
  };
  
  // 测试所有服务
  const testAllServices = () => {
    state.isTesting = true;
    render();
    
    let completed = 0;
    const total = state.services.length;
    
    state.services.forEach(service => {
      service.status = 'unknown';
      testServiceStatus(service).then(result => {
        service.status = result.status;
        service.latency = result.latency;
        completed++;
        if (completed >= total) {
          state.isTesting = false;
          render();
        }
      });
    });
    
    state.showNotification = true;
    state.notificationMessage = state.currentLang === 'zh' ? 
      '正在测试所有接口状态...' : 'Testing all services...';
    render();
    
    setTimeout(() => {
      state.showNotification = false;
      render();
    }, 2000);
  };
  
  // 添加自定义接口
  const addCustomService = () => {
    if (!state.customName || !state.customUrl) {
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '请填写接口名称和URL' : 'Please fill in service name and URL';
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
      return;
    }
    
    // 检查是否已存在相同URL的接口
    const exists = state.services.some(s => s.url === state.customUrl);
    if (exists) {
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '该接口已存在' : 'Service already exists';
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
      return;
    }
    
    state.services.unshift({
      name: state.customName,
      url: state.customUrl,
      type: state.customType,
      status: 'unknown',
      latency: 0
    });
    
    state.customName = "";
    state.customUrl = "";
    
    // 测试新添加的服务
    testServiceStatus(state.services[0]).then(result => {
      state.services[0].status = result.status;
      state.services[0].latency = result.latency;
      render();
    });
    
    state.showNotification = true;
    state.notificationMessage = state.currentLang === 'zh' ? 
      '接口已添加' : 'Service added';
    render();
    
    setTimeout(() => {
      state.showNotification = false;
      render();
    }, 2000);
  };
  
  // 测试自定义接口
  const testCustomService = () => {
    if (!state.customUrl) {
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '请输入要测试的URL' : 'Please enter a URL to test';
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
      return;
    }
    
    testServiceStatus({url: state.customUrl}).then(result => {
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        `接口${result.status === 'online' ? '可用' : '不可用'}，延迟: ${result.latency}ms` : 
        `Service ${result.status === 'online' ? 'available' : 'unavailable'}, latency: ${result.latency}ms`;
      render();
      
      setTimeout(() => {
        state.showNotification = false;
        render();
      }, 2000);
    });
  };
  
  // 打开链接
  const openLink = (url) => {
    window.open(url, '_blank');
  };
  
  // 初始化
  const init = async () => {
    // 加载保存的设置
    const settings = await loadSettings();
    if (settings) {
      state.isDarkMode = settings.theme === 'dark';
      state.currentLang = settings.language || 'zh';
      
      if (state.isDarkMode) {
        document.body.classList.add('dark-theme');
      }
    }
    
    // 获取当前标签页URL
    state.currentTabUrl = await getCurrentTabUrl();
    
    // 初始渲染
    render();
    
    // 测试所有服务状态
    testAllServices();
  };
  
  // 启动应用
  init();
};