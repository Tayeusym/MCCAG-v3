// 渲染模块
import { processImage } from './Utils.js';
import { operationData } from './Data.js';

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
function operate(mainContext, skinCanvas, cropBox, mirror, scaleFactor, pastePosition) {
    const [pasteX, pasteY] = pastePosition;
    const [cropX, cropY, cropWidth, cropHeight] = cropBox;

    // 处理图片
    const canvas = processImage(
        skinCanvas, cropX, cropY, cropWidth, cropHeight,
        cropWidth * scaleFactor, cropHeight * scaleFactor, mirror || false
    );

    // 将裁剪的图像粘贴到带边框的画布中（15像素内边距）
    // 在主上下文中绘制带边框的图像（调整粘贴位置）
    mainContext.drawImage(canvas, pasteX, pasteY);
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
    context.shadowColor = 'rgba(0, 0, 0, 0.2)';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;

    // 清空画布
    context.clearRect(0, 0, 1000, 1000);

    // 确定皮肤尺寸
    const skinSize = [skinImage.width, skinImage.height];

    // 调整皮肤图像尺寸
    const resizedSize = (skinSize[0] === 64 && skinSize[1] === 32) ? [128, 64] : [128, 128];
    // 修正缩放参数顺序，使其与Python一致：将原图缩放到目标尺寸
    skinImage = processImage(skinImage, 0, 0, ...skinSize, ...resizedSize);

    // 获取操作列表
    const operations = getOperations(avatarType, skinSize);

    // 执行渲染操作
    for (const operation of operations) operate(context, skinImage, ...operation);

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