<style lang="scss" scoped>@import "../common/_color.scss";
#page {
    height: 100%;
    // background-color: $bg_grey;
    font-size: 14px;
}

#left_bar {
    position: fixed;
    width: 180px;
    top: 0;
    left: 0;
    bottom: 0;
    // background-color: #324057;
    background-color: rgba(0, 0, 0, .85);

    .left_top {
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
    i.fa {
        width: 14px;
        padding-right: 10px;
    }
}

#content {
    background-image: url(http://7xvl2k.com1.z0.glb.clouddn.com/bg_3.jpg);
    background-size: 100%, 100%;
    padding-left: 180px;
    min-height: 100%;
    min-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}
</style>

<template lang="html">

<div id="page">
    <div id="left_bar">
        <el-row class="left_top">
            <el-col :span="10">
                <img :src="logo" class="shop_logo">
            </el-col>

            <el-col :span="14">
                <p class="shop_name">商户名称</p>
                <p style="padding-top:8px;">
                    <router-link :to="{name:'shops'}">
                        <i class="fa fa-arrow-left icon" aria-hidden="true"></i>
                    </router-link>
                    <router-link :to="{name:'login'}">
                        <i class="fa fa-power-off icon" aria-hidden="true"></i>
                    </router-link>
                </p>
            </el-col>
        </el-row>

        <div class="shop">
        </div>

        <el-menu theme="dark" mode="vertical" :router="true">
            <el-submenu index="1">
              <template slot="title"><i class="fa fa-flag" aria-hidden="true"></i>推荐管理</template>
              <el-menu-item index="/admin/recommend/topic">
                  <i class="fa fa-anchor" aria-hidden="true"></i>话题推荐
              </el-menu-item>
              <el-menu-item index="/admin/recommend/carousel">
                  <i class="fa fa-picture-o" aria-hidden="true"></i>轮播图
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="fa fa-list-ul" aria-hidden="true"></i>库存管理</template>
              <el-menu-item index="/admin/stock_manage/stock_list">
                  <i class="fa fa-university" aria-hidden="true"></i>库存查看
              </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="fa fa-book" aria-hidden="true"></i>图书上架</template>
              <el-menu-item index="/admin/add_book/by_isbn">
                  <i class="fa fa-search" aria-hidden="true"></i>ISBN上架
              </el-menu-item>
              <el-menu-item index="/admin/add_book/by_excel">
                  <i class="fa fa-file-text" aria-hidden="true"></i>批量上架
              </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-setting"></i>设置</template>
              <el-menu-item index="/admin/store_info/cloud_store">
                <i class="fa fa-info-circle" aria-hidden="true"></i>店铺信息
              </el-menu-item>
              <el-menu-item index="/admin/store_setting/">
                  <i class="fa fa-cog" aria-hidden="true"></i>店铺设置
              </el-menu-item>
              <el-menu-item index="/admin/weixin_setting/">
                  <i class="fa fa-weixin" aria-hidden="true"></i></i>微信设置
              </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

    <div id="content">
        <router-view></router-view>
    </div>

</div>

</template>

<script>
export default {
    data() {
        return {
            store_logo: '',
            seller_name: '',
        }
    },
    computed: {
        logo() {
            // get logo from vuex
            let logo = this.$store.state.current_store.logo
            return logo == '' ? 'http://okxy9gsls.bkt.clouddn.com/cloudshoplogo1.png' : 'http://onv8eua8j.bkt.clouddn.com/' + logo
        }
    }
}
</script>
