<template lang="html">
  <div class="container">
    <div class="top_bar">
        <h2 class="title">班级购设置</h2>
    </div>
    <div class="content_inner">
      <el-collapse v-model="activeNames" class="school">
        <el-collapse-item name="1">
          <template slot="title">
            <span class="school_name">上海应用技术大学</span>
            <el-button class="btn_add" type="info" size="mini">添加学院</el-button>
          </template>
          <div class="institution">
            <span>工程创新学院</span>
            <span style="float: right;">
              <el-button type="info" size="mini">添加专业</el-button>
              <el-button type="danger" size="mini">删除</el-button>
            </span>
            <div class="discipline">
              <span>· 软件工程</span>
              <span style="float: right;">
                <el-button type="danger" size="mini">删除</el-button>
              </span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  data() {
    return {
      activeNames: ['1']
    }
  },

  methods: {
    handleChange() {

    }
  }
};
</script>

<style lang="scss" scoped>
.school {
    width: 500px;
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
