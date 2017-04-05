// create axios instance
import Axios from 'axios'
import Vue from 'vue'
const axios = Axios.create({
    baseURL: 'http://weixin-admin.goushuyun.com/',   //购书云
    headers: {
        'Content-Type': 'application/json'
    }
})

var app = new Vue()

axios.interceptors.request.use(config=>{
    let token = localStorage.getItem('token')
    if(token != null){
        config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
}, error=>{
    return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
    //update JWT
    var jwt_token = response.headers['x-jwt-token']
    if(jwt_token != undefined){
        localStorage.setItem('token', jwt_token)
    }

    // if(response.data.code == '11001'){
    //     app.$message.error('用户名或密码错误!')
    //     // return new Error(response.data.message)
    // }
    // relogin
    if(response.data.code == '11014'){
        window.location.href = "http://localhost:8090/#"
    }
    //handler error
    if(response.data.code != '00000'){
        app.$message.error(response.data.message)
        // return new Error(response.data.message)
    }
    return response;
}, function(error) {
    // Do something with response error
    return Promise.reject(error);
});

export default axios
