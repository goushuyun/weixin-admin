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
            <el-table-column label="导入时间">
                <template scope="scope">
                    {{scope.row.create_at_text}}
                </template>
            </el-table-column>
            <el-table-column label="文件" width="150px">
                <template scope="scope">
                    <el-button @click="download(scope.row.origin_file)" size="small" type="text" icon=""><i class="fa fa-cloud-download" aria-hidden="true"></i> {{scope.row.origin_filename}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="失败数据">
                <template scope="scope">
                    <el-button @click="download('http://images.goushuyun.cn/' + scope.row.error_file)" v-if="scope.row.error_file != ''" style="color: #F7BA2A;" size="small" type="text"><i class="fa fa-download" aria-hidden="true"></i> 下载失败数据</el-button>

                    <!-- import fail, and no fail data -->
                    <span v-if="scope.row.error_reason != ''" class="fail_no_data">{{scope.row.error_reason}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="进度" width="200px">
                <template scope="scope">
                    <el-tooltip :content="scope.row.tip_text" placement="left">

                        <ul class="icons">
                            <li><i class="fa fa-file-excel-o" aria-hidden="true"></i></li>
                            <li class="arrow_complete">--></li>
                            <li><i style="color: #20A0FF;" class="fa fa-cloud-upload" aria-hidden="true"></i></li>
                            <li v-if="scope.row.state > 1" class="arrow_complete">--></li>
                            <li v-if="scope.row.state === 3"><i class="fa fa-check" aria-hidden="true"></i></li>
                            <li v-if="scope.row.state === 2"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></li>
                        </ul>

                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="详情">
                <template scope="scope">
                    <el-button size="small" type="text" @click="view_detail(scope.$index)">查看详情</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <el-pagination style="margin-top: 16px;"
          :page-sizes="[10, 20, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

        <!-- 上传详情弹框 -->
        <el-dialog title="上传进度" close-on-click-modal :visible="dialog_show" :show-close="false">
            <detail :data="dialog_data"></detail>
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
            page: 1,
            size: 10,
            total: 0,

            data: [],

            dialog_data: {},

            dialog_show: false
        }
    }
}

</script>
