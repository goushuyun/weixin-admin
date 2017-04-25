<template lang="html">
  <div class="body">
    <div class="header">
      <el-row type="flex" justify="space-between">
        <el-col>
          <div>
            <label v-if="!update_depot" class="margin_right20">{{p_depot.name}}</label>
            <el-input id="adepot_name" v-else class="margin_right20" style="max-width:200px;" size="small" v-model="p_depot.update_name" v-on:keyup.enter.native="confirmUpdateDepot"></el-input>
            <el-button v-if="!update_depot" type="text" @click="proUpdateDepot">修改</el-button>
            <el-button v-if="update_depot" type="text" @click="confirmUpdateDepot">确定</el-button>
            <el-button v-if="update_depot" type="text" style="color:#13CE66" @click="update_depot = false">取消</el-button>
          </div>
        </el-col>
        <el-col style="text-align:right;padding-right:30px;">
          <span class="margin_right20">本仓库共有 <span style="color:#20A0FF;font-size:18px;">{{locations.length}}</span> 个货架</span>
          <el-button type="primary" size="small" icon="plus" @click="addShelf">添加货架</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="locations">
        <div v-for="(shelf,s_index) in locations" class="box-card">
            <div class="title">
              <label v-if="!shelf.update">{{shelf.name}}</label>
              <el-input :id="'shelf_' + s_index" v-else style="max-width:200px;" size="small" v-model="shelf.name" @blur="comfirmUpdate(shelf.id,shelf.name,s_index)" v-on:keyup.enter.native="comfirmUpdate(shelf.id,shelf.name,s_index)"></el-input>
              <el-button-group>
                  <el-button class="btn" type="text" icon="plus" size="large" @click="preAddFloor(s_index)"></el-button>
                  <el-button v-if="!shelf.update" class="btn" type="text" icon="edit" size="large" @click="preUpdateShelf(s_index)"></el-button>
                  <el-button v-if="shelf.update" class="btn" type="text" style="color:#13CE66" icon="check" size="large" @click="comfirmUpdate(shelf.id,shelf.name,s_index)"></el-button>
                  <el-button class="btn" type="text" style="color:#FF4949" icon="delete" size="large" @click="deleteLocations(shelf.id)"></el-button>
              </el-button-group>
            </div>
            <div v-for="(floor,f_index) in shelf.children" class="item">
              <label v-if="!floor.update">{{floor.name}}</label>
              <el-input :id="'shelf_' + s_index + '_floor_' + f_index" v-else style="max-width:200px;" size="small" v-model="floor.name" @blur="comfirmUpdate(floor.id,floor.name,s_index,f_index)" v-on:keyup.enter.native="comfirmUpdate(floor.id,floor.name,s_index,f_index)"></el-input>
              <el-button-group>
                  <el-button v-if="!floor.update" class="btn" type="text" icon="edit" @click="preUpdateFloor(s_index,f_index)"></el-button>
                  <el-button v-if="floor.update" class="btn" type="text" style="color:#13CE66" icon="check" size="large" @click="comfirmUpdate(floor.id,floor.name,s_index,f_index)"></el-button>
                  <el-button class="btn" type="text" style="color:#FF4949" icon="delete" @click="deleteLocations(floor.id)"></el-button>
              </el-button-group>
            </div>
            <div v-if="shelf.add" class="item">
              <el-input :id="'add_shelf_' + s_index" style="max-width:200px;" size="small" v-model="add_floor.name" @blur="comfirmAddFloor(shelf.id,s_index)"></el-input>
              <el-button-group>
                  <el-button v-if="shelf.add" class="btn" type="text" style="color:#13CE66" icon="check" size="large" @click="comfirmAddFloor(shelf.id,s_index)"></el-button>
              </el-button-group>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            update_depot: false,
            add_floor: {
                level: 2,
                pid: '',
                name: ''
            },
            update_floor: false,
            p_depot: {
                id: '',
                name: '',
                update_name: '' //用于绑定修改但未保存的仓库名称
            },
            locations: []
        };
    },
    mounted() {
        this.p_depot.id = this.$route.params.id
        this.p_depot.name = this.$route.params.name
        this.getLocations()
    },
    methods: {
        // 获取本页数据 --> 货架、货架层
        getLocations() {
            axios.post('/v1/location/list_children_location', {
                id: this.p_depot.id,
                level: 2
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.locations = resp.data.data.map(d => {
                        d.update = false
                        d.add = false
                        d.children.map(s => {
                            s.update = false
                            return s
                        })
                        return d
                    })
                    console.log(this.locations);
                }
            }).catch(() => {
                return false
            });
        },

        // 点击修改 仓库名称 自动聚焦
        proUpdateDepot() {
            this.update_depot = true
            this.p_depot.update_name = this.p_depot.name
            this.$nextTick(() => {
                $('#adepot_name input').focus()
            })
        },
        // 确定修改 仓库名称
        confirmUpdateDepot() {
            if (this.p_depot.update_name == '') {
                this.$message.warning('未输入任何内容')
                return
            }
            axios.post('/v1/location/update_location', {
                id: this.p_depot.id,
                name: this.p_depot.update_name
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.p_depot.name = this.p_depot.update_name
                    this.update_depot = false
                    this.$message.success('修改成功')
                }
            })
        },

        // 添加货架
        addShelf() {
            this.$prompt('请输入货架名称', '货架名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({
                value
            }) => {
                let name = value.trim()
                axios.post('/v1/location/add_location', {
                    level: 1,
                    name: name,
                    pid: this.p_depot.id
                }).then(resp => {
                    if (resp.data.message = 'ok') {
                        this.getLocations()
                    }
                    this.$message.success('货架添加成功！')
                })
            }).catch(() => {
                this.$message.info('取消输入')
            });
        },
        // 点击添加 货架层 自动聚焦
        preAddFloor(s_index) {
            this.locations[s_index].add = true
            this.add_floor = {
                level: 2,
                pid: '',
                name: ''
            }
            this.$nextTick(function() {
                $('#add_shelf_' + s_index + ' input').focus()
            })
        },
        // 确定添加 货架层
        comfirmAddFloor(id, s_index) {
            if (this.add_floor.name.trim() != '') {
                this.add_floor.pid = id
                axios.post('/v1/location/add_location', this.add_floor).then(resp => {
                    if (resp.data.message = 'ok') {
                        // 添加 货架层 后重新获取本页数据
                        this.getLocations()
                    }
                    this.$message.success('添加成功！')
                })
            } else {
                this.$message.warning('没输入任何内容！')
            }
            this.locations[s_index].add = false
        },

        // 点击修改 货架名称 自动聚焦
        preUpdateShelf(s_index) {
            this.locations[s_index].update = true
            this.$nextTick(() => {
                $('#shelf_' + s_index + ' input').focus()
            })
        },
        // 点击修改 货架层 名称自动聚焦
        preUpdateFloor(s_index, f_index) {
            this.locations[s_index].children[f_index].update = true
            this.$nextTick(() => {
                $('#shelf_' + s_index + '_floor_' + f_index + ' input').focus()
            })
        },
        // 确定修改 货架名称 或者 货架层名称
        comfirmUpdate(id, name, s_index, f_index) {
            if (name == '') {
                this.$message.warning('未输入任何内容')
                this.getLocations()
                return
            }
            var data = {
                id,
                name
            }
            axios.post('/v1/location/update_location', data).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('修改成功')
                }
            })
            if (f_index != undefined) {
                this.locations[s_index].children[f_index].update = false
            } else {
                this.locations[s_index].update = false
            }
        },

        // 删除 货架 或者 货架层
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
        }
    }
}
</script>

<style lang="scss" scoped>@import "../../../common/_color.scss";
.body {
    background-color: white;
    .header {
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin: 5px;
        padding: 10px;
        border-bottom: 1px solid #D1DBE5;
    }
    .locations {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
        .box-card {
            position: relative;
            font-size: 14px;
            width: 400px;
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
            .item {
                padding: 8px;
                width: auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                &:hover {
                    background-color: #EEF1F6;
                    border-radius: 4px;
                }
            }
            .btn {
                margin: 0 5px;
            }
            .title {
                padding: 8px;
                width: auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #D1DBE5;
            }
        }
    }
    .margin_right20 {
        margin-right: 20px;
    }
}
</style>
