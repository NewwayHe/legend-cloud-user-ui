<!-- 账号设置 -->
<template>
	<view class="w750" :style="{ '--themescolor': themes.color }">
		<ls-header showHeadSelect title="个人信息"></ls-header>
		<!-- 下面这个position-relative是为了将<avatar>组件移出屏幕外用的 -->
		<view class="overflow-h position-relative font-32 mt-2">
			<ls-cell-group className="account-cell">
				<ls-cell-item
					title="头像"
					padding="20rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					@click="upload"
					v-if="userInfo.id"
				>
					<view class="flex-end">
						<ls-image
							mode="aspectFill"
							:src="userInfo.portraitPic"
							:options="{ w: '120', h: '120', br: '50%' }"
							:key="userInfo.portraitPic + 1"
						/>
					</view>
				</ls-cell-item>

				<ls-cell-item
					title="用户名"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					:arrow="false"
				>
					<view class="flex-end pl-2">
						<text class="line-clamp1 pr-3">{{ userInfo.userName ? userInfo.userName : "暂无用户名" }}</text>
					</view>
				</ls-cell-item>

				<ls-cell-item
					title="昵称"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="goEdit('nickname', userInfo.nickName, '修改昵称')"
				>
					<view class="flex-end pl-2">
						<text class="line-clamp1">{{ userInfo.nickName ? userInfo.nickName : "暂无昵称" }}</text>
					</view>
				</ls-cell-item>

				<ls-cell-item
					title="手机号"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="goEdit('phone', userInfo.mobile, '修改手机号')"
				>
					<view class="flex-end pl-2">
						<text class="line-clamp1">{{ userInfo.mobile ? userInfo.mobile : "暂无设置手机号" }}</text>
					</view>
				</ls-cell-item>

				<ls-cell-item
					title="性别"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					v-if="userInfo.id"
				>
					<picker @change="Confirm" :value="userInfo.sex == 'F' ? 1 : 0" :range="columns">
						<view class="flex-end">
							<text>{{ userInfo.sex == "M" ? "男" : userInfo.sex == "F" ? "女" : "暂无设置" }}</text>
						</view>
					</picker>
				</ls-cell-item>

				<ls-cell-item
					title="邮箱"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="goEdit('email', userInfo.email, '修改邮箱')"
				>
					<view class="flex-end pl-2">
						<text class="line-clamp1">{{ userInfo.email ? userInfo.email : "暂无设置邮箱" }}</text>
					</view>
				</ls-cell-item>
			</ls-cell-group>

			<ls-cell-group className="mt-2 account-cell">
				<ls-cell-item
					title="登录密码"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="goEdit('loginpwd', userInfo.mobile, '修改密码')"
				/>
				<ls-cell-item
					title="支付密码"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="goEdit('paypwd', userInfo.mobile, '修改支付密码')"
				/>
			</ls-cell-group>

			<ls-cell-group className="mt-2 account-cell">
				<ls-cell-item
					title="收货地址"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="$navigateTo(`/ModuleCommon/address/addressList`)"
				>
					<view class="flex-end pl-2" v-if="!$u.test.isEmpty(userInfo.defaultAddress)">
						<text class="line-clamp1">{{ userInfo.defaultAddress.fullAddress || "" + userInfo.defaultAddress.detailAddress || "" }}</text>
					</view>
				</ls-cell-item>
				<ls-cell-item
					title="发票抬头"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="$navigateTo(`/ModuleCenter/invoice/invoice?state=2`)"
				/>
			</ls-cell-group>

			<ls-cell-group className="mt-2 account-cell">
				<ls-cell-item
					title="隐私设置"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="$navigateTo(`/ModulesUser/account/privacySet`)"
				/>
				<ls-cell-item
					title="清空缓存"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="clearStorageSync"
				/>
				<ls-cell-item
					title="账号注销"
					padding="24rpx"
					:title-style="{ color: '#333', 'line-height': '40rpx' }"
					:value-style="{ color: '#999', 'font-size': '28rpx', 'line-height': '40rpx' }"
					@click="offPopVisible = true"
					v-if="userInfo.id"
				/>
			</ls-cell-group>
			<view class="bg-white mt-2 flex-center font-28 text-333" style="height: 96rpx" @click="logout" v-if="userInfo.id">退出登录</view>

			<view class="mt-12 mb-4">
				<view class="text-ccc font-24 w-100 text-center px-2">
					<view>Copyright&nbsp;©{{ newYear }}&nbsp;{{ version ? version : "" }}&nbsp;</view>
					<view>{{ systemConfig && systemConfig.companyName ? systemConfig.companyName + "版权所有" : "" }}</view>
				</view>
			</view>

			<!-- 头像剪裁 -->
			<avatar
				class="position-absolute"
				style="right: 200%"
				@upload="doUpload"
				quality="1"
				ref="avatar"
				selWidth="250rpx"
				selHeight="250rpx"
			></avatar>
		</view>

		<!-- 注销 -->
		<u-popup v-model="offPopVisible" mode="center" width="70%" :border-radius="8" @touchmove.stop.prevent>
			<scroll-view scroll-y="true" scroll-with-animation style="max-height: 60vh">
				<view class="p-2 pb-0">
					<view style="text-indent: 2em">亲爱的用户，您好！ 若您经过慎重考虑后仍执意决定注销平台账号的，请明确以下情况：</view>
					<u-line color="transparent" />
					<view>1、账号一旦注销，您将无法再以此账号登录/使用/继续使用我们的相关产品与服务</view>
					<u-line color="transparent" />
					<view
						>2、账号一旦注销，您曾通过该账号登录、使用的产品与服务下的所有内容、信息、数据、记录将会被删除或匿名化处理，您也无法再检索、访问、获取、继续使用和找回，也无权要求我们找回（但法律法规另有规定或监管部门另有要求的除外）。</view
					>
					<u-line color="transparent" />
					<view
						>3、申请账号注销的行为即表明您同意放弃该账号在我们产品与服务使用期间已产生的但未消耗完毕的权益及未来的预期利益。即账号一旦注销，我们将会对该账号下的全部权益做清除处理。</view
					>
					<u-line color="transparent" />
					<view
						>4、账号一旦注销，您与我们曾签署过的相关用户协议、其他权利义务性文件等相应终止（但我们与您之间已约定继续生效的或法律法规另有规定的除外）</view
					>
					<u-line color="transparent" :hair-line="false" />
					<view style="text-indent: 2em"
						>目前账号注销的方式为： 拨打电话联系我们客服中心，人工协助您注销您的账户，我们确认后将在10个工作日内完成注销处理。</view
					>
				</view>
			</scroll-view>
			<view class="w-100 flex-center">
				<ls-button
					className="but-main h-50r m-2"
					type="warn"
					:text="'我知道了'"
					@click="offPopVisible = false"
					:options="{ br: '50' }"
					style="margin-bottom: 10rpx"
				/>
			</view>
		</u-popup>
	</view>
