<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">班级购设置</h2>
    </div>
    <div class="content_inner" style="min-height: 200px;" v-loading.body="loading" element-loading-text="拼命加载中">
      <div class="school_majors">
        <div class="row" v-if="!school_majors.length">
          <div class="order_item">
            <div class="title" style="text-align:center">暂无数据</div>
          </div>
        </div>
        <div class="school" v-for="(school, s_index) in school_majors">
          <el-collapse v-model="opens">
            <el-collapse-item :name="school.id">
              <template slot="title">
                <span class="school_name">{{school.name}}</span>
                <el-button class="btn_add" type="primary" size="mini" @click.stop="preAddInstitute(s_index)">添加学院</el-button>
              </template>

              <!-- 添加 “学院” 时显示以下部分 -->
              <div class="institution" v-if="school.add == true">
                <el-input :id="'add_institution_' + s_index" style="max-width:200px;" size="small" v-model="add_institution_name" @keyup.enter.native="comfirmAddInstitute(s_index)"></el-input>
                <el-button-group>
                  <el-button type="text" style="color:#13CE66; margin-left: 10px;" icon="check" size="large" @click="comfirmAddInstitute(s_index)"></el-button>
                  <el-button type="text" style="color:#8492A6; margin-left: 10px;" icon="close" size="large" @click="cancelAddInstitute(s_index)"></el-button>
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
                    <el-button type="disabled" size="mini" @click="delSchoolInstitute(s_index, i_index)">删除</el-button>
                  </el-button-group>
                </span>

                <!-- 添加 “专业” 时显示以下部分 -->
                <div class="discipline" v-if="institute.add == true">
                  <el-autocomplete :id="'add_major_s_' + s_index + '_i_' + i_index" style="max-width:200px;" size="small"
                    v-model="add_major_name" :fetch-suggestions="searchSharedMajor" placeholder="请输入专业" :trigger-on-focus="false"
                    @keyup.enter.native.capture="comfirmAddMajor(s_index, i_index)">
                  </el-autocomplete>
                  <el-button-group>
                    <el-button type="text" style="color:#13CE66; margin-left: 10px;" icon="check" size="large" @click="comfirmAddMajor(s_index, i_index)"></el-button>
                    <el-button type="text" style="color:#8492A6; margin-left: 10px;" icon="close" size="large" @click="cancelAddMajor(s_index, i_index)"></el-button>
                  </el-button-group>
                </div>

                <!-- 如果没有专业，则显示以下部分 -->
                <div class="discipline" v-if="institute.majors.length == 0">
                  <span style="color: #999">· 点击右上方的 <el-button type="text" @click="preAddMajor(s_index, i_index)">添加专业</el-button> 按钮</span>
                </div>

                <div class="discipline" v-for="(major, m_index) in institute.majors">
                  <span>· {{major.name}}</span>
                  <span style="float: right;">
                    <el-button type="disabled" size="mini" @click="delInstituteMajor(s_index, i_index, m_index)">删除</el-button>
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
      add_major_name: '', // 要添加专业的名称
      activeNames: ['1'], // 用于打开 collapse
      school_majors: [], // 本页面全部数据：学校 - 学院 - 专业

      loading: false,

      opens: []
    }
  },
  mounted() {
    this.getSchoolMajors()
  },
  methods: {
    getSchoolMajors() {
      this.loading = true
      axios.post('/v1/groupon/get_school_majors', {}).then(resp => {
        if (resp.data.message == 'ok') {
          if (resp.data.data.length > 0) {
            this.school_majors = resp.data.data.map(school => {
              school.add = false
              school.institutes.map(institute => {
                institute.add = false
                return institute
              })
              return school
            })
          } else {
            this.$alert('请移步“经营学校”添加学校', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$store.commit('setMenuActive','5-2')
                    localStorage.setItem('menu_active', '5-2')
                    console.log(this.$store.state.menu_active);
                    this.$router.push({
                        name: 'school',
                        params: {
                            activeName: 'school'
                        }
                    })
                }
            });
          }
        }
        this.loading = false
      })
    },
    preAddInstitute(s_index) {
      this.school_majors[s_index].add = true
      this.$nextTick(() => {
        $('#add_institution_' + s_index + ' input').focus()
        if (this.opens.indexOf(this.school_majors[s_index].id) < 0) {
          this.opens.push(this.school_majors[s_index].id)
        }
      })
    },
    cancelAddInstitute(s_index) {
      this.school_majors[s_index].add = false
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
          var institute = resp.data.data
          institute.add = false
          this.school_majors[s_index].institutes.unshift(institute)
          this.school_majors[s_index].add = false
          this.$message.success('添加成功！')
        }
      })
    },
    preAddMajor(s_index, i_index) {
      this.add_major_name = ''
      this.school_majors[s_index].institutes[i_index].add = true
      this.$nextTick(() => {
        $('#add_major_s_' + s_index + '_i_' + i_index + ' input').focus()
      })
    },
    cancelAddMajor(s_index, i_index) {
      this.school_majors[s_index].institutes[i_index].add = false
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
    searchSharedMajor(query, cb) {
      if (query !== '') {
        query = query.replace(/'/g, "").trim()
        axios.post('/v1/groupon/search_shared_major', {
          "name": query, //专业名称
          "page": 1,
          "size": 15
        }).then(resp => {
          if (resp.data.message == 'ok') {
            cb(resp.data.data.map(el => {
              el.value = el.name
              return el
            }));
          }
        })
      }
    },
    delSchoolInstitute(s_index, i_index) {
      var id = this.school_majors[s_index].institutes[i_index].id
      this.$confirm('此操作将永久删除该学院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/v1/groupon/del_school_institute', {
          id
        }).then(resp => {
          this.school_majors[s_index].institutes.splice(i_index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    delInstituteMajor(s_index, i_index, m_index) {
      var id = this.school_majors[s_index].institutes[i_index].majors[m_index].id
      this.$confirm('此操作将永久删除该专业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/v1/groupon/del_institute_major', {
          id
        }).then(resp => {
          this.school_majors[s_index].institutes[i_index].majors.splice(m_index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.school_majors {
    // height: auto;
    // column-count: 2;
    // column-gap: 0;
    .row {
      .order_item {
          border: 1px solid #DFE6EC;
          margin-bottom: 15px;
          font-size: 13px;
          color: #1F2D3D;
          font-family: "Helvetica Neue";
          .title {
              background-color: #EEF1F6;
              height: 40px;
              line-height: 40px;
              width: 100%;
          }
       }
    }
}
.school {
    width: 60%;
    min-width: 450px;
    max-width: 600px;
    padding: 10px;
    break-inside: avoid;
    box-sizing: border-box;
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
.el-button--disabled {
    color: #fff;
    background-color: #A8B9C3;
    border-color: #A8B9C3;
}
</style>
