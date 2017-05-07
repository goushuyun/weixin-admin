<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">{{shop_name}}</h2>
  </div>
  <div class="content_inner">
    <div class="left_part">
      <el-card style="margin-bottom: 15px;">
        <p>开店流程</p>
        <el-steps center style="margin: 30px;">
          <el-step title="完善店铺信息" icon="edit" @cilck="test"></el-step>
          <el-step title="进行店铺设置" icon="setting"></el-step>
          <el-step title="上架图书" icon="menu"></el-step>
          <el-step title="绑定微信公众号" icon="share"></el-step>
        </el-steps>
        <div class="end_time_area">云店到期于：{{expire_at}}</div>
      </el-card>

      <el-card>
        <div class="tools_area">
          <div class="tool" @click="goToOrderList(1)">
            <div>
              <div class="icon_area">12</div>
              <div class="text_area">待发货</div>
            </div>
          </div>
          <div class="tool" @click="goToOrderList(77)">
            <div>
              <div class="icon_area">12</div>
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
          <div class="tool" @click="goToStorSetting">
            <div>
              <div class="icon_area"><i class="el-icon-setting"></i></div>
              <div class="text_area">店铺设置</div>
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
        <el-select v-model="school_id" style="width: 240px;" clearable placeholder="所有学校" size="small">
          <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
        </el-select>
      </el-card>
      <el-card>
        <div class="info_row">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日销售额</div>
              <div class="icon_area">12</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日销售额</div>
              <div class="icon_area">12</div>
            </div>
          </div>
        </div>
        <div class="info_row" style="border-top: 1px dashed #888;padding-top:18px;">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日订单量</div>
              <div class="icon_area">12</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日订单量</div>
              <div class="icon_area">12</div>
            </div>
          </div>
        </div>
        <div class="info_row" style="border-top: 1px dashed #888;padding-top:18px;">
          <div class="info_col" style="width: 55%;">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 今日处理订单</div>
              <div class="icon_area">12</div>
            </div>
          </div>
          <div class="info_col">
            <div>
              <div class="text_area"><i class="fa fa-asterisk icon" aria-hidden="true"></i> 昨日处理订单</div>
              <div class="icon_area">12</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
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
            expire_at: '',

            date_time: {
                date: '',
                time: '',
                week: ''
            },

            shop_name: '',
            school_id: '',
            schools: [],

            exit: false //关闭时钟的标识
        }
    },
    mounted() {
        this.shop_name = this.$store.state.current_store.name
        this.getDateTime()
        this.getSchools()
        this.getStoreInfo()
    },
    destroyed() {
        this.exit = true
        this.getDateTime()
    },
    methods: {
        test() {
            console.log('..........................');
        },
        goToOrderList(order_status) {
            this.$store.commit('setOrderSearch', {
                order_status: order_status
            })
            this.$router.push({name: 'order_list'})
        },
        goToRetail() {
            this.$router.push({name: 'offline_retail'})
        },
        goToAddBook() {
            this.$router.push({name: 'by_isbn'})
        },
        goToStorSetting() {
            this.$router.push({name: 'location'})
        },
        getStoreInfo() {
            var self = this
            axios.post('/v1/store/store_info', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    self.expire_at = moment.unix(resp.data.data.expire_at).format('YYYY-MM-DD')
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
    .tools_area {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 0;
        min-height: 330.5px;
        .tool {
            width: 124px;
            height: 124px;
            margin: 20px;
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
                text-align: center;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
            }
        }
    }
}
</style>
