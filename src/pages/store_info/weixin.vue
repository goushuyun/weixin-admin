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
        .key {
            vertical-align: top;
            display: inline-block;
            width: 100px;
            text-align: right;
            &:after {
                content: "："
            }
        }
        .val {
            display: inline-block;
            padding-left: 6px;
            color: $font_lightest;
            width: 400px;
        }
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
            <ul class="detail">
                <li>
                    <span class="key">公众微信号</span>
                    <span class="val">{{office_account.wechat_id === ''? '未填写':office_account.wechat_id}}</span>
                </li>
                <li>
                    <span class="key">公众号昵称</span>
                    <span class="val">{{office_account.nick_name}}</span>
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
                    <span class="val">
                        <el-input resize="none" type="textarea" :disabled="true" :rows="6" placeholder="请输入内容" v-model="store_url">
                        </el-input>
                    </span>
                </li>
            </ul>
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
                <h4 class="remark_title">绑定微信公众号，把店铺和微信打通</h4>
                <ul>
                    <li>如果您还没有微信公众号，可以
                        <el-button size="small" type="text" href="https://mp.weixin.qq.com/cgi-bin/readtemplate?t=register/step1_tmpl&lang=zh_CN">点此注册</el-button>
                    </li>
                    <li>一个微信公众号只能和一个店铺绑定</a>
                    </li>
                </ul>
            </el-col>
        </el-row>

    </div>
</div>

</template>

<script>

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

            get_office_account_info() {
                    // 获取 store_id 对应的 office_account 信息
                    axios.post('/v1/weixin/get_office_account_info', {}).then(res => {
                        let resp = res.data
                        if (resp.message == 'not_found') {
                            axios.post('/v1/weixin/get_auth_url', {}).then(resp => {
                                this.url = resp.data.url
                            })
                        } else if (resp.message == 'ok') {
                            console.log('------------OK-------------');
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
                    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6d36779ce4dd3dfa&redirect_uri=http%3A%2F%2Fwx.goushuyun.com%2Fone%2Ftwo%2Findex.html%23%2F&response_type=code&scope=snsapi_base&state=' + this.office_account.store_id + '&component_appid=wx1c2695469ae47724#wechat_redirect'
                }
        },

        created() {
            this.get_office_account_info()
        }
}

</script>
