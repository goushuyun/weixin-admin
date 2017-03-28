<style lang="scss" scoped>

@import "../common/_color.scss";
#page {
    height: 100%;
    background-color: $bg_grey;
    font-size: 14px;
}

#left_bar {
    position: fixed;
    width: 180px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #324057;

    .left_top{
        padding: 8px 0 8px 20px;
    }

    .shop_logo {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(255, 255, 255, .4);
    }
    p.shop_name {
        font-size: 14px;
        color: white;
        text-align: left;
        line-height: 22px;
    }
    i.icon {
        color: white;
        font-size: 13px;
        padding: 0 8px;
    }
    .nav_menu_icon{
        width: 14px;
        padding-right: 10px;
    }
}

#content {
    padding-left: 180px;
    min-height: 100%;
    min-width: 100%;
    overflow-x: hidden;
    #top_bar {
        background-color: white;
        padding: 0 26px;
        .title {
            height: 48px;
            line-height: 48px;
            color: $font_normal;
        }
    }
    .content_inner {
        background-color: white;
        overflow: auto;
        margin: 8px;
        padding: 16px 10px;
    }
    box-sizing: border-box;
}

</style>

<template lang="html">

<div id="page">
    <div id="left_bar">
        <el-row class="left_top">
            <el-col :span="10">
                <img src="https://img.yzcdn.cn/upload_files/2016/06/16/de7f0d4ef972065c52ca132a6bc17f88.jpeg" class="shop_logo">
            </el-col>

            <el-col :span="14">
                <p class="shop_name">商户名称</p>
                <p style="padding-top:8px;">
                    <a href="#">
                        <i class="fa fa-arrow-left icon" aria-hidden="true"></i>
                    </a>
                    <a href="#">
                        <i class="fa fa-power-off icon" aria-hidden="true"></i>
                    </a>
                </p>
            </el-col>
        </el-row>

        <div class="shop">
        </div>

        <el-menu theme="dark" mode="vertical" :router="true">
            <el-menu-item-group title="订单">
                <el-menu-item index="/admin/example">
                    <i class="fa fa-arrow-left nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
                <el-menu-item index="/admin/example">
                    <i class="fa fa-arrow-left nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组一">
                <el-menu-item index="/admin/example">
                    <i class="fa fa-bath nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
                <el-menu-item index="/admin/example">
                    <i class="fa fa-arrow-left nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组一">
                <el-menu-item index="/admin/example">
                    <i class="fa fa-arrow-left nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
                <el-menu-item index="/admin/example">
                    <i class="fa fa-arrow-left nav_menu_icon" aria-hidden="true"></i>导航一
                </el-menu-item>
            </el-menu-item-group>
        </el-menu>
    </div>

    <div id="content">
        <div id="top_bar">
            <h2 class="title">订单管理</h2>
        </div>
        <div class="content_inner">
            <router-view></router-view>
        </div>
    </div>

</div>

</template>

<script>

export default {
    data() {
        return {
            shopName: '',
            adminName: ''
        }
    },
    mounted() {},
    methods: {
        mainPage: function() {

        }
    }
}

</script>
