// 主应用模块

import { 
    fetchMojangProfile, 
    fetchSkinWebsiteProfile, 
} from './Network.js';

import { 
    popupTips, 
    checkInputValue, 
    closeSelections, 
    handleBackgroundUpload, 
    createBackgroundUploader, 
    downloadWithBackground, 
    downloadTransparent 
} from './Utils.js';

import { initI18n } from './I18n.js';
import { renderAvatar } from './Renderers/Index.js';


// 应用状态
class AppState {
    constructor() {
        this.customBackground = null;
        this.currentBackgroundIndex = 0;
        this.currentMethod = 'mojang';
        this.currentAvatarImage = new Image();
        this.currentAvatarImage.src = 'Resources/Avatars/Minimal.png';

        this.avatarType = 'minimal';
        
        // DOM元素
        this.content = document.querySelector('.generator-content');
        this.uploadInput = document.querySelector('.tab-panel-upload .file-upload-input');
        this.current = this.content.querySelector('div#active-content');
        this.currentCanvas = this.current.querySelector('canvas');

        
        // 背景预设
        this.backgrounds = [
            '#ffcccb', '#add8e6', '#ffffff',
            'linear-gradient(135deg, #ffcccb 0%, #ffeb3b 100%)',
            'linear-gradient(135deg, #f1eef9 0%, #f5ccf6 100%)',
            'linear-gradient(135deg, #d4fc78 0%, #99e5a2 100%)',
            'linear-gradient(135deg, #41d8dd 0%, #5583ee 100%)',
            'linear-gradient(135deg, #323b42 0%, #121317 100%)'
        ];
    }
    
    setCustomBackground(img) {
        this.customBackground = img;
    }
    
    getCurrentBackground() {
        return this.backgrounds[this.currentBackgroundIndex];
    }
    
    nextBackground() {
        if (this.customBackground) {
            this.customBackground = null;
            this.currentBackgroundIndex = 0;
        } else {
            this.currentBackgroundIndex += 1;
            if (this.currentBackgroundIndex >= this.backgrounds.length) {
                this.currentBackgroundIndex = 0;
            }
        }
    }
}

// 应用类
class AvatarGeneratorApp {
    constructor() {
        this.state = new AppState();
        this.backgroundUploader = null;
    }
    
    /**
     * 初始化应用
     */
    async init() {
        try {
            // 加载操作数据
            // 初始化国际化
            // initI18n();
            // 初始化事件监听
            this.initEventListeners();
            // 初始化背景上传器
            this.initBackgroundUploader();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            popupTips('应用初始化失败！', 'error');
        }
    }
    
