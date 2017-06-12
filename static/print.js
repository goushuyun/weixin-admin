			var LODOP; //声明为全局变量

		function orderPromiseFunc(order) {
            localStorage.printOver = false
            localStorage.clearPrinterOk = false;
            localStorage.printSuccess = false;
			var orderPromise = new Promise(function(resolve, reject) {
				if (order == undefined) return;
				//构建打印JSON
				var printOrder = structPrintJSON(order);
				console.log(printOrder);
				singleOrderPrintModel = new SingleOrderPrintModel(printOrder.orderNo, 0, 0);
				localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
				printDeliveryOrder(printOrder, printOrder.books, true, 0, 0)
				var count = 0;
				var checkPrintTask = setInterval(function() {
					count++;
					singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);
					if (singleOrderPrintModel.currentPage != 0 && singleOrderPrintModel.currentPage == singleOrderPrintModel.totalPage) {
						resolve();
						clearTimeout(checkPrintTask);
					} else if (count > 10) {
						reject()
						clearTimeout(checkPrintTask)
					}
				}, 500)

			})
			orderPromise.then(function(value) {
                localStorage.printSuccess = true;
                localStorage.printOver = true;

                console.log("print ok");
			}, function(value) {
				console.log("print occur a err then clear printer");
				if (localStorage.clearJobId == undefined) return;
				clearPrinterTask(localStorage.clearJobId);
				//开始清理打印机
				var clearPrinterPromise = new Promise(function(resolve, reject) {
					var count = 0;
					var checkClearOk = setInterval(function() {
						if (localStorage.clearPrinterOk) {
							clearTimeout(checkClearOk)
							resolve(value)
						} else if (count > 10) {
							clearTimeout(checkClearOk)
							reject(value)
						}

					}, 500)

				})

				clearPrinterPromise.then(function(value) {
                    localStorage.printOver = true
                    localStorage.clearPrinterOk = true;
					console.log("clear ok");
				}, function(value) {
                    localStorage.printOver = true
					console.log("clear filed");
				})


			})

		}

		function SingleOrderPrintModel(orderNo, currentPage, totalPage) {
			this.orderNo = orderNo;
			this.currentPage = currentPage;
			this.totalPage = totalPage;
		}

		function Book(isbn,title,sellNum,type,shelf,totalAmount){
					this.isbn = isbn;
					this.title = title;
					this.sellNum = sellNum;
					this.type = type;
					this.shelf = shelf;
					this.totalAmount = totalAmount;
		}

		function errModel(orderId, errMsg) {
			this.orderId = orderId;
			this.errMsg = errMsg;

		}

		function structPrintJSON(dataOrder) {
			var order = dataOrder.order
			var data = {};
			var books = new Array();
			console.log(order.order);
			console.log(order.items);

			data.orderNo = order.order.id;
			data.remark = order.order.remark;
			data.username = order.order.name;
			data.mobile = order.order.mobile;
			data.addr = order.order.address;
			var a = new Date();
			var deliveryTime = a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日 "+a.getHours()+":"+a.getMinutes();
			data.deliveryTime = deliveryTime
			var totalAmount = 0;
			for (var i = 0; i < order.items.length; i++) {
				var book = new Book();
				book.isbn = order.items[i].book_isbn;
				book.title = order.items[i].book_title;
				book.sellNum = order.items[i].amount;
				totalAmount += book.sellNum;
				var bookType = "新书";
				// • 类   型：0.新书 1.旧书
				if (order.items[i].type == 1) bookType = "旧书";

				book.type = bookType
				book.shelf = order.items[i].print_location;
				books.push(book);
			}
			console.log(books[0].title);
			data.totalAmount = totalAmount;
			data.books = books;
			console.log(books.length);
			return data;

		}

/**
 * 参数解析
 *order：订单
 *hasLogo：是否要打印logo
 *layer：订单可能一张打印不全，layer记录已经打印了几张
 *
 */
