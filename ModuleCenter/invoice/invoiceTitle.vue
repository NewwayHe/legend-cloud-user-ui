<template>
	<view
		class="invoiceTitle pb-12 safearea-bb"
		:style="{ '--themescolor': themes.color, '--themesrgba02': themes.rgb02, '--bg1color': themes.rgb01 }"
	>
		<ls-header showHeadSelect title="发票抬头">
			<view slot="left" class="w-88r h-100 flex-center border-box" @click.stop="goback">
				<text class="iconfont icon-ArrowLeft" style="color: #444"></text>
			</view>
		</ls-header>
		<template v-if="!invoiceId||(invoiceId&&paging.status == 'noMore')">
			<ls-tabs
				className="w-100"
				:current="current"
				:list="[
					{ name: '普通发票', type: 'NORMAL' },
					{ name: '增值税专票', type: 'DEDICATED' },
				]"
				fixed
				fontSize="30"
				@change="formData.type = $event.type;current=$event.index"
			/>
			<u-form :model="formData" ref="titleForm" label-width="112">
				<u-form-item label="普票类型：" required v-if="formData.type == 'NORMAL'">
					<view class="d-flex">
						<template
							v-for="item in [
								{ name: '个人抬头', type: 'PERSONAL' },
								{ name: '公司抬头', type: 'COMPANY' },
							]"
						>
							<view
								class="rounded-100 px-2 py-1 border mr-2 font-24"
								:style="{ background: formData.titleType != item.type && '#f5f5f5', borderColor: '#f5f5f5' }"
								@click="formData.titleType = item.type"
								:class="{ 'text-main border-main bg-bg': formData.titleType == item.type }"
								>{{ item.name }}</view
							>
						</template>
					</view>
				</u-form-item>
				<u-form-item :label="formData.type == 'NORMAL' ? '发票抬头：' : '公司名称：'" required>
					<u-input v-model="formData.company" :placeholder="formData.type == 'NORMAL' ? '请输入抬头' : '请输入公司名称'" maxlength="100" />
				</u-form-item>
				<!-- 公司展示 -->
				<u-form-item label="税号：" required v-if="formData.type == 'DEDICATED' || formData.titleType == 'COMPANY'">
					<u-input v-model="formData.invoiceHumNumber" placeholder="请输入纳税人识别号" maxlength="20" />
				</u-form-item>
				<view v-show="formData.type == 'DEDICATED'">
					<u-form-item label="公司地址：" required>
						<u-input v-model="formData.registerAddr" placeholder="请输入公司注册地址" maxlength="100"/>
					</u-form-item>
					<u-form-item label="公司电话：" required>
						<u-input v-model="formData.registerPhone" type="number" placeholder="请输入公司注册电话" maxlength="12"/>
					</u-form-item>
					<u-form-item label="开户银行：" required >
						<u-input v-model="formData.depositBank" placeholder="请输入公司开户银行名称" maxlength="50" />
					</u-form-item>
					<u-form-item label="银行账户：" required>
						<u-input v-model="formData.bankAccountNum" type="number" placeholder="请输入公司银行账户号码" maxlength="30"/>
					</u-form-item>
				</view>
				<u-form-item label="电子邮箱：" required >
					<u-input v-model="formData.email" placeholder="请输入接收电子发票邮箱地址" />
				</u-form-item>
				<u-form-item label="设为默认：" :border-bottom="false">
					<view class="w-100 text-right">
						<u-switch v-model="formData.commonInvoiceFlag" :active-color="themes.color" />
					</view>
				</u-form-item>
			</u-form>
			<u-toast ref="msgToast" />
			<view class="w-100 safearea-bb-white position-fixed bottom-0 p-2 bg-fff flex-between" style="z-index: 333">
				<view :class="invoiceId ? 'w-50' : 'w-100'">
					<ls-button className="but-main h-80r" text="保存并使用" @click="handleSave" :options="{ br: '40', fs: '26' }" />
				</view>
				<view v-if="invoiceId" class="w-50 ml-2">
					<ls-button className="but-main-rgb02 h-80r" text="删除" @click="handleDel" :options="{ br: '40', fs: '26' }" />
				</view>
			</view>
		</template>
		<ls-empty className="center-xy" :paging="paging" @reLoad="getInvoiceDetail" reLoad v-if="invoiceId"/>
	</view>
</template>

