<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">销售统计</h2>
      <el-select v-model="school_id" style="width: 240px;line-height: 48px;margin-left:20px;" clearable placeholder="学校" size="small" @change="schoolChange">
          <el-option-group label="运营中的学校">
            <el-option v-for="school in schools" v-if="school.status == 0" :label="school.name" :value="school.id"></el-option>
          </el-option-group>
          <el-option-group label="已删除的学校">
            <el-option v-for="school in schools" v-if="school.status == 1" :label="school.name" :value="school.id">
              <span style="float: left">{{ school.name }}</span>
            </el-option>
          </el-option-group>
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
        <el-select v-model="date_statistic_type" size="small" @change="setEchart1">
          <el-option label="新书旧书销售统计" value="new_old"></el-option>
          <el-option label="线上线下销售统计" value="online_offline"></el-option>
        </el-select>
        <el-date-picker style="float:right;" :editable="false" v-model="date_range" size="small" type="daterange" placeholder="选择日期范围" align="right" :picker-options="dateOptions" @change="getDaliySales"></el-date-picker>
      </div>
      <div id="echart1" style="width: 100%;height:400px;margin-top:10px;" @resize="setEchart1"></div>
    </el-card>

    <el-card>
      <div>
        <el-select v-model="month_statistic_type" size="small" @change="setEchart2">
          <el-option label="新书旧书销售统计" value="new_old"></el-option>
          <el-option label="线上线下销售统计" value="online_offline"></el-option>
        </el-select>
        <div style="float:right;">
          <el-date-picker v-model="month_range[0]" type="month" size="small" placeholder="起始月份" :picker-options="monthOptions" @change="getMonthSales"></el-date-picker>
          <span style="margin:0 5px;">-</span>
          <el-date-picker v-model="month_range[1]" type="month" size="small" placeholder="截至月份" :picker-options="monthOptions" @change="getMonthSales"></el-date-picker>
        </div>
      </div>
      <div id="echart2" style="width: 100%;height:400px;margin-top:10px;" @resize="setEchart2"></div>
    </el-card>
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
            month_statistic: [],
            schools: [],
            school_id: '',
            date_range: [], //时间选择器[最早时间,最晚时间]
            month_range: ['', ''], //时间选择器[最早时间,最晚时间]
            dateOptions: {
                shortcuts: [{
                    text: '最近 7 天',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at')))
                        // 默认起始时间为15天前，但是如果店铺创建不到15天，则起始日期为店铺创建日期
                        var start_time = moment().subtract(7, 'days');
                        if (create_at > start_time) {
                            var start = create_at
                        } else {
                            var start = start_time
                        }
                        const end = moment().subtract(1, 'days');
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近 14 天',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at')))
                        // 默认起始时间为15天前，但是如果店铺创建不到15天，则起始日期为店铺创建日期
                        var start_time = moment().subtract(14, 'days');
                        if (create_at > start_time) {
                            var start = create_at
                        } else {
                            var start = start_time
                        }
                        const end = moment().subtract(1, 'days');
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at')))
                        // 默认起始时间为15天前，但是如果店铺创建不到15天，则起始日期为店铺创建日期
                        var start_time = moment().subtract(1, 'months');
                        if (create_at > start_time) {
                            var start = create_at
                        } else {
                            var start = start_time
                        }
                        const end = moment().subtract(1, 'days');
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).subtract(1, 'days')
                    var yesterday = moment().subtract(1, 'days')
                    return (time.getTime() < create_at || time.getTime() > yesterday)
                }
            },
            monthOptions: {
                disabledDate(time) {
                    var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).subtract(1, 'months')
                    return (time.getTime() < create_at || time.getTime() > moment())
                }
            },
            today_salse: 0,
            yestoday_sales: 0,
            history_sales: {}
        }
    },
    mounted() {
        var self = this
        self.setDefaultTime()
        self.getSchools()
        self.getTodaySales()
        self.getTotalSales()
        $(window).resize(function(e){
            self.getDaliySales()
            self.getMonthSales()
        });
    },
    methods: {
        schoolChange() {
            $('#echart1').empty()
            $('#echart2').empty()
            this.getTodaySales()
            this.getTotalSales()
            this.getDaliySales()
            this.getMonthSales()
        },
        setDefaultTime() {
            var create_at = moment.unix(parseInt(localStorage.getItem('create_at')))
            // 默认起始时间为15天前，但是如果店铺创建不到15天，则起始日期为店铺创建日期
            if (create_at > moment().subtract(15,'days')) {
                this.date_range.push(create_at)
            } else {
                this.date_range.push(moment().subtract(15,'days'))
            }
            this.date_range.push(moment().subtract(1, 'days'))

            // 默认起始时间为六个月前，但是如果店铺创建不到六个月，则起始日期为店铺创建月份
            if (create_at.format('YYYY-MM') > moment().subtract(6,'months').format('YYYY-MM')) {
                this.month_range[0] = create_at.format('YYYY-MM')
            } else {
                this.month_range[0] = moment().subtract(6,'months').format('YYYY-MM')
            }
            this.month_range[1] = moment().format('YYYY-MM')
        },
        getTodaySales() {
            axios.post('/v1/statistic/get_today_sales', {
                "school_id": this.school_id //not required 学校id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    // console.log(data);
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
                    // console.log(data);
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
            axios.post('/v1/statistic/get_daliy_sales', {
                "school_id": this.school_id, //not required 学校id
                "start_at": this.date_range[0] ? moment(this.date_range[0], "YYYY-MM-DD").unix() : 0, //not required 起始时间
                "end_at": this.date_range[1] ? moment(this.date_range[1], "YYYY-MM-DD").unix() : 0 //not required 结束时间  end_at>start_at
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var date_statistic_0 = {
                        legend_data: ['新书销售额', '旧书销售额'],
                        xAxis_data: [],
                        series_data_0: [],  //新书
                        series_data_1: []  //旧书
                    }
                    var date_statistic_1 = {
                        legend_data: ['线上销售额', '线下销售额'],
                        xAxis_data: [],
                        series_data_0: [],  //线上
                        series_data_1: []  //线下
                    }
                    resp.data.data.forEach(el => {
                        date_statistic_0.xAxis_data.push(el.statistic_at)
                        date_statistic_0.series_data_0.push(priceFloat(el.online_new_book_sales_fee + el.offline_new_book_sales_fee)) //新书总额
                        date_statistic_0.series_data_1.push(priceFloat(el.online_old_book_sales_fee + el.offline_old_book_sales_fee)) //旧书总额

                        date_statistic_1.xAxis_data.push(el.statistic_at)
                        date_statistic_1.series_data_0.push(priceFloat(el.alipay_order_fee + el.wechat_order_fee)) //线上总额
                        date_statistic_1.series_data_1.push(priceFloat(el.offline_new_book_sales_fee + el.offline_old_book_sales_fee)) //先下总额
                    })
                    this.date_statistic[0] = date_statistic_0
                    this.date_statistic[1] = date_statistic_1
                    // console.log('>>>>>----- this.date_statistic ----->');
                    // console.log(this.date_statistic);
                    if (resp.data.data.length > 0) {
                        this.setEchart1()
                    }
                }
            })
        },
        setEchart1() {
            var $echart1 = document.getElementById('echart1')
            if ($echart1 == null || $echart1 == undefined) {
                return
            }
            var echart1 = echarts.init($echart1);
            var option_data = (this.date_statistic_type == 'new_old') ? this.date_statistic[0] : this.date_statistic[1]
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
                    left: '1%',
                    right: '4%',
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
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {
                            normal: {}
                        },
                        itemStyle: {
                            normal: {
                                color: '#dda490'
                            }
                        },
                        data: option_data.series_data_0
                    },
                    {
                        name: option_data.legend_data[1],
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
                        itemStyle: {
                            normal: {
                                color: '#aed4c2'
                            }
                        },
                        data: option_data.series_data_1
                    }
                ]
            };
            echart1.setOption(option);
        },
        getMonthSales() {
            axios.post('/v1/statistic/get_month_sales', {
                "school_id": this.school_id, //not required 学校id
                "start_at": this.month_range[0] ? moment(this.month_range[0], "YYYY-MM-DD").unix() : 0, //not required 起始时间
                "end_at": this.month_range[1] ? moment(this.month_range[1], "YYYY-MM-DD").unix() : 0 //not required 结束时间  end_at>start_at
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var month_statistic_0 = {
                        legend_data: [],
                        series_month_data: [],
                        series_data: []
                    }
                    var month_statistic_1 = {
                        legend_data: [],
                        series_month_data: [],
                        series_data: []
                    }
                    resp.data.data.forEach(el => {
                        var month_online_offline_sales = el.online_sales + el.offline_sales //等于总销售额
                        var month_new_old_sales = el.newbook_sales + el.oldbook_sales //不等于总销售额（因为不包含运费）
                        var month_freight = month_online_offline_sales - month_new_old_sales
                        month_statistic_0.legend_data.push(el.month)
                        month_statistic_0.series_month_data.push({
                            value: priceFloat(month_online_offline_sales),
                            name: el.month
                        })

                        month_statistic_0.series_data.push({
                            value: priceFloat(el.newbook_sales),
                            name: '新书'
                        })
                        month_statistic_0.series_data.push({
                            value: priceFloat(el.oldbook_sales),
                            name: '旧书'
                        })
                        month_statistic_0.series_data.push({
                            value: priceFloat(month_freight),
                            name: '运费'
                        })

                        month_statistic_1.legend_data.push(el.month)
                        month_statistic_1.series_month_data.push({
                            value: priceFloat(month_online_offline_sales),
                            name: el.month
                        })

                        month_statistic_1.series_data.push({
                            value: priceFloat(el.online_sales),
                            name: '线上'
                        })
                        month_statistic_1.series_data.push({
                            value: priceFloat(el.offline_sales),
                            name: '线下'
                        })
                    })
                    month_statistic_0.legend_data.push('新书')
                    month_statistic_0.legend_data.push('旧书')
                    month_statistic_0.legend_data.push('运费')

                    month_statistic_1.legend_data.push('线上')
                    month_statistic_1.legend_data.push('线下')

                    this.month_statistic[0] = month_statistic_0
                    this.month_statistic[1] = month_statistic_1
                    // console.log('>>>>>----- this.month_statistic ----->');
                    // console.log(this.month_statistic);
                    if (resp.data.data.length > 0) {
                        this.setEchart2()
                    }
                }
            })
        },
        setEchart2() {
            var $echart2 = document.getElementById('echart2')
            if ($echart2 == null || $echart2 == undefined) {
                return
            }
            var echart2 = echarts.init($echart2);
            var option_data = (this.month_statistic_type == 'new_old') ? this.month_statistic[0] : this.month_statistic[1]
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: option_data.legend_data
                },
                series: [{
                        name: '月份总销售额',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '50%'],

                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: option_data.series_month_data
                    },
                    {
                        name: '月份总销售额明细',
                        type: 'pie',
                        radius: ['65%', '85%'],

                        data: option_data.series_data
                    }
                ]
            };
            echart2.setOption(option);
        },
        getSchools() {
            axios.post('/v1/school/store_schools', {
                status: 3
            }).then(resp => {
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
