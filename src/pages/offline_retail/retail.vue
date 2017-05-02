<style lang="scss" scoped>
.total {
    margin: 10px 0;
    float: right;
    .text {
        margin: 0 10px;
    }
    .number {
        color: red;
        padding: 0 5px;
    }
}
.buySubmit {
    margin-top: 1px;
    text-align: center;
    width: 100%;
}
.el-table .info-row {
    background: #c9e5f5;
}
.el-table .positive-row {
    background: #e2f0e4;
}
</style>

<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">线下零售</h2>
    </div>
    <div class="content_inner">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="school_id" style="width: 240px;" placeholder="学校" size="small">
            <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch :width="64" @change="focusInput" v-model="op.type" on-text="旧书" off-text="新书" on-color="#1AAD19" off-color="#3A8AFF" style="margin-left:50px"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-input class="isbn_input" v-model="op.isbn" placeholder="请录入ISBN" size="small" icon="search" v-on:keyup.enter.native="search" :on-icon-click="search"></el-input>
        </el-form-item>
      </el-form>
      <div class="table">
        <el-table :data="books" style="width: 100%" :row-class-name="tableRowClassName">
          <el-table-column prop="isbn" label="ISBN" width="150"></el-table-column>
          <el-table-column label="书名" width="260">
            <template scope="scope">{{ scope.row.title }}
              <el-tag v-if="scope.row.type==1" color="#1AAD19" style="margin-left: 10px">二手书</el-tag>
              <el-tag v-else color="#3A8AFF" style="margin-left: 10px">新书</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="原价" width="100"></el-table-column>
          <el-table-column prop="discount" label="折扣" width="100"></el-table-column>
          <el-table-column prop="selling_price" label="售价" width="100"></el-table-column>
          <el-table-column prop="amount" label="库存量" width="100"></el-table-column>
          <el-table-column label="出库量" width="100">
            <template scope="scope"><el-input type="number" min="1" size="small" v-model.number="scope.row.number" v-on:blur="changeCount(scope.$index,scope.row.number)"></el-input></template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope"><el-button type="primary" size="small" @click="delete_row(scope.$index)">移除</el-button></template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width:100%;height:50px;">
        <div class="total">
          <el-row type="flex" justify="end">
            <el-col style="float:right;">
              <label class="text">共<span class="number">{{getTotalAmount}}</span>本，合计 <span class="number">{{getTotalPrice}}</span>元，实收 <el-input type="number" size="mini" style="width:80px;margin:0 5px" v-model="actual_tatal_fee"></el-input> 元</label>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="buySubmit">
        <el-button type="primary" size="small" @click="buySubmit" :disabled="!books.length && subDisabled">确认出售</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
    isISBNFormat,
    priceFloat,
    priceInt
} from "../../scripts/utils"
import axios from "../../scripts/http"
export default {
    data() {
        return {
            op: {
                type: true,
                isbn: ''
            },
            books: [],
            schools: [],
            school_id: '',
            actual_tatal_fee: '',

            subDisabled: true
        }
    },
    computed: {
        getTotalAmount() {
            var total_amount = 0
            for (var i = 0; i < this.books.length; i++) {
                total_amount += this.books[i].number
            }
            return total_amount
        },
        getTotalPrice() {
            var total_price = 0
            for (var i = 0; i < this.books.length; i++) {
                total_price += this.books[i].number * this.books[i].selling_price
            }
            this.actual_tatal_fee = parseFloat(total_price).toFixed(2)
            return parseFloat(total_price).toFixed(2)
        }
    },
    mounted() {
        this.getSchools()
        this.focusInput()
    },
    methods: {
        // tableRowClassName(row, index) {
        //     var style = ''
        //     console.log('this.books[index].style_show:' + this.books[index].style_show);
        //     if (this.books[index].style_show) {
        //         style = 'stock_lack'
        //     }
        //     return style
        // },
        tableRowClassName(row, index) {
            if (index === 0) {
                return 'info-row';
            } else if (index === 1) {
                return 'positive-row';
            }
            return '';
        },
        getSchools() {
            axios.post('/v1/school/store_schools', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.schools = resp.data.data
                    if (resp.data.data.length > 0) {
                        this.school_id = resp.data.data[0].id
                    } else {
                        this.$alert('请移步“经营学校”添加学校', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push('/admin/store_setting/school')
                            }
                        });
                    }
                }
            })
        },
        changeCount(index, number) {
            if (number < 1 || !number) {
                this.$message({
                    message: '出库量不能少于1本！',
                    type: 'error'
                })
                this.books[index].number = 1
            }
        },
        focusInput() {
            $('.isbn_input input').focus()
        },
        search() {
            this.focusInput()
            if (!isISBNFormat(this.op.isbn)) {
                this.$message({
                    message: 'ISBN 码格式不正确！',
                    type: 'warning'
                })
                return
            }

            var type = this.op.type ? 1 : 0

            if (this.books.length > 0) {
                for (var i = 0; i < this.books.length; i++) {
                    if (this.books[i].isbn == this.op.isbn && this.books[i].type == type) {
                        this.books[i].number += 1
                        this.op.isbn = ''
                        return
                    }
                }
            }

            axios.post('/v1/goods/search', {
                "isbn": this.op.isbn, //not required 书本的isbn
                "search_amount": 0, //required 0 全部，1 库存小于等于0的书， 2 库存大于0的书
                "search_type": type, //required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
                "search_picture": -100, //required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    if (resp.data.data.length <= 0) {
                        this.$message({
                            message: '没有找到这本' + (type == 0 ? '新书' : '旧书'),
                            type: 'warning'
                        })
                        return
                    }
                    let data = resp.data.data[0]
                    var book = {
                        id: data.book.id,
                        goods_id: data.goods_id,
                        isbn: data.book.isbn,
                        title: data.book.title,
                        type: type,
                        publisher: data.book.publisher,
                        price: priceFloat(data.book.price),
                        number: 1,
                        selling_price: type == 1 ? priceFloat(data.old_book.price) : priceFloat(data.new_book.price),
                        discount: type == 1 ? parseFloat(data.old_book.price / data.book.price * 10).toFixed(1) : parseFloat(data.new_book.price / data.book.price * 10).toFixed(1),
                        amount: type == 1 ? data.old_book.amount : data.new_book.amount
                    }
                }

                this.books.unshift(book)
                this.op.isbn = ''
            })
        },
        delete_row(index) {
            this.books.splice(index, 1)
            this.focusInput()
        },
        buySubmit() {
            this.subDisabled = false
            if (this.books.length > 0) {
                var items = []
                for (var i = 0; i < this.books.length; i++) {
                    var item = {
                        goods_id: this.books[i].goods_id,
                        amount: this.books[i].number,
                        type: this.books[i].type
                    }
                    items.push(item)
                }

                axios.post('/v1/retail/add', {
                    "school_id": this.school_id,
                    "total_fee": priceInt(this.actual_tatal_fee),
                    "items": items
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        this.$message({
                            message: '提交订单成功！',
                            type: 'success'
                        })
                        this.books.splice(0, this.books.length)
                        this.subDisabled = true
                    }
                    if (resp.data.message == 'noStock') {
                        this.$message({
                            message: '商品库存不足！',
                            type: 'error'
                        })
                        var array = resp.data.items
                        for (var i = 0; i < array.length; i++) {
                            if (!array[i].has_stock) {
                                console.log(!array[i].has_stock);
                                for (var j = 0; j < this.books.length; j++) {
                                    console.log(this.books[j].goods_id + ' ' + array[i].goods_id + ' ' + this.books[j].type + ' ' + array[i].type);
                                    if (this.books[j].goods_id == array[i].goods_id && this.books[j].type == array[i].type) {
                                        this.books[j].amount = array[i].current_amount
                                        this.books[j].number = array[i].current_amount
                                        this.books[j].style_show = true
                                        continue
                                    }
                                }
                            }
                        }
                        this.subDisabled = true
                    }
                })
            }
            this.focusInput()
        }
    }
}
</script>
