var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'files/' });
var router = express.Router();
var orderDataToEzpayData = require('../helper/orderDataToEzpayData');

router.get("/orderDataToEzpayData", function (req, res) {
    res.render("orderDataToEzpayData", {
        me: req.user
    });
});

router.post("/orderDataToEzpayData", upload.single('orderData'), function (req, res) {
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