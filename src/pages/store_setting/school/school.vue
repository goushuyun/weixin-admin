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

    <!-- 弹出框部分 -->
    <el-dialog v-model="show" style="top: -12%;" size="large" :title="school.name" @close="close" @open="open">
        <el-row>
            <el-col :span="18">
                <el-form label-position="left" label-width="100px">
                    <el-form-item label="学校名称：">
                        <input id="search_box" v-model="school_name" placeholder="请输入您要经营的学校，然后选择您满意的提示项">
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- 地图内容展示  -->
        <el-row>
            <el-col :span="24" class="position: relation">
                <div id="amap"></div>
                <div id="panel"></div>
            </el-col>
        </el-row>

        <el-form :model="ruleForm" :inline="true" style="margin-top: 12px;" :rules="rules" ref="ruleForm">
            <el-form-item label="客服电话" style="margin-bottom:0;" prop="tel">
                <el-input v-model="ruleForm.tel" size="small"></el-input>
            </el-form-item>
            <el-form-item label="配送费用" style="margin-bottom:0;" prop="express_fee">
                <el-input v-model.number="ruleForm.express_fee" size="small" placeholder="单位：元"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="padding-top: 0;">
            <el-button size="small" @click="show = false">取 消</el-button>
            <el-button :disabled="btn_disabled" size="small" type="primary" @click="confirm('ruleForm')">确 定</el-button>
        </div>

    </el-dialog>

</div>

</template>

<script>
import axios from '../../../scripts/http'
import mix from './school.js'
export default {
    mixins: [mix],
    data() {
        return {
            btn_disabled: true,

            show: false,
            schools: [],
            school: {
                name: '',
                tel: '',
                express_fee: 0,
                lat: 0,
                lng: 0,
                image: '',
                id: ''
            },
            ruleForm: {
                tel: '',
                express_fee: 0
            },
            rules: {
                tel: [
                    {required: true, message: '请输入客服电话', trigger: 'blur'}
                ],
                express_fee: [
                    {type: 'number', required: true, message: '配送费用必须为数字', trigger: 'blur'}
                ]
            },
            map: {},
            // 学校名称输入框
            school_name: ''
        }
    },
    methods: {
        view_school(school){
            for (let key in school){
                this.school[key] = school[key]
            }
            this.ruleForm.tel = this.school.tel
            this.ruleForm.express_fee = parseFloat((this.school.express_fee/100).toFixed(2))
            this.show = true
        },
        add_school() {
            this.show = true
            console.log('add school ...');
        },

        // 设置按钮为可用
        set_btn_usable(){
            this.btn_disabled = false
            console.log('btn_can_use');
        },

        // change map's center
        changeCenter(center) {
            this.map.setCenter(center)
        },
        close(){
            this.school_name = ''

            // clear school data
            this.school.name = this.school.tel = this.school.id = this.school.image = ''
            this.school.express_fee = this.school.lat = this.school.lng = 0
            $('#panel').empty()
        },
        initMap(){
            this.map = new AMap.Map('amap', {
                zoom: 10,
                center: [116.39, 39.9]
            })

            this.map.on('complete', () => {
                var self = this
                console.log('amap inited');

                // center to local city
                let citysearch = new AMap.CitySearch();
                citysearch.getLocalCity(function(status, result) {
                    // move to this city's center
                    if (status == 'complete') {
                        let loc1 = result.rectangle.split(';')[0].split(','),
                            loc2 = result.rectangle.split(';')[1].split(',')
                        let lat = (parseFloat(loc1[0]) + parseFloat(loc2[0])) / 2
                        let lng = (parseFloat(loc1[1]) + parseFloat(loc2[1])) / 2
                        self.changeCenter([lat, lng])
                    }
                    self.city = result.city
                    console.log(result.city);

                    // add Autocomplete
                    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], (e) => {
                        var auto = new AMap.Autocomplete({
                            input: 'search_box',
                            type: '141201',
                            city: self.city
                        })
                        var placesearch = new AMap.PlaceSearch({
                            map: self.map,
                            pageSize: 1,
                            type: '141201',
                            panel: 'panel'
                        })

                        // listen select event
                        auto.on('select', (data) => {
                            placesearch.setCity(data.poi.adcode)
                            placesearch.search(data.poi.name, (status, result)=>{
                                if(status == 'complete' && result.info == 'OK'){
                                    let poi = result.poiList.pois[0]
                                    // 封装数据到 school_info
                                    console.log(poi);
                                    self.school.lat = poi.location.lat
                                    self.school.lng = poi.location.lng
                                    if(poi.photos != ""){
                                        self.school.image = poi.photos[0].url
                                    }
                                    self.school_name = self.school.name = poi.name
                                    self.btn_disabled = false
                                    console.log(self.school)
                                }
                            })
                        })

                    })

                })
            })

        },
        open(){
            var center = []
            if(this.school.name){
                // open has managed school
                console.log('locate to special center');

                this.school_name = this.school.name
                center = [this.school.lng, this.school.lat]
                this.$nextTick(()=>{
                    if(this.map.setCenter == undefined){
                        this.initMap()
                    }
                    this.changeCenter(center)
                    $('#search_box').focus()
                    // add marker
                    let marker = new AMap.Marker({
                        // icon : 'http://vdata.amap.com/icons/b18/1/2.png',//24px*24px
                        position : center,
                        offset : new AMap.Pixel(-12,-12),
                        map : this.map
                    })


                })
            }else{
                // init map
                console.log('init map');
                this.$nextTick(()=>{
                    this.initMap()
                    $('#search_box').focus()
                })
            }
        },
        changeCenter(center) {
            this.map.setCenter(center)
        },

        confirm(ruleForm) {
            this.$refs[ruleForm].validate(valid=>{
                if(!valid){
                    return false
                }else{
                    console.log(this.school);
                    this.school.tel = this.ruleForm.tel
                    this.school.express_fee = this.ruleForm.express_fee

                    this.visible = false

                    this.school.express_fee *= 100
                    if (this.school.id != '') {
                        // update school
                        axios.post('/v1/school/update', this.school).then(res => {
                            console.log(res.data);
                            this.getData()
                            this.show = false
                        })
                    } else {
                        // add new school
                        axios.post('/v1/school/add', this.school).then((res) => {
                            console.log(res.data);
                            this.getData()
                            this.show = false
                        })
                    }

                }
            })
        }


    }
}

</script>
