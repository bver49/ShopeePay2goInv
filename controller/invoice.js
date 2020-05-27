var express = require('express');
var fs = require('fs');
var Op = require('sequelize').Op;
var multer  = require('multer');
var xlsx = require('xlsx');
var upload = multer({ dest: 'files/' });
var Invoice = require('../model/Invoice');
var common = require('../helper/common');
var orderDataToEzpayData = require('../helper/orderDataToEzpayData');
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

router.post("/import", common.checkLogin(), upload.single('importData'), function (req, res) {
    var workBook = xlsx.readFile(req.file.path);
    //轉成json資料
    for (var index in workBook['Sheets']) {
        var datas = xlsx.utils.sheet_to_json(workBook['Sheets'][index]);
        //只取第一個sheet
        break;
    }
    var orderNo = [];
    for (var i in datas) {
        var eachData = datas[i];
        if (eachData['開立狀態'] == 'SUCCESS' && eachData['訂單編號'] != '') {
            orderNo.push(String(eachData['訂單編號']));
        }
    }
    Invoice.findAll({
        'where': {
            sn: {
                [Op.in]: orderNo
            }
        }
    }).then(function (invoices){
        for (var i in invoices) {
            var eachInvoiceNo = invoices[i].sn;
            orderNo.splice(orderNo.indexOf(eachInvoiceNo), 1);
        }
        var insertData = [];
        for (var i in datas) {
            var eachData = datas[i];
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


router.get("/orderDataToEzpayData", common.checkLogin(), function (req, res) {
    res.render("invoice/orderDataToEzpayData", {
        me: req.user
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