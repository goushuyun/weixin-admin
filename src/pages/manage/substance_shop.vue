<template lang="html">
  <div class="body">
    <el-card class="box-card">
      <div class="text item">实体店名：购书云</div>
      <div class="text item">店铺地址：北京市 | 北京市 | 门头沟区 | 军庄中心灰屿小学前100米</div>
    </el-card>
    <el-card class="box-card">
      <div class="text item">实体店名：购书云</div>
      <div class="text item">店铺地址：北京市 | 北京市 | 门头沟区 | 军庄中心灰屿小学前100米</div>
    </el-card>
    <el-card class="box-card">
      <el-button style="width:100%" type="text" @click="addSubstanceShop">新增店铺</el-button>
    </el-card>

    <el-dialog title="收货地址" v-model="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="110px">
          <el-form-item label="店铺名称：">
            <el-input size="small" v-model="form.shop_name"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址：">
            <div id="distpicker" data-toggle="distpicker" data-autoselect="3">
              <select class="distpicker"></select>
              <select class="distpicker"></select>
              <select class="distpicker"></select>
              <el-input size="small" placeholder="请填写具体地址" v-model="form.address.detail"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="店铺头像：">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="">
            <p>请添加正方形照片，最多三张</p>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible: false,

            dialogImageUrl: '',
            dialogVisible: false,

            form: {
                shop_name: '',
                address: {
                    province: '',
                    city: '',
                    district: '',
                    detail: ''
                }
            }
        };
    },
    mounted() {
        // this.distpicker()
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        addSubstanceShop() {
            var self = this
            self.dialogFormVisible = true
            setTimeout(function(){
              self.distpicker()
            },100)
        },
        distpicker() {
            $('.el-form-item #distpicker').distpicker();
        },
    }
}
</script>

<style lang="scss">@import "../../common/_color.scss";
.body {
    background-color: white;
    padding: 16px;
}
.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 480px;
    margin: 10px;
}
.add {
    font-size: 50px;
    background-color: white;
    line-height: 100px;
    text-align: center;
    color: $bg_grey;
    &:hover {
        color: lighten($blue, 12%);
        cursor: pointer;
        border: 1px solid lighten($blue, 16%);
    }
}
.avatar-uploader {
    border: 1px dashed #bfcbd9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 160px;
    height: 160px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 160px;
    text-align: center;
}
.avatar {
    width: 160px;
    height: 160px;
    display: block;
}

.el-form {
    background-color: white;
    padding: 16px 10px;
    .el-input,
    .el-textarea {
        width: 300px;
        margin-right: 10px;
    }
}
.distpicker {
    height: 30px;
    line-height: 13px;
    font-style: 13px;
    padding: 3px 10px;
    border-radius: 4px;
    border: 1px solid #BFCBD9;
}</style>
