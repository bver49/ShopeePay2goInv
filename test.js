var Promise = require("bluebird");
var request = require('request');
var config = require('./config');
var shopee = require('./helper/shopee');
var yahoo = require('./helper/yahoo');
var callAPI = yahoo.callAPI;
var Invoice = require('./model/Invoice');
var ts = Math.floor(new Date().getTime() / 1000);
var key = {
    shopeeshopid: config.shopee.shopid,
    shopeepartnerid: config.shopee.partnerid,
    shopeesecret: config.shopee.apisecret
}
var yahooKey = {
    yahooapikey: config.yahoo.apikey,
    yahooapisecret: config.yahoo.apisecret
}
var url = 'https://tw.ews.mall.yahooapis.com/stauth/v1/StorePayment/Get';
callAPI(yahooKey,url,{}).then(function(res){
    console.log(res.PayTypeList);
});