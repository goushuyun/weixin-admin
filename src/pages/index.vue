<style lang="scss" scoped>
.el-menu {
    border-radius: 0;
}

#top_bar {
    position: fixed;
    top: 0;
    left: 180px;
    right: 0;
    z-index: 2;
    .top_menu > li {
        float: right;
    }
}

#left_bar {
    position: fixed;
    width: 180px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #324057;
    .title {
        line-height: 60px;
        text-align: center;
        color: #C0CCDA;
        border-bottom: 1px solid lighten(#324057, 10%);
    }
}

#content {
    padding-top: 60px;
    padding-left: 180px;
    min-height: 100%;
    min-width: 100%;
    overflow-x: hidden;
    .content_inner {
        // width: 100%;
        height: 100%;
        background-color: white;
        overflow: auto;
        padding: 32px 16px;
    }
    box-sizing: border-box;
}
</style>

<template lang="html">

<div id="app">
    <div id="top_bar">
        <el-menu theme="dark" mode="horizontal" class="top_menu" :router="true">
            <el-submenu index="0">
                  <template slot="title" style="cursor:printer">
                      {{adminName}}
                  </template>
                <el-menu-item index="/">店铺信息</el-menu-item>
                <el-menu-item index="/">退出</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

    <div id="left_bar">
        <h3 class="title" @click="" style="cursor:pointer">{{shopName}}</h3>
        <el-menu theme="dark" mode="vertical" :router="true">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-menu"></i>
                Example
                </template>
                <el-menu-item index="/admin/example">example</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

    <div id="content">
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
    mounted() {
        var adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
        if (adminInfo == null) {
            this.$router.push({
                name: 'index'
            })
            return
        } else {
            this.shopName = adminInfo.shop.shop_name
            this.adminName = adminInfo.admin_name
        }
    },
    methods: {
        mainPage: function() {
            
        }
    }
}
</script>
