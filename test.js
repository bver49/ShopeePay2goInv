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
    for (var j in categories[0].items) {
        allItems.push(categories[0].items[j]);
    }
    var uploadAllItems = Promise.all(allItems.map(function(item){
        return addItem(item);
    }));
    return uploadAllItems;
}).then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});