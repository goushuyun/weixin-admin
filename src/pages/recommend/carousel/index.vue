<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">轮播图</h2>
    </div>
    <div class="content_inner">
      <el-alert
      title="点击图片可修改轮播图"
      description="1.仅支持 jpg、jpeg、png 格式的图片；2.图片尺寸 375 px X 180 px；3.图片大小不能超过2M"
      type="info" :closable="false" show-icon></el-alert>
      <div v-for="(item,index) in circulars" class="row_area">
          <el-row v-loading="item.loading" element-loading-text="正在检索图书">
            <el-col style="width:400px;">
              <div style="width:360px;" @click.stop="getIndex(index)">
                <el-upload
                  action="http://upload.qiniu.com/"
                  :data="imagesFormData"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarError"
                  >
                  <img v-if="item.image" :src="item.image" class="avatar">
                  <i v-if="!item.image" class="el-icon-upload"></i>
                  <div v-if="!item.image" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="12">
              <el-radio-group v-model="item.type" @change="radioChange(index * TEN + item.type)">
                <el-row class="radio_area">
                  <el-col :span="24"><el-radio :label="1">轮播图不可点击</el-radio></el-col>
                </el-row>
                <el-row class="radio_area">
                  <el-col :span="24">
                    <el-radio :label="2">点击轮播图跳转到某本书</el-radio>
                    <el-button type="text" v-if="!item.isbn_flag && item.type == 2" style="margin:0 20px">{{item.isbn}}</el-button>
                    <el-input v-if="item.isbn_flag && item.type == 2" style="margin:0 20px" :id="'num_' + index" v-model="item.update_isbn" size="small" :maxlength="13" placeholder="请输入13位ISBN"></el-input>
                    <el-button v-if="!item.isbn_flag && item.type == 2" type="text" @click="proUpdateIsbn(index)">{{item.isbn?'修改':'添加'}}</el-button>
                    <el-button v-if="item.isbn_flag && item.type == 2" type="text" @click="confirmUpdateIsbn(index)">确定</el-button>
                    <el-button v-if="item.isbn_flag && item.type == 2" type="text" style="color:#13CE66" @click="cancelUpdate(index)">取消</el-button>
                  </el-col>
                </el-row>
                <el-row class="radio_area">
                  <el-col :span="24">
                    <el-radio :label="3">点击轮播图跳转到某个话题</el-radio>
                    <el-button type="text" v-if="!item.topic_flag && item.type == 3" style="margin:0 20px">{{item.topic}}</el-button>
                    <el-select v-if="item.topic_flag && item.type == 3" style="margin:0 20px" v-model="item.source_id" size="small" placeholder="请选择">
                      <el-option v-for="topic in item.topics" :label="topic.title" :value="topic.id"></el-option>
                    </el-select>
                    <el-button v-if="!item.topic_flag && item.type == 3" type="text" @click="proUpdateTopic(index)">{{item.topic?'修改':'添加'}}</el-button>
                    <el-button v-if="item.topic_flag && item.type == 3" type="text" @click="confirmUpdateTopic(index)">确定</el-button>
                    <el-button v-if="item.topic_flag && item.type == 3" type="text" style="color:#13CE66" @click="cancelUpdate(index)">取消</el-button>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            TEN: 10, // 通过参数的十位上的数获取该index
            circulars: [],
            circulars_bak: [],

            topics: [],

            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: '',
                index: 0
            }
        };
    },
    mounted() {
        this.getTopics()
    },
    methods: {
        getTopics() {
            axios.post('/v1/topic/topics_info',{}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.topics = data
                    this.getCarousels(data)
                }
            })
        },
        radioChange(val) {
            var index = parseInt(val / this.TEN)
            var type = parseInt(val % this.TEN)
            // 备份数据的 type 只在 确认修改 源 type 后修改，该判断防止 发送不必要的修改请求
            if (this.circulars_bak[index].type != type) {
                if (type == 1) {
                  this.updateCircular(index)
                }
                if (type == 2) {
                  this.proUpdateIsbn(index)
                }
                if (type == 3) {
                  this.proUpdateTopic(index)
                }
            }
        },
        // 点击取消按钮
        cancelUpdate(index) {
            this.circulars[index].isbn_flag = false
            this.circulars[index].topic_flag = false
            this.circulars[index].type = this.circulars_bak[index].type
        },
        // 加载页面是获取并处理数据
        getCarousels(topics) {
            axios.post('/v1/circular/list', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.circulars = resp.data.data.map(el => {
                        el.loading = false
                        el.isbn_flag = false
                        el.isbn = ''
                        el.update_isbn = ''
                        el.topic_flag = false
                        el.topic = ''
                        el.source_id = ''
                        el.topics = topics
                        return el
                    })
                    this.checkType()
                    // 在此第一次获取token，因为可以取到store_id
                    this.getToken()
                    // 备份数据
                    this.circulars_bak = JSON.parse(JSON.stringify(this.circulars))
                }
            })
        },

        // 处理 type 为 2 或者 3 时的数据
        checkType() {
            var data = this.circulars
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 2) {
                    this.getGoodsIsbn(i)
                } else if (data[i].type == 3) {
                    this.getTopicTitle(i)
                }
            }
        },
        // type 为 2 时，用 goods_id 获取 isbn，用于展示
        getGoodsIsbn(index) {
            var id = this.circulars[index].source_id
            axios.post('/v1/goods/search',{id}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.circulars[index].isbn = resp.data.data[0].book.isbn
                }
            })
        },
        // type 为 3 时，用 topic_id 获取 title，用于展示
        getTopicTitle(index) {
            var id = this.circulars[index].source_id
            axios.post('/v1/topic/topics_info',{id}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.circulars[index].topic = resp.data.data[0].title
                }
            })
        },

        // 准备修改 type 为 2
        proUpdateIsbn(index) {
            this.circulars[index].update_isbn = this.circulars[index].isbn
            this.circulars[index].isbn_flag = true
            this.$nextTick(function() {
                $('#num_' + index + ' input').focus()
            })
        },
        // 点击 “确认” 修改 type 为 2
        confirmUpdateIsbn(index) {
            var isbn = this.circulars[index].update_isbn
            if (!isbn || isbn.length != 13) {
                this.$message.warning('请输入13位ISBN！')
                return
            }
            this.circulars[index].loading = true
            // 检查 isbn 是否有效
            axios.post('/v1/goods/search',{
                "isbn": isbn,
                "search_amount": 0,		//required 0 全部，1 库存小于等于0的书， 2 库存大于0的书
                "search_type": -100,		//required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
                "search_picture": -100,	//required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    if (resp.data.data.length > 0) {
                        this.circulars[index].source_id = resp.data.data[0].goods_id
                        this.updateCircular(index)
                    } else {
                        this.$message.warning('没找到这本书！')
                        this.circulars[index].loading = false
                        this.$nextTick(function() {
                            $('#num_' + index + ' input').focus()
                        })
                        return
                    }
                }
            })
        },

        // 准备修改 type 为 3
        proUpdateTopic(index) {
            this.circulars[index].topic_flag = true
            this.circulars[index].source_id = ''
        },
        // 点击 “确认” 修改 type 为 3
        confirmUpdateTopic(index) {
            if (!this.circulars[index].source_id) {
                this.$message.warning('请选择话题！')
                return
            }
            this.circulars[index].loading = true
            this.updateCircular(index)
        },

        // 修改 type 的请求
        updateCircular(index) {
            var data = this.circulars[index]
            axios.post('/v1/circular/update',data).then(resp => {
                this.circulars[index].loading = false
                if (resp.data.message == 'ok') {
                    if (data.type == 2) {
                        this.circulars[index].isbn = this.circulars[index].update_isbn
                        this.circulars[index].isbn_flag = false
                    }
                    if (data.type == 3) {
                        this.circulars[index].topic = this.getTopicTitle(index)
                        this.circulars[index].topic_flag = false
                    }
                    // 确定修改以后同时修改 备份数据 中的 type
                    this.circulars_bak[index].type = data.type
                    console.log('备份数据type已设置为：' + this.circulars_bak[index].type);
                    this.$message.success('设置成功！')
                }
            })
        },
        getIndex(index) {
            this.imagesFormData.index = index
            console.log(index);
        },
        getToken() {
            let key = 'store_' + this.circulars[0].store_id + '/circular_' + this.imagesFormData.index + '_' + moment().unix() + '.png'
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
            this.updateImage(res.key)
            this.getToken()
        },
        updateImage(logo_key) {
            var data = this.circulars[this.imagesFormData.index]
            var id = data.id
            var image = 'http://onv8eua8j.bkt.clouddn.com/' + logo_key
            axios.post('/v1/circular/update',{id,image}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.circulars[this.imagesFormData.index].image = image
                    this.$message.success('图片修改成功！')
                }
            }).catch(() => {
                return false
            });
        },
        handleAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken()
        }
    }
}
</script>

<style lang="scss" scoped>
.row_area {
    margin:20px 0;
    padding: 10px;
    border:1px dashed #BFCBD9;
    border-radius: 4px;
}
.radio_area {
    height: 50px;
    line-height: 50px;
}
.el-upload {
    height: 180px;
    width: 375px;
}
.avatar {
    height: 180px;
    width: 375px;
}
.el-input,
.el-select {
    margin-left: 50px;
    width: 180px !important;
}
</style>
