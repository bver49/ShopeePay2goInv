var express = require('express');
var fs = require('fs');
var Op = require('sequelize').Op;
var multer  = require('multer');
var xlsx = require('xlsx');
var iconv = require('iconv-lite');
var upload = multer({ dest: 'files/' });
var Invoice = require('../model/Invoice');
var common = require('../helper/common');
var orderDataToEzpayData = require('../helper/orderDataToEzpayData');
var orderDataToSmilePayData = require('../helper/orderDataToSmilePayData');
var router = express.Router();

router.get("/query", function (req, res) {
    res.render("invoice/query");
});

router.post("/query", function (req, res) {
    var orderNo = req.body.orderNo;
    Invoice.findOne({
        'where': {
            sn: orderNo,
            MerchantID: {
                [Op.ne]: null
            },
            TotalAmt: {
                [Op.ne]: null
            },
            InvoiceNumber: {
                [Op.ne]: null
            },
            RandomNum: {
                [Op.ne]: null
            }
        }
    }).then(function (invoice){
        res.status(200).json(invoice);
    });
});

router.get("/import", function (req, res) {
    res.render("invoice/import", {
        'me': req.me,
        'message': ''
    });
});

router.get("/importSmilePay", function (req, res) {
    res.render("invoice/importSmilePay", {
        'me': req.me,
        'message': ''
    });
});

router.post("/import", common.checkLogin(), upload.single('importData'), function (req, res) {
    var workBook = xlsx.readFile(req.file.path);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var datas = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    //這次要新增的訂單編號
    var orderNo = [];
    for (var i in datas) {
        var eachData = datas[i];
        if (eachData['開立狀態'] == 'SUCCESS' && eachData['訂單編號'] != '') {
            orderNo.push(String(eachData['訂單編號']));
        }
    }
    //從資料庫撈是否有一樣編號的紀錄
    Invoice.findAll({
        'where': {
            sn: {
                [Op.in]: orderNo
            }
        }
    }).then(function (invoices){
        //資料庫有的從array移掉
        for (var i in invoices) {
            var eachInvoiceNo = invoices[i].sn;
            orderNo.splice(orderNo.indexOf(eachInvoiceNo), 1);
        }
        var insertData = [];
        for (var i in datas) {
            var eachData = datas[i];
            eachData['訂單編號'] = eachData['訂單編號'].toString();
            if (eachData['開立狀態'] == 'SUCCESS' && orderNo.indexOf(eachData['訂單編號']) != -1) {
                insertData.push({
                    'sn':  eachData['訂單編號'],
                    'MerchantID': 'import',
                    'TotalAmt': eachData['發票金額'],
                    'InvoiceNumber': eachData['發票號碼'],
                    'RandomNum': '無',
                    'status' : 0
                });
            }
        }
        fs.unlinkSync(req.file.path);
        Invoice.bulkCreate(insertData).then(function () {
            res.render("invoice/import", {
                'me': req.me,
                'message': '匯入成功!'
            });
        });
    });
});

router.post("/importSmilePay", common.checkLogin(), upload.single('importData'), function (req, res) {
    var workBook = xlsx.readFile(req.file.path);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var tempDatas = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    var datas = [];
    for (var i in tempDatas) {
        var eachData = tempDatas[i];
        var row = {
            '自訂號碼':''
        };
        for (var j in tempDatas[i]) {
            decodeKey = iconv.decode(j, 'big5');
            if (decodeKey == '發票狀態') {
                tempDatas[i][j] = iconv.decode(tempDatas[i][j], 'big5');
            }
            row[decodeKey] = tempDatas[i][j];
        }
        datas.push(row);
    }
    //這次要新增的訂單編號
    var orderNo = [];
    for (var i in datas) {
        var eachData = datas[i];
        if (eachData['發票狀態'] == '開立' && eachData['自訂號碼'] != '') {
            orderNo.push(String(eachData['自訂號碼']));
        }
    }
    //從資料庫撈是否有一樣編號的紀錄
    Invoice.findAll({
        'where': {
            sn: {
                [Op.in]: orderNo
            }
        }
    }).then(function (invoices){
        //資料庫有的從array移掉
        for (var i in invoices) {
            var eachInvoiceNo = invoices[i].sn;
            orderNo.splice(orderNo.indexOf(eachInvoiceNo), 1);
        }
        var insertData = [];
        for (var i in datas) {
            var eachData = datas[i];
            eachData['自訂號碼'] = eachData['自訂號碼'].toString();
            if (eachData['發票狀態'] == '開立' && orderNo.indexOf(eachData['自訂號碼']) != -1) {
                insertData.push({
                    'sn':  eachData['自訂號碼'],
                    'MerchantID': 'import',
                    'TotalAmt': eachData['銷售額(含稅)'],
                    'InvoiceNumber': eachData['發票號碼'],
                    'RandomNum': '無',
                    'status' : 0
                });
            }
        }
        fs.unlinkSync(req.file.path);
        Invoice.bulkCreate(insertData).then(function () {
            res.render("invoice/import", {
                'me': req.me,
                'message': '匯入成功!'
            });
        });
    });
});

router.get("/orderDataToSmilePayData", common.checkLogin(), function (req, res) {
    res.render("invoice/orderDataToSmilePayData", {
        me: req.user
    });
});

router.get("/orderDataToEzpayData", common.checkLogin(), function (req, res) {
    res.render("invoice/orderDataToEzpayData", {
        me: req.user
    });
});

router.post("/orderDataToSmilePayData", common.checkLogin(), upload.single('orderData'), function (req, res) {
    var type = req.body.type;
    var email = req.body.email;
    var file = orderDataToSmilePayData.genSmilePayData(req.file.path, type, email);
    res.download(file, function() {
        //清除檔案
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(file);
    });
});

router.post("/orderDataToEzpayData", common.checkLogin(), upload.single('orderData'), function (req, res) {
    var type = req.body.type;
    var userNo = req.body.userNo;
    var shopNo = req.body.shopNo;
    var email = req.body.email;
    var file = orderDataToEzpayData.genEzpayData(req.file.path, shopNo, userNo, type, email);
    res.download(file, function() {
        //清除檔案
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(file);
    });
});

module.exports = router;