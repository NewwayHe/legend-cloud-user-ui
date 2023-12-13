<template>
	<lsOverlay ref="popup" className="px-2">
		<ls-image :key="imgSrc" :src="imgSrc" @click="clickHandler" mode='aspectFit' :options="{ 'w':  `100%`, 'h':  `100%` }" :customStyle="{'max-height':'80%' }"/>
	</lsOverlay>
</template>
<script>
import lsOverlay from '@/components/ls-app/ls-overlay/ls-overlay.vue'
import floorMixin from '@/mixins/floor.js';
import { popupAdvert } from '@/api/ModulesCommon.js'

import { mapState } from 'vuex';

export default {
    name:'PopupAdvert',
    components:{
        lsOverlay
    },
    props:{
        pageType:{
            type:String,
            required:true
        }
    },
    mixins: [floorMixin],
    data(){
        return {
            imgSrc:'',
            userId:uni.getStorageSync('APP_TOKEN') ? JSON.parse(uni.getStorageSync('APP_TOKEN')).userId : '',
            popupItem:{},
            page:{
                'my':'个人中心',
                'index':'首页'
            }
        }
    },
    computed: {
        ...mapState(['popupAdvertRule','userInfo']),

        popupList(){
            // 当前页面权重最高的广告
            return this.popupAdvertRule.filter(v => { return v.source.indexOf('APP') != -1 && v.advertisePage == this.page[this.pageType] }).sort((a,b) => { return a.seq - b.seq }) || undefined
        }
    },
    mounted(){
        this.setPopupAdvert()
    },
    methods:{
        // 设置当前页面
        setPopupAdvert(){
            let popupHistory = uni.getStorageSync('popup') ? uni.getStorageSync('popup') : {}
            const pageType = this.pageType
            if(this.userId != popupHistory.userId){
                uni.removeStorageSync('popup');
                popupHistory = {}
            }
            for(let i = 0; i < this.popupList.length; i++){
                const item = this.popupList[i]
                const matchedStorge = popupHistory[pageType] ? popupHistory[pageType].find(v => { return v.id == item.id }) : {}
                if(item.clickLimit == 1){ // 点击广告后不显示
                    if(this.$u.test.isEmpty(matchedStorge) || this.userId != popupHistory.userId || matchedStorge.isClick == false || !this.userId){
                        if(item.advertiseFrequency == '有效期内显示'){
                            if(matchedStorge?.count >= item.count){ // 如果超过显示次数
                                continue;
                            }else{ // 否则
                                this.showPopupAdvert(item)
                                this.setPopupAdvertStorage(item)
                                return item
                            }
                        }
                        if(item.advertiseFrequency == '每天显示'){
                            if(matchedStorge?.count >= item.count && new Date(matchedStorge?.lastPopupTime || 0).getDate() == new Date().getDate()){ // 如果在同一天超过显示次数
                                continue;
                            }else{ // 否则
                                this.showPopupAdvert(item)
                                this.setPopupAdvertStorage(item)
                                return item
                            }
                        }
                        if(item.advertiseFrequency == '每次打开页面都显示弹窗'){
                            this.showPopupAdvert(item)
                            this.setPopupAdvertStorage(item)
                            return item
                        }
                    }else{
                        continue;
                    }
                }else{ // 点击广告后依然显示
                    if(item.advertiseFrequency == '有效期内显示'){
                        if(matchedStorge?.count >= item.count){ // 如果超过显示次数
                            continue;
                        }else{ // 否则
                            this.showPopupAdvert(item)
                            this.setPopupAdvertStorage(item)
                            return item
                        }
                    }
                    if(item.advertiseFrequency == '每天显示'){
                        if(matchedStorge?.count >= item.count && new Date(matchedStorge?.lastPopupTime || 0).getDate() == new Date().getDate()){ // 如果在同一天超过显示次数
                            continue;
                        }else{ // 否则
                            this.showPopupAdvert(item)
                            this.setPopupAdvertStorage(item)
                            return item
                        }
                    }
                    if(item.advertiseFrequency == '每次打开页面都显示弹窗'){
                        this.showPopupAdvert(item)
                        this.setPopupAdvertStorage(item)
                        return item
                    }
                }
            }
            // this.popupList.foreach(item =>{
                
            // })
        },
        showPopupAdvert(item){
            this.imgSrc = item.photos
            this.popupItem = item
            popupAdvert.advertisePut({ id:this.popupItem.id, userId:this.userId }).then(res => {
                if(res.code){
                    
                }
            })
            this.$refs.popup.changePopup()
        },
        // 将弹出的广告信息存缓存
        setPopupAdvertStorage(item,click = false){
            const popupHistory = uni.getStorageSync('popup') ? uni.getStorageSync('popup') : {}
            if(this.$u.test.isEmpty(popupHistory)){
                popupHistory.userId = this.userId
            }
            const pageType = this.pageType
            const matchedStorge = popupHistory[pageType] ? popupHistory[pageType].find(v => { return v.id == item.id }) : {}
            if(this.$u.test.isEmpty(matchedStorge)){ // 如果本地缓存没有该条广告记录的话
                const obj = {
                    id:item.id,
                    lastPopupTime:new Date().getTime(),
                    count:1,
                    isClick:false
                }
                popupHistory?.[pageType] ? popupHistory[pageType].push(obj) : this.$set(popupHistory,pageType,[obj])
                uni.setStorageSync('popup',popupHistory)
            }else{
                const obj = matchedStorge
                if(item.clickLimit == 1){
                    if(click == true){
                        obj.isClick = true
                    }else{
                        obj.count++
                    }
                }else{
                    if(item.advertiseFrequency == '有效期内显示'){
                        obj.count++
                    }
                    if(item.advertiseFrequency == '每天显示'){
                        if (new Date(matchedStorge?.lastPopupTime || 0).getDate() == new Date().getDate()){
                            obj.count++
                        }else{
                            obj.count = 1
                        }
                    }
                    if(item.advertiseFrequency == '每次打开页面都显示弹窗'){
                        obj.count++
                    }
                }
                obj.lastPopupTime = new Date().getTime()
                popupHistory[pageType].splice(popupHistory[pageType].findIndex(v => { return v.id == item.id }),1,obj)
                uni.setStorageSync('popup',popupHistory)
            }
            
            /* if( item.clickLimit == 1 ){ //点击广告后不显示
                    if( !matchedStorge || this.userInfo.id != popupHistory.userId || matchedStorge.isClick ==false){
                        //
                        this.showPopupAdvert(item.photos)
                        this.setPopupAdvertStorage(item)
                        return
                    }else{
                        break;
                    }
            }else{ //点击广告后依然显示
                if(item.advertiseFrequency=='有效期内显示' ){
                    if(matchedStorge?.count>item.count){ //如果超过显示次数
                        break;
                    }else{ //否则
                        this.showPopupAdvert(item.photos)
                        this.setPopupAdvertStorage(item)
                        return
                    }
                }
                if(item.advertiseFrequency=='每天显示'){
                    if(matchedStorge?.count>item.count && new Date(matchedStorge?.lastPopupTime || 0).getDate() == new Date().getDate() ){ //如果在同一天超过显示次数
                        break;
                    }else{ //否则
                        this.showPopupAdvert(item.photos)
                        this.setPopupAdvertStorage(item)
                        return
                    }
                }
                if(item.advertiseFrequency=='每次打开页面都显示弹窗'){
                    this.showPopupAdvert(item.photos)
                    this.setPopupAdvertStorage(item)
                    return 
                }
            } */
        },
        // 点击广告
        clickHandler(){
            popupAdvert.advertiseClock({ id:this.popupItem.id, userId:this.userId }).then(res => {
                if(res.code){
                    
                }
            })
            this.setPopupAdvertStorage(this.popupItem,true)
            const url = this.popupItem.url
            let urlData = {};
			// 如果是新数据:url是Object类型
			if (url && url.id) {
				urlData = url
			// 如果是旧数据:url是string类型
			}else{
				urlData = {
					type: '自定义',
					url: url
				};
			}
			this.jumpPage(urlData);
        }
    }

}
</script>
