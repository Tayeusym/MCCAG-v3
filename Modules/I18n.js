// 国际化模块

import { request } from './Network.js';
import { translations } from './Const.js';


// 语言支持相关
let currentLang = localStorage.getItem('language');

/**
 * 应用翻译
 * @param {string} lang - 语言代码
 */
export function applyTranslation(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
    
    // 更新页面标题
    const titleElement = document.querySelector('title[i18n]');
    if (titleElement) titleElement.textContent = translations[titleElement.getAttribute('i18n')][lang];
    
    // 更新文本内容
    document.querySelectorAll('[i18n]').forEach(element => {
        const key = element.getAttribute('i18n');
        if (translations[key][lang]) element.textContent = translations[key][lang];
    });
    
    // 更新alt属性
    document.querySelectorAll('[i18n-alt]').forEach(element => {
        const key = element.getAttribute('i18n-alt');
        if (translations[key][lang]) element.setAttribute('alt', translations[key][lang]);
    });
    
    // 更新placeholder属性
    document.querySelectorAll('[i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('i18n-placeholder');
        if (translations[key][lang]) element.setAttribute('placeholder', translations[key][lang]);
    });
}

/**
 * 初始化语言切换事件
 */
export function initLanguageEvents() {
    document.querySelectorAll('.language-selector-item[data-lang]').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const lang = this.getAttribute('data-lang');
            localStorage.setItem('language', lang);
            applyTranslation(lang);
            document.getElementById('language-switch').checked = false;
        });
    });
}

/**
 * 初始化语言支持
 */
export async function initI18n() {
    // 请求ip归属地，设置语言
    initLanguageEvents();
    if (currentLang) {
        applyTranslation(currentLang);
        return;
    }
    try {
        const data = await request('https://ipapi.co/json/', false);
        currentLang = data?.languages?.split('-')[0];
        document.documentElement.lang = currentLang === 'jp' ? 'ja' : currentLang;
        if (currentLang) localStorage.setItem('language', currentLang);
        else currentLang = 'zh';
        applyTranslation(currentLang);
    } catch (error) {
        console.error('获取IP归属地失败，使用默认语言：zh', error);
    }
} 