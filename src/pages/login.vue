<style lang="scss" scoped>
@import "../common/_color";

.container{
    background-color: $bg_grey;
    display: flex;
    align-items: center;
    justify-content: center;
}

div#loginBox{
    margin-top: -56px;
    padding: 6px 24px 24px;
    border-radius: 6px;
    background-color: white;
    width: 300px;
    .el-input{
        padding-bottom: 12px;
    }

    .login_btn{
        width: 100%;
    }
}
</style>

<template lang="html">
    <div class="container">
        <div id="loginBox">
            <el-input class="loginTel" v-model="tel" placeholder="手机号码" autofocus></el-input>
            <el-input @keyup.enter.native="login" v-model="password" type="password" placeholder="密码"></el-input>
            <el-button class="login_btn" :loading="btn_loading" type="primary" @click="login">登录</el-button>
        </div>
    </div>
</template>

<script>
import {testMobile, testPassword} from '../scripts/utils'
import axios from "../scripts/http"

export default {
    data(){
        return {
            tel: '',
            password: '',
            btn_loading: false
        }
    },
    mounted(){
        //remove adminInfo
        localStorage.removeItem('adminInfo')
        localStorage.removeItem('token')
    },
    methods: {
        login(){
            //校验手机号码格式
            if(!testMobile(this.tel)){
                this.$message.error('手机号码格式不正确！')
                return
            }
            //check password
            if(!testPassword(this.password)){
                this.$message.error('密码格式不正确！');
                return
            }
            this.btn_loading = true
            axios.post('/v1/admin/login', {
                tel: this.tel,
                password: this.password
            }).then(resp=>{
                if(resp.data.code == '00000'){
                    //login success

                    //put token into localStorage
                    localStorage.setItem("token", resp.data.data.token)
                    //put adminInfo into admin
                    localStorage.setItem('adminInfo', JSON.stringify(resp.data.data))

                    this.$router.push({name: 'admin'})
                }else if (resp.data.code == '11001'){
                    //user not found
                    this.$message.error("用户名或密码错误")
                    this.tel = ''
                    this.password = ''
                    $('.loginTel input').focus()
                }
                this.btn_loading = false
            })

        }
    }
}
</script>
