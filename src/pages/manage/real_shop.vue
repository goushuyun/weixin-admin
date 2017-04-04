<template lang="html">
  <div class="body">
    <div class="box-card" @click="">
      <div class="item">实体店名：购书云</div>
      <div class="item">店铺地址：北京市 | 北京市 | 门头沟区 | 军庄中心灰屿小学前100米</div>
      <div style="text-align:right"><el-button style="color:#FF4949;" type="text" @click.stop="deleteRealShop">删除</el-button></div>
    </div>

    <div class="box-card" @click="preAddRealShop">
      <el-button style="width:100%" type="text">新增店铺</el-button>
    </div>

    <el-dialog title="实体店信息" v-model="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item prop="shop_name" label="店铺名称：">
            <el-input size="small" v-model="form.shop_name"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="店铺地址：">
            <div id="distpicker" data-toggle="distpicker" data-valueType="code" data-autoselect="3">
              <select id="province" class="distpicker"></select>
              <select id="city" class="distpicker"></select>
              <select id="district" class="distpicker"></select>
              <el-input size="small" placeholder="请填写具体地址" v-model="form.address"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="店铺头像：">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="">
            <p>请添加正方形照片，最多三张</p>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRealShop">取 消</el-button>
        <el-button type="primary" :loading="btn_loading" @click="confirmAddRealShop('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "../../scripts/http"
export default {
    data() {
        return {
            btn_loading: false,
            dialogFormVisible: false,

            dialogImageUrl: '',

            form: {
                shop_name: '',
                province_code: '',
                city_code: '',
                scope_code: '',
                address: '',
                images: '',
                store_id: ''
            },

            rules: {
                address: [{
                    required: true,
                    message: '请输入详细地址',
                    trigger: 'blur'
                }],
                shop_name: [{
                        required: true,
                        message: '请输入实体店名称',
                        trigger: 'blur'
                    },
                    {
                        max: 20,
                        message: '长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    mounted() {
        this.form.store_id = localStorage.store_id
    },
    methods: {
        showLog() {
            console.log('123456789');
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        preAddRealShop() {
            var self = this
            self.dialogFormVisible = true
            setTimeout(function() {
                self.distpicker()
            }, 100)
        },
        confirmAddRealShop(formName) {
          var self = this
          self.getDistpickerValue()
          if (!self.form.province_code) {
            self.$message.warning("请选择省份")
            return
          }
          if (!self.form.city_code) {
            self.$message.warning("请选择城市")
            return
          }
          if (!self.form.scope_code) {
            self.$message.warning("请选择县区")
            return
          }
          self.$refs[formName].validate((valid) => {
              if (valid) {
                  self.btn_loading = true
                  var data = self.form
                  axios.post('/v1/store/add_real_store', data).then(resp => {
                      if (resp.data.message == 'ok') {
                          self.$message.success('实体店创建成功')
                      }
                      this.btn_loading = false
                      self.dialogFormVisible = false
                  })
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
        },
        cancelAddRealShop() {
            this.dialogFormVisible = false
        },
        distpicker() {
            $('.el-form-item #distpicker').distpicker();
        },
        getDistpickerValue() {
            this.form.province_code = $('#distpicker #province').find('option:selected').attr('data-code')
            this.form.city_code = $('#distpicker #city').find('option:selected').attr('data-code')
            this.form.scope_code = $('#distpicker #district').find('option:selected').attr('data-code')
        },
        deleteRealShop() {
            this.$confirm('此操作将永久删除该实体店, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style lang="scss">@import "../../common/_color.scss";
.body {
    background-color: white;
    padding: 16px;
}

.item {
    padding: 18px 0;
}

.box-card {
    font-size: 14px;
    width: 480px;
    margin: 10px;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #D1DBE5;
    box-shadow: 0 0 10px rgba(0, 0, 0,.1);
    &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0,.3);
    }
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

.el-form {
    padding: 16px 10px;
    .el-input {
        width: 20%;
        min-width: 200px;
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
}
</style>
