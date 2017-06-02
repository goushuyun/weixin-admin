<style lang="scss" scoped>

@import "../../common/_color.scss";
h3.title {
    color: $weixin_green;
    font-weight: bold;
    line-height: 44px;
}

p.text {
    font-size: 12px;
    line-height: 20px;
    padding: 12px 0;
}

.remark {
    border-left: 1px solid $bg_grey;
    padding-left: 32px;
    h4.remark_title {
        font-size: 12px;
        line-height: 44px;
        color: $font_light;
    }
    ul {
        // list-style:disc;
        li {
            line-height: 18px;
            font-size: 12px;
            color: $font_lightest;
        }
    }
}

ul.detail {
    font-size: 13px;
    padding-top: 12px;
    li {
        // line-height: 36px;
        padding-bottom: 22px;
        color: $font_normal;
        display: flex;
        justify-content: flex-start;
        .key {
            vertical-align: top;
            display: block;
            min-width: 100px;
            text-align: right;
            &:after {
                content: "："
            }
        }
        .val {
            display: inline-block;
            padding-left: 6px;
            color: $font_lightest;
            max-width: 270px;
            word-wrap: break-word;
        }
        .url {
            padding: 4px 6px;
            box-sizing: border-box;
            line-height: 18px;
            background-color: #F6F8FA;
        }
    }
}
#copy_btn{
    outline: none;
    background-color: #F6F8FA;
    border: 0;
    color: #20A0FF;

    &:hover{
        cursor: pointer;
        background-color: #E9ECEF;
    }
}

</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">绑定微信公众号</h2>
    </div>
    <div class="content_inner">
        <div v-if="has_authorized==true" class="office_account_info">
            <el-row>
                <el-col :span="12">
                    <ul class="detail">
                        <li>
                            <span class="key">公众号昵称</span>
                            <span class="val">{{office_account.nick_name}}</span>
                        </li>
                        <li>
                            <span class="key">公众微信号</span>
                            <span class="val">{{office_account.wechat_id === ''? '未填写':office_account.wechat_id}}</span>
                        </li>
                        <li>
                            <span class="key">公众号类型</span>
                            <span class="val">{{oa_type}}</span>
                        </li>
                        <li>
                            <span class="key">帐号主体</span>
                            <span class="val">{{office_account.principal_name}}</span>
                        </li>
                        <li>
                            <span class="key">云店URL</span>
                            <span class="val url">
                                <span id="store_url">{{store_url}}</span>
                                <button id="copy_btn" type="button" name="button" data-clipboard-target="#store_url"><i class="fa fa-clipboard" aria-hidden="true"></i> 复制URL</button>
                            </span>
                        </li>
                    </ul>
                </el-col>

                <el-col :span="12" class="remark">
                    <h4 class="remark_title">温馨提示</h4>
                    <ul>
                        <li>您需要将您的的云店URL绑定到微信公众号的菜单栏</li>

                        <li>步骤1：点此<el-button size="small" type="text" @click="openInNewTab('https://mp.weixin.qq.com/')">登录微信服务号</el-button></li>
                        <li>步骤2：进入“自定义菜单”</li>
                        <li>步骤3：选择“跳转网页”并将左侧URL粘贴到页面地址中</li>

                    </ul>
                </el-col>
            </el-row>
        </div>

        <el-row  v-else>
            <el-col :span="12">
                <div>
                    <h3 class="title">绑定微信公众号，把店铺和微信打通</h3>
                    <p class="text">绑定后即可在这里管理您的公众号，购书云提供比微信官方后台更强大的功能！</p>
                    <el-button @click="auth" type="primary"><i class="fa fa-weixin" aria-hidden="true"></i> 我有微信公众号， 立即设置</el-button>
                </div>
            </el-col>
            <el-col v-if="has_authorized == false" :span="12" class="remark">
                <h4 class="remark_title">温馨提示</h4>
                <ul>
                    <li>如果您还没有微信公众号，可以
                        <el-button id="copy_btn" size="small" type="text" @click="openInNewTab('https://mp.weixin.qq.com/cgi-bin/readtemplate?t=register/step1_tmpl&lang=zh_CN')">点此注册</el-button>
                    </li>
                    <li>一个微信公众号只能和一个店铺绑定</li>
                </ul>
            </el-col>
        </el-row>

    </div>
</div>

</template>

<script>
import conf from '../../config/conf.js'
import axios from '../../scripts/http'
export default {
    data() {
            return {
                url: '',
                office_account: {},
                has_authorized: false

            }
        },
        methods: {
            openInNewTab(url) {
                var win = window.open(url, '_blank');
                win.focus();
            },
            get_office_account_info() {
                    // 获取 store_id 对应的 office_account 信息
                    axios.post('/v1/weixin/get_office_account_info', {}).then(res => {
                        let resp = res.data
                        if (resp.message == 'not_found') {
                            let params = {redirect_uri: conf.redirect_uri}
                            axios.post('/v1/weixin/get_auth_url', params).then(resp => {
                                this.url = resp.data.url
                            })
                        } else if (resp.message == 'ok') {
                            this.has_authorized = true
                            this.office_account = resp.data

                            console.log(this.office_account);
                        }
                    })
                },

                auth() {
                    console.log(this.url);
                    window.open(this.url)
                        // 弹出提示框，给用户选择是否已经授权完毕
                    this.$confirm('请在新窗口完成微信公众号授权', '提示', {
                        confirmButtonText: '已授权成功',
                        cancelButtonText: '授权失败，重试',
                        type: 'warning',
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '授权成功!'
                        })
                        this.get_office_account_info()
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '授权失败'
                        });
                    });
                }

        },

        computed: {
            oa_type() {
                let type = ''
                if (this.office_account.verify_type_info === 0 || this.office_account.verify_type_info === 1 || this.office_account.verify_type_info === 2) {
                    type += '已认证'
                } else {
                    type += '未认证'
                }

                if (this.office_account.service_type_info === 2) {
                    type += '服务号'
                } else {
                    type += '订阅号'
                }

                return type
            },
            store_url() {
                // url 中填入官方服务号的 appid, 商户的store_id
                return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6d36779ce4dd3dfa&redirect_uri='+ conf.url_encode_domain +'%2fone%2ftwo%2findex.html%23%2findex%2fmain&response_type=code&scope=snsapi_base&state=' + this.office_account.store_id + '&component_appid='+ conf.component_appid +'#wechat_redirect'
            }
        },
        mounted(){
            // set up Clipboard
            new Clipboard('#copy_btn')
        },
        created() {
            this.get_office_account_info()
        }
}

</script>
