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
        display: flex;
        align-items: center;
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
    }
    .left_middle {
        min-height: 500px;
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
    .left_bottom {
        position: absolute;
        bottom: 0;
        display: flex;
        text-align: center;
        justify-content: space-around;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #FFFFFF;
        .btn_area {
            height: 30px;
            width: 30px;
            line-height: 30px;
            border-radius: 50px;
            border: 1px solid #FFFFFF;
            img {
                height: 30px;
                width: 30px;
            }
            &:hover {
              cursor: pointer;
            }
        }
    }
}

#content {
    background-image: url("http://7xvl2k.com1.z0.glb.clouddn.com/bg_3.jpg");
    background-attachment: fixed;
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
            <el-col :span="9">
              <img :src="store_logo" class="shop_logo" @click="goToCloudStore">
            </el-col>

            <el-col :span="15">
                <p class="shop_name">{{store_name}}</p>
            </el-col>
        </el-row>
        <div class="left_middle">
          <el-menu theme="dark" :default-openeds="submenu_openeds" mode="vertical" :router="true" unique-opened :default-active="menu_active" @select="menuSelect">
              <el-menu-item index="0" :route="{name:'home'}"><i class="fa fa-home" style="font-size:18px;position:relative;top:1.5px;" aria-hidden="true"></i>首页</el-menu-item>
              <el-submenu index="1">
                <template slot="title"><i class="fa fa-list" aria-hidden="true"></i>订单管理</template>
                <el-menu-item index="1-1" :route="{name:'order_list'}">
                    <i class="fa fa-delicious" aria-hidden="true"></i>线上订单
                </el-menu-item>
                <el-menu-item index="1-2" :route="{name:'retail_list'}">
                    <i class="fa fa-life-ring" aria-hidden="true"></i>线下订单
                </el-menu-item>
                <el-menu-item index="1-3" :route="{name:'offline_retail'}">
                    <i class="fa fa-balance-scale" aria-hidden="true"></i>线下零售
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title"><i class="fa fa-flag" aria-hidden="true"></i>推荐管理</template>
                <el-menu-item index="2-1" :route="{name:'topic'}">
                    <i class="fa fa-anchor" aria-hidden="true"></i>话题推荐
                </el-menu-item>
                <el-menu-item index="2-2" :route="{name:'carousel'}">
                    <i class="fa fa-picture-o" aria-hidden="true"></i>轮播图
                </el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title"><i class="fa fa-book" aria-hidden="true"></i>库存管理</template>
                <el-menu-item index="3-1" :route="{name:'by_isbn'}">
                    <i class="fa fa-search" aria-hidden="true"></i>ISBN上架
                </el-menu-item>
                <!-- <el-menu-item index="3-2" :route="{name:'by_excel'}">
                    <i class="fa fa-file-text" aria-hidden="true"></i>批量上架
                </el-menu-item> -->
                <el-menu-item index="3-3" :route="{name:'stock_list'}">
                    <i class="fa fa-university" aria-hidden="true"></i>库存查看
                </el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title"><i class="fa fa-line-chart" aria-hidden="true"></i>资产统计</template>
                <el-menu-item index="4-1" :route="{name:'online_account'}">
                    <i class="fa fa-money" aria-hidden="true"></i>线上资产
                </el-menu-item>
                <el-menu-item index="4-2" :route="{name:'sales'}">
                    <i class="fa fa-pie-chart" aria-hidden="true"></i>销售统计
                </el-menu-item>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title"><i class="el-icon-setting"></i>设置</template>
                <el-menu-item index="5-1" :route="{name:'cloud_store'}">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>店铺信息
                </el-menu-item>
                <el-menu-item index="5-2" :route="{name:'school'}">
                    <i class="fa fa-cog" aria-hidden="true"></i>店铺设置
                </el-menu-item>
                <el-menu-item index="5-3" :route="{name:'weixin_setting'}">
                    <i class="fa fa-weixin" aria-hidden="true"></i></i>微信设置
                </el-menu-item>
              </el-submenu>
          </el-menu>
        </div>
        <transition name="el-zoom-in-center">
          <div v-show="show_btns" class="left_bottom" @mouseleave="show_btns = false">
            <div class="btn_area" @click="goToGoushuyun">
              <img src="http://okxy9gsls.bkt.clouddn.com/gsy_btn.png">
            </div>
            <div class="btn_area" @click="goToshops">
              <i class="fa fa-arrow-left icon" aria-hidden="true"></i>
            </div>
            <div class="btn_area" @click="signOut">
              <i class="fa fa-power-off icon" aria-hidden="true"></i>
            </div>
          </div>
        </transition>
        <transition name="el-zoom-in-center">
          <div v-show="!show_btns" class="left_bottom" @mouseover="show_btns = true">
              <div class="username">
                  {{user_name}}
              </div>
          </div>
        </transition>
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
            user_name: '',
            show_btns: false,
            submenu_openeds: []
        }
    },
    mounted() {
        this.user_name = JSON.parse(localStorage.getItem('adminInfo')).username
    },
    methods: {
        goToGoushuyun() {
            window.open('http://www.goushuyun.com')
        },
        menuSelect(index) {
            this.$store.commit('setMenuActive', index)
            localStorage.setItem('menu_active', index)
            // 点击首页时，关闭原页面导航栏
            if (index == '0') {
                this.submenu_openeds = []
            }
        },
        goToCloudStore() {
            this.$store.commit('setMenuActive', '5-1')
            localStorage.setItem('menu_active', '5-1')
            this.$router.push({
                name: 'cloud_store'
            })
        },
        goToshops() {
            this.$store.commit('setMenuActive', '0')
            localStorage.setItem('menu_active', '0')
            this.$router.push({
                name: 'shops'
            })
        },
        signOut() {
            this.$confirm('确定要退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                localStorage.clear()
                this.$store.commit('reset', {})
                this.$router.push({
                    name: 'login'
                })
            }).catch(() => {

            });
        }
    },
    computed: {
        store_logo() {
            let vuex_logo = this.$store.state.store_logo
            let local_logo = localStorage.getItem('store_logo')
            if (vuex_logo) {
                return 'http://onv8eua8j.bkt.clouddn.com/' + vuex_logo
            } else if (local_logo) {
                return 'http://onv8eua8j.bkt.clouddn.com/' + local_logo
            } else {
                return 'http://okxy9gsls.bkt.clouddn.com/cloudshoplogo1.png'
            }
        },
        store_name() {
            let vuex_name = this.$store.state.store_name
            let local_name = localStorage.getItem('store_name')
            if (vuex_name) {
                return vuex_name
            } else if (local_name) {
                return local_name
            } else {
                return '购书云'
            }
        },
        menu_active() {
            let vuex_active = this.$store.state.menu_active
            let local_active = localStorage.getItem('menu_active')
            if (vuex_active) {
                return vuex_active
            } else if (local_active) {
                return local_active
            } else {
                return '0'
            }
        }
    }
}
</script>
