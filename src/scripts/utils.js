function testMobile(tel){
    let telReg = /^1\d{10}$/
    return telReg.test(tel)
}

function testPassword(pwd){
    let pwdReg = /^[A-Za-z0-9]{6,20}$/
    return pwdReg.test(pwd)
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


export {testMobile, testPassword, getTimeVal, stamp2date, isISBNFormat}
