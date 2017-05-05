<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">销售统计</h2>
      <el-select v-model="school_id" style="width: 240px;line-height: 48px;margin-left:20px;" clearable placeholder="学校" size="small">
          <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
      </el-select>
  </div>
  <div class="content_inner">
    <el-row :gutter="10" :align="middle" class="row">
      <el-col :span="16" style="display:flex;">
        <div class="blue">
          <div class="block"><p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{yestoday_sales}}元</p><p>昨日销售额</p></div>
        </div>
        <div class="blue">
          <div><p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{today_salse}}元</p><p>今日销售额</p></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="total">
          <div class="block">
            <p>总销售额</p>
            <p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{history_sales.total_sales}}元</p>
            <div>
              <div class="small-font" style="float:left">
                <p>线上：{{history_sales.online_total_sales}}元</p>
                <p>线下：{{history_sales.offline_total_sales}}元</p>
              </div>
              <div class="small-font" style="float:right">
                <p>新书：{{history_sales.newbook_total_sales}}元</p>
                <p>旧书：{{history_sales.oldbook_total_sales}}元</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card class="row">
      <div>
        <el-select v-model="date_statistic_type" size="small">
          <el-option label="新书旧书销售统计" value="new_old"></el-option>
          <el-option label="线上线下销售统计" value="online_offline"></el-option>
        </el-select>
        <el-date-picker style="float:right;" :editable="false" v-model="date_range" size="small" type="daterange" placeholder="选择日期范围" align="right" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <div id="echart1" style="width: 100%;height:400px;margin-top:10px;"></div>
    </el-card>

    <!-- <el-card>
      <div>
        <el-select v-model="a" size="small">
          <el-option label="新书旧书销售统计" value="c"></el-option>
          <el-option label="线上线下销售统计" value="d"></el-option>
        </el-select>
        <el-date-picker style="float:right;" :editable="false" v-model="statistic_time1" size="small" type="daterange" placeholder="选择日期范围" align="right" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <div id="echart2" style="width: 100%;height:400px;margin-top:10px;"></div>
    </el-card> -->
  </div>
</div>
</template>

