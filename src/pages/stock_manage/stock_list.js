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
            total_count: 0,

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
            topics: [],
            recommendDialog: {
                loading: false,
                show: false,
                title: '',
                associated_topics_bak: [],
                associated_topics: []
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
                has_old_book: false,
                show: false, //是否显示添加货架位按钮
                price: '', //价格
                amount: '', //准备新增的数量
                stock: 0, //库存
                discount: '', //折扣
                locations_strs: [], //货架位名称，如：“A仓库-B货架-1层”
                locations: [], //全部货架位
                location_list: [], //修改商品信息界面展示的货架所有级联选择器的值
                update_location_index: 0, //用于位置不可修改时复原数据
                location: [] //选中的货架位
            },
            //新书
            new_book: {
                has_new_book: false,
                show: false,
                price: '',
                amount: '',
                stock: 0,
                discount: '',
                locations_strs: [],
                locations: [],
                location_list: [], //修改商品信息界面展示的货架所有级联选择器的值
                update_location_index: 0, //用于位置不可修改时复原数据
                location: []
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },
            categories: [],

            index: 0,

            count: 0, // 用于记录推荐处理的请求次数

            add_topic: {
              show: false,
              title: ''
            }
        }
    },
    created() {
        var store = JSON.parse(localStorage.getItem('store'))
        this.store_id = store.id
    },
    mounted() {
        $('#isbn input').focus()
        this.getShopTopic()
        this.getLocations()
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
        proAddTopic() {
            this.add_topic.show = true
            $('#title_input input').focus()
        },
        addTopic() {
            //检查话题名称、书本数量
            if (this.add_topic.title == '') {
                this.$message.info('请填写话题名称')
                $('#title_input input').focus()
                return
            }
            this.recommendDialog.loading = true
            let data = {
                "title": this.add_topic.title, //话题名称
                "sort": 1, //优先级 1 低 2 中 3 高
                "profile": "",
                "items": [{
                    goods_id: this.tableData[this.index].goods_id
                }]
            }
            axios.post('/v1/topic/add', data).then(resp => {
                if (resp.data.message == 'ok') {
                    axios.post('/v1/topic/search', {}).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.topics = resp.data.data
                            this.getData('proRecommend')
                            this.recommendDialog.loading = false
                            this.add_topic.show = false
                        }
                    })
                }
            })
        },
        proRecommend(index) {
            this.add_topic = {
              show: false,
              title: ''
            }
            this.index = index
            var data = this.tableData[index]
            var topics = this.topics
            var associated_topics = []
            var associated_topics_bak = []
            data.associated_topics.forEach(el => {
                associated_topics.push(el.topic_id)
                associated_topics_bak.push(el.topic_id)
            })
            this.recommendDialog = {
                show: true,
                title: data.book.title,
                associated_topics: associated_topics,
                associated_topics_bak: associated_topics_bak
            }
        },
        comfirmRecommend() {
            var self = this
            self.recommendDialog.loading = true
            var index = self.index
            var data = self.tableData[index]
            var goods_id = data.goods_id
            var associated_topics = self.recommendDialog.associated_topics
            var associated_topics_bak = self.recommendDialog.associated_topics_bak
            var count = 0
            var opt_count = 0
            associated_topics.forEach(el => {
                if (associated_topics_bak.indexOf(el) == -1) {
                    opt_count ++
                }
            })
            associated_topics_bak.forEach(el => {
                if (associated_topics.indexOf(el) == -1) {
                    opt_count ++
                }
            })
            if (opt_count == 0) {
                self.recommendDialog.loading = false
                self.recommendDialog.show = false
                return
            }
            associated_topics.forEach(el => {
                if (associated_topics_bak.indexOf(el) == -1) {
                    self.addTopicItem(el,goods_id,opt_count)
                }
            })
            associated_topics_bak.forEach(el => {
                if (associated_topics.indexOf(el) == -1) {
                    var topic = data.associated_topics.find(tp => {
                        return tp.topic_id == el
                    })
                    var topic_item_id = topic.item_id
                    self.deleteTopicItem(el,topic_item_id,opt_count)
                }
            })
        },
        addTopicItem(topic_id,goods_id,opt_count) {
            axios.post('/v1/topic/add_item', {
                "topic_id": topic_id, //话题id
                "goods_id": goods_id //关联的商品id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.count += 1
                    if (this.count == opt_count) {
                        this.recommendDialog.loading = false
                        this.getData()
                        this.count = 0
                        this.recommendDialog.show = false
                    }
                }
            })
        },
        deleteTopicItem(topic_id,topic_item_id,opt_count) {
            axios.post('/v1/topic/del_item', {
                "topic_id": topic_id, //话题id
                "id": topic_item_id   //关联的话题项id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.count += 1
                    if (this.count == opt_count) {
                        this.recommendDialog.loading = false
                        this.getData()
                        this.count = 0
                        this.recommendDialog.show = false
                    }
                }
            })
        },
        getShopTopic() {
            axios.post('/v1/topic/search', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.topics = resp.data.data
                }
            })
        },
        preEdit(index) {
            this.index = index
            var data = this.tableData[index]
            this.book_info_bak = JSON.parse(JSON.stringify(data.book))
            this.book_info = JSON.parse(JSON.stringify(data.book))
            this.goods_id = data.goods_id
            this.new_book.has_new_book = data.has_new_book
            if (data.has_new_book) {
                var location_list = []
                this.new_book.stock = data.new_book.amount
                this.new_book.amount = data.new_book.amount
                this.new_book.price = data.new_book.price
                this.new_book.discount = parseFloat(this.new_book.price / this.book_info.price * 10).toFixed(1)
                this.new_book.locations_strs = data.new_book.location
                data.new_book.location.forEach(el => {
                    location_list.push({
                        id: el.id,
                        location: [el.storehouse_id, el.shelf_id, el.floor_id]
                    })
                })
                this.new_book.location_list = location_list
            } else {
                this.new_book.stock = 0
            }
            this.old_book.has_old_book = data.has_old_book
            if (data.has_old_book) {
                var location_list = []
                this.old_book.stock = data.old_book.amount
                this.old_book.amount = data.old_book.amount
                this.old_book.price = data.old_book.price
                this.old_book.discount = parseFloat(this.old_book.price / this.book_info.price * 10).toFixed(1)
                this.old_book.locations_strs = data.old_book.location
                data.old_book.location.forEach(el => {
                    location_list.push({
                        id: el.id,
                        location: [el.storehouse_id, el.shelf_id, el.floor_id]
                    })
                })
                this.old_book.location_list = location_list
            } else {
                this.old_book.stock = 0
            }
            // 请求上传图片需要的token
            this.getToken()
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
                "new_book_price": this.new_book.price && parseInt(this.new_book.price) ? priceInt(this.new_book.price) : -100, //not required  -100 表示改成0
                "new_book_amount": this.new_book.amount ? this.new_book.amount : -100, //not required  -100 表示改成0
                "old_book_price": this.old_book.price && parseInt(this.old_book.price) ? priceInt(this.old_book.price) : -100, //not required  -100 表示改成0
                "old_book_amount": this.old_book.amount ? this.old_book.amount : -100, //not required  -100 表示改成0
                "sales_status": -100, //not required  -100 改成销售中 1 改成停止销售
                "book_id": this.book_info.id
            }
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
                this.confirmDeleteLocation(index, type)
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
                    this.preEdit(this.index)
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
        confirmUpdateOldLocation(val) {
            this.updateLocation(val, 1)
        },
        confirmUpdateNewLocation(val) {
            this.updateLocation(val, 0)
        },
        updateLocation(val, type) {
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
                this.preEdit(this.index)
                return
            }
            axios.post('/v1/goods/goods_location_operate', {
                "id": type == 0 ? this.new_book.location_list[this.new_book.update_location_index].id : this.old_book.location_list[this.old_book.update_location_index].id, //商品id
                "goods_id": this.goods_id, //商品id
                "storehouse_id": val[0], //仓库id
                "shelf_id": val[1], //货架id
                "floor_id": val[2], //货架层id
                "operate_type": 0, //操作类型	0:更新货架 1:删除货架 2:增加货架
                "type": type //图书类型 0:新书 1 旧书
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    var temp_location_str = {
                        "id": data.id,	//货架id
                        "storehouse_id": data.storehouse_id, //仓库id
                        "shelf_id": data.shelf_id, //货架id
                        "floor_id": data.floor_id,
                        "location_str": getLocationLabel(this.locations, val)
                    }
                    var temp_location_list = {
                        id: data.id,
                        location: [data.storehouse_id, data.shelf_id, data.floor_id]
                    }
                    if (type == 0) {
                        this.new_book.locations_strs.splice(this.new_book.update_location_index,1,temp_location_str)
                    } else {
                        this.old_book.locations_strs.splice(this.old_book.update_location_index,1,temp_location_str)
                    }
                    this.$message.success('修改成功！')
                    this.preEdit(this.index)
                }
            })
        },
        getUpdateIndex(index, type) {
            if (type == 0) {
                this.new_book.update_location_index = index
            } else {
                this.old_book.update_location_index = index
            }
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
                    var data = resp.data.data
                    var temp_location_str = {
                        "id": data.id,	//货架id
                        "storehouse_id": data.storehouse_id, //仓库id
                        "shelf_id": data.shelf_id, //货架id
                        "floor_id": data.floor_id,
                        "location_str": getLocationLabel(this.locations, val)
                    }
                    var temp_location_list = {
                        id: data.id,
                        location: [data.storehouse_id, data.shelf_id, data.floor_id]
                    }
                    if (type == 0) {
                        this.new_book.locations_strs.push(temp_location_str)
                        this.new_book.show = false
                    } else {
                        this.old_book.locations_strs.push(temp_location_str)
                        this.old_book.show = false
                    }
                    this.$message.success('添加成功！')
                    this.preEdit(this.index)
                }
            })
        },
        resetForm() {
            this.isbn = ''
            this.title = ''
            this.publisher = ''
            this.author = ''
            this.search_type = -100
            this.search_amount = '0'
            this.search_picture = -100
            this.getData()
        },
        getLocations() {
            axios.post('/v1/location/list_children_location', {
                "level": 3
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.locations = handleLocation(resp.data.data)
                    this.getData()
                }
            })
        },
        getData(proRecommend) {
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
                "publisher": ""        //not required 出版社模糊搜索
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    self.total_count = resp.data.totalCount
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
                        } else {
                            item.has_new_book = false
                        }
                        if (item.old_book) {
                            item.has_old_book = true
                            item.old_book.price = priceFloat(item.old_book.price)
                            if (item.old_book.location.length > 0) {
                                item.old_book.location = handleGoodsLocation(self.locations,item.old_book.location)
                            } else {
                                item.old_book.location = []
                            }
                        } else {
                            item.has_old_book = false
                        }
                        return item
                    })
                    console.log('self.tableData');
                    console.log(self.tableData);
                }
                if (proRecommend == 'proRecommend') {
                    self.proRecommend(this.index)
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
            let random = moment().unix()
            let key = 'store_' + this.store_id + '/book_' + this.book_info.isbn + '_' + random + '.png'

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
        cleanStorage() {
            this.$prompt('此操作会将书籍数量清零，输入“新书”会清零全部新书库存，输入“二手书”会清零全部二手书库存！', '库存清零', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^新书$|^二手书$/,
              inputErrorMessage: '输入的指令有误'
            }).then(({ value }) => {
                var new_or_old
                if (value === "新书") {
                    new_or_old = 1
                } else if (value === "二手书") {
                    new_or_old = 2
                } else {
                    this.$message.error("您的输入有误，请输入“新书”或者“二手书”后点击确定！")
                    return
                }
                axios.post('/v1/goods/clean_storage', {
                    "new_or_old": new_or_old
                }).then(resp => {
                    if (resp.data.message === 'ok') {
                        this.$message.success((new_or_old === 1 ? "新书" : "二手书") + "库存清零成功！")
                        this.getData()
                    } else {
                        this.$message.error(resp.data.message)
                    }
                }).catch(resp => {
                    this.$message.error(resp.data.message)
                })
            }).catch(() => {
            });
        }
    }
}
