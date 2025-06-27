import { renderAvatar as renderVintageAvater } from './Vintage.js';
import { renderAvatar as renderMinimalAvater } from './Minimal.js';
import { renderAvatar as renderSideAvater } from './Side.js';


export function renderAvatar(skinImage, avatarType, options = null) {
    if (avatarType === 'minimal') return renderMinimalAvater(skinImage, options);
    else if (avatarType === 'vintage') return renderVintageAvater(skinImage);
    else if (avatarType === 'side') return renderSideAvater(skinImage);
    // 其他类型的渲染逻辑可以在这里添加
    throw new Error(`不支持的类型：${avatarType}`);
}
