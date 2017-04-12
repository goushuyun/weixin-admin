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
    .el-cascader,
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
      <el-form ref="ruleForm" :model="book_info" :rules="rules" label-width="80px">
          <el-form-item label="ISBN" prop="isbn">
              <el-input id="isbn" :autofocus="true" v-model.trim="book_info.isbn" v-on:keyup.enter.native="search">
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
              <el-input type="number" v-model="book_info.price"></el-input>
          </el-form-item>
          <el-form-item label="类 型">
              <td style="width:260px;text-align:center;color: #1AAD19;margin-right:10px;">二手书</td>
              <td style="width:260px;text-align:center;color: #3A8AFF;">新书</td>
          </el-form-item>
          <el-form-item label="折 扣">
              <el-input type="number" placeholder="二手书折扣"><template slot="append" v-model="old_book.discount">折</template></el-input>
              <el-input type="number" placeholder="新书折扣"><template slot="append" v-model="new_book.discount">折</template></el-input>
          </el-form-item>
          <el-form-item label="价 格">
              <el-input type="number" placeholder="二手书价格"><template slot="append" v-model="old_book.price">元</template></el-input>
              <el-input type="number" placeholder="新书价格"><template slot="append" v-model="new_book.price">元</template></el-input>
          </el-form-item>
          <el-form-item label="数 量">
              <el-input type="number" placeholder="二手书数量"><template slot="append" v-model="old_book.amount">本</template></el-input>
              <el-input type="number" placeholder="新书数量"><template slot="append" v-model="new_book.amount">本</template></el-input>
          </el-form-item>
          <el-form-item label="位 置">
              <el-cascader placeholder="二手书货架位" expand-trigger="hover" filterable :options="locations" v-model="old_book.location" @change="getLocations"></el-cascader>
              <el-cascader placeholder="新书货架位" expand-trigger="hover" filterable :options="locations" v-model="new_book.location" @change="getLocations"></el-cascader>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="addBook">上架销售</el-button>
              <el-button>重置</el-button>
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
    priceInt
} from "../../scripts/utils"
export default {
    data() {
        return {
            store_id: '',
            book_info: {
                id: '',
                isbn: '',
                title: '',
                publisher: '',
                author: '',
                image: '',
                price: 0
            },
            //二手书
            old_book: {
                location: [],
                discount: 0,
                price: 0,
                amount: 0
            },
            //新书
            new_book: {
              location: [],
              discount: 0,
              price: 0,
              amount: 0
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },

            locations: [{
                value: 'all',
                label: '-->展开全部位置<--'
            }]
        };
    },
    mounted() {
        $('#isbn input').focus()
        var store = this.$store.state.current_store
        this.store_id = store.id
    },
    methods: {
        search() {
            if (!isISBNFormat(this.book_info.isbn)) {
                this.$message.warning('ISBN 码格式不正确！')
                return
            }
            this.loading_text = '正在搜索'
            this.loading = true
            axios.post('/v1/books/get_book_info_by_isbn', {
                // "isbn": "9787115249494"
                "isbn": this.book_info.isbn
            }).then(resp => {
                console.log(resp.data.message);
                if (resp.data.message == 'ok') {
                    console.log(resp.data.data);
                    var data = resp.data.data
                    this.book_info = {
                        id: data.id,
                        isbn: data.isbn,
                        title: data.title,
                        publisher: data.publisher,
                        author: data.author,
                        image: data.image,
                        price: priceFloat(data.price)
                    }
                    this.getGoodsInfo()
                    this.loading = false
                }
            })
        },
        getGoodsInfo() {
            axios.post('/v1/goods/search', {
                "isbn": this.book_info.isbn,
                "search_amount": "-100",
                "search_type": "-100",
                "search_picture": "-100"
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data[0]

                    console.log(resp.data.data);
                }
            })
        },
        getLocations(val) {
            if (val[0] != 'all') {
                return
            }
            axios.post('/v1/location/list_children_location', {
                "level": 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    console.log(resp.data.data);
                    this.locations = this.handleLocation(resp.data.data)
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
            this.ruleForm.image = this.imagesFormData.key
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
        addBook() {
            if (this.new_book.amount == 0 && this.old_book.amount == 0) {
                this.$message.warning('请输入图书数量')
                return
            }
            var data = {
                "book_id": this.book_info.id, //标准图书id编号
                "isbn": this.book_info.isbn, //图书isbn
                "location": []
            }
            if (this.new_book.amount) {
                var new_book = {
                    "type": "0", //0 代表新书 1 旧书
                    "storehouse_id": this.new_book.location[0], //仓库id
                    "shelf_id": this.new_book.location[1], //货架id
                    "floor_id": this.new_book.location[2], //货架层id
                    "amount": this.book_info.amount, //上传的书的数量
                    "price": priceInt(this.book_info.price) //上传的书的价格 以分为单位 1元=100分
                }
                data.location.push(new_book)
            }
            if (this.old_book.amount) {
                var old_book = {
                    "type": "1",
                    "storehouse_id": this.old_book.location[0],
                    "shelf_id": this.old_book.location[1],
                    "floor_id": this.old_book.location[2],
                    "amount": this.book_info.amount,
                    "price": priceInt(this.book_info.price)
                }
                data.location.push(old_book)
            }
            axios.post('/v1/goods/add', data).then(resp => {
                if (resp.data.message == 'ok') {
                    this.locations1 = resp.data.data
                    console.log(resp.data.data);
                }
            })
        }
    }
}
</script>
