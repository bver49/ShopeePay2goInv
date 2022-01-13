var fs = require('fs');
var iconv = require('iconv-lite');
var dayjs = require('dayjs');
var xlsx = require('xlsx');

module.exports.genSmilePayData = function (file, type, email) {
    var orderNoList = [];
    var today = dayjs(new Date().toLocaleString("zh-tw", {timeZone: "Asia/Taipei"}));
    var fileName = 'files/smilePay_' + today.format('YYYYMMDD') + '.csv';
    var workBook = xlsx.readFile(file);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var data = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    var rows = ["發票號碼,隨機碼,發票日期,發票時間,稅率類型,課稅別,買受人註記,通關方式註記,彙開註記,零稅率註記,捐贈,愛心碼,信用卡末四碼,自訂發票編號,自訂號碼,商品明細,數量明細,單價明細,單位明細,各明細總額,含稅銷售額,免稅銷售額,零稅率銷售額,總金額,單價含稅,買受人統編,買受人公司名稱,買受人姓名,電話,傳真,信箱,地址,載具類型,載具ID明碼,載具ID暗碼,發票證明聯備註,錯誤碼,失敗原因,發票號碼,發票隨機碼,發票日期,發票時間,發票存入的載具ID,\n"];
    for (var i in data) {
        var eachData = data[i];
        var taxIdNumber = '';
        var taxTitle = '';
        if (type == '1') {
            // yahoo
            var orderNo = eachData['訂單編號'];
            var userPay = eachData['買家實付金額'];
            var userid = eachData['買家拍賣代號'];
            var itemName = eachData['商品名稱'].replace(/ /g, '').slice(30);
            if ('發票統編' in eachData) {
                taxIdNumber = String(eachData['發票統編']).padStart(8, '0');
            }
            if ('發票抬頭' in eachData) {
                taxTitle = eachData['發票抬頭'];
            }
        } else if (type == '2') {
            // ruten
            var orderNo = eachData['訂單編號'];
            var userPay = eachData['結帳總金額'];
            var userid = eachData['買家帳號'];
            var itemName = eachData['商品名稱'].replace(/ /g, '').slice(30);
        }
        userid = userid.toString();
        var tempRow = ',,' + today.format('YYYY/MM/DD') + ',' + today.format('HH:mm:ss') + ',7,1,1,1,Y,,0,,,,' + orderNo + ',' + itemName + ',1,' + userPay + ',組,' + userPay + ',' + userPay + ',0,0,' + userPay + ',,' + taxIdNumber + ',' + taxTitle + ',' + userid + ',,,' + email + ",,,,,,,,,,,,\n";
        if (orderNoList.indexOf(orderNo) == -1) {
            orderNoList.push(orderNo);
            rows.push(tempRow);
        }
    }
    for (var i in rows) {
        rows[i] = iconv.encode(rows[i], 'big5');
        fs.appendFileSync(fileName, rows[i]);
    }
    return fileName;
}