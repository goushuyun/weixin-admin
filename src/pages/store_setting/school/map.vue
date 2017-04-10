<style lang="scss" scoped>

div#amap {
    height: 400px;
}

div#panel {
    position: absolute;
    top: 12px;
    right: 12px;
    height: 400px;
}

input#search_box{
    width: 100%;
    line-height: 30px;
    border-radius: 4px;
    border: 1px solid #BFCBD9;
    padding: 0 12px;
    outline: none;
    font-size: 12px;
}

</style>

<template lang="html">

<div>
    <!-- 学校搜索框 -->
    <el-row>
        <el-col :span="18">
            <el-form label-position="left" label-width="100px">
                <el-form-item label="学校名称：">
                    <input id="search_box" v-model="school_name" placeholder="请输入您要经营的学校，然后选择您满意的提示项">
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    {{school_name}}
    <!-- 地图内容展示  -->
    <el-row>
        <el-col :span="24" class="position: relation">
            <div id="amap"></div>
            <div id="panel"></div>
        </el-col>
    </el-row>

</div>

</template>

<script>

export default {
    props: [
        "schoolInfo"
    ],
    data() {
        return {
            // 业务数据
            school_name: '',

            // 地图附带数据
            map: {},
            city: ''
        }
    },
    mounted() {
        // init
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
                    console.log(e);
                    console.log('hello');


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
                    auto.on('select', (data) => {
                        placesearch.setCity(data.poi.adcode)
                        placesearch.search(data.poi.name, (status, result)=>{
                            if(status == 'complete' && result.info == 'OK'){
                                let poi = result.poiList.pois[0]
                                // 封装数据到 school_info
                                console.log(poi);
                                self.schoolInfo.lat = poi.location.lat
                                self.schoolInfo.lng = poi.location.lng
                                self.schoolInfo.image = poi.photos[0].url
                                console.log(self.school_name);
                                self.schoolInfo.name = poi.name
                            }
                        })

                    })
                })

            })



        })
    },
    methods: {
        changeCenter(center) {
            this.map.setCenter(center)
        }
    }
}

</script>
