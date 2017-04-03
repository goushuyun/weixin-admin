<style lang="scss" scoped>

.tabs{
    background-color: white;
}

</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">店铺信息</h2>
    </div>

    <div class="content_inner">
        <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="云店信息" name="first"></el-tab-pane>
            <el-tab-pane label="实体店信息" name="second"></el-tab-pane>
        </el-tabs>

        <section>
            <router-view></router-view>
        </section>


    </div>
</div>

</template>

<script>

export default {
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
