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
        <el-form-item label="店铺头像：">
          <div>
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarScucess">
              <img v-if="form.logo" :src="form.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="创建日期：">
          <label>{{form.creat_date}}</label>
        </el-form-item>

        <el-form-item label="店主手机：">
          <label style="margin-right:10px;">{{form.tel}}</label>
          <el-button type="text" @click="update_tel = true">转让店铺</el-button>
        </el-form-item>

        <el-dialog size="tiny" title="更换联系人手机" v-model="update_tel">
          <el-form :model="form">
            <el-form-item>
              <p>更换后，原手机号失效，需使用新手机号登陆</p>
            </el-form-item>
            <el-form-item label="原手机号：">
              <p>{{form.tel}}</p>
            </el-form-item>

            <el-form-item label="短信校验：">
              <el-input style="width:200px;" v-model="input4">
                <template slot="append">获取验证码</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="update_tel = false">取 消</el-button>
            <el-button type="primary" @click="update_tel = false">确 定</el-button>
          </div>
        </el-dialog>

        <el-form-item label="店铺名称：">
          <label v-if="!update_flag" style="margin-right:10px;">{{form.shop_name}}</label>
          <el-input v-else size="small" v-model="form_submit.shop_name"></el-input>
        </el-form-item>

        <el-form-item label="店铺介绍：">
          <div v-if="!update_flag" style="line-height:20px;width: 300px;">{{form.profile}}</div>
          <el-input v-else type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :maxlength="300" v-model="form_submit.profile"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button v-if="!update_flag" type="primary" size="small" @click="proUpdate">修改信息</el-button>
          <el-button v-if="update_flag" type="primary" size="small" @click="cancelUpdate">取消</el-button>
          <el-button v-if="update_flag" type="primary" size="small" @click="confirmUpdate">确认修改</el-button>
        </el-form-item>

    </el-form>
</div>

</template>

<script>
import axios from "../../scripts/http"
import uploadImage from "../../scripts/uploadImage"
import getTimeVal from "../../scripts/utils"

export default {
    data() {
        return {
            update_flag: false,
            update_tel: false,
            update_main_service: false,
            requestData: {
                key: '',
                token: ''
            },
            shop_id: '',

            form_submit: {
                shop_name: '',
                profile: '',
                tel: ''
            },

            form: {
                logo: '',
                shop_name: '',
                creat_date: '',
                profile: '',
                tel: '18818000305'
            }
        }
    },
    mounted() {
        var self = this
        self.shop_id = localStorage.shop_id
        axios.post('/v1/store/store_info', {
            id: '170403000003'
        }).then(resp => {
            if (resp.data.message == 'ok') {
                self.form.logo = resp.data.data.logo,
                self.form.shop_name = resp.data.data.name,
                self.form.creat_date = stamp2date(resp.data.data.create_at, 'YYYY-MM-DD HH:mm'),
                self.form.profile = resp.data.data.profile,
                self.form.tel = resp.data.data.service_mobiles
            }
        })
    },
    methods: {
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
            this.form_submit.shop_name = this.form.shop_name
            this.form_submit.profile = this.form.profile
        },
        confirmUpdate() {
          axios.post('/v1/store/update', {
            id: localStorage.shop_id,
            name: this.form_submit.shop_name,
            profile: this.form_submit.profile
          }).then(resp => {
              if (resp.data.message == 'ok') {
                this.$message.success('修改成功')
                this.update_flag = false
              }
          })
        },
        handleAvatarScucess(res, file) {
            this.form.logo = file.url
            // this.form.logo = URL.createObjectURL(file.raw);
            // let data = {
            //     id: this.shop_id,
            //     logo: 'http://image.cumpusbox.com/shop/' + this.shop_id
            // }
            // axios.post('/v1/admin/update_shop_logo', data).then(resp=>{
            //     if(resp.data.code == '00000'){
            //
            //     }
            // })
        }
    }
}
</script>
