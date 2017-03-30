<style lang="scss" scoped>
.avatar-uploader{
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
    .el-input,.el-textarea {
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
          <el-input v-else size="small" v-model="form.shop_name"></el-input>
        </el-form-item>

        <el-form-item label="店铺介绍：">
          <div v-if="!update_flag" style="line-height:20px;width: 300px;">{{form.introduction}}</div>
          <el-input v-else type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :maxlength="300" v-model="form.introduction"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button v-if="!update_flag" type="primary" size="small" @click="update_flag = true">修改信息</el-button>
          <el-button v-if="update_flag" type="primary" size="small" @click="update_flag = false">取消</el-button>
          <el-button v-if="update_flag" type="primary" size="small" @click="update_flag = false">确认修改</el-button>
        </el-form-item>

    </el-form>

    <el-form style="margin-top:8px;" ref="form" :model="form" label-width="110px">
        <el-form-item label="客服电话：">
          <label style="margin-right:10px;">总客服</label>
          <label v-if="!update_main_service">
            <label style="margin-right:10px;">18818000305</label>
            <el-button type="text" @click="update_main_service = true">修改</el-button>
          </label>
          <label v-else>
            <el-input size="small" value="18818000305"></el-input>
            <el-button type="text" @click="update_main_service = false">保存</el-button>
            <el-button type="text" @click="update_main_service = false">取消</el-button>
          </label>
        </el-form-item>
        <el-form-item v-for="(service, index) in services">
          <label style="margin-right:10px;">{{service.service_school}}</label>
          <label v-if="!service.service_update">
            <label style="margin-right:10px;">{{service.service_tel}}</label>
            <el-button type="text" @click="service.service_update = true">修改</el-button>
          </label>
          <label v-else>
            <el-input size="small" v-model="service.service_tel"></el-input>
            <el-button type="text" @click="service.service_update = false">保存</el-button>
            <el-button type="text" @click="service.service_update = false">取消</el-button>
          </label>
        </el-form-item>
    </el-form>

</div>

</template>

<script>
import axios from "../../scripts/http"
import uploadImage from "../../scripts/uploadImage"
import {getTimeVal} from "../../scripts/utils"

export default {
    data() {
        return {
            update_flag: false,
            update_tel: false,
            update_main_service: false,
            requestData: {
              key:'',
              token: ''
            },
            shop_id: '',
            services: [{
              service_school: '上海应用技术大学',
              service_tel: '18818000305',
              service_update: false,
            },{
              service_school: '上海应用技术大学',
              service_tel: '18818000305',
              service_update: false,
            }],
            form: {
                logo: "",
                shop_name: "购书云",
                creat_date: "2017/03/21",
                introduction: "习近平，男，汉族，1953年6月生，陕西富平人，1969年1月参加工作，1974年1月加入中国共产党，清华大学人文社会学院马克思主义理论与思想政治教育专业毕业，在职研究生学历，法学博士学位。",
                tel: '18818000305'
            }
        }
    },
    mixins: [uploadImage],
    methods: {
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
        cancelAddService(index) {

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
