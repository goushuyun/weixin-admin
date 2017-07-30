<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">订单管理</h2>
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
            <el-input placeholder="搜索值" v-model.trim="search_value" style="width: 290px;" size="small" icon="search" @input="inputSearchValue" :on-icon-click="getOrders">
                <el-select v-model="search_type" style="width: 125px;" clearable slot="prepend" placeholder="筛选条件" size="small" @change="handleSearchValue">
                    <el-option label="订单编号" value="order"></el-option>
                    <el-option label="收货人手机号" value="mobile"></el-option>
                    <el-option label="收货人姓名" value="name"></el-option>
                    <el-option label="ISBN" value="isbn"></el-option>
                    <el-option label="班级购编号" value="class"></el-option>
                </el-select>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-select v-model="seller_remark_type" style="width: 125px;" clearable placeholder="筛选标记" size="small" @change="getOrders">
                <!-- <el-option label="全部订单" :value="0"></el-option> -->
                <el-option label="无标记订单" :value="79"></el-option>
                <el-option label="有标记订单" :value="80"></el-option>
                <el-option label="绿色标记订单" :value="1"></el-option>
                <el-option label="黄色标记订单" :value="2"></el-option>
                <el-option label="红色标记订单" :value="3"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <div class="row">
      <el-radio-group v-model="order_status" size="small" @change="getOrders">
        <el-radio-button :label="1">待发货</el-radio-button>
        <el-radio-button :label="3">已发货</el-radio-button>
        <el-radio-button :label="7">已完成</el-radio-button>
        <el-radio-button :label="77">待处理售后</el-radio-button>
        <el-radio-button :label="78">已处理售后</el-radio-button>
        <el-radio-button :label="0">待支付</el-radio-button>
        <el-radio-button :label="8">已关闭</el-radio-button>
        <el-radio-button :label="80">全部订单</el-radio-button>
      </el-radio-group>
      <el-button style="margin-left: 385px;" @click="resetForm" size="small"><i class="fa fa-refresh" aria-hidden="true"></i> 重置筛选条件</el-button>
    </div>
    <div style="background-color: #FFFFFF; min-height:100px;" v-loading.body="loading" element-loading-text="拼命加载中">
      <div class="row">
        <el-checkbox v-model="selected_all" style="margin:0 12px;" @change="selectedAllChange">全选</el-checkbox>
        <el-button type="primary" @click="preExportOrder" size="small"><i class="fa fa-download" aria-hidden="true"></i> 批量导出</el-button>
        <el-button type="primary" size="small" @click="preSelectedPrint"><i class="fa fa-print" aria-hidden="true"></i> 批量打印</el-button>
        <el-button v-if="order_status == 1" type="primary" @click="preSelectedDeliver" size="small"><i class="fa fa-truck" aria-hidden="true"></i> 批量发货</el-button>
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
            <span v-if="order_status == 0 || order_status == 8" style="margin:0 10px;">下单时间：{{order.order.order_at}}</span>
            <span v-else style="margin:0 10px;">付款时间：{{order.order.pay_at}}</span>
            <span style="margin:0 10px;">学校：{{order.order.school_name}}</span>
            <div class="tag_area">
              <el-tag v-if="order.order.groupon_id" type="groupon">班级购：{{order.order.groupon_id}}</el-tag>
              <el-tag v-if="order.order.print_at" type="warning">已打印</el-tag>

              <el-tag v-if="order.order.after_sale_status == 1" type="danger">待处理售后</el-tag>
              <el-tag v-if="order.order.after_sale_status > 1" type="primary">已处理售后</el-tag>

              <el-tag v-if="order.order.order_status == 1" type="danger">待发货</el-tag>
              <el-tag v-if="order.order.order_status == 3" type="primary">已发货</el-tag>
              <el-tag v-if="order.order.order_status == 7" type="primary">已完成</el-tag>
            </div>
          </div>
          <div class="detail">
            <div style="width:auto;">
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
              <p>订单总额 ￥{{order.order.total_fee}}</p>
              <p style="color:#888; font-size: 12px;">（含快递费 ￥{{order.order.freight}}）</p>
            </div>
            <div class="opt_area" :style="'height:' + 74 * order.items.length + 'px;'">
              <el-button type="primary" size="mini" style="width:80px" @click="goToDetail(index)"><i class="fa fa-search" aria-hidden="true"></i> 查看详情</el-button>
              <!-- <p v-if="order.order.groupon_id">班级购编号：{{order.order.groupon_id}}</p> -->
              <p v-if="order.order.seller_remark_type == 0" style="margin-top: 8px;">
                <el-button size="mini" style="width:80px" @click="preAddRemark(index)"><i class="fa fa-flag" aria-hidden="true"></i> 商家标记</el-button>
              </p>
              <p v-else>
                <el-tooltip class="item" effect="dark" :content="order.order.seller_remark ? order.order.seller_remark : '没有商家标记'" placement="top">
                  <el-button type="text" @click="preAddRemark(index)">
                    <!-- <i v-if="order.order.seller_remark_type == 0" class="fa fa-flag" aria-hidden="true"></i> -->
                    <i v-if="order.order.seller_remark_type == 1" class="fa fa-flag" aria-hidden="true" style="color: #13CE66;"></i>
                    <i v-if="order.order.seller_remark_type == 2" class="fa fa-flag" aria-hidden="true" style="color: #F7BA2A;"></i>
                    <i v-if="order.order.seller_remark_type == 3" class="fa fa-flag" aria-hidden="true" style="color: #FF4949;"></i>
                  </el-button>
                </el-tooltip>
              </p>
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
    </div>

    <!-- 商家备注 -->
    <el-dialog title="商家标记" :visible.sync="remark_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="remark_dialog">
          <el-input id="remark_textarea" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入内容" v-model="remark_dialog.seller_remark">
          </el-input>
          <div class="seller_remark">
            快捷标记：
            <el-tag :key="tag" v-for="(tag,idx) in remark_list" type="primary" :closable="true" :close-transition="false" @close.stop="handleClose(idx)" @click.native="setRemark(idx)">{{tag}}</el-tag>
            <el-input class="input-new-tag" v-if="inputVisible && remark_list.length < 5" v-model="inputValue" ref="saveTagInput" size="mini"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
            <el-button v-if="!inputVisible && remark_list.length < 5" class="button-new-tag" size="small" @click="showInput">新增 +</el-button>
          </div>
          <div class="seller_remark_type">
            标记类型：
            <el-radio-group v-model="remark_dialog.seller_remark_type">
              <el-radio :label="1"><i class="fa fa-flag" aria-hidden="true" style="color: #13CE66; font-size: 16px; margin-right: 10px;"></i></el-radio>
              <el-radio :label="2"><i class="fa fa-flag" aria-hidden="true" style="color: #F7BA2A; font-size: 16px; margin-right: 10px;"></i></el-radio>
              <el-radio :label="3"><i class="fa fa-flag" aria-hidden="true" style="color: #FF4949; font-size: 16px; margin-right: 10px;"></i></el-radio>
            </el-radio-group>
          </div>
          <div class="footer">
            <el-button type="primary" size="small" @click="orderRemark">确定</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 批量打印 -->
    <el-dialog title="批量打印" :visible.sync="print_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" @close="unSelectedAllChange">
      <div class="print_dialog">
          <p class="desc">已选中 {{print_dialog.selected_count}} 条订单，有 {{print_dialog.printed_count}} 条已经打印过了</p>
          <p><el-radio class="radio" v-model="print_dialog.radio" label="0">打印发货详情（需热敏纸打印机）</el-radio></p>
          <p><el-radio class="radio" disabled v-model="print_dialog.radio" label="1">打印快递单（此功能暂未开放）</el-radio></p>
          <p>默认打印机：<span style="color:#FF4949">{{print_dialog.printer}}</span></p>
          <div class="desc" style="line-height:24px;">1.请务必确保打印机正确，否则会造成错误。</div>
          <div class="desc" style="line-height:24px;">2.您可以在“控制面板-设备和打印机”中修改默认打印机。</div>
          <div class="desc" style="line-height:24px;">3.修改完默认打印机，请务必刷新当前页面。</div>
          <div class="footer1" v-if="order_status == 1">
            <el-checkbox v-model="print_dialog.checked">打印后直接发货（不建议勾选）</el-checkbox>
            <el-button style="float:right" type="primary" size="small" @click="confirmSelectedPrint">打印</el-button>
          </div>
          <div class="footer2" v-else>
            <el-button type="primary" size="small" @click="confirmSelectedPrint">打印</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 打印过程 -->
    <el-dialog class="printing_dialog" :title="(printing_dialog.percentage == 100) ? '打印结束' : ('正在批量打印' + (print_dialog.checked ? '并发货' : '') + '，请耐心等待......')" :visible.sync="printing_dialog.visible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
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
    <el-dialog title="批量导出" :visible.sync="export_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" @close="unSelectedAllChange">
      <div class="export_dialog">
          <p class="desc">已选中 {{export_dialog.selected_count}} 条订单</p>
          <p><el-radio class="radio" v-model="export_dialog.radio" label="0">导出配货单</el-radio></p>
          <p class="desc">配货单将选中的待发货订单中所需要配送的书籍统一整理出来，方便在高峰期配书</p>
          <p><el-radio class="radio" v-model="export_dialog.radio" label="1">导出发货单</el-radio></p>
          <p class="desc">发货单会将待发货订单整理出来，你可以配合<el-button type="text" @click="goToKDZS">“快递助手”</el-button> 使用，直接打印快递单</p>
          <div class="footer">
            <el-button type="primary" size="small" @click="confirmExportOrder">导出</el-button>
          </div>
      </div>
    </el-dialog>

    <!-- 批量发货 -->
    <el-dialog title="批量发货" :visible.sync="deliver_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" @close="unSelectedAllChange">
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
import conf from '../../config/conf.js'
export default {
    data() {
        return {
            remark_dialog: {
                visible: false,
                seller_remark: '',
                seller_remark_type: 0,
                index: 0
            },
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
                temp_percentage: 0,
                percentage: 0,
                success_orders: [],
                fail_orders: [],
                disabled_btn: true
            },
            export_dialog: {
                visible: false,
                selected_count: 0,
                ids: '',
                radio: '0'
            },
            deliver_dialog: {
                selected_count: 0,
                visible: false
            },
            order_time: [], //时间选择器[最早时间,最晚时间]
            order_status: 1, //订单状态
            school_id: '',
            seller_remark_type: '',

            search_type: '',
            search_value: '',
            order_id: '',
            mobile: '',
            name: '',
            isbn: '',
            groupon_id: '',

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

            selected_all: false,
            orders: [],
            selected_orders: [],
            schools: [],

            page: 1,
            size: 10,
            total_count: 0,

            refresh_flag: false,

            remark_list: [],
            inputVisible: false,
            inputValue: '',

            loading: false
        }
    },
    mounted() {
        this.getStoreData()
        this.getSchools()
        this.getRemarkList()
    },
    watch: {
        refresh_flag(flag) {
            if (flag) {
                this.getOrders()
                this.refresh_flag = false
            }
        }
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
        preAddRemark(index) {
          var order = this.orders[index].order
          this.remark_dialog = {
              visible: true,
              seller_remark: order.seller_remark,
              seller_remark_type: order.seller_remark_type ? order.seller_remark_type : 1,
              index: index
          }
          this.$nextTick(_ => {
            $('#remark_textarea textarea').focus()
          });
        },
        goToKDZS() {
            window.open('http://zz.kuaidizs.com')
        },
        getRemarkList() {
            axios.post('/v1/store/get_shortcut_remark_list',{}).then(resp => {
                if (resp.data.message == 'ok') {
                    var remark_list = []
                    if (resp.data.data.length > 0) {
                        resp.data.data.forEach(el => {
                            remark_list.push(el.content)
                        })
                        this.remark_list = remark_list
                    }
                }
            })
        },
        setRemark(index) {
          console.log(index);
            var remark = this.remark_list[index]
            var seller_remark = this.remark_dialog.seller_remark
            if (seller_remark) {
                seller_remark += '，'
            }
            seller_remark += remark
            this.remark_dialog.seller_remark = seller_remark
        },
        handleClose(index) {
            this.remark_list.splice(index, 1);
            this.saveRemarkList()
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.remark_list.push(inputValue);
            }
            this.saveRemarkList()
            this.inputVisible = false;
            this.inputValue = '';
        },
        saveRemarkList() {
            var order_shortcut_remarks = []
            this.remark_list.forEach(el => {
                var remark = {
                    type: 1,
                    content: el
                }
                order_shortcut_remarks.push(remark)
            })
            axios.post('/v1/store/save_or_update_shortcut_remark',{order_shortcut_remarks}).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('success');
                } else {
                    console.log('fail');
                }
            })
        },
        orderRemark() {
            if (this.remark_dialog.seller_remark == '') {
                this.$message.warning('您还没有输入备注信息！')
                return
            }
            var index = this.remark_dialog.index
            var id = this.orders[index].order.id
            var seller_remark = this.remark_dialog.seller_remark
            var seller_remark_type = this.remark_dialog.seller_remark_type
            axios.post('/v1/order/order_remark',{
                id,
                seller_remark,
                seller_remark_type
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('success');
                    this.$message.success('已添加备注！')
                    this.orders[index].order.seller_remark = seller_remark
                    this.orders[index].order.seller_remark_type = seller_remark_type
                    this.remark_dialog = {
                        visible: false,
                        seller_remark: '',
                        seller_remark_type: 0,
                        index: 0
                    }
                } else {
                    console.log('fail');
                    this.$message.error('备注添加失败！')
                }
            })
        },
        preSelectedPrint() {
            var self = this
            if (!checkLodopIsInstall()) {
                self.$confirm('您尚未安装打印插件，请先安装！', '提示', {
                    confirmButtonText: '确认安装',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    window.location.assign('http://okxy9gsls.bkt.clouddn.com/CLodop_Setup_for_Win32NT_https_2.130.exe')
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
            this.print_dialog = {
                visible: false,
                selected_count: 0,
                printed_count: 0,
                radio: '0',
                printer: '',
                checked: false
            }
            this.printing_dialog = {
                visible: false,
                active_names: ['fail'],
                temp_percentage: 0,
                percentage: 0,
                success_orders: [],
                fail_orders: [],
                disabled_btn: true
            },
            this.getOrders()
        },
        realityPrint(i){
          var self = this
          var selected_orders = self.selected_orders
          if (i == undefined) {
              i = 0
          }
          if (i >= selected_orders.length) {
              return
          }
          var printPromise = new Promise(function(resolve, reject) {
              var baseOrder = selected_orders[i];
              var order = {
                  "order": baseOrder
              }
              var unit = 100 / selected_orders.length
              console.log(order);
              //工具方法，传一个order进去 order格式具体格式查看上步骤打印出来的order
              orderPromiseFunc(order);
              //接下来是一个轮询任务，用于检测是否打印完成,是否打印成功,以及打印失败 打印机任务是否清理完成
              var count = 0
              var checkPrintOver = setInterval(function() {
                  //首先要检测打印是否完成
                  console.log("打印是否完成："+localStorage.printOver);
                  if (localStorage.printOver=='true') {
                      //接下来检测打印成功还是失败
                      console.log("打印是否成功："+localStorage.printSuccess);
                      self.printing_dialog.temp_percentage += unit
                      if (self.printing_dialog.temp_percentage < 100) {
                          self.printing_dialog.percentage = parseInt(self.printing_dialog.temp_percentage)
                      } else {
                          self.printing_dialog.percentage = 100
                          self.printing_dialog.disabled_btn = false
                      }
                      if(localStorage.printSuccess=='true'){
                          //如果打印成功，执行打印成功的方法
                          //eg：告知服务器打印成功 ，打印下一个 func()
                          self.servicePrint(baseOrder.order.id)
                          resolve()
                      }else{
                          //如果打印失败，首先检测打印任务是否清理
                          self.printing_dialog.fail_orders.push(baseOrder.order.id)
                          if (localStorage.clearPrinterOk=='true') {
                              //如果打印清理成功，执行清理成功的方法 func()
                              //eg 执行之后的任务
                              reject(1)
                          } else{
                              //跳出打印任务，提示连接打印机失败
                              //func()
                              reject(2)

                          }
                      }
                      console.log("清理任务是否完成："+localStorage.clearPrinterOk);
                      clearTimeout(checkPrintOver)
                    } else if (count > 30) {
                        //打印出现问题，跳出打印任务，提示连接打印机失败
                        clearTimeout(checkPrintOver)
                    }
                    count ++
                    console.log("打印是否完成："+localStorage.printOver);
                    console.log(localStorage.printOver=='true');
              }, 500)
          })

          printPromise.then(function(value) {
              //SUCCESS
              i++
              self.realityPrint(i)
              console.log('打印成功！');
          }, function(value) {
              //FIELD
              i++
              if (value==1) {
                  self.realityPrint(i)
              }else {
                self.$message.error('打印异常，请手动清理打印任务后继续！')
              }
              console.log('打印失败！');
          })
        },
        servicePrint(order_id) {
            axios.post('/v1/order/print', {
                id: order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('服务器已记录订单：' + order_id + ' 的此次打印！');
                    this.printing_dialog.success_orders.push(order_id)
                    if (this.print_dialog.checked) {
                        self.deliver(order_id)
                    }
                }
            })
        },
        deliver(order_id, refresh_flag) {
            axios.post('/v1/order/deliver', {
                id: order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log('订单：' + order_id + ' 已发货！');
                    console.log('refresh_flag:' + typeof(refresh_flag) + ',' + refresh_flag);
                    if (refresh_flag) {
                        this.refresh_flag = refresh_flag
                    }
                }
            })
        },
        preExportOrder() {
            var selected_orders = this.getSelectedOrders()
            if (selected_orders.length <= 0) {
                this.$message.warning('您尚未勾选任何订单！')
                return
            }
            var ids = []
            selected_orders.forEach(el => {
                ids.push(el.order.id)
            })
            this.export_dialog.selected_count = selected_orders.length
            this.export_dialog.ids = "'" +ids.join("','") + "'"
            this.export_dialog.visible = true
        },
        confirmExportOrder() {
            var params = {
                ids: this.export_dialog.ids
            }
            if (this.export_dialog.radio == '0') {
                var store_id = JSON.parse(localStorage.getItem('store')).id
                params.store_id = store_id
                window.location.assign(conf.base_url + 'v1/order/export_distribute_order?params=' + JSON.stringify(params))
            } else {
                window.location.assign(conf.base_url + 'v1/order/export_delivery_order?params=' + JSON.stringify(params))
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
            for (var i = 0; i < selected_orders.length; i++) {
                var order_id = selected_orders[i].order.id
                if (i < selected_orders.length - 1) {
                    this.deliver(order_id,false)
                } else {
                    this.deliver(order_id,true)
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
            })
            this.selected_orders = selected_orders
            this.selected_orders.forEach(el => {
                if (el.order.print_at) {
                    printed_count++
                }
            })
            this.print_dialog.printed_count = printed_count
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
        unSelectedAllChange() {
            this.selected_all = false
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
            this.groupon_id = ''
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
                case 'class':
                    this.groupon_id = this.search_value
                    break;
            }
        },
        resetForm() {
            this.order_time = [null, null] //时间选择器[最早时间,最晚时间]
            this.order_status = 80 //订单状态
            this.school_id = ''
            this.seller_remark_type = ''

            this.search_type = ''
            this.search_value = ''
            this.order_id = ''
            this.mobile = ''
            this.name = ''
            this.isbn = ''
            this.groupon_id = ''
            this.getOrders()
        },
        getStoreData() {
            var order_search = this.$store.state.order_search
            console.log(order_search);
            this.order_time = order_search.order_time ? order_search.order_time : [null, null]
            this.order_status = order_search.order_status != undefined ? order_search.order_status : 1
            this.school_id = order_search.school_id ? order_search.school_id : ''
            this.search_type = order_search.search_type ? order_search.search_type : ''
            this.search_value = order_search.search_value ? order_search.search_value : ''
            this.order_id = order_search.order_id ? order_search.order_id : ''
            this.mobile = order_search.mobile ? order_search.mobile : ''
            this.name = order_search.name ? order_search.name : ''
            this.isbn = order_search.isbn ? order_search.isbn : ''
            this.groupon_id = order_search.groupon_id ? order_search.groupon_id : ''
            this.page = order_search.page ? order_search.page : 1
            this.size = order_search.size ? order_search.size : 10
        },
        getOrders() {
            this.selected_all = false
            if (this.search_value && !this.search_type) {
                this.$message.warning('请选择检索类型！')
                return
            }
            this.loading = true
            var self = this
            var data = {
                "id": self.order_id,
                "mobile": self.mobile,
                "name": self.name,
                "isbn": self.isbn,
                "groupon_id": self.groupon_id,
                "order_status": self.order_status,
                "school_id": self.school_id.trim(),
                "seller_remark_type": self.seller_remark_type ? self.seller_remark_type : 0,
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
                        if (self.order_status == 0 || self.order_status == 8) {
                            el.order.order_at = moment.unix(el.order.order_at).format('YYYY-MM-DD HH:mm:ss')
                        }
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
.remark_dialog {
    .el-tag {
        margin: 10px 5px 0 0;
        &:hover {
            cursor: pointer;
        }
    }
    .button-new-tag,.input-new-tag {
        // height: 24px;
        line-height: 22px;
        width: 80px;
        padding: 0;
        margin: 10px 5px 0 0;
        font-size: 12px;
        box-sizing: border-box;
    }
    .seller_remark {
        margin-top: 10px;
    }
    .seller_remark_type {
        margin-top: 20px;
    }
    .footer {
        margin-top: 20px;
        text-align: right;
    }
}
.print_dialog {
    padding-left: 12px;
    p {
        line-height: 34px;
    }
    .desc {
        color: #888;
    }
    .footer1 {
        line-height: 28px;
        margin-top: 20px;
    }
    .footer2 {
        margin-top: 20px;
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
        margin-top: 20px;
        text-align: right;
    }
}
.export_dialog {
    padding-left: 12px;
    p {
        line-height: 34px;
    }
    .desc {
        color: #888;
        padding-left: 24px;
    }
    .footer {
        margin-top: 20px;
        text-align: right;
    }
}
.deliver_dialog {
    padding-left: 12px;
    p {
        line-height: 34px;
    }
    .desc {
        color: #888;
    }
    .footer {
        // margin-top: 50px;
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
.el-tag--groupon {
    background-color: rgba(158,128,91,.1);
    border-color: rgba(158,128,91,.2);
    color: #9e805b;
}
</style>
