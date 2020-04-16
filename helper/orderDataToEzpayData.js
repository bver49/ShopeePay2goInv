var fs = require('fs');
var dayjs = require('dayjs');
var xlsx = require('xlsx');
var today = dayjs().format('YYYYMMDD');
var userNo = 'C0816550934';
var shopNo = '31924800';
var fileName = 'files/' + shopNo + '_' + today + '.csv';

module.exports.genEzpayData = function (file, type) {
    var workBook = xlsx.readFile(file);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var data = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    var rows = ['H,INVO,' + userNo + ',' + shopNo + ',' + today + '\n'];
    for (var i in data) {
        var rowS = 'S,';
        var rowI = 'I,';
        if (type == '1') {
            // yahoo
            var orderNo = data[i]['訂單編號'];
            var userPay = data[i]['買家實付金額'];
            var userid = data[i]['買家拍賣代號'];
            var itemName = data[i]['商品名稱'].replace(/ /g, '').slice(30);
        } else if (type == '2') {
            // ruten
            var orderNo = data[i]['訂單編號'];
            var userPay = data[i]['結帳總金額'];
            var userid = data[i]['買家帳號'];
            var itemName = data[i]['商品名稱'].replace(/ /g, '').slice(30);
        }
        var tax = Math.round(userPay * 0.05);
        var invoicePrice = userPay - tax;
        rowS += orderNo + ',B2C,,' + userid + ',c.p.max.tw@gmail.com,,2,c.p.max.tw@gmail.com,,Y,1,5,' + invoicePrice + ',' + tax + ',' + userPay + ',\n';
        rowI += orderNo + ',' + itemName + ',1,組,' + userPay + ',' + userPay + ',\n';
        rows.push(rowS);
        rows.push(rowI);
    }
    for (var i in rows) {
        fs.appendFileSync(fileName, rows[i], 'big5');
    }
    return fileName;
}