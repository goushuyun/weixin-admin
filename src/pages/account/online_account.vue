<style lang="scss" scoped>@import "./online_account.scss";</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">线上资产</h2>
    </div>
    <div class="content_inner">
        <el-row :gutter="10" :align="middle">
            <el-col :span="16" style="display:flex;">
                <div class="blue">
                    <div class="block">
                        <p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{online_total_sales}}元</p>
                        <p>线上总销售额</p>
                    </div>
                </div>
                <div class="blue">
                    <div>
                        <p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{unsettled_balance}}元</p>
                        <p>待结算金额</p>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="total">
                    <div class="block">
                        <p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{balance}}元</p>
                        <p>可提现金额</p>
                        <div class="btn_area">
                            <el-button @click="preWithdraw" type="primary" size="mini" style="width:40px;position:relative;top:3px;left:10px;">提现</el-button>
                            <el-button @click="recharge_dialog_show = true" type="primary" size="mini" style="width:40px;position:relative;top:3px;left:5px;">充值</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-card style="margin-top:15px;">
            <div style="color:#888;position:absolute;right:40px;top:195px;">线上交易记录</div>

            <el-tabs class="tabs" v-model="activeName" @tab-click="tabChange">
                <el-tab-pane label="待结算金额记录" name="unsettled"></el-tab-pane>
                <el-tab-pane label="可提现金额记录" name="balance"></el-tab-pane>
            </el-tabs>

            <div class="row">
                <el-date-picker :editable="false" v-model="account_time" size="small" type="datetimerange" placeholder="选择下单时间" :picker-options="pickerOptions" @change="findList" style="width: 300px;"></el-date-picker>
                <el-select v-model="type" size="small" style="margin:0 30px;" @change="findList" clearable placeholder="请选择交易类型">
                    <el-option v-if="activeName == 'unsettled'" label="交易完成" value="1"></el-option>
                    <el-option v-if="activeName == 'unsettled'" label="手续费" value="2"></el-option>
                    <el-option v-if="activeName == 'unsettled'" label="交易收入" value="4"></el-option>

                    <el-option v-if="activeName == 'balance'" label="交易完成" value="17"></el-option>
                    <el-option v-if="activeName == 'balance'" label="充值" value="18"></el-option>
                    <el-option v-if="activeName == 'balance'" label="提现" value="20"></el-option>
                    <el-option v-if="activeName == 'balance'" label="售后" value="24"></el-option>
                </el-select>
                <label style="color:#888">本次查询合计：收入<span style="color:#008000;margin:0 5px">{{total_income}}</span>元，支出<span style="color:#FF0063;margin:0 5px">{{total_expense}}</span>元</label>
            </div>

            <el-table class="row" ref="account_list" stripe border :data="account_list" style="width: 100%">
                <el-table-column type="index" width="60"> </el-table-column>
                <el-table-column property="item_type" label="交易类型" width="100">
                  <template scope="scope">
                      <span v-if="scope.row.item_type == 1">交易完成</span>
                      <span v-if="scope.row.item_type == 2">手续费</span>
                      <span v-if="scope.row.item_type == 4">交易收入</span>
                      <span v-if="scope.row.item_type == 17">交易完成</span>
                      <span v-if="scope.row.item_type == 18">充值</span>
                      <span v-if="scope.row.item_type == 20">提现</span>
                      <span v-if="scope.row.item_type == 24">售后</span>
                  </template>
                </el-table-column>
                <el-table-column property="order_id" :label="activeName == 'unsettled' ? '订单号':'订单号/交易号'" width="170"></el-table-column>
                <el-table-column property="item_fee" label="收支金额(元)" width="130">
                  <template scope="scope">
                    <span v-if="scope.row.item_fee > 0" style="color:#13CE66">{{'+' + scope.row.item_fee}}</span>
                    <span v-else-if="scope.row.item_fee < 0" style="color:#FF4949">{{scope.row.item_fee}}</span>
                    <span v-else style="color:#FF4949">{{'-' + scope.row.item_fee}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="activeName == 'unsettled'" property="account_balance" label="待结算金额(元)" width="130"></el-table-column>
                <el-table-column v-else property="account_balance" label="可提现金额(元)" width="130"></el-table-column>
                <el-table-column property="remark" label="交易明细" width="250"></el-table-column>
                <el-table-column property="create_at" label="时间" width="120"></el-table-column>
                <el-table-column label="状态">
                    <template scope="scope">
                        <span v-if="scope.row.item_type == 18">充值成功</span>
                        <div v-else-if="scope.row.item_type == 20">
                          <span v-if="scope.row.status == 0" style="color:#FF4949">提现异常</span>
                          <span v-if="scope.row.status == 1" style="color:#F7BA2A">即将处理</span>
                          <span v-if="scope.row.status == 2" style="color:#20A0FF">正在处理</span>
                          <span v-if="scope.row.status == 3" style="color:#13CE66">提现成功</span>
                        </div>
                        <el-button v-else type="text" @click="goToDetail(scope.$index)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </el-card>

        <!-- recharge dialog -->
        <el-dialog title="商户充值" :visible.sync="recharge_dialog_show">
            <ul class="info_list">
                <li class="info_item">
                    <span class="key">可提现金额</span>
                    <span class="val"><span class="can_without_amount">{{balance}}</span> 元</span>
                </li>
                <li class="info_item">
                    <span class="key">支付方式</span>
                    <span class="val">
                        <img class="payway alipay" src="https://t.alipayobjects.com/images/T11rdgXbFkXXXXXXXX.png" alt="">
                    </span>
                </li>
                <li class="info_item">
                    <span class="key">充值金额</span>
                    <span class="val">
                        <el-radio-group v-model="recharge_amount" size="small">
                            <el-radio-button :label="10000">¥ 100</el-radio-button>
                            <el-radio-button :label="20000">¥ 200</el-radio-button>
                            <el-radio-button :label="50000">¥ 500</el-radio-button>
                            <el-radio-button :label="100000">¥ 1000</el-radio-button>
                        </el-radio-group>
                    </span>
                </li>
            </ul>

            <span slot="footer" class="dialog-footer">
                <el-button @click="recharge_dialog_show = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm_recharge"  size="small" :disabled="recharge_amount === 0">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 设置提现账号 -->
        <el-dialog title="设置提现账号" :visible.sync="setting_account_dialog.visible" size="small" :close-on-click-modal="false" :close-on-press-escape="false" @open="getStoreInfo" @close="setting_account_dialog.code = ''">
          <div class="setting_account_dialog">
              <el-form ref="setting_account_dialog" :rules="account_rules" :model="setting_account_dialog" label-width="130px">
                <el-form-item prop="store_name" label="店铺名称：">{{setting_account_dialog.store_name}}</el-form-item>
                <el-form-item prop="creat_date" label="创建时间：">{{setting_account_dialog.creat_date}}</el-form-item>
                <el-form-item prop="type" label="可提现方式：">
                  <el-radio-group v-model="setting_account_dialog.type" size="small">
                    <el-radio-button label="0">对私银行账户（提现至个人账户）</el-radio-button>
                    <el-radio-button label="1">对公银行账户（提现至公司账户）</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="card_name" label="开户银行：">
                  <el-input v-model="setting_account_dialog.card_name" size="small" placeholder="请输入银行支行"></el-input>
                </el-form-item>
                <el-form-item prop="card_no" :label="setting_account_dialog.type == '0' ? '银行卡卡号：' : '公司账户：'">
                  <el-input v-model="setting_account_dialog.card_no" size="small"></el-input>
                </el-form-item>
                <el-form-item prop="username" :label="setting_account_dialog.type == '0' ? '开卡人姓名：' : '公司名称：'">
                  <el-input v-model="setting_account_dialog.username" size="small"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="短信验证码：">
                  <el-input v-model="setting_account_dialog.code" size="small">
                    <el-button slot="append" style="width:100px" @click="getMessageCode" :disabled="setting_account_dialog.timer_disabled">
                      <span v-show="!setting_account_dialog.timer_disabled">获取验证码</span>
                      <span v-show="setting_account_dialog.timer_disabled">（{{setting_account_dialog.timer_second}}s）</span>
                    </el-button>
                  </el-input>
                </el-form-item>
                <el-form-item><span style="color:#888">验证短信将发送到：{{setting_account_dialog.mobile}} , 请注意查收</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="saveCard('setting_account_dialog')">保存</el-button>
                </el-form-item>
              </el-form>
          </div>
        </el-dialog>

        <!-- 提现申请 -->
        <el-dialog title="提现" :visible.sync="withdraw_dialog.visible" size="small" :close-on-click-modal="false" :close-on-press-escape="false" @open="handleAccountInfo" @close="withdraw_dialog.withdraw_fee = ''">
          <div class="withdraw_dialog">
              <el-form ref="withdraw_dialog" :rules="withdraw_rules" :model="withdraw_dialog" label-width="130px">
                <el-form-item prop="balance" label="可提现金额："><span style="color:#FF4949">{{balance}}</span> 元</el-form-item>
                <el-form-item prop="account_info" label="提现账号：">{{withdraw_dialog.account_info}}
                  <el-button type="text" style="margin-left:10px;" @click="preUpdateCard">修改账号</el-button>
                </el-form-item>
                <el-form-item prop="withdraw_fee" label="提现金额：">
                  <el-input v-model="withdraw_dialog.withdraw_fee" size="small">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="withdrawApply('withdraw_dialog')">确认提现</el-button>
                </el-form-item>
              </el-form>
          </div>
        </el-dialog>
    </div>
</div>

</template>

<script>
import {
    priceFloat,
    priceInt
}
from '../../scripts/utils'
import axios from "../../scripts/http"

import mix from './online_account.js'

export default {
    mixins: [mix],
    data() {
        var checkCardNo = (rule, value, callback) => {
            let cardNoReg = /\d{15}|\d{19}/
            if (!cardNoReg.test(value)) {
                callback(new Error('银行账号格式不正确'));
            } else {
                callback();
            }
        };
        var checkMessageCode = (rule, value, callback) => {
            let msgCodeReg = /\d{4}/
            if (!msgCodeReg.test(value)) {
                callback(new Error('验证码格式不正确'));
            } else {
                callback();
            }
        };
        var checkWithdrawFee = (rule, value, callback) => {
            let withdrawFeeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            if (!withdrawFeeReg.test(value)) {
                callback(new Error('提现金额格式不正确'));
            } else if (value == 0) {
                callback(new Error('提现金额不能为 0'));
            } else {
                callback();
            }
        };
        return {
            // 设置提现账户
            setting_account_dialog: {
                visible: false,
                store_name: '',
                creat_date: '',
                mobile: '',
                type: '0',
                card_name: '',
                card_no: '',
                username: '',
                code: '',
                checked: false,
                operating: 'add', //add-新增账户，update-更新账户

                /* 验证码倒计时 */
                timer_second: 60,
                timer_disabled: false
            },
            account_rules: {
                card_name: [{
                    required: true,
                    message: '银行名称不能为空',
                    trigger: 'blur'
                }],
                card_no: [{
                    required: true,
                    message: '银行账号不能为空',
                    trigger: 'blur'
                }, {
                    validator: checkCardNo,
                    trigger: 'blur'
                }],
                username: [{
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                code: [{
                    required: true,
                    message: '验证码不能为空',
                    trigger: 'blur'
                }, {
                    validator: checkMessageCode,
                    trigger: 'blur'
                }]
            },
            withdraw_rules: {
                withdraw_fee: [{
                    required: true,
                    message: '提现金额不能为空',
                    trigger: 'blur'
                }, {
                    validator: checkWithdrawFee,
                    trigger: 'blur'
                }]
            },
            // 提现
            withdraw_dialog: {
                visible: false,
                account_info: '', //账户信息
                withdraw_fee: '' //申请提现金额
            },

            store_card: {},
            // recharge data
            recharge_dialog_show: false,
            recharge_amount: 0,

            online_total_sales: 0, //线上总销售额
            unsettled_balance: 0, //待结算
            balance: 0, //可提现

            activeName: 'unsettled',

            account_time: [null, null], //时间选择器[最早时间,最晚时间]
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).format('YYYY-MM-DD')
                        var creat_date = moment(create_at)
                        var start_time = moment(moment().subtract(7, 'days').format('YYYY-MM-DD'));
                        if (creat_date > start_time) {
                            var start = creat_date
                        } else {
                            var start = start_time
                        }
                        const end = moment();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).format('YYYY-MM-DD')
                        var creat_date = moment(create_at)
                        var start_time = moment(moment().subtract(1, 'months').format('YYYY-MM-DD'));
                        if (creat_date > start_time) {
                            var start = creat_date
                        } else {
                            var start = start_time
                        }
                        const end = moment();
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).format('YYYY-MM-DD')
                        var creat_date = moment(create_at)
                        var start_time = moment(moment().subtract(3, 'months').format('YYYY-MM-DD'));
                        if (creat_date > start_time) {
                            var start = creat_date
                        } else {
                            var start = start_time
                        }
                        const end = moment();
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    var create_at = moment.unix(parseInt(localStorage.getItem('create_at'))).subtract(1, 'days')
                    var yesterday = moment().subtract(1, 'days')
                    return (time.getTime() < create_at || time.getTime() > yesterday)
                }
            },
            type: '', //交易类型

            total_income: 0,
            total_expense: 0,
            account_list: [],

            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.getStoreData()
        this.getTotalSales()
        this.sellerAccount()
        this.findList()
    },
    destroyed() {
        this.$store.commit('setAccountSearch', {
            account_time: this.account_time, //时间选择器[最早时间,最晚时间]
            type: this.type, //订单状态
            activeName: this.activeName,
            page: this.page,
            size: this.size
        })
    },
    methods: {
        tabChange() {
            this.type = ''
            this.findList()
        },
        withdrawApply(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (priceInt(this.withdraw_dialog.withdraw_fee) > priceInt(this.balance)) {
                        this.$message.error('余额不足，最多可提现 ' + this.balance + ' 元')
                        return
                    }
                    axios.post('/v1/store/withdraw_apply', {
                        "withdraw_card_id": this.store_card.id, //提现卡id
                        "withdraw_fee": priceInt(this.withdraw_dialog.withdraw_fee) //提现金额
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.$message.success('提现申请已成功提交！')
                            this.sellerAccount()  //刷新商家账户余额（可提现+待结算）
                            this.withdraw_dialog.visible = false
                            this.withdraw_dialog.withdraw_fee = ''
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 点击体现按钮
        preWithdraw() {
            // 获取店铺提现卡详情
            axios.post('/v1/store/get_store_card', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    // 如果没有体现卡设置，这打开添加体现卡窗口
                    if (resp.data.data.card_no == '') {
                        this.setting_account_dialog.visible = true
                    }
                    // 否则，打卡提现窗口
                    else {
                        this.store_card = resp.data.data
                        this.withdraw_dialog.visible = true
                    }
                }
            })
        },
        // 添加申请提现窗口的open钩子方法，处理账户信息
        handleAccountInfo() {
            var account_info = ''
            if (parseInt(this.store_card.type) == 0) {
                account_info += '对私银行账户：'
            } else {
                account_info += '对公银行账户：'
            }
            account_info += (this.store_card.username + ' ' + this.store_card.card_no)
            this.withdraw_dialog.account_info = account_info
        },
        // 保存按钮，opt:add-新增账户，upd-更新账户信息
        saveCard(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.setting_account_dialog.operating == 'add') {
                        this.addAccount(formName)
                    } else {
                        this.updateAccount(formName)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加提现卡的保存按钮
        addAccount(formName) {
            axios.post('/v1/store/save_card', {
                "type": this.setting_account_dialog.type, //required 0:对私账户 1对公账户
                "card_name": this.setting_account_dialog.card_name,
                "card_no": this.setting_account_dialog.card_no, //required 银行卡号
                "username": this.setting_account_dialog.username, //required  银行卡所属人姓名
                "code": this.setting_account_dialog.code //required  短信验证码
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.store_card = resp.data.data
                    this.setting_account_dialog.visible = false
                    this.withdraw_dialog.visible = true
                }
            })
        },
        // 添加提现卡的open钩子方法，获取店铺用户名和创建日期
        getStoreInfo() {
            if (this.setting_account_dialog.store_name) {
                return
            }
            axios.post('/v1/store/store_info', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.setting_account_dialog.store_name = resp.data.data.name
                    this.setting_account_dialog.creat_date = moment(resp.data.data.create_at * 1000).format('YYYY-MM-DD')
                    this.setting_account_dialog.mobile = resp.data.data.admin_mobile
                }
            })
        },
        // 准备修改提现账号
        preUpdateCard() {
            this.setting_account_dialog.type = this.store_card.type + ''
            this.setting_account_dialog.card_no = this.store_card.card_no
            this.setting_account_dialog.username = this.store_card.username
            this.setting_account_dialog.operating = 'update'
            this.setting_account_dialog.visible = true
        },
        // 更新提现账号
        updateAccount() {
            axios.post('/v1/store/update_card', {
                "type": this.setting_account_dialog.type,
                "card_no": this.setting_account_dialog.card_no,
                "card_name": "中国农业银行杨浦支行",
                "username": this.setting_account_dialog.username,
                "code": this.setting_account_dialog.code, //required
                "id": this.store_card.id //required
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.store_card = resp.data.data
                    this.handleAccountInfo()
                    this.setting_account_dialog.visible = false
                }
            })
        },
        getStoreData() {
            var account_search = this.$store.state.account_search
            console.log(account_search);
            this.account_time = account_search.account_time ? account_search.account_time : [null, null]
            this.type = account_search.type ? account_search.type : ''
            this.activeName = account_search.activeName ? account_search.activeName : 'unsettled'
            this.page = account_search.page ? account_search.page : 1
            this.size = account_search.size ? account_search.size : 10
        },
        handleSizeChange(size) {
            this.size = size
            this.findList()
        },
        handleCurrentChange(page) {
            this.page = page
            this.findList()
        },
        goToDetail(index) {
            var order_id = this.account_list[index].order_id
            this.$router.push({
                name: 'order_detail',
                query: {
                    order_id
                }
            })
        },
        //获取账户明细列表
        findList() {
            var self = this
            var type = ''
            if (self.type == '') {
                if (self.activeName == 'unsettled') {
                    type = 80
                } else {
                    type = 81
                }
            } else {
                type = self.type
            }
            console.log(self.account_time);
            axios.post('/v1/account/find_list', {
                "start_at": self.account_time ? moment(self.account_time[0], "YYYY-MM-DD").unix() : 0,
                "end_at": self.account_time ? moment(self.account_time[1], "YYYY-MM-DD").unix() : 0,
                "page": self.page,
                "size": self.size,
                "type": type
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    self.total_count = resp.data.total_count
                    self.total_income = priceFloat(resp.data.total_income)
                    self.total_expense = priceFloat(-resp.data.total_expense)
                    self.account_list = resp.data.data.map(el => {
                        // el.item_type = self.getTypeName(el.item_type)
                        el.item_fee = priceFloat(el.item_fee)
                        el.account_balance = priceFloat(el.account_balance)
                        el.create_at = moment.unix(el.create_at).format('YYYY-MM-DD')
                        return el
                    })
                }
            })
        },
        getTypeName(type) {
            switch (type) {
                case 1:
                case "1":
                    return '交易完成'
                case 2:
                case "2":
                    return '手续费'
                case 4:
                case "4":
                    return '交易收入'
                case 17:
                case "17":
                    return '交易完成'
                case 18:
                case "18":
                    return '充值'
                case 20:
                case "20":
                    return '提现'
                case 24:
                case "24":
                    return '售后'
            }
        },
        //获取历史销售额（昨日销售额和历史总销售额）
        getTotalSales() {
            axios.post('/v1/statistic/get_total_sales', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.online_total_sales = priceFloat(data.total_sales.online_total_sales)
                }
            })
        },
        //获取商家账户余额（可提现+待结算）
        sellerAccount() {
            axios.post('/v1/account/seller_account', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.unsettled_balance = priceFloat(resp.data.data.unsettled_balance)
                    this.balance = priceFloat(resp.data.data.balance)
                }
            })
        },
        getMessageCode() {
            axios.post('/v1/store/get_card_ope_sms', {}).then(resp => {
                if (resp.data.code != '00000') {
                    this.$message.error("获取验证码失败，请重试！")
                }
                if (resp.data.message == 'ok') {
                    this.$message.info("已发送，请查收短信！")
                    this.setting_account_dialog.timer_disabled = true
                    this.timer()
                }
            })
        },
        timer() {
            var self = this
            if (self.setting_account_dialog.timer_second > 0) {
                self.setting_account_dialog.timer_second--;
                setTimeout(function() {
                    self.timer()
                }, 1000);
            } else {
                self.setting_account_dialog.timer_disabled = false
            }
        }
    }
}
</script>