function printDeliveryOrder(order, items, isLogo, layer, page) {
    //获取打印控件
    console.log(111);
    LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
    console.log(112);
    //设定纸张规格
    LODOP.PRINT_INITA("0mm", "0mm", "98mm", "178 mm", "");
    console.log("hahahah");
    //判断是否打印logo
    if (isLogo) {
        //headerd的logo
        LODOP.ADD_PRINT_IMAGE(15, 16, 25, 25, "<img src='http://okxy9gsls.bkt.clouddn.com/logo.png'/>");
        LODOP.ADD_PRINT_TEXT("4.76mm", "11.38mm", "24.61mm", "6.88mm", "购书云");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "楷体");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

        //footer的logo
        LODOP.ADD_PRINT_IMAGE("170.68mm", "3.97mm", "6.61mm", "6.61mm", "<img src='http://okxy9gsls.bkt.clouddn.com/logo.png'/>");
        LODOP.ADD_PRINT_TEXT("170.95mm", "11.38mm", "22.01mm", "7.94mm", "购书云");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "aria");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    //根据layer的层数,如果layer等于0 ，则计算总共的页数，
    var lineSize = 0;
    if (layer == 0) {
        page = 1;
        //首先要计算需要打印几张纸

        for (var i = 0; i < items.length; i++) {
            var line = getLine(items[i].title)
            lineSize += 15 + (line - 1) * 3;

            if ((lineSize + 15) >= 115 && (items.length - i > 1)) {
                page++;
                lineSize = 0;
            }

        }

    }
    if (layer == 0) {
        //订单条形码
        LODOP.ADD_PRINT_BARCODE("2.91mm", "48.77mm", "50mm", "13.23mm", "128C", order.orderNo);

    }
    layer++;
    //订单号
    LODOP.ADD_PRINT_TEXT("18.79mm", "4.5mm", "26.46mm", "6.61mm", "订单号:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("18.79mm", "21.17mm", "50.01mm", "6.61mm", order.orderNo);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("20mm", "55mm", "26.46mm", "6.61mm", "打印时间:");

    LODOP.ADD_PRINT_TEXT("20mm", "70mm", "50.01mm", "6.61mm", order.deliveryTime);

    //订单-->title
    LODOP.ADD_PRINT_TEXT("27.78mm", "6.32mm", "24.29mm", "5.82mm", "isbn");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT("27.78mm", "30.66mm", "60.01mm", "5.82mm", "书本详情");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT("27.78mm", "89.14mm", "11.11mm", "5.82mm", "数量");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

    LODOP.ADD_PRINT_LINE("32mm", "0mm", "32mm", "106.29mm", 0, 1);


    //打印订单项、
    lineSize = 0;
    var baseMargin = 32;
    var itemsSize = items.length;
    for (var i = 0; i < itemsSize; i++) {
        console.log(items)
        var book = items[0]
        if (book == undefined)
            break;
        var bookLine = getLine(book.title)
		var shelfLine = getLine(book.shelf)
		if (bookLine == 0){
			bookLine = 1
		}
		if (shelfLine == 0){
			shelfLine = 1
		}
        lineSize += 14 + (bookLine+shelfLine - 2) * 3;

        if ((lineSize + 15) > 115 && (itemsSize - i > 1)) {
            break;
            // printDeliveryOrder(order,items,true,layer,page);
        } else {
            items.shift();
            //订单-->detail
            baseMargin += 3;
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "6.32mm", "24.29mm", "5.29mm", book.isbn);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "30.66mm", "60.01mm", "5.29mm", book.title);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "89.73mm", "10.03mm", "5.29mm", book.sellNum);
            baseMargin += 7 + (bookLine - 1) * 3;
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "6.32mm", "17.41mm", "5.29mm", "商品详情:");
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "20.35mm", "10.58mm", "5.29mm", book.type);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "30.4mm", "60.01mm", "5.29mm", book.shelf);
            baseMargin += 4 + (shelfLine - 1) * 3;
            LODOP.ADD_PRINT_LINE(baseMargin + "mm", "0mm", baseMargin + "mm", "106.29mm", 0, 1);
        }
    }

    // console.log("yeshu"+page);


    var yama = "页码：第" + layer + "页，共" + page + "页";
    console.log(lineSize);

    //订单地址信息
    if (layer == page) {
        var footerLoction = 125;
        if (lineSize + 37 > 125) footerLoction = lineSize + 42;
        LODOP.ADD_PRINT_TEXT((lineSize + 35) + "mm", "77mm", "19mm", "5.82mm", "总数量：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT((lineSize + 35) + "mm", "90mm", "19mm", "5.82mm", order.totalAmount);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        //收货人信息
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.58mm", "5.82mm", "收货人：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "21.4mm", "37.04mm", "5.82mm", order.username);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "56.45mm", "19.05mm", "5.82mm", "手机号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "72.2mm", "26.46mm", "5.82mm", order.mobile);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        footerLoction += 10;
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.84mm", "5.82mm", "地  址：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "21.14mm", "77.79mm", "5.82mm", order.addr);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        footerLoction += 10;
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.84mm", "5.82mm", "备  注：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "20.88mm", "77.79mm", "5.82mm", order.remark);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);


    }
    //footer
    LODOP.ADD_PRINT_TEXT("172.77mm", "31.75mm", "38.89mm", "5.82mm", yama);
    if (page > 1 && layer != page) {
        LODOP.ADD_PRINT_TEXT("169.86mm", "66mm", "26.46mm", "10.58mm", "下一页");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    var printStatus = 0;
    var printOver = false;
    var childPrintOver = false;
    var jobId = "";
    LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);

    //与打印机进行交互，异步获取打印的jobId
    if (LODOP.CVERSION) {
		if (LODOP.SET_PRINTER_INDEXA(-1)){
			LODOP.PRINT();
			//异步获取打印机返回的jobid
			LODOP.On_Return = function(TaskID, Value) {
				jobId = Value;
			}
		}

    }
    var accessJobId = new Promise(function(resolve, reject) {
        //轮询获取jobid
        var count = 0;
        var getJobId = setInterval(function() {
            count++;
            console.log("jobId=" + jobId)
            var re = /^[0-9]*_[0-9]*$/;
            var result = re.test(jobId);
            if (result) {
                clearTimeout(getJobId)
                //结果计算
                resolve(jobId)
            } else if (count >= 15) {
                clearTimeout(getJobId);
                reject();

            }
        }, 200);
    })
    var singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);
    accessJobId.then(function(value) {
        singleOrderPrintModel.totalPage = page;
        localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
        var accessPrintStatus = new Promise(function(resolve, reject) {
            var count = 0;
            var printOkTask = setInterval(function() {
                count++;
                if (LODOP.CVERSION) LODOP.On_Return = function(TaskID, Value) {

                    if (Value == 0) {
                        console.log(Value);
                        clearTimeout(printOkTask);
                        console.log("start 1");
                        resolve(jobId)

                    } else if (count > 10) {
                        console.log("start end 5");
                        clearTimeout(printOkTask);
                        reject();
                    }
                    console.log("access printer error ,try to connect :"+(count)+" try")
                };
                LODOP.GET_VALUE("PRINT_STATUS_EXIST", jobId);
            }, 500)

        })

        accessPrintStatus.then(function(value) {
            printOver = true;
            singleOrderPrintModel.currentPage++;
            localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
            if (layer < page && page != 1) {
                childPrintOver = printDeliveryOrder(order, items, true, layer, page);
            }
            if (page == 1) childPrintOver = true;

            if (printOver && childPrintOver) return true;
            return false;
        }, function(value) {
            console.log("filed connected printer ,try to clear job");
            localStorage.clearJobId = jobId;

        })
        //处理打印结果
    }, function(value) {
        localStorage.clearJobId = jobId;

    })

    //获取打印结果


}

