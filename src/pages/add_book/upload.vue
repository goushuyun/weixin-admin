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
                :on-success="on_upload_success"
                :on-error="on_upload_error"
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
        <el-form :rules="rules" :model="ruleForm" label-width="100px" class="form" ref="ruleForm">
            <el-form-item label="折扣" prop="discount">
                <el-input placeholder="百分比值" v-model.number="ruleForm.discount" size="small" style="max-width: 193px;">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>

            <el-form-item label="位置" prop="location">
                <el-cascader v-model="ruleForm.location" :options="location_options">

                </el-cascader>
            </el-form-item>

            <el-form-item label="新旧" prop="type">
                <el-radio-group size="small" v-model="ruleForm.type">
                    <el-radio :label="0">新书</el-radio>
                    <el-radio :label="1">二手书</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button :loading="is_uploading" type="primary" size="small" @click="upload_to_cloud('ruleForm')">导入</el-button>
                <el-button size="small">取消</el-button>
            </el-form-item>
        </el-form>
    </div>


</div>

</template>

<script>
import mix from './upload.js'

export default {
    mixins: [mix],
    data(){
        return {
            is_uploading: false,

            ruleForm: {
                discount: '',
                location: [],
                type: 1
            },

            rules: {
                discount: [
                    {required: true, message: '请填写商品折扣'},
                    {type: 'number', message: '折扣必须为整数'}
                ],
                location: [
                    {required: true, type: 'array', message: '请填写库存位置'}
                ],
                type: [
                    {required: true, type: 'number'}
                ]
            },

            // goods info
            origin_filename: '',
            uploaded_file_url: '',
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
