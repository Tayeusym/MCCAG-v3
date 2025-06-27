import { renderAvatar as renderCuteAvater } from './Cute.js';
import { renderAvatar as renderNormalAvater } from './Normal.js';
import { renderAvatar as renderStereoscopicAvater } from './Stereoscopic.js';


export function renderAvatar(skinImage, avatarType, options = null) {
    if (avatarType === 'normal') return renderNormalAvater(skinImage, options);
    else if (avatarType === 'cute') return renderCuteAvater(skinImage);
    else if (avatarType === 'stereoscopic') return renderStereoscopicAvater(skinImage);
    // 其他类型的渲染逻辑可以在这里添加
    throw new Error(`不支持的类型：${avatarType}`);
}
