<style lang="scss" scoped>

@import "../../../common/_color.scss";
@import "./school.scss";

</style>

<template lang="html">

<div>
    <ul id="schools">
        <li class="school" v-for="school in schools" @mouseover="school.active = true" @mouseleave="school.active= false" @click="view_school(school)">
            <p class="name">{{school.name}}</p>
            <p class="tel">客服电话：{{school.tel}}</p>
            <p class="tel">
                配送费用：<span class="price">¥ {{(school.express_fee/100).toFixed(2)}}</span>
            </p>
            <p class="operate" v-show="school.active">
                <el-button type="text" @click="del_school(school.id)">删除</el-button>
            </p>
        </li>

        <li class="add" @click="add_school">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </li>
    </ul>

    <!-- 学校信息弹出框 -->
    <el-dialog @open="open" v-model="visible" :title="title" size="large" style="top:-14%;" :close-on-click-modal="false">

        <amap :school-info="school" :school-name="title" :btn-disabled="btn_disabled"></amap>

        <el-form :model="ruleForm" :inline="true" style="margin-top: 12px;" :rules="rules" ref="ruleForm">
            <el-form-item label="客服电话" style="margin-bottom:0;" prop="tel">
                <el-input v-model="ruleForm.tel" size="small"></el-input>
            </el-form-item>
            <el-form-item label="配送费用" style="margin-bottom:0;" prop="express_fee">
                <el-input v-model.number="ruleForm.express_fee" size="small" placeholder="单位：元"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="padding-top: 0;">
            <el-button size="small" @click="visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="confirm('ruleForm')">确 定</el-button>
        </div>
    </el-dialog>

</div>

</template>

<script>
import axios from '../../../scripts/http'
import amap from './map'
import mix from './school.js'
export default {
    mixins: [mix],
    components: {
        amap
    },
    data() {
        return {
            visible: false,
            btn_disabled: true,
            title: '上海应用技术大学',
            schools: [],
            ruleForm: {
                tel: '',
                express_fee: 0
            },
            rules: {
                tel: [
                    {required: true, message: '请输入客服电话', trigger: 'blur'}
                ],
                express_fee: [
                    {required: true, message: '请输入配送费用'},
                    { type: 'number', message: '配送费必须为数字值', trigger: 'blur'}
                ]
            },
            school: {
                name: '',
                tel: '',
                express_fee: 0,
                lat: 0,
                lng: 0,
                image: '',
                id: ''
            },
        }
    },
    methods: {
        open(){
            if(this.school.lat != 0 && this.school.lng != 0){
                // this.
            }
        },
        view_school(school){
            this.school = school
            console.log(school);
        },
        add_school() {
            this.visible = true
            this.$nextTick(() => {
                $('#search_box').focus()
            })
        }
    }
}

</script>
