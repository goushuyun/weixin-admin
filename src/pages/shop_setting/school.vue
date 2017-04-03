<style lang="scss" scoped>

@import "../../common/_color.scss";
ul#schools {
    font-size: 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li{
        box-sizing: border-box;
        display: inline-block;
        border-radius: 4px;
    }

    li.school {
        width: 245px;
        // height: 141px;
        background-color: white;
        border-left: 4px solid $blue;
        padding: 6px 12px;
        margin-right: 14px;
        margin-bottom: 10px;
        &:hover {
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            // button{
            //     display: none;
            // }
        }
        p.name {
            line-height: 48px;
            font-size: 14px;
            color: $font_normal;
        }
        p.tel {
            font-size: 13px;
            line-height: 24px;
            color: $font_light;
            .price{
                color: $weixin_green;
                padding-right: 82px;
            }
        }
        p.operate{
            text-align: right;

            button{
                line-height: 16px;
                padding: 0;
                font-size: 12px;
            }
        }
    }
    li.add {
        font-size: 20px;
        width: 124px;
        height: 124px;
        background-color: white;
        line-height: 124px;
        text-align: center;
        color: $bg_grey;
        &:hover{
            color: lighten($blue, 12%);
            cursor: pointer;
            border: 1px solid lighten($blue, 16%);
        }
    }
}

</style>

<template lang="html">

<div>
    <ul id="schools">
        <li class="school">
            <p class="name">上海应用技术大学（奉贤校区）</p>
            <p class="tel">客服电话：18817935420</p>
            <p class="tel">
                配送费用：<span class="price">¥ 4.00</span>
            </p>
            <p class="operate">
                <el-button type="text">删除</el-button>
            </p>
        </li>
        <li class="school">
            <p class="name">上海应用技术大学（奉贤校区）</p>
            <p class="tel">客服电话：18817935420</p>
            <p class="tel">
                配送费用：<span class="price">¥ 4.00</span>
            </p>
            <p class="operate">
                <el-button type="text">删除</el-button>
            </p>
        </li>

        <li class="add" @click="add_school">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </li>

    </ul>
</div>

</template>

<script>

export default {
    methods:{
        add_school(){
            // add school

        }
    }
}

</script>
