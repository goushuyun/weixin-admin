<template lang="html">
<div class="container">
  <div class="top_bar">
      <h2 class="title">库存查看</h2>
  </div>
  <div class="content_inner">
    <el-form :inline="true" label-width="80px" class="search_area">
      <el-form-item label="ISBN">
        <el-input id="isbn" style="width: 193px;" size="small" v-model.trim="isbn" @keyup.enter.native="getData"></el-input>
      </el-form-item>
      <el-form-item label="书名">
        <el-input style="width: 193px;" size="small" v-model.trim="title" @keyup.enter.native="getData"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input style="width: 193px;" size="small" v-model.trim="author" @keyup.enter.native="getData"></el-input>
      </el-form-item>
      <el-form-item class="btn_bottom">
        <el-button size="small" type="primary" @click="getData"><i class="fa fa-search" aria-hidden="true"></i> 查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="80px">
      <el-form-item label="图书类型">
        <el-select size="small" v-model="search_type" @change="getData">
          <el-option label="所有" :value="-100"></el-option>
          <el-option label="新书" :value="0"></el-option>
          <el-option label="二手书" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-select size="small" v-model="search_amount" @change="getData">
          <el-option label="所有" value="0"></el-option>
          <el-option label="有货" value="2"></el-option>
          <el-option label="无货" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有图">
        <el-select size="small" v-model="search_picture" @change="getData">
          <el-option label="所有" :value="-100"></el-option>
          <el-option label="有图片" :value="0"></el-option>
          <el-option label="无图片" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn_bottom">
        <el-button size="small" type="primary" @click="resetForm"><i class="fa fa-refresh" aria-hidden="true"></i> 重置</el-button>
      </el-form-item>
      <el-form-item class="btn_bottom">
        <el-button size="small" type="danger" @click="cleanStorage"><i class="fa fa-recycle" aria-hidden="true"></i> 库存清零</el-button>
      </el-form-item>
    </el-form>
    <div class="data_table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" stripe border style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column label="图片" width="110">
                <template scope="scope" >
                  <div class="image_wrap">
                      <img :src="scope.row.book.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://images.goushuyun.cn/' + scope.row.book.image)" class="image"></img>
                  </div>
                </template>
            </el-table-column>
            <el-table-column prop="book.isbn" label="ISBN" width="150"></el-table-column>
            <el-table-column prop="book.title" label="书名" width="170"></el-table-column>
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
            <el-table-column label="位置" min-width="180">
                <template scope="scope">
                    <el-tooltip v-if="scope.row.has_new_book && scope.row.new_book.location.length" placement="top" effect="dark" :enterable="false">
                      <div slot="content"><span v-for="(item,index) in scope.row.new_book.location">{{item.location_str + (index + 1 == scope.row.new_book.location.length ? '' : '，')}}</span></div>
                      <div class="goods_item new_color ellipsis">
                        <span v-for="(item,index) in scope.row.new_book.location">{{item.location_str + (index + 1 == scope.row.new_book.location.length ? '' : '，')}}</span>
                      </div>
                    </el-tooltip>
                    <div v-if="scope.row.has_new_book && !scope.row.new_book.location.length" class="goods_item new_color ellipsis">无</div>
                    <el-tooltip v-if="scope.row.has_old_book && scope.row.old_book.location.length" placement="top" effect="dark" :enterable="false">
                      <div slot="content"><span v-for="(item,index) in scope.row.old_book.location">{{item.location_str + (index + 1 == scope.row.old_book.location.length ? '' : '，')}}</span></div>
                      <div class="goods_item old_color ellipsis">
                        <span v-for="(item,index) in scope.row.old_book.location">{{item.location_str + (index + 1 == scope.row.old_book.location.length ? '' : '，')}}</span>
                      </div>
                    </el-tooltip>
                    <div v-if="scope.row.has_old_book && !scope.row.old_book.location.length" class="goods_item old_color ellipsis">无</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="140">
                <template scope="scope">
                    <!-- <el-button type="text" size="small" @click="preEdit(scope.$index)" icon="edit"></el-button>
                    <el-button type="text" style="color:#FF4949" size="small" @click="proDelete(scope.$index)" icon="delete"></el-button> -->
                    <el-button-group>
                      <el-button type="primary" size="small" icon="edit" @click="preEdit(scope.$index)"></el-button>
                      <el-button type="primary" size="small" icon="delete" @click="proDelete(scope.$index)"></el-button>
                      <el-button type="primary" size="small" :icon="'star-' + (scope.row.associated_topics.length ? 'on' : 'off')" @click="proRecommend(scope.$index)"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <el-dialog size="mini" title="删除商品" v-model="deleteDialog.show">
      <el-form :model="deleteDialog">
        <el-form-item>
          <div style="width:400px;">您将要删除《{{deleteDialog.title}}》<br/>请选择要删除的书籍类型</div>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="deleteDialog.checkList">
            <el-checkbox :disabled="!deleteDialog.has_new_book" label="0">新书</el-checkbox>
            <el-checkbox :disabled="!deleteDialog.has_old_book" label="1">二手书</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog.show = false">取 消</el-button>
        <el-button type="primary" :disabled="deleteDialog.checkList.length == 0" @click="comfirmDelete">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog size="mini" title="推荐商品" v-model="recommendDialog.show">
      <el-form :model="recommendDialog" v-loading.body="recommendDialog.loading">
        <el-form-item>
          <div style="width:400px;">您正在推荐《{{recommendDialog.title}}》<br/>请选择要推荐到哪些话题</div>
        </el-form-item>
        <el-checkbox-group v-model="recommendDialog.associated_topics">
          <el-form-item v-for="(topic, index) in topics">
            <el-checkbox :label="topic.id">{{topic.title}}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-input v-if="add_topic.show" v-model="add_topic.title" id="title_input"><el-button slot="append" icon="circle-check" @click="addTopic"></el-button></el-input>
            <el-button v-else type="text" @click="proAddTopic">+ 新建话题</el-button>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recommendDialog.show = false">取 消</el-button>
        <el-button type="primary" :disabled="recommendDialog.associated_topics.length == 0 && recommendDialog.associated_topics_bak.length == 0" @click="comfirmRecommend">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="book_info_show" top="6%" :close-on-click-modal="false" @close="reset('book_info')">
      <div class="body" v-loading="loading" :element-loading-text="拼命加载中">
        <el-upload
          class="avatar-uploader"
          action="https://upload.qbox.me/"
          :data="imagesFormData"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError">
          <div class="dialog_image_wrap">
              <img v-if="book_info.image" :src="book_info.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://images.goushuyun.cn/' + book_info.image)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
        <el-form ref="book_info" :model="book_info" :rules="rules" label-width="70px">
            <el-form-item label="ISBN" prop="isbn">
                <el-input id="isbn" v-model.trim="book_info.isbn"></el-input>
            </el-form-item>
            <el-form-item label="书 名" prop="title">
                <el-input :maxlength="30" v-model.trim="book_info.title"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
                <el-input v-model.trim="book_info.publisher"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
                <el-input v-model.trim="book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="原 价" prop="price">
                <el-input min="0" type="number" v-model="book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="类 型">
                <td style="width:220px;text-align:center;color: #1AAD19;margin-right:6px;">二手书</td>
                <td style="width:220px;text-align:center;color: #3A8AFF;">新书</td>
            </el-form-item>
            <el-form-item label="折 扣">
                <el-input :disabled="!old_book.has_old_book" min="0" type="number" placeholder="二手书折扣"  v-model="old_book.discount" @input="inputDiscount(1)" @blur="blurDiscount(1)"><template slot="append">折</template></el-input>
                <el-input :disabled="!new_book.has_new_book" min="0" type="number" placeholder="新书折扣" v-model="new_book.discount" @input="inputDiscount(0)" @blur="blurDiscount(0)"><template slot="append">折</template></el-input>
            </el-form-item>
            <el-form-item label="价 格">
                <el-input :disabled="!old_book.has_old_book" type="number" min="0" placeholder="二手书价格" v-model="old_book.price" @input="inputPrice(1)" @blur="blurPrice(1)"><template slot="append">元</template></el-input>
                <el-input :disabled="!new_book.has_new_book" type="number" min="0" placeholder="新书价格" v-model="new_book.price" @input="inputPrice(0)" @blur="blurPrice(0)"><template slot="append">元</template></el-input>
            </el-form-item>
            <el-form-item label="数 量">
                <el-input :disabled="!old_book.has_old_book" type="number" min="0" placeholder="二手书数量" v-model.number="old_book.amount" @input="inputAmount(1)"><template slot="append">当前库存 <span style="color:#1AAD19;font-size:16px">{{old_book.stock}}</span> 本</template></el-input>
                <el-input :disabled="!new_book.has_new_book" type="number" min="0" placeholder="新书数量" v-model.number="new_book.amount" @input="inputAmount(0)"><template slot="append">当前库存 <span style="color:#3A8AFF;font-size:16px">{{new_book.stock}}</span> 本</template></el-input>
            </el-form-item>
            <el-form-item label="位 置">
                <el-row>
                    <el-col style="width: 220px;margin-right: 10px;">
                        <div class="tag_area">
                            <p v-for="(tag,index) in old_book.location_list">
                              <el-cascader @click.native="getUpdateIndex(index,1)" style="margin:5px 0;" placeholder="二手书货架位" filterable :options="locations" v-model="tag.location" @change="confirmUpdateOldLocation"></el-cascader>
                              <el-button type="text" icon="circle-close" style="color:#FF4949;margin-left: 5px;" @click="preDeleteLocation(index,1)"></el-button>
                            </p>
                            <el-cascader v-show="old_book.show" style="margin:5px 0;" placeholder="二手书货架位" filterable :options="old_book.locations" v-model="old_book.location" @change="confirmAddOldLocation"></el-cascader>
                            <el-button :disabled="!old_book.has_old_book" v-show="!old_book.show" style="margin:5px 0;width:190px" @click="preAddLocation(1)">+ 新增货架位</el-button>
                        </div>
                    </el-col>
                    <el-col style="width: 220px; margin-right: 10px;">
                        <div class="tag_area">
                            <p v-for="(tag,index) in new_book.location_list">
                              <el-cascader @click.native="getUpdateIndex(index,0)" style="margin:5px 0;" placeholder="二手书货架位" filterable :options="locations" v-model="tag.location" @change="confirmUpdateNewLocation"></el-cascader>
                              <el-button type="text" icon="circle-close" style="color:#FF4949;margin-left: 5px" @click="preDeleteLocation(index,0)"></el-button>
                            </p>
                            <el-cascader v-show="new_book.show" style="margin:5px 0;" placeholder="新书货架位" filterable :options="new_book.locations" v-model="new_book.location" @change="confirmAddNewLocation"></el-cascader>
                            <el-button :disabled="!new_book.has_new_book" v-show="!new_book.show" style="margin:5px 0;width:190px" @click="preAddLocation(0)">+ 新增货架位</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item style="text-align:left;margin-top:20px;">
              <el-button @click="book_info_show=false">取 消</el-button>
              <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import mix from './stock_list.js'
export default {
    mixins: [mix]
}
</script>

<style lang="scss" scoped>
@import "./stock_list.scss";
</style>
