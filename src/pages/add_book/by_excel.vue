<template lang="html">
  <div class="container">
    <div class="top_bar">
      <h2 class="title">图书上架</h2>
    </div>
    <div class="body">
      <div class="upload_status">
        <el-row type="flex" justify="center" align="middle">
            <el-col :span="24">
                <el-steps :space="200" :active="upload_status" finish-status="success" center align-center>
                    <el-step title="选择文件"></el-step>
                    <el-step title="校验数据"></el-step>
                    <el-step title="上传数据"></el-step>
                </el-steps>
            </el-col>
        </el-row>
      </div>
      <el-card v-if="upload_status==1" class="box-card">
        <div slot="header" class="clearfix"><span>选择文件</span></div>
        <div style="margin-bottom:20px;">
          <p>• <a href="http://okxy9gsls.bkt.clouddn.com/uploadExcel.xlsx">下载样例文件</a></p>
          <p>• 只能上传xlsx和xls文件，且不超过2M</p>
          <p>• 书&nbsp;&nbsp;&nbsp;名：不能超过30个字符（包括汉字、英文、标点符号）</p>
          <p>• 出版社：请使用完整的出版社名称</p>
          <p>• 类&nbsp;&nbsp;&nbsp;型：1.新书  2.旧书</p>
          <p>• 折&nbsp;&nbsp;&nbsp;扣：0.7表示7折 ，请保持折扣值在0~1之间</p>
          <p>• 仓库名、货架名：请使用完整的仓库名、货架名</p>
        </div>
        <div class="btn">
          <el-checkbox v-model="select_checked" style="margin-right:10px;">已仔细阅读以上内容</el-checkbox>
          <el-button type="primary" size="small" v-show="!select_checked" :disabled="true">选取文件</el-button>
          <el-upload action="" :before-upload="handleFile" :show-upload-list="false" clearFiles>
            <el-button slot="trigger" size="small" type="primary" v-show="select_checked">选取文件</el-button>
          </el-upload>
        </div>
      </el-card>

      <el-card v-if="upload_status==2" v-loading="check_loading" class="box-card">
        <div slot="header" class="clearfix"><span>校验结果</span><strong>{{'（'+check_success.length+'条数据校验成功；'+(check_fail.length)+'条数据校验失败！）'}}</strong></div>
        <div class="" v-show="check_fail.length>0">
          <el-alert title="以下为校验失败的数据，您可以参考每行末尾的“错误提示”直接在当前页面进行修改并“重新校验”，也可以选择放弃下方的错误数据“直接上传”。" type="error" show-icon></el-alert>
        </div>
        <div id="grid" class="hot handsontable htRowHeaders htColumnHeaders" data-originalstyle="height: 320px; overflow: hidden; width: 584px;"></div>
        <div class="btn">
          <el-button type="primary" size="small" v-show="check_fail.length>0" @click="checkAgain">重新校验</el-button>
          <el-button type="primary" size="small" v-show="check_fail.length==0" @click="upload">确认上传</el-button>
          <el-button type="warning" size="small" v-show="check_fail.length>0" @click="partUpload">直接上传</el-button>
        </div>
      </el-card>

      <el-card v-if="upload_status==3" class="box-card">
        <div slot="header" class="clearfix"><span>上传成功</span><strong>{{'（'+check_success.length+'条数据上传成功；'+(check_fail.length)+'条数据上传失败！）'}}</strong></div>
        <div class="progress">
          <el-progress v-if="upload_percentage!=100" type="circle" :width="240" :percentage="upload_percentage"></el-progress>
          <el-progress v-else type="circle" :width="240" :percentage="100" status="success"></el-progress>
        </div>
        <div class="btn">
          <el-button type="success" size="small" @click="complete">完成</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "../../scripts/http"
