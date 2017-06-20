<style lang="scss" scoped>

@import "./excel_upload.scss";

</style>

<template lang="html">
<div class="container">
    <div class="top_bar">
        <h2 class="title">Excel 批量导入</h2>
    </div>

    <!-- 内容 -->
    <div class="content_inner">
        <p style="padding-bottom: 16px; text-align: right; padding-right: 22px;">
            <el-button @click="to_upload" size="small" type="primary"><i class="fa fa-cloud-upload" aria-hidden="true"></i> 导入新数据</el-button>
        </p>

        <!-- table data list -->
        <el-table :data="data">
            <el-table-column prop="time" label="导入时间"></el-table-column>
            <el-table-column prop="file" label="文件">
                <template scope="scope">
                    <el-button size="small" type="text" icon=""><i class="fa fa-cloud-download" aria-hidden="true"></i> 上海应用技术大学.xlsx</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="失败数据">
                <template scope="scope">
                    <el-button style="color: #F7BA2A;" size="small" type="text" icon=""><i class="fa fa-download" aria-hidden="true"></i> 下载失败数据</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="进度">
                <template scope="scope">
                    <el-tooltip content="正在上传" placement="left">

                        <ul class="icons">
                            <li><i class="fa fa-file-excel-o" aria-hidden="true"></i></li>
                            <li class="arrow_complete">--></li>


                            <li><i style="color: #20A0FF;" class="fa fa-cloud-upload" aria-hidden="true"></i></li>
                            <li class="arrow_no">--></li>
                            <li><i class="fa fa-check will" aria-hidden="true"></i></li>
                            <!-- <li><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></li> -->
                        </ul>

                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="详情">
                <template scope="scope">
                    <el-button size="small" type="text" @click="view_detail">查看详情</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <el-pagination style="margin-top: 16px;"
          :page-sizes="[10, 20, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>

        <!-- 上传详情弹框 -->
        <el-dialog title="上传进度" :visible="dialog_show" :show-close="false">
            <detail></detail>
            <span slot="footer" class="dialog-footer">
                <el-button  size="small" type="primary" @click="dialog_show = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</div>


</template>

<script>
import detail from './upload_info';
import mix from './excel_upload.js';
export default {
    mixins: [mix],
    components: {
        detail
    },


    data(){
        return {
            data: [
                {time: '2017-12-23 12:34:34', file: '新华出版社.xls', fail_data: '下载失败数据'}, {time: '2017-12-23 12:34:34', file: '新华出版社.xls', fail_data: '下载失败数据'}
            ],

            dialog_show: false
        }
    }
}

</script>
