<style lang="scss" scoped>
.container{
    display: flex;
    flex-direction: column;
    .top_part{
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 420px;
    }
}
#login_box {
    background-color: white;
    text-align: center;
    width: 260px;
    margin: 0 auto;
    padding: 22px 24px 0 24px;
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
    // position: fixed;
    // bottom: 0;
    // width: 100%;
    text-align: center;
    // height: 50px;
    min-height: 100px;
    color: #888;
    font-size: 13px;
    line-height: 50px;
}
</style>

<template lang="html">

<div class="container">
    <div class="top_part">
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

            <el-row type="flex" justify="center">
                <el-col :span="24">
                    <el-form :model="sign" :rules="rules" ref="sign">
                        <div v-if="activeName=='sign_up'">
                            <el-form-item prop="mobile">
                                <el-input class="mobile" size="small" placeholder="手机号码" v-model="sign.mobile" @blur="checkSignUp"></el-input>
                            </el-form-item>
                            <el-form-item prop="message_code">
                                <el-input placeholder="短信验证码" size="small" v-model="sign.message_code">
                                    <el-button slot="append" style="width:100px" @click="getMessageCode('register')" :disabled="registe_timer_disabled">
                                        <span v-show="!registe_timer_disabled">获取验证码</span>
                                        <span v-show="registe_timer_disabled">（{{register_timer_second}}s）</span>
                                    </el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="username">
                                <el-input placeholder="姓名" size="small" v-model="sign.username"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input placeholder="设置密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signUp('sign')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="width: 100%;" size="small" type="primary" :loading="btn_loading" @click="signUp('sign')">立即注册</el-button>
                            </el-form-item>
                        </div>

                        <div v-if="activeName=='sign_in'">
                            <el-form-item prop="mobile">
                                <el-input class="mobile" size="small" placeholder="手机号码" v-model="sign.mobile" @blur="checkSignUp"></el-input>
                            </el-form-item>
                            <el-form-item prop="password" v-show="!forgetPwd">
                                <el-input placeholder="登录密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signIn('sign')"></el-input>
                            </el-form-item>
                            <el-form-item prop="message_code" v-if="forgetPwd">
                                <el-input placeholder="短信验证码" size="small" v-model="sign.message_code">
                                    <el-button slot="append" style="width:100px" @click="getMessageCode('update_pwd')" :disabled="update_pwd_timer_disabled">
                                        <span v-show="!update_pwd_timer_disabled">获取验证码</span>
                                        <span v-show="update_pwd_timer_disabled">（{{update_pwd_timer_second}}s）</span>
                                    </el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password" v-if="forgetPwd">
                                <el-input placeholder="新密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signIn('sign')"></el-input>
                            </el-form-item>
                            <el-form-item style="text-align:left">
                                <el-button style="width: 100%;" size="small" type="primary" :loading="btn_loading" @click="signIn('sign')">立即登录</el-button>
                                <el-button v-show="!forgetPwd" size="small" type="text" @click="forgetPwd=true;sign.password=''">忘记密码？</el-button>
                                <el-button v-show="forgetPwd" size="small" type="text" @click="forgetPwd=false">密码登录</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
    <!-- 底部信息条 -->
    <el-row class="bottom_bar">
        <el-col :span="24">© 2017 购书云 版权所有 沪ICP备15022838号-2 </el-col>
    </el-row>
</div>

</template>

