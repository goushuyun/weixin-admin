<style lang="scss" scoped>
@import "../../common/_color.scss";
.form{
    max-width: 400px;
    margin-top: 18px;
}

.upload_box{
    display: flex;
    padding-left: 41px;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 42px;
}

.download{
    color: $blue;
    &:hover{
        cursor: pointer;
    }
}
</style>

<template lang="html">
<div class="container">
    <div class="top_bar">
        <h2 class="title">Excel 导入</h2>
    </div>

    <div class="content_inner">
        <div class="upload_box">
            <el-upload
                :data="upload_params"
                class="upload-demo"
                :before-upload="pre_check"
                drag
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                action="https://upload.qbox.me"
                :multiple="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">每次只能上传一个 xlsx 文件，且不超过 2M
                    <a href="http://image.goushuyun.cn/DemoExcel.xlsx" class="download"> (下载Excel数据模版）</a>
                </div>
            </el-upload>

            <el-button @click="go_back" type="text" icon="arrow-left">返回上一页</el-button>
        </div>
        <!--  表单 -->
        <div class="form">
            <el-form label-width="80px">
                <el-form-item label="折扣">
                    <el-input v-model.number="discount" size="small" style="max-width: 193px;">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-cascader v-model="location" :options="location_options"></option>

                    </el-cascader>
                </el-form-item>
                <el-form-item label="新旧">
                    <el-radio-group size="small" v-model="type" >
                        <el-radio :label="0">新书</el-radio>
                        <el-radio :label="1">二手书</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="upload_to_cloud">导入</el-button>
                    <el-button size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>


</div>

</template>

<script>
import mix from './upload.js'

export default {
    mixins: [mix],
    data(){
        return {
            // goods info
            discount: 0,
            origin_filename: '',
            type: 1,

            location: [],
            location_options: [],

            store: {
                id: ''
            },
            upload_params: {
                key: '',
                token: '',
                zone: 1,
                url: ''
            }

        }
    }
}

</script>
