<style lang="scss" scoped>
.top {
    margin: 30px 0;
}
.total {
    margin: 10px 0;
    .text {
        margin: 0 10px;
    }
    .number {
        font-size: 18px;
        color: red;
        padding: 0 5px;
    }
}
</style>

<template lang="html">
  <div class="">
    <h1>example</h1>
  </div>
</template>

<script>
import {
    isISBNFormat
} from "../../scripts/utils"
import axios from "../../scripts/http"
export default {
    data() {
        return {
            op: {
                type: true,
                isbn: ''
            },
            books: []
        }
    },
    computed: {
        getTotalAmount: function() {
            var total_amount = 0
            for (var i = 0; i < this.books.length; i++) {
                total_amount += this.books[i].number
            }
            return total_amount
        },
        getTotalPrice: function() {
            var total_price = 0
            for (var i = 0; i < this.books.length; i++) {
                total_price += this.books[i].number * this.books[i].selling_price
            }
            return parseFloat(total_price).toFixed(2)
        }
    },
    mounted() {
        this.focusInput()
    },
    methods: {
        changeCount: function(index,number) {
            if (number<1 || !number) {
                this.$message({
                    message: '出库量不能少于1本！',
                    type: 'error'
                })
                this.books[index].number = 1
            }
        },
        focusInput () {
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

            var type = this.op.type ? 2 : 1

            if (this.books.length > 0) {
                for (var i = 0; i < this.books.length; i++) {
                    if (this.books[i].isbn == this.op.isbn && this.books[i].type == type) {
                        this.books[i].number += 1
                        this.op.isbn = ''
                        return
                    }
                }
            }

            axios.post('/v1/books/checkStore', {
                type: type,
                isbn: this.op.isbn
            }).then(resp => {
                console.log(resp);
                if (resp.data.code != '00000' || resp.data.data.length <= 0) {
                    this.$message({
                        message: '没有找到这本' + (type == 1 ? '"新书"' : '"旧书"'),
                        type: 'warning'
                    })
                    return
                }
                let resp_book = resp.data.data[0]
                let aaa = resp_book.book
                var book = {
                    id: resp_book.id,
                    isbn: resp_book.isbn,
                    title: resp_book.book.title,
                    type: resp_book.type,
                    publisher: resp_book.book.publisher,
                    price_int: parseFloat(resp_book.book.price_int / 100).toFixed(2),
                    discount: parseFloat(resp_book.selling_price / resp_book.book.price_int * 10).toFixed(1) + ' 折',
                    selling_price: parseFloat(resp_book.selling_price / 100).toFixed(2),
                    amount: resp_book.amount,
                    number: 1
                }

                this.books.unshift(book)
                this.op.isbn = ''
            })
        },
        delete_row(index) {
            console.log(index)
            this.books.splice(index, 1)
            this.focusInput()
        },
        buySubmit() {
            if (this.books.length > 0) {
                var total_amount = 0
                var total_price = 0
                var items = []
                for (var i = 0; i < this.books.length; i++) {
                    total_amount += this.books[i].number
                    total_price += this.books[i].number * this.books[i].selling_price
                    var item = {
                        goods_id: this.books[i].id,
                        number: this.books[i].number,
                        book_title: this.books[i].title,
                        book_price: parseInt(this.books[i].selling_price * 100),
                        isbn: this.books[i].isbn,
                        type: this.books[i].type
                    }
                    items.push(item)
                }

                axios.post('/v1/orders/offline_sale', {
                    total_price: parseInt(total_price * 100), //required   总价 单位分
                    total_amount: total_amount, //required   总数量
                    sales_channel: 2, //销售渠道 2 => 线下零售
                    items: items
                }).then(resp => {
                    if (resp.data.code == '00000') {
                        this.$message({
                            message: '提交订单成功！',
                            type: 'success'
                        })
                        this.books.splice(0, this.books.length)
                    } else {
                        this.$message({
                            message: '提交订单失败！',
                            type: 'error'
                        })
                    }
                })
            } else {
                this.$message({
                    message: '没有需要提交的订单！',
                    type: 'info'
                })
            }
            this.focusInput()
        }
    }
}
</script>
