<style lang="scss" scoped>
.tabs {
    background-color: white;
}

section {
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
            <el-tab-pane label="人员管理" name="people"></el-tab-pane>
            <el-tab-pane label="经营学校" name="school"></el-tab-pane>
            <el-tab-pane label="仓库设置" name="location"></el-tab-pane>
            <el-tab-pane label="配送费设置" name="freight"></el-tab-pane>
            <el-tab-pane label="客服、售后设置" name="service"></el-tab-pane>
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
    data() {
        return {
            activeName: 'location'
        };
    },
    mounted() {

    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name
            switch (tab.name) {
                case 'people':
                    this.$router.push('people')
                    break;
                case 'school':
                    this.$router.push('school')
                    break;
                case 'location':
                    this.$router.push('location')
                    break;
                case 'freight':
                    this.$router.push('freight')
                    break;
                case 'service':
                    this.$router.push('service')
                    break;
                default:
                    this.$router.push('location')
            }
        }
    }
}
</script>
