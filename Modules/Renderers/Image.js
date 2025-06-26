export function processImage(
    image, cropX, cropY, cropWidth, cropHeight,
    scaledWidth = null, scaledHeight = null, mirror = false, smoothing = false
) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!scaledWidth) scaledWidth = cropWidth;
    if (!scaledHeight) scaledHeight = cropHeight;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    context.imageSmoothingEnabled = smoothing;
    if (mirror) {
        context.translate(scaledWidth, 0);
        context.scale(-1, 1);
    }
    context.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, scaledWidth, scaledHeight);
    return canvas;
}

export function preprecessSkinImage(image) {
    const skinSize = [image.width, image.height];
    // 调整皮肤图像尺寸
    const resizedSize = (skinSize[0] === 64 && skinSize[1] === 32) ? [128, 64] : [128, 128];
    // 修正缩放参数顺序，使其与Python一致：将原图缩放到目标尺寸
    return processImage(image, 0, 0, ...skinSize, ...resizedSize);
}