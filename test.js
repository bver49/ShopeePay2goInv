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
    var uploadAllItems = Promise.all(allItems.map(function(item){
        return addItem(item);
    }));
    return uploadAllItems;
}).then(function (res) {
    console.log(res);
    console.log("All Done");
}).catch(function (err) {
    console.log(err);
});