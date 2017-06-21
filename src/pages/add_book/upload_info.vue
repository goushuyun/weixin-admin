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
        color: #E35154;
        text-align: right;
    }

}

</style>

<template lang="html">

<div id="upload_info">
    <div class="steps">
        <el-steps :space="100" :active="step" finish-status="finish" process-status="wait">
            <el-step title="导入数据" icon="document"></el-step>
            <el-step title="同步至云端" icon="upload"></el-step>
            <el-step v-if="data.state === 3" title="导入完成" icon="check" state="finish"></el-step>
            <el-step v-if="data.state === 2" title="导入失败" icon="warning" status="error"></el-step>
        </el-steps>
    </div>


    <ul class="info">
        <li class="item">
            <span class="key">导入时间：</span>
            <span class="value">{{data.create_at_text}}</span>
        </li>
        <li class="item">
            <span class="key">导入文件：</span>
            <span class="value">{{data.origin_filename}}</span>
        </li>
        <li class="item">
            <span class="key">折扣：</span>
            <span class="value">{{data.discount}}折</span>
        </li>
        <li class="item">
            <span class="key">新旧：</span>
            <span class="value">{{data.type === 1 ? '二手书':'新书'}}</span>
        </li>
        <li class="item">
            <span class="key">位置：</span>
            <span class="value">{{data.storehouse_name + ' / ' + data.shelf_name + ' / ' + data.floor_name}}</span>
        </li>
    </ul>

    <h5 class="info_alert" v-if="data.error_reason != ''">{{data.error_reason}}</h5>
</div>

</template>

<script>

export default {
    props: ['data'],

    data(){
        return {
            step: 1
        }
    },
    created(){
        if(this.data.state > 1) this.step = 3
    }
}

</script>
