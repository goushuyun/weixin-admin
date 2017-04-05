<style lang="scss" scoped>

@import "./shops.scss";
.container {
    background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}

div.top_bar {
    background-color: white;
    border-bottom: 3px solid $blue;
    .top_content {
        width: 700px;
        margin: 0 auto;
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
    </div>

    <section class="main">
        <ul class="shops">
            <li v-for="store in stores" class="shop" @click="into_store(store)">
                <h3 class="shop_name">{{store.name}}</h3>
                <p class="create_at">到期于：{{store.expire_at}}</p>
                <p style="text-align: right; ">
                    <el-button style="font-size: 12px;" type="text">删除</el-button>
                </p>
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
import axios from '../../scripts/http.js'
export default {
    data(){
        return {
            stores: []
        }
    },
    created(){
        console.log('created !');
        console.log(this.$store.state.adminInfo);
    },

    computed:{
        info(){
            return this.$store.state.adminInfo
        }
    },

    mounted(){
        // get seller's stores
        axios.post('/v1/seller/self_stores', {}).then(resp=>{
            this.stores = resp.data.data.map(val=>{
                val.create_at = moment.unix(val.create_at).format('YYYY-MM-DD')
                val.expire_at = moment.unix(val.expire_at).format('YYYY-MM-DD')
                return val
            })
        })

        this.$store.commit('setAdminInfo', 'WangKai')


    },

    methods: {
        // go into shop
        into_store(store){
            // put store info into localstorage
            localStorage.setItem('store', JSON.stringify(store))
            this.$router.push("admin")
            console.log(store);
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
                    console.log(resp.data);
                })

                console.log(value);


                // this.$message({
                //     type: 'success',
                //     message: '你的邮箱是: ' + value
                // });
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
