var express = require('express');
var router = express.Router();
var sync = require('../script/sync');
var syncShopeeToYahoo = sync.syncShopeeToYahoo;
var syncShopeeToYahooTest = sync.syncShopeeToYahooTest;

router.post("/syncshopeetoyahoo", function (req, res) {
    syncShopeeToYahooTest().then(function (res) {
        res.send(res);
    }).catch(function (err) {
        res.send(err);
    });
});

module.exports = router;