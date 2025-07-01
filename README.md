# VIP影视解析项目

下面是为这个VIP影视解析项目的项目介绍、功能说明、使用方法和部署指南等内容。

## 项目预览图
![VIP影视解析](https://pic4.zhimg.com/v2-0916f1ec1004312cdc0a088b0bc8e3d7_r.jpg)

## 目录
- [项目概述](#项目概述)
- [主要功能](#主要功能)
- [使用说明](#使用说明)
- [技术实现](#技术实现)
- [安全机制](#安全机制)
- [部署指南](#部署指南)
- [开源协议](#开源协议)
- [免责声明](#免责声明)

## 项目概述
VIP影视解析是一个免费解析各大视频平台VIP视频的工具，支持腾讯、爱奇艺、优酷、芒果TV等平台。本项目采用前端技术实现，具备安全防护机制，防止恶意跳转和广告。

## 主要功能

### 1. 多接口解析
- 提供5种不同解析接口（普通、高速、超清、常用、海外）
- 支持解析各大视频平台的VIP内容
- 实时显示当前使用的解析接口

### 2. 安全防护系统
- 自动监控播放页面，阻止非法跳转
- 安全警报机制，检测到异常行为自动重置播放器
- 安全播放统计（拦截威胁次数、安全播放次数）

### 3. 用户友好界面
- 响应式设计，适配各种设备
- 影视平台导航（集成18个主流视频平台）
- 动态视觉特效（悬浮元素、发光卡片等）

### 4. 辅助功能
- 全屏播放模式
- 详细使用教程
- 实时公告系统

## 使用说明

### 基本使用流程
1. 从视频平台复制VIP视频链接
2. 粘贴到输入框中
3. 选择解析接口（可选）
4. 点击"解析"按钮
5. 观看解析后的视频

### 接口选择
点击"更换接口"按钮可以选择不同的解析接口：
- **常用接口**：默认选择，稳定性好
- **极速接口**：解析速度快
- **高清接口**：支持1080P
- **超清接口**：支持4K超清
- **海外接口**：支持海外访问

### 安全功能
- 当检测到不安全行为时，系统会显示安全警报
- 点击"返回安全播放"按钮可恢复播放
- 安全统计显示在页面底部

### 其他功能
- **全屏模式**：点击全屏按钮进入沉浸式观看
- **影视平台导航**：快速访问各大视频平台
- **使用帮助**：查看详细使用教程和安全提示

## 技术实现

### 前端技术栈
- **HTML5**：页面结构
- **Tailwind CSS**：响应式UI设计
- **JavaScript**：交互逻辑
- **Font Awesome**：图标库

### 核心模块
1. **安全控制模块(SecurityManager)**
   - URL净化与验证
   - 安全历史记录管理
   - 安全警报处理
   - 播放统计

2. **弹窗控制器(ModalController)**
   - 公告弹窗
   - 帮助教程
   - API选择界面

3. **公告加载器(AnnouncementLoader)**
   - 从远程服务器加载公告
   - 错误处理和重试机制

### 安全监控机制
```javascript
// 使用MutationObserver监控iframe变化
const frameObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'src') {
      const frame = document.getElementById('video-frame');
      if (!SecurityManager.validate(frame.src)) {
        frame.src = SecurityManager.currentValidURL;
        SecurityManager.showSecurityAlert();
      }
    }
  });
});

// 双重安全检测
setInterval(() => {
  const frame = document.getElementById('video-frame');
  if (SecurityManager.currentValidURL && 
      (!frame.src.startsWith(SecurityManager.currentAPI) || 
      !SecurityManager.validate(frame.src))
  ) {
    SecurityManager.showSecurityAlert();
    frame.src = SecurityManager.currentValidURL;
  }
}, 1000);
```

## 安全机制

### 多层防护体系
1. **URL净化**
   - 对输入URL进行编码和过滤
   - 只允许通过当前解析接口的URL

2. **历史验证**
   - 维护安全播放历史记录
   - 只允许播放已验证的安全URL

3. **实时监控**
   - 使用MutationObserver监控iframe属性变化
   - 定时检查当前播放地址

4. **安全警报**
   - 检测到异常时显示安全罩
   - 自动重置播放器到安全状态
   - 更新安全统计数据

5. **沙盒环境**
   - 使用sandbox属性限制iframe权限
   - 防止恶意脚本执行

## 部署指南

### 简单部署
1. 克隆仓库：
   ```bash
   git clone https://github.com/MrWoods1692/-VIP-.git
   ```
2. 将文件上传到静态服务器
3. 通过浏览器访问index.html

### 自定义配置
1. **修改解析接口**：
   ```javascript
   // 在SecurityManager.baseURLs中添加/修改接口
   baseURLs: [
     {name: "新接口", url: 'https://new-api.example.com/?url='},
     // ...
   ]
   ```
2. **更改公告地址**：
   ```javascript
   // 修改AnnouncementLoader.load中的fetch URL
   const response = await fetch('https://your-announcement-server.com', {
     // ...
   });
   ```
3. **调整安全参数**：
   - 修改安全检测间隔时间
   - 调整安全警报阈值

## 开源协议
本项目采用 [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html) 开源协议。

**主要条款**：
- 允许自由使用、修改和分发
- 修改版本必须采用相同许可证
- 必须保留版权和许可声明
- 不提供任何担保

## 免责声明
本项目仅用于学习和技术交流，不得用于商业用途。使用本工具解析视频时，请确保遵守相关视频平台的规定。因使用本工具产生的任何问题，由使用者自行承担。
