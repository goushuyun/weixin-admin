<template lang="html">
  <div class="container">
    <div class="top_bar">
      <h2 class="title">班级购列表</h2>
    </div>
    <div class="content_inner">
      <div v-loading.body="loading.groupons">
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
            <el-radio-button :label="1">其他班级购</el-radio-button>
            <el-radio-button :label="0">全部班级购</el-radio-button>
          </el-radio-group>
        </div>

        <div class="row">
          <el-button :disabled="founder_type != 2" size="small" type="primary" @click="preResetExpireAt"><i class="fa fa-refresh" aria-hidden="true"></i> 批量改变日期</el-button>
          <el-button style="float: right" @click="openDialog('add',null)" size="small" type="primary"> + 新增班级购</el-button>
        </div>

        <div class="row">
          <el-table :data="groupons" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="班级购编号" width="160"></el-table-column>
            <el-table-column prop="class" label="班级名/班级号" width="160"></el-table-column>
            <el-table-column prop="founder_name" label="发布人" width="160"></el-table-column>
            <el-table-column prop="total_sales" label="销售额" sortable width="100"></el-table-column>
            <el-table-column prop="order_num" label="订单量" width="100"></el-table-column>
            <el-table-column label="班级购信息" width="240">
              <template scope="scope">
                <div style="line-height: 24px;padding: 5px 0">
                  <p>{{scope.row.school.name}}</p>
                  <p>{{scope.row.institute.name}}</p>
                  <p>{{scope.row.major.name}}</p>
                  <p>{{scope.row.term}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="expire_at" label="截止日期" width="140"></el-table-column>
            <el-table-column prop="profile" label="班级购说明" min-width="240"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template scope="scope">
                <el-button-group>
                  <el-button type="primary" size="small" icon="edit" @click="openDialog('view', scope.$index)"></el-button>
                  <el-button :disabled="scope.row.founder_type != 2" type="primary" size="small" icon="delete" @click="proDelete(scope.$index)"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination :current-page="page" :total="total_count" :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>

      <el-dialog title="批量修改截止日期" :visible.sync="reset_dialog.visible" size="tiny">
        <div class="reset_dialog">
          <span style="margin-right: 20px;">截止日期</span>
          <el-date-picker v-model="reset_dialog.reset_expire_at" type="date" size="small" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reset_dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="confirmResetExpireAt">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="operate_type == 'add' ? '创建班级购' : '查看班级购'" top="1%" size="large" :visible.sync="dialog_visible" @close="findGroupon">
        <div class="dialog_area" v-loading.body="loading.dialog">
          <el-form label-width="140px" :model="dialog_data" :rules="dialog_rules" ref="dialog_data">
            <div v-if="operate_type == 'view'" class="head_area row">
              <div class="left">
                <div class="avatar_area">
                  <img :src="dialog_groupon.founder_avatar == '' ? 'http://image.goushuyun.cn/book.png' : dialog_groupon.founder_avatar" class="image"></img>
                </div>
                <div class="class_name_id">
                  <div v-if="!edit_main_info">
                    <p class="name">{{dialog_data.dialog_class}}</p>
                    <p class="id">#{{dialog_groupon.id}}</p>
                  </div>
                  <el-form-item v-else prop="dialog_class" label-width="0">
                    <el-input v-model="dialog_data.dialog_class" style="width: 200px" placeholder="输入班级购名" size="small" @input.native.capture="inputting = true" @blur.native.capture="inputting = false"></el-input>
                    <p class="id">#{{dialog_groupon.id}}</p>
                  </el-form-item>
                </div>
              </div>
              <div class="right">
                <div class="statistics_area">
                  <span style="font-size: 24px;"><i class="fa fa-jpy" aria-hidden="true"></i></span>
                  <span>{{dialog_groupon.total_sales}}</span>
                </div>
                <div class="statistics_area">
                  <span style="font-size: 24px;"><i class="fa fa-user" aria-hidden="true"></i></span>
                  <span>{{dialog_groupon.participate_num}}</span>
                </div>
                <div class="statistics_area">
                  <span style="font-size: 24px;"><i class="fa fa-thumbs-up" aria-hidden="true"></i></span>
                  <span>{{dialog_groupon.star_num}}</span>
                </div>
              </div>
            </div>
            <div class="class_buy_area">
              <div class="class_buy_info">
                <el-form-item label="学校" prop="dialog_school_id">
                  <el-select v-if="dialog_visible" v-model="dialog_data.dialog_school_id" :disabled="operate_type == 'view' && !edit_main_info" filterable clearable placeholder="选择学校（可搜索）" size="small" @change="getInstitutesOrMajors('school')">
                    <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学院" prop="dialog_institute_id">
                  <el-select v-if="dialog_visible" v-model="dialog_data.dialog_institute_id" :disabled="operate_type == 'view' && !edit_main_info" filterable clearable placeholder="选择学院（可搜索）" size="small" @change="getInstitutesOrMajors('institute')">
                    <el-option v-for="institute in dialog_institutes" :label="institute.name" :value="institute.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="dialog_institute_major_id">
                  <el-select v-if="dialog_visible" v-model="dialog_data.dialog_institute_major_id" :disabled="operate_type == 'view' && !edit_main_info" filterable clearable placeholder="选择专业（可搜索）" size="small">
                    <el-option v-for="major in dialog_majors" :label="major.name" :value="major.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学期" prop="dialog_term_index">
                  <el-select v-if="dialog_visible" v-model="dialog_data.dialog_term_index" :disabled="operate_type == 'view' && !edit_main_info" filterable clearable placeholder="选择学期（可搜索）" size="small">
                    <el-option v-for="(item, index) in terms" :label="item" :value="index"></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="class_buy_info">
                <el-form-item v-if="operate_type == 'add'" label="班级购名称" prop="dialog_class">
                  <el-input v-model="dialog_data.dialog_class" placeholder="班级购名" size="small"></el-input>
                </el-form-item>
                <el-form-item label="发布人姓名" prop="dialog_founder_name">
                  <el-input v-model="dialog_data.dialog_founder_name" :disabled="operate_type == 'view' && !edit_main_info" placeholder="发布人姓名" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="operate_type == 'view'" label="发布人手机" prop="dialog_founder_mobile">
                  <el-input v-model="dialog_data.dialog_founder_mobile" :disabled="operate_type == 'view' && !edit_main_info" placeholder="创建人手机" size="small"></el-input>
                </el-form-item>
                <el-form-item label="截 止 日 期" prop="dialog_expire_at">
                  <el-date-picker v-model="dialog_data.dialog_expire_at" :disabled="operate_type == 'view' && !edit_main_info"
                    type="date" placeholder="选择日期" size="small" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="班级购说明" prop="dialog_profile">
                  <el-input v-model="dialog_data.dialog_profile" id="remark" :disabled="operate_type == 'view' && !edit_main_info" placeholder="班级购说明" size="small"></el-input>
                </el-form-item>
              </div>

              <transition v-if="operate_type == 'view'" name="el-zoom-in-center">
                <div class="class_buy_info" style="width:auto; position: relative; top: 78px; left: 30px;">
                  <el-button v-if="!edit_main_info" type="primary" size="small" :disabled="dialog_groupon.founder_type != 2" @click="edit_main_info = true">修改信息</el-button>
                  <el-button v-if="edit_main_info" type="primary" size="small" @click="saveMainInfo('dialog_data')">保存</el-button>
                  <el-button v-if="edit_main_info" type="default" size="small" @click="openDialog('view', null)">取消</el-button>
                </div>
              </transition>
            </div>
          </el-form>

          <div class="table_area">
            <div v-show="!edit_book_list" class="search_area">
              <el-button type="primary" style="margin-bottom: 2px;" size="small" :disabled="dialog_groupon.founder_type != 2" @click="preEditBookList">编辑书单</el-button>
            </div>
            <transition name="el-zoom-in-center">
              <div v-show="edit_book_list" class="search_area">
                <el-select id="isbn_input" style="width: 460px;" size="small" filterable remote placeholder="通过搜索 ISBN 或这 书名 添加书籍" :loading="loading.select"
                  v-model="search_index" :remote-method="searchGoods" @change="handleSelect">
                  <el-option v-for="(item,index) in search_list" :key="index" :label="item.label" :value="index"></el-option>
                </el-select>
                <el-button style="margin-left: 10px;" v-if="operate_type == 'view'" type="primary" size="small" @click="saveBookList">保存</el-button>
                <el-button v-if="operate_type == 'view'" type="default" size="small" @click="openDialog('view', null)">取消</el-button>
              </div>
            </transition>
            <el-table :data="groupon_items" border v-loading.body="loading.groupon_items">
              <el-table-column label="班级购书单">
                <el-table-column label="图片" width="100">
                  <template scope="scope" >
                    <div class="image_wrap">
                      <img :src="scope.row.book.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://images.goushuyun.cn/' + scope.row.book.image)" class="image"></img>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="book.isbn" label="ISBN" width="150"></el-table-column>
                <el-table-column prop="book.title" label="书名"></el-table-column>
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
                    <el-button :disabled="!edit_book_list" type="text" @click="removeItem(scope.$index)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="operate_type == 'add'" style="height: 30px;">
            <el-button style="float: right; margin: 20px;" type="primary" size="small" @click="saveGroupon('dialog_data')">创建</el-button>
          </div>

          <div v-if="operate_type == 'view'" class="operate_list">
            <el-collapse-transition>
              <el-table :data="groupon_logs" stripe style="width: 100%">
                <el-table-column prop="create_at" label="操作时间" width="240"></el-table-column>
                <el-table-column prop="founder_name" label="操作人" width="240"></el-table-column>
                <el-table-column prop="operate_type" label="操作信息"></el-table-column>
              </el-table>
            </el-collapse-transition>

            <div class="show_all" v-if="groupon_logs_bak.length > 5">
              <el-button v-if="groupon_logs.length < groupon_logs_bak.length" type="text" style="width: 100%" @click="showAllLogs"><i class="fa fa-angle-double-down" aria-hidden="true"></i> 展开全部</el-button>
              <el-button v-else type="text" style="width: 100%" @click="closeAllLogs"><i class="fa fa-angle-double-up" aria-hidden="true"></i> 收起全部</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
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
      size: 10, // 请求记录数量

      // 班级购列表
      groupons: [], // 班级购列表
      total_count: 0, // 记录总数量

      // 批量修改日期
      selected_groupons: [], // 选中的班级购列表
      reset_dialog: {
        visible: false,
        reset_expire_at: '', // 批量修改日期
      },

      // ---------- 分割线 ---------- //
      // dialog 内参数
      dialog_visible: false,
      operate_type: '', // add-创建班级购 view-查看班级购
      dialog_institutes: [],
      dialog_majors: [],
      dialog_index: 0, // 当前班级购的索引
      dialog_groupon: {}, //当前班级购

      inputting: false, //是否手动修改班级购名称
      // 班级购基本信息
      dialog_data: {
        dialog_school_id: '', // 学校id
        dialog_institute_id: '', // 学院id
        dialog_institute_major_id: '', // 专业id
        dialog_term_index: '', // 学期index
        dialog_class: '', // 班级购名称
        dialog_founder_name: '', // 创建人姓名
        dialog_founder_mobile: '', // 创建人电话
        dialog_expire_at: '', // 过期时间
        dialog_profile: '' // 备注
      },
      dialog_rules: {
        dialog_school_id: [{
          required: true,
          message: '请选择学校',
          trigger: 'change'
        }], // 学校id
        dialog_institute_id: [{
          required: true,
          message: '请选择学院',
          trigger: 'change'
        }], // 学院id
        dialog_institute_major_id: [{
          required: true,
          message: '请选择专业',
          trigger: 'change'
        }], // 专业id
        dialog_term_index: [{
          type: 'number',
          required: true,
          message: '请选择学期',
          trigger: 'change'
        }], // 学期index
        dialog_class: [{
          required: true,
          message: '请填写班级购名称',
          trigger: 'blur'
        }], // 班级购名称
        dialog_founder_name: [{
          required: true,
          message: '请填写创建人姓名',
          trigger: 'blur'
        }], // 创建人姓名
        dialog_founder_mobile: [{
          required: true,
          message: '请填写创建人电话',
          trigger: 'blur'
        }], // 创建人电话
        dialog_expire_at: [{
          type: 'date',
          required: true,
          message: '请选择时间',
          trigger: 'change'
        }] // 过期时间
      },

      search_index: '', // 搜索isbn
      search_list: [], //搜索出来的图书列表

      groupon_items: [], // 班级购条目
      groupon_items_bak: [], // 班级购条目备份
      groupon_logs: [], // 班级购日志
      groupon_logs_bak: [], // 班级购日志备份
      del_item_ids: [], // 要删除的条目
      add_items: [], // 准备添加的条目

      edit_main_info: false,
      edit_book_list: false,
      loading: {
        groupons: false,
        dialog: false,
        groupon_items: false,
        select: false
      }, // 书单table的loading

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < moment().subtract(1, 'd');
        }
      }
    }
  },
  watch: {
    dialog_data: {
      handler: function(curVal, oldVal) {　　
        if (!(this.operate_type == 'view' && this.edit_main_info == false)) {
          var major_name = ''
          this.dialog_majors.forEach(m => {
            if (m.id == curVal.dialog_institute_major_id) {
              major_name = m.name
            }
            return m.id == curVal.dialog_institute_major_id
          })
          var term = this.terms[curVal.dialog_term_index]
          if(this.inputting == false) {
            if (major_name && term) {
              curVal.dialog_class = major_name + '（' + term + '）教材单'
              console.log(curVal);
            } else {
              curVal.dialog_class = ''
            }
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getSchoolMajors()
    this.findGroupon()
  },
  methods: {
    proDelete(index) {
      this.$confirm('此操作将永久删除该班级购，是否继续？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var groupon = this.groupons[index]
        axios.post('/v1/groupon/update_groupon', {
          "id": groupon.id,
          "status": 2
        }).then(resp => {
          if (resp.data.message == 'ok') {
            this.$message.success('班级购删除成功！')
            this.findGroupon()
          }
        })
      }).catch(() => {});
    },
    getSchoolMajors() {
      axios.post('/v1/groupon/get_school_majors', {
        user_type: 2
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.schools = resp.data.data
        }
      })
    },
    findGroupon(option) {
      this.loading.groupons = true
      if (option === 'school') {
        var school_id = this.school_id
        if (school_id != '') {
          this.getInstitutes(false)
        } else {
          this.institute_id = ''
          this.institute_major_id = ''
          this.institutes = []
          this.majors = []
        }
      } else if (option === 'institute') {
        var institute_id = this.institute_id
        if (institute_id != '') {
          this.getMajors(false)
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
          this.total_count = resp.data.total_count
          this.groupons = resp.data.data.map(el => {
            el.total_sales = priceFloat(el.total_sales)
            el.expire_at = moment.unix(el.expire_at).format('YYYY-MM-DD')
            return el
          })
        }
        this.loading.groupons = false
      })
    },
    getInstitutesOrMajors(option) {
      if (option === 'school') {
        var school_id = this.dialog_data.dialog_school_id
        if (school_id != '') {
          this.getInstitutes(true)
        } else {
          this.dialog_data.dialog_institute_id = ''
          this.dialog_data.dialog_institute_major_id = ''
          this.dialog_institutes = []
          this.dialog_majors = []
        }
      } else if (option === 'institute') {
        var institute_id = this.dialog_data.dialog_institute_id
        if (institute_id != '') {
          this.getMajors(true)
        } else {
          this.dialog_data.dialog_institute_major_id = ''
          this.dialog_majors = []
        }
      }
    },
    getInstitutes(is_dialog) {
      var school_id = is_dialog == true ? this.dialog_data.dialog_school_id : this.school_id
      var school = this.schools.find(el => {
        return el.id == school_id
      })
      if (is_dialog == true) {
        this.dialog_institutes = school.institutes
      } else {
        this.institutes = school.institutes
      }
    },
    getMajors(is_dialog) {
      var institute_id
      if (is_dialog == true) {
        institute_id = this.dialog_data.dialog_institute_id
        var dialog_institutes = this.dialog_institutes.find(el => {
          return el.id == institute_id
        })
        this.dialog_majors = dialog_institutes.majors
      } else {
        institute_id = this.institute_id
        var institute = this.institutes.find(el => {
          return el.id == institute_id
        })
        this.majors = institute.majors
      }
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
      this.size = 10
      this.findGroupon()
    },
    handleSizeChange(size) {
      this.size = size
      this.findGroupon()
    },
    handleCurrentChange(page) {
      this.page = page
      this.findGroupon()
    },
    openDialog(operate_type, index) {
      // 记录参数
      this.operate_type = operate_type
      // 设置修改状态为false
      this.edit_main_info = false
      this.edit_book_list = false
      // 清空班级购条目，可能是上次添加版机构的，也可能是上次啥看班级购的信息
      this.groupon_items = []
      if (index != null) {
        this.dialog_index = index
      } else {
        index = this.dialog_index
      }
      // 设置班级购说明为红色
      // this.$nextTick(_ => {
      //   $('#remark input').css("color", "#FF4949");
      // })
      // 打开dialog
      this.dialog_visible = true
      // 如果是添加版机构执行以下操作
      if (operate_type == 'add') {
        this.dialog_data = {
          dialog_school_id: '', // 学校id
          dialog_institute_id: '', // 学院id
          dialog_institute_major_id: '', // 专业id
          dialog_term_index: '', // 学期index
          dialog_class: '', // 班级购名称
          dialog_founder_name: '[官方] ' + localStorage.getItem('store_name'), // 创建人姓名
          dialog_founder_mobile: '', // 创建人电话
          dialog_expire_at: new Date(moment().add(4, 'months')), // 过期时间
          dialog_profile: '' // 备注
        }
        this.dialog_institutes = []
        this.dialog_majors = []
        this.edit_book_list = true
        // 否则执行以下操作
      } else {
        var groupon = this.groupons[index]
        if (groupon.founder_avatar != '' && groupon.founder_avatar.indexOf('http') == -1) {
          groupon.founder_avatar = 'http://images.goushuyun.cn/' + groupon.founder_avatar
        }
        this.dialog_groupon = groupon
        this.dialog_data.dialog_school_id = groupon.school_id
        this.getInstitutes(true)
        this.dialog_data.dialog_institute_id = groupon.institute_id
        this.getMajors(true)
        this.dialog_data = {
          dialog_school_id: groupon.school_id, // 学校id
          dialog_institute_id: groupon.institute_id, // 学院id
          dialog_institute_major_id: groupon.institute_major_id, // 专业id
          dialog_term_index: this.terms.indexOf(groupon.term), // 学期index
          dialog_class: groupon.class, // 班级购名称
          dialog_founder_name: groupon.founder_name, // 创建人姓名
          dialog_founder_mobile: groupon.founder_mobile, // 创建人电话
          dialog_expire_at: new Date(groupon.expire_at), // 过期时间
          dialog_profile: groupon.profile // 备注
        }
        // 去掉控件的错误提示
        this.$nextTick(() => {
          this.$refs['dialog_data'].validate()
        })
        // 获取班级购条目
        this.getGrouponItems(groupon.id)
        // 获取班级购修改日志
        this.getGrouponLog(groupon.id)
      }
    },
    searchGoods(query) {
      query = query.trim()
      if (query == '') {
        return
      }
      this.loading.select = true
      //isbn为空
      var is_isbn = isISBNFormat(query)
      var data = {}
      if (is_isbn == true) {
        // 如果是添加话题，则每次添加话题项之前判断列表中又没有这本书
        if (this.groupon_items.length > 0) {
          for (var i = 0; i < this.groupon_items.length; i++) {
            if (this.groupon_items[i].book.isbn == query) {
              this.$message.warning('该商品已存在')
              this.search_index = ''
              this.search_list = []
              $('#isbn_input input').focus()
              return
            }
          }
        }
        data = {
          "isbn": query, //not required 书本的isbn
          "search_amount": -100, //required -100 过滤这个线索 ;除了-100 的num 查找库存为num的数据
          "search_type": -100, //required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
          "search_picture": -100, //required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
        }
      } else {
        data = {
          "title": query, //not required 书本的isbn
          "search_amount": -100, //required -100 过滤这个线索 ;除了-100 的num 查找库存为num的数据
          "search_type": -100, //required -100 过滤这个线索 ; 0 检索新书数据 1 检索二手书数据
          "search_picture": -100, //required -100 过滤这个线索 0 查找图片不为空的商品 1查找图片为空的商品
        }
      }

      // 检查仓库中没有这本书
      axios.post("/v1/goods/search", data).then(resp => {
        if (resp.data.message == 'ok') {
          var goods_list = resp.data.data.map(goods => {
            if (goods.new_book) {
              goods.has_new_book = true
              goods.new_book.price = priceFloat(goods.new_book.price)
            } else {
              goods.has_new_book = false
            }

            if (goods.old_book) {
              goods.has_old_book = true
              goods.old_book.price = priceFloat(goods.old_book.price)
            } else {
              goods.has_old_book = false
            }

            goods.label = goods.book.title + '-' + goods.book.isbn
            return goods
          })
          this.loading.select = false
          this.search_list = goods_list
        } else {
          this.loading.select = false
          this.search_index = ''
          this.search_list = []
          $('#isbn_input input').focus()
        }
      })
    },
    handleSelect() {
      var item = this.search_list[this.search_index]
      if (item == undefined) {
        return
      }
      if (this.groupon_items.length > 0) {
        for (var i = 0; i < this.groupon_items.length; i++) {
          if (this.groupon_items[i].book.isbn == item.book.isbn) {
            this.$message.warning('该商品已存在')
            this.search_index = ''
            this.search_list = []
            $('#isbn_input input').focus()
            return
          }
        }
      }
      this.groupon_items.push(item)
      this.search_index = ''
      this.search_list = []
      $('#isbn_input input').focus()
    },
    removeItem(index) {
      this.groupon_items.splice(index, 1)
    },
    saveGroupon(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.groupon_items.length == 0) {
            this.$message.warning('尚未添加书籍！')
            return
          }
          this.loading.dialog = true
          // 获取创建者信息
          var adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
          // 获取戒指日期
          var expire_at = moment(this.dialog_data.dialog_expire_at, "YYYY-MM-DD").unix()
          // 获取班级购条目
          var items = []
          this.groupon_items.forEach(el => {
            items.push({
              goods_id: el.goods_id
            })
          })
          axios.post('/v1/groupon/save_groupon', {
            "school_id": this.dialog_data.dialog_school_id, //学校id  required
            "institute_id": this.dialog_data.dialog_institute_id, //学院id required
            "institute_major_id": this.dialog_data.dialog_institute_major_id, //专业id required
            "term": this.terms[this.dialog_data.dialog_term_index], //学期 required
            "class": this.dialog_data.dialog_class, //班级名称或者班级编号 required
            "founder_name": this.dialog_data.dialog_founder_name, //创建人姓名 required
            "founder_mobile": adminInfo.mobile, //创建人手机号 required
            "profile": this.dialog_data.dialog_profile, //简介
            "expire_at": expire_at, //过期时间 required
            "items": items
          }).then(resp => {
            if (resp.data.message == 'ok') {
              this.$message.success('班级购创建成功！')
              this.findGroupon()
              this.dialog_visible = false
            }
            this.loading.dialog = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveMainInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading.dialog = true
          axios.post('/v1/groupon/update_groupon', {
            "id": this.dialog_groupon.id,
            "school_id": this.dialog_data.dialog_school_id, //学校id  required
            "institute_id": this.dialog_data.dialog_institute_id, //学院id required
            "institute_major_id": this.dialog_data.dialog_institute_major_id, //专业id required
            "term": this.terms[this.dialog_data.dialog_term_index], //学期 required
            "class": this.dialog_data.dialog_class, //班级名称或者班级编号 required
            "founder_name": this.dialog_data.dialog_founder_name, //创建人姓名 required
            "founder_mobile": this.dialog_data.dialog_founder_mobile, //创建人手机号 required
            "profile": this.dialog_data.dialog_profile, //简介
            "expire_at": moment(this.dialog_data.dialog_expire_at, "YYYY-MM-DD").unix() //过期时间 required
          }).then(resp => {
            if (resp.data.message == 'ok') {
              this.$message.success('班级购信息修改成功！')
              this.edit_main_info = false
              this.getGrouponLog(this.dialog_groupon.id)
            }
            this.loading.dialog = false
          })
        } else {
          console.log('error submit!!');
          this.loading.dialog = false
          return false;
        }
      });
    },
    preEditBookList() {
      this.edit_book_list = true
      this.groupon_items_bak = this.groupon_items.slice(0)
      this.del_item_ids = []
      this.add_items = []
    },
    saveBookList() {
      var groupon_items = this.groupon_items
      var groupon_items_bak = this.groupon_items_bak
      var del_item_ids = []
      var add_items = []
      if (groupon_items.length == 0) {
        this.$message.warning('尚未添加书籍！')
        return
      }
      // groupon_items_bak.length 一定是大于0的
      // 寻找删除的条目
      groupon_items_bak.forEach(gib => {
        var del = true
        groupon_items.forEach(gi => {
          if (gib.goods_id == gi.goods_id) {
            del = false
          }
        })
        if (del) {
          del_item_ids.push({
            id: gib.id
          })
        }
      })
      // 寻找新增的条目
      groupon_items.forEach(gi => {
        var add = true
        groupon_items_bak.forEach(gib => {
          if (gi.goods_id == gib.goods_id) {
            add = false
          }
        })
        if (add) {
          add_items.push({
            goods_id: gi.goods_id
          })
        }
      })
      // 发送修改请求
      this.loading.dialog = true
      axios.post('/v1/groupon/update_groupon', {
        "id": this.dialog_groupon.id,
        "del_item_ids": del_item_ids,
        "add_items": add_items
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.$message.success('书籍列表修改成功！')
          this.edit_book_list = false
          this.getGrouponLog(this.dialog_groupon.id)
        }
        this.loading.dialog = false
      })
    },
    getGrouponItems(id) {
      this.loading.dialog = true
      axios.post('/v1/groupon/groupon_items', {
        id
      }).then(resp => {
        if (resp.data.message == 'ok') {
          var groupon_items = []
          resp.data.data.forEach(el => {
            var groupon_item = {
              id: el.id,
              book: {
                isbn: el.book_isbn,
                title: el.book_title,
                author: el.book_author,
                image: el.book_image
              },
              goods_id: el.goods_id,
              new_book: {
                price: priceFloat(el.new_book_price),
                amount: el.new_book_amount
              },
              old_book: {
                price: priceFloat(el.old_book_price),
                amount: el.old_book_amount
              },
              has_new_book: el.has_new_book,
              has_old_book: el.has_old_book
            }
            groupon_items.push(groupon_item)
          })
          this.groupon_items = groupon_items
        }
        this.loading.dialog = false
      })
    },
    getGrouponLog(id) {
      this.loading.dialog = true
      axios.post('/v1/groupon/groupon_log', {
        id
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.groupon_logs_bak = resp.data.data.map(el => {
            el.create_at = moment.unix(el.create_at).format('YYYY-MM-DD HH:mm:ss')
            switch (el.operate_type) {
              case 'create':
                el.operate_type = '创建'
                break;
              case 'update':
                el.operate_type = '更新'
                break;
              case 'share':
                el.operate_type = '分享'
                break;
              case 'purchase':
                el.operate_type = '购买'
                break;
              default:
            }
            return el
          })
          this.groupon_logs = this.groupon_logs_bak.slice(0, 5)
        }
        this.loading.dialog = false
      })
    },
    showAllLogs() {
      var len = this.groupon_logs.length
      var lenb = this.groupon_logs_bak.length
      this.groupon_logs = this.groupon_logs_bak.slice(0, lenb)
    },
    closeAllLogs() {
      this.groupon_logs = this.groupon_logs_bak.slice(0, 5)
    },
    handleSelectionChange(val) {
      this.selected_groupons = val
    },
    preResetExpireAt() {
      if (this.selected_groupons.length == 0) {
        this.$message.warning('没有选中任何班级购！')
        return
      }
      this.reset_dialog = {
        visible: true,
        reset_expire_at: '', // 批量修改日期
      }
    },
    confirmResetExpireAt() {
      var update_ids = []
      this.selected_groupons.forEach(el => {
        update_ids.push({
          id: el.id
        })
      })
      var expire_at = moment(this.reset_dialog.reset_expire_at, "YYYY-MM-DD").unix()
      axios.post('/v1/groupon/reset_expire_at', {
        update_ids,
        expire_at
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.$message.success('批量修改日期成功！')
          this.reset_dialog = {
            visible: false,
            reset_expire_at: '', // 批量修改日期
          }
          this.findGroupon()
        }
      })
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
    padding-top: 20px;
    border-radius: 8px;
    background-color: #EEF1F6;
    .class_buy_info {
        width: 400px;
        p {
            height: 44px;
            line-height: 44px;
            label {
                margin: 0 10px;
            }
        }
        .el-input,
        .el-select {
          width: 190px;
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
        color: #1F2D3D;
        border-bottom: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
        box-sizing: border-box;
    }
}
.reset_dialog {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
