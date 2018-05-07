var express = require('express');
var router = express.Router();
var Op = require('sequelize').Op;
var Item = require('../model/Item');
var shopee = require('../helper/shopee');
var yahoo = require('../helper/yahoo');
var getAllItems = shopee.getAllItems;
var addItem = yahoo.addItem;
var addItemTest = yahoo.addItemTest;
var productOnline = yahoo.productOnline;
var productOffline = yahoo.productOffline;
var delItem = yahoo.delItem;
var config = require('../config');
// var key = {
//     shopeeshopid: config.shopee.shopid,
//     shopeepartnerid: config.shopee.partnerid,
//     shopeesecret: config.shopee.apisecret
// }

router.get("/sync", checkLogin(),function (req, res) {
    if (req.user.role == 2 || req.user.syncitems == 1) {
        res.render("item", {
            me: req.user
        });
    } else {
        res.redirect("/");
    }
});

router.get("/logs", checkLogin(1),function (req, res) {
    Item.findAll().then(function (items) {
        res.send(items);
    });
});

router.post("/fromshopee", checkLogin(1),function (req, res) {
    var shopeeKey = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid
    }
    Item.findAll({
        "where": {
            "on_yahoo": {
                [Op.eq]: 1
            }
        },
        "attributes": ["shopee_id"]
    }).then(function(items) {
        var itemsMap = {};
        for (var i in items){
            itemsMap[items[i].shopee_id.toString()] = true;
        }
        getAllItems(shopeeKey).then(function(categories){
            var allItems = [];
            var allItemsId = [];
            var needUploadItems = [];
            var needDelItems;
            //避免撈出的商品中有重複
            for (var i in categories) {
                for (var j in categories[i].items) {
                    if (allItemsId.indexOf(categories[i].items[j].item_id) == -1) {
                        allItemsId.push(categories[i].items[j].item_id);
                        allItems.push(categories[i].items[j]);
                    }
                }
            }
            //避免上傳已上傳過的商品
            for (var k in allItems) {
                var itemId = allItems[k].item_id.toString();
                if (!itemsMap[itemId]) {
                    needUploadItems.push(allItems[k]);
                }
            }
            needDelItems = items;
            console.log("Total " + allItems.length + " shopee items");
            console.log("Total " + needUploadItems.length + " need to upload");
            console.log("Total " + needDelItems.length + " need to delete");
            res.send({
                "needUploadItems":needUploadItems,
                "needDelItems":needDelItems,
                "shopeeItemAmt":allItems.length
            });
        }).catch(function(err){
            res.send({
                'err':err
            });
        });
    });
});

router.post("/upload/yahoo", checkLogin(1),function (req, res) {
    var yahooKey = {
        yahooapikey: req.body.yahooapikey,
        yahooapisecret: req.body.yahooapisecret
    }
    var orderData = JSON.parse(req.body.orderData);
    orderData["priceRate"] = req.body.priceRate;
    addItem(yahooKey, orderData).then(function(result){
        if (result["@Status"] == "Success" || result["Action"] == "uploadImage") {
            Item.create({
                "shopee_id": result.shopeeItemId,
                "on_yahoo": 1,
                "yahoo_id": (result.productId) ? result.productId : "fortest",
                "sku": result.sku,
                "product_name": result.productName
            });
        }
        res.send(result);
    }).catch(function(err){
        res.send({
            "err":err
        });
    });
});

router.post("/online/yahoo", checkLogin(1),function (req, res) {
    var yahooKey = {
        yahooapikey: req.body.yahooapikey,
        yahooapisecret: req.body.yahooapisecret
    }
    var item = JSON.parse(req.body.item);
    productOnline(yahooKey, item).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send({
            "err":err
        });
    });
});

router.post("/offline/yahoo", checkLogin(1),function(req, res){
    var yahooKey = {
        yahooapikey: req.body.yahooapikey,
        yahooapisecret: req.body.yahooapisecret
    }
    Item.findAll({
        "attributes": ["yahoo_id"]
    }).then(function (items) {
        if (items.length > 0) {
            items = items.map(function (ele) {
                return ele["yahoo_id"];
            });
            var offLineAll = Promise.all(items.map(function (ele) {
                return productOffline(yahooKey, {
                    productId: ele,
                    shopeeItemId: 'shopeeItemId'
                });
            }));
            offLineAll.then(function (res) {
                var delAll = Promise.all(items.map(function (ele) {
                    return delItem(yahooKey, {
                        productId: ele,
                        shopeeItemId: 'shopeeItemId'
                    });
                }));
                delAll.then(function (res) {
                    Item.destroy({
                        where: {}
                    });
                    res.send({
                        "amount": items.length
                    });
                }).catch(function(err){
                    res.send({
                        "err":err
                    });
                });
            }).catch(function(err){
                res.send({
                    "err":err
                });
            });
        } else {
            res.send({
                "amount":0
            });
        }
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