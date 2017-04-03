<style lang="scss" scoped>

.tabs{
    background-color: white;
}

section{
    margin-top: 8px;
}
</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">店铺设置</h2>
    </div>

    <div class="content_inner">
        <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="经营学校" name="first"></el-tab-pane>
            <el-tab-pane label="仓库管理" name="second"></el-tab-pane>
            <el-tab-pane label="人员管理" name="scond"></el-tab-pane>
        </el-tabs>
        <section>
            <router-view></router-view>
        </section>
    </div>

</div>

</template>

<script>

export default {
    // 页面渲染完成后，切到 school 路由
    mounted(){
        // this.$router.push({name: 'school'})


        console.log('Kai');
    },



    data() {
        return {
            activeName: 'second'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

</script>
