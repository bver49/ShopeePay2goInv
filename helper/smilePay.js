const dayjs = require('dayjs');
var request = require('request');
var qs = require('querystring');
var emailReg = new RegExp(/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);
const fastXmlParser = require("fast-xml-parser");
const xmlParser = new fastXmlParser.XMLParser();
var config = require('../config');

//開發票
module.exports.genInvoice = function (shopeeData, key, cb) {
    var data = {
        Grvc: config.smilePay.Grvc,
        Verify_key:config.smilePay.Verify_key,
        InvoiceDate: dayjs().format('YYYY/MM/DD'),
        InvoiceTime: dayjs().format('HH:mm:ss'),
        Intype: '07',
        TaxType: '1',
        DonateMark:'0',
        orderid:shopeeData.ordersn,
        AllAmount: shopeeData.total_amount, //發票總金額(含稅) 商品價格+運費
        Description: (shopeeData.invitemname == '') ? '服飾' : shopeeData.invitemname, //商品名稱以 | 分隔
        Quantity: '1', //商品數量以 |分隔
        UnitPrice: shopeeData.total_amount.toString(), //單價以 | 分隔
        Amount: shopeeData.total_amount.toString(), //含稅金額以 | 分隔,
        Name: ('Shopee,' + shopeeData.recipient_address.name + ',' + shopeeData.buyer_username).slice(0, 30),
        Email: shopeeData.message_to_seller.match(emailReg) ? shopeeData.message_to_seller.match(emailReg)[0] : key.invemail,
    }
    if (shopeeData.order_status == 'COMPLETED') {
        try {
            var url = 'https://ssl.smse.com.tw/api_test/SPEinvoice_Storage.asp';
            if (key.isProduction == 'true') {
                url = 'https://ssl.smse.com.tw/api/SPEinvoice_Storage.asp';
            }
            request({
                method: 'GET',
                url: url + '?' + qs.stringify(data),
            }, function (err, response, body) {
                body = xmlParser.parse(body).SmilePayEinvoice;
                if (body.Status == 0) {
                    console.log("發票開立成功");
                    cb({
                        "msg":"發票開立成功",
                        "detail": body
                    });
                } else if (body.Status == -2003) {
                    console.log("已開過發票");
                    cb({
                        "msg":"已開過發票",
                        "detail": body
                    });
                } else {
                    cb({"msg":body.Desc});
                }
            });
        } catch (err) {
            cb({"msg":"開立發票失敗"});
        }
    } else {
        cb({"msg":"訂單尚未完成"});
    }
}

//折讓發票
module.exports.discountInvoice = function (invoiceNumber, dicountAmount, key, cb) {
    var data = {
        Grvc: config.smilePay.Grvc,
        Verify_key:config.smilePay.Verify_key,
        InvoiceNumber: invoiceNumber,
        Description: "服飾",
        Quantity: "1",
        UnitPrice: dicountAmount,
        Amount: dicountAmount,
        Tax: 0,
        TaxType: "1"
    }
    try {
        var url = 'https://ssl.smse.com.tw/api_test/SPEinvoice_Storage_Allowance.asp';
        if (key.isProduction == 'true') {
            url = 'https://ssl.smse.com.tw/api/SPEinvoice_Storage_Allowance.asp';
        }
        request({
            method: 'GET',
            url: url + '?' + qs.stringify(data),
        }, function (err, response, body) {
            body = xmlParser.parse(body).SmilePayEinvoice;
            if (body.Status == 0) {
                console.log("發票折讓成功");
                cb({
                    "msg":"發票折讓成功",
                    "detail": body
                });
            } else {
                console.log(body.Desc);
                cb({"msg":body.Desc});
            }
        });
    } catch (err) {
        cb({"msg":"解密錯誤"});
    }
}

//作廢發票
module.exports.invalidInvoice = function (invoiceNumber, key, cb) {
    var data = {
        Grvc: config.smilePay.Grvc,
        Verify_key:config.smilePay.Verify_key,
        InvoiceNumber: invoiceNumber,
        types: 'Cancel',
        CancelReason: '作廢'
    }
    try {
        var url = 'https://ssl.smse.com.tw/api_test/SPEinvoiceB2C_Storage_Modify.asp';
        if (key.isProduction == 'true') {
            url = 'https://ssl.smse.com.tw/api/SPEinvoiceB2C_Storage_Modify.asp';
        }
        request({
            method: 'GET',
            url: url + '?' + qs.stringify(data),
        }, function (err, response, body) {
            body = xmlParser.parse(body).SmilePayEinvoiceModify;
            if (body.Status == 0) {
                console.log("作廢發票成功");
                cb({
                    "msg":"作廢發票成功",
                    "detail": body
                });
            } else {
                console.log(body.Desc);
                cb({"msg":body.Desc});
            }
        });
    } catch (err) {
        cb({"msg":"解密錯誤"});
    }
}