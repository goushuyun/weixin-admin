<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">订单管理</h2>
  </div>
  <div class="content_inner">
    <el-form :inline="true">
        <el-form-item>
            <el-select v-model="school_id" style="width: 240px;" clearable placeholder="学校" size="small" @change="getOrders">
                <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker :editable="false" v-model="order_time" size="small" type="datetimerange" placeholder="选择下单时间" :picker-options="pickerOptions" @change="getOrders" style="width: 300px;"></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="搜索值" v-model.trim="search_value" style="width: 290px;" size="small" icon="search" @input="inputSearchValue" :on-icon-click="getOrders">
                <el-select v-model="search_type" style="width: 125px;" clearable slot="prepend" placeholder="筛选条件" size="small" @change="handleSearchValue">
                    <el-option label="订单编号" value="order"></el-option>
                    <el-option label="收货人手机号" value="mobile"></el-option>
                    <el-option label="收货人姓名" value="name"></el-option>
                    <el-option label="ISBN" value="isbn"></el-option>
                    <!-- <el-option label="班级购编号" value="class"></el-option> -->
                </el-select>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="resetForm" size="small"><i class="fa fa-refresh" aria-hidden="true"></i> 重置</el-button>
            <el-button type="primary" @click="test" size="small"><i class="fa fa-download" aria-hidden="true"></i> 导出</el-button>
        </el-form-item>
    </el-form>
    <div class="row">
      <el-radio-group v-model="order_status" size="small" @change="getOrders">
        <el-radio-button :label="1">待发货</el-radio-button>
        <el-radio-button :label="3">已发货</el-radio-button>
        <el-radio-button :label="7">已完成</el-radio-button>
        <el-radio-button :label="77">待处理售后</el-radio-button>
        <el-radio-button :label="78">已处理售后</el-radio-button>
        <el-radio-button :label="80">全部订单</el-radio-button>
      </el-radio-group>
    </div>
    <div class="row">
      <el-checkbox v-model="selected_all" style="margin:0 12px;" @change="selectedAllChange">全选</el-checkbox>
      <el-button type="primary" @click="" size="small"><i class="fa fa-truck" aria-hidden="true"></i> 批量发货</el-button>
      <el-button type="primary" @click="" size="small"><i class="fa fa-print" aria-hidden="true"></i> 批量打印</el-button>
    </div>
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
             <div class="checkbox_area">
               <el-checkbox v-model="order.order.selected" @change="checkSelectedAll"></el-checkbox>
             </div>
             <span style="margin:0 10px;">订单编号：{{order.order.id}}</span>
             <span style="margin:0 10px;">付款时间：{{order.order.pay_at}}</span>
             <span style="margin:0 10px;">学校：{{order.order.school_name}}</span>
             <div class="tag_area">
                <el-tag v-if="order.order.groupon_id" type="success">班级购</el-tag>
                <el-tag v-if="order.order.print_at" type="warning">已打印</el-tag>

                <el-tag v-if="order.order.after_sale_status == 1" type="danger">待处理售后</el-tag>
                <el-tag v-if="order.order.after_sale_status > 1" type="primary">已处理售后</el-tag>

                <el-tag v-if="order.order.order_status == 1" type="danger">待发货</el-tag>
                <el-tag v-if="order.order.order_status == 3" type="primary">已发货</el-tag>
                <el-tag v-if="order.order.order_status == 7" type="primary">已完成</el-tag>
             </div>
        </div>
        <div class="detail">
          <div style="width:640px">
            <el-row type="flex" align="middle" v-for="(item,index) in order.items" :style="index + 1 == order.items.length ? '' : 'border-bottom: 1px solid #EEF1F6;'">
              <el-col style="width:140px;">
                <img :src="'http://onv8eua8j.bkt.clouddn.com/' + item.book_image" class="image"></img>
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
            <p>订单总额（元）￥{{order.order.total_fee}}</p>
            <p style="color:#888">（含快递￥{{order.order.freight}}）</p>
          </div>
          <div class="opt_area" :style="'height:' + 74 * order.items.length + 'px;'">
            <el-button type="primary" size="mini" style="width:80px" @click="goToDetail(index)"><i class="fa fa-eye" aria-hidden="true"></i> 查看详情</el-button>
            <p v-if="order.order.groupon_id">班级购编号：{{order.order.groupon_id}}</p>
          </div>
        </div>
        <div class="address_area">
          收货人信息：{{order.order.name}}，{{order.order.mobile}}，{{order.order.address}}
        </div>
      </div>
    </div>
    <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
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

            search_type: '',
            search_value: '',
            order_id: '',
            mobile: '',
            name: '',
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
                }]
            },

            selected_all: false,
            orders: [],
            selected_orders: [],
            schools: [],

            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.getStoreData()
        this.getSchools()
        this.getOrders()
    },
    destroyed() {
        this.$store.commit('setOrderSearch', {
            order_time: this.order_time, //时间选择器[最早时间,最晚时间]
            order_status: this.order_status, //订单状态
            school_id: this.school_id,
            search_type: this.search_type,
            search_value: this.search_value,
            order_id: this.order_id,
            mobile: this.mobile,
            name: this.name,
            isbn: this.isbn,
            page: this.page,
            size: this.size
        })
    },
    methods: {
        test() {
            this.getSelectedOrders()
            console.log(this.selected_orders);
        },
        getSelectedOrders() {
            var selected_orders = []
            this.orders.forEach(el => {
                if (el.order.selected) {
                    selected_orders.push(el)
                }
            })
            this.selected_orders = selected_orders
            return selected_orders
        },
        checkSelectedAll() {
            // 待优化
            this.getSelectedOrders()
            this.selected_all = this.orders.length == this.selected_orders.length
        },
        selectedAllChange() {
            this.orders.map(el => {
                el.order.selected = this.selected_all
            })
        },
        goToDetail(index) {
            var school_name = this.orders[index].order.school_name
            var order_id = this.orders[index].order.id
            this.$router.push({
                name: 'order_detail',
                params: {
                    school_name,
                    order_id
                }
            })
        },
        handleSizeChange(size) {
            this.size = size
            this.getOrders()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getOrders()
        },
        handleSearchValue(type) {
            this.order_id = ''
            this.mobile = ''
            this.name = ''
            this.isbn = ''
            if (this.search_value.trim() != '') {
                this.inputSearchValue(0, type)
            }
        },
        // 第一个参数为input事件的参数，在此需要使用的是自己传入的参数，即第二个参数
        inputSearchValue(val, type) {
            var search_type = this.search_type
            if (type) {
                search_type = type
            }
            switch (search_type) {
                case 'order':
                    this.order_id = this.search_value
                    break;
                case 'mobile':
                    this.mobile = this.search_value
                    break;
                case 'name':
                    this.name = this.search_value
                    break;
                case 'isbn':
                    this.isbn = this.search_value
                    break;
            }
        },
        resetForm() {
            this.order_time = [null, null] //时间选择器[最早时间,最晚时间]
            this.order_status = 80 //订单状态
            this.school_id = ''

            this.search_type = ''
            this.search_value = ''
            this.order_id = ''
            this.mobile = ''
            this.name = ''
            this.isbn = ''
            this.getOrders()
        },
        getStoreData() {
            var order_search = this.$store.state.order_search
            this.order_time = order_search.order_time ? order_search.order_time : [null, null]
            this.order_status = order_search.order_status ? order_search.order_status : 80
            this.school_id = order_search.school_id ? order_search.school_id : ''
            this.search_type = order_search.search_type ? order_search.search_type : ''
            this.search_value = order_search.search_value ? order_search.search_value : ''
            this.order_id = order_search.order_id ? order_search.order_id : ''
            this.mobile = order_search.mobile ? order_search.mobile : ''
            this.name = order_search.name ? order_search.name : ''
            this.isbn = order_search.isbn ? order_search.isbn : ''
            this.page = order_search.page ? order_search.page : 1
            this.size = order_search.size ? order_search.size : 10
        },
        getOrders() {
            if (this.search_value && !this.search_type) {
                this.$message.warning('请选择检索类型！')
                return
            }
            var self = this
            var data = {
                "id": self.order_id,
                "mobile": self.mobile,
                "name": self.name,
                "isbn": self.isbn,
                "order_status": self.order_status,
                "school_id": self.school_id.trim(),
                "start_at": self.order_time[0] ? moment(self.order_time[0], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "end_at": self.order_time[1] ? moment(self.order_time[1], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "page": self.page,
                "size": self.size
            }
            axios.post('/v1/order/search', data).then(resp => {
                if (resp.data.message == 'ok') {
                    self.total_count = resp.data.total_count
                    self.orders = resp.data.data.map(el => {
                        if (el.order.order_status >= 17 && el.order.order_status <= 23) {
                            el.order.order_status = el.order.order_status - 16
                        }
                        el.order.pay_at = moment.unix(el.order.pay_at).format('YYYY-MM-DD HH:mm:ss')
                        el.order.school_name = self.getSchoolName(el.order.school_id)
                        el.order.freight = priceFloat(el.order.freight)
                        el.order.total_fee = priceFloat(el.order.total_fee)
                        el.order.selected = false
                        el.items.forEach(it => {
                            it.price = priceFloat(it.price)
                            return it
                        })
                        return el
                    })
                }
            })
        },
        getSchools() {
            axios.post('/v1/school/store_schools', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.schools = resp.data.data
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
        .checkbox_area {
            width: 40px;
            text-align: center;
            float: left;
        }
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
        img {
            width: 48px;
            height: 64px;
            margin: 5px 40px;
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
