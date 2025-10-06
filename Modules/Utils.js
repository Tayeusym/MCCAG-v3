// 工具模块


/**
 * 检查输入值并过滤非法字符
 * @param {RegExp} regex - 过滤正则表达式
 * @returns {Function} 事件处理函数
 */
export function checkInputValue(regex) {
    return function (event) {
        const value = event.target.value;
        const filtered = value.replace(regex, '');
        if (filtered !== value) event.target.value = filtered;
    }
}

/**
 * 关闭选择菜单
 */
export function closeSelections(event) {
    const selection = document.querySelector('#language-switch');
    if (event.target == selection) return;
    if (selection.checked) selection.checked = false;
}

/**
 * 处理背景上传
 * @param {Event} event - 文件上传事件
 * @param {Function} updateCanvas - 更新画布的回调函数
 */
export function handleUploader(event) {
    return new Promise((resolve, reject) => {
        const file = event.target.files[0];
        // 验证文件类型
        if (!file.type.match('image.*')) reject('请上传图片文件！');
        // 验证文件大小（2MB = 2 * 1024 * 1024 字节）
        if (file.size > 2 * 1024 * 1024) reject('图片大小不能超过限制的大小！');
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject('读取图片失败！');
        image.src = URL.createObjectURL(file);
    });
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
    tips.animate([
        { transform: `translateX(-${tips.offsetWidth + 40}px)` },
        { transform: 'translateX(0)' }
    ], { duration: 700, easing: 'ease-out'});
    setTimeout(async () => {
        await tips.animate([
            { transform: 'translateX(0)' },
            { transform: `translateX(-${tips.offsetWidth + 40}px)` },
        ], { duration: 700, easing: 'ease-out' }).finished;
        tips.style.transform = 'translateX(-200%)';
        await tips.animate([
            { maxHeight: `${tips.offsetHeight}px` },
            { padding: 0, margin: 0, maxHeight: 0 }
        ], { duration: 700, easing: 'ease-out' }).finished;
        tips.remove();
    }, 8000);
}

export async function popupDialog(title, content) {
    const promise = new Promise((resolve, reject) => {
        const dialogOverlay = document.querySelector('#dialog-overlay');
        const dialog = dialogOverlay.querySelector('#alert-dialog')
        const confirmButton = dialog.querySelector('#alert-confirm');
        const titleElement = dialog.querySelector('.title');
        const contentElement = dialog.querySelector('.alert-text');
        const dontShowCheckbox = dialog.querySelector('#dont-show-again');
        titleElement.textContent = title;
        contentElement.innerHTML = content;
        dialogOverlay.classList.add('show');
        dialog.classList.add('show');
        confirmButton.addEventListener('click', () => {
            dialog.classList.remove('show');
            dialogOverlay.classList.remove('show');
            const dontShow = dontShowCheckbox.checked;
            dontShowCheckbox.checked = false;
            resolve(dontShow);
        }, { once: true });
    });
    return promise;
}
