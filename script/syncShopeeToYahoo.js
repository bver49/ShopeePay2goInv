var Promise = require('bluebird');
var Op = require('sequelize').Op;
var Item = require('../model/Item');
var config = require('../config');
var enums = require('../enum');
var shopee = require('../helper/shopee');
var yahoo = require('../helper/yahoo');
var addItem = yahoo.addItem;
var addItemTest = yahoo.addItemTest;
var getAllItems = shopee.getAllItems;

var key = {
    shopeeshopid: config.shopee.shopid,
    shopeepartnerid: config.shopee.partnerid,
    shopeesecret: config.shopee.apisecret
}

function syncShopeeToYahoo() {
    return new Promise(function(resolve, reject){
        Item.findAll({
            where: {
                on_yahoo: {
                    [Op.eq]: 1
                }
            },
            attributes: ["shopee_id"]
        }).then(function(items) {
            items = items.map(function(item){
                return item.shopee_id;
            });
            getAllItems(key).then(function (categories) {
                var allItems = [];
                for (var i in categories) {
                    for (var j in categories[i].items) {
                        allItems.push(categories[i].items[j]);
                    }
                }
                console.log("Total " + allItems.length + " shopee items");
                var needUploadItems = [];
                for (var k in allItems) {
                    if (items.indexOf(allItems[k].item_id.toString()) == -1) {
                        needUploadItems.push(allItems[k]);
                    }
                }
                console.log("Total " + needUploadItems.length + " need to upload");
                if (needUploadItems.length > 0) {
                    var uploadAllItems = [];
                    for (var l in needUploadItems){
                        uploadAllItems.push(addItem(needUploadItems[l]));
                    }
                    return Promise.all(uploadAllItems);
                } else {
                    return Promise.resolve(0);
                }
            }).then(function (res) {
                if (res!==0) {
                    var success = 0;
                    var fail = 0;
                    var failUploadImg = 0;
                    for (var i in res) {
                        if (res[i]["@Status"] == "Success" || res[i]["Action"] == "uploadImage") {
                            success++;
                            if (res[i]["Action"] == "uploadImage") failUploadImg++;
                        } else {
                            fail++;
                        }
                    }
                    console.log(res);
                    console.log("Success " + success + " items");
                    console.log("Fail " + fail + " items");
                    console.log("Fail Upload Image " + failUploadImg + " items");
                    console.log("Update DB");
                    var updateToDB = [];
                    for (var j in res) {
                        if (res[i]["@Status"] == "Success") {
                            updateToDB.push(Item.create({
                                "shopee_id": res[j].shopeeItemId,
                                "on_yahoo": 1,
                                "yahoo_id": (res[j].productId) ? res[j].productId : "fortest"
                            }));
                        }
                    }
                    return Promise.all(updateToDB);
                } else {
                    return Promise.resolve(0);
                }
            }).then(function(res){
                console.log("All Done!");
                resolve("Done");
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    });
}

function syncShopeeToYahooTest() {
    return new Promise(function(resolve, reject){
        Item.findAll({
            where: {
                on_yahoo: {
                    [Op.eq]: 1
                }
            },
            attributes: ["shopee_id"]
        }).then(function(items) {
            items = items.map(function(item){
                return item.shopee_id;
            });
            getAllItems(key).then(function (categories) {
                var allItems = [];
                for (var i in categories) {
                    for (var j in categories[i].items) {
                        allItems.push(categories[i].items[j]);
                    }
                }
                console.log("Total " + allItems.length + " shopee items");
                var needUploadItems = [];
                for (var k in allItems) {
                    if (items.indexOf(allItems[k].item_id.toString()) == -1) {
                        needUploadItems.push(allItems[k]);
                    }
                }
                console.log("Total " + needUploadItems.length + " need to upload");
                if (needUploadItems.length > 0) {
                    var uploadAllItems = [];
                    for (var l in needUploadItems){
                        uploadAllItems.push(addItemTest(needUploadItems[l]));
                    }
                    return Promise.all(uploadAllItems);
                } else {
                    return Promise.resolve(0);
                }
            }).then(function (res) {
                if (res!==0) {
                    var success = 0;
                    var fail = 0;
                    var failUploadImg = 0;
                    for (var i in res) {
                        if (res[i]["@Status"] == "Success" || res[i]["Action"] == "uploadImage") {
                            success++;
                            if (res[i]["Action"] == "uploadImage") failUploadImg++;
                        } else {
                            fail++;
                        }
                    }
                    console.log(res);
                    console.log("Success " + success + " items");
                    console.log("Fail " + fail + " items");
                    console.log("Fail Upload Image " + failUploadImg + " items");
                    console.log("Update DB");
                    var updateToDB = [];
                    for (var j in res) {
                        if (res[i]["@Status"] == "Success") {
                            updateToDB.push(Item.create({
                                "shopee_id": res[j].shopeeItemId,
                                "on_yahoo": 1,
                                "yahoo_id": (res[j].productId) ? res[j].productId : "fortest"
                            }));
                        }
                    }
                    return Promise.all(updateToDB);
                } else {
                    return Promise.resolve(0);
                }
            }).then(function(res){
                console.log("All Done!");
                resolve("Done");
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    });
}

module.exports = {
    "syncShopeeToYahoo": syncShopeeToYahoo,
    "syncShopeeToYahooTest": syncShopeeToYahooTest
}