export default {
    data() {
        return {
            stores: [],
            check_loading: false,
            upload_status: 1,
            select_checked: false,
            upload_percentage: 0,
            check_success: [],
            check_fail: [],
            hot: {}
        };
    },
    mounted() {
        // axios.post('/v1/store/listStores', {}).then(resp => {
        //     this.stores = resp.data.data
        // })
    },
    methods: {
        handleFile(file) {
            var self = this
            var reader = new FileReader();
            var name = file.name;
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });
                /* DO SOMETHING WITH workbook HERE */
                var sheet0 = workbook.SheetNames[0]
                var dataJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet0])
                var json2array = []
                dataJson.forEach(function(d) {
                    var item = []
                    item.push(d['ISBN'])
                    item.push(d['书名'])
                    item.push(d['出版社'])
                    item.push(d['作者'])
                    item.push(d['原价'])
                    item.push(d['数量'])
                    item.push(d['折扣'])
                    item.push(d['类别'])
                    item.push(d['新旧'])
                    item.push(d['仓库名'])
                    item.push(d['货架名'])
                    json2array.push(item)
                })
                self.checkData(json2array)
            };
            reader.readAsBinaryString(file);
            self.upload_status = 2
        },
        checkData(array) {
            var self = this
            var success = self.check_success
            var fail = []
            array.forEach(function(arr) {
                var obj = self.checkItem(arr)
                // 删除再次校验的时候插入的提示信息
                if (arr.length > 11) {
                    arr.splice(11, 1)
                }
                if (obj.success) {
                    success.push(arr)
                } else {
                    // 向错误数据末尾插入错误提示
                    arr.push(obj.message)
                    fail.push(arr)
                }
            })
            self.check_success = success
            self.check_fail = fail

            $('#grid').empty()
            if (self.check_fail.length > 0) {
                self.makeContainer(self.check_fail)
            }
        },
        checkItem(array) {
            var obj = {}
            if (!array[0]) {
                obj.success = false
                obj.message = 'ISBN错误'
                return obj
            } else {
                var isbn = array[0].replace(new RegExp("-","gm"),"").trim()
                if (isbn.length != 10 && isbn.length != 13) {
                    obj.success = false
                    obj.message = 'ISBN错误'
                    return obj
                }
            }
            if (!array[1]) {
                obj.success = false
                obj.message = '书名错误'
                return obj
            } else {
                if (array[1].trim().length >30) {
                    obj.success = false
                    obj.message = '书名错误'
                    return obj
                }
            }
            if (!array[2]) {
                obj.success = false
                obj.message = '出版社错误'
                return obj
            }
            if (!array[3]) {
                obj.success = false
                obj.message = '作者错误'
                return obj
            }
            if (!(Number(array[4]) > 0)) {
                obj.success = false
                obj.message = '原价错误'
                return obj
            }
            if (!(parseFloat(array[5]) == parseInt(array[5]))) {
                obj.success = false
                obj.message = '数量错误'
                return obj
            }
            if (!(parseFloat(array[6]) > 0 && parseFloat(array[6]) <= 1)) {
                obj.success = false
                obj.message = '折扣错误'
                return obj
            }
            if (['1', '2', '3', '4', '5'].indexOf(array[7]) == -1) {
                obj.success = false
                obj.message = '类别错误'
                return obj
            }
            if (['1', '2'].indexOf(array[8]) == -1) {
                obj.success = false
                obj.message = '新旧错误'
                return obj
            }
            var exist_store = false
            var exist_shelf = false
            this.stores.forEach(function(store) {
                if (store.name == array[9]) {
                    exist_store = true
                    var shelves = store.shelves
                    shelves.forEach(function(shelf) {
                        if (shelf.name == array[10]) {
                            exist_shelf = true
                        }
                    })
                }
            })
            if (!exist_store) {
                obj.success = false
                obj.message = '仓库名错误'
                return obj
            }
            if (!exist_shelf) {
                obj.success = false
                obj.message = '货架名错误'
                return obj
            }
            obj.success = true
            obj.message = '没有错误'
            return obj
        },
        checkAgain() {
            var self = this
            self.check_loading = true
            var hot_data = self.hot.getData()
            hot_data.splice(0, 1)
            self.checkData(hot_data)
            setTimeout(function() {
                self.check_loading = false
            }, 500)
        },
        makeContainer(array) {
            var show_data = []
            show_data = array
            show_data.unshift(['ISBN', '书名', '出版社', '作者', '原价', '数量', '折扣', '类别', '新旧', '仓库名', '货架名', '错误提示'])
            var container = document.getElementById('grid');
            var hot = new Handsontable(container, {
                data: show_data,
                fixedRowsTop: 1,
                rowHeaders: true,
                colHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,
                stretchH: 'all',
                contextMenu: true
            });
            this.hot = hot
        },
        array2json(array) {
            var json = []
            //DO SOMETHING WITH array
            let self = this
            array.forEach(function(arr) {
                var st = ''
                var sh = ''
                // console.log(self.stores);
                self.stores.forEach(function(store) {
                    if (store.name == arr[9]) {
                        st = store.id
                        var shelves = store.shelves
                        shelves.forEach(function(shelf) {
                            if (shelf.name == arr[10]) {
                                sh = shelf.id
                            }
                        })
                    }
                })
                var obj = {
                    isbn: arr[0].replace(new RegExp("-","gm"),"").trim(),
                    title: arr[1],
                    publisher: arr[2],
                    author: arr[3],
                    pre_price: parseInt(arr[4] * 100),
                    amount: Number(arr[5]),
                    price: parseInt(arr[4] * arr[6] * 100),
                    // discount: arr[6],
                    category: Number(arr[7]),
                    type: Number(arr[8]),
                    store_id: st,
                    shelf_id: sh
                }
                json.push(obj)
            })
            return json
        },
        partUpload() {
            var self = this
            self.$confirm('此操作将放弃校验失败的数据, 直接上传校验成功的数据，是否继续?', '提示', {
                confirmButtonText: '继续上传',
                cancelButtonText: '返回修改',
                type: 'warning'
            }).then(() => {
                self.upload()
            }).catch(() => {
                return
            });
        },
        upload() {
            $('#grid').empty()
            var self = this
            self.upload_status = 3
            var data = self.array2json(self.check_success)
            for (var i = 0, len = data.length; i < len; i += 500) {
                if (i + 500 <= len) {
                    var request_data = {
                        models: data.slice(i, i + 500)
                    }
                } else {
                    var request_data = {
                        models: data.slice(i, len)
                    }
                }
                console.log(request_data);
                //DO SOMETHING WITH REQUEST
                axios.post('/v1/books/upload_goods_by_excel', request_data)
                    .then(resp => {
                        if (request_data.length == 500) {
                            self.upload_percentage += parseInt(500 / len)
                        } else {
                            self.upload_percentage = 100
                        }
                    })
            }

        },
        complete() {
            this.upload_status = 1
            this.select_checked = false
            this.upload_percentage = 0
            this.check_success = []
            this.check_fail = []
            this.hot = {}
        }
    }
}
</script>
<style lang="scss" scoped>
.body {
    margin: 8px;
    padding: 16px;
    background-color: #FFFFFF;
}
.box-card {
    margin-top: 10px;
    height: 100%;
    span {
        font-weight: bold;
    }
    strong {
        color: red;
        font-size: 20px;
        margin-left: 20px;
    }
    p {
        line-height: 24px;
    }
    .btn {
        display: flex;
        align-items: center;
    }
    .progress {
        padding: 70px;
        width: auto;
        text-align: center;
    }
}

#grid {
    // height: 100%;
    max-height: 100%;
    min-height: 350px;
    margin-bottom: 10px;
    overflow: auto;
}
</style>
