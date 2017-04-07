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
    <el-dialog :title="' ' + pointer.name" v-model="visible" size="large" style="top:-14%;" :close-on-click-modal="false" @close="dialog_close_handle">
        <div id="amap">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
            <el-amap :vid="'amap'" :center="center" :events="map_events" :zoom="zoom" :plugin="plugin">
                <el-amap-marker :events="marker_events" :clickable="true" :title="marker.name" v-for="marker in markers" :position="marker.loc"></el-amap-marker>
            </el-amap>
        </div>

        <el-form :inline="true" style="margin-top: 16px;">
            <el-form-item label="学校名称">
                <el-input v-model="pointer.name"></el-input>
            </el-form-item>
            <el-form-item label="客服电话">
                <el-input v-model="pointer.tel"></el-input>
            </el-form-item>
            <el-form-item label="配送费用">
                <el-input v-model="pointer.express_fee" placeholder="单位: 元">
                </el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>

</div>

</template>

<script>
import {
    AMapManager
}
from 'vue-amap';

var pointer = {
    id: '',
    lat: 0,
    lng: 0,

    name: '',
    tel: '',
    express_fee: 0
}
import mix from './school.js'
var self
export default {
    mixins: [mix],
    created() {
            // 客服电话默认给出该云店铺seller的电话
            if(this.$store.state.current_store.seller){
                pointer.tel = this.$store.state.current_store.seller.mobile
            }
            this.list_school()
        },

        data() {
            return {
                // dialog 数据
                visible: false,
                title: '',

                // 业务数据
                pointer: pointer,
                schools: [],

                // map paramter
                zoom: 12,
                center: [121.59996, 31.197646],
                markers: [],
                searchOption: {
                    // city: '上海',
                    citylimit: true
                },
                map_events: {
                    'click': (e)=>{
                        console.log('click map');
                        console.log(e);
                    }
                },
                events: {
                    init(o) {
                        console.log(o);
                    }
                },
                plugin: [{
                    pName: 'Geolocation',
                    events: {
                        init(o) {
                            console.log(o);

                            // o 是高德地图定位插件实例
                            o.getCurrentPosition((status, result) => {
                                // self.center = [result.position.lng, result.position.lat];
                            });
                        }
                    }
                }],

                // markers
                marker_events: {
                    click(e) {
                        console.log(e);

                        console.log(pointer);

                        //解析必要数据到 pointer
                        pointer.lat = e.lnglat.lat
                        pointer.lng = e.lnglat.lng
                        pointer.name = e.target.G.title
                    }
                }

            }
        },
        methods: {
            view_school(school){
                console.log(school);
                pointer.name = school.name
                pointer.tel = school.tel
                pointer.express_fee = (school.express_fee/100).toFixed(2)
                pointer.lat = school.lat
                pointer.lng = school.lng
                pointer.id = school.id

                this.center = [pointer.lng, pointer.lat]
                let marker = {
                    name: pointer.name,
                    loc: [pointer.lng, pointer.lat]
                }
                this.markers.push(marker)
                this.zoom = 15
                this.visible = true
            },
            dialog_close_handle() {
                    // handle model close
                    this.zoom = 12
                    this.markers = []
                },
                add_school() {
                    // add school, clear pointer info
                    pointer.id = ''
                    pointer.express_fee = pointer.lat = pointer.lng = 0
                    pointer.name = pointer.tel = ''
                    this.visible = true
                },
                onSearchResult(pois) {
                    console.log(pois);
                    let latSum = 0;
                    let lngSum = 0;
                    if (pois.length > 0) {
                        pois.forEach(poi => {
                            let marker = {
                                name: poi.name,
                                loc: [poi.lng, poi.lat]
                            }
                            let {
                                lng, lat
                            } = poi;
                            lngSum += lng;
                            latSum += lat;
                            this.markers.push(marker);
                        });
                        let center = {
                            lng: lngSum / pois.length,
                            lat: latSum / pois.length
                        };
                        this.center = [center.lng, center.lat];
                    }

                    // 修改zoom值，放大搜索结果
                    this.zoom = 12

                }
        }
}

</script>
