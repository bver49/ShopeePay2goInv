var fs = require('fs');
var iconv = require('iconv-lite');
var dayjs = require('dayjs');
var xlsx = require('xlsx');

module.exports.genEzpayData = function (file, shopNo, userNo, type, email) {
    var today = dayjs(new Date().toLocaleString("zh-tw", {timeZone: "Asia/Taipei"})).format('YYYYMMDD');
    var orderNoList = [];
    var fileName = 'files/' + shopNo + '_' + today + '.txt';
    var workBook = xlsx.readFile(file);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var data = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    var rows = ['H,INVO,' + userNo + ',' + shopNo + ',' + today + '\n'];
    for (var i in data) {
        var eachData = data[i];
        // if (type == '2') {
        //     eachData = {};
        //     for (var j in data[i]) {
        //         decodeKey = iconv.decode(j, 'big5');
        //         eachData[decodeKey] = data[i][j];
        //     }
        // }
        var rowS = 'S,';
        var rowI = 'I,';
        if (type == '1') {
            // yahoo
            var orderNo = eachData['訂單編號'];
            var userPay = eachData['買家實付金額'];
            var userid = eachData['買家拍賣代號'];
            var itemName = eachData['商品名稱'].replace(/ /g, '').slice(30);
        } else if (type == '2') {
            // ruten
            var orderNo = eachData['訂單編號'];
            var userPay = eachData['結帳總金額'];
            var userid = eachData['買家帳號'];
            var itemName = eachData['商品名稱'].replace(/ /g, '').slice(30);//iconv.decode(eachData['商品名稱'], 'big5').toString().replace(/ /g, '').slice(30);
        }
        var tax = Math.round(userPay * 0.05);
        var invoicePrice = userPay - tax;
        if (orderNoList.indexOf(orderNo) == -1) {
            rowS += orderNo + ',B2C,,' + userid + ',' + email + ',,,,,Y,1,5,' + invoicePrice + ',' + tax + ',' + userPay + ',\n';
            rowI += orderNo + ',' + itemName + ',1,組,' + userPay + ',' + userPay + ',\n';
            rows.push(rowS);
            rows.push(rowI);
            orderNoList.push(orderNo);
        }
    }
    fs.appendFileSync(fileName, "\ufeff");
    for (var i in rows) {
        fs.appendFileSync(fileName, rows[i]);
    }
    return fileName;
}