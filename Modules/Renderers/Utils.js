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