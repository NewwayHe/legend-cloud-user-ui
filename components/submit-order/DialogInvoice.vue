<template>
	<!-- 新增发票 -->
	<u-popup
		v-model="show"
		mode="bottom"
		border-radius="14"
		safe-area-inset-bottom
		closeable
		:style="{ '--themescolor': themes.color, '--backgroundcolor': themes.rgb02 }"
	>
		<view class="d-flex font-32 font-weight">
			<view
				class="flex-1 text-center p-2"
				v-for="(type, index) in invoiceList"
				:key="index"
				:style="formData.type == type ? `border-bottom: 4rpx solid ${themes.color}` : ''"
				@click="changeType(type)"
			>
				{{ type == "NORMAL" ? "普通发票" : "增值税专票" }}
			</view>
		</view>
		<view class="bg-f8" style="height: 700rpx">
			<view class="px-2 bg-fff">
				<template>
					<view class="flex-start py-2 border-bottom" v-if="formData.type == 'NORMAL'">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>普票类型：</text>
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
					</view>
					<view class="d-flex py-2 border-bottom">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>{{ formData.type == "NORMAL" ? "发票抬头：" : "公司名称：" }}</text>
						<input
							class="flex-1"
							v-model="formData.company"
							:placeholder="formData.type == 'NORMAL' ? '请输入抬头' : '请输入公司名称'"
							maxlength="100"
							key="company"
						/>
					</view>
					<view class="d-flex py-2 border-bottom" v-if="formData.type == 'DEDICATED' || formData.titleType == 'COMPANY'">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>税号：</text>
						<input
							class="flex-1"
							v-model="formData.invoiceHumNumber"
							placeholder="请输入纳税人识别号"
							maxlength="20"
							@blur="$checkInfo([{ type: 'tax', value: formData.invoiceHumNumber, msg: '税号必需是15或者17或者18或者20位字母、数字组成' }])"
							key="invoiceHumNumber"
						/>
					</view>
				</template>
				<template v-if="formData.type == 'DEDICATED'">
					<view class="d-flex py-2 border-bottom">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>公司地址：</text>
						<input class="flex-1" v-model="formData.registerAddr" placeholder="请输入公司注册地址" maxlength="100" key="registerAddr" />
					</view>
					<view class="d-flex py-2 border-bottom">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>公司电话：</text>
						<input class="flex-1" v-model="formData.registerPhone" placeholder="请输入公司注册电话" maxlength="12" key="registerPhone" />
					</view>
					<view class="d-flex py-2 border-bottom">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>开户银行：</text>
						<input class="flex-1" v-model="formData.depositBank" placeholder="请输入公司开户银行名称" maxlength="50" key="depositBank" />
					</view>
					<view class="d-flex py-2 border-bottom">
						<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>银行账号：</text>
						<!-- 该字段的校验规则是15或19长度的数字，故maxlength设为20 -->
						<input
							class="flex-1"
							v-model="formData.bankAccountNum"
							type="number"
							placeholder="请输入公司银行账户号码"
							maxlength="20"
							key="bankAccountNum"
						/>
					</view>
				</template>
				<view class="d-flex py-2 border-bottom">
					<text style="width: 30%"><text class="text-danger v-middle mr-1">*</text>电子邮箱：</text>
					<!-- 该字段的校验规则是15或19长度的数字，故maxlength设为20 -->
					<input class="flex-1" v-model="formData.email" placeholder="请输入接收电子发票邮箱地址" maxlength="50" key="email" />
				</view>
				<view class="d-flex py-2 a-center">
					<text style="width: 30%"><text class="ml-2">设为默认：</text></text>
					<u-switch v-model="formData.commonInvoiceFlag" :active-color="themes.color" />
				</view>
			</view>
		</view>
		<view class="px-2">
			<ls-button className="but-main h-88r my-2" loading :text="'保存'" @click="submitInvoice" :options="{ cl: '#FFF', br: '50', fs: '30' }" />
		</view>
	</u-popup>
</template>

<script>
import { invoiceManage } from '@/api/ModulesUser';

const form = {
	type: 'NORMAL',
	titleType: 'PERSONAL',
	company: '', // 如果是普票，则是抬头信息，如果是增值税,则是公司名称
	invoiceHumNumber: '',
	registerAddr: '',
	registerPhone: '',
	depositBank: '',
	bankAccountNum: '',
	commonInvoiceFlag: false,
};

export default {
	components: {},
	props: {
		invoiceList: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			formData: {},
			show: false,
		};
	},
	created() {
		this.formData = Object.assign({}, form);
		this.$set(this.formData, 'type', 'NORMAL');
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
	mounted() {},
	onShow() {},
	methods: {
		// 保存新增发票
		submitInvoice() {
			if (this.formData) {
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
				invoiceManage
					.addInvoice(this.formData)
					.then((res) => {
						this.$set(this.formData, 'id', res.data);
						this.$emit('addInvoice', this.formData);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		// 切换发票类型
		changeType(type) {
			if (type == 'NORMAL') {
				this.formData.titleType = 'PERSONAL';
			} else {
				this.formData.titleType = 'COMPANY';
			}
			this.formData.type = type;
		},

		// 新增发票 - 是否设置为默认
		defaultChange(evt) {
			this.formData.commonInvoiceFlag = evt.target.value;
		},

		// 显示弹窗，并重置数据
		changePopup() {
			this.show = !this.show;
			this.formData = Object.assign({}, form);
			// 如果只有一个类型，则只请求这个类型，否则默认
			this.formData.type = this.invoiceList.length == 1 ? this.invoiceList[0] : this.formData.type;
		},
	},
};
</script>
