<template lang="html">
  <div class="body">
    <div v-for="(store,index) in real_stores" class="box-card" @click="preUpdateRealStore(index)" @mouseover="store.active = true" @mouseleave="store.active = false">
      <div class="item">实体店名称：{{store.name}}</div>
      <div class="item">实体店地址：{{store.address}}</div>
      <div class="delete_btn" style="text-align:right">
        <!-- <el-button v-show="store.active" style="color:#FF4949;" type="text" @click.stop="deleteRealStore">删除</el-button> -->
        <i v-show="store.active" style="color:#FF4949;" class="el-icon-delete2" @click.stop="deleteRealStore(index)"></i>
      </div>
    </div>

    <div class="box-card" @click="preAddRealStore">
      <el-button style="width:100%" type="text">新增实体店</el-button>
    </div>

    <el-dialog title="实体店信息" @close="closeDialog" v-model="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item prop="name" label="实体店名称：">
            <el-input size="small" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="address_detail" label="实体店地址：">
            <div id="distpicker" data-toggle="distpicker">
              <select id="province" class="distpicker"></select>
              <select id="city" class="distpicker"></select>
              <select id="district" class="distpicker"></select>
              <el-input size="small" placeholder="请填写具体地址" v-model="form.address_detail"></el-input>
            </div>
          </el-form-item>
          <!-- :file-list="fileList" -->
          <el-form-item prop="images" label="实体店图片：">
            <el-upload
              action="http://upload.qiniu.com/"
              :data="imagesFormData"
              list-type="picture-card"
              :file-list="fileList"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="">
            <p>请添加正方形照片，最多三张。只能上传jpg/png文件，且不超过500kb</p>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="add_update=='add'" type="primary" :loading="btn_loading" @click="confirmAddRealStore('form')">确定添加</el-button>
        <el-button v-if="add_update=='update'" type="primary" :loading="btn_loading" @click="confirmUpdateRealStore('form')">确定更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from "../../scripts/http"
