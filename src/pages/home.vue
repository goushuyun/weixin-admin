<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">{{store_info.name}}</h2>
  </div>
  <div class="content_inner">
    <div class="left_part">
      <el-card style="margin-bottom: 15px;">
        <p>开店流程</p>
        <div class="steps_area">
          <div class="tool" @click="goToStoreInfo">
            <div>
              <div class="icon_area"><i class="el-icon-edit"></i></div>
              <div class="text_area">第一步：完善店铺信息</div>
            </div>
          </div>
          <div class="tool" @click="goToStoreSetting">
            <div>
              <div class="icon_area"><i class="el-icon-setting"></i></div>
              <div class="text_area">第二步：进行店铺设置</div>
            </div>
          </div>
          <div class="tool" @click="goToAddBook">
            <div>
              <div class="icon_area"><i class="el-icon-menu"></i></div>
              <div class="text_area">第三步：上架图书</div>
            </div>
          </div>
          <div class="tool" @click="goToWeixin">
            <div>
              <div class="icon_area"><i class="el-icon-share"></i></div>
              <div class="text_area">第四步：绑定微信公众号</div>
            </div>
          </div>
        </div>
        <div v-if="!store_info.is_expire" class="end_time_area">云店到期于：{{store_info.expire_at}}</div>
        <p v-else class="end_time_area" style="color:#FF4949">云店到期于：{{store_info.expire_at}}（已到期）</p>
      </el-card>
      <el-card>
        <div class="tools_area">
          <div class="tool" @click="goToOrderList(1)">
            <div>
              <div class="icon_area">{{undelivered_order_num}}</div>
              <div class="text_area">待发货</div>
            </div>
          </div>
          <div class="tool" @click="goToOrderList(77)">
            <div>
              <div class="icon_area">{{after_sale_order_num}}</div>
              <div class="text_area">待售后</div>
            </div>
          </div>
          <div class="tool" @click="goToRetail">
            <div>
              <div class="icon_area"><i class="fa fa-balance-scale" aria-hidden="true"></i></div>
              <div class="text_area">线下零售</div>
            </div>
          </div>
          <div class="tool" @click="goToAddBook">
            <div>
              <div class="icon_area"><i class="fa fa-book" aria-hidden="true"></i></div>
              <div class="text_area">上架图书</div>
            </div>
          </div>
          <div class="tool" @click="goToStoreSetting">
            <div>
              <div class="icon_area"><i class="el-icon-setting"></i></div>
              <div class="text_area">店铺设置</div>
            </div>
          </div>
          <div class="tool" @click="contactGoushuyun">
            <div>
              <div class="icon_area"><i class="fa fa-phone" aria-hidden="true"></i></div>
              <div class="text_area">咨询热线</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right_part">
      <el-card class="time_area">{{date_time.time?date_time.time:'00:00'}}</el-card>
      <el-card style="margin-bottom:15px">
        <div class="date_area">
            <div style="width: 40%">{{date_time.week?date_time.week:'星期几'}}</div>
            <div style="width: 60%">{{date_time.date?date_time.date:'哪年哪月哪日'}}</div>
        </div>
      </el-card>
      <el-card>
        <el-select v-model="school_id" style="width: 240px;" clearable placeholder="所有学校" size="small" @change="indexOrderNumStatistic">
          <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
        </el-select>
      </el-card>
      <el-card>
        <div class="info_row">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日销售额</div>
              <div class="icon_area">{{today_data.total_sales}}</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日销售额</div>
              <div class="icon_area">{{yesterday_data.total_sales}}</div>
            </div>
          </div>
        </div>
        <div class="info_row" style="border-top: 1px dashed #888;padding-top:18px;">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日订单量</div>
              <div class="icon_area">{{today_data.order_num}}</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日订单量</div>
              <div class="icon_area">{{yesterday_data.order_num}}</div>
            </div>
          </div>
        </div>
        <div class="info_row" style="border-top: 1px dashed #888;padding-top:18px;">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日处理订单</div>
              <div class="icon_area">{{today_data.handled_order_num}}</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日处理订单</div>
              <div class="icon_area">{{yesterday_data.handled_order_num}}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog title="联系我们" :visible.sync="dialogTableVisible">
      <p style="margin:0 0 15px 40px;">欢迎您选择任何方式联系我们</p>
      <el-table :data="gridData">
        <el-table-column property="name" label="姓名" width="100"></el-table-column>
        <el-table-column property="tell" label="手机 / 微信" width="150"></el-table-column>
        <!-- <el-table-column property="weixin" label="微信" width="150"></el-table-column> -->
        <el-table-column property="remark" label="备注"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {
    priceFloat,
    priceInt
} from '../scripts/utils'
import axios from "../scripts/http"
export default {
    data() {
        return {
            gridData: [{
                name: '刘经理',
                tell: '13122517826',
                weixin: 'lhc18817380234',
                remark: '售前（了解咨询、签订合同）'
            },{
                name: '赵经理',
                tell: '17701610579',
                weixin: 'Menfolk_jun',
                remark: '售后（需求反馈、续费申请）'
            }],
            dialogTableVisible: false,
            store_info: {
                name: '',
                id: '',
                expire_at: '',
                is_expire: ''
            },

            date_time: {
                date: '',
                time: '',
                week: ''
            },

            undelivered_order_num: '', //待发货
            after_sale_order_num: '', //待售后
            today_data: {}, //今日订单统计
            yesterday_data: {}, //昨日订单统计

            school_id: '',
            schools: [],

            exit: false //关闭时钟的标识
        }
    },
    mounted() {
        this.getDateTime()
        this.getSchools()
        this.getStoreInfo()
        this.indexOrderNumStatistic()
    },
    destroyed() {
        this.exit = true
        this.getDateTime()
    },
    methods: {
        goToStoreInfo() {
            this.$store.commit('setMenuActive', '5-1')
            localStorage.setItem('menu_active', '5-1')
            this.$router.push({name: 'cloud_store'})
        },
        goToOrderList(order_status) {
            this.$store.commit('setOrderSearch', {
                order_status: order_status
            })
            this.$store.commit('setMenuActive', '1-1')
            localStorage.setItem('menu_active', '1-1')
            this.$router.push({name: 'order_list'})
        },
        goToWeixin() {
            this.$store.commit('setMenuActive', '5-3')
            localStorage.setItem('menu_active', '5-3')
            this.$router.push({name: 'weixin_setting'})
        },
        goToRetail() {
            this.$store.commit('setMenuActive', '1-3')
            localStorage.setItem('menu_active', '1-3')
            this.$router.push({name: 'offline_retail'})
        },
        goToAddBook() {
            this.$store.commit('setMenuActive', '3-1')
            localStorage.setItem('menu_active', '3-1')
            this.$router.push({name: 'by_isbn'})
        },
        goToStoreSetting() {
            this.$store.commit('setMenuActive', '5-2')
            localStorage.setItem('menu_active', '5-2')
            this.$router.push({name: 'school'})
        },
        getStoreInfo() {
            var self = this
            var today = moment().format('YYYY-MM-DD');
            axios.post('/v1/store/store_info', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    self.store_info.id = data.id
                    self.store_info.name = data.name
                    // 在首页将 expire_at 存入缓存，后面使用
                    localStorage.setItem('create_at',data.create_at)
                    self.store_info.expire_at = moment.unix(data.expire_at).format('YYYY-MM-DD')
                    if (self.store_info.expire_at < today) {
                        self.store_info.is_expire = true
                    } else {
                        self.store_info.is_expire = false
                    }
                }
            })
        },
        contactGoushuyun() {
            this.dialogTableVisible = true
        },
        //店铺首页订单数量统计
        indexOrderNumStatistic() {
            axios.post('/v1/store/index_order_num_statistic',{
                school_id: this.school_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.undelivered_order_num = data.undelivered_order_num //待发货
                    this.after_sale_order_num = data.after_sale_order_num //待售后

                    data.today_data.total_sales = priceFloat(data.today_data.total_sales)
                    this.today_data = data.today_data

                    data.yesterday_data.total_sales = priceFloat(data.yesterday_data.total_sales)
                    this.yesterday_data = data.yesterday_data //昨日订单统计
                }
            })
        },
        getDateTime() {
            var self = this
            var getDateTineInterval = setInterval(() => {
                if (!self.exit) {
                    var date_time = moment()
                    self.date_time = {
                        date: date_time.format('LL'),
                        time: date_time.format('HH:mm'),
                        week: date_time.format('dddd')
                    }
                } else {
                    clearTimeout(getDateTineInterval)
                }
            }, 1000);
        },
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
.time_area {
    background-color: #47BFBD;
    color: #FFFFFF;
    font-size: 60px;
    font-weight: bold;
    text-align: center;
    padding: 9px 0;
}
.date_area {
    color: #47BFBD;
    display: flex;
    align-items: center;
    text-align: center;
}
.left_part {
    width: auto;
    margin-right: 296px;
    .end_time_area {
        position: absolute;
        right: 340px;
        top: 36px;
        color: #888;
    }
    .steps_area {
        display: flex;
        justify-content:space-between;
        padding: 10px 0;
        .tool {
            padding: 20px 0;
            display: flex;
            justify-content: center;
            color: #47BFBD;
            .icon_area {
                text-align: center;
                font-size: 30px;
            }
            .text_area {
                width: auto;
                text-align: center;
                margin-top: 16px;
            }
            &:hover {
                cursor: pointer;
                color: #1D8CE0;
            }
        }
    }
    .tools_area {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        min-height: 330.5px;
        .tool {
            width: 124px;
            height: 124px;
            margin: 20px 23.4px;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon_area {
                width: 60px;
                height: 60px;
                line-height: 60px;
                text-align: center;
                border-radius: 50%;
                background-color: #47BFBD;
                font-size: 30px;
                font-weight: bold;
                color: #FFFFFF;
            }
            .text_area {
                width: auto;
                text-align: center;
                margin-top: 16px;
            }
            &:hover {
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 0, 0,.3);
            }
        }
    }
}
.right_part {
    position: absolute;
    width: 280px;
    right: 16px;
    top: 16px;
    .info_row {
        display: flex;
        .info_col {
            height: 80px;
            display: flex;
            align-items: center;
            .text_area {
                text-align: left;
                font-size: 14px;
            }
            .icon {
                font-size: 12px;
                color: #4EC089;
            }
            .icon_area {
                text-align: left;
                padding-left: 15px;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
            }
        }
    }
}
</style>
