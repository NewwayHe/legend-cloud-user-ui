// import JSEncrypt from '@/libs/jsencrypt.min.js'
import { JSEncrypt } from 'wxmp-rsa'
// 公钥
var publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDp92e+IOQiS+/dhOBlbI/o90RCaziV1dX/uKBQcu8PYBpwc3EJFRJacJQ1hCDZGjumJKBVWbyy3pxal9dXqhpN6M46xS/ma0YvOrmPBOjRQqizuUgL2zzJrDAnXC+B2TznGrzSEx7tUD3yJPVR5TwP0awKIzHDLyeA+jWUc5wi4QIDAQAB'

    var privateKey = 
    'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOn3Z74g5CJL792E4GVsj+j3REJrOJXV1f+4oFBy7w9gGnBzcQkVElpwlDWEINkaO6YkoFVZvLLenFqX11eqGk3ozjrFL+ZrRi86uY8E6NFCqLO5SAvbPMmsMCdcL4HZPOcavNITHu1QPfIk9VHlPA/RrAojMcMvJ4D6NZRznCLhAgMBAAECgYAPYLMBZKEJ/gq8eRTUpb+JtOLYKLr14jGoFqb20q8SyCLEvFm0Gp3zss2S/OW5z0cXYvXk1jqYWRhWvf8p5GTJFPJxNeipwuHGgfqEX0oM/6XTvA7hInuYKMUrSPGiVirSEKlLL6XZlGwVH69PGt54JLywrBOCW2Q5HJ2eXyzwoQJBAPu+mg2hNLq/W38oxO9yhw/5lrOPZVcShyQdhK86eFUAD4HaUrvaxFcW+6UPtMEeMdPI+LTLAQ87pgxlnxKRockCQQDt697ceMD9jB9+DYPCLH0mAX32JL6Qe8LpOSxe/Pv6YKpXZmJmvvYN4lEs/o7HIdGO8FOfLwQKMcac8UU8tcRZAkEA9iTcHf2EQCBARynGvNT/aEhC6JiJnsRX7KEMDgUeiQXBI9cjU9hIZ1rqe+7KbpSmZYw4WRWwmINbDP4DtjU8uQJARe9PUv8ru1u05hiS4kCxiLpnjDLA0TeP0346zLEQYEiJyacOxaTcLriXo+IvldkbACkka2YmidiXyQoij/XeAQJAH4A2fzsgX8nj1SbpGd6owoRz2uXwBJN57FK26fQm2ppj9/RKX40oqSoQbnA25nyomYIZb6ZsAGKqqgru/fPzpA=='

    const encryption = (content) => {
    const jse = new JSEncrypt()
    jse.setPublicKey(publicKey)
    var str = jse.encrypt(content)
    console.log('加密数据：' + str)
    return str
}

    const decrypt = (code) => {
        console.log('解密前的密文',code)
        const encryptor = new JSEncrypt()
        encryptor.setPrivateKey(privateKey)
        var str = encryptor.decryptLong(code)
        // console.log('解密后的内容',str)
        return str
    }
export { encryption, decrypt }
