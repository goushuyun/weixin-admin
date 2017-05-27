<style lang="scss" scoped>
.body {
    margin: 8px;
    padding: 16px;
    background-color: #FFFFFF;
    position: relative;
}
.avatar-uploader,
.el-upload {
    border: 1px dashed #bfcbd9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    position: absolute;
    left: 420px;
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
    .el-cascader {
        width: 260px;
        margin-right: 10px;
        .el-cascader-menus  {
            width: 260px !important;
            // margin-right: 10px;
        }
    }
    .el-input {
        width: 260px;
        margin-right: 10px;
    }
}
</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">图书上架</h2>
    </div>

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
      <el-form ref="book_info" :model="book_info" :rules="rules" label-width="80px">
          <el-form-item label="ISBN" prop="isbn">
              <el-input id="isbn" :autofocus="true" :maxlength="13" v-model.trim="book_info.isbn" v-on:keyup.enter.native="search">
                  <el-button slot="append" icon="search" @click="search"></el-button>
              </el-input>
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
              <el-input min="0" type="number" v-model="book_info.price" @input="inputBook"></el-input>
          </el-form-item>
          <el-form-item label="类 型">
              <td style="width:260px;text-align:center;color: #1AAD19;margin-right:10px;">二手书</td>
              <td style="width:260px;text-align:center;color: #3A8AFF;">新书</td>
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
              <el-input type="number" min="0" placeholder="新增二手书数量" v-model="old_book.amount" @input="inputAmount(1)"><template slot="append">当前库存 <span style="color:#1AAD19;font-size:16px">{{old_book.stock}}</span> 本</template></el-input>
              <el-input type="number" min="0" placeholder="新增新书数量" v-model="new_book.amount" @input="inputAmount(0)"><template slot="append">当前库存 <span style="color:#3A8AFF;font-size:16px">{{new_book.stock}}</span> 本</template></el-input>
          </el-form-item>
          <el-form-item label="位 置">
              <el-cascader placeholder="二手书货架位" filterable :options="old_book.locations" v-model="old_book.location" @change="handleChange"></el-cascader>
              <el-cascader placeholder="新书货架位" filterable :options="new_book.locations" v-model="new_book.location" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="addBook('book_info')">上架销售</el-button>
              <el-button @click="reset('book_info','opt')">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
</div>

</template>

