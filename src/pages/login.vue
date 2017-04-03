<style lang="scss" scoped>
#login_box {
    background-color: white;
    text-align: center;
    width: 300px;
    margin: 0 auto;
    padding: 22px 24px 32px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);

    // logo
    img.logo {
        margin-bottom: 12px;
    }

    div.tabs {
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
    }
}

.bottom_bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    height: 128px;
    color: #888;
    font-size: 13px;
    line-height: 128px;
}
</style>

<template lang="html">

<div class="container">
    <div style="height:180px;"></div>

    <div id="login_box">
        <img class="logo" src="../images/logo.png" alt="logo">

        <div class="tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick"  style="width:120px;">
                <el-tab-pane label="登录" name="sign_in">
                    <!-- 登录框 -->
                </el-tab-pane>
                <el-tab-pane label="注册" name="sign_up">
                    <!-- 注册框 -->
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-row v-if="activeName=='sign_up'" type="flex" justify="center">
            <el-col :span="24">
                <el-form :label-position="top">
                    <el-form-item>
                        <el-input placeholder="手机号码" v-model="mobile"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="短信验证码" v-model="message_code"><template slot="append">获取验证码</template></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="个人昵称" v-model="username"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="设置密码" v-model="password" @keyup.enter.native="signUp"></el-input>
                    </el-form-item>
                    <el-button style="width: 100%;" type="primary" :loading="btn_loading" @click="signUp">立即注册</el-button>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-if="activeName=='sign_in'" type="flex" justify="center">
            <el-col :span="24">
                <el-form :label-position="top">
                    <el-form-item>
                        <el-input placeholder="手机号码" v-model="mobile"></el-input>
                    </el-form-item>
                    <el-form-item v-show="!forgetPwd">
                        <el-input placeholder="登录密码" v-model="password" @keyup.enter.native="signIn"></el-input>
                    </el-form-item>
                    <el-form-item v-show="forgetPwd">
                        <el-input placeholder="短信验证码" v-model="message_code"><template slot="append">获取验证码</template></el-input>
                    </el-form-item>
                    <el-form-item v-show="forgetPwd">
                        <el-input placeholder="新密码" v-model="password" @keyup.enter.native="signIn"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align:left">
                        <el-button style="width: 100%;" type="primary" :loading="btn_loading" @click="signIn">立即登录</el-button>
                        <el-button v-show="!forgetPwd" type="text" @click="forgetPwd=true">忘记密码？</el-button>
                        <el-button v-show="forgetPwd" type="text" @click="forgetPwd=false">密码登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

    </div>

    <!-- 底部信息条 -->
    <el-row class="bottom_bar">
        <el-col :span="24">© 2017 购书云 版权所有 沪ICP备15022838号-2 </el-col>
    </el-row>
</div>

</template>

<script>
import {testMobile, testPassword} from '../scripts/utils'
import axios from "../scripts/http"
export default {
    data() {
        return {
            activeName: 'sign_in',
            forgetPwd: false,
            btn_loading: false,

            mobile:'',
            password:'',
            message_code:'',
            username:''
        }
    },
    mounted(){
        //remove adminInfo
        localStorage.removeItem('adminInfo')
        localStorage.removeItem('token')
    },
    methods: {
        handleClick(tab, e) {
            this.activeName = tab.name
        },
        signIn(){
            //校验手机号码格式
            if(!testMobile(this.mobile)){
                this.$message.error('手机号码格式不正确！')
                return
            }
            //check password
            if(!testPassword(this.password)){
                this.$message.error('密码格式不正确！');
                return
            }
            this.btn_loading = true
            axios.post('/v1/seller/login', {
                mobile: this.mobile,
                password: this.password
            }).then(resp=>{
                if(resp.data.code == '00000'){
                    //login success
                    //put token into localStorage
                    localStorage.setItem("token", resp.data.data.token)
                    //put adminInfo into admin
                    localStorage.setItem('adminInfo', JSON.stringify(resp.data.data))

                    this.$router.push({name: 'sales_statistics'})
                }else if (resp.data.code == '11001'){
                    //user not found
                    this.$message.error("用户名或密码错误")
                    this.mobile = ''
                    this.password = ''
                    $('.loginTel input').focus()
                }
                this.btn_loading = false
            })

        },
        signUp() {

        }
    }
}
</script>
