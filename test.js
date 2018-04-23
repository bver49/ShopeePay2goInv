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

getAllItems(key).then(function(items){
    for(var i in items) {
        for (var j in items[i]){
            console.log(items[i][j]);
        }
    }
});

var data = {
    "SaleType":"Normal",
    "ProductName":"測試",
    "SalePrice":200,
    "MallCategoryId": [
        enums.category.mancloth
    ],
    "ShortDescription":"ShortDescription",
    "LongDescription":"LongDescription",
    "PayTypeId": enums.paytype.atm,
    "ShippingId": enums.shiptype.mail,
    "SpecTypeDimension":"1",
    "SpecDimension1":"顏色尺寸",
    "SpecDimension1Description":"黑L"
}

addItem(data).then(function(res){
    console.log(res);
}).catch(function(err){
    console.log(err);
});