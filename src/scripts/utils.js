function testMobile(tel){
    let telReg = /^1\d{10}$/
    return telReg.test(tel)
}

function testPassword(pwd){
    let pwdReg = /^[A-Za-z0-9]{6,20}$/
    return pwdReg.test(pwd)
}

function testMsgCode(code){
    let msgCodeReg = /\d{4}/
    return msgCodeReg.test(code)
}

function getTimeVal(){
    var date = new Date()
    return date.getSeconds()
}

function stamp2date(dt, fmt) {
    if (dt === 0) {
        return '';
    }else{
        return moment.unix(dt).format(fmt);
    }
}

function isISBNFormat (isbn){
    if(isbn.length === 13){
        //判断是否以 ‘978开头’
        return isbn.indexOf('978') === 0
    }
    return /^\d{10}$/.test(isbn)
}

// 金额由“分”转换成“元”
function priceFloat (price) {
    return parseFloat(price/100).toFixed(2)
}
// 金额由“元”转换成“分”
function priceInt (price) {
    return parseInt(price * 100)
}

// 判断两个对象是否相等
function isObjectValueEqual(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}

// 判断支付方式
function checkPayChannel(pay_channel) {
    var pay_wx = /^wx/
    var pay_al = /^alipay/
    if (pay_wx.test(pay_channel)) {
        return '微信支付'
    }
    if (pay_al.test(pay_channel)) {
        return '支付宝'
    }
}

export {testMobile, testPassword, testMsgCode, getTimeVal, stamp2date, isISBNFormat, priceFloat, priceInt, isObjectValueEqual, checkPayChannel}
