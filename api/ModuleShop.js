import request from '@/utils/request'

// 关于反馈
const feedbackApi = (params) => request.post('/shop/feedback', params)

const shopDetail = {
    favoriteShopFlag: (data) => request.post(`/shop/p/favorite/shop/favoriteShopFlag`, data), // 店铺收藏/取消
    prodCategory: (data) => request.get(`/product/shopCategory/getByShopIdAndStatus`, data), // 店铺商品全部分类

    getshopDetailMsgSendConfig: (id) => request.post('/shop/shop/getshopDetailMsgSendConfig',id),

    shopDetail: (id) => request.get('/shop/shop/detail',id),// 店铺基本信息
    getshopDetailDocuments: (id) => request.get('/shop/shop/getshopDetailDocuments',id),
}

export { feedbackApi, shopDetail }
