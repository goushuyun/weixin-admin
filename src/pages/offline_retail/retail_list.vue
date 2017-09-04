<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">线下订单</h2>
  </div>
  <div class="content_inner">
    <el-form :inline="true">
        <el-form-item>
            <el-select v-model="school_id" style="width: 240px;" clearable placeholder="全部学校" size="small" @change="getOrders">
                <el-option label="全部学校" value=""></el-option>
                <el-option-group label="运营中的学校">
                  <el-option v-for="school in schools" v-if="school.status == 0" :label="school.name" :value="school.id"></el-option>
                </el-option-group>
                <el-option-group label="已删除的学校">
                  <el-option v-for="school in schools" v-if="school.status == 1" :label="school.name" :value="school.id">
                    <span style="float: left">{{ school.name }}</span>
                  </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker :editable="false" v-model="order_time" size="small" type="datetimerange" placeholder="选择下单时间" :picker-options="pickerOptions" @change="getOrders" style="width: 300px;"></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="搜索值" v-model.trim="isbn" style="width: 300px;" size="small" icon="search" :on-icon-click="getOrders">
                <template slot="prepend">ISBN</template>
            </el-input>
        </el-form-item>
    </el-form>
    <div style="background-color: #FFFFFF; min-height:100px;" v-loading.body="loading" element-loading-text="拼命加载中">
      <div class="row" v-if="!orders.length">
        <div class="order_item">
          <div class="title" style="text-align:center">
            暂无数据
          </div>
        </div>
      </div>
      <div class="row">
        <div class="order_item" v-for="(order,index) in orders">
          <div class="title">
            <span style="margin:0 10px;">订单编号：{{order.retail.id}}</span>
            <span style="margin:0 10px;">付款时间：{{order.retail.create_at}}</span>
            <span style="margin:0 10px;">学校：{{order.retail.school_name}}</span>
            <div class="tag_area">处理人：{{order.retail.handle_staff_name}}</div>
          </div>
          <div class="detail">
            <div style="width:640px">
              <el-row type="flex" align="middle" v-for="(item,index) in order.items" :style="index + 1 == order.items.length ? '' : 'border-bottom: 1px solid #EEF1F6;'">
                <el-col style="width:140px;">
                  <div class="image_area">
                    <img :src="'http://onv8eua8j.bkt.clouddn.com/' + item.book_image" class="image"></img>
                  </div>
                </el-col>
                <el-col style="width:300px">
                  <p>{{item.book_title}}</p>
                  <p style="color:#555">{{item.book_isbn}}</p>
                </el-col>
                <el-col style="width:100px">
                  <el-tag v-if="item.type == 0" type="primary">新书</el-tag>
                  <el-tag v-else type="success">二手书</el-tag>
                </el-col>
                <el-col style="width:100px">￥{{item.price}}</el-col>
                <el-col style="width:100px">x{{item.amount}}</el-col>
              </el-row>
            </div>
            <div class="opt_area" :style="'height:' + 74 * order.items.length + 'px;'">
              <p>应收总额 ￥{{order.retail.goods_fee}}</p>
              <p>实收总额 ￥{{order.retail.total_fee}}</p>
            </div>
          </div>
        </div>
      </div>
      <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</div>
</template>
<script>
import {
    priceFloat,
    priceInt
} from '../../scripts/utils'
import axios from "../../scripts/http"
export default {
    data() {
        return {
            order_time: [null, null], //时间选择器[最早时间,最晚时间]
            order_status: 80, //订单状态
            school_id: '',
            isbn: '',

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
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).subtract(1, 'days')
                    var yesterday = moment().subtract(1, 'days')
                    return (time.getTime() < create_at || time.getTime() > yesterday)
                }
            },

            orders: [],
            schools: [],

            page: 1,
            size: 10,
            total_count: 0,

            loading: false
        }
    },
    mounted() {
        this.getSchools()
    },
    methods: {
        handleSizeChange(size) {
            this.size = size
            this.getOrders()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getOrders()
        },
        getOrders() {
            this.loading = true
            var self = this
            var data = {
                "school_id": self.school_id,
                "isbn": self.isbn,
                "start_at": self.order_time[0] ? moment(self.order_time[0], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "end_at": self.order_time[1] ? moment(self.order_time[1], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "page": self.page,
                "size": self.size
            }
            axios.post('/v1/retail/find', data).then(resp => {
                if (resp.data.message == 'ok') {
                    self.total_count = resp.data.total_count
                    self.orders = resp.data.data.map(el => {
                        el.retail.create_at = moment.unix(el.retail.create_at).format('YYYY-MM-DD HH:mm:ss')
                        el.retail.school_name = self.getSchoolName(el.retail.school_id)
                        el.retail.handle_staff_name = el.charge_man.username
                        el.retail.total_fee = priceFloat(el.retail.total_fee)
                        el.retail.goods_fee = priceFloat(el.retail.goods_fee)
                        el.items.forEach(it => {
                            it.price = priceFloat(it.price)
                            return it
                        })
                        return el
                    })
                }
                this.loading = false
            })
        },
        getSchools() {
            axios.post('/v1/school/store_schools', {
                status: 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.schools = resp.data.data
                    this.getOrders()
                }
            })
        },
        getSchoolName(id) {
            var school_name = ''
            this.schools.forEach(school => {
                if (school.id == id) {
                    school_name = school.name
                    return
                }
            })
            return school_name
        }
    }
}
</script>

<style lang="scss" scoped>
.order_item {
    border: 1px solid #DFE6EC;
    margin-bottom: 15px;
    font-size: 13px;
    color: #1F2D3D;
    font-family: "Helvetica Neue";
    .title {
        background-color: #EEF1F6;
        height: 40px;
        line-height: 40px;
        width: 100%;
        .tag_area {
            margin: 0 10px;
            float: right;
        }
    }
    .address_area {
        height: 30px;
        line-height: 30px;
        width: 100%;
        border-top: 1px solid #DFE6EC;
        box-sizing: border-box;
        padding-left: 40px;
    }
    .detail {
        display: flex;
        align-items: center;
        .opt_area {
            width: 200px;
            padding-top: 10px;
            box-sizing: border-box;
            border-left: 1px solid #DFE6EC;
            text-align: center;
        }
        .image_area {
          height: 64px;
          width: 64px;
          text-align: center;
          margin: 5px 40px;
          img {
            max-width: 64px;
            max-height: 64px;
          }
        }
        p {
            line-height: 24px;
        }
    }
}
.row {
    margin-bottom: 15px;
    width: auto;
}
</style>
