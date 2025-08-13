<div align="center">

# 🥰 MCCAG - Minecraft 可爱头像生成器

<img src="Resources/Logo.png" alt="MCCAG Logo" width="128">

_Minecraft Cute Avatar Generator_  
_轻松生成个性化的 Minecraft 头像_

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

## 📖 项目简介

MCCAG 是一个基于 Web 的 Minecraft 头像生成器，支持多种头像风格和自定义选项。用户可以通过正版 ID、皮肤站或直接上传皮肤文件来生成个性化的头像。

### ✨ 主要特性

- 🎨 **多种头像风格**：支持 Minimal、Vintage、Side 三种不同的头像渲染风格。
- 🌐 **多种皮肤来源**：支持正版 Mojang ID、皮肤站和本地上传。
- 🎯 **高度自定义**：可调整阴影、缩放、颜色、背景等多种参数。
- 🌍 **多语言支持**：支持中文、英文、日文、韩文、法文、德文。
- 📱 **响应式设计**：完美适配桌面和移动设备。
- 💾 **多种下载格式**：支持透明背景和带背景两种下载方式。

## 🚀 快速开始

直接访问部署的网站 https://mccag.cn 即可使用，无需安装任何软件。


## 🛠️ 技术架构

### 前端技术栈

- **HTML5**：语义化标记和现代 Web 标准。
- **CSS3**：响应式布局、动画效果、自定义属性。
- **JavaScript ES6+**：模块化架构、异步处理、Canvas 绘图。
- **Canvas API**：头像渲染和图像处理。

### 项目结构

```
MCCAG/
├── Index.html            # 主页面
├── Index.css             # 主样式文件
├── Index.js              # 入口文件
├── Modules/              # 核心模块
│   ├── App.js            # 主应用逻辑
│   ├── Const.js          # 常量定义
│   ├── I18n.js           # 国际化支持
│   ├── Network.js        # 网络请求处理
│   ├── Utils.js          # 工具函数
│   └── Renderers/        # 渲染器模块
│       ├── Index.js      # 渲染器入口
│       ├── Data.js       # 数据处理
│       ├── Image.js      # 图像处理
│       ├── Minimal.js    # Minimal 风格渲染器
│       ├── Vintage.js    # Vintage 风格渲染器
│       └── Side.js       # Side 风格渲染器
└── Resources/            # 静态资源
    ├── Icons/            # 图标文件
    └── Models/           # 模型预览图
```

### 核心功能模块

- **应用控制主类**：主应用类，管理整体状态和流程。
- **渲染器系统**：模块化的头像渲染引擎。
- **网络模块**：处理 Mojang API 和皮肤站 API 调用。
- **国际化模块**：多语言支持系统。
- **工具模块**：通用工具函数和 UI 交互。

## 📄 许可证

本项目采用 [GNU General Public License v3.0](LICENSE) 许可证。

## 🙏 致谢

- 灵感来源：[Natsusomekeishi/MCCAG](https://github.com/Natsusomekeishi/MCCAG)
- Minimal 风格灵感：[噪音回放](https://www.bilibili.com/video/BV1rB4y1F7dW/)
- Side 风格灵感：[Henry Packs](https://www.youtube.com/watch?v=2_VWUkZH06g)
- 感谢所有贡献者和用户的支持

## 📞 联系方式

- 捐助支持：[爱发电](https://afdian.com/a/Keishi/)
- QQ 交流群：[597688340](https://qm.qq.com/q/tsIChSlW24)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐ Star！**

Made with ❤️ by [LonelySail](https://github.com/Lonely-Sails/) & [Keishi](https://space.bilibili.com/23785358/)

</div>
