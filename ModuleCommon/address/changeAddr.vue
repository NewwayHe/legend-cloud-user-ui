<template>
    <view class="w750" :style="{ '--themescolor': themes.color }" @click="inputFocus">
        <ls-header>
            <view class="flex-around flex-1 text-333 zindex-99 mr-2">
                <view class="flex-1 flex-start pl-2 pr-1 py-1 bg-bg rounded-50 h-56r">
					<text class="iconfont icon-sousuo text-ccc pr-1" style="font-size: 28rpx;"></text>
                    <input class="w-100 font-28 text-bbb" type="text" v-model="searchText" @input="getAddress" maxlength="50" placeholder="搜索地址" placeholder-style="color:#bbbbbb; font-size:28rpx;"/>
                    <view class="w-60r h-60r flex-center" @click.stop="clean('searchText')" v-show="searchText">
                        <view class="iconfont icon-close text-ccc" style="font-size: 36rpx;"></view>
                    </view>
                </view>
            </view>
        </ls-header>
        <view v-if="searchText" class="addressBox">
            <view class="d-block" :style="{ height: stausBarHeight+'px' }"></view>
            <view class="search-list" v-for="(item, index) in searchDto" :key="index" @click.stop="checkAddress(item)">{{ item.name }}</view>
        </view>
        <view class="choose-address">
            <view class="item">
                <view class="item-tit">当前地址</view>
                <view class="item-con">
                    <view class="current-address">
                        <view class="item-top">
                            <u-icon name="map-fill" :color="themes.color" size="36"></u-icon>
                            {{ location.addressDetail||'暂无位置信息' }}
                        </view>
                        <text @click="goLocation" style="color: #006dc7;font-size: 12px;">重新定位</text>
                    </view>
                </view>
            </view>

            <view class="item" style="margin-top:20px;" v-if="locationValArr && locationValArr.length > 0">
                <view class="item-tit">历史定位</view>
                <view class="item-con">
                    <view class="service-address" v-for="(item, index) in locationValArr" :key="index" @click="clickHistory(item)">
                        <view class="address-item">
                            <u-icon name="map-fill" :color="themes.color" size="36"></u-icon>
                            <text class="address-name">{{ item.name }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex';
import amapFile from '@/libs/amap-wx';
import { locationHistory } from '@/utils/Cache';
export default {
    components: {},
    data() {
        return {
            searchText: '', // 搜索地址
            searchDto: '', // 搜索地址
            locationValArr: []
        };
    },
    computed: {
        ...mapState(['stausBarHeight','location']),
    },
    watch: {},
    mounted() {
		this.$nextTick(()=>{
			if (this.location.region == '定位中') {
			    this.goLocation();
			}
		})
        // 获取历史搜索
        this.locationValArr = locationHistory.getLocationHistory(locationHistory.location);
    },
    methods: {
        // 获取当前经纬度
        goLocation() {
            var myAmapFun = new amapFile.AMapWX({ key: this.$config.AmapKey });
            uni.getLocation({
                type: 'wgs84',
                success: (res)=> {
                    myAmapFun.getRegeo({
                        location: '' + res.longitude + ',' + res.latitude + '',
                        success: (data)=> {
                            console.log(data);
							const city = data[0].regeocodeData.addressComponent.city;
							const district = data[0].regeocodeData.addressComponent.district;
							const province = data[0].regeocodeData.addressComponent.province;
							let locationData = {
								lat: res.latitude,
								lng: res.longitude,
								addressDetail: data[0].regeocodeData.formatted_address,
								region: city.length ? city : district || province || '定位中' // 有地区显示地区，没地区就显示城市，再没城市就显示省份
							};
							this.$store.commit('setLocation', locationData);
                        },
                        fail: (info)=> {
                            // 失败回调
                            uni.showToast({ title:'定位失败',icon:'none' })
                            console.log(info);
                        }
                    });
                },
                fail: (res)=> {
                    uni.showToast({ title:'定位失败',icon:'none' })
                    console.log(res);
                }
            });
        },
        // 改变地址
        checkAddress(item) {
            console.log(item);
            const parms = {
                name: '',
                lng: '',
                lat: ''
            };
            var myAmapFun = new amapFile.AMapWX({ key: this.$config.AmapKey });
            if (item.location) {
                myAmapFun.getRegeo({
                    location: item.location,
                    success: (data)=> {
                        console.log(data);
                        parms.name = data[0].regeocodeData.formatted_address;
                        parms.lng = data[0].longitude;
                        parms.lat = data[0].latitude;
                        console.log(parms);
                        locationHistory.addLocationHistory(locationHistory.location, parms);
                        this.inputFocus();
						const city = data[0].regeocodeData.addressComponent.city;
						const district = data[0].regeocodeData.addressComponent.district;
						const province = data[0].regeocodeData.addressComponent.province;
						let locationData = {
							lat: data[0].latitude,
							lng: data[0].longitude,
							addressDetail: data[0].regeocodeData.formatted_address,
							region: city.length ? city : district || province || '定位中' // 有地区显示地区，没地区就显示城市，再没城市就显示省份
						};
						this.$store.commit('setLocation', locationData);
                        uni.navigateBack()
                    },
                    fail: (info)=> {
                        // 失败回调
                        console.log(info);
                    }
                });
            } else {
                this.inputFocus();
            }
        },
        // 选择历史地址
        clickHistory(item) {
            console.log(item);
            this.getGeocoder(item.lng, item.lat);
        },
        // 反编译
        getGeocoder(lng, lat) {
            var myAmapFun = new amapFile.AMapWX({ key: this.$config.AmapKey });
            console.log(lng, lat);
            myAmapFun.getRegeo({
                location: '' + lng + ',' + lat + '',
                success: (data)=> {
                    console.log(data);
					const city = data[0].regeocodeData.addressComponent.city;
					const district = data[0].regeocodeData.addressComponent.district;
					const province = data[0].regeocodeData.addressComponent.province;
					let locationData = {
						lat: data[0].latitude,
						lng: data[0].longitude,
						addressDetail: data[0].regeocodeData.formatted_address,
						region: city.length ? city : district || province || '定位中' // 有地区显示地区，没地区就显示城市，再没城市就显示省份
					};
					this.$store.commit('setLocation', locationData);
                    this.inputFocus();
                    uni.navigateBack()
                },
                fail: (info)=> {
                    // 失败回调
                    console.log(info);
                }
            });
        },
        // 搜索地址
        getAddress(res) {
            console.log(res);
            this.searchText = res.detail.value
            const lonlat = '';
            var myAmapFun = new amapFile.AMapWX({ key: this.$config.AmapKey });

            myAmapFun.getInputtips({
                keywords: this.searchText,
                success: (data)=> {
                    this.searchDto = data.tips;
                    console.log(data);
                }
            });
        },
        inputFocus() {
            this.searchDto = [];
        },
        // 清除输入框的内容
        clean(flag){
        	this[flag] = ''
        },
    },
};
</script>

<style scoped lang="stylus">
.section
    width 100%
    height 30px
    background #fff
    padding 5px 0
    text-align center
    input
        width 90%
        margin 0 auto
        border 1px solid #c3c3c3
        height 30px
        border-radius 3px
        padding 0 5px
        text-align left
        font-size 15px
.search-list
    border-bottom 2rpx solid #c3c3c3
    padding 20rpx 30rpx 20rpx
    font-size 14px
    background #fff
.addressBox
    width 100%
    position absolute
    top 35px
    z-index 3
    margin-top 7px
/* 选择地址 */
.choose-address
    position relative
.choose-address .item-tit
    padding 10px
    font-size 12px
    line-height 20px
    color #999
.choose-address .item-con
    background #fff
    line-height 20px
    padding 0 10px
.choose-address .item-con .current-address
    display -webkit-flex
    display -webkit-box
    display -moz-box
    display -ms-flexbox
    display flex
    padding 10px 0
.choose-address .item-con .current-address .item-top
    -webkit-flex 1
    -ms-flex 1
    -webkit-box-flex 1
    -moz-box-flex 1
    flex 1
    height 20px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    padding-right 5px
    font-size 13px
.choose-address .item-con .current-address .item-top .img
    width 14px
    height 14px
    margin-right 5px
    vertical-align top
    margin-top 3px
.choose-address .item-con .current-address a
    color #006dc7
.choose-address .item-con .service-address
    padding 5px 0 10px
    border-bottom 1px solid #ededed
.choose-address .item-con .service-address:last-child
    border 0
.choose-address .item-con .service-address .address-item
    margin-top 5px
.choose-address .item-con .service-address .address-item address-name
    color #999
.choose-address .item-con .service-address .address-item
    font-size 13px
    display -webkit-flex
    display -webkit-box
    display -moz-box
    display -ms-flexbox
    display flex
.choose-address .item-con .service-address .address-item .img
    width 14px
    height 14px
    vertical-align top
    margin-top 3px
    margin-right 5px
    -webkit-filter grayscale(100%)
    -moz-filter grayscale(100%)
    -ms-filter grayscale(100%)
    -o-filter grayscale(100%)
    filter grayscale(100%)
    filter gray
.choose-address .item-con .service-address .address-item .address-name
    color #333
    margin-right 10px
    -webkit-flex 1
    -ms-flex 1
    -webkit-box-flex 1
    -moz-box-flex 1
    flex 1
.choose-address .item-con .service-address .address-item .address-km
    display block
    color #999
    font-size 12px
.choose-address .item-con .service-address .address-item .address-km .min
    display inline-block
    padding 0 5px
    background #ff9b00
    color #fff
    margin-right 5px
    font-family arial
    line-height 16px
    vertical-align top
    margin-top 2px
/* end 选择地址 */
</style>
