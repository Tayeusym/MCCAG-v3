// 工具模块

/**
 * 显示提示信息
 * @param {string} text - 提示文本
 * @param {string} type - 提示类型 ('success', 'error', 'warning')
 */
export function popupTips(text, type) {
    const tipsContainer = document.querySelector('.notification-list');
    const tips = document.createElement('li');
    const tipsText = document.createElement('p');
    tips.className = type;
    tipsText.textContent = text;
    tips.appendChild(tipsText);
    tipsContainer.appendChild(tips);
    tips.style.transform = `translateX(-${tips.offsetWidth + 40}px)`;
    setTimeout(() => tips.style.transform = 'translateX(0px)', 100)
    setTimeout(() => {
        tips.style.transform = `translateX(-${tips.offsetWidth + 40}px)`;
        setTimeout(() => {
            tips.style.height = '0';
            setTimeout(() => tipsContainer.removeChild(tips), 1000);
        }, 1000);
    }, 8000);
}

/**
 * 检查输入值并过滤非法字符
 * @param {RegExp} regex - 过滤正则表达式
 * @returns {Function} 事件处理函数
 */
export function checkInputValue(regex) {
    return function (event) {
        const value = event.target.value;
        const filtered = value.replace(regex, '');
        if (filtered !== value) {
            event.target.value = filtered;
        }
    }
}

/**
 * 关闭选择菜单
 */
export function closeSelections() {
    const selections = document.querySelectorAll('input:checked[type=checkbox]');
    for (const selection of selections) {
        if (selection.getAttribute('status') == '1') {
            selection.checked = false;
            selection.setAttribute('status', '0');
        } else selection.setAttribute('status', '1');
    }
}

/**
 * 处理背景上传
 * @param {Event} event - 文件上传事件
 * @param {Function} updateCanvas - 更新画布的回调函数
 * @param {Function} setCustomBackground - 设置自定义背景的回调函数
 */
export function handleBackgroundUpload(event, updateCanvas, setCustomBackground) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    
    // 验证文件类型
    if (!file.type.match('image.*')) {
        popupTips('请上传图片文件！', 'error');
        return;
    }
    
    // 验证文件大小（2MB = 2 * 1024 * 1024 字节）
    if (file.size > 2 * 1024 * 1024) {
        popupTips('图片大小不能超过2MB！', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            setCustomBackground(img);
            updateCanvas();
            popupTips('背景图片上传成功！', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * 创建背景上传器
 * @param {Function} handleUpload - 处理上传的函数
 * @returns {HTMLInputElement} 文件输入元素
 */
export function createBackgroundUploader(handleUpload) {
    const bgFileInput = document.createElement('input');
    bgFileInput.type = 'file';
    bgFileInput.accept = 'image/*';
    bgFileInput.style.display = 'none';
    bgFileInput.id = 'background-upload';
    document.body.appendChild(bgFileInput);
    
    // 监听文件选择
    bgFileInput.addEventListener('change', handleUpload);
    
    return bgFileInput;
}

/**
 * 下载带背景的图片
 * @param {HTMLCanvasElement} canvas - 画布元素
 */
export function downloadWithBackground(canvas) {
    const link = document.createElement('a');
    link.download = 'Avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    link.remove();
}

/**
 * 下载透明背景的图片
 * @param {HTMLImageElement} avatarImage - 头像图像
 */
export function downloadTransparent(avatarImage) {
    // 创建临时画布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1000;
    tempCanvas.height = 1000;
    const tempContext = tempCanvas.getContext('2d');
    
    // 只绘制头像（不包含背景）
    tempContext.drawImage(avatarImage, 0, 0, 1000, 1000);
    
    // 下载透明背景的图片
    const link = document.createElement('a');
    link.download = 'Avatar_Transparent.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    link.remove();
    
    // 删除临时画布
    tempCanvas.remove();
} 