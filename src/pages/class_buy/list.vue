<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">班级购列表</h2>
    </div>
    <div class="content_inner">
      <el-form :inline="true">
          <el-form-item>
              <el-select v-model="school_id" style="width: 170px;" clearable placeholder="全部学校" size="small" @change="">
                  <el-option label="全部学校" value=""></el-option>
                  <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="institution_id" style="width: 170px;" clearable placeholder="全部学院" size="small" @change="">
                <el-option label="全部学院" value=""></el-option>
                <el-option v-for="institution in institutions" :label="institution.name" :value="institution.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="profession_id" style="width: 170px;" clearable placeholder="全部专业" size="small" @change="">
                <el-option label="全部专业" value=""></el-option>
                <el-option v-for="profession in professions" :label="profession.name" :value="profession.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-select v-model="expired" style="width: 115px;" clearable placeholder="是否过期" size="small" @change="">
                  <el-option label="是否过期" value=""></el-option>
                  <el-option label="未过期" :value="79"></el-option>
                  <el-option label="已过期" :value="80"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-input placeholder="搜索值" v-model.trim="search_value" style="width: 270px;" size="small" icon="search" @input="">
                  <el-select v-model="search_type" style="width: 125px;" clearable slot="prepend" placeholder="筛选条件" size="small" @change="">
                      <el-option label="编号" value="order"></el-option>
                      <el-option label="班级名/班号" value="mobile"></el-option>
                      <el-option label="发布人姓名" value="name"></el-option>
                      <el-option label="发布人手机" value="isbn"></el-option>
                  </el-select>
              </el-input>
          </el-form-item>
          <el-form-item>
              <el-button @click="" size="small" type="primary"><i class="fa fa-refresh" aria-hidden="true"></i> 重置</el-button>
          </el-form-item>
      </el-form>

      <div class="row">
        <el-radio-group v-model="order_status" size="small" @change="">
          <el-radio-button :label="1">官方班级购</el-radio-button>
          <el-radio-button :label="2">其他版机构</el-radio-button>
          <el-radio-button :label="3">全部班级购</el-radio-button>
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

      <el-dialog title="创建班级购" top="5%" size="full" :visible.sync="dialogTableVisible">
        <div class="head_area row">
          <div class="avatar_area">
              <img :src="'http://image.goushuyun.cn/book.png'" class="image"></img>
          </div>
          <div class="class_name_id">
            <p class="name">131042Y1班</p>
            <p class="id">#110</p>
          </div>
          <div class="total_sales">
            <span><i class="iconfont icon-moneybag moneyicon"></i></span>
            <span>1895.12</span>
          </div>
        </div>
        <div class="class_buy_area">
          <div class="class_buy_info">
            <p>
              <label>学校</label>
              <el-select v-model="school_id" clearable placeholder="全部学校" size="small" @change="">
                <el-option v-for="school in schools" :label="school.name" :value="school.id"></el-option>
              </el-select>
            </p>
            <p>
              <label>学院</label>
              <el-select v-model="institution_id" clearable placeholder="全部学院" size="small" @change="">
                <el-option v-for="institution in institutions" :label="institution.name" :value="institution.id"></el-option>
              </el-select>
            </p>
            <p>
              <label>专业</label>
              <el-select v-model="profession_id" clearable placeholder="全部专业" size="small" @change="">
                <el-option v-for="profession in professions" :label="profession.name" :value="profession.id"></el-option>
              </el-select>
            </p>
            <p>
              <label>学期</label>
              <el-select v-model="semester_id" clearable placeholder="全部专业" size="small" @change="">
                <el-option v-for="semester in semesters" :label="semester.name" :value="semester.id"></el-option>
              </el-select>
            </p>
          </div>
          <div class="class_buy_info">
            <p>
              <label>班级购名称</label>
              <el-input style="width: auto" placeholder="班级购名" size="small"></el-input>
            </p>
            <p>
              <label>发布人姓名</label>
              <el-input style="width: auto" placeholder="发布人姓名" size="small"></el-input>
            </p>
            <p>
              <label>截 止 日 期</label>
              <el-date-picker v-model="deadline" style="width: 180px;" type="date" placeholder="选择日期" size="small" :picker-options="pickerOptions"></el-date-picker>
            </p>
            <p>
              <label>班级购备注</label>
              <el-input style="width: auto" placeholder="备注" size="small"></el-input>
            </p>
          </div>
        </div>

        <el-form :inline="true" style="margin-top: 15px;">
            <el-form-item label="添加书籍" :rules="[{ required: true, trigger: 'blur' }]">
                <el-input style="width: auto" placeholder="请输入isbn编码" size="small" icon="search"></el-input>
            </el-form-item>
        </el-form>

        <div class="table_area">
          <el-table :data="tableData">
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
                <el-button type="text">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="height: 30px;">
          <el-button style="float: right; margin: 20px;" type="primary" size="small">创建</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      school_id: '',
      institution_id: '',
      profession_id: '',
      semester_id: '',
      expired: '',
      search_value: '',
      search_type: 'order',
      order_status: 1,

      schools: [],
      institutions: [],
      professions: [],

      dialogTableVisible: true,

      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      deadline: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
    margin-bottom: 15px;
    width: auto;
}
.head_area {
  padding: 0 0 10px 15px;
  display: flex;
  align-items: center;
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
.class_buy_area {
    display: flex;
    align-items: center;
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
</style>