<script>
import { invoiceManage } from '@/api/ModulesUser';
export default {
	data() {
		return {
			invoiceId: null, // 编辑使用
			formData: {
				type: 'NORMAL', // 普通发票：NORMAL，增值税专票：DEDICATED
				titleType: 'PERSONAL', // [抬头类型]默认为普通发票的个人发票PERSONAL， 普通发票还有一种公司发票 COMPANY
				company: '', // [抬头名称],
				// 公司--
				invoiceHumNumber: '', // [税号]
				registerAddr: '', // [公司地址]
				registerPhone: '', // [电话号码]
				depositBank: '', // [开户银行]
				bankAccountNum: '', // [银行账户]
				// --公司
				email: '', // [电子邮箱]
				commonInvoiceFlag: false, // [是否默认]
			},
			current:0,
			paging: {
			    status: 'loading',
			    error: false, // 是否错误
			    emptylist: false // 是否显示列表为空时的样式
			},
		};
	},
	computed: {},
	watch: {
		// 当发票类型切换为 个人时 要将[公司的信息]去除
		'formData.type'(nT) {
			if (nT == 'NORMAL') {
				Object.assign(this.formData, {
					invoiceHumNumber: '', // [税号]
					registerAddr: '', // [公司地址]
					registerPhone: '', // [电话号码]
					depositBank: '', // [开户银行]
					bankAccountNum: '', // [银行账户]
				});
			}
		},
	},
	onLoad(options) {
		// console.log('发票抬头--', options)
		this.invoiceId = options.invoiceId || null;
		options.invoiceId && this.getInvoiceDetail();
	},
	methods: {
		// 如果是编辑状态下 则获取对应的信息
		getInvoiceDetail() {
			this.paging = {
				status: 'loading',
				error: false, // 是否错误
				emptylist: false ,// 是否显示列表为空时的样式
			}
			invoiceManage
				.getInvoiceDetail({
					id: this.invoiceId,
				})
				.then((res) => {
					// console.log('res--',res)
					Object.assign(this.formData, res.data); // 这里要将所有数据回传给后端。。不能向下面那样
					this.current = this.formData.type == 'DEDICATED' ? 1 : 0
				}).finally((res) => {
					this.paging.status = 'noMore'
				});
		},
		// 保存并使用
		handleSave() {
			// 普通发票时(formData.type =='NORMAL'),formData.company为发票抬头,增值税发票时(formData.type == 'DEDICATED'),formData.company为公司名称
			const commonCheck = [
				// 共有的校验
				{ type: 'hasValue', value: this.formData.company, msg: `请输入${this.formData.type == 'NORMAL' ? '发票抬头' : '公司名称'}` },
			];
			
			// 如果是普通发票并且【普票类型】选择了【公司抬头】，或者如果是增值税发票
			if ((this.formData.type == 'NORMAL' && this.formData.titleType == 'COMPANY') || this.formData.type == 'DEDICATED') {
				commonCheck.push({ type: 'tax', value: this.formData.invoiceHumNumber, msg: '税号必需是15或者17或者18或者20位字母、数字组成' })
			}
			
			// 如果是增值税发票
			if (this.formData.type == 'DEDICATED') {
				commonCheck.push(
					{ type: 'hasValue', value: this.formData.registerAddr, msg: '请输入公司注册地址' },
					{ type: 'hasValue', value: this.formData.registerPhone, msg: '请输入公司注册电话' },
					{ type: 'phoneNum', value: this.formData.registerPhone, msg: '请输入正确的电话格式' },
					{ type: 'hasValue', value: this.formData.depositBank, msg: '请输入公司开户银行名称' },
					{ type: 'bankAccount', value: this.formData.bankAccountNum, msg: '请输入正确的银行账户号码' }
				)
			}
			
			// 共有的校验
			commonCheck.push({ type: 'email', value: this.formData.email, msg: '请输入正确格式的电子邮箱地址' })
			
			if (!this.$checkInfo(commonCheck)) return;
			this.addOrEdit();
		},
		addOrEdit() {
			const isEdit = !!this.invoiceId;
			const method = isEdit ? 'editInvoice' : 'addInvoice';
			const params = this.$u.deepClone(this.formData);
			isEdit && (params.id = this.invoiceId);
			if (this.formData.type == 'NORMAL') {
				// 去除增值税的字段干扰
				params.titleType = 'PERSONAL';
				if (!isEdit) {
					// 如果是新增 编辑状态下不能去除 否则后端报错。。。
					delete params.invoiceHumNumber;
					delete params.registerAddr;
					delete params.registerPhone;
					delete params.depositBank;
					delete params.bankAccountNum;
				}
			}
			console.log('formData--', params);
			invoiceManage[method](params)
				.then((res) => {
					console.log(res);
					if (res.code) {
						this.$refs.msgToast.show({
							title: `${isEdit ? '编辑' : '新增'}成功`,
							icon: false,
							duration: 500,
							callback: () => {
								this.$utils.pages.goBeforePage(1);
							},
						});
					}
				})
				.catch((err) => {
					console.log('edit error', err);
				});
		},
		// 删除
		handleDel() {
			uni.showModal({
				title: '提示',
				content: '数据删除后将无法恢复，确定删除？',
				success: (res) => {
					if (res.confirm) {
						invoiceManage
							.delInvoice(this.invoiceId)
							.then((res) => {
								console.log(res);
								if (res.code) {
									this.$refs.msgToast.show({
										title: '删除成功',
										icon: false,
										duration: 500,
										callback: () => {
											this.$utils.pages.goBeforePage(1);
										},
									});
								}
							})
							.catch((err) => {
								console.log('delete invoice err', err);
								this.$refs.msgToast.show({
									title: '该发票不存在或已被删除！',
									icon: false,
								});
							});
					}
				},
			});
		},
		goback() {
			uni.showModal({
				title: '提示',
				content: '是否需要取消此次操作，取消后更改的内容将不会被保存',
				success: (res) => {
					if (res.confirm) {
						if (!this.$utils.pages.getPageRoute(1)) {
							this.$switchTab(`/pages/index/index`);
						} else {
							uni.navigateBack();
						}
					}
				},
			});
		},
	},
};
</script>

<style>
page {
	background-color: var(--backgroundcolor);
}
</style>

<style lang="scss" scoped>
.invoiceTitle {
	::v-deep .u-form {
		margin-top: 20rpx;
		.u-form-item {
			line-height: 40rpx;
			background-color: #fff;
			padding: 30rpx 20rpx;
			.u-form-item--left__content {
				color: #333;
				padding-right: 0;
				&__label {
					white-space: nowrap;
				}
			}
			.u-form-item--right {
				margin-left: 40rpx;
			}
		}
	}
}
</style>
