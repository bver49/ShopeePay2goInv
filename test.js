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

getAllItems(key).then(function (category) {
    var uploadAllItems = Promise.all(category[0].items.map(function(item){
        return addItem(item);
    }));
    return uploadAllItems;
}).then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});