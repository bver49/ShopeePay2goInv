var express = require('express');
var fs = require('fs');
var Op = require('sequelize').Op;
var multer  = require('multer');
var upload = multer({ dest: 'files/' });
var Invoice = require('../model/Invoice');
var common = require('../helper/common');
var orderDataToEzpayData = require('../helper/orderDataToEzpayData');
var router = express.Router();

router.get("/query", function (req, res) {
    res.render("invoiceQuery");
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
        res.json(invoice);
    });
});


router.get("/orderDataToEzpayData", common.checkLogin(), function (req, res) {
    res.render("orderDataToEzpayData", {
        me: req.user
    });
});

router.post("/orderDataToEzpayData", common.checkLogin(), upload.single('orderData'), function (req, res) {
    var type = req.body.type;
    var userNo = req.body.userNo;
    var shopNo = req.body.shopNo;
    var email = req.body.email;
    var file = orderDataToEzpayData.genEzpayData(req.file.path, shopNo, userNo, type, email);
    res.download(file, function(){
        //清除檔案
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(file);
    });
});

module.exports = router;