<style lang="scss" scoped>

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

</style>

<template lang="html">
<div class="container">
    <div class="top_bar">
        <h2 class="title">Excel 导入</h2>
    </div>

    <div class="content_inner">
        <div class="upload_box">
            <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传 xlsx 文件，且不超过500kb</div>
            </el-upload>

            <el-button @click="go_back" type="text" icon="arrow-left">返回上一页</el-button>
        </div>
        <!--  表单 -->
        <div class="form">
            <el-form label-width="80px">
                <el-form-item label="折扣">
                    <el-input size="small" style="max-width: 193px;">
                        <template slot="append">折</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="位置">
                    <el-cascader size="small">

                    </el-cascader>
                </el-form-item>
                <el-form-item label="新旧">
                    <el-radio-group size="small">
                        <el-radio label="新书"></el-radio>
                        <el-radio label="二手书"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small">导入</el-button>
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
    mixins: [mix]
}

</script>
