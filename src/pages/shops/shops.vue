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
            <li class="shop">
                <h3 class="shop_name">购书宝（应技大）</h3>
                <p class="create_at">创建于：2017-5-31</p>
                <p style="text-align: right; ">
                    <el-button style="font-size: 12px;" type="text">删除</el-button>
                </p>
            </li>
            <li class="shop">
                <h3 class="shop_name">购书宝（应技大）</h3>
                <p class="create_at">创建于：2017-5-31</p>
                <p style="text-align: right; ">
                    <el-button style="font-size: 12px;" type="text">删除</el-button>
                </p>
            </li>

            <li class="add_btn" @click="add_shop">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </li>
        </ul>
    </section>


</div>

</template>

<script>
import axios from '../../scripts/http.js'
export default {
    methods: {
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
