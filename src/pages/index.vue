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
    i.fa{
        width: 14px;
        padding-right: 10px;
    }
}

#content {
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
            <el-menu-item-group title="设置">
                <el-menu-item index="/admin/store_info/cloud_store">
                    <i class="fa fa-info-circle" aria-hidden="true"></i></i>店铺信息
                </el-menu-item>
                <el-menu-item index="/admin/shop_setting/school/">
                    <i class="fa fa-cog" aria-hidden="true"></i></i>店铺设置
                </el-menu-item>
            </el-menu-item-group>
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
        logo(){
            // get logo from vuex
            let logo = this.$store.state.current_store.logo
            return logo=='' ? 'http://okxy9gsls.bkt.clouddn.com/cloudshoplogo1.png' : logo
        }
    }
}

</script>
