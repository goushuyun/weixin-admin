<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title"><span class="pre_page"  @click="prePage">话题推荐</span> / {{topic_id ? '编辑' : '添加'}}话题</h2>
    </div>
    <div class="content_inner">

        <el-form label-width="100px">
            <el-form-item label="话题名称" required>
                <label v-if="!update && topic_id" class="margin_right20">{{update_title}}</label>
                <el-input v-if="(update && topic_id) || (!topic_id)" class="margin_right20" id="title_input" v-model="title" size="small" :maxlength="10"></el-input>
                <el-button v-if="!update && topic_id" type="text" @click="proUpdate">修改</el-button>
                <el-button v-if="update && topic_id" type="text" @click="confirmUpdate">确定</el-button>
                <el-button v-if="update && topic_id" type="text" style="color:#13CE66" @click="update = false">取消</el-button>
            </el-form-item>
            <el-form-item label="添加书籍" required>
                <el-input id="isbn_input" v-model="isbn" size="small" placeholder="请输入isbn编码" :maxlength="13" icon="search" @keyup.enter.native="search" :on-icon-click="search"></el-input>
                <el-button style="float:right;margin:0 20px" size="small" @click="prePage">返回</el-button>
                <el-button v-if="!topic_id" style="float:right" type="primary" size="small" @click="addTopic">提交发布</el-button>
            </el-form-item>
        </el-form>

        <el-table style="width: 100%;margin-bottom: 15px;" :data="goods" v-loading.body="loading">
            <el-table-column label="ISBN" width="150" prop="isbn">
            </el-table-column>
            <el-table-column label="书名" width="200" prop="title">
            </el-table-column>
            <el-table-column label="出版社" width="200" prop="publisher">
            </el-table-column>
            <el-table-column label="原价" width="150" prop="price">
            </el-table-column>
            <el-table-column label="库存量" width="150" prop="stock">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button-group>
                        <el-button size="small" type="text" icon="delete" @click="delGoods(scope.$index)"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination  v-if="topic_id" :current-page="page" :total="total_count" :page-sizes="[15, 30, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "../../../scripts/http"
