var request = require('request');
var crypto = require('crypto');
var config = require('../config');
var yahooAPIkey = config.yahoo.apikey;
var yahooAPISecret = config.yahoo.apisecret;

function callAPI(url, data){
    return new Promise(function(resolve, reject){
        var QueryString = "";
        if (typeof data !== "undefined" && Object.keys(data).length > 0) {
            for (var i in data){
                if (Array.isArray(data[i])) {
                    for (var j in data[i]) {
                        QueryString += `&${i}=${data[i][j]}`;
                    }
                } else {
                    QueryString += `&${i}=${data[i]}`;
                }
            }
        }
        var ts = Math.floor(new Date().getTime() / 1000);
        var RequestContent = `ApiKey=${yahooAPIkey}&TimeStamp=${ts}&Format=json${QueryString}`;
        var Signature = crypto.createHmac('sha1', yahooAPISecret).update(RequestContent).digest('hex');
        url = encodeURI(url + "?" + RequestContent + "&Signature=" + Signature);
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: url
        }, function (e, r, b) {
            var res = JSON.parse(b).Response;
            if (!res.ErrorList) {
                resolve(res);
            } else {
                reject(res.ErrorList.Error);
            }
        });
    });
}

function addItem(data){
    return new Promise(function(resolve,reject){
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitVerifyMain";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function(err){
            reject(err);
        });
    });
}

module.exports = {
    "callAPI": callAPI,
    "addItem": addItem
}