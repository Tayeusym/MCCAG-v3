// 主入口文件
import AvatarGeneratorApp from './Modules/App.js';

const app = new AvatarGeneratorApp();

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', () => app.init());
