// 网络请求模块
const corsProxy = 'https://proxy.mccag.cn/?url=';

/**
 * 获取Mojang玩家档案
 * @param {string} player - 玩家名
 * @returns {Promise<Object|null>} 玩家档案信息
 */
export async function fetchMojangProfile(player) {
    try {
        const response = await fetch(`${corsProxy}https://api.mojang.com/users/profiles/minecraft/${player}`);
        if (response.ok) return await response.json();
        return null;
    } catch (error) {
        console.error('获取Mojang档案失败:', error);
        return null;
    }
}

/**
 * 获取皮肤站数据
 * @param {string} website - 皮肤站地址
 * @param {string} player - 玩家名
 * @returns {Promise<Object|null>} 皮肤站数据
 */
export async function fetchSkinWebsiteProfile(website, player) {
    try {
        const response = await fetch(`${corsProxy}${website}csl/${player}.json`);
        if (response.ok) return await response.json();
        return null;
    } catch (error) {
        console.error('获取皮肤站数据失败:', error);
        return null;
    }
}
