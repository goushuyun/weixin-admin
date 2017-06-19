<style lang="scss" scoped>
@import "../../common/_color.scss";
#upload_info{
    .steps{
        margin-bottom: 16px;
    }
    .el-steps{
        text-align: center;
    }

    ul.info {
        border: 1px solid $border_grey;
        padding: 10px 16px;
        background-color: #F6F8FA;
        border-radius: 6px;

        li.item{
            display: flex;
            align-items: flex-start;
            line-height: 30px;
            span.key{
                min-width: 80px;
                // text-align: right;
            }

            span.value{
                // padding-left: 16px;
                flex-grow: 1;
            }

        }
    }

    h5.info_alert{
        margin-top: 8px;
        font-size: 14px;
        line-height: 46px;
        color: #1E90D1;
        text-align: right;
    }

}

</style>

<template lang="html">

<div id="upload_info">
    <div class="steps">
        <el-steps :space="100" :active="1">
            <el-step title="导入数据" icon="document"></el-step>
            <el-step title="同步至云端" icon="upload"></el-step>
            <el-step title="导入完成" icon="check"></el-step>
        </el-steps>
    </div>


    <ul class="info">
        <li class="item">
            <span class="key">导入时间：</span>
            <span class="value">2017-12-3 12:23:37</span>
        </li>
        <li class="item">
            <span class="key">导入文件：</span>
            <span class="value">上海应用技术大学.xml</span>
        </li>
        <li class="item">
            <span class="key">折扣：</span>
            <span class="value">3折</span>
        </li>
        <li class="item">
            <span class="key">新旧：</span>
            <span class="value">旧书</span>
        </li>
        <li class="item">
            <span class="key">位置：</span>
            <span class="value">一号仓库 -> 一号货架 -> 一层</span>
        </li>
    </ul>

    <h5 class="info_alert">导入数据失败，请重新导入。</h5>
</div>

</template>

<script>

export default {}

</script>
