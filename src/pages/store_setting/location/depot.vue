<template lang="html">
  <div class="body">
    <div v-for="(store,index) in locations" class="box-card" @click="goToShelf(index)" @mouseover="store.active = true" @mouseleave="store.active = false">
      <div class="item">{{store.name}}</div>
      <div class="item">{{store.name}}</div>
      <div class="delete_btn" style="text-align:right">
        <i v-show="store.active" style="color:#FF4949;" class="el-icon-delete2" @click.stop="deleteLocations(store.id)"></i>
      </div>
    </div>

    <div class="box-card" @click="addLocation">
      <el-button style="width:100%;height:100%;" type="text">新增仓库</el-button>
    </div>

  </div>
</template>

<script>
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            locations: []
        };
    },
    mounted() {
        this.getLocations()
    },
    methods: {
        deleteLocations(id) {
          this.$confirm('您正在执行删除操作, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              axios.post('/v1/location/del_location', {
                  id: id
              }).then(resp => {
                  if (resp.data.message == 'ok') {
                      this.$message.success('删除成功!');
                      this.getLocations()
                  }
              });
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
        },
        goToShelf(index) {
            var id = this.locations[index].id
            var name = this.locations[index].name
            this.$router.push({
                name: 'shelf',
                query: {
                    id,
                    name
                }
            })
        },
        addLocation() {
            this.$prompt('请输入仓库名称', '仓库名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({
                value
            }) => {
                // add store
                let name = value.trim()
                axios.post('/v1/location/add_location', {
                    name
                }).then(resp => {
                    if (resp.data.message = 'ok') {
                        this.getLocations()
                    }
                    this.$message.success('仓库添加成功！')
                })
            }).catch(() => {
                this.$message.info('已取消输入')
            });
        },
        getLocations() {
            axios.post('/v1/location/list_location', {
                level: 0
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.locations = resp.data.data.map(rs => {
                        rs.active = false
                        return rs
                    })
                }
            }).catch(() => {
                return false
            });
        }
    }
}
</script>

<style lang="scss" scoped>@import "../../../common/_color.scss";
.body {
    background-color: white;
    padding: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.item {
    padding: 18px 0;
    width: auto;
    text-align: center;
}

.box-card {
    position: relative;
    font-size: 14px;
    height: 100px;
    width: 100px;
    margin: 10px;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #D1DBE5;
    box-shadow: 0 0 10px rgba(0, 0, 0,.1);
    &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0,.3);
    }
    .delete_btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }
}
.add {
    font-size: 50px;
    background-color: white;
    line-height: 100px;
    text-align: center;
    color: $bg_grey;
    &:hover {
        color: lighten($blue, 12%);
        cursor: pointer;
        border: 1px solid lighten($blue, 16%);
    }
}
</style>
