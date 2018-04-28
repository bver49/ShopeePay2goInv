var express = require('express');
var router = express.Router();
var Item = require('../model/Item');
var sync = require('../script/sync');
var syncShopeeToYahoo = sync.syncShopeeToYahoo;
var syncShopeeToYahooTest = sync.syncShopeeToYahooTest;

router.get("/", function (req, res) {
    Item.findAll().then(function (items) {
        res.send(items);
    });
});

router.post("/syncshopeetoyahoo", function (req, res) {
    syncShopeeToYahooTest().then(function (res) {
        res.send(res);
    }).catch(function (err) {
        res.send(err);
    });
});

module.exports = router;