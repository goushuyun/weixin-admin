<template lang="html">
  <div class="body">
    <div v-for="(rs,index) in real_stores" class="box-card" @click="updateRealStore(index)">
      <div class="item">实体店名：{{rs.name}}</div>
      <div class="item">店铺地址：{{rs.addressStr}}</div>
      <div style="text-align:right"><el-button style="color:#FF4949;" type="text" @click.stop="deleteRealStore">删除</el-button></div>
    </div>

    <div class="box-card" @click="preAddRealStore">
      <el-button style="width:100%" type="text">新增店铺</el-button>
    </div>

    <el-dialog title="实体店信息" @close="cancelAddRealStore" v-model="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item prop="name" label="店铺名称：">
            <el-input size="small" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="店铺地址：">
            <div id="distpicker" data-toggle="distpicker" data-autoselect="3">
              <select id="province" class="distpicker"></select>
              <select id="city" class="distpicker"></select>
              <select id="district" class="distpicker"></select>
              <el-input size="small" placeholder="请填写具体地址" v-model="form.address"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="店铺头像：">
            <el-upload
              action="http://upload.qiniu.com/"
              :data="imagesFormData"
              list-type="picture-card"
              :file-list="picture_list"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="">
            <p>请添加正方形照片，最多三张</p>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRealStore">取 消</el-button>
        <el-button type="primary" :loading="btn_loading" @click="confirmAddRealStore('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "../../scripts/http"
export default {
    data() {
        return {
            /* 实体店列表 */
            picture_list: [],
            real_stores: [],

            btn_loading: false,
            dialogFormVisible: false,

            /* 创建实体店时提交的数据 */
            form: {
                name: '',
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
            },

            /* 上传图片的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },
            images: []
        };
    },
    mounted() {
        var store = this.$store.getters.getCurrentStore
        this.form.store_id = store.id
        this.getRealStores()
    },
    methods: {
        updateRealStore(index) {
          console.log(this.real_stores);
          console.log(index);
            var store = this.real_stores[index]
            this.form.name = store.name
            this.form.province_code = store.province_code
            this.form.city_code = store.city_code
            this.form.scope_code = store.scope_code
            this.form.address = store.address
            this.form.images = store.images
            this.form.store_id = store.store_id

            this.dialogFormVisible = true
        },
        getRealStores() {
            var self = this
            axios.post('/v1/store/real_stores', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    self.real_stores = resp.data.data.map(rs => {
                        var province = $().distpicker('getDistricts', rs.province_code)
                        var city = $().distpicker('getDistricts', rs.city_code)
                        var scope = $().distpicker('getDistricts', rs.scope_code)
                        rs.addressStr = province + ' | ' + city + ' | ' + scope + ' | ' + rs.address
                        return rs
                    })
                }
            }).catch(() => {
                return false
            });
        },
        getToken() {
            let key = '/store_' + this.form.store_id + '/real_shop_' + moment().unix() + '.png'
            //获取token
            axios.post('/v1/mediastore/get_upload_token', {
                zone: 0,
                key
            }).then(resp => {
                this.imagesFormData.key = key
                this.imagesFormData.token = resp.data.data.token
                return true
            }).catch(() => {
                return false
            });
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file, fileList) {
            var self = this
            self.images = []
            fileList.forEach(f => {
                self.images.push(f.response.key)
            })
            console.log(self.picture_list);
            self.getToken()
        },
        handleAvatarError(err, file, fileList) {
            this.getToken()
        },
        handleRemove(file, fileList) {
            var self = this
            self.images = []
            fileList.forEach(f => {
                self.images.push(f.response.key)
            })
            self.getToken()
        },
        preAddRealStore() {
            var self = this
            self.dialogFormVisible = true
            setTimeout(function() {
                self.distpicker()
                self.getToken()
            }, 100)
        },
        confirmAddRealStore(formName) {
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
            if (self.images.length == 0) {
                self.$message.warning("请上传至少一张图片")
                return
            }
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.btn_loading = true
                    self.form.images = JSON.stringify(self.images)
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
        cancelAddRealStore() {
            this.dialogFormVisible = false
            this.images = []
        },
        distpicker() {
            $('.el-form-item #distpicker').distpicker();
        },
        getDistpickerValue() {
            this.form.province_code = $('#distpicker #province').find('option:selected').attr('data-code')
            this.form.city_code = $('#distpicker #city').find('option:selected').attr('data-code')
            this.form.scope_code = $('#distpicker #district').find('option:selected').attr('data-code')
        },
        deleteRealStore() {
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
