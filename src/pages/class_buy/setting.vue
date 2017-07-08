<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">班级购设置</h2>
    </div>
    <div class="content_inner" style="min-height: 500px;">
      <div class="school_majors">
        <div class="school" v-for="(school, s_index) in school_majors">
          <el-collapse value="default_open">
            <el-collapse-item name="default_open">
              <template slot="title">
                <span class="school_name">{{school.name}}</span>
                <el-button class="btn_add" type="primary" size="mini" @click.stop="preAddInstitute(s_index)">添加学院</el-button>
              </template>

              <!-- 添加 “学院” 时显示以下部分 -->
              <div class="institution" v-if="school.add == true">
                <el-input :id="'add_institution_' + s_index" style="max-width:200px;" size="small" v-model="add_institution_name" @blur="comfirmAddInstitute(s_index)"></el-input>
                <el-button-group>
                  <el-button type="text" style="color:#13CE66; margin-left: 10px;" icon="check" size="large" @click="comfirmAddInstitute(s_index)"></el-button>
                </el-button-group>
              </div>

              <!-- 如果没有学院，则显示以下部分 -->
              <div class="institution" v-if="school.institutes.length == 0">
                <span>点击右上方的 <el-button type="text" @click.stop="preAddInstitute(s_index)">添加学院</el-button> 按钮</span>
              </div>

              <div class="institution" v-else v-for="(institute, i_index) in school.institutes">
                <span>{{institute.name}}</span>
                <span style="float: right;">
                  <el-button-group>
                    <el-button type="primary" size="mini" @click.stop="preAddMajor(s_index, i_index)">添加专业</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                  </el-button-group>
                </span>

                <!-- 添加 “专业” 时显示以下部分 -->
                <div class="discipline" v-if="institute.add == true">
                  <el-select v-if="manual_add == false" :id="'add_major_s_' + s_index + '_i_' + i_index" size="small" v-model="add_major_name" filterable remote placeholder="请输入关键词"
                      :remote-method="searchSharedMajor" :loading="loading">
                      <el-option v-for="major in shared_majors" :key="major.id" :label="major.name" :value="major.name"></el-option>
                  </el-select>
                  <el-button-group v-if="manual_add == false">
                    <el-button type="success" size="mini" @click="comfirmAddMajor(s_index, i_index)">确认</el-button>
                    <el-button type="primary" size="mini" @click="cancelAddMajor(s_index, i_index)">取消</el-button>
                    <el-button type="warning" size="mini" @click="manualAddMajor(s_index, i_index)">手动添加</el-button>
                  </el-button-group>

                  <!-- 手动添加展示以下部分 -->
                  <el-input v-if="manual_add == true" :id="'add_major_s_' + s_index + '_i_' + i_index" style="max-width:200px;" size="small" v-model="add_major_name" @blur="comfirmAddMajor(s_index, i_index)"></el-input>
                  <el-button-group v-if="manual_add == true">
                    <el-button type="text" style="color:#13CE66; margin-left: 10px;" icon="check" size="large" @click="comfirmAddMajor(s_index, i_index)"></el-button>
                  </el-button-group>
                </div>

                <!-- 如果没有专业，则显示以下部分 -->
                <div class="discipline" v-if="institute.majors.length == 0">
                  <span style="color: #999">· 点击右上方的 <el-button type="text" @click="preAddMajor(s_index, i_index)">添加专业</el-button> 按钮</span>
                </div>

                <div class="discipline" v-for="(major, m_index) in institute.majors">
                  <span>· {{major.name}}</span>
                  <span style="float: right;">
                    <el-button type="danger" size="mini">删除</el-button>
                  </span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../scripts/http"
let id = 1000;
export default {
  data() {
    return {
      add_institution_name: '', // 要添加学院的名称
      add_major_name: '',       // 要添加专业的名称
      loading: false,           // 检索专业的时 loading
      activeNames: ['1'],       // 用于打开 collapse
      school_majors: [],        // 本页面全部数据：学校 - 学院 - 专业

      manual_add: false,
      shared_majors: []         // 远程检索出来的专业列表
    }
  },
  mounted() {
    this.getSchoolMajors()
  },
  methods: {
    getSchoolMajors() {
      axios.post('/v1/groupon/get_school_majors', {}).then(resp => {
        if (resp.data.message == 'ok') {
          this.school_majors = resp.data.data.map(school => {
            school.add = false
            school.institutes.map(institute => {
              institute.add = false
              return institute
            })
            return school
          })
        }
      })
    },
    preAddInstitute(s_index) {
      this.school_majors[s_index].add = true
      this.$nextTick(() => {
        $('#add_institution_' + s_index + ' input').focus()
      })
    },
    comfirmAddInstitute(s_index) {
      if (this.add_institution_name == '') {
        this.$message.warning('未输入任何内容')
        this.school_majors[s_index].add = false
        return
      }
      axios.post('/v1/groupon/save_institute', {
        "school_id": this.school_majors[s_index].id,
        "name": this.add_institution_name
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.school_majors[s_index].institutes.unshift(resp.data.data)
          this.school_majors[s_index].add = false
          this.$message.success('添加成功！')
        }
      })
    },
    preAddMajor(s_index, i_index) {
      this.add_major_name = ''
      this.shared_majors = []
      this.manual_add = false
      this.school_majors[s_index].institutes[i_index].add = true
      this.$nextTick(() => {
        $('#add_major_s_' + s_index + '_i_' + i_index + ' input').focus()
      })
    },
    cancelAddMajor(s_index, i_index) {
      this.school_majors[s_index].institutes[i_index].add = false
    },
    manualAddMajor(s_index, i_index) {
      this.manual_add = true
      this.$nextTick(() => {
        $('#add_major_s_' + s_index + '_i_' + i_index + ' input').focus()
      })
    },
    comfirmAddMajor(s_index, i_index) {
      if (this.add_major_name == '') {
        this.$message.warning('未输入任何内容')
        this.school_majors[s_index].institutes[i_index].add = false
        return
      }
      axios.post('/v1/groupon/save_institute_major', {
        "institute_id": this.school_majors[s_index].institutes[i_index].id,
        "name": this.add_major_name
      }).then(resp => {
        if (resp.data.message == 'ok') {
          this.school_majors[s_index].institutes[i_index].majors.unshift(resp.data.data)
          this.school_majors[s_index].institutes[i_index].add = false
          this.$message.success('添加成功！')
        }
      })
    },
    searchSharedMajor(query) {
      if (query !== '') {
        this.loading = true
        query = query.replace(/'/g,"").trim()
        axios.post('/v1/groupon/search_shared_major', {
          "name": query, //专业名称
          "page": 1,
          "size": 15
        }).then(resp => {
          if (resp.data.message == 'ok') {
            this.shared_majors = resp.data.data
            this.loading = false
          }
        })
      } else {
        this.shared_major = []
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.school_majors {
    display: flex;
    flex-wrap: wrap;
}
.school {
    min-width: 420px;
    margin: 10px;
    .school_name {
        font-size: 16px;
        font-weight: bold;
    }
    .btn_add {
        float: right;
        margin-right: 20px;
        position: relative;
        top: 10px;
    }
    .institution {
        font-size: 14px;
        padding: 5px;
    }
    .discipline {
        padding: 5px 0 5px 20px;
    }
}
</style>
