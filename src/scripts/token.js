// 封装获取 七牛 token 的 promise 函数
import axios from "./http"
function getToken(key) {

    return new Promise((resolve, reject) => {
        axios.post('/v1/mediastore/getUpToken', {
            zone: 1,
            key
        }).then(resp => {

            if (resp.data.code == '00000') {
                resolve(resp.data)
            } else {
                reject(resp.data)
            }

        })
    })

}

export {getToken}
