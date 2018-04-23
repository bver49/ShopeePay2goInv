var request = require('request');
var crypto = require('crypto');
var config = require('../config');
var imageField = "ImageFile";
var yahooAPIkey = config.yahoo.apikey;
var yahooAPISecret = config.yahoo.apisecret;

function callAPI(url, data){
    return new Promise(function(resolve, reject){
        var hasImg = false;
        var formData = {};
        var QueryString = "";
        if (typeof data !== "undefined" && Object.keys(data).length > 0) {
            for (var i in data){
                if ( i != "ImageFile") {
                    if (Array.isArray(data[i])) {
                        for (var j in data[i]) {
                            QueryString += `&${i}=${data[i][j]}`;
                        }
                    } else {
                        QueryString += `&${i}=${data[i]}`;
                    }
                } else {
                    hasImg = true;
                }
            }
        }
        if (hasImg) {
            for (var i in data[imageField]) {
                var index = parseInt(i)+1;
                formData[imageField + index] = request.get(data[imageField][i]);
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
            formData: formData,
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

function submitVerifyMain(data){
    return new Promise(function(resolve,reject){
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitVerifyMain";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function(err){
            reject(err);
        });
    });
}

function submitMain(data) {
    return new Promise(function (resolve, reject) {
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v2/Product/SubmitMain";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function uploadImage(data) {
    return new Promise(function (resolve, reject) {
        var url = "https://tw.ews.mall.yahooapis.com/stauth/v1/Product/UploadImage";
        callAPI(url, data).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function addItem(data) {
    return new Promise(function (resolve, reject) {
        submitVerifyMain(data).then(function(res) {
            resolve(res);
            return submitMain(data);
        }).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    });
}

module.exports = {
    "callAPI": callAPI,
    "addItem": addItem,
    "uploadImage": uploadImage
}