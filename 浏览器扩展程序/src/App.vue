<template>
  <div class="container">
    <div class="header">
      <div class="logo">VIP</div>
      <h1 id="app-title">{{ translations[currentLang].appTitle }}</h1>
      <div class="subtitle" id="app-subtitle">{{ translations[currentLang].appSubtitle }}</div>
    </div>
    
    <div class="toolbar">
      <button class="theme-toggle" id="theme-toggle" @click="toggleTheme">
        <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        <span id="theme-text">{{ isDarkMode ? translations[currentLang].lightText : translations[currentLang].darkText }}</span>
      </button>
      
      <button class="lang-toggle" id="lang-toggle" @click="toggleLanguage">
        <i class="fas fa-globe"></i>
        <span id="lang-text">{{ translations[currentLang].langText }}</span>
      </button>
      
      <button class="announcement-btn" id="announcement-btn" @click="toggleAnnouncement">
        <i class="fas fa-bullhorn"></i>
        <span id="announcement-text">{{ translations[currentLang].announcementText }}</span>
      </button>
    </div>
    
    <div class="content">
      <UrlDisplay 
        :currentTabUrl="currentTabUrl" 
        :translations="translations"
        :currentLang="currentLang"
        @copyUrl="copyUrlToClipboard"
      />
      
      <div class="section">
        <div class="section-title">
          <i class="fas fa-plug"></i>
          <span id="service-title">{{ translations[currentLang].serviceTitle }}</span>
        </div>
        
        <div class="filter-bar">
          <button 
            class="filter-btn" 
            :class="{active: activeFilter === 'all'}" 
            @click="activeFilter = 'all'"
          >
            {{ translations[currentLang].allText }}
          </button>
          <button 
            class="filter-btn" 
            :class="{active: activeFilter === 'online'}" 
            @click="activeFilter = 'online'"
          >
            <i class="fas fa-circle status-online"></i>
            {{ translations[currentLang].onlineText }}
          </button>
          <button 
            class="filter-btn" 
            :class="{active: activeFilter === 'offline'}" 
            @click="activeFilter = 'offline'"
          >
            <i class="fas fa-circle status-offline"></i>
            {{ translations[currentLang].offlineText }}
          </button>
        </div>
        
        <div class="service-grid" id="service-grid">
          <!-- 随机选项 -->
          <div 
            class="service-card random-option" 
            :class="{selected: selectedServiceIndex === -1}" 
            @click="selectService(-1)"
          >
            <div class="service-name">
              <i class="fas fa-random"></i>
              {{ translations[currentLang].randomText }}
            </div>
            <div class="service-url">{{ translations[currentLang].randomDesc }}</div>
          </div>
          
          <!-- 服务选项 -->
          <template v-if="filteredServices.length > 0">
            <ServiceCard 
              v-for="(service, index) in filteredServices" 
              :key="index"
              :service="service"
              :selected="selectedServiceIndex === index"
              :currentLang="currentLang"
              :translations="translations"
              @click="selectService(index)"
            />
          </template>
          <template v-else>
            <div class="no-services">
              {{ translations[currentLang].noServicesText }}
            </div>
          </template>
        </div>
        
        <button class="refresh-btn" @click="testAllServices" :disabled="isTesting">
          <i class="fas fa-sync-alt" :class="{'fa-spin': isTesting}"></i>
          {{ translations[currentLang].refreshText }}
        </button>
      </div>
      
      <CustomInterface 
        :translations="translations"
        :currentLang="currentLang"
        @addService="addCustomService"
        @testService="testCustomService"
      />
      
      <button class="action-btn pulse" id="parse-btn" @click="parseCurrentUrl" :class="{disabled: !currentTabUrl}">
        <i class="fas fa-play"></i>
        <span id="parse-text">{{ translations[currentLang].parseText }}</span>
      </button>
      
      <div class="nav-container">
        <div class="nav-btn" id="github-btn" @click="openLink('https://github.com/MrWoods1692/-VIP-')">
          <i class="fab fa-github"></i>
          <span>GitHub</span>
        </div>
        <div class="nav-btn" id="blog-btn" @click="openLink('https://www.mrwoods.top/')">
          <i class="fas fa-blog"></i>
          <span>博客</span>
        </div>
        <div class="nav-btn" id="official-btn" @click="openLink('https://vip.mrwoods.top/')">
          <i class="fas fa-home"></i>
          <span>官网</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p id="footer-text">{{ translations[currentLang].footerText }}</p>
    </div>
  </div>
  
  <div class="notification" id="notification" :class="{show: showNotification}">
    <i class="fas fa-check-circle"></i>
    <span id="notification-text">{{ notificationMessage }}</span>
  </div>

  <div class="announcement-modal" id="announcement-modal" :class="{show: showAnnouncement}">
    <div class="announcement-content">
      <button class="announcement-close" id="announcement-close" @click="toggleAnnouncement">&times;</button>
      <h2 class="announcement-title" id="announcement-title">{{ translations[currentLang].announcementTitle }}</h2>
      <div class="announcement-text" id="announcement-text">
        <p>{{ translations[currentLang].announcementGreeting }}</p>
        <p>{{ translations[currentLang].announcementUpdate }}</p>
        
        <ul>
          <li>{{ translations[currentLang].update1 }}</li>
          <li>{{ translations[currentLang].update2 }}</li>
          <li>{{ translations[currentLang].update3 }}</li>
          <li>{{ translations[currentLang].update4 }}</li>
          <li>{{ translations[currentLang].update5 }}</li>
        </ul>
        
        <p><strong>{{ translations[currentLang].tipsTitle }}:</strong></p>
        <p>{{ translations[currentLang].tip1 }}</p>
        <p>{{ translations[currentLang].tip2 }}</p>
        <p>{{ translations[currentLang].tip3 }}</p>
        
        <p>{{ translations[currentLang].announcementFooter }} <a href="https://github.com/MrWoods1692/-VIP-" target="_blank">{{ translations[currentLang].githubText }}</a> {{ translations[currentLang].announcementFooter2 }}</p>
        
        <p>{{ translations[currentLang].thanksText }}</p>
        <p style="text-align: right; margin-top: 20px;">{{ translations[currentLang].signature }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import ServiceCard from './components/ServiceCard.vue';
import UrlDisplay from './components/UrlDisplay.vue';
import CustomInterface from './components/CustomInterface.vue';
import { parsingServices, translations } from './utils/data.js';
import { getCurrentTabUrl, testServiceStatus } from './utils/api.js';
import { loadSettings, saveSettings } from './utils/storage.js';

export default {
  components: {
    ServiceCard,
    UrlDisplay,
    CustomInterface
  },
  setup() {
    // 当前状态
    const state = reactive({
      services: [...parsingServices],
      currentTabUrl: "",
      selectedServiceIndex: -1,
      isDarkMode: false,
      currentLang: 'zh',
      showNotification: false,
      notificationMessage: "",
      showAnnouncement: false,
      activeFilter: 'all',
      isTesting: false
    });

    // 过滤后的服务列表
    const filteredServices = computed(() => {
      return state.services.filter(service => {
        if (state.activeFilter === 'all') return true;
        if (state.activeFilter === 'online') return service.status === 'online';
        if (state.activeFilter === 'offline') return service.status === 'offline';
        return true;
      });
    });

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

    // 复制URL到剪贴板
    const copyUrlToClipboard = () => {
      if (!state.currentTabUrl) return;
      
      navigator.clipboard.writeText(state.currentTabUrl).then(() => {
        state.showNotification = true;
        state.notificationMessage = translations[state.currentLang].notificationText;
        setTimeout(() => {
          state.showNotification = false;
        }, 2000);
      });
    };

    // 解析当前URL
    const parseCurrentUrl = () => {
      if (!state.currentTabUrl) {
        state.showNotification = true;
        state.notificationMessage = state.currentLang === 'zh' ? 
          '无法获取当前页面URL' : 'Failed to get current URL';
        setTimeout(() => {
          state.showNotification = false;
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
          setTimeout(() => {
            state.showNotification = false;
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
          setTimeout(() => {
            state.showNotification = false;
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
      setTimeout(() => {
        state.showNotification = false;
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
    };

    // 切换语言
    const toggleLanguage = () => {
      state.currentLang = state.currentLang === 'zh' ? 'en' : 'zh';
      saveSettings({
        theme: state.isDarkMode ? 'dark' : 'light',
        language: state.currentLang
      });
    };

    // 显示/隐藏公告
    const toggleAnnouncement = () => {
      state.showAnnouncement = !state.showAnnouncement;
    };

    // 选择服务
    const selectService = (index) => {
      state.selectedServiceIndex = index;
    };

    // 测试所有服务
    const testAllServices = () => {
      state.isTesting = true;
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
          }
        });
      });
      
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '正在测试所有接口状态...' : 'Testing all services...';
      setTimeout(() => {
        state.showNotification = false;
      }, 2000);
    };

    // 添加自定义接口
    const addCustomService = (customService) => {
      // 检查是否已存在相同URL的接口
      const exists = state.services.some(s => s.url === customService.url);
      if (exists) {
        state.showNotification = true;
        state.notificationMessage = state.currentLang === 'zh' ? 
          '该接口已存在' : 'Service already exists';
        setTimeout(() => {
          state.showNotification = false;
        }, 2000);
        return;
      }
      
      state.services.unshift({
        name: customService.name,
        url: customService.url,
        type: customService.type,
        status: 'unknown',
        latency: 0
      });
      
      // 测试新添加的服务
      testServiceStatus(state.services[0]).then(result => {
        state.services[0].status = result.status;
        state.services[0].latency = result.latency;
      });
      
      state.showNotification = true;
      state.notificationMessage = state.currentLang === 'zh' ? 
        '接口已添加' : 'Service added';
      setTimeout(() => {
        state.showNotification = false;
      }, 2000);
    };

    // 测试自定义接口
    const testCustomService = (url) => {
      testServiceStatus({url}).then(result => {
        state.showNotification = true;
        state.notificationMessage = state.currentLang === 'zh' ? 
          `接口${result.status === 'online' ? '可用' : '不可用'}，延迟: ${result.latency}ms` : 
          `Service ${result.status === 'online' ? 'available' : 'unavailable'}, latency: ${result.latency}ms`;
        setTimeout(() => {
          state.showNotification = false;
        }, 2000);
      });
    };

    // 打开链接
    const openLink = (url) => {
      window.open(url, '_blank');
    };

    // 初始化
    onMounted(() => {
      // 加载保存的设置
      loadSettings().then(settings => {
        if (settings) {
          state.isDarkMode = settings.theme === 'dark';
          state.currentLang = settings.language || 'zh';
          
          if (state.isDarkMode) {
            document.body.classList.add('dark-theme');
          }
        }
      });

      // 获取当前标签页URL
      getCurrentTabUrl().then(url => {
        state.currentTabUrl = url;
      });

      // 测试所有服务状态
      testAllServices();
    });

    return {
      ...state,
      translations,
      filteredServices,
      getStatusClass,
      copyUrlToClipboard,
      parseCurrentUrl,
      toggleTheme,
      toggleLanguage,
      toggleAnnouncement,
      selectService,
      testAllServices,
      addCustomService,
      testCustomService,
      openLink
    };
  }
};
</script>

<style scoped>
</style>