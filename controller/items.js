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
    var key = {
        shopeesecret: req.body.shopeesecret,
        shopeeshopid: req.body.shopeeshopid,
        shopeepartnerid: req.body.shopeepartnerid,
    }
    Item.findAll({
        "where": {
            "on_yahoo": {
                [Op.eq]: 1
            }
        },
        "attributes": ["shopee_id"]
    }).then(function(items) {
        items = items.map(function(ele){
            return ele.shopee_id.toString();
        });
        var itemsMap = {};
        for (var i in items){
            itemsMap[items[i]] = true;
        }
        getAllItems(key).then(function(categories){
            var allItems = [];
            var allItemsId = [];
            var needUploadItems = [];
            var needDelItems;

            for (var i in categories) {
                for (var j in categories[i].items) {
                    if (allItemsId.indexOf(categories[i].items[j].item_id) == -1) {
                        allItemsId.push(categories[i].items[j].item_id);
                        allItems.push(categories[i].items[j]);
                    }
                }
            }
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
    var orderData = JSON.parse(req.body.orderData);
    orderData["priceRate"] = req.body.priceRate;
    addItem(orderData).then(function(result){
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
    var item = JSON.parse(req.body.item);
    productOnline(item).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send({
            "err":err
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