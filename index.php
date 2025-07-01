//这里是公告的API，部署在服务器，路径自己设置，可以修改里面的公告内容，懒得做后台了。

<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 返回HTML格式的公告内容
echo <<<HTML
<h4 class="text-xl font-bold text-blue-400 mb-3">安全防护升级公告</h4>
<p class="text-slate-300 mb-4">我们已全面升级安全防护系统，有效抵御以下威胁：</p>
<ul class="list-disc pl-5 space-y-2 text-slate-300 mb-6">
    <li>恶意广告弹窗与跳转</li>
    <li>钓鱼网站与欺诈链接</li>
    <li>脚本注入攻击</li>
    <li>跨站脚本攻击(XSS)</li>
    <li>跨站请求伪造(CSRF)</li>
</ul>

<div class="bg-slate-800 p-4 rounded-lg border border-blue-500/30 mt-4">
    <div class="flex items-start gap-3">
        <i class="fas fa-info-circle text-blue-400 mt-1"></i>
        <div>
            <p class="text-slate-300"><span class="font-medium text-blue-300">最新更新：</span> 
            新增了3个解析接口，优化了播放稳定性。</p>
            <p class="text-slate-400 text-sm mt-2">更新时间：2023-12-15 | 版本：v2.1.0</p>
        </div>
    </div>
</div>

<button id="refresh-api" class="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
    <i class="fas fa-sync-alt mr-2"></i>刷新
</button>
HTML;
?>
