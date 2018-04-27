var Promise = require("bluebird");
var request = require('request');
var config = require('./config');
var sync = require('./script/syncShopeeToYahoo');
var syncShopeeToYahoo = sync.syncShopeeToYahoo;
var syncShopeeToYahooTest = sync.syncShopeeToYahooTest;

var key = {
    shopeeshopid: config.shopee.shopid,
    shopeepartnerid: config.shopee.partnerid,
    shopeesecret: config.shopee.apisecret
}

syncShopeeToYahoo().then(function(res){
    console.log(res);
}).catch(function(err){
    console.log(err);
});