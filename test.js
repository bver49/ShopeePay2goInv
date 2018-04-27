var Promise = require("bluebird");
var request = require('request');
var crypto = require('crypto');
var config = require('./config');
var enums = require('./enum');
var shopee = require('./helper/shopee');
var yahoo = require('./helper/yahoo');
var addItem = yahoo.addItem;
var getAllItems = shopee.getAllItems;

var key = {
    shopeeshopid: config.shopee.shopid,
    shopeepartnerid: config.shopee.partnerid,
    shopeesecret: config.shopee.apisecret
}

getAllItems(key).then(function (categories) {
    var allItems = [];
    for (var i in categories) {
        for (var j in categories[i].items) {
            allItems.push(categories[i].items[j]);
        }
    }
    console.log("Total " + allItems.length + " shopee items");
    var uploadAllItems = Promise.all(allItems.map(function(item){
        return addItem(item);
    }));
    return uploadAllItems;
}).then(function (res) {
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
    console.log("Total " + res.length + " items");
    console.log("Success " + success + " items");
    console.log("Fail " + fail + " items");
    console.log("Fail Upload Image " + failUploadImg + " items");
    console.log("All Done!");
}).catch(function (err) {
    console.log(err);
});