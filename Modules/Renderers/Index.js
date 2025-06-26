import { renderAvatar as renderCuteAvatar } from './Normal';


export function renderAvatar(skinImage, avatarType, options = null) {
    if (avatarType === 'normal') return renderCuteAvatar(skinImage, options);
    // 其他类型的渲染逻辑可以在这里添加
    throw new Error(`不支持的类型：${avatarType}`);
}
