<style lang="scss" scoped>
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
</style>

<template lang="html">

<div class="body">
    <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="云店头像：">
          <div>
            <el-upload class="avatar-uploader"
            action="https://upload.qbox.me/"
            :data="imagesFormData"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError">
              <img v-if="form.logo" :src="'http://images.goushuyun.cn/' + form.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="创建日期：">
          <label>{{form.creat_date}}</label>
        </el-form-item>

        <el-form-item label="店主手机：">
          <label style="margin-right:10px;">{{form.mobile}}</label>
          <el-button type="text" @click="preTransfer">转让店铺</el-button>
        </el-form-item>

        <el-dialog size="tiny" title="更换联系人手机" @close="cancelTransfer" v-model="update_tel">
          <el-form :model="form">
            <el-form-item>
              <p>更换手机号后，此店铺归属于新手机号</p>
            </el-form-item>
            <el-form-item v-if="step==1" label="原手机号：">
              <p>{{form_submit.mobile}}</p>
            </el-form-item>
            <el-form-item v-if="step==2" label="新手机号：">
              <el-input style="width:200px;" v-model="form_submit.mobile"></el-input>
            </el-form-item>
            <el-form-item label="短信校验：">
              <el-input style="width:200px;" v-model="form_submit.message_code">
                <template slot="append">
                  <el-button slot="append" style="width:100px" @click="getMessageCode" :disabled="timer_disabled">
                    <span v-show="!timer_disabled">获取验证码</span>
                    <span v-show="timer_disabled">（{{timer_second}}s）</span>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancelTransfer">取 消</el-button>
            <el-button v-if="step==1" type="primary" @click="nextStep">下一步</el-button>
            <el-button v-if="step==2" type="primary" @click="confirmTransfer">确 定</el-button>
          </div>
        </el-dialog>

        <el-form-item label="云店名称：">
          <label v-if="!update_flag" style="margin-right:10px;">{{form.shop_name}}</label>
          <el-input v-else size="small" v-model="form_submit.shop_name"></el-input>
        </el-form-item>

        <el-form-item label="云店介绍：">
          <div v-if="!update_flag" style="line-height:20px;width: 300px;">{{form.profile}}</div>
          <el-input v-else type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :maxlength="300" v-model="form_submit.profile"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button v-if="!update_flag" type="primary" size="small" @click="proUpdate">修改信息</el-button>
          <el-button v-if="update_flag" size="small" @click="cancelUpdate">取消</el-button>
          <el-button v-if="update_flag" type="primary" size="small" @click="confirmUpdate">确认修改</el-button>
        </el-form-item>

    </el-form>
</div>

</template>

