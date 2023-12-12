/**
 * @file 百度移动统计配置文件
 */
import config from '@/config/config.js';

module.exports = {
    /**
     * 从百度移动统计获取的AppKey(小程序专用)
     * @type {string}
     */
    appKey: config.baiDuHmWx,

    /**
     * 是否使用了插件
     * @type {boolean}
     */
    hasPlugin: false,

    /**
     * 是否获取当前的地理位置和速度信息
     * @type {boolean}
     */
    getLocation: false,
};