//构建订单打印model，记录当前订单已经打印了多少份
function SingleOrderPrintModel(orderNo, currentPage, totalPage) {
    this.orderNo = orderNo;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
}

//清理打印机打印任务
function clearPrinterTask(jobId) {
    strPrinterID = GetPrinterIDfromJOBID(jobId);
    LODOP = getLodop();
    if (LODOP.CVERSION) {
        LODOP.On_Return = function(TaskID, Value) {
            console.log("清理结果:" + Value);
        };
        LODOP.SET_PRINT_MODE("CONTROL_PRINTER:" + strPrinterID, "PURGE");
        return;
    } else {
        var strResult = LODOP.SET_PRINT_MODE("CONTROL_PRINTER:" + strPrinterID, "PURGE");
        console.log("清理结果:" + strResult);
    };
}

//从JOB代码找出打印机序号：
function GetPrinterIDfromJOBID(strJOBID) {
    var intPos = strJOBID.indexOf("_");
    if (intPos < 0) {
        return strJOBID;
    } else {
        return strJOBID.substr(0, intPos);
    }
}


function getLine(val) {

    var maxSize = 36;
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }

    var modNum = len % maxSize;

    if (modNum == 0) return len / maxSize

    else return parseInt(len / maxSize) + 1


}
//检查是否安装打印控件
function checkLodopIsInstall() {
    try {
        var LODOP = getLodop();
        if (LODOP.VERSION) {
            return true;
        };
    } catch (err) {
        return false;
    }
};

function selectAsDefaultPrinter() {
		LODOP=getLodop();
		console.log(LODOP.CVERSION);
		if (LODOP.CVERSION) {
			console.log(111);
			LODOP.On_Return=function(TaskID,Value){if(Value>=0) alert("选择成功!"); else alert("选择失败！");};
			LODOP.SELECT_PRINTER();
			return;
		};
		console.log(222);
        	if (LODOP.SELECT_PRINTER()>=0)
        	alert("选择成功!"); else alert("选择失败！");
};
//获取默认打印机名称
function getPrinterName() {
		LODOP=getLodop();
		return LODOP.GET_PRINTER_NAME(-1);
};
