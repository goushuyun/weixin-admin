<style lang="scss" scoped>

@import "../../common/_color.scss";
ul#schools {
    font-size: 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
        box-sizing: border-box;
        display: inline-block;
        border-radius: 4px;
    }
    li.school {
        width: 245px;
        // height: 141px;
        background-color: white;
        border-left: 4px solid $blue;
        padding: 6px 12px;
        margin-right: 14px;
        margin-bottom: 10px;
        &:hover {
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
        }
        p.name {
            line-height: 48px;
            font-size: 14px;
            color: $font_normal;
        }
        p.tel {
            font-size: 13px;
            line-height: 24px;
            color: $font_light;
            .price {
                color: $weixin_green;
                padding-right: 82px;
            }
        }
        p.operate {
            text-align: right;
            button {
                line-height: 16px;
                padding: 0;
                font-size: 12px;
            }
        }
    }
    li.add {
        font-size: 20px;
        width: 124px;
        height: 124px;
        background-color: white;
        line-height: 124px;
        text-align: center;
        color: $bg_grey;
        &:hover {
            cursor: pointer;
            color: lighten($blue, 12%);
            border: 1px solid lighten($blue, 16%);
        }
    }
}

.el-dialog--large {
    top: 5% !important;
}

#amap {
    height: 400px;
    .search-box {
        position: relative;
        top: 2px;
        left: 2px;
    }
}

</style>

<template lang="html">

<div>
    <ul id="schools">
        <li class="school">
            <p class="name">上海应用技术大学（奉贤校区）</p>
            <p class="tel">客服电话：18817935420</p>
            <p class="tel">
                配送费用：<span class="price">¥ 4.00</span>
            </p>
            <p class="operate">
                <el-button type="text">删除</el-button>
            </p>
        </li>
        <li class="school">
            <p class="name">上海应用技术大学（奉贤校区）</p>
            <p class="tel">客服电话：18817935420</p>
            <p class="tel">
                配送费用：<span class="price">¥ 4.00</span>
            </p>
            <p class="operate">
                <el-button type="text">删除</el-button>
            </p>
        </li>

        <li class="add" @click="add_school">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </li>
    </ul>

    <!-- 学校信息弹出框 -->
    <el-dialog :title="title" v-model="visible" size="large" style="top:-14%;" :close-on-click-modal="false" @close="dialog_close_handle">
        <div id="amap">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" :events="events"></el-amap-search-box>
            <el-amap :vid="'amap'" :center="center" :zoom="zoom" :plugin="plugin">
                <el-amap-marker :events="marker_events" :clickable="true" :title="marker.name" v-for="marker in markers" :position="marker.loc"></el-amap-marker>
            </el-amap>
        </div>

        <el-form :inline="true" style="margin-top: 16px;">
            <el-form-item label="学校名称">
                <el-input v-model="pointer.name"></el-input>
            </el-form-item>
            <el-form-item label="客服电话">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="配送费用">
                <el-input placeholder="单位: 元">
                    <!-- <template slot="append">元</template> -->
                </el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="visible = false">确 定</el-button>
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
        lat: 0,
        lng: 0,

        name: '',
        tel: '',
        express_fee: 0
    }

    export default {
        created() {},

            data() {
                return {
                    // dialog 数据
                    visible: false,
                    title: '请选择学校',

                    // 业务数据
                    pointer: pointer,

                    // map paramter
                    zoom: 12,
                    center: [121.59996, 31.197646],
                    markers: [],
                    searchOption: {
                        city: '上海',
                        citylimit: true
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
                                    self.center = [result.position.lng, result.position.lat];
                                });
                            }
                        }
                    }],

                    // markers
                    marker_events: {
                        click(e) {
                            console.log(e);

                            console.log('kai');

                            //解析必要数据到 pointer
                            pointer.lat = e.lnglat.lat
                            pointer.lng = e.lnglat.lng

                            pointer.name = e.target.G.title


                            console.log(pointer)
                        }
                    }


                }
            },
            methods: {
                dialog_close_handle() {
                        // handle model close
                        this.zoom = 12
                        this.markers = []
                    },
                    add_school() {
                        // add school
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
                        this.zoom = 15

                    }
            }
    }

</script>
