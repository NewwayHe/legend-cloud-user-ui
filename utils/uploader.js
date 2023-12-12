import config from '@/config/config.js'

import { appToken } from '@/utils/Cache.js'

const upload = '/basic/file/upload'

const IMG_SIZE = 5 // 5m的图片大小
const VIDEO_SIZE = 30 // 30M的视频大小

class Uploader {
    constructor() {}
    // 选择图片   参数 num 为要选择的图片数量
    choose(num) {
        return new Promise((resolve, reject) => {
            uni.chooseImage({
                count: num,
                sizeType: ['compressed'],
                success(res) {
                    // 缓存文件路径
                    for (let i = 0; i < res.tempFiles.length; i++) {
                        const element = res.tempFiles[i]
                        if (element.size / 1024 / 1024 > IMG_SIZE) {
                            reject('上传图片不能大于5M')
                        } else {
                            resolve(res.tempFilePaths)
                        }
                    }
                }
            })
        }).catch((err) => {
            // uni.hideLoading()
            uni.showToast({ icon: 'none', title: err })
            return false
        })
    }
	// 选择视频
	// 视频暂时不支持多选操作
	chooseVideo(config = {}, toastSucceed = true) {
		const {
			extension = ['.mp4'],
			compressed = true, 
			sourceType = ['album', 'camera'], 
			camera = 'back',
			maxDuration = 60
		} = config;
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseVideo({
				extension,		// H5生效 支持的视频格式
				compressed,	// 是否需要压缩视频 默认为true
				sourceType,	// 视频来源 默认为['album', 'camera']
				camera,		// 前置后置摄像头 'front', 默认 'back'
				maxDuration,	// 最长拍摄时间 默认60s
				success: async(res) => {
					// console.log('视频--', res)
					if (res.size / 1024 / 1024 > VIDEO_SIZE) {
					    reject('上传视频不能大于30M')
					} else {
						const uploadRes = await _this.uploadOne(res.tempFilePath, toastSucceed, 1)
					    resolve(uploadRes)
					}
				}
			})
		}).catch((err) => {
            // uni.hideLoading()		// 这句好像没用 uploadOne里面已经complete处理了
            uni.showToast({ icon: 'none', title: err })
            return false
        })
	}
    /* 上传图片 
        num:每次最大可以选择上传的图片数量
        toastSucceed：上弹成功后，是否弹出'上传成功'提示
    */
    choose_and_upload(num, toastSucceed = true) {
        // #ifdef H5
        /* H5只能单选(num = 1)
           count 值在 H5 平台的表现，基于浏览器本身的规范。目前测试的结果来看，只能限制单选/多选，并不能限制数量。并且，在实际的手机浏览器很少有能够支持多选的。
        */
        // num = 1
        // #endif
        // console.log(num)
        return new Promise(async(resolve, reject) => {
            const path_arr = await this.choose(num)

            if (!path_arr) {
                return
            }

            let img_urls = await this.upload(path_arr, toastSucceed)

            if (img_urls && img_urls.length && (!img_urls[0] || img_urls[0] == 'FORMAT_ERR')) {
                // 如果返回的是一个空的数组：[]，或者upload接口报错
                img_urls = []
            }
            resolve(img_urls)
        })
    }

    // 上传 参数 path 选择成功后返回的 缓存文件图片路径
    uploadOne(path, toastSucceed, fileType = 0) {
        // 获取认证的头
        const authHeaders = appToken.generateAuthHeaders()
        console.log(authHeaders)
        const header = {}
        header.Authorization = authHeaders.Authorization

        return new Promise((resolve, reject) => {
            uni.showLoading({
                title: '上传中'
            })
            uni.uploadFile({
                url: config.server + upload, // 仅为示例，非真实的接口地址
                filePath: path,
                name: 'file',
                header: header,
                formData: { fileSource: 'U', fileType },
                success: (uploadFileRes) => {
                    console.log(uploadFileRes)
					const resData =	typeof uploadFileRes.data === 'string' ? JSON.parse(uploadFileRes.data) : uploadFileRes.data
					if (resData.code == 1) {
					    if (toastSucceed) {
					        uni.showToast({ title: '上传成功' })
					    }
					    resolve(resData.data.url)
					} else {
						if (toastSucceed) {
						    uni.showToast({ title: resData.msg,icon:'none' })
						}
					    reject(resData.msg)
					}
                },
                fail: () => {
                    uni.showToast({
                        icon: 'none',
                        title: '上传失败'
                    })
                },
                complete: () => {
                    uni.hideLoading()
                }
            })
        }).catch((res) => {
            uni.showToast({ icon: 'none', title: res })
            return false
        })
    }

    // 上传多张图片 参数 path_arr 选择图片成功后 返回的图片路径数组
    upload(path_arr, toastSucceed) {
        const num = path_arr.length
        return new Promise(async(resolve, reject) => {
            const img_urls = []
            for (let i = 0; i < num; i++) {
                const img_url = await this.uploadOne(path_arr[i], toastSucceed)
                console.log(img_url)
                img_urls.push(img_url)
            }
            // console.log(img_urls)
            resolve(img_urls)
        })
    }
}

export default Uploader
