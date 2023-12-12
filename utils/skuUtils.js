// 切换sku
export function getSkuKey(curKeyDict, speKey, speValue) {
    const _d = { ...curKeyDict }
    _d[speKey] = speValue
    return Object.keys(_d).reduce((arr, item) => {
            arr.push(`${item}:${_d[item]}`)
            return arr
        }, [])
        .join(';')
}

// 检查curKeyDict中有多少个false
export function checkSpeItem(curKeyDict) {
    return Object.keys(curKeyDict).reduce((arr, item) => {
            arr.push(curKeyDict[item])
            return arr
        }, [])
        .filter((item) => item == false).length
}

// 检查是否规格id能否确定一个SKU
export function checkSkuKey(curKeyDict) {
    const arr = []
    for (const key of Object.keys(curKeyDict)) {
        arr.push(curKeyDict[key])
    }
    return !arr.includes(false)
}