export default {
    data() {
        return {
            active: false,
            add_update: '',
            /* 实体店列表 */
            real_stores: [],

            btn_loading: false,
            dialogFormVisible: false,

            fileList: [],
            /* 创建实体店时提交的数据 */
            form: {
                name: '',
                province_code: '',
                province_text: '',

                city_code: '',
                city_text: '',

                scope_code: '',
                scope_text: '',

                address_detail: '',
                address: '',

                images: '',
                imagesArray: [],

                id: ''
            },

            rules: {
                address_detail: [{
                    required: true,
                    message: '请输入详细地址',
                    trigger: 'blur'
                }],
                name: [{
                        required: true,
                        message: '请输入实体店名称',
                        trigger: 'blur'
                    },
                    {
                        max: 20,
                        message: '长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                images: [{
                    required: true,
                    message: '请选择至少一张照片',
                    trigger: 'blur'
                }]
            },

            /* 上传图片的数据 */
            imagesFormData: {
                key: '',
                token: ''
            }
        };
    },
    mounted() {
        this.getRealStores()
    },
    methods: {
        preUpdateRealStore(index) {
            var self = this
            var store = self.real_stores[index]
            self.form.id = store.id
            self.form.name = store.name
            self.form.images = store.images
            self.form.address = store.address

            self.getAddress2Array()
            self.getImages2Array()

            self.add_update = 'update'
            self.dialogFormVisible = true
            this.$nextTick(() => {
                self.distpicker()
                self.getToken()
            })
        },
        confirmUpdateRealStore(formName) {
            var self = this
            self.getDistpickerValue()
            self.getImages2String()
            self.$refs[formName].validate((valid) => {
                if (valid) {
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
                    self.btn_loading = true
                    self.getAddress2String()
                    axios.post('/v1/store/update_real_store', self.form).then(resp => {
                        if (resp.data.message == 'ok') {
                            self.$message.success('实体店更新成功')
                        }
                        self.dialogFormVisible = false
                        self.getRealStores()
                    }).catch(() => {
                        return false
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getRealStores() {
            var self = this
            axios.post('/v1/store/real_stores', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    self.real_stores = resp.data.data.map(rs => {
                        rs.active = false
                        return rs
                    })
                }
            }).catch(() => {
                return false
            });
        },
        getToken() {
            let key = 'store_' + this.form.store_id + '/real_shop_' + moment().unix() + '.png'
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
            var isThree = this.form.imagesArray.length < 3
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isThree) {
                this.$message.error('最多上传三张照片!');
            }
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M && isThree;
        },
        handleAvatarSuccess(res, file, fileList) {
            var self = this
            self.form.imagesArray = []
            fileList.forEach(f => {
                if (f.key) {
                    self.form.imagesArray.push(f.key)
                } else {
                    self.form.imagesArray.push(f.response.key)
                }
            })
            self.getToken()
        },
        handleAvatarError(err, file, fileList) {
            this.getToken()
        },
        handleRemove(file, fileList) {
            console.log(fileList);
            var self = this
            self.form.imagesArray = []
            fileList.forEach(f => {
                if (f.key) {
                    self.form.imagesArray.push(f.key)
                } else {
                    self.form.imagesArray.push(f.response.key)
                }
            })
            self.getToken()
        },
        preAddRealStore() {
            var self = this
            self.add_update = 'add'
            self.dialogFormVisible = true
            this.$nextTick(() => {
                self.distpicker()
                self.getToken()
            })
        },
        confirmAddRealStore(formName) {
            var self = this
            self.getDistpickerValue()
            self.getImages2String()
            self.$refs[formName].validate((valid) => {
                if (valid) {
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
                    self.btn_loading = true
                    self.getAddress2String()
                    axios.post('/v1/store/add_real_store', self.form).then(resp => {
                        if (resp.data.message == 'ok') {
                            self.$message.success('实体店创建成功')
                        }
                        self.dialogFormVisible = false
                        self.getRealStores()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        closeDialog() {
            if (this.btn_loading) {
                this.btn_loading = false
            }
            this.fileList = []
            this.form.name = ''
            this.form.province_code = ''
            this.form.province_text = ''

            this.form.city_code = ''
            this.form.city_text = ''

            this.form.scope_code = ''
            this.form.scope_text = ''

            this.form.address_detail = ''
            this.form.address = ''

            this.form.images = ''
            this.form.imagesArray = []
        },
        distpicker() {
            $('#distpicker').distpicker('destroy');
            $('#distpicker').distpicker({
                province: this.form.province_text ? this.form.province_text : '---- 所在省 ----',
                city: this.form.city_text ? this.form.city_text : '---- 所在市 ----',
                district: this.form.scope_text ? this.form.scope_text : '---- 所在区 ----'
            });
        },
        getDistpickerValue() {
            this.form.province_code = $('#province option:selected').data('code')
            this.form.city_code = $('#city option:selected').data('code')
            this.form.scope_code = $('#district option:selected').data('code')
        },
        getAddress2String() {
            var province = $('#province option:selected').data('text')
            var city = $('#city option:selected').data('text')
            var scope = $('#district option:selected').data('text')
            var address_detail = this.form.address_detail
            this.form.address = province + ' | ' + city + ' | ' + scope + ' | ' + address_detail
        },
        getAddress2Array() {
            var addressArray = this.form.address.split('|')
            this.form.province_text = addressArray[0].trim()
            this.form.city_text = addressArray[1].trim()
            this.form.scope_text = addressArray[2].trim()
            this.form.address_detail = addressArray[3].trim()
        },
        getImages2String() {
            this.form.images = this.form.imagesArray.join()
        },
        getImages2Array() {
            this.form.imagesArray = this.form.images.split(',')
            var imagesArray = []
            this.form.imagesArray.forEach(i => {
                var obj = {
                    key: i,
                    url: 'http://onv8eua8j.bkt.clouddn.com/' + i
                }
                imagesArray.push(obj)
            })
            this.fileList = imagesArray
        },
        deleteRealStore(index) {
            var self = this
            var id = self.real_stores[index].id
            console.log(id);
            self.$confirm('此操作将永久删除该实体店, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/v1/store/del_real_store', {
                    id: id
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        self.getRealStores()
                    }
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}
</script>

<style lang="scss" scoped>@import "../../common/_color.scss";
.body {
    background-color: white;
    // padding: 16px;
}

.item {
    padding: 18px 0;
}

.box-card {
    position: relative;
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
    .delete_btn {
        position: absolute;
        right: 30px;
        top: 30px;
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
