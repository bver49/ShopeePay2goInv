var Promise = require("bluebird");
var request = require('request');
var config = require('./config');
var shopee = require('./helper/shopee');
var yahoo = require('./helper/yahoo');
var productOnline = yahoo.productOnline;

var ts = Math.floor(new Date().getTime() / 1000);
var key = {
    shopeeshopid: config.shopee.shopid,
    shopeepartnerid: config.shopee.partnerid,
    shopeesecret: config.shopee.apisecret
}

shopee.getCategory({
            shopeeshopid: '',
            shopeepartnerid: '',
            shopeesecret: ''
        }
).then(function(res){
    console.log(res);
});