import axios from "../../scripts/http"
import pingpp from 'pingpp-js'


export default {
    methods: {
        confirm_recharge(){
            let params = {
                recharge_fee: this.recharge_amount,
                pay_way: 'alipay_pc_direct'
            }

            axios.post('/v1/store/recharge_apply', params).then(res=>{
                let res_data = res.data.data
                let req = {
                    amount: 1,
                    // amount: res_data.recharge_fee,
                    subject: '商户充值',
                    order_no: res_data.id,
                    channel: 'alipay_pc_direct',
                    success_url: 'http://weixin.goushuyun.com/#/admin/account/online',
                    body: '商户充值',
                    event_type: 'recharge'
                }
                console.log(req);
                axios.post('/v1/payment/get_charge', req).then(res=>{
                    console.log(res.data);
                    pingpp.createPayment(JSON.parse(res.data.data), (res, err)=>{
                        console.log(res);
                        console.log(err);
                    })

                })

            })

        },


    }
}