<script>
import axios from "../../scripts/http"
import {
    isISBNFormat,
    priceFloat,
    priceInt,
    isObjectValueEqual
} from "../../scripts/utils"
export default {
    data() {
        return {
            loading: false,
            store_id: '',
            book_info: {
                id: '',
                isbn: '',
                title: '',
                publisher: '',
                author: '',
                image: '',
                price: ''
            },
            book_info_bak: {},
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
                location: [],
                price: '',
                amount: '',
                stock: 0,
                discount: '',
                locations: []
            },
            //新书
            new_book: {
                location: [],
                price: '',
                amount: '',
                stock: 0,
                discount: '',
                locations: []
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },

            locations: []
        };
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
    mounted() {
        $('#isbn input').focus()
        var store = this.$store.state.current_store
        this.store_id = store.id
        this.getLocations()
    },
    methods: {
        inputBook() {
            this.inputDiscount(0)
            this.inputDiscount(1)
        },
        inputDiscount(type) {
            console.log('000000000000000000000000');
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
        reset(formName,opt) {
            this.$refs[formName].resetFields();
            this.book_info.image = ''
            //二手书
            this.old_book.price = ''
            this.old_book.amount = ''
            this.old_book.stock = 0
            this.old_book.locations = this.locations

            //新书
            this.new_book.price = ''
            this.new_book.amount = ''
            this.new_book.stock = 0
            this.new_book.locations = this.locations
            if (opt) {
                this.old_book.discount = ''
                this.new_book.discount = ''
                this.old_book.location = []
                this.new_book.location = []
            }
            $('#isbn input').focus()
        },
        search() {
            if (!isISBNFormat(this.book_info.isbn)) {
                this.$message.warning('ISBN 码格式不正确！')
                return
            }
            this.loading = true
            axios.post('/v1/books/get_book_info_by_isbn', {
                "isbn": this.book_info.isbn
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    var book = {
                        id: data.id,
                        isbn: data.isbn,
                        title: data.title,
                        publisher: data.publisher,
                        author: data.author,
                        image: data.image,
                        price: priceFloat(data.price)
                    }
                    this.book_info_bak = JSON.parse(JSON.stringify(book))
                    this.book_info = JSON.parse(JSON.stringify(book))
                    this.getGoodsInfo()
                    this.loading = false
                }
            })
        },
        getGoodsInfo() {
            axios.post('/v1/goods/search', {
                "isbn": this.book_info.isbn,
                "search_amount": "0",
                "search_type": "-100",
                "search_picture": "-100"
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    if (resp.data.data.length > 0) {
                        var data = resp.data.data[0]
                        if (data.new_book) {
                            console.log('>>>>>----- have new_book ----->');
                            this.new_book.stock = data.new_book.amount
                            this.new_book.price = priceFloat(data.new_book.price)
                            this.new_book.discount = parseFloat(this.new_book.price / this.book_info.price * 10).toFixed(1)
                            if (data.new_book.location.length > 0) {
                                this.handleGoodsLocations(data.new_book.location, 0)
                            }
                        }
                        if (data.old_book) {
                            console.log('>>>>>----- have old_book ----->');
                            this.old_book.stock = data.old_book.amount
                            this.old_book.price = priceFloat(data.old_book.price)
                            this.old_book.discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
                            if (data.old_book.location.length > 0) {
                                this.handleGoodsLocations(data.old_book.location, 1)
                            }
                        }
                    }
                }
            })
        },
        handleGoodsLocations(locations, type) {
            var book_location = locations[0]
            var stores = this.locations
            var temp_locations = new Array()
            var store
            //遍历stores
            for (var i = 0; i < stores.length; i++) {
                store = stores[i]
                //遍历shelfs
                var shelfs = store.children
                if (shelfs == undefined) {
                    continue
                }
                for (var j = 0; j < shelfs.length; j++) {
                    var shelf = shelfs[j]
                    //遍历 floors
                    var floors = shelf.children
                    if (floors == undefined) {
                        continue
                    }
                    for (var k = 0; k < floors.length; k++) {
                        var floor = floors[k]
                        for (var m = 0; m < locations.length; m++) {
                            if (locations[m].floor_id == floor.value) {
                                if (store.value == undefined || shelf.value == undefined || floor.value == undefined) {
                                    continue
                                }
                                var temp1 = new Object();
                                var temp2 = new Object();
                                var temp3 = new Object();
                                temp1.value = store.value;
                                temp1.label = store.label;
                                temp1.children = new Array();
                                temp2.value = shelf.value;
                                temp2.label = shelf.label;
                                temp2.children = new Array();
                                temp3.value = floor.value;
                                temp3.label = floor.label;
                                temp2.children.push(temp3);
                                temp1.children.push(temp2);
                                this.insertLocations(temp_locations, temp1)
                            }
                        }
                    }
                }
            }
            if (type == 0) {
                var temp = {
                    value: 'new_all',
                    label: '-->展开全部位置<--'
                }
                temp_locations.push(temp)
                this.new_book.locations = temp_locations
                var new_book_location_bak = []
                new_book_location_bak = this.new_book.location //备份新书货架位
                this.new_book.location = [book_location.storehouse_id, book_location.shelf_id, book_location.floor_id]
                if(new_book_location_bak.length > 0 && !isObjectValueEqual(new_book_location_bak,this.new_book.location)) {
                    this.$notify.warning({
                      title: '新书货架位已被更改',
                      message: '新书货架位已被更改为原来的货架位',
                      duration: 10000
                    });
                }
            }
            if (type == 1) {
                var temp = {
                    value: 'old_all',
                    label: '-->展开全部位置<--'
                }
                temp_locations.push(temp)
                this.old_book.locations = temp_locations
                var old_book_location_bak = []
                old_book_location_bak = this.old_book.location //备份旧书货架位
                this.old_book.location = [book_location.storehouse_id, book_location.shelf_id, book_location.floor_id]
                if(old_book_location_bak.length > 0 && !isObjectValueEqual(old_book_location_bak,this.old_book.location)) {
                    var self = this
                    setTimeout(() => {
                        self.$notify.warning({
                          title: '旧书货架位已被更改',
                          message: '旧书货架位已被更改为原来的货架位',
                          duration: 10000
                        });
                    },100)
                }
            }
        },
        insertLocations(locations, location) {
            for (var i = 0; i < locations.length; i++) {
                var store = locations[i]
                if (store.value == location.value) {
                    for (var m = 0; m < store.children.length; m++) {
                        var shelf = store.children[m]
                        if (shelf.value == location.children[0].value) {
                            shelf.children.push(location.children[0].children[0])
                            return locations
                        }
                    }
                    console.log("====================================");
                    console.log(store);
                    console.log(location);
                    console.log("====================================");
                    store.children.push(location.children[0])
                    return locations
                }
            }
            locations.push(location)
            return locations
        },
        handleChange(val) {
            if (val[0] == 'old_all') {
                this.old_book.locations = this.locations
            }
            if (val[0] == 'new_all') {
                this.new_book.locations = this.locations
            }
        },
        getLocations() {
            axios.post('/v1/location/list_children_location', {
                "level": 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var locations = this.handleLocation(resp.data.data)
                    if (locations.length == 0) {
                        this.$alert('请移步“仓库设置”添加仓库和货架位', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({
                                    name: 'location',
                                    params: {
                                        activeName: 'location'
                                    }
                                })
                            }
                        });
                    }
                    this.locations = locations
                    this.old_book.locations = this.locations
                    this.new_book.locations = this.locations
                }
            })
        },
        handleLocation(locations) {
            locations.forEach(d => {
                d.value = d.id
                d.label = d.name
                if (d.children.length > 0) {
                    d.children.forEach(s => {
                        s.value = s.id
                        s.label = s.name
                        if (s.children.length > 0) {
                            s.children.forEach(f => {
                                f.value = f.id
                                f.label = f.name
                                delete f.children
                                return f
                            })
                        } else {
                            delete s.children
                        }
                        return s
                    })
                } else {
                    delete d.children
                }
                return d
            })
            return locations
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
        },
        addBook(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!parseInt(this.new_book.amount) && !parseInt(this.old_book.amount)) {
                        this.$message.warning('请输入图书数量')
                        return
                    }
                    var data = {
                        "book_id": this.book_info.id, //标准图书id编号
                        "isbn": this.book_info.isbn, //图书isbn
                        "location": []
                    }
                    if (this.new_book.amount) {
                        if (!this.new_book.price) {
                            this.$message.warning('请填写新书价格')
                            return
                        }
                        if (this.new_book.location.length < 3) {
                            this.$message.warning('请选择新书货架层')
                            return
                        }
                        var new_book = {
                            "type": "0", //0 代表新书 1 旧书
                            "storehouse_id": this.new_book.location[0], //仓库id
                            "shelf_id": this.new_book.location[1], //货架id
                            "floor_id": this.new_book.location[2], //货架层id
                            "amount": this.new_book.amount, //上传的书的数量
                            "price": priceInt(this.new_book.price) //上传的书的价格 以分为单位 1元=100分
                        }
                        data.location.push(new_book)
                    }
                    if (this.old_book.amount) {
                        if (!this.old_book.price) {
                            this.$message.warning('请填写二手书价格')
                            return
                        }
                        if (this.old_book.location.length < 3) {
                            this.$message.warning('请选择二手书货架层')
                            return
                        }
                        var old_book = {
                            "type": "1",
                            "storehouse_id": this.old_book.location[0],
                            "shelf_id": this.old_book.location[1],
                            "floor_id": this.old_book.location[2],
                            "amount": this.old_book.amount,
                            "price": priceInt(this.old_book.price)
                        }
                        data.location.push(old_book)
                    }
                    if (isObjectValueEqual(this.book_info_bak, this.book_info)) {
                        this.confirmAddBook(data)
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
                                data.book_id = resp.data.data.id
                                this.confirmAddBook(data)
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        confirmAddBook(data) {
            axios.post('/v1/goods/add', data).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('图书上架成功')
                    this.reset('book_info')
                    console.log('>>>>>----- success ----->');
                }
            })
        }
    }
}
</script>
