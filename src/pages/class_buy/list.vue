<template lang="html">
  <div class="container">
    <div class="top_bar">
      <h2 class="title">班级购列表</h2>
    </div>
    <div class="content_inner">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="school_id" style="width: 220px;" clearable placeholder="全部学校" size="small" @change="findGroupon('school')">
            <el-option label="全部学校" value=""></el-option>
            <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="institute_id" style="width: 220px;" clearable placeholder="全部学院" size="small" @change="findGroupon('institute')">
            <el-option label="全部学院" value=""></el-option>
            <el-option v-for="institute in institutes" :label="institute.name" :value="institute.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="institute_major_id" style="width: 220px;" clearable placeholder="全部专业" size="small" @change="findGroupon">
            <el-option label="全部专业" value=""></el-option>
            <el-option v-for="major in majors" :label="major.name" :value="major.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="term_index" style="width: 140px;" clearable placeholder="全部学期" size="small" @change="findGroupon">
            <el-option label="全部学期" value=""></el-option>
            <el-option v-for="(item, index) in terms" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search_type" style="width: 140px;" clearable placeholder="是否过期" size="small" @change="findGroupon">
            <el-option label="是否过期" value=""></el-option>
            <el-option label="未过期" :value="1"></el-option>
            <el-option label="已过期" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="班级购编号" v-model.trim="groupon_id" style="width: 220px;" size="small" icon="search" :on-icon-click="findGroupon" @keyup.enter.native="findGroupon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="班级名/班号" v-model.trim="class_name" style="width: 220px;" size="small" icon="search" :on-icon-click="findGroupon" @keyup.enter.native="findGroupon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="resetForm"><i class="fa fa-refresh" aria-hidden="true"></i> 重置</el-button>
        </el-form-item>
      </el-form>

      <div class="row">
        <el-radio-group v-model="founder_type" size="small" @change="findGroupon">
          <el-radio-button :label="2">官方班级购</el-radio-button>
          <el-radio-button :label="1">其他版机构</el-radio-button>
          <el-radio-button :label="0">全部班级购</el-radio-button>
        </el-radio-group>
      </div>

      <div class="row">
        <el-button :disabled="order_status != 1" @click="" size="small" type="primary"><i class="fa fa-refresh" aria-hidden="true"></i> 批量改变日期</el-button>
        <el-button style="float: right" @click="" size="small" type="primary"> + 新增班级购</el-button>
      </div>

      <div class="row">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="编号" width="100"></el-table-column>
          <el-table-column prop="name" label="班级名/班级号" width="140"></el-table-column>
          <el-table-column prop="name" label="发布人" width="100"></el-table-column>
          <el-table-column prop="name" label="销售额" sortable width="100"></el-table-column>
          <el-table-column prop="name" label="订单量" width="100"></el-table-column>
          <el-table-column prop="name" label="班级购信息" width="140"></el-table-column>
          <el-table-column prop="date" label="截止日期" width="140"></el-table-column>
          <el-table-column prop="name" label="备注" width="100"></el-table-column>
          <el-table-column label="操作" min-width="180">
            <template scope="scope">
              <el-button-group>
                <el-button type="primary" size="small" icon="search">查看</el-button>
                <el-button :disabled="order_status != 1" type="primary" size="small" icon="edit">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog title="创建班级购" top="5%" size="large" :visible.sync="dialogVisible">
        <div class="dialog_area">
          <div class="head_area row">
            <div class="left">
              <div class="avatar_area">
                <img :src="'http://image.goushuyun.cn/book.png'" class="image"></img>
              </div>
              <div class="class_name_id">
                <p class="name">131042Y1班</p>
                <p class="id">#110</p>
              </div>
            </div>
            <div class="right">
              <div class="statistics_area">
                <span style="font-size: 24px;"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                <span>1895.12</span>
              </div>
              <div class="statistics_area">
                <span style="font-size: 24px;"><i class="fa fa-user" aria-hidden="true"></i></span>
                <span>1892</span>
              </div>
              <div class="statistics_area">
                <span style="font-size: 24px;"><i class="fa fa-thumbs-up" aria-hidden="true"></i></span>
                <span>1895</span>
              </div>
            </div>
          </div>
          <div class="class_buy_area">
            <div class="class_buy_info">
              <p>
                <label>学校</label>
                <el-select v-model="school_id" :disabled="!edit_main_info" filterable clearable placeholder="选择学校（可搜索）" size="small" @change="">
                  <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
                </el-select>
              </p>
              <p>
                <label>学院</label>
                <el-select v-model="institute_id" :disabled="!edit_main_info" filterable clearable placeholder="选择学院（可搜索）" size="small" @change="">
                  <el-option v-for="institute in institutes" :label="institute.name" :value="institute.id"></el-option>
                </el-select>
              </p>
              <p>
                <label>专业</label>
                <el-select v-model="institute_major_id" :disabled="!edit_main_info" filterable clearable placeholder="选择专业（可搜索）" size="small" @change="">
                  <el-option v-for="major in majors" :label="major.name" :value="major.id"></el-option>
                </el-select>
              </p>
              <p>
                <label>学期</label>
                <el-select v-model="term" :disabled="!edit_main_info" filterable clearable placeholder="选择学期（可搜索）" size="small" @change="">
                  <el-option v-for="item in terms" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </p>
            </div>

            <div class="class_buy_info">
              <!-- <p>
                <label>班级购名称</label>
                <el-input style="width: auto" placeholder="班级购名" size="small"></el-input>
              </p> -->
              <p>
                <label>发布人姓名</label>
                <el-input style="width: auto" readonly placeholder="发布人姓名" size="small"></el-input>
              </p>
              <p>
                <label>发布人手机</label>
                <el-input style="width: auto" readonly placeholder="创建人手机" size="small"></el-input>
              </p>
              <p>
                <label>截 止 日 期</label>
                <el-date-picker v-model="deadline" :disabled="!edit_main_info" style="width: 180px;" type="date" placeholder="选择日期" size="small" :picker-options="pickerOptions"></el-date-picker>
              </p>
              <p>
                <label>班级购备注</label>
                <el-input id="remark" :readonly="!edit_main_info" style="width: auto;" placeholder="班级购备注" size="small"></el-input>
              </p>
            </div>

            <transition name="el-zoom-in-center">
              <div class="class_buy_info" style="position: relative; top: 68px; left: 30px;">
                <el-button v-if="!edit_main_info" type="primary" size="small" @click="edit_main_info = true">修改信息</el-button>
                <el-button v-if="edit_main_info" type="primary" size="small">保存</el-button>
                <el-button v-if="edit_main_info" type="default" size="small" @click="edit_main_info = false">取消</el-button>
              </div>
            </transition>
          </div>

          <div class="table_area">
            <div v-show="!edit_book_list" class="search_area">
              <el-button type="primary" style="margin-bottom: 2px;" size="small" @click="edit_book_list = true">编辑书单</el-button>
            </div>
            <transition name="el-zoom-in-center">
              <div v-show="edit_book_list" class="search_area">
                <el-input style="width: 260px; margin-right: 10px;" placeholder="通过搜索 ISBN 添加书籍" size="small" icon="search"></el-input>
                <el-button type="primary" size="small">保存</el-button>
                <el-button type="default" size="small" @click="edit_book_list = false">取消</el-button>
              </div>
            </transition>
            <el-table :data="tableData" border>
              <el-table-column label="推荐中的书单">
                <el-table-column label="图片" width="100">
                  <template scope="scope" >
                    <div class="image_wrap">
                      <img :src="'http://image.goushuyun.cn/book.png'" class="image"></img>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="ISBN" width="150"></el-table-column>
                <el-table-column prop="address" label="书名"></el-table-column>
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
                <el-table-column label="操作" width="80">
                  <template scope="scope">
                    <el-button :disabled="!edit_book_list" type="text">移除</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>

          <!-- <div style="height: 30px;">
            <el-button style="float: right; margin: 20px;" type="primary" size="small">创建</el-button>
          </div> -->

          <div class="operate_list">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="date" label="操作时间" width="260"></el-table-column>
              <el-table-column prop="name" label="操作人" width="200"></el-table-column>
              <el-table-column prop="address" label="操作信息"></el-table-column>
            </el-table>
            <div class="show_all"><i class="fa fa-angle-double-down" aria-hidden="true"></i> 查看更多</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "../../scripts/http"
