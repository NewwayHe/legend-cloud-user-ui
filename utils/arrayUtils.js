/**
 * 处理数组工具类
 */

const arrayUtils = {
    /**
     * 递归构建树方法
     * data：需要递归的数组
     * children：需要将空的数组子元素设为undefined的子数组名字
     */
    emptyChangeUndefined(data, children = 'children') {
        // 循环遍历json数据
        for (var i = 0; i < data.length; i++) {
            if (data[i][children] == 'null' || data[i][children].length < 1) {
                // children若为空数组，则将children设为undefined
                data[i][children] = undefined
            } else {
                // children若不为空数组，则继续 递归调用 本方法
                this.emptyChangeUndefined(data[i][children])
            }
        }
        return data
    },
    
    /**
     * 将一维数组拆分为二维数组
     * arr：需要拆分的一维的数组
     * size：每个二维数组占的数量
     */
    arrToTwoDim(arr, size) {
        var result = []
		if (arr&&arr.length) {
			arr.forEach((item, index) => {
			    const page = Math.floor(index / size)
			    if (!result[page]) {
			        result[page] = []
			    }
			    result[page].push(item)
			})
		}
        return result
    },

    /**
     * 检查该数组里是否含有该元素： 如果数组arr里含有对象obj，则返回true，如果没有该元素，则返回false
     * @param {Array,Object}: arr:含有多个元素的数组
     *                        obj:检查arr里是否含有obj
     *
     */
    exists: function(arr, obj) {
        Array.prototype.Exists = function(obj) {
            var b = false
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    b = true
                    break
                }
            }
            return b
        }
        return arr.Exists(obj)
    },

    /**
     * 笛卡尔积：
     * @param [Array]: arr:一维数组，要传入的一个sku，如：["2:7", "5:16"]
     *
     */
    cartesian: function(arr) {
        if (!(arr instanceof Array)) {
            arr = [arr]
        }
        // 得出多个一起做笛卡尔积的三维组数
        const ps = [[]]
        for (let j = 0, len2 = arr.length; j < len2; j++) {
            for (let k = 0, len3 = ps.length; k < len3; k++) {
                ps.push(ps[k].concat(arr[j]))
            }
        }
        return ps
    },

    /**
     * 将三维级数里的第三层元素提取出来变成二维数组：[[[1,2],[3,4]],[[5,6],[7,8]]]变成[[1,2],[3,4],[5,6],[7,8]]
     * @param [[[Array]]]: arr:三维数组
     *
     */
    threeChangeTwo: function(arr) {
        const data = [[]]
        for (let i = 0, len4 = arr.length; i < len4; i++) {
            for (let j = 0, len5 = arr[i].length; j < len5; j++) {
                data.push(arr[i][j])
            }
        }
        return data
    },

    /**
     * 二维数组去重： 如果二维数组[[]]里含相同的数组，则去掉重复的:[[1,2],[1,2],[5,6],[7,8]]变成:[[1,2],[5,6],[7,8]]
     * @param [[Array]]: arr:二维数组
     *
     */
    removeRepeat: function(arr) {
        const res = {}
        arr.forEach((item) => {
            item.sort((a, b) => a - b)
            res[item] = item
        })
        return Object.values(res)
        // 下面这段只能去一部分,数组里的元素对比不了
        // var obj={};
        // for(var i=0;i<arr.length;i++){
        //     // 判断当前项是否遍历过，是则删除，否存入obj以作对照
        //     if(obj.hasOwnProperty(arr[i])){
        //         arr.splice(i,1)
        //         i++;
        //     }
        //     obj[arr[i]]=i;
        // }
        // return arr;
    },
	
	/**
	 * 数组去重
	 * arr：有可能是里面元素的id相同的数组
	 * id：key值为id(当不传id值时，则arr数组内的元素为字符串，数组根据Set方法直接对比元素去重,传id则arr数组内的元素为对象，数组根据键值是唯一的来去重)
	 * 用法：this.$utils.array.delRepeat(arr) 或 this.$utils.array.delRepeat(arr,'name')
	 * 备注：如果元素不是对象形式，则用Set来处理，例如：let newArr = new Set(['1','1','2'])来处理,得出newArr结果：['1','2']
	 */
	delRepeat(arr,id) {
		// 如果arr内元素是对象
		if(id){
			const obj = {}
			arr = arr.reduce((item, next) => {
			    obj[next[id]] ? '' : (obj[next[id]] = true && item.push(next))
			    return item
			}, [])
		// 如果arr内元素是字符串
		}else{
			arr = [...new Set(arr)]
		}
		return arr;
	},
}

export default arrayUtils
