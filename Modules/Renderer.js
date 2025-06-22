// 渲染模块
const operationData = {
    'head': [
        [[16, 16, 16, 16], 37.5, [200, 200]],
        [[80, 16, 16, 16], 41, [175, 175]]
    ],
    'full': {
        '1.7': [
            [[8, 40, 8, 24], 8.375, [434, 751]],
            [[8, 40, 8, 24], 8.375, [505, 751], true],
            [[86, 40, 6, 24], 8.167, [388, 561]],
            [[86, 40, 6, 24], 8.167, [566, 561], true],
            [[40, 40, 16, 24], 8.0625, [437, 561]],
            [[16, 16, 16, 16], 26.875, [287, 131]],
            [[80, 16, 16, 16], 30.8125, [254, 107]]
        ],
        '1.8': [
            [[8, 40, 8, 24], 8.375, [434, 751]],
            [[8, 72, 8, 24], 9.375, [428, 737]],
            [[40, 104, 8, 24], 8.375, [505, 751]],
            [[8, 104, 8, 24], 9.375, [503, 737]],
            [[86, 40, 6, 24], 8.167, [388, 561]],
            [[88, 72, 6, 24], 9.5, [382, 538]],
            [[74, 104, 6, 24], 8.167, [566, 561]],
            [[104, 104, 6, 24], 9.5, [564, 538]],
            [[40, 40, 16, 24], 8.0625, [437, 561]],
            [[40, 72, 16, 24], 8.6575, [432, 555]],
            [[16, 16, 16, 16], 26.875, [287, 131]],
            [[80, 16, 16, 16], 30.8125, [254, 107]]
        ]
    }
};

/**
 * 根据头像类型和皮肤尺寸获取操作列表
 * @param {string} avatarType - 头像类型
 * @param {Array} skinSize - 皮肤尺寸 [width, height]
 * @returns {Array} 操作列表
 */
function getOperations(avatarType, skinSize) {
    if (!operationData) return [];

    if (avatarType === 'head') return operationData.head;
    if (avatarType === 'big_head') avatarType = 'full';

    const skinVersion = (skinSize[0] === 64 && skinSize[1] === 32) ? '1.7' : '1.8';
    return operationData[avatarType][skinVersion];
}


/**
 * 处理图像部分（裁剪、缩放、镜像、阴影）
 * @param {CanvasRenderingContext2D} mainContext - 主画布上下文
 * @param {HTMLCanvasElement} skinCanvas - 皮肤图像画布
 * @param {Array} cropBox - 裁剪框 [x, y, width, height]
 * @param {number} scaleFactor - 缩放因子
 * @param {Array} pastePosition - 粘贴位置 [x, y]
 * @param {boolean} mirror - 是否镜像
 */
function processImagePart(mainContext, skinCanvas, cropBox, scaleFactor, pastePosition, mirror) {
    const [pasteX, pasteY] = pastePosition;
    const [cropX, cropY, cropWidth, cropHeight] = cropBox;

    // 缩放裁剪的部分
    const scaledWidth = cropWidth * scaleFactor;
    const scaledHeight = cropHeight * scaleFactor;

    // 创建带边框的画布（与Python版本保持一致）
    const borderedWidth = scaledWidth + 30;
    const borderedHeight = scaledHeight + 30;
    const borderedCanvas = document.createElement('canvas');
    borderedCanvas.width = borderedWidth;
    borderedCanvas.height = borderedHeight;
    const borderedContext = borderedCanvas.getContext('2d');
    borderedContext.imageSmoothingEnabled = false;

    // 创建一个临时画布用于裁剪和可选的镜像
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = scaledWidth;
    cropCanvas.height = scaledHeight;
    const cropContext = cropCanvas.getContext('2d');
    cropContext.imageSmoothingEnabled = false;

    if (mirror) {
        cropContext.translate(scaledWidth, 0);
        cropContext.scale(-1, 1);
    }

    cropContext.drawImage(
        skinCanvas,
        cropX, cropY, cropWidth, cropHeight, 0, 0, scaledWidth, scaledHeight
    );

    // 将裁剪的图像粘贴到带边框的画布中（15像素内边距）
    borderedContext.drawImage(cropCanvas, 15, 15);

    // 在主上下文中绘制带边框的图像（调整粘贴位置）
    const adjustedPasteX = pasteX - 15;
    const adjustedPasteY = pasteY - 15;
    mainContext.drawImage(borderedCanvas, adjustedPasteX, adjustedPasteY);
}

/**
 * 渲染头像
 * @param {HTMLImageElement} skinImage - 皮肤图像
 * @param {string} avatarType - 头像类型 ('head', 'full', 'big_head')
 * @returns {HTMLCanvasElement} 渲染后的画布
 */
export function renderAvatar(skinImage, avatarType) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const context = canvas.getContext('2d');
    context.shadowColor = 'rgba(75, 85, 142, 0.5)';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 8;
    context.shadowBlur = 15;

    // 清空画布
    context.clearRect(0, 0, 1000, 1000);

    // 确定皮肤尺寸
    const skinSize = [skinImage.width, skinImage.height];

    // 调整皮肤图像尺寸
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');
    if (skinSize[0] === 64 && skinSize[1] === 32) {
        resizedCanvas.width = 128;
        resizedCanvas.height = 64;
    } else {
        resizedCanvas.width = 128;
        resizedCanvas.height = 128;
    }
    resizedContext.imageSmoothingEnabled = false;
    // 修正缩放参数顺序，使其与Python一致：将原图缩放到目标尺寸
    resizedContext.drawImage(skinImage, 0, 0, skinSize[0], skinSize[1], 0, 0, resizedCanvas.width, resizedCanvas.height);

    // 获取操作列表
    const operations = getOperations(avatarType, skinSize);

    // 执行渲染操作
    for (const operation of operations) processImagePart(context, resizedCanvas, ...operation);

    // 如果是big_head类型，进行特殊处理
    if (avatarType === 'big_head') {
        const bigHeadCanvas = document.createElement('canvas');
        const bigHeadContext = bigHeadCanvas.getContext('2d');
        bigHeadCanvas.width = 1400;
        bigHeadCanvas.height = 1400;

        // 放大图像
        bigHeadContext.imageSmoothingEnabled = false;
        bigHeadContext.drawImage(canvas, 0, 0, 1400, 1400);

        // 裁剪到1000x1000
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        finalCanvas.width = 1000;
        finalCanvas.height = 1000;
        finalCtx.drawImage(bigHeadCanvas, 200, 0, 1000, 1000, 0, 0, 1000, 1000);

        return finalCanvas;
    }

    return canvas;
}