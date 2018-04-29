var express = require('express');
var router = express.Router();
var Item = require('../model/Item');
var sync = require('../script/sync');
var syncShopeeToYahoo = sync.syncShopeeToYahoo;
var syncShopeeToYahooTest = sync.syncShopeeToYahooTest;

router.get("/syncitems", checkLogin(),function (req, res) {
    if (req.user.role == 2 || req.user.syncitems == 1) {
        res.render("item", {
            me: req.user
        });
    } else {
        res.redirect("/");
    }
});

router.get("/", checkLogin(1),function (req, res) {
    Item.findAll().then(function (items) {
        res.send(items);
    });
});

router.post("/syncshopeetoyahoo", checkLogin(1),function (req, res) {
    syncShopeeToYahoo().then(function (result) {
        res.send(result);
    }).catch(function (err) {
        console.log(err);
        res.send({
            err:"蝦皮撈取商品資料發生錯誤"
        });
    });
});

function checkLogin(isAPI) {
    return function (req, res, next) {
        if (req.user) {
            next();
        } else {
            if (isAPI) {
                res.send("您沒有權限");
            } else {
                res.redirect("/users/login");
            }
        }
    }
}

module.exports = router;