export default {
  data() {
    return {
      // select 基础信息
      schools: [],
      institutes: [],
      majors: [],
      terms: ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下', '其他'],

      // 班级购检索条件
      school_id: '', // 学校id
      institute_id: '', // 学院id
      institute_major_id: '', // 专业id
      term_index: '', // 学期index
      search_type: '', // 0:all 1:正常状态下所有班级购 2:过期班级购 3:异常班级购
      groupon_id: '', // 班级购编号
      class_name: '', // 班级名/班号
      founder_type: 0,
      page: 1, // 页数
      size: 15, // 请求记录数量

      // 班级购列表
      groupons: [], // 班级购列表

      edit_main_info: false,
      edit_book_list: false,

      order_status: 1,

      dialogVisible: false,

      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],

      deadline: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(_ => {
      $('#remark input').css("color", "#FF4949");
    })
    this.getSchoolMajors()
    this.findGroupon()
  },
  methods: {
    getSchoolMajors() {
      axios.post('/v1/groupon/get_school_majors', {}).then(resp => {
        if (resp.data.message == 'ok') {
          this.schools = resp.data.data
        }
      })
    },
    findGroupon(type) {
      if (type === 'school') {
        var school_id = this.school_id
        if (school_id != '') {
          this.getInstitutes(school_id)
        } else {
          this.institute_id = ''
          this.institute_major_id = ''
          this.institutes = []
          this.majors = []
        }
      } else if (type === 'institute') {
        var institute_id = this.institute_id
        if (institute_id != '') {
          this.getMajors(institute_id)
        } else {
          this.institute_major_id = ''
          this.majors = []
        }
      }
      axios.post('/v1/groupon/find_groupon', {
        "id": this.groupon_id,
        "school_id": this.school_id,
        "institute_id": this.institute_id,
        "institute_major_id": this.institute_major_id,
        "term": this.terms[this.term_index],
        "search_type": this.search_type == '' ? 0 : this.search_type, //0：all 1： 正常状态下所有班级购 2：过期班级购 3：异常班级购
        "class": this.class_name,
        "founder_id": "",
        "founder_type": this.founder_type,
        "page": this.page,
        "size": this.size
      }).then(resp => {
        if (resp.data.message == 'ok') {
          console.log(resp.data.data);
          this.groupons = resp.data.data
        }
      })
    },
    getInstitutes(school_id) {
      var school = this.schools.find(el => {
        return el.id == school_id
      })
      this.institutes = school.institutes
    },
    getMajors(institute_id) {
      var institute = this.institutes.find(el => {
        return el.id == institute_id
      })
      this.majors = institute.majors
    },
    resetForm() {
      this.school_id = ''
      this.institute_id = ''
      this.institute_major_id = ''
      this.institutes = []
      this.majors = []
      this.term_index = ''
      this.search_type = ''
      this.groupon_id = ''
      this.class_name = ''
      this.page = 1
      this.size = 15
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_area {
    box-sizing: border-box;
    padding: 0 16px;
}
.row {
    margin-bottom: 15px;
    width: auto;
}
.head_area {
    padding: 0 0 5px 15px;
    display: flex;
    .left {
        display: flex;
        align-items: center;
        width: 50%;
        .avatar_area {
            height: 80px;
            width: 80px;
            .image {
                height: 80px;
                width: 80px;
                border-radius: 50%;
            }
        }
        .class_name_id {
            width: 300px;
            height: 60px;
            margin-left: 30px;
            .name {
                line-height: 30px;
                font-size: 16px;
                font-weight: bold;
                color: #000;
            }
            .id {
                color: #888;
                line-height: 30px;
            }
        }
    }
    .right {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
}
.class_buy_area {
    display: flex;
    align-items: center;
    padding: 30px;
    border-radius: 16px;
    background-color: #EEF1F6;
    // justify-content: center;
    .class_buy_info {
        width: 300px;
        p {
            height: 44px;
            line-height: 44px;
            label {
                margin: 0 10px;
            }
        }
    }
}

.table_area {
    border-top: 3px dashed #EEF1F6;
    margin-top: 30px;
    .search_area {
        position: relative;
        top: 36px;
        right: 20px;
        z-index: 1;
        float: right;
    }
    .image_wrap {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: content-box;
        padding: 8px 0;
        img.image {
            height: 100%;
        }
    }
    .goods_item {
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    .new_color {
        color: #3A8AFF;
    }
    .old_color {
        color: #1AAD19;
    }
}
.operate_list {
    margin-top: 25px;
    .show_all {
        height: 40px;
        line-height: 40px;
        width: auto;
        text-align: center;
        // background-color: #EEF1F6;
        color: #1F2D3D;
        border-bottom: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        box-sizing: border-box;
    }
}
</style>