<script>
import axios from "../../scripts/http"
import {
    testMobile,testMsgCode,stamp2date
} from "../../scripts/utils"
export default {
    data() {
        return {
            update_flag: false,
            update_tel: false,
            step:1,
            update_main_service: false,

            /* 倒计时 */
            timer_second: 60,
            timer_disabled: false,

            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },

            store_id: '',

            /* 修改后提交的数据 */
            form_submit: {
                shop_name: '',
                profile: '',
                mobile: '',
                message_code: ''
            },

            /* 展示数据 */
            form: {
                logo: '',
                shop_name: '',
                creat_date: '',
                profile: '',
                mobile: ''
            }
        }
    },
    mounted() {
        var store = this.$store.state.current_store
        this.store_id = store.id
        this.getStoreInfo()
        this.getToken()
    },
    methods: {
        getMessageCode() {
            if (!testMobile(this.form_submit.mobile)) {
                this.$message.error('手机号码格式不正确！')
                return
            }
            axios.post('/v1/seller/get_update_sms', {
                mobile: this.form_submit.mobile
            }).then(resp => {
                if (resp.data.code != '00000') {
                    this.$message.error("获取验证码失败，请重试！")
                }
                if (resp.data.message == 'needRegister') {
                    this.$message.error("该用户需要注册！")
                }
                if (resp.data.message == 'ok') {
                    this.$message.info("已发送，请查收短信！")
                    this.timer_disabled = true
                    this.timer()
                }
            })
        },
        timer() {
            var self = this
            if (self.timer_second > 0 && self.form_submit.mobile!='') {
                self.timer_second--;
                setTimeout(function() {
                    self.timer()
                }, 1000);
            } else {
                self.timer_disabled = false
            }
        },
        preTransfer() {
            this.update_tel = true
            this.form_submit.mobile = this.form.mobile
        },
        nextStep() {
            if (!testMsgCode(this.form_submit.message_code)) {
                this.$message.error('验证码格式不正确！')
                this.form_submit.message_code = ''
                return
            }
            axios.post('/v1/store/check_code', {
                mobile: this.form_submit.mobile,
                message_code: this.form_submit.message_code
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.step += 1
                    this.form_submit.mobile = ''
                    this.form_submit.message_code = ''
                    this.timer_second = 60
                    this.timer_disabled = false
                    clearTimeout()
                } else {
                    this.$message.error("验证失败，请重新获取验证码后重试！")
                }
            })
        },
        cancelTransfer() {
            this.step = 1
            this.form_submit.mobile = this.form.mobile
            this.form_submit.message_code = ''
            this.update_tel = false
        },
        confirmTransfer() {
            var self = this
            if (!testMobile(self.form_submit.mobile)) {
                self.$message.error('手机号码格式不正确！')
                return
            }
            if (!testMsgCode(self.form_submit.message_code)) {
                self.$message.error('验证码格式不正确！')
                self.form_submit.message_code = ''
                return
            }
            axios.post('/v1/store/transfer_store', {
                mobile: self.form_submit.mobile,
                message_code: self.form_submit.message_code
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    self.$message.success('店铺已成功转让！')
                    self.$router.push({
                        name: 'shops'
                    })
                }
            })
        },
        getToken() {
            let key = 'store_' + this.store_id + '/logo_' + moment().unix() + '.png'
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
            this.updateLogo(res.key)
        },
        updateLogo(logo_key) {
            axios.post('/v1/store/change_logo', {
                logo: logo_key
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$store.commit('setStoreLogo', logo_key)
                    localStorage.setItem('store_logo', logo_key)
                    this.$message.success('logo修改成功')
                    this.getStoreInfo()
                    this.getToken()
                }
                return true
            }).catch(() => {
                return false
            });
        },
        handleAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken()
        },
        getStoreInfo() {
            var self = this
            axios.post('/v1/store/store_info', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    self.form.logo = resp.data.data.logo
                    self.form.shop_name = resp.data.data.name
                    self.form.creat_date = stamp2date(resp.data.data.create_at, 'YYYY-MM-DD HH : mm : ss')
                    self.form.profile = resp.data.data.profile
                    self.form.mobile = resp.data.data.admin_mobile
                }
            })
        },
        proUpdate() {
            this.update_flag = true
            this.form_submit.shop_name = this.form.shop_name
            this.form_submit.profile = this.form.profile
        },
        addService() {
            if (this.services.length < 3) {
                let service = {
                    service_tel: '',
                    service_school: '',
                    service_update: true
                }
                this.services.push(service)
            }
        },
        cancelUpdate() {
            this.update_flag = false
        },
        confirmUpdate() {
            if (this.form_submit.shop_name.length <= 0 || this.form_submit.shop_name.length > 20) {
                this.$message.warning('请输入店铺名称')
                return
            }
            axios.post('/v1/store/update', {
                name: this.form_submit.shop_name,
                profile: this.form_submit.profile
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$store.commit('setStoreName', this.form_submit.shop_name)
                    localStorage.setItem('store_name', this.form_submit.shop_name)
                    this.$message.success('修改成功')
                    this.update_flag = false
                    this.getStoreInfo()
                }
            })
        }
    }
}
</script>
