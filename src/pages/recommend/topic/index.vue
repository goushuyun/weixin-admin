<template lang="html">
  <div class="container">
      <div class="top_bar">
          <h2 class="title">话题推荐</h2>
      </div>

      <div class="content_inner" v-loading.body="loading" element-loading-text="拼命加载中">
          <div class="add_topic">
            <el-button id="add_topic_btn" type="primary" size="small" icon="plus" :disabled="topics.length >= 20" @click="addTopic">添加话题</el-button>
            <label for="add_topic_btn" style="margin-left:10px;color:#888">最多添加 20 个话题</label>
          </div>
          <el-table :data="topics" border stripe style="width: 100%">
            <el-table-column width="60" type="index">
            </el-table-column>
            <el-table-column prop="sort" label="优先级" width="180">
                <template scope="scope">
                    <el-rate v-model="scope.row.sort" :max="3" show-text :texts="['低','中','高']" @change="updateTopicSort(scope.row.id,scope.row.sort)"></el-rate>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="话题名" width="180">
            </el-table-column>
            <el-table-column prop="item_count" label="书籍数量" width="180">
            </el-table-column>
            <el-table-column prop="status" label="推荐状态" width="180">
              <template scope="scope">
                <p style="color: #13CE66;" v-if="scope.row.status == 1">推荐中</p>
                <p v-if="scope.row.status == 2">未推荐</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                  <el-button-group size="small">
                      <el-button size="small" type="success" @click="editTopic(scope.$index)">编辑</el-button>
                      <el-button size="small" type="primary" @click="updateTopicStatus(scope.row.id,scope.row.status)">更改推荐状态</el-button>
                      <el-button size="small" type="danger" @click="deleteTopic(scope.row.id)">删除</el-button>
                  </el-button-group>
              </template>
            </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            topics: [],
            loading: false
        }
    },
    mounted() {
        //首页加载完成之后，立马罗列所有图书话题
        this.getShopTopic()
    },
    methods: {
        getShopTopic() {
            this.loading = true
            axios.post('/v1/topic/search', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.topics = resp.data.data
                }
                this.loading = false
            })
        },
        updateTopicStatus(id, status) {
            axios.post('/v1/topic/update', {
                "id": id, //话题的id
                "status": status % 2 + 1
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('更新成功！')
                    this.getShopTopic()
                }
            })
        },
        updateTopicSort(id, sort) {
            console.log(id + '-- 等级 -->' + sort);
            axios.post('/v1/topic/update', {
                "id": id, //话题的id
                "sort":sort
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.info('更新成功！')
                    this.getShopTopic()
                }
            })
        },
        editTopic(index) {
            let topic = this.topics[index]
            this.$router.push({
                name: 'add_topic',
                query: {
                    topic_id: topic.id,
                    // status: topic.status,
                    title: topic.title
                }
            })
        },
        deleteTopic(id) {
            this.$confirm('你确定要删除这个话题吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/v1/topic/del', {
                    "id": id, //话题id
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        this.$message.info('已删除！')
                        this.getShopTopic()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            })
        },
        addTopic() {
            this.$router.push('add_topic')
        }
    }
}
</script>

<style lang="scss" scoped>
.add_topic {
    padding: 10px 0 20px;
}
.el-select {
    width: 140px;
    input {
        width: 140px;
    }
}
</style>
