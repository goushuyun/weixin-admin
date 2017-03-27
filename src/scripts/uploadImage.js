import {getTimeVal} from './utils'

export default {
    methods: {
        uploadShopLogo(e){
            var iframe = document.createElement("iframe");
            iframe.name = "ActionFrame";
            iframe.id = "ActionFrame";
            document.body.appendChild(iframe); //构造一个对象。插入页面中。

            //开始提交
            var MyForm = document.getElementById('upload_form');
            MyForm.target = "ActionFrame"; //让表单在iframe中提交
            MyForm.submit(); //执行提交。

            iframe.onload = (e) => {
                //加载完成之后，前端切换显示上传的图片
                this.form.logo = "http://ojrjlwt2h.bkt.clouddn.com/shop/" + this.shop_id + "?" + getTimeVal()      //购书云
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            }
        },
        submitUploadForm(e) {
            //this.loadingShow = true
            // var target = $(e.target),
            //     box = target.parents('.box')
            // var index = $('.box').index(box) + 1

            var iframe = document.createElement("iframe");
            iframe.name = "ActionFrame";
            iframe.id = "ActionFrame";
            document.body.appendChild(iframe); //构造一个对象。插入页面中。
            //开始提交
            var MyForm = document.getElementById('upload_form');
            MyForm.target = "ActionFrame"; //让表单在iframe中提交
            MyForm.submit(); //执行提交。

            iframe.onload = (e) => {
                //加载完成之后，前端切换显示上传的图片
                this.ruleForm.pic = "http://ojrjlwt2h.bkt.clouddn.com/" + this.ruleForm.isbn + "?" + getTimeVal()   //购书云
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            }
        }
    }
}
