<style lang="scss" scoped>
@import "../../common/_color.scss";
.container{
    padding-top: 200px;
}
.box{
    width: 400px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $bg_grey;
    color: $weixin_green;
    padding: 42px 22px;
    border-radius: 6px;
    i{
        font-size: 32px;
    }
    h1{
        margin-top: 18px;
        font-size: 22px;
        line-height: 36px;
    }
    p{
        color: $font_lightest;
        font-size: 12px;
        line-height: 32px;
        span{
            color: $jd_red;
            padding: 0 2px;
        }
    }
}
.bottom_bar {
    padding-top: 42px;
    width: 100%;
    text-align: center;
    height: 128px;
    color: #888;
    font-size: 13px;
    line-height: 128px;
}

</style>

<template lang="html">

<div class="container">
    <div class="box">
        <i class="el-icon-circle-check"></i>
        <h1>恭喜，授权成功</h1>
        <p>本页将在 <span>{{second}}</span> 秒后自动关闭</p>
    </div>
    <el-row class="bottom_bar">
        <el-col :span="24">© 2017 购书云 版权所有 沪ICP备15022838号-2 </el-col>
    </el-row>
</div>

</template>

<script>

export default {
    data(){
        return {
            second: 2,
            url: ''
        }
    },
    created(){
        // 获取url参数，解析并发起请求
        let url = window.location.href
        let auth_code = url.split('?')[1].split('&')[0].split('=')[1]
        // 发起请求，获取公众号信息
        axios.post('/v1/weixin/get_api_query_auth', {auth_code}).then(res=>{
            // do nothing
        })
        console.log(auth_code);
    },
    mounted(){
        // 做倒计时，5秒后关闭当前页
        setInterval(()=>{
            if(--this.second == 0){
                console.log('kaiakia');
                window.close()
            }
        }, 1000)
    }
}

</script>
