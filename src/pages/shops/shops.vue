<style lang="scss" scoped>

@import "./shops.scss";
.container {
    background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}

div.top_bar {
    background-color: white;
    border-bottom: 3px solid $blue;
    .top_content {
        margin-left: 70px;
        padding: 12px 0;
        display: flex;
        align-items: center;
        .logo {
            width: 38px;
            height: 38px;
        }
        h4.title {
            display: inline-block;
            margin-left: 18px;
        }
    }
    .menu_content {
        position: absolute;
        right: 100px;
        top: 26px;
        span {
            font-size: 16px;
            color: #20A0FF;
            cursor: pointer;
        }
    }
}

</style>

<template lang="html">

<div class="container">
    <!-- 上方标题栏 -->
    <div class="top_bar">
        <div class="top_content">
            <img class="logo" src="../../images/logo.png">
            <h4 class="title">购书云</h4>
        </div>
        <div class="menu_content">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">{{user_name}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="signOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
    </div>

    <section class="main">
        <ul class="shops">
            <li v-for="store in stores" class="shop" @click="into_store(store.id)" @mouseover="store.active = true" @mouseleave="store.active = false">
                <p class="shop_name">{{store.name}}</p>
                <p class="shop_id">ID：{{store.id}}</p>
                <p v-if="!store.is_expire" class="create_at">到期于：{{store.expire_at}}</p>
                <p v-else class="create_at" style="color:#FF4949">已到期：{{store.expire_at}}</p>
                <!-- <p class="operate" v-show="store.active">
                    <el-button style="font-size: 12px;" type="text">删除</el-button>
                </p> -->
            </li>
            <li class="add_btn" @click="add_shop">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <p class="remark">添加云店铺</p>
            </li>
        </ul>
    </section>
</div>

</template>

<script>

$('li.shop').mouseenter(function(){
    console.log('asdfasdf');
})


import axios from '../../scripts/http.js'
export default {
    data(){
        return {
            active: false,
            user_name: '',
            stores: []
        }
    },
    computed:{
        info(){
            return this.$store.state.adminInfo
        }
    },

    mounted(){
        this.user_name = JSON.parse(localStorage.getItem('adminInfo')).username
        var today = moment().format('YYYY-MM-DD');
        // get seller's stores
        axios.post('/v1/seller/self_stores', {}).then(resp=>{
            this.stores = resp.data.data.map(val=>{
                val.active = false

                // val.create_at = moment.unix(val.create_at).format('YYYY-MM-DD')
                val.expire_at = moment.unix(val.expire_at).format('YYYY-MM-DD')

                // 判断店铺是否已过期，以截止日期的24点为准
                if (val.expire_at < today) {
                    val.is_expire = true
                } else {
                    val.is_expire = false
                }
                return val
            })
        })
    },

    methods: {
        // delete store
        del_store(){

        },

        handleCommand(command) {
            if (command == 'signOut') {
                this.signOut()
            }
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
        },
        // go into shop
        into_store(id){
            // put store info into localstorage
            axios.post('/v1/store/enter_store', {id}).then(resp=>{
                let store = resp.data.data
                this.$store.commit('setCurrentStore', store)

                // 将云店logo和云店名称保存到vuex中
                this.$store.commit('setStoreLogo', store.logo)
                this.$store.commit('setStoreName', store.name)

                localStorage.setItem('store', JSON.stringify(store))

                // 将云店logo和云店名称保存到缓存中
                localStorage.setItem('store_logo', store.logo)
                localStorage.setItem('store_name', store.name)

                // change token
                localStorage.setItem('token', resp.data.token)

                this.$router.push({name:"home"})
            })
        },

        add_shop() {
            this.$prompt('请输入店铺名称', '店铺名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({
                value
            }) => {
                // add store
                let name = value.trim()
                axios.post('/v1/store/add', {name}).then(resp=>{
                    // modify expire_at
                    let store = resp.data.data
                    store.expire_at = moment.unix(store.expire_at).format('YYYY-MM-DD')
                    store.create_at = moment.unix(store.create_at).format('YYYY-MM-DD')

                    // push new store into array
                    this.stores.push(store)

                    this.$message({
                        type: 'success',
                        message: '云店铺 ' + name + ' 添加成功！'
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }
    }
}

</script>