import {
    isISBNFormat,
    priceFloat,
    priceInt
} from "../../../scripts/utils"
export default {
    data() {
        return {
            update:false,
            topic_id: '',

            title: '',
            update_title: '',

            isbn: '',

            goods: [],

            loading: false,

            page: 1,
            size: 15,
            total_count: 0
        }
    },
    mounted() {
        //拿到话题的ID，推荐状态
        this.topic_id = this.$route.query.topic_id ? this.$route.query.topic_id : ''
        this.update_title = this.$route.query.title ? this.$route.query.title : ''
        if (this.topic_id) {
            this.getTopic()
            $('#isbn_input input').focus()
        } else {
            this.$nextTick(() => {
                $('#title_input input').focus()
            })
        }
    },
    methods: {
        handleSizeChange(size) {
            this.size = size
            this.getTopic()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getTopic()
        },
        prePage() {
            this.$router.go('-1')
        },
        // 点击修改 仓库名称 自动聚焦
        proUpdate() {
            this.update = true
            this.title = this.update_title
            this.$nextTick(() => {
                $('#title_input input').focus()
            })
        },
        confirmUpdate() {
            if (this.title == '') {
                this.$message.info('请填写专题名称')
                $('#title_input input').focus()
                return
            }
            axios.post('/v1/topic/update', {
                "id": this.topic_id, //话题的id
                "title": this.title //名称
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.update_title = this.title
                    this.update = false
                    this.$message.info('更新成功！')
                }
            })
        },
        getTopic() {
            axios.post('/v1/topic/topics_info', {
                "id": this.topic_id,
                "page": this.page,
                "size": this.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data[0]
                    this.total_count = resp.data.totalCount
                    console.log(data.items);
                    this.goods = data.items.map(el => {
                        el.price = priceFloat(el.book_price)
                        return el
                    })
                }
            })
        },
        addTopic() {
            //检查话题名称、书本数量
            if (this.title == '') {
                this.$message.info('请填写专题名称')
                $('#title_input input').focus()
                return
            }
            if (this.goods.length == 0) {
                this.$message.info('请添加专题所要包含的书籍')
                $('#isbn_input input').focus()
                return
            }
            let data = {
                "title": this.title, //话题名称
                "sort": 1, //优先级 1 低 2 中 3 高
                "profile": ""
            }
            data.items = this.goods.map(el => {
                return {
                    goods_id: el.goods_id
                }
            })
            axios.post('/v1/topic/add', data).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('添加成功！')
                    this.$router.push('topic')
                }
            })
        },
        delGoods(index) {
            if (this.topic_id != '') {
                this.$confirm('你确定要删除这个话题商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.goods.length > 1) {
                        this.deleteTopicItem(this.goods[index].id)
                        this.goods.splice(index, 1)
                    } else {
                        this.$confirm('话题至少有一个商品被推荐，继续操作将删除该话题', '提示', {
                            confirmButtonText: '继续删除',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.deleteTopic()
                            this.$router.push('topic')
                        }).catch(() => {
                            this.$message.info('已取消删除');
                        });
                    }
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
            } else {
                this.goods.splice(index, 1)
            }
        },
        deleteTopicItem(id) {
            axios.post('/v1/topic/del_item', {
                "topic_id": this.topic_id, //话题id
                "id": id //关联的商品id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('已删除！')
                }
            })
        },
        deleteTopic() {
            axios.post('/v1/topic/del', {
                "id": this.topic_id, //话题id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('已删除！')
                }
            })
        },
        search() {
            //一个话题内商品数量限制在15本内
            if (this.goods.length > 15) {
                this.$message.warning('一个话题内的书本数量不能超过 15 本')
                return
            }
            //isbn为空
            if (!isISBNFormat(this.isbn)) {
                this.$message.warning('请填写正确的 ISBN 码')
                return
            }
            if (this.goods.length > 0) {
                for (var i = 0; i < this.goods.length; i++) {
                    if (this.goods[i].isbn == this.isbn) {
                        this.$message.warning('该商品已在推荐列表中')
                        this.isbn = ''
                        $('#isbn_input input').focus()
                        return
                    }
                }
            }
            this.loading = true

            axios.post("/v1/goods/search", {
                "isbn": this.isbn, //not required 书本的isbn
                "search_amount": -100, //required -100 过滤这个线索 ;除了-100 的num 查找库存为num的数据
                "search_type": -100, //required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
                "search_picture": -100, //required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    console.log(data);
                    if (data.length == 0) {
                        //没有找到
                        this.$message.warning('没有在仓库找到这本书')
                        this.loading = false
                        return
                    }
                    let goods = data[0]
                    //检查商品库存数量，小于0 则提示不能推荐
                    var amount = 0
                    var goods_id = ''
                    if (goods.new_book) {
                        amount += goods.new_book.amount
                        goods_id = goods.new_book.goods_id
                    }
                    if (goods.old_book) {
                        amount += goods.old_book.amount
                        if (goods_id =='') {
                            goods_id = goods.old_book.goods_id
                        }
                    }
                    if (amount < 1) {
                        this.$message.warning('该商品库存不足，请及时上架商品！')
                        this.loading = false
                        return
                    }
                    goods.book.price = priceFloat(goods.book.price)
                    goods.book.stock = amount
                    goods.book.goods_id = goods_id
                    this.goods.unshift(goods.book)
                    if (this.topic_id != '') {
                        //已有话题，添加话题项
                        this.addTopicItem(goods_id)
                    }
                    this.loading = false
                    this.isbn = ''
                    $('#isbn_input input').focus()
                }
            })
        },
        addTopicItem(goods_id) {
            axios.post('/v1/topic/add_item', {
                "topic_id": this.topic_id, //话题id
                "goods_id": goods_id //关联的商品id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('加入成功！')
                }
            })
        }
    }
}
</script>

<style lang="scss">
.el-input {
    width: 220px;
}
.pre_page {
    &:hover {
        color: #20A0FF;
        cursor: pointer;
    }
}
.margin_right20 {
    margin-right: 20px;
}
</style>
