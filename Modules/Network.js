// 网络请求模块
const corsProxy = 'https://proxy.mccag.cn/?url=';


export async function request(url, cors = true, max = 3, count = 0) {
    try {
        if (count >= max) throw new Error(`请求失败超过最大重试次数！`);
        const response = await fetch(cors ? url : corsProxy + url);
        if (response.ok) return await response.json();
        console.warn(`网络请求失败（第 ${count} 次尝试）：`, response.status, response.statusText);
    } catch (error) {
        console.error(`网络请求失败（第 ${count} 次尝试）：`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return request(url, max, count + 1);
}

/**
 * 获取Mojang玩家档案
 * @param {string} player - 玩家名
 * @returns {Promise<Object|null>} 玩家档案信息
 */
export async function fetchMojangProfile(player) {
    const response = await request(`https://api.mojang.com/users/profiles/minecraft/${player}`);
    if (response.ok) return await response.json();
}

/**
 * 获取皮肤站数据
 * @param {string} website - 皮肤站地址
 * @param {string} player - 玩家名
 * @returns {Promise<Object|null>} 皮肤站数据
 */
export async function fetchSkinWebsiteProfile(website, player) {
    const response = await request(`${website}/csl/${player}.json`);
    if (response.ok) return await response.json();
}