</template>

<script>
import avatar from "@/components/common/avatar/avatar.vue";
import { appToken } from "@/utils/Cache.js";
import oauthService from "@/service/oauth.js";
import { userApi } from "@/api/ModulesUser.js";
import { mapState } from "vuex";

export default {
	components: { avatar },
	data() {
		return {
			currentDate: new Date().getTime() - this.timeDiff,
			birthshow: false,
			columns: ["男", "女"],
			offPopVisible: false, //注销弹出是否显示
		};
	},
	computed: {
		...mapState(["timeDiff", "userInfo", "systemInfo", "systemConfig"]),
		// 现在的年份
		newYear: function () {
			return new Date().getFullYear();
		},
		version() {
			// #ifdef APP-PLUS
			return uni.getStorageSync("version");
			// #endif
			// #ifdef MP
			return uni.getAccountInfoSync().miniProgram?.version || uni.getStorageSync("version");
			// #endif
			// #ifdef H5
			let time = new Date();
			if (process.env.NODE_ENV === "production") {
				time = new Date(Number(JSON.parse(WEBPACKTIME))); //这个值是在vue.config.js里打包那一刻设置的
			}
			return `V${String(time.getFullYear()).substr(3, 1)}.${time.getMonth() + 1}.${time.getDate()}.${time.getHours()}`;
			// #endif
		},
		isLogin() {
			//是否登录
			return appToken.isLogin();
		},
	},
	mounted() {},
	onShow() {
		// 获取个人设置初始化数据
		if (appToken.isLogin()) {
			this.$store.dispatch("getUserInfo");
		}
	},

	activated() {},
	methods: {
		// 修改资料
		goEdit(type, name, title) {
			if (!this.isLogin) {
				appToken.goLogin();
				return;
			}
			uni.navigateTo({ url: `/ModulesUser/account/editData?type=${type}&name=${name || ""}&title=${title}` });
		},
		// 弹出生日选择
		birthShow() {
			this.birthshow = true;
		},
		clearStorageSync() {
			uni.showModal({
				title: "清空缓存",
				content: "清空缓存后将会强制退出登录并清空所有用户信息，确定要清空缓存吗？",
				success: (res) => {
					if (res.confirm) {
						uni.switchTab({
							url: "/pages/index/index",
							complete: () => {
								uni.clearStorageSync();
								appToken.clearToken();
							},
						});
					} else if (res.cancel) {
					}
				},
			});
		},

		// 性别确认弹窗
		Confirm(e) {
			let sexType = "";
			sexType = e.target.value == "0" ? "M" : "F";
			userApi.editSex({ sex: sexType }).then((res) => {
				if (res.code == 1) {
					// this.userInfo.sex = sexType;
					this.$store.dispatch("getUserInfo");
					this.$forceUpdate();
					uni.showToast({ title: "修改成功", icon: "success" });
				}
			});
		},

		// 退出登录
		logout() {
			uni.showModal({
				title: "退出登录",
				content: "是否确认退出登录",
				success: (res) => {
					if (res.confirm) {
						oauthService.logout().then((result) => {
							if (result.success) {
								uni.switchTab({ url: "/pages/index/index" });
							} else {
								uni.showToast({ title: result.msg, icon: "none" });
							}
						});
					} else if (res.cancel) {
					}
				},
			});
		},

		async upload() {
			if (!this.isLogin) {
				appToken.goLogin();
				return;
			}
			this.$refs.avatar.fChooseImg(1, { selWidth: "350rpx", selHeight: "350rpx", inner: true });
		},

		async doUpload(rsp) {
			if (!rsp.path) return;
			const uploader = new this.$Uploader();
			let img_urls = await uploader.uploadOne(rsp.path, true); //第二个参数：是否弹出'上传成功'提示
			if (img_urls) {
				userApi.editPortrait({ avatar: img_urls }).then(() => {
					this.userInfo.portraitPic = img_urls;
				});
			}
		},
	},
};
</script>
<style>
page {
	background-color: var(--backgroundcolor);
}
</style>
<style scoped lang="scss">
.account-cell {
	::v-deep .u-icon-wrap.u-cell__right-icon-wrap {
		font-size: 20rpx;
		height: 40rpx;
		color: #999;
	}
}
</style>
