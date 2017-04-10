<style lang="scss" scoped>
.body {
    margin: 8px;
    padding: 16px;
    background-color: #FFFFFF;
    position: relative;
}
.avatar-uploader,
.el-upload {
    border: 1px dashed #bfcbd9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    position: absolute;
    left: 420px;
    width: 200px;
    height: 266px;
    z-index: 2;
    &:hover {
        border-color: #20a0ff;
    }
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 266px;
    line-height: 266px;
    text-align: center;
}
.avatar {
    width: 200px;
    height: 266px;
    display: block;
}
.el-form {
    .el-cascader,
    .el-input,
    .el-select {
        width: 260px;
        margin-right: 10px;
    }
}
</style>

<template lang="html">

<div class="container">
    <div class="top_bar">
        <h2 class="title">图书上架</h2>
    </div>

    <div class="body">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="ISBN" prop="isbn">
              <el-input :autofocus="true">
                  <el-button slot="append" icon="search"></el-button>
              </el-input>
          </el-form-item>
          <el-form-item label="书 名" prop="title">
              <el-input :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="出版社" prop="publisher">
              <el-input></el-input>
          </el-form-item>
          <el-form-item label="作 者" prop="author">
              <el-input></el-input>
          </el-form-item>
          <el-form-item label="原 价" prop="price">
              <el-input type="number"></el-input>
          </el-form-item>
          <el-form-item label="类 型">
              <td style="width:260px;text-align:center;color: #1AAD19;margin-right:10px;">二手书</td>
              <td style="width:260px;text-align:center;color: #3A8AFF;">新书</td>
          </el-form-item>
          <el-form-item label="折 扣">
              <el-input type="number" placeholder="二手书折扣"><template slot="append">折（{{'¥999.99'}}）</template></el-input>
              <el-input type="number" placeholder="新书折扣"><template slot="append">折（{{'¥999.99'}}）</template></el-input>
          </el-form-item>
          <el-form-item label="数 量">
              <el-input type="number" placeholder="二手书数量"><template slot="append">本</template></el-input>
              <el-input type="number" placeholder="新书数量"><template slot="append">本</template></el-input>
          </el-form-item>
          <el-form-item label="位 置">
              <el-cascader :options="options" v-model="selectedOptions3"></el-cascader>
              <el-cascader :options="options" v-model="selectedOptions3"></el-cascader>
          </el-form-item>
          <el-form-item>
              <el-button type="primary">上架销售</el-button>
              <el-button>重置</el-button>
          </el-form-item>
      </el-form>
    </div>
</div>

</template>

<script>
export default {
    data() {
        return {
            imageUrl: '',
            options: [{
                value: 'zhinan',
                label: '新书仓库',
                children: [{
                    value: 'shejiyuanze',
                    label: '01人大社',
                    children: [{
                        value: 'yizhi',
                        label: '1层'
                    }, {
                        value: 'fankui',
                        label: '反馈'
                    }, {
                        value: 'xiaolv',
                        label: '效率'
                    }, {
                        value: 'kekong',
                        label: '可控'
                    }]
                }, {
                    value: 'daohang',
                    label: '导航',
                    children: [{
                        value: 'cexiangdaohang',
                        label: '侧向导航'
                    }, {
                        value: 'dingbudaohang',
                        label: '顶部导航'
                    }]
                }]
            }],
            selectedOptions3: ['zhinan', 'shejiyuanze', 'yizhi']
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>
