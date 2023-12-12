/* 小程序分享码回跳 */
import * as utils from '@/utils/utils.js';
import { miniWxApi } from '@/api/ModuleBase.js';
export default {
	onLoad() {
		// #ifdef MP
		const route = utils.pages.getPageRoute()
		if (route && route.options.scene) {
			// 解码(小程序扫了分享出来的二维码后)
			miniWxApi.getWechatScene({ md5: route.options.scene }).then(res => {
				if (res.code) {
					const wxaCodeScene = JSON.parse(res.data);
					// console.log('wxaCodeScene:',wxaCodeScene)
					if (this.sceneCallBack) {
						this.sceneCallBack(wxaCodeScene)
					}
					// 如果二维码上带有invitationCode邀请码参数,则请求接口建立邀请关系
					if (wxaCodeScene.invitationCode) {
						this.postRelationship(wxaCodeScene.invitationCode, wxaCodeScene.productId)
					}
				}
			})
			return
		}
		// #endif
	}
}
