<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">库存查看</h2>
  </div>
  <div class="content_inner">
    <el-form :inline="true" label-width="80px">
      <el-form-item label="ISBN">
        <el-input size="small" v-model="isbn"></el-input>
      </el-form-item>
      <el-form-item label="书名">
        <el-input size="small" v-model="title"></el-input>
      </el-form-item>
      <!-- <el-form-item label="出版社">
        <el-input size="small" v-model="publisher"></el-input>
      </el-form-item> -->
      <el-form-item label="作者">
        <el-input size="small" v-model="author"></el-input>
      </el-form-item>
      <el-form-item class="btn_bottom">
        <el-button size="small" type="primary" @click="getData" icon="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="80px">
      <el-form-item label="图书类型">
        <el-select size="small" v-model="search_type" @change="getData">
          <el-option label="所有" :value="-100"></el-option>
          <el-option label="新书" :value="0"></el-option>
          <el-option label="二手书" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-select size="small" v-model="search_amount" @change="getData">
          <el-option label="所有" value="0"></el-option>
          <el-option label="有货" value="2"></el-option>
          <el-option label="无货" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有图">
        <el-select size="small" v-model="search_picture" @change="getData">
          <el-option label="所有" :value="-100"></el-option>
          <el-option label="有图片" :value="0"></el-option>
          <el-option label="无图片" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="data_table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" width="56" label=""></el-table-column>
            <el-table-column label="图片" width="100">
                <template scope="scope">
                  <div class="imageare">
                      <img :src="'http://onv8eua8j.bkt.clouddn.com/' + scope.row.book.image" class="image"></img>
                  </div>
                </template>
            </el-table-column>
            <el-table-column prop="book.isbn" label="ISBN" width="150"></el-table-column>
            <el-table-column prop="book.title" label="书名" width="170"></el-table-column>
            <el-table-column label="类型" width="80">
                <template scope="scope">
                    <div v-if="scope.row.has_new_book" class="goods_item new_color">新书</div>
                    <div v-if="scope.row.has_old_book" class="goods_item old_color">二手书</div>
                </template>
            </el-table-column>
            <el-table-column label="售价" width="100">
                <template scope="scope">
                    <div v-if="scope.row.has_new_book" class="goods_item new_color">{{scope.row.new_book.price}}</div>
                    <div v-if="scope.row.has_old_book" class="goods_item old_color">{{scope.row.old_book.price}}</div>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="80">
                <template scope="scope">
                    <div v-if="scope.row.has_new_book" class="goods_item new_color">{{scope.row.new_book.amount}}</div>
                    <div v-if="scope.row.has_old_book" class="goods_item old_color">{{scope.row.old_book.amount}}</div>
                </template>
            </el-table-column>
            <el-table-column label="位置" min-width="180">
                <template scope="scope">
                    <el-tooltip v-if="scope.row.has_new_book" placement="top" effect="light" :enterable="false">
                      <div slot="content"><span v-for="(item,index) in scope.row.new_book.location">{{item.location_str + (index + 1 == scope.row.new_book.location.length ? '' : '，')}}</span></div>
                      <div class="goods_item new_color ellipsis">
                        <span v-for="(item,index) in scope.row.new_book.location">{{item.location_str + (index + 1 == scope.row.new_book.location.length ? '' : '，')}}</span>
                      </div>
                    </el-tooltip>
                    <el-tooltip v-if="scope.row.has_old_book" placement="top" effect="light" :enterable="false">
                      <div slot="content"><span v-for="(item,index) in scope.row.old_book.location">{{item.location_str + (index + 1 == scope.row.old_book.location.length ? '' : '，')}}</span></div>
                      <div class="goods_item old_color ellipsis">
                        <span v-for="(item,index) in scope.row.old_book.location">{{item.location_str + (index + 1 == scope.row.old_book.location.length ? '' : '，')}}</span>
                      </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="update_at" label="修改时间" width="160"></el-table-column> -->
            <el-table-column label="操作" width="120">
                <template scope="scope">
                    <el-button type="text" size="small" @click="preEdit(scope.$index)" icon="edit"></el-button>
                    <el-button type="text" style="color:#FF4949" size="small" @click="proDelete(scope.$index)" icon="delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <el-dialog size="mini" :title="'删除《' + deleteDialog.title + '》'" v-model="deleteDialog.show">
      <el-form :model="deleteDialog">
        <el-form-item>
          <div style="text-align:center;width:400px;">请选着要删除的书籍类型</div>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="deleteDialog.checkList">
            <el-checkbox :disabled="!deleteDialog.has_new_book" label="0">新书</el-checkbox>
            <el-checkbox :disabled="!deleteDialog.has_old_book" label="1">二手书</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog.show = false">取 消</el-button>
        <el-button type="primary" :disabled="deleteDialog.checkList.length == 0" @click="comfirmDelete">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog size="" v-model="book_info_show" top="6%" :close-on-click-modal="false" @close="reset('book_info')">
      <div class="body" v-loading="loading" :element-loading-text="拼命加载中">
        <el-upload
          class="avatar-uploader"
          action="http://upload.qiniu.com/"
          :data="imagesFormData"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError">
          <img v-if="book_info.image" :src="'http://onv8eua8j.bkt.clouddn.com/' + book_info.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-form ref="book_info" :model="book_info" :rules="rules" label-width="70px">
            <el-form-item label="ISBN" prop="isbn">
                <el-input id="isbn" v-model.trim="book_info.isbn"></el-input>
            </el-form-item>
            <el-form-item label="书 名" prop="title">
                <el-input :maxlength="30" v-model.trim="book_info.title"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
                <el-input v-model.trim="book_info.publisher"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
                <el-input v-model.trim="book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="原 价" prop="price">
                <el-input min="0" type="number" v-model="book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="类 型">
                <td style="width:220px;text-align:center;color: #1AAD19;margin-right:6px;">二手书</td>
                <td style="width:220px;text-align:center;color: #3A8AFF;">新书</td>
            </el-form-item>
            <el-form-item label="折 扣">
                <el-input min="0" type="number" placeholder="二手书折扣"  v-model="old_book.discount" @input="inputDiscount(1)" @blur="blurDiscount(1)"><template slot="append">折</template></el-input>
                <el-input min="0" type="number" placeholder="新书折扣" v-model="new_book.discount" @input="inputDiscount(0)" @blur="blurDiscount(0)"><template slot="append">折</template></el-input>
            </el-form-item>
            <el-form-item label="价 格">
                <el-input type="number" min="0" placeholder="二手书价格" v-model="old_book.price" @input="inputPrice(1)" @blur="blurPrice(1)"><template slot="append">元</template></el-input>
                <el-input type="number" min="0" placeholder="新书价格" v-model="new_book.price" @input="inputPrice(0)" @blur="blurPrice(0)"><template slot="append">元</template></el-input>
            </el-form-item>
            <el-form-item label="数 量">
                <el-input type="number" min="0" placeholder="二手书数量" v-model="old_book.amount" @input="inputAmount(1)"><template slot="append">当前库存 <span style="color:#1AAD19;font-size:16px">{{old_book.stock}}</span> 本</template></el-input>
                <el-input type="number" min="0" placeholder="新书数量" v-model="new_book.amount" @input="inputAmount(0)"><template slot="append">当前库存 <span style="color:#3A8AFF;font-size:16px">{{new_book.stock}}</span> 本</template></el-input>
            </el-form-item>
            <el-form-item label="位 置">
                <el-row>
                    <el-col style="width: 220px;margin-right: 10px;">
                        <div class="tag_area">
                            <el-input :readonly="true" v-for="(tag,index) in old_book.locations_strs" style="margin:5px 0;" v-model="tag.location_str">
                              <el-button slot="append" style="color:#4DB3FF" @click="preDeleteLocation(index,1)">删除</el-button>
                            </el-input>
                            <el-cascader v-show="old_book.show" style="margin:5px 0;" placeholder="二手书货架位" filterable :options="old_book.locations" v-model="old_book.location" @change="confirmAddOldLocation"></el-cascader>
                            <el-button v-show="!old_book.show" style="margin:5px 0;" @click="preAddLocation(1)">+ 新增货架位</el-button>
                        </div>
                    </el-col>
                    <el-col style="width: 220px; margin-right: 10px;">
                        <div class="tag_area">
                            <el-input :readonly="true" v-for="(tag,index) in new_book.locations_strs" style="margin:5px 0;" v-model="tag.location_str">
                              <el-button slot="append" style="color:#4DB3FF" @click="preDeleteLocation(index,0)">删除</el-button>
                            </el-input>
                            <el-cascader v-show="new_book.show" style="margin:5px 0;" placeholder="新书货架位" filterable :options="new_book.locations" v-model="new_book.location" @change="confirmAddNewLocation"></el-cascader>
                            <el-button v-show="!new_book.show" style="margin:5px 0;" @click="preAddLocation(0)">+ 新增货架位</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item style="text-align:left;margin-top:20px;">
              <el-button @click="book_info_show=false">取 消</el-button>
              <el-button type="primary" @click="confirmEdit">确 定</el-button>
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
    priceInt,
    isObjectValueEqual
} from '../../scripts/utils'
import {
    handleLocation,
    checkLocation,
    getLocationLabel,
    handleGoodsLocation
} from './utils'
import axios from "../../scripts/http"
import {
    getToken
} from "../../scripts/token"
export default {
    data() {
        return {
            isbn: '',
            title: '',
            publisher: '',
            author: '',
            search_type: -100,
            search_amount: '0',
            search_picture: -100,
            page: 1,
            size: 10,

            tableData: [],

            locations: [],
            goods_id: '',
            deleteDialog: {
                show: false,
                title: '',
                has_new_book: false,
                has_old_book: false,
                checkList: []
            },
            loading: false,
            store_id: '',
            book_info_show: false,
            book_info_bak: {},
            book_info: {},
            rules: {
                isbn: [{
                    required: true,
                    message: '请填写ISBN',
                    trigger: 'blur'
                }],
                title: [{
                    required: true,
                    message: '请填写书名',
                    trigger: 'blur'
                }],
                publisher: [{
                    required: true,
                    message: '请填写出版社名称',
                    trigger: 'blur'
                }],
                author: [{
                    required: true,
                    message: '请填写作者名称',
                    trigger: 'blur'
                }],
                price: [{
                    required: true,
                    message: '请填写图书原价',
                    trigger: 'blur'
                }]
            },
            //二手书
            old_book: {
                show: false,
                location: [],
                price: '',
                amount: '',
                stock: 0,
                discount: '',
                locations_strs: [],
                locations: [],
                location: []
            },
            //新书
            new_book: {
                show: false,
                location: [],
                price: '',
                amount: '',
                stock: 0,
                discount: '',
                locations_strs: [],
                locations: [],
                location: []
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },
            categories: []
        }
    },
    created() {
        this.getLocations()
    },
    mounted() {
        this.getData()
    },
    computed: {
        old_book_discount() {
            var discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
            this.old_book.discount = discount
            return discount
        },
        old_book_price() {
            var price = priceFloat(this.book_info.price * this.old_book.discount * 10)
            this.old_book.price = price
            return price
        }
    },
    methods: {
        getLocations() {
            axios.post('/v1/location/list_children_location', {
                "level": 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.locations = handleLocation(resp.data.data)
                }
            })
        },
        getData() {
            var self = this
            self.loading = true
            axios.post("/v1/goods/search", {
                "isbn": self.isbn, //not required 书本的isbn
                "title": self.title, //not required
                "search_type": self.search_type, //required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
                "search_amount": parseInt(self.search_amount), //required 0全部 1无货 2有货
                "search_picture": self.search_picture, //required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
                "page": self.page, //not required 页数
                "size": self.size, //not required 一页显示的数据条数，默认20
                "author": self.author, //not required 作者搜索模糊搜索
                "publisher": self.author //not required 出版社模糊搜索
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    self.tableData = data.map(item => {
                        item.book.image = item.book.image
                        item.book.price = priceFloat(item.book.price)
                        item.update_at = moment(item.update_at * 1000).format('YYYY-MM-DD H:mm')
                        if (item.new_book) {
                            item.has_new_book = true
                            item.new_book.price = priceFloat(item.new_book.price)
                            if (item.new_book.location.length > 0) {
                                item.new_book.location = handleGoodsLocation(self.locations,item.new_book.location)
                            } else {
                                item.new_book.location = []
                            }
                        }
                        if (item.old_book) {
                            item.has_old_book = true
                            item.old_book.price = priceFloat(item.old_book.price)
                            if (item.old_book.location.length > 0) {
                                item.old_book.location = handleGoodsLocation(self.locations,item.old_book.location)
                            } else {
                                item.old_book.location = []
                            }
                        }
                        return item
                    })
                    console.log(self.tableData);
                }
                self.loading = false
            })
        },
        handleSizeChange(size) {
            this.size = size
            this.getData()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getData()
        },
        proDelete(index) {
            var data = this.tableData[index]
            var deleteDialog = {
                show: true,
                title: data.book.title,
                has_new_book: data.has_new_book,
                has_old_book: data.has_old_book,
                checkList: []
            }
            if (data.has_new_book) {
                this.goods_id = data.new_book.goods_id
            } else {
                this.goods_id = data.old_book.goods_id
            }
            console.log(deleteDialog);
            this.deleteDialog = deleteDialog
        },
        comfirmDelete() {
            var data = []
            var deleteData = this.deleteDialog
            deleteData.checkList.forEach(ch => {
                data.push({
                    "id": this.goods_id, //商品id
                    "new_or_old": parseInt(ch), //新书还是旧书 0：新书 1：旧书
                    "operate_type": 1 //操作类型 0：下架 1：删除
                })
            })
            console.log(data);
            axios.post('/v1/goods/del_or_remove_goods', {
                data
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('删除成功')
                }
                this.deleteDialog.show = false
                this.getData()
            })
        },
        preEdit(index) {
            var data = this.tableData[index]
            this.book_info_bak = JSON.parse(JSON.stringify(data.book))
            this.book_info = JSON.parse(JSON.stringify(data.book))
            this.goods_id = data.goods_id
            if (data.has_new_book) {
                this.new_book.stock = data.new_book.amount
                this.new_book.amount = data.new_book.amount
                this.new_book.price = data.new_book.price
                this.new_book.discount = parseFloat(this.new_book.price / this.book_info.price * 10).toFixed(1)
                this.new_book.locations_strs = data.new_book.location
            }
            if (data.has_old_book) {
                this.old_book.stock = data.old_book.amount
                this.old_book.amount = data.old_book.amount
                this.old_book.price = data.old_book.price
                this.old_book.discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
                this.old_book.locations_strs = data.old_book.location
            }
            this.book_info_show = true
        },
        confirmEdit() {
            if (isObjectValueEqual(this.book_info_bak, this.book_info)) {
                this.updataGoodsInfo()
            } else {
                axios.post('/v1/books/modify_book_info', {
                    "id":this.book_info.id,
                    "isbn":this.book_info.isbn,
                    "title":this.book_info.title,
                    "publisher":this.book_info.publisher,
                    "author":this.book_info.author,
                    "price":priceInt(this.book_info.price),
                    "image":this.book_info.image
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        this.book_info.id = resp.data.data.id
                        this.updataGoodsInfo()
                    }
                })
            }
        },
        updataGoodsInfo() {
            var data = {
                "id": this.goods_id, //required
                "isbn": this.book_info.isbn, //not required
                "new_book_price": this.new_book.price ? priceInt(this.new_book.price) : -100, //not required  -100 表示改成0
                "new_book_amount": this.new_book.amount ? this.new_book.amount : -100, //not required  -100 表示改成0
                "old_book_price": this.old_book.price ? priceInt(this.old_book.price) : -100, //not required  -100 表示改成0
                "old_book_amount": this.old_book.amount ? this.old_book.amount : -100, //not required  -100 表示改成0
                "sales_status": -100, //not required  -100 改成销售中 1 改成停止销售
                "book_id": this.book_info.id
            }
            console.log(data);
            axios.post('/v1/goods/update', data).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('修改成功！')
                    this.getData()
                    this.book_info_show = false
                }
            })
        },
        preDeleteLocation(index, type) {
            this.$confirm('此操作将删除该位置, 是否继续?', '提示', {
                confirmButtonText: '继续删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (type == 0) {
                    this.confirmDeleteLocation(index, type)
                } else {
                    this.confirmDeleteLocation(index, type)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        confirmDeleteLocation(index, type) {
            var data = {}
            if (type == 0) {
                data = this.new_book.locations_strs[index]
            } else {
                data = this.old_book.locations_strs[index]
            }
            axios.post('/v1/goods/goods_location_operate', {
                "id": data.id,
                "goods_id": this.goods_id, //商品id
                "storehouse_id": data.storehouse_id, //仓库id
                "shelf_id": data.shelf_id, //货架id
                "floor_id": data.floor_id, //货架层id
                "operate_type": 1, //操作类型	0:更新货架 1:删除货架 2:增加货架
                "type": type //图书类型 0:新书 1 旧书
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    if (type == 0) {
                        this.new_book.locations_strs.splice(index, 1)
                    } else {
                        this.old_book.locations_strs.splice(index, 1)
                    }
                    this.$message.success('删除成功！')
                }
            })
        },
        preAddLocation(type) {
            if (type == 0) {
                this.new_book.show = true
                this.new_book.locations = this.locations
            } else {
                this.old_book.show = true
                this.old_book.locations = this.locations
            }
        },
        confirmAddOldLocation(val) {
            this.addLocation(val, 1)
        },
        confirmAddNewLocation(val) {
            this.addLocation(val, 0)
        },
        addLocation(val, type) {
            if (val.length < 3) {
                this.$message.warning('请选择货架层！')
                return
            }
            var locations = []
            if (type == 0) {
                locations = this.new_book.locations_strs
            } else {
                locations = this.old_book.locations_strs
            }
            var floor_id = val[2]
            if (checkLocation(locations, floor_id)) {
                this.$message.warning('这个位置已经存在，请重新选择！')
                return
            }
            axios.post('/v1/goods/goods_location_operate', {
                "goods_id": this.goods_id, //商品id
                "storehouse_id": val[0], //仓库id
                "shelf_id": val[1], //货架id
                "floor_id": val[2], //货架层id
                "operate_type": 2, //操作类型	0:更新货架 1:删除货架 2:增加货架
                "type": type //图书类型 0:新书 1 旧书
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var temp_location = {
                        "id": resp.data.data.id,	//货架id
                        "storehouse_id": val[0], //仓库id
                        "shelf_id": val[1], //货架id
                        "floor_id": val[2],
                        "location_str": getLocationLabel(this.locations, val)
                    }
                    console.log('>>>>>----- id ----->');
                    console.log(temp_location);
                    if (type == 0) {
                        this.new_book.locations_strs.push(temp_location)
                        this.new_book.show = false
                    } else {
                        this.old_book.locations_strs.push(temp_location)
                        this.old_book.show = false
                    }
                    this.$message.success('添加成功！')
                }
            })
        },
        reset(formName) {
            this.$refs[formName].resetFields();
            //二手书
            this.old_book = {
                show: false,
                location: [],
                price: '',
                amount: '',
                discount: '',
                locations: []
            }
            //新书
            this.new_book = {
                show: false,
                location: [],
                price: '',
                amount: '',
                discount: '',
                locations: []
            }
        },
        inputDiscount(type) {
            if (type) {
                if (this.old_book.discount < 0) {
                    this.old_book.discount = 0
                }
                this.old_book.price = priceFloat(this.book_info.price * this.old_book.discount * 10)
            } else {
                if (this.new_book.discount < 0) {
                    this.new_book.discount = 0
                }
                this.new_book.price = priceFloat(this.book_info.price * this.new_book.discount * 10)
            }
        },
        inputPrice(type) {
            if (type) {
                if (this.old_book.price < 0) {
                    this.old_book.price = 0
                }
                this.old_book.discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
            } else {
                if (this.new_book.price < 0) {
                    this.new_book.price = 0
                }
                this.new_book.discount = parseFloat(this.new_book.price / this.book_info.price * 10).toFixed(1)
            }
        },
        inputAmount(type) {
            if (type) {
                if (this.old_book.amount < 0) {
                    this.old_book.amount = 0
                }
            } else {
                if (this.new_book.amount < 0) {
                    this.new_book.amount = 0
                }
            }
        },
        blurDiscount(type) {
            if (type) {
                this.old_book.discount = parseFloat(this.old_book.discount).toFixed(1)
                this.old_book.price = priceFloat(this.book_info.price * this.old_book.discount * 10)
            } else {
                this.new_book.discount = parseFloat(this.new_book.discount).toFixed(1)
                this.new_book.price = priceFloat(this.book_info.price * this.new_book.discount * 10)
            }
        },
        blurPrice(type) {
            if (type) {
                this.old_book.price = parseFloat(this.old_book.price).toFixed(2)
                this.old_book.discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
            } else {
                this.new_book.price = parseFloat(this.new_book.price).toFixed(2)
                this.new_book.discount = parseFloat(this.new_book.price / this.book_info.price * 10).toFixed(1)
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file, fileList) {
            this.book_info.image = this.imagesFormData.key
            this.getToken()
        },
        handleAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken()
        },
        getToken() {
            let key = 'store_' + this.store_id + '/book_' + this.book_info.isbn + '.png'
            //获取token
            axios.post('/v1/mediastore/get_upload_token', {
                zone: 0,
                key
            }).then(resp => {
                this.imagesFormData.key = key
                this.imagesFormData.token = resp.data.data.token
                return true
            }).catch(() => {
                return false
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.imageare {
    text-align: center;
    img {
        margin-top: 5px;
        width: 60px;
        height: 80px;
    }
}
.goods_item {
    height: 40px;
    line-height: 40px;
    text-align: center;
}
.ellipsis {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.new_color {
    color: #3A8AFF;
}
.old_color {
    color: #1AAD19;
}
.el-input {
    width: 140px;
}
.pagination {
    margin-top: 12px;
}
.body {
    margin: 8px;
    padding: 16px;
    background-color: #FFFFFF;
    position: relative;
    .avatar-uploader,
    .el-upload {
        border: 1px dashed #bfcbd9;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        position: absolute;
        left: 340px;
        width: 200px;
        height: 266px;
        z-index: 2;
        &:hover {
            border-color: #20a0ff;
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 266px;
        line-height: 266px;
        text-align: center;
    }
    .avatar {
        width: 200px;
        height: 266px;
        display: block;
    }
    .el-form {
        .el-cascader,
        .el-input {
            width: 220px;
            margin-right: 6px;
        }
    }
    .tag_area {
        display: flex;
        flex-direction: column;
    }
}
</style>