    /**
     * 初始化事件监听
     */
    initEventListeners() {
        // 全局点击事件
        window.addEventListener('click', closeSelections);
        
        // 头像图像加载事件
        this.state.currentAvatarImage.addEventListener('load', () => this.updateCanvas());
        
        // 文件上传事件
        this.state.uploadInput.addEventListener('change', () => {
            if (this.state.uploadInput.files && this.state.uploadInput.files[0]) popupTips('成功选择皮肤文件！', 'success');
            else popupTips('未选择任何文件！', 'warning');
        });
        
        // 头像类型选择事件（仅Minimal）
        document.querySelectorAll('input[name=minimal-mode]').forEach(radio => {
            radio.addEventListener('change', event => {
                if (this.state.currentMethod == 'upload') this.generateUpload(event);
                else this.generate(event);
            });
        });
        
        // 下载事件
        document.querySelectorAll('button[download-type]').forEach(item =>
            item.addEventListener('click', event => this.handleDownload(event))
        );
        
        // 标签页切换事件
        document.querySelectorAll('input[name=tabs]').forEach((tab, index) =>
            tab.addEventListener('change', this.switchPanel(index))
        );

        // 头像类型切换事件
        document.querySelectorAll('input[name=model-type]').forEach(button =>
            button.addEventListener('click', event => this.switchAvatarType(event))
        );
        
        // 背景切换事件
        document.querySelectorAll('button.change-background').forEach(button =>
            button.addEventListener('click', () => this.changeBackground())
        );
        
        // 输入验证事件
        document.querySelectorAll('input.text-input').forEach(input =>
            input.addEventListener('input', checkInputValue(/[^a-zA-Z0-9-_.]/g))
        );

        document.querySelectorAll('label.generate').forEach(button => 
            button.addEventListener('click', event => {
                if (this.state.avatarType === 'minimal') return;
                event.preventDefault();
                if (this.state.currentMethod == 'upload') this.generateUpload(event);
                else this.generate(event);
            })
        );

        // 拖动条进度条效果
        this.initRangeSliders();

        // 编辑按钮事件
        document.querySelectorAll('.edit-generate, .edit-background').forEach(button => {
            button.addEventListener('click', (event) => {
                this.showEditDialog(event);
            });
        });

        // 色块选择交互
        document.querySelectorAll('.color-list').forEach(list => {
            list.querySelectorAll('.color-item').forEach(item => {
                item.addEventListener('click', () => {
                    list.querySelectorAll('.color-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                });
            });
        });
    }
    
    /**
     * 初始化背景上传器
     */
    initBackgroundUploader() {
        this.backgroundUploader = createBackgroundUploader(event =>
            handleBackgroundUpload(event, () => this.updateCanvas(), (img) => this.state.setCustomBackground(img))
        );
        
        // 点击上传背景按钮时触发文件选择
        document.querySelectorAll('.upload').forEach(button =>
            button.addEventListener('click', () => this.backgroundUploader.click())
        );
    }

    switchAvatarType(event) {
        const avatarType = event.target.id;
        if (this.state.avatarType === avatarType) return;
        const avatarTypeName = avatarType.charAt(0).toUpperCase() + avatarType.slice(1);
        this.state.avatarType = avatarType;
        this.state.currentAvatarImage.src = `Resources/Avatars/${avatarTypeName}.png`;
        this.updateCanvas();
        popupTips(`已切换到 ${avatarTypeName} 头像类型！`, 'success');
    }
    
    /**
     * 切换内容面板
     */
    switchPanel(index) {
        const transform = index * 400;
        return event => {
            this.state.current.id = '';
            const panelId = event.target.id;
            this.state.currentMethod = panelId;
            this.state.current = this.state.content.querySelector(`.tab-panel-${panelId}`);
            this.state.currentCanvas = this.state.current.querySelector('canvas');
            this.state.current.id = 'active-content';
            this.state.content.style.transform = `translateX(-${transform}px)`;
            this.updateCanvas();
        };
    }
    
    /**
     * 更新画布
     */
    updateCanvas() {
        const context = this.state.currentCanvas.getContext('2d');
        
        // 清空画布
        context.clearRect(0, 0, 1000, 1000);
        
        // 绘制背景
        if (this.state.customBackground) {
            // 如果有自定义背景，绘制自定义背景
            const imageRatio = this.state.customBackground.width / this.state.customBackground.height;
            const canvasRatio = this.state.currentCanvas.width / this.state.currentCanvas.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imageRatio > canvasRatio) {
                drawHeight = this.state.currentCanvas.height;
                drawWidth = this.state.customBackground.width * (drawHeight / this.state.customBackground.height);
                offsetX = (this.state.currentCanvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = this.state.currentCanvas.width;
                drawHeight = this.state.customBackground.height * (drawWidth / this.state.customBackground.width);
                offsetX = 0;
                offsetY = (this.state.currentCanvas.height - drawHeight) / 2;
            }
            
            context.drawImage(this.state.customBackground, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            // 否则绘制预设背景
            const background = this.state.getCurrentBackground();
            if (background.startsWith('linear-gradient')) {
                const colors = background.match(/#\w{6}/g);
                const gradient = context.createLinearGradient(0, 0, 1000, 1000);
                gradient.addColorStop(0, colors[0]);
                gradient.addColorStop(1, colors[1]);
                context.fillStyle = gradient;
            } else context.fillStyle = background;
            context.fillRect(0, 0, 1000, 1000);
        }
        
        // 绘制头像
        context.drawImage(this.state.currentAvatarImage, 0, 0, 1000, 1000);
    }
    
    /**
     * 生成头像（Mojang/皮肤站）
     */
    async generate(event) {
        // 获取选中的生成模式（仅Minimal需要）
        let avatarOption = 'head'; // 默认值
        if (this.state.avatarType === 'minimal') {
            const selectedRadio = document.querySelector('input[name="minimal-mode"]:checked');
            if (selectedRadio) {
                avatarOption = selectedRadio.value;
            }
        }
        
        const input = this.state.current.querySelector('input.player-name');
        
        if (!input.value) return popupTips('请输入用户名！', 'warning');
        if (this.state.currentMethod === 'website' && !this.state.skinWebsiteInput.value)
            return popupTips('请输入皮肤站地址！', 'warning');
        
        const mask = this.state.current.querySelector('.loading-overlay');
        mask.style.opacity = 1;
        
        try {
            let skinUrl = null;
            if (this.state.currentMethod === 'website') {
                // 皮肤站模式
                const website = 'https://' + this.state.skinWebsiteInput.value;
                const skinData = await fetchSkinWebsiteProfile(website, input.value);
                if (!skinData || !skinData.skins) throw new Error('未找到该玩家的皮肤数据！');
                const texturePath = Object.values(skinData.skins)[0];
                skinUrl = `${website}/textures/${texturePath}`;
            } else {
                // Mojang模式
                const profile = await fetchMojangProfile(input.value);
                console.log(profile);
                if (!profile) throw new Error('未找到该玩家的信息！');
                skinUrl = `https://crafatar.com/skins/${profile.id}`;
            }
            
            // 加载皮肤图像
            const skinImage = new Image();
            skinImage.crossOrigin = 'anonymous';
            skinImage.onload = () => {
                // 渲染头像
                const renderedCanvas = renderAvatar(skinImage, this.state.avatarType, avatarOption);
                
                // 更新当前头像
                this.state.currentAvatarImage.src = renderedCanvas.toDataURL('image/png');
                
                mask.style.opacity = 0;
                popupTips('生成头像成功！', 'success');
            };
            
            skinImage.onerror = () => {
                mask.style.opacity = 0;
                popupTips('加载皮肤图像失败！', 'error');
            };
            
            skinImage.src = skinUrl;
            
        } catch (error) {
            console.error('生成头像失败：', error);
            mask.style.opacity = 0;
            popupTips(`生成头像失败，${error.message}`, 'error');
        }
    }
    
    /**
     * 生成头像（文件上传）
     */
    async generateUpload(event) {
        if (!this.state.uploadInput.files || !this.state.uploadInput.files[0]) {
            return popupTips('请先上传皮肤！', 'warning');
        }
        
        // 获取选中的生成模式（仅Minimal需要）
        let avatarOption = 'head'; // 默认值
        if (this.state.avatarType === 'minimal') {
            const selectedRadio = document.querySelector('input[name="minimal-mode"]:checked');
            if (selectedRadio) {
                avatarOption = selectedRadio.value;
            }
        }
        
        const mask = this.state.current.querySelector('.loading-overlay');
        mask.style.opacity = 1;
        
        try {
            const file = this.state.uploadInput.files[0];
            const skinImage = new Image();
            
            skinImage.onload = () => {
                // 渲染头像
                const renderedCanvas = renderAvatar(skinImage, this.state.avatarType, avatarOption);
                
                // 更新当前头像
                this.state.currentAvatarImage.src = renderedCanvas.toDataURL('image/png');
                
                mask.style.opacity = 0;
                popupTips('生成头像成功！', 'success');
            };
            
            skinImage.onerror = () => {
                mask.style.opacity = 0;
                popupTips('加载皮肤图像失败！', 'error');
            };
            
            skinImage.src = URL.createObjectURL(file);
            
        } catch (error) {
            mask.style.opacity = 0;
            console.error('生成头像失败:', error);
            popupTips('生成头像失败！', 'error');
        }
    }
    
    /**
     * 处理下载
     */
    handleDownload(event) {
        const downloadType = event.target.getAttribute('download-type');
        if (downloadType === 'background') downloadWithBackground(this.state.currentCanvas);
        else if (downloadType === 'transparent') downloadTransparent(this.state.currentAvatarImage);
    }
    
    /**
     * 切换背景
     */
    changeBackground() {
        this.state.nextBackground();
        this.updateCanvas();
    }

    /**
     * 初始化拖动条进度条效果
     */
    initRangeSliders() {
        const rangeInputs = document.querySelectorAll('.range-slider');
        
        rangeInputs.forEach(input => {
            // 初始化进度条
            this.updateRangeProgress(input);
            
            // 监听输入事件
            input.addEventListener('input', () => {
                this.updateRangeProgress(input);
            });
            
            // 监听鼠标事件
            input.addEventListener('mousedown', () => {
                this.updateRangeProgress(input);
            });
            
            input.addEventListener('mousemove', () => {
                if (input.matches(':active')) {
                    this.updateRangeProgress(input);
                }
            });
        });
    }

    /**
     * 更新拖动条进度条
     */
    updateRangeProgress(input) {
        const value = (input.value - input.min) / (input.max - input.min) * 100;
        const progressColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
        const trackColor = '#e0e4f6';
        
        // 更新CSS变量
        input.style.setProperty('--range-progress', `${value}%`);
        
        // 更新Webkit浏览器的进度条
        input.style.background = `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${value}%, ${trackColor} ${value}%, ${trackColor} 100%)`;
    }

    /**
     * 显示编辑对话框
     */
    showEditDialog(event) {
        const button = event.target;
        const isGenerate = button.classList.contains('edit-generate');
        const avatarType = this.state.avatarType;
        
        // 构建对话框ID
        const dialogId = `dialog-${avatarType}-${isGenerate ? 'generate' : 'background'}`;
        const dialog = document.getElementById(dialogId);
        
        if (dialog) {
            // 显示遮罩层和对话框
            const overlay = document.getElementById('edit-dialog-overlay');
            const editDialog = document.getElementById('edit-dialog');
            
            // 先显示元素，然后添加动画类
            overlay.style.display = 'block';
            editDialog.style.display = 'block';
            
            // 强制重绘，然后添加动画类
            requestAnimationFrame(() => {
                overlay.classList.add('show');
                editDialog.classList.add('show');
            });
            
            // 隐藏所有对话框内容
            overlay.querySelectorAll('.dialog-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // 显示对应的对话框内容
            dialog.style.display = 'block';
            
            // 初始化对话框中的拖动条
            this.initRangeSliders();
            
            // 添加关闭对话框的事件
            const closeDialog = (event) => {
                // 只有点击遮罩层才关闭
                if (event.target === overlay) {
                    this.hideEditDialog();
                }
            };
            
            // 添加点击遮罩层关闭的事件
            overlay.addEventListener('click', closeDialog);
            
            // 阻止事件冒泡
            event.stopPropagation();
        }
    }

    /**
     * 隐藏编辑对话框
     */
    hideEditDialog() {
        const overlay = document.getElementById('edit-dialog-overlay');
        const editDialog = document.getElementById('edit-dialog');
        
        // 移除动画类
        overlay.classList.remove('show');
        editDialog.classList.remove('show');
        
        // 等待动画完成后隐藏元素
        setTimeout(() => {
            overlay.style.display = 'none';
            editDialog.style.display = 'none';
        }, 300);
    }
}

// 导出应用类
export default AvatarGeneratorApp;