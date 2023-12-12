<template>
    <view class="w750" :style="{ '--themescolor': themes.color }">
        <!-- 编辑地址 -->
        <view class="px-2 font-28">
            <view class="d-flex border-bottom py-2">
                <text class="w-130r mr-2">收&nbsp;&nbsp;货&nbsp;&nbsp;人</text>
                <input type="text" maxlength="20" class="flex-1" v-model="receiver" placeholder="请输入收货人名称" />
            </view>
            <view class="d-flex border-bottom py-2">
                <text class="w-130r mr-2">手机号码</text>
                <input type="number" maxlength="11" class="flex-1" v-model="mobile" placeholder="请输入收货人手机号" />
            </view>
            <view class="d-flex border-bottom py-2 a-center" @click="goChoose">
                <text class="w-130r mr-2">所在地区</text>
                <input type="text" class="flex-1 font-28" disabled v-model="address" placeholder="请选择收货地址" />
                <!-- <text class="iconfont icon-ArrowRight text-bbb" style="font-size: 30rpx;"></text> -->
                <text class="iconfont icon-dingweiweizhi text-bbb" style="font-size: 30rpx;"></text>
            </view>
            <view class="d-flex border-bottom py-2">
                <text class="w-130r mr-2">详细地址</text>
                <textarea
                    class="font-28 h-88r flex-1"
                    placeholder="详细地址需填写楼栋楼层或房间号信息"
                    placeholder-class="text-bbb"
                    v-model="detailAddress"
                    :show-confirm-bar="false"
                ></textarea>
				<view class="w-60r h-60r text-center" @click.stop="detailAddress = ''" v-show="detailAddress">
				    <view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
				</view>
            </view>
            <view v-if="!addressDef">
                <view class="d-flex border-bottom py-2 a-center" @click="changeDefault">
                    <text :class="defaultAdd ? 'text-bbb' : ''">设为默认</text>
                    <text class="text-bbb flex-1">（下单时默认选择该地址）</text>
                    <switch class="scale-08" :color="themes.color" :checked="defaultAdd" />
                </view>
            </view>
        </view>
        <view class="px-2 position-fixed bottom-0 w-100">
            <ls-button
                className="but-main h-88r my-3"
                loading
                :text="'保存收货地址'"
                @click="saveAddress"
                :options="{ cl: '#FFF', br: '50', fs: '30' }"
            />
            <ls-button
                className="flex-center h-88r bg-white text-666 my-3"
                :text="'删除地址'"
                @click="delAddress"
                :options="{ br: '50', fs: '30', bd: '#eee' }"
                v-if="addrId"
            />
        </view>
        <!-- /编辑地址 -->
        <ls-address :defaultValue="defaultAddress" @confirm="adderssConfirm" v-model="addressFlag" valueName="name" keyName="id" ></ls-address>
    </view>
</template>

<script>
import { addressManage } from '@/api/ModulesUser.js'

export default {
    components: { },
    data() {
        return {
            addressFlag: false,
            receiver: '', // 收货人
            mobile: '', // 收货人手机号
            provinceId: '', // 收货地址省id
            cityId: '', // 收货地址市id
            areaId: '', // 收货地址区id
            streetId: '', // 收地址街道id
            address: '', // 收货地址
            addressIds: [], // 收货地址省市区联级id
            detailAddress: '', // 详细地址
            defaultAdd: false, // 是否为默认地址
            addressDef: false, // 是否为默认地址
            addrId: '', // 地址id 编辑使用
            defaultAddress: [],
            createTime: '' // 创建时间
        }
    },
    computed: { },
    watch: {},
    onLoad(option) {
        this.addrId = option.addrId || null
    },
    onUnload() {},
    mounted() {
        this.getAddress()
    },
    methods: {
        getAddress() {
			console.log(this.addrId);
            if (this.addrId) {
                addressManage.getAddressId({ id: this.addrId }).then((res) => {
                    if (res.code == 1) {
                        this.receiver = res.data.receiver
                        this.mobile = res.data.mobile
                        this.provinceId = res.data.provinceId
                        this.defaultAddress = [
                            { name: res.data.provinceName, key: res.data.provinceId },
                            { name: res.data.cityName, key: res.data.cityId },
                            { name: res.data.areaName, key: res.data.areaId },
                            { name: res.data.streetName, key: res.data.streetId }
                        ]
                        this.addressIds = [Number(res.data.provinceId), Number(res.data.cityId), Number(res.data.areaId), Number(res.data.streetId)]
                        this.address =
                            (res.data.provinceName || '') + (res.data.cityName || '') + (res.data.areaName || '') + (res.data.streetName || '')
                        this.detailAddress = res.data.detailAddress
                        this.createTime = res.data.createTime
                        this.defaultAdd = res.data.commonFlag // 地址是否是默认还是不默认
                        this.addressDef = res.data.commonFlag // 地址是否是默认还是不默认
                    }
                })
            }
        },
        // 去选择地址
        goChoose() {
            this.addressFlag = true
        },
        adderssConfirm(res) {
            this.address = res.values.join('')
            this.addressIds = res.keys
            // this.address=res.keys[0]
        },
        // 切换默认状态啊
        changeDefault() {
            this.defaultAdd = !this.defaultAdd
        },
        // 保存编辑的地址
        saveAddress() {
            if (
                !this.$checkInfo([
                    { type: 'hasValue', value: this.receiver, msg: '请输入收货人名称' },
                    { type: 'phone', value: this.mobile, msg: '请输入正确的手机号码' },
                    { type: 'checkeFace', value: this.receiver, msg: '收货人不能带有表情' },
                    { type: 'hasValue', value: this.address, msg: '请选择收货地址' },
                    { type: 'hasValue', value: this.detailAddress, msg: '请输入详细地址' },
                    { type: 'checkeFace', value: this.detailAddress, msg: '地址不能带有表情' }
                ])
            ) {
                return
            }
            if (this.detailAddress.length > 255 || this.detailAddress.length < 5) {
                uni.showToast({ title: '详细地址最少5位 最多不能超过255位', icon: 'none' })
                return
            }
            let saveIfo
            saveIfo = {
                id: this.addrId, // 不一定有，有可能值为空，值为空时新增地址
                receiver: this.receiver,
                mobile: this.mobile,
                provinceId: this.addressIds[0],
                cityId: this.addressIds[1],
                areaId: this.addressIds[2],
                streetId: this.addressIds[3],
                detailAddress: this.detailAddress,
                commonFlag: this.defaultAdd,
                createTime: this.createTime
            }
            addressManage[this.addrId ? 'editAddress' : 'addAddress'](saveIfo).then((res) => {
                if (res.code == 1) {
                    uni.navigateBack({ url: `/ModuleCommon/address/addressList` })
                }
            })
        },
        // 删除地址
        delAddress() {
            uni.showModal({
                content: '是否删除该地址',
                success: (res)=> {
                    if (res.confirm) {
                        addressManage.delAddress(this.addrId).then((res) => {
                            if (res.code == 1) {
                                uni.navigateBack({ url: `/ModuleCommon/address/addressList` })
                            }
                        })
                    } else if (res.cancel) {
                    }
                }
            })
        },
    }
}
</script>

<style>
</style>
