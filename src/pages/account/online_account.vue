<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">线上资产</h2>
  </div>
  <div class="content_inner">
    <el-row :gutter="10" :align="middle">
      <el-col :span="16" style="display:flex;">
        <div class="blue">
          <div class="block"><p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{online_total_sales}}元</p><p>线上总销售额</p></div>
        </div>
        <div class="blue">
          <div><p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{unsettled_balance}}元</p><p>待结算金额</p></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="total">
          <div class="block">
            <p style="font-size:24px"><i class="iconfont icon-moneybag moneyicon"></i>{{balance}}元</p><p>可提现金额</p>
            <div class="btn_area">
              <el-button type="text" style="color:#E9A084">提现</el-button>
              <el-button type="text" style="color:#FFFF1F">充值</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div style="color:#888;margin:20px 5px">线上交易记录</div>

    <el-tabs class="tabs" v-model="activeName" @tab-click="findList">
      <el-tab-pane label="待结算" name="unsettled"></el-tab-pane>
      <el-tab-pane label="可提现" name="balance"></el-tab-pane>
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
      <el-table-column property="item_type" label="交易类型" width="100"></el-table-column>
      <el-table-column property="order_id" :label="activeName == 'unsettled' ? '订单号':'订单号/交易号'" width="160"></el-table-column>
      <el-table-column property="item_fee" label="收支金额(元)" width="130"></el-table-column>
      <el-table-column v-if="activeName == 'unsettled'" property="account_balance" label="待结算金额(元)" width="130"></el-table-column>
      <el-table-column v-else property="account_balance" label="可提现金额(元)" width="130"></el-table-column>
      <el-table-column property="remark" label="交易明细" width="250"></el-table-column>
      <el-table-column property="create_at" label="时间" width="120"></el-table-column>
      <el-table-column label="状态">
        <template scope="scope">
          <el-button type="text" @click="goToDetail(scope.$index)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
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
            online_total_sales: 0, //线上总销售额
            unsettled_balance: 0, //待结算
            balance: 0, //可提现

            activeName: 'unsettled',

            account_time: [null, null], //时间选择器[最早时间,最晚时间]
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
        this.getTotalSales()
        this.sellerAccount()
        this.findList()
    },
    methods: {
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
            axios.post('/v1/account/find_list', {
                "start_at": self.account_time[0] ? moment(self.account_time[0], "YYYY-MM-DD").unix() : 0,
                "end_at": self.account_time[1] ? moment(self.account_time[1], "YYYY-MM-DD").unix() : 0,
                "page": self.page,
                "size": self.size,
                "type": type
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    self.total_count = resp.data.total_count
                    self.total_income = priceFloat(resp.data.total_income)
                    self.total_expense = priceFloat(- resp.data.total_expense)
                    self.account_list = resp.data.data.map(el => {
                        el.item_type = self.getTypeName(el.item_type)
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
                    return '交易完成'
                case 2:
                    return '手续费'
                case 4:
                    return '交易收入'
                case 17:
                    return '交易完成'
                case 18:
                    return '充值'
                case 20:
                    return '提现'
                case 24:
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
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    margin-bottom: 15px;
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
    .btn_area {
        position: absolute;
        right: 20px;
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
