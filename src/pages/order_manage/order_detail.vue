<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title"><span class="pre_page"  @click="goToList">订单管理</span> / 订单详情</h2>
  </div>
  <div class="content_inner">
    <div id="order_status">
        <el-button style="float:left" icon="arrow-left" type="text" size="samll" @click="goToList">返回上一页</el-button>
        <el-row type="flex" align="middle" justify="center">
          <div v-if="order_detail.after_sale_status != 0">
            <el-steps :space="200" :active="order_detail.after_sale_status" align-center>
              <el-step title="售后申请" :description="order_detail.after_sale_apply_at?order_detail.after_sale_apply_at:''"></el-step>
              <el-step title="售后结束" :description="order_detail.after_sale_end_at?order_detail.after_sale_end_at:''"></el-step>
            </el-steps>
          </div>
          <div v-else-if="order_detail.order_status <= 8">
            <el-steps :space="200" :active="order_detail.order_step" finish-status="success" align-center>
              <el-step title="买家下单" :description="order_detail.order_at?order_detail.order_at:''"></el-step>
              <el-step title="买家付款" :description="order_detail.pay_at?order_detail.pay_at:''"></el-step>
              <el-step title="卖家发货" :description="order_detail.deliver_at?order_detail.deliver_at:''"></el-step>
              <el-step title="交易成功" :description="order_detail.complete_at?order_detail.complete_at:''"></el-step>
            </el-steps>
          </div>
        </el-row>
    </div>
    <div class="order_item">
      <div class="title">
           <span style="margin:0 10px;">订单编号：{{order_detail.id}}</span>
           <span v-if="order_detail.order_status == 0 || order_detail.order_status == 8" style="margin:0 10px;">下单时间：{{order_detail.order_at}}</span>
           <span v-else style="margin:0 10px;">付款时间：{{order_detail.pay_at}}</span>
           <span style="margin:0 10px;">学校：{{school_name}}</span>
           <div class="tag_area">
              <el-tag v-if="order_detail.groupon_id" type="success">班级购</el-tag>
              <el-tag v-if="order_detail.print_at" type="warning">已打印</el-tag>
              <el-tag v-if="order_detail.after_sale_status == 1" type="danger">待处理售后</el-tag>
              <el-tag v-if="order_detail.after_sale_status > 1" type="primary">已处理售后</el-tag>
              <el-tag v-if="order_detail.order_status == 1" type="danger">待发货</el-tag>
              <el-tag v-if="order_detail.order_status == 3" type="primary">已发货</el-tag>
              <el-tag v-if="order_detail.order_status == 7" type="primary">已完成</el-tag>
           </div>
      </div>
      <div class="detail">
        <div style="width:640px">
          <el-row type="flex" align="middle" v-for="(item,index) in order_items" :style="index + 1 == order_items.length ? '' : 'border-bottom: 1px solid #EEF1F6;'">
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
        <div class="opt_area" :style="'height:' + 74 * order_items.length + 'px;'">
          <p>订单总额 ￥{{order_detail.total_fee}}</p>
          <p style="color:#888">（含快递费 ￥{{order_detail.freight}}）</p>
        </div>
        <div class="opt_area" :style="'height:' + 74 * order_items.length + 'px;'">
          <p>
            <el-button v-if="order_detail.order_status < 3 && order_detail.after_sale_status == 0" type="primary" style="width:60px" size="mini" @click="deliver"><i class="fa fa-truck" aria-hidden="true"></i> 发货</el-button>
            <el-button v-if="order_detail.order_status != 0 && order_detail.order_status != 8" type="primary" style="width:60px" size="mini" @click="preSelectedPrint"><i class="fa fa-print" aria-hidden="true"></i> 打印</el-button>
          </p>
          <p v-if="order_detail.groupon_id">班级购编号：{{order_detail.groupon_id}}</p>
        </div>
      </div>
      <div class="address_area">
        <span style="margin-right:20px">收货人信息：{{order_detail.name}}，{{order_detail.mobile}}，{{order_detail.address}}</span>
        <span v-if="order_detail.remark" style="color:#FF4949">订单备注：{{order_detail.remark}}</span>
      </div>
    </div>

    <div id="refund_info" v-if="order_detail.after_sale_status != 0" v-loading="refund_loading">
        <div class="info_title">售后详情</div>
        <el-row :span="24">
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">售后单号：</label><label>{{after_sale_detail.trad_no}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请时间：</label><label>{{order_detail.after_sale_apply_at}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">订单总额：</label><label>￥{{order_detail.total_fee}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请金额：</label><label>￥{{after_sale_detail.apply_refund_fee}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请理由：</label><label>{{after_sale_detail.reason}}</label>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">查看图片：</label>
                    <el-card :body-style="{ padding: '0px' }" class="refund_img" v-for="img in after_sale_detail.images">
                      <img :src="'http://onv8eua8j.bkt.clouddn.com/' + img.url" @click="picturePreview(img.url)" style="cursor:pointer;">
                    </el-card>
                    <el-dialog v-model="dialog.visible" size="tiny">
                      <img width="100%" :src="dialog.url">
                    </el-dialog>
                </div>
                <div class="info_info">
                  <label class="first-lable">退款金额：</label>
                  <label v-if="order_detail.after_sale_status == 1">￥
                    <el-input placeholder="请输入退款金额" style="width:110px" size="mini" v-model="actual_refund_fee" :maxlength="8"></el-input>
                  </label>
                  <label v-else>￥{{after_sale_detail.refund_fee}}</label>
                </div>
                <div class="info_info" v-if="order_detail.after_sale_status == 1">
                    <label class="first-lable">操作：</label>
                    <label><el-button type="danger" style="width:60px" size="mini" @click="refund">退款</el-button><el-button style="width:60px;background-color:#8492A6;color:#FFFFFF" size="mini" @click="reject">拒绝退款</el-button></label>
                </div>
                <div class="info_info" v-if="order_detail.after_sale_status != 1">
                    <label class="first-lable">操作人员：</label>
                    <label>{{order_detail.after_sale_staff_name}}</label>
                </div>
                <div class="info_info" v-if="order_detail.after_sale_status != 1">
                    <label class="first-lable">处理时间：</label>
                    <label>{{order_detail.after_sale_end_at}}</label>
                </div>
            </el-col>
        </el-row>
    </div>

    <div class="">
      <el-table :data="operateTable" stripe style="width: 100%">
        <el-table-column prop="time" label="操作时间" width="260"></el-table-column>
        <el-table-column prop="name" label="操作人" width="200"></el-table-column>
        <el-table-column prop="info" label="操作信息"></el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog title="订单打印" :visible.sync="print_dialog.visible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="print_dialog">
        <p class="desc">{{print_dialog.is_printed ? '该订单已经打印过了，可以再次打印' : '该订单从未打印过'}}</p>
        <p><el-radio class="radio" v-model="print_dialog.radio" label="0">打印发货详情（需热敏纸打印机）</el-radio></p>
        <p><el-radio class="radio" disabled v-model="print_dialog.radio" label="1">打印快递单（此功能暂未开放）</el-radio></p>
        <p>默认打印机：<span style="color:#FF4949">{{print_dialog.printer}}</span></p>
        <div class="desc" style="line-height:24px;">1.请务必确保打印机正确，否则会造成错误。</div>
        <div class="desc" style="line-height:24px;">2.您可以在“控制面板-设备和打印机”中修改默认打印机。</div>
        <div class="desc" style="line-height:24px;">3.修改完默认打印机，请务必刷新当前页面。</div>
        <div class="footer1" v-if="order_detail.order_status == 1">
          <el-checkbox v-model="print_dialog.checked">打印后直接发货（不建议勾选）</el-checkbox>
          <el-button style="float:right" type="primary" size="small" @click="confirmPrint">打印</el-button>
        </div>
        <div class="footer2" v-else>
          <el-button type="primary" size="small" @click="confirmPrint">打印</el-button>
        </div>
    </div>
  </el-dialog>
  <!-- 打印过程 -->
  <el-dialog class="printing_dialog" size="tiny" :title="(printing_dialog.percentage == 100) ? '打印结束' : ('正在打印' + (print_dialog.checked ? '并发货' : '') + '，请耐心等待......')" :visible.sync="printing_dialog.visible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <div class="printProgress">
      <el-progress v-if="printing_dialog.percentage != 100" type="circle" :percentage="0"></el-progress>
      <el-progress v-else-if="printing_dialog.is_print_succese" type="circle" :percentage="100" status="success"></el-progress>
      <el-progress v-else-if="!printing_dialog.is_print_succese" type="circle" :percentage="100" status="exception"></el-progress>
    </div>
    <p v-if="printing_dialog.percentage == 100 && printing_dialog.is_print_succese" class="printResult success">订单“{{order_id}}”打印成功！</p>
    <p v-if="printing_dialog.percentage == 100 && !printing_dialog.is_print_succese" class="printResult fail">订单“{{order_id}}”打印失败！</p>
    <div class="footer">
      <el-button type="primary" size="small" :disabled="printing_dialog.percentage != 100" @click="completePrint">完成</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
    priceFloat,
    priceInt,
    checkPayChannel
} from '../../scripts/utils'
import axios from "../../scripts/http"
export default {
    data() {
        return {
            print_dialog: {
                visible: false,
                is_printed: false,
                radio: '0',
                printer: '',
                checked: false
            },
            printing_dialog: {
                visible: false,
                percentage: 0,
                is_print_succese: false
            },
            order_id: '',
            school_name: '',
            order_detail: {},
            order_items: [],
            after_sale_detail: {},
            order_staffs: [],
            actual_refund_fee: '',
            refund_loading: false,
            dialog: {
                visible: false,
                url: ''
            },
            operateTable: [],

            baseJson: {} // 用于打印
        }
    },
    mounted() {
        if (this.$route.query.order_id) {
            this.order_id = this.$route.query.order_id
        }
        if (this.$route.params.school_name) {
            this.school_name = this.$route.params.school_name
        }
        this.getOrder()
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
                    window.location.assign('http://okxy9gsls.bkt.clouddn.com/CLodop_Setup_for_Win32NT_https_2.130.exe')
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消操作!'
                    });
                });
                return
            }
            this.print_dialog.is_printed = this.order_detail.print_at != 0
            this.print_dialog.printer = getPrinterName()
            this.print_dialog.visible = true
        },
        confirmPrint() {
            this.print_dialog.visible = false
            this.printing_dialog.visible = true
            if (this.print_dialog.radio == '0') {
                this.realityPrint()
            } else {
                // 打印快递单（此功能暂未开放）
            }
        },
        realityPrint() {
            var self = this

            //下面一句话测试专用
            var order = self.baseJson;
            console.log(order);
            //工具方法，传一个order进去 order格式具体格式查看上步骤打印出来的order
            orderPromiseFunc(order);
            //接下来是一个轮询任务，用于检测是否打印完成,是否打印成功,以及打印失败 打印机任务是否清理完成
            var count = 0
            var checkPrintOver = setInterval(function() {
                //首先要检测打印是否完成
                console.log("打印是否完成：" + localStorage.printOver);
                if (localStorage.printOver == 'true') {
                    //接下来检测打印成功还是失败
                    console.log("打印是否成功：" + localStorage.printSuccess);
                    if (localStorage.printSuccess == 'true') {
                        //如果打印成功，执行打印成功的方法
                        //eg：告知服务器打印成功 ，打印下一个 func()
                        self.servicePrint()
                    } else {
                        self.printing_dialog.percentage = 100
                        //如果打印失败，首先检测打印任务是否清理
                        if (localStorage.clearPrinterOk == 'true') {
                            //如果打印清理成功，执行清理成功的方法 func()
                            //eg 执行之后的任务
                            console.log('打印失败，已清除该打印任务！');
                        } else {
                            //跳出打印任务，提示连接打印机失败
                            //func()
                            console.log('连接打印机失败！');
                        }
                    }
                    clearTimeout(checkPrintOver)
                } else if (count > 30) {
                    //打印出现问题，跳出打印任务，提示连接打印机失败
                    clearTimeout(checkPrintOver)
                }
                count++
                console.log("打印是否完成：" + localStorage.printOver);
                console.log(localStorage.printOver == 'true');
            }, 500)
        },
        servicePrint() {
            axios.post('/v1/order/print', {
                id: this.order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.printing_dialog.percentage = 100
                    this.printing_dialog.is_print_succese = true
                    if (this.print_dialog.checked) {
                        this.deliver()
                    } else {
                        this.getOrder()
                    }
                    console.log('服务器已记录此次打印，订单ID：' + this.order_id);
                }
            })
        },
        completePrint() {
            this.print_dialog = {
                visible: false,
                is_printed: false,
                radio: '0',
                printer: '',
                checked: false
            }
            this.printing_dialog = {
                visible: false,
                percentage: 0,
                is_print_succese: false
            }
        },
        getSchoolName(id) {
            var self = this
            axios.post('/v1/school/store_schools', {
                status: 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    resp.data.data.forEach(school => {
                        if (school.id == id) {
                            self.school_name = school.name
                            return
                        }
                    })
                }
            })
        },
        refund() {
            var self = this
            if (!self.checkActualRefundFee()) {
                return
            }
            self.refund_loading = true
            axios.post('/v1/order/handle_after_sale', {
                "order_id": self.order_id,
                "refund_fee": priceInt(self.actual_refund_fee)
            }).then(resp => {
                self.refund_loading = false
                if (resp.data.message == 'ok') {
                    self.$message.success('退款成功！');
                    // self.getOrder()
                    // 由于后台事物原因，故在前段加入本地时间，再次刷新页面即为真实信息
                    var after_sale_staff_name = JSON.parse(localStorage.getItem('adminInfo')).username
                    var after_sale_end_at = moment().format('YYYY-MM-DD HH:mm:ss')
                    self.order_detail.after_sale_status = 19
                    self.order_detail.after_sale_staff_name = after_sale_staff_name
                    self.order_detail.after_sale_end_at = after_sale_end_at
                    self.operateTable.push({
                        time: after_sale_end_at,
                        name: after_sale_staff_name,
                        info: '卖家处理了售后申请，退款 ' + self.actual_refund_fee + ' 元。'
                    })
                } else {
                    self.$message.error(resp.data.message);
                }
            })
        },
        reject() {
            var self = this
            self.refund_loading = true
            axios.post('/v1/order/handle_after_sale', {
                "order_id": self.order_id,
                "refund_fee": 0
            }).then(resp => {
                self.refund_loading = false
                if (resp.data.message == 'ok') {
                    self.$message.success('已拒绝退款！');
                    self.getOrder()
                } else {
                    self.$message.error(resp.data.message);
                }
            })
        },
        checkActualRefundFee() {
            var input = this.actual_refund_fee
            var input_num = priceInt(input)
            var max_value = priceInt(this.after_sale_detail.total_fee)
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            if (!reg.test(input.toString()) || input == 0) {
                this.actual_refund_fee = ''
                this.$message({
                    message: '请输入正确的退款金额',
                    type: 'warning'
                });
                return false
            }
            if (input_num > max_value) {
                this.$message({
                    message: '退款金额超过了订单总额，已重置为订单总额',
                    type: 'warning'
                });
                this.actual_refund_fee = priceFloat(max_value)
                return false
            }
            return true
        },
        deliver() {
            axios.post('/v1/order/deliver', {
                id: this.order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('发货成功！')
                    this.getOrder()
                }
            })
        },
        goToList() {
            this.$router.go(-1)
        },
        picturePreview(img) {
            this.dialog.url = 'http://onv8eua8j.bkt.clouddn.com/' + img;
            this.dialog.visible = true;
        },
        getOrder() {
            axios.post('/v1/order/detail', {
                id: this.order_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data

                    // 用于打印
                    this.baseJson.order = data

                    // 订单操作人列表
                    this.order_staffs = data.staffs

                    // 订单详情
                    var order = data.order
                    if (order.order_status >= 17 && order.order_status <= 23) {
                        order.order_status = order.order_status - 16
                    }
                    order.order_at = order.order_at ? moment.unix(order.order_at).format('YYYY-MM-DD HH:mm:ss') : 0 //下单时间
                    order.pay_at = order.pay_at ? moment.unix(order.pay_at).format('YYYY-MM-DD HH:mm:ss') : 0 //支付时间
                    order.confirm_at = order.confirm_at ? moment.unix(order.confirm_at).format('YYYY-MM-DD HH:mm:ss') : 0 //确认收货时间
                    order.complete_at = order.complete_at ? moment.unix(order.complete_at).format('YYYY-MM-DD HH:mm:ss') : 0 //订单完成时间
                    order.after_sale_apply_at = order.after_sale_apply_at ? moment.unix(order.after_sale_apply_at).format('YYYY-MM-DD HH:mm:ss') : 0 //申请售后时间
                    order.after_sale_end_at = order.after_sale_end_at ? moment.unix(order.after_sale_end_at).format('YYYY-MM-DD HH:mm:ss') : 0 //售后完成时间
                    order.deliver_at = order.deliver_at ? moment.unix(order.deliver_at).format('YYYY-MM-DD HH:mm:ss') : 0 //发货时间
                    order.distribute_at = order.distribute_at ? moment.unix(order.distribute_at).format('YYYY-MM-DD HH:mm:ss') : 0 //配送时间
                    order.print_at = order.print_at ? moment.unix(order.print_at).format('YYYY-MM-DD HH:mm:ss') : 0 //打印时间

                    order.order_step = this.log2N(order.order_status) //非返回数据，步骤条使用

                    order.service_fee = priceFloat(order.total_fee - order.withdrawal_fee)
                    order.goods_fee = priceFloat(order.goods_fee) //商品总价
                    order.freight = priceFloat(order.freight) //配送费
                    order.total_fee = priceFloat(order.total_fee) //订单总价

                    order.after_sale_staff_name = order.after_sale_staff_id ? this.getStaffName(order.after_sale_staff_id) : ''
                    order.print_staff_name = order.print_staff_id ? this.getStaffName(order.print_staff_id) : ''
                    order.deliver_staff_name = order.deliver_staff_id ? this.getStaffName(order.deliver_staff_id) : ''
                    order.distribute_staff_name = order.distribute_staff_id ? this.getStaffName(order.distribute_staff_id) : ''

                    order.pay_channel = checkPayChannel(order.pay_channel) //支付渠道

                    this.order_detail = order

                    // 商品列表
                    var items = data.items.map(it => {
                        it.price = priceFloat(it.price)
                        return it
                    })
                    this.order_items = items

                    // 售后详情
                    if (JSON.stringify(data.after_sale_detail)) {
                        data.after_sale_detail.refund_fee = priceFloat(data.after_sale_detail.refund_fee)
                        data.after_sale_detail.apply_refund_fee = priceFloat(data.after_sale_detail.apply_refund_fee)
                        this.after_sale_detail = data.after_sale_detail
                        // 默认实际退款金额为申请金额
                        this.actual_refund_fee = data.after_sale_detail.apply_refund_fee
                    }

                    //主要针对由“资产管理进入该页面时获取学校名称”
                    if (!this.school_name) {
                        this.getSchoolName(order.school_id)
                    }
                    this.operateInfo()
                }
            })
        },
        operateInfo() {
            var operateTable = []
            // 下单
            operateTable.unshift({
                time: this.order_detail.order_at,
                name: '买家',
                info: '买家创建订单。'
            })
            // 付款
            if (this.order_detail.pay_at) {
                operateTable.unshift({
                    time: this.order_detail.pay_at,
                    name: '买家',
                    info: '买家付款，支付方式：' + this.order_detail.pay_channel + '。钱款已进入待结算金额。'
                })
            }
            // 发货
            if (this.order_detail.deliver_at) {
                operateTable.unshift({
                    time: this.order_detail.deliver_at,
                    name: this.order_detail.deliver_staff_name,
                    info: '卖家发货。'
                })
            }
            // 打印
            if (this.order_detail.print_at) {
                operateTable.unshift({
                    time: this.order_detail.print_at,
                    name: this.order_detail.print_staff_name,
                    info: '卖家打印了订单。'
                })
            }
            // 买家确认收货
            if (this.order_detail.confirm_at) {
                operateTable.unshift({
                    time: this.order_detail.confirm_at,
                    name: '买家',
                    info: '买家确认收货，钱款由待结算金额转换为可提现金额。'
                })
            }
            // 系统确认收货
            if (this.order_detail.complete_at && this.order_detail.confirm_at != 0) {
                operateTable.unshift({
                    time: this.order_detail.complete_at,
                    name: '系统',
                    info: '系统自动确认收货，钱款由待结算金额转换为可提现金额。'
                })
            }
            // 申请售后
            if (this.order_detail.after_sale_apply_at) {
                operateTable.unshift({
                    time: this.order_detail.after_sale_apply_at,
                    name: '买家',
                    info: '买家提交了售后申请。'
                })
            }
            // 处理售后
            if (this.order_detail.after_sale_end_at) {
                operateTable.unshift({
                    time: this.order_detail.after_sale_end_at,
                    name: this.order_detail.after_sale_staff_name,
                    info: '卖家处理了售后申请，退款 ' + this.after_sale_detail.refund_fee + ' 元。'
                })
            }
            // 按时间排序
            operateTable.sort((a, b) => {
                return moment(a.time).format('X') - moment(b.time).format('X')
            })

            this.operateTable = operateTable
        },
        getStaffName(staff_id) {
            var staffs = this.order_staffs
            for (var i = 0; i < staffs.length; i++) {
                if (staffs[i].staff_id == staff_id) {
                    return staffs[i].staff_name
                }
            }
        },
        log2N(n) {
            switch (n) {
                case 0:
                    return 1
                case 1:
                    return 2
                case 3:
                    return 3
                case 7:
                    return 4
                default:
                    return 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
        text-align: center;
        margin-top: 30px;
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
.pre_page {
    &:hover {
        color: #20A0FF;
        cursor: pointer;
    }
}
#order_status {
    height: 100px;
    // text-align: center;
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
#order_info,
#refund_info {
    font-size: 14px;
    line-height: 40px;
    border: 1px solid #DFE6EC;
    margin-bottom: 15px;
    padding-bottom: 10px;
    .info_title {
        background: #EEF1F6;
        padding: 0 18px;
    }
    .info_info {
        padding: 0 18px;
        display: flex;
        justify-content: flex-start;
        .first-lable {
            width: 90px;
            text-align: right;
        }
    }

    .refund_img {
        width: 80px;
        height: 80px;
        margin: 12px 12px 12px 0;
        img {
            width: 80px;
            height: 80px;
        }
    }
}
</style>
