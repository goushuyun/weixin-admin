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
            <el-button type="primary" @click="preExportOrder" size="small"><i class="fa fa-download" aria-hidden="true"></i> 导出</el-button>
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
      <el-button v-if="order_status == 1" type="primary" @click="preSelectedDeliver" size="small"><i class="fa fa-truck" aria-hidden="true"></i> 批量发货</el-button>
      <el-button type="primary" @click="" size="small" @click="preSelectedPrint"><i class="fa fa-print" aria-hidden="true"></i> 批量打印</el-button>
    </div>
    <div class="row" v-if="!orders.length">
      <div class="order_item">
        <div class="title" style="text-align:center">暂无数据</div>
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
            <el-button type="primary" size="mini" style="width:80px" @click="goToDetail(index)"><i class="fa fa-search" aria-hidden="true"></i> 查看详情</el-button>
            <p v-if="order.order.groupon_id">班级购编号：{{order.order.groupon_id}}</p>
          </div>
        </div>
        <div class="address_area">
          <span style="margin-right:20px;">收货人信息：{{order.order.name}}，{{order.order.mobile}}，{{order.order.address}}</span>
          <span v-if="order.order.remark" style="color:#FF4949;">订单备注：{{order.order.remark}}</span>
        </div>
      </div>
    </div>
    <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 批量打印 -->
    <el-dialog title="批量打印" :visible.sync="print_dialog.visible" size="small" :close-on-click-modal="false" :close-on-press-escape="false" @close="getOrders">
      <div class="print_dialog">
          <p class="desc">已选中 {{print_dialog.selected_count}} 条订单，有 {{print_dialog.printed_count}} 条已经打印过了</p>
          <p><el-radio class="radio" v-model="print_dialog.radio" label="0">打印发货详情</el-radio></p>
          <p><el-radio class="radio" disabled v-model="print_dialog.radio" label="1">打印快递单（此功能暂未开放）</el-radio></p>
          <p>默认打印机：<span style="color:#FF4949">{{print_dialog.printer}}</span></p>
          <div class="desc" style="line-height:24px;">请务必确保打印机正确，否则会造成错误。</div>
          <div class="desc" style="line-height:24px;">您可以在“控制面板-设备和打印机”中修改默认打印机。</div>
          <div class="footer1" v-if="order_status == 1">
            <el-checkbox v-model="checked">打印成功后，直接将订单置为发货状态（不建议勾选）</el-checkbox>
            <el-button style="float:right" type="primary" size="small" @click="confirmSelectedPrint">打印</el-button>
          </div>
          <div class="footer2" v-else>
            <el-button type="primary" size="small" @click="confirmSelectedPrint">打印</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 打印过程 -->
    <el-dialog class="printing_dialog" title="正在批量打印并发货，请耐心等待......" :visible.sync="printing_dialog.visible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div class="printProgress">
        <el-progress v-if="printing_dialog.percentage != 100" type="circle" :percentage="printing_dialog.percentage"></el-progress>
        <el-progress v-else type="circle" :percentage="100" status="success"></el-progress>
      </div>

      <div class="printResult">
        <el-alert style="margin:30px auto;" title="请确保当前打印机无其他打印任务！" type="warning" :closable="false"></el-alert>
        <el-collapse v-model="printing_dialog.active_names">
          <el-collapse-item v-if="printing_dialog.fail_orders.length" name="fail">
            <template slot="title">
              <span class="fail">{{printing_dialog.fail_orders.length}} 条订单打印失败！ <i class="header-icon el-icon-information"></i></span>
            </template>
            <p v-for="(order_id, index) in printing_dialog.fail_orders">{{(index + 1) + '. 订单 ' + order_id + ' 打印失败！'}}</p>
          </el-collapse-item>
          <el-collapse-item v-if="printing_dialog.success_orders.length">
            <template slot="title">
              <span class="success">{{printing_dialog.success_orders.length}} 条订单打印成功！ <i class="header-icon el-icon-circle-check"></i></span>
            </template>
            <p v-for="(order_id, index) in printing_dialog.success_orders">{{(index + 1) + '. 订单 ' + order_id + ' 打印成功！'}}</p>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="footer">
        <el-button type="primary" size="small" :disabled="printing_dialog.disabled_btn" @click="completeSelectedPrint">完成</el-button>
      </div>
    </el-dialog>

    <!-- 导出 -->
    <el-dialog title="批量导出" :visible.sync="export_dialog.visible" size="small" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="export_dialog">
          <p><el-radio class="radio" disabled v-model="export_dialog.radio" label="0">导出报订单（此功能暂未开放）</el-radio></p>
          <p class="desc">报订单会将待发货订单中的新书整理出来，以便于向上一级书商订书</p>
          <p><el-radio class="radio" v-model="export_dialog.radio" label="1">导出发货单</el-radio></p>
          <p class="desc">发货单会将待发货订单整理出来，你可以配合"快递助手"使用，直接打印快递单</p>
          <p class="desc">选择学校：
            <el-select v-model="export_dialog.school_id" style="width: 300px;" clearable placeholder="学校" size="small">
              <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
            </el-select>
          </p>
          <p class="desc">选择时间：
            <el-date-picker :editable="false" v-model="export_dialog.time_range" size="small" type="datetimerange" placeholder="选择时间" :picker-options="pickerOptions" style="width: 300px;"></el-date-picker>
          </p>
          <div class="footer">
            <el-button type="primary" size="small" @click="confirmExportOrder">导出</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 批量发货 -->
    <el-dialog title="批量发货" :visible.sync="deliver_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" @close="getOrders">
      <div class="deliver_dialog">
          <p class="desc">已选中 {{deliver_dialog.selected_count}} 条订单</p>
          <p class="desc">请确认这些订单已经发货，再将订单置为发货状态</p>
          <div class="footer">
            <el-button type="primary" size="small" @click="confirmSelectedDeliver">发货</el-button>
          </div>
      </div>
    </el-dialog>
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
            print_dialog: {
                visible: false,
                selected_count: 0,
                printed_count: 0,
                radio: '0',
                printer: '',
                checked: false
            },
            printing_dialog: {
                visible: false,
                active_names: ['fail'],
                percentage: 0,
                success_orders: [],
                fail_orders: [],
                disabled_btn: true
            },
            export_dialog: {
                visible: false,
                school_id: '',
                time_range: [],
                radio: '1'
            },
            deliver_dialog: {
                selected_count: 0,
                visible: false
            },
            order_time: [], //时间选择器[最早时间,最晚时间]
            order_status: 1, //订单状态
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
        preSelectedPrint() {
            var self = this
            if (!checkLodopIsInstall()) {
                self.$confirm('您尚未安装打印插件，请先安装！', '提示', {
                    confirmButtonText: '确认安装',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    window.location.assign('http://okxy9gsls.bkt.clouddn.com/CLodop_Setup_for_Win32NT.exe')
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消操作!'
                    });
                });
                return
            }
            var selected_orders = this.getSelectedOrders()
            if (selected_orders.length <= 0) {
                self.$message.warning('您尚未勾选任何订单！')
                return
            }
            this.print_dialog.selected_count = selected_orders.length
            this.print_dialog.printer = getPrinterName()
            this.print_dialog.visible = true
        },
        confirmSelectedPrint() {
            this.print_dialog.visible = false
            this.printing_dialog.visible = true
            if (this.print_dialog.radio == '0') {
                this.realityPrint()
            } else {
                // 打印快递单（此功能暂未开放）
            }
        },
        completeSelectedPrint() {
            this.printing_dialog = {
                visible: false,
                active_names: ['fail'],
                percentage: 0,
                success_orders: [],
                fail_orders: [],
                disabled_btn: true
            },
            this.getOrders()
        },
        realityPrint(index) {
            var self = this
            var selected_orders = self.selected_orders
            for (var i = 0; i < selected_orders.length; i++) {
                (function(order) {
                    var baseJson = {
                        "order": order
                    }
                    var unit = 100 / selected_orders.length
                    orderPromiseFunc(baseJson);
                    var count = 0
                    var checkPrintOver = setInterval(function() {
                        if (localStorage.printOver == 'true') {
                            console.log('打印完成！');
                            var percentage = self.printing_dialog.percentage + unit
                            if (percentage < 100) {
                                self.printing_dialog.percentage = percentage
                            } else {
                                self.printing_dialog.percentage = 100
                                self.printing_dialog.disabled_btn = false
                            }
                            if (localStorage.printSuccess == 'true') {
                                console.log('打印成功！');
                                self.servicePrint(order.order.id)
                                self.printing_dialog.success_orders.push(order.order.id)
                                if (self.print_dialog.checked) {
                                    self.deliver(order.order.id)
                                }
                            } else {
                                console.log('打印失败！');
                                self.printing_dialog.fail_orders.push(order.order.id)
                                if (localStorage.clearPrinterOk == 'true') {} else {
                                    self.$notify.error({
                                        title: '错误',
                                        message: '连接打印机失败！',
                                        duration: 0
                                    });
                                }
                            }
                            clearTimeout(checkPrintOver)
                        } else if (count > 30) {
                            clearTimeout(checkPrintOver)
                        }
                        count++
                    }, 500)
                })(selected_orders[i])
            }
        },
        servicePrint(order_id) {
            axios.post('/v1/order/print', {
                id: order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('服务器已记录订单：' + order_id + ' 的此次打印！');
                }
            })
        },
        deliver(order_id) {
            axios.post('/v1/order/deliver', {
                id: order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('订单：' + order_id + ' 已发货！');
                }
            })
        },
        preExportOrder() {
            this.export_dialog.school_id = this.school_id
            this.export_dialog.time_range = this.order_time
            this.export_dialog.visible = true
        },
        confirmExportOrder() {
            if (!this.export_dialog.school_id) {
                this.$message.warning('请选择学校！')
                return
            }
            if (!this.export_dialog.time_range[0]) {
                this.$message.warning('请选择时间范围！')
                return
            }
            var store = JSON.parse(localStorage.getItem('store'))
            var params = {
                "store_id": store.id,
                "school_id": this.export_dialog.school_id,
                "start_at": this.export_dialog.time_range[0] ? moment(this.export_dialog.time_range[0], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "end_at": this.export_dialog.time_range[1] ? moment(this.export_dialog.time_range[1], "YYYY-MM-DD HH:mm:ss").unix() : 0,
            }
            if (this.export_dialog.radio == '0') {
                // 导出报订单（此功能暂未开放）
            } else {
                window.location.assign('http://admin.goushuyun.com/v1/order/export_order?params=' + JSON.stringify(params))
            }
            setTimeout(() => {
                this.export_dialog.visible = false
            }, 1500)
        },
        preSelectedDeliver() {
            var selected_orders = this.getSelectedOrders()
            if (selected_orders.length <= 0) {
                this.$message.warning('您尚未勾选任何订单！')
                return
            }
            this.deliver_dialog.selected_count = selected_orders.length
            this.deliver_dialog.visible = true
        },
        confirmSelectedDeliver() {
            var selected_orders = this.selected_orders
            for (var i = 0; i <= selected_orders.length; i++) {
                if (i < selected_orders.length) {
                    var order_id = selected_orders[i].order.id
                    this.deliver(order_id)
                } else {
                    this.getOrders()
                }
            }
            this.deliver_dialog.visible = false
        },
        getSelectedOrders() {
            var selected_orders = []
            var printed_count = 0
            this.orders.forEach(el => {
                if (el.order.selected) {
                    selected_orders.push(el)
                }
                if (el.order.print_at) {
                    printed_count++
                }
            })
            this.print_dialog.printed_count = printed_count
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
                },
                query: {
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
            console.log(order_search);
            this.order_time = order_search.order_time ? order_search.order_time : [null, null]
            this.order_status = order_search.order_status ? order_search.order_status : 1
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
            this.selected_all = false
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
                "start_at": self.order_time ? moment(self.order_time[0], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                "end_at": self.order_time ? moment(self.order_time[1], "YYYY-MM-DD HH:mm:ss").unix() : 0,
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
.print_dialog {
    padding-left: 50px;
    p {
        line-height: 44px;
    }
    .desc {
        color: #888;
    }
    .footer1 {
        line-height: 28px;
        margin-top: 50px;
    }
    .footer2 {
        margin-top: 50px;
        text-align: right;
    }
}
.printing_dialog {
    .printProgress {
        text-align: center;
    }
    .printResult {
        padding: 0 40px;
    }
    .fail {
        color: #FF4949;
    }
    .success {
        color: #13CE66;
    }
    .footer {
        margin-top: 50px;
        text-align: right;
    }
}
.export_dialog {
    padding-left: 50px;
    p {
        line-height: 44px;
    }
    .desc {
        color: #888;
        padding-left: 24px;
    }
    .footer {
        margin-top: 50px;
        text-align: right;
    }
}
.deliver_dialog {
    padding-left: 20px;
    p {
        line-height: 44px;
    }
    .desc {
        color: #888;
    }
    .footer {
        margin-top: 50px;
        text-align: right;
    }
}
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
        // height: 30px;
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