<script>
import {
    testMobile,
    testPassword
} from '../scripts/utils'
import axios from "../scripts/http"
export default {
    data() {
        var checkMobile = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号码不能为空'));
            }
            let telReg = /^1\d{10}$/
            if (!telReg.test(value)) {
              callback(new Error('请输正确的手机号码'));
            } else {
              callback();
            }
        };

        var checkPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            let pwdReg = /^[A-Za-z0-9]{6,20}$/
            if (!pwdReg.test(value)) {
              callback(new Error('请输入6-20英文字母或数字组合'));
            } else {
              callback();
            }
        };

        var checkMessageCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'));
            }
            let msgCodeReg = /\d{4}/
            if (!msgCodeReg.test(value)) {
              callback(new Error('验证码格式不正确'));
            } else {
              callback();
            }
        };
        return {
            year: '',
            activeName: 'sign_in',
            forgetPwd: false,
            btn_loading: false,

            /* 倒计时 */
            register_timer_second: 60,
            registe_timer_disabled: false,
            update_pwd_timer_second: 60,
            update_pwd_timer_disabled: false,

            sign: {
                mobile: '',
                password: '',
                message_code: '',
                username: ''
            },

            rules: {
                mobile: [{
                    validator: checkMobile,
                    trigger: 'blur'
                }],
                password: [{
                    validator: checkPassword,
                    trigger: 'blur'
                }],
                message_code: [{
                    validator: checkMessageCode,
                    trigger: 'blur'
                }],
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        $('.mobile input').focus()
        localStorage.removeItem('store')
        localStorage.removeItem('token')
    },
    methods: {
        handleClick(tab, e) {
            this.activeName = tab.name
            this.sign.password = ''
            this.sign.message_code = ''
            this.forgetPwd = false
        },
        signIn(formName) {
            if (this.forgetPwd) {
                axios.post('/v1/seller/update_password', {
                    mobile: this.sign.mobile,
                    password: this.sign.password,
                    message_code: this.sign.message_code
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        this.$message.success("密码已更改")
                        this.forgetPwd = false
                        this.login(formName)
                    } else {
                        this.$message.error("密码更改失败")
                        return
                    }
                })
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btn_loading = true
                    axios.post('/v1/seller/login', {
                        mobile: this.sign.mobile,
                        password: this.sign.password
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            //login success
                            //put token into localStorage
                            localStorage.setItem("token", resp.data.data.token)
                            //put adminInfo into admin
                            localStorage.setItem('adminInfo', JSON.stringify(resp.data.data))
                            this.$router.push({
                                name: 'shops'
                            })
                        } else if (resp.data.message == 'notFound') {
                            this.$message.error("用户名或密码错误")
                            $('.mobile input').focus()
                        }
                        this.btn_loading = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        checkSignUp() {
            if (testMobile(this.sign.mobile)) {
                axios.post('/v1/seller/check_mobile', {
                    "mobile": this.sign.mobile
                }).then(resp => {
                    if (resp.data.message == 'ok' && this.activeName == 'sign_in') {
                        this.$message.info("用户名不存在，请注册！")
                        this.activeName = 'sign_up'
                    }
                    if (resp.data.message == 'exist' && this.activeName == 'sign_up') {
                        this.$message.info("用户名已存在，请登录！")
                        this.activeName = 'sign_in'
                        this.forgetPwd = false
                    }
                })
            }
        },
        signUp(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btn_loading = true
                    axios.post('/v1/seller/register', {
                        mobile: this.sign.mobile,
                        password: this.sign.password,
                        message_code: this.sign.message_code,
                        username: this.sign.username
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.signIn(formName)
                        } else if (resp.data.message == 'exist') {
                            this.$message.info("用户名已存在！")
                        } else if (resp.data.message == 'codeErr') {
                            this.$message.warning("验证码错误！")
                        }
                        this.btn_loading = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getMessageCode(type) {
            if (!testMobile(this.sign.mobile)) {
                console.log(this.sign.mobile);
                this.$message.error('手机号码格式不正确！')
                return
            }
            console.log(type);
            if (type == 'register') {
                axios.post('/v1/seller/get_sms', {
                    mobile: this.sign.mobile
                }).then(resp => {
                    if (resp.data.code != '00000') {
                        this.$message.error("获取验证码失败，请重试！")
                    }
                    if (resp.data.message == 'exist') {
                        this.$message.info("该用户已被注册！")
                    }
                    if (resp.data.message == 'ok') {
                        this.$message.info("已发送，请查收短信！")
                        this.registe_timer_disabled = true
                        this.timer(type)
                    }
                })
            }

            if (type == 'update_pwd') {
                axios.post('/v1/seller/get_update_sms', {
                    mobile: this.sign.mobile
                }).then(resp => {
                    if (resp.data.code != '00000') {
                        this.$message.error("获取验证码失败，请重试！")
                    }
                    if (resp.data.message == 'needRegister') {
                        this.$message.info("用户名不存在，请注册！")
                        this.activeName = 'sign_up'
                    }
                    if (resp.data.message == 'ok') {
                        this.$message.info("已发送，请查收短信！")
                        this.update_pwd_timer_disabled = true
                        this.timer(type)
                    }
                })
            }
        },
        timer(type) {
            var self = this
            if (type == 'register') {
                if (self.register_timer_second > 0) {
                    self.register_timer_second--;
                    setTimeout(function() {
                        self.timer(type)
                    }, 1000);
                } else {
                    self.registe_timer_disabled = false
                }
            }
            if (type == 'update_pwd') {
                if (self.update_pwd_timer_second > 0) {
                    self.update_pwd_timer_second--;
                    setTimeout(function() {
                        self.timer(type)
                    }, 1000);
                } else {
                    self.update_pwd_timer_disabled = false
                }
            }
        }
    }
}
</script>
