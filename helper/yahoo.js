var request = require('request');
var crypto = require('crypto');
var yahooAPIkey = "";
var yahooAPISecret = "";

var ts = Math.floor(new Date().getTime() / 1000);
var QueryString = "&Format=json";
var RequestContent = "ApiKey=" + yahooAPIkey + "&TimeStamp=" + ts + QueryString;
var Signature = crypto.createHmac('sha1', yahooAPISecret).update(RequestContent).digest('hex');

request({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    url: "https://tw.ews.mall.yahooapis.com/stauth/v1/StoreCategory/Get?" + RequestContent + "&Signature=" + Signature
}, function (e, r, b) {
    console.log(b);
});