<script>
import {
    priceFloat
} from '../../scripts/utils'
import axios from "../../scripts/http"
export default {
    data() {
        return {
            date_statistic_type: 'new_old', //online_offline
            date_statistic: [],
            month_statistic_type: 'new_old', //online_offline
            schools: [],
            school_id: '',
            date_range: [null, null], //时间选择器[最早时间,最晚时间]
            statistic_time2: [null, null], //时间选择器[最早时间,最晚时间]
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近两周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            today_salse: 0,
            yestoday_sales: 0,
            history_sales: {}
        }
    },
    mounted() {
        this.getSchools()
        this.getTodaySales()
        this.getTotalSales()
        this.getDaliySales()
        this.getMonthSales()
    },
    methods: {
        getTodaySales() {
            axios.post('/v1/statistic/get_today_sales', {
                "school_id": this.school_id //not required 学校id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    console.log(data);
                    this.today_salse = priceFloat(data.offline_total_sales + data.online_total_sales)
                }
            })
        },
        getTotalSales() {
            axios.post('/v1/statistic/get_total_sales', {
                "school_id": this.school_id //not required 学校id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    console.log(data);
                    this.yestoday_sales = priceFloat(data.yesterday_sales.offline_total_sales + data.yesterday_sales.online_total_sales)
                    this.history_sales = {
                        total_sales: priceFloat(data.total_sales.online_total_sales + data.total_sales.offline_total_sales),
                        online_total_sales: priceFloat(data.total_sales.online_total_sales),
                        offline_total_sales: priceFloat(data.total_sales.offline_total_sales),
                        newbook_total_sales: priceFloat(data.total_sales.newbook_total_sales),
                        oldbook_total_sales: priceFloat(data.total_sales.oldbook_total_sales)
                    }
                }
            })
        },
        getDaliySales() {
            var $echart1 = document.getElementById('echart1')
            var echart1 = echarts.init($echart1);
            axios.post('/v1/statistic/get_daliy_sales', {
                "school_id": this.school_id, //not required 学校id
                "start_at": this.date_range[0] ? moment(this.date_range[0], "YYYY-MM-DD").unix() : 0, //not required 起始时间
                "end_at": this.date_range[1] ? moment(this.date_range[1], "YYYY-MM-DD").unix() : 0 //not required 结束时间  end_at>start_at
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var date_statistic_0 = {
                        legend_data: ['新书销售额','旧书销售额'],
                        xAxis_data: [],
                        series_new_data: [],
                        series_old_data: []
                    }
                    var date_statistic_1 = {
                        legend_data: ['线上销售额','线下销售额'],
                        xAxis_data: [],
                        series_online_data: [],
                        series_offline_data: []
                    }
                    resp.data.data.forEach(el => {
                        date_statistic_0.xAxis_data.push(el.statistic_at)
                        date_statistic_0.series_new_data.push(priceFloat(el.online_new_book_sales_fee + el.offline_new_book_sales_fee)) //新书总额
                        date_statistic_0.series_old_data.push(priceFloat(el.online_old_book_sales_fee + el.offline_old_book_sales_fee)) //旧书总额

                        date_statistic_1.xAxis_data.push(el.statistic_at)
                        date_statistic_1.series_online_data.push(priceFloat(el.alipay_order_fee + el.wechat_order_fee)) //线上总额
                        date_statistic_1.series_offline_data.push(priceFloat(el.offline_new_book_sales_fee + el.offline_old_book_sales_fee)) //先下总额
                    })
                    this.date_statistic[0] = date_statistic_0
                    this.date_statistic[1] = date_statistic_1
                    console.log('>>>>>----- this.date_statistic ----->');
                    console.log(this.date_statistic);
                }
            })
            var option_data = this.date_statistic_type == 'new_old' ? this.date_statistic[0] : this.date_statistic[1]
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: option_data.legend_data
                },
                grid: {
                    left: '0',
                    right: '2%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: option_data.xAxis_data
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                        name: option_data.legend_data[0],
                        type: 'line',
                        stack: '总量',
                        areaStyle: {
                            normal: {}
                        },
                        data: option_data.series_new_data
                    },
                    {
                        name: option_data.legend_data[0],
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {
                            normal: {}
                        },
                        data: option_data.series_old_data
                    }
                ]
            };
            echart1.setOption(option);
        },
        // getMonthSales() {
        //     var $echart2 = document.getElementById('echart2')
        //     var echart2 = echarts.init($echart2);
        //     var option = {
        //         tooltip: {
        //             trigger: 'item',
        //             formatter: "{a} <br/>{b}: {c} ({d}%)"
        //         },
        //         legend: {
        //             orient: 'vertical',
        //             x: 'left',
        //             data: ['一月', '二月', '三月', '四月', '五月', '六月']
        //         },
        //         series: [{
        //                 name: '访问来源',
        //                 type: 'pie',
        //                 selectedMode: 'single',
        //                 radius: [0, '50%'],
        //
        //                 label: {
        //                     normal: {
        //                         position: 'inner'
        //                     }
        //                 },
        //                 labelLine: {
        //                     normal: {
        //                         show: false
        //                     }
        //                 },
        //                 data: [{
        //                         value: 100,
        //                         name: '一月',
        //                         selected: true
        //                     },
        //                     {
        //                         value: 100,
        //                         name: '二月'
        //                     },
        //                     {
        //                         value: 100,
        //                         name: '三月'
        //                     },
        //                     {
        //                         value: 100,
        //                         name: '四月'
        //                     },
        //                     {
        //                         value: 100,
        //                         name: '五月'
        //                     },
        //                     {
        //                         value: 100,
        //                         name: '六月'
        //                     }
        //                 ]
        //             },
        //             {
        //                 name: '访问来源',
        //                 type: 'pie',
        //                 radius: ['65%', '85%'],
        //
        //                 data: [{
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '新书'
        //                     },
        //                     {
        //                         value: 50,
        //                         name: '旧书'
        //                     }
        //                 ]
        //             }
        //         ]
        //     };
        //     echart2.setOption(option);
        // },
        getSchools() {
            axios.post('/v1/school/store_schools', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.schools = resp.data.data
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    margin-bottom: 15px;
}
.top_bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.moneyicon {
    font-size: 24px;
    margin-right: 5px;
}
.blue {
    display: flex;
    align-items: center;
    justify-content: center;
    .block {
        width: 100%;
        border-right: 1px solid #6fa7ce;
        padding: 10px 0;
    }
    width: 50%;
    height: 130px;
    line-height: 28px;
    font-size: 16px;
    background: #7cbae5;
}
.total {
    display: flex;
    align-items: center;
    justify-content: center;
    .block {
        width: 100%;
        padding: 0 10px;
    }
    .small-font {
        p {
            font-size: 14px;
            line-height: 20px;
        }
    }
    width: 100%;
    height: 130px;
    line-height: 28px;
    font-size: 16px;
    background: #60d295;
}
p {
    text-align: center;
    color: #FFFFFF;
    width: 100%;
}
</style>
