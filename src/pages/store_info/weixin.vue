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

</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">绑定微信公众号</h2>
    </div>
    <div class="content_inner">
        <el-row>
            <el-col :span="12">
                <h3 class="title">绑定微信公众号，把店铺和微信打通</h3>
                <p class="text">绑定后即可在这里管理您的公众号，购书云提供比微信官方后台更强大的功能！</p>
                <el-button @click="auth" type="primary"><i class="fa fa-weixin" aria-hidden="true"></i> 我有微信公众号， 立即设置</el-button>
            </el-col>
            <el-col :span="12" class="remark">
                <h4 class="remark_title">绑定微信公众号，把店铺和微信打通</h4>
                <ul>
                    <li>如果您还没有微信公众号，可以
                        <el-button size="small" type="text" href="http://baidu.com">点此注册</el-button>
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
                url: ''
            }
        },
        methods: {
            auth() {
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
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {
            axios.post('/v1/weixin/get_auth_url', {}).then(resp => {
                this.url = resp.data.url
            })
        }
}

</